// ==UserScript==
// @id TextPlainStyleDarkCentered
// @name text/plain Style Dark Centered
// @description Light on dark centered content style for text/plain documents.
// @namespace https://github.com/glebm
// @author Gleb Mazovetskiy <glex.spb@gmail.com>
// @version 1.0.1
// @match *://*/*
// @grant none
// @run-at document-end
// @homepageUrl     https://gist.github.com/c6a76841160d80650c518c9a2d59265d
// @contributionURL https://etherchain.org/account/0x962644db6d8735446c1af84a2c1f16143f780184
// @downloadURL https://update.greasyfork.org/scripts/33131/textplain%20Style%20Dark%20Centered.user.js
// @updateURL https://update.greasyfork.org/scripts/33131/textplain%20Style%20Dark%20Centered.meta.js
// ==/UserScript==

(function() {
    if (document.contentType !== 'text/plain') return;
    const styleNode = document.createElement('style');
    styleNode.textContent = 
`body {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #111;
    color: rgb(212, 212, 212);
    font-size: 15px;
}`;
    document.head.appendChild(styleNode);
}());