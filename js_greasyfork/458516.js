// ==UserScript==
// @name         javbus mobile
// @namespace    shfeat
// @author       shfeat
// @version      0.1
// @description  javbus mobile style
// @license      MIT
// @include      /^https?:\/\/(\w*\.)?javbus(\d)*\.com.*$/
// @connect	 javbus.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @require
// @homepageURL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/458516/javbus%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/458516/javbus%20mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css_text = "body{min-width:1180px !important;width:100% !important;}.wp{width:100% !important;}.ct2 .mn{width:100% !important;}.ct2 .sd{width:100% !important;}.main-right-box{width:100% !important;}.post_inforight{width:90% !important;}.post_infolist{width:100% !important;}.post_infolist_tit a{font-size:5vw !important;}.post_infolist_tit a img{min-width:25vw !important;height:100% !important;}.post_infolist_other{font-size:2vw !important;}#fd_page_bottom .pg{line-height:4vw !important;}#fd_page_bottom .pg strong,#fd_page_bottom .pg a{padding:0 !important;width:6vw !important;height:100% !important;font-size:2vw !important;}.biaoqicn_bjctj li{line-height:4vw !important;}.biaoqicn_bjctj li span{font-size:3vw !important;padding:0 20px !important;margin-right:20px !important;}.biaoqicn_bjctj li a{font-size:3vw !important;}.main-right-tit{height:100% !important;}.main-right-tit span{font-size:3vw !important;}.main-right-zuixin .comment-info{float:left;}.main-right-zuixin .comment-info table{width:100% !important;}.main-right-zuixin .comment-info .diy-image-outer img{}.main-right-zuixin .comment-post a{font-size:3vw !important;}.main-right-zuixin .comment-excerpt{overflow:hidden !important;}.main-right-zuixin .comment-excerpt p a{font-size:1.5vw !important;}.main-right-kuaixu li{overflow:auto !important;height:100% !important;}.main-right-kuaixu .main-right-kuaixu-pic{width:20vw !important;}.main-right-kuaixu .main-right-kuaixu-pic img{width:20vw !important;height:100% !important;}.main-right-kuaixu .main-right-kuaixu-txt{margin-left:1vw !important;float:left !important;width:70vw !important;font-size:2vw !important;}.main-right-kuaixu .main-right-kuaixu-txt a{font-size:3vw !important;max-height:100% !important;line-height:100% !important;}.t_f,.t_f td{font-size:5vw !important;line-height:auto !important;}td.t_f img:not([smilieid]){width:80vw !important;height:100% !important;}.xs1{font-size:3vw !important;}.psta,.psti{line-height:100% !important;}.pstl{padding:1vw 0 !important;}.sign{max-height:100% !important;height:100% !important;}.sign img{width:50vw !important;height:100% !important;max-height:100% !important;}#p_btn i{display:flex !important;justify-content:center !important;align-items:center !important;font-size:3vw !important;background:none !important;background-color:#f1e8c0 !important;}.bui .m img{width:15vw !important;height:100% !important;max-height:100% !important;}.pi{overflow:visible !important;}.authi{font-size:1.5vw !important;}.nthread_info .ts{font-size:4vw !important;}#pt{font-size:2vw !important;}#pt .y{float:left;margin-top:1vw !important;margin-bottom:1vw !important;}.pls{width:15vw !important;}#p_btn{line-height:normal;}.ct2_a .mn{width:100vw;font-size:2vw;}";
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css_text);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css_text);
    } else if (typeof addStyle != "undefined") {
        addStyle(css_text);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css_text));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
})();