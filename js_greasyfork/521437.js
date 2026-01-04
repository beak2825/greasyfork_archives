// ==UserScript==
// @name         Syrics Home Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a home button to the lyrics download page for better workflow
// @author       Marcer_f
// @match        https://syrics-web-akashrchandran.vercel.app/spotify
// @license      MIT
// @match        https://syrics-web.vercel.app/spotify
// @icon         https://i.ibb.co/jWKPhXh/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521437/Syrics%20Home%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521437/Syrics%20Home%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Container für den Button erstellen
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '1000';
    container.style.width = '175px';
    container.style.height = '100px';

    // Button erstellen
    const button = document.createElement('button');
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.width = '100%';
    button.style.height = '100%';

    // Icon hinzufügen
    const icon = document.createElement('img');
    icon.src = 'https://ik.imagekit.io/gyzvlawdz/Projects/syrics/Black_Modern_Business_Logo__600___500_px___2240___1260_px__cYRO9HGTQ.png';
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.alt = 'Syrics Icon';

    button.appendChild(icon);

    // Button-Klick-Ereignis
    button.addEventListener('click', () => {
        window.location.href = 'https://syrics-web.vercel.app/';
    });

    // Button in den Container einfügen
    container.appendChild(button);

    // Container in den Header einfügen
    document.body.appendChild(container);
})();
