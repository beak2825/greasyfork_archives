// ==UserScript==
// @name         用户分析页面自定义功能
// @namespace    用户分析页面自定义功能：拨号、加微信
// @version      0.4
// @description  用户分析页面自定义功能：拨号、企业微信加好友
// @author       任亚军
// @match        https://www.wjx.cn/customerservices/userdatasearch.aspx
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458385/%E7%94%A8%E6%88%B7%E5%88%86%E6%9E%90%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458385/%E7%94%A8%E6%88%B7%E5%88%86%E6%9E%90%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll("#divTable .wjx_alink.mobile").forEach(function(item){
            var telnumber = item.innerText
            var pos = item.parentNode;
            var a1 = document.createElement("a");
            var a2 = document.createElement("a");
            pos.appendChild(a1);
            pos.appendChild(a2);
            a1.href = "Web2Python://intelunison/"+telnumber;
            a1.innerText = " 拨号";
            a1.target="_blank";
            a2.href = "Web2Python://qwaddfri/"+telnumber;
            a2.innerText = " 加微信";
            a2.target="_blank";
})
})();