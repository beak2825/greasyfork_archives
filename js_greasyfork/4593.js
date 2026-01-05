// ==UserScript==
// @name           Something Awful Image-Domain On Hover
// @namespace      http://www.mathemaniac.org
// @include        *://forum.somethingawful.com/showthread.php?*
// @include        *://forums.somethingawful.com/showthread.php?*
// @include        *://archives.somethingawful.com/showthread.php?*
// @description    Displays the domain of images on hover.
// @version        1.1.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4593/Something%20Awful%20Image-Domain%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/4593/Something%20Awful%20Image-Domain%20On%20Hover.meta.js
// ==/UserScript==

// Change for v1.1.1, June 6th, 2016: Support https.
// Change for v1.1.0, December 9th, 2012: Handle attachments.
// Change for v1.0.1, August 6th, 2011: Handle timgs.

var imgs = document.getElementsByTagName('img');
for (var i = 0; i < imgs.length; i++) {
    var curImg = imgs[i];
    if (curImg.classList.contains('img') || curImg.classList.contains('timg')) {
        var domain = curImg.getAttribute('src').match(/https?:\/\/([^\/]+)\//);
        if (domain) {
            curImg.setAttribute('title', domain[1]);
        } else {
            console.log("SA Image-Domain On Hover: Couldn't determine location of '" + curImg.getAttribute('src') + "'.");
        }
    } else if (curImg.parentNode.classList.contains('attachment')) {
        curImg.setAttribute('title', '[attachment]');
    }
}
