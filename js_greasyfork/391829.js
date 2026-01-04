// ==UserScript==
// @name           Facebook Recent
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    Aggiunge un pulsante per tornare alla visualizzazione dei post più recenti su Facebook
// @version        3.4
// @match          https://*.facebook.com/*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @exclude        https://drive.google.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/391829/Facebook%20Recent.user.js
// @updateURL https://update.greasyfork.org/scripts/391829/Facebook%20Recent.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Funzione per correggere il collegamento alla visualizzazione dei post più recenti
    function fixBackToTopPostsLink() {
        var backButton = document.querySelector('div[role="main"] a[href="/"][aria-label]');
        if (backButton) {
            backButton.id = "aa";
            backButton.title = "Post popolari";
        }
    }

    // Funzione per aggiornare il link dell'icona Facebook alla visualizzazione dei post più recenti
    function fixFacebookIconLink() {
        var iconLinks = document.querySelectorAll("div[role='banner'] a[role='link'][href='/'], div[role='banner']+div[data-isanimatedlayout] a[role='link'][href='/']");
        if (iconLinks && iconLinks.length > 0) {
            for (var i = 0; i < iconLinks.length && i < 2; i++) {
                var link = iconLinks[i];
                link.setAttribute("href", "/?sk=h_chr");
                link.title = "Most Recent";
                link.addEventListener("click", function() {
                    window.location.href = "https://www.facebook.com/?sk=h_chr";
                });
            }
        }
    }

    // Aggiungiamo il pulsante per tornare ai post più recenti dopo 2 secondi dall'avvio dello script
    window.setTimeout(fixBackToTopPostsLink, 2000);

    // Aggiorniamo i link dell'icona Facebook ogni secondo per garantire che siano correttamente impostati
    window.setInterval(fixFacebookIconLink, 1000);
})();
