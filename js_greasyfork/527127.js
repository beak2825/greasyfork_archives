// ==UserScript==
// @name         "Fix" usine
// @version      4.0
// @description  Empêche la fenêtre d'usine de se fermer quand on achète
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @match        https://dreadcast.net/Main*
// @grant        GM.addStyle
// @namespace    DCSC1475
// @downloadURL https://update.greasyfork.org/scripts/527127/%22Fix%22%20usine.user.js
// @updateURL https://update.greasyfork.org/scripts/527127/%22Fix%22%20usine.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function overrideJQueryMethods() {
        if (typeof $ === 'undefined') {
            setTimeout(overrideJQueryMethods, 500);
            return;
        }
        if (!$.fn._originalFadeOut) {
            $.fn._originalFadeOut = $.fn.fadeOut;
            $.fn._originalRemove = $.fn.remove;
        }
        $.fn.fadeOut = function(speed, callback) {
            if (this.is('#db_vente_entreprise')) {
                if (callback && typeof callback === 'function') {
                    callback.call(this);
                }
                return this;
            }
            return $.fn._originalFadeOut.apply(this, arguments);
        };
        $.fn.remove = function() {
            if (this.is('#db_vente_entreprise')) {
                return this;
            }
            return $.fn._originalRemove.apply(this, arguments);
        };
    }
    function updateCloseButton() {
        if (typeof $ === 'undefined') {
            setTimeout(updateCloseButton, 500);
            return;
        }
        const factoryTab = $('#db_vente_entreprise');
        let $button = $('#closeFactoryButton');
        const $annulerButton = $('.annuler.link');
        if (factoryTab.length && $annulerButton.length) {
            if ($button.length === 0) {
                $button = $('<button id="closeFactoryButton" type="button">Annuler</button>');
                $button.css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': $annulerButton.outerWidth() + 'px',
                    'height': $annulerButton.outerHeight() + 'px',
                    'background': 'linear-gradient(145deg, rgba(255,77,77,0.95), rgba(255,51,51,0.95))',
                    'color': 'white',
                    'border': 'none',
                    'padding': '0',
                    'margin': '0',
                    'cursor': 'pointer',
                    'z-index': 999999,
                    'font-size': '12px',
                    'font-weight': 'bold',
                    'border-radius': '8px',
                    'box-shadow': '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    'pointer-events': 'auto',
                    'transition': 'all 0.3s ease',
                    'font-family': '"Helvetica Neue", Arial, sans-serif'
                }).css('outline', 'none');
                $button.hover(
                    function() {
                        $(this).css({
                            'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.3)',
                            'transform': 'scale(1.02)'
                        });
                    },
                    function() {
                        $(this).css({
                            'box-shadow': '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            'transform': 'scale(1)'
                        });
                    }
                );
                $button.on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (factoryTab.length) {
                        $.fn._originalFadeOut.call(factoryTab, 400, function() {
                            $.fn._originalRemove.call(factoryTab);
                            updateCloseButton();
                        });
                    }
                });
                $annulerButton.css('position', 'relative').append($button);
            } else {
                $button.css({
                    'width': $annulerButton.outerWidth() + 'px',
                    'height': $annulerButton.outerHeight() + 'px'
                });
            }
        } else {
            if ($button.length) {
                $button.remove();
            }
        }
    }
    const observer = new MutationObserver(() => {
        updateCloseButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    overrideJQueryMethods();
    updateCloseButton();
})();
