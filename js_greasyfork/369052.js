// ==UserScript==
// @name         BitAsk问题回答数<=5置顶并高亮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.bitask.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369052/BitAsk%E9%97%AE%E9%A2%98%E5%9B%9E%E7%AD%94%E6%95%B0%3C%3D5%E7%BD%AE%E9%A1%B6%E5%B9%B6%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/369052/BitAsk%E9%97%AE%E9%A2%98%E5%9B%9E%E7%AD%94%E6%95%B0%3C%3D5%E7%BD%AE%E9%A1%B6%E5%B9%B6%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var newlist = [];
    var maxNum = 5;
    var others = [];

    if (location.href === 'https://www.bitask.org/') {
        setTimeout(function () {
            location.reload();
        }, 60*1000);
    }

    // 问题数少于 5 条
    if ($(".aw-item").length <= 5) {
        return ;
    }

    // 过滤出回复数 <= maxNum 的问题
    $(".aw-item").each((i, e, a) => {
        var r = new RegExp("(\\d+)\\s+个回复", "igm");
        var found = r.exec(e.innerText);
        // console.log(e.innerText, found);
        if (found && found.length >= 2) {
            var num = parseInt(found[1]);
            var self = $('body > div.aw-top-menu-wrap > div > div.aw-user-nav > a').attr('href');
            // 过滤回复数，过滤已回答的（不太准）
            if (num <= maxNum && e.outerHTML.indexOf(self) === -1) {
                newlist.push(e);
            } else {
                others.push(e);
            }
        }
    });

    // 给问题设置颜色
    newlist.forEach((e, i, a) => {
        e.style.backgroundColor = '#efe';
    });

    // 重置问题列表
    $(".aw-common-list").html('');
    newlist.forEach((e) => {
        $(".aw-common-list").append(e);
    });
    others.forEach((e) => {
        $(".aw-common-list").append(e);
    });

    // 统计新问题
    var existedNews = JSON.parse(localStorage.getItem('existedNews') || '[]');
    var newsDict = {};
    var pureNewsCnt = 0;

    if (existedNews.length > 50) {
        existedNews.shift();
    }

    for (let t of existedNews) {
        newsDict[t] = true;
    }
    newlist.forEach(e => {
        var title = $(e).find('h4').text().trim();
        if (!newsDict[title]) {
            console.log(`[${title}]`, newsDict);
            newsDict[title] = true;
            pureNewsCnt ++;
            existedNews.push(title);
        }
    });
    localStorage.setItem('existedNews', JSON.stringify(existedNews));
    if (pureNewsCnt > 0) {
        setTimeout(function () {
            document.title = pureNewsCnt;
        }, 1000);
    }
})();