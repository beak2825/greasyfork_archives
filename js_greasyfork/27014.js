// ==UserScript==
// @name        allrecipes print version
// @namespace   n/a
// @version     3
// @description Skips to the print version of any recipe on allrecipes.com
// @author      Greasy.Fork.User
// @match       *://*.allrecipes.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27014/allrecipes%20print%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/27014/allrecipes%20print%20version.meta.js
// ==/UserScript==

function processClickEvent(ev) {
    "use strict";
    var ele = ev.target;
    //check if the clicked element is within an "A" element
    while (ele.tagName !== "BODY") {
        if (ele.tagName === "A") {
            //make sure it links to a recipe page and it's not already pointing to a printable page
            if ((/^\/recipe\/\d+\//i).test(ele.pathname) && !(/^\/recipe\/\d+\/.*?\/print/i).test(ele.pathname)) {
                //change the URL path to point to the printable version of the page
                if (ele.pathname[ele.pathname.length-1] === "/") {
                    ele.pathname += "print/";
                } else {
                    ele.pathname += "/print/";
                }
            }
            break; //"A" element is already found. stop looking further
        }
        ele = ele.parentNode;
    }
}

(function() {
    "use strict";
    document.addEventListener("click", processClickEvent, true);       // Mouse Button 1
    document.addEventListener("contextmenu", processClickEvent, true); // Mouse Button 2
    document.addEventListener("auxclick", processClickEvent, true);    // Mouse Button Middle
})();
