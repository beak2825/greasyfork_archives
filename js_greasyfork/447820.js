// ==UserScript==
// @name         CleanerPsst
// @namespace    https://github.com/anonfoxer2
// @version      0.2
// @description  Attempts to remove any and all posts relating to ageplay or any variation of it.
// @author       anonfoxer
// @match        https://psstaudio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=psstaudio.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @liscense     MIT
// @downloadURL https://update.greasyfork.org/scripts/447820/CleanerPsst.user.js
// @updateURL https://update.greasyfork.org/scripts/447820/CleanerPsst.meta.js
// ==/UserScript==

var badPosts = $("div.card-body h5:contains('age')");
var badPosts2 = $("div.card-body h5:contains('Age')");
badPosts.parent().remove();
badPosts2.parent().remove();
console.log(badPosts + " was deleted");
console.log(badPosts2 + " was deleted");