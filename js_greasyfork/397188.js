// ==UserScript==
// @name         推特工具箱 | twitter toolkit
// @namespace    https://twitter.com
// @icon         http://pic.baike.soso.com/ugc/baikepic2/26526/cut-20190524093048-1039431188_jpg_686_550_12779.jpg/300
// @version      1.1.0
// @description  鼠标🖱放到用户ID(.e.g @author)上时显示用户的注册时间 - 显示更多信息以便识别网络水军
// @author       Sven
// @license      MIT
// @note         v1.1.0 修复因 ajax-hook 升级导致的报错; 参照 change list 修改引用方式
// @match        https://twitter.com/*
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397188/%E6%8E%A8%E7%89%B9%E5%B7%A5%E5%85%B7%E7%AE%B1%20%7C%20twitter%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/397188/%E6%8E%A8%E7%89%B9%E5%B7%A5%E5%85%B7%E7%AE%B1%20%7C%20twitter%20toolkit.meta.js
// ==/UserScript==

; (() => {
    class ToolkitModule {
        constructor() { }
        isActive = true
    }
    /**
     * Breaking Ajax
     */
    class BreakingModule extends ToolkitModule {
        constructor() { super() }
        init(ctx) {
            // 添加 mouseover 事件, 在鼠标悬浮在用户头像上时显示注册时间
            document.addEventListener('mouseover', evt => {
                if (evt.target.tagName !== 'SPAN' || evt.target.parentNode.tagName !== 'DIV' || (evt.target.nextElementSibling && evt.target.nextElementSibling.classList.contains('twitter-toolkit-user-created-at'))) return
                for (const id in window._$TwitterToolkit.users) {
                    const userName = window._$TwitterToolkit.users[id].screen_name
                    if (evt.target.innerText === '@' + userName) {
                        ctx.log('监测到鼠标悬浮在用户头像上, 用户信息: ', window._$TwitterToolkit.users[id])
                        // 账号注册时间
                        const createdAtDom = document.createElement('div')
                        const { created_at } = window._$TwitterToolkit.users[id]
                        const createdAtDate = new Date(created_at)
                        createdAtDom.innerText = 'created at ' + createdAtDate.toLocaleDateString()
                        createdAtDom.style.fontSize = '12px'
                        createdAtDom.style.color = 'rgb(27, 149, 224)'
                        createdAtDom.classList.add('twitter-toolkit-user-created-at')
                        evt.target.parentNode.appendChild(createdAtDom)
                        break
                    }
                }
            })
            ah.hook({
                //拦截回调
                onreadystatechange: (xhr) => {
                    const responseStr = (xhr.response instanceof ArrayBuffer ? String.fromCharCode.apply(null, Uint16Array) : xhr.response) || ''
                    if (responseStr.indexOf('"users":{') === -1) return
                    let users = null
                    try {
                        const res = JSON.parse(responseStr)
                        users = (res.globalObjects && res.globalObjects.users)
                    } catch (err) { }
                    if (users === null) return
                    // ctx.log('users: ', users)
                    for (const id in users) {
                        if (ctx.users[id]) {
                            Object.assign(ctx.users[id], users[id])
                        } else {
                            ctx.users[id] = users[id]
                        }
                    }
                    setTimeout(this._showUserInfo, 500)
                },
                // onload: function (xhr) {
                //     console.log("onload called: %O", xhr)
                // },
                //拦截方法
                // open: function (arg, xhr) {
                //     xhr._$request = { url: arg[1], method: arg[0] }
                // }
            })
        }
        _showUserInfo() {
            console.log(window._$TwitterToolkit.users)
        }
        onload(ctx) {
            ctx.log('onload')
        }
    }
    /**
     * 工具类
     */
    class Toolkit {
        debug = true
        options = {}
        users = {}
        constructor(options = {}) {
            Object.assign(this.options, options)
            this.emitHook('init')
        }
        /**
         * 工具集
         */
        static modules = []
        /**
         * 注册工具模块
         */
        static use(moduleItem) {
            // 禁用未激活的模块
            if (!moduleItem.isActive) return
            Array.isArray(moduleItem) ? moduleItem.map(item => Toolkit.use(item)) : Toolkit.modules.push(moduleItem)
        }
        /**
         * 触发钩子函数
         * @param {string}} hook 钩子函数名
         */
        emitHook(hook) {
            this.log('触发钩子函数: ' + hook, Toolkit.modules.length)
            Toolkit.modules.map(module => module[hook] && typeof module[hook] === 'function' && module[hook](this))
        }
        log(...args) {
            console.log('%c[Twitter Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }
    Toolkit.use(new BreakingModule())
    window._$TwitterToolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', () => window._$TwitterToolkit.emitHook('onload'))
})();