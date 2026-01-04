// ==UserScript==
// @name         marcar todos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select a specific radio button on the ASI Web page
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/asi/web?target=com.linkdata.patrimonio.bem.web.ConsultaGeralGateway&action=start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499793/marcar%20todos.user.js
// @updateURL https://update.greasyfork.org/scripts/499793/marcar%20todos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let outerInterval;

    // Function to select the radio button
    function selectRadioButton() {
        console.log('Attempting to find the radio button...');

        var xpath = "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/fieldset/ul/li/span/span[4]/input";
        var radioButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (radioButton) {
            console.log('Radio button found. Starting action loop...');
            var actionInterval = setInterval(function() {
                radioButton.checked = true;
                console.log('Radio button checked.');
                if (radioButton.checked) {
                    clearInterval(actionInterval);
                    clearInterval(outerInterval);
                    console.log('Radio button successfully checked.');
                }
            }, 500);
        } else {
            console.log('Radio button not found. Retrying...');
        }
    }

    // Start the initial loop
    outerInterval = setInterval(selectRadioButton, 500);

})();
