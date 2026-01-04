// ==UserScript==

// @name        twitter start with following tab
// @namespace   twitter_kboudy
// @description auto-selects Twitter's "following" tab instead of the default "for you" tab
// @match     https://twitter.com/*
// @match     https://twitter.com
// @version     1.1
// @run-at      document-start
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458642/twitter%20start%20with%20following%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/458642/twitter%20start%20with%20following%20tab.meta.js
// ==/UserScript==

const intervalHandle = setInterval(function(){
    const tabs = document.querySelectorAll("[role='tab']");
    if (tabs.length > 1)
    {
        tabs[1].click();
        clearInterval(intervalHandle);
    }
},100);