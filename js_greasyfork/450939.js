// ==UserScript==
// @name         测评报告页面不显示柱状图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  测评报告页面不显示柱状图。。。
// @author       问卷星WJX
// @match        https://www.wjx.cn/wjx/activitystat/printkapian.aspx*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450939/%E6%B5%8B%E8%AF%84%E6%8A%A5%E5%91%8A%E9%A1%B5%E9%9D%A2%E4%B8%8D%E6%98%BE%E7%A4%BA%E6%9F%B1%E7%8A%B6%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450939/%E6%B5%8B%E8%AF%84%E6%8A%A5%E5%91%8A%E9%A1%B5%E9%9D%A2%E4%B8%8D%E6%98%BE%E7%A4%BA%E6%9F%B1%E7%8A%B6%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#divChart0_1_img").style.display="none";
    document.querySelector("#divChart0_2_img").style.display="none";
    document.querySelector("#divChart0_3_img").style.display="none";
    document.querySelector("#divChart0_4_img").style.display="none";

    document.querySelector(".wjxui-btn-group").style.display="none";
    document.querySelector(".ctrolBtnGroup").style.display="none";
    
})();