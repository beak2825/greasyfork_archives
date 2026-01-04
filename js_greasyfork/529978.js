// ==UserScript==
// @name         freepayz console -->
// @namespace    http://tampermonkey.net/
// @version      2025-03-15
// @description  вывод сообщений console.log на страницу
// @author       Danik Odze
// @match        https://freepayz.com/faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freepayz.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529978/freepayz%20console%20--%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/529978/freepayz%20console%20--%3E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var CaptchaSolverStatus = document.createElement('div');
    document.body.appendChild(CaptchaSolverStatus);

    CaptchaSolverStatus.classList.add('captchasolver-status');
	document.body.appendChild(document.createElement('style')).textContent = (`
                .captchasolver-status {
                position: fixed;
                font-size: 20px !important;
                top: 140px !important;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
                }
                `);

    function setCaptchaSolverStatus(html, color) {
        if (color === 'green') {
            CaptchaSolverStatus.style.color = 'green';
        } else if (color === 'red') {
            CaptchaSolverStatus.style.color = 'red';
        } else {
            CaptchaSolverStatus.style.color = 'black';
        }
        CaptchaSolverStatus.innerHTML = html;
    }

    setCaptchaSolverStatus('<p><b>Console:</b></p><br />', 'red');
    var old = console.log;
    var logger = document.querySelector("body > div.captchasolver-status");
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
})();