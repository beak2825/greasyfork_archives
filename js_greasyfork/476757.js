// ==UserScript==
// @name         虎扑pc样式转手机样式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  手机浏览器打开虎扑pc页面,转换成手机样式,方便浏览
// @author       zwxbest
// @match        https://bbs.hupu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hupu.com
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @resource     bootstrap https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/476757/%E8%99%8E%E6%89%91pc%E6%A0%B7%E5%BC%8F%E8%BD%AC%E6%89%8B%E6%9C%BA%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/476757/%E8%99%8E%E6%89%91pc%E6%A0%B7%E5%BC%8F%E8%BD%AC%E6%89%8B%E6%9C%BA%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let url = window.location.href;
    let isContent = url.includes(".html");
    if (isContent) {

    } else {
        styleTopic();
    }

})();

//给帖子列表页调整样式
function styleTopic() {


    let head = $("head").first();
    head.append($('<meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport">'))
    // head.append($('<meta content="width=414px,initial-scale=1.0,minimum-scale=1.0" name="viewport">'))

    let nav = $(".bbs-sl-web-nav").first();
    nav.css("display", "none");

    let webbody = $(".bbs-sl-web-body").first();
    webbody.css("width", "100%");

    let topicbody = $(".bbs-sl-web-topic-wrap").first();
    topicbody.css("max-width", "100%");

    // 不显示bbs-sl-web-post-header
    let postheader = $(".bbs-sl-web-post-header").first();
    postheader.css("display", "none");


    $(".bbs-sl-web-post-layout").each(function (i2, e2) {

        let titleele = $(this).find(".post-title").first();
        let authoele = $(this).find(".post-auth").first();
        let dataele = $(this).find(".post-datum").first();
        let posttimeele = $(this).find(".post-time").first();
        let pageicon = $(this).find(".page-icon").first();
        let lighticon = $(this).find(".light-icon").first();


        let datatime = $("<div class = 'post-data-time'style='display: flex;flex-direction: row'></div>")
        datatime.append(dataele)
        datatime.append(posttimeele)
        $(this).append(datatime)

        let title = titleele.html();
        let author = authoele.html();
        let data = dataele.text();
        let post_time = posttimeele.text();

        titleele.find(".p-title").first().css("max-width", "100%");
        lighticon.css("display", "none");
        pageicon.css("display", "none");

    })

    let css = `
    .bbs-sl-web {
        min-width: 100% !important;
    }
    .bbs-sl-web-post-layout > div{
        flex-basis:auto !important;
    }
    .bbs-sl-web-post-layout > div {
        padding: 0  !important;
    }
    .bbs-sl-web-post-body .post-auth{
        order:-99;
     }
     .post-data-time{
         margin-top: 12px;
     }
     .post-data-time div {
         padding: 0px 20px 0px 0px !important ;
         color: #89909f !important;
         font-size: 13px !important;
      }
      .bbs-sl-web-post-layout {
          flex-direction: column !important;
          max-height: 100% !important;
          align-items: flex-start !important;
          padding: 10px !important;
      }
      .bbs-sl-web-post-layout .post-title {
          margin-top: 8px !important;
      }
      .bbs-sl-web-post-layout .post-title a {
          font-size: 17px !important;
          color: #24262b !important;
      }
      .hupu-rc-pagination-item {
            display: none !important;
       }
       .bbs-sl-web-post-body .post-title a {
            overflow: auto !important;
            white-space: normal !important;
       }
       .hp-pc-menu-sub-menu,
       .hp-pc-rc-TopMenu-banner,
       .hp-quickNav,
       .bbs-sl-web-intro-detail-button{
            display: none !important;
       }
    `

    GM_addStyle(css)
}

function styleContent() {

}

