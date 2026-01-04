// ==UserScript==
// @name         Don't track my clicks, reddit
// @description  Removes the reddit outbound link tracking shit
// @namespace    http://reddit.com/u/OperaSona + Delmain
// @author       OperaSona, Delmain
// @match        *://*.reddit.com/*
// @version      0.1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378603/Don%27t%20track%20my%20clicks%2C%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/378603/Don%27t%20track%20my%20clicks%2C%20reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var a_col = document.getElementsByTagName('a');
        var a, actual_fucking_url;
        for(var i = 0; i < a_col.length; i++) {
            a = a_col[i];
            actual_fucking_url = a.getAttribute('data-href-url');
            if(actual_fucking_url) a.setAttribute('data-outbound-url', actual_fucking_url);
        }
    });
})();