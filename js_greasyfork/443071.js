// ==UserScript==
// @name         Yandex Music disable D for dislike 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable "D" key for dislike on Yandex Music
// @author       Vallek
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443071/Yandex%20Music%20disable%20D%20for%20dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/443071/Yandex%20Music%20disable%20D%20for%20dislike.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keydown", function(e)
                        { if (e.code == 'KeyD') {
                            e.stopPropagation();
                         }
                        }, true);
    window.addEventListener("keypress", function(e)
                        { if (e.code == 'KeyD') {
                            e.stopPropagation();
                         }
                        }, true);
    window.addEventListener("keyup", function(e)
                        { if (e.code == 'KeyD') {
                            e.stopPropagation();
                         }
                        }, true);

})();