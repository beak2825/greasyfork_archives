// ==UserScript==
// @name         Quick Buy (item market)
// @namespace    http://tampermonkey.net/
// @version      2025-05-01
// @description  Allows users to quickly buy up items from item market
// @author       olesien
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513692/Quick%20Buy%20%28item%20market%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513692/Quick%20Buy%20%28item%20market%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const containerName = "sellerList___kgAh_"; //This is the UL
    const buyControlsClass = "buyControls___MxiIN";
    const priceClass = "price___Uwiv2";
    const quantityClass = "available___xegv_";
    const thumbnailClass = ".thumbnail___M_h9v";
    const minMarginForCheap = 1000000; //1M
    const minMarginForSuperCheap = 10000000; //10M
    const superCheapMultiplier = 0.65; //0.5
    const cheapMultiplier = 0.95; //0.9


    // Your code here...
    let items;

    const buyItem = async (item, row) => {
        const userMoneyEl = document.querySelector('#user-money');
        const img = row.querySelector(thumbnailClass + " img");
        const id = img?.src?.match(/\/items\/(\d+)\//)[1];
        let userMoney = Number(userMoneyEl.innerText.substring(1).replace(/,/g,''));
        let amount = Math.floor(userMoney / Number(item.price));
        if (!amount || amount > Number(item.available)) {
            amount = item.available;
        }

        if (Number(item.price) > userMoney) {
            amount = 1;
        }
        const res = await fetch("https://www.torn.com/page.php?sid=iMarket&step=buyItems&rfcv=" + getRFC(), {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "multipart/form-data; boundary=----geckoformboundary2c222d490733a1c195f7ef80515b6a26",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": "https://www.torn.com/page.php?sid=ItemMarket",
            "body": `------geckoformboundary2c222d490733a1c195f7ef80515b6a26\r\nContent-Disposition: form-data; name=\"listingID\"\r\n\r\n${item?.ID ?? item.listingID}\r\n------geckoformboundary2c222d490733a1c195f7ef80515b6a26\r\nContent-Disposition: form-data; name=\"itemID\"\r\n\r\n${id}\r\n------geckoformboundary2c222d490733a1c195f7ef80515b6a26\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n${amount}\r\n------geckoformboundary2c222d490733a1c195f7ef80515b6a26\r\nContent-Disposition: form-data; name=\"price\"\r\n\r\n${item.price}\r\n------geckoformboundary2c222d490733a1c195f7ef80515b6a26--\r\n`,
            "method": "POST",
            "mode": "cors"
        });
        const data = await res.json();
        console.log(data);
        row.innerHTML = `<p style="text-align: center; padding-top: 10px; font-weight: bold;">${data.success ? "Successfully bought item!" : "Failed to Buy Item"}</p>`;
    }

    const doIt = (wrapper) => {
        Array.from(wrapper.children).forEach((itemEl) => {
            const buyControls = itemEl.querySelector("." + buyControlsClass);
            const priceEl = itemEl.querySelector("." + priceClass);
            const quantityEl = itemEl.querySelector("." + quantityClass);
            if (priceEl && quantityEl && buyControls && !buyControls?.querySelector(".quick-buy")) {

                const price = Number(priceEl.innerText.replace(/\D/g,''));
                const quantity = Number(quantityEl.innerText.replace(/\D/g,''));
                const qbBtn = document.createElement("button");
                qbBtn.innerText = "Q";
                qbBtn.classList.add("quick-buy");
                qbBtn.style.color = "green";
                qbBtn.style.fontSize = "1.1em";
                qbBtn.title = "Quick Buy";
                buyControls.appendChild(qbBtn);
                const item = items?.find(item => item.price == price && item.available === quantity);
                if (item) {
                    const filtered = items.sort((a, b) => a.price - b.price).filter((_, i) => i < 4 && i > 0);
                    const avg = filtered.reduce((total, item) => total + item.price,0) / filtered.length;
                    const isCheap = item.price < avg*cheapMultiplier;
                    const isSuperCheap = item.price < avg*superCheapMultiplier;
                    const margin = (avg - item.price) * item.available
                    if (isSuperCheap && margin >= minMarginForSuperCheap) {
                        itemEl.style.backgroundColor = "rgba(0, 150, 0, 0.4)";
                        qbBtn.classList.add("cheap");
                        qbBtn.style.color = "white";
                        qbBtn.style.fontSize = "1.3em";
                        qbBtn.style.textAlign = "center";
                    } else if (isCheap && margin >= minMarginForCheap) {
                        itemEl.style.backgroundColor = "rgba(5, 5, 200, 0.4)";
                        qbBtn.classList.add("super-cheap");
                        qbBtn.style.color = "white";
                        qbBtn.style.fontSize = "1.4em";
                        qbBtn.style.textAlign = "center";

                    }

                    qbBtn.addEventListener("click", () => {
                        //Find by price and quantity
                        const item = items?.find(item => item.price == price && item.available === quantity);
                        const backup = items?.find(item => item.price == price);
                        if (item || backup) {
                            buyItem(item ? item : backup, itemEl);
                        }
                    });
                } else {
                    qbBtn.disabled = true;
                }

            }

        });
    }


    const observer = new MutationObserver((_, observer) => {
        let wrapper = document.querySelector("." + containerName);
        console.log(wrapper,items);
        if (wrapper && items) {
            //observer.disconnect();
            setTimeout(() => doIt(wrapper), 100);
        }
    });
    observer.observe(document, { subtree: true, childList: true });
    console.log("BEEEEEEEEEEEEEEEEEEEEP");
    //let hasRequested = false;
    const origFetch = fetch
    window.fetch = async (url, config) => {
        const response = await origFetch(url, config)
        //console.log(url);
        if (url.indexOf("getListing") != -1) {
            //console.log(url);
            const data = await response.clone().json();
            console.log(data);
            //console.log("------------");
            // console.log(response.clone());
            // Do stuff
            items = data?.list;

        }
        return response
    }

    function watchSocket() {
        const originalSend = WebSocket.prototype.send;
        console.log("Starting to watch for socket changes");
        WebSocket.prototype.send = function(...args) {
            if (this.url === "wss://ws-centrifugo.torn.com/connection/websocket" && args[0].includes("item-market_")) {
                console.log("Subscribed to: " + args[0]);
                //console.log(this);
                this.addEventListener("message", (event) => {
                    console.log("New data");
                    const res = JSON.parse(event.data);
                    //console.log(res);

                    if (res?.result?.data?.data?.message) {
                        const msg = res?.result?.data?.data?.message;
                        if ("action" in msg) {
                            if (msg.action === "remove") {
                                const index = items?.findIndex(item => item.ID === msg.data.listingID);
                                if (index >= 0) {
                                    items?.splice(index, 1);
                                }

                            } else if (msg.action === "add") {
                                if (!msg.data?.listingID) return;
                                const index = items?.findIndex(item => item.ID === msg.data.ID);
                                if (index < 0) {
                                    //Does not already exist
                                    console.log("Added item!");
                                    console.log(msg.data);
                                    items?.push(msg.data);


                                }
                                //{"result":{"channel":"item-market_222","data":{"data":{"message":{"namespace":"item-market","action":"update","data":{"listingID":196593,"price":35000}}}}}}
                            }
                            else if (msg.action === "update") {
                                const index = items?.findIndex(item => item.ID === msg.data.listingID);
                                if (index >= 0) {
                                    const item = items[index];
                                    if (msg.data?.available) {
                                        items?.splice(index, 1, {...items, available: msg.data.available});
                                    }
                                    if (msg.data?.price) {
                                        items?.splice(index, 1, {...items, price: msg.data.price});
                                    }
                                }

                            }
                        }

                    }

                });
            }
            return originalSend.call(this, ...args);
        };
    }
    watchSocket();
})();