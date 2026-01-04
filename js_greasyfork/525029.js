// ==UserScript==
// @name         自动全屏，首先必须阅读描述中的使用方式，可在github留言反馈或者自行增加视频平台，理论上所有视频网页都使用
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  给家里人用的自动全屏，但是浏览器安全策略无法在油猴脚本自动全屏，只能手动键入F全屏，所以需要搭配python，实现自动按下F，python脚本链接：github.com/zsanjin-p/listen-to-f   运行python脚本，然后安装本油猴JS脚本，访问视频链接后，加载10秒后自动全屏，如果没有，可能是网页加载过慢了，可在github留言反馈或者自行增加视频平台，理论上所有视频网页都使用
// @author       zsanjin
// @match        https://xiaoxintv.cc/index.php/vod/play/id/*
// @license      BSD-2-Clause
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525029/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%EF%BC%8C%E9%A6%96%E5%85%88%E5%BF%85%E9%A1%BB%E9%98%85%E8%AF%BB%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F%EF%BC%8C%E5%8F%AF%E5%9C%A8github%E7%95%99%E8%A8%80%E5%8F%8D%E9%A6%88%E6%88%96%E8%80%85%E8%87%AA%E8%A1%8C%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0%EF%BC%8C%E7%90%86%E8%AE%BA%E4%B8%8A%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E9%83%BD%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525029/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%EF%BC%8C%E9%A6%96%E5%85%88%E5%BF%85%E9%A1%BB%E9%98%85%E8%AF%BB%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F%EF%BC%8C%E5%8F%AF%E5%9C%A8github%E7%95%99%E8%A8%80%E5%8F%8D%E9%A6%88%E6%88%96%E8%80%85%E8%87%AA%E8%A1%8C%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0%EF%BC%8C%E7%90%86%E8%AE%BA%E4%B8%8A%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E9%83%BD%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 添加请求计数器
    let requestCount = 0;
    const MAX_REQUESTS = 1;

    // 音量调节步长
    const VOLUME_STEP = 0.1;
    // 快进/后退时间(秒)
    const SEEK_TIME = 30;
 
    function log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[Fullscreen Script ${timestamp}]`;
        switch(type) {
            case 'error':
                console.error(prefix, message);
                break;
            case 'warn':
                console.warn(prefix, message);
                break;
            default:
                console.log(prefix, message);
        }
    }
 
    function createEnhancedButton() {
        const button = document.createElement('button');
        button.id = 'easy-fullscreen-button';
        button.innerHTML = '📺 点击这里/或按F全屏播放，按空格播放/暂停，退出按Esc<br>↑↓:音量加减 ←→:后退/快进30秒 []:上一集/下一集';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            padding: 15px 25px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            text-align: center;
            line-height: 1.5;
        `;
 
        button.onmouseover = () => button.style.background = '#45a049';
        button.onmouseout = () => button.style.background = '#4CAF50';
        
        button.onclick = () => handleFullscreenAction();
 
        document.body.appendChild(button);
    }
 
    async function sendFKeySignal() {
        if (requestCount >= MAX_REQUESTS) {
            log(`已达到最大请求次数限制 (${MAX_REQUESTS}次)`, 'warn');
            return null;
        }
 
        log(`准备发送F键信号 (第 ${requestCount + 1}/${MAX_REQUESTS} 次)`);
        
        try {
            const response = await fetch('http://localhost:2716/trigger-f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    action: 'press_f',
                    timestamp: new Date().toISOString()
                })
            });
 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
 
            requestCount++;
            const data = await response.json();
            log(`服务器响应成功: ${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            log(`发送F键信号失败: ${error.message}`, 'error');
            requestCount++;
            return null;
        }
    }
 
    function simulateFKeyPress() {
        log('模拟按下F键');
        const events = ['keydown', 'keypress', 'keyup'];
        events.forEach(eventType => {
            const event = new KeyboardEvent(eventType, {
                key: 'f',
                code: 'KeyF',
                keyCode: 70,
                which: 70,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        });
    }
 
    function handlePlayPause() {
        log('处理播放/暂停');
        const iframes = Array.from(document.querySelectorAll('iframe'))
            .filter(iframe => iframe.src.includes('player'));
 
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const videoElement = iframeDoc.querySelector('.yzmplayer-video');
                
                if (videoElement) {
                    if (videoElement.paused) {
                        videoElement.play();
                        log('视频开始播放');
                    } else {
                        videoElement.pause();
                        log('视频已暂停');
                    }
                    return true;
                }
            } catch (e) {
                log(`播放/暂停操作失败: ${e}`, 'error');
            }
        }
        return false;
    }

    function handleVolumeChange(direction) {
        log(`调整音量: ${direction}`);
        const iframes = Array.from(document.querySelectorAll('iframe'))
            .filter(iframe => iframe.src.includes('player'));

        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const videoElement = iframeDoc.querySelector('.yzmplayer-video');
                
                if (videoElement) {
                    let newVolume;
                    if (direction === 'up') {
                        newVolume = Math.min(1, videoElement.volume + VOLUME_STEP);
                    } else {
                        newVolume = Math.max(0, videoElement.volume - VOLUME_STEP);
                    }
                    
                    videoElement.volume = newVolume;
                    log(`音量调整为: ${Math.round(newVolume * 100)}%`);
                    
                    // 显示音量变化的视觉反馈
                    showFeedback(`音量: ${Math.round(newVolume * 100)}%`);
                    return true;
                }
            } catch (e) {
                log(`音量调整失败: ${e}`, 'error');
            }
        }
        return false;
    }

    function handleSeek(direction) {
        log(`视频${direction === 'backward' ? '后退' : '快进'} ${SEEK_TIME} 秒`);
        const iframes = Array.from(document.querySelectorAll('iframe'))
            .filter(iframe => iframe.src.includes('player'));

        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const videoElement = iframeDoc.querySelector('.yzmplayer-video');
                
                if (videoElement) {
                    const currentTime = videoElement.currentTime;
                    let newTime;
                    
                    if (direction === 'backward') {
                        newTime = Math.max(0, currentTime - SEEK_TIME);
                    } else {
                        newTime = Math.min(videoElement.duration, currentTime + SEEK_TIME);
                    }
                    
                    videoElement.currentTime = newTime;
                    log(`跳转到: ${Math.round(newTime)}秒`);
                    
                    // 显示跳转的视觉反馈
                    showFeedback(`${direction === 'backward' ? '⏪ 后退' : '⏩ 快进'} ${SEEK_TIME}秒`);
                    return true;
                }
            } catch (e) {
                log(`跳转操作失败: ${e}`, 'error');
            }
        }
        return false;
    }

    function handleEpisodeChange(direction) {
        log(`切换${direction === 'prev' ? '上一' : '下一'}集`);
        
        try {
            // 查找选集列表中当前激活的集数
            const activeEpisode = document.querySelector('.anthology-list-play .anthology-item.active');
            if (!activeEpisode) {
                log('未找到当前激活的集数', 'warn');
                showFeedback(`未找到${direction === 'prev' ? '上一' : '下一'}集`);
                return false;
            }
            
            let targetEpisode;
            if (direction === 'prev') {
                targetEpisode = activeEpisode.previousElementSibling;
                if (!targetEpisode || !targetEpisode.classList.contains('anthology-item')) {
                    log('已经是第一集了', 'warn');
                    showFeedback('已经是第一集了');
                    return false;
                }
            } else {
                targetEpisode = activeEpisode.nextElementSibling;
                if (!targetEpisode || !targetEpisode.classList.contains('anthology-item')) {
                    log('已经是最后一集了', 'warn');
                    showFeedback('已经是最后一集了');
                    return false;
                }
            }
            
            // 获取目标集数的链接并点击
            const link = targetEpisode.querySelector('a');
            if (link) {
                log(`切换到${direction === 'prev' ? '上一' : '下一'}集: ${link.textContent}`);
                link.click();
                showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                return true;
            }
        } catch (e) {
            log(`切换集数失败: ${e}`, 'error');
        }
        
        // 尝试寻找页面上的上一集/下一集按钮（完全重写的精确查找方法）
        try {
            // 调试功能：在控制台输出所有包含目标文本的链接
            function debugLinks(searchText) {
                log(`调试: 搜索包含"${searchText}"的链接`);
                const allLinks = document.querySelectorAll('a');
                let found = 0;
                
                for (let i = 0; i < allLinks.length; i++) {
                    const link = allLinks[i];
                    if (link.innerText.includes(searchText)) {
                        found++;
                        log(`找到第${found}个链接: ${link.outerHTML}`);
                        // 显示链接的父元素及其上下文
                        let parent = link.parentElement;
                        if (parent) {
                            log(`父元素: ${parent.tagName}, 类名: ${parent.className}`);
                        }
                    }
                }
                log(`总共找到${found}个包含"${searchText}"的链接`);
                return found > 0;
            }
            
            // 目标文本
            const targetText = direction === 'prev' ? '上集' : '下集';
            
            // 尝试方法1: 通过innerText直接匹配
            log(`尝试方法1: 查找innerText包含"${targetText}"的链接`);
            let allLinks = document.querySelectorAll('a');
            let targetLink = null;
            
            // 首先输出调试信息
            const debugFound = debugLinks(targetText);
            
            // 采用更精确的方法查找链接
            for (let i = 0; i < allLinks.length; i++) {
                const link = allLinks[i];
                // 1. 检查链接本身的innerText
                if (link.innerText.includes(targetText)) {
                    log(`通过innerText找到目标链接: ${link.outerHTML}`);
                    targetLink = link;
                    break;
                }
            }
            
            // 如果找到了目标链接，点击它
            if (targetLink) {
                log(`点击${direction === 'prev' ? '上集' : '下集'}链接`);
                targetLink.click();
                showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                return true;
            }
            
            // 尝试方法2: 如果方法1失败，尝试直接定位到li>a结构
            log(`尝试方法2: 查找li>a结构中包含"${targetText}"的链接`);
            const liElements = document.querySelectorAll('li');
            
            for (let i = 0; i < liElements.length; i++) {
                const li = liElements[i];
                const links = li.querySelectorAll('a');
                
                for (let j = 0; j < links.length; j++) {
                    const link = links[j];
                    if (link.innerText.includes(targetText) || 
                        link.textContent.includes(targetText)) {
                        log(`通过li>a结构找到目标链接: ${link.outerHTML}`);
                        link.click();
                        showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                        return true;
                    }
                }
            }
            
            // 尝试方法3: 使用XPath直接定位包含文本的链接
            log(`尝试方法3: 使用XPath查找包含"${targetText}"的链接`);
            const xpathExpression = `//a[contains(text(), '${targetText}')] | //a[.//text()[contains(., '${targetText}')]]`;
            const xpathResult = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            
            if (xpathResult.snapshotLength > 0) {
                const link = xpathResult.snapshotItem(0);
                log(`通过XPath找到目标链接: ${link.outerHTML}`);
                link.click();
                showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                return true;
            }
            
            // 尝试方法4: 如果上述方法都失败，可能是链接在iframe中
            log(`尝试方法4: 检查iframe中的导航链接`);
            const iframes = document.querySelectorAll('iframe');
            
            for (let i = 0; i < iframes.length; i++) {
                try {
                    const iframe = iframes[i];
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // 在iframe中查找链接
                    const iframeLinks = iframeDoc.querySelectorAll('a');
                    for (let j = 0; j < iframeLinks.length; j++) {
                        const link = iframeLinks[j];
                        if (link.innerText.includes(targetText) || 
                            link.textContent.includes(targetText)) {
                            log(`在iframe中找到目标链接: ${link.outerHTML}`);
                            link.click();
                            showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                            return true;
                        }
                    }
                    
                    // 使用XPath在iframe中查找
                    const iframeXpathResult = iframeDoc.evaluate(xpathExpression, iframeDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (iframeXpathResult.snapshotLength > 0) {
                        const link = iframeXpathResult.snapshotItem(0);
                        log(`通过iframe中的XPath找到目标链接: ${link.outerHTML}`);
                        link.click();
                        showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                        return true;
                    }
                } catch (e) {
                    log(`访问iframe内容失败: ${e}`, 'error');
                }
            }
            
            // 如果所有方法都失败，尝试使用更通用的选择器
            log('尝试方法5: 使用通用的导航选择器');
            const commonSelectors = direction === 'prev' ? [
                '.prev', '.prev-btn', '.prev-episode', '.prev-link',
                '[title*="上一"]', '[title*="上集"]', '[aria-label*="上一"]'
            ] : [
                '.next', '.next-btn', '.next-episode', '.next-link',
                '[title*="下一"]', '[title*="下集"]', '[aria-label*="下一"]'
            ];
            
            for (const selector of commonSelectors) {
                const button = document.querySelector(selector);
                if (button) {
                    log(`通过通用选择器 ${selector} 找到导航按钮`);
                    button.click();
                    showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                    return true;
                }
            }
            
            // 最后的尝试：遍历所有元素，检查其onclick属性或href属性是否包含相关字符串
            log('尝试方法6: 遍历所有可能的交互元素');
            const allInteractiveElements = document.querySelectorAll('a, button, [onclick]');
            const urlKeywords = direction === 'prev' ? ['prev', 'previous', 'before'] : ['next', 'after'];
            
            for (const element of allInteractiveElements) {
                // 检查onclick属性
                const onclickAttr = element.getAttribute('onclick');
                if (onclickAttr && urlKeywords.some(keyword => onclickAttr.includes(keyword))) {
                    log(`找到带有相关onclick属性的元素: ${element.outerHTML}`);
                    element.click();
                    showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                    return true;
                }
                
                // 检查href属性
                const hrefAttr = element.getAttribute('href');
                if (hrefAttr && (
                    urlKeywords.some(keyword => hrefAttr.includes(keyword)) ||
                    (direction === 'prev' && /\/(\d+)\.html$/.test(hrefAttr) && 
                     parseInt(hrefAttr.match(/\/(\d+)\.html$/)[1]) < parseInt(window.location.href.match(/\/(\d+)\.html$/)?.[1] || '0')) ||
                    (direction === 'next' && /\/(\d+)\.html$/.test(hrefAttr) && 
                     parseInt(hrefAttr.match(/\/(\d+)\.html$/)[1]) > parseInt(window.location.href.match(/\/(\d+)\.html$/)?.[1] || '0'))
                )) {
                    log(`找到带有相关href属性的元素: ${element.outerHTML}`);
                    element.click();
                    showFeedback(`正在加载${direction === 'prev' ? '上一' : '下一'}集...`);
                    return true;
                }
            }
            
            log(`未能找到${direction === 'prev' ? '上集' : '下集'}链接`, 'warn');
            showFeedback(`未找到${direction === 'prev' ? '上一' : '下一'}集`);
            return false;
        } catch (e) {
            log(`使用上一集/下一集按钮失败: ${e}`, 'error');
            return false;
        }
        
        showFeedback(`未找到${direction === 'prev' ? '上一' : '下一'}集`);
        return false;
    }

    function showFeedback(message) {
        // 创建或获取反馈元素
        let feedback = document.getElementById('video-control-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'video-control-feedback';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-size: 20px;
                z-index: 9999999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(feedback);
        }
        
        // 显示反馈信息
        feedback.textContent = message;
        feedback.style.opacity = '1';
        
        // 2秒后隐藏
        clearTimeout(feedback.timeout);
        feedback.timeout = setTimeout(() => {
            feedback.style.opacity = '0';
        }, 2000);
    }
 
    async function tryFullscreen() {
        log('尝试进入全屏模式');
        const iframes = Array.from(document.querySelectorAll('iframe'))
            .filter(iframe => iframe.src.includes('player'));
 
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const videoElement = iframeDoc.querySelector('.yzmplayer-video');
                const fullscreenButton = iframeDoc.querySelector('.yzmplayer-full-icon');
 
                if (videoElement && fullscreenButton) {
                    log('找到视频元素和全屏按钮');
                    
                    // 点击全屏按钮
                    fullscreenButton.click();
                    
                    // 等待更长时间让视频播放器的全屏逻辑完成
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // 检查是否已经进入全屏模式
                    const isFullscreen = document.fullscreenElement || 
                                       document.webkitFullscreenElement || 
                                       document.mozFullScreenElement || 
                                       document.msFullscreenElement;
                    
                    // 只有在没有任何元素处于全屏状态时才尝试请求文档全屏
                    if (!isFullscreen) {
                        log('视频全屏失败，尝试文档全屏');
                        try {
                            if (videoElement.requestFullscreen) {
                                await videoElement.requestFullscreen();
                            } else if (videoElement.webkitRequestFullscreen) {
                                await videoElement.webkitRequestFullscreen();
                            } else if (videoElement.mozRequestFullScreen) {
                                await videoElement.mozRequestFullScreen();
                            } else if (videoElement.msRequestFullscreen) {
                                await videoElement.msRequestFullscreen();
                            }
                        } catch (err) {
                            log(`视频元素全屏失败，尝试文档全屏: ${err.message}`, 'warn');
                            // 最后才尝试文档全屏
                            try {
                                await document.documentElement.requestFullscreen();
                            } catch (docErr) {
                                log(`文档全屏也失败了: ${docErr.message}`, 'error');
                            }
                        }
                    }
                    return true;
                }
            } catch (e) {
                log(`在iframe中请求全屏失败: ${e}`, 'error');
            }
        }
        return false;
    }
 
    async function handleFullscreenAction() {
        if (requestCount >= MAX_REQUESTS) {
            log('已达到最大请求次数限制，不再执行全屏操作', 'warn');
            return;
        }
 
        const button = document.getElementById('easy-fullscreen-button');
        if (button) {
            button.innerHTML = '⌛ 正在设置全屏...';
        }
        
        try {
            await sendFKeySignal();
            simulateFKeyPress();
            await tryFullscreen();
            
            if (button) {
                setTimeout(() => {
                    button.style.opacity = '0';
                    setTimeout(() => button.style.display = 'none', 1000);
                }, 3000);
            }
        } catch (error) {
            log(`全屏设置失败: ${error.message}`, 'error');
            if (button) {
                button.innerHTML = '❌ 全屏设置失败，请重试';
                button.style.background = '#ff4444';
                
                setTimeout(() => {
                    button.innerHTML = '📺 点击这里/或按F全屏播放，按空格播放/暂停，退出按Esc<br>↑↓:音量加减 ←→:后退/快进30秒 []:上一集/下一集';
                    button.style.background = '#4CAF50';
                }, 3000);
            }
        }
    }
 
    function init() {
        log('脚本初始化开始');
        try {
            createEnhancedButton();
            
            // 监听键盘事件
            document.addEventListener('keydown', (e) => {
                // 防止事件冒泡和默认行为
                if (e.key === ' ' || e.key === 'f' || e.key === 'F' || 
                    e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                    e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                    e.key === '[' || e.key === ']') {
                    e.preventDefault();
                }
                
                if (e.key === 'f' || e.key === 'F') {
                    log('检测到F键被按下');
                    handleFullscreenAction();
                } else if (e.key === ' ') {
                    log('检测到空格键被按下');
                    handlePlayPause();
                } else if (e.key === 'ArrowUp') {
                    log('检测到上方向键被按下');
                    handleVolumeChange('up');
                } else if (e.key === 'ArrowDown') {
                    log('检测到下方向键被按下');
                    handleVolumeChange('down');
                } else if (e.key === 'ArrowLeft') {
                    log('检测到左方向键被按下');
                    handleSeek('backward');
                } else if (e.key === 'ArrowRight') {
                    log('检测到右方向键被按下');
                    handleSeek('forward');
                } else if (e.key === '[') {
                    log('检测到[键被按下');
                    handleEpisodeChange('prev');
                } else if (e.key === ']') {
                    log('检测到]键被按下');
                    handleEpisodeChange('next');
                }
            });
            
            // 8秒后自动触发全屏
            setTimeout(() => {
                log('8秒时间到，自动触发全屏');
                handleFullscreenAction();
            }, 8000);
            
            log('脚本初始化完成');
        } catch (error) {
            log(`初始化失败: ${error.message}`, 'error');
        }
    }
 
    // 等待页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();