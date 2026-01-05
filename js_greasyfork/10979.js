// ==UserScript==
// @name         RapidLeech Popup Skipper
// @namespace    pk.qwerty12
// @version      0.1
// @author       qwerty12
// @description  Attempts to bypass the ad popup window on RapidLeech-based sites
// @include      *
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/10979/RapidLeech%20Popup%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/10979/RapidLeech%20Popup%20Skipper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function() {
        var tload = document.forms['transload'];
        if (tload && document.documentElement.textContent.toLowerCase().indexOf('leech') > -1)
        {
            var btn = document.getElementsByName('btnTransload');
            if (btn && btn[0])
                btn[0].parentNode.removeChild(btn[0]);

            btn = tload.elements;
            for (var i = 0; i < btn.length; ++i) {
                var type = btn[i].type;
                if (type === 'button' || type === 'submit')
                    btn[i].parentNode.removeChild(btn[i]);
            }

            btn = document.createElement('div');
            btn.style.border = '6px lime solid';
            btn.style.width = '200px';

            var hackedbtn = document.createElement('input');
            hackedbtn.style.font = '180% arial';
            hackedbtn.style.letterSpacing = '-.05em';
            hackedbtn.style.width = '200px';
            hackedbtn.style.height = '50px';
            hackedbtn.type = 'button';
            hackedbtn.value = 'Bypass!!';
            hackedbtn.addEventListener('click', function() {
                tload.submit();
            }, false);

            btn.appendChild(hackedbtn);
            tload.appendChild(btn);
        }
    });
}());
