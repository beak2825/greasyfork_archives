// ==UserScript==
// @name         cityheavenで高額店除去
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  try to take over the world!
// @author       You
// @match        https://www.cityheaven.net/tokyo/girl-list/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29365/cityheaven%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/29365/cityheaven%E3%81%A7%E9%AB%98%E9%A1%8D%E5%BA%97%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.each($('#content .girls-list'), function(index, obj) {
        obj = $(obj);
        var tenpo_name = obj.find('.shopname').text();
        if (['11チャンネル', '深海魚', 'シャガール', 'オーキッド倶楽部', 'クラブレジーナ',
             '嬢王蜂', '多恋人倶楽部', 'クラブ貴公子', 'ドンファン', 'シーザースパレス',
             'セリアオペラ', 'サンタモニカ', '女帝', 'カモミール', '秘書室',
             'コートダジュール', 'ティアラ', '王様と私', '夕月', 'ムーランルージュ',
             'ルーブル', 'メンズソシアルクラブ 王室', '恵里亜 ',
             'メイドマスター', // なんか怖い
             'クリスタルシャトー　エヂンバラ',
             'ハニーコレクション', // 検索を汚染している
             'ハニーカンパニー', // 系列なので。同じく汚染疑惑
             'DOLCE', // 怖い
             'エンブレムクラブ', // 高い
             '薔薇の園', // 高い
             '金瓶梅', // いい記憶がない
             '東京夢物語', // 太い,いい記憶がない,ウェスト表記詐欺、修正強し
             'トレンディ', // 太い,いい記憶がない,ウェスト表記詐欺、修正強し
             'プリマドンナ', // 太い,いい記憶がない,ウェスト表記詐欺、修正強し
             'ソレイユ', // 高い
             'マンダリン', // 高い
             '特別室', // 高い
             'GLACES', // 高い
             'Chocolat （ショコラ）', // 年増系
             'ドンファン', // 高い、新宿
             'アスコットクラブ', // 高い
             'ビッグマン', // 2/2ハズレでブラックリスト入り
            ].includes(tenpo_name))
            obj.hide();
    });
})();