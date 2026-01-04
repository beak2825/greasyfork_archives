// ==UserScript==
// @name         WhatsApp Collapse
// @namespace    alexchandel
// @version      1.1
// @description  Collapse the contacts sidebar when you click the header.
// @author       Alex Chandel
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407140/WhatsApp%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/407140/WhatsApp%20Collapse.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.addEventListener('load', function() {
    'use strict';
    const toggleContacts = function (e) {
        // main header, side header, or side header div.
        const side = document.getElementById('side').parentElement
        if (e.target.tagName === 'HEADER' && (e.target.parentElement.id === 'main' || e.target.parentElement.id === 'side')
            || e.target.parentElement.tagName === 'HEADER' && e.target.parentElement.parentElement.id === 'side'
            || document.getElementById('main') == null && side.nextElementSibling.contains(e.target)) {
            if (side.style.display !== 'none') { // collapse
                side.style.display = 'none'
                side.previousElementSibling.children[0].style.display = 'none'
                const text = document.querySelector('#main > footer .selectable-text')
                if (text != null) text.focus()
            } else {
                side.style.display = ''
                side.previousElementSibling.children[0].style.display = ''
            }
        }
    }
    document.getElementById('app').addEventListener('click', toggleContacts, {'passive': true})
})