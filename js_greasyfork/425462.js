// ==UserScript==
// @name         显示店铺档案
// @namespace    Coxxs
// @version      0.1
// @description  显示店铺档案。
// @author       Coxxs
// @match        https://rate.taobao.com/user-rate-*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425462/%E6%98%BE%E7%A4%BA%E5%BA%97%E9%93%BA%E6%A1%A3%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/425462/%E6%98%BE%E7%A4%BA%E5%BA%97%E9%93%BA%E6%A1%A3%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.tagName !== 'SCRIPT') continue
                if (addedNode.textContent.includes('window.location.href=')) {
                    addedNode.remove()
                }
                if (addedNode.textContent.includes('window.addEventListener(\'load\'')) {
                    addedNode.remove()
                }
            }
        }
    })
    .observe(document.documentElement, { childList: true, subtree: true })
})()