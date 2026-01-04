// ==UserScript==
// @name         线报酷去新浪
// @description  线报酷去新浪垃圾
// @match        *://new.xianbao.fun/*
// @namespace    Violentmonkey Scripts
// @grant        none
// @version 1.4
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540798/%E7%BA%BF%E6%8A%A5%E9%85%B7%E5%8E%BB%E6%96%B0%E6%B5%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/540798/%E7%BA%BF%E6%8A%A5%E9%85%B7%E5%8E%BB%E6%96%B0%E6%B5%AA.meta.js
// ==/UserScript==
//两种方式去垃圾，1是匹配新浪网站，2是匹配用户名，现在用第一种
(function() {
    'use strict';
    function checkPage1() {
        var listItems = document.querySelectorAll('li.article-list');
        listItems.forEach(function(item) {
            var linkElement = item.querySelector('a');
            if (linkElement && website.some(keyword => linkElement.href.includes(keyword))) {
                item.style.display = "none";
            }
        });
    }
    function checkPage2() {
        var listItems = document.querySelectorAll('li.article-list');
        // 遍历每个 <li> 元素
        listItems.forEach(function(item) {
            var linksWithDataLouzhu = item.querySelectorAll('a[data-louzhu]');
            linksWithDataLouzhu.forEach(function(link) {
                var louzhuValue = link.getAttribute('data-louzhu');
                if (blacklist.includes(louzhuValue)) {
                    item.style.display = "none";
                }
            });
        });
    }
    var blacklist=['拼夕夕水果bot','薅羊毛的大队长','光芒呀shine','无敌','佩奇线报','天涯花花的百宝袋',
                  '一只小浪蹄','好心天天分享','圆仔小朋友','披着羊毛的魔鬼','蘑菇小牙牙',
                  '找不到此id','丐帮羊毛日记','momo','mike12138','小屁屁挖白菜','小屁屁找',
                  '线报酱','败家少女的日常','白菜']
    var website=['weibo','haodan']
    setInterval(checkPage1, 1000);
})();