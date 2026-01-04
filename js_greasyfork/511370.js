// ==UserScript==
// @name         司机社自动回复改
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  帮助自动回帖
// @author       zzx114
// @match        https://xsijishe.com/*
// @match        https://xsijishe.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511370/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/511370/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%94%B9.meta.js
// ==/UserScript==
(function() {
    var $ = jQuery.noConflict();

    //判断是否回复过
    var locked = $(".locked").text() != "" ? true: false;
    //如果没有回复
    if (locked) {
        var text = $(".locked").text();
        // 判断文本是否包含 "购买主题" 这个字段
        if (text.indexOf('购买主题') !== -1) {
            console.log('文本中包含 "购买主题"');
        } else {
            if (text.indexOf('如果您要查看本帖隐藏内容请') !== -1) {
                //模拟回复
                $("[name=message]").val("看了LZ的帖子，我只想说一句很好很强大！");
                $("#fastpostsubmit").click();
                setTimeout(function() {
                    scrollTo(0, 0);
                    location.reload()
                },
                3000);
            }
        }
    }
})()