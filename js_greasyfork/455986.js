// ==UserScript==
// @name         Flarum Weblate Find Reviews 高亮审查翻译
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hightlight components need to be reviewed.
// @author       Golden
// @match        *://weblate.rob006.net/languages/*/*/*
// @match        *://weblate.rob006.net/languages/*/flarum/?limit=*
// @icon         https://weblate.rob006.net/static/logo-32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455986/Flarum%20Weblate%20Find%20Reviews%20%E9%AB%98%E4%BA%AE%E5%AE%A1%E6%9F%A5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/455986/Flarum%20Weblate%20Find%20Reviews%20%E9%AB%98%E4%BA%AE%E5%AE%A1%E6%9F%A5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
        document.querySelectorAll('.tab-pane.active > table.table-listing > tbody > tr div.progress-bar-success').forEach(p => {
            if(Number(p.ariaValueNow) > 0) {
                //p.style.width = '100%'
                //p.style.border = '2px solid green'
                const a = p.parentElement.parentElement.parentElement.previousElementSibling.querySelector('.object-link > a')
                a.style.fontSize = '2em'
                a.style.color = 'red'
            }
        })
    })
})();