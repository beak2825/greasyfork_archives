// ==UserScript==
// @name         Armory Loan Highlighter V2
// @namespace    http://tampermonkey.net/
// @version      2025-10-04
// @description  Save trade data and all matching items in armory are highlighted. Also highlights on add to armory and add items to trade. Also contact with 39th site
// @author       oleisen
// @match        https://www.torn.com/trade.php
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513689/Armory%20Loan%20Highlighter%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/513689/Armory%20Loan%20Highlighter%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
   .plus {
      --b:2px;   /* the thickness*/
     --c:#0000 90deg,#FFF 0; /* the coloration */
     width:10px; /* the size */
     aspect-ratio:1;
     background:
       conic-gradient(from 90deg at var(--b) var(--b),var(--c))
       calc(100% + var(--b)/2) calc(100% + var(--b)/2)/
       calc(50%  + var(--b))   calc(50%  + var(--b));

     display:inline-block;
     margin:2px;
     vertical-align:middle;
    }
    .plus:hover {
       cursor: pointer;
    }
    .inline-btn {
       margin-left: 7px;
    }
    .armory-popup-container {
       background-color: rgba(0,0,0,0.2);
       position: absolute;
       left: 0;
       top: 0;
       width: 100%;
       height: 100vh;
       display: flex;
       justify-content: center;
       align-items: center;
       z-index: 19;
    }
    .armory-popup {
       width: 100%;
       max-width: 300px;
       min-height: 200px;
       background-color: #1c1b1b;
       color: #dedfe3;
       padding: 1rem;
       border-radius: 10px;
       display: flex;
       flex-direction: column;
       justify-content: center;
    }

    .armory-popup form > div {
       margin: 10px 0;
    }

    .armory-popup input[type="search"] {
       background-color: #242323;
       padding: 5px 10px;
       border-radius: 5px;
       margin-top: 5px;
       color: white;
    }

    .armory-popup #submit-armory {
       padding: 8px 12px;
       border-radius: 5px;
       margin-top: 5px;
       background-color: #092fed;
       color: white;
    }
    .armory-popup #submit-armory:hover {
       cursor: pointer;
       background-color: #4066ff;
    }

     .armory-popup label {
       padding: 5px;
    }

    .armory-popup .popup-header {
       width: 100%;
       padding: 10px:
       display: flex;
       justify-content: center;
    }

    .armory-popup {
       text-align: center;
     }

     .armory-popup .title {
       text-align: center;
     }

     #armory-form {
        display: inline-block;
     }

     .cart-btn-container {
     float: right;
        display: flex;
        align-items: center;
     }

     .cart-btn {
        color: green;
        text-align: center;
        margin-left: auto;
        margin-top: 5px;
        padding: 10px;
        border-radius: 5px;
     }

     .cart-btn:hover {
        cursor: pointer;
        color: darkgreen;
     }

      #basket-list {
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        max-height: 300px;
        overflow: scroll;
     }

     .cart-item {
        width: 80%;
        padding: 10px;
        font-size: 1.3em;
        border-radius: 5px;
     }

     .cart-item:nth-child(even) {
        background-color: rgba(0,0,5,0.1);
     }

     .cart-item:hover{
        cursor: pointer;
        background-color: rgba(0,0,50,0.2);
     }

