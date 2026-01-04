// ==UserScript==
// @name         Neutral TVer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TVer上の評価数を非表示にします
// @match        https://tver.jp/search
// @match        https://tver.jp/episodes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tver.jp
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442736/Neutral%20TVer.user.js
// @updateURL https://update.greasyfork.org/scripts/442736/Neutral%20TVer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var myId = 'custom_094bcd02d90b9ef02c9e652d325bf21a';
    var hideTarget = ['.episode-pattern-b-layout_statistics__W1fsR', '.like-button_label__wRGiw', '.episode-pattern-c_favoriteCountWrapper__3qoal'];
    var myStyleContent = hideTarget.join(', ');
    myStyleContent += '{ visibility: hidden }';

    var myStyleElement = document.getElementById(myId);
    if ( myStyleElement ) {
        return;
    }
    myStyleElement = document.createElement('style');
    myStyleElement.id = myId;
    document.head.appendChild(myStyleElement);
    myStyleElement.sheet.insertRule(myStyleContent);
})();