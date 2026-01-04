// ==UserScript==
// @name         审核页面敏感词提示
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  本脚本用于在审核员在审核时，将特别词汇做特殊样式处理，比如加大字体、更改背景色和文字颜色，以便于快速发现这些词汇；
// @author       WJX问卷星
// @match        https://www.wjx.cn/customerservices/previewq.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425111/%E5%AE%A1%E6%A0%B8%E9%A1%B5%E9%9D%A2%E6%95%8F%E6%84%9F%E8%AF%8D%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/425111/%E5%AE%A1%E6%A0%B8%E9%A1%B5%E9%9D%A2%E6%95%8F%E6%84%9F%E8%AF%8D%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    var keywords =["文化大革命","文革","四人帮","大跃进","天安门事件"];
    for (var i=0;i<keywords.length;i++) {
    document.body.innerHTML = document.body.innerHTML.replaceAll(keywords[i],"<span style='background-color: red;color:white;font-size: 20px;'>$&</span>");
    }
})();