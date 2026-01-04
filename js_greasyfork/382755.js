// ==UserScript==
// @name         Torn territoty wars
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Easy find all active wars
// @author       Jox [1714547]
// @match        https://www.torn.com/city.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382755/Torn%20territoty%20wars.user.js
// @updateURL https://update.greasyfork.org/scripts/382755/Torn%20territoty%20wars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      .territory.war {
             /*fill: red;*/
             /*fill-opacity: 1;*/
             animation: warpulse 5s linear !important;
             animation-iteration-count: infinite !important;
           }

        @keyframes warpulse {
            0% {
                fill: red;
                fill-opacity: 0.2;
            }
            10% {
                fill: red;
                fill-opacity: 0.9
            }
            30% {
                fill: indianred;
                fill-opacity: 0.8
            }
            40% {
                fill: inital;
                fill-opacity: 0.6
            }
            100% {
                fill:inital;
                fill-opacity: inital;
            }
        }
        `
    );
})();