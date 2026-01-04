// ==UserScript==
// @name         graphQL-toolkit
// @namespace    https://github.com/SublimeCT/greasy_monkey_scripts
// @version      0.0.1
// @description  graphQL 工具脚本 💪
// @note         v0.0.2 记住上次的搜索内容
// @note         v0.0.1 使文档居左
// @author       Sven
// @icon         https://graphql.cn/img/favicon.png
// @include      https://*
// @include      http://*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416677/graphQL-toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/416677/graphQL-toolkit.meta.js
// ==/UserScript==

; (() => {
    class ToolkitModule {
        constructor() { }
        isActive = true
    }
    class Store {
        static getOptions() {
            const options = localStorage.getItem('GraphQLToolkit_options')
            if (!options) return {}
            try {
                return JSON.parse(options) || {}
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        static setOption(options) {
            localStorage.setItem('GraphQLToolkit_options', JSON.stringify(options))
        }
        static updateOptions(options) {
            const allOptions = Store.getOptions()
            Object.assign(allOptions, options)
            Store.setOption(allOptions)
        }
    }
    /**
     * 使用上次的搜索内容
     */
    class QueryToolkitModule extends ToolkitModule {
        init(ctx) {}
        static async addEventListeners() {
            let items
            for (let times = 20; times--;) {
                await Toolkit.delay()
                items = document.querySelectorAll('.graphiql-wrapper > div > div')
                if (items && items.length) break
            }
            if (items.length < 2) throw new Error('missing sidebar element')
            const sidebar = items[1]
            const buttons = sidebar.querySelectorAll('div:nth-child(1) > div')
            buttons[0].click()
            const apiDoms = items[items.length - 1]
            let searchInput
            for (let times = 30; times--;) {
                await Toolkit.delay()
                searchInput = apiDoms.querySelector('input[type="text"]')
                if (searchInput) break
            }
            // 直接使用上次搜索内容
            const options = Store.getOptions()
            if (options.query) {
                searchInput.value = options.query // 填充值
                d.setState({ searchValue: options.query }) // 直接搜索
            }
            // 绑定 input 事件记录输入值
            searchInput.addEventListener('input', evt => {
                Store.setOption({ query: evt.target.value })
            })
        }
        onload() {
            QueryToolkitModule.addEventListeners()
        }
    }
    /**
     * 加入自定义样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        static _getSheets() {
            return `
                /* 布局样式 */
                .graphiql-wrapper > div > div:last-of-type {
                    right: auto;
                    left: 30vw;
                    max-width: 70vw !important;
                }
            `
        }
        init(ctx) {
            // ctx.log('加入自定义样式')
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
            // console.error('onload ????????????????')
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
            // 禁用 init, 因为必须要等到 onload 才能确定是否是 GraphQL 页面
            // this.emitHook('init')
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
    Toolkit.use(new QueryToolkitModule())
    window._$GraphQLToolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', async () => {
        for (let times = 10; times--;) {
            await Toolkit.delay()
            if (window.GraphQLPlayground) break
        }
        if (!window.GraphQLPlayground) return
        // 执行所有模块的钩子函数
        window._$GraphQLToolkit.emitHook('onload')
    })
})();