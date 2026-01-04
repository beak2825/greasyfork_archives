// ==UserScript==
// @name         Mastodon の長いトゥートを置換するやつ
// @name:ja   Mastodon の長いトゥートを置換するやつ
// @name:en   Mastodon replace too long toot
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       Eskey Easy
// @license MIT
// @description  長すぎてびっくりするトゥートを好きな文字に置換します。デフォルトでは https://mstdn.jp で動作しますが、＠matchタグを追加して他のインスタンスで動作させることもできます。
// @description:ja  長すぎてびっくりするトゥートを好きな文字に置換します。デフォルトでは https://mstdn.jp で動作しますが、＠matchタグを追加して他のインスタンスで動作させることもできます。
// @description:en  Replace too long toot on Mastodon web. By default this will work on https://mstdn.jp .
// @match        https://mstdn.jp/web/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mstdn.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459953/Mastodon%20%E3%81%AE%E9%95%B7%E3%81%84%E3%83%88%E3%82%A5%E3%83%BC%E3%83%88%E3%82%92%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/459953/Mastodon%20%E3%81%AE%E9%95%B7%E3%81%84%E3%83%88%E3%82%A5%E3%83%BC%E3%83%88%E3%82%92%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// SETTING START END ///////////////////////////////////////////////////

    /**
      これより長いトゥートは REPLACED_HTML に置換される。リンクとハッシュタグは無視される。
      The toots that is longer than this number will be replaced into REPLACED_HTML.
      URLs and hashtags are not counted.
    */
    const TEXT_LENGTH_THRESHOLD = 200;

    /**
      置換テンプレート。"${textLen}"とすると文字数に置換される。
      The long toots will be replaced into this HTML. "${textLen}" represents the length of toot.
      example: `${length}文字` → "300文字"
    */
    const REPLACER = (original, length) => `<p>${original.substring(0, 20)}…(略）</p>`;

    /**
      更新間隔。ミリ秒
      Check interval(milliseconds)
    */
    const TOOT_CHECK_INTERVAL_MS = 60;

    ////// SETTING END ///////////////////////////////////////////////////

    replaceLoop(TEXT_LENGTH_THRESHOLD, TOOT_CHECK_INTERVAL_MS);

    const selector = '#mastodon div.scrollable > div.item-list > article .status__content__text.status__content__text--visible:not([data-lengthCheck])';
    function replaceLoop(thresh, interval) {
        setInterval(function(){
            document.querySelectorAll(selector).forEach(e => {
                e.setAttribute('data-lengthCheck','1');
                const text = e.innerText.replace(/<a(?: .+?)?>.*?<\/a>/g, '');
                const textLen = text.length;
                if( textLen > thresh) {
                    e.innerHTML = REPLACER(text, textLen);
                }
            })
        },interval);
    }
})();