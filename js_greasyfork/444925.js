// ==UserScript==
// @name         Mynet Dark Theme
// @name:tr      Mynet Karanlık Tema
// @namespace    https://gitlab.com/mburakg/MynetDarkTheme
// @version      0.224
// @description  Dark Theme For Mynet
// @description:tr  Mynet için karanlık tema
// @author       @mbrkg
// @match        https://www.mynet.com/
// @include      https://www.mynet.*
// @include      https://finans.mynet.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mynet.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444925/Mynet%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/444925/Mynet%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    let css = `
             body.detail-page, .my-footer-new,.myLogin,.col-sidebar .most-viewed-shares .line-list, .col-sidebar .most-viewed-shares .sub-title,.col-sidebar .most-viewed-shares .sub-title, .mainButtons .btnNew, .widget-card .widget-heading-selectbox,.service-sub-menu,.reaction-box-wrapper,.detail-content-inner .others-news a,.container,.most-find-news-container .container,.my-open-footer-box,.my-open-menu,.my-header,body,.my-wrap,.top-slider .box-news-item,.card,.finance-bar-foot-information,.most-find-news-container-seo .find-news-container,.tab2,.finance-tabs,.finance-tab-content-foot,.finance-tabs a{
                 background: black!important;
             }
             .h-title,.gallery-item-exerpt, #contextual> h2,.detail-content-inner > ul > li ,.widget-card .widget-heading-selectbox select,h3,.count-text,.emoji-text,.reaction-box-wrapper h2,.detail-content-inner .others-news a .others-tile,.pb-1,.detail-content-inner .h2, .detail-content-inner h2,.detail-content-inner p,.post-spot,.post-title,a,.most-find-news-container .news-list li a,.most-find-news-container .container,.h-sidebar-title,.my-footer-quicklink-box a,.my-open-menu-box li a,.my-nav a span,.carousel-3 .carousel-title,.keyclass,.card, .top-slider .box-news-item li,.dynamic-price-EURTRY,.liveName,.carousel-2 .carousel-title,.most-find-news-container-seo .find-news-container,.most-find-news-container-seo .news-list li a ,.finance-tab-content-head-col-1 span,.finance-tab-content-head-col-2 span,.finance-tab-content-head em{
                 color: #bec9d3!important;
             }
             .news-row {
                 display:none!important;
             }
             .most-find-news-container-seo .find-news-container{
                 border-bottom: inset 2px #bec9d3;
             }
             .finance-tabs a.active{
                 color:#ff6400;
             }
             .my-header{
                 border-top:unset;
             }
             .service-sub-menu li:before{
                 background:#bec9d3!important;
             }
             .myLogin{
                 border: 1px solid #bec9d3!important;;
             }
             `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    }
    else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();