// ==UserScript==
// @name         汉字到衍生假名转换器 | 漢字から派生仮名への変換 | Hanzi to derived Kana Converter
// @name:en      Hanzi to derived Kana Converter
// @name:zh-TW   漢字到衍生假名轉換器
// @name:zh-CN   汉字到衍生假名转换器
// @name:ja      漢字から派生仮名への変換
// @namespace    https://4kliksAlex.github.com/
// @version      0.3.0
// @description:      将网页上的汉字替换为其对应的派生假名 | ウェブページ上の漢字を、それに対応する派生仮名に置き換えます | Replace Hanzis on web pages with the derived Kanas of them.
// @description:en    Replace Hanzis on web pages with the derived Kanas of them.
// @description:zh-TW 將網頁上的漢字替換為其對應的派生假名。
// @description:zh-CN 将网页上的汉字替换为其对应的派生假名。
// @description:ja    ウェブページ上の漢字を、それに対応する派生仮名に置き換えます。
// @author       4kliksAlex
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/4kliksAlex/Hanzi-To-Kana/main/icon.png
// @grant        none
// @liscense     GPLv3
// @description Replace Hanzis on web pages with the derived Kanas of them.
// @downloadURL https://update.greasyfork.org/scripts/503070/%E6%B1%89%E5%AD%97%E5%88%B0%E8%A1%8D%E7%94%9F%E5%81%87%E5%90%8D%E8%BD%AC%E6%8D%A2%E5%99%A8%20%7C%20%E6%BC%A2%E5%AD%97%E3%81%8B%E3%82%89%E6%B4%BE%E7%94%9F%E4%BB%AE%E5%90%8D%E3%81%B8%E3%81%AE%E5%A4%89%E6%8F%9B%20%7C%20Hanzi%20to%20derived%20Kana%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/503070/%E6%B1%89%E5%AD%97%E5%88%B0%E8%A1%8D%E7%94%9F%E5%81%87%E5%90%8D%E8%BD%AC%E6%8D%A2%E5%99%A8%20%7C%20%E6%BC%A2%E5%AD%97%E3%81%8B%E3%82%89%E6%B4%BE%E7%94%9F%E4%BB%AE%E5%90%8D%E3%81%B8%E3%81%AE%E5%A4%89%E6%8F%9B%20%7C%20Hanzi%20to%20derived%20Kana%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tchineseHiragana = {
      "安": "あ", "以": "い", "宇": "う", "衣": "え", "於": "お",
      "加": "か", "幾": "き", "久": "く", "計": "け", "己": "こ", "機": "き",
      "左": "さ", "之": "じ", "寸": "す", "世": "せ", "曽": "ぞ",
      "太": "た", "知": "ぢ", "川": "つ", "天": "て", "止": "と",
      "奈": "な", "仁": "に", "奴": "ぬ", "祢": "ね", "乃": "の",
      "波": "ば", "比": "び", "不": "ぶ", "部": "べ", "保": "ぼ",
      "末": "ま", "美": "み", "武": "む", "女": "め", "毛": "も",
      "也": "や", "由": "ゆ", "与": "よ",
      "良": "ら", "利": "り", "留": "る", "礼": "れ", "呂": "ろ",
      "和": "わ", "為": "ゐ", "恵": "ゑ", "遠": "を",
      "无": "ん"
    };
    const tchineseKatakana = {
      "阿": "ア", "伊": "イ", "宇": "ウ", "江": "エ", "於": "オ",
      "加": "カ", "幾": "キ", "久": "ク", "介": "ケ", "己": "コ", "機": "キ",
      "散": "サ", "之": "ジ", "須": "ス", "世": "セ", "曽": "ゾ",
      "多": "ダ", "千": "チ", "川": "ツ", "天": "テ", "止": "ト",
      "奈": "ナ", "二": "ニ", "奴": "ヌ", "祢": "ネ", "乃": "ノ",
      "八": "バ", "比": "ビ", "不": "ブ", "部": "ベ", "保": "ボ",
      "末": "マ", "三": "ミ", "牟": "ム", "女": "メ", "毛": "モ", "万": "マ",  //「マ」の字形: 「末」の上の部分と「万」の混合
      "也": "ヤ", "由": "ユ", "与": "ヨ",
      "良": "ラ", "利": "リ", "流": "ル", "礼": "レ", "呂": "ロ",
      "和": "ワ", "乎": "ヲ",
      "尓": "ン"
    };
    const schineseHiragana = {
      "安": "あ", "以": "い", "宇": "う", "衣": "え", "于": "お",
      "加": "か", "几": "き", "久": "く", "计": "け", "己": "こ", "机": "き",
      "左": "さ", "之": "じ", "寸": "す", "世": "せ", "曽": "ぞ",
      "太": "た", "知": "ぢ", "川": "つ", "天": "て", "止": "と",
      "奈": "な", "仁": "に", "奴": "ぬ", "祢": "ね", "乃": "の",
      "波": "ば", "比": "び", "不": "ぶ", "部": "べ", "保": "ぼ",
      "末": "ま", "美": "み", "武": "む", "女": "め", "毛": "も",
      "也": "や", "由": "ゆ", "与": "よ",
      "良": "ら", "利": "り", "留": "る", "礼": "れ", "吕": "ろ",
      "和": "わ", "为": "ゐ", "恵": "ゑ", "远": "を",
      "无": "ん"
    };
    const schineseKatakana = {
      "阿": "ア", "伊": "イ", "宇": "ウ", "江": "エ", "于": "オ",
      "加": "カ", "几": "キ", "久": "ク", "介": "ケ", "己": "コ", "机": "キ",
      "散": "サ", "之": "ジ", "须": "ス", "世": "セ", "曽": "ゾ",
      "多": "ダ", "千": "チ", "川": "ツ", "天": "テ", "止": "ト",
      "奈": "ナ", "二": "ニ", "奴": "ヌ", "祢": "ネ", "乃": "ノ",
      "八": "バ", "比": "ビ", "不": "ブ", "部": "ベ", "保": "ボ",
      "末": "マ", "三": "ミ", "牟": "ム", "女": "メ", "毛": "モ", "万": "マ", //「マ」の字形: 「末」の上の部分と「万」の混合
      "也": "ヤ", "由": "ユ", "与": "ヨ",
      "良": "ラ", "利": "リ", "流": "ル", "礼": "レ", "吕": "ロ",
      "和": "ワ", "乎": "ヲ",
      "尔": "ン"
    };

    const hanziToHiraganaMap = new Map(Object.entries({
      ...tchineseHiragana,
      ...schineseHiragana,
    }));

    const hanziToKatakanaMap = new Map(Object.entries({
      ...tchineseKatakana,
      ...schineseKatakana,
    }));

    function getKanaForHanzi(char) {
      const hiragana = hanziToHiraganaMap.get(char) || '';
      let katakana = hanziToKatakanaMap.get(char) || '';
      // katakana = hiragana.length !== 0 && katakana.length !== 0 ? `[${katakana}]` : katakana;
      if (hiragana.length !== 0 && katakana.length !== 0) {
        return Math.random() < 0.5 ? hiragana : katakana;
      }
      return hiragana.length !== 0 || katakana.length !== 0 ? `${hiragana}${katakana}` : char;
    }

    function replaceHanziWithKana(text) {
      return Array.from(text).map(getKanaForHanzi).join('');
    }

    function traverseAndReplace(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = replaceHanziWithKana(node.nodeValue);
      } else {
        node.childNodes.forEach(traverseAndReplace);
      }
    }

    traverseAndReplace(document.body);
})();
