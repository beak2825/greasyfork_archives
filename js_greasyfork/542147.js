// ==UserScript==
// @name         BrickPlanet Custom Emojis!
// @namespace    https://brickplanet.com/
// @version      1.2
// @description  Custom emojis displayed to anyone who has the extension. To find the emojis go down in the code, and find "const emojiMap = {", under it will be a bunch of emojis!
// @author       ADOFAI
// @match        *://*.brickplanet.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542147/BrickPlanet%20Custom%20Emojis%21.user.js
// @updateURL https://update.greasyfork.org/scripts/542147/BrickPlanet%20Custom%20Emojis%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const emojiMap = {
        ":troll_face:": "https://i.imgur.com/1b6XRcm_d.webp?maxwidth=760&fidelity=grand",
        ":sob:": "https://media.tenor.com/rOoqECIVI4kAAAAm/stop-this-madness-blue-emoji.webp",
        ":adofai:": "https://www.brickplanet.com/cdn/avatars/oCEIFbnH0FnzHe0K.png",
        ":telamonsrightarm:": "https://www.brickplanet.com/cdn/avatars/3gDskhNGWL1LI1Wg.png",
        ":inimateinsanity:": "https://www.brickplanet.com/cdn/avatars/default_avatar.png",
        ":bps2:": "https://www.brickplanet.com/cdn/avatars/ee7y27SgROmHu12r.png",
        ":randy_burns:": "https://www.brickplanet.com/cdn/avatars/sU5zVOcZB6UHyIYC.png",
        ":nepeta:": "https://www.brickplanet.com/cdn/avatars/9F62iuqPaCAodzLd.png",
    };

    const emojiRegex = new RegExp(
        `(${Object.keys(emojiMap).map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
        'g'
    );

    const scaleFactor = 3;

    function replaceEmojiInTextNode(textNode) {
        const parent = textNode.parentNode;
        if (!parent) return;

        const parts = textNode.textContent.split(emojiRegex);
        if (parts.length === 1) return;

        const frag = document.createDocumentFragment();
        const fontSize = getComputedStyle(parent).fontSize;
        const baseSize = parseFloat(fontSize) || 16;
        const size = baseSize * scaleFactor;

        parts.forEach(part => {
            if (emojiMap[part]) {
                const img = document.createElement("img");
                img.src = emojiMap[part];
                img.alt = part;
                img.title = part;
                img.style.width = `${size}px`;
                img.style.height = `${size}px`;
                img.style.objectFit = "contain";
                img.style.verticalAlign = "middle";
                img.style.display = "inline-block";
                frag.appendChild(img);
            } else {
                frag.appendChild(document.createTextNode(part));
            }
        });

        parent.replaceChild(frag, textNode);
    }

    function walkAndReplace(node) {
        if (
            node.nodeType === 3 &&
            node.textContent.match(emojiRegex)
        ) {
            replaceEmojiInTextNode(node);
        } else if (
            node.nodeType === 1 &&
            node.tagName !== "SCRIPT" &&
            node.tagName !== "STYLE" &&
            !node.closest(".CodeMirror")
        ) {
            for (let child of node.childNodes) {
                walkAndReplace(child);
            }
        }
    }

    walkAndReplace(document.body);

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    walkAndReplace(node);
                } else if (node.nodeType === 3 && emojiRegex.test(node.textContent)) {
                    replaceEmojiInTextNode(node);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
