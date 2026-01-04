// ==UserScript==
// @name         Youdao Translator Redirect
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Just want to use the translation service normally, you can also cooperate with other purification plug-ins(只是想正常的使用翻译服务，你也可以配合其他净化插件)
// @author       Bela Proinsias
// @license      MIT
// @match        fanyi.youdao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519636/Youdao%20Translator%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/519636/Youdao%20Translator%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function redirectToTextTranslate() {
        if (window.location.hash.includes("#/AITranslate")) {
            window.location.hash = "#/TextTranslate";
        }
    }
    // Initial check
    redirectToTextTranslate();
    setInterval(redirectToTextTranslate, 500);
    // Listen for hash changes
    window.addEventListener('hashchange', redirectToTextTranslate, false);
    // Monitor for link clicks and changes
    document.addEventListener('click', function() {
        setTimeout(redirectToTextTranslate, 100);
    }, true);
})();