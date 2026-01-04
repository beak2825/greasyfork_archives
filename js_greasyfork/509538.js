// ==UserScript==
// @name         ADlink Bypass by : SAMRAT
// @homepageURL  https://discord.gg/HwfEf224h
// @namespace    fluxus_bypass
// @description  Bypass Adlink
// @author       SAMRAT
// @match        *://*/*
// @license      SAMRAT
// @icon         https://cdn.discordapp.com/attachments/1270008634180370452/1284110158175146005/458088204_2297085623974752_1364441149326360095_n.jpg?ex=66e57047&is=66e41ec7&hm=c4c687d4ec4eae8f911eb2ef41497b29154f9c87f02112d289b8939f870cd58d&
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @version      0.0.2
// @downloadURL https://update.greasyfork.org/scripts/509538/ADlink%20Bypass%20by%20%3A%20SAMRAT.user.js
// @updateURL https://update.greasyfork.org/scripts/509538/ADlink%20Bypass%20by%20%3A%20SAMRAT.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    // Fetch the current page URL
    const currentUrl = window.location.href;

    // API URLs
    const apiUrls = [
        `https://api.bypass.vip/bypass?url=${encodeURIComponent(currentUrl)}`,
        `https://dlr.kys.gay/api/free/bypass?url=${encodeURIComponent(currentUrl)}`
    ];

    // Function to handle API response
    function handleApiResponse(response) {
        if (response.status === 200) {
            const jsonResponse = JSON.parse(response.responseText);
            if (jsonResponse.status === "success" && jsonResponse.result) {
                const redirectUrl = jsonResponse.result;

                // Check if the redirect URL is valid
                if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
                    // Show success banner
                    showSuccessBanner(redirectUrl);

                    // Auto-redirect to the bypassed URL after 3 seconds
                    setTimeout(() => {
                        window.location.replace(redirectUrl);
                    }, 3000);
                }
            }
        }
    }

    // Create and show a success banner
    function showSuccessBanner(redirectUrl) {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#4CAF50';
        banner.style.color = 'white';
        banner.style.padding = '10px';
        banner.style.fontSize = '18px';
        banner.style.zIndex = '10000';
        banner.style.textAlign = 'center';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.innerHTML = `Success! Full bypass achieved. Redirecting to: <a href="${redirectUrl}" style="color: yellow; text-decoration: underline;">${redirectUrl}</a>`;
        document.body.appendChild(banner);
    }

    // Send parallel requests to both APIs and process the fastest response
    apiUrls.forEach(apiUrl => {
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: handleApiResponse,
            onerror: function() {
                console.error("An error occurred during the API request to " + apiUrl);
            }
        });
    });
})();