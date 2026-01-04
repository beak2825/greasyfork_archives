// ==UserScript==
// @name           Soap2Day Autoplay
// @version        1.3
// @description    Autoplay soap2play shows and movies when the page loads. Written in Tampermonkey.
// @author         n0rmancodes
// @include        https://soap2day.to/*
// @include        https://soap2day.im/*
// @include        https://soap2day.ac/*
// @include        https://soap2day.se/*
// @include        https://s2dfree.to/*
// @include        https://s2dfree.cc/*
// @include        https://s2dfree.de/*
// @include        https://s2dfree.is/*
// @include        https://s2dfree.in/*
// @include        https://s2dfree.nl/*
// @grant          none
// @license        The Unlicense
// @source         https://github.com/n0rmancodes/soap2day-autoplay
// @namespace      github.com
// @namespace      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/412307/Soap2Day%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/412307/Soap2Day%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if (document.querySelector("video")) {
            document.querySelector("video").play();
            clearInterval(a);
        } else {
            var a = setInterval(function () {
                if (document.querySelector("video")) {
                    document.querySelector("video").play();
                    clearInterval(a);
                }
            }, 2000)
        }
})();
