// ==UserScript==
// @name         Onche.org ReadMore Fix V4 (No Reset Button)
// @namespace    https://onche.org/
// @version      1.0
// @description  Répare la fonctionnalité "Voir plus" sur Onche.org (sans bouton reset)
// @author       Moi
// @match        https://onche.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527600/Oncheorg%20ReadMore%20Fix%20V4%20%28No%20Reset%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527600/Oncheorg%20ReadMore%20Fix%20V4%20%28No%20Reset%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debugReadMore() {
        console.group('Debug ReadMore V4');
        console.log('jQuery disponible:', typeof $ !== 'undefined');
        console.log('seemore disponible:', typeof window.seemore !== 'undefined');
        console.log('Messages avec rmjs-* trouvés:', $('.message-content[class*="rmjs-"]').length);
        console.log('Messages avec data-readmore trouvés:', $('.message-content[data-readmore]').length);
        console.groupEnd();
    }

    function cleanElement(element) {
        const $element = $(element);
        const content = $element.html();
        const height = $element.height();

        console.log('Nettoyage élément:', element);
        console.log('Hauteur initiale:', height);

        $element.removeClass((index, className) => (className.match(/(^|\s)rmjs-\S+/g) || []).join(' '))
            .removeAttr('style')
            .removeAttr('aria-expanded')
            .removeAttr('id')
            .removeAttr('data-readmore');

        $element.next('.see-more').remove();

        $element.html(content);

        if (height > 80) {
            console.log('Application de seemore sur:', element);
            window.seemore($element, 80);
        }
    }

    function forceReInitSeeMore() {
        if (typeof window.seemore !== 'undefined') {
            console.log('Début de la réinitialisation automatique de ReadMore...');

            $('.message-content[class*="rmjs-"], .message-content[data-readmore]').each(function() {
                cleanElement(this);
            });

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const $messageContents = $(node).find('.message-content');
                            if ($messageContents.length) {
                                setTimeout(() => {
                                    $messageContents.each(function() {
                                        cleanElement(this);
                                    });
                                }, 100);
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function initWithRetry(retries = 5) {
        if (typeof $ !== 'undefined' && typeof window.seemore !== 'undefined') {
            console.log('Démarrage de la réparation de ReadMore...');
            debugReadMore();
            forceReInitSeeMore();

        } else if (retries > 0) {
            console.log(`Attente des dépendances... (${retries} tentatives restantes)`);
            setTimeout(() => initWithRetry(retries - 1), 1000);
        } else {
            console.warn('Les dépendances (jQuery ou seemore) n\'ont pas été trouvées après plusieurs tentatives. La réparation de ReadMore ne démarrera pas.');
        }
    }

    setTimeout(() => initWithRetry(), 200);

})();