` );

    let apiKey = String(localStorage.getItem("ultimata-key"));
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("ultimata-key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }

    const base_url = "https://ultimata.net" //https://ultimata.net http://localhost:3005
    let oldItems = JSON.parse(localStorage.getItem("armory-loan-data") ?? "[]");
    console.log(oldItems);
    const saveData = (data, addToExisting = false) => {
        const newData = addToExisting ? [...oldItems, ...data] : data
        localStorage.setItem("armory-loan-data", JSON.stringify(newData));
        oldItems = newData;
    }

    let watchingFac = false;
    let disableButtons = false;

    const showCarts = () => {
        const url = `${base_url}/api/v1/getcarts?key=${apiKey}`;
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: async function (response) {

                const data = JSON.parse(response.responseText);
                console.log(data);
                if (!data.data) return;
                const body = document.querySelector("body");
                const popup = document.createElement("div");
                popup.classList.add("armory-popup-container");
                popup.addEventListener("click", (e) => {
                    body.style.overflow = "inherit";
                    body.style.maxHeight = "inherit";
                    popup.remove();
                });

                const content = document.createElement("div");
                content.classList.add("armory-popup");

                content.addEventListener("click", (e) => {
                    e.stopPropagation();
                });
                content.innerHTML = `
        <div id="armory-form">
           <div class="popup-header">
              <h3 class="title">Basket</h3>
           </div>
           <p class="armory-response"></p>
           <ul id="basket-list">
           </ul>
        </form>
        `
                popup.appendChild(content);
                const basketList = popup.querySelector("#basket-list");
                data.data.forEach(cart => {
                    const element = document.createElement("li");
                    element.innerText = `${cart.name} (${cart.armory_carts_items.length} items)`;
                    basketList.appendChild(element);
                    element.classList.add("cart-item");
                    element.addEventListener("click", () => {
                        ///Select
                        body.style.overflow = "inherit";
                        body.style.maxHeight = "inherit";
                        popup.remove();

                        const items = cart.armory_carts_items.map(v => {
                            const item = v.armory_tracker;
                            const bonuses = [];
                            if (item.bonus_1_name && item.bonus_1_value) {
                                bonuses.push({name:item.bonus_1_name, value: item.bonus_1_value })
                            }
                            if (item.bonus_2_name && item.bonus_2_value) {
                                bonuses.push({name:item.bonus_2_name, value: item.bonus_2_value })
                            }
                            return {color: item.rarity_type, name: item.item_name, quality: item.quality + "%", bonuses, ...(item.armor ? {armor: item.armor} : {damage: item.damage, accuracy: item.accuracy})};
                        });
                        console.log(items);
                        saveData(items);
                        oldItems = saveData;
                        location.reload();
                    });
                });

                body.style.overflow = "hidden";
                body.style.maxHeight = "100vh";
                body.appendChild(popup);
            },
            onerror: function (error) {
                alert("Something went wrong. Contact olesien");
                console.error(error);
            }
        });
    }

    const addItemsTo39thArmoryFromTrade = async (items, btn) => {
        if (disableButtons) return //Currently loading
        disableButtons = true;
        const url = `${base_url}/api/v1/addarmoryitem?key=${apiKey}`;
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: async function (res) {
                disableButtons = false;

                const initialData = JSON.parse(res.responseText);
                console.log(initialData);

                if (!initialData?.data?.locations) return;
                const {locations, owners} = initialData.data;

                const body = document.querySelector("body");
                const popup = document.createElement("div");
                popup.classList.add("armory-popup-container");
                popup.addEventListener("click", (e) => {
                    body.style.overflow = "inherit";
                    body.style.maxHeight = "inherit";
                    popup.remove();
                });

                const content = document.createElement("div");
                content.classList.add("armory-popup");

                content.addEventListener("click", (e) => {
                    e.stopPropagation();
                });

                content.innerHTML = `
        <form id="armory-form">
           <div class="popup-header">
              <h3 class="title">Add ${items.length} items to Armory </h3>
           </div>
           <p class="armory-response"></p>
           <div>
             <label for="owner">Owner:</label><br>
             <input type="search" list="search_list" id="owner" name="owner" value="" placeholder="Enter Owner">
             <datalist id="search_list">
                ${locations.map(location => `<option value="${location}" />`).join("")}
             </datalist>
           </div>
           <div>
             <label for="location">Current Location:</label><br>
             <input type="search" list="location_list" id="location" name="location" value="" placeholder="Enter Current Location">
             <datalist id="location_list">
                 ${owners.map(owner => `<option value="${owner}" />`).join("")}
             </datalist>
           </div>
           <div>
              <input type="checkbox" id="update_owner" name="update_owner" />
              <label for="update_owner">Update Owner</label>
           </div>
           <div>
              <input type="checkbox" id="update_location" name="update_location" checked />
              <label for="update_location">Update Location</label>
           </div>
           <input type="submit" id="submit-armory" value="Save All">
        </form>
        `
                popup.appendChild(content);
                const form = popup.querySelector("#armory-form");
                form.addEventListener("submit", (event) => {
                    const btn = form.querySelector("#submit-armory");
                    btn.value = "Saving All..";
                    btn.disabled = true;
                    event.preventDefault();
                    console.log(event);
                    const data = new FormData(event.target);
                    const url = `${base_url}/api/v1/addtradeitems?key=${apiKey}`;
                    const obj = {
                        items,
                        owner: data.get("owner"),
                        location: data.get("location"),
                        updateOwner: !!data.get("update_owner"),
                        updateLocation: !!data.get("update_location"),
                    };
                    console.log(url);
                    const statusText = popup.querySelector(".armory-response");
                    statusText.innerText = "";
                    GM.xmlHttpRequest({
                        method: 'POST',
                        url: url,
                        onload: async function (response) {

                            const data = JSON.parse(response.responseText);
                            console.log(data);
                            statusText.style.color = data.error ? "red" : "rgba(0, 100, 0, 0.8)";
                            statusText.innerText = data.message;
                            btn.disabled = false;
                            btn.value = "Save All";
                        },
                        onerror: function (error) {
                            statusText.style.color = "red";
                            btn.disabled = false;
                            btn.value = "Save All";
                            statusText.innerText = String(error);
                            console.error(error);
                        },
                        data: JSON.stringify(obj)
                    });
                });

                body.style.overflow = "hidden";
                body.style.maxHeight = "100vh";
                body.appendChild(popup);

            },
            onerror: function (error) {
                disableButtons = false;
                alert("Something went wrong, contact olesien");
                console.error(error);
            },
            data: JSON.stringify({getoptions: true})
        });
    }

    const addItemTo39thArmory = async (item, name, damageOrArmor, accuracy) => {
        if (disableButtons) return //Currently loading
        disableButtons = true;
        const url = `${base_url}/api/v1/addarmoryitem?key=${apiKey}`;
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: async function (res) {
                disableButtons = false;
                const initialData = JSON.parse(res.responseText);
                console.log(initialData);

                if (!initialData?.data?.locations) return;
                const {locations, owners} = initialData.data;

                const body = document.querySelector("body");
                const imgWrap = item.querySelector(".img-wrap"); //data-armoryid data-itemid
                const itemID = imgWrap.dataset.itemid;
                const armoryId = imgWrap.dataset.armoryid;
                const response = await fetch("https://www.torn.com/page.php?sid=inventory&rfcv=" + getRFC(), {
                    "credentials": "include",
                    "headers": {
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=0"
                    },
                    "referrer": window.location.href,
                    "body": `itemID=${itemID}}&armouryID=${armoryId}`,
                    "method": "POST",
                    "mode": "cors"
                });

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                const popup = document.createElement("div");
                popup.classList.add("armory-popup-container");
                popup.addEventListener("click", (e) => {
                    body.style.overflow = "inherit";
                    body.style.maxHeight = "inherit";
                    popup.remove();
                });

                const content = document.createElement("div");
                content.classList.add("armory-popup");

                content.addEventListener("click", (e) => {
                    e.stopPropagation();
                });

                content.innerHTML = `
        <form id="armory-form">
           <div class="popup-header">
              <h3 class="title">Add to Armory - ${name}</h3>
           </div>
           <p class="armory-response"></p>
           <div>
             <label for="owner">Owner:</label><br>
             <input type="search" list="search_list" id="owner" name="owner" value="" placeholder="Enter Owner">
             <datalist id="search_list">
                ${locations.map(location => `<option value="${location}" />`).join("")}
             </datalist>
           </div>
           <div>
             <label for="location">Current Location:</label><br>
             <input type="search" list="location_list" id="location" name="location" value="" placeholder="Enter Current Location">
             <datalist id="location_list">
                 ${owners.map(owner => `<option value="${owner}" />`).join("")}
             </datalist>
           </div>
           <input type="submit" id="submit-armory" value="Add">
        </form>
        `
                popup.appendChild(content);
                const form = popup.querySelector("#armory-form");
                const qualityCol = data.extras.find(v => v.title === "Quality");
                const bonuses = data.extras.filter(v => v.title === "Bonus");
                const color = qualityCol.colorOverlay
                console.log(qualityCol);
                if (qualityCol) {
                    const color = qualityCol.colorOverlay
                    const qual = Number(qualityCol.value.replace("%", ""));
                    form.addEventListener("submit", (event) => {
                        const btn = form.querySelector("#submit-armory");
                        btn.value = "Adding";
                        btn.disabled = true;
                        event.preventDefault();
                        console.log(event);
                        const data = new FormData(event.target);

                        const obj = {
                            name: name,
                            quality: qual,
                            color: color,
                            bonuses: bonuses.map(bonus => ({label: bonus.value, value: Number(bonus.rawValue.replace("%", ""))})),
                            owner: data.get("owner"),
                            location: data.get("location"),
                            armoryId
                        };
                        if (accuracy) {
                            obj.damage = Number(damageOrArmor);
                            obj.accuracy = Number(accuracy);
                        } else {
                            obj.armor = Number(damageOrArmor);
                        }
                        const statusText = popup.querySelector(".armory-response");
                        statusText.innerText = "";
                        GM.xmlHttpRequest({
                            method: 'POST',
                            url: url,
                            onload: async function (response) {
                                const data = JSON.parse(response.responseText);
                                statusText.style.color = data.error ? "red" : "rgba(0, 100, 0, 0.8)";
                                console.log(data);
                                btn.disabled = false;
                                statusText.innerText = data.message;
                                btn.value = "Add";
                            },
                            onerror: function (error) {
                                statusText.style.color = "red";
                                btn.disabled = false;
                                btn.value = "Add";
                                statusText.innerText = String(error);
                                console.error(error);
                            },
                            data: JSON.stringify(obj)
                        });
                    });

                    body.style.overflow = "hidden";
                    body.style.maxHeight = "100vh";
                    body.appendChild(popup);
                }

            },
            onerror: function (error) {
                disableButtons = false;
                alert("Something went wrong, contact olesien");
                console.error(error);
            },
            data: JSON.stringify({getoptions: true})
        });

    }
    //Check either faction item or the trade view.
    const checkFacItems = (wrapper, isItemAdd = false) => {
        console.log("Checking items");
        Array.from(wrapper.children).forEach((item) => {
            const nameElement = item.querySelector(isItemAdd ? ".name-wrap" : ".name");
            const name = nameElement?.innerText;
            const modifiers = item.querySelector(isItemAdd ? ".bonuses-wrap" : ".bonuses")?.children;
            if (!modifiers) return;
            //Fix for deposit pages where for some reason armor is in 2nd cell......
            const damageOrArmor = isItemAdd && modifiers[0]?.innerText === "" ? modifiers[1]?.innerText : modifiers[0]?.innerText;
            const accuracy = isItemAdd && modifiers[0]?.innerText === "" ? modifiers[0]?.innerText : modifiers[1]?.innerText;
            const quality = item.querySelector(".last.bonus-increase")?.innerText;

            if (name && damageOrArmor) {
                const bonus = item.querySelector(isItemAdd ? ".bonuses-wrap" : ".bonuses").querySelector(".bonus");
                const bonuses = Array.from(bonus.children).reduce((bonuses, i) => {
                    if (i.title) {
                        // Regular expression to extract name and value from the title attribute
                        const regex = /<b>(.*?)<\/b><br\/>(?:.*?(\d+%))/;
                        const match = i.title.match(regex);

                        if (match) {
                            const name = match[1];
                            const value = Number(match[2].replace("%", ""));
                            // Push the object with name and value into the bonuses array
                            bonuses.push({ name, value });
                        }
                    }
                    return bonuses;
                }, []);
                const matchBonuses = (oldItem, bonuses) => {
                    console.log(oldItem, bonuses);
                    return bonuses && bonuses.length === oldItem.bonuses.filter(bonus => bonuses.find(newBonus => newBonus.name == bonus.name && newBonus.value == bonus.value)).length;
                }
                const existing = oldItems.find(oldItem => oldItem.name === name && (!accuracy && Number(damageOrArmor) == Number(oldItem?.armor) || (accuracy && Number(damageOrArmor) === Number(oldItem?.damage)) && Number(accuracy) === Number(oldItem?.accuracy)) && matchBonuses(oldItem, bonuses));
                if (existing) {
                    const used = item.querySelector(".used");

                    item.style.backgroundColor = "darkgreen";
                    const btn = item.querySelector(".checkbox-css");
                    if (!btn.classList.contains("has-been-clicked")) {
                        btn.classList.add("has-been-clicked");
                        console.log(quality);
                        if (!(used && used.innerText === "Equipped")) {
                            btn.click();
                        }
                    }


                }

                //Make the check for adding an item to 39th armory
                if (nameElement && !nameElement.querySelector(".plus")) {
                    console.log("Adding plus button");
                    const textBtn = document.createElement("span");
                    textBtn.role = "button";
                    textBtn.ariaText = "Add Item";
                    textBtn.classList.add("inline-btn");
                    textBtn.classList.add("plus");
                    nameElement.appendChild(textBtn);

                    textBtn.addEventListener("click", () => {
                        //Popup
                        addItemTo39thArmory(item, name, damageOrArmor, accuracy);
                    });

                }
            }


        });
    }

    const getTradeItems = (wrapper) => {
        return Array.from(wrapper.querySelectorAll(".cont li ul li")).reduce((items, item) => {
            const doc = item?.querySelector(".name");
            if (item && doc) {
                const details = doc.querySelector(".networth-info-icon");
                if (details) {
                    // Extract the name
                    const name = doc.childNodes[0].nodeValue.trim();



                    // Extract the tooltip
                    const tooltipElement = doc.querySelector('i.networth-info-icon');
                    const tooltip = tooltipElement ? tooltipElement.getAttribute('title') : null;

                    // Extract the quality using regex
                    const qualityMatch = tooltip ? tooltip.match(/(\d+\.\d+%)/) : null;
                    const quality = qualityMatch ? qualityMatch[1] : null;
                    let color = "White";
                    const colorMatch = tooltip.match(/<span>\d+\.?\d*%\s*(\w+)<\/span>/);

                    if (colorMatch) {
                        color = colorMatch[1];
                        console.log(`Extracted Color: ${color}`);
                    }

                    // Extract the damage and accuracy using regex
                    const damageMatch = tooltip ? tooltip.match(/bonus-attachment-item-damage-bonus'><\/i><span>([\d.]+)<\/span>/) : null;
                    const damage = damageMatch ? damageMatch[1] : null;

                    const accuracyMatch = tooltip ? tooltip.match(/bonus-attachment-item-accuracy-bonus'><\/i><span>([\d.]+)<\/span>/) : null;
                    const accuracy = accuracyMatch ? accuracyMatch[1] : null;

                    // Extract the armor rating using regex
                    const armorMatch = tooltip ? tooltip.match(/bonus-attachment-item-defence-bonus'><\/i><span>([\d.]+)<\/span>/) : null;
                    const armor = armorMatch ? armorMatch[1] : null;


                    // Extract bonuses using regex
                    const bonusMatches = tooltip ? [...tooltip.matchAll(/<b>([^<]+)<\/b><br\/>([^<]+)<\/br>/g)] : [];
                    const bonuses = bonusMatches.map(match => ({
                        name: match[1],
                        value: Number(match[2].trim().split("%")[0]?.replace(/\D/g,''))
                    }));

                    // Output the extracted bonuses
                    bonuses.forEach(bonus => {
                        console.log(`Bonus Name: ${bonus.name}`);
                        console.log(`Bonus Value: ${bonus.value}`);
                    });
                    const matchBonuses = (oldItem, bonuses) => {
                        console.log(oldItem, bonuses);
                        return bonuses && bonuses.length === oldItem.bonuses.filter(bonus => bonuses.find(({value: bonusText, label}) => bonusText == bonus.value && label == bonus.label)).length;
                    }
                    const existing = oldItems.find(oldItem => oldItem.name === name && (armor && Number(armor) == Number(oldItem?.armor) && String(quality) === String(oldItem?.quality) || (accuracy && Number(damage) === Number(oldItem?.damage)) && Number(accuracy) === Number(oldItem?.accuracy)) && matchBonuses(oldItem, bonuses));
                    if (existing) {
                        item.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
                    }

                    items.push({color, name, quality, bonuses, ...(armor ? {armor} : {damage, accuracy})});

                }
            }
            return items;
        }, []);
    }

    //This is for the add to trade and deposit to armory page
    const renderItems = (wrapper) => {
        const itemLists = wrapper.querySelectorAll(".items-cont");
        Array.from(itemLists).forEach(theList => checkFacItems(theList, true));
    }

    if (location.href.includes("trade.php")) {
        const checkTrade = (wrapper) => {

            const items = getTradeItems(wrapper);

            if (!document.querySelector("#fac-armory-trade-btn")) {
                const div = document.createElement("div");
                div.style.width = "100%";
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.justifyContent = "center";
                div.style.padding = "1rem";
                div.style.gap = "1rem";
                div.style.flexDirection = "column";

                //Save locally
                const button = document.createElement("button");
                button.id = "fac-armory-trade-btn";
                button.innerText = "Save items";
                button.style.backgroundColor = "darkgreen";
                button.style.margin = "auto";
                button.style.padding = "10px";
                button.style.color = "white";
                button.style.borderRadius = "10px";
                button.onmouseover = () => {
                    button.style.cursor = "pointer";
                }
                button.addEventListener("click", (e) => {
                    const items = getTradeItems(wrapper);
                    button.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
                    button.innerText = `Saved ${items.length} items!`;
                    saveData(items);
                });
                div.appendChild(button);

                //Save locally (add to existing
                const button1 = document.createElement("button");
                button1.id = "fac-armory-trade-btn";
                button1.innerText = "Add items to existing";
                button1.style.backgroundColor = "darkgreen";
                button1.style.margin = "auto";
                button1.style.padding = "10px";
                button1.style.color = "white";
                button1.style.borderRadius = "10px";
                button1.onmouseover = () => {
                    button1.style.cursor = "pointer";
                }
                button1.addEventListener("click", (e) => {
                    const items = getTradeItems(wrapper);
                    button1.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
                    button1.innerText = `Added ${items.length} items!`;
                    saveData(items, true);
                });
                div.appendChild(button1);

                //Add to 39th site (only those that don't exist already)
                const btn2 = document.createElement("button");
                btn2.id = "fac-armory-trade-btn";
                btn2.innerText = "Update Armory";
                btn2.style.backgroundColor = "darkblue";
                btn2.style.margin = "auto";
                btn2.style.padding = "10px";
                btn2.style.color = "white";
                btn2.style.borderRadius = "10px";
                btn2.onmouseover = () => {
                    btn2.style.cursor = "pointer";
                }
                btn2.addEventListener("click", (e) => {
                    const items = getTradeItems(wrapper);
                    console.log(items);
                    const fixedBonusItems = items.map(item => {
                        return {...item, quality: Number(item.quality.replace("%", "")), bonuses: item.bonuses.map(bonus => {
                            const value = bonus.value; //.split("%")[0]?.replace(/\D/g,'')
                            return {label: bonus.name, value: Number(value)};
                        })};
                    });
                    addItemsTo39thArmoryFromTrade(fixedBonusItems);
                });
                div.appendChild(btn2);

                const btn3 = document.createElement("button");
                btn3.id = "fac-armory-trade-btn";
                btn3.innerText = "Import";
                btn3.style.backgroundColor = "purple";
                btn3.style.margin = "auto";
                btn3.style.padding = "10px";
                btn3.style.color = "white";
                btn3.style.borderRadius = "10px";
                btn3.onmouseover = () => {
                    btn3.style.cursor = "pointer";
                }
                btn3.addEventListener("click", (e) => {
                    let json = window.prompt("Enter Data", "");
                    if (JSON.parse(json) != null) {
                        saveData(JSON.parse(json));
                    }
                });
                div.appendChild(btn3);

                const btn4 = document.createElement("button");
                btn4.id = "fac-armory-trade-btn";
                btn4.innerText = "Export";
                btn4.style.backgroundColor = "blue";
                btn4.style.margin = "auto";
                btn4.style.padding = "10px";
                btn4.style.color = "white";
                btn4.style.borderRadius = "10px";
                btn4.onmouseover = () => {
                    btn4.style.cursor = "pointer";
                }
                btn4.addEventListener("click", (e) => {
                    console.log("Starting Export");
                    alert(JSON.stringify(oldItems));
                });
                div.appendChild(btn4);

                wrapper.parentElement.appendChild(div);
            }



        }

        //For when adding to trade

        let obv = null;
        //Setup an observer that will either check for the trade iteslf or the add items part of it.
        const observ = (wrapper) => {
            const isItems = location.href.includes("#step=add");

            if (isItems) {
                const i = setTimeout(() => {
                    renderItems(document.querySelector(".category-wrap"));
                }, 750);

                obv= new MutationObserver((_, observer) => {
                    renderItems(document.querySelector(".category-wrap"));
                });


            } else {
                obv= new MutationObserver((_, observer) => {
                    checkTrade(wrapper);
                });
                checkTrade(wrapper);
            }
            console.log("Setting obsever on", wrapper);
            if (obv) obv.observe(wrapper, { attributes: true, childList: true, subtree: true, characterData: true }); //{ attributes: true, childList: true, subtree: true, characterData: true }
        }

        //Watch the trade
        const watchForLoad = () => {
            const observer = new MutationObserver((_, observer) => {
                const isItems = location.href.includes("#step=add");
                //Is the add to trade view
                if (isItems) {
                    let wrapper = document.querySelector(".category-wrap");
                    let item = document.querySelector(".primary-items");
                    console.log(wrapper);
                    if (wrapper && item) {
                        observ(wrapper);
                        observer.disconnect();
                    }
                    //The trade list
                } else {
                    let wrapper = document.querySelector(".trade-cont");
                    if (wrapper) {
                        observ(wrapper);
                        observer.disconnect();
                    }
                }

            });
            observer.observe(document, { subtree: true, childList: true });
        }

        window.addEventListener("hashchange", (event) => {
            if (obv) obv.disconnect();
            watchForLoad();
        })
        watchForLoad();


        //Below is for checking faction armory ->
    } else if (oldItems.length != 0) {

        const cartBtnContainer = document.createElement("div");
        cartBtnContainer.classList.add("cart-btn-container");
        //Select cart
        const cartBtn = document.createElement("button");
        cartBtn.classList.add("cart-btn");
        cartBtn.innerText = "Select Cart";

        const links = document.querySelector("#top-page-links-list");
        cartBtnContainer.appendChild(cartBtn);
        if (links) {
            links.appendChild(cartBtnContainer);
        }

        cartBtn.addEventListener("click", () => {
            showCarts();
        });

        let obv = null;
        //Set up the listener for the page load
        const observ = (itemList, isItemDonation) => {
            if (location.href.includes("#/tab=armoury")) {
                if (isItemDonation) {
                    const i = setTimeout(() => {
                        renderItems(document.querySelector(".category-wrap"));
                    }, 780);

                    obv= new MutationObserver((_, observer) => {
                        console.log("Rerendering the list");
                        renderItems(document.querySelector(".category-wrap"));
                    });
                    //Item Donation page
                } else {
                    console.log("category-wrap", itemList);
                    if (!watchingFac) {
                        return obv.disonnect(); //It's rerendering so we want to end this instance
                    }
                    //Faction item list page
                    obv= new MutationObserver((_, observer) => {
                        checkFacItems(itemList);
                    });
                    checkFacItems(itemList);
                }
                console.log("Setting fac obsever on", itemList, isItemDonation);
                if (obv) obv.observe(itemList, { attributes: true, childList: true, subtree: true, characterData: true }); //{ attributes: true, childList: true, subtree: true, characterData: true }
            }
        }



        const watchForLoad = () => {

            const observer = new MutationObserver((_, observer) => {
                //Is donate (this is default as well)
                if (location.href.includes("sub=donate") || !location.href.includes("sub=")) {
                    let wrapper = document.querySelector(".category-wrap");
                    let item = document.querySelector(".primary-items");
                    console.log(wrapper);
                    if (wrapper && item) {
                        observ(wrapper, true);
                        observer.disconnect();
                    }
                    //Is the normal faction list
                } else {
                    let wrapper = document.querySelector(".item-list");
                    if (wrapper && !watchingFac) {
                        watchingFac = true;
                        observ(wrapper, false);
                        //observer.disconnect();
                    }
                }
                if (!document.querySelector(".item-list")) {
                    console.log("Unwatching fac due to rerender");
                    watchingFac = false; //It will be
                }
            });
            observer.observe(document, { subtree: true, childList: true });
        }
        watchForLoad();
        //Watch for URL changes
        window.addEventListener("hashchange", (event) => {
            if (location.href.includes("&type=1#/tab=armoury")) {
                //console.log("Reconnecting observer");
                obv.disconnect();
                watchForLoad();

            }
        })
    }
})();