// ==UserScript==
// @name         Armory Loan Highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-10-04
// @description  Save trade data and all matching items in armory are highlighted. Also highlights on add to armory and add items to trade.
// @author       oleisen
// @match        https://www.torn.com/trade.php
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498597/Armory%20Loan%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/498597/Armory%20Loan%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldItems = JSON.parse(localStorage.getItem("armory-loan-data") ?? "[]");
    const saveData = (data) => {
        localStorage.setItem("armory-loan-data", JSON.stringify(data));
        oldItems = data;
    }

    //Check either faction item or the trade view.
    const checkFacItems = (wrapper, isItemAdd = false) => {
        console.log("Checking items");
        Array.from(wrapper.children).forEach((item) => {
            const name = item.querySelector(isItemAdd ? ".name-wrap" : ".name")?.innerText;
            const modifiers = item.querySelector(isItemAdd ? ".bonuses-wrap" : ".bonuses")?.children;
            console.log(isItemAdd, name, modifiers);
            if (!modifiers) return;
            //Fix for deposit pages where for some reason armor is in 2nd cell......
            const damageOrArmor = isItemAdd && modifiers[0]?.innerText === "" ? modifiers[1]?.innerText : modifiers[0]?.innerText;
            const accuracy = isItemAdd && modifiers[0]?.innerText === "" ? modifiers[0]?.innerText : modifiers[1]?.innerText;
            const quality = item.querySelector(".last.bonus-increase")?.innerText;

            if (name && damageOrArmor) {
                const bonus = item.querySelector(isItemAdd ? ".bonuses-wrap" : ".bonuses").querySelector(".bonus");
                const bonuses = Array.from(bonus.children).reduce((bonuses, i) => {
                    if (i.title != "") {
                        bonuses.push(i.title);
                    }
                    return bonuses;
                }, []);
                const matchBonuses = (oldItem, bonuses) => {
                    return bonuses && bonuses.length === oldItem.bonuses.filter(bonus => bonuses.find(bonusText => bonusText.includes(bonus.value.trim()))).length;
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
                        value: match[2].trim()
                    }));

                    // Output the extracted bonuses
                    bonuses.forEach(bonus => {
                        console.log(`Bonus Name: ${bonus.name}`);
                        console.log(`Bonus Value: ${bonus.value}`);
                    });
                    const matchBonuses = (oldItem, bonuses) => {
                        return bonuses && bonuses.length === oldItem.bonuses.filter(bonus => bonuses.find(({value: bonusText}) => bonusText.includes(bonus.value))).length;
                    }
                    const existing = oldItems.find(oldItem => oldItem.name === name && (armor && Number(armor) == Number(oldItem?.armor) && String(quality) === String(oldItem?.quality) || (accuracy && Number(damage) === Number(oldItem?.damage)) && Number(accuracy) === Number(oldItem?.accuracy)) && matchBonuses(oldItem, bonuses));
                    if (existing) {
                        item.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
                    }

                    items.push({name, quality, bonuses, ...(armor ? {armor} : {damage, accuracy})});

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
                div.style.justifyContent = "center";
                div.style.padding = "1rem";
                const button = document.createElement("button");
                button.id = "fac-armory-trade-btn";
                button.innerText = "Save items";
                button.style.backgroundColor = "darkblue";
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
                console.log("checkTrade");
                checkTrade(wrapper);
            }
            console.log("Setting obsever on", wrapper);
            if (obv) obv.observe(wrapper, { attributes: true, childList: true, subtree: true, characterData: true });
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
                    //Faction item list page
                    obv= new MutationObserver((_, observer) => {
                        checkFacItems(itemList);
                    });
                    checkFacItems(itemList);
                }
                console.log("Setting fac obsever on", itemList, isItemDonation);
                if (obv) obv.observe(itemList, { attributes: true, childList: true, subtree: true, characterData: true });
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
                    if (wrapper) {
                        console.log("faction items");
                        observ(wrapper, false);
                        observer.disconnect();
                    }
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