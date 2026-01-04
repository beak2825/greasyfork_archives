// ==UserScript==
// @name         Delete-WikiDonations
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Removes all references to Wikipedia donation banners and links.
// @author       Lucas11
// @license MIT
// @match        https://*.wikipedia.org/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @downloadURL https://update.greasyfork.org/scripts/540171/Delete-WikiDonations.user.js
// @updateURL https://update.greasyfork.org/scripts/540171/Delete-WikiDonations.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
    const centralNotice = document.querySelector('#centralNotice');
    if (centralNotice) centralNotice.remove();
    const donateLinks = document.querySelectorAll('#pt-sitesupport, #pt-sitesupport-2');
    donateLinks.forEach(el => el.remove());
    const extraDonationElements = document.querySelectorAll(`
        .cn-fundraising,
        .frb,
        .frb-inline,
        .frb-dialog,
        .frb-dialog-iad,
        .frb-nag,
        [class*="donate"],
        [id*="donate"],
        .fundraising,
        .frbanner,

    `);
    extraDonationElements.forEach(el => el.remove());

    return true;
});
