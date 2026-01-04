// ==UserScript==
// @name         Scryfall Random
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        https://scryfall.com/*
// @icon         https://www.google.com/s2/favicons?domain=scryfall.com
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/452802/Scryfall%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/452802/Scryfall%20Random.meta.js
// ==/UserScript==

function _x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

(function($) {
    'use strict';

})();

window.onload = function(e) {
    var anchors = _x('//a[@href="/random"]')
    anchors.forEach(a => a.href = '/random?q=f%3Astandard')
}
