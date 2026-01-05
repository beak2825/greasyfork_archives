// ==UserScript==
// @name       Turtleseed Savior
// @author @what
// @namespace  http://www.turtleseed.com/what
// @version    1.5
// @description  Hide seeds from your shore (PLEASE NOTE THAT YOU MUST HAVE TAMPERMONKEY FOR CHROME (on the Chrome web store) OR GREASEMONKEY FOR FIREFOX (on addons.mozilla.org) INSTALLED)
// @match      *www.turtleseed.com/*
// @downloadURL https://update.greasyfork.org/scripts/4716/Turtleseed%20Savior.user.js
// @updateURL https://update.greasyfork.org/scripts/4716/Turtleseed%20Savior.meta.js
// ==/UserScript==

$('span:contains("word1")').replaceWith( "<p><center><b>This seed has been hidden because it contains a word that you have blacklisted</b></p></center>" );
$('span:contains("word2")').replaceWith( "<p><center><b>This seed has been hidden because it contains a word that you have blacklisted</b></p></center>" );
$('span:contains("word3")').replaceWith( "<p><center><b>This seed has been hidden because it contains a word that you have blacklisted</b></p></center>" );
$('span:contains("word4")').replaceWith( "<p><center><b>This seed has been hidden because it contains a word that you have blacklisted</b></p></center>" );

//replace word1, word2, word3, and word4 with your desired words to blacklist.
//PLEASE NOTE THAT THESE WORDS ARE CASE SENSITIVE


