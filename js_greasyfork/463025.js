// ==UserScript==
// @name         Rebekah's Calculator Suite
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  Provides automatic calculators for damage, experience/h and boost values.
// @author       Rebekah
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/463025/Rebekah%27s%20Calculator%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/463025/Rebekah%27s%20Calculator%20Suite.meta.js
// ==/UserScript==

/*
This is the result of a lot of old projects and staying up way past my bedtime.
Credit to hotrods20 for being my Javascript mentor, helping me out with problems and providing a vital function to this project.
Credit to GGenocide for bug testing the damage calculator.
Credit to Braeden for continually helping with bug testing, without him this userscript would have released with a pretty major bug and a much less accurate EXP/h calculator.
Credit to SilverBeam for finding a couple issues, being there to discuss userscripts with, for contributing the "ammo per minute" suggestion and for allowing interplay between our two userscripts.
Credit to FatalSystem's EXP Calculator spreadsheet for providing a better average health value for the Wastelands.
Credit to Sigala for putting the idea to add an EXP/h calculator to what was originally only a damage calculator into my head (man cost me many hours of my life here).
Credit to D92 for leading me down the rabbit hole of adding a total boosts calculator when I'd only just released the second bugfix (yet more hours gone).
Credit to the Dead Frontier Official Wiki for the damage calculation formulae, without which this project would not have been possible.
Credit to Courageii for contributing a project suggestion which lead to this userscript.
Credit to Venom Snake for lending me weapons for testing.
Credit to Runon for allowing me to adapt their method of determining whether or not the page has loaded.
Credit to everyone in the Dead Frontier Official Discord who showed interest in this userscript throughout it's development, your support has meant the world to me.
*/

const debug = false;

//#region Data Parsing
function parseItemData(data)
{
    debug ? console.log('itemData raw: ', data) : null;
    let dataHolder = {};
    let failHolder = {};

    for(let x in data)
    {
        if(data[x] && (data[x].itemtype === 'weapon' || data[x].itemtype === 'armour' || data[x].implant))
        {
            dataHolder[x] = data[x];
        } else
        {
            failHolder[x] = data[x];
        };
    };

    debug ? console.log('itemData dataHolder: ', dataHolder) : null;
    debug ? console.log('itemData failHolder: ', failHolder) : null;

    for(let x in dataHolder)
    {
        if(dataHolder[x].unique_parameters)
        {
            let holder = dataHolder[x].unique_parameters.split(', ');

            for(let i = 0; i < holder.length; i++)
            {
                holder[i] = holder[i].split('=');
            };

            dataHolder[x].unique_parameters = {};

            for(let i = 0; i < holder.length; i++)
            {
                dataHolder[x].unique_parameters[holder[i][0].trim()] = holder[i][1].trim();
            };
        }
    };

    return dataHolder;
};

function parseProfessionData(data)
{
    debug ? console.log('professionData raw: ', data) : null;
    const terms = {
        'item':'findchancegeneral',
        'ammunition find':'ammoloot',
        ' find':'loot',
        'reduced':'damagereduction',
        'loot search':'searchspeed',
        'movement speed':'speed',
        ' (non-smg)':'',
        ' count':'',
        ' weapon damage':''
    };

    let dataHolder = {};

    for(let x in data)
    {
        if(data[x] && x.includes('GLOBALDATA_professions_') && !x.includes('maxpros'))
        {
            let key = x.split('GLOBALDATA_professions_')[1].split('_')[0];
            let parameter = x.split('GLOBALDATA_professions_')[1].split('_')[1];

            !dataHolder[key] ? dataHolder[key] = {} : null;

            if(parameter == 'description' && data[x].includes('%'))
            {
                let holder = data[x].toLowerCase().split('">')[1].split('</')[0].split('<br />');
                dataHolder[key]['bonuses'] = {};

                for(let i = 0; i < holder.length; i++)
                {
                    holder[i] = holder[i].split('+')[1];

                    for(let term in terms)
                    {
                        if(holder[i].includes(term))
                        {
                            holder[i] = `${holder[i].split(term)[0].split('.')[0].replace(/\s/g, '')}${terms[term]}`
                        }
                    };

                    dataHolder[key].bonuses[holder[i].split('%')[1]] = holder[i].split('%')[0];
                };
            } else
            {
                dataHolder[key][parameter] = data[x];
            };
        };
    };

    debug ? console.log('professionData dataHolder: ', dataHolder) : null;

    return dataHolder
};

function parseMasteryData(data)
{
    let dataHolder = {};
    let raw = data.split('&');
    for(let x in raw)
    {
        raw[x] = raw[x].split('=');
        raw[x][0] = raw[x][0].explode('_', 2);
        if(!dataHolder[raw[x][0][0]])
        {
            dataHolder[raw[x][0][0]] = {};
        };
        dataHolder[raw[x][0][0]][raw[x][0][1]] = raw[x][1];
    };
    let outputHolder = {};
    for(let i = 0; i < dataHolder["max"]["masteries"]; i++)
    {
        if(dataHolder["mastery"][`${i}_bonuses_0_type`] === "expgain")
        {
            if((dataHolder["mastery"][`${i}_bonuses_0_scale`] * dataHolder["mastery"][`${i}_stat_level`]) > dataHolder["mastery"][`${i}_bonuses_0_max`])
            {
                outputHolder["exp"] = dataHolder["mastery"][`${i}_bonuses_0_max`] / 100
            } else
            {
                outputHolder["exp"] = (dataHolder["mastery"][`${i}_bonuses_0_scale`] / 100) * dataHolder["mastery"][`${i}_stat_level`];
            };
        } else
        {
            if((dataHolder["mastery"][`${i}_bonuses_0_scale`] * dataHolder["mastery"][`${i}_stat_level`]) > dataHolder["mastery"][`${i}_bonuses_0_max`])
            {
                outputHolder[dataHolder["mastery"][`${i}_bonuses_0_type`].split('Damage')[0]] = dataHolder["mastery"][`${i}_bonuses_0_max`] / 100
            } else
            {
                outputHolder[dataHolder["mastery"][`${i}_bonuses_0_type`].split('Damage')[0]] = (dataHolder["mastery"][`${i}_bonuses_0_scale`] / 100) * dataHolder["mastery"][`${i}_stat_level`];
            };
        };
        if(dataHolder["mastery"][`${i}_bonuses_1_type`])
        {
            if(dataHolder["mastery"][`${i}_bonuses_1_type`] === "lootspeed")
            {
                if((dataHolder["mastery"][`${i}_bonuses_1_scale`] * dataHolder["mastery"][`${i}_stat_level`]) > dataHolder["mastery"][`${i}_bonuses_1_max`])
                {
                    outputHolder["searchspeed"] = dataHolder["mastery"][`${i}_bonuses_1_max`] / 100
                } else
                {
                    outputHolder["searchspeed"] = (dataHolder["mastery"][`${i}_bonuses_1_scale`] / 100) * dataHolder["mastery"][`${i}_stat_level`];
                };
            } else
            {
                if((dataHolder["mastery"][`${i}_bonuses_1_scale`] * dataHolder["mastery"][`${i}_stat_level`]) > dataHolder["mastery"][`${i}_bonuses_1_max`])
                {
                    outputHolder[dataHolder["mastery"][`${i}_bonuses_1_type`].split('Damage')[0]] = dataHolder["mastery"][`${i}_bonuses_1_max`] / 100
                } else
                {
                    outputHolder[dataHolder["mastery"][`${i}_bonuses_1_type`].split('Damage')[0]] = (dataHolder["mastery"][`${i}_bonuses_1_scale`] / 100) * dataHolder["mastery"][`${i}_stat_level`];
                };
            };
        };
    };
    return outputHolder;
};
//#endregion

