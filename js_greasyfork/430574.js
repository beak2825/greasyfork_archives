// ==UserScript==
// @name         360报告打印模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  360报告打印模式下可以直接将网页的内容进行原样打印。
// @author       问卷星WJX
// @match        https://www.wjx.cn/newwjx/activitystat/view360report.aspx?activity=*dy
// @match        https://www.wjx.cn/newwjx/activitystat/viewcandidate.aspx?activity=*dy
// @match
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430574/360%E6%8A%A5%E5%91%8A%E6%89%93%E5%8D%B0%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430574/360%E6%8A%A5%E5%91%8A%E6%89%93%E5%8D%B0%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    document.querySelector("body > div.main-container > div.inside-wrapper > div.inside-main > div").style="padding-left:0 !important;";
    document.querySelector("body > div.main-container > div.inside-wrapper > div.inside-head.clearfix").style="display:none;";
    document.querySelector("#leftlabel").style="display:none;";
    document.querySelector("#ctl02_ContentPlaceHolder1_hrefShare360").style="display:none;";
    document.querySelector("#ctl02_ContentPlaceHolder1_hrefSave").style="display:none;";
    document.querySelector("#aspnetForm > div.box-items.outset_newbox > div.overall__report > div > div.box__inner > div.box__wrap.clearfix > div.wjxui-btn-rightsideGroup").style="display:none;";
})();