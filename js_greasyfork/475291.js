// ==UserScript==
// @name         Show monthly visits from SimilarSites for the current domain
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show monthly visits from SimilarSites on each website
// @author       ChatGPT
// @match        *://*/*
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475291/Show%20monthly%20visits%20from%20SimilarSites%20for%20the%20current%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/475291/Show%20monthly%20visits%20from%20SimilarSites%20for%20the%20current%20domain.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
    method: 'GET',
    url: "https://www.similarsites.com/",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9", // Adding Accept-Language header
        "Referer": "https://www.google.com/" // Adding Referer header
    },
});



(function() {
    'use strict';

    const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds
    let isExpanded = false;



    const getDomain = (url) => {
        let newUrl = url.split('/').slice(0, 3).join('/');
        const domainParts = newUrl.replace('https://', '').split('.');
        if (domainParts.length === 3) {
            newUrl = newUrl.substring(newUrl.indexOf('.') + 1);
        } else {
            newUrl = newUrl.replace('https://', '');
        }
        return newUrl;
    };

    const getTrafficData = (domain) => {
        const cachedData = GM_getValue(domain);
        if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRY) {
            displayTraffic(cachedData.value);
            return;
        }

        const similarSitesURL = `https://www.similarsites.com/site/${domain}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: similarSitesURL,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", // Changed user agent
                "Accept": "text/html"
            },
            onload: (response) => {
            setTimeout(() => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const monthlyVisitsElement = doc.querySelector("div[data-testid='siteheader_categoryrank']");
                if(monthlyVisitsElement) {
                    const data = monthlyVisitsElement.textContent.trim();
                    GM_setValue(domain, { timestamp: Date.now(), value: data });
                    displayTraffic(data);
                } else {
                    displayTraffic("n");
                }
           }, 1000);
            },
            onerror: (err) => {
                console.error("Error fetching data from SimilarSites:", err);
                displayTraffic("error");
            }
        });
    };

    const getMonthlyVisitsData = (domain) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.similarsites.com/site/${domain}`,
                onload: (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const monthlyVisitsElement = doc.querySelector("div[data-testid='siteheader_categoryrank']");
                    if (monthlyVisitsElement) {
                        resolve(monthlyVisitsElement.textContent.trim());
                    } else {
                        resolve('No data found');
                    }
                },
                onerror: (err) => {
                    console.error("Error fetching data from SimilarSites:", err);
                    reject('Error fetching data');
                }
            });
        });
    };

    const displayTraffic = (data) => {
        const existingDiv = document.getElementById('similarSitesTrafficInfo');
        if(existingDiv) existingDiv.remove();

        const infoDiv = document.createElement('div');
        infoDiv.id = 'similarSitesTrafficInfo';
        infoDiv.style.position = 'fixed';
        infoDiv.style.bottom = '10px';
        infoDiv.style.left = '10px';
        infoDiv.style.zIndex = '9999';
        infoDiv.style.padding = '5px 10px';
        infoDiv.style.maxWidth = '250px';
        infoDiv.style.background = 'rgba(0, 0, 0, 0.7)';
        infoDiv.style.color = 'white';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        infoDiv.style.transform = 'rotateY(90deg)'; // Initial flip state
        infoDiv.style.transition = 'transform 1s'; // Setting transition for the flipping animation


        if(data === "error") {
            infoDiv.textContent = "Error fetching data";
        } else if (typeof data === 'string' && data.includes(',')) {
            const dataArray = data.replace(/#/g, '').split(', ');
            dataArray.forEach(item => {
                const itemDiv = document.createElement('div');
                const [domain, visitsData] = item.split(': ');
                itemDiv.textContent = `${domain}: ${visitsData}`;
                itemDiv.style.cursor = 'pointer';
                itemDiv.addEventListener('click', () => {
                    GM_openInTab(`https://${domain}`, { active: false });
                });
                infoDiv.appendChild(itemDiv);
            });
        } else {
            infoDiv.textContent = data.replace(/#/g, '');
        }

        infoDiv.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click event from triggering
            const currentDomain = getDomain(window.location.href);
            if (isExpanded) {
                isExpanded = false;
                infoDiv.style.maxWidth = '250px';
                getTrafficData(currentDomain);
            } else {
                isExpanded = true;
                infoDiv.style.maxWidth = 'none';
                getAdditionalData(currentDomain);
            }
        });

        setTimeout(() => infoDiv.style.transform = 'rotateY(0deg)', 0); // Setting transform to rotateY(0deg) to start the flip animation


        document.body.appendChild(infoDiv);
    };

    const getAdditionalData = (domain) => {
        const similarSitesURL = `https://www.similarsites.com/site/${domain}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: similarSitesURL,
            onload: async (response) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const elements = doc.querySelectorAll("div.SimilarSitesCard__Domain-zq2ozc-4");
                if (elements.length > 0) {
                    const dataPromises = [...elements].map(el => {
                        const domain = el.textContent.trim();
                        return getMonthlyVisitsData(domain).then(visitsData => ({ domain, visitsData }));
                    });
                    Promise.all(dataPromises).then(dataArray => {
                        const dataString = dataArray.map(data => `${data.domain}: ${data.visitsData}`).join(', ');
                        displayTraffic(dataString);
                    });
                } else {
                    displayTraffic("No data found");
                }
            },
            onerror: (err) => {
                console.error("Error fetching data from SimilarSites:", err);
                displayTraffic("error");
            }
        });
    };

    document.addEventListener('click', () => {
        if (isExpanded) {
            const infoDiv = document.getElementById('similarSitesTrafficInfo');
            if (infoDiv) {
                infoDiv.style.maxWidth = '250px';
                isExpanded = false;
            }
        }
    });


    // Initially get traffic data for the current domain with a 5-second delay
    setTimeout(() => getTrafficData(getDomain(window.location.href)), 500);
})();
