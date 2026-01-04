// ==UserScript==
// @name         CorePixiver2
// @namespace    none
// @version      1.3.0.20251020
// @description  Pixivの小説検索ページで動作するブラックリスト
// @author       4ma9ry
// @match        https://www.pixiv.net/*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// @noframes
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/486952/CorePixiver2.user.js
// @updateURL https://update.greasyfork.org/scripts/486952/CorePixiver2.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(function(){
    console.log('CP2: 開始')

    // 1-1 ブラックリストの定義
    var blacklist = [
        // 小説
        82923419, // Karumen
        45202135, // 了解
        20050275, // ダシマ
        82482187, // キムチ
        78718579, // 東海帝王
        40812130, // 暇人の溜まり場2号店
        46481529, // 機関銃野郎
        71071170, // ブルー
        78937295, // プププ
        29822029, // ルクス
        94742777, // すたどん
        57003396, // たぶち
        72386118, // シンハマ
        80303913, // タイピングしかできない脳無し
        76251226, // とめい10
        55520806, // 霧鮫雪地
        1652491, // ラリッ☆熊
        43832372, // Nø.4h
        78408282, // 五月夕立
        50493050, // ミヤハル
        88850043, // 米問屋
        81924752, // もうちゃん
        70765202, // 連邦の人
        40733809, // 多聞丸
        20517410, // セロ＠ミッドナイト・シチー
        49666323, // 仮眠
        94680029, // 尾形一一四五一四之助
        41370917, // 佐久間有限
        76034277, // のん
        90062651, // 白いモルモット
        61791391, // 一般羊
        91905615, // たかまさ
        72225822, // ヨークシャはいつも最強　執筆中
        79779510, // K.H
        61954371, // teruko
        100263452, // 虹芋タルト
        73939499, // anan
        71355377, // びょい
        89126822, // 千夜牙龍(テイオー大好き)
        74097458, // のり弁総本店
        77771545, // 天川カミト@目白家
        81279923, // 椛
        17629838, // nanashi
        56637748, // ぱろめ
        94944049, // ただの人
        48476145, // 武者修行ェ
        51734536, // 砂糖醤油
        37956256, // しか
        94228280, // 高牧園🔞有償リク受付中💖
        46895218, // ありさ
        83340648, // コマアサラシ
        10551561, // 強欲の道化師・本店
        94531813, // OTYA
        101879568, // みさし
        90794329, // みみみ
        31325862, // グラット
        57445283, // すなかけ
        72999536, // 植取
        89006152, // しんしあ
        30298187, // 慢心ヒャッハー
        17001686, // 小説書き始めた鳥らしき何か
        43025180, // ユーラス・ランティモス
        70831215, // saradaba-
        2467259, // さざんか
        63268005, // tm甘雨好き
        74834467, // ねむ
        76521066, // 黒峰奈凪
        100376983, // ri_
        87610606, // 丸井マール
        97671790, // 蒼
        104180547, // 小さな聴診器
        80117057, // 竹野小太郎
        61233555, // 監督B
        108097064, // クロワッサン
        87610606, // 天原まーる
        70875119, // 浅井靖大
        103641716, // わらりる
        85111598, // ホシノ推しのryu
        108778819, // ホシノ純愛
        100282245, // Toki@fanbox開設
        102880449, // 有珠墨
        18083760, // しゃちほ子
        51701976, // アルケード@マイペース
        87610606, // 天原まーる
        99778833, // すなわち
        115409167, // ひぴ
        73695719, // KK
        100585689, // 翔
        117200602, // 刺傷
    ];

    // 1-2 イラストランキング用のNGタグ
    var ng_tag_list = [
        "NTR",
        "筋肉娘",
        "筋肉",
        "BL",
        "男の娘",
        "ドMホイホイ",
        "ショタ",
        "女装男子",
        "輪姦",
        "逆アナル",
        "ゲイ",
        "獣姦",
        "百合",
        "女先生(ブルーアーカイブ)",
    ]

    var num_ads = 4


    // 2 関数の定義
    function apply_blacklist(list) {
        for (var i = 0 ; i < list.length ; i++){
            $('a[data-gtm-user-id=' + list[i] + ']').closest('.list-item').remove(); // スマホ版小説検索
            $('a[data-gtm-value=' + list[i] + ']').closest('li').remove(); // PC版小説検索
            $('a[data-user_id=' + list[i] + ']').closest('.ranking-item').remove(); // PC版イラストランキング
            //console.log('CP2: ブラックリスト(id: ' + list[i] + ')')
        }
    }

    function apply_ng_tags(list) {
        var tags = $('img._thumbnail.ui-scroll-view')
        tags.each(function() {
            for (var i = 0 ; i < list.length ; i++){
                if($(this).data('tags').includes(list[i])) {
                    $(this).closest('.ranking-item').remove();
                }
            }
        });
    }

    function remove_ads() {
        while (num_ads > 0) {
            $('div[data-v-fad8a51c].ads').remove();
            num_ads -= 1
            //console.log('CP2: 広告削除')
        }
    }


    // 3 関数の実行
    var sum_interval = 0
    var id = setInterval(function(){
        apply_blacklist(blacklist)
        apply_ng_tags(ng_tag_list)
        remove_ads()

        sum_interval += 1000
        console.log(sum_interval)

        if (sum_interval >= 2000) {
            clearInterval(id);
            console.log('CP2: 停止')
        }

    }, 1000 );
});