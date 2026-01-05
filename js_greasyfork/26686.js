// ==UserScript==
// @name         Referer/Referrer Remover for Amazon 
// @namespace    throwitathimnot.me
// @version      1.2
// @description  Removes the referrer in the URL bar on an amazon page, and also removes referrer on amazon links.
// @author       Blank Blank
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26686/RefererReferrer%20Remover%20for%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/26686/RefererReferrer%20Remover%20for%20Amazon.meta.js
// ==/UserScript==

//For my UK friends if you wanna use this script I made it so you can easily edit it to .co.uk 
//saves you more time for tea and crumpets amirite 'govna
var ext = ".com";

(function() {
    for (var i = 0; i > document.links.length; i++) {
        var linkHref = document.links[i].href;
        var linkObj = document.links[i];
        var newLink;
        var newLinkObj;
        var container;
        if (window.location.href.contains("amazon" + ext)) {
            console.log("HI");
            if (linkHref.contains("/dp/")) {
                newLink = linkHref.substring(0, linkHref.indexOf("ref="));
                newLinkObj = document.createElement('a');
                newLinkObj.setAttribute("href", newLink);
                newLinkObj.setAttribute("class", linkObj.class);
                container = document.getElementById(linkObj.id).parentNode;
                container.insertBefore(newLinkObj, linkObj);
                container.removeChild(linkObj);
            }
        }
        
        if (linkHref.contains("http://amazon" + ext) || linkHref.contains("http://www.amazon" + ext) || linkHref.contains("https://amazon" + ext) || linkHref.contains("https://www.amazon" + ext)) {
            newLink = linkHref.substring(0, linkHref.indexOf("ref="));
            newLinkObj = document.createElement('a');
            newLinkObj.setAttribute("href", newLink);
            newLinkObj.setAttribute("class", linkObj.class);
            container = document.getElementById(linkObj.id).parentNode;
            container.insertBefore(newLinkObj, linkObj);
            container.removeChild(linkObj);
        }
    }
})();
