// ==UserScript==
// @name         Force Select
// @version      1.0
// @description  Stop Discuz! X2.5 from disabling selection of text
// @author       Penn
// @match        *://pieayu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/228651
// @downloadURL https://update.greasyfork.org/scripts/374829/Force%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/374829/Force%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = 'html{ user-select: text !important; }';

    document.body.appendChild(style);

    // Create the script to remove the nodrag from chrome
    var script = document.createElement('script');
    script.type='text/javascript';
    script.innerHTML = "document.body.onmouseup = function() { return true }; document.body.onselect = function() { return true }; document.body.onselectstart = function() { return true }; document.body.onmousedown = function() { return true };";
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(script);

})();