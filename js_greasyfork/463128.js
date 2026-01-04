// ==UserScript==
// @name         CS:GO Stash instant inspect command copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a copy button to every item
// @author       Poggu https://twitter.com/poggu__
// @match        https://csgostash.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgostash.com
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463128/CS%3AGO%20Stash%20instant%20inspect%20command%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/463128/CS%3AGO%20Stash%20instant%20inspect%20command%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for(const el of document.getElementsByClassName("btn-group-sm btn-group-justified"))
    {
        const linkEl = el.children[0];
        if(linkEl && linkEl.href && linkEl.href.includes("rungame/730"))
        {
            const link = linkEl.href;
            const a = document.createElement("a");
            a.style.backgroundColor = "#977a2b";
            a.style.backgroundImage = "none";
            a.style.display = "table-row";
            a.onclick = () => {
                navigator.clipboard.writeText(`!i ${link}`);
            }
            a.innerText = "Copy";
            a.className = "btn btn-default market-button-skin";
            el.appendChild(a);
        }
    }
})();