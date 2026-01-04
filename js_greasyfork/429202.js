// ==UserScript==
// @name         教务系统评教
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  半自动评教脚本，适用于强智教务系统
// @author       You
// @match        *://*/jsxsd/xspj/xspj_edit.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429202/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/429202/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (let e of document.querySelectorAll("td input")){
        if (e.id.slice(-1)==="1"){
            e.checked = true;
        }
    }
    document.querySelector('#jynr').textContent = "暂无";
    let submit = document.querySelector('#tj').click();
})();