//#region Main
(async function() {
'use strict';
//#region Constants
    const userVars = unsafeWindow.userVars;
    const globalData = unsafeWindow.globalData;

    //#region Request Header
    const dataArr = []; //This information is only accessible for the account you're currently logged into. It is pre-encrypted and this userscript does nothing with it besides passing it through to the webCall() function that already exists on the Dead Frontier webpage.
    dataArr["userID"] = userVars["userID"];
    dataArr["password"] = userVars["password"];
    dataArr["sc"] = userVars["sc"];
    dataArr["action"] = "get";
    //#endregion
//#endregion

//#region Globals
    let itemData;
    let professionData;
    let masteryData;
    let databank = {};
    let requestArr;
    let states = {};
    let character = {};
    let boostCheck = [true, true]
//#endregion

//#region Page Setup
    function pageSetup()
    {
        //#region Conversion Arrays
        const descriptors = {
            damage:[
                "DPH:",
                "Crit DPH:",
                "DPS:",
                "Cleave DPH:",
                "Crit Cleave DPH:",
                "Cleave DPS:",
                "Explosive DPH:",
                "Explosive DPS:",
                "Crit Pattern:",
                "Attacks per Second:",
                "Attack Speed Boost:",
                "Ammo Per Minute:"
            ],
            damageIds:[
                "dph",
                "dphCrit",
                "dps",
                "dphCleave",
                "dphCleaveCrit",
                "dpsCleave",
                "dphExplosive",
                "dpsExplosive",
                "critPattern",
                "attackSpeed",
                "attackSpeedBoost",
                "ammoUse"
            ],
            damageTitles:[
                "Your raw Damage Per Shot and (damage distribution across pellets, penetrating hits or burst).",
                "Your Damage Per Shot with a critical and (damage distribution across pellets, penetrating hits or burst).",
                "Your raw Damage Per Second and (Critical Damage Per Second). Reloading is accounted for in both and assumes maximum targets hit if projectile penetrates.",
                "Your raw cleave Damage Per Hit and (damage distribution across maximum zombies hit).",
                "Your cleave Damage Per Hit with a critical and (damage distribution across maximum zombies hit).",
                "Your cleave Damage Per Second across all zombies hit accounting for crit chance",
                "Your explosive Damage Per Shot across maximum zombies hit.",
                "Your explosive Damage Per Second across maximum zombies hit.",
                "Your Critical Hit Pattern with the current weapon and stats in the format [Non-Crits] > [Crits].",
                "Your Attacks per Second accounting for server delay and any Dexterity bonus.",
                "Your total attack speed boost from Dexterity and (bonus attacks per second).",
                "Your rough ammo expenditure per minute accounting for reloading and (ammo cost per minute, ammo cost per hour using current prices if SilverScripts is also installed)."
            ],
            experience:[
                "Charred Titan:",
                "Wastelands:",
                "Devil Hound:"
            ],
            experienceIds:[
                "zone1",
                "zone2",
                "zone3"
            ],
            experienceTitles:[
                "Average theoretical Experience Per Hour farming Charred Titans for the current loadout, uses single-target damage for cleave weapons and grenade launchers.",
                "Average theoretical Experience Per Hour in the Wastelands for the current loadout.",
                "Average theoretical Experience Per Hour farming Devil Hounds for the current loadout, uses single-target damage for cleave weapons and grenade launchers."
            ],
            boostEntry:[
                "Clan EXP:",
                "Clan PVP:",
                "Clan IDR:",
                "Clan Damage:",
                "Clan Cash:",
                "Clan Ammo:",
                "Clan Weapon:",
                "Clan Armour:",
                "Clan Loot Spots:",
                "Clan Search Speed:"
            ],
            boostEntryIds:[
                "exp",
                "pvppoints",
                "damagereduction",
                "damage",
                "cashloot",
                "ammoloot",
                "weaponloot",
                "armourloot",
                "lootspot",
                "searchspeed"
            ],
            boost:[
                "EXP Gain:",
                "EXP Multiplier:",
                "PVP Points:",
                "IDR:",
                "Damage:",
                "Speed:",
                "Cash Loot:",
                "Ammo Loot:",
                "Weapon Chance:",
                "Armour Chance:",
                "Misc Chance",
                "Loot Spots:",
                "Search Speed:",
                "Overall Loot Chance:",
                "Attack Speed Boost:"
            ],
            boostIds:[
                "exp",
                "expmultiplier",
                "pvppoints",
                "damagereduction",
                "damage",
                "speed",
                "cashloot",
                "ammoloot",
                "weaponloot",
                "armourloot",
                "miscloot",
                "lootspot",
                "searchspeed",
                "findchancegeneral",
                "dexterity"
            ],
            boostTitles:[
                "Total bonus to experience gain from drugs, implants, masteries and clan. GM and profession are not included, but are included in the total multiplier.",
                "Total experience multiplier from all sources.",
                "Total bonus to PVP point gain from all sources.",
                "Total bonus to Incoming Damage Reduction from all sources.",
                "Total bonus to damage dealt from all sources excluding weapon masteries, these are factored into the per-weapon damage bonuses.",
                "Total bonus to movement speed from all sources.",
                "Total bonus to cash loot amount from all sources.",
                "Total bonus to ammo loot amount from all sources.",
                "Total bonus to weapon loot chance from all sources.",
                "Total bonus to armour loot chance from all sources.",
                "Total bonus to miscellaneous loot chance from all sources.",
                "Total bonus to loot spots amount from all sources.",
                "Total bonus to search speed from all sources.",
                "Total bonus to the chance of finding an item, instead of a spot being empty, from all sources.",
                "Total bonus to attack speed from all sources."
            ]
        };
        //#endregion
        let mainSelect = document.body;
        let cluster = document.createElement("div");
        cluster.setAttribute('style', 'display:grid; row-gap:5px; position:fixed; top:2px; right:2px; z-index:20');
        //#region Damage Calculator
        let container = document.createElement("div");
        container.setAttribute('style', 'height:max-content; width:max-content; min-width:41px; justify-self:end; padding:5px; border:2px solid rgb(100,0,0); background-color:rgba(0,0,0,0.5); backdrop-filter:blur(5px)');
        let button = document.createElement("button");
        button.id = "damageOpen";
        button.textContent = "Damage";
        button.setAttribute('style', 'height:max-content');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        container.appendChild(button);
        let subContainer = document.createElement("div");
        subContainer.id = "damageDisplay";
        subContainer.setAttribute('style', 'display:none; row-gap:10px');
        let category = document.createElement("div");
        category.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
        let content = document.createElement("p");
        content.textContent = "Use Boosts:";
        content.setAttribute('style', 'margin:0');
        category.appendChild(content);
        let input = document.createElement("input");
        input.id = "damageBoostCheck";
        input.type = "checkbox";
        input.checked = true;
        input.setAttribute('style', 'margin:0; justify-self:end');
        input.addEventListener("click", function()
        {
            inputHandler(this);
        });
        category.appendChild(input);
        subContainer.appendChild(category);
        for(let i = 1; i < 4; i++)
        {
            category = document.createElement("div");
            category.id = `damageCategory${i}`;
            category.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
            content = document.createElement("p");
            content.textContent = `Weapon ${i}`;
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
            category.appendChild(content);
            content = document.createElement("p");
            content.id = "noWeapon";
            content.textContent = `No Weapon Equipped`;
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
            category.appendChild(content);
            content = document.createElement("p");
            content.id = `displayname`;
            content.textContent = `none`;
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center; font-size:8px; font-style:italic');
            category.appendChild(content);
            for(let i2 = 0; i2 < descriptors.damage.length; i2++)
            {
                content = document.createElement("p");
                content.textContent = descriptors.damage[i2];
                content.title = descriptors.damageTitles[i2];
                content.setAttribute('style', 'margin:0');
                category.appendChild(content);
                content = document.createElement("p");
                content.id = `display${descriptors.damageIds[i2]}`;
                content.textContent = "none";
                content.setAttribute('style', 'margin:0; justify-self:end');
                category.appendChild(content);
            };
            subContainer.appendChild(category);
        };
        button = document.createElement("button");
        button.id = "damageClose";
        button.textContent = "Close";
        button.setAttribute('style', 'height:max-content; display:block; justify-self:center');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        subContainer.appendChild(button);
        container.appendChild(subContainer);
        //#endregion
        cluster.appendChild(container);
        //#region Experience Calculator
        container = document.createElement("div");
        container.setAttribute('style', 'height:max-content; width:max-content; min-width:41px; justify-self:end; padding:5px; border:2px solid rgb(100,0,0); background-color:rgba(0,0,0,0.5); backdrop-filter:blur(5px)');
        button = document.createElement("button");
        button.id = "experienceOpen";
        button.textContent = "EXP";
        button.setAttribute('style', 'height:max-content');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        container.appendChild(button);
        subContainer = document.createElement("div");
        subContainer.id = "experienceDisplay";
        subContainer.setAttribute('style', 'display:none; row-gap:10px');
        category = document.createElement("div");
        category.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
        content = document.createElement("p");
        content.textContent = "Use Boosts:";
        content.setAttribute('style', 'margin:0');
        category.appendChild(content);
        input = document.createElement("input");
        input.id = "expBoostCheck";
        input.type = "checkbox";
        input.checked = true;
        input.setAttribute('style', 'margin:0; justify-self:end');
        input.addEventListener("click", function()
        {
            inputHandler(this);
        });
        category.appendChild(input);
        subContainer.appendChild(category);
        for(let i = 1; i < 4; i++)
        {
            category = document.createElement("div");
            category.id = `experienceCategory${i}`;
            category.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
            content = document.createElement("p");
            content.textContent = `Weapon ${i}`;
            content.title = "Values are ballpark and should not be taken as gospel; they are to give you an idea of what kind of Exp/h you may receive assuming perfect efficiency.";
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
            category.appendChild(content);
            content = document.createElement("p");
            content.id = "noWeapon";
            content.textContent = `No Weapon Equipped`;
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
            category.appendChild(content);
            content = document.createElement("p");
            content.id = "displayname";
            content.textContent = `none`;
            content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center; font-size:8px; font-style:italic');
            category.appendChild(content);
            for(let i2 = 0; i2 < descriptors.experience.length; i2++)
            {
                content = document.createElement("p");
                content.textContent = descriptors.experience[i2];
                content.title = descriptors.experienceTitles[i2];
                content.setAttribute('style', 'margin:0');
                category.appendChild(content);
                content = document.createElement("p");
                content.id = `display${descriptors.experienceIds[i2]}`;
                content.textContent = "none";
                content.setAttribute('style', 'margin:0; justify-self:end');
                category.appendChild(content);
            };
            subContainer.appendChild(category);
        };
        button = document.createElement("button");
        button.id = "experienceClose";
        button.textContent = "Close";
        button.setAttribute('style', 'height:max-content; display:block; justify-self:center');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        subContainer.appendChild(button);
        container.appendChild(subContainer);
        //#endregion
        cluster.appendChild(container);
        //#region Boost Calculator
        container = document.createElement("div");
        container.setAttribute('style', 'height:max-content; width:max-content; min-width:41px; justify-self:end; padding:5px; border:2px solid rgb(100,0,0); background-color:rgba(0,0,0,0.5); backdrop-filter:blur(5px)');
        button = document.createElement("button");
        button.id = "boostsOpen";
        button.textContent = "Boosts";
        button.setAttribute('style', 'height:max-content');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        container.appendChild(button);
        subContainer = document.createElement("div");
        subContainer.id = "boostsDisplay";
        subContainer.setAttribute('style', 'display:none; row-gap:5px');
        category = document.createElement("div");
        category.setAttribute('style', 'display:grid; grid-template-columns:max-content auto; column-gap:5px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
        for(let i = 0; i < descriptors.boostEntry.length; i++)
        {
            content = document.createElement("p");
            content.textContent = descriptors.boostEntry[i];
            content.setAttribute('style', 'margin:0');
            category.appendChild(content);
            input = document.createElement("input");
            input.id = `clan${descriptors.boostEntryIds[i]}`;
            input.type = "number";
            input.value = character.boosts.clan[descriptors.boostEntryIds[i]];
            input.min = 0;
            if(i === 4 || i === 5)
            {
                input.max = 50;
                input.placeholder = "1 - 50";
            } else if(i === 6 || i === 7)
            {
                input.max = 30;
                input.placeholder = "1 - 30";
            } else if(i === 9)
            {
                input.max = 15;
                input.placeholder = "1 - 15";
            } else
            {
                input.max = 10;
                input.placeholder = "1 - 10";
            };
            input.addEventListener("change", function()
            {
                inputHandler(this);
            });
            category.appendChild(input);
        };
        subContainer.appendChild(category);
        for(let i = 1; i < 5; i++)
        {
            category = document.createElement("div");
            category.id = `boostCategory${i}`;
            category.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:5px; padding:5px; background:rgba(50,50,50,0.5)');
            if(i < 4)
            {
                content = document.createElement("p");
                content.textContent = `Weapon ${i}`;
                content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
                category.appendChild(content);
                content = document.createElement("p");
                content.id = "noWeapon";
                content.textContent = `No Weapon Equipped`;
                content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center');
                category.appendChild(content);
                content = document.createElement("p");
                content.id = "display";
                content.textContent = `none`;
                content.setAttribute('style', 'grid-column:1/span 2; margin:0; justify-self:center; font-size:8px; font-style:italic');
                category.appendChild(content);
                content = document.createElement("p");
                content.textContent = "Damage Boost:";
                content.title = "Total damage boost from all sources including weapon-specific mastery bonus.";
                content.style.margin = "0";
                category.appendChild(content);
                content = document.createElement("p");
                content.id = "display";
                content.textContent = "none";
                content.setAttribute('style', 'margin:0; justify-self:end');
                category.appendChild(content);
            } else
            {
                for(let i2 = 0; i2 < descriptors.boost.length; i2++)
                {
                    content = document.createElement("p");
                    content.textContent = descriptors.boost[i2];
                    content.title = descriptors.boostTitles[i2];
                    content.setAttribute('style', 'margin:0; font-size:11px');
                    category.appendChild(content);
                    content = document.createElement("p");
                    content.id = `${descriptors.boostIds[i2]}Display`;
                    content.textContent = "none";
                    content.setAttribute('style', 'margin:0; justify-self:end; font-size:11px');
                    category.appendChild(content);
                };
            };
            subContainer.appendChild(category);
        };

        button = document.createElement("button");
        button.id = "boostsClose";
        button.textContent = "Close";
        button.setAttribute('style', 'height:max-content; display:block; justify-self:center');
        button.addEventListener("click", function()
        {
            inputHandler(this);
        });
        subContainer.appendChild(button);
        container.appendChild(subContainer);
        //#endregion
        cluster.appendChild(container);
        mainSelect.appendChild(cluster);
    };
//#endregion

//#region Aggregation
    function aggregationHandler()
    {
        implantAggregation();
        debug ? console.log('Implant bonuses: ', character.boosts.implants) : null;
        armourAggregation();
        weaponAggregation();
        debug ? console.log('Character equipment: ', character.equipment) : null;
        professionAggregation();
        debug ? console.log('Character profession: ', character.profession) : null;
    };

    function implantAggregation()
    {
        for(let i = 1; i <= userVars.DFSTATS_df_implantslots; i++)
        {
            let index = i;
            let mimic = false;
            if(userVars[`DFSTATS_df_implant${i}_type`])
            {
                if(i !== 1 && userVars[`DFSTATS_df_implant${i}_type`] === "mimicimplant")
                {
                    index = i - 1;
                    mimic = true;
                };

                debug ? console.log(`Implant ${i} (${userVars[`DFSTATS_df_implant${i}_type`]}): `, itemData[userVars[`DFSTATS_df_implant${i}_type`].split('_')[0]]) : null;

                if(itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]]['implant_stats'])
                {
                    const implantData = itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]];
                    const implantStats = userVars[`DFSTATS_df_implant${index}_type`].split('stats')[1]
                    const allowedStatsToMod = implantData['implant_stats'].split(',');
                    let implantMultipliers = implantData['implant_stats_multi'].split(',');
                    for(let mult in implantMultipliers)
                    {
                        implantMultipliers[mult] = parseFloat(implantMultipliers[mult]);
                    };
                    const maxCombinations = allowedStatsToMod.length;
                    const maxNeededBits = parseInt(implantData['implant_stats_max_stat']).toString(2).length;
                    if(typeof implantStats !== 'undefined')
                    {
                        let tempStats = parseInt(implantStats, 36).toString(2);
                        while(tempStats.length < maxCombinations * maxNeededBits)
                        {
                            tempStats = '0' + tempStats;
                        };
                        for(let i = 0; i < maxCombinations; i++)
                        {
                            const targetBits = tempStats.substring(0, maxNeededBits);
                            
                            debug ? console.log(allowedStatsToMod[i].split("_")[1].split("BoostMod")[0].toLowerCase()) : null;

                            character.boosts.implants[allowedStatsToMod[i].split("_")[1].split("BoostMod")[0].toLowerCase()] += (parseInt(targetBits, 2) * implantMultipliers[i] * 1) / 100;
                            tempStats = tempStats.substring(maxNeededBits);
                        };
                    };
                } else
                {
                    for(let key in itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]])
                    {
                        if(key.includes("BoostMod"))
                        {
                            if(mimic && parseFloat(itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]][key]) < 0)
                            {
                                character.boosts.implants[key.split("_")[1].split("BoostMod")[0].toLowerCase()] += parseFloat(itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]][key]) * 2;
                            } else
                            {
                                character.boosts.implants[key.split("_")[1].split("BoostMod")[0].toLowerCase()] += parseFloat(itemData[userVars[`DFSTATS_df_implant${index}_type`].split('_')[0]][key]);
                            };
                        };
                    };
                };
            };
        };
    };

    function armourAggregation()
    {
        if(userVars['DFSTATS_df_armourtype'])
        {
            character.equipment.armour = itemData[userVars['DFSTATS_df_armourtype'].split('_')[0]];
        } else
        {
            character.equipment.armour = "";
        };
    };

    function weaponAggregation()
    {
        requestArr = [];
        for(let i = 1; i <= 3; i++)
        {
            if(userVars[`DFSTATS_df_weapon${i}type`])
            {
                character.equipment.weapons[i - 1] = itemData[userVars[`DFSTATS_df_weapon${i}type`].split('_')[0]];
                debug ? console.log(character.equipment.weapons[i - 1]) : null;
                if(typeof silverRequestItem === "function" && (character.equipment.weapons[i - 1].ammo_type && character.equipment.weapons[i - 1].ammo_type !== "") && !databank[character.equipment.weapons[i - 1].ammo_type].averagePricePerUnit)
                {
                    requestArr.push(silverRequestItem(databank[character.equipment.weapons[i - 1].ammo_type]));
                };

                if(userVars[`DFSTATS_df_weapon${i}type`].split('stats')[1])
                {
                    character.equipment.weapons[i - 1].bonus = {reload:userVars[`DFSTATS_df_weapon${i}type`].split('stats')[1].split('_')[0][1], critical:userVars[`DFSTATS_df_weapon${i}type`].split('stats')[1].split('_')[0][2]};
                } else
                {
                    character.equipment.weapons[i - 1].bonus = {reload:"0", critical:"0"};
                };

                character.equipment.weapons[i - 1].type === 'grenadelauncher' ? character.equipment.weapons[i - 1].type = 'explosive' : character.equipment.weapons[i - 1].type === 'revolver' || character.equipment.weapons[i - 1].type === 'autopistol' ? character.equipment.weapons[i - 1].type = 'pistol' : null;
            } else
            {
                character.equipment.weapons[i - 1] = "";
            };
        };
    };

    function professionAggregation()
    {
        //#region Locals
            const profession = professionData[userVars.DFSTATS_df_profession.toLowerCase()];
        //#endregion

        //#region Main
            character.profession.expmultiplier += parseInt(profession.expdiff) / 100;
            if(profession.bonus)
            {
                for(let x in profession.bonus)
                {
                    character.profession[x] = parseInt(profession.bonus[x]) / 100;
                };
            };
        //#endregion

        debug ? console.log("Profession Boosts", character.profession) : null;
    };
