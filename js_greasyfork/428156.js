// ==UserScript==
// @name           Neopets - Classic Site Button
// @namespace
// @include        http://www.neopets.com/*
// @include        https://www.neopets.com/*
// @description    Allows the classic version of a page to load with one click. (Does not work with all pages.)
// @copyright      Lendri Mujina
// @grant          none
// @version 0.0.1.20210619010509
// @namespace https://greasyfork.org/users/394566
// @downloadURL https://update.greasyfork.org/scripts/428156/Neopets%20-%20Classic%20Site%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/428156/Neopets%20-%20Classic%20Site%20Button.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function cl(el,cls) {return el.getElementsByClassName(cls);}
    var logobutton = cl(document,"nav-logo__2020")[0].parentNode;
    var newURL = window.location.href + "\/x";
    logobutton.setAttribute("href",newURL);
})();