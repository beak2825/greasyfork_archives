// ==UserScript==
// @name         Wikia Monobook Skin Redirect
// @namespace    moontouchedmog
// @version      0.5
// @description  Redirects any Wikia url to the monobook-skinned version to avoid requests to all the Fandom & advertisement resources that slow things down and block the page on faiule to load (e.g. if blocked by NoScript or RequestPolicy)
// @author       Moontouched-Moogle
// @run-at       document-start
// @include      *wikia.com*
// @downloadURL https://update.greasyfork.org/scripts/38155/Wikia%20Monobook%20Skin%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/38155/Wikia%20Monobook%20Skin%20Redirect.meta.js
// ==/UserScript==

//True if the URL does not contain the specified string (indexOf returns an index of -1 if the phrase isn't found)
if(window.location.href.indexOf("?useskin=monobook") == -1)
{
    //Appends the query string to the end of the URL, loading the monobook-styled version of the page which omits the advertising and extraneous Fandom fluff
    window.location = window.location.href.concat("?useskin=monobook");
}