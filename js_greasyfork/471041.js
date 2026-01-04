// ==UserScript==
// @name         asicentral
// @namespace    asicentral
// @version      1.1
// @description  Automaticamente seleciona o Almoxarifado CENTRAL no ASI
// @author       Your Name
// @match        https://asiweb.tre-rn.jus.br/asi/web?target=com.linkdata.almoxweb.consultageral.web.ConsultaMaterialEditGateway&action=start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471041/asicentral.user.js
// @updateURL https://update.greasyfork.org/scripts/471041/asicentral.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fillInputAndClickButton() {
        var inputElement = document.querySelector('#ext-gen88');
        var buttonElement = document.querySelector('#ext-gen6');

        if (inputElement && buttonElement) {
            inputElement.value = 'CENTRAL';
            buttonElement.click();
        }
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && (document.querySelector('#ext-gen88') || document.querySelector('#ext-gen6'))) {
                observer.disconnect();
                fillInputAndClickButton();
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();