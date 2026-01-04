// ==UserScript==
// @name         【极简】bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  极简 bilibili 哔哩哔哩 ，去广告
// @author       chenyu
// @match        https://*.bilibili.com/*
// @match        https://www.bilibili.com
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/422825/%E3%80%90%E6%9E%81%E7%AE%80%E3%80%91bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/422825/%E3%80%90%E6%9E%81%E7%AE%80%E3%80%91bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
         .bili-banner,.room-bg {
            background: none!important;
        }
      .first-screen,.proxy-box ,#bili_report_spe_rec,.international-footer,.list-box,.ear,#reco_list,#danmukuBox,#right-bottom-banner,#live_recommand_report,#activity_vote,.notice-panel
,.adaptive-scroll,.up-list,.more,.player-area-ctnr,.flip-view,.area-detail-ctnr,.hab-ctnr,.recommend-area-ctnr,.link-footer,.btn-pre ,.btn-next,.live-sidebar-ctnr,.grid-area-ctnr,.yzly-content-ctnr,.haruna-canvas,.avatar-btn
,.side-bar-cntr,.contact-help,.tag-area{
    display: none!important}
    `)
})();

window.onload=function(){
    var nodes=document.evaluate("/html/body/div[2]/div/div[1]/div[2]/a", document).iterateNext();
    nodes.setAttribute("href","javascript:return false;");
    nodes.setAttribute("onclick","return false;")
};