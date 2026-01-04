// ==UserScript==
// @name         Ironwood RPG - Legendary Drop EV Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculates EV from legendary drops in combat. Does not work on Firefox and Safari.
// @author       Cascade
// @match        https://ironwoodrpg.com/*
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513007/Ironwood%20RPG%20-%20Legendary%20Drop%20EV%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/513007/Ironwood%20RPG%20-%20Legendary%20Drop%20EV%20Calculator.meta.js
// ==/UserScript==

const combatData =
      {
          // T25
          "Green Slime": {
              "Dungeon Map 25": 8000,
              "Petty Crit Rune": 19800, // 2 different runes, getting a specific one is 1/19,800 so getting either is 1/6,600
              "Petty Damage Rune": 19800,
              "Silver Lantern": 19800 //these are 2x rare than runes apparently
          },
          "Goblin": {
              "Dungeon Map 25": 8000,
              "Petty Stun Rune": 19800,
              "Petty Block Rune": 19800,
              "Silver Dagger": 19800
          },
          "Blue Slime": {
              "Dungeon Map 25": 8000,
              "Petty Bleed Rune": 19800,
              "Petty Parry Rune": 19800,
              "Silver Telescope": 19800
          },

          // T40
          "Lady Beetle": {
              "Dungeon Map 40": 10000,
              "Lesser Crit Rune": 39900,
              "Lesser Damage Rune": 39900,
              "Gold Lantern": 39900
          },
          "Goblin Chief": {
              "Dungeon Map 40": 10000,
              "Lesser Stun Rune": 39900,
              "Lesser Block Rune": 39900,
              "Gold Dagger": 39900
          },
          "Ice Fairy": {
              "Dungeon Map 40": 10000,
              "Lesser Bleed Rune": 39900,
              "Lesser Parry Rune": 39900,
              "Gold Telescope": 39900
          },

          // T55
          "Leaf Hopper": {
              "Dungeon Map 55": 12000,
              "Common Crit Rune": 75000,
              "Common Damage Rune": 75000,
              "Cobalt Lantern": 75000
          },
          "Ogre": {
              "Dungeon Map 55": 12000,
              "Common Stun Rune": 75000,
              "Common Block Rune": 75000,
              "Cobalt Dagger": 75000
          },
          "Coral Snail": {
              "Dungeon Map 55": 12000,
              "Common Bleed Rune": 75000,
              "Common Parry Rune": 75000,
              "Cobalt Telescope": 75000
          },

          // T70
          "Tree Stump": {
              "Dungeon Map 70": 14000,
              "Uncommon Crit Rune": 108000,
              "Uncommon Damage Rune": 108000,
              "Obsidian Lantern": 108000
          },
          "Grey Wolf": {
              "Dungeon Map 70": 14000,
              "Uncommon Stun Rune": 108000,
              "Uncommon Block Rune": 108000,
              "Obsidian Dagger": 108000
          },
          "Jellyfish": {
              "Dungeon Map 70": 14000,
              "Uncommon Bleed Rune": 108000,
              "Uncommon Parry Rune": 108000,
              "Obsidian Telescope": 108000
          },

          // T85
          "Venus Flytrap": {
              "Dungeon Map 85": 16000,
              "Greater Crit Rune": 150000,
              "Greater Damage Rune": 150000,
              "Astral Lantern": 150000
          },
          "Griffin": {
              "Dungeon Map 85": 16000,
              "Greater Stun Rune": 150000,
              "Greater Block Rune": 150000,
              "Astral Dagger": 150000*2
          },
          "Rock Dweller": {
              "Dungeon Map 85": 16000,
              "Greater Bleed Rune": 150000,
              "Greater Parry Rune": 150000,
              "Astral Telescope": 150000
          },

          // T100
          "Treant": {
              "Dungeon Map 100": 18000,
              "Grand Crit Rune": 200400,
              "Grand Damage Rune": 200400,
              "Infernal Lantern": 200400
          },
          "Efreet": {
              "Dungeon Map 100": 18000,
              "Grand Stun Rune": 200400,
              "Grand Block Rune": 200400,
              "Infernal Dagger": 200400
          },
          "Frost Wolf": {
              "Dungeon Map 100": 18000,
              "Grand Bleed Rune": 200400,
              "Grand Parry Rune": 200400,
              "Infernal Telescope": 200400
          },

          //DUNGEONS
          "Ice Caverns": {
              "Petty Combat Rune": 24000 / 4, //4 runes, 1/24000  to get a specific one, 1/6000 to get any.

              "Ruby Efficiency Ring": 24000,
              "Ruby Loot Amulet": 24000,
          },
          "Twisted Woods": {
              "Lesser Combat Rune": 27000 / 4,

              "Topaz Efficiency Ring": 27000,
              "Topaz Loot Amulet": 27000,
          },
          "Misty Tides": {
              "Common Combat Rune": 30000 / 4,

              "Emerald Efficiency Ring": 30000,
              "Emerald Loot Amulet": 30000,
          },
          "Cyclops Den": {
              "Uncommon Combat Rune": 33000 / 4,

              "Amethyst Efficiency Ring": 33000,
              "Amethyst Loot Amulet": 33000,
          },
          "Hellish Lair": {
              "Greater Combat Rune": 36000 / 4,

              "Citrine Efficiency Ring": 36000,
              "Citrine Loot Amulet": 36000,
          },
          "Wizard Tower": {
              "Grand Combat Rune": 39000 / 4,

              "Diamond Efficiency Ring": 39000,
              "Diamond Loot Amulet": 39000,
          },
      }
