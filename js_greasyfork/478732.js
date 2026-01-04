// ==UserScript==
// @name         always on the plus side
// @version      0.2
// @description  every transfer is a +. unfortunately, it only works on the first transfer.
// @author       fumofetch
// @match        https://lzt.market/user/payments*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @namespace always on the plus side
// @downloadURL https://update.greasyfork.org/scripts/478732/always%20on%20the%20plus%20side.user.js
// @updateURL https://update.greasyfork.org/scripts/478732/always%20on%20the%20plus%20side.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function m() {
        document.querySelectorAll('.titleAction a.username').forEach(function(element) {
            var pst = element.previousSibling.textContent.trim();
            if (!pst.includes('от')) {
                element.previousSibling.textContent += 'от ';
            }
        });
        document.querySelectorAll('.statusIcon.success_out').forEach(function(element) {
            element.classList.remove('success_out');
            element.classList.add('success_in');
        });
        document.querySelectorAll('.out').forEach(function(element) {
            element.classList.remove('out');
            element.classList.add('in');
            element.textContent = '+ ' + element.textContent;
        });
    }

    function mi() {
        var elements = document.querySelectorAll('.titleAction a.username, .statusIcon.success_out, .out');
        var index = 0;
        var interval = setInterval(function() {
            if (index < elements.length) {
                m();
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
    mi();
})();