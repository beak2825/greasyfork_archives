// ==UserScript==
// @name        jpdb-reviews-ui-tweak
// @version     0.0.1
// @match       *://jpdb.io/review*
// @run-at      document-start
// @description Light rework of the JPDB review page
// @license GPLv2
// @namespace https://greasyfork.org/users/888266
// @downloadURL https://update.greasyfork.org/scripts/441607/jpdb-reviews-ui-tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/441607/jpdb-reviews-ui-tweak.meta.js
// ==/UserScript==

let doc = window.document;

function fixNavbar() {
    // Remove every navigation menu except the "Learn (n)"
    doc
        .querySelectorAll(".menu .nav-item:not(:first-child)")
        .forEach(element => element.remove());

    // Remove the button used to toggle the navigation menu on or off
    doc
        .querySelectorAll(".menu-icon")
        .forEach(element => element.remove());

    // Change the navigation menu maxHeight in order to be always visible
    let parent = doc
        .querySelectorAll(".menu")
        .item(0);
    parent.style.maxHeight = "30px";
    parent.style.transition = "off";

    // Tweak the navigation menu entry, removing the link and changing the message
    let entry = doc
        .querySelectorAll(".menu .nav-item")
        .item(0);

    entry.outerHTML = entry.outerHTML
        .replace(/<a/g, '<div')
        .replace(/<\/a>/g, '</div>')
        .replace("Learn", "Items left");
}

doc.addEventListener('DOMContentLoaded', () => {
    fixNavbar();
});
