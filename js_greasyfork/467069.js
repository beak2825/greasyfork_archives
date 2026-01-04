// ==UserScript==
// @name         BlueskyTranslateButton
// @namespace    https://nigauri.me/
// @version      0.4
// @description  Blueskyの本文の下に翻訳ボタンを追加し、クリックすると翻訳文を表示する（別ページを開かない）
// @author       nigauri
// @match        https://bsky.app/*
// @match        https://staging.bsky.app/*
// @icon         https://bsky.app/static/apple-touch-icon.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467069/BlueskyTranslateButton.user.js
// @updateURL https://update.greasyfork.org/scripts/467069/BlueskyTranslateButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // setting
    const translateButtonLabel = "翻訳...";
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

    const observeTarget = "#root";
    const observeOption = {
        childList: true,
        subtree: true,
    }

    const postTextCSS = ".css-146c3p1.r-1xnzce8";
    const marker = "ngurtb";

    let translateBtnObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
        translateBtnObserver.disconnect();
        $(postTextCSS).not(`.${marker}`).each(function(i, elem) {
            $(elem).addClass(marker);
            let parent = $(elem).parent();
            parent.after(`<div class="translateBlock"><div class="translateBtn">${translateButtonLabel}</div><div class="translateText"></div></div>`);
            let translateBtn = parent.parent().find(".translateBtn");
            let translateText = parent.parent().find(".translateText");
            setTranslateBlock(translateBtn, translateText, $(elem));
        });
        translateBtnObserver.observe($(observeTarget).get(0), observeOption);
    });
    translateBtnObserver.observe($(observeTarget).get(0), observeOption);

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