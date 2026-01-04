// ==UserScript==
// @name         Remove AdBlock Warning from https://letstrololol.cz/
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables annoying AdBlock warning from website https://letstrololol.cz/
// @author       Martin Krajcirovic
// @match        https://letstrololol.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369210/Remove%20AdBlock%20Warning%20from%20https%3Aletstrolololcz.user.js
// @updateURL https://update.greasyfork.org/scripts/369210/Remove%20AdBlock%20Warning%20from%20https%3Aletstrolololcz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Remove Adblock Warning
    removeElementsByClass('smoke-base smoke-visible smoke-alert');

    function removeElementsByClass(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
})();