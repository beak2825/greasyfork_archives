// ==UserScript==
// @name         点点节能插件
// @namespace    https://www.yangtzecoder.com
// @homepage     https://www.yangtzecoder.com/archives/635
// @version      0.1.7
// @description  关闭特效，解决卡顿问题
// @author       1010
// @match        https://y.tuwan.com/chatroom/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/480093/%E7%82%B9%E7%82%B9%E8%8A%82%E8%83%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/480093/%E7%82%B9%E7%82%B9%E8%8A%82%E8%83%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function initBox() {
    let btn_hide_id = null

    const hide_box = () => {
        const textContent = "div[data-title='铜箱子']{display:none !important} div[data-title='银箱子']{display:none !important}"
        GM_addElement('style', {
            textContent,
            "data-diandian": "box-append"
        });

        GM_unregisterMenuCommand(btn_hide_id)

    }

    btn_hide_id = GM_registerMenuCommand("隐藏宝箱", hide_box)
}

function initEffect() {
    let btn_hide_id = null
    let btn_show_id = null

    const hide_effect = () => {
        const textContent = "canvas{display:none !important} .animation11{display:none !important}"
        GM_addElement('style', {
            textContent,
            "data-diandian": "effect-append"
        });

        GM_unregisterMenuCommand(btn_hide_id)
        btn_show_id = GM_registerMenuCommand("显示特效", show_effect)
    }

    const show_effect = () => {
        GM_unregisterMenuCommand(btn_show_id)
        document.querySelector('style[data-diandian="effect-append"]').remove()
        btn_hide_id = GM_registerMenuCommand("隐藏特效", hide_effect)
    }

    btn_hide_id = GM_registerMenuCommand("隐藏特效", hide_effect)
}

function initChatLeft() {
    let btn_hide_id = null
    let btn_show_id = null

    const hide_effect = () => {
        const textContent = ".chat-left{display:none !important}"
        GM_addElement('style', {
            textContent,
            "data-diandian": "left-append"
        });

        GM_unregisterMenuCommand(btn_hide_id)
        btn_show_id = GM_registerMenuCommand("显示左侧栏", show_effect)
    }

    const show_effect = () => {
        GM_unregisterMenuCommand(btn_show_id)
        document.querySelector('style[data-diandian="left-append"]').remove()
        btn_hide_id = GM_registerMenuCommand("隐藏左侧栏", hide_effect)
    }

    btn_hide_id = GM_registerMenuCommand("隐藏左侧栏", hide_effect)
}

function initChatRight() {
    let btn_hide_id = null
    let btn_show_id = null

    const hide_effect = () => {
        const textContent = ".chat-center-right{display:none !important}"
        GM_addElement('style', {
            textContent,
            "data-diandian": "right-append"
        });

        GM_unregisterMenuCommand(btn_hide_id)
        btn_show_id = GM_registerMenuCommand("显示右侧栏", show_effect)
    }

    const show_effect = () => {
        GM_unregisterMenuCommand(btn_show_id)
        document.querySelector('style[data-diandian="right-append"]').remove()
        btn_hide_id = GM_registerMenuCommand("隐藏右侧栏", hide_effect)
    }

    btn_hide_id = GM_registerMenuCommand("隐藏右侧栏", hide_effect)
}

function initAt() {
    const iid = setInterval(() => {
        if (document.querySelector(".chat-huiyuan-info")) {
            clearInterval(iid)
            document.querySelector(".chat-huiyuan-info").onclick = (env) => {
                if (env.target.tagName.toLowerCase() == "font") {
                    const nameText = document.querySelector(".chat-huiyuan-info .chat-huiyuan-info-top>p").getAttribute("data-nickname")
                    document.querySelector(".chat-input-chat-textarea textarea").value = "@" + nameText + " "
                }
            }
        }
    }, 500);
}

(function () {
    'use strict';
    initBox()
    initEffect()
    initChatLeft()
    initChatRight()
    initAt()
})();