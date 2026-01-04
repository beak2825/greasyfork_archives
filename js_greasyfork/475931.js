// ==UserScript==
// @name         API Request on Site Open
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make an API request when a specific site is opened
// @author       You
// @match        http://example.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475931/API%20Request%20on%20Site%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/475931/API%20Request%20on%20Site%20Open.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL API, который вы хотите вызвать
    var apiUrl = 'https://api.example.com/data';

    // Выполнение API запроса
    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function(response) {
            // Обработка ответа от API
            console.log('API response:', response.responseText);
        }
    });

})();
