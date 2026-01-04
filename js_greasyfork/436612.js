// ==UserScript==
// @name         滑呗上传百分比
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  upload display percent
// @license MIT
// @author       Zszen
// @include      https://huabei.fenxuekeji.com/photographer/uploadranch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436612/%E6%BB%91%E5%91%97%E4%B8%8A%E4%BC%A0%E7%99%BE%E5%88%86%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/436612/%E6%BB%91%E5%91%97%E4%B8%8A%E4%BC%A0%E7%99%BE%E5%88%86%E6%AF%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(loop, 1000);
    function loop(){
        var n1=xp("/html/body/div[3]/div/div[2]/div/div[2]/div[2]/span/span[1]/text()").textContent;
        var n2=xp("/html/body/div[3]/div/div[2]/div/div[2]/div[2]/span/span[2]/text()").textContent;
        if(n1!=null && n2!=null){
            percent = Math.round(n1/n2*100)+"%";
        }
        console.log(percent)
    }
    // Your code here...
    function xp(xpath){
        return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
    }
})();