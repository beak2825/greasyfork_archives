// ==UserScript==
// @name         Filmtipset-IMDb-grej
// @version      0.1
// @description  Korrigerar IMDb-länkar på Filmtipset.
// @author       Tumba
// @match        *://www.filmtipset.se/film/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1056781
// @downloadURL https://update.greasyfork.org/scripts/463593/Filmtipset-IMDb-grej.user.js
// @updateURL https://update.greasyfork.org/scripts/463593/Filmtipset-IMDb-grej.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a
    if(a = document.querySelector("a[href^='https://www.imdb.com/title/tt']")) {
        a.href = a.href.replace(/0*([0-9]+)/, (m, g) => g.padStart(7, "0"))
    }
})();