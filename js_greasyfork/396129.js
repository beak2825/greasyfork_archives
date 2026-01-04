// ==UserScript==
// @name         Google Images without text
// @namespace    https://github.com/Prid13
// @version      1.1
// @description  Remove title and description from below images on Google Images for a cleaner and simpler look, or if you prefer the look of Bing and DuckDuckGo but love Google too much.
// @author       Prid
// @include        /.+://.*\.?google\..+/.*search.*\?.*tbm=isch.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396129/Google%20Images%20without%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/396129/Google%20Images%20without%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    style.innerHTML  = ".VFACy { display: none!important; } ";
    style.innerHTML += ".gBPM8 .PNCib { margin-bottom: -20px; } ";
    style.innerHTML += ".YcWSDf { height: calc(82% + 16px)!important; } ";

    head.appendChild(style);

})();