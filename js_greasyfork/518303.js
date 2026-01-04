// ==UserScript==
// @name         Komentarz kupującego wyróżniony przy zwrocie
// @version      1.0
// @description  Wyświetla komentarz kupującego jako okienko na środku strony z gradientem
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/returns/*
// @grant        none
// @license      Proprietary
// @namespace https://greasyfork.org/users/1396754
// @downloadURL https://update.greasyfork.org/scripts/518303/Komentarz%20kupuj%C4%85cego%20wyr%C3%B3%C5%BCniony%20przy%20zwrocie.user.js
// @updateURL https://update.greasyfork.org/scripts/518303/Komentarz%20kupuj%C4%85cego%20wyr%C3%B3%C5%BCniony%20przy%20zwrocie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const commentLabel = Array.from(document.querySelectorAll('span[style="font-weight: bold"]'))
        .find(span => span.textContent.trim() === 'Komentarz kupującego:');
    if (commentLabel && commentLabel.nextSibling && commentLabel.nextSibling.textContent.trim()) {
        const commentText = commentLabel.nextSibling.textContent.trim();
        const popup = document.createElement('div');
        popup.textContent = `Komentarz kupującego: ${commentText}`;
        popup.style.position = 'fixed';
        popup.style.top = '40px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'linear-gradient(to bottom, #ff0000, #8b0000)';
        popup.style.color = 'white';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1000';
        popup.style.maxWidth = '300px';
        popup.style.fontSize = '20px';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.3)';
        popup.style.textAlign = 'center';
        document.body.appendChild(popup);
    }
})();