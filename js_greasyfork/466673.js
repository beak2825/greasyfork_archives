// ==UserScript==
// @name         Trade Button Script
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Adds buttons to SB trade screen to quickly get farm or recyc goods. 0.5.0 adds support for checkboxes to increase flexibility, adds support for 1 "*" buy instruction (to fill all remaining space), and fixes a display bug when only part of the buy order can be fulfilled.
// @author       Bocaj
// @match        http*://*.pardus.at/starbase_trade.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466673/Trade%20Button%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/466673/Trade%20Button%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    User adjustable. All commands will attempt to buy whatever is missing in the ship and sell the rest.
    Things to avoid doing:
    - Using negative numbers
    - Requesting to buy more than ship space
    It is possible to use the "*" value instead of a number if you want to fill up remaining ship space with that commodity.
    - Only 1 "*" is allowed per command (this is enforced after checkbox instructions are added in
    */
    const instructions = {
        "orion": {
            defaultDesiredFuel: 10,
            buttonGroups: [
                { groupLabel: "Farms", elements: [
                    { label: "4", buyInstructions: {"Energy":28,"Animal embryos":36,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "5", buyInstructions: {"Energy":40,"Animal embryos":52,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "6", buyInstructions: {"Energy":48,"Animal embryos":60,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "7", buyInstructions: {"Energy":56,"Animal embryos":68,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "8", buyInstructions: {"Energy":60,"Animal embryos":76,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "9", buyInstructions: {"Energy":68,"Animal embryos":84,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "10", buyInstructions: {"Energy":72,"Animal embryos":92,"Chemical supplies":0,"Bio-waste":0} },
                ]},
                { groupLabel: "Recycs", elements: [
                    { label: "6", buyInstructions: {"Energy":36,"Animal embryos":0,"Chemical supplies":12,"Bio-waste":60} },
                    { label: "8", buyInstructions: {"Energy":44,"Animal embryos":0,"Chemical supplies":16,"Bio-waste":76} },
                    { label: "9", buyInstructions: {"Energy":52,"Animal embryos":0,"Chemical supplies":20,"Bio-waste":84} },
                ]},
                { groupLabel: "Remo", elements: [
                    { label: "RF Remo", buyInstructions: {"Food":0,"Energy":64,"Water":0,"Metal":32,"Electronics":60,"Optical components":64} },
                    { label: "EF/RF Remo", buyInstructions: {"Food":0,"Energy":80,"Water":0,"Metal":52,"Heavy plastics":24,"Optical components":32} },
                ]},
                { groupLabel: "Labela", elements: [
                    { label: "MO 2 days", buyInstructions: {"Energy":118,"Hydrogen fuel":"*"} },
                    { label: "FWE for Buildings", buyInstructions: {"Food":118, "Water":118} },
                    { label: "CL Labela", buyInstructions: {"Food":32,"Energy":88,"Water":32} },
                    { label: "Smelter 8 x 6", buyInstructions: {"Food":48,"Energy":48,"Water":48,"Ore":90} },
                ]},
                { groupLabel: "Planets", elements: [
                    { label: "4", buyInstructions: {"Energy":"*","Electronics":16,"Robots":8,"Hand weapons":4,"Droid modules":4,"Battleweapon Parts":4 } },
                    { label: "6", buyInstructions: {"Energy":"*","Electronics":24,"Robots":12,"Hand weapons":6,"Droid modules":6,"Battleweapon Parts":6 } },
                    { label: "Fuel", buyInstructions: {"Energy":"*","Hydrogen fuel":2 } },
                ]},
            ],
        },
        "artemis": {
            defaultDesiredFuel: 10,
            buttonGroups: [
                { groupLabel: "Farms", elements: [
                    { label: "4", buyInstructions: {"Energy":28,"Animal embryos":36,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "6", buyInstructions: {"Energy":48,"Animal embryos":60,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "7", buyInstructions: {"Energy":56,"Animal embryos":68,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "8", buyInstructions: {"Energy":60,"Animal embryos":76,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "9", buyInstructions: {"Energy":68,"Animal embryos":84,"Chemical supplies":0,"Bio-waste":0} },
                    { label: "10", buyInstructions: {"Energy":72,"Animal embryos":92,"Chemical supplies":0,"Bio-waste":0} },
                ]},
                { groupLabel: "Recycs", elements: [
                    { label: "6", buyInstructions: {"Energy":36,"Animal embryos":0,"Chemical supplies":12,"Bio-waste":60} },
                    { label: "8", buyInstructions: {"Energy":44,"Animal embryos":0,"Chemical supplies":16,"Bio-waste":76} },
                ]},
            ],
        },
        "pegasus": {
            defaultDesiredFuel: 10,
            buttonGroups: [
                { groupLabel: "Farms", elements: [
                    { label: "6", buyInstructions: {"Energy":48,"Animal embryos":60,"Chemical supplies":0,"Bio-waste":0} },
                ]},
                { groupLabel: "Smelter", elements: [
                    { label: "Smelter 6 x 4", buyInstructions: {"Food":24,"Energy":24,"Water":24,"Ore":48} },
                ]},
            ],
        },
    };

    // These may overwrite each other in certain circumstances and will override standard instructions. Handle with care.
    // Any instruction set with multiple "*" orders will be rejected.
    const checkBoxInstructions = [
        {label:"Buy 1 Amber Stim", buyInstructions: {"Amber Stim":1} },
        {label:"Fill With Energy", buyInstructions: {"Energy":"*"} }
    ];

    // Commodity types (copy and paste into buttons for exact matches)
    const commodityNames = [
        'Food',
        'Energy',
        'Water',
        'Animal embryos',
        'Ore',
        'Metal',
        'Electronics',
        'Robots',
        'Heavy plastics',
        'Hand weapons',
        'Medicines',
        'Nebula gas',
        'Chemical supplies',
        'Gem stones',
        'Liquor',
        'Hydrogen fuel',
        'Exotic matter',
        'Optical components',
        'Radioactive cells',
        'Droid modules',
        'Bio-waste',
        'Nutrient clouds',
        'Battleweapon Parts',
        'Neural Tissue',
        'Stim Chip',
        'Capri Stim',
        'Crimson Stim',
        'Amber Stim'
    ];

    // Universe specific instructions
    const universe = window.location.host.substr(0, window.location.host.indexOf('.'));
    const defaultFuelForThisUniverse = instructions[universe].defaultDesiredFuel;

    // Trade form elements
    const tradeFormBody = document.getElementsByTagName("form")[0].getElementsByTagName("tr")[1];
    const buttonCol = tradeFormBody.children[1];
    const tradeButton = buttonCol.getElementsByTagName("input")[0];

    // Create logical view of page for easier manipulation
    const parseToInt = (val) => parseInt(val.replace(/[t,]/g, ''));
    const sellColArray = Array.from(tradeFormBody.children[0].getElementsByTagName("tbody")[0].children);
    const buyColArray = Array.from(tradeFormBody.children[2].getElementsByTagName("tbody")[0].children);

    const viewModel = {}; // commodityName: string?: {amountOnShip: int, sellInputCell: HtmlElement?, amountInStarbase: int, min: int, max: int, buyInputCell: HtmlElement?}
    const freeSpaceShip = parseToInt(sellColArray[sellColArray.length-2].getElementsByTagName("td")[1].innerHTML);

    // Check about how magnetic scoops affect things
    console.log(freeSpaceShip);
    console.log(sellColArray[sellColArray.length-2].getElementsByTagName("td")[1].innerHTML);

    const freeSpaceStarbase = parseToInt(buyColArray[buyColArray.length-2].getElementsByTagName("td")[1].innerHTML);

    commodityNames.forEach(commodity => {
        // Scraping helper
        const getRow = (array) => array.find(row => {
            let tds = row.getElementsByTagName("td");
            if (tds.length > 1) {
                return tds[1].innerHTML.indexOf(commodity) > -1;
            }
            return false;
        });

        // Get rows for this commodity, return if not visible
        let sellRow = getRow(sellColArray);
        let buyRow = getRow(buyColArray);
        if (sellRow == null && buyRow == null) {
            return;
        }

        // Harvest data
        let payload = {};
        viewModel[commodity] = payload;
        if (sellRow != null) {
            const tds = sellRow.getElementsByTagName("td");
            const current = (tds.length > 2) ? tds[2].getElementsByTagName("a") : [];
            payload.amountOnShip = (current.length > 0) ? parseToInt(current[0].innerHTML) : 0;
            payload.sellInputCell = (tds.length > 4) ? tds[4].getElementsByTagName("input")[0] : null;
        }
        if (buyRow != null) {
            const tds = buyRow.getElementsByTagName("td");
            const current = (tds.length > 2) ? tds[2].getElementsByTagName("a") : [];
            payload.amountInStarbase = (current.length > 0) ? parseToInt(current[0].innerHTML) : 0;
            payload.min = (tds.length > 4) ? parseToInt(tds[4].innerHTML) : 0;
            payload.max = (tds.length > 5) ? parseToInt(tds[5].innerHTML) : 0;
            payload.buyInputCell = (tds.length > 7) ? parseToInt(tds[7].innerHTML) : 0;
            if (tds.length > 7) {
                payload.buyInputCell = tds[7].getElementsByTagName("input")[0];
            }
        }
    });

    /*
    Trade logic
    */
    function buySellPossible(tradeInstructions) {
        let warnings = [];
        let cumulativeIncreaseInStock = 0;
        let buyAllCommodityInfo = null;
        let buyAllCommodityName = null;

        commodityNames.forEach(commodity => {
            const commodityInfo = viewModel[commodity];
            if (commodityInfo == null) {
                return;
            }

            const instructedToBuy = tradeInstructions[commodity] || 0;
            if (instructedToBuy === "*") { // We don't know how much to buy yet, have to wait until the end.
                buyAllCommodityInfo = commodityInfo;
                buyAllCommodityName = commodity;
                return;
            }

            const wantToBuy = Math.max(0, instructedToBuy - commodityInfo.amountOnShip);
            const wantToSell = Math.max(0, commodityInfo.amountOnShip - instructedToBuy);
            //console.log(`For good ${commodity}, instructedToBuy: ${instructedToBuy}, wantToBuy: ${wantToBuy}, wantToSell: ${wantToSell}`);

            if (commodityInfo.sellInputCell != null && wantToSell > 0) {
                const roomInStarbase = Math.max(0, commodityInfo.max - commodityInfo.amountInStarbase);
                //console.log(`For good ${commodity}, Max: ${commodityInfo.max}, AmountInStarbase: ${commodityInfo.amountInStarbase}, roomInStarbase: ${roomInStarbase}`);
                if (wantToSell > roomInStarbase) {
                    warnings.push(`We cannot sell ${wantToSell - roomInStarbase} ${commodity}`);
                    commodityInfo.sellInputCell.value = roomInStarbase;
                } else {
                    commodityInfo.sellInputCell.value = wantToSell;
                }
                cumulativeIncreaseInStock -= parseInt(commodityInfo.sellInputCell.value);
            }

            if (commodityInfo.buyInputCell && wantToBuy > 0) {
                 const availableToBuy = Math.max(0, commodityInfo.amountInStarbase - commodityInfo.min);
                 //console.log(`For good ${commodity}, Min: ${commodityInfo.min}, AmountInStarbase: ${commodityInfo.amountInStarbase}, availableToBuy: ${availableToBuy}`);
                 if (wantToBuy > availableToBuy) {
                     warnings.push(`We cannot buy ${wantToBuy - availableToBuy} ${commodity}`);
                     commodityInfo.buyInputCell.value = availableToBuy;
                 } else {
                     commodityInfo.buyInputCell.value = wantToBuy;
                 }
                 cumulativeIncreaseInStock += parseInt(commodityInfo.buyInputCell.value);
             }
        });

        // Deal with buy all case
        if (buyAllCommodityInfo && buyAllCommodityInfo.buyInputCell) {
            const availableToBuy = Math.max(0, buyAllCommodityInfo.amountInStarbase - buyAllCommodityInfo.min);
            const wantToBuy = freeSpaceShip - cumulativeIncreaseInStock;
            if (wantToBuy > availableToBuy) {
                warnings.push(`We cannot buy ${wantToBuy - availableToBuy} ${buyAllCommodityName}`);
                buyAllCommodityInfo.buyInputCell.value = availableToBuy;
            } else {
                buyAllCommodityInfo.buyInputCell.value = wantToBuy;
            }
            cumulativeIncreaseInStock += parseInt(buyAllCommodityInfo.buyInputCell.value);
        }

        if (cumulativeIncreaseInStock > freeSpaceShip) {
            warnings.push(`We are short ${cumulativeIncreaseInStock - freeSpaceShip} space on the ship`);
        } else if (cumulativeIncreaseInStock > freeSpaceStarbase) {
            warnings.push(`The starbase is short ${cumulativeIncreaseInStock - freeSpaceStarbase} space to complete the trade`);
        }
        return warnings;
    }
    function newTradeNow(tradeInstructions) {
        const extraInstructions = getRequestedCheckBoxInstructions();
        const combinedInstructions = mergeAllBuyInstructions(tradeInstructions, extraInstructions);
        let warnings = [];

        if (existsMultipleBuyAllInstructions(combinedInstructions)) {
            warnings.push("Unable to fulfil request, multiple buy all ('*') orders detected");
        } else {
            if (combinedInstructions['Hydrogen fuel'] == null) {
                combinedInstructions['Hydrogen fuel'] = defaultFuelForThisUniverse;
            }
            warnings.concat(buySellPossible(combinedInstructions));
        }

        if (warnings.length > 0) {
            console.log(warnings.join("\n"));
            alert(warnings.join("\n"));
        } else {
            console.log("Clicking trade button");
            //tradeButton.click();
        }
    }
    function mergeAllBuyInstructions(tradeInstructions, checkboxInstructions) {
        const combinedInstructions = {};
        // Checkbox Instructions are an array of objects
        checkboxInstructions.forEach(instructionSet => {
            Object.entries(instructionSet).forEach(instruction => {
                combinedInstructions[instruction[0]] = instruction[1];
            });
        });
        // One single object
        Object.entries(tradeInstructions).forEach(instruction => {
            combinedInstructions[instruction[0]] ||= instruction[1];
        });
        return combinedInstructions;
    }
    function existsMultipleBuyAllInstructions(instructions) {
        return Object.entries(instructions).filter(x => x[1] === "*").length > 1;
    }
    function getRequestedCheckBoxInstructions() {
        const validInstructions = [];
        checkBoxInstructions.forEach((element, index) => {
            if (document.getElementById(`checkbox${index}`).checked) {
                validInstructions.push(element.buyInstructions);
            }
        });
        return validInstructions;
    }

    /*
    UI section
    */
    function addButtons() {
        const newTable = document.createElement("table");

        // Add checkboxes
        newTable.append(getCheckboxDiv());

        // Add button groups to table
        if (instructions[universe].buttonGroups) {
            instructions[universe].buttonGroups.forEach(buttonGroup => {
                const groupTable = document.createElement("table");
                arrangeTableHeaderLabel(buttonGroup.groupLabel, groupTable, buttonGroup.elements.length);
                arrangeRowOfButtons(buttonGroup.elements, groupTable);
                newTable.append(groupTable);
            });
        }

        // Add individual buttons to table
        if (instructions[universe].buttons) {
            arrangeTableHeaderLabel("Individual Buttons", newTable, 1);
            instructions[universe].buttons.forEach(buttonInfo => arrangeRowOfButtons([buttonInfo], newTable));
        }

        // Attach to page HTML
        buttonCol.append(newTable);
    }

    function getCheckboxDiv() {
        const div = document.createElement("div");
        checkBoxInstructions.forEach((element, index) => {
            // Checkbox
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", `checkbox${index}`);
            div.append(checkbox);

            // Label
            const label = document.createElement("label");
            label.innerHTML = element.label + "<br/>";
            div.append(label);
        });
        return div;
    }

    function arrangeTableHeaderLabel(label, table, colspan) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerHTML = label;
        th.setAttribute("colspan", colspan);
        tr.append(th);
        table.append(tr);
    }

    function arrangeRowOfButtons(buttonInfoArray, table) {
        const tr = document.createElement("tr");
        buttonInfoArray.forEach(buttonInfo => {
            const td = makeButtonReturnTd(buttonInfo);
            tr.append(td);
        });
        table.append(tr);
    }

    function makeButtonReturnTd(buttonInfo) {
        const button = document.createElement("BUTTON");
        button.innerHTML = buttonInfo.label;
        button.addEventListener('click', () => newTradeNow(buttonInfo.buyInstructions), false);
        const td = document.createElement("td");
        td.append(button);
        return td;
    }

    addButtons();
})();