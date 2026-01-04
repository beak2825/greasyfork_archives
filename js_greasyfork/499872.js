// ==UserScript==
// @name Trakt VIP Adblocker
// @namespace 1N07
// @version 1.2
// @description Removes VIP ads from Trakt
// @author 1N07
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.trakt.tv/*
// @downloadURL https://update.greasyfork.org/scripts/499872/Trakt%20VIP%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/499872/Trakt%20VIP%20Adblocker.meta.js
// ==/UserScript==

(function() {
let css = `       
    
    /*basic grid ad */
    div[class*="-grid-item"]
    {
        display: none;
    }
    
    /*grid separator ads */
    .row > div[id$="-wrapper"] {
        display: none !important;
    }
    /*profile page separator ads*/
    body[class*="signed-in"] > div[id$="-wrapper"],
    body > section[id$="-content-page"] {
        display: none;
    } 
    /*content overview separator ads*/
    #overview > div[id$="-wrapper"] {
        display: none;
    }
    /*content overview comments separator ads*/
    #info-wrapper .info > section[id$="-content-page"] {
        display: none;
    }

    
    /* /dashboard - top bar ad */
    .user-wrapper > .btn-vip{
        display: none;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
