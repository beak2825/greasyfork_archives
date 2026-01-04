// ==UserScript==
// @name         price_adjust
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  泰铢转换为人民币
// @author       yao
// @match
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      http://www.boomerangshop.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/438840/price_adjust.user.js
// @updateURL https://update.greasyfork.org/scripts/438840/price_adjust.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ele = $('.price');
    let html = $('<br/><strong>人民币(汇率0.19) : </strong><span id = "tempId">￥'+parseInt(ele.text().replaceAll(',',''))*0.19+'</span>');
    ele.append(html);
    // Your code here...
})();


