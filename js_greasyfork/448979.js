// ==UserScript==
// @name         问卷星后台1—从我的问卷页面跳转到后台管理页面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  问卷星后台管理增强，从我的问卷页面跳转到后台管理页面
// @author       任亚军
// @match        */newwjx/manage/myquestionnaires.aspx*
// @icon         https://icons.duckduckgo.com/ip2/natapp4.cc.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448979/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B01%E2%80%94%E4%BB%8E%E6%88%91%E7%9A%84%E9%97%AE%E5%8D%B7%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448979/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B01%E2%80%94%E4%BB%8E%E6%88%91%E7%9A%84%E9%97%AE%E5%8D%B7%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var oldurl = window.location.href;
    var domain = oldurl.split("/newwjx")[0];
    var newurl = domain+"/customerservices/admin_main.htm";
    var pos = document.querySelector("#ctl01_divVip");
    var a1 = document.createElement("a");
    pos.appendChild(a1);
    a1.href = newurl;
    a1.innerText = "后台管理地址";
    a1.target="_blank";
    a1.style = "display: inline-block;height: 34px;line-height: 34px;padding: 0 18px;background-color: #0095FF;color: #fff !important;white-space: nowrap;text-align: center;font-size: 14px;border: none;border-radius: 2px;cursor: pointer;text-decoration: none;";
})();