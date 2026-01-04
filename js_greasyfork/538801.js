// ==UserScript==
// @name         Selected Japanese Text Hanakana
// @namespace    https://yourname.example.com/
// @version      1.2
// @description  選取日文自動斷詞並加上發音與詞典連結顯示在畫面底部
// @author       你的名字或暱稱
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @homepageURL  https://github.com/teilala/japanese-selection-furigana
// @supportURL   https://github.com/teilala/japanese-selection-furigana/issues
// @downloadURL https://update.greasyfork.org/scripts/538801/Selected%20Japanese%20Text%20Hanakana.user.js
// @updateURL https://update.greasyfork.org/scripts/538801/Selected%20Japanese%20Text%20Hanakana.meta.js
// ==/UserScript==


(function () {
    "use strict";

    // 建立浮動面板
    const panel = document.createElement("div");
    panel.id = "tokenize-panel";
    panel.style.position = "fixed";
    panel.style.bottom = "0";
    panel.style.left = "0";
    panel.style.width = "100%";
    panel.style.background = "rgb(204 161 161 / 80%)";
    panel.style.color = "white";
    panel.style.zIndex = "99999";
    panel.style.padding = "10px";
    panel.style.fontSize = "20px";
    panel.style.fontFamily = "sans-serif";
    panel.style.overflowX = "auto";
    panel.style.whiteSpace = "nowrap";
    panel.style.display = "none"; // 初始隱藏
    document.body.appendChild(panel);

    const hira2kata = (str) => {
        if (!str || str === undefined) return "";
        const hira = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "ん", "を", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゕ", "ゖ", "ㇱ", "っ", "ㇷ", "ゎ"];
        const kata = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ン", "ヲ", "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ", "ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ", "ヵ", "ヶ", "ㇲ", "ッ", "ㇷ゚", "ヮ"];
        return [...str].reduce((a, c) => {
            const ind = kata.indexOf(c);
            return a + (ind === -1 ? c : hira[ind]);
        }, "");
    };

    document.addEventListener("selectionchange", () => {
        const selectedStr = window.getSelection().toString().trim();
        if (!selectedStr) return;

        clearTimeout(window.__textTimeout);
        window.__textTimeout = setTimeout(async () => {
            const encoded = encodeURIComponent(selectedStr);
            const url = `https://jp-tokenize-sigma.vercel.app/api/tokenize?text=${encoded}`;

            try {
                const res = await fetch(url);
                const data = await res.json();

                let newHtml = "";
                data.forEach(v => {
                    if (
                        ["動詞", "名詞", "形容詞", "副詞", "感動詞", "連体詞", "接頭詞"].includes(v.pos)
                    )
                        newHtml += `<a href='https://dict.asia/jc/${v.surface_form}' target='_blank'><ruby>${v.surface_form}<rt>${hira2kata(v.reading)}</rt></ruby></a>`;
                    else
                        newHtml += v.surface_form;
                });

                panel.innerHTML = newHtml;
                panel.style.display = "block";
            } catch (err) {
                console.error("🚫 請求失敗：", err);
            }
        }, 600);
    });
})();
