// ==UserScript==
// @name           Game8 Plus Plus
// @namespace      https://greasyfork.org/en/users/1084257-greasy-axolotol
// @version        0.0.17
// @license        MIT
// @description    Make Game8 more user-friendly for English-speaking players
// @match          https://game8.jp/ff14/*
// @match          https://nukemarugames.com/*
// @downloadURL https://update.greasyfork.org/scripts/467061/Game8%20Plus%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/467061/Game8%20Plus%20Plus.meta.js
// ==/UserScript==

/*
Original code: https://greasyfork.org/en/scripts/10976-replace-text-on-webpages
*/

(function () {
    'use strict';


    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    function words() {
        return {
            // Syntax: 'Search word' : 'Replace word',
            // 'your a': 'you\'re a',
            // 'imo': 'in my opinion',
            // 'im\\*o': 'matching an asterisk, not a wildcard',
            // '/\\bD\\b/g': '[D]',

            // Golbez EX
            'ゴルベーザ': 'Golbez',
            'ディレイアース': 'Terrastorm',
            'ディレイスパーク': 'Lingering Spark',
            '弦月連剣': 'Phases of the Blade',
            '呪縛の冷気': "Binding Cold",
            'ウィンドスフィア': 'Gale Sphere',
            'ウインドスフィア': 'Gale Sphere',
            'コールドブラスト': 'Arctic Assault',
            'ヴォイド・メテオ': 'Void Meteor',
            'ヴォイドメテオ': 'Void Meteor',
            '黒竜剣アジュダヤ': "Azdaja's Shadow",
            '黒龍剣アジュダヤ': "Azdaja's Shadow",
            '黒い牙': 'Black Fang',
            '弦月黒竜連剣': 'Phases of the Shadow',
            'ダブルメテオ': 'Double Meteor',
            'ヴォイド・コメットレイン': 'Void Stardust',
            'ヴォイドコメットレイン': 'Void Stardust',
            'ヴォイドレイン': 'Void Stardust',
            '三連黒竜閃': 'Eventide Triad',
            '収束黒竜閃': 'Eventide Fall',
            '集束黒竜閃': 'Eventide Fall',

            // Zurvan
            'ズルワーン': 'Zurvan',
            'メタルカッター': 'Metal Cutter',
            'フレアスター': 'Flare Star',
            '飛翔': 'Soar',
            'デモンクロー': "Demon's Claw",
            'フレイムハルバード': 'Flaming Halberd',
            'バイティングハルバート': 'Biting Halberd',
            'バイティングハルバード': 'Biting Halberd',
            'サザンクロス': 'Southern Cross',
            'テイルエンド': 'Tail End',
            'シクリクル': 'Ciclicle',
            'ウィル': 'Will',
            'セウ': "Thew",
            'ウィット': 'Wit',
            'ワイル': 'Wile',

            // P9S
            'グラトニーズアーガー': "Gluttony's Augur",
            '魂喰らい': "Ravening",
            '魂食らい': "Ravening",
            'デストゥワイス': 'Duality of Death',
            "ダブルスペル": 'Dualspell',
            '穿昇拳': 'Ascendant Fist',
            '古式地烈斬': 'Archaic Rockbreaker',
            '古式地裂斬': 'Archaic Rockbreaker',
            '前方連転脚': 'Front Combination',
            '後方連転脚': 'Rear Combination',
            'サモンライトニング': 'Levinstrike Summoning',
            'ジャンブルコンボ': 'Scrambled Succession',
            '憑魔双撃': 'Two Minds',
            'ミールストーム': 'Charybdis',
            'エクリプスメテオ': 'Ecliptic Meteor',
            'ビーストバイル': 'Beastly Bile',
            'コメット': 'Comet',
            'サンダーボルト': 'Thunderbolt',
            'ビーストフューリー': 'Beastly Fury',
            'キメリックコンボ': 'Chimeric Succession',
            '古式破砕拳': 'Archaic Demolish',

            // P10S
            'アルテマ': 'Ultima',
            'ソウルグラスブ': 'Soul Grasp',
            'ソウルグラスプ': 'Soul Grasp',
            "ディバイドヴィング": "Dividing Wings",
            "ディバイドウィング": "Dividing Wings",
            "ヘビーウェブ": "Steel Web",
            "パンデモニウムリング": "Circle of Pandæmonium",
            "パンデモニックリング": "Circle of Pandæmonium",

            "パンデモニウムホーリー": "Pandæmonium's Holy",
            "パンデモニックホーリー": "Pandæmonium's Holy",
            "ホーリー/リング": "Holy/Circle",
            "尖脚": "Wicked Step",
            "グランドウェブ": "Entangling Web",
            "パンデモニウムビラー": "Pandæmoniumic Pillars",
            "パンデモニックピラー": "Pandæmoniumic Pillars",
            "スビットウェブ": "Silkspit",
            "スピットウェブ": "Silkspit",
            "スピッドウェブ": "Silkspit",
            "パンデモニックポンド": "Dæmoniac Bonds",
            "パンデモニックボンド": "Dæmoniac Bonds",
            "パンデモニックメルトン": "Pandæmoniac Meltdown",
            "タッチタウン": "Touchdown",
            "タッチダウン": "Touchdown",
            "パンデモニックタレット": "Pandæmoniac Turrets",
            "パンデモニックレイ": "Pandæmoniac Ray",
            "魔殿の震撃": "Harrowing Hell",

            // P11S
            "エウノミアー": "Eunomia",
            "ディケー": "Dike",
            "ジューリー・オーバールール": "Jury Overruling",
            "ジューリー": "Jury",
            "ジューリ―": "Jury",
            "アップヘルド・オーバールール": "Upheld Overruling",
            "アップヘルド": "Upheld",
            "ディバイド・オーバールール": "Divisive Overruling",
            "ディバイドオーバールール": "Divisive Overruling",
            "ディバイド": "Divisive",
            "ステュクス": "Styx",
            "魔法陣展開": "Arcane Revelation",
            "ディスミサル・オーバールール": "Dismissal Overruling",
            "ディスミサル": "Dismissal",
            "戒律の幻想": "Shadowed Messengers",
            "ライトストリーム": "Lightstream",
            "光と闇の調停": "Dark and Light",
            "ダークストリーム": "Dark Current",
            "理法の幻想": "Letter of the Law",
        }
    }

    function commonWords() {
        return {
            'プレイヤー': '<player>',
            'ボス': '<boss>',
            'タンク': '<tank>',
            'ヒラ': '<healer>',
            'ノックバック': '<knock-back>',
            'ドーナツ': '<donut>',
            'ヘイト': '<aggro>',
            'デバフ': '<debuff>',
            'フレア': "<flare>",
            'ランダム': "<random>",
            'サイコロ': "<limit cut>",
            '雑魚': "<adds>",
            'フィールドマーカー': "<markers>",
            'DPSチェック': "<dps check>",
            "ターゲット": "<target>",
        };
    }

    var currentUrl = window.location.href;

    // Replace the macro with the English version
    var ewEx6Url = "https://game8.jp/ff14/529320" //Golbez
    if (currentUrl === ewEx6Url) {
        var tableElements = document.getElementsByClassName("a-table a-table");
        var enMacro = // https://tuufless.github.io/FFXIV-Elemental-Raid-Macros/6.0_endwalker/extreme_trials/golbez/
            `■ Spread (True North)ー■ 4:4 stacks ーーーーーー
　　D3 MT D4　　　　　N/W/Out: MT H1 D1 D3
　　H1 ★ H2　　　　　　　S/E/In: ST H2 D2 D4
　　D1 ST D2
■ Lingering Spark ーーーーーーーーーーーーーーー
　Move when cast finishes
■ Double Meteor ーーーーーーーーーーーーーーー
　DPS: 3-man tower　Flare: North
　 T/H: 2-man tower　Flare: South　KB: Mid
■ Void Stardust ーーーーーーーーーーーーーーーー
　N1:H1D3　N2:MTD1　S1:H2D4　S2:STD2
■ Gale Sphere #2, #3 ーーーーーーーーーーーーーー
　N/W：H1D3　MTD1　STD2　H2D4：S/E
■ Eventide Triad ーーーーーーーーーーーーーーーー
　Tanks→North　Healers→E/W　DPS→South
`
        tableElements[0].tBodies[0].rows[0].cells[0].innerText = enMacro;
    }


    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    function addReplacements(word, words) {
        if (typeof word === 'string' && words.hasOwnProperty(word)) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push(words[word]);
        }
    }

    // convert the 'words' JSON object to an Array
    for (word in words()) {
        addReplacements(word, words())
    }
    for (word in commonWords()) {
        addReplacements(word, commonWords())
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if (isTagOk(text.parentNode.tagName)) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace(value, replacements[index]);
            });
        }
    }
}());
