// ==UserScript==
// @name         playgirl.ne.jpで高額店除去
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        http://playgirl.ne.jp/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29364/playgirlnejp%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/29364/playgirlnejp%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.each($('#searchResult > tbody table'), function(index, obj) {
        obj = $(obj);
        var tenpo_name = obj.find('tbody > tr > td:nth-child(2) > a:nth-child(1)').text();
        console.log(tenpo_name);
        if (['シャガール', 'オーキッド倶楽部', 'クラブレジーナ', '嬢王蜂', '多恋人倶楽部', 'クラブ貴公子', 'ドンファン', 'シーザースパレス', 'セリアオペラ', 'サンタモニカ'].includes(tenpo_name))
            obj.hide();
    });
})();