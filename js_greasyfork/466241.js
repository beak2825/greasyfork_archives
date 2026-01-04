// ==UserScript==
// @name         My Own Apple Music Tweaks
// @description  Allow drag selection & adjust sidebar position so it doesn't hide the scroll bar, and more
// @namespace    http://tampermonkey.net/
// @version      0.8
// @author       You
// @match        http*://music.apple.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        GM_addStyle
// @grant        GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466241/My%20Own%20Apple%20Music%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/466241/My%20Own%20Apple%20Music%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const l = (m) => {
        console.log("Apple Music Tweaks:", m);
    };
    const le = (m) => {
        console.error("Apple Music Tweaks:", m);
    };

    // Remove Ctrl+A shortcut
    const orig_window_addEventListener = unsafeWindow.addEventListener.bind(unsafeWindow);
    unsafeWindow.addEventListener = function(n, i, o) {
        try {
            if (i.toString().indexOf('.selectAll()') !== -1) {
                return;
            }
            return orig_window_addEventListener(n, i, o);
        } catch (e) {
            le(e);
            return orig_window_addEventListener(n, i, o);
        }
    };

    window.addEventListener('load', function() {
        const getSongListEInterval = setInterval(() => {
            (function() {
                const songListEList = document.querySelectorAll('div.songs-list');
                if (songListEList.length <= 0) {
                    return;
                }
                const songListE = songListEList[0];
                if (songListE['__draggable_already_injected__'] === '1') {
                    return;
                }
                songListE['__draggable_already_injected__'] = '1';
                Object.defineProperty(songListE, 'draggable', { set: function(value) { return; } })
                songListE.setAttribute('draggable', false)
                songListE.style.webkitUserDrag = 'auto'
                songListE.style.webkitUserSelect = 'auto'
                songListE.style.userSelect = 'auto'
                // window.sx = songListE;
                // l("songList got");
                setTimeout(() => {
                    songListE.setAttribute('draggable', false);
                }, 100);
                // clearInterval(getSongListEInterval);
            })();
        }, 100);

        const lyricsUnbold = setInterval(() => {
            (function() {
               try {
                   const lyricsRoot = document.querySelector("amp-lyrics")?.shadowRoot?.querySelector("amp-lyrics-display-static")?.shadowRoot;
                   if (lyricsRoot === null || lyricsRoot === undefined || lyricsRoot['__unbold_already_done__'] === '1') {
                       return;
                   }
                   lyricsRoot['__unbold_already_done__'] = '1';
                   const styleElement = document.createElement('style');
                   styleElement.type = 'text/css';
                   styleElement.innerHTML = '* {font-weight: 100 !important; font-size: 17px;}';
                   lyricsRoot.appendChild(styleElement);
                } catch (e) {
                    console.error(e);
                }
            })();
        }, 100);

        /* const lyricsUnboldTimeSynced = setInterval(() => {
            (function() {
               try {
                   const lyricsRoot2 = document.querySelector("amp-lyrics")?.shadowRoot?.querySelector("amp-lyrics-display-time-synced")?.shadowRoot;
                   if (lyricsRoot2 === null || lyricsRoot2 === undefined || lyricsRoot2['__unbold_already_done__'] === '1') {
                       return;
                   }
                   lyricsRoot2['__unbold_already_done__'] = '1';
                   const styleElement2 = document.createElement('style');
                   styleElement2.type = 'text/css';
                   // styleElement2.innerHTML = '* {font-weight: 800 !important; font-size: 18px;} button.line { margin-top: 20px !important; }';
                   styleElement2.innerHTML = '* {font-weight: 800 !important; font-size: 18px;} button.line { margin-top: 20px !important; }';
                   lyricsRoot2.appendChild(styleElement2);
                } catch (e) {
                    console.error(e);
                }
            })();
        }, 100); */

        setTimeout(() => {
            // Remove search suggestion
            Array.from(document.querySelectorAll("input.search-input__text-field")).forEach(e => {
                e.addEventListener('input', function(event) { event.stopImmediatePropagation(); }, true);
            });


        }, 3000);

        GM_addStyle(`a, blockquote, body, code, dd, div, dl, dt, embed, fieldset, footer, form, h1, h2, h3, h4, h5, h6, header, html, img, legend, li, ol, p, pre, section, table, td, th, ul {
    -webkit-user-drag: auto;
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
}`);
        GM_addStyle(`html .side-panel[role=complementary] {
    right: 20px !important;
}`);

    }, false);
})();