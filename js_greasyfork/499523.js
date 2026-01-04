// ==UserScript==
// @name         Twitter/X Nitter Redirect
// @version      1.0
// @description  Redirect twitter.com and x.com links to a random healthy Nitter instance.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://twitter.com/*
// @match        *://www.twitter.com/*
// @match        *://x.com/*
// @match        *://www.x.com/*
// @grant        GM_xmlhttpRequest
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/499523/TwitterX%20Nitter%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/499523/TwitterX%20Nitter%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const staticURL = ''; // Set this to an instance if you always want to use a single Nitter instance instead of fetching from API.

    const apiUrl = 'https://status.d420.de/api/v1/instances';

    const profileURLPattern = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+(\/.*)?$/;

    let currentURL = window.location.href;

    function fetchNitterInstance(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (!data.hosts || !Array.isArray(data.hosts)) {
                        console.error('Unexpected API response format:', data);
                        return;
                    }

                    const healthyInstances = data.hosts.filter(host => host.healthy && !host.is_bad_host);

                    if (healthyInstances.length > 0) {
                        const randomInstance = healthyInstances[Math.floor(Math.random() * healthyInstances.length)];
                        callback(randomInstance.domain);
                    } else {
                        console.warn('No healthy Nitter instances found.');
                    }
                } catch (error) {
                    console.error('Failed to parse Nitter instance data:', error, response.responseText);
                }
            },
            onerror: function(error) {
                console.error('Error fetching Nitter instances:', error);
            }
        });
    }

    function redirectToNitter(nitterDomain) {
        if (profileURLPattern.test(currentURL)) {
            let newURL = currentURL.replace(/(twitter\.com|x\.com)/, nitterDomain);
            console.log('Redirecting to:', newURL);
            if (newURL !== currentURL) {
                window.location.replace(newURL);
            }
        } else {
            console.log('URL does not match profile pattern, no redirection.');
        }
    }
    if (staticURL.length > 1) {
      redirectToNitter(staticURL);
    } else {
      fetchNitterInstance(redirectToNitter);
    }
})();