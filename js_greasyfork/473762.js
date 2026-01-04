// ==UserScript==
// @name        e-hentai add karma link
// @namespace   https://greasyfork.org/scripts/473762
// @version     1.1
// @description e-hentai auto add karma link in [Karma Log] page
// @author      fmnijk
// @match       https://e-hentai.org/*
// @icon        https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473762/e-hentai%20add%20karma%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/473762/e-hentai%20add%20karma%20link.meta.js
// ==/UserScript==

/* main function */
(function() {
    'use strict';

    if (window.location.href !== 'https://e-hentai.org/logs.php?t=karma'){
        return false;
    }

    var th = document.createElement('th');
    th.textContent = 'Reply';
    th.style = 'text-align:left; border-bottom:1px solid #5C0D12; width:50px';
    var referenceNode = document.querySelector('body > div:nth-child(5) > table > tbody > tr:nth-child(1) > th:nth-child(4)');
    referenceNode.parentNode.insertBefore(th, referenceNode);

    var lastRowIndex = document.querySelector('body > div:nth-child(5) > table > tbody').rows.length;
    for (var i = 2; i <= lastRowIndex; i++) {
        var a = document.createElement('a');
        var href = document.querySelector('body > div:nth-child(5) > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3) > a').href;
        var showuser = href.split('=')[1];
        a.href = 'https://e-hentai.org/dmspublic/karma.php?u=' + showuser;
        a.textContent = 'k+';
        var td = document.createElement('td');
        td.style = 'text-align:left; vertical-align:top';
        td.appendChild(a);
        referenceNode = document.querySelector('body > div:nth-child(5) > table > tbody > tr:nth-child(' + i + ') > td:nth-child(4)');
        referenceNode.parentNode.insertBefore(td, referenceNode);
    }
})();

