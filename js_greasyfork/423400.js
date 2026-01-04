// ==UserScript==
// @name         动漫花园(share.dmhy.org)头部广告隐藏 2021年3月17日
// @namespace    https://or2.fun
// @version      0.5
// @description  自动隐藏动漫花园(share.dmhy.org)头部广告
// @author       Freeeeeedom
// @match     *://share.dmhy.org/*
// @match     *://*.dmhy.org/*
// @match     *://dmhy.org/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/423400/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28sharedmhyorg%29%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%202021%E5%B9%B43%E6%9C%8817%E6%97%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/423400/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28sharedmhyorg%29%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%202021%E5%B9%B43%E6%9C%8817%E6%97%A5.meta.js
// ==/UserScript==

$(document).ready(function(){
    $('#1280_adv img').hide();
    $('#1280_ad a img').hide();
    $('#pkpk').hide();
    $(".ad").remove();
    $("#before-comment").remove();
    $("body > div.container:nth-child(1) > div.bg > div.main:nth-child(2) > div.topics_bk.ui-corner-all:nth-child(11) > div.topic-main:nth-child(2) > div.topic-title.box.ui-corner-all:nth-child(1) > div.info.relative-goods").remove();
})