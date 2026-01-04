// ==UserScript==
// @name         Degoo Premium Pop-Up Remover
// @namespace    https://www.jabedmiah.com
// @version      1.02
// @description  Removes the Degoo premium pop that restricts usage of the web application.
// @author       miahj1
// @match        https://app.degoo.com/files/*
// @match        https://app.degoo.com/moments
// @match        https://app.degoo.com/search*
// @match        https://app.degoo.com/albums/*
// @icon         https://www.google.com/s2/favicons?domain=degoo.com
// @supportURL   https://github.com/miahj1/Degoo-Premium-Pop-Up-Remover/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472200/Degoo%20Premium%20Pop-Up%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/472200/Degoo%20Premium%20Pop-Up%20Remover.meta.js
// ==/UserScript==

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    const popUpElement = document.getElementsByTagName("app-dialog")[0];

    if (popUpElement) {
        observer.disconnect();
        popUpElement.style.display = "none";
    }

    document.body.style = 'overflow: unset';
}