// ==UserScript==
// @name         PortableOne.com Container Style
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change container style for site
// @author       Venkatt Guhesan
// @match        https://www.portableone.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=portableone.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441670/PortableOnecom%20Container%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/441670/PortableOnecom%20Container%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = ".container { width: 100%; max-width: 100% !important;}";
    addGlobalStyle(css)
    
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}