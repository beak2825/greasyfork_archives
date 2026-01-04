// ==UserScript==
// @name         [user] to OP's name on StackExchange sites
// @namespace    https://zachsaucier.com/
// @version      0.6
// @description  Changes [user] to the OP's username when commenting on StackExchange sites
// @author       Zach Saucier
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// @exclude     *://api.stackexchange.com/*
// @exclude     *://blog.*.com/*
// @exclude     *://chat.*.com/*
// @exclude     *://data.stackexchange.com/*
// @exclude     *://elections.stackexchange.com/*
// @exclude     *://openid.stackexchange.com/*
// @exclude     *://stackexchange.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373250/%5Buser%5D%20to%20OP%27s%20name%20on%20StackExchange%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/373250/%5Buser%5D%20to%20OP%27s%20name%20on%20StackExchange%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener("keyup", (e) => {
        let elem = e.target,
            opName = "[user]";

        if(document.querySelector(".owner .user-details a")) {
            opName = document.querySelector(".owner .user-details a").innerText;
        }

        if(elem.name === "comment") {
            elem.value = elem.value.replace(/\[user\]/g, opName);
        }
    });
})();