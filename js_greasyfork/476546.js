// ==UserScript==
// @name         Minecraft Fandom 2 Wiki
// @namespace    https://gist.github.com/zlyfer/d7e32f789b226cf9d27ec75ffc3b952d
// @gomepage     https://zlyfer.net
// @version      0.3
// @description  Redirects and replaces links from "minecraft.fandom.com" to "minecraft.wiki"
// @author       zlyfer
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476546/Minecraft%20Fandom%202%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/476546/Minecraft%20Fandom%202%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceFandomLinks = () => {
        if (document.domain === "minecraft.fandom.com") {
            window.location.replace("minecraft.wiki");
            return;
        }

        document.querySelectorAll('a[href*="minecraft.fandom.com"]').forEach(anchor => {
            anchor.href = anchor.href.replace("minecraft.fandom.com", "minecraft.wiki");
        });
    };

    window.addEventListener('load', replaceFandomLinks);
    setInterval(replaceFandomLinks, 10);
})();
