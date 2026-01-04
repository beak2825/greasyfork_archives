// ==UserScript==
// @name         zamknij karte po wyslaniu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zamknij karte
// @author       Niby informatyk
// @match        https://www.operatorratunkowy.pl/missions/close
// @icon         https://www.google.com/s2/favicons?sz=64&domain=operatorratunkowy.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477540/zamknij%20karte%20po%20wyslaniu.user.js
// @updateURL https://update.greasyfork.org/scripts/477540/zamknij%20karte%20po%20wyslaniu.meta.js
// ==/UserScript==
var $ = window.jQuery;



(function() {
    'use strict';
    console.log("przed close");
close();
    window.close();
    console.log("po close");



})();