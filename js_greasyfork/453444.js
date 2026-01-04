// ==UserScript==
// @name         Custom wjx_autoform
// @namespace    https://github.com/invobzvr
// @version      0.1
// @description  问卷星自动表单
// @author       invobzvr
// @match        *://www.wjx.cn/vm/*
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @run-at       document-start
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/wjx_autoform
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/453444/Custom%20wjx_autoform.user.js
// @updateURL https://update.greasyfork.org/scripts/453444/Custom%20wjx_autoform.meta.js
// ==/UserScript==

(function () {
    function configurations() {
        return GM_listValues().map(key => [key, GM_getValue(key)]);
    }

    function autoForm() {
        let label, input, configs = configurations();
        for (let field of document.querySelectorAll('.ui-field-contain')) {
            label = field.querySelector('.field-label').innerText;
            for (let [key, val] of configs) {
                if (label.match(key) && (input = field.querySelector('input'))) {
                    input.value = val;
                    break;
                }
            }
        }
    }

    addEventListener('DOMContentLoaded', autoForm);
})();