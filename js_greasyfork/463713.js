// ==UserScript==
// @name         Wikipedia Classic Design
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Redirect Wikipedia to the classic design
// @author       Doctor Derp
// @match        *://en.wikipedia.org/*
// @match        *://es.wikipedia.org/*
// @match        *://de.wikipedia.org/*
// @match        *://it.wikipedia.org/*
// @match        *://fa.wikipedia.org/*
// @match        *://ru.wikipedia.org/*
// @match        *://ja.wikipedia.org/*
// @match        *://fr.wikipedia.org/*
// @match        *://zh.wikipedia.org/*
// @match        *://pt.wikipedia.org/*
// @match        *://*.m.wikipedia.org/*
// @match        *://simple.wikipedia.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463713/Wikipedia%20Classic%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/463713/Wikipedia%20Classic%20Design.meta.js
// ==/UserScript==
/**

This userscript is based predominantly on https://greasyfork.org/en/scripts/458501-vector-layout-for-wikipedia/code, as well as https://gitlab.com/userscripts3/Invidious-Preferences-Userscript.
It is designed to redirect wikipedia pages using the modern (2022) design to pages using a more classic design.
By default, it redirects to a theme based on Wikipedia's appearence in 2008 (modern). Other themes are avalible based on designs from 2002 (cologneblue), 2010 (vector), etc. For more information, see https://en.wikipedia.org/wiki/Wikipedia:Skin
To edit the enforced theme, change the skinchoice below. */


const skinchoice = 'modern';


/**Anytime you load a wikipedia page, this script will check the URL for the desired parameters, and apply them if not found. */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function() {
    'use strict';
    if(window.location.href.includes("useskin=" + skinchoice)===false){
        if(window.location.href.includes("?")){
            if(window.location.href.includes("#")){
                window.location.replace (window.location.href.substring(0, window.location.href.indexOf('#')) + ("&useskin=" + skinchoice) + window.location.href.substring(window.location.href.indexOf('#'),window.location.href.length));
            }
            else{
                window.location.replace (window.location.href + ("&useskin=") + skinchoice);
            }
        }
        else if(window.location.href.includes("#")){
            window.location.replace (window.location.href.substring(0, window.location.href.indexOf('#')) + ("?useskin=" + skinchoice) + window.location.href.substring(window.location.href.indexOf('#'),window.location.href.length));
        }
        else{
            window.location.replace (window.location.pathname + ("?useskin=" + skinchoice));
        }
    }
        var wikipediaLinks = Array.from(document.links).filter(link => link.href.includes("wikipedia"));
    for (var i = 0; i < wikipediaLinks.length; i++) {
        if(wikipediaLinks[i].href.includes("?") && !wikipediaLinks[i].href.includes("#") && !wikipediaLinks[i].href.includes("?u")){
            wikipediaLinks[i].href = wikipediaLinks[i].href + ("&useskin=" + skinchoice)
        }
        else if(!wikipediaLinks[i].href.includes("?") && !wikipediaLinks[i].href.includes(".png") && wikipediaLinks[i].href.includes("#")){
            wikipediaLinks[i].href = wikipediaLinks[i].href.replace("#", "?useskin=" + skinchoice + "#")
        }
        else if(!wikipediaLinks[i].href.includes("?") && !wikipediaLinks[i].href.includes(".png")){
            wikipediaLinks[i].href = wikipediaLinks[i].href + ("?useskin=" + skinchoice)
        }
    }

})();
