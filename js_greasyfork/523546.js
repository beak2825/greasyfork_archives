// ==UserScript==
// @name         FreeCash API Modifier
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Intercept and modify FreeCash API responses
// @match        https://freecash.com
// @grant        none
// @author       BxorDevs
// @license      GPULv3
// @downloadURL https://update.greasyfork.org/scripts/523546/FreeCash%20API%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/523546/FreeCash%20API%20Modifier.meta.js
// ==/UserScript==

(function() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
        if (url.includes('/fc-api/graphql')) {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            const responseData = await clonedResponse.json();

            responseData.signupBonusCoins = 999999;
            responseData.signupBonusEnalbed = true;

            console.log('Modified /v1/users/me Response:', responseData);

            return new Response(JSON.stringify(responseData), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        } else if (url.includes('/fc-apigraphq/l')) {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            const responseData = await clonedResponse.json();

            responseData.signupBonusCoins = 999999;
            responseData.level = 250;
            responseData.signupBonusEnalbed = true;

            console.log('Modified /fc-apigraphq/l:', responseData);

            return new Response(JSON.stringify(responseData), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }
        return originalFetch(url, options);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._url.includes('/fc-apigraphq/l')) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    try {
                        let responseData = JSON.parse(this.responseText);

                        responseData.signupBonusCoins = 999999;
                        responseData.signupBonusEnalbed = true;
                        responseData.level = 250;

                        console.log('Modified /fc-apigraphq/l Response:', responseData);

                        Object.defineProperty(this, 'responseText', {
                            get: () => JSON.stringify(responseData)
                        });
                    } catch (error) {
                        console.error('Response modification error:', error);
                    }
                }
            });
        } else if (this._url.includes('/fc-apigraphq/l')) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    try {
                        let responseData = JSON.parse(this.responseText);

                        responseData.signupBonusCoins = 999999;
                        responseData.signupBonusEnalbed = true;
                        responseData.level = 250;

                        console.log('Modified /fc-apigraphq/l Response:', responseData);

                        Object.defineProperty(this, 'responseText', {
                            get: () => JSON.stringify(responseData)
                        });
                    } catch (error) {
                        console.error('Response modification error:', error);
                    }
                }
            });
        }
        return originalSend.apply(this, arguments);
    };
})();
