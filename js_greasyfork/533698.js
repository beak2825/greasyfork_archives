// ==UserScript==
// @name         block my wp cookie banner (bmwcb)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  removes these stupid cookie banners while you're trying to copy someone's work.
// @author       GREGDGamer1
// @match        https://*.wordpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.com
// @grant        none
// @license You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/533698/block%20my%20wp%20cookie%20banner%20%28bmwcb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533698/block%20my%20wp%20cookie%20banner%20%28bmwcb%29.meta.js
// ==/UserScript==

const elementToRemove = document.querySelector('.widget.widget_eu_cookie_law_widget');
const data = {
  elementExists: !!elementToRemove,
};
if (elementToRemove) {
  elementToRemove.remove();
}