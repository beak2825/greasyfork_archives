// ==UserScript==
// @name         京东店铺关注有礼
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东店铺关注有礼,获取京豆奖励
// @author       You
// @match        https://f-mall.jd.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426331/%E4%BA%AC%E4%B8%9C%E5%BA%97%E9%93%BA%E5%85%B3%E6%B3%A8%E6%9C%89%E7%A4%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/426331/%E4%BA%AC%E4%B8%9C%E5%BA%97%E9%93%BA%E5%85%B3%E6%B3%A8%E6%9C%89%E7%A4%BC.meta.js
// ==/UserScript==


javascript:void(function() { if(location.href.indexOf('f-mall.jd.com')==-1){ location.replace("https://f-mall.jd.com/"); } var scriptTag=document.createElement("script"); scriptTag.src='https://tyh52.com/jd/static/shopUrl.js'; document.body.appendChild(scriptTag); })()