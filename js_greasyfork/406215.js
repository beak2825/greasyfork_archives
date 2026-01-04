// ==UserScript==
// @name         電子學位論文服務系統-論文下載助手
// @namespace    Test
// @version      0.1
// @description  電子學位論文下載
// @author       You
// @match        https://www.airitietds.com/ETDS/Home/Detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406215/%E9%9B%BB%E5%AD%90%E5%AD%B8%E4%BD%8D%E8%AB%96%E6%96%87%E6%9C%8D%E5%8B%99%E7%B3%BB%E7%B5%B1-%E8%AB%96%E6%96%87%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406215/%E9%9B%BB%E5%AD%90%E5%AD%B8%E4%BD%8D%E8%AB%96%E6%96%87%E6%9C%8D%E5%8B%99%E7%B3%BB%E7%B5%B1-%E8%AB%96%E6%96%87%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cell = document.getElementsByClassName('flattable')[0].rows[0].cells[1]
    let detail_id = cell.innerText;
    let patch = window.location.pathname;
    let url = patch.replace('Detail','Download');
    cell.innerHTML = '<a href="'+ url +'">'+ detail_id +'</a>';
})();