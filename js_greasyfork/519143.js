// ==UserScript==
// @name         for-you-tab-remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the "For you" tab on X/Twitter.
// @author       https://x.com/nikita26092
// @match        https://x.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @locale       en
// @keywords     X, Twitter, remove For You, hide For You, For You remover
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519143/for-you-tab-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/519143/for-you-tab-remover.meta.js
// ==/UserScript==

function n(){var e=Array.from(document.querySelectorAll("span")).find(e=>"For you"===e.textContent),t=Array.from(document.querySelectorAll("span")).find(e=>"Following"===e.textContent);return e&&t}function r(){document.querySelectorAll("span").forEach(e=>{"For you"==e.textContent?e.closest('div[role="presentation"]').remove():"Following"==e.textContent&&e.click()})}const e=(e,t)=>{for(const o of e)if("childList"===o.type&&n()){r();break}},t=new MutationObserver(e),o={childList:!0,subtree:!0};t.observe(document.body,o),n()&&r();