// ==UserScript==
// @name         Menéame.net - Edición Shadow Ban
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Evita ver comentarios y notas de usuarios sin necesidad de ignorarlos.
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/516729/Men%C3%A9amenet%20-%20Edici%C3%B3n%20Shadow%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/516729/Men%C3%A9amenet%20-%20Edici%C3%B3n%20Shadow%20Ban.meta.js
// ==/UserScript==

const UsersToShadowban = [
    'menestro',
    'Jose_El_Finanzas',
    'NPCmasacrado',
];

const comments = document.querySelectorAll('ol.comments-list > li');

const matchingComments = Array.from(comments).filter(li => {
    const usernameAnchor = li.querySelector('a.username');
    return usernameAnchor && UsersToShadowban.includes(usernameAnchor.textContent.trim());
});

matchingComments.forEach(li => {li.style.display = 'none';});