// ==UserScript==
// @name         Youtube No-Recommendations
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove Video Recommendations Completely 
// @author       BakaChan
// @match        https://*.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/36073/Youtube%20No-Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/36073/Youtube%20No-Recommendations.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////
//                          YTPATCHES.JS                             //
///////////////////////////////////////////////////////////////////////

(function() {
    'use strict';

    const overrides = Object.create(null);

///////////////////////////////////////////////////////////////////////

    overrides['#related']=function(e){ e[0].remove(); };
    overrides['.videowall-endscreen']=function(e){ e[0].remove(); };
    overrides['[page-subtype="home"]']=function(e){ e[0].remove(); };
    overrides['.ytp-ce-element']=function(l){ l.forEach( e=>e.remove() ); };
    overrides['ytd-guide-entry-renderer > [href="/feed/trending"]']=function(e){ e[0].parentNode.remove(); };

///////////////////////////////////////////////////////////////////////

    const on_load = function(e){
        for( var [s,o] of Object.entries(overrides) )
            if((e=document.querySelectorAll(s)).length) o(e);
    };

    document.addEventListener('yt-navigate-finish',function(){ on_load(); setTimeout(on_load,2000); });
    on_load();
})();