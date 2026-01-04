// ==UserScript==
// @name         Meneame.net - Redirigir a versión rancia
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Abre por defecto Menéame en modo rancio con la URL old.meneame.net
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://www.meneame.net/*
// @run-at       document-start
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499691/Meneamenet%20-%20Redirigir%20a%20versi%C3%B3n%20rancia.user.js
// @updateURL https://update.greasyfork.org/scripts/499691/Meneamenet%20-%20Redirigir%20a%20versi%C3%B3n%20rancia.meta.js
// ==/UserScript==

(async function RedirigeRancio() {
    const url = "https://old.meneame.net";
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            window.location.replace(window.location.href.replace('www','old'));
        }
    } catch (error) {
        alert('Error al intentar acceder a la URL rancia de Menéame.\n\nDesactive el plugin "Meneame.net - Redirigir a versión rancia" en Tampermonkey para acceder bien y no seguir viendo este mensaje.');
    }
})();