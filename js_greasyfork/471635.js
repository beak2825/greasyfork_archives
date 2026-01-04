// ==UserScript==
// @name         Twitter Tab Revert
// @namespace    aubymori.github.io
// @version      2.0.2
// @description  Reverts the Twitter favicon and tab title
// @author       aubymori
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471635/Twitter%20Tab%20Revert.user.js
// @updateURL https://update.greasyfork.org/scripts/471635/Twitter%20Tab%20Revert.meta.js
// ==/UserScript==

let faviconElOg = null;
let faviconEl = document.createElement("link");
faviconEl.setAttribute("rel", "shortcut icon");
faviconEl.setAttribute("href", "https://abs.twimg.com/favicons/twitter.2.ico");

async function waitForElm(sel)
{
    while (document.querySelector(sel) == null)
    {
        await new Promise(r => requestAnimationFrame(r));
    }
    return document.querySelector(sel);
}

waitForElm("link[rel=\"shortcut icon\"]").then(() => {
    document.head.insertAdjacentElement("beforeend", faviconEl);
});

function revertTab()
{
    if (faviconElOg == null)
    {
        faviconElOg = document.querySelector("link[rel=\"shortcut icon\"]");
        if (faviconElOg == null)
        {
            return;
        }
    }

    faviconEl.setAttribute(
        "href",
        faviconElOg.getAttribute("href").replace(/\.3\.ico$/, ".2.ico")
    );

    if (document.title.endsWith("X"))
    {
        document.title = document.title.replace(/X$/, "Twitter");
    }
}

setInterval(revertTab, 10);