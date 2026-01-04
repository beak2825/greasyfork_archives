// ==UserScript==
// @name        Avatar Price Viewer
// @namespace   Violentmonkey Scripts
// @match       https://www.roblox.com/users/*
// @grant       none
// @version     1.0
// @author      Devtalius
// #run-at      document-idle
// @description Gets the price of a user avatar and the singular items when you go to their page
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/489728/Avatar%20Price%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/489728/Avatar%20Price%20Viewer.meta.js
// ==/UserScript==
async function get_api_data(url, options = {}) {
        try {
            let response = null;
            if (Object.keys(options).length !== 0) {
                response = await fetch(url, options);
            } else {
                response = await fetch(url);
            }

            if (!response.ok) {
                const headersObj = {};
                response.headers.forEach((value, name) => {
                    headersObj[name] = value;
                });
                if (headersObj["x-csrf-token"]) {
                    return headersObj["x-csrf-token"];
                }
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
            throw error;
        }
    }
    (function() {
        const cwearing = document.querySelector("#profile-current-wearing-avatar > div.container-header > h2");
        const items_grid = document.querySelectorAll("#profile-current-wearing-avatar > div.col-sm-6.section-content.profile-avatar-right > div > div > div.profile-accoutrements-slider > ul > li")
        let user_id = window.location.href.match(/[0-9]+/)[0];
        let items = null;
        const csrfTokenElement = "";
        get_api_data("https://avatar.roblox.com/v1/users/" + user_id + "/avatar").then((response) => {
            let assets = response["assets"];
            let ids = [];
            let payload = {
                items: [],
            }
            assets.forEach((asset) => {
                ids.push({
                    itemType: 1,
                    id: asset["id"]
                });
            })
            payload["items"] = ids;

            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Csrf-Token': csrfTokenElement,
                },
                body: JSON.stringify(payload)
            }

            get_api_data("https://catalog.roblox.com/v1/catalog/items/details", options)
                .then((response) => {
                    options["headers"]["X-Csrf-Token"] = response;
                    return get_api_data("https://catalog.roblox.com/v1/catalog/items/details", options);
                })
                .then((response2) => {
                    items = response2;
                    let pricesum = 0;
                    items["data"].forEach((item) => {
                        if (item["price"]) {
                            if (item["lowestResalePrice"]) {
                                pricesum += Math.max(parseInt(item["price"]), parseInt(item["lowestResalePrice"]))
                            } else {
                                pricesum += parseInt(item["price"])
                            }
                        }
                    })
                    cwearing.innerHTML += " | " + pricesum + " <span class='icon-robux-28x28 roblox-popover-close' id='nav-robux'></span>"
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        });
        new MutationObserver((mut, obs) => {
            const elems = document.querySelectorAll("span.profile-accoutrements-page");
            if (elems.length !== 0) {
                let to_be_clicked = null;
                elems.forEach((ex) => {
                    ex.addEventListener("click", (event) => {
                        items["data"].forEach((item) => {
                              const price = Math.max(parseInt(item["price"]), parseInt(item["lowestResalePrice"] ? item["lowestResalePrice"] : 0));
                              setTimeout(() => {
                                    const element = document.querySelector('a[href="/catalog/' + item["id"] + '"]')
                                    if (element) {
                                        element.children[0].querySelectorAll("h3").forEach((elem) => {
                                            elem.parentNode.removeChild(elem);
                                        })
                                        if(price > -1) {
                                        var h3 = document.createElement('h3');
                                        h3.style.position = 'absolute';
                                        h3.style.opacity = '0.7';
                                        h3.style.fontSize = '15px';
                                        h3.style.left = '50%';
                                        h3.style.top = '50%';
                                        h3.style.boxSizing = "border-box";
                                        h3.style.transform = 'translate(-50%, -50%)';
                                        h3.style.zIndex = '9999';
                                        var priceNode = document.createTextNode(price);
                                        var span = document.createElement('span');
                                        span.className = 'icon-robux-28x28 roblox-popover-close';
                                        span.id = 'nav-robux';
                                        h3.appendChild(priceNode);
                                        h3.appendChild(span);
                                        if (element.children[0]) {
                                            element.children[0].appendChild(h3);
                                        }
                                        }
                                    }
                                }, 10);

                        })
                    })
                    if(!to_be_clicked) {
                      to_be_clicked = ex;
                    }
                    obs.disconnect();
                })
                to_be_clicked.click()
            }
        }).observe(document, {
            childList: true,
            subtree: true
        });

    })();