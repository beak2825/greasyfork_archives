// ==UserScript==
// @name         虚空终端上传工具
// @namespace    https://yinr.cc/
// @version      0.3.4
// @description  虚空终端上传工具，添加按钮方便上传数据至虚空终端（https://xk.jdsha.com/），同时在米游社通行证页面添加按钮获取祈愿查询链接
// @homepage     https://greasyfork.org/zh-CN/scripts/454626
// @author       Yinr
// @license      MIT
// @icon         https://xk.jdsha.com/static/assets/media/logos/favicon.ico
// @match        http*://bbs.mihoyo.com/ys*
// @match        http*://www.miyoushe.com/ys*
// @match        http*://user.mihoyo.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/454626/%E8%99%9A%E7%A9%BA%E7%BB%88%E7%AB%AF%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454626/%E8%99%9A%E7%A9%BA%E7%BB%88%E7%AB%AF%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utils
    /** 创建 DOM 监听
     * @param {Object} option
     * @param {(Element | string)} option.parentNode MutationObserver 绑定的 DOM 对象
     * @param {string} option.selector 需要监听变化的 selector
     * @param {voidCallback} [option.failCallback=callback] selector 不存在时执行的回调函数
     * @param {MutationCallback} [option.successCallback=null] selector 对象发生 Mutation 事件时执行的回调函数
     * @param {boolean} [option.stopWhenSuccess=true] 执行一次 `successCallback` 后立即解除监听
     * @param {MutationObserverInit} [option.config={childList: true, subtree: true}] MutationObserver 配置参数
     */
    function launchObserver ({
        parentNode,
        selector,
        failCallback = null,
        successCallback = null,
        stopWhenSuccess = true,
        config = { childList: true, subtree: true }
    }) {
        if (!parentNode) return
        /** @type {MutationCallback} */
        const observeFunc = mutationList => {
            if (!document.querySelector(selector)) {
                if (failCallback) failCallback()
                return
            }
            if (stopWhenSuccess) observer.disconnect()

            mutationList.itemFilter = (fn, type = 'addedNodes') => mutationList.map(i => Array.from(i[type]).filter(fn)).reduce((arr, val) => arr.concat(val), [])

            if (successCallback) successCallback(mutationList)
        }
        const observer = new MutationObserver(observeFunc)
        observer.observe(parentNode, config)
    }
    /** 获取 Cookie
     * @param {RegExp} [checkRegex=null] Cookie 校验正则表达式
     */
    const getCookie = (checkRegex = null) => {
        const cookie = document.cookie
        if (checkRegex && null === cookie.match(checkRegex)) {
            alert('无效的 Cookie , 请重新登录!');
        } else {
            if (confirm(`Cookie 已经成功获取, 点击确定将 Cookie 复制到剪贴板。\n\nCookie: ${cookie}`)) {
                navigator.clipboard.writeText(cookie).then(() => {
                    alert('Cookie 已成功复制到剪贴板！')
                }).catch(() => {
                    prompt('复制 Cookie 出错，请手动复制输入框中的内容！', cookie)
                })
            }
        }
    }
    // 菜单按钮记录与添加
    /** @callback voidCallback */
    /** MenuBtnItem
     * @typedef {Object} MenuBtnItem
     * @property {string} key
     * @property {GM_MenuCmdId} commandId
     * @property {function} unregist
     */

    /** 已添加的菜单按钮
     * @type {MenuBtnItem[]} */
    const addedMenuBtn = []
    /** 添加菜单按钮并全局记录
     * @param {string} title 显示在菜单栏的菜单标题
     * @param {voidCallback} action 菜单点击执行的函数
     * @param {string} [key=title] 全局记录用的键名，默认同 title
     * @param {string} [accessKey] 菜单快捷按键
     */
    function addMenuBtn(title, action, key = title, accessKey = undefined) {
        const commandId = GM_registerMenuCommand(title, action, accessKey)
        addedMenuBtn.push({
            key, commandId, unregist: () => GM_unregisterMenuCommand(commandId)
        })
    }

    // Main
    const host = document.location.host

    // Global
    addMenuBtn('获取 Cookie', () => getCookie(), 'global_cookie')


    // 米游社
    if (['bbs.mihoyo.com', 'www.miyoushe.com'].includes(host)) {
        // 虚空终端上传工具
        // javascript:(function(){const s=document.createElement('script');s.src='https://t1.jdsha.com/hoyo/xk.js';document.body.append(s)})();
        const xkUpload = () => {
            const s = document.createElement('script')
            s.src='https://t1.jdsha.com/hoyo/xk.js'
            document.body.append(s)
        }
        // 添加虚空菜单按钮
        addMenuBtn('上传虚空数据', () => xkUpload())
        // 构建虚空页面按钮
        const xkUploadButton = () => {
            const btn = document.createElement('li')
            btn.classList.add('header__nav')
            btn.innerHTML = '<span class="header__navmore header__uploadxk">上传虚空</span>'
            btn.addEventListener('click', () => xkUpload())
            return btn
        }

        // 构建获取 Cookie 页面按钮
        const getCookieButton = () => {
            const btn = document.createElement('li')
            btn.classList.add('header__nav')
            btn.innerHTML = '<span class="header__navmore header__getcookie">获取 Cookie</span>'
            btn.addEventListener('click', () => getCookie())
            return btn
        }

        const btnContainerSelector = 'div.header__avatarcontainer'
        const btnLogoutSelector = 'li.header__nav>span.header__logout'
        const addButton = () => {
            const container = document.querySelector(btnContainerSelector)

            const addBtnAct = mutationList => {
                if (document.querySelector('.header__uploadxk') !== null) return
                const logoutBtn = document.querySelector(btnLogoutSelector).parentElement

                // 添加虚空按钮
                const xkBtn = xkUploadButton()
                logoutBtn.before(xkBtn)
                // 添加获取 Cookie 按钮
                const cookieBtn = getCookieButton()
                logoutBtn.before(cookieBtn)

                GM_addStyle('.header__navitem--account .header__nav:nth-child(4) {  padding-bottom: 0px;  }')
                GM_addStyle(`.header__navitem--account .header__nav:nth-child(${4 + 2}) {  padding-bottom: 10px;  }`)
            }

            launchObserver({
                parentNode: container,
                selector: btnLogoutSelector,
                successCallback: addBtnAct,
                stopWhenSuccess: false,
            })
        }

        launchObserver({
            parentNode: document,
            selector: btnContainerSelector,
            successCallback: addButton,
        })
    }

    // 米哈游通行证
    else if (host === 'user.mihoyo.com') {
        // 加载祈愿链接生成工具
        // from https://feixiaoqiu.com/rank_url_upload_init/
        // javascript:(function(){const s=document.createElement('script');s.src='https://ys.jdsha.com/static_js/ys.js';document.body.append(s)})();
        const getGachaUrl = () => {
            const s = document.createElement('script')
            s.src='https://ys.jdsha.com/static_js/ys.js'
            document.body.append(s)
        }

        addMenuBtn('获取祈愿记录', () => getGachaUrl())

        const sidebarSelector = 'div.mhy-sidebar>ul'
        const addGachaUrlButton = () => {
            const sidebar = document.querySelector(sidebarSelector)
            if (sidebar.querySelector('li.get-gacha-url-btn:last-child') !== null) return
            const btn = sidebar.querySelector('.get-gacha-url-btn') || document.createElement('li')
            if (!btn.classList.contains('get-gacha-url-btn')) {
                btn.setAttribute('click-upload', '')
                btn.classList.add('get-gacha-url-btn')
                btn.innerHTML = '<i class="anticon mhy-icon sidebar-icon icon-link"></i> <span>获取祈愿记录</span>'
                btn.addEventListener('click', () => getGachaUrl())
            }
            sidebar.append(btn)
        }

        launchObserver({
            parentNode: document,
            selector: sidebarSelector,
            successCallback: addGachaUrlButton,
            stopWhenSuccess: false,
        })
    }

})();