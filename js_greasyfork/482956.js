// ==UserScript==
// @name         Enhanced Xbox Cart
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Автоматизация добавления в корзину на Xbox с улучшенным интерфейсом
// @author       MIRRONAKE
// @match        https://www.xbox.com/tr-tr/games/store/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482956/Enhanced%20Xbox%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/482956/Enhanced%20Xbox%20Cart.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const products = {
        "100VB": "9NRFP18VHR2F",
        "200VB": "9PD1G688WD0V",
        "300VB": "9MV7N0D707L5",
        "400VB": "9N9J6BBHXRK4",
        "500VB": "9PD4G3T4LP6P",
        "600VB": "9NP8DJCQKQQG",
        "700VB": "9NCQ0LZSXNBK",
        "800VB": "9PDF7RTW3HN6",
        "900VB": "9N6LNP106BP3",
        "1100VB": "9P8K4RJ5XV39",
        "1200VB": "9P8FDFWTP9MJ",
        "1300VB": "9P1M9BGF0FSG",
        "1400VB": "9P5WH95SBC1Q",
        "1500VB": "9PLP33H5GSD3",
        "1600VB": "9PFDDRKM07C4",
        "1700VB": "9P15QMWK2KQC",
        "1800VB": "9P0462L70KQQ",
        "1900VB": "9NLLNCGKW2BW",
        "2000VB": "9NBKVWFCXFDJ"
    };

    const buttonStyle = `
    padding: 10px;
    background-color: #343a40;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: calc(100% - 20px);
    margin: 5px 10px;
`;

    const PanelButtonStyle = `
    padding: 5px;
    margin: 5px 0px 5px 0px;
    background-color: #343a40;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
`;

    const panelStyle = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    background-color: #1c1c1c;
    padding: 10px;
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-radius: 10px;
    z-index: 10000;
