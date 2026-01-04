// ==UserScript==
// @name         自动输入答案
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        *://*.9damao.net/*
// @match        *://*.9damao.com/*
// @match        *://*.zhongyidiantong.com/*
// @match        *://*.9dmmods.com/*
// @match        *://*.9damaomods.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387184/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/387184/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var expr = document.evaluate("//b[@style='font-size: 16px']", document).iterateNext();
    var output = document.evaluate("//input[@name='answer']", document).iterateNext();
    var submit = document.evaluate("//input[@name='secqsubmit']", document).iterateNext();
    if(expr && output && submit)
    {
        // 用 eval 很不安全。。。
        output.value = eval(expr.innerText.replace("?", "").replace("=", ""));
        submit.click();
    }

    // Your code here...
})();