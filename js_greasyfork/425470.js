// ==UserScript==
// @name         123kanfang_saveBtn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  123kanfang_saveBtn!
// @author       You
// @match        http://webresource.123kanfang.com/studioClient4/client.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425470/123kanfang_saveBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/425470/123kanfang_saveBtn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function saveBtn() {
        var btn = document.querySelectorAll('#saveBtn')[0].childNodes[0];
        btn.click();
        setTimeout(function () { var qd = document.getElementsByClassName('confirm singleConfirmBtn')[0].click(); }, 200);
        console.log("保存成功")
    }
    setTimeout(saveBtn, 60000);
    // Your code here...
})();