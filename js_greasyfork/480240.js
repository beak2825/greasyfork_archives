// ==UserScript==
// @name         Stay The Course
// @version      0.2  
// @description  Remain unswayed by temptation
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @namespace https://greasyfork.org/users/1219943
// @downloadURL https://update.greasyfork.org/scripts/480240/Stay%20The%20Course.user.js
// @updateURL https://update.greasyfork.org/scripts/480240/Stay%20The%20Course.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bannedSites = ["pixiv", "chaturbate", "slushe", "xvideos", "pornhub", "xhamster", "redtube", "onlyfans", "manyvids", "peekvids", "4chan.org/gif", "onejav", "hitomi"]
    if((bannedSites.filter((item) => window.location.href.includes(item)).length > 0))
    {
        alert("The passions are uprooted and turned to flight by constant occupation of the mind with God. This is a sword that puts them to death...")
        window.location.href = "https://holytrinitydetroit.org/";
    }
})();