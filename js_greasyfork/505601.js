// ==UserScript==
// @name           twitch unrecommend
// @version        1.03
// @description    twitch.tv script to hide recommended nav block
// @match          https://*.twitch.tv/*

// @run-at         document-end
// @namespace      https://greasyfork.org/users/1359318
// @downloadURL https://update.greasyfork.org/scripts/505601/twitch%20unrecommend.user.js
// @updateURL https://update.greasyfork.org/scripts/505601/twitch%20unrecommend.meta.js
// ==/UserScript==

window.onload = function () {

    document.querySelectorAll(".side-nav-section").forEach(entry => {
        if (entry.ariaLabel !== 'Followed Channels') {
            entry.style.setProperty("display", "none", "important");
        }
    });

    const targetNode = document.getElementById("root");
    const config = { childList: true, subtree: true };

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            mutation.addedNodes.forEach(entry => {
                if (entry.ariaLabel != null && (entry.ariaLabel === 'Recommended Channels' || entry.ariaLabel.endsWith('Viewers Also Watch'))) {
                    entry.style.setProperty("display", "none", "important");
                }
            });
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

}
