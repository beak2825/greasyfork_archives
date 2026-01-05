// ==UserScript==
// @name         NHN News Easy Hide Furigana
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hides furigana by default on the NHK Easy News site articles.
// @author       Ernesto Hegi <ernesto.hegi@gmail.com?
// @match        http://www3.nhk.or.jp/news/easy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23849/NHN%20News%20Easy%20Hide%20Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/23849/NHN%20News%20Easy%20Hide%20Furigana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var HIDE_FURIGANA_CLASS_NAME    = 'hide-furigana',
        ARTICLE_ID_NAME             = 'newsarticle',
        MOUSEENTER_EVENT_NAME       = 'mouseenter',
        MOUSELEAVES_EVENT_NAME      = 'mouseleave'
    ;

    var article;

    var setElements = function () {
        article = document.getElementById(ARTICLE_ID_NAME);
    };

    var insertStylesheet = function () {
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".hide-furigana rt { color: transparent !important; }";

        document.body.appendChild(css);
    };

    var bindEvents = function () {
        article.addEventListener(
            MOUSEENTER_EVENT_NAME,
            NHKNewsEasyHideFurigana.showFurigana
        );

        article.addEventListener(
            MOUSELEAVES_EVENT_NAME,
            NHKNewsEasyHideFurigana.hideFurigana
        );
    };

    var NHKNewsEasyHideFurigana = {
        init: function () {
            setElements();
            bindEvents();
            insertStylesheet();

            this.hideFurigana();
        },
        hideFurigana: function () {
            article.classList.add(HIDE_FURIGANA_CLASS_NAME);
        },
        showFurigana: function () {
            article.classList.remove(HIDE_FURIGANA_CLASS_NAME);
        }
    };

    NHKNewsEasyHideFurigana.init();
})();