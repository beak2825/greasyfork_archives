// ==UserScript==
// @id             pmd-roleplay.forumotion.org-98b4da9b-a6f9-4042-8c3c-f3d83ba33546@pmd-roleplay
// @name           Newest View Link
// @namespace   coaster3000@pmd-rp.forumotion.com
// @description Provides a link to the latest post in the thread.
// @match       http://pmd-roleplay.forumotion.org/t*
// @version     0.1.0
// @grant       GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/10866/Newest%20View%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/10866/Newest%20View%20Link.meta.js
// ==/UserScript==

GM_addStyle("#pmd-rp-latestLink {background-color: rgba(255,255,255,0.35); border: 1px solid rgba(0,0,0,0.75); color: blue; margin-right: 4px; padding: 0 2px; font-size: 0.9em;border-radius: 4px; transition: all 1s ease-out;} #pmd-rp-latestLink:hover {background-color: rgba(0,0,0,0.35); color: cyan;}");
{
    var link = document.createElement("a");
        link.href=window.location.toString().replace(/(t\d+).*/, "$1-?view=newest");
        link.id="pmd-rp-latestLink";

    var text = document.createTextNode("Latest");
        link.appendChild(text);

    var arrows = document.getElementsByClassName("browse-arrows");
        arrows[0].insertBefore(link, arrows[0].childNodes[0]);
        arrows[0].width="11%";
}