//const itemIcons = {};

if ('navigation' in window) {
  // Add an event listener to intercept navigations
  window.navigation.addEventListener('navigate', (event) => {
    const newUrl = new URL(event.destination.url);

      // clear rows when navigating
      rowsExisting.forEach(element => {
          element.remove();
      });
      rowsExisting = [];

    if (newUrl.href.includes("skill/6")||newUrl.href.includes("skill/7")||newUrl.href.includes("skill/14")||newUrl.href.includes("skill/8")) // a combat skill
    {
        runCalculator();
    }
  });
} else {
  console.error("Legendary Drop EV Calculator: Navigation API is not supported in this browser.");
}


var rowsExisting = [];
var totalRow;
async function runCalculator(){
    allEVs = {};
    await sleep(75);
    let action = $('skill-page').find('div.mobile-end').find('div.header').find('div.name').first().text().trim();

    if(!(action in combatData)) return;

    let estimatesBtn = $('div.tabs').find('button.tab:contains("Estimates")')[0];
    let statsBtn = $('div.tabs').find('button.tab:contains("Stats")')[0];
    statsBtn.removeEventListener('click', hideAll)
    estimatesBtn.removeEventListener('click', displayAll)

    statsBtn.click();
    await sleep(10);

    let lootChanceQuery = $('div.card').find('div.row:contains("Loot Chance")').find('div.value');
    let doubleLootChance = lootChanceQuery.length > 0 ? num(lootChanceQuery[0].textContent.trim()) / 100 : 0;

    estimatesBtn.click();
    await sleep(10);

    ATTRIBUTE = yoinkGameAttributeName(estimatesBtn);

    let monstersPerHour = num($('div.name:contains("Monsters")').closest('div.row').find('div.value')[0].childNodes[0].textContent.trim());
    let rollsPerHour = monstersPerHour * (1 + doubleLootChance);

    statsBtn.addEventListener('click', hideAll)
    estimatesBtn.addEventListener('click', displayAll)

    if(action in combatData){
        //must be done first or it will create errors since the drop ui updates it or whatever
        totalRow = createRow("Legendary EV",
                      [{value: 0, ending: " / hour"}]);

        for (const drop in combatData[action]) {
            let rarity = combatData[action][drop];
            let dropChance = 1 / rarity;

            let amountDroppedPerHour = rollsPerHour * dropChance;
            let dropTimeMs = dropTime(amountDroppedPerHour);


            rowsExisting.push(
                createRow(drop,
                          [{value: formatDuration(dropTimeMs), ending: "per drop"}, {ending: "gold ", input: ""}],
                          {amountDroppedPerHour: amountDroppedPerHour})
            );
        }
        rowsExisting.push(totalRow);
    }
}

function hideAll(){
    rowsExisting.forEach(element => {
        element.style.display = "none";
    });

}

function displayAll(){
    rowsExisting.forEach(element => {
        element.style.display = "flex";
    });
}

function dropTime(x) {
    // Calculate milliseconds for one drop
    const millisecondsPerHour = 3600000;
    return millisecondsPerHour / x;
}
function saveItemValue(key, val){
    let data;
    if(localStorage.getItem('EVCalc'))
        data = JSON.parse(localStorage.getItem('EVCalc'));
    if(!data) {data = {}}
    data[key] = val;
    localStorage.setItem('EVCalc', JSON.stringify(data));
}
function getItemValue(key){
    if(localStorage.getItem('EVCalc')){
        let data = JSON.parse(localStorage.getItem('EVCalc'));
        if(key in data) {return data[key]} else return 0;
    } else return 0;
}

var allEVs = {};

