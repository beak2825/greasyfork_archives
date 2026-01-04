// ==UserScript==
// @name         Habr Autohighlighter
// @namespace    http://ext.redleaves.ru
// @version      0.1
// @description  Включает автоматическую подсветку синтаксиса по запросу, если автор статьи ее не включил.
// @author       MewForest
// @license      MIT
// @match        *://habr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390399/Habr%20Autohighlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/390399/Habr%20Autohighlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoHighlighter()
    {
        $('.plaintext').each(function() {$(this).removeClass('plaintext')});
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        return true

    }

    $('#TMpanel .bmenu').append('<a id="higlihterAuto" title="Если автор забыл включить подсветку, кликните сюда :)" href="#" style="color: brown;">Подсветить всё!</a>');
    $('#higlihterAuto').click(function(){ autoHighlighter(); });
})();