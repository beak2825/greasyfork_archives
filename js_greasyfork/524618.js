// ==UserScript==
// @name         Blokada zamykania Popup "Dodaj zestaw parametrów" w SA
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Zapobiega zamykaniu popup z parametrami po kliknięciu poza nim na stronie SellAsist
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/catalog_products/edit*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/524618/Blokada%20zamykania%20Popup%20%22Dodaj%20zestaw%20parametr%C3%B3w%22%20w%20SA.user.js
// @updateURL https://update.greasyfork.org/scripts/524618/Blokada%20zamykania%20Popup%20%22Dodaj%20zestaw%20parametr%C3%B3w%22%20w%20SA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickListener;
    function blokujZamykaniePopup(popup) {
        if (clickListener) {
            document.removeEventListener('click', clickListener, true);
        }

        clickListener = (event) => {
            const isClickInsidePopup = popup.contains(event.target);
            const isCloseButton = event.target.closest('.master_popup_close');

            if (!isClickInsidePopup && !isCloseButton) {
                event.stopPropagation();
                event.preventDefault();
            }
        };

        document.addEventListener('click', clickListener, true);
    }

    function usunNasluchiwacz() {
        if (clickListener) {
            document.removeEventListener('click', clickListener, true);
            clickListener = null;
        }
    }

    const observer = new MutationObserver(() => {
        const popup = document.getElementById('master_popup');
        if (popup) {
            if (popup.classList.contains('show')) {
                blokujZamykaniePopup(popup);
            } else {
                usunNasluchiwacz();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();