//#endregion

//#region Math
    function mathHandler()
    {
        statMath();
        boostMath();

        for(let i = 0; i < character.equipment.weapons.length; i++)
        {
            if(character.equipment.weapons[i] !== "")
            {
                character.equipment.weapons[i].damage = damageCalc(character.equipment.weapons[i]);
                character.equipment.weapons[i].experience = experienceCalc(character.equipment.weapons[i]);
                boostCalc(character.equipment.weapons[i]);
            };
        };
        debug ? console.log("Equipment", character.equipment) : null;
        debug ? console.log("Character Boosts", character.boosts) : null;
    };

    function statMath()
    {
        for(let i = 1; i < 4; i++)
        {
            if(character.equipment.weapons[i - 1])
            {
                for(let x in character.equipment.weapons[i - 1].bonus)
                {
                    character.stats[x] += parseInt(character.equipment.weapons[i - 1].bonus[x]);
                };
            };
        };
        debug ? console.log("Character Stats:", character.stats) : null;
    };

    function boostMath()
    {
        for(let x in character.boosts.totals)
        {
            //#region Locals
                let armourBoost = character.equipment.armour !== "" ? parseFloat(character.equipment.armour.movespeedmod) : 0.05;
                let drugBoost = character.boosts.drugs[x] ? character.boosts.drugs[x] : 0;
                let clanBoost = character.boosts.clan[x] ? (character.boosts.clan[x] / 100) : 0;
                let masteryBoost = masteryData[x] ? masteryData[x] : 0;
                let professionBoost = character.profession[x] ? character.profession[x] : 0;
            //#endregion

            //#region Main
                if(x !== "expmultiplier")
                {
                    if(x === "exp")
                    {
                        character.boosts.totals[x] = drugBoost + character.boosts.implants[x] + clanBoost + masteryBoost + 0.1;
                        character.boosts.titles[x] = `(Drugs (${Math.round(drugBoost * 100) / 100}) + Implants (${Math.round(character.boosts.implants[x] * 100) / 100}) + Clan Bonus (${Math.round(clanBoost * 100) / 100}) + Mastery Bonus (${masteryBoost}) + 2FA (0.1)) * 100`;
                    } else if(x.includes("loot") && states.gmCheck)
                    {
                        if(x === "lootspot")
                        {
                            character.boosts.totals[x] = 0.6 + professionBoost + character.boosts.implants[x] + clanBoost + masteryBoost;
                            character.boosts.titles[x] = `(GM Bonus (0.6) + Profession (${Math.round(professionBoost * 100) / 100}) + Implants (${Math.round(character.boosts.implants[x] * 100) / 100}) + Clan Bonus (${Math.round(clanBoost * 100) / 100}) + Mastery Bonus (${Math.round(masteryBoost * 10000) / 100000})) * 100`;
                        } else
                        {
                            character.boosts.totals[x] = 1 + professionBoost + character.boosts.implants[x] + clanBoost + masteryBoost;
                            character.boosts.titles[x] = `(GM Bonus (1) + Profession (${Math.round(professionBoost * 100) / 100}) + Implants (${Math.round(character.boosts.implants[x] * 100) / 100}) + Clan Bonus (${Math.round(clanBoost * 100) / 100}) + Mastery Bonus (${Math.round(masteryBoost * 10000) / 100000})) * 100`;
                        };
                    } else if(x === "findchancegeneral")
                    {
                        character.boosts.totals[x] = 0.75 + professionBoost + (masteryData[x] * -1);
                        character.boosts.titles[x] = `(Base Chance (0.75) + Profession (${Math.round(professionBoost * 100) / 100}) + Mastery Bonus (${Math.round((masteryData[x] * -1) * 10000) / 10000})) * 100`
                    } else if(x === "speed")
                    {
                        character.boosts.totals[x] = armourBoost + drugBoost + professionBoost + character.boosts.implants[x];
                        character.boosts.titles[x] = `(Armour Bonus (${Math.round(armourBoost * 100) / 100}) + Drugs (${Math.round(drugBoost * 100) / 100}) + Profession (${Math.round(professionBoost * 100) / 100}) + Implants (${Math.round(character.boosts.implants[x] * 100) / 100})) * 100`;
                    } else
                    {
                        character.boosts.titles[x] = `(`;
                        if(character.boosts.drugs.hasOwnProperty(x))
                        {
                            character.boosts.totals[x] += drugBoost;
                            character.boosts.titles[x] += `Drugs (${Math.round(drugBoost * 100) / 100})`;
                            character.profession.hasOwnProperty(x) || character.boosts.implants.hasOwnProperty(x) || character.boosts.clan.hasOwnProperty(x) || masteryData.hasOwnProperty(x) ? character.boosts.titles[x] += ` + ` : null;
                        };
                        if(character.profession.hasOwnProperty(x))
                        {
                            character.boosts.totals[x] += professionBoost;
                            character.boosts.titles[x] += `Profession (${Math.round(professionBoost * 100) / 100})`;
                            character.boosts.implants.hasOwnProperty(x) || character.boosts.clan.hasOwnProperty(x) || masteryData.hasOwnProperty(x) ? character.boosts.titles[x] += ` + ` : null;
                        };
                        if(character.boosts.implants.hasOwnProperty(x))
                        {
                            character.boosts.totals[x] += character.boosts.implants[x];
                            character.boosts.titles[x] += `Implants (${Math.round(character.boosts.implants[x] * 100) / 100})`;
                            character.boosts.clan.hasOwnProperty(x) || masteryData.hasOwnProperty(x) ? character.boosts.titles[x] += ` + ` : null;
                        };
                        if(character.boosts.clan.hasOwnProperty(x))
                        {
                            character.boosts.totals[x] += clanBoost;
                            character.boosts.titles[x] += `Clan Bonus (${Math.round(clanBoost * 100) / 100})`;
                            masteryData.hasOwnProperty(x) ? character.boosts.titles[x] += ` + ` : null;
                        };
                        if(masteryData.hasOwnProperty(x))
                        {
                            character.boosts.totals[x] += masteryBoost;
                            character.boosts.titles[x] += `Mastery Bonus (${Math.round(masteryBoost * 10000) / 10000})`;

                        };
                        character.boosts.titles[x] += `) * 100`;
                    };
                };
            //#endregion
        };
    };
