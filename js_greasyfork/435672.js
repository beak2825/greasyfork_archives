// ==UserScript==
// @name         打开流程审批隐藏功能
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  打开流程审批「发放券码」的入口。
// @author       问卷星WJX
// @match        *.wjx.cn/wjx/design/newsSystem.aspx?activity=*
// @match        */design/newsSystem.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435672/%E6%89%93%E5%BC%80%E6%B5%81%E7%A8%8B%E5%AE%A1%E6%89%B9%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435672/%E6%89%93%E5%BC%80%E6%B5%81%E7%A8%8B%E5%AE%A1%E6%89%B9%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==


(function() {

document.querySelector("body > div.main-container > div.inside-wrapper > div.inside-main > div > div > div.step__evaluate.article > div.mainContent > div.nodeSetWrap > div.ns_method > div.ns_itemHead.clearfix > div.fr.clearfix > a.wjxui-btn.wjxui-btn-primary.ml10.fl").style="display:normal;";
document.querySelector("#multiApproval").style="display:normal;";
document.querySelector("body > div.main-container > div.inside-wrapper > div.inside-main > div > div > div.step__evaluate.article > div.mainContent > div.nodeSetWrap > div.ns_itemHead.clearfix").style="display:normal;";
})();