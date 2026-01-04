// ==UserScript==
// @name         Bunnings Stock Checker
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Show local bunnings stock
// @author       You
// @match        https://*.bunnings.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunnings.com.au
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479356/Bunnings%20Stock%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/479356/Bunnings%20Stock%20Checker.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    let coords = getCoords()
    if (!coords) {
        let coordString = prompt("Please enter your coordinates (used to check local stores)\nopen googles maps, right click on the map and select the first option to copy the coords to your clipboard, then paste here", "11111,22222");
        if (coordString === "11111,22222") {

        }
        const [lat, lon] = coordString.replaceAll(" ", "").split(",")
        coords = {
             lat,
             lon,
        }
        setCoords(coords)
    }

    const chevDown = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`

    let prevProduct = {
        productNumber: undefined,
        stockLevel: undefined
    }
    
    let oldHref = document.location.href;
    new MutationObserver(mutations => mutations.forEach(() =>
        oldHref !== document.location.href && (oldHref = document.location.href, go())
    ))
        .observe(document.querySelector("body"), { childList: true, subtree: true });

    go()

    async function go() {
        let productElement = await waitUntilElementReady("p[data-locator=product-item-number]", 10000)
        let productNumber
        if (productElement) {
            productNumber = productElement?.innerText.split(": ")[1]
        }
        if (!productNumber || prevProduct.productNumber === productNumber) {
            return
        }

        prevProduct.productNumber = productNumber
        if (productNumber) {
            let body = {products:[productNumber]}
            let token = getTokenFromCookie()
            if (!token) {
                console.error("could not get token from cookie")
                return
            }

            let res = await fetch(`https://api.prod.bunnings.com.au/v1/stores/products/stock?latitude=${coords.lat}&longitude=${coords.lon}&currentPage=0&fields=FULL&pageSize=20&isTrCart=false&tradeRestrictedStore=&isPickup=true&radius=100000`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-AU,en-US;q=0.9,en;q=0.8",
                    "authorization": `Bearer ${token}`,
                    "clientid": "mHPVWnzuBkrW7rmt56XGwKkb5Gp9BJMk",
                    "content-type": "application/json",
                    "correlationid": "c2910260-7c82-11ee-afa8-2b82a7af0d7d",
                    "country": "AU",
                    "currency": "AUD",
                    "locale": "en_AU",
                    "locationcode": "8056",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sessionid": "de5a3600-76bb-11ee-bb40-eb464f6810a4",
                    "stream": "RETAIL",
                    "userid": "anonymous",
                    "x-region": "QLDMetro"
                },
                "referrer": "https://www.bunnings.com.au/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify(body),
                "method": "POST",
                "mode": "cors",
            });
            let {statusDetails, data} = await res.json()
            console.log(data)

            const storeNameElement = await waitUntilElementReady("a.highlightStoreName") 
            const storeName = storeNameElement ? storeNameElement.innerText.split("\n")[0] : undefined
            if (data && storeName) {
                const selectedStoresStock = data.stores.find(s => s.description === storeName || s.displayName === storeName)
                if (selectedStoresStock) {
                    injectStockNumber(selectedStoresStock, data.stores)
                        window.addEventListener('focus', function(event) {
                            console.log("<< focus >>")
                            let interval = this.setInterval(() => {
                                if (!this.document.getElementById("stockAdded")) {
                                    injectStockNumber(selectedStoresStock, data.stores)
                                }
                            }, 250)
                            this.setTimeout(() => {
                                this.clearInterval(interval)
                            }, 5000)
                        });
                    } else {

                    }
            } else {
                console.error("Store name not found")
            }
            prevProduct.stockLevel = data.stores[0].products[0].stock.stockLevel
        }
    }

    async function waitUntilElementReady(selector, timeoutMs = 30000) {
        let el
        const start = Date.now()
        while (Date.now() - start < timeoutMs) {
            el = document.querySelector(selector)
            if (el) {
                break
            }
            await new Promise(resolve => setTimeout(resolve, 300))
        }
        return el
    }

    function getStockColour(stock) {
        let bg
        if (stock < 3) {
            bg = "#d9534f"
        } else if (stock < 6) {
            bg = "#f0b90b"
        } else {
            bg = "#21a346"
        }
        return bg
    }

    function injectStockNumber(selectedStoresStock, stores) {
        stores = stores.filter(s => s.displayName !== selectedStoresStock.displayName)
        const storeInfoBanner = document.querySelector("div.storeInfoBanner")
        let outOfStock = false
        let inStockLabel = storeInfoBanner.querySelector("span[data-locator=message_InStock]") ?? storeInfoBanner.querySelector("span[data-locator=message_LowStock]")
        if (!inStockLabel) {
            outOfStock = true
            inStockLabel = storeInfoBanner.querySelector("div.headingStyle")
        }
        const stock = selectedStoresStock.products[0].stock.stockLevel
        let bg = getStockColour(stock)
        if (inStockLabel) {                    
            let addedStockElement

            let stockButtonStyle = `background-color:${bg};border-radius:2px;padding-left:12px;display:flex;gap:0.3rem;align-items:center;justify-content: center`
            if (outOfStock) {
                let localStock = stores.slice(0, 3).reduce((a, b) => a + b.products[0].stock.stockLevel, 0);
                addedStockElement = `<div id="stockAdded" style="${stockButtonStyle}">
                    <b>${localStock}</b>
                    <div>at nearby stores</div>
                    <div style="margin-left:4px;margin-top:6px;padding-right:4px">${chevDown}</div>
                </div>`
            } else {
                addedStockElement = `<div id="stockAdded" style="${stockButtonStyle}">
                    <b>${stock}</b>
                    <div>${inStockLabel.innerText}</div>
                    <div style="margin-left:4px;margin-top:6px;padding-right:4px">${chevDown}</div>
                </div>`
            }
            inStockLabel.innerHTML = addedStockElement

            const dropdown = document.createElement('div');
            dropdown.style.display = 'none';
            dropdown.style.position = 'absolute';
            dropdown.style.backgroundColor = 'white';
            dropdown.style.border = '1px solid #0d5257';
            dropdown.style.padding = '10px';
            dropdown.style.zIndex = '1000';

            let col1 = ''
            let col2 = ''
            stores.forEach(store => {
                const stockLevel = store.products[0].stock.stockLevel
                const colour = getStockColour(stockLevel)
                col1 += `<div style="background-color:${colour + "20"};color:${colour};text-align: right;padding-right:4px">${stockLevel ?? "-"}</div>`
                col2 += `<div style="background-color:${colour + "20"};display:flex;align-items: center;column-gap: 0.5rem;padding-right:4px"><div style="height:8px;width:8px;background-color:${colour};border-radius: 9999px;"></div>${store.displayName}</div>`
            })

            dropdown.innerHTML = `<div style="display:grid;grid-template-columns: repeat(9, minmax(0, 1fr))">
            <div>${col1}</div><div style="grid-column: span 8 / span 8">${col2}</div>
            </div>`

            // Add the dropdown to the button
            inStockLabel.appendChild(dropdown);

            // Show the dropdown when the button is hovered over
            inStockLabel.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
            });

            // Hide the dropdown when the mouse leaves the button or the dropdown
            inStockLabel.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
            });
        }
    }

    function getCoords() {
        let c = localStorage.getItem("stock-level-coords")
        return c ? JSON.parse(c) : undefined
    }

    function setCoords(coords) {
        if (coords) {
            localStorage.setItem("stock-level-coords", JSON.stringify(coords))
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function getTokenFromCookie() {
        let guestToken = getCookie('guest-token-storage')
        if (guestToken) {
            let guestTokenObj = JSON.parse(guestToken)
            return guestTokenObj.token
        }
    }
    
})();