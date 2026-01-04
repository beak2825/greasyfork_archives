// ==UserScript==
// @name         Steam Deck availability alert
// @namespace    https://greasyfork.org/en/scripts/474465-steam-deck-availability-alert
// @version      0.2.8
// @description  Lädt die Seite regelmäßig neu und benachrichtigt dich wenn "nicht verfügbar" nicht mehr auf der Seite steht.
// @author       You
// @match        https://store.steampowered.com/sale/steamdeckrefurbished
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474465/Steam%20Deck%20availability%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/474465/Steam%20Deck%20availability%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const l = console.log;
    const on_available = () => {
        l('available!!');
        GM_notification({
            title: "Steam Deck verfügbar!",
            text: "Alle Steam Deck Varianten sind jetzt verfügbar. Du kannst das Script jetzt deinstallieren!",
            highlight: true,
            silent: false,
        });
        window.focus();
    }

    const on_not_available = () => {
        l('not available');
        const randomPlusMinus5Seconds = - 5 + Math.random() * 10;
        const reloadInterval = 10; // minutes
        const timeout = reloadInterval * 60 + randomPlusMinus5Seconds;
        const time = new Date(timeout*1000 + new Date().getTime());
        GM_notification({ title: `Noch nicht.`, text: `Nächste Prüfung ${time.toLocaleTimeString()}.`, timeout: 4000 });
        window.setTimeout(() => location.reload(), timeout*1000);
    }

    const checkPageNow = () => {
        l('check');
        let elems = Array.from(document.querySelectorAll("[class^='addtocartbutton']"));
        if (elems.length == 0) {
            l('activate tab');
            GM_notification({
                title: "Bedingungen:",
                text: "1) Das Fenster darf nicht minimiert sein.\n2) Der Tab muss der aktive Tab sein.\n3) Das Fenster muss nicht im Vordergrund sein.",
                highlight: true,
                timeout: 4000
            });
            window.setTimeout(() => checkPageNow(), 1000);
        } else {
            if (elems.filter(el => el.innerText == "Nicht vorrätig").length == 0 ||
                elems.filter(el => el.innerText == "In den Warenkorb").length == 3) {
                on_available();
            } else {
                on_not_available();
            }
        }
    }

    window.setTimeout(() => checkPageNow(), 2000);
})();