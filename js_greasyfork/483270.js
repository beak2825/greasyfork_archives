// ==UserScript==
// @name         JetBrains the World
// @name:ja      世界をジェットブレインズに
// @version      2024-3-21
// @description  Let JetBrains take over the world.
// @description:ja ジェットブレインズに世界を任せよう。
// @author       PowfuArras
// @match        *://*/*
// @icon         https://cdn.glitch.global/0569f2ce-2c37-40fa-ae0e-360edca67c05/0978a0f9-98ab-4629-ac25-bf4b0b2abb21.image.png?v=1703726101721
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @namespace https://greasyfork.org/users/951187
// @downloadURL https://update.greasyfork.org/scripts/483270/JetBrains%20the%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/483270/JetBrains%20the%20World.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const fontLinkElement = document.createElement('link');
    fontLinkElement.rel = 'stylesheet';
    fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap';
    document.head.appendChild(fontLinkElement);

    const style = document.createElement('style');
    style.innerHTML = `* { font-family: 'JetBrains Mono', monospace !important; }`;
    if (GM_getValue(location.host, true)) document.head.appendChild(style);

    GM_registerMenuCommand('Toggle for this site', function () {
        const enabled = GM_getValue(location.host, true);
        GM_setValue(location.host, !enabled);
        if (enabled) document.head.removeChild(style);
        else document.head.appendChild(style);
    });
})();