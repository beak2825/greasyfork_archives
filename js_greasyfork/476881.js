// ==UserScript==
// @name        Auto Fill API Key - Baldr's Levelling List [site by oraN] - Torn
// @namespace   https://github.com/AmeLooksSus
// @match       *://*oran.pw/baldrstargets/
// @grant       none
// @version     1.0
// @author      AmeLooksSus
// @description This autofills the API key for you everytime you open https://oran.pw/baldrstargets/ . Just make sure to fill the API Key in the script.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476881/Auto%20Fill%20API%20Key%20-%20Baldr%27s%20Levelling%20List%20%5Bsite%20by%20oraN%5D%20-%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/476881/Auto%20Fill%20API%20Key%20-%20Baldr%27s%20Levelling%20List%20%5Bsite%20by%20oraN%5D%20-%20Torn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Fill your API key here.
    var apiKey = 'YOUR_API_KEY';

    function fillApiKey() {
        var apiKeyInput = document.getElementById('api-key');
        if (apiKeyInput) {
            apiKeyInput.value = apiKey;
        }
    }

    window.addEventListener('load', fillApiKey);
})();