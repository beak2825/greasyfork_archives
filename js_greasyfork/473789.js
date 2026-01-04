// ==UserScript==
// @name         【泛用-图片】原图替换
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  原图替换
// @author       You
// @match        *://*.bilibili.com/*
// @match        *://*.taptap.cn/*







// @grant        none
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/473789/%E3%80%90%E6%B3%9B%E7%94%A8-%E5%9B%BE%E7%89%87%E3%80%91%E5%8E%9F%E5%9B%BE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/473789/%E3%80%90%E6%B3%9B%E7%94%A8-%E5%9B%BE%E7%89%87%E3%80%91%E5%8E%9F%E5%9B%BE%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {

    //18109384135把蜜蜂当宠物
    'use strict';

    let url = window.location.href;
    let domain = document.domain;
    let rules = [];
    let dels = [];
    console.log('url：' + url);

    if (domain.match("bilibili.com")) {
        console.log('[原图替换] 哔哩哔哩');
        rules = [
            ['img','src',/\b\.jpg@[0-9]{2,4}w[^ ]*\b/,'.jpg'],
            ['img','data-src',/\b\.jpg@[0-9]{2,4}w[^ ]*\b/,'.jpg'],
            ['source','srcset',/\b\.jpg@[0-9]{2,4}w[^ ]*\b/,'.jpg'],
        ];
        dels = [
            "#navigator-fixed > div > div.n-inner.clearfix > div.n-tab-links > a.n-btn.n-index.n-fans.n-404.router-link-exact-active.router-link-active.active > span.n-avatar > div > picture"
            //.remove();
        ];
    }
    else if (domain.match("taptap.cn")) {
        console.log('[原图替换] TapTap');
        rules = [
            ['img','src',/\b\.png\?imageMogr2[^ ]*\b/,'.png'],
            //['img','src','tb-left auto_switch'],//顶部
        ];
    }

    // 获取img
    function getTags(tagType, styleType, beforeText, afterText) {
        let tags = document.querySelectorAll(tagType);

        tags.forEach(function(tag){
            let tagText = tag.getAttribute(styleType);
            console.log('imgText的内容为：' + tagText);

            //if (tagText && tagText.includes(beforeText)) {
            if (tagText) {
                tagText = tagText.replace(beforeText, afterText);
                tag.setAttribute(styleType, tagText);
            }
        });
    }

    // 删除
    function delTags(del) {
        let delElement = document.querySelector(del);
        if (delElement) {
            delElement.remove();
        }
    }

    function goGetTags() {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            getTags(rule[0], rule[1], rule[2], rule[3]);
        }
        for (let j = 0; j < dels.length; j++) {
            let del = dels[j];
            delTags(del);
        }
    }

    setInterval(goGetTags, 5000);

})();