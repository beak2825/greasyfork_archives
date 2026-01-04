// ==UserScript==
// @name         SED Wrapper
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  Wrap SEDS fast!
// @author       olesien
// @match        https://www.torn.com/itemuseparcel.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521713/SED%20Wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/521713/SED%20Wrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getUrlParams(url) {
        // Get everything after the ? mark
        const queryString = url.split('?')[1];

        if (!queryString) return {};

        // Split into key/value pairs
        const pairs = queryString.split('&');
        const params = {};

        // Add each parameter to the object
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[key] = value;
        });

        return params;
    }

    // Your code here...
    const header = ".items-footer";
    let armoryId = null;
    let estimatedPrice = 0;
    const run = (header) => {
        const btn = document.createElement("button");
        btn.classList.add("button");
        btn.style.color = "lightblue";
        btn.innerText = "Quickpack";
        let requested = false;
        btn.addEventListener("click", async () =>{
            if (requested) return;
            requested = true;
            btn.innerText = "Adding...";
            const params = getUrlParams(location.href);
            const xid = params.XID;
            const rfcv = params.rfcv;
            const req = await fetch("https://www.torn.com/itemuseparcel.php?rfcv=" + rfcv, {
                "credentials": "include",
                "headers": {
                    "Accept": "/",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0"
                },
                "referrer": location.href,
                "body": `disguise=133&XID=${xid}&items%5B0%5D%5Bamount%5D=1&items%5B0%5D%5Bprice%5D=0&items%5B0%5D%5Btype%5D=Special&items%5B0%5D%5Bid%5D=${armoryId}&items%5B0%5D%5BitemID%5D=380&items%5B0%5D%5BestimatedPrice%5D=${estimatedPrice}&step=createInventoryParcel`,
                "method": "POST",
                "mode": "cors"
            });
            //request(xid, rfcv, armoryId, estimatedPrice);
            const jsonData = await req.json();
            if (jsonData) {
                btn.innerText = jsonData.text;
                if (jsonData.text = "You created a parcel!") {
                   //Add link!
                    const link = document.createElement("button");
                    link.innerText = "Return to items";
                    link.style.color = "lightblue";
                    link.addEventListener("click", () => {
                        history.back()
                    });
                    btn.parentNode.insertBefore(link, btn);

                }
            }
            console.log(jsonData);
        });
        header.appendChild(btn);
    }
    const getOriginalData = async (data) => {
        console.log(data);
        console.log("Getting orig data");
        // Do stuff
        const items = data?.list;
        const item = items?.find(item => item.name === "Small Explosive Device");
        if (item) {
            armoryId = item.armoryID;
            estimatedPrice = item?.averageprice ?? 0;
            console.log(armoryId);
            //This is where we add
            const element = document.querySelector(header);
            if (element) {
                run(element);
            } else {
                const observer = new MutationObserver((_, observer) => {
                    //Is donate (this is default as well)
                    const element = document.querySelector(header);
                    if (element) {
                        run(element);
                        observer.disconnect();
                    }
                });
                observer.observe(document, { subtree: true, childList: true });
            }

        }
        console.log(items);
    }
    // const origFetch = unsafeWindow.fetch;
    // unsafeWindow.fetch = async (url, config) => {
    //     //console.log("Intercepted URL:", url);
    //     const response = await origFetch(url, config);
    //     console.log(url);
    //     if (url.indexOf("inventory") != -1) {
    //         getOriginalData(response);
    //     }
    //     return response;
    // }

    // Intercept XMLHttpRequest
    const XHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new XHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(...args) {
            const [method, url] = args;
            console.log('XHR intercepted:', url);

            if (url.includes('inventory.php')) {
                xhr.addEventListener('load', function() {
                    getOriginalData(JSON.parse(this.responseText));
                    //console.log('XHR Response:', JSON.parse(this.responseText));
                    // Add your processing function here
                });
            }

            return originalOpen.apply(this, args);
        };

        xhr.send = function(...args) {
            return originalSend.apply(this, args);
        };

        return xhr;
    };
})();