// ==UserScript==
// @name         Sketch MeaXure Cleaner
// @namespace    SublimeCT
// @version      0.1
// @description  屏蔽 MeaXure 脑残的快捷键设计;
// @author       SublimeCT
// @include      https://*
// @include      http://*
// @include      file://*
// @icon         http://www.sketchcn.com/images/sketch%E4%B8%AD%E6%96%87%E7%BD%91-favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425727/Sketch%20MeaXure%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/425727/Sketch%20MeaXure%20Cleaner.meta.js
// ==/UserScript==

; (() => {
    class ToolkitModule {
        constructor() { }
        isActive = true
        get isMeaxurePage() {
            return window.meaxure
        }
    }
    class Store {
        static getOptions() {
            const options = localStorage.getItem('SketchMeaXureToolkit_options')
            if (!options) return {}
            try {
                return JSON.parse(options) || {}
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        static setOption(options) {
            localStorage.setItem('SketchMeaXureToolkit_options', JSON.stringify(options))
        }
        static updateOptions(options) {
            const allOptions = Store.getOptions()
            Object.assign(allOptions, options)
            Store.setOption(allOptions)
        }
    }
    /**
     * 加入自定义样式
     */
    class HotKeyModule extends ToolkitModule {
        static get FLOW_BUTTON() {
            return document.querySelector('.flow-mode')
        }
        async init() {
            if (!this.isMeaxurePage) return
            await this.disabledHotKey()
        }
        async disabledHotKey() {
            const MAX_TIMES = 50
            for (let time = MAX_TIMES; time--;) {
                if (HotKeyModule.FLOW_BUTTON) break
                await Toolkit.delay()
            }
            if (!HotKeyModule.FLOW_BUTTON) throw new Error('[HotKeyModel] Flow button not found')
            HotKeyModule.FLOW_BUTTON.innerHTML = ' 💀 kill:flow '
        }
    }
    /**
     * 加入自定义样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        static isActive = false
        static _getSheets() {
            return `
                /* 自定义样式 */
            `
        }
        init(ctx) {
            ctx.log('加入自定义样式')
            // SheetsToolkitModule.appendSheets()
        }
        // 通过注入 css 实现隐藏广告并固定布局
        static appendSheets() {
            const sheet = document.createTextNode(SheetsToolkitModule._getSheets())
            const el = document.createElement('style')
            el.id = 'handle-sheets'
            el.appendChild(sheet)
            document.getElementsByTagName('head')[0].appendChild(el)
        }
        onload(ctx) {
            ctx.log('加入自定义样式')
            SheetsToolkitModule.appendSheets()
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
            console.log('%c[GraphQL Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }
    Toolkit.use(new SheetsToolkitModule())
    Toolkit.use(new HotKeyModule())
    window._$SketchMeaXureToolkit = new Toolkit()
})();