// ==UserScript==
// @name         Nejire Show ID for vid=17723
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  ねじれの特定の村のIDを表示します。
// @author       euro_s
// @match        http://nejiten.halfmoon.jp/index.cgi?vid=17723*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=halfmoon.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449560/Nejire%20Show%20ID%20for%20vid%3D17723.user.js
// @updateURL https://update.greasyfork.org/scripts/449560/Nejire%20Show%20ID%20for%20vid%3D17723.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const ids = {
        "戯言 ジャック": "DUMMY",
        "鬼提灯 コトハ": "slave",
        "村建てBOUぽきゃ": "BOU",
        "寿司職人 今日は": "kyowa",
        "狂ったお茶会 シロ": "ルム",
        "絡む綾糸 ベアトリクス": "Muscutsparkling",
        "自称師匠 ナイン": "ninnsinobi",
        "パドレ ドロシー": "きいねぎ",
        "手繰る歯車 ジェラルド": "イヅル",
        "バニー アリス": "翔鶴嫁",
        "せっかち ケイト": "mill",
        "自称弟子　オズ": "sen6969",
        "道草 ミオ（ゆーろ）": "ゆーろ",
        "リオネル メッシ": "samurai",
        "廃駅 ホトネ": "アルカリ",
        "元気いっぱい しっぽ": "カヤノタト",
        "男爵 ミィ": "バチヘビ",
        "スオズィッチ ネイブ": "すづき",
        "ナイト オブ セブン（まさまさ）": "masamasa",
        "スペクトラム リアル": "VyuayaV",
        "生花霊吐 フローラ": "ねくすて",
        "裸の王様 キング": "マダナイ",
        "さかさま　鳥足(モミジ)": "鳥足",
        "野良猫 フォー": "はねねこ",
        "盲獣 バルト": "sabuakamoa",
        "花魁 シノ": "DIGIMON",
        "悪巫山戯 ウィリアム": "anon8007",
        "再演 デュース": "narukami1508",
        "苦労性 ループレヒト": "zeno",
        "探子 ヨル": "moti_moti",
        "気違い論解 クイン": "星守人",
        "虚構審判 エース": "山田勝己",
        "でんせつポケモン　ウインディ": "charlotte_wrber",
        "夏休みの宿題が終わるまでプレゼント貰えなかった8月31日生まれ被害者の会会長　ほうほう": "ほうほう",
        "清掃アルバイト ユシィ": "nyaruno",
        "ギガカラチップス": "hakoniwa",
        "のんびり シンク": "ose",
        "綿蒟蒻": "watakonnyaku",
        "番狂わせ ウィスプ": "ジェネラル・トレイシー",
        "コンプレックス チェシャ": "stick",
        "製菓狐逆 輝音": "輝音#人狼NET113564",
        "売店 ミルラ": "lapis_mimi",
    }
    function main() {
        const times = document.querySelectorAll('span.time');
        for (const time of times) {
            const a = time.parentElement.querySelectorAll('a')[1];
            if (ids[a.innerText]) {
                a.innerText = `${a.innerText} (${ids[a.innerText]})`;
            }
        }
    }

    new MutationObserver(main).observe(
        document.querySelector('#content'), { childList: true }
    );

    main();

})();