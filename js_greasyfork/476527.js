// ==UserScript==
// @name        Fandom Redirect
// @namespace   https://github.com/Steve0Greatness/MovedFromFandomDB
// @match       https://*.fandom.com/*
// @grant       none
// @version     1.0
// @author      Steve0Greatness
// @description A script that automatically redirects from Fandom wikis to their new non-Fandom homes.
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/476527/Fandom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/476527/Fandom%20Redirect.meta.js
// ==/UserScript==

(async function() {
    const DataBase = await (await fetch("https://raw.githubusercontent.com/steve0greatness/movedfromfandomdb/master/database.json")).json();
    const BottomLevelDomain = location.hostname.split(".")[0];
    if (!(BottomLevelDomain in DataBase)) {
      return;
    }
    location = "//" + DataBase[BottomLevelDomain].newURL;
  })()