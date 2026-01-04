// ==UserScript==
// @name         Botón para enviar páginas a Menéame
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Añade un botón movible con imagen para enviar la página actual a Menéame, excepto en menéame.net
// @author       Ergo & ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*/*
// @exclude      *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522949/Bot%C3%B3n%20para%20enviar%20p%C3%A1ginas%20a%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/522949/Bot%C3%B3n%20para%20enviar%20p%C3%A1ginas%20a%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.style.zIndex = '9999';
    button.style.padding = '5px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.zIndex = '10000';
    button.style.width = '32px';
    button.style.height = '32px';
    button.style.backgroundImage = "url('data:image/gif;base64,R0lGODlhKAAoAKIAAOJPCv3t5u2PY/O0luhxOfnXx////+NWFCH5BAAAAAAALAAAAAAoACgAAAP/eLrc/jDKSau9+IBtQVYcIWqc4x1E5glFYLxBMRClMgLDcE6rawSx1ssw4wAIBY0gcCm8Zg0C61UQaAZMgMBA4w1+tB1og4S5dEeDQGzactkN8qA1AG27EqeusvGcAC0UBC54GB5faxJpb4ZHenBxBC+FPAdTAYmVLpk8l3WQcShfexRfRBp8B1WSjBE4BgVhqTEbX0libGCgD4CtTrGoIyCSpHxbpB5OPwXMmVpEuw+EOx5SOVbUxNEMz8ULfTXDsBjTH+U8kkkfr5yuo9u8WwXwve3krXlqkPvf7xRO9hSwaOEiRh1xASiZ8OdAhAgBAkylAAEw2rMsvMC9wvNMUd2EM/S+TFxwDsKzUxYDfau37RUsbH0cMPNzRCK9JTAGCBBG4kCAPQRM6esQ1MeQZVV8plD2UyGPahBzSIVixdINeCY1gkNFAuuHr2DDig2bAAA7')";
    button.style.backgroundSize = 'cover';
    button.style.backgroundRepeat = 'no-repeat';
    button.style.backgroundPosition = 'center';

    document.body.appendChild(button);

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let startX = 0, startY = 0;
    let moved = false;

    button.addEventListener('mousedown', function(e) {
        isDragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        button.style.transition = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { moved = true;}
            button.style.left = `${e.clientX - offsetX}px`;
            button.style.top = `${e.clientY - offsetY}px`;
            button.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (isDragging) {
            isDragging = false;
            button.style.transition = 'all 0.2s ease';
            if (!moved) {
                let currentUrl = encodeURIComponent(window.location.href);
                let currentTitle = encodeURIComponent(document.title);
                let meneameUrl = `https://www.meneame.net/submit?url=${currentUrl}&title=${currentTitle}`;
                window.open(meneameUrl, '_blank');
            }
        }
    });

    button.addEventListener('touchstart', function(e) {
        isDragging = true;
        moved = false;
        let touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        offsetX = touch.clientX - button.getBoundingClientRect().left;
        offsetY = touch.clientY - button.getBoundingClientRect().top;
        button.style.transition = 'none';
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            let touch = e.touches[0];
            let dx = touch.clientX - startX;
            let dy = touch.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                moved = true;
            }
            button.style.left = `${touch.clientX - offsetX}px`;
            button.style.top = `${touch.clientY - offsetY}px`;
            button.style.transform = 'none';
        }
    });

    document.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            button.style.transition = 'all 0.2s ease';
            if (!moved) {
                let currentUrl = encodeURIComponent(window.location.href);
                let currentTitle = encodeURIComponent(document.title);
                let meneameUrl = `https://www.meneame.net/submit?url=${currentUrl}&title=${currentTitle}`;
                window.open(meneameUrl, '_blank');
            }
        }
    });
})();