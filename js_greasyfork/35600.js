// ==UserScript==
// @name        siloGF
// @namespace   practik
// @description Open cross-domain links in new tabs & same-domain links in same tab; also add "Open in This Tab" menu option.
// @include     *
// @require     https://greasyfork.org/scripts/23069-publicsuffixlist-js/code/PublicSuffixListJs.js
// @version     0.5.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35600/siloGF.user.js
// @updateURL https://update.greasyfork.org/scripts/35600/siloGF.meta.js
// ==/UserScript==

//////////////////////////////// I. MENU STUFF /////////////////////////////////

let rcLink;
// This is whatever link is right-clicked, value to be assigned by menuOn below.

let body = document.body;
let referrer = document.referrer;
let menu = body.appendChild(document.createElement("menu"));
    menu.id = "menusilomenu";
    menu.type = "context";
let item = menu.appendChild(document.createElement("menuitem"));
    item.label = "Open Link in This Tab";
    item.addEventListener("click", openHere);
// Define custom contextual menu and "Open Link in This Tab" menu item.

body.addEventListener("contextmenu", menuOn);

function menuOn(rclick) {
    let rcNode = rclick.target;
    while (!rcNode.href && rcNode !== body) {
        rcNode = rcNode.parentNode;
    }
    rcLink = rcNode.href;
    /* When user right-clicks, get target node's link if it has one; if not, go
     * up DOM tree until either a link or <body> tag is found.
     */

    let thisTab;
    if (parent !== window && referrer) {
        thisTab = referrer;
    } else {
        thisTab = top.location.href;
    }
    // Two ways to get current URL; first is for links in cross-domain iframes. 

    if (rcLink && rcLink != thisTab && !rcLink.startsWith("javascript:") &&
        !rcLink.startsWith(thisTab.concat("#"))) {
        body.setAttribute("contextmenu", menu.id);
    } else {
        body.removeAttribute("contextmenu");
    }
}
/* If a valid link was found (not JS link or same page), set it as menu item's
 * destination and show item in menu; if not, hide item. To include nodes added
 * after page is loaded, this is done only when user actually r-clicks on page.
 */

function openHere() {
    top.location.href = rcLink;
    top.location.href = rcLink;
}
/* When user clicks on menu item, load selected link in current tab. Double load
 * fixes a glitch on developer.mozilla.org, where clicking twice on menu item in
 * same tab (by navigating back between clicks) produced a 404 error.
 */

///////////////////////////// II. LINK TARGETING ///////////////////////////////

let thisHostname;
let thisDomain;
if (parent !== window && referrer) {
    thisHostname = new URL(referrer).hostname;
    thisDomain = publicSuffixList.getDomain(thisHostname);
} else {
    thisHostname = top.location.hostname;
    thisDomain = publicSuffixList.getDomain(thisHostname);
}
// Two ways to get current domain; first is for links in cross-domain iframes. 

let xLinks = new RegExp("(^(javascript|magnet):|\\.(7z|bz2|doc|docx|gz|odp|" +
    "ods|odt|ppt|pptx|rar|rpm|rtf|swf|tgz|xls|xlsx|xz|zip|zipx)$)", "i");
// Crudely identify JS & binary file links that shouldn't open new tabs.

let asLinks = /^vm\.(navigateToPolicyDocuments|getDocument)/;
// Identify Allstate policy document links that shouldn't have any target set.

body.addEventListener("focusin", setTarget);

function setTarget() {
    let aE = document.activeElement;
    let thatHostname = aE.hostname;
    let thatDomain = publicSuffixList.getDomain(thatHostname);
    if ((thisDomain != thatDomain && !xLinks.test(aE.href)) || (thisHostname == 
        "encrypted.google.com" && thatHostname != "encrypted.google.com")) {
        aE.target = "_blank";
        aE.rel = "noreferrer";
    } else if (!aE.href.startsWith("javascript:") &&
        !asLinks.test(aE.dataset.ngClick)) {
        aE.target = "_top";
    }
}
/* Set valid external links to open in new tabs, same-domain links in same tab.
 * (For Google search pages, "external" includes Google nonsearch subdomains.
 * For Allstate policy document links, no target is set.) This is done only on
 * demand, for same reasons as menu activation above.
 */
