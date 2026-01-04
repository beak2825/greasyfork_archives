// ==UserScript==
// @name        网页恢复原色
// @namespace   
// @include     *
// @version     1.0.2
// @author       windy0220
// @match        *
// @grant       none
// @description 针对某些情况下网页变成黑白，眼睛实在是难受，没有对所纪念之人的不敬。
// @downloadURL https://update.greasyfork.org/scripts/399465/%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%8E%9F%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/399465/%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%8E%9F%E8%89%B2.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head,
        style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('html,body,div,span,p,ul,li{filter:none!important;}');
// 针对百度
addGlobalStyle('body.qm-activity #head_wrapper, body.qm-activity #s_menu_gurd, body.qm-activity #u1, body.qm-activity #u_sp, body.qm-activity .s-ctner-menus .s-menu-item-underline, body.qm-activity .s-news-rank-content, body.qm-activity .s-news-wrapper .s-news-list-wrapper .hot-point, body.qm-activity .s-news-wrapper .s-news-list-wrapper img.s-news-img, body.qm-activity .s-top-left.s-isindex-wrap{filter:none!important;} ');