//#endregion

//#region Damage Calculation
    function damageCalc(weaponData)
    {
        //#region Locals
            let mathResultsObj = {};
            let resultsObj = {};
        //#endregion

        //#region Conversion Arrays
            const typeMatch = //Matches the raw "type" parameter for sorting
            [
                "sword",
                "knife",
                "axe",
                "bat",
                "crowbar"
            ];
        //#endregion

        //#region Initial
            if(typeMatch.includes(weaponData.type)) //Adjusts some weapon "type" parameters for the following step
            {
                weaponData.type = "melee";
            } else if(weaponData.type === "bigmachinegun" || weaponData.type === "minigun")
            {
                weaponData.type = "machinegun";
            };
        //#endregion

        //#region Math

            //#region Base Values
                mathResultsObj.shotTime = boostCheck[0] ? ((parseFloat(weaponData.shot_time) + 2) * (1 - ((character.stats.dexterity * 0.0015) + character.boosts.totals.dexterity))) : (parseFloat(weaponData.shot_time) + 2);
                mathResultsObj.shotsFired = weaponData.type === "melee" || weaponData.type === "chainsaw" ? 1 : parseFloat(weaponData.shots_fired);
                mathResultsObj.cleave = weaponData.unique_parameters && weaponData.unique_parameters.MeleeHitCountAmount ? (parseInt(weaponData.unique_parameters.MeleeHitCountAmount) - 1) : 2;
                mathResultsObj.maximumHitCount = weaponData.unique_parameters && weaponData.unique_parameters.maximumHitCount ? parseInt(weaponData.unique_parameters.maximumHitCount) : 'none';
                mathResultsObj.penetrationSplit = weaponData.unique_parameters && weaponData.unique_parameters.splitSequence ? weaponData.unique_parameters.splitSequence.split(':') : 'none';
                mathResultsObj.burstAmount = weaponData.selective_fire_amount ? parseInt(weaponData.selective_fire_amount) : "none";
                mathResultsObj.selectiveFireSplit = weaponData.selective_fire_split ? weaponData.selective_fire_split.split(";") : "none";
            //#endregion

            //#region Critical Values
                mathResultsObj.baseCrit = (5 + Math.round((character.stats.critical - 25) / 2.5)) * parseFloat(weaponData.critical) > 80 ? 80 : (5 + Math.round((character.stats.critical - 25) / 2.5)) * parseFloat(weaponData.critical);
                mathResultsObj.divisor = (function()
                {
                    if(mathResultsObj.baseCrit < 5)
                    {
                        return 1;
                    } else if(mathResultsObj.baseCrit < 9)
                    {
                        return 2;
                    } else if(mathResultsObj.baseCrit < 19)
                    {
                        return 5;
                    } else if(mathResultsObj.baseCrit < 79)
                    {
                        return 10;
                    } else if(mathResultsObj.baseCrit >= 80)
                    {
                        return 20;
                    };
                })();
                mathResultsObj.critFail = Math.ceil((100 - mathResultsObj.baseCrit) / mathResultsObj.divisor);
                mathResultsObj.critSuccess = Math.floor(mathResultsObj.baseCrit / mathResultsObj.divisor);
            //#endregion

            //#region Reload Values
                mathResultsObj.reloadFrame = 15 + (((124 - character.stats.reload) * parseFloat(weaponData.reload_time)) / 100);
                mathResultsObj.reloadTime = mathResultsObj.reloadFrame / 60;
                mathResultsObj.magTime = (parseFloat(weaponData.bullet_capacity) * mathResultsObj.shotTime) / 60;
            //#endregion

            //#region Damage Values
                mathResultsObj.dph = boostCheck[0] ? (parseFloat(weaponData.calliber_type) + 1) * mathResultsObj.shotsFired * (1 + (character.boosts.totals.damage + character.profession[weaponData.type] + masteryData[weaponData.type])) : (parseFloat(weaponData.calliber_type) + 1) * mathResultsObj.shotsFired;
                mathResultsObj.pelletDph = boostCheck[0] ? Math.round((((parseFloat(weaponData.calliber_type) + 1) * (1 + (character.boosts.totals.damage + character.profession[weaponData.type] + masteryData[weaponData.type]))) + Number.EPSILON) * 100) / 100 : Math.round((((parseFloat(weaponData.calliber_type) + 1)) + Number.EPSILON) * 100) / 100;
                mathResultsObj.cleaveDph = (mathResultsObj.dph * 0.125) * mathResultsObj.cleave;
                mathResultsObj.critDph = mathResultsObj.dph * 5;
                mathResultsObj.cleaveCritDph = (mathResultsObj.cleaveDph * 5);
                mathResultsObj.dps = mathResultsObj.dph * (60 / mathResultsObj.shotTime);
                mathResultsObj.cleaveDps = (mathResultsObj.dph + mathResultsObj.cleaveDph) * (60 / mathResultsObj.shotTime);
                mathResultsObj.explosiveDps = mathResultsObj.critDph * (60 / mathResultsObj.shotTime);
                mathResultsObj.dpsWithReload = Math.round(((mathResultsObj.dps * (mathResultsObj.magTime / (mathResultsObj.magTime + mathResultsObj.reloadTime))) + Number.EPSILON) * 100) / 100;
                mathResultsObj.critDps = mathResultsObj.dps * ((mathResultsObj.critFail + (mathResultsObj.critSuccess * 5)) / (mathResultsObj.critFail + mathResultsObj.critSuccess));
                mathResultsObj.cleaveCritDps = Math.round((mathResultsObj.cleaveDps * ((mathResultsObj.critFail + (mathResultsObj.critSuccess * 5)) / (mathResultsObj.critFail + mathResultsObj.critSuccess)) + Number.EPSILON) * 100) / 100;
                mathResultsObj.critDpsReload = Math.round(((mathResultsObj.critDps * (mathResultsObj.magTime / (mathResultsObj.magTime + mathResultsObj.reloadTime))) + Number.EPSILON) * 100) / 100;
                mathResultsObj.explosiveDpsReload = Math.round(((mathResultsObj.explosiveDps * (mathResultsObj.magTime / (mathResultsObj.magTime + mathResultsObj.reloadTime))) + Number.EPSILON) * 100) / 100;
            //#endregion

            //#region Miscellaneous Values
                mathResultsObj.attacksPerSecond = mathResultsObj.selectiveFireSplit !== "none" ? Math.round(((60 / mathResultsObj.shotTime) * mathResultsObj.selectiveFireSplit.length) * 1000) / 1000 : Math.round((60 / mathResultsObj.shotTime) * 1000) / 1000;
                mathResultsObj.ammoPerMinute = mathResultsObj.selectiveFireSplit !== "none" ? Math.round(((60 / mathResultsObj.shotTime) * mathResultsObj.selectiveFireSplit.length) * (mathResultsObj.magTime / (mathResultsObj.magTime + mathResultsObj.reloadTime)) * 60) : Math.round((60 / mathResultsObj.shotTime) * (mathResultsObj.magTime / (mathResultsObj.magTime + mathResultsObj.reloadTime)) * 60);
            //#endregion

        //#endregion

        //#region Display

            //#region Weapon Name
                resultsObj.name = `(${weaponData.name})`;
            //#endregion

            //#region Shared Values
                resultsObj.dph = Math.round((mathResultsObj.dph + Number.EPSILON) * 100) / 100;
                resultsObj.dphCrit = parseFloat(weaponData.critical) === 0 ? "none" : Math.round((mathResultsObj.critDph + Number.EPSILON) * 100) / 100;
                if(mathResultsObj.selectiveFireSplit !== "none")
                {
                    resultsObj.dph = `${(Math.round((mathResultsObj.dph + Number.EPSILON) * 100) / 100)} (`
                    resultsObj.dphCrit = `${(Math.round((mathResultsObj.critDph + Number.EPSILON) * 100) / 100)} (`
                    for(let i = 0; i < mathResultsObj.burstAmount; i++)
                    {
                        resultsObj.dph += (Math.round(((mathResultsObj.dph * mathResultsObj.selectiveFireSplit[i]) + Number.EPSILON) * 100) / 100);
                        resultsObj.dphCrit += (Math.round(((mathResultsObj.critDph * mathResultsObj.selectiveFireSplit[i]) + Number.EPSILON) * 100) / 100);
                        resultsObj.dph += i === (mathResultsObj.selectiveFireSplit.length - 1) ? `)` : ` + `;
                        resultsObj.dphCrit += i === (mathResultsObj.selectiveFireSplit.length - 1) ? `)` : ` + `;
                    };
                } else if(mathResultsObj.maximumHitCount !== 'none')
                {
                    resultsObj.dph = parseInt(weaponData.flamethrower) === 1 ? `${(Math.round(((mathResultsObj.dph * mathResultsObj.maximumHitCount) + Number.EPSILON) * 100) / 100)} (` : `${(Math.round((mathResultsObj.dph + Number.EPSILON) * 100) / 100)} (`
                    resultsObj.dphCrit = parseFloat(weaponData.critical) === 0 ? "none" : `${(Math.round((mathResultsObj.critDph + Number.EPSILON) * 100) / 100)} (`
                    for(let i = 0; i < mathResultsObj.penetrationSplit.length; i++)
                    {
                        resultsObj.dph += (Math.round(((mathResultsObj.dph * mathResultsObj.penetrationSplit[i]) + Number.EPSILON) * 100) / 100);
                        parseFloat(weaponData.critical) === 0 ? null : resultsObj.dphCrit += (Math.round(((mathResultsObj.critDph * mathResultsObj.penetrationSplit[i]) + Number.EPSILON) * 100) / 100);
                        resultsObj.dph += i === (mathResultsObj.penetrationSplit.length - 1) ? `)` : ` + `;
                        parseFloat(weaponData.critical) === 0 ? null : resultsObj.dphCrit += i === (mathResultsObj.penetrationSplit.length - 1) ? `)` : ` + `;
                    };
                } else if(parseFloat(mathResultsObj.shotsFired) !== 1)
                {
                    resultsObj.dph = `${Math.round((mathResultsObj.dph + Number.EPSILON) * 100) / 100} (${mathResultsObj.pelletDph} x ${mathResultsObj.shotsFired})`;
                    if(parseFloat(weaponData.critical) !== 0)
                    {
                        resultsObj.dphCrit = `${Math.round((mathResultsObj.critDph + Number.EPSILON) * 100) / 100} (${Math.round(((mathResultsObj.pelletDph * 5) + Number.EPSILON) * 100) / 100} x ${mathResultsObj.shotsFired})`;
                    };
                };

                if(weaponData.type === "melee" || weaponData.type === "chainsaw")
                {
                    resultsObj.dps = `${(Math.round((mathResultsObj.dps + Number.EPSILON) * 100) / 100)} (${(Math.round((mathResultsObj.critDps + Number.EPSILON) * 100) / 100)})`;
                } else if(parseInt(weaponData.flamethrower) === 1)
                {
                    resultsObj.dps = mathResultsObj.explosiveDpsReload;
                } else if(parseFloat(weaponData.critical) === 0)
                {
                    resultsObj.dps = mathResultsObj.dpsWithReload;
                } else
                {
                    resultsObj.dps = `${mathResultsObj.dpsWithReload} (${mathResultsObj.critDpsReload})`;
                };
            //#endregion

            //#region Type Specific Values
                if(weaponData.type === "melee" || weaponData.type === "chainsaw")
                {
                    if(mathResultsObj.cleave !== 0)
                    {
                        resultsObj.dphCleave = `${(Math.round(((mathResultsObj.dph + mathResultsObj.cleaveDph) + Number.EPSILON) * 100) / 100)} (${Math.round((mathResultsObj.dph + Number.EPSILON) * 100) / 100} + `;
                        resultsObj.dphCleaveCrit = `${(Math.round(((mathResultsObj.critDph + mathResultsObj.cleaveCritDph) + Number.EPSILON) * 100) / 100)} (${Math.round((mathResultsObj.critDph + Number.EPSILON) * 100) / 100} + `;
                        for(let i = 1; i <= mathResultsObj.cleave; i++)
                        {
                            resultsObj.dphCleave += (Math.round(((mathResultsObj.dph * 0.125) + Number.EPSILON) * 100) / 100);
                            resultsObj.dphCleaveCrit += (Math.round(((mathResultsObj.critDph * 0.125) + Number.EPSILON) * 100) / 100);
                            resultsObj.dphCleave += i === mathResultsObj.cleave ? `)` : ` + `;
                            resultsObj.dphCleaveCrit += i === mathResultsObj.cleave ? `)` : ` + `;
                        };
                        resultsObj.dpsCleave = `${(Math.round((mathResultsObj.cleaveDps + Number.EPSILON) * 100) / 100)} (${(Math.round((mathResultsObj.cleaveCritDps + Number.EPSILON) * 100) / 100)})`;
                    } else
                    {
                        resultsObj.dphCleave = "none";
                        resultsObj.dphCleaveCrit = "none";
                        resultsObj.dpsCleave = "none";
                    };
                } else
                {
                    resultsObj.dphCleave = "none";
                    resultsObj.dphCleaveCrit = "none";
                    resultsObj.dpsCleave = "none";
                };

                resultsObj.dphExplosive = weaponData.type === "explosive" && parseInt(weaponData.flamethrower) !== 1 ? mathResultsObj.critDph : "none";
                resultsObj.dpsExplosive = weaponData.type === "explosive" && parseInt(weaponData.flamethrower) !== 1  ? mathResultsObj.explosiveDpsReload : "none";
            //#endregion

            //#region Miscellaneous Values
                resultsObj.critPattern = mathResultsObj.critSuccess ? `${mathResultsObj.critFail} > ${mathResultsObj.critSuccess}` : "none";
                resultsObj.attackSpeed = mathResultsObj.attacksPerSecond;
                if(character.stats.dexterity === 0 && character.boosts.totals.dexterity === 0)
                {
                    resultsObj.attackSpeedBoost = "none";
                } else
                {
                    resultsObj.attackSpeedBoost = boostCheck[0] ? mathResultsObj.selectiveFireSplit !== "none" ? `${Math.round(((1 + ((character.stats.dexterity * 0.0015) + character.boosts.totals.dexterity)) + Number.EPSILON) * 100) / 100}x (+${Math.round((mathResultsObj.attacksPerSecond - ((60 / (parseFloat(weaponData.shot_time) + 2)) * mathResultsObj.selectiveFireSplit.length) + Number.EPSILON) * 1000) / 1000} Attacks/s)` : `${Math.round(((1 + ((character.stats.dexterity * 0.0015) + character.boosts.totals.dexterity)) + Number.EPSILON) * 100) / 100}x (+${Math.round((mathResultsObj.attacksPerSecond - (60 / (parseFloat(weaponData.shot_time) + 2)) + Number.EPSILON) * 1000) / 1000} Attacks/s)` : "none";
                };
                if(weaponData.type === "melee" || weaponData.type == "chainsaw")
                {
                    resultsObj.ammoUse = "none";
                } else if(typeof silverRequestItem === "function")
                {
                    if(weaponData.ammo_type !== "" && (!weaponData.no_ammo || weaponData.no_ammo === "0"))
                    {
                        resultsObj.ammoUse = `${mathResultsObj.ammoPerMinute.toLocaleString("en-GB")} ($${Math.round(databank[weaponData.ammo_type].averagePricePerUnit * mathResultsObj.ammoPerMinute).toLocaleString("en-GB")}/m, $${Math.round((databank[weaponData.ammo_type].averagePricePerUnit * mathResultsObj.ammoPerMinute) * 60).toLocaleString("en-GB")}/h)`;
                    } else
                    {
                        resultsObj.ammoUse = `${mathResultsObj.ammoPerMinute.toLocaleString("en-GB")} (Unlimited Ammo)`;
                    };
                } else
                {
                    resultsObj.ammoUse = mathResultsObj.ammoPerMinute.toLocaleString();
                };
            //#endregion

        //#endregion

        return {raw:mathResultsObj, display:resultsObj};
    };
