// ==UserScript==
// @name         TPB Redirect Remover
// @namespace    https://github.com/jomut9/tpb-redirect-remover
// @version      0.0.2
// @description  The Pirate Bay links redirect remover
// @author       jomut9
// @include        *://thepiratebay*.org/?url=*
// @include        *://thepiratebay.org/?url=*
// @downloadURL https://update.greasyfork.org/scripts/383988/TPB%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/383988/TPB%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL.split('=');
    if (!url[1].includes('thepiratebay')){
        location.replace(url[1]);
    }
})();
