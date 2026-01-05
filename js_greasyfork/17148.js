// ==UserScript==
// @name         Super Awesome Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  KappaKappa
// @author       xStiffdix
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17148/Super%20Awesome%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/17148/Super%20Awesome%20Script.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var script = document.createElement('script');
script.type = 'text/javascript';
script.textContent = '(' + (function () {
    var kek = document.createElement('iframe');
    kek.width = '100%';
    kek.height = '100%';
    kek.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    kek.frameBorder = '0';
    kek.id = 'xsht-player';
    kek.style.position = 'absolute';
    kek.style.top = '0';
    kek.style.left = '0';
    kek.style.pointerEvents = 'none';
    kek.style.opacity = '0.6';
    kek.style.zIndex = '1337';
    document.body.appendChild(kek);
}).toString() + ')()';
document.head.appendChild(script);
