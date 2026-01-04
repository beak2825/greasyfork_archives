// ==UserScript==
// @name        Insomnia
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Bell
// @description Ain't no rest for the wicked
// @namespace https://greasyfork.org/users/281093
// @downloadURL https://update.greasyfork.org/scripts/406737/Insomnia.user.js
// @updateURL https://update.greasyfork.org/scripts/406737/Insomnia.meta.js
// ==/UserScript==
const afkAlertObserver = new MutationObserver((mutations) => {
    if (afkModal.style.display === "none") return;
    document.querySelector("#afkModal > div > div > div.modal-footer > button").click();
});

afkAlertObserver.observe(document.querySelector("#afkModal"), { attributes: true });