// ==UserScript==
// @name         ABC.es [~R]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deletes uncomfortable divs
// @author       Rutrus
// @match        https://www.abc.es/*
// @icon         https://www.google.com/s2/favicons?domain=abc.es
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433687/ABCes%20%5B~R%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433687/ABCes%20%5B~R%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // .paywall
    // head > script:nth-child(77)
    // head > script:nth-child(82)
    var del0 = document.querySelector('head > script:nth-child(82)');
    del0.remove();
    document.querySelector('head > script:nth-child(77)').remove()

    var script0 = document.querySelector('.cuerpo-texto');
    // body > script:nth-child(23)
    var body = document.querySelector('body');
    console.log(body);
    var script = body.getElementsByTagName('script');

    for (var i=script.length-1; i>=0; i--) {
        script[i].remove();
    }

    script.forEach(function (element){ element.remove()} );
})();