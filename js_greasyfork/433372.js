// ==UserScript==
// @name         91tvg跳过验证
// @version      0.2
// @description  91tvg跳过计算验证
// @author       冷月馨
// @match        *://www.91tvg.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/821539
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433372/91tvg%E8%B7%B3%E8%BF%87%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/433372/91tvg%E8%B7%B3%E8%BF%87%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var form = document.evaluate('/html/body/form[@method="post"]', document).iterateNext();
    if (form == null) {
        return;
    }
    var cal = document.evaluate('table/tbody/tr/td/table/tbody/tr/td/b[@style="font-size: 16px"]', form).iterateNext();
    if (cal == null) {
        return;
    }
    var s = cal.innerHTML;
    var ev = s.substring(0, s.lastIndexOf(" = ?"));
    var result = eval(ev);
    var ans = document.evaluate('table/tbody/tr/td/table/tbody/tr/td/input[@name="answer"]', form).iterateNext();
    if (ans == null) {
        return;
    }
    ans.value = result;
    var sub = document.evaluate('table/tbody/tr/td/table/tbody/tr/td/input[@name="secqsubmit"]', form).iterateNext();
    if (sub == null) {
        return;
    }
    sub.click();
})();