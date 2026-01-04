// ==UserScript==
// @name            ING Infinite Login Sessions
// @name:de         ING Unbegrenzte Login-Sitzungen
// @namespace       https://greasyfork.org/en/users/723211-ray/
// @version         1.0.2
// @description     Infinitely extends ING login sessions by automatically clicking the session refresh button every minute.
// @description:de  Verlängert ING Login-Sitzungen unbegrenzt indem der Aktualisierungsbutton jede Minute automatisch angeklickt wird.
// @author          -Ray-
// @match           https://banking.ing.de/app/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/438157/ING%20Infinite%20Login%20Sessions.user.js
// @updateURL https://update.greasyfork.org/scripts/438157/ING%20Infinite%20Login%20Sessions.meta.js
// ==/UserScript==

window.setInterval(function () {
    // banking.ing.de
    document.querySelector("ing-header")?.shadowRoot.querySelector("ing-session-button")?.shadowRoot.querySelector(".session-button__refresh-button")?.click();

    // wertpapiere.ing.de
    document.querySelector(".ing-sn-session-button__timer")?.click();
}, 60 * 1000);
