/* global        $ */
// ==UserScript==
// @name         京东天猫晒单查看大图
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  给京东、天猫、淘宝评晒单及评价中的图片添加一个“查看大图”的按钮
// @author       ssyatelandisi
// @match        *://*.jd.com/*
// @match        *://*.tmall.com/*
// @match        *://*.taobao.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373983/%E4%BA%AC%E4%B8%9C%E5%A4%A9%E7%8C%AB%E6%99%92%E5%8D%95%E6%9F%A5%E7%9C%8B%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/373983/%E4%BA%AC%E4%B8%9C%E5%A4%A9%E7%8C%AB%E6%99%92%E5%8D%95%E6%9F%A5%E7%9C%8B%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // @ts-ignore
    GM_addStyle(`#JDopenNewImg{color:#288cf0;border:2px #288cf0 solid;background-color:rgba(255,255,255,.75);border-radius:5px;padding:5px;cursor:pointer;position:absolute;top:0;right:0;z-index:9999;font-weight:normal}#JDopenNewImg:hover{color:#fff;border-color:#288cf0;background-color:#288cf0;font-weight:bolder}#TMopenNewImg{color:#288cf0;border:2px #288cf0 solid;background-color:rgba(255,255,255,.75);border-radius:5px;padding:5px;cursor:pointer;position:absolute;top:0;left:0;z-index:9999;font-weight:normal}#TMopenNewImg:hover{color:#fff;border-color:#288cf0;background-color:#288cf0;font-weight:bolder}#TBopenNewImg{color:#288cf0;border:2px #288cf0 solid;background-color:rgba(255,255,255,.75);border-radius:5px;padding:5px;cursor:pointer;position:absolute;top:0;left:0;z-index:99999;font-weight:normal}#TBopenNewImg:hover{color:#fff;border-color:#288cf0;background-color:#288cf0;font-weight:bolder}
`);
    /* 京东 */
    //查看晒单大图
    $("body").on("mouseenter", "div.imgs div.term", function () {
        const that = this;
        $(this).prepend('<button id="JDopenNewImg"><b>查看大图</b></button>');
        $("button#JDopenNewImg").on("click", function () {
            const regex1 = /n\d{1,2}/;
            const regex2 = /s\d+x\d+_/;
            const imgLink = $(that).find("img")[0].src;
            let newImgLink = imgLink.replace(regex1, "shaidan");
            newImgLink = newImgLink.replace(regex2, "");
            window.open(newImgLink);
            return false;
        });
        return false;
    });
    $("body").on("mouseleave", "div.imgs div.term", function () {
        $("button#JDopenNewImg").remove();
        return false;
    });
    //查看评论大图
    $("body").on("mouseenter", ".jdc-image", function () {
        const that = this;
        $(this).prepend('<button id="JDopenNewImg"><b>查看大图</b></button>');
        $("button#JDopenNewImg").on("click", function () {
            const regex2 = /s\d+x\d+_/;
            const imgLink = $(that).find("img")[0].src;
            const newImgLink = imgLink.replace(regex2, "");
            window.open(newImgLink);
            return false;
        });
    });
    $("body").on("mouseleave", ".jdc-image", function () {
        $("button#JDopenNewImg").remove();
        return false;
    });
    /* 天猫 */
    $("body").on("mouseenter", "div div div div div div div div div div div div div div div div div", function () {
        const that = this;
        $(this).prepend('<button id="TMopenNewImg"><b>查看大图</b></button>');
        $("button#TMopenNewImg").on("click", function () {
            const regex = /_450x.+\.jpg(_\.webp)?/;
            const imgLink = $(that).find("img")[0].src;
            const newImgLink = imgLink.replace(regex, "");
            window.open(newImgLink);
            return false;
        });
    });
    $("body").on("mouseleave", "div div div div div div div div div div div div div div div div div", function () {
        $("button#TMopenNewImg").remove();
        return false;
    });
    /* 淘宝 */
    $("body").on("mouseenter", "div div div div div div div div div div div div div div div div div img[data-appeared='true']", function () {
        const that = this;
        $(this).parent().prepend('<button id="TBopenNewImg"><b>查看大图</b></button>');
        $("button#TMopenNewImg").on("click", function () {
            const imgLink = that.src;
            window.open(imgLink);
            return false;
        });
    });
    $("body").on("mouseleave", "div div div div div div div div div div div div div div div div div img[data-appeared='true']", function () {
        $("button#TBopenNewImg").remove();
        return false;
    });
})();
