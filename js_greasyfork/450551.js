// ==UserScript==
// @name         Numerade Answer Revealer
// @namespace    https://quartzwarrior.xyz
// @version      0.1
// @description  Reveal all answers on numberade!
// @author       QuartzWarrior
// @match        https://www.numerade.com/questions/*
// @icon         https://www.google.com/s2/favicons?sz=96&domain=numerade.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/450551/Numerade%20Answer%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/450551/Numerade%20Answer%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.addEventListener('load', function () {
            document.getElementsByClassName("blur text-answer-heading equation")[0].className = "text-answer-heading equation"
            document.getElementsByClassName('blurry-text')[0].style.visibility = "hidden"
    })
})();