// ==UserScript==
// @name         lc-to-markdown-txt-html
// @author       wuxin0011
// @version      0.0.5
// @namespace    https://github.com/wuxin0011/tampermonkey-script/tree/main/lc-to-markdown-txt-html
// @description  力扣题目描述,讨论发布内容复制 复制为 markdown、txt、html 等格式
// @icon         data:image/png;base64,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
// @match        https://leetcode.cn/circle/discuss/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.cn/contest/weekly-contest-*/problems/*
// @match        https://leetcode.cn/contest/biweekly-contest-*/problems/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @require      https://unpkg.com/turndown@7.2.0/dist/turndown.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499334/lc-to-markdown-txt-html.user.js
// @updateURL https://update.greasyfork.org/scripts/499334/lc-to-markdown-txt-html.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const url = window.location.href
    const HTML_CONVERT = '__HTML_CONVERT__'
    const TXT_CONVERT = '__TXT_CONVERT__'
    const MARKDOWN_CONVERT = '__MARKDOWN_CONVERT__'
    const markdownURL = "https://stonehank.github.io/html-to-md/"



    const isDiscuss = () => url.indexOf('https://leetcode.cn/circle/discuss') != -1
    const isProblem = () => url.indexOf('https://leetcode.cn/problems') != -1
    const isContest = () => url.indexOf('https://leetcode.cn/contest/weekly-contest') != -1 || url.indexOf('https://leetcode.cn/contest/biweekly-contest') != -1

    const isAutoKey = '__auto_pluging_key' + (isDiscuss() ? '__Discuss__' : isProblem() ? '__Problem__' : '__Contest__')
    // 
    const use = (key) => typeof GM_getValue(key) == 'undefined' ? true : GM_getValue(key)
    const isUseMarkDown = () => use(MARKDOWN_CONVERT)
    const isUseTxt = () => use(TXT_CONVERT)
    const isUseHTML = () => use(HTML_CONVERT)
    let timerId = null
    let loadOk = false
    console.log('markdown', isUseMarkDown(), 'txt', isUseTxt(), 'html', isUseHTML())
    const isUsePlugins = () => isUseHTML() || isUseMarkDown() || isUseTxt()
    const isUsePluginInThis = () => use(isAutoKey) // 当前页面是否使用该插件
    let isFindButtonContainer = false



    const SUPPORT_TYPE = {
        'md': 'md',
        'txt': 'txt',
        'html': 'html'
    }



    const buttons = []
    const targetClass = 'my-button-target'
    const BUTTON_ID = `#${targetClass}`
    for (let i = 0; i < 3; i++) {
        const temp = document.createElement('button')
        temp.style.marginLeft = '10px'
        const type = i == 0 ? SUPPORT_TYPE['md'] : i == 1 ? SUPPORT_TYPE['txt'] : SUPPORT_TYPE['html']
        temp.title = `复制为 ${type == 'md' ? 'markdown' : type} 格式`
        temp.id = `${BUTTON_ID}-${type}`
        temp.textContent = type
        temp.copytype = type
        buttons.push(temp)
    }


    const updateDisplay = (element, u) => element && element instanceof HTMLElement ? (element.style.display = u ? 'inline-block' : 'none') : ''
    // markdown button
    const markdownButton = buttons[0]
    updateDisplay(markdownButton, isUseMarkDown())

    // txt button
    const txtButton = buttons[1]
    updateDisplay(txtButton, isUseTxt())

    // html button
    const htmlButton = buttons[2]
    updateDisplay(htmlButton, isUseHTML())

    function getHtmlContent(className) {
        const htmlContent = document.querySelector(className)
        return htmlContent ? htmlContent.innerHTML : ''
    }

    function updateElementShow(element) {
        if (!element instanceof HTMLElement) {
            return
        }
        element.style.display = element.style.display == 'none' ? 'inline-block' : 'none'
    }


    function runQuestionActionsContainer() {
        const className = '[class$=MarkdownContent]';
        const questionActionsContainer = document.querySelector('[class*=QuestionActionsContainer]')
        markdownButton.className = 'e11vgnte0 css-yf7o-BaseButtonComponent-ThemedButton ery7n2v0'
        htmlButton.className = 'e11vgnte0 css-yf7o-BaseButtonComponent-ThemedButton ery7n2v0'
        txtButton.className = 'e11vgnte0 css-yf7o-BaseButtonComponent-ThemedButton ery7n2v0'
        const htmlContent = getHtmlContent(className)
        runCopy(questionActionsContainer, markdownButton, htmlContent, SUPPORT_TYPE['md'])
        runCopy(questionActionsContainer, htmlButton, htmlContent, SUPPORT_TYPE['html'])
    }



    const toMarkdown = (htmlContent) => {
        try {
            var turndownService = new TurndownService()
            var markdown = turndownService.turndown(htmlContent)
            return markdown
        } catch (e) {
            if (confirm('markdown转换失败,跳转到网站转换?')) {
                if (window?.navigator?.clipboard?.writeText) {
                    window.navigator.clipboard.writeText(htmlContent).then(() => {
                        window.open(markdownURL, '_blank')
                    }, () => {

                    })
                }
            } else {
                console.error('convert markdown error default convert txt !', e)
                const d = document.createElement('div')
                d.innerHTML = content
                const txt = handlerText(d.textContent)
                return txt
            }
        }
    }

    function runProblems() {
        console.log('~~~ run problem ~~~~', url)
        let buttonClassName = 'relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-difficulty-easy dark:text-difficulty-easy'
        let className = "[data-track-load=description_content]"
        let titleClassName = '#qd-content [class*=text-title]'
        const isFlexMode = !!document.querySelector('#__next')
        console.log('is find', !!document.querySelector(className))
        if (isContest()) {
            console.log('isFlexMode', isFlexMode)
            if (isFlexMode) {
                // className = ".FN9Jv"
                titleClassName = '#qd-content a'
            } else {
                className = '#base_content .question-content'
                titleClassName = '#base_content .question-title  h3'
            }

        } else {

            // LCP 老版本的 容器 https://leetcode.cn/problems/1ybDKD/description/
            if (!document.querySelector(className)) {
                className = ".FN9Jv"
                titleClassName = '#qd-content a'
            }
        }

        let title = document.querySelector(titleClassName)
        const titleTxt = title?.textContent
        title = title ? '<h2>' + (title?.textContent) + '</h2>' : ''
        let u = window.location.href
        let orginUrl = title ? `<a href="${u}">` + (u) + '</a>' : ''
        let htmlContent = title + getHtmlContent(className) + orginUrl
        let container = null

        // https://leetcode.cn/contest/weekly-contest-312
        if (isContest() && !isFlexMode) {
            if (!isFindButtonContainer) {
                const c = document.querySelector('.contest-question-info')
                if (c && !c.querySelector('#lx-markdown-plugins')) {
                    const str = `<li class="list-group-item lx-markdown-plugins" id="lx-markdown-plugins">
                    <span>插件</span>
                  </li>`
                    c.innerHTML = c.innerHTML + str
                    container = c.querySelector('.lx-markdown-plugins')
                    if (container) {
                        isFindButtonContainer = true
                    }
                }

            }

        } else {
            container = document.querySelector(className)
            if (container) {
                container = container.previousElementSibling
            }
        }
        if (!container) {
            console.warn('找不到 容器！', url)
            urlChangeLoadOk = false
            return;
        }
        markdownButton.className = buttonClassName
        txtButton.className = buttonClassName
        htmlButton.className = buttonClassName
        runCopy(container, txtButton, htmlContent, SUPPORT_TYPE['txt'], titleTxt)
        runCopy(container, htmlButton, htmlContent, SUPPORT_TYPE['html'])
        runCopy(container, markdownButton, htmlContent, SUPPORT_TYPE['md'])
        urlChangeLoadOk = true
    }


    function copy(w, element) {
        if (!element || !(element instanceof HTMLElement)) {
            return
        }

        try {
            let clipboard = element?.clipboardObject
            if (clipboard) {
                //console.log('clipboard destroy')
                clipboard.destroy();
            }
            clipboard = new ClipboardJS(element, {
                text: function () {
                    return w;
                }
            })
            // console.log('update txt >>>>>>>>>')
            element.clipboardObject = clipboard
            clipboard.on('success', function (e) {
                updateButtonStatus(element)
            })
            clipboard.on('error', function (e) {
                updateButtonStatus(element, 'copy error!')
            })


        } catch (error) {
            // 如果 clipboardjs 引入失败 使用原生的
            // use  navigator writeText
            element.onclick = () => {
                navigator.clipboard.writeText(w).then(() => {
                    //updateButtonStatus(element)
                }, () => {
                    updateButtonStatus(element, 'copy error!')
                })
            }

        }

    }




    function runCopy(container, ele, htmlContent, type = SUPPORT_TYPE['md'], title = '') {

        if (!ele || !container || !htmlContent || !type) {
            return
        }
        if (!(container instanceof HTMLElement && ele instanceof HTMLElement)) {
            return;
        }
        // append 
        if (!document.getElementById(ele.id)) {
            ele.originClass = ele.className
            container.appendChild(ele)
        } else {
            // 加载完成 初始化
            loadOk = true
            // initConmand()
            updateButtonStatus(ele, ele.copytype, '', 1000)
            clearTimeId()
        }

        if (type == SUPPORT_TYPE['md']) {
            const markdown = toMarkdown(htmlContent)
            copy(markdown, ele)
        } else if (type == SUPPORT_TYPE['txt']) {
            const d = document.createElement('div')
            d.innerHTML = htmlContent
            const txt = handlerText(d.textContent, title)
            copy(txt, ele)
        } else if (type == SUPPORT_TYPE['html']) {
            // html
            copy(htmlContent, ele)
        } else {
            console.warn('no support format ' + type)
        }

    }

    const handlerText = (str, title = '') => {
        if (!str) return str
        // 移出空白字符
        str = str.replaceAll(' ', '')
        str = str.replaceAll('​​​​​​​​​​​​​​​​​​​​​​​', '')
        str = str.replaceAll('&nbsp;', '')
        str = str.replace('。', "。\n")
        str = str.replace(/\n{2,}/g, "\n")
        str = str.replace('http', '\n\nhttp')
        str = str.replaceAll('示例', "\n示例")
        str = str.replace('231', '2^31')
        str = str.replace(/10(?!0)(\d+)/g, '10^$1')
        str = str.replace('提示', "\n提示")
        if (title != '') {
            str = str.replace(title, title + "\n\n")
        }
        return str
    }


    const updateButtonStatus = (element, newText = 'copied!', newClass = '', timeout = 1000) => {
        if (!element) {
            return;
        }
        // console.log('update button status', element, newText)
        element.textContent = newText
        if (newClass) {
            element.className = newClass
        }
        setTimeout(() => {
            element.textContent = element.copytype
            element.className = element.originClass
        }, timeout)
    }

    const cookieInfo = document.cookie


    const initConmand = () => {
        try {
            const isAutoPluginCommand = GM_registerMenuCommand(`当前页面 ${isUsePluginInThis() ? '关闭' : '启用'} 插件 `, () => {
                GM_setValue(isAutoKey, !isUsePluginInThis())
                window.location.reload()
            }, { title: `当前页面 ${isUseHTML() ? '关闭' : '启用'} 插件 ` })



            if (!isUsePluginInThis()) {
                return;
            }

            // const message = (u, type) => u ? '关闭' : '启用' + (type == 'md' ? ' markdown ' : ` ${type} `)

            const html_to_markdown = GM_registerMenuCommand(`${isUseMarkDown() ? '关闭' : '启用'} markdown `, () => {
                GM_setValue(MARKDOWN_CONVERT, !isUseMarkDown())
                updateElementShow(markdownButton)
            }, { title: `点击 ${isUseMarkDown() ? '关闭' : '启用'} markdown ` })


            const html_to_txt = GM_registerMenuCommand(`${isUseTxt() ? '关闭' : '启用'} txt `, () => {
                GM_setValue(TXT_CONVERT, !isUseTxt())
                updateElementShow(txtButton)
            }, { title: `点击 ${isUseTxt() ? '关闭' : '启用'} txt ` })

            const html_to_html = GM_registerMenuCommand(`${isUseHTML() ? '关闭' : '启用'} html  `, () => {
                GM_setValue(HTML_CONVERT, !isUseHTML())
                updateElementShow(htmlButton)
            }, { title: `点击 ${isUseHTML() ? '关闭' : '启用'} html ` })



            const html_to_markdown_web = GM_registerMenuCommand('html转换markdown网站', () => {
                window.open(markdownURL, '_blank')
            }, { title: '如果格式转换有问题，请复制为 html 然后用这个网站转换' })



            // const copy_local_cookie = GM_registerMenuCommand('复制 cookie ', () => {
            //     prompt('复制Cookie, Ctrl+A,Ctrl+C 😅', cookieInfo)
            // }, { title: '这个功能是本人某些地方需要，但是又不想打开浏览器控制台 。 如果不需要请忽略😅' })



        } catch (e) {
            console.log('init command error', e)
        }

    }



    let times = 0
    const MAX_CNT = 10
    const TIME_OUT = 1500
    initConmand()

    function clearTimeId() {
        if (timerId != null) {
            window.cancelIdleCallback(timerId)
            window.clearInterval(timerId)
            window.clearTimeout(timerId)
            timerId = null;
        }
    }
    let support = true
    const start = () => {
        times += 1
        if (times > MAX_CNT || !support) {
            // console.info('>>>>>>>>>>>>>>>>>>>clear<<<<<<<<<<<<<<<<<<<<<<<<<')
            clearTimeId()
            return
        }
        if (!isUsePlugins() || !isUsePluginInThis()) {
            clearTimeId()
            return;
        }
        if (loadOk) {
            console.log('load ok')
            return
        }
        timerId = setTimeout(() => {
            try {
                if (isDiscuss()) {
                    runQuestionActionsContainer()
                } else if (isProblem() || isContest()) {
                    runProblems()
                } else {
                    support = false
                }
            } catch (e) {
                console.error('install fail ', e)
            }
            if (!loadOk) {
                start()
            }
        }, TIME_OUT)

    }



    const updateUrl = () => {
        updateTimes += 1
        if (updateTimes >= 10 || urlChangeLoadOk) {
            clearTimeId()
            return;
        }
        timerId = requestIdleCallback(() => {
            if (isDiscuss()) {
                runQuestionActionsContainer()
            } else if (isProblem() || isContest()) {
                runProblems()
            }

            if (!urlChangeLoadOk) {
                updateUrl()
            }

        }, { timeout: TIME_OUT })
    }


    window.onload = () => {
        times = 0
        start()
    }

    // 监听地址改变
    // 重新修改描述
    let urlChangeLoadOk = false
    let updateTimes = 0
    window.addEventListener("urlchange", () => {
        updateTimes = 0
        urlChangeLoadOk = false
        updateUrl();
    })


})();