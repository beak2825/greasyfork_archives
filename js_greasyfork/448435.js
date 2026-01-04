// ==UserScript==
// @license AGPL-3.0
// @name         一起看
// @namespace    wt
// @version      0.1
// @description  樱花动漫 一起看
// @author       dituon
// @match        *.yinghuacd.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448435/%E4%B8%80%E8%B5%B7%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448435/%E4%B8%80%E8%B5%B7%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict'

    if (window.top !== window.self) {
        const video = document.querySelector('video')
        let last = 0.0

        //把视频事件传回顶部窗口
        video.addEventListener('play', e => send({ type: 'play', time: e.timeStamp }))
        video.addEventListener('pause', e => send({ type: 'pause', time: e.timeStamp }))

        video.addEventListener('seeked', e => { //currentTime也会触发seeked
            if (last > video.currentTime - 2.5 && last < video.currentTime + 2.5) return
            send({ type: 'fastwind', time: video.currentTime })
        })
        const send = function (m) {
            window.top.postMessage(m, "*")
        }

        //从顶部窗口接收事件
        window.addEventListener('message', e => {
            console.log(e.data)
            switch (e.data['type']) {
                case 'play':
                    video.play()
                    break
                case 'pause':
                    video.pause()
                    break
                case 'fastwind':
                    fastwind(e.data.time)
                    break
                case 'sync':
                    send({ type: "sync", time: video.currentTime })
            }
        }, false)
        const fastwind = function (time) {
            last = video.currentTime
            video.readyState ? video.currentTime = time //确保视频已经加载
                : setTimeout(() => fastwind(time), 100)
        }
        return
    }

    String.prototype.isValidUrl = function () {
        return this.includes('www.yinghuacd.com/v/') || this.startsWith('ws://')
    }

    //判断当前页面
    if (!window.location.href.isValidUrl()) return

    //👇前端
    let userStyle = `
    .wt {
        font-family: system-ui, —apple-system, Segoe UI, Rototo, Emoji, Helvetica, Arial, sans-serif;
    }

    @font-face {
        font-family: Emoji;
        src: local("Apple Color Emojiji"), local("Segoe UI Emoji"), local("Segoe UI Symbol"), local("Noto Color Emoji");
        unicode-range: U+1F000-1F644, U+203C-3299;
    }

    #wt-setting-icon {
        font-size: 1.4rem;
        position: absolute;
        text-align: center;
        padding: 0.4em;
        right: 2%;
        top: 0;
        z-index: 998;
        cursor: pointer;
    }

    #wt-setting {
        background-color: #f1e4f3;
        position: absolute;
        text-align: center;
        padding: 0.4em;
        right: 2%;
        top: 6%;
        width: 8em;
        border-radius: 16px;
        z-index: 999;
    }

    #wt-setting input {
        margin-left: 0.2em;
        width: 8em;
    }

    #wt-setting-icon:hover {
        animation: rotate 2s;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    #wt-chat {
        padding: 1em;
        margin: 0 auto;
        width: 80%;
        max-height: 20%;
        background-color: #a2d2ff;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 16px;
    }

    #wt-chat-area {
        width: 80%;
        display: flex;
        flex-direction: row;
        overflow-y: hidden;
        border-radius: 16px;
    }

    #wt-chat-area::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    #wt-chat-area::-webkit-scrollbar-track {
        background-color: #fff;
        border-radius: 10px;
    }

    #wt-chat-area::-webkit-scrollbar-thumb {
        background-color: #0096c7;
        border-radius: 10px;
    }

    .wt-chat-element {
        padding: 0.4em;
        margin: 0.4em 0.6em;
        background-color: #fff;
        border-radius: 16px;
        color: #0096c7;
    }

    #wt-input {
        width: 80%;
        margin-top: 1em;
        display: flex;
        justify-content: space-evenly;
    }

    #wt-text {
        background-color: #fff;
        border: none;
        outline: none;
        height: 2.4em;
        vertical-align: middle;
        border-radius: 16px;
        width: 80%;
        box-sizing: border-box;
        padding: 0 1em;
        clear: both;
    }

    #wt-send {
        background-color: #fff;
        padding: 0.4em 1em;
        border-radius: 16px;
        border-style: none;
        box-sizing: border-box;
        color: #0096c7;
        cursor: pointer;
    }

    .wt-time {
        font-size: 0.6em;
        margin: 0 0.4em;
        font-weight: 200;
    }

    .wt-sender {
        font-size: 0.6em;
        margin: 0 0.2em;
        font-weight: 600;
    }

    .wt-content {
        font-size: 1.2em;
        margin: 0.2em 0.2em;
        max-width: 10em;
        width: max-content;
    }

    .wt-tooltip {
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        background-color: #fff;
        border-radius: 16px;
        border: 2px dashed #0096c7;
        color: #0096c7;
        padding: 1em;
        text-align: center;
        z-index: 1000;
    }

    .wt-tooltip-button {
        background-color: #0096c7;
        padding: 0.6em 1.2em;
        border-radius: 16px;
        border-style: none;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        font-size: 1.2em;
        margin: 0.4em 0;
    }
`
    GM_addStyle(userStyle)

    const settingIcon = document.createElement('div')
    settingIcon.id = 'wt-setting-icon'
    settingIcon.className = 'wt'
    settingIcon.innerText = '⚙'
    document.querySelector('body').appendChild(settingIcon)

    const setting = document.createElement('div')
    setting.id = 'wt-setting'
    setting.className = 'wt'
    setting.style.display = 'none'
    setting.innerHTML =
        `
        <span>ws服务器</span><input type="url" id="wt-server" />
        <hr />
        <span>昵称</span><input type="text" id="wt-nick" />
        <hr />
        <button id="wt-setting-save">提交</button>
    `

    document.querySelector('body').appendChild(setting)

    let settingBarStyle = document.querySelector('#wt-setting').style
    document.querySelector('#wt-setting-icon').addEventListener('click', e => {
        settingBarStyle.display = settingBarStyle.display === 'none' ? 'block' : 'none'
    })

    const chatBar = document.querySelector('div')
    chatBar.id = 'wt-chat'
    chatBar.className = 'wt'
    chatBar.innerHTML = `
    <div class="wt" id="wt-chat">
        <div id="wt-chat-area"></div>
        <div id="wt-input">
            <input type="text" id="wt-text" />
            <button id="wt-send">发送消息</button>
        </div>
    </div>
    `
    document.getElementByXpath = function (path) {
        return document.evaluate(path, document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    document.querySelector('body').insertBefore(chatBar,
        document.getElementByXpath('html/body/div[7]'))

    const nickElement = document.querySelector('#wt-nick')
    const wsServreElement = document.querySelector('#wt-server')
    document.querySelector('#wt-setting-save').addEventListener('click', e => {
        //设置用户名
        document.cookie = `wt-nick=${nickElement.value.trim()}; max-age=1145141919810;`

        //设置ws服务器
        document.cookie = `wt-server=${wsServreElement.value.trim()}; max-age=1145141919810;`
    })

        ; (function () { //init
            let nickName = getNick()
            if (!nickName) {
                document.cookie = `wt-nick=匿名; max-age=1145141919810;`
                return
            }
            nickElement.value = nickName
        })()

    //👇通信
    //iframe通信
    window.addEventListener("message", e => { //从iframe接收事件
        switch (e.data.type) { //更新的数据发送给服务器
            case 'fastwind':
                socket.send(`{"type": "FASTWIND", "value": "${e.data.time}"}`)
                break
            case 'sync':
                socket.send(`{"type": "SYNC", "value": "${e.data.time}",
                 "sender": "${window.location.href}"}`)
                break
            default:
                socket.send(`{"type": "STATE", "value": "${e.data.type}"}`)
                break
        }
    }, false);

    //ws服务器通信
    let serverHost = getWsServer() //init
    if (!serverHost) {
        document.cookie = `wt-server=ws://cnst.xmmt.fun:8887; max-age=1145141919810;`
        return
    }
    wsServreElement.value = getWsServer()
    let socket = new WebSocket(serverHost);

    socket.onopen = function (e) {
        chatAddElement("已连接ws服务器", "info")
    }
    socket.onclose = function (e) {
        chatAddElement("与服务器连接断开", "info")
    }
    socket.onerror = function (err) {
        chatAddElement(`通信错误: ${err.message}`, "error")
    }
    socket.onmessage = function (e) { //从服务器接收事件
        console.log(e.data)
        const data = JSON.parse(e.data)
        switch (data.type) { //发给iframe
            case 'MESSAGE':
                chatAddElement(data.value, data.sender)
                break
            case 'INFO':
                chatAddElement(data.value, data.sender)
                break
            case 'FASTWIND':
                iframe.postMessage({ type: 'fastwind', time: data.value }, "*")
                break
            case 'STATE':
                iframe.postMessage({ type: data.value }, "*")
                break
            case 'SYNC':
                if (!data.sender) { //将本地数据同步到服务器
                    iframe.postMessage({ type: 'sync' }, "*")
                    return
                } //从服务器同步数据
                if (data.sender === window.location.href) {
                    iframe.postMessage({ type: 'fastwind', time: data.value }, "*")
                    return
                }
                showTooltip(data.sender)
                break
        }
    }

    socket.sendMessage = function (msg) {
        socket.send(`{"type": "MESSAGE", "value": "${msg}", "sender": "${getNick()}"}`)
    }

    //聊天
    const textElement = document.querySelector('#wt-text')
    document.querySelector('#wt-send').addEventListener('click', e => {
        if (textElement.value.trim() === '') window.alert('发送的内容不能为空')
        socket.sendMessage(textElement.value)
        textElement.value = ''
    })

    document.addEventListener('keypress', e => { //回车发送
        if (e.key !== 'Enter' || textElement.value.trim() === '') return
        socket.sendMessage(textElement.value)
        textElement.value = ''
    })

    const iframeWindow = document.querySelector('iframe')
    let iframe = undefined
    iframeWindow.onload = function () {
        iframe = iframeWindow.contentWindow
        socket.send(`{"type": "INFO", "value": "我上线辣", "sender": "${getNick()}"}`);
    }


    const chatAddElement = function (msg, sender = 'server') {
        const area = document.querySelector('#wt-chat-area')
        const newElement = document.createElement('div')
        newElement.className = 'wt-chat-element'
        const date = new Date()
        newElement.innerHTML = `
        <span class="wt-time">${date.getHours()}:${date.getMinutes()}</span>
        <span class="wt-sender">${sender}</span>
        <br/>
        <div class="wt-content">${msg}</div>
            `
        area.appendChild(newElement)
        area.scrollTo(1145141919810, 0)
    }

    function getNick() {
        let nick = document.cookie.match(/wt-nick=(.+?);/)
        return nick ? nick[1] : nick
    }

    function getWsServer() {
        let server = document.cookie.match(/wt-server=(.+?);/)
        return server ? server[1] : server
    }

    function showTooltip(url) {//邀请/加入
        let tooltip = document.createElement('div')
        tooltip.className = 'wt wt-tooltip'
        tooltip.innerHTML = `
        <h4>大家在看别的片子...你的选择是...</h4>
        <button class="wt-tooltip-button" id="wt-join" value="${url}">🏃‍♀️去和大家一起看🏃‍♂️</button>
        <br />
        <button class="wt-tooltip-button" id="wt-invite">👉大家和我一起看👈</button>
        `
        document.querySelector('body').appendChild(tooltip)

        const join = document.querySelector('#wt-join')
        join.addEventListener('click', e => {
            window.location.href = join.value
        })

        const invite = document.querySelector('#wt-invite')
        invite.addEventListener('click', e => {
            socket.send(`{"type": "SYNC", "sender": "${window.location.href}"}`)
            document.querySelector('.wt-tooltip').style.display = 'none'
        })
    }

})(); 