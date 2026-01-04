// ==UserScript==
// @name         解除微软TTS试用时的 1000 字上限
// @namespace    mscststs
// @version      0.2
// @description  解除微软TTS试用上限
// @author       mscststs
// @license      ISC
// @match        *://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451377/%E8%A7%A3%E9%99%A4%E5%BE%AE%E8%BD%AFTTS%E8%AF%95%E7%94%A8%E6%97%B6%E7%9A%84%201000%20%E5%AD%97%E4%B8%8A%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/451377/%E8%A7%A3%E9%99%A4%E5%BE%AE%E8%BD%AFTTS%E8%AF%95%E7%94%A8%E6%97%B6%E7%9A%84%201000%20%E5%AD%97%E4%B8%8A%E9%99%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        try{
            const d = document.querySelector("#playbtn");
            d.attributes.removeNamedItem("disabled");
        }catch(e){
        }
    },1000)
})();