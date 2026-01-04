// ==UserScript==
// @name         Force Mute Hypeddit SoundCloud Player
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces embedded SoundCloud players with muted versions that support the API on hypeddit.com.
// @author       Kxrbx
// @match        https://hypeddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532247/Force%20Mute%20Hypeddit%20SoundCloud%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/532247/Force%20Mute%20Hypeddit%20SoundCloud%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rebuildIframe(iframe) {
        const src = iframe.src;

        // Ne pas re-remplacer une iframe déjà modifiée
        if (iframe.dataset.modified === "true") return;

        // Vérifie si c'est bien une iframe SoundCloud
        if (!src.includes("soundcloud.com")) return;

        // Crée une nouvelle URL avec api=true & volume=0
        const url = new URL(src);
        url.searchParams.set("api", "true");
        url.searchParams.set("volume", "0");

        const newIframe = document.createElement("iframe");
        newIframe.src = url.toString();
        newIframe.width = iframe.width || "100%";
        newIframe.height = iframe.height || "166";
        newIframe.frameBorder = "no";
        newIframe.allow = "autoplay";
        newIframe.dataset.modified = "true";

        // Remplace l’iframe originale
        iframe.parentNode.replaceChild(newIframe, iframe);
    }

    // Observe la page pour détecter les iframes ajoutées dynamiquement
    const observer = new MutationObserver(() => {
        document.querySelectorAll('iframe[src*="soundcloud.com"]').forEach(rebuildIframe);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Lancer aussi au chargement initial
    window.addEventListener('load', () => {
        document.querySelectorAll('iframe[src*="soundcloud.com"]').forEach(rebuildIframe);
    });
})();
