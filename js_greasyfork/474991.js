// ==UserScript==
// @name         Text Copy Enabler
// @name:ja      Text Copy Enabler
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enable text copying on Japanese lyric websites
// @description:ja 日本語歌詞サイトでのテキストコピーを可能にします
// @author       Tonikkl
// @match        https://www.oricon.co.jp/prof/*/lyrics/*/
// @match        https://www.uta-net.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474991/Text%20Copy%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/474991/Text%20Copy%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf('www.oricon.co.jp') > -1) {
        // Override CSS properties to enable text selection
        var styleOricon = document.createElement('style');
        styleOricon.innerHTML = '.all-lyrics { user-select: text !important; -webkit-user-select: text !important; }';
        document.head.appendChild(styleOricon);

        // Remove the oncontextmenu, onmousedown, and onselectstart attributes
        var elements = document.querySelectorAll('.all-lyrics');
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeAttribute('oncontextmenu');
            elements[i].removeAttribute('onmousedown');
            elements[i].removeAttribute('onselectstart');
        }
    }

    if (window.location.href.indexOf('www.uta-net.com') > -1) {
        // Override CSS properties to enable text selection and interaction
        var styleUtaNet = document.createElement('style');
        styleUtaNet.innerHTML = `
            .nocopy, .nocopy * {
                user-select: text !important;
                -webkit-user-select: text !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(styleUtaNet);

        // Disable common event listeners which might prevent copying
        window.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
        }, true);

        window.addEventListener('selectstart', function(e) {
            e.stopPropagation();
        }, true);

        window.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        }, true);

        window.addEventListener('mouseup', function(e) {
            e.stopPropagation();
        }, true);
    }
})();
