// ==UserScript==
// @name         platoplato v1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ez
// @author       wploits
// @match        https://auth.platoboost.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525222/platoplato%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/525222/platoplato%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.getElementById('makeRequestButton');

    if (!button) {
        button = document.createElement('button');
        button.id = 'makeRequestButton';
        button.textContent = 'Bypass Plato!';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);
    }

    button.addEventListener('click', function() {
        const currentPath = window.location.pathname.substring(1);

        let requestUrl = `https://auth.platoboost.com/api/session/step?ticket=${currentPath}&service=1`;

        const urlParams = new URLSearchParams(window.location.search);
        const hash = urlParams.get("hash");

        if (hash) {
            requestUrl += `&hash=${hash}`;
        }

        console.log(requestUrl);

        fetch(requestUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                captcha: null,
                reference: "empty",
                payload: "empty"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                const redirectUrl = data.data?.url;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    alert("URL not found in the response data.");
                }
            } else {
                alert("First attempt failed: Retrying with service=2.");
                makeRequest(requestUrl, 2);
            }
        })
        .catch(error => console.error("Error:", error));
    });

    function makeRequest(url, serviceValue) {
        let updatedUrl = url.replace(/&service=\d+/, `&service=${serviceValue}`);

        const currentParams = new URLSearchParams(window.location.search);
        const hashValue = currentParams.get("hash");

        if (hashValue) {
            updatedUrl += `&hash=${hashValue}`;
        }

        console.log(updatedUrl);

        fetch(updatedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                captcha: null,
                reference: "empty",
                payload: "empty"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                const redirectUrl = data.data?.url;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    alert("URL not found in the response data.");
                }
            } else {
                alert("Second attempt failed: Success is still false.");
            }
        })
        .catch(error => console.error("Error:", error));
    }

})();
