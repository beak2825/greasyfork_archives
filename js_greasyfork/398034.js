// ==UserScript==
// @name         blockad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://m.whh396.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398034/blockad.user.js
// @updateURL https://update.greasyfork.org/scripts/398034/blockad.meta.js
// ==/UserScript==

function remove(selector) {
    var element = document.querySelector(selector);
    if (element) {
        // element.outerHTML = "";
        // element.style.display = 'none';
        element.remove();
    }
}

function block() {
    var scripts = document.querySelectorAll('script[src^=http], script[src^="/zz/yd5.js"]');
    console.log(scripts);
    scripts.forEach(o => o.remove());
    remove('#header_box');
    remove('#bottom_box')
    remove('#top_box');
    remove('#ABIOPAGDF_5718Fa');
    remove('#xnjKT431212_5718');
    remove('#xnjKT431212_5742');
    remove('#height_ABIOPAGDF_5718');
    remove('#height_ABIOPAGDF_5742')
}

(function() {
    'use strict';
    block();
    setInterval(() => block(), 1000);
})();