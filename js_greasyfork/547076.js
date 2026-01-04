// ==UserScript==
// @name        LINUXDO ReadBot
// @namespace   linux.do_ReadBot
// @match       https://linux.do/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     1.0.2
// @author      Jay
// @description LINUXDO ReadBot是一个LINUXDO刷取已读帖量脚本，支持latest页面自动阅读和单个帖子阅读，理论上支持所有Discourse论坛
// @description:zh-TW LINUXDO ReadBot是一個LINUXDO刷取已讀帖量腳本，支持latest頁面自動閱讀和單個帖子閱讀，理論上支持所有Discourse論壇
// @description:en LINUXDO ReadBot is a script for LINUXDO to boost the number of read posts. It supports automatic reading from latest page and individual topics, theoretically supports all Discourse forums.
// @downloadURL https://update.greasyfork.org/scripts/547076/LINUXDO%20ReadBot.user.js
// @updateURL https://update.greasyfork.org/scripts/547076/LINUXDO%20ReadBot.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const hasAgreed = GM_getValue("hasAgreed", false)
    if (!hasAgreed) {
        const userInput = prompt("[ LINUXDO ReadBot ]\n检测到这是你第一次使用LINUXDO ReadBoost，使用前你必须知晓：使用该第三方脚本可能会导致包括并不限于账号被限制、被封禁的潜在风险，脚本不对出现的任何风险负责，这是一个开源脚本，你可以自由审核其中的内容，如果你同意以上内容，请输入'明白'")
        if (userInput !== "明白") {
            alert("您未同意风险提示，脚本已停止运行。")
            return
        }
        GM_setValue("hasAgreed", true)
    }

    // 默认参数
    const DEFAULT_CONFIG = {
        baseDelay: 2500,
        randomDelayRange: 800,
        minReqSize: 8,
        maxReqSize: 20,
        minReadTime: 800,
        maxReadTime: 3000,
        autoStart: false,
        startFromCurrent: false,
        enableLatestMode: false,
        latestMaxTopics: 5,
        latestReadReplies: false,
        latestRequestDelay: 3000,
        latestRequestDelayRange: 2000,
        simulateBrowsing: true,
        pageStayTime: 8000,
        pageStayTimeRange: 4000,
        scrollBehavior: true,
        mouseMovement: true,
        latestModeSimulateBrowsing: false,
        latestModePageStayTime: 3000,
        latestModePageStayTimeRange: 2000
    }

    let config = { ...DEFAULT_CONFIG, ...getStoredConfig() }
    let isRunning = false
    let shouldStop = false
    let statusLabel = null
    let initTimeout = null
    let latestModeInterval = null
    let isLatestModeActive = GM_getValue("isLatestModeActive", false)
    function isTopicPage() {
        return /^https:\/\/linux\.do\/t\/[^/]+\/\d+/.test(window.location.href)
    }

    function isLatestPage() {
        return /^https:\/\/linux\.do\/latest/.test(window.location.href)
    }

    function getPageInfo() {
        if (!isTopicPage()) {
            throw new Error("不在帖子页面")
        }
        const topicID = window.location.pathname.split("/")[3]
        const repliesElement = document.querySelector("div[class=timeline-replies]")
        const csrfElement = document.querySelector("meta[name=csrf-token]")

        if (!repliesElement || !csrfElement) {
            throw new Error("无法获取页面信息，请确认在正确的帖子页面")
        }

        const repliesInfo = repliesElement.textContent.trim()
        const [currentPosition, totalReplies] = repliesInfo.split("/").map(part => parseInt(part.trim(), 10))
        const csrfToken = csrfElement.getAttribute("content")

        return { topicID, currentPosition, totalReplies, csrfToken }
    }

    function isPinnedTopic(element) {
        // 检查是否为置顶帖子的多种方法
        const checks = [
            // 检查是否有置顶图标
            () => element.querySelector('.d-icon-pin-sidebar, .d-icon-thumbtack, .pinned-icon, .topic-status .pinned, .fa-thumbtack, .icon-thumbtack'),
            // 检查CSS类名
            () => element.classList.contains('pinned') || element.classList.contains('topic-pinned') || element.classList.contains('is-pinned'),
            // 检查父元素的置顶状态
            () => element.closest('.pinned, .topic-pinned, .topic-list-item.pinned, .is-pinned'),
            // 检查数据属性
            () => element.hasAttribute('data-pinned') || element.closest('[data-pinned="true"]') || element.closest('[data-is-pinned="true"]'),
            // 检查特定的置顶标识文本
            () => {
                const text = element.textContent.toLowerCase()
                return text.includes('置顶') || text.includes('pinned') || text.includes('公告') || text.includes('公告:') || text.includes('【公告】')
            },
            // 检查置顶标签
            () => {
                const pinnedBadge = element.querySelector('.pinned-badge, .topic-badge.pinned, .badge.pinned')
                return pinnedBadge !== null
            },
            // 检查置顶状态图标
            () => {
                const statusIcons = element.querySelectorAll('.topic-status .d-icon')
                return Array.from(statusIcons).some(icon => 
                    icon.classList.contains('d-icon-pin-sidebar') || 
                    icon.classList.contains('d-icon-thumbtack') ||
                    icon.title?.toLowerCase().includes('pinned') ||
                    icon.title?.includes('置顶')
                )
            }
        ]
        
        return checks.some(check => {
            try {
                return check()
            } catch (e) {
                return false
            }
        })
    }

    function getLatestTopics() {
        if (!isLatestPage()) {
            throw new Error("不在latest页面")
        }
        
        console.log("开始查找latest页面的帖子...")
        
        // 调试信息：检查页面结构
        const debugInfo = {
            url: window.location.href,
            title: document.title,
            topicLinks: document.querySelectorAll('a.topic-title[href^="/t/"]').length,
            titleLinks: document.querySelectorAll('.topic-list a.title[href^="/t/"]').length,
            bodyLinks: document.querySelectorAll('.topic-body a[href^="/t/"]').length,
            topicListItems: document.querySelectorAll('.topic-list-item[data-topic-id]').length,
            allTopicLinks: document.querySelectorAll('a[href^="/t/"]').length,
            pinnedTopics: document.querySelectorAll('.pinned, .topic-pinned, [data-pinned="true"]').length
        }
        console.log("页面调试信息:", debugInfo)
        
        // 尝试多种选择器来找到帖子链接
        const topicLinks = document.querySelectorAll('a.topic-title[href^="/t/"], .topic-list a.title[href^="/t/"], .topic-body a[href^="/t/"]')
        const topics = []
        let skippedPinned = 0
        
        console.log(`使用选择器找到 ${topicLinks.length} 个链接`)
        
        topicLinks.forEach((link, index) => {
            const href = link.getAttribute('href')
            const text = link.textContent.trim()
            console.log(`链接 ${index + 1}:`, { href, text })
            
            // 检查是否为置顶帖子
            if (isPinnedTopic(link)) {
                console.log(`跳过置顶帖子: ${text}`)
                skippedPinned++
                return
            }
            
            const match = href.match(/\/t\/[^/]+\/(\d+)/)
            if (match) {
                const topicId = match[1]
                const title = text
                if (title && topicId) {
                    topics.push({ id: topicId, title, url: `https://linux.do${href}` })
                }
            }
        })
        
        // 如果没有找到，尝试从数据属性中获取
        if (topics.length === 0) {
            console.log("尝试从数据属性获取帖子...")
            const topicElements = document.querySelectorAll('.topic-list-item[data-topic-id]')
            topicElements.forEach((element, index) => {
                // 检查是否为置顶帖子
                if (isPinnedTopic(element)) {
                    console.log(`跳过置顶帖子元素: ${index + 1}`)
                    skippedPinned++
                    return
                }
                
                const topicId = element.getAttribute('data-topic-id')
                const titleElement = element.querySelector('.topic-title')
                const title = titleElement ? titleElement.textContent.trim() : `帖子${topicId}`
                console.log(`数据属性 ${index + 1}:`, { topicId, title })
                
                if (topicId) {
                    topics.push({ id: topicId, title, url: `https://linux.do/t/topic/${topicId}` })
                }
            })
        }
        
        // 如果还是没有找到，尝试所有包含/t/的链接
        if (topics.length === 0) {
            console.log("尝试所有包含/t/的链接...")
            const allLinks = document.querySelectorAll('a[href^="/t/"]')
            allLinks.forEach((link, index) => {
                const href = link.getAttribute('href')
                const match = href.match(/\/t\/[^/]+\/(\d+)/)
                if (match && index < 20) { // 限制数量避免过多
                    // 检查是否为置顶帖子
                    if (isPinnedTopic(link)) {
                        console.log(`跳过置顶帖子链接: ${index + 1}`)
                        skippedPinned++
                        return
                    }
                    
                    const topicId = match[1]
                    const title = link.textContent.trim() || `帖子${topicId}`
                    topics.push({ id: topicId, title, url: `https://linux.do${href}` })
                }
            })
        }
        
        console.log(`找到${topics.length}个普通帖子，跳过${skippedPinned}个置顶帖子`, topics)
        return topics.slice(0, config.latestMaxTopics)
    }

    // 显示设置界面 (前置声明)
    function showSettingsUI() {
        // 实际实现在文件后面
        console.log("Settings UI not ready yet")
    }

    // 创建状态标签
    function createStatusLabel() {
        // 移除已存在的状态标签
        const existingLabel = document.getElementById("readBoostStatusLabel")
        if (existingLabel) {
            existingLabel.remove()
        }

        const headerButtons = document.querySelector(".header-buttons")
        if (!headerButtons) return null

        const labelSpan = document.createElement("span")
        labelSpan.id = "readBoostStatusLabel"
        labelSpan.style.cssText = `
            margin-left: 10px;
            margin-right: 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background: var(--primary-low);
            color: var(--primary);
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
        `
        labelSpan.textContent = "ReadBot"+" ⚙️"
        labelSpan.addEventListener("click", showSettingsUI)

        headerButtons.appendChild(labelSpan)
        return labelSpan
    }

    // 增强的状态显示函数，支持动态倒计时
    function updateEnhancedStatus(text, type = "info", duration = null) {
        if (!statusLabel) return

        const colors = {
            info: "var(--primary)",
            success: "#2e8b57",
            warning: "#ff8c00",
            error: "#dc3545",
            running: "#007bff"
        }

        statusLabel.style.color = colors[type] || colors.info
        
        if (duration && duration > 0) {
            // 显示倒计时状态
            let remainingTime = Math.ceil(duration / 1000)
            const originalText = text
            
            const countdownInterval = setInterval(() => {
                if (shouldStop || remainingTime <= 0) {
                    clearInterval(countdownInterval)
                    return
                }
                
                statusLabel.textContent = `${originalText} (${remainingTime}s) ⚙️`
                remainingTime--
            }, 1000)
            
            // 设置清理定时器
            setTimeout(() => {
                clearInterval(countdownInterval)
            }, duration)
        } else {
            statusLabel.textContent = text + " ⚙️"
        }
    }

    // 模拟浏览行为
    async function simulateBrowsingBehavior(topic) {
        // 检查是否启用模拟浏览
        const isLatestMode = isLatestPage()
        const shouldSimulate = isLatestMode ? config.latestModeSimulateBrowsing : config.simulateBrowsing
        
        if (!shouldSimulate) {
            console.log("模拟浏览功能已禁用")
            return
        }

        console.log(`开始模拟浏览帖子: ${topic.title}`)
        updateEnhancedStatus(`正在浏览: ${topic.title}`, "running")
        
        // 根据模式选择不同的停留时间配置
        const baseStayTime = isLatestMode ? config.latestModePageStayTime : config.pageStayTime
        const stayTimeRange = isLatestMode ? config.latestModePageStayTimeRange : config.pageStayTimeRange
        const stayTime = baseStayTime + Math.floor(Math.random() * stayTimeRange)
        
        console.log(`模式: ${isLatestMode ? 'Latest' : '普通'}, 将在页面停留${stayTime}ms`)
        updateEnhancedStatus(`浏览中: ${topic.title} (${Math.round(stayTime/1000)}s)`, "running", stayTime)
        
        // 模拟访问页面
        try {
            // 尝试使用iframe模式
            await simulateWithIframe(topic, stayTime)
        } catch (error) {
            console.warn(`iframe模式失败，使用简单模式: ${error.message}`)
            // 如果iframe失败，使用简单模式
            await simulateSimpleBrowsing(topic, stayTime)
        }
    }

    // 使用iframe模拟浏览
    async function simulateWithIframe(topic, stayTime) {
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 800px;
            height: 600px;
            border: none;
            opacity: 0;
            pointer-events: none;
        `
        iframe.src = topic.url
        
        document.body.appendChild(iframe)
        
        try {
            // 等待iframe加载
            await new Promise((resolve, reject) => {
                iframe.onload = resolve
                setTimeout(() => reject(new Error('iframe加载超时')), 5000)
            })
            
            console.log(`iframe已加载: ${topic.url}`)
            
            // 在iframe中模拟浏览行为
            if (iframe.contentDocument) {
                await simulateInFrame(iframe.contentDocument, stayTime)
            }
            
            // 等待指定的停留时间
            await new Promise(resolve => setTimeout(resolve, stayTime))
            
        } finally {
            // 清理iframe
            if (iframe.parentNode) {
                document.body.removeChild(iframe)
            }
        }
    }

    // 简单浏览模式（仅等待和模拟基本行为）
    async function simulateSimpleBrowsing(topic, stayTime) {
        console.log(`使用简单浏览模式: ${topic.title}`)
        
        // 模拟页面访问
        await fetch(topic.url, {
            method: 'GET',
            headers: {
                'User-Agent': navigator.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            credentials: 'include'
        })
        
        // 在当前页面模拟一些简单的行为
        await simulateSimpleActions()
        
        // 等待指定的停留时间
        await new Promise(resolve => setTimeout(resolve, stayTime))
    }

    // 模拟简单的页面行为
    async function simulateSimpleActions() {
        const actions = [
            () => {
                // 模拟鼠标移动
                const x = Math.random() * window.innerWidth
                const y = Math.random() * window.innerHeight
                const event = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                })
                document.dispatchEvent(event)
            },
            () => {
                // 模拟点击空白区域
                const x = Math.random() * window.innerWidth
                const y = Math.random() * window.innerHeight
                const event = new MouseEvent('click', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                })
                document.elementFromPoint(x, y)?.dispatchEvent(event)
            },
            () => {
                // 模拟滚动
                window.scrollBy(0, (Math.random() - 0.5) * 100)
            }
        ]
        
        // 随机执行一些动作
        for (let i = 0; i < 3 + Math.random() * 3; i++) {
            if (shouldStop) break
            const action = actions[Math.floor(Math.random() * actions.length)]
            try {
                action()
            } catch (e) {
                // 忽略错误
            }
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
        }
    }

    // 在iframe中模拟浏览行为
    async function simulateInFrame(doc, stayTime) {
        if (!doc) return
        
        const startTime = Date.now()
        const endTime = startTime + stayTime
        
        while (Date.now() < endTime && !shouldStop) {
            // 模拟滚动行为
            if (config.scrollBehavior && Math.random() > 0.7) {
                await simulateScrolling(doc)
            }
            
            // 模拟鼠标移动
            if (config.mouseMovement && Math.random() > 0.8) {
                await simulateMouseMovement(doc)
            }
            
            // 随机间隔
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))
        }
    }

    // 模拟滚动行为
    async function simulateScrolling(doc) {
        const scrollableElements = doc.querySelectorAll('body, .topic-body, .posts, .topic-post')
        if (scrollableElements.length === 0) return
        
        const element = scrollableElements[Math.floor(Math.random() * scrollableElements.length)]
        const currentScroll = element.scrollTop || 0
        const maxScroll = element.scrollHeight - element.clientHeight
        const targetScroll = Math.min(maxScroll, currentScroll + 100 + Math.random() * 200)
        
        console.log(`模拟滚动: ${currentScroll} -> ${targetScroll}`)
        
        // 平滑滚动
        const steps = 10
        const stepSize = (targetScroll - currentScroll) / steps
        
        for (let i = 0; i < steps && !shouldStop; i++) {
            element.scrollTop = currentScroll + stepSize * i
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
        }
        
        // 等待一段时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        // 随机滚动回顶部
        if (Math.random() > 0.6) {
            for (let i = steps; i >= 0 && !shouldStop; i--) {
                element.scrollTop = currentScroll + stepSize * i
                await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
            }
        }
    }

    // 模拟鼠标移动
    async function simulateMouseMovement(doc) {
        const interactiveElements = doc.querySelectorAll('a, button, .topic-body p, .topic-body span')
        if (interactiveElements.length === 0) return
        
        const element = interactiveElements[Math.floor(Math.random() * interactiveElements.length)]
        const rect = element.getBoundingClientRect()
        
        if (rect.width > 0 && rect.height > 0) {
            const x = rect.left + Math.random() * rect.width
            const y = rect.top + Math.random() * rect.height
            
            console.log(`模拟鼠标移动到: (${Math.round(x)}, ${Math.round(y)})`)
            
            // 创建鼠标移动事件
            const events = ['mouseover', 'mouseenter', 'mousemove']
            for (const eventType of events) {
                if (shouldStop) break
                const event = new MouseEvent(eventType, {
                    view: doc.defaultView,
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y
                })
                element.dispatchEvent(event)
                await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
            }
            
            // 短暂停留
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
        }
    }


    function getStoredConfig() {
        return {
            baseDelay: GM_getValue("baseDelay", DEFAULT_CONFIG.baseDelay),
            randomDelayRange: GM_getValue("randomDelayRange", DEFAULT_CONFIG.randomDelayRange),
            minReqSize: GM_getValue("minReqSize", DEFAULT_CONFIG.minReqSize),
            maxReqSize: GM_getValue("maxReqSize", DEFAULT_CONFIG.maxReqSize),
            minReadTime: GM_getValue("minReadTime", DEFAULT_CONFIG.minReadTime),
            maxReadTime: GM_getValue("maxReadTime", DEFAULT_CONFIG.maxReadTime),
            autoStart: GM_getValue("autoStart", DEFAULT_CONFIG.autoStart),
            startFromCurrent: GM_getValue("startFromCurrent", DEFAULT_CONFIG.startFromCurrent),
            enableLatestMode: GM_getValue("enableLatestMode", DEFAULT_CONFIG.enableLatestMode),
            latestMaxTopics: GM_getValue("latestMaxTopics", DEFAULT_CONFIG.latestMaxTopics),
            latestReadReplies: GM_getValue("latestReadReplies", DEFAULT_CONFIG.latestReadReplies),
            latestRequestDelay: GM_getValue("latestRequestDelay", DEFAULT_CONFIG.latestRequestDelay),
            latestRequestDelayRange: GM_getValue("latestRequestDelayRange", DEFAULT_CONFIG.latestRequestDelayRange),
            simulateBrowsing: GM_getValue("simulateBrowsing", DEFAULT_CONFIG.simulateBrowsing),
            pageStayTime: GM_getValue("pageStayTime", DEFAULT_CONFIG.pageStayTime),
            pageStayTimeRange: GM_getValue("pageStayTimeRange", DEFAULT_CONFIG.pageStayTimeRange),
            scrollBehavior: GM_getValue("scrollBehavior", DEFAULT_CONFIG.scrollBehavior),
            mouseMovement: GM_getValue("mouseMovement", DEFAULT_CONFIG.mouseMovement),
            latestModeSimulateBrowsing: GM_getValue("latestModeSimulateBrowsing", DEFAULT_CONFIG.latestModeSimulateBrowsing),
            latestModePageStayTime: GM_getValue("latestModePageStayTime", DEFAULT_CONFIG.latestModePageStayTime),
            latestModePageStayTimeRange: GM_getValue("latestModePageStayTimeRange", DEFAULT_CONFIG.latestModePageStayTimeRange)
        }
    }

    function saveConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key])
            config[key] = newConfig[key]
        })
        location.reload()
    }

    
    // 更新状态
    function updateStatus(text, type = "info") {
        if (!statusLabel) return

        const colors = {
            info: "var(--primary)",
            success: "#2e8b57",
            warning: "#ff8c00",
            error: "#dc3545",
            running: "#007bff"
        }

        statusLabel.textContent = text + " ⚙️"
        statusLabel.style.color = colors[type] || colors.info
    }

    
    function showSettingsUIImpl() {
        const settingsDiv = document.createElement("div")
        settingsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 25px;
            border-radius: 12px;
            z-index: 10000;
            background: var(--secondary);
            color: var(--primary);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--primary-low);
            min-width: 400px;
            max-width: 500px;
        `

        const autoStartChecked = config.autoStart ? "checked" : ""
        const startFromCurrentChecked = config.startFromCurrent ? "checked" : ""
        const enableLatestModeChecked = config.enableLatestMode ? "checked" : ""
        const latestReadRepliesChecked = config.latestReadReplies ? "checked" : ""
        const simulateBrowsingChecked = config.simulateBrowsing ? "checked" : ""
        const scrollBehaviorChecked = config.scrollBehavior ? "checked" : ""
        const mouseMovementChecked = config.mouseMovement ? "checked" : ""
        const latestModeSimulateBrowsingChecked = config.latestModeSimulateBrowsing ? "checked" : ""
        settingsDiv.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary); text-align: center;">ReadBot 设置</h3>
            <div style="display: grid; gap: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>基础延迟(ms):</span>
                        <input id="baseDelay" type="number" value="${config.baseDelay}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>随机延迟范围(ms):</span>
                        <input id="randomDelayRange" type="number" value="${config.randomDelayRange}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最小每次请求量:</span>
                        <input id="minReqSize" type="number" value="${config.minReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最大每次请求量:</span>
                        <input id="maxReqSize" type="number" value="${config.maxReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最小阅读时间(ms):</span>
                        <input id="minReadTime" type="number" value="${config.minReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最大阅读时间(ms):</span>
                        <input id="maxReadTime" type="number" value="${config.maxReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="border-top: 1px solid var(--primary-low); padding-top: 15px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Latest模式设置</h4>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>最大帖子数:</span>
                            <input id="latestMaxTopics" type="number" value="${config.latestMaxTopics}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>请求间隔(ms):</span>
                            <input id="latestRequestDelay" type="number" value="${config.latestRequestDelay}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>随机间隔范围(ms):</span>
                            <input id="latestRequestDelayRange" type="number" value="${config.latestRequestDelayRange}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap; margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="enableLatestMode" ${enableLatestModeChecked} style="transform: scale(1.2);">
                            <span>启用Latest模式</span>
                        </label>
                        <label style="display: none; align-items: center; gap: 8px;">
                            <input type="checkbox" id="latestReadReplies" ${latestReadRepliesChecked} style="transform: scale(1.2);">
                            <span>阅读帖子回复</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="latestModeSimulateBrowsing" ${latestModeSimulateBrowsingChecked} style="transform: scale(1.2);">
                            <span>Latest模式模拟浏览</span>
                        </label>
                    </div>
                </div>
                <div style="border-top: 1px solid var(--primary-low); padding-top: 15px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">模拟浏览设置</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>页面停留时间(ms):</span>
                            <input id="pageStayTime" type="number" value="${config.pageStayTime}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>随机停留范围(ms):</span>
                            <input id="pageStayTimeRange" type="number" value="${config.pageStayTimeRange}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap; margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="simulateBrowsing" ${simulateBrowsingChecked} style="transform: scale(1.2);">
                            <span>启用模拟浏览</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="scrollBehavior" ${scrollBehaviorChecked} style="transform: scale(1.2);">
                            <span>模拟滚动行为</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="mouseMovement" ${mouseMovementChecked} style="transform: scale(1.2);">
                            <span>模拟鼠标移动</span>
                        </label>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>Latest模式停留时间(ms):</span>
                            <input id="latestModePageStayTime" type="number" value="${config.latestModePageStayTime}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                        <label style="display: flex; flex-direction: column; gap: 5px;">
                            <span>Latest模式随机范围(ms):</span>
                            <input id="latestModePageStayTimeRange" type="number" value="${config.latestModePageStayTimeRange}"
                                   style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="advancedMode" style="transform: scale(1.2);">
                        <span>高级设置模式</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="autoStart" ${autoStartChecked} style="transform: scale(1.2);">
                        <span>自动运行</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="startFromCurrent" ${startFromCurrentChecked} style="transform: scale(1.2);">
                        <span>从当前浏览位置开始</span>
                    </label>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="saveSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #007bff; color: white; cursor: pointer;">保存设置</button>
                    <button id="resetDefaults" style="padding: 10px 20px; border: none; border-radius: 6px; background: #6c757d; color: white; cursor: pointer;">重置默认</button>
                    <button id="closeSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #dc3545; color: white; cursor: pointer;">关闭</button>
                </div>
            </div>
        `

        document.body.appendChild(settingsDiv)

        toggleAdvancedInputs(false)

        document.getElementById("advancedMode").addEventListener("change", (e) => {
            if (e.target.checked) {
                const confirmed = confirm("高级设置可能增加账号风险，确定要启用吗？")
                if (!confirmed) {
                    e.target.checked = false
                    return
                }
            }
            toggleAdvancedInputs(e.target.checked)
        })

        document.getElementById("saveSettings").addEventListener("click", () => {
            const newConfig = {
                baseDelay: parseInt(document.getElementById("baseDelay").value, 10),
                randomDelayRange: parseInt(document.getElementById("randomDelayRange").value, 10),
                minReqSize: parseInt(document.getElementById("minReqSize").value, 10),
                maxReqSize: parseInt(document.getElementById("maxReqSize").value, 10),
                minReadTime: parseInt(document.getElementById("minReadTime").value, 10),
                maxReadTime: parseInt(document.getElementById("maxReadTime").value, 10),
                autoStart: document.getElementById("autoStart").checked,
                startFromCurrent: document.getElementById("startFromCurrent").checked,
                enableLatestMode: document.getElementById("enableLatestMode").checked,
                latestMaxTopics: parseInt(document.getElementById("latestMaxTopics").value, 10),
                latestReadReplies: document.getElementById("latestReadReplies").checked,
                latestRequestDelay: parseInt(document.getElementById("latestRequestDelay").value, 10),
                latestRequestDelayRange: parseInt(document.getElementById("latestRequestDelayRange").value, 10),
                simulateBrowsing: document.getElementById("simulateBrowsing").checked,
                pageStayTime: parseInt(document.getElementById("pageStayTime").value, 10),
                pageStayTimeRange: parseInt(document.getElementById("pageStayTimeRange").value, 10),
                scrollBehavior: document.getElementById("scrollBehavior").checked,
                mouseMovement: document.getElementById("mouseMovement").checked,
                latestModeSimulateBrowsing: document.getElementById("latestModeSimulateBrowsing").checked,
                latestModePageStayTime: parseInt(document.getElementById("latestModePageStayTime").value, 10),
                latestModePageStayTimeRange: parseInt(document.getElementById("latestModePageStayTimeRange").value, 10)
            }

            saveConfig(newConfig)
            settingsDiv.remove()
            updateStatus("设置已保存", "success")

        })

        document.getElementById("resetDefaults").addEventListener("click", () => {
            if (confirm("确定要重置为默认设置吗？")) {
                saveConfig(DEFAULT_CONFIG)
                settingsDiv.remove()
                updateStatus("已重置为默认设置", "info")
            }
        })

        document.getElementById("closeSettings").addEventListener("click", () => {
            settingsDiv.remove()
        })

        function toggleAdvancedInputs(enabled) {
            const inputs = ["baseDelay", "randomDelayRange", "minReqSize", "maxReqSize", "minReadTime", "maxReadTime"]
            inputs.forEach(id => {
                const input = document.getElementById(id)
                if (input) {
                    input.disabled = !enabled
                    input.style.opacity = enabled ? "1" : "0.6"
                }
            })
        }
    }

    async function startReading() {
        if (isRunning) {
            updateStatus("脚本正在运行中...", "warning")
            return
        }

        try {
            isRunning = true
            shouldStop = false

            if (isLatestPage()) {
                if (config.enableLatestMode) {
                    updateEnhancedStatus("启动Latest模式...", "running")
                    await startLatestMode()
                } else {
                    throw new Error("Latest模式未启用，请在设置中启用")
                }
            } else if (!isLatestModeActive && isTopicPage()) {
                const pageInfo = getPageInfo()
                updateEnhancedStatus("启动Topic模式...", "running")
                await processReading(pageInfo)
            } else {
                throw new Error("请在帖子页面或latest页面使用")
            }

            updateStatus("处理完成", "success")
        } catch (error) {
            console.error("执行错误:", error)
            if (error.message === "用户停止执行") {
                updateStatus("ReadBot", "info")
            } else {
                updateStatus("执行失败: " + error.message, "error")
            }
        } finally {
            isRunning = false
        }
    }


    function stopReading() {
        shouldStop = true
        isLatestModeActive = false
        GM_setValue("isLatestModeActive", false)
        if (latestModeInterval) {
            clearInterval(latestModeInterval)
            latestModeInterval = null
        }
        if (isLatestPage()) {
            updateStatus("正在停止Latest模式...", "warning")
        } else if (isTopicPage()) {
            updateStatus("正在停止Topic模式...", "warning")
        } else {
            updateStatus("正在停止...", "warning")
        }
    }

    async function startLatestMode() {
        isLatestModeActive = true
        GM_setValue("isLatestModeActive", true)
        updateEnhancedStatus("Latest模式启动中...", "running")
        console.log("Latest模式启动，配置:", {
            maxTopics: config.latestMaxTopics,
            mode: "仅处理帖子主题（不阅读回复）",
            requestDelay: config.latestRequestDelay,
            requestDelayRange: config.latestRequestDelayRange,
            isLatestModeActive: isLatestModeActive
        })
        
        const processLatestTopics = async () => {
            if (shouldStop) {
                console.log("Latest模式收到停止信号")
                return
            }
            
            try {
                console.log("开始获取latest页面帖子...")
                const topics = getLatestTopics()
                console.log("获取到的帖子:", topics)
                
                if (topics.length === 0) {
                    updateStatus("未找到普通帖子", "warning")
                    return
                }
                
                updateStatus(`找到${topics.length}个普通帖子，开始处理帖子主题...`, "running")
                
                let processedCount = 0
                for (const topic of topics) {
                    if (shouldStop) break
                    
                    try {
                        console.log(`正在处理帖子主题: ${topic.title} (${topic.id})`)
                        updateEnhancedStatus(`开始处理: ${topic.title}`, "running")
                        
                        // Latest页面不执行阅读回复功能，只处理帖子主题
                        await processTopicOnly(topic)
                        
                        processedCount++
                        updateStatus(`已完成: ${topic.title} (${processedCount}/${topics.length})`, "success")
                        
                        if (shouldStop) break
                        
                        // 计算下一个帖子的间隔时间
                        const baseDelay = config.latestRequestDelay
                        const randomRange = config.latestRequestDelayRange
                        const delay = baseDelay + Math.floor(Math.random() * randomRange)
                        
                        console.log(`Latest模式间隔配置: 基础${baseDelay}ms + 随机${randomRange}ms = ${delay}ms`)
                        console.log(`等待${delay}ms后处理下一个帖子...`)
                        updateEnhancedStatus(`等待下个帖子 (${Math.round(delay/1000)}s)`, "info", delay)
                        
                        await new Promise(r => setTimeout(r, delay))
                    } catch (error) {
                        console.error(`处理帖子${topic.id}失败:`, error)
                        updateStatus(`处理失败: ${topic.title}`, "error")
                    }
                }
                
                if (!shouldStop) {
                    isLatestModeActive = false
                    GM_setValue("isLatestModeActive", false)
                    updateStatus("Latest模式完成", "success")
                }
                
            } catch (error) {
                console.error("Latest模式错误:", error)
                updateStatus("Latest模式错误: " + error.message, "error")
            }
        }
        
        await processLatestTopics()
        
        // 移除定时器，只在刷新页面时运行一次
        console.log("Latest模式执行完成，不再设置定时器")
    }

    async function processTopicOnly(topic) {
        console.log(`处理帖子主题: ${topic.title} (${topic.id})`)
        
        try {
            // 首先模拟浏览行为
            await simulateBrowsingBehavior(topic)
            
            const response = await fetch(topic.url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const text = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(text, 'text/html')
            
            const csrfElement = doc.querySelector("meta[name=csrf-token]")
            if (!csrfElement) {
                throw new Error("无法获取CSRF令牌")
            }
            
            const csrfToken = csrfElement.getAttribute("content")
            const topicTime = (1000 + Math.random() * 2000).toString()
            
            const params = new URLSearchParams()
            params.append('topic_time', topicTime)
            params.append('topic_id', topic.id)
            
            const timingResponse = await fetch("https://linux.do/topics/timings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-CSRF-Token": csrfToken,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: params,
                credentials: "include"
            })
            
            if (!timingResponse.ok) {
                throw new Error(`Timing请求失败: ${timingResponse.status}`)
            }
            
            console.log(`帖子主题处理完成: ${topic.title}`)
            
        } catch (error) {
            console.error(`处理帖子主题失败: ${topic.title}`, error)
            throw error
        }
    }

    async function processTopicWithReplies(topic) {
        console.log(`处理帖子及回复: ${topic.title} (${topic.id})`)
        
        try {
            // 首先模拟浏览行为
            await simulateBrowsingBehavior(topic)
            
            const response = await fetch(topic.url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const text = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(text, 'text/html')
            
            const repliesElement = doc.querySelector("div[class=timeline-replies]")
            const csrfElement = doc.querySelector("meta[name=csrf-token]")
            
            if (!repliesElement || !csrfElement) {
                throw new Error("无法获取帖子信息")
            }
            
            const repliesInfo = repliesElement.textContent.trim()
            const [currentPosition, totalReplies] = repliesInfo.split("/").map(part => parseInt(part.trim(), 10))
            const csrfToken = csrfElement.getAttribute("content")
            
            console.log(`帖子 ${topic.title} 有 ${totalReplies} 个回复`)
            
            if (totalReplies === 0) {
                await processTopicOnly(topic)
                return
            }
            
            const pageInfo = {
                topicID: topic.id,
                currentPosition: 1,
                totalReplies: totalReplies,
                csrfToken: csrfToken
            }
            
            await processReading(pageInfo)
            console.log(`帖子及回复处理完成: ${topic.title}`)
            
        } catch (error) {
            console.error(`处理帖子及回复失败: ${topic.title}`, error)
            throw error
        }
    }

    // 处理阅读逻辑
    async function processReading(pageInfo) {
        const { topicID, currentPosition, totalReplies, csrfToken } = pageInfo
        const startPosition = config.startFromCurrent ? currentPosition : 1

        console.log(`开始处理，起始位置: ${startPosition}, 总回复: ${totalReplies}`)

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        async function sendBatch(startId, endId, retryCount = 3) {
            // 停止检查
            if (shouldStop) throw new Error("用户停止执行")

            const params = new URLSearchParams()

            for (let i = startId; i <= endId; i++) {
                params.append(`timings[${i}]`, getRandomInt(config.minReadTime, config.maxReadTime).toString())
            }

            const topicTime = getRandomInt(
                config.minReadTime * (endId - startId + 1),
                config.maxReadTime * (endId - startId + 1)
            ).toString()

            params.append('topic_time', topicTime)
            params.append('topic_id', topicID)

            try {
                const response = await fetch("https://linux.do/topics/timings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-CSRF-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: params,
                    credentials: "include"
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                // 再次检查是否应该停止
                if (shouldStop) throw new Error("用户停止执行")

                const progress = Math.round((endId / totalReplies) * 100)
                updateEnhancedStatus(`阅读回复 ${startId}-${endId} (${progress}%)`, "running")

            } catch (error) {
                if (shouldStop) throw error // 如果是停止信号，直接抛出

                if (retryCount > 0) {
                    updateEnhancedStatus(`重试 ${startId}-${endId} (剩余${retryCount}次, 2s)`, "warning", 2000)
                    await new Promise(r => setTimeout(r, 2000))
                    return await sendBatch(startId, endId, retryCount - 1)
                }
                throw error
            }

            // 延迟期间也检查停止信号
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange)
            if (delay > 1000) {
                updateEnhancedStatus(`批次间等待 (${Math.round(delay/1000)}s)`, "info", delay)
            }
            for (let i = 0; i < delay; i += 100) {
                if (shouldStop) throw new Error("用户停止执行")
                await new Promise(r => setTimeout(r, Math.min(100, delay - i)))
            }
        }

        // 批量处理
        for (let i = startPosition; i <= totalReplies;) {
            if (shouldStop) break

            const batchSize = getRandomInt(config.minReqSize, config.maxReqSize)
            const startId = i
            const endId = Math.min(i + batchSize - 1, totalReplies)

            await sendBatch(startId, endId)
            i = endId + 1
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand("🚀 开始执行", startReading)
    GM_registerMenuCommand("⏹️ 停止执行", stopReading)
    GM_registerMenuCommand("⚙️ 设置", showSettingsUI)

    function init() {
        statusLabel = createStatusLabel()
        // 检查是否需要重置latest模式状态
        // 只有在手动停止或完成时才重置，页面导航时保持状态
        if (!isLatestModeActive) {
            // 强制停止之前的任务
            shouldStop = true
            if (latestModeInterval) {
                clearInterval(latestModeInterval)
                latestModeInterval = null
            }
        }

        // 等待当前任务停止后再继续
        if (isRunning) {
            setTimeout(init, 1000)
            return
        }

        // 重置状态
        isRunning = false
        shouldStop = false

        // 清除之前的超时
        if (initTimeout) {
            clearTimeout(initTimeout)
        }
        
        // 根据页面类型和当前模式使用不同的初始化逻辑
        if (isLatestModeActive && isTopicPage()) {
            // 如果是latest模式激活状态下进入topic页面，不进行topic初始化
            console.log("Latest模式激活状态下进入topic页面，跳过topic初始化")
            updateEnhancedStatus("Latest模式运行中...", "running")
            return
        } else if (isTopicPage()) {
            initTopicPage()
        } else if (isLatestPage()) {
            initLatestPage()
        }
    }

    function initTopicPage() {
        try {
            console.log("initTopicPage 调用", isLatestModeActive)
            if (isLatestModeActive) {
                // 如果是latest模式激活状态下进入topic页面，不进行topic初始化
                console.log("Latest模式激活状态下进入topic页面，跳过topic初始化")
                updateEnhancedStatus("Latest模式运行中...", "running")
                return
            }
            const pageInfo = getPageInfo()
            console.log("LINUXDO ReadBot Topic模式已加载")
            console.log(`帖子ID: ${pageInfo.topicID}, 总回复: ${pageInfo.totalReplies}`)
            updateEnhancedStatus(`Topic模式: ${pageInfo.totalReplies}回复`, "info")
            
            if (config.autoStart) {
                updateEnhancedStatus("Topic模式自动启动 (1s)", "info", 1000)
                initTimeout = setTimeout(startReading, 1000)
            }
        } catch (error) {
            console.error("Topic页面初始化失败:", error)
            // 只在非停止状态下重试
            if (!shouldStop) {
                initTimeout = setTimeout(initTopicPage, 1000)
            }
        }
    }

    function initLatestPage() {
        try {
            console.log("LINUXDO ReadBot Latest模式已加载")
            if (config.enableLatestMode) {
                updateEnhancedStatus("Latest模式已就绪", "success")
                
                if (config.autoStart) {
                    updateEnhancedStatus("Latest模式自动启动 (1s)", "info", 1000)
                    initTimeout = setTimeout(startReading, 1000)
                }
            } else {
                updateEnhancedStatus("Latest模式已禁用", "warning")
            }
        } catch (error) {
            console.error("Latest页面初始化失败:", error)
            // 只在非停止状态下重试
            if (!shouldStop) {
                initTimeout = setTimeout(initLatestPage, 1000)
            }
        }
    }
    // 监听 URL 变化
    function setupRouteListener() {
        let lastUrl = location.href
        const originalPushState = history.pushState
        history.pushState = function () {
            originalPushState.apply(history, arguments)
            if (location.href !== lastUrl) {
                lastUrl = location.href
                setTimeout(init, 500)
            }
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init()
            setupRouteListener()
        })
    } else {
        init()
        setupRouteListener()
    }
    
    // 重新定义 showSettingsUI 函数，指向实际实现
    function showSettingsUI() {
        return showSettingsUIImpl.apply(this, arguments)
    }
})()
