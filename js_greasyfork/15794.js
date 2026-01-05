// ==UserScript==
// @name         Libs for every page
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  make jquery can be used in every page
// @author       cbj
// @include      *
// @match        https://greasyfork.org/en/scripts
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/15794/Libs%20for%20every%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/15794/Libs%20for%20every%20page.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
window.addEventListener('load', function() {
    if(!unsafeWindow.jQuery){
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js';
        document.body.appendChild(script);
    }
});