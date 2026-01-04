// ==UserScript==
// @name         Mug Helper
// @namespace    http://tampermonkey.net/
// @license      NOLICENSE
// @version      0.2
// @description  Makes mugging easier
// @author       Harmageddon
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531749/Mug%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531749/Mug%20Helper.meta.js
// ==/UserScript==

let API_KEY = "";

const waitForElement = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

const getRequestAsync = (url) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                resolve(response.responseText);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}

const waitForElements = (selector, action, container, timeControl) => {
    let targetNodes = (container ?? document).querySelectorAll(selector);

    if (targetNodes && targetNodes.length > 0) {
        targetNodes.forEach(function (node) {
            let alreadyFound = node.getAttribute('data-found') || false;

            if (!alreadyFound) {
                if (!action(node)) {
                    node.setAttribute('data-found', true);
                }
            }
        });
    }

    if (!timeControl) {
        timeControl = setInterval(() => {
            waitForElements(selector, action, container, timeControl);
        }, 300);
    }
};

const JSONparse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {}
    return null;
}

const inject_initial_html = () => {


};

const check_cloting_store = () => {
    const check_status = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let userID = urlParams.get('user2ID');
    //const url = `https://api.torn.com/user/${userID}?selections=basic,icons&key=${API_KEY}`;
    const url = `https://api.torn.com/user/${userID}?&key=${API_KEY}`;
    GM.xmlHttpRequest(
    {
        method: 'POST',
        url: url,
        onload: function (response)
        {
            if (response.status == '200')
            {
                const data = JSON.parse(response.responseText);
                const containsCompanyClothingStore = Object.values(data.basicicons).some(value =>
                                                                                                 value.toLowerCase().includes("company") && value.toLowerCase().includes("(clothing store)")
                                                                                                );
                // Add span only if it doesn't already exist
                if (containsCompanyClothingStore)
                {

                    const companyUrl = `https://api.torn.com/company/${data.job.company_id}?&key=${API_KEY}`;
                    GM.xmlHttpRequest(
                        {
                            method: 'POST',
                            url: companyUrl ,
                            onload: function (response)
                            {
                                if (response.status == '200')
                                {
                                    const companyData = JSON.parse(response.responseText)
                                    if(companyData.company.rating >= 7)
                                    {
                                        injectFlashingCSS();
                                        const container = document.querySelector('.title___rhtB4');
                                        if (container && container.textContent.includes('Attacking') && !container.querySelector('.clothing-store-span'))
                                        {
                                            const span = document.createElement('span');
                                            span.className = 'clothing-store-span flashing-text'; // Add a unique and flashing class
                                            span.textContent = 'Clothing Store Mug Protection is active';
                                            span.style.color = "red";
                                            container.appendChild(span);
                                      }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    };
        function injectFlashingCSS()
        {
            const css = `
        @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }

        .flashing-text {
            animation: flash 1s infinite;
        }
    `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
        check_status();
    };




    const init = () => {
        check_cloting_store();
    };

    (function() {
        'use strict';
        inject_initial_html();
        if (API_KEY) {
            init();
        }
    })();