// ==UserScript==
// @name         Christmas Town Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Torn CT 2019
// @author       Jox [1714547]
// @match        https://www.torn.com/christmas_town.php*
// @require      https://greasyfork.org/scripts/392756-torn-ct-map-draw-class/code/Torn%20CT%20Map%20Draw%20Class.user.js?v=8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394375/Christmas%20Town%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/394375/Christmas%20Town%20Styles.meta.js
// ==/UserScript==

(function() {
'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.ct-item img[src*="/gifts/"] {border-radius: 50%; box-shadow: 0 0 0 rgba(204,169,44, 0.4); animation: pulseY 2s infinite;}  @keyframes pulseY { 0% { box-shadow: 0 0 0 0 rgba(204,169,44, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(204,169,44, 0); } 100% { box-shadow: 0 0 0 0 rgba(204,169,44, 0); } }');
    addGlobalStyle('.ct-item img[src*="/combinationChest/"] {border-radius: 50%; box-shadow: 0 0 0 rgba(0,200,40, 0.4); animation: pulseG 2s infinite;}  @keyframes pulseG { 0% { box-shadow: 0 0 0 0 rgba(0,200,40, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(0,150,40, 0); } 100% { box-shadow: 0 0 0 0 rgba(0,200,40, 0); } }');
    addGlobalStyle('.ct-item img[src*="/chests/"] {border-radius: 50%; box-shadow: 0 0 0 rgba(63,183,252, 0.4); animation: pulseB 2s infinite;}  @keyframes pulseB { 0% { box-shadow: 0 0 0 0 rgba(63,183,252, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(63,183,252, 0); } 100% { box-shadow: 0 0 0 0 rgba(63,183,252, 0); } }');
    addGlobalStyle('.ct-item img[src*="/keys/"] {border-radius: 50%; box-shadow: 0 0 0 rgba(183,63,252, 0.4); animation: pulseM 2s infinite;}  @keyframes pulseM { 0% { box-shadow: 0 0 0 0 rgba(183,63,252, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(183,63,252, 0); } 100% { box-shadow: 0 0 0 0 rgba(183,63,252, 0); } }');
    
    //hide map directions
    addGlobalStyle('.d #ct-wrap .user-map-container .user-map:before {z-index: 0 !important}');

})();