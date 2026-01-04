// ==UserScript==
// @name         Adds hiragana on the kanji
// @name:en      Adds hiragana on the kanji
// @name:zh      网页汉字标注假名
// @name:zh-CN   网页汉字标注假名
// @name:zh-TW   網頁漢字標註假名
// @name:ja      漢字にかなで注釈を付けます
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  adds hiragana on the kanji,How to use:right click on the web page - tampermonkey - this script. (Translated by https://www.hiragana.jp/)
// @description:zh    给网站上的汉字标注假名,使用方法:网页右键-油猴-本脚本(使用的 https://www.hiragana.jp/ 接口)。
// @description:en adds hiragana on the kanji ,How to use:right click on the web page - tampermonkey - this script.(Translated by https://www.hiragana.jp/)
// @description:zh-tw 給網站上的漢字標註假名,使用方法：網頁右鍵-油猴-本腳本(使用的 https://www.hiragana.jp/ 接口)。
// @description:ja Webサイトの漢字にかなで注釈を付けます,使用方法：Webページ右クリック-オイルモンキー-本スクリプト（https://www.hiragana.jp/インターフェイスを使用）。
// @author       YueLi
// @match        *://*/*
// @license MIT
// @run-at context-menu

// @downloadURL https://update.greasyfork.org/scripts/448609/Adds%20hiragana%20on%20the%20kanji.user.js
// @updateURL https://update.greasyfork.org/scripts/448609/Adds%20hiragana%20on%20the%20kanji.meta.js
// ==/UserScript==

(function() {
    let ruby_link = "https://trans.hiragana.jp/ruby/";
    window.location.href = ruby_link + window.location.href;
})();