function createRow(title, content, additionalInfo){
    let parent = $('div.card:contains("Estimates")')[0]
    let rowMain = C('div %<row ng-star-inserted>');
    rowMain.toggleAttribute(ATTRIBUTE);
    parent.appendChild(rowMain);

    let name = C('div %<name>');
    name.textContent = title;
    name.toggleAttribute(ATTRIBUTE);
    rowMain.appendChild(name);

    let cont = C('div *<margin-left:auto; justify-content: flex-end !important;>');
    cont.toggleAttribute(ATTRIBUTE);
    rowMain.appendChild(cont);

    for(let i = 0; i < content.length; i++){
        let subrow = C('div %<value> *<justify-content: flex-end !important;>');
        subrow.toggleAttribute(ATTRIBUTE);
        cont.appendChild(subrow);
        subrow.textContent = content[i].value;
        let field = undefined;

        if(content[i].input != undefined){
            field = C('input *<flex: 3 1 0%; padding: 0px; height: inherit; color: rgb(170, 170, 170); border: 1px solid #1c2f40; border-radius: 4px; text-align:center; min-width: 100px; max-width: 200px;> &<placeholder:value, type:number>')
            field.value = getItemValue(title)
            field.addEventListener('input', () => {
                saveItemValue(title, field.value);
                if(content[i].ending){
                    subrow.querySelectorAll('span')[0].textContent = commas(additionalInfo.amountDroppedPerHour * field.value) + " / hour"
                    allEVs[title] = additionalInfo.amountDroppedPerHour * field.value;
                    console.log(allEVs)
                    let totalEvFormatted = commas(Object.values(allEVs).reduce((acc, value) => acc + value, 0));
                    totalRow.children[1].children[0].childNodes[0].textContent = totalEvFormatted; //childNodes[0].textContent instead of textContent to not mess with the ending
                }
            })

            subrow.appendChild(field);
        }

        if(content[i].ending){
            let span = C('span *<margin-left:auto>');
            span.textContent = " " + content[i].ending;
            span.toggleAttribute(ATTRIBUTE);
            subrow.appendChild(span);

           if(content[i].input != undefined) field.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    return rowMain;
}


function num(str) {
    let last = str.length > 0 ? str.slice(-1) : '';
    let secondlast = str.length > 1 ? str[str.length - 2] : '';
    let modified = str.replace(/[^0-9.]/g, ' ');

    // Remove the dot if it is surrounded by two blank spaces
    modified = modified.replace(/ {2}\.\s+/g, ' ');

    // Remove all blank spaces
    modified = modified.replace(/\s+/g, '');

    // Convert stripped value to a number
    let numberValue = Number(modified);

    if (isNaN(numberValue)) return NaN; // Handle invalid numbers

    if (!isNaN(secondlast)) {
        if (last === 's') return numberValue; // seconds
        if (last === 'm') return numberValue * 60; // minutes
        if (last === 'h') return numberValue * 3600; // hours
        if (last === 'd') return numberValue * 3600 * 24; // days
        return numberValue; // return as is if no suffix
    } else {
        return numberValue; // return as is if no suffix
    }
}

var ATTRIBUTE;

//imports
function commas(num, roundWhole = false) {
    const roundedNum = roundWhole ? Math.round(num) : Math.round(num * 100) / 100;
    return roundedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const formatDuration = ms => {
    const s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000) % 60, h = Math.floor(ms / 3600000) % 24, d = Math.floor(ms / 86400000);
    return `${d ? d + (d === 1 ? ' day' : ' days') + ' ' : ''}${h ? h + (h === 1 ? ' hour' : ' hours') + ' ' : ''}${m ? m + (m === 1 ? ' minute' : ' minutes') + ' ' : ''}${s || !d && !h && !m ? s + (s === 1 ? ' second' : ' seconds') : ''}`.trim();
};
function C(t) { try { let e = parse(t), s = document.createElement(e.element); return e.parentSelector ? document.querySelectorAll(e.parentSelector)[0].appendChild(s) : document.body.appendChild(s), e.textContent && (s.textContent = e.textContent), e.id && (s.id = e.id), e.style && (s.style = e.style), e.classes && e.classes.split(" ").forEach(t => { s.classList.add(t) }), e.attributes && e.attributes.split(",").forEach(t => { let e = t.split(":"), r = e[0].trim(), l = e[1].trim(); s.setAttribute(r, l) }), s } catch (r) { console.error("Error creating element: " + r) } } const sub = (t, e) => t.split("").find(t => e.includes(t)) ? t.split("").slice(0, t.split("").findIndex(t => e.includes(t))).join("") : t; function parse(t) { let e = { "@": "parentSelector", "#": "id", ":": "textContent", "*": "style", "%": "classes", "&": "attributes" }, s = {}; return s.element = sub(t, Object.keys(e)).trim(), Object.entries(e).forEach(([e, r]) => { let l = RegExp(`\\${e}<([^>]*)>`), n = t.match(l); n && (s[r] = n[1]) }), s }function yoinkGameAttributeName(elem){for (let i = 0; i < elem.attributes.length; i++){if(elem.attributes[i].nodeName.includes('_ngcontent-')){return elem.attributes[i].nodeName;}}}
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}