// ==UserScript==
// @name         RCS sane rankings
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show full rankings on RCS websites
// @author       @rcastellotti
// @match        https://www.milanosanremo.it/*
// @match        https://www.ilombardia.it/*
// @match        https://www.strade-bianche.it/*
// @match        https://www.tirrenoadriatico.it/*
// @match        https://www.milanotorino.it/*
// @match        https://ilgirodisicilia.it/*
// @match        https://www.ilgranpiemonte.it/*
// @match        https://www.giroditalia.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milanosanremo.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441816/RCS%20sane%20rankings.user.js
// @updateURL https://update.greasyfork.org/scripts/441816/RCS%20sane%20rankings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let line_tables = document.getElementsByClassName("line-table")
    Array.prototype.forEach.call(line_tables, function(el) {
        el.style.display="flex";
    });
})();