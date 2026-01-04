// ==UserScript==
// @name         BaiduPanAutoNextBtn
// @namespace    http://tampermonkey.net/
// @version      v1.2023-12-25
// @description  百度网盘自动下一步按钮
// @author       Zszen
// @match        https://pan.baidu.com/share/init?surl=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498210/BaiduPanAutoNextBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/498210/BaiduPanAutoNextBtn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$x('//div[@id="submitBtn"]')[0].click()
    var inputElement = document.querySelector('#accessCode');
    var inputValue = inputElement.value;
    //console.log(inputValue);
    if(inputValue!=""){
        var submitBtn = document.evaluate('//div[@id="submitBtn"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        submitBtn.click();
    }
    // Your code here...
})();