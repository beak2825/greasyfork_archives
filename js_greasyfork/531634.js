// ==UserScript==
// @name         Kitleleri Uyutma Aracı Engelleyici
// @namespace    http://x.com/operagxturkiye
// @version      1.1
// @description  Bu eklenti, gündemi değiştirmek isteyen ve kitleleri uyutmak için ortaya çıkan gönderileri engellemek için tasarlanmıştır.
// @author       Opera GX Türkiye
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/e/e7/Opera_GX_Icon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531634/Kitleleri%20Uyutma%20Arac%C4%B1%20Engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/531634/Kitleleri%20Uyutma%20Arac%C4%B1%20Engelleyici.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = [
        "futbol", "maç", "morinyo", "mourinho", "#GSvFB", "#FBvGS",
        "derbi", "fener", "fenerbahçe", "galatasaray", "gs", "fb",
        "okan buruk"
    ];

    const observer = new MutationObserver(() => {
        document.querySelectorAll('article').forEach(article => {
            if (article.getAttribute('data-blurred')) return;

            const textContent = article.innerText.toLowerCase();
            if (keywords.some(word => textContent.includes(word))) {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';

                const parent = article.parentNode;
                parent.replaceChild(wrapper, article);
                wrapper.appendChild(article);

                article.style.filter = 'blur(8px)';

                const overlay = document.createElement('div');
                overlay.innerText = '🚫 KİTLELERİ UYUTMA ARACI';
                overlay.style.position = 'absolute';
                overlay.style.top = '50%';
                overlay.style.left = '50%';
                overlay.style.transform = 'translate(-50%, -50%)';
                overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                overlay.style.color = 'white';
                overlay.style.padding = '8px 16px';
                overlay.style.fontSize = '16px';
                overlay.style.fontWeight = 'bold';
                overlay.style.zIndex = '10000';
                overlay.style.borderRadius = '8px';
                overlay.style.pointerEvents = 'none';

                wrapper.appendChild(overlay);
                article.setAttribute('data-blurred', 'true');
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();