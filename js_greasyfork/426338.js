// ==UserScript==
// @name         京东自动入会助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东自动查找店铺入会奖励入会
// @author       小赤佬
// @match        https://chat1.jd.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426338/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E5%85%A5%E4%BC%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426338/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E5%85%A5%E4%BC%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

javascript:void(function() { if(location.href.indexOf('chat1.jd.com')==-1){ location.replace("https://chat1.jd.com/"); } var scriptTag=document.createElement("script"); scriptTag.src='https://tyh52.com/jd/static/ruhui.js'; document.body.appendChild(scriptTag); })()