// ==UserScript==
// @name         Remove green dot lowyat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ikankering godai
// @author       You
// @match        https://forum.lowyat.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380971/Remove%20green%20dot%20lowyat.user.js
// @updateURL https://update.greasyfork.org/scripts/380971/Remove%20green%20dot%20lowyat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    removeElementsByClass('fa fa-circle text-danger Blink');

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
})();