// ==UserScript==
// @name         Blacklisting Youtube channels DIY
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blacklisting channels
// @author       ShittyCodeMan
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/462341/Blacklisting%20Youtube%20channels%20DIY.user.js
// @updateURL https://update.greasyfork.org/scripts/462341/Blacklisting%20Youtube%20channels%20DIY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const $ = (q, e=document) => e?.querySelector?.(q),
          $$ = (q, e=document) => [...e?.querySelectorAll?.(q)],
          log = console.log.bind(console);

    const hideVideo = (e) => {
        let item = e.closest("ytd-rich-item-renderer, ytd-compact-video-renderer");
        item.style.display = "none";
        log(e.getAttribute("href") +" is filtered.");
    }

    const queryBL = (bl, e=document) => {
        $$("#channel-name a", e)
            .filter(v => bl.has(v.getAttribute("href")))
            .forEach(hideVideo);
    }

    let bl = new Set(GM_getValue("BL", []));

    GM_registerMenuCommand("Add to BL", (..._) => {
        let channel = prompt("チャンネルのアドレスを入力", "https://www.youtube.com/@GoogleJapan");
        if (!channel) {
            return;
        }
        channel = channel.replace("https://www.youtube.com/@", "/@");
        bl.add(channel);
        GM_setValue("BL", Array.from(bl));
        queryBL(bl);
    });

    const obsOpt = {subtree: true, attributes: true, attributeFilter: ["href"]};

    let filterObs = new MutationObserver((list, obs) => {
        list = list.map(v => v.target);
        for (const node of list) {
            if (!bl.has(node.getAttribute("href"))) {
                continue;
            }
            hideVideo(node);
        }
    });
    filterObs.observe(document.body, obsOpt);
    queryBL(bl);
})();