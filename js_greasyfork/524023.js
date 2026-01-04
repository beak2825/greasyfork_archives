// ==UserScript==
// @name         duckduckgo增加只看中文选项
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  在 DuckDuckGo 搜索界面添加一个 “只看中文” 的复选框功能。该功能设计直观且高效，勾选后系统将智能筛选搜索结果，仅显示中文相关内容。
// @author       hixyl
// @match        *://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524023/duckduckgo%E5%A2%9E%E5%8A%A0%E5%8F%AA%E7%9C%8B%E4%B8%AD%E6%96%87%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/524023/duckduckgo%E5%A2%9E%E5%8A%A0%E5%8F%AA%E7%9C%8B%E4%B8%AD%E6%96%87%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=(() => {

        const newSwitch = document.createElement('div');

        const searchInput = document.getElementById('search_form_input');

        newSwitch.innerHTML = `<div class="c1GwqC__eRoEs0cLTIfL">
    <input type="checkbox" id="onlyChinese"  style="transform: translateY(2px);">只看中文</input>
</div>`
        document.querySelector('.RHsWhMlxc4ETEMDS9ltw').appendChild(newSwitch);
           if (searchInput.value.endsWith('language:zh')) {
               searchInput.value = searchInput.value.replace('language:zh', '');
               document.getElementById('onlyChinese').checked = true;
           }
           newSwitch.querySelector('input').addEventListener('change', (e) => {
               const isChecked = e.target.checked;
               if (isChecked) {
                   searchInput.value = `${searchInput.value} language:zh`;
               } else {
                   searchInput.value = searchInput.value.replace('language:zh', '');
               }
               const btn = document.getElementById('search_button');
               btn.click();
           })

       })


})();