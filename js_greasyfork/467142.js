// ==UserScript==
// @name         LZTResponseJsonDecode
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Декодирование json ответов форума в читаемый вид.
// @author       Melonium
// @license      MIT
// @match        *://zelenka.guru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467142/LZTResponseJsonDecode.user.js
// @updateURL https://update.greasyfork.org/scripts/467142/LZTResponseJsonDecode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.search.includes('_xfResponseType=json')){
        let text = JSON.stringify(JSON.parse(document.body.children[0].innerText), null, '    ')
            document.body.children[0].innerText = text
    }
})();