// ==UserScript==
// @name         安师大准考证查询
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提前查询准考证信息
// @author       shuangshuang
// @match        http://210.45.192.97/zsbzkz/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424899/%E5%AE%89%E5%B8%88%E5%A4%A7%E5%87%86%E8%80%83%E8%AF%81%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/424899/%E5%AE%89%E5%B8%88%E5%A4%A7%E5%87%86%E8%80%83%E8%AF%81%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var qc=document.getElementById('MainContent_Button1');
    qc.removeAttribute('disabled');
    document.getElementById("MainContent_Button1").value="点我查询哦！";
    // Your code here...
})();