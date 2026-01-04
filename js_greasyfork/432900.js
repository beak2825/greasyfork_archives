// ==UserScript==
// @name         Cool Math Games Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  No More Ads.
// @author       You
// @match        https://www.coolmathgames.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432900/Cool%20Math%20Games%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/432900/Cool%20Math%20Games%20Ad%20Blocker.meta.js
// ==/UserScript==

setTimeout(function() {
removePrerollAndDisplayGame();
}, 475);
setInterval(()=>{
    try {
        document.getElementsByClassName("ad-wrapper")[0].remove();
    } catch(o){}
}, 100);
