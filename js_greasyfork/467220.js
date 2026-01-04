// ==UserScript==
// @name         Blueskyの英語を翻訳するボタン(Ucho-ten, Laika)
// @namespace    https://bsky.app/profile/lamrongol.bsky.social
// @version      0.3.1
// @description  Blueskyの本文の下に翻訳ボタンを追加し、クリックすると翻訳文を表示します
// @author       lamrongol
// @match        https://ucho-ten.net*
// @match        https://laika-bluesky.web.app/*
// @icon         https://bsky.app/static/apple-touch-icon.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467220/Bluesky%E3%81%AE%E8%8B%B1%E8%AA%9E%E3%82%92%E7%BF%BB%E8%A8%B3%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%28Ucho-ten%2C%20Laika%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467220/Bluesky%E3%81%AE%E8%8B%B1%E8%AA%9E%E3%82%92%E7%BF%BB%E8%A8%B3%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%28Ucho-ten%2C%20Laika%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const APP = {
        BSKY: 'value1',
        UCHO_TEN: 'value2',
        LAIKA: 'value3'
    };
 
    // setting
    const translateButtonLabel = "Translate...";
    const sourceLang = "en";
    const targetLang = "ja";
 
    // css
    const style = `<style>
        .translateBlock .translateBtn {
            color: rgb(0, 133, 255);
            text-decoration: none;
            cursor: pointer;
        }
        .translateBlock .translateText {
            display: none;
        }
        .translateBlock .translateText p {
            margin: 0.5rem 0;
        }
    </style>`;
    $("head").append(style);
 
    // ----------
    const host = window.location.host;
    let app;
    if(host.endsWith("bsky.app")) app = APP.BSKY;
    else if(host.endsWith("ucho-ten.net")) app = APP.UCHO_TEN;
    else if(host.endsWith("laika-bluesky.web.app")) app = APP.LAIKA;
    else return;
 
    let observeTarget;
    switch(app){
      case APP.BSKY:
        observeTarget = "#root";
        break;
      case APP.UCHO_TEN:
        observeTarget = ".nextui-c-lhoAZR > div";
        break;
      case APP.LAIKA:
        observeTarget = "body > app-root > main > app-home > main > section > app-timeline";
        break;
    }
    const observeOption = {
        childList: true,
        subtree: true,
    }
 
    let postTextCSS;
    switch(app){
      case APP.BSKY:
        postTextCSS = ".css-175oi2r > .css-175oi2r.r-1awozwy.r-18u37iz.r-1w6e6rj > .css-1rynq56";
        break;
      case APP.UCHO_TEN:
        postTextCSS = 'div[style="word-break: break-all;"]';
        break;
      case APP.LAIKA:
        postTextCSS = ".feed_content, .feed_quote_content, .reply_bottom";
        break;
    }
    const marker = "ngurtb";
 
    let translateBtnObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
        translateBtnObserver.disconnect();
        $(postTextCSS).not(`.${marker}`).each(function(i, elem) {
            $(elem).addClass(marker);
            let parent = app==APP.BSKY ? $(elem).parent() : $(elem);
            parent.after(`<div class="translateBlock"><div class="translateBtn">${translateButtonLabel}</div><div class="translateText"></div></div>`);
            let translateBtn = parent.parent().find(".translateBtn");
            let translateText = parent.parent().find(".translateText");
            setTranslateBlock(translateBtn, translateText, $(elem));
        });
        translateBtnObserver.observe($(observeTarget).get(0), observeOption);
    });
    function addObserverIfDesiredNodeAvailable() {
        const composeBox = $(observeTarget).get(0);
        if(!composeBox) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
            return;
        }
        translateBtnObserver.observe(composeBox, observeOption);
        //window.setTimeout(checkRootExists, 500);
    }
    /*
    function checkRootExists() {
        const composeBox = $(observeTarget);
        if(!composeBox) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
            return;
        }
        window.setTimeout(checkRootExists, 500);
    }
    */
    addObserverIfDesiredNodeAvailable();
 
    function setTranslateBlock(translateBtn, translateText, elem) {
        translateText.css("color", elem.css("color"));
        translateBtn.on("click", function(){
            translateBtnObserver.disconnect();
            let encodeText = encodeURIComponent(elem.text());
            let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeText}`;
            $.ajaxSetup({async: false});
            $.getJSON(url, function(data) {
                let text = "";
                data[0].forEach(function(element){
                    text += `<p>${escapeHtml(element[0])}</p>`;
                });
                translateText.html(text);
                translateText.show();
                $(this).off("click");
            });
            $.ajaxSetup({async: true});
            translateBtnObserver.observe($(observeTarget).get(0), observeOption);
            return false;
        });
    }
 
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