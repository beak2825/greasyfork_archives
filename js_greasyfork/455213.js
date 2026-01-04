// ==UserScript==
// @name         Auctionhouse Filter
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  Filter the auction house for only the weapons you desire
// @author       olesien
// @match        https://www.torn.com/amarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455213/Auctionhouse%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/455213/Auctionhouse%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Styles
    GM_addStyle ( `
   #auction-filter {
      border-radius: 10px;
      margin-bottom: 10px;
   }

   #auction-filter .filter-button {
      background-color: #333333;
      display: block;
      color: white;
      padding: 10px;
      border-radius: 10px;
   }

   #auction-filter .filter-button:hover {
      cursor: pointer;
      background-color: #333434;
   }

   #auction-filter .filter-form {
      display: flex;
      flex-flow: row wrap;
      padding: 10px;
   }

   #auction-filter .filter-div {
       padding: 5px;
       display: inline-block;
       width: 100px;
   }

   #auction-filter .filter-text {
       padding: 10px;
   }

   #auction-filter .field-form {
       display: flex;
   }

   #auction-filter .field-form .field-container {
           display: flex;
           align-items: center;
           gap: 10px;
   }

   #auction-filter .field-form .field-container input {
        padding: 5px;
        margin-left: 10px;
        width: 50px;
   }

   #auction-filter .filter-flex {
        display: flex;
        justify-content: space-even;
        flex-flow: row wrap;
        padding: 0.5rem;
   }

  `);
    //https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
    const observeDOM = (function(){
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || obj.nodeType !== 1 ) return;

            if( MutationObserver ){
                // define a new observer
                var mutationObserver = new MutationObserver(callback)

                // have the observer observe foo for changes in children
                mutationObserver.observe( obj, { childList:true, subtree:true })
                return mutationObserver
            }

            // browser support fallback
            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        }
    })();

    window.addEventListener(
        "load",
        function () {
            //DOM has loaded

            setTimeout(() => {
                const auctionHouseTabsEl = document.querySelector("#auction-house-tabs");

                //Create item box
                const divEl = document.createElement("div");
                divEl.id = "auction-filter";
                divEl.className = "cont-gray";
                //Append to box
                auctionHouseTabsEl.insertBefore(divEl, auctionHouseTabsEl.firstChild);

                doIt();
                renderSettings();

                const pagination = document.querySelector(".pagination-wrap");
                observeDOM( pagination, function(m){
                    doIt();
                });
            }, 200);
        }, false);

    const bonusString = ".bonus-attachment-";
    const normalBonuses = ["demoralized", "freeze", "blindfire", "poisoned", "burning", "laceration", "severeburning", "spray", "emasculate", "hazardous", "storage", "toxin"]
    const rwBonuses = ["achilles", "assassinate", "backstab", "berserk", "bleed", "blindside", "bloodlust", "comeback", "conserve",
                       "cripple", "crusher", "cupid", "deadeye", "deadly", "disarm", "doubletap", "doubleedged", "empower", "eviscerate","execute", "expose",
                       "finale", "focus", "frenzy", "fury", "grace", "homerun", "irradiate", "motivation", "paralyzed", "parry", "penetrate", "plunder", "powerful","proficience",
                       "puncture", "quicken", "rage", "revitalize", "roshambo", "slow", "smurf", "specialist", "stricken", "stun", "suppress", "sureshot",
                       "throttle", "warlord", "weaken", "windup", "wither"]

    function renderSettings() {
        const divEl = document.getElementById("auction-filter");
        divEl.innerHTML =""; //Clear
        const hiddenString = localStorage.getItem('auction-filter-hidden');
        let hidden = hiddenString ? JSON.parse(hiddenString) : hiddenString;
        const pEl = document.createElement("button");
        pEl.className = "filter-button";

        const clickEvent = pEl.addEventListener("click", async (e) => {
            await localStorage.setItem('auction-filter-hidden', JSON.stringify(!hidden));
            renderSettings();
            pEl.removeEventListener(clickEvent); //Prevent duplicate listeners
        });

        pEl.innerText = `Filters`;
        //Add text
        divEl.appendChild(pEl);

        if (!hidden) {
            const textEl = document.createElement("p");
            textEl.innerText = "Bonus type";
            textEl.className = "filter-text";
            divEl.appendChild(textEl);

            const formEl = document.createElement("div");
            formEl.className = "filter-form";
            const setCheckbox = (value, title, main) => {
                const divEl = document.createElement("div");
                divEl.className = "filter-div";

                const checked = localStorage.getItem('checked-rw-' + value);
                const inputEl = document.createElement("input");
                inputEl.type = "checkbox";
                inputEl.id = "rw-" + value;
                inputEl.name = "rw-" + value;
                //inputEl.value = bonus;
                inputEl.checked = checked;

                inputEl.addEventListener('change', async function() {
                    if (!this.checked) {
                        await localStorage.removeItem('checked-rw-' + value);
                    } else {
                        await localStorage.setItem('checked-rw-' + value, String(this.checked));
                    }

                    doIt();
                });

                const labelEl = document.createElement("label");
                labelEl.for = "rw-" + value;
                labelEl.innerText = title
                labelEl.style.paddingLeft = "5px";
                labelEl.className = "t-gray-6";

                divEl.appendChild(inputEl);
                divEl.appendChild(labelEl);

                main.appendChild(divEl);
            }
            rwBonuses.forEach(bonus => {
                setCheckbox(bonus, bonus, formEl);
            })

            //Append to div
            divEl.appendChild(formEl);

            //One of US
            const miscEl = document.createElement("div");
            miscEl.className = "filter-flex";

            //Min damage / acc
            const dmgaccEl = document.createElement("div");
            const textEl2 = document.createElement("p");
            textEl2.innerText = "Min damage / accuracy ";
            textEl2.className = "filter-text";
            dmgaccEl.appendChild(textEl2);

            const formEl2 = document.createElement("div");
            formEl2.className = "field-form";
            const createField = (name, initial) => {
                const fieldContainer = document.createElement("div");
                fieldContainer.className = "field-container";

                const label = document.createElement("label");
                label.innerText = name;
                label.className = "filter-text";

                const input = document.createElement("input");
                input.type = "number";
                input.value = initial ?? "";
                label.appendChild(input);
                fieldContainer.appendChild(label);
                return {fieldContainer, input};
            }
            //Damage
            const damage = localStorage.getItem('auction-filter-damage');
            const {fieldContainer, input: damageInput} = createField("Damage", damage);

            //Accuracy
            const accuracy = localStorage.getItem('auction-filter-accuracy');
            const {fieldContainer: fieldContainer2, input: accuracyInput} = createField("Accuracy", accuracy);

            damageInput.addEventListener('input', async (e) => {
                console.log(damageInput.value);
                const value = Number(damageInput.value)
                if (!value || value <= 0 || value > 9999) {
                    await localStorage.removeItem('auction-filter-damage');
                } else {
                    await localStorage.setItem('auction-filter-damage', String(value));
                }
                doIt();
            });

            accuracyInput.addEventListener('input', async (e) => {
                console.log(accuracyInput.value);
                const value = Number(accuracyInput.value)
                if (!value || value <= 0 || value > 9999) {
                    await localStorage.removeItem('auction-filter-accuracy');
                } else {
                    await localStorage.setItem('auction-filter-accuracy', String(value));
                }
                doIt();
            });

            //append
            formEl2.appendChild(fieldContainer);
            formEl2.appendChild(fieldContainer2);

            dmgaccEl.appendChild(formEl2);
            miscEl.appendChild(dmgaccEl);

            //Rarity
            const rarityEl = document.createElement("div");
            const textEl3 = document.createElement("p");
            textEl3.innerText = "Rarity types ";
            textEl3.className = "filter-text";


            const formEl3 = document.createElement("div");
            formEl3.className = "field-form";

            setCheckbox("normal", "normal", formEl3);
            setCheckbox("yellow", "yellow", formEl3);
            setCheckbox("orange", "orange", formEl3);
            setCheckbox("red", "red", formEl3);

            rarityEl.appendChild(textEl3);

            rarityEl.appendChild(formEl3);

            miscEl.appendChild(rarityEl);

            divEl.appendChild(miscEl);

        }
    }
    function doIt() {
        const minDamage = localStorage.getItem('auction-filter-damage');
        const minAccuracy = localStorage.getItem('auction-filter-accuracy');

        const normal = localStorage.getItem('checked-rw-normal');
        const yellow = localStorage.getItem('checked-rw-yellow');
        const orange = localStorage.getItem('checked-rw-orange');
        const red = localStorage.getItem('checked-rw-red');

        const weaponsTabEl = document.querySelector(".ui-corner-top");
        if (!weaponsTabEl.classList.contains("active")) return;
        const auctionHouseTabsEl = document.querySelector("#auction-house-tabs");

        //const chosenBonuses = ["warlord", "weaken"]
        let chosenBonuses = rwBonuses.reduce((chosenBonuses, bonus) => {
            const checked = localStorage.getItem('checked-rw-' + bonus);
            if (checked) return [...chosenBonuses, bonus];
            return chosenBonuses;
        }, []);

        if (chosenBonuses.length === 0) chosenBonuses = rwBonuses;
        //Grab items
        const items = Array.from(auctionHouseTabsEl.querySelector(".items-list").children);

        items.forEach((itemEl) => {
            //#FF0000 <- Red
            //#FF8000 <- Orange
            //#FFBF00 <- Yellow
            if (itemEl.classList.contains("clear")) return;
            const hasRightBonuses = chosenBonuses.reduce((hasBonus, bonus) => {
                if (hasBonus) return hasBonus;
                return !!itemEl.querySelector(bonusString + bonus); //!! = convert to boolean true/false
            }, false);
            console.log(itemEl);
            const [damage, accuracy] = Array.from(itemEl.querySelector(".infobonuses").querySelectorAll(".label-value"))
            console.log(damage, accuracy);
            const hasMinDamage = Number(damage.innerText) >= Number(minDamage ?? 0);
            const hasMinAccuracy = Number(accuracy.innerText) >= Number(minAccuracy ?? 0);
            let hasRightRarity = false;
            const imgEl = itemEl.querySelector(".item-plate");
            const color = imgEl?.dataset?.color;
            if (!imgEl || !color) {
                //Default
                console.log("BELOW IS UNKNOWN");
                console.log(imgEl);
                hasRightRarity = true;
            } else {
                if (color === "FF0000" && red) hasRightRarity = true;
                if (color === "FF8000" && orange) hasRightRarity = true;
                if (color === "FFBF00" && yellow) hasRightRarity = true;
                if (color !== "FF0000" && color !== "FF8000" && color !== "FFBF00" && normal) hasRightRarity = true;
                if (!normal && !yellow && !orange && !red) hasRightRarity = true; //Unset
            }
            if (!hasRightBonuses || !hasMinDamage || !hasMinAccuracy || !hasRightRarity) {
                itemEl.style.display = "none";
            } else {
                itemEl.style.display = "inherit";
            }
        });
    }
})();