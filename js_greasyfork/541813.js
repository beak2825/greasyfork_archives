// ==UserScript==
// @name         Twitch OAuth Token Kopierer
// @namespace    https://greasyfork.org/de/users/1492193-foschbaa
// @version      2.0
// @description  Fügt einen o-Auth-Link ins Twitch-Menü ein. Kopiert den OAuth-Token bei Klick in die Zwischenablage – ideal für Streamlink.
// @author       Foschbaa
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @homepageURL  https://greasyfork.org/de/users/1492193-foschbaa
// @supportURL   https://greasyfork.org/de/users/1492193-foschbaa
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541813/Twitch%20OAuth%20Token%20Kopierer.user.js
// @updateURL https://update.greasyfork.org/scripts/541813/Twitch%20OAuth%20Token%20Kopierer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === LOKALISIERUNG ===
    const LANGUAGES = {
        de: {
            LINK_LABEL: "o-Auth",
            BTN_COPY: "OAuth-Token kopieren",
            BTN_ERROR: "Kein OAuth-Token gefunden – bitte einloggen!",
            TOAST_COPIED: "Der OAuth-Token wurde erfolgreich in die Zwischenablage kopiert.",
            TOAST_COPY_FAILED: "Das Kopieren des Tokens ist fehlgeschlagen.",
            TOAST_LOGIN: "Bitte logge dich auf Twitch ein, damit dein OAuth-Token ausgelesen werden kann."
        },
        en: {
            LINK_LABEL: "o-Auth",
            BTN_COPY: "Copy OAuth token",
            BTN_ERROR: "No OAuth token found – please log in!",
            TOAST_COPIED: "OAuth token has been copied to clipboard.",
            TOAST_COPY_FAILED: "Copying the token failed.",
            TOAST_LOGIN: "Please log in to Twitch so your OAuth token can be read."
        }
    };
    const BROWSER_LANG = navigator.language.slice(0,2);
    const TEXT = LANGUAGES[BROWSER_LANG] || LANGUAGES["de"];

    // === DESIGN ===
    const TOAST_TIMEOUT = 1500;
    const COLOR_TOAST_SUCCESS = "#23272a";
    const COLOR_TOAST_ERROR = "#ff3860";

    function showToast(message, error = false, duration = TOAST_TIMEOUT) {
        const oldToast = document.getElementById("twitch-oauth-toast");
        if (oldToast && oldToast.parentNode) oldToast.parentNode.removeChild(oldToast);

        const toast = document.createElement("div");
        toast.id = "twitch-oauth-toast";
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "80px";
        toast.style.right = "30px";
        toast.style.padding = "14px 24px";
        toast.style.background = error ? COLOR_TOAST_ERROR : COLOR_TOAST_SUCCESS;
        toast.style.color = "#fff";
        toast.style.fontSize = "16px";
        toast.style.fontWeight = "bold";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 2px 12px rgba(0,0,0,0.18)";
        toast.style.zIndex = 10000;
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s, transform 0.5s";
        toast.style.transform = "translateY(-20px)";
        toast.style.pointerEvents = "none";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        }, 50);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-20px)";
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        }, duration);
    }

    function getToken() {
        return document.cookie.split("; ").find(item => item.startsWith("auth-token="))?.split("=")[1];
    }

    function showCopyButton(token) {
        const oldBtn = document.getElementById("twitch-oauth-copy-btn");
        if (oldBtn && oldBtn.parentNode) oldBtn.parentNode.removeChild(oldBtn);

        const copyBtn = document.createElement("button");
        copyBtn.id = "twitch-oauth-copy-btn";
        copyBtn.textContent = TEXT.BTN_COPY;
        copyBtn.style.position = "fixed";
        copyBtn.style.top = "60px";
        copyBtn.style.right = "30px";
        copyBtn.style.background = "#9147ff";
        copyBtn.style.color = "#fff";
        copyBtn.style.border = "none";
        copyBtn.style.borderRadius = "8px";
        copyBtn.style.padding = "10px 18px";
        copyBtn.style.fontSize = "15px";
        copyBtn.style.fontWeight = "bold";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.zIndex = 10001;
        copyBtn.onmouseover = () => copyBtn.style.background = "#772ce8";
        copyBtn.onmouseout = () => copyBtn.style.background = "#9147ff";

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(token);
                showToast(TEXT.TOAST_COPIED, false);
            } catch (e) {
                showToast(TEXT.TOAST_COPY_FAILED, true);
            }
            if (copyBtn && copyBtn.parentNode) copyBtn.parentNode.removeChild(copyBtn);
        };

        document.body.appendChild(copyBtn);

        setTimeout(() => {
            if (copyBtn && copyBtn.parentNode) copyBtn.parentNode.removeChild(copyBtn);
        }, 5000);
    }

    function addOauthMenuEntry() {
        // Prüfen, ob der Eintrag schon existiert
        if (document.querySelector('a[data-a-target="oauth-link"]')) return;

        // Container mit den Menüeinträgen suchen
        const menuContainer = document.querySelector('.top-nav__menu .Layout-sc-1xcs6mc-0.pbocV');
        if (!menuContainer) return;

        // Einen bestehenden Menüpunkt als Vorlage nehmen (z.B. "Following")
        const templateEntry = menuContainer.querySelector('a[data-a-target="following-link"]');
        if (!templateEntry) return;

        // Den gesamten Menüpunkt (inkl. Wrapper) klonen
        const wrapperDiv = templateEntry.closest('.Layout-sc-1xcs6mc-0.fRzsnK');
        if (!wrapperDiv) return;
        const newEntry = wrapperDiv.cloneNode(true);

        // Den Link im geklonten Menüpunkt anpassen
        const link = newEntry.querySelector('a.navigation-link');
        if (!link) return;
        link.setAttribute('href', '#');
        link.setAttribute('aria-label', TEXT.LINK_LABEL);
        link.setAttribute('data-a-target', 'oauth-link');
        link.setAttribute('label', TEXT.LINK_LABEL);
        link.setAttribute('icon', 'Key'); // Optional: anderes Icon

        // Den sichtbaren Text anpassen
        const p = link.querySelector('p');
        if (p) p.textContent = TEXT.LINK_LABEL;

        // Tooltip anpassen
        const tooltip = link.querySelector('.tw-tooltip');
        if (tooltip) tooltip.textContent = TEXT.LINK_LABEL;

        // Klick-Handler für Token-Kopie
        link.onclick = (e) => {
            e.preventDefault();
            const token = getToken();
            if (token) {
                showCopyButton(token);
            } else {
                showToast(TEXT.TOAST_LOGIN, true);
            }
        };

        // Den neuen Menüpunkt ans Ende der Menüleiste anhängen
        menuContainer.appendChild(newEntry);
    }

    // MutationObserver, um auf SPA-Navigation und Menü-Reloads zu reagieren
    const observer = new MutationObserver(addOauthMenuEntry);

    function waitForMenuAndObserve() {
        const menuContainer = document.querySelector('.top-nav__menu .Layout-sc-1xcs6mc-0.pbocV');
        if (menuContainer) {
            observer.observe(menuContainer, {childList: true, subtree: true});
            addOauthMenuEntry();
        } else {
            setTimeout(waitForMenuAndObserve, 500);
        }
    }

    waitForMenuAndObserve();
})();
