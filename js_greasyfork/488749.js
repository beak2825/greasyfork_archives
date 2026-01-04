// ==UserScript==
// @name         WaybackMachine - Image preView on Archive.org pages
// @description  Provide archived images preview by replace all tags <a> with tags <img> in each archived images links
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/a18s9s6zkhpm0wrcvl3703zr0mel
// @version      1.3.3
// @author       Ravlissimo
// @match        https://web.archive.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://update.greasyfork.org/scripts/488748/1336185/waitForKeyElements2.js
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/921216
// @downloadURL https://update.greasyfork.org/scripts/488749/WaybackMachine%20-%20Image%20preView%20on%20Archiveorg%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/488749/WaybackMachine%20-%20Image%20preView%20on%20Archiveorg%20pages.meta.js
// ==/UserScript==

var imgExtRegex = new RegExp('(.*\.(gif|png|jpg|jpeg|webp|webm).*)$', 'im');
var waitForKeyElements;
waitForKeyElements ("tr > td > a", delinkImage);
//result = text.slice(-3);
function delinkImage (jNode) {
    var imgUrl2 = jNode.attr ("href");
    var imgUrl3 = imgUrl2.replace("*/","/");
    var imgUrl = imgUrl3.replace("/1500w/","/1500/");
      if (imgExtRegex.test (imgUrl) ) {
        //-- Found an image link.  Replace contents.
        jNode.html ('<img src="' + imgUrl + '" class="gmDeLinked" alt="GM replaced image">');
    }
}

GM_addStyle ( "img.gmDeLinked { border: 1px solid lime; max-width: 50vw; };" );