//#endregion

//#region Experience Calculation
    function experienceCalc(weaponData)
    {
        //#region Constants
            const hungerModifier = 1.5;
            const gmModifier = states.gmCheck ? 1.75 : 0.75;
            const masteryExpBonus = masteryData["expgain"];
            const zoneAverageDensity = [1.5, 1.875, 1.95];
            const zoneAverageHealth = [100000, 565.91, 250000];
        //#endregion

        //#region Locals
            let mathResultsObj = [{}, {}, {}];
            let resultsObj = {};
        //#endregion

        //#region Math
            //#region Base Values
                let modifiedDensity = [];
                for(let i = 0; i < zoneAverageDensity.length; i++)
                {
                    modifiedDensity[i] = boostCheck[1] ? zoneAverageDensity[i] * character.profession.expmultiplier * hungerModifier * gmModifier * (1 + character.boosts.totals.exp) : zoneAverageDensity[i] * character.profession.expmultiplier * hungerModifier * gmModifier;
                };
            //#endregion

            //#region Experience Values
                for(let i = 0; i < zoneAverageHealth.length; i++)
                {
                    mathResultsObj[i].eph = weaponData.damage.raw.dph > zoneAverageHealth[i] ? zoneAverageHealth[i] * modifiedDensity[i] : weaponData.damage.raw.dph * modifiedDensity[i];
                    mathResultsObj[i].ephCleave = (mathResultsObj[i].eph * 0.125) * weaponData.damage.raw.cleave;
                    mathResultsObj[i].ephCrit = weaponData.damage.raw.critDph > zoneAverageHealth[i] ? zoneAverageHealth[i] * modifiedDensity[i] : weaponData.damage.raw.critDph * modifiedDensity[i];
                    mathResultsObj[i].ephCleaveCrit = mathResultsObj[i].ephCleave * 5;
                    mathResultsObj[i].eps = mathResultsObj[i].eph * (60 / weaponData.damage.raw.shotTime);
                    mathResultsObj[i].epsCleave = (mathResultsObj[i].eph + mathResultsObj[i].ephCleave) * (60 / weaponData.damage.raw.shotTime);
                    mathResultsObj[i].epsExplosive = mathResultsObj[i].ephCrit * (60 / weaponData.damage.raw.shotTime);
                    mathResultsObj[i].epsReload = mathResultsObj[i].eps * (weaponData.damage.raw.magTime / (weaponData.damage.raw.magTime + weaponData.damage.raw.reloadTime));
                    mathResultsObj[i].epsCrit = mathResultsObj[i].eps * ((weaponData.damage.raw.critFail + (weaponData.damage.raw.critSuccess * 5)) / (weaponData.damage.raw.critFail + weaponData.damage.raw.critSuccess));
                    mathResultsObj[i].epsCleaveCrit = mathResultsObj[i].epsCleave * (weaponData.damage.raw.critFail + (weaponData.damage.raw.critSuccess * 5)) / (weaponData.damage.raw.critFail + weaponData.damage.raw.critSuccess);
                    mathResultsObj[i].epsCritReload = mathResultsObj[i].epsCrit * (weaponData.damage.raw.magTime / (weaponData.damage.raw.magTime + weaponData.damage.raw.reloadTime));
                    mathResultsObj[i].epsExplosiveReload = mathResultsObj[i].epsExplosive * (weaponData.damage.raw.magTime / (weaponData.damage.raw.magTime + weaponData.damage.raw.reloadTime));
                };
            //#endregion
        //#endregion

        //#region Display
            //#region Name
                resultsObj.name = weaponData.name;
            //#endregion
            //#region Zone Values
                if(weaponData.type === "melee" || weaponData.type === "chainsaw")
                {
                    resultsObj.zone1 = Math.round(((mathResultsObj[0].epsCrit * 3600) + Number.EPSILON) * 100) / 100; //Charred Titan
                    resultsObj.zone2 = Math.round(((mathResultsObj[1].epsCleaveCrit * 3600) + Number.EPSILON) * 100) / 100; //Wastelands
                    resultsObj.zone3 = Math.round(((mathResultsObj[2].epsCrit * 3600) + Number.EPSILON) * 100) / 100; //Devil Hound
                } else if(weaponData.type === "grenadelauncher")
                {
                    resultsObj.zone1 = Math.round(((mathResultsObj[0].epsReload * 3600) + Number.EPSILON) * 100) / 100; //Charred Titan
                    resultsObj.zone2 = Math.round(((mathResultsObj[1].epsExplosiveReload * 3600) + Number.EPSILON) * 100) / 100; //Wastelands
                    resultsObj.zone3 = Math.round(((mathResultsObj[2].epsReload * 3600) + Number.EPSILON) * 100) / 100; //Devil Hound
                } else
                {
                    if(parseFloat(weaponData.critical) === 0)
                    {
                        resultsObj.zone1 = Math.round(((mathResultsObj[0].epsReload * 3600) + Number.EPSILON) * 100) / 100; //Charred Titan
                        resultsObj.zone2 = Math.round(((mathResultsObj[1].epsReload * 3600) + Number.EPSILON) * 100) / 100; //Wastelands
                        resultsObj.zone3 = Math.round(((mathResultsObj[2].epsReload * 3600) + Number.EPSILON) * 100) / 100; //Devil Hound
                    } else
                    {
                        resultsObj.zone1 = Math.round(((mathResultsObj[0].epsCritReload * 3600) + Number.EPSILON) * 100) / 100;//Charred Titan
                        resultsObj.zone2 = Math.round(((mathResultsObj[1].epsCritReload * 3600) + Number.EPSILON) * 100) / 100;//Wastelands
                        resultsObj.zone3 = Math.round(((mathResultsObj[2].epsCritReload * 3600) + Number.EPSILON) * 100) / 100; //Devil Hound
                    };
                };
            //#endregion
        //#endregion

        return {raw:mathResultsObj, display:resultsObj};
    };
