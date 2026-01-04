// ==UserScript==
// @name         去除【社区指导原则】的伪装回答
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去除【社区指导原则】的伪装回答(bgm.tv、bangumi.tv、chii.in)
// @author       老悠
// @include      https://bgm.tv/*
// @include      https://bangumi.tv/*
// @match        https://chii.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527389/%E5%8E%BB%E9%99%A4%E3%80%90%E7%A4%BE%E5%8C%BA%E6%8C%87%E5%AF%BC%E5%8E%9F%E5%88%99%E3%80%91%E7%9A%84%E4%BC%AA%E8%A3%85%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/527389/%E5%8E%BB%E9%99%A4%E3%80%90%E7%A4%BE%E5%8C%BA%E6%8C%87%E5%AF%BC%E5%8E%9F%E5%88%99%E3%80%91%E7%9A%84%E4%BC%AA%E8%A3%85%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let keywords = ["社区指导原则", "指导", "原则", "社区"];

    $(".sub_reply_collapse").each(function() {
        let content = $(this).text();
        if(content.indexOf('\u202E')>-1){
            content=content.split('').reverse().join('');
        }
        content = content.replace(/\s+/g, "").replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
        let containsKeyword = keywords.some(keyword => content.includes(keyword));

        if (containsKeyword && $(this).find('span.ico.ico_reply').length > 0) {
            $(this).removeClass('sub_reply_collapse');
            let html = $(this).find(".cmt_sub_content").html();
            $(this).find(".cmt_sub_content").html("【戏仿回复】" + html);
        }
    });
})();