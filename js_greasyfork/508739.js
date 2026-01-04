// ==UserScript==
// @name         TempMail Access
// @namespace    your_namespace_here
// @version      1.0.0
// @description  Adds a context menu option to access TempMail.
// @author       Magneto1
// @license      MIT
// @include      *://*
// @icon         none
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/508739/TempMail%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/508739/TempMail%20Access.meta.js
// ==/UserScript==

// Aggiungi un comando per sostituire la scheda corrente
GM_registerMenuCommand("Sostituisci Scheda Corrente con TempMail", () => {
    window.location = 'https://tempmail.email/';
}, "u");

// Aggiungi un comando per aprire TempMail in una nuova scheda
GM_registerMenuCommand("Apri TempMail in Nuova Scheda", () => {
    GM_openInTab('https://tempmail.email/', { active: true });
});
