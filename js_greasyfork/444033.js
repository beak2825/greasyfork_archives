// ==UserScript==
// @name         Wallex Canceler Button
// @author       AMIWR
// @namespace    Wallex
// @version      0.3
// @description  Add Cancel All Button To Wallex Website
// @author       You
// @match        https://wallex.ir/app/history/trades
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wallex.ir
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444033/Wallex%20Canceler%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/444033/Wallex%20Canceler%20Button.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function makeArrayOfOrderIDs(response) {
        let orderIDs = [];
        let allOrder = response['result']['orders']

        for (let i = 0; i < allOrder.length; i++) {
            orderIDs.push(allOrder[i]['clientOrderId']);
        }

        return orderIDs;
    }

    function getOpenOrders(token) {
        // send get request to url with headers and return json response
        return fetch('https://api.wallex.ir/v1/account/openOrders', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                return json
            })
            .catch(error => {
                console.exception(error)
            })
    }

    function cancelOrder(token, orderID) {
        // send get request to url with headers and return json response
        return fetch('https://api.wallex.ir/v1/account/orders', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "clientOrderId": orderID
            })
        })
            .then(response => response.json())
            .then(json => {
                return json
            })
            .catch(error => {
                console.log(error)
            })
    }

    function canceler() {
        try {
            let token = getCookie('_wallex_auth_token')
            getOpenOrders(token).then(json => {
                let orderIDs = makeArrayOfOrderIDs(json)
                for (let i = 0; i < orderIDs.length; i++) {
                    cancelOrder(token, orderIDs[i]).then(r => {
                        console.log(r)
                    })
                }
            })
        } catch (e) {
            console.exception(e);
        }
    }

    function waitForElm(selector) {
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
    }

    function main() {
        let button = document.createElement('button');
        button.innerHTML = 'Cancel All';
        button.style.backgroundColor = '#ff0000';
        button.className = 'small clickable MuiBox-root mui-light-t7uku1'
        button.onclick = canceler;

        let buttonPlace = waitForElm(
            '#__next > div > div > main > div > div.MuiBox-root.mui-light-1gj218d > div:nth-child(1)'
        ).then(elm => {
            elm.appendChild(button);
        });
    }

    main();

})();