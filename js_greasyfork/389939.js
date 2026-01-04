// ==UserScript==
// @name         Top
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add top button on every page.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389939/Top.user.js
// @updateURL https://update.greasyfork.org/scripts/389939/Top.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parent = document.createElement('div');
    var top = document.createElement('div');
    top.append('Top')
    top.onclick = function() {
        window.scrollTo(0, 0)
    }
    top.className = 'go-top'
    top.style.position = 'fixed';
    top.style.bottom = '20px';
    top.style.right = '20px';
    top.style.cursor = 'pointer';
    top.style.zIndex = '999';
    parent.append(top)
    document.body.append(parent);
    // Your code here...
})();

