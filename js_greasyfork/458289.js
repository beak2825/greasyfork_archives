// ==UserScript==
// @name         Youtube short killer
// @namespace    YSK
// @version      3.0
// @description  Redirect youtube shorts to normal videos
// @author       Modified by Rac00n (original code for website redirection by Gavin Borg)
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458289/Youtube%20short%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/458289/Youtube%20short%20killer.meta.js
// ==/UserScript==

addEventListener("yt-navigate-finish", function() {
    'use strict';

    // Initial creation of settings structure if it doesn't exist
    if(!GM_getValue("replaceTheseStrings")) {
        GM_setValue("replacePrefix", "");
        GM_setValue("replaceSuffix", "");
        GM_setValue("replaceTheseStrings", {"shorts/": "watch?v="});
        console.log("Created settings structure");
    }

    // Prefix/suffix apply to both sides
    var replacePrefix = GM_getValue("replacePrefix");
    var replaceSuffix = GM_getValue("replaceSuffix");
    var replaceAry = GM_getValue("replaceTheseStrings");
//     console.log(replacePrefix, replaceSuffix, replaceAry);

    var newURL = window.location.href;
    for(var key in replaceAry) {
        var toReplace = replacePrefix + key + replaceSuffix;
        var replaceWith = replacePrefix + replaceAry[key] + replaceSuffix;

        // Use a RegEx to allow case-insensitive matching
        toReplace = new RegExp(escapeRegex(toReplace), "i");

        newURL = newURL.replace(toReplace, replaceWith);
    }
//     console.table({"Original URL":window.location.href, "New URL":newURL});

    if(window.location.href !== newURL) {
        window.location.replace(newURL);
    }
})();

// From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}