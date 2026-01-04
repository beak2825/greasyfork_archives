// ==UserScript==
// @name         fuck connections roblox
// @match        https://www.roblox.com/*
// @namespace    http://cole.ong/
// @description  Replace every instance of "connection" shit with "friend"
// @author       colevr
// @version      1.0
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543318/fuck%20connections%20roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/543318/fuck%20connections%20roblox.meta.js
// ==/UserScript==

(function() {
    const replacements = {
        "Connections": "Friends",
        "connections": "friends",
        "Connection": "Friend",
        "connection": "friend",
        "Connect": "Friends",
        "connect": "friends",
        "Add Connection": "Add Friend",
        "add connection": "add friend",
        "Connection Request": "Friend Request",
        "connection request": "friend request",
        "Connection Requests": "Friend Requests",
        "connection requests": "friend requests"
    };

    function replaceText(n) {
        if (n.nodeType === 3) {
            let t = n.nodeValue;
            for (const k in replacements) t = t.replaceAll(k, replacements[k]);
            if (t !== n.nodeValue) n.nodeValue = t;
        } else if (n.nodeType === 1 && n.childNodes.length) {
            n.childNodes.forEach(replaceText);
        }
    }

    new MutationObserver(m => {
        for (const x of m) x.addedNodes.forEach(replaceText);
    }).observe(document.body, { childList: true, subtree: true });

    replaceText(document.body);

    const fixTitle = () => {
        let t = document.title;
        for (const k in replacements) t = t.replaceAll(k, replacements[k]);
        if (t !== document.title) document.title = t;
    };

    setInterval(fixTitle, 500);
})();
