// ==UserScript==
// @name         Fix campo Codice PIN
// @namespace    https://andrealazzarotto.com
// @version      2025.10.31.2
// @description  Sistema i campi per il login sul sito Agenzia delle Entrate
// @author       Andrea Lazzarotto
// @match        https://iampe.agenziaentrate.gov.it/sam/UI/Login*
// @match        https://*.agenziaentrate.gov.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agenziaentrate.gov.it
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.5.2/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/395854/Fix%20campo%20Codice%20PIN.user.js
// @updateURL https://update.greasyfork.org/scripts/395854/Fix%20campo%20Codice%20PIN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.jQuery;

    let adjust = () => {
        const pinWrapper = $('#pin-fo-ent').parent().parent().parent();
        if (pinWrapper.hasClass('fixed')) {
            return;
        }

        let fixType = () => {
            pinWrapper.find('input').attr({
                'autocomplete': 'on',
                'type': 'text',
            });
        };

        pinWrapper.parent().before(pinWrapper);
        pinWrapper.find('input').attr({
            'autocomplete': 'on',
            'type': 'text',
        }).css('border', '3px solid lightseagreen');
        pinWrapper.find('label').text('Codice PIN');
        pinWrapper.find('button').remove();
        pinWrapper.parents('.tab-pane').find('.col-12').attr('class', '');
        pinWrapper.addClass('fixed');

        setTimeout(fixType, 500);
        setTimeout(fixType, 1000);
        setTimeout(fixType, 1500);
    };

    document.arrive('#pin-fo-ent', adjust);
    adjust();
})();