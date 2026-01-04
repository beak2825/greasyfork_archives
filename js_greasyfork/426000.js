// ==UserScript==
// @name         Redcap Fields
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wider redcap fields
// @author       You
// @match        https://redcap.bidmc.harvard.edu/redcap/redcap_v10.6.12/DataEntry/index.php?pid=2503*
// @icon         https://www.google.com/s2/favicons?domain=harvard.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426000/Redcap%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/426000/Redcap%20Fields.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    'use strict';
    addGlobalStyle('form div {max-width:850px !important}');
    addGlobalStyle('td.col-7 {width:35%}');
    addGlobalStyle('td.col-5 {width:65%}');

    })();