//#endregion

//#region Boost Calculation
    function boostCalc(weaponData)
    {
        weaponData.boost = character.boosts.totals.damage + masteryData[weaponData.type] + character.profession[weaponData.type];
        weaponData.boostName = `(${weaponData.name})`;
        weaponData.boostTitle = `(Base Boost (${Math.round(character.boosts.totals.damage * 100) / 100}) + Specific Mastery Bonus (${Math.round(masteryData[weaponData.type] * 10000) / 10000}) + Profession Bonus (${Math.round(character.profession[weaponData.type] * 100) / 100})) * 100`;
        character.boosts.totals.expmultiplier = character.profession.expmultiplier * 1.5 * (states.gmCheck ? 1.75 : 0.75) * (1 + character.boosts.totals.exp);
        character.boosts.titles.expmultiplier = `Profession Modifier (${character.profession.expmultiplier}) * Hunger Modifier (1.5) * GM Modifier (${states.gmCheck ? 1.75 : 0.75}) * (1 + Base Experience Bonus (${Math.round(character.boosts.totals.exp * 100) / 100}))`;
    };
//#endregion

//#region Display
    function displayHandler()
    {
        for(let i = 0; i < character.equipment.weapons.length; i++)
        {
            damageDisplay(character.equipment.weapons[i], i);
            experienceDisplay(character.equipment.weapons[i], i);
        };
        boostDisplay();
    };

    function damageDisplay(weaponData, index)
    {
        const damageCategory = document.querySelectorAll("[id^='damageCategory']")[index];
        const displayColl = damageCategory.querySelectorAll("[id^='display']");
        if(weaponData)
        {
            for(let i = 0; i < displayColl.length; i++)
            {
                const id = displayColl[i].id.split("display")[1];
                if(weaponData.damage.display[id] === "none")
                {
                    displayColl[i].previousElementSibling.style.display = "none";
                    displayColl[i].style.display = "none";
                } else
                {
                    displayColl[i].previousElementSibling.style.display = "block";
                    displayColl[i].style.display = "block";
                    displayColl[i].textContent = weaponData.damage.display[id];
                };
            };
            damageCategory.querySelector("[id=noWeapon]").style.display = "none";
        } else
        {
            for(let i = 0; i < displayColl.length; i++)
            {
                displayColl[i].previousElementSibling.style.display = "none";
                displayColl[i].style.display = "none";
            };
            damageCategory.querySelector("[id=noWeapon]").style.display = "block";
        };
    };

    function experienceDisplay(weaponData, index)
    {
        const experienceCategory = document.querySelectorAll("[id^='experienceCategory']")[index];
        const displayColl = experienceCategory.querySelectorAll("[id^='display']");
            if(weaponData)
            {
                for(let i = 0; i < displayColl.length; i++)
                {
                    const id = displayColl[i].id.split("display")[1];
                    displayColl[i].previousElementSibling.style.display = "block";
                    displayColl[i].style.display = "block";
                    displayColl[i].textContent = i > 0 ? `${weaponData.experience.display[id].toLocaleString()} Exp/h` : weaponData.experience.display.name;
                };
                experienceCategory.querySelector("[id=noWeapon]").style.display = "none";
            } else
            {
                for(let i = 0; i < displayColl.length; i++)
                {
                    displayColl[i].previousElementSibling.style.display = "none";
                    displayColl[i].style.display = "none";
                };
                experienceCategory.querySelector("[id=noWeapon]").style.display = "block";
            };
    };

    function boostDisplay()
    {
        const boostCategories = document.querySelectorAll("[id^='boostCategory");
        for(let i = 0; i < boostCategories.length; i++)
        {
            const displayColl = boostCategories[i].querySelectorAll("p[id*='Display'], p[id*='display']");
            if(i < 3)
            {
                const weaponData = character.equipment.weapons[i];
                if(character.equipment.weapons[i])
                {
                    for(let i2 = 0; i2 < displayColl.length; i2++)
                    {
                        if(i2 < 1)
                        {
                            displayColl[i2].textContent = weaponData.boostName;
                        } else
                        {
                            if(weaponData.boost === 0)
                            {
                                displayColl[i2].textContent = "None";
                            } else
                            {
                                displayColl[i2].textContent = `+${Math.round((weaponData.boost * 100) * 100) / 100}%`;
                                displayColl[i2].title = weaponData.boostTitle;
                            };
                        };
                        displayColl[i2].previousElementSibling.style.display = "block";
                        displayColl[i2].style.display = "block";
                    };
                    boostCategories[i].querySelector("[id=noWeapon]").style.display = "none";
                } else
                {
                    for(let i2 = 0; i2 < displayColl.length; i2++)
                    {
                        displayColl[i2].previousElementSibling.style.display = "none";
                        displayColl[i2].style.display = "none";
                    };
                    boostCategories[i].querySelector("[id=noWeapon]").style.display = "block";
                };
            } else
            {
                for(let i2 = 0; i2 < displayColl.length; i2++)
                {
                    const id = displayColl[i2].id.split("Display")[0];
                    if(id === "expmultiplier")
                    {
                        displayColl[i2].textContent = `${Math.round(character.boosts.totals[id] * 100) / 100}x`;
                    } else if(id === "damagereduction")
                    {
                        if(Math.sign(character.boosts.totals[id]) >= 0)
                        {
                            displayColl[i2].textContent = `${Math.round(((Math.abs(character.boosts.totals[id]) * -1) * 100) * 100) / 100}%`;
                        } else
                        {
                            displayColl[i2].textContent = `${Math.round((Math.abs(character.boosts.totals[id]) * 100) * 100) / 100}%`;
                        };
                    } else
                    {
                        displayColl[i2].textContent = `${Math.round((character.boosts.totals[id] * 100) * 100) / 100}%`;
                    };
                    displayColl[i2].title = character.boosts.titles[id];
                };
            };
        };
    };
