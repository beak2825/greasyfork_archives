// ==UserScript==
// @name         AskChatGPT
// @name:zh      问问 ChatGPT
// @namespace    https://youthlin.com/?p=1850
// @version      0.2
// @description  Ask ChatGPT
// @description:zh  划词提问 ChatGPT
// @author       Youth．霖
// @license      MIT
// @match        *://*/*
// @include      *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456327/AskChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/456327/AskChatGPT.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // https://violentmonkey.github.io/api/gm/

    // 选中内容自动弹出复制、翻译按钮，怎么实现的？js获取页面光标选中的内容
    // https://juejin.cn/post/7083680217494978597


    const ApiMapKey = 'api_map'
    const DefaultApiMap = JSON.stringify({
        "原站": {
            session_url: 'https://chat.openai.com/api/auth/session',
            token: '',
            conversation_url: 'https://chat.openai.com/backend-api/conversation',
            conversation_mode: false,
        },
        "gpt.chatapi.art": {
            session_url: '',// 暂时无需鉴权
            token: '',
            conversation_url: 'https://gpt.chatapi.art/backend-api/conversation',
            conversation_mode: true,
        }
    })

    const ready = function (fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    let selectApi // 当前 api
    let selectText = '' // 选中的文字
    let conversationID = '' // 一次会话的标记

    setTimeout(start, 1000) // 入口

    function start() {
        ready(() => {
            initHtml()
        })
    }

    class AskChatGpt extends HTMLElement {

        constructor() {// 构造方法
            super()
            this.shadow = this.attachShadow({ mode: 'closed' })
        }

        connectedCallback() {// 添加到文档时回调
            this.shadow.innerHTML = `<div class='ask-chat-gpt-wrapper'>
            <style>
            button, select {
                padding: .3em;
                margin-right: .3em;
                color: #1d1d2e;
                background-color: #f7f7fa;
                border-radius: 4px;
                cursor: pointer;
                height: 2em;
            }
            .icon {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9999;
            }
            .wrap {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                padding: 1em 1em 0;
                border: 1px solid #ccc;
                background: #eee;
                color: #000;
                box-shadow: 3px 3px 3px #ccc;
                width: 400px;
                max-width: 100%;
                z-index: 9999;
            }
            .msg {
                color: red;
            }
            ol {
                padding: 0;
                max-height: 50vh;
                overflow-y: auto;
            }
            li {
                list-style: none;
            }
            li div {
                padding: .5em;
            }
            .question {
                background: #ccc;
            }
            .question:before {}
            .answer:before {}
            textarea {
                width: 100%;
                background: transparent;
                resize: vertical; /*只能上下拉伸*/
            }
            .bar {
                cursor: grabbing; /*手型拖动*/
            }
            .ask {
                background: #3d71ff;
                color: #fff;
            }
            .right {
                float: right;
            }
            .footer {
                border-top: 1px solid #ccc;
                margin-buttom: 0;
                padding-top: 1em;
            }
            </style>
            <button class='icon'>Ask</button>
            <div class='wrap'>
                <div>
                    <p class='msg'></p>
                    <ol id='list'></ol>
                    <textarea class='q'></textarea>
                </div>
                <div class='bar'>
                    <button class='ask'>Ask</button>
                    <button class='reset'>Reset</button>
                    <button class='close right'>关闭</button>
                    <select class='api-list right'></select>
                    <p class='footer'>
                        &copy; 2022 Powered by
                        <a href='https://youthlin.com' target='_blank'>Youth．霖</a>
                        | <a href='https://youthlin.com/?p=1850' target='_blank'>About</a>
                        | <a href='https://github.com/youthlin/examples/raw/master/html/demo/tampermonkey/chatgpt.user.js' target='_blank'>Update</a>
                    </p>
                </div>
            </div>
            </div>`
            this.initApiList()
            this.setEvents()// 设置各事件处理方法
        }

        initApiList() {
            const select = this.getDom('.api-list')
            const apiMap = this.getApiMap()
            console.log(apiMap)
            if (apiMap.size == 0) {
                this.showMsg('无接口可用,请查看帮助文档')
                return
            }
            let lastSelectName = this.getLastSelectName()
            for (let key of apiMap.keys()) {
                let selected = ''
                if (lastSelectName == key) {
                    selected = 'selected'
                }
                select.insertAdjacentHTML('beforeend', `<option value="${key}" ${selected}>${key}</option>`)
            }
            const that = this
            function onSelectChange() {
                lastSelectName = select.selectedOptions[0].value
                selectApi = apiMap.get(lastSelectName)
                console.log('selectApi', selectApi)
                that.setLastSelectName(lastSelectName)
                that.reset()
            }
            onSelectChange()
            select.addEventListener('change', onSelectChange)
        }

        getApiMap() {
            let m = GM_getValue(ApiMapKey, '')
            if (m == '') {
                m = DefaultApiMap
                GM_setValue(ApiMapKey, m)// 保存到脚本数据中，可以通过脚本管理器修改
            }
            const apiMap = new Map(Object.entries(JSON.parse(m)))
            return apiMap
        }

        getDom(selector) {
            return this.shadow.querySelector(selector)
        }

        showMsg(msg) { this.getDom('.msg').innerText = msg }
        clearMsg() { this.getDom('.msg').innerText = '' }

        getLastSelectName() { return GM_getValue('selectApi', '') }
        setLastSelectName(name) { GM_setValue('selectApi', name) }

        setEvents() {
            // 选中文本弹出悬浮按钮
            this.setOnSelection()
            // 点击悬浮按钮事件
            this.getDom('.icon').addEventListener('click', this.onClickIcon.bind(this))
            // 关闭按钮
            this.getDom('.close').addEventListener('click', this.onClose.bind(this))
            // 使面板可拖动
            this.enableDrag(this.getDom('.bar'), this.getDom('.wrap'))
            // 发起查询
            this.getDom('.ask').addEventListener('click', this.onAsk.bind(this))
            // 重置会话
            this.getDom('.reset').addEventListener('click', this.reset.bind(this))
        }

        setOnSelection() {
            window.addEventListener('mouseup', e => {// 鼠标松开
                const btn = this.getDom('.icon')
                btn.style.display = 'none'// 默认不显示悬浮按钮
                try {
                    const selection = window.getSelection()
                    const text = selection.toString()
                    if (!text) { return }
                    selectText = text// 记住选中文字
                    // 显示悬浮按钮
                    btn.style.display = 'block'
                    btn.style.left = (e.x - 10) + 'px'
                    btn.style.top = e.y + 10 + 'px'
                } catch (err) {
                    console.log(`onMouseUp err=${err}`)
                }
            })
        }

        onClickIcon(e) {
            console.log(`click icon`)
            console.log(e)
            const dom = this.getDom('.wrap')
            dom.style.display = 'block'// 显示悬浮面板
            dom.style.left = e.pageX + 'px'
            dom.style.top = e.pageY + 'px'
            this.getDom('.q').value = selectText// 将之前记录的选中文本填充到文本框中
            if (conversationID == '') {
                this.getDom('.ask').click()// 发起查询
            }// 已经有会话时不自动查询选中文字
        }

        onClose(e) {
            const dom = this.getDom('.wrap')
            dom.style.display = 'none'
        }

        enableDrag(dragElement, moveElement) {
            if (!moveElement) { moveElement = dragElement }
            // https://zh.javascript.info/mouse-drag-and-drop
            dragElement.onmousedown = e => {// 在元素上按下时
                // clientX 离浏览器左边的距离
                // getBoundingClientRect 一个矩形. left=左边离视口的距离, top=顶边离视口距离
                // pageX, pageY 里文档左上角的距离

                let shiftX = e.clientX - moveElement.getBoundingClientRect().left;
                let shiftY = e.clientY - moveElement.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    // pageX - clientX + RectX:
                    // pageY - clientY + RectY:
                    moveElement.style.left = pageX - shiftX + 'px'
                    moveElement.style.top = pageY - shiftY + 'px'
                }
                function onMove(e) {
                    moveAt(e.pageX, e.pageY)
                }

                // moveAt(e.pageX, e.pageY) 不要按下时就漂移

                document.addEventListener('mousemove', onMove)

                function onUp(e) {
                    document.removeEventListener('mousemove', onMove)
                    document.removeEventListener('mouseup', onUp)
                }
                document.addEventListener('mouseup', onUp)// 任意位置松开
            }

            dragElement.ondragstart = () => false;
        }

        async onAsk(e) {
            const textarea = this.getDom('.q')
            const question = textarea.value
            if (question == '') { return }

            textarea.value = ''
            this.getDom('#list').insertAdjacentHTML('beforeend', `<li>
                <div class='question'></div>
                <div class='answer'></div>
            </li>`)
            const list = this.getDom('#list li:last-child')
            list.querySelector('.question').innerText = question
            const answer = list.querySelector('.answer')
            // answer.scrollIntoView() // 会移动整个页面
            try {
                await doAsk(question, r => answer.innerText = r)
            } catch (err) {
                console.log(err)
                answer.innerText = `Error: ${err}`
            }
        }

        reset() {
            conversationID = '';// 会话 id 重置
            clearToken()
            this.clearMsg()
            this.getDom('#list').innerHTML = ''// 对话列表清空
        }
    }

    function initHtml() {
        window.customElements.define('ask-chat-gpt', AskChatGpt)
        const dom = document.createElement('ask-chat-gpt')
        const body = document.getElementsByTagName('body')[0]
        body.insertAdjacentElement('beforeend', dom)
    }

    function getTokenKey() { return `TokenOf_${selectApi.session_url}` }
    function clearToken() { GM_setValue(getTokenKey(), '') }

    async function getToken() {
        let token = GM_getValue(getTokenKey(), '')
        if (token == '') {
            token = await doGetToken()
            GM_setValue(getTokenKey(), token)
        }
        return token
    }

    async function doGetToken() {
        return new Promise((ok, fail) => {
            GM_xmlhttpRequest({
                url: selectApi.session_url,
                onload: function (response) {
                    const r = JSON.parse(response.responseText)
                    ok(r.accessToken)
                },
                onerror: function (err) {
                    fail(new Error(`Please Login first`))
                },
            })
        })
    }

    async function doAsk(question, callback) {
        let token = ''
        if (selectApi.session_url) { // 需要 token
            token = await getToken()
        }
        const data = {
            action: "next",
            messages: [
                {
                    id: generateUUID(),
                    role: "user",
                    content: {
                        content_type: "text",
                        parts: [question],
                    },
                },
            ],
            parent_message_id: generateUUID(),
            model: "text-davinci-002-render",
        }
        if (conversationID != '') {
            if (selectApi.conversation_mode) {
                data.conversation_id = conversationID
            } else {
                console.log('当前 API 还不支持会话模式')
            }
        }
        const url = new URL(selectApi.conversation_url)
        let headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
            Origin: url.origin,
            Referer: url.origin,
            'x-openai-assistant-app-id': '',
        }
        console.log(`request, headers:`, data, headers)
        callback(`思考中...`)
        // 不能用 EventSource, 会有跨域问题, 只能通过脚本管理器的 GM_xmlhttpRequest 发起网络请求
        GM_xmlhttpRequest({
            url: selectApi.conversation_url,
            method: 'POST',
            headers: headers,
            data: JSON.stringify(data),
            onprogress: function (response) {
                callback(`${response.loaded} 接收数据中...`)
                // 这里读取不到 response.response? Why?
            },
            onreadystatechange: function (e) {
                // console.log(`state=${e.readyState}`, e)
            },
            onerror: function (err) {
                callback(`Error: ${err}`)
            },
            onload: function (response) {
                callback(`${response.loaded} 接收数据完毕`)
                console.log('response:', response)
                const status = response.status
                const data = response.response
                if (status != 200) {
                    callback(`Error. status=${status}. \n${data}`)
                    if (status == 401) {
                        try {
                            const j = JSON.parse(data)
                            if (j.detail.code == 'token_expired') {
                                console.log('token expired')
                                callback('Token expired, retry...')
                                clearToken()
                                getToken().then(token => {
                                    doAsk(token, question, callback)
                                })
                            }
                        } catch (ignore) { }
                    }
                    return
                }
                try {
                    const r = transData(data)
                    conversationID = r.conversation_id
                    callback(r.message?.content?.parts?.[0])
                } catch (err) {

                    callback(`Error: ${err}. \nresponse=${data}`)
                }
            },
        })
    }

    function transData(data) {
        const arr = data.split('\n\n')
        let r = '{}'
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == '' || arr[i] == 'data: [DONE]') {
                continue
            }
            r = arr[i].substring('data: '.length)
            break
        }
        return JSON.parse(r)
    }

    function generateUUID() {// 这个是 ChatGPT 给出的算法
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

})();
