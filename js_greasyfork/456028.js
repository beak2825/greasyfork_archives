// ==UserScript==
// @name         去灰色脚本
// @namespace    http://tampermonkey.net/
// @description  黑白网页恢复彩色，匹配所有网页，即装即用
// @author       fuce
// @license MIT
// @version      1.2
// @match        https://*/*
// @match        http://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456028/%E5%8E%BB%E7%81%B0%E8%89%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456028/%E5%8E%BB%E7%81%B0%E8%89%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


// 添加 css 样式
function addStyle() {
    let css = `
    html{
       filter: grayscale(0%) !important;
       -webkit-filter: grayscale(0%) !important;
       -moz-filter: grayscale(0%) !important;
       -ms-filter: grayscale(0%) !important;
       -o-filter: grayscale(0%) !important;
    }

    body.big-event-gray #aging-tools-pc div[class^=item-wrap],body.big-event-gray #bottom_layer,body.big-event-gray #bottom_layer .tip-hover-panel,body.big-event-gray #form,body.big-event-gray #passport-login-pop,body.big-event-gray #s-hotsearch-wrapper,body.big-event-gray #s_content_1,body.big-event-gray #s_content_100,body.big-event-gray #s_menu_gurd,body.big-event-gray #s_side_wrapper,body.big-event-gray #u1,body.big-event-gray .advert-shrink,body.big-event-gray .bdlayer,body.big-event-gray .popup-advert,body.big-event-gray .s-ctner-menus .s-menu-item-underline,body.big-event-gray .s-menu-container,body.big-event-gray .s-news-rank-wrapper,body.big-event-gray .s-skin-container.skin-gray-event,body.big-event-gray .s-top-left-new.s-isindex-wrap,body.big-event-gray .under-searchbox-tips,body.big-event-gray div[class^=cards_pop] {
	filter: grayscale(0%) !important;
       -webkit-filter: grayscale(0%) !important;
       -moz-filter: grayscale(0%) !important;
       -ms-filter: grayscale(0%) !important;
       -o-filter: grayscale(0%) !important;
    }


    body.big-event-gray #head_wrapper .sam_search .s_btn, body.big-event-gray #su, body.big-event-gray .wrapper_new .s_btn_wr .s_btn {
background-color: #4e6ef2;
    }


    `

    GM_addStyle(css)
}

function baidu(){
    if(window.location.host.indexOf("baidu")!=-1){
       $("#lg img").each(function(each,a){
       $(a).attr("src",$(a).attr("src").replaceAll("_gray",""));
   });
    }
}
(function() {
    'use strict';

baidu();
setTimeout(function(){
addStyle();
    console.log("sssssssss");

},100)


})();
