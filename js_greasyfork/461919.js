// ==UserScript==
// @name         Geoguessr custom status bar and compass
// @version      1.0.2
// @description  Customize the color palette and fonts in the status bar from classic games and the compass image
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159
// @license      MIT
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/461919/Geoguessr%20custom%20status%20bar%20and%20compass.user.js
// @updateURL https://update.greasyfork.org/scripts/461919/Geoguessr%20custom%20status%20bar%20and%20compass.meta.js
// ==/UserScript==

// DEFINE YOUR GRADIENT OF COLORS FOR THE STATUS BAR BACKGROUND HERE
const gradient = `
#D22F2FBF 0%,
#FD6E00BF 20%,
#FEEE60BF 40%,
#4BAD4FBF 60%,
#1975D0BF 80%,
#8E26AABF 100%
`;
// The format for colors is #rrggbbaa: red (between 00 and ff), green (between 00 and ff), blue (between 00 and ff),
//                                     opacity (00 = transparent, ff = opaque, defaults to ff if you don't write it)
// If you have no idea how your favourite color is written in hex, go there: https://redketchup.io/color-picker
// Percentages are from top (0%) to bottom (100%) of the progress bar.
// So the color written with 0% is going to be the color at the top of the progress bar.
// You can add (and remove) any number of intermediate percentages, just don't forget the coma between the lines
// If you want just one color (not a gradient) you can just set the same color for both 0% and 100% and remove everything else

// COLOR OF THE "MAP", "ROUND", "SCORE"... LABELS
const labelColor = `#8E26AABF`;

// COLOR OF THE OTHER TEXTS (name of the map, 1/5...)
const valueColor = `#FFFFFFFF`;

// FONTS FOR THESE TEXTS
const fonts = ``;
// example:
// const fonts = `"Comic Sans MS", "Comic Sans"`;
// const fonts = ``; for keeping geoguessr's default

// COMPASS IMAGE: not necessarily an SVG, can also be a PNG etc
const compassImageLink = `https://www.geoguessr.com/_next/static/images/compass-4be6c2fc7875215e0ece8a0f358585aa.svg`
// geoguessr default: https://www.geoguessr.com/_next/static/images/compass-4be6c2fc7875215e0ece8a0f358585aa.svg

// COMPASS BACKGROUND IMAGE if you also want to replace the circle
const compassBackground = `null`
// null to go back to the geoguessr default (the circle)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule(`div[class*='slanted-wrapper_variantPurple__'] { --variant-background-color: linear-gradient(180deg, ${gradient});}`);
style.sheet.insertRule(`div[class*='status_label__'] { color: ${labelColor}; font-family: ${fonts}, neo-sans, sans-serif }`);
style.sheet.insertRule(`div[class*='status_value__'] { color: ${valueColor}; font-family: ${fonts}, neo-sans, sans-serif }`);
style.sheet.insertRule(`.compass__indicator { height: 3rem; width: 3rem; left: 0%; position: absolute; top: calc(50% - 1.5rem); object-fit: contain; }`);


function handleMutations() {
    const compass = document.querySelector(".compass__indicator");
    if (!!compass) {
        compass.src = compassImageLink;
        if (compassBackground != null && compassBackground != "null" && compass.parentNode.childElementCount == 2) {
            const bg = document.createElement("div");
            bg.innerHTML = `<img src=${compassBackground} style="height: 3rem; width: 3rem; left: 0%; position: absolute; top: calc(50% - 1.5rem); object-fit: contain;">`;
            compass.parentNode.insertBefore(bg, compass);
            compass.parentNode.children[0].style.opacity = "0%";
        }
    }
}

new MutationObserver((mutations) => handleMutations()).observe(__next, { subtree: true, childList: true});
