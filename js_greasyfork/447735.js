// ==UserScript==
// @name         TKEx现网环境高亮
// @namespace    tkex
// @version      1.0.1
// @description  TKEx现网环境高亮，避免误操作
// @author       yaxinliu
// @match        *://kubernetes.woa.com/*
// @icon         https://kubernetes.woa.com/v4/favicon.ico
// @grant        none
// @run-at       document-body
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/447735/TKEx%E7%8E%B0%E7%BD%91%E7%8E%AF%E5%A2%83%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/447735/TKEx%E7%8E%B0%E7%BD%91%E7%8E%AF%E5%A2%83%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hightlightColorConfig = {
        "production": "#dc354599",
        "staging": "#ffc10799",
        "testing": "#25cff299",
        "development": "#c6c7c899",
    }


    class DOMNode {
        constructor (selector) {
            this.selector = selector
            this.timmer = null
        }

        onReady(callback) {
            const self = this
            document.addEventListener("DOMSubtreeModified", function(event) {
                const target = event.target
                if (target !== document.querySelector(self.selector)) {
                    return
                }
                if (self.timmer) {
                    clearTimeout(self.timmer)
                }
                self.timmer = setTimeout(() => {
                    callback()
                }, 100)
            })
        }
    }

    const dom = new DOMNode("table.tea-table__box tbody")
    dom.onReady(function() {
        let businesses = document.querySelectorAll("table.tea-table__box tbody tr")
        businesses.forEach(item => {
            checkAndChange(item)
        })
    })

    function checkAndChange(dom) {
        const descriptionDom = dom.querySelector("td:nth-child(11) div span span")
        const desc = descriptionDom.innerText.trim()

        if (desc.startsWith("生产环境")) {
            dom.style.backgroundColor = hightlightColorConfig.production
        } else if (desc.startsWith("预发环境")) {
            dom.style.backgroundColor = hightlightColorConfig.staging
        } else if (desc.startsWith("测试环境")) {
            dom.style.backgroundColor = hightlightColorConfig.testing
        }
    }

})();
