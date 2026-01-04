// ==UserScript==
// @name         HIFINI 音乐磁场 增强
// @namespace    https://github.com/ewigl/hifini-enhanced
// @version      0.5.5
// @description  一键自动回帖，汇总网盘链接，自动填充网盘提取码。
// @author       Licht
// @license      MIT
// @homepage     https://github.com/ewigl/hifini-enhanced
// @match        http*://*.hifini.com/thread-*.htm
// @match        http*://*.hifihi.com/thread-*.htm
// @match        http*://*.hifiki.com/thread-*.htm
// @match        http*://*.hifini.xyz/thread-*.htm
// @match        http*://*.hifini.com.cn/thread-*.htm
// @match        http*://*.hifiti.com/thread-*.htm
// @match        http*://*.lanzn.com/*
// @include      /^https?:\/\/([a-z0-9-]+\.)*lanzou[a-z]\.com\/.*/
// @match        http*://*.pan.quark.cn/s/*
// @icon         https://www.hifiti.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/502411/HIFINI%20%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502411/HIFINI%20%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // 常量
    const constants = {
        ASIDE_CLASS: 'aside',

        QUICK_REPLY_BUTTON_ID: 'he_quick_reply_button',
        QUICK_REPLY_FORM_ID: 'quick_reply_form',
        QUICK_REPLY_INPUT_ID: 'message',
        QUICK_REPLY_SUBMIT_ID: 'submit',
        VIP_QUICK_GET_BUTTON_ID: 'he_vip_quick_get_button',

        NON_REPLY_CLASS: 'alert-warning',
        REPLIED_CLASS: 'alert-success',

        BUTTONS_PANEL_ID: 'he_buttons_panel',
        DOWNLOAD_LINKS_PANEL_ID: 'he_download_links_panel',

        BAIDU_HOST: 'pan.baidu.com',
        LANZN_HOST: 'lanzn.com',
        LANZOU_HOSTS: 'abcdefghijklmnopqrstuvwxyz'.split('').map((char) => `lanzou${char}.com`),
        QUARK_HOST: 'pan.quark.cn',
        XUNLEI_HOST: 'pan.xunlei.com',

        URL_PARAMS_PWD: 'pwd',
        LANZOU_PWD_INPUT_SELECTOR: '#pwd',
        LANZN_PWD_SUB_SELECTOR: '.passwddiv-btn',
        LANZOUE_PWD_SUB_SELECTOR: '#sub',

        USER_LOGIN_URL: '/user-login.htm',
    }

    const NET_DISK_TYPES = [
        { host: constants.BAIDU_HOST, name: '百度' },
        { host: constants.LANZN_HOST, name: '蓝奏' },
        { host: constants.QUARK_HOST, name: '夸克' },
        { host: constants.XUNLEI_HOST, name: '迅雷' },
        ...constants.LANZOU_HOSTS.map((host) => ({ host, name: '蓝奏' })),
    ]

    // 随机回复项目
    const RANDOM_REPLIES = [
        // 敷衍
        '666',
        'Good',
        'Nice',
        'Thanks',
        '给力',
        '谢谢',
        '谢谢分享',
        '谢谢大佬',
        '感谢',
        '感谢分享',
        '感谢大佬',
        // 词语
        '谢君雅赠。',
        '品味卓然！',
        '已入珍藏。',
        '听觉盛宴！',
        '感君慷慨。',
        '知音难觅！',
        '如获至宝。',
        // 短句
        '楼主品味绝佳，感谢分享。',
        '这正是我想要的，太感谢了！',
        '分享的都是精品，楼主费心了。',
        '耳朵怀孕了，谢谢楼主！',
        '果断收藏，多谢款待。',
        '大佬一出手，就知有没有！谢了！',
        '您的分享，是我的宝藏。',
        '感谢投喂，精神食粮！',
    ]

    // 工具
    const utils = {
        getValue(name) {
            return GM_getValue(name)
        },
        setValue(name, value) {
            GM_setValue(name, value)
        },
        // 顺便封装一下 log 吧，加个前缀。。。
        logger(...msg) {
            const prefix = '[HIFINI Enhanced]'
            console.log(prefix, ...msg)
        },
        // 获取随机回复
        getRandomReply() {
            return RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)]
        },
        // 根据页面是否有 alert-success 类元素判断当前帖是否已回复（或为 VIP）
        isReplied() {
            return $(`.${constants.REPLIED_CLASS}`).length > 0
        },
        isAutoVIPGetCode() {
            return utils.getValue('autoVIPGetCode')
        },
        getNetDiskTypeString(url) {
            const diskTypeslength = NET_DISK_TYPES.length

            for (let i = 0; i < diskTypeslength; i++) {
                if (url.includes(NET_DISK_TYPES[i].host)) {
                    return NET_DISK_TYPES[i].name
                }
            }

            return '未知'
        },
        isInLanzouSite() {
            return constants.LANZOU_HOSTS.some((host) => location.host.includes(host))
        },
        isInQuarkSite() {
            return location.host.includes(constants.QUARK_HOST)
        },
        getLanzouSubButton() {
            // 确定蓝奏网盘的提交按钮，为什么蓝奏你要做两个不同的页面。(╯‵□′)╯︵┻━┻
            return $(constants.LANZN_PWD_SUB_SELECTOR)[0] || $(constants.LANZOUE_PWD_SUB_SELECTOR)[0]
        },
        simulateInput(element, text) {
            element.focus()
            element.value = ''
            element.setRangeText(text)
            element.dispatchEvent(new Event('input', { bubbles: true }))
            element.dispatchEvent(new Event('change', { bubbles: true }))
        },
        simulateInputWithInterval(element, text, delay = 200, clickElement) {
            element.focus()
            element.value = ''

            let index = 0
            const chars = text.split('')

            const interval = setInterval(() => {
                if (index >= chars.length) {
                    // 输入完成，触发 change 事件并清除 interval
                    const changeEvent = new Event('change', { bubbles: true, cancelable: true })
                    element.dispatchEvent(changeEvent)
                    clearInterval(interval)

                    if (clickElement) {
                        // 如果有点击元素，则模拟点击
                        clickElement.click()
                    }
                    return
                }

                // 插入单个字符
                const char = chars[index]
                element.setRangeText(char, element.selectionStart, element.selectionEnd, 'end')

                // 触发 input 事件
                const inputEvent = new Event('input', { bubbles: true, cancelable: true })
                element.dispatchEvent(inputEvent)

                index++
            }, delay)
        },
        // 提取 alert-success 中内容，包含所有链接、提取码。
        extractUrlOrCode(innerText) {
            // 匹配链接或（及）提取码（及）密码
            const combinedRegex = /(https?:\/\/[^\s]+)|提取码:\s*([a-zA-Z0-9]+)|密码:\s*([a-zA-Z0-9]+)/g

            const results = []
            let match

            while ((match = combinedRegex.exec(innerText)) !== null) {
                // 链接（match[1]）
                if (match[1]) {
                    results.push({
                        type: 'url',
                        link: match[1],
                    })
                }
                // 提取码（match[2]）
                if (match[2] || match[3]) {
                    utils.logger('提取码匹配到:', match[2] || match[3])
                    results.push({
                        type: constants.URL_PARAMS_PWD,
                        pwd: match[2] || match[3],
                    })
                }
            }

            if (results.length === 0) {
                // 如果没有匹配到链接或"提取码"文本，则返回原始文本
                return [
                    {
                        type: constants.URL_PARAMS_PWD,
                        pwd: innerText
                            .replace('提取码', '')
                            .replace('****** 点击免费获取 ******', ' - ')
                            .replace(':', '')
                            .replace('：', '')
                            .trim(),
                    },
                ]
            }

            return results
        },
        getDrivesReady() {
            // 获取页面内所有网盘链接（百度、蓝奏、夸克）, 以及所有隐藏内容（alert-success）。
            // 逻辑基础：所有的提取码必须在隐藏内容（绿条）内。
            const baseSelectors = [
                `a[href*="${constants.BAIDU_HOST}"]`,
                `a[href*="${constants.LANZN_HOST}"]`,
                `a[href*="${constants.QUARK_HOST}"]`,
                `a[href*="${constants.XUNLEI_HOST}"]`,
                `.${constants.REPLIED_CLASS}`,
            ]
            const lanzouSelectors = constants.LANZOU_HOSTS.map((host) => `a[href*="${host}"]`)
            const allSelectors = baseSelectors.concat(lanzouSelectors).join(',')

            // 虽然叫 hiddenElements，但实际上是所有的网盘链接 + 回复可见内容。
            let hiddenElements = $(allSelectors).toArray()

            let formattedDrives = []

            // 遍历所有相关元素，提取其中的链接和提取码。
            hiddenElements.forEach((element) => {
                if ($(element).hasClass(constants.REPLIED_CLASS)) {
                    // alert-success 元素，格式化其中内容。
                    let parsedResult = utils.extractUrlOrCode(element.innerText)
                    parsedResult.forEach((item) => {
                        if (item.type === 'url') {
                            // 链接，直接 push 到 formattedDrives 中。
                            formattedDrives.push({
                                link: item.link,
                                type: utils.getNetDiskTypeString(item.link),
                                pwd: item.pwd,
                            })
                        } else if (item.type === constants.URL_PARAMS_PWD) {
                            // 提取码，更新 formattedDrives 中的上一条数据，赋值 pwd。
                            formattedDrives[formattedDrives.length - 1].pwd = item.pwd
                        }
                    })
                } else {
                    // 链接，直接 push 到 formattedDrives 中。
                    if (formattedDrives.some((item) => item.link === element.href)) {
                        // 去重
                        return
                    } else {
                        formattedDrives.push({
                            link: element.href,
                            type: utils.getNetDiskTypeString(element.href),
                        })
                    }
                }
            })

            // 将提取码和链接拼接在一起。
            return formattedDrives.map((item) => {
                return {
                    ...item,
                    link: item.pwd ? item.link.split('?')[0].replace('#', '') + '?pwd=' + item.pwd : item.link,
                }
            })
        },
        // VIP 提取码获取
        getVIPPanCode(id, panCode) {
            return new Promise((resolve, reject) => {
                let formData = new FormData()
                $(`#${id}`)[0].innerText = 'loading...'
                formData.append('pan_code', panCode)
                $.ajax({
                    url: xn.url('v_pan_code_anti'),
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (res) {
                        try {
                            const json = JSON.parse(res)

                            let p_code_span = document.createElement('span')
                            p_code_span.innerHTML = json.message

                            let pButton = document.getElementById(id)
                            pButton.parentNode.replaceChild(p_code_span, pButton)

                            resolve({ id, code: json.message }) // 返回提取码
                        } catch (e) {
                            utils.logger('处理响应出错: ', e)
                            reject(e)
                        }
                    },
                    error: function (err) {
                        utils.logger('AJAX error for', id, err)
                        reject(err)
                    },
                })
            })
        },
    }

    const operation = {
        // 快速回复当前帖
        quickReply() {
            const replyInputDom = $(`#${constants.QUICK_REPLY_INPUT_ID}`)
            const submitButtonDom = $(`#${constants.QUICK_REPLY_SUBMIT_ID}`)

            if (replyInputDom.length) {
                replyInputDom.focus()
                replyInputDom.val(utils.getRandomReply())

                // 模拟点击提交按钮
                submitButtonDom.click()

                //   直接触发提交动作
                //   $("#quick_reply_form").submit();
            } else {
                utils.logger('需要登录。')
                window.location.href = constants.USER_LOGIN_URL
            }

            // 可选， Ajax 方式
        },
        // VIP 一键获取所有提取码
        getVIPPass() {
            const regex = /formData\.append\('pan_code',\s*'([^']+)'\)/g
            const matches = Array.from(document.body.innerHTML.matchAll(regex))

            let dPanCode, lPanCode

            if (matches.length > 0) {
                dPanCode = matches[0][1]
                if (matches.length > 1) {
                    lPanCode = matches[1][1]
                }
            }

            // utils.logger('dPanCode:', dPanCode)
            // utils.logger('lPanCode:', lPanCode)

            // “度盘”按钮
            const dpButton = $(`#dp_code`)
            // “兰盘”按钮
            const lpButton = $(`#lp_code`)

            const promises = []
            if (dpButton.length && dPanCode) {
                promises.push(utils.getVIPPanCode('dp_code', dPanCode))
            }
            if (lpButton.length && lPanCode) {
                promises.push(utils.getVIPPanCode('lp_code', lPanCode))
            }

            // 等待所有请求完成
            Promise.all(promises)
                .then((results) => {
                    utils.logger('All pan codes retrieved:', results)
                    // 更新网盘链接面板
                    initAction.addNetDiskLinksPanel()
                })
                .catch((error) => {
                    utils.logger('Error in getVIPPass:', error)
                })
        },
    }

    const initAction = {
        initDefaultConfig() {
            utils.getValue('autoVIPGetCode') === undefined && utils.setValue('autoVIPGetCode', false)
        },
        addStyles() {
            let buttonTop = '16px'
            let linkTop = '202px'

            if (location.host.includes('hifini.com.cn') || location.host.includes('hifihi.com')) {
                buttonTop = '220px'
                linkTop = '406px'
            }

            // 自定义样式
            const styleCSS = `
                #${constants.BUTTONS_PANEL_ID} {
                    position: sticky;
                    top: ${buttonTop};
                }

                #${constants.DOWNLOAD_LINKS_PANEL_ID} {
                    position: sticky;
                    top: ${linkTop};
                }

                .he_custom_switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 18px;
                }

                .he_custom_switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .he_custom_slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                }

                .he_custom_slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 1px;
                    bottom: 1px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                }

                input:checked + .he_custom_slider {
                    background-color: #2196F3;
                }

                input:focus + .he_custom_slider {
                    box-shadow: 0 0 1px #2196F3;
                }

                input:checked + .he_custom_slider:before {
                    -webkit-transform: translateX(22px);
                    -ms-transform: translateX(22px);
                    transform: translateX(22px);
                }
            `

            // 应用自定义样式
            GM_addStyle(styleCSS)
        },
        addEnhancedButtons() {
            // “度盘”按钮
            const dpButton = $(`#dp_code`)
            // “兰盘”按钮
            const lpButton = $(`#lp_code`)

            const buttons = []

            if (dpButton.length || lpButton.length) {
                // VIP 是否开启自动获取按钮
                buttons.push(`
                    <label class="he_custom_switch" title="不推荐开启">
                        <input type="checkbox" id="autoVIPGetCode" ${utils.getValue('autoVIPGetCode') ? 'checked' : ''}>
                        <span class="he_custom_slider"></span>
                    </label>

                    <ul class="small break-all">
                        <li class="line-height-2" title="不推荐开启">
                            进入帖子自动获取提取码
                        </li>
                    </ul>
                    `)

                $(document).on('change', `#autoVIPGetCode`, function () {
                    const isChecked = $(this).is(':checked')
                    utils.setValue('autoVIPGetCode', isChecked)
                    if (isChecked) {
                        utils.logger('VIP 进入帖子自动获取提取码已开启。')
                    } else {
                        utils.logger('VIP 进入帖子自动获取提取码已关闭。')
                    }
                })

                // VIP 一键获取提取码按钮
                buttons.push(`
                    <a id="${constants.VIP_QUICK_GET_BUTTON_ID}"
                        class="btn btn-light btn-block" 
                        style="color:red;"
                    >
                        [VIP] 免费获取
                    </a>`)

                $(document).on('click', `#${constants.VIP_QUICK_GET_BUTTON_ID}`, operation.getVIPPass)
            }

            buttons.push(`
                <a id="${constants.QUICK_REPLY_BUTTON_ID}" class="btn btn-light btn-block">
                    自动回复
                </a>`)

            $(document).on('click', `#${constants.QUICK_REPLY_BUTTON_ID}`, operation.quickReply)

            const buttonsPanelDom = `
            <div id="${constants.BUTTONS_PANEL_ID}" class="card">
                <div class="m-3 text-center">
                    ${buttons.join('\n')}
                </div>
            </div>`

            $(`.${constants.ASIDE_CLASS}`).append(buttonsPanelDom)
        },
        addNetDiskLinksPanel() {
            let existPanel = $(`#${constants.DOWNLOAD_LINKS_PANEL_ID}`)
            if (existPanel.length) {
                existPanel.remove()
            }

            let paneItems = utils.getDrivesReady()

            utils.logger('已提取的网盘链接: ', paneItems)

            let linksDom = ''

            paneItems.forEach((item) => {
                linksDom += `
                <a class="btn btn-light btn-block" href="${item.link}" target="_blank">
                    ${item.type} / ${item.pwd || '-'}
                </a>`
            })

            const downloadPanelDom = `
            <div id="${constants.DOWNLOAD_LINKS_PANEL_ID}" class="card">
                <div class="m-3 text-center">
                    ${linksDom}
                </div>
            </div>
            `

            $(`.${constants.ASIDE_CLASS}`).append(downloadPanelDom)
        },
        autoFillLanzouPwd() {
            const urlParams = new URLSearchParams(window.location.search)

            if (urlParams.has(constants.URL_PARAMS_PWD)) {
                let pwd = urlParams.get(constants.URL_PARAMS_PWD)

                utils.simulateInputWithInterval($(constants.LANZOU_PWD_INPUT_SELECTOR)[0], pwd, 200, utils.getLanzouSubButton())
            }
        },
        // 夸克网盘提取码填充，异步更新页面。
        autoFillQuarkPwd() {
            const urlParams = new URLSearchParams(window.location.search)

            if (urlParams.has(constants.URL_PARAMS_PWD)) {
                let pwd = urlParams.get(constants.URL_PARAMS_PWD)

                // 利用 observer，等待 ice-container 加载完成。
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        utils.logger('MutationObserver 触发: ', mutation)
                        if (mutation.type === 'childList') {
                            const inputElement = document.querySelector('input[placeholder="请输入提取码，不区分大小写"]')
                            if (inputElement) {
                                // utils.simulateInput(inputElement, pwd)
                                utils.simulateInputWithInterval(inputElement, pwd)
                                utils.logger('提取码已填充: ', pwd)
                                observer.disconnect()
                            }
                        }
                    })
                })
                const config = { childList: true, subtree: true }
                const targetNode = document.querySelector('#ice-container')
                observer.observe(targetNode, config)
            }
        },
    }

    // 程序入口
    const main = {
        init() {
            initAction.initDefaultConfig()

            if (utils.isInLanzouSite()) {
                initAction.autoFillLanzouPwd()
            } else if (utils.isInQuarkSite()) {
                initAction.autoFillQuarkPwd()
            } else {
                if (utils.isAutoVIPGetCode()) {
                    operation.getVIPPass()
                }
                initAction.addStyles()
                initAction.addEnhancedButtons()
                utils.isReplied() && initAction.addNetDiskLinksPanel()

                utils.logger('初始化完成。')
            }
        },
    }

    main.init()
})()
