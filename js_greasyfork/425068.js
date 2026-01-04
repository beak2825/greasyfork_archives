// ==UserScript==
// @name         Sort Number for Greasy Fork Scripts
// @name:zh-CN   脚本列表排序
// @name:ja      腳本清單排序
// @description  Show order number  for Greasy Fork script list page, for every page
// @description:zh-CN   脚本列表页显示排名序号, 翻页自动追加序号
// @description:ja  スクリプトリストページにはランキング番号が表示されます。ページをめくると自動的に番号が追加されます。作品をハイライトします。
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      1.3
// @author       Finn
// @run-at       document-end
// @match        https://greasyfork.org/*/scripts*
// @match        https://sleazyfork.org/*/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425068/Sort%20Number%20for%20Greasy%20Fork%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/425068/Sort%20Number%20for%20Greasy%20Fork%20Scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const page = +new URLSearchParams(document.location.search).get('page')||1;
    const q= `<style>#browse-script-list{counter-reset: section ${(page-1)*50};}.ad-entry{height: 0;overflow: hidden;}#browse-script-list li{position:relative}.Finn{background:gold;} .ad-entry{display:none}#browse-script-list li:after{counter-increment: section;content:counter(section);font:bold 20px/30px Arial;color: #29b6f6;position:absolute;bottom:8px;right:15px}</style>`;
    document.documentElement.insertAdjacentHTML('afterbegin', q);
    const a = document.querySelector(".user-profile-link a").href;
    document.querySelectorAll("#browse-script-list li").forEach(function(i){
        const b = i.querySelector("dd.script-list-author a");
        if( b && b.href===a) { i.className = 'Finn' }
    })
})();