// ==UserScript==
// @name        Emoji CMS Animation Stopper
// @author      Ivan
// @namespace   https://greasyfork.org/users/1145671-hipercubo
// @description Frena la animación de la home de EMCS antes de que empiece.
// @match       https://master.d2jkdk3h63guct.amplifyapp.com/*
// @run-at      document-start
// @license     MIT
// @version     0.1.0
// @downloadURL https://update.greasyfork.org/scripts/497866/Emoji%20CMS%20Animation%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/497866/Emoji%20CMS%20Animation%20Stopper.meta.js
// ==/UserScript==

GM_addStyle(`*, *:before, *:after {
    transition-property: none !important;
    transform: none !important;
    animation: none !important;
}`);

console.log("Detener Animaciones se ejecutó correctamente");