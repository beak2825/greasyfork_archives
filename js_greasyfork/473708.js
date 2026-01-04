// ==UserScript==
// @license     AGPL License
// @name        bilibili便捷工具
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*
// @match       https://message.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://search.bilibili.com/*
// @match       https://live.bilibili.com/*
// @match       https://space.bilibili.com/*
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @noframes
// @version     3.3
// @author      n1nja88888
// @description 为b站新增鼠标滑过快速获取未读消息、直播页面仿视频快捷键等等便捷操作
// @downloadURL https://update.greasyfork.org/scripts/473708/bilibili%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/473708/bilibili%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
'use strict'
console.log('n1nja88888 creates this world!')
// 覆盖添加监听器函数
!(function () {
    Element.prototype._addEventListener = Element.prototype.addEventListener
    Element.prototype._removeEventListener = Element.prototype.removeEventListener

    Element.prototype.addEventListener = function (type, listener, useCapture = false) {
        this._addEventListener(type, listener, useCapture)

        if (!this.eventListenerList) this.eventListenerList = {}
        if (!this.eventListenerList[type]) this.eventListenerList[type] = []

        this.eventListenerList[type].push({ type, listener, useCapture })
    }
    Element.prototype.removeEventListener = function (type, listener, useCapture = false) {
        this._removeEventListener(type, listener, useCapture)

        if (!this.eventListenerList) this.eventListenerList = {}
        if (!this.eventListenerList[type]) this.eventListenerList[type] = []
        for (let i = 0; i < this.eventListenerList[type].length; i++) {
            if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
                this.eventListenerList[type].splice(i, 1)
                break
            }
        }

        if (this.eventListenerList[type].length == 0) delete this.eventListenerList[type]
    }
    Element.prototype.getEventListeners = function (type) {
        if (!this.eventListenerList) this.eventListenerList = {}

        if (!type) return this.eventListenerList
        return this.eventListenerList[type]
    }
    Element.prototype.clearEventListeners = function (a) {
        if (!this.eventListenerList) this.eventListenerList = {}
        if (!a) {
            for (let x in this.getEventListeners()) this.clearEventListeners(x)
            return
        }
        const el = this.getEventListeners(a)
        if (!el) return
        for (let i = el.length - 1; i >= 0; --i) {
            let ev = el[i]
            this.removeEventListener(a, ev.listener, ev.useCapture)
        }
    }
})()
// 判断网页活跃元素
function isActive(...eleSet) {
    for (const ele of eleSet) {
        if (ele instanceof HTMLElement) {
            if (document.activeElement === ele)
                return true
        }
        else {
            switch (ele.charAt(0)) {
                case '.':
                    if (document.activeElement.classList.contains(ele.substring(1)))
                        return true
                    break
                case '#':
                    if (document.activeElement.id.toLowerCase() === ele.substring(1).toLowerCase())
                        return true
                    break
                default:
                    if (document.activeElement.tagName.toLowerCase() === ele.toLowerCase())
                        return true
            }
        }
    }
    return false
}
// 判断是否是组合键
function isCombKey(e) {
    return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey
}
// 轮询获取网页元素
function getEleAsync(selector, isCollection = false, context = null) {
    return new Promise(res => {
        context = context ? context.document : document
        const ret = get(context)
        if (ret) {
            res(ret)
            return
        }
        const observer = new MutationObserver((records, observer) => {
            const ret = get(context)
            if (ret) {
                res(ret)
                observer.disconnect()
            }
        })
        observer.observe(context, {
            childList: true,
            subtree: true
        })
    })
    function get(context) {
        const ret = isCollection ? context.querySelectorAll(selector) : context.querySelector(selector)
        if ((!isCollection && !!ret) || (isCollection && ret.length > 0))
            return ret
        else
            return null
    }
}
// 鼠标查看未读消息
async function unreadMsg() {
    const msg = await getEleAsync('.right-entry--message')
    msg.addEventListener('mouseenter', () => {
        // 发送异步查看回复请求
        GM_xmlhttpRequest({
            url: 'https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread?build=0&mobi_app=web&unread_type=0',
            responseType: 'json',
            onload(dataChat) {
                const chat = dataChat.response.data
                let chatCount = 0
                for (let prop in chat)
                    chatCount += chat[prop]
                GM_xmlhttpRequest({
                    url: 'https://api.bilibili.com/x/msgfeed/unread?build=0&mobi_app=web',
                    responseType: 'json',
                    onload(data) {
                        // 未读消息对象
                        const unread = data.response.data
                        // 计算未读消息总数
                        const count = unread.reply + unread.at + unread.like + unread.sys_msg + chatCount
                        let div = null
                        // 未读消息样式
                        div = document.getElementsByClassName('red-num--message')[0]
                        // 不为零直接添加，为零的话则判断之前是否已经存在未读消息样式，有的话则移除改元素，即 清零消息
                        if (!count) {
                            if (div)
                                msg.removeChild(div)
                        }
                        else {
                            if (!!div)
                                div.textContent = count
                            else {
                                div = document.createElement('div')
                                div.className = 'red-num--message'
                                div.textContent = count
                                msg.append(div)
                            }
                        }
                        // 按消息栏顺序储存各类未读消息
                        let counts = [unread.reply, unread.at, unread.like, unread.sys_msg, chatCount]
                        for (let i = 0; i < 5; i++) {
                            // 获取对应一栏
                            let ele = document.getElementsByClassName('message-inner-list__item')[i]
                            // 未读消息样式,这个需要在对应栏去寻找
                            let span = ele.getElementsByClassName('message-inner-list__item--num')[0]
                            // 不为零直接添加，为零的话则判断之前是否已经存在未读消息样式，有的话则移除改元素，即 清零消息
                            if (!counts[i]) {
                                if (!!span)
                                    ele.removeChild(span)
                            }
                            else {
                                if (!!span)
                                    span.textContent = counts[i]
                                else {
                                    span = document.createElement('span')
                                    span.className = 'message-inner-list__item--num'
                                    span.textContent = counts[i]
                                    ele.append(span)
                                }
                            }
                        }
                    }
                })
            }
        })
    })
}
// 快捷键
async function shortcuts() {
    // t键网页全屏
    // 网页全屏按钮
    const btn = await getEleAsync('.bpx-player-ctrl-web')
    // 获得网页全屏的函数
    const webFullScreen = btn.getEventListeners().click[0].listener
    // 添加按键按下事件监听器
    document.addEventListener('keydown', e => {
        if (!isActive('input', 'textarea')
            && ('t' === e.key || 'T' === e.key))
            webFullScreen()
    })
}
// 直播加强 f全屏 t网页全屏
async function liveAid() {

    // 获得播放器
    let player = await getEleAsync('#live-player')
    let funcs = getFuncs(player)
    // 移除聊天框原本的keydown，另外这里需要同步执行
    let chatBox = await getEleAsync('#chat-control-panel-vm textarea')
    chatBox.removeEventListener('keydown', chatBox.getEventListeners().keydown[0].listener)
    // 自动切换到最高分辨率
    setResolution()
    // 添加按键按下事件监听器
    document.addEventListener('keydown', async e => {
        //  只监听单按键事件
        if (isCombKey(e))
            return
        if (e.key != 'Enter'
            && (isActive('input', 'textarea')))
            return
        switch (e.key) {
            // 快速定位到聊天框
            case 'Enter':
                if (isActive(chatBox)) {
                    e.preventDefault()
                    document.querySelector('.right-action button').click()
                    chatBox.blur()
                }
                else if (!isActive('input', 'textarea')
                    && !document.FullScreenElement) {
                    e.preventDefault()
                    chatBox.focus()
                }
                break
            case 'f':
            case 'F':
                funcs[0]()
                break
            case 't':
            case 'T':
                funcs[1]()
                break
            case 'd':
            case 'D':
                funcs[2]()
                break
            case ' ':
                e.preventDefault()
                funcs[3]()
                await getEleAsync('video')
                if (!document.querySelector('video').paused) {
                    // 有时候暂停会导致再启动时 会导致之前的函数全部失效 所以得重新赋值
                    funcs = getFuncs(player)
                    setResolution()
                }
                break
        }
    })
    function getFuncs(player) {
        while (true) {
            try {
                player.dispatchEvent(new Event('mousemove'))
                const funcs = [
                    document.querySelectorAll('.right-area .tip-wrap .icon')[0].getEventListeners().click[0].listener,
                    document.querySelectorAll('.right-area .tip-wrap .icon')[1].getEventListeners().click[0].listener,
                    document.querySelectorAll('.right-area .tip-wrap .icon')[2].getEventListeners().click[0].listener,
                    document.querySelectorAll('.left-area .icon')[0].getEventListeners().click[0].listener
                ]
                player.dispatchEvent(new Event('mouseleave'))
                return funcs
            } catch (error) { }
        }
    }
    // 选择最高分辨率
    function setResolution(lv = 0) {
        const interval = setInterval(() => {
            player.dispatchEvent(new Event('mousemove'))
            const quality = document.querySelector('.quality-wrap')
            quality.dispatchEvent(new Event('mouseenter'))
            const list = quality.querySelectorAll('.list-it')
            if (!!list[lv]) {
                if (!list[0].classList.value.match('selected')) list[lv].click()
                player.dispatchEvent(new Event('mouseleave'))
                clearInterval(interval)
            }
        }, 0.5e3)
    }
}
function main() {
    // 只在直播页面执行
    if (!!location.href.match('live')) {
        // 关闭礼物栏
        localStorage.setItem('FULLSCREEN-GIFT-PANEL-SHOW', 0)
        window.addEventListener('load', () => liveAid())
    }
    else {
        window.addEventListener('load', () => {
            unreadMsg()
            if (location.href.includes("www.bilibili.com"))
                shortcuts()
        })
    }
}
main()