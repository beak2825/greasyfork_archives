// ==UserScript==
// @name         Put Twitter's Like button where it belongs
// @namespace    https://github.com/arshxyz/twitterswitchback
// @version      1.0
// @description  Stop clicking tweet impressions accidentally
// @author       github.com/arshxyz
// @match        https://twitter.com/home
// @icon         https://raw.githubusercontent.com/arshxyz/twitterswitchback/main/revlogo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458593/Put%20Twitter%27s%20Like%20button%20where%20it%20belongs.user.js
// @updateURL https://update.greasyfork.org/scripts/458593/Put%20Twitter%27s%20Like%20button%20where%20it%20belongs.meta.js
// ==/UserScript==

(function () {
    function update(node) {
        function swapNodes(node1, node2) {
            const temp = document.createComment('')
            node2.replaceWith(temp)
            node1.replaceWith(node2)
            temp.replaceWith(node1)
        }
        let twt = node.querySelectorAll("article[data-testid='tweet']")
        if (twt.length == 0) return;
        twt.forEach((tweet) => {
            let icongroup = tweet.querySelector("div[role='group']")
            let icons = icongroup.childNodes
            // check for tweet view where views is shown in different group
            if (icons.length == 1) return;
            // check if already swapped
            if (icons[3].querySelectorAll("div[data-testid='like']").length > 0|| icons[3].querySelectorAll("div[data-testid='unlike']").length > 0) return;
            // bubble viewcount icon to the left
            swapNodes(icons[2], icons[3])
            swapNodes(icons[1], icons[2])
            swapNodes(icons[0], icons[1])
        })
    }
    async function main() {
        const obs = new MutationObserver((mut, ob) => {
            try {
                for (const m of mut) {
                    if (m.type === 'attributes') {
                        update(m.target)
                    }
                    for (const n of m.addedNodes) {
                        update(n);
                    }
                }
            }
            catch (error) {
            }
        })

        obs.observe(document, {
            childList: true,
            subtree: true,
            attributes: true
        })
        update(document)
    }

    main();
})();