// ==UserScript==
// @name         cityheavenで高額店除去(川崎)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://www.cityheaven.net/kanagawa*/girl-list/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29855/cityheaven%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB%28%E5%B7%9D%E5%B4%8E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29855/cityheaven%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB%28%E5%B7%9D%E5%B4%8E%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.each($('#content .girls-list'), function(index, obj) {
        obj = $(obj);
        var tenpo_name = obj.find('.shopname').text();
        if ([
             '無敵（MUTEKI）', // 50k
             'ラフォーレ川崎', // 60k
             'プレイボーイクラブ', // 60k
             'クラブハウスシェル', // 60k
             'アラビアンナイト', // 60k
             'エコ京都', // 京都グループ最安、やばい匂い
             '倶楽部いりす', // 90分~ 30k
             '進撃の夫人', // 人妻系はいらんです
             'ええじゃないか!!', // 10k以下安すぎ怖い
             'SELECTION', // 25k 悪くはない
             'シャングリラ', // 60k
             '秘苑', // コリア系はいらんです
             '金瓶梅', // 60k
             'VIP', // 60k
            ].includes(tenpo_name))
            obj.hide();
    });
})();