//#endregion

//#region Startup
    function initialiseValues()
    {
        states = {serverTime:parseInt(userVars.DFSTATS_df_servertime) + 1200000000, gmCheck:parseInt(userVars.DFSTATS_df_goldmember)};
        character = {
            stats:{dexterity:parseInt(userVars.DFSTATS_df_dexterity), critical:parseInt(userVars.DFSTATS_df_criticalhit), reload:parseInt(userVars.DFSTATS_df_reloading), stealth:parseInt(userVars.DFSTATS_df_stealth)},
            profession:{expmultiplier:1, damagereduction:0, speed:0, melee:0, chainsaw:0, pistol:0, rifle:0, shotgun:0, submachinegun:0, machinegun:0, explosive:0, cashloot:0, ammoloot:0, weaponloot:0, armourloot:0, lootspot:0, searchspeed:0, findchancegeneral:0},
            equipment:{
                armour:"",
                weapons:["", "", ""],
            },
            boosts:{
                implants:{exp:0, pvppoints:0, damagereduction:0, damage:0, speed:0, cashloot:0, ammoloot:0, weaponloot:0, armourloot:0, miscloot:0, lootspot:0, searchspeed:0, dexterity:0},
                drugs:{
                    damage:parseInt(userVars.DFSTATS_df_boostdamageuntil) >= states.serverTime && parseInt(userVars.DFSTATS_df_boostdamageuntil_ex) >= states.serverTime ? 0.7 : parseInt(userVars.DFSTATS_df_boostdamageuntil) >= states.serverTime || parseInt(userVars.DFSTATS_df_boostdamageuntil_ex) >= states.serverTime ? 0.35 : 0, exp:parseInt(userVars.DFSTATS_df_boostexpuntil) >= states.serverTime && parseInt(userVars.DFSTATS_df_boostexpuntil_ex) >= states.serverTime ? 1 : parseInt(userVars.DFSTATS_df_boostexpuntil) >= states.serverTime || parseInt(userVars.DFSTATS_df_boostexpuntil_ex) >= states.serverTime ? 0.5 : 0, speed:parseInt(userVars.DFSTATS_df_boostspeeduntil) >= states.serverTime && parseInt(userVars.DFSTATS_df_boostspeeduntil_ex) >= states.serverTime ? 0.7 : parseInt(userVars.DFSTATS_df_boostspeeduntil) >= states.serverTime || parseInt(userVars.DFSTATS_df_boostspeeduntil_ex) >= states.serverTime ? 0.35 : 0
                },
                clan:GM_getValue("clanBoosts", {exp:0, pvppoints:0, damagereduction:0, damage:0, damage:0, cashloot:0, ammoloot:0, weaponloot:0, armourloot:0, lootspot:0, searchspeed:0}),
                totals:{exp:0, expmultiplier:0, pvppoints:0, damagereduction:0, damage:0, speed:0, cashloot:0, ammoloot:0, weaponloot:0, armourloot:0, miscloot:0, lootspot:0, searchspeed:0, findchancegeneral:0, dexterity:0},
                titles:{exp:"", expmultiplier:"", pvppoints:"", damagereduction:"", damage:"", speed:"", cashloot:"", ammoloot:"", weaponloot:"", armourloot:"", miscloot:"", lootspot:"", searchspeed:"", findchancegeneral:"", dexterity:""}
            }
        };
    };

    async function startUp()
    {
        if(typeof silverRequestItem === "function")
        {
            while(!databank['32ammo'])
            {
                databank = unsafeWindow.getSilverItemsDataBank();
                await new Promise(r => setTimeout(r, 100));
            };
        };
        debug ? console.log("Silverscripts Databank:", databank) : null;
        aggregationHandler();
        if(requestArr.length > 0)
        {
            await Promise.all(requestArr);
        };
        mathHandler();
        displayHandler();
    };

    await new Promise(resolve =>
    {
        webCall("hotrods/load_masteries", dataArr, function(data)
        {
            masteryData = parseMasteryData(data);
            debug ? console.log("Mastery Data:", masteryData) : null;
            resolve();
            return;
        });
    });

    await new Promise(resolve =>
    {
        let interval;
        const check = function()
        {
            if(unsafeWindow.globalData && unsafeWindow.globalData.hasOwnProperty('32ammo'))
            {
                clearInterval(interval);
                resolve();
                return;
            };
        };
        interval = setInterval(check, 100);
        check();
    });
    
    itemData = parseItemData(JSON.parse(JSON.stringify(globalData)));
    professionData = parseProfessionData(JSON.parse(JSON.stringify(userVars)));
    debug ? console.log("itemData:", itemData) : null;
    debug ? console.log("professionData:", professionData) : null;
    initialiseValues();
    pageSetup();
    startUp();
