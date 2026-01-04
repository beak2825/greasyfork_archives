// ==UserScript==
// @name         Sondakika.com Dark Theme
// @name:tr      Sondakika Karanlık Tema
// @namespace    https://gitlab.com/mburakg/Sondakika-comDarkTheme
// @version      0.33
// @description  Dark Theme For Sondakika.com
// @description:tr Sondakika.com için Karanlık Tema
// @author       @mbrkg
// @match        https://www.sondakika.com/
// @include      https://www.sondakika.*
// @include      https://portal.sondakika.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sondakika.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444916/Sondakikacom%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/444916/Sondakikacom%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    let css = "";
    if((document.location.href.indexOf("https://www.sondakika") == 0 || document.location.href.indexOf("https://portal.sondakika") == 0)){
        css += `
             .news-row > .news-item.news-box-type3, .sondakika-doviz.withleft, .risayac, .ritarih{
                 background: #bec9d3!important;
             }
             body, .doviz-row, body, .sondakika-doviz.withleft, .risayac, .ritarih, .news-row > .news-item > .wrapper > a > span,.comment-container,.seoContentRight,.loadafterst,.category-inner,.login-container,.login-page .grand-container,.imssol,.detail-page .detail-content a.spot,.sondakika-doviz{
                 background: black!important;
             }
             .doviz-row .dvz-col .dvz-title, .detail-page .form .form-row h3, .detail-page .comment-list > h3, .news-big-date, .detay-v3_3 ul a.keyword-sd,.keyclass,.detail-page .detail-content a.spot,.bx-wrapper .bx-caption span label,.imsakMainScope .imsakHeader .timerScope .timerMain .jst-seconds span,.imsakMainScope .imsakHeader .timerScope .timerMain .jst-minutes span,.imsakMainScope .imsakHeader .timerScope .timerMain .jst-minutes span,.imsakMainScope .imsakHeader .timerScope .timerMain .jst-hours span, .hbpProvinceName>span,.locn-h1,.category-page > main > ul.news-list li > .news-detail,.title,hr,.news-list-title>h1,.news-list-title>h2,.breadCrumbText>a>span,.breadRightArrow,.breadCrumbText>a>span,.sondakika-doviz .sdCol .sdTitle, #iller, #sayim, .ritarih1, .ritarih2, .ritarih3, .ritarih4, #vaktin_adi, .news-row > .news-item > .wrapper > a > span, .news-row > .news-item > .wrapper::before, .news-row > .news-item > .big-date, .bx-slider-sondakika .bx-pager a,.bx-slider-sondakika .bx-pager .active,.haber_baslik, #spot, .wrapper.detay-v3_3.haber_metni.pad-bot-20>p,.keyword-sd,.wrapper, .wrapper>p,.detay-v3_3 h3,.detay-v3_3 a,.comment-container,.clockStyles,.seoTextStyle>a,.seoTextStyleTitle>h4{
                 color: #bec9d3!important;
             }s
             .news-row > .news-item > .wrapper > a::after,inpage_reklam,.kalip,.news-row > .news-item > .wrapper > a::after{
                 display:none!important;
             }
             .news-row > .news-item{
                 border-bottom: 1px solid #bec9d3!important;
             }
             .bx-slider-sondakika .bx-pager a{
                 border-bottom:unset!important;
             }
             .bx-slider-sondakika .bx-pager .active{
                 border-top:5px solid #bec9d3;
             }
             .bx-slider-sondakika .bx-pager a{
                 border-top:unset;
             }
             .loadafterst,.sondakika-doviz{
                 border-style:none;
             }
             .paperlist-page > h1{
                 border-bottom:1px solid #bec9d3;
             }
             .ribaslik{
                 border-radius:30px;
             }
             .detay-v3_3 ol a.keyword-sd, .detay-v3_3 ul a.keyword-sd{
                 color: unset!important;
             }
             .news-big-date{
                background: unset!important;
             }
             `;
    }
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    }
    else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();