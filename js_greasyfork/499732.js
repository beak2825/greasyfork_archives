// ==UserScript==
// @name          JN to DTI Quicklink
// @description   Adds a link on JN wearable items to DTI item search
// @version       1.0
// @match        ://*items.jellyneo.net/*
// @namespace https://greasyfork.org/users/1328493
// @downloadURL https://update.greasyfork.org/scripts/499732/JN%20to%20DTI%20Quicklink.user.js
// @updateURL https://update.greasyfork.org/scripts/499732/JN%20to%20DTI%20Quicklink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isJN = document.URL.includes('items.jellyneo.net/item');
    const isWearable = document.body.innerHTML.includes('This item can be worn by Neopets.')

    if(isJN && isWearable) {
        const name = document.getElementsByTagName("h1")[0].getInnerHTML()
        const transformedName = name.replaceAll(' ', '%20')
        const dtiLinkURL = 'https://impress-2020.openneo.net/items/search/' + name

        document.getElementsByClassName('item-result-image')[0].parentNode.outerHTML += (`<div class="dtiLink"><a href="${dtiLinkURL}" target="_blank"><img src="https://i.imgur.com/9tbX2en.png"></a></div>`);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = `
            .dtiLink {
            text-align: center;
            padding: 5px;
            }
        `;
        document.body.appendChild(css);

    }
})();