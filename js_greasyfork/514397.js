// ==UserScript==
// @name         Fishing Frenzy API Modifier
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Intercept and modify Fishing Frenzy API responses
// @match        https://fishingfrenzy.co/*
// @grant        none
// @author       ErrorNullTag
// @license      GPULv3
// @downloadURL https://update.greasyfork.org/scripts/514397/Fishing%20Frenzy%20API%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/514397/Fishing%20Frenzy%20API%20Modifier.meta.js
// ==/UserScript==

(function() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
        if (url.includes('/v1/users/me')) {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            const responseData = await clonedResponse.json();

            responseData.role = 'admin';
            responseData.gold = 999999;
            responseData.isClaimedDailyReward = false;

            console.log('Modified /v1/users/me Response:', responseData);

            return new Response(JSON.stringify(responseData), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        } else if (url.includes('/v1/inventory')) {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            const responseData = await clonedResponse.json();

            responseData.gold = 999999;
            responseData.exp = 999999;
            responseData.level = 99;

            console.log('Modified /v1/inventory Response:', responseData);

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
        if (this._url.includes('/v1/users/me')) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    try {
                        let responseData = JSON.parse(this.responseText);

                        responseData.role = 'admin';
                        responseData.gold = 999999;
                        responseData.isClaimedDailyReward = false;

                        console.log('Modified /v1/users/me Response:', responseData);

                        Object.defineProperty(this, 'responseText', {
                            get: () => JSON.stringify(responseData)
                        });
                    } catch (error) {
                        console.error('Response modification error:', error);
                    }
                }
            });
        } else if (this._url.includes('/v1/inventory')) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    try {
                        let responseData = JSON.parse(this.responseText);

                        responseData.gold = 999999;
                        responseData.exp = 999999;
                        responseData.level = 99;

                        console.log('Modified /v1/inventory Response:', responseData);

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
