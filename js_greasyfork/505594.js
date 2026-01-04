// ==UserScript==
// @name         Kirka.io Custom Skin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply a custom skin to Kirka.io
// @author       irrvlo
// @match        https://kirka.io/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/505594/Kirkaio%20Custom%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/505594/Kirkaio%20Custom%20Skin.meta.js
// ==/UserScript==

// Custom skin link
// Change the link below to whatever skin you want
const customSkinLink = "https://i.imgur.com/KwS4w4W.png";

// Don't change anything below
const oldIsArr = Array.isArray;
const muzzleImg = "https://kirka.io/assets/img/__shooting-fire__.effa20af.png";

Array.isArray = (...args) => {
    if (args[0] && args[0].map && args[0].map.image) {
        if (args[0].map.image.width === 64 && args[0].map.image.height === 64 && args[0].map.image.src !== muzzleImg) {
            if (customSkinLink !== '') args[0].map.image.src = customSkinLink;
        }
    }
    return oldIsArr(...args);
};