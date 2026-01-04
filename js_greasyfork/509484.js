// ==UserScript==
// @name         IdlePixel Breeding Overhaul
// @namespace    com.anwinity.idlepixel
// @version      1.0.18
// @description  Redesigned breeding UI and QoL features.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/509484/IdlePixel%20Breeding%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/509484/IdlePixel%20Breeding%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMAGE_URL = "https://cdn.idle-pixel.com/images/";

    const ANIMAL_LIST = ["chicken", "sheep", "spider", "horse", "ant", "camel", "beaver", "dove", "pig", "haron", "toysoldier", "squidshroom", "snail", "rocky", "geody", "skeleton"];
    const ANIMAL_SORT = ANIMAL_LIST.reduce((acc, value, index) => {
        acc[value] = index;
        return acc;
    }, {});

    const FOOD_MAP = {
        Seeds: "breeding_food_seeds",
        Leaves: "breeding_food_leaves",
        // breeding_food_strange_leaves
        Seafood: "breeding_food_fish",
        // breeding_food_fruits
        Insects: "breeding_food_insects",
        Bark: "breeding_food_wood",
        Metal: "breeding_food_metal",
        Flesh: "breeding_food_flesh",
    };

    class BreedingOverhaulPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("breedingoverhaul", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "newAnimalPopup",
                        label: "New Animal Popup",
                        type: "boolean",
                        default: true,
                    },
                    /* // TODO
                    {
                        id: "focusFirePeck",
                        label: "Focus Fire Peck (Requires Peck to be set to MANUAL)",
                        type: "boolean",
                        default: false,
                    }
                    */
                ]
            });
            this.focusFireTarget = null;
            this.animalData = null;
            this.lastAnimalActivation = null;
        }

        parseAnimals(raw) {
            if(!raw) {
                return [];
            }
            return raw.split("=").map((rawAnimal) => {
                const result = {
                    raw: rawAnimal
                };
                const [
                    slug,
                    animal,
                    gender,
                    tier,
                    millis,
                    shiny,
                    sick,
                    foodPerDay,
                    foodConsumed,
                    lootItemReady,
                    lootItemAmount,
                    xpGained,
                    traitLabel,
                    extraData1,
                    extraData2,
                    extraData3,
                    extraData4,
                    extraData5
                ] = rawAnimal.split(",");

                let food = Breeding.getBreedFoodLabel(animal);
                if(food == "null") {
                    food = null;
                }

                result.slug = slug;
                result.animal = animal;
                result.sexNumber = parseInt(gender); // useful for some pre-existing Breeding functions
                result.sex = (gender==1 ? "M" : (gender==2 ? "F" : "?"));
                result.tier = parseInt(tier);
                result.birth = parseInt(millis);
                result.shiny = parseInt(shiny);
                result.sick = sick!=0;
                result.food = food;
                result.foodPerDay = parseInt(foodPerDay);
                //result.foodConsumed = parseInt(foodConsumed);
                result.lootItem = lootItemReady == "none" ? null : lootItemReady;
                result.lootCount = parseInt(lootItemAmount);
                result.xp = parseInt(xpGained);
                result.trait = traitLabel;
                //result.hornyRate = Breeding.getReproductionRate(animal, null);

                return result;
            }).sort((a, b) => {
                const aSort = ANIMAL_SORT[a.animal] ?? 9999;
                const bSort = ANIMAL_SORT[b.animal] ?? 9999;
                if(aSort == bSort) {
                    return a.birth - b.birth;
                }
                return aSort - bSort;
            });
        }

        calculateReproductionRate(animalData, animal) {
            if(["toysoldier"].includes(animal)) {
                return Number.POSITIVE_INFINITY;
            }
            // calculates expected # of ticks for this species to reproduce
            let rate = Breeding.getReproductionRate(animal, null);
            let males = 0;
            let females = 0;
            let infertile = 0;
            let fertile = 0;
            for(const data of animalData) {
                if(data.animal != animal) {
                    continue;
                }
                if(data.sick) {
                    continue;
                }
                if(data.sex == "M") {
                    males++;
                }
                else if(data.sex == "F") {
                    females++;
                }
                if(data.trait == "Fertile") {
                    fertile++;
                }
                else if(data.trait == "Less Fertile") {
                    infertile++;
                }
            }
            let couples = Math.min(males, females);
            if(infertile > 0) {
                rate = Math.floor(rate * Math.pow(1.1, infertile));
            }
            if(fertile > 0) {
                rate = Math.floor(rate * Math.pow(0.9, fertile));
            }
            rate = 600 * Math.floor(1 + (rate / 600 / couples));
            return rate;
        }

        summarizeAnimals(animalData) {
            let xp = 0;
            const animals = [];
            const loot = {};
            const dailyFood = {};
            const reproduction = {};
            for(const animal of animalData) {
                xp += animal.xp || 0;

                if(!animals.includes(animal.animal)) {
                    animals.push(animal.animal);
                }

                if(animal.lootItem) {
                    if(animal.lootCount) {
                        loot[animal.lootItem] ??= 0;
                        loot[animal.lootItem] += animal.lootCount;
                    }
                }

                if(animal.food && animal.foodPerDay) {
                    dailyFood[animal.food] ??= 0;
                    dailyFood[animal.food] += animal.foodPerDay;
                }
            }
            let result = { xp, animals, loot, dailyFood, reproduction };
            for(const animal of animals) {
                const rate = this.calculateReproductionRate(animalData, animal);
                result.reproduction[animal] = rate;
            }

            // temporary hack until var_ant_capacity_used is fixed
            let antCount = animalData.filter(animal => animal.animal=="ant").length;
            window.var_ant_capacity_used = `${antCount}`;

            return result;
        }

        updateAnimalSummary(summary) {
            if(!summary) {
                return;
            }

            const totalXPElement = document.getElementById("breeding-overhaul-total-xp");
            if(totalXPElement) {
                totalXPElement.innerHTML = `${summary.xp?.toLocaleString(navigator.language)}`;
            }

            const dailyFoodElement = document.getElementById("breeding-overhaul-daily-food");
            const foodDaysElement = document.getElementById("breeding-overhaul-food-days");
            if(dailyFoodElement && summary.dailyFood) {
                let content = "";
                let contentDays = "";
                const foodSpans = [];
                const foodDaysSpans = [];
                for(const food in summary.dailyFood) {
                    const amount = summary.dailyFood[food]?.toLocaleString(navigator.language);
                    const foodVar = FOOD_MAP[food];
                    const img = `<img src="${IMAGE_URL}${foodVar}.png" class="inline" />`;

                    let danger = false;
                    let owned = "";
                    let days = 0;
                    if(foodVar) {
                        owned = IdlePixelPlus.getVarOrDefault(foodVar, 0, "int");
                        if(owned < amount) {
                            danger = true;
                        }
                        days = amount==0 ? 0 : owned/amount;
                        owned = `/${owned.toLocaleString(navigator.language)}`;
                    }

                    foodSpans.push(`<span class="${danger?'danger':''}" title="${food}: ${amount}/day">&nbsp;${img}&nbsp;${amount}${owned}&nbsp;</span>`);
                    foodDaysSpans.push(`<span class="${danger?'danger':''}" title="${food}: ${days.toFixed(2)} day${days==1?'':'s'}">&nbsp;${img}&nbsp;${days.toFixed(1)} day${days==1?'':'s'}&nbsp;</span>`);
                }

                content += foodSpans.join(" ");
                if(!content) {
                    content = "None";
                }
                if(dailyFoodElement) {
                    dailyFoodElement.innerHTML = content;
                }

                contentDays += foodDaysSpans.join(" ");
                if(!contentDays) {
                    contentDays = "None";
                }
                if(foodDaysElement) {
                    foodDaysElement.innerHTML = contentDays;
                }
            }

            const reproductionElement = document.getElementById("breeding-overhaul-reproduction");
            if(reproductionElement && summary.reproduction && summary.animals) {
                let content = "";
                const hornySpans = [];
                for(const animal of summary.animals) {
                    const img = `<img src="${IMAGE_URL}${animal}_male_1.png" class="inline" />`;
                    let rate = summary.reproduction[animal];
                    if(Number.isFinite(rate)) {
                        rate = format_time(rate);
                        if(rate < 600) {
                            // animals can reproduce at most once every 10 minutes
                            rate = 600;
                        }
                        rate = rate.replace(/, 0:00$/, "");
                    }
                    else {
                        rate = "Never";
                    }
                    hornySpans.push(`<span title="${capitalizeFirstLetter(animal)} Expected Reproduction: ${rate}">&nbsp;${img}&nbsp;${rate}&nbsp;</span>`);
                }
                content += hornySpans.join(" ");
                if(!content) {
                    content = "None";
                }
                reproductionElement.innerHTML = content;
            }

            const lootAvailableElement = document.getElementById("breeding-overhaul-loot-available");
            if(lootAvailableElement && summary.loot) {
                let content = "";
                const lootSpans = [];
                for(const loot in summary.loot) {
                    const amount = summary.loot[loot]?.toLocaleString(navigator.language);
                    const img = `<img src="${IMAGE_URL}${loot.toLowerCase()}.png" class="inline" />`;
                    lootSpans.push(`<span title="${loot}: ${amount}">&nbsp;${img}&nbsp;${amount}&nbsp;</span>`);
                }
                content += lootSpans.join(" ");
                let anyLoot = true;
                if(!content) {
                    content = "None";
                    anyLoot = false;
                }
                lootAvailableElement.innerHTML = content;
                const lootAllButton = document.getElementById("breeding-overhaul-loot-all");
                if(lootAllButton) {
                    lootAllButton.disabled = !anyLoot;
                }
            }
        }

        clickLootAll() {
            const animalData = IdlePixelPlus.getVar("animal_data");
            if(!animalData) {
                return;
            }
            this.parseAnimals(animalData)
                .filter(animal => animal.lootCount)
                .forEach(animal => IdlePixelPlus.sendMessage(`COLLECT_ALL_LOOT_ANIMAL`));
        }

        updateAnimalData(animals) {
            if(!animals) {
                return;
            }

            const summary = this.summarizeAnimals(animals);
            this.updateAnimalSummary(summary);
        }

        focusFire(event, enemyID) {
            event.stopPropagation();
            this.focusFireTarget = enemyID;
            const breedingFightingHeroes = document.querySelectorAll(".breeding-fighting-entry");
            breedingFightingHeroes.forEach((el) => {
                const allyID = parseInt(el.id.match(/(\d+)$/));
                if(typeof allyID !== "number" || isNaN(allyID)) {
                    return;
                }
                websocket.send(`BREEDING_FIGHT_SET_TARGET=${allyID}~${enemyID}`);
                Breeding.flashBorder3Seconds(allyID, enemyID);
            });
            Breeding.global_last_click_fighting_hero_animal_index = "none";
        }

        initUI() {
            const style = document.createElement("style");
            style.id = "styles-breeding-overhaul";
            style.textContent = `
            #panel-breeding #breeding-overhaul-breeding-summary {
              display: flex;
              flex-direction: column;
            }
            #panel-breeding #breeding-overhaul-breeding-summary .danger {
              color: red;
            }
            #panel-breeding #breeding-overhaul-breeding-summary img.inline {
              height: 1em;
              width: auto;
            }
            #breeding-overhaul-new-animal-dialog-backdrop {
              position: fixed;
              z-index: 9999;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              pointer-events: all;
            }
            #breeding-overhaul-new-animal-dialog {
              position: sticky;
              top: 3rem;
              border: none;
              padding: 1em;
              background-color: white;
              border: 4px solid black;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
              min-width: 300px;
            }
            #breeding-overhaul-new-animal-dialog > img#breeding-overhaul-new-animal-image {
              position: absolute;
              top: 1em;
              right: 1em;
              height: 50px;
            }
            `;
            document.head.appendChild(style);

            const panel = document.getElementById("panel-breeding");
            if(!panel) {
                console.error("Breeding Overhaul: Failed to initialize UI - #panel-breeding not found");
                return;
            }
            const craftableButtons = panel.querySelector(".craftable-btns");
            if(craftableButtons) {
                craftableButtons.insertAdjacentHTML("afterend", `
                <div id="breeding-overhaul-breeding-summary">
                  <div>
                    <strong>Total XP: </strong>
                    <span id="breeding-overhaul-total-xp"></span>
                  </div>
                  <div>
                    <strong>Daily Food: </strong>
                    <span id="breeding-overhaul-daily-food"></span>
                  </div>
                  <div>
                    <strong>Food Days: </strong>
                    <span id="breeding-overhaul-food-days"></span>
                  </div>
                  <div>
                    <strong>Reproduction: </strong>
                    <span id="breeding-overhaul-reproduction"></span>
                  </div>
                  <div>
                    <strong>Loot Available: </strong>
                    <span id="breeding-overhaul-loot-available"></span>
                  </div>
                  <div>
                    <button id="breeding-overhaul-loot-all" type="button" onclick="IdlePixelPlus.plugins.breedingoverhaul.clickLootAll()">Loot All</button>
                  </div>
                </div>
                `);
            }
            else {
                console.error("Breeding Overhaul: Failed to fully initialize UI - .craftable-btns not found");
            }

            // Breeding "Focus Fire" buttons
            const breedingFightingEnemies = document.querySelectorAll(".breeding-fighting-entry-monster");
            breedingFightingEnemies.forEach((el) => {
                const enemyID = parseInt(el.id.match(/(\d+)$/));
                if(typeof enemyID !== "number" || isNaN(enemyID)) {
                    return;
                }
                const newDiv = document.createElement("div");
                newDiv.innerHTML = `
                <div class="center">
                  <button onclick="IdlePixelPlus.plugins.breedingoverhaul.focusFire(event, ${enemyID})">Focus Fire</button>
                </div>
                `;
                el.appendChild(newDiv);
            });

        }

        markAnimalAsNew(slug) {
            /* FOR DEBUGGING */
            delete this.animalData[slug];
        }

        detectNewAnimals(animals) {
            const first = this.animalData === null;
            const animalIdsBefore = first ? new Set() : new Set(Object.keys(this.animalData));
            const animalIdsAfter = new Set(animals.map(animal => animal.slug));
            this.animalData = {};
            animals.forEach(animal => this.animalData[animal.slug] = animal);

            if(!first) {
                const newAnimalIds = [...animalIdsAfter].filter(id => !animalIdsBefore.has(id));
                if(newAnimalIds.length && this.getConfig("newAnimalPopup")) {
                    const animal = this.animalData[newAnimalIds[0]];

                    const name = capitalizeFirstLetter(get_item_name(animal.animal));
                    const tier = animal.tier;
                    const tierDots = `<span class="dot-green"></span> `.repeat(tier);
                    const slug = animal.slug;
                    const animalImage = `${IMAGE_URL}${animal.animal}_${Breeding.get_gender_label(animal.sexNumber)}_${animal.tier}.png`;
                    const sexColor = animal.sex == "F" ? "pink" : "blue";
                    const sexImage = `${IMAGE_URL}${animal.sex=='F' ? 'female' : 'male'}.png`;
                    const shiny = animal.shiny;
                    const shinyDivStyle = shiny==0 ? "" : "background-color: rgba(255, 223, 0, 0.5);";
                    const foodAmount = animal.foodPerDay;
                    const foodLabel = animal.food;
                    const foodType = FOOD_MAP[animal.food];
                    const foodImage = `${IMAGE_URL}${foodType}.png`;
                    const trait = animal.trait;
                    const traitIcon = `${IMAGE_URL}${Breeding.getTraitDesc(trait, slug)[0]}.png`;
                    const shinyLabel = (function() {
                        switch(shiny) {
                            case 0: return "No";
                            case 1: return "Shiny!";
                            case 2: return "Mega Shiny!";
                            default: return "Unknown";
                        }
                    })();
                    const inactiveVar = `inactive_${animal.animal}_${animal.sex=='F' ? 'female' : 'male'}`;
                    const inactiveCount = IdlePixelPlus.getVarOrDefault(inactiveVar, 0, "int").toLocaleString();

                    let extraButtonsHTML = "";
                    if(trait == "Fighter") {
                        extraButtonsHTML += `<button onclick="IdlePixelPlus.sendMessage('ADD_FIGHT_ANIMAL=${slug}'); IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Make Fighter</button> `;
                        extraButtonsHTML += `<button onclick="IdlePixelPlus.sendMessage('ADD_FIGHT_ANIMAL=${slug}'); IdlePixelPlus.plugins.breedingoverhaul.retryLastAnimalActivation(); IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Make Fighter &amp; Try Again</button> `;
                    }

                    const dialogHTML = `
<div id="breeding-overhaul-new-animal-dialog-backdrop">
  <dialog id="breeding-overhaul-new-animal-dialog" open>
    <img id="breeding-overhaul-new-animal-image" src="${animalImage}" />
    <div class="v-flex half-gap">
      <h5><img src="${sexImage}" class="inline" style="height: 1em" /> T-${tier} ${name}</h5>
      <div><strong>Tier: </strong> ${tierDots}</div>
      <div><strong>Trait: </strong> <img src="${traitIcon}" class="inline" style="height: 1em" /> ${trait}</div>
      <div style="${shinyDivStyle}"><strong>Shiny: </strong> ${shinyLabel}</div>
      <div><strong>Food: </strong> <img src="${foodImage}" class="inline" style="height: 1em" /> ${foodAmount} ${foodLabel} / day</div>
      <div><strong>Inactive Remaining: </strong> <span id="breeding-overhaul-new-animal-dialog-inactive-count">${inactiveCount}</span></div>
      <div class="v-flex half-gap">
        <button onclick="IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Keep</button>
        <button onclick="IdlePixelPlus.plugins.breedingoverhaul.retryLastAnimalActivation(); IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Keep &amp; Try Again</button>
        ${extraButtonsHTML}
        <button onclick="IdlePixelPlus.sendMessage('KILL_ANIMAL=${slug}'); IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Kill</button>
        <button onclick="IdlePixelPlus.sendMessage('KILL_ANIMAL=${slug}'); IdlePixelPlus.plugins.breedingoverhaul.retryLastAnimalActivation(); IdlePixelPlus.plugins.breedingoverhaul.closeNewAnimalDialog()">Kill &amp; Try Again</button>
      </div>
    </div>
  </dialog>
</div>
                    `;
                    this.closeNewAnimalDialog();
                    document.body.insertAdjacentHTML("afterbegin", dialogHTML);
                    setTimeout(function() {
                        const updatedInactiveCount = IdlePixelPlus.getVarOrDefault(inactiveVar, 0, "int").toLocaleString();
                        if(inactiveCount != updatedInactiveCount) {
                            const inactiveCountSpan = document.getElementById("breeding-overhaul-new-animal-dialog-inactive-count");
                            if(inactiveCountSpan) {
                                inactiveCountSpan.textContent = updatedInactiveCount;
                            }
                        }
                    }, 50);
                }
            }
        }

        retryLastAnimalActivation() {
            if(typeof this.lastAnimalActivation === "string") {
                if(this.lastAnimalActivation.startsWith("SLAUGHTER_FOR_TIER_")) {
                    // if number is more than we have, find new max to send
                    const parts = this.lastAnimalActivation.split(/[~=]/g);
                    const owned = IdlePixelPlus.getVarOrDefault(parts[1], 0, "int");
                    const attempted = parseInt(parts[3]);
                    if(attempted > owned) {
                        parts[3] = owned;
                    }
                    this.lastAnimalActivation = `${parts[0]}=${parts.slice(1).join("~")}`;
                }
                IdlePixelPlus.sendMessage(this.lastAnimalActivation);
            }
        }

        closeNewAnimalDialog() {
            const dialog = document.getElementById("breeding-overhaul-new-animal-dialog-backdrop");
            if(dialog) {
                dialog.remove();
            }
        }

        onMessageSent(message) {
            if(typeof message === "string") {
                if(message.startsWith("ACTIVATE_ANIMAL=") || message.startsWith("SLAUGHTER_FOR_TIER_")) {
                    this.lastAnimalActivation = message;
                }
            }
        }

        onLogin() {
            // Intercept sent messages - used to track last animal action
            if(window.websocket) {
                const plugin = this;
                const originalSend = window.websocket.send;
                window.websocket.send = function(data) {
                    plugin.onMessageSent(data);
                    return originalSend.call(this, data);
                }
            }

            // Initialize new ui components
            this.initUI();

            // override refresh function
            const original_refresh_animals_data = Breeding.refresh_animals_data;
            Breeding.refresh_animals_data = (...args) => {
                const animalArea = document.getElementById("breeding-chicken-area");

                let raw = args[0] || null;
                let animals = this.parseAnimals(raw);

                // rejoin (sorted) for original function
                if(animals?.length) {
                    raw = animals.map(animal => animal.raw).join("=");
                }
                // run original smitty function
                try {
                    original_refresh_animals_data.apply(this, [raw]);
                }
                catch(err) {
                    console.error("Error running original Breeding.refresh_animals_data: ", err);
                    throw err;
                }

                // update ui
                try {
                    this.updateAnimalData(animals);
                }
                catch(err) {
                    console.error("Error running BreedingOverhaulPlugin.updateAnimalData: ", err);
                }

                // detect new animals
                try {
                    this.detectNewAnimals(animals);
                }
                catch(err) {
                    console.error("Error running BreedingOverhaulPlugin.detectNewAnimals: ", err);
                }

            }
        }

        onVariableSet(key, valueBefore, valueAfter) {
             // TODO
            return;

            switch(key) {
                case "is_in_breeding_fight": {
                    console.log(`${key}: "${valueBefore}" -> "${valueAfter}"`);
                    if(valueAfter == "1") {
                        this.fight = {};
                    }
                    else {
                        this.fight = null;
                    }
                    break;
                }
            }
        }

        onMessageReceived(data) {
            // TODO
            return;

            try {
                const manual = window.var_large_chicken_beak_automated == "0";
                const focusFirePeck = this.getConfig("focusFirePeck");

                // requires manual since auto-mode functions server side
                if(manual && focusFirePeck) {
                    if(data?.startsWith("REFRESH_BREEDING_FIGHTING=")) {
                        data = data.substring("REFRESH_BREEDING_FIGHTING=".length).split(",");
                        const pecksAvailable = [];
                        for(let i = 0; i < data.length; i++) {
                            const fighterData = data[i].split("~");
                            const hp = parseInt(fighterData[1]);
                            const stamina = parseInt(fighterData[5]);
                            const requiredStamina = parseInt(fighterData[6]);
                            const special = fighterData[7];
                            console.log(`i=${i}, hp=${hp}, special=${special}, stamina=${stamina}, requiredStamina=${requiredStamina}`);
                            if(special == "peck" && hp > 0 && stamina >= requiredStamina) {
                                pecksAvailable.push(i);
                                console.log(`${i} peck ready`);

                                break;
                            }
                        }
                    }
                }
            }
            catch(err) {
                console.error("Breeding Overhaul - onMessageReceived - Something went wrong while processing focus fire for special abilities. A recent game update may have broken this functionality.");
            }
        }

    }

    const plugin = new BreedingOverhaulPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();