// ==UserScript==

// ==Script==
// @name            bili dark mode
// @description     dark mode of bilibili webpage
// @description     B站暗黑模式

// ==Config==
// @include         *://www.bilibili.com/*
// @include         *://t.bilibili.com/*
// @include         *://space.bilibili.com/*
// @connect         www.bilibili.com
// @license         MIT

// ==Require==

// ==Author==
// @author          Sydowlle
// @version         0.0.2
// @namespace       https://space.bilibili.com/346631924

// @downloadURL https://update.greasyfork.org/scripts/475576/bili%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/475576/bili%20dark%20mode.meta.js
// ==/UserScript==

var version = "0.0.2";

(
    function() {


        var style = document.createElement("style");
        style.type = "text/css";


        var scrollbar = document.createTextNode("html {scrollbar-face-color: #1d1f21}");
        style.appendChild(scrollbar);

        // background image style
        var bg_Style = document.createTextNode(".bg,#app .bgc {background-image: none !important;}");
        style.appendChild(bg_Style);

        // body color
        var bodyColor_Style = document.createTextNode("#app,.bili-feed4, body, #app .bgc {background-color: #131516 !important;}")
        style.appendChild(bodyColor_Style); // background

        var block_Style = document.createTextNode(".n, .n .n-inner, .section, .col-1, .bili-comment.browser-pc,.channel-link,.bili-header__channel,.single-card.floor-card .floor-card-inner[data-v-7a866e94],.bili-video-card__wrap.__scale-wrap,.feed-card,.topic-panel,.bili-dyn-banner,.mini-header,.bili-dyn-item,.bili-dyn-live-users,.bili-dyn-publishing,.bili-rich-textarea__inner,.bili-dyn-up-list,.bili-dyn-list-tabs__list,.bili-dyn-my-info,.bili-header {background-color: #181a1b !important }")
        style.appendChild(block_Style);     // block light black

        var innerBlock_Style = document.createTextNode("#nav-searchform, .reply-tag-item,.reply-box.fixed-box[data-v-11f17fb2],.header-channel,.bili-rich-textarea__inner,.dyn-reserve__card,.reference .dyn-ugc__wrap,.dyn-additional-common__wrap,.bili-dyn-card-live__body,.bili-dyn-content__orig.reference,.dyn-goods__wrap,.bili-dyn-card-video__body {background-color: #1d1f21 !important;}")
        style.appendChild(innerBlock_Style);// inner block grey

        var mainFont_Style = document.createTextNode(".name, .nav-title-text .desc-info-text, .hot-sort, .reply-content, #n-gz,#n-fs,#n-bf, .n-text, .n-num, .info-title, .goto-auth, .t, .section-title, .detail, .title, .video-page-card-small .card-box .info .title,.bili-comment.browser-pc,.video-info-v1 .title[data-v-7a866e94],.bili-video-card .bili-video-card__info--tit>a,.bili-rich-textarea__inner,.dyn-reserve__title.bili-ellipsis,.default-entry,.mini-header__title,.relevant-topic__title,.topic-panel__nav-title,.bili-dyn-banner__title,.dyn-ugc__detail__title.bili-ellipsis.multi-line,.mini-header .right-entry .right-entry__outside .right-entry-icon,.dyn-additional-common__detail__title,.bili-dyn-card-live__title.bili-ellipsis,.bili-dyn-card-video__title.bili-ellipsis,.bili-rich-text__content,.bili-dyn-my-info__content,.bili-dyn-my-info__stat__item__count,.bili-dyn-live-users__title,.bili-dyn-live-users__item__uname,.dyn-goods__one__detail__name.bili-ellipsis {color: #d3cfc9 !important}")
        style.appendChild(mainFont_Style);  // white font

        var pinkborder_Style = document.createTextNode(".reply-tag-item,.reference .dyn-ugc__wrap,.bili-dyn-card-video {border: 1px solid #fb7299 !important;}")
        style.appendChild(pinkborder_Style);

        var noborder_Style = document.createTextNode(".section, .col-1, .channel-link {border: none !important;border-style: none !important;}")
        style.appendChild(noborder_Style);

        var upNameNoMember_Style = document.createTextNode(".bili-dyn-title__text.bili-dyn-title__text.default {color: #d3cfc9 !important}")
        style.appendChild(upNameNoMember_Style);

        var topreplyIcon = document.createTextNode(".reply-content-container .reply-content .top-icon{background-color: var(--brand_pink)!important;color:white !important}")
        style.appendChild(topreplyIcon);

        var title = document.createTextNode(".video-title{color:white !important}")
        style.appendChild(title);

        var transparentBackground = document.createTextNode(".be-textarea_inner, .list-create, .h-info .clearfix{background-color: rgba(0,0,0,0) !important}")
        style.appendChild(transparentBackground);


        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }
)();
