// ==UserScript==
// @name         Grab Mods Requiring Links
// @namespace    http://tampermonkey.net/
// @version      2024-03-27
// @description  Adds a button in requirements which copies the links to clipboard, you can then keep them or open them using multiple url openers, your choice. I won't add that feature to make this lightweight.
// @author       TragicNet
// @include      /^https:\/\/www\.nexusmods\.com\/.*\/mods\/\d+(\?.*)?$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491041/Grab%20Mods%20Requiring%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/491041/Grab%20Mods%20Requiring%20Links.meta.js
// ==/UserScript==

function grabLinks(reqBlock) {
    let rows = reqBlock.querySelectorAll('.table > tbody:nth-child(2) > tr');
    let links = [];
    rows.forEach((row) => {
        links.push(row.querySelector('td:nth-child(1) > a:nth-child(1)').href);
    });
    navigator.clipboard.writeText(links.join('\n'));
    alert("Copied the links to clipboard");
}

GM_addStyle(`
#grabLinkBtn {
    float: right;
}
`);

window.addEventListener('load', (event) => {
    let reqBlock1 = document.querySelector('dd.clearfix:nth-child(2) > div:nth-child(1)');
    let reqBlock2 = document.querySelector('dd.clearfix:nth-child(2) > div:nth-child(2)');

    if(reqBlock1.querySelector('.table')) {
        let button1 = document.createElement('button');
        button1.setAttribute('id', 'grabLinkBtn');
        button1.innerHTML = 'Grab Links';
        button1.className = 'btn';
        button1.addEventListener (
            "click", () => grabLinks(reqBlock1), false
        );
        reqBlock1.insertBefore(button1, reqBlock1.firstChild);
    }
    if(reqBlock2.querySelector('.table')) {
        let button2 = document.createElement('button');
        button2.setAttribute('id', 'grabLinkBtn');
        button2.innerHTML = 'Grab Links';
        button2.className = 'btn';
        button2.addEventListener (
            "click", () => grabLinks(reqBlock2), false
        );
        reqBlock2.insertBefore(button2, reqBlock2.firstChild);
    }
});
