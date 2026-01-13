// ==UserScript==
// @name         Colourise Hacker News Hierarchy
// @namespace    https://news.ycombinator.com/
// @version      1.2
// @license      GPLv3
// @description  Applies a pastel colour palette to the the comments hierarchy on Hacker News to make it easier to see which level of comments a comment belongs to
// @author       xdpirate
// @match        https://news.ycombinator.com/item*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541459/Colourise%20Hacker%20News%20Hierarchy.user.js
// @updateURL https://update.greasyfork.org/scripts/541459/Colourise%20Hacker%20News%20Hierarchy.meta.js
// ==/UserScript==

// First style is added to make the comments look nicer - when applying a background colour to the posts they look very boxy by default
// Remaining styles is to unify the look of the posts if the user is using Dark Reader to apply a dark mode to the page
GM_addStyle(`
    td.ind ~ td.default {
        border-radius: 0.4em;
        padding: 0.5em;
    }

    div.commtext.c00, div.commtext a, div.reply a {
        color: #000 !important;
    }

    .downvoted, div.commtext a:visited {
        color: #888 !important;
    }
`);

// Unify colouring of downvoted comments
document.querySelectorAll("div.commtext").forEach(comment => {
    comment.classList.forEach(className => {
        if(className.match(/c[A-F0-9]{2}/)) {
            comment.classList.add("downvoted");
            return;
        }
    });
});

// Saturation of 100% and lightness of 85% provides a nice pastel colour palette, stepping through the wheel 20° at a time.
// Skipping degrees 60, 80, 180, 200, 300, 320 as they look too much like each other and don't provide enough visual differentiation.
// This provides a total of 12 different colours, corresponding to 12 levels of comments.
let colours = [];
for(let h = 0; h <= 360; h += 20) {
    if(h != 60 && h != 80 && h != 180 && h != 200 && h != 300 && h != 320) {
        colours.push(`hsl(${h}, 100%, 85%)`)
    }
}

// Quadruple the array from 12 to 48 elements to make sure we cover even the deepest levels of arguing;
// allowing colours to repeat is fine when they are 12 levels apart
colours.push(...colours);
colours.push(...colours);

GM_addStyle(`
    td.default {
        background-color: ${colours[0]};
    }
`);

for(let i = 0; i < colours.length; i++) {
    GM_addStyle(`
        td.ind[indent="${i}"] ~ td.default {
            background-color: ${colours[i]};
        }
    `);
}
