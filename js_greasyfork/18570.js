// ==UserScript==
// @name          CR
// @namespace     CR
// @description   remove ads and force links in same window/tab
// @description:fr suppression des pubs et ouverture des liens dans la même fenêtre ou onglet
// @include       http://celebsroulette.com/*
// @include       http://www.celebsroulette.com/*
// @grant         GM_addStyle
// @version       0.1
// @license       GPL
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/18570/CR.user.js
// @updateURL https://update.greasyfork.org/scripts/18570/CR.meta.js
// ==/UserScript==

function fixLinks(event) {
    console.log("fixLinks :"+event);
    var links = document.getElementsByTagName('a');
    for (i = 0; i < links.length; i++)
      {
        links[i].removeAttribute("target");
      }
}

var elements = ["adv", "footer-margin"];
for (i = 0; i < elements.length; i++)
{
    element = document.getElementsByClassName(elements[i]);
    if (element[0])
    {
        element[0].remove();
    }
}

document.addEventListener("DOMContentLoaded", fixLinks, true);
selector = document.querySelector(".type-sort");
console.log(selector);
document.addEventListener("click", fixLinks, true);

if (selector) {
    console.log("selector : "+selector);
    selector.addEventListener("click", fixLinks, true);
}

document.getElementById("Friends").remove();
GM_addStyle(".block-video { margin-left: auto; margin-right: auto; width: 900px; }");
// GM_addStyle(".video-holder { max-height: 300px; }");
