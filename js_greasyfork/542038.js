// ==UserScript==
// @name        Amiami - Hovering link to myfigurecollection
// @namespace   Violentmonkey Scripts
// @match       https://www.amiami.com/*
// @grant       none
// @version     1.0
// @author      kt0d
// @license     MIT
// @description Adds a hovering MFC button to Amiami page, leading to myfigurecollection using JAN code
// @downloadURL https://update.greasyfork.org/scripts/542038/Amiami%20-%20Hovering%20link%20to%20myfigurecollection.user.js
// @updateURL https://update.greasyfork.org/scripts/542038/Amiami%20-%20Hovering%20link%20to%20myfigurecollection.meta.js
// ==/UserScript==


function makeMFCLink() {
    const janCodeLabelElement = [].slice.call(document.getElementsByClassName('item-about__data-title')).filter(a => a.textContent.match("JAN code"));

    let janCodeElement = janCodeLabelElement[0].nextSibling;

    let janCode = janCodeElement.innerText;
    let mfcLink = `https://myfigurecollection.net/?keywords=${janCode}&_tb=item`;

    return mfcLink;
}

var floatingButton = document.createElement('button');
floatingButton.innerText = 'MFC';
floatingButton.style.position = 'fixed';
floatingButton.style.bottom = '120px';
floatingButton.style.right = '50px';
floatingButton.style.backgroundColor = '#999999e6';
floatingButton.style.color = 'white';
floatingButton.style.border = 'none';
floatingButton.style.borderRadius = '50%';
floatingButton.style.height = '48px';
floatingButton.style.width = '48px';
floatingButton.style.boxShadow = '0 4px 12px #00000080'
floatingButton.style.cursor = 'pointer';
floatingButton.style.zIndex = '1000';
floatingButton.style.fontSize = '1.125rem';

document.body.appendChild(floatingButton);

floatingButton.addEventListener('click', function () {
    let mfcLink = makeMFCLink();
    window.open(mfcLink, "_blank");

});
