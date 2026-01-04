// ==UserScript==
// @name         人力-測試機&正式機-媒合派工(列表模式)-新增需工單按扭
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  媒合派工(列表模式)-新增需工單按扭
// @author       hander
// @match        http://localhost:30942/WorkMatch/MatchFarmerManage
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/WorkMatch/MatchFarmerManage
// @match        https://lcahr.lingcheng.tw/TalentMatch/WorkMatch/MatchFarmerManage
// @match        https://ahr.coa.gov.tw/WorkMatch/MatchFarmerManage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442289/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F-%E5%AA%92%E5%90%88%E6%B4%BE%E5%B7%A5%28%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F%29-%E6%96%B0%E5%A2%9E%E9%9C%80%E5%B7%A5%E5%96%AE%E6%8C%89%E6%89%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/442289/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F-%E5%AA%92%E5%90%88%E6%B4%BE%E5%B7%A5%28%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F%29-%E6%96%B0%E5%A2%9E%E9%9C%80%E5%B7%A5%E5%96%AE%E6%8C%89%E6%89%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("<a>", {
        html: "新增需工單",
        href: "/WorkApplications/Add"
    }).appendTo(".search-btns");
})();