//#endregion

//#region Refresh
    function refresh()
    {
        initialiseValues();
        startUp();
    };
//#endregion

//#region Input Handling
    function inputHandler(elem)
    {
        if(elem.id === "damageOpen")
        {
            document.getElementById("experienceDisplay").style.display = "none";
            document.getElementById("experienceOpen").style.display = "block";
            document.getElementById("damageDisplay").style.display = "grid";
            document.getElementById("damageOpen").style.display = "none";
            document.getElementById("boostsDisplay").style.display = "none";
            document.getElementById("boostsOpen").style.display = "block";
        } else if(elem.id === "damageClose")
        {
            document.getElementById("damageDisplay").style.display = "none";
            document.getElementById("damageOpen").style.display = "block";
        } else if(elem.id === "damageBoostCheck")
        {
            boostCheck[0] = elem.checked;
            refresh();
        } else if(elem.id === "experienceOpen")
        {
            document.getElementById("damageDisplay").style.display = "none";
            document.getElementById("damageOpen").style.display = "block";
            document.getElementById("experienceDisplay").style.display = "grid";
            document.getElementById("experienceOpen").style.display = "none";
            document.getElementById("boostsDisplay").style.display = "none";
            document.getElementById("boostsOpen").style.display = "block";
        } else if(elem.id === "experienceClose")
        {
            document.getElementById("experienceDisplay").style.display = "none";
            document.getElementById("experienceOpen").style.display = "block";
        } else if(elem.id === "expBoostCheck")
        {
            boostCheck[1] = elem.checked;
            refresh();
        } else if(elem.id === "boostsOpen")
        {
            document.getElementById("damageDisplay").style.display = "none";
            document.getElementById("damageOpen").style.display = "block";
            document.getElementById("experienceDisplay").style.display = "none";
            document.getElementById("experienceOpen").style.display = "block";
            document.getElementById("boostsDisplay").style.display = "grid";
            document.getElementById("boostsOpen").style.display = "none";
        } else if(elem.id === "boostsClose")
        {
            document.getElementById("boostsDisplay").style.display = "none";
            document.getElementById("boostsOpen").style.display = "block";
        } else if(elem.id.includes("clan"))
        {
            const clanColl = document.querySelectorAll("input[id*='clan']");
            let clanHolder = {exp:0, pvppoints:0, damagereduction:0, damage:0, damage:0, cashloot:0, ammoloot:0, weaponloot:0, armourloot:0, lootspot:0, searchspeed:0};
            if(!elem.value)
            {
                elem.value = 0;
            } else if(elem.value > elem.max)
            {
                elem.value = elem.max;
            };
            for(let i = 0; i < clanColl.length; i++)
            {
                let index = clanColl[i].id.split("clan")[1];
                clanHolder[index] =  index === "damagereduction" ? (parseFloat(clanColl[i].value) * -1) : parseFloat(clanColl[i].value);
            };
            GM_setValue("clanBoosts", clanHolder);
            refresh();
        };
    };

    document.getElementById("invController").addEventListener("mouseup", function(e)
    {
        if(e.target.classList.contains("item"))
        {
            setTimeout(function()
            {
                refresh();
            }, 500)
        };
    });
//#endregion
})();
//#endregion