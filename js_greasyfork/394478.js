// ==UserScript==
// @name         OHCHR Redirect Remover
// @namespace    https://github.com/jomut9/tpb-redirect-remover
// @version      0.0.2
// @description  The OHCHR links redirect remover
// @author       jomut9/ DL mod
// @include        *://thepiratebay*.org/?url=*
// @include        *://thepiratebay.org/?url=*
// @downloadURL https://update.greasyfork.org/scripts/394478/OHCHR%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/394478/OHCHR%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL.split('=');
    if (!url[1].includes('tbinternet.ohchr.org')){
        location.replace(url[1]);
    }
})();