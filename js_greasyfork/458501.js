// ==UserScript==
// @name         Vector Layout For Wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  This script appends ?useskin=vector to any Wikipedia Wiki page you visit. This returns the site to its old default desktop layout before the 2023 redesign.
// @author       Ata Sancaktar
// @match        *://*.wikipedia.org/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458501/Vector%20Layout%20For%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/458501/Vector%20Layout%20For%20Wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.includes("useskin=vector")===false){
        if(window.location.href.includes("?")){
            if(window.location.href.includes("#")){
                window.location.replace (window.location.href.substring(0, window.location.href.indexOf('#')) + "&useskin=vector" + window.location.href.substring(window.location.href.indexOf('#'),window.location.href.length));
            }
            else{
                window.location.replace (window.location.href + "&useskin=vector");
            }
        }
        else if(window.location.href.includes("#")){
            window.location.replace (window.location.href.substring(0, window.location.href.indexOf('#')) + "?useskin=vector" + window.location.href.substring(window.location.href.indexOf('#'),window.location.href.length));
        }
        else{
            window.location.replace (window.location.pathname + "?useskin=vector");
        }
    }
    //var wikipediaLinks = Array.from(document.links).filter(link => link.href.includes("wikipedia"));
    //for (var i = 0; i < wikipediaLinks.length; i++) {
    //    if(wikipediaLinks[i].href.includes("?" && ! "?u")){
    //        wikipediaLinks[i].href = wikipediaLinks[i].origin + wikipediaLinks[i].pathname + "&useskin=vector" + wikipediaLinks[i].hash
    //    }
    //    else{
    //        wikipediaLinks[i].href = wikipediaLinks[i].origin + wikipediaLinks[i].pathname + "?useskin=vector" + wikipediaLinks[i].hash
    //    }
    //}
    // uncomment the lines above (erase the "//"s) to automatically convert Wikipedia links on the page for smoother browsing.
})();