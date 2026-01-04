// ==UserScript==
// @name         Eink-NoAnime
// @namespace    https://greasyfork.org/users/169007
// @version      1.2.1
// @description  Disable animation and add up and down button
// @author       ZZYSonny
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432702/Eink-NoAnime.user.js
// @updateURL https://update.greasyfork.org/scripts/432702/Eink-NoAnime.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    const exGlobalStyle = document.createElement('style');
    exGlobalStyle.type = 'text/css';
    exGlobalStyle.innerHTML = `
        body{
            font-size: 125% !important;
        }

        * {
            /*CSS transitions*/
            -o-transition-property: none !important;
            -moz-transition-property: none !important;
            -ms-transition-property: none !important;
            -webkit-transition-property: none !important;
            transition-property: none !important;
            transition: none !important;

            /*CSS transforms*/
            -o-transform: none !important;
            -moz-transform: none !important;
            -ms-transform: none !important;
            -webkit-transform: none !important;
            transform: none !important;

            /*CSS animations*/
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            -ms-animation: none !important;
            animation: none !important;
        };
    `
    head.appendChild(exGlobalStyle);
})();