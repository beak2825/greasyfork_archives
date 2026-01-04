// ==UserScript==
// @name         Blacket Badge Reskins
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Update Blacket badges to be the ones for Rewrite!
// @author       You
// @match        *://*.blacket.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521167/Blacket%20Badge%20Reskins.user.js
// @updateURL https://update.greasyfork.org/scripts/521167/Blacket%20Badge%20Reskins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = {
        "/content/badges/Verified.webp": "https://i.ibb.co/X74SpJh/Verified.png",
        "/content/badges/Tester.webp": "https://i.ibb.co/fGqh0b4/Tester.png",
        "/content/badges/Plus.webp": "https://i.ibb.co/tZXPgHV/Plus-Tier-3.png",
        "/content/badges/Staff.webp": "https://i.ibb.co/zGMnj6R/Staff.png",
        "/content/badges/Owner.webp": "https://i.ibb.co/4tVGDLV/Owner.png",
        "/content/badges/Co-Owner.webp": "https://i.ibb.co/GRw5f66/Co-Owner.png",
        "/content/badges/OG.webp": "https://i.ibb.co/5hfkGvP/OG.png",
        "/content/badges/Legacy%20Ankh.webp": "https://i.ibb.co/0mky4Js/Legacy-Ankh.png",
        "/content/badges/Developer.webp": "https://i.ibb.co/HqTqYg6/Developer.png",
        "/content/badges/Booster.webp": "https://i.ibb.co/QQ9h6zr/Booster.png",
        "/content/badges/Blacktuber.webp": "https://i.ibb.co/6vWFzRK/Blacktuber.png",
        "/content/badges/Artist.webp": "https://i.ibb.co/ynMWtn2/Artist.png",
        "/content/badges/Big%20Spender.webp": "https://i.ibb.co/Bj478Fm/Big-Spender-3.png",
        "/content/badges/Big%20Spender%20V.webp": "https://i.ibb.co/Bsx67w5/Big-Spender-5.png",
        "/content/badges/Partner.webp": "https://i.ibb.co/chkZKDK/Partner.png",
        "/content/badges/6%20Month%20Veteran.webp": "https://i.ibb.co/S6cmzVx/6-Month-Veteran.png",
        "/content/badges/12%20Month%20Veteran.webp": "https://i.ibb.co/q7Mw6vq/12-Month-Veteran.png",
        "/content/badges/18%20Month%20Veteran.webp": "https://i.ibb.co/ChCDs6f/18-Month-Veteran.png",
        "/content/badges/24%20Month%20Veteran.webp": "https://i.ibb.co/z5qgwGf/20-Month-Veteran.png",
    };

    function replaceBadges() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            for (const [original, replacement] of Object.entries(replacements)) {
                if (img.src.includes(original)) {
                    img.src = replacement;
                }
            }
        });
    }

    setInterval(replaceBadges, 1);
})();