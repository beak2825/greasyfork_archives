// ==UserScript==
// @name         Enhanced Separated Comments in Reddit
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  It puts a wide line between all parent comments in Reddit for a better visualization. (works in new Reddit)
// @author       Nakul Rawat
// @match        *://*.reddit.com/*
// @include      *://*.reddit.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387201/Enhanced%20Separated%20Comments%20in%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/387201/Enhanced%20Separated%20Comments%20in%20Reddit.meta.js
// ==/UserScript==

GM_addStyle ( `
    ._1YCqQVO-9r-Up6QPB9H6_4 div+div ._1z5rdmX8TDr6mqwNv7A70U {
        margin-top: 20px !important;
        border-top: 9px groove #91919199!important;
    }

    ._1YCqQVO-9r-Up6QPB9H6_4 div+div ._3sf33-9rVAO_v4y0pIW_CH[style^="padding-left"][style*="16px"] .threadline {
    margin-top: 9px !important;
    }
` );