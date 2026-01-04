// ==UserScript==
// @name         哔哩哔哩夜间模式
// @namespace    哔哩哔哩夜间模式
// @version      1.1
// @description  保护夜猫子的眼睛
// @author       索姆歪
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://account.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://member.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://music.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494306/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494306/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';



GM_addStyle(`
:root {
    --brand_pink: var(--Pi5);
    --brand_pink_thin: var(--Pi1);
    --brand_blue: var(--Lb5);
    --brand_blue_thin: var(--Lb1);
    --stress_red: var(--Re5);
    --stress_red_thin: var(--Re1);
    --success_green: var(--Gr5);
    --success_green_thin: var(--Gr1);
    --operate_orange: var(--Or5);
    --operate_orange_thin: var(--Or1);
    --pay_yellow: var(--Ye5);
    --pay_yellow_thin: var(--Ye1);
    --bg1: #361919;
    --bg2: #2a3239;
    --bg3: #22262b;
    --bg1_float: #493d3d;
    --bg2_float: #4a535d;
    --text_white: #221919;
    --text1: #98a3c4;
    --text2: #bbbec2;
    --text3: #9bb8bc;
    --text4: var(--Ga3);
    --text_link: #7fa8b8;
    --text_notice: #d9cfc0;
    --line_light: #202933;
    --line_regular: #6f8194;
    --line_bold: #445162;
    --graph_white: #a57e7e;
    --graph_bg_thin: #3f8383;
    --graph_bg_regular: #7e90a3;
    --graph_bg_thick: #546372;
    --graph_weak: #8996a9;
    --graph_medium: var(--Ga5);
    --graph_icon: var(--Ga7);
    --shadow: #4b3e3e;
}

.hidden{
display:none;!important
}

    .bili-header .bili-header__channel .channel-entry-more__link, .bili-header .bili-header__channel .channel-link {

        color: #aeedea;

        border-radius: .5rem;
border:1px solid transparent;
        font-family: inherit;
    }
.bili-video-card__image--wrap {
    border-radius: 1.3rem;
}
.bili-header .search-panel {

    background: #504b4b;

}
 .bili-header .bili-header__channel .channel-entry-more__link, .bili-header .bili-header__channel .channel-link {

        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }
    .bili-video-card__wrap {
transform: scale(0.95);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
.bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input {

    font-style: italic;
    letter-spacing: 0.02rem;
    font-weight: lighter;
}
.bili-header .channel-icons .icon-title {

    color: #99e1c9;
    letter-spacing: 0.08rem;
}
    .recommended-container_floor-aside .container {

        grid-template-columns: repeat(2, 1fr);
    }
    .bili-video-card .bili-video-card__info--right {

    padding: .5rem .8rem;
}

.bili-video-card .bili-video-card__info--icon-text {

    color: #d5b39b;
    background-color: #543d28;

}
.bili-video-card__wrap,
.bili-video-card .bili-video-card__image--wrap,
.bili-video-card .bili-video-card__cover{

    border-radius: .8rem;
}
.bili-header .header-entry-mini .v-img>img {
    border: none;

    box-shadow: rgb(127 127 191 / 25%) 0px 6px 12px -2px, rgb(86 76 76 / 30%) 0px 3px 7px -3px;
}
.bili-header .red-num--message {

    padding: 3px;

    border-radius: 2.8rem;
    background-color: #ca6361;
    color: #fff;
    font-size: 13px;

}
.bili-header .center-search-container .center-search__bar #nav-searchform {

    background-color: #616569;

}
.bili-header .center-search-container .center-search__bar #nav-searchform.is-actived .nav-search-content, .bili-header .center-search-container .center-search__bar #nav-searchform.is-focus .nav-search-content {
    background-color: #60656a;
}
.bili-header .left-entry .default-entry {

    color: #def8eb;
}
.v-img img {

   opacity:0.8;
}

.bpx-player-progress-schedule-buffer{
    background-color: hsl(0deg 16.56% 68.13% / 30%);

}
.bpx-player-progress-schedule-current {

    background-color: #d7426a;
}
.bpx-player-container[data-revision="1"] .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-input, .bpx-player-container[data-revision="2"] .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-input {
    font-family: monospace;
    font-weight: 800;
}
.recommend-list-v1 .rec-footer[data-v-76fb7def] {

    background: #5e6267;

    font-size: medium;
    letter-spacing: 0.03rem;

}

.video-container-v1[data-v-d3d060d8] {

    background-color: #3a3636;

}
.bili-feed4 {

    background-color: #2f1d1d;
}
.bili-comment.browser-pc .comment-container {

    background-color: #322e2e;
    padding-right: 1.25rem;
}
.bpx-docker {

    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}
#page-index .col-1 ,
#page-index .col-2 .section,
.elec .elec-status,
.col-full,
#page-dynamic .col-2 .section,
#page-index #i-ann-content textarea,
.main-container{
    background: #2e2525;
    border: none;

}
.section-title {
    color: #9d9090;

}

#i-masterpiece .small-item .title {

    color: aliceblue;
}

.recommended-swipe-body,
.recommended-swipe,
.bili-header .header,
.bili-header .trending-item ,
.vip-entry-containter[data-v-ae740c54],
.flex-col[data-v-1ae530d2],
.single-card.floor-card .floor-card-inner[data-v-1ae530d2],
.single-card.floor-card[data-v-1ae530d2],
.bili-live-card__wrap,
.b-img__inner img,
.ad-floor-exp .gg-pic,
.reply-header ,
.video-card-ad-small .vcd[data-v-7c4b2c06],
.elec-status,
.elec .elec-status-bg-grey,
.elec-map,
.vip-entry-containter[data-v-ae740c54],
.video-page-game-card-small .card-box[data-v-7f2db3f7],
.vipPaybar_textWrap__QARKv ,
.pop-live-small-mode .pl__card[data-v-68916e85] ,
.pop-live-small-mode .pl__head[data-v-68916e85]{

    display:none;!important
}
#app > div.s-space > div,
#app > div.h,
#navigator,
body, html ,
.n .n-inner,
#id-card .idc-info,
#id-card .idc-action {

    background-color: #463e3e;
}
.video-page-card-small .card-box .pic-box .pic .duration {

    color: #ecc0c0;

    background-color: rgb(0 0 0 / 40%);

}
.reply-warp{
padding-top:1.5rem;}


.i-pin-empty-set {

    background-color: #b2aba2;
}
.bili-comment.browser-pc * {
    color: #9eb7b8;
}


a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {

    color: #acbfcf;

}
.h #h-name {

    color: #fef2e3;
}
.n .n-data .n-data-v {

    color: #d29797;

}
.user-info .user-info-title .info-title[data-v-31d5659a] {

    color: #b7a5a5;

}
#page-index .channel.guest .channel-item .channel-title .channel-name ,
#page-video .page-head__left .video-title ,
#page-audio .row .breadcrumb .item,
#page-article .row .breadcrumb .item,
.breadcrumb .item.cur
{
    font-size: 1.2rem;
    color: #c49c9c;

    letter-spacing: 0.01rem;

}
#page-series-index .channel-item .channel-name[data-v-493154f0] {

    color: #6cc5a0;
    letter-spacing: 0.06rem;

}
#page-index .col-1 .section .more {
    color: #f74f8c;
    border-radius: 999999px;
    font-weight: 550;
    transform: scaleY(1.06) scaleX(1.03) translateX(-3.8px);
}
.elec .elec-count {
    color: #7dbbc9;

}


#page-index .col-2 .section.elec, #page-index .col-2 .section.i-m {

    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
}
#id-card .idc-action{
padding: 1rem;
}
#page-video #submit-video-type-filter {
    background: #3b3f44;

}
#page-collection-detail .channel-detail .content .breadcrumb .item {
    color: #b99b9b;

}
.bui-collapse .bui-collapse-header,
.base-video-sections-v1[data-v-538c7b9a],
.numberList_wrapper___SI4W ,
.eplist_ep_list_wrapper__Sy5N8 .eplist_list_title__48o_y,
.SectionSelector_SectionSelector__TZ_QZ,
.imageList_wrap___f73Z{

    background: #292d31;


    color: #aab1c4;

}
#link-message-container * {

    background-color: #413e33;

}
#page-index .col-2 .section .user-auth.no-auth .no-auth-title .goto-auth {

    color: #cbcbcb;

}
.bili-header .left-entry .download-client-trigger {
  color: #efefef;
}
.pgc-space-follow-item .pgc-item-info .pgc-item-title {

    color: #fccbcb;!important

}
.pgc-space-follow-item .pgc-item-info .pgc-item-desc {

    color: #e9e9e9;!important

}
.cleanMode{
position:fixed;
cursor: pointer;
right: 6px;
text-align:center;
    bottom: 220px;
    z-index: 6;
    background: var(--bg1_float);

    border: 2px solid var(--line_regular);
    border-radius: 0.8rem;
    box-sizing: border-box;
    padding: 6px;
    margin-bottom: 6px;

    color: var(--text1);
    line-height: 14px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
}
#link-message-container * {
    color: #00d6d6;

}
.RecommendItem_wrap__5sPoo .RecommendItem_right_wrap__DJpVw .RecommendItem_title__jBsvL ,
.numberListItem_title__LNXrS{

    color:#b7e7ed;}


    .SectionSelector_SectionSelector__TZ_QZ .SectionSelector_expand__VjjPD,
    .mediainfo_mediaRight__SDOq4 .mediainfo_media_desc__FdCrM i ,
    .mediainfo_mediaRight__SDOq4 .mediainfo_media_desc_section__Vkt2t .mediainfo_display_area__ggRQT .mediainfo_ellipsis__gHItY, .RecommendItem_title__jBsvL {
    background:transparent;}
.video-container-v1[data-v-c3f91cea] {

    background-color: #1f1b1b;

}

`)
/*const cleanMode = document.createElement("button");
cleanMode.classList.add("cleanMode");
    cleanMode.textContent="关闭评论";
document.body.appendChild(cleanMode);
const reply=document.querySelector("#comment > div > div > div > div.reply-warp");

  cleanMode.addEventListener("click",()=>{
      console.log(reply);
 reply.classList.toggle("hidden");


  });*/

    // Your code here...
})();