`;

    const presetsStyle = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 330px;
    background-color: #1c1c1c;
    padding: 10px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-radius: 10px;
    z-index: 10000;
`;

    const gridStyle = `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
`;

    const TextPlain = `
    width: 100%;
    height: 40px;
    border-radius: 5px;
    background-color: #252525;
    margin: 5px 0;
    color: #fff;
    border: 1px solid #343a40;
    padding: 5px 10px;
`;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Управление корзиной';
    toggleButton.style.cssText = buttonStyle + 'position: fixed; bottom: 20px; right: 20px; width: auto;';
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.style.cssText = panelStyle;
    panel.innerHTML = `
        <button id="showPresets" style="${PanelButtonStyle}">Товары</button>
        <input type="text" style="${TextPlain}" id="productId" placeholder="productId" style="margin-bottom: 5px;">
        <input type="text" style="${TextPlain}" id="skuId" placeholder="skuId" style="margin-bottom: 5px;">
        <button id="addToCart" style="${PanelButtonStyle}">Добавить в корзину</button><br>
    `;
    document.body.appendChild(panel);

    const presetsPanel = document.createElement('div');
    presetsPanel.style.cssText = presetsStyle;
    const grid = document.createElement('div');
    grid.style.cssText = gridStyle;
    Object.keys(products).forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.style.cssText = buttonStyle;
        button.addEventListener('click', () => {
            document.getElementById('productId').value = products[key];
            document.getElementById('skuId').value = "0010";
        });
        grid.appendChild(button);
    });

    presetsPanel.appendChild(grid);
    document.body.appendChild(presetsPanel);

    toggleButton.addEventListener('click', () => {
        const isPanelVisible = panel.style.display !== 'none';
        panel.style.display = isPanelVisible ? 'none' : 'block';
        presetsPanel.style.display = 'none';
    });

    document.getElementById('showPresets').addEventListener('click', () => {
        presetsPanel.style.display = presetsPanel.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('addToCart').addEventListener('click', () => {
        const productId = document.getElementById('productId').value;
        const skuId = document.getElementById('skuId').value;

        function generateUUID() {
            var randomUUID = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );

            var byte_array = [];
            for (var i = 0; i < 36; i += 2) {
                if (randomUUID[i] === '-') continue;
                byte_array.push(parseInt(randomUUID.substr(i, 2), 16));
            }

            byte_array[6] = (15 & byte_array[6]) | 64;
            byte_array[8] = (63 & byte_array[8]) | 128;

            var formattedUUID = byte_array.map((b, index) => {
                var hex = b.toString(16).padStart(2, '0');
                if (index === 4 || index === 6 || index === 8 || index === 10) {
                    return '-' + hex;
                }
                return hex;
            }).join('');

            return formattedUUID;
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        function preloadData() {
            var allScripts = document.getElementsByTagName('script');
            var firstScriptWithoutAttributes = Array.from(allScripts).find(script => !script.attributes.length);
            eval(firstScriptWithoutAttributes.textContent)
        }

        preloadData()

        console.log(window.__PRELOADED_STATE__)
        let anonToken = window.__PRELOADED_STATE__['appContext']['requestInfo']['anonToken']

        function getVector() {
            let cock = JSON.parse(decodeURIComponent(getCookie("XBXXtkhttp://mp.microsoft.com/")))
            let token = cock['Token']
            let user = cock['UserClaims']['uhs']
            let auth = `XBL3.0 x=${user};${token}`


            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://emerald.xboxservices.com/xboxcomfd/cart/vector",
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
                        "content-type": "application/json",
                        "ms-cv": 'Tdu/hVuWO8N6Sv7QkNBfeK.29',
                        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        "x-authorization-muid": getCookie('cartMuid'),
                        "Origin": "https://www.xbox.com",
                        "x-ms-api-version": "1.0",
                        "Referer": "https://www.xbox.com/",
                        "X-S2s-Authorization": `bearer ${anonToken}`,
                        "Authorization": auth
                    },
                    onload: function(response) {
                        try {
                            const vectorId = JSON.parse(response.responseText)['vectorId'];
                            console.log(vectorId);
                            resolve(vectorId);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        getVector().then(vectorId => {
            console.log("Received vectorId:", vectorId);
            let cock = JSON.parse(decodeURIComponent(getCookie("XBXXtkhttp://mp.microsoft.com/")))
            let token = cock['Token']
            let user = cock['UserClaims']['uhs']
            let auth = `XBL3.0 x=${user};${token}`
            GM_xmlhttpRequest({
                method: "PUT",
                url: "https://cart.production.store-web.dynamics.com/cart/v1.0/cart/loadCart?cartType=consumer&appId=XboxWeb",
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,ru;q=0.8",
                    "authorization": auth,
                    "content-type": "application/json",
                    "Ms-Cv": 'Tdu/hVuWO8N6Sv7QkNBfeK.33.0',
                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "x-authorization-muid": getCookie('cartMuid'),
                    "x-ms-vector-id": vectorId,
                    "x-validation-field-1": "c0f5ht9nv86p",
                    "origin": "https://www.xbox.com",
                    "referer": "https://www.xbox.com/"
                },
                data: JSON.stringify({
                    "market": "TR",
                    "locale": "tr-TR",
                    "riskSessionId": generateUUID(),
                    "catalogClientType": "storeWeb",
                    "clientContext": {
                        "client": "XboxCom",
                        "deviceFamily": "web"
                    },
                    "friendlyName": "cart-TR",
                    "itemsToAdd": {
                        "items": [{
                            "productId": productId,
                            "skuId": skuId,
                            "availabilityId": "9TM2J8QJ0FNS",
                            "quantity": 1,
                            "campaignId": "xboxcomct"
                        }]
                    }
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(JSON.parse(response.responseText));
                    } else {
                        console.error('Error:', response.status, response.statusText);
                    }
                },
                onerror: function(response) {
                    console.error('Error:', response.status, response.statusText);
                }
            });

        }).catch(error => {
            console.error("Error fetching vectorId:", error);
        });

    });
})()