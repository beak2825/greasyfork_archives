// ==UserScript==
// @name         去除 JSON在线视图查看器(Online JSON Viewer) 广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除http://www.bejson.com/jsonviewernew/ 的广告
// @author       tjq
// @match        http://www.bejson.com/jsonviewernew/
// @run-at document-start  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430380/%E5%8E%BB%E9%99%A4%20JSON%E5%9C%A8%E7%BA%BF%E8%A7%86%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%99%A8%28Online%20JSON%20Viewer%29%20%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430380/%E5%8E%BB%E9%99%A4%20JSON%E5%9C%A8%E7%BA%BF%E8%A7%86%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%99%A8%28Online%20JSON%20Viewer%29%20%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(()=>{
        const feee = document.querySelector("#feee")
        const googleAd1 = document.querySelector("#google-ad1")
        const s = document.querySelector("script[src='/static/ydxyt/1.js']")
        if (s) {
            s.remove()
            clearInterval(interval)
        }
        if (feee) {
            feee.remove()
        }
        if (googleAd1){
            googleAd1.remove()
            var htmlHeadingElement = document.createElement("h1")
            htmlHeadingElement.setAttribute('id','google-ad1')
            document.querySelector("body").append(htmlHeadingElement)
        }
        if (feee && googleAd1) {
            clearInterval(interval)
        }
    },0)
    // Your code here...
})();