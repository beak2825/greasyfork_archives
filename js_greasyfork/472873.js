// ==UserScript==
// @name         Blueskyの外国語を自動的に翻訳
// @namespace    @lamrongol
// @version      0.1.8
// @description  Blueskyの日本語文字が含まれてないポストを自動で翻訳(英語・ドイツ語・ポルトガル語のみ)
// @author       Lamron🍞
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472873/Bluesky%E3%81%AE%E5%A4%96%E5%9B%BD%E8%AA%9E%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E7%BF%BB%E8%A8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/472873/Bluesky%E3%81%AE%E5%A4%96%E5%9B%BD%E8%AA%9E%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E7%BF%BB%E8%A8%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // setting
    //const sourceLang = "en";
    const targetLang = "ja";

    const jaRe = /[\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}\p{Script_Extensions=Han}]/u
    const geRe = /[äöüÄÖÜß]/u
    const ptRe = /[áéíóúâêôãõç]/u//ref https://amadora.co.uk/aprender/alfabeto/

    const postTextCSS = ".css-175oi2r > .css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj > .css-146c3p1";
    //const quotePostTextCSS;
    const marker = "translated";

    const observeTarget = "#root";
    const observeOption = {
        childList: true,
        subtree: true,
    }

    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    let translateObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
    translateObserver.disconnect();
    const elms = $(postTextCSS).not(`.${marker}`);
    for(let i = elms.length-1; i > -1; i--){
        const elem = elms[i];
        $(elem).addClass(marker);
        const originalText = elem.textContent;
        if(jaRe.test(originalText)) continue;

        let sourceLang = "en";
        if(geRe.test(originalText)) sourceLang = "de";
        else if(ptRe.test(originalText)) sourceLang = "pt";

        const base_url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=`;

        const encodeText = encodeURIComponent(originalText);
        const url = base_url + encodeText;
        $.ajaxSetup({async: false});
        $.getJSON(url, function(data) {
            let text = "";
            data[0].forEach(function(element){
                text += `<p>${escapeHtml(element[0])}</p>`;
            });
            const parent = $(elem).parent();
            const translatedDiv = document.createElement("div");
            translatedDiv.classList.add("translatedText");
            parent.after(translatedDiv);

            translatedDiv.innerHTML = "<hr>"+text;
        });
        $.ajaxSetup({async: true});
        sleep(2000);//awaitを付けるとエラー これだとsleepできてないが問題なく使える？
    }

    translateObserver.observe($(observeTarget).get(0), observeOption);
    });
    translateObserver.observe($(observeTarget).get(0), observeOption);

    function escapeHtml(str) {
    var patterns = {
        '<'  : '&lt;',
        '>'  : '&gt;',
        '&'  : '&amp;',
        '"'  : '&quot;',
        '\'' : '&#x27;',
        '`'  : '&#x60;'
    };
    return str.replace(/[<>&"'`]/g, function(match) {
        return patterns[match];
    });
    };
})();