// ==UserScript==
// @name         Neopets: Replace NC TL/WL links with actual link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes DTI and jellyneo links on the neoboards clickable
// @author       Nyu (clraik)
// @match        *://*.neopets.com/neoboards/topic.phtml?topic=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480636/Neopets%3A%20Replace%20NC%20TLWL%20links%20with%20actual%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/480636/Neopets%3A%20Replace%20NC%20TLWL%20links%20with%20actual%20link.meta.js
// ==/UserScript==

(function() {
    const posts = document.getElementsByClassName("boardPostMessage");
    for (const post of posts)
    {
        const content = post.innerHTML;
        const regex = /(?:https?:\/\/)?(?:impress(?:-[\d]+)?|items)\.(?:openneo|jellyneo)\.net\/[^\s<]*/gi;

        const withAnchors = content.replace(regex, function(match) {
            const protocol = ((content.match(/-[\d]+/) || content.match(/jellyneo/)) ? "https://" : "http://");
            const url = match.startsWith('http') ? match : protocol + match;
            return "<a target='_blank' href='" + url + "'>" + match + "</a>";
        });
        post.innerHTML = withAnchors;
    }
})();