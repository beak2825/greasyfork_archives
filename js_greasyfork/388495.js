// ==UserScript==
// @name         拉勾网职位隐藏脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/388495-%E6%8B%89%E5%8B%BE%E7%BD%91%E8%81%8C%E4%BD%8D%E9%9A%90%E8%97%8F%E8%84%9A%E6%9C%AC
// @version      0.2
// @description  隐藏拉勾网职位搜索列表的指定职位或公司
// @author       lyswhut
// @match        https://www.lagou.com/jobs/list_*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388495/%E6%8B%89%E5%8B%BE%E7%BD%91%E8%81%8C%E4%BD%8D%E9%9A%90%E8%97%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/388495/%E6%8B%89%E5%8B%BE%E7%BD%91%E8%81%8C%E4%BD%8D%E9%9A%90%E8%97%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.__tools__ = {
        hideCompany: [],
        hidePosition: [],
        jq: null,
        lgAjax: null,
        list: [],

        // 代理拉勾ajax
        proxyLgajax(options) {
            if (options.url.includes('positionAjax')) {
                options.success = window.__tools__.proxySuccess(options.success)
            }
            return window.__tools__.lgAjax(options)
        },

        // 代理响应成功函数
        proxySuccess(fn) {
            return function (data, textStatus, jqXHR) {
                window.__tools__.filterData(data)
                fn(data, textStatus, jqXHR)
            }
        },

        // 过滤职位
        filterData(data) {
            if (!data.content.positionResult.result.length) return
            let result = data.content.positionResult.result
            const filterList = []
            result = result
                .filter(p => this.hideCompany.find(i => i.companyId === p.companyId) ? !filterList.push(p) : true)
                .filter(p => this.hidePosition.find(i => i.positionId === p.positionId) ? !filterList.push(p) : true)
            data.content.positionResult.result = this.list = result
            console.log('本次已过滤的职位为：')
            console.log(filterList
                        .map(i => `${i.companyFullName} - ${i.positionName} - ${i.salary} - ${i.companySize}`)
                        .join('\n') || '空')
        },

        // 隐藏公司
        addHideCompany(dom_btn, index) {
            const item = this.list[index]
            if (!item) return
            if (this.hideCompany.find(i => i.companyId === item.companyId)) return
            this.hideCompany.push(item)
            this.saveData()
            this.removeDomLi(dom_btn)
        },

        // 隐藏职位
        addHidePosition(dom_btn, index) {
            const item = this.list[index]
            if (!item) return
            if (this.hideCompany.find(i => i.positionId === item.positionId)) return
            this.hidePosition.push(item)
            this.saveData()
            this.removeDomLi(dom_btn)
        },

        // 从dom列表中移除隐藏的职位
        removeDomLi(dom_btn) {
            let dom_li = dom_btn.parentNode.parentNode
            if (dom_li.tagName != 'LI') return
            dom_li.parentNode.removeChild(dom_li)
        },

        // 模板注入
        injectTemplate() {
            let t = document.getElementById('tpl-position-list')
            if (!t) throw new Error('找不到模板')
            const btn = `<div style="position: absolute; right: 0; top: 0;">
<button style="padding: 3px 5px; background: rgba(230,230,230, .8);" onclick="__tools__.addHidePosition(this, {{i}})">隐藏该职位</button>
<button style="padding: 3px 5px; background: rgba(230,230,230, .8);" onclick="__tools__.addHideCompany(this, {{i}})">隐藏该公司</button>
</div>`
            t.innerHTML = t.innerHTML.replace('</li>', btn + '</li>')
        },

        // 保存数据
        saveData() {
            localStorage.setItem(
                '__lgTools__',
                JSON.stringify({
                    hideCompany: this.hideCompany,
                    hidePosition: this.hidePosition,
                })
            )
        },

        // hook jQuery
        hookJQuery() {
            Object.defineProperty(window, 'jQuery', {
                set: v => {
                    this.jq = v
                    this.hookLgajax()
                },
                get: () => {
                    return this.jq
                },
            })
        },

        // hook拉勾ajax
        hookLgajax() {
            Object.defineProperty(this.jq, 'lgAjax', {
                set: v => {
                    this.lgAjax = v
                },
                get: () => {
                    return this.proxyLgajax
                },
            })
        },

        // 初始化
        init() {
            this.hookJQuery()
            document.addEventListener('DOMContentLoaded', () => {
                this.injectTemplate()
            })
            let list = localStorage.getItem('__lgTools__')
            if (!list) return
            list = JSON.parse(list)
            this.hideCompany = list.hideCompany
            this.hidePosition = list.hidePosition
        },
    }
    window.__tools__.init()
})();