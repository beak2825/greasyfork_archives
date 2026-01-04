// ==UserScript==
// @name         fress-site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help you copy ss accounts
// @author       You
// @match        https://free-ss.site/
// @icon         https://www.google.com/s2/favicons?domain=free-ss.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427665/fress-site.user.js
// @updateURL https://update.greasyfork.org/scripts/427665/fress-site.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = null;
    var getaccounts = function() {
        var trs = document.querySelectorAll('#tbss tr');
        var accounts = Array.from(trs)
        .map(function(tr) {
            var a = [];
            var tds = tr.querySelectorAll('td');
            if (tds.length !== 8) return '';
            tds.forEach(function(td) {
                a.push(td.textContent.trim());
            });
            return 'ss://' + btoa(a[3] + ':' + a[4] + '@' + a[1] + ':' + a[2]);
        }).filter(Boolean);
        if (!accounts.length) {
            setTimeout(getaccounts, 200);
            return;
        }
        clearTimeout(timer);
        navigator.clipboard.writeText(accounts.join('\n')).then(
            function () {
                alert('copied!');
            },
            function () {
                alert('failed' + e.message);
            }
        );
    };
    timer = setTimeout(getaccounts, 200);

    // GM_setClipboard(accounts, 'text')
    // Your code here...
})();