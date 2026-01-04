// ==UserScript==
// @name         The werid virus?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This isn't really a viurs, just something werid I found that happends when you reload a website fast enough. This is a new type of virus I call "the reload" what it does is when you set it to 60 or lower it can crash your computer completely, and it's such a small code if gets more known then this could be dangerous since it's such a small line of code.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541808/The%20werid%20virus.user.js
// @updateURL https://update.greasyfork.org/scripts/541808/The%20werid%20virus.meta.js
// ==/UserScript==
setInterval(() => {
    location.reload();
}, 1);