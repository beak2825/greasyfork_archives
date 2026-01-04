// ==UserScript==
// @name         </> Kurt & Java Gece Modu
// @namespace    http://tampermonkey.net/
// @version      28.1
// @description  Kurt & Java
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424135/%3C%3E%20Kurt%20%20Java%20Gece%20Modu.user.js
// @updateURL https://update.greasyfork.org/scripts/424135/%3C%3E%20Kurt%20%20Java%20Gece%20Modu.meta.js
// ==/UserScript==

(function() {
    'use strict';

var css = '.hud-day-night-overlay{ background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);
})();