// ==UserScript==
// @name         Reset Default Translation
// @namespace    https://greasyfork.org/users/21515
// @version      0.1.0
// @description  Resets the language to auto because Google is always setting it to different unused languages
// @author       CennoxX
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Reset%20Default%20Translation]%20
// @include      https://translate.google.tld/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=translate.google.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444821/Reset%20Default%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/444821/Reset%20Default%20Translation.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", "avoid-escape"]*/
/* eslint curly: "off" */

(function() {
    "use strict";
    var i = setInterval(()=>{
        var buttonSelection = "c-wiz c-wiz c-wiz button";
        var firstButton = document.querySelector(buttonSelection);
        var firstSelectedButton = document.querySelector(buttonSelection + "[aria-selected=true]");
        var firstUnselectedButton = document.querySelector(buttonSelection + "[aria-selected=false]");
        if (firstButton == firstUnselectedButton)
            firstUnselectedButton.click();
        if (firstButton == firstSelectedButton)
            clearInterval(i);
    },50);
})();