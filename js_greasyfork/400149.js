// ==UserScript==
// @name         thoughts table sucks, no more embrassing
// @namespace    https://greasyfork.org/zh-CN/scripts/400149-thoughts-table-sucks
// @version      0.4
// @description  ues hotkey [shife + delete] or [shift + backspace] to delete rest of select columns
// @author       travis joe
// @match        https://thoughts.teambition.com/
// @grant        MIT
// @include      https://thoughts.teambition.com/
// @downloadURL https://update.greasyfork.org/scripts/400149/thoughts%20table%20sucks%2C%20no%20more%20embrassing.user.js
// @updateURL https://update.greasyfork.org/scripts/400149/thoughts%20table%20sucks%2C%20no%20more%20embrassing.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    window.addEventListener('keydown', (evt) => {
        if (event.keyCode === 46 && evt.shiftKey || event.keyCode === 8 && evt.shiftKey) {
            const handlers = [
                ...document.querySelectorAll('thead [class^=inner-btn]'),
            ]
            const selectIdx = handlers.findIndex((e) => e.dataset.isSelect === 'true')
            if (selectIdx > -1) {
                if (window.confirm('Do you want delete rest of selete columns?')) {
                    const deleteColumns = handlers.slice(selectIdx)
                    deleteColumns.map((e) => {
                        e.click()
                        document.querySelector('[class^=selection] [class^=btn]').click()
                    })
                }
            }
        }
    })
})()