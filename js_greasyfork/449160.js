// ==UserScript==
// @name         阿里云盘refresh_token
// @namespace    https://www.aliyundrive.com/
// @version      0.7
// @description  一键复制阿里云盘refresh_token
// @author       生瓜太保
// @match        https://www.aliyundrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @homepage     https://greasyfork.org/zh-CN/scripts/449160
// @supportURL   https://greasyfork.org/zh-CN/scripts/449160
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @connect      *
// @grant        unsafeWindow
// @grant        GM_notification
// @compatible   chrome
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449160/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98refresh_token.user.js
// @updateURL https://update.greasyfork.org/scripts/449160/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98refresh_token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand('📋 复制refresh_token', copyToken)
    GM_registerMenuCommand('👁 显示refresh_token', showToken)

    function getToken() {
        try {
            return JSON.parse(unsafeWindow.localStorage.token).refresh_token
        } catch (e) {
            console.error(e)
            alert(`获取refresh_token失败："${e.toString()}"！请确认已登录。如已登录，请按F12查看Console。`)
        }
        return ''
    }

    function copyToken() {
        const token = getToken()
        if (token) {
            GM_setClipboard(token)
            GM_notification({
                text: '已复制refresh_token',
                timeout: 3e3
            })
        }
    }

    function showToken() {
        const token = getToken()
        if (token) {
            prompt('refresh_token:', token)
        }
    }
})()