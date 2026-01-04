// ==UserScript==
// @name         Ironwood - Highest gold payout on market
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Display unique names with the lowest cost in a fixed modal and update on DOM changes
// @match        https://ironwoodrpg.com/market
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504311/Ironwood%20-%20Highest%20gold%20payout%20on%20market.user.js
// @updateURL https://update.greasyfork.org/scripts/504311/Ironwood%20-%20Highest%20gold%20payout%20on%20market.meta.js
// ==/UserScript==
(function() {
    'use strict';


    // Create a map of item names and their divisors
    const costDivisors = {
        "Pine Log": 1,
        "Spruce Log": 2,
        "Birch Log": 3,
        "Teak Log": 4,
        "Mahogany Log": 5,
        "Ironbark Log": 6,
        "Redwood Log": 7,
        "Ancient Log": 8,

        "Raw Shrimp": 1,
        "Raw Cod": 2,
        "Raw Salmon": 3,
        "Raw Bass": 4,
        "Raw Lobster": 5,
        "Raw Swordfish": 6,
        "Raw Shark": 7,
        "Raw King Crab": 8,

        "Cooked Lobster": 100,
        "Cooked Bass": 80,
        "Cooked Salmon": 60,
        "Cooked Cod": 40,
        "Cooked Shrimp": 20,

    };

    const costDivisorsPieHigher={
        "King Crab Pie": 240,
        "Shark Pie": 210,
        "Swordfish Pie": 180,
        "Lobster Pie": 150,
        "Bass Pie": 120,
        "Salmon Pie": 90,
        "Cod Pie": 60,
        "Shrimp Pie":30,


        "Basic Health Potion":6,
        "Health Potion":12,
        "Super Health Potion":18,
        "Divine Health Potion":24,


    }


    const costDivisorsCraftXp={
        "Basic Craft XP Potion": 6,
        "Craft XP Potion": 12,
        "Super Craft XP Potion": 18,
        "Divine Craft XP Potion": 24,

        "Basic Multi Craft Potion":6,
        "Multi Craft Potion":12,
        "Super Multi Craft Potion":18,
        "Divine Multi Craft Potion":24
    }


    const pricePerLog = 9;


    const copperBar = 37;
    const copperAction = 1782;
    const copperOrePrice = 16;
    const copperCharcoal = 1;

    //  ore price + (log price*charcoal required)
    const copperSmeltExpense = copperOrePrice+(pricePerLog*copperCharcoal);
    const copperSmeltExpenseTotalAction = copperSmeltExpense*copperAction;


    const ironBar = 53;
    const ironAction = 1188;
    const ironOrePrice = 12;
    const ironCharcoal = 2;

    //  ore price + (log price*charcoal required)
    const ironSmeltExpense = ironOrePrice+(pricePerLog*ironCharcoal);
    const ironSmeltExpenseTotalAction = ironSmeltExpense*ironAction;


    const silverBar = 55;
    const silverAction = 908;
    const silverOrePrice = 12;
    const silverCharcoal = 3;

    //  ore price + (log price*charcoal required)
    const silverSmeltExpense = silverOrePrice+(pricePerLog*silverCharcoal);
    const silverSmeltExpenseTotalAction = silverSmeltExpense*silverAction;

    const goldBar = 96;
    const goldAction = 724;
    const goldOrePrice = 21;
    const goldCharcoal = 4;

    // Cobalt ore price + (log price*charcoal required)
    const goldSmeltExpense = goldOrePrice+(pricePerLog*goldCharcoal);
    const goldSmeltExpenseTotalAction = goldSmeltExpense*goldAction;



    const cobaltBar = 155;
    const cobaltAction = 609;
    const cobaltOrePrice = 57;
    const cobaltCharcoal = 5;

    // Cobalt ore price + (log price*charcoal required)
    const cobaltSmeltExpense = cobaltOrePrice+(pricePerLog*cobaltCharcoal);
    const cobaltSmeltExpenseTotalAction = cobaltSmeltExpense*cobaltAction;


    const obsidianBar = 227;
    const obsidianAction = 520;
    const obsidianOrePrice = 43;
    const obsidianCharcoal = 6;

    // Cobalt ore price + (log price*charcoal required)
    const obsidianSmeltExpense = obsidianOrePrice+(pricePerLog*obsidianCharcoal);
    const obsidianSmeltExpenseTotalAction = obsidianSmeltExpense*obsidianAction;


    const astralBar = 220;
    const astralAction = 400;
    const astralOrePrice = 38;
    const astralCharcoal = 7;

    // Cobalt ore price + (log price*charcoal required)
    const astralSmeltExpense = astralOrePrice+(pricePerLog*astralCharcoal);
    const astralSmeltExpenseTotalAction = astralSmeltExpense*astralAction;


    // Configuration for formulas based on names
    const config = {
        'Copper Ore': cost => cost * 1732,
        'Iron Ore': cost => cost * 1155,
        'Silver Ore': cost => cost * 881,
        'Gold Ore': cost => cost * 703,
        'Cobalt Ore': cost => cost * 591,
        'Obsidian Ore': cost => cost * 505,
        'Astral Ore': cost => cost * 445,
        'Infernal Ore': cost => cost * 394,

        'Copper Bar': cost => (cost * copperAction)-(copperAction*copperSmeltExpense),
        'Iron Bar': cost => (cost * ironAction)-(ironAction*ironSmeltExpense),
        'Silver Bar': cost => (cost * silverAction)-(silverAction*silverSmeltExpense),
        'Gold Bar': cost => (cost * goldAction)-(goldAction*goldSmeltExpense),
        'Cobalt Bar': cost => (cost * cobaltAction)-(cobaltAction*cobaltSmeltExpense),
        'Obsidian Bar': cost => (cost * obsidianAction)-(obsidianAction*obsidianSmeltExpense),
        'Astral Bar': cost => (cost * astralAction)-(astralAction*astralSmeltExpense),

        // How much to sell
        'Copper Sword': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Hammer': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Spear': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Hammer': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Scythe': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Bow': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Boomerang': cost => (cost * copperAction) - (copperBar*copperAction),

        'Copper Rod': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Spade': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Hatchet': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Pickaxe': cost => (cost * copperAction) - (copperBar*copperAction),

        'Copper Boots': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Gloves': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Helmet': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Shield': cost => (cost * copperAction) - (copperBar*copperAction),
        'Copper Body': cost => (cost * copperAction) - ((copperBar*2)*copperAction),

        'Iron Sword': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Hammer': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Spear': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Hammer': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Scythe': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Bow': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Boomerang': cost => (cost * ironAction) - (ironBar*ironAction),

        'Iron Rod': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Spade': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Hatchet': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Pickaxe': cost => (cost * ironAction) - (ironBar*ironAction),

        'Iron Boots': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Gloves': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Helmet': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Shield': cost => (cost * ironAction) - (ironBar*ironAction),
        'Iron Body': cost => (cost * ironAction) - ((ironBar*2)*ironAction),


        'Silver Sword': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Hammer': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Spear': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Hammer': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Scythe': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Bow': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Boomerang': cost => (cost * silverAction) - (silverBar*silverAction),

        'Silver Rod': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Spade': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Hatchet': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Pickaxe': cost => (cost * silverAction) - (silverBar*silverAction),

        'Silver Boots': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Gloves': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Helmet': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Shield': cost => (cost * silverAction) - (silverBar*silverAction),
        'Silver Body': cost => (cost * silverAction) - ((silverBar*2)*silverAction),


        'Gold Sword': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Hammer': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Spear': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Hammer': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Scythe': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Bow': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Boomerang': cost => (cost * goldAction) - (goldBar*goldAction),

        'Gold Rod': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Spade': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Hatchet': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Pickaxe': cost => (cost * goldAction) - (goldBar*goldAction),

        'Gold Boots': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Gloves': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Helmet': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Shield': cost => (cost * goldAction) - (goldBar*goldAction),
        'Gold Body': cost => (cost * goldAction) - ((goldBar*2)*goldAction),

    };

    // Function to create and display the modal
    function createModal() {
        let modal = document.createElement('div');
        modal.id = 'customModal';
        modal.style.position = 'fixed';
        modal.style.bottom = '20px';
        modal.style.right = '20px';
        modal.style.backgroundColor = '#0d2234';
        modal.style.color = 'white';
        modal.style.border = '1px solid black';
        modal.style.padding = '20px';
        modal.style.width = '360px';
        modal.style.maxHeight = '400px';
        modal.style.overflowY = 'scroll';
        modal.style.zIndex = '9999';
        modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        modal.style.display = 'none'; // Hide the modal initially
        document.body.appendChild(modal);
    }

    // Function to create and display the fixed button
    function createFixedButton() {
        let button = document.createElement('button');
        button.id = 'openModalButton';
        button.textContent = 'Market';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '2px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        // Add click event to toggle the modal's visibility
        button.onclick = () => {
            let modal = document.getElementById('customModal');
            if (modal.style.display === 'none' || modal.style.display === '') {
                modal.style.display = 'block';
            } else {
                modal.style.display = 'none';
            }
        };
    }

    function processRows(searchTerms = []) {


        let rows = document.querySelectorAll('.row.ng-star-inserted');
        let nameToData = {};
        let processedNames = new Set();

        rows.forEach(row => {
            let name = row.querySelector('.name').textContent.trim();
            let cost = parseFloat(row.querySelector('.cost').textContent.trim().replace(/[^\d.]/g, ''));
            let amountText = row.querySelector('.amount').textContent.trim().replace(/[^\d]/g, '');
            let amount = parseInt(amountText, 10) || 0;

            if (config[name]) {
                let formula = config[name];
                let adjustedCost = formula(cost);

                processedNames.add(name);

                if (!nameToData[name]) {
                    nameToData[name] = { cost: adjustedCost, count: 1, totalAmount: amount };
                } else {
                    nameToData[name].count += 1;
                    nameToData[name].totalAmount += amount;
                    if (adjustedCost < nameToData[name].cost) {
                        nameToData[name].cost = adjustedCost;
                    }
                }
            }
        });

        // Filter the missing names based on the search terms
        let missingNames = Object.keys(config).filter(name => {
            return !processedNames.has(name) && searchTerms.some(term => name.toLowerCase().includes(term.toLowerCase()));
        });

        return {
            results: Object.entries(nameToData)
            .sort(([, dataA], [, dataB]) => dataB.cost - dataA.cost)
            .map(([name, data]) =>
                 `${name}: $${data.cost.toLocaleString()} (${data.count}x${data.totalAmount.toLocaleString()})`),
            missing: missingNames
        };
    }

    function processRowsPricePer() {


        const rows = Array.from(document.querySelectorAll('.row.ng-star-inserted'));
        let rowData = [];

        rows.forEach(row => {
            const nameElement = row.querySelector('.name');
            const costElement = row.querySelector('.cost');
            const adjustedCostElement = costElement.querySelector('.adjusted-cost');  // Check for adjusted cost

            if(!costElement){return;}
            // If already adjusted, skip further processing
            if (adjustedCostElement) {
                return;
            }

            if (nameElement && costElement) {
                let name = nameElement.textContent.trim();
                let costText = costElement.textContent.trim();
                let cost = parseFloat(costText.replace(/,/g, ''));

                // Check if the name exists in the costDivisors map
                let divisor = costDivisors[name];

                if (divisor) {
                    let adjustedCost = cost / divisor;

                    // Create a span to display the adjusted cost
                    let newAdjustedCostElement = document.createElement('span');
                    newAdjustedCostElement.classList.add('adjusted-cost');  // Prevent duplicates
                    newAdjustedCostElement.textContent = ` (Adjusted: ${adjustedCost.toFixed(2)})`;
                    costElement.appendChild(newAdjustedCostElement);

                    // Push the row and adjusted cost to the rowData array
                    rowData.push({ row, adjustedCost });

                    // Hide the row if the adjusted cost is greater than 8
                    if (adjustedCost > 9.5) {
                        row.style.display = 'none';
                        //row.remove();
                    } else {
                        row.style.display = ''; // Ensure visible if adjusted cost <= 8
                    }
                }



                // Check if the name exists in the costDivisors map
                divisor = costDivisorsPieHigher[name];

                if (divisor) {
                    let adjustedCost = cost / divisor;

                    // Create a span to display the adjusted cost
                    let newAdjustedCostElement = document.createElement('span');
                    newAdjustedCostElement.classList.add('adjusted-cost');  // Prevent duplicates
                    newAdjustedCostElement.textContent = ` (Lower better: ${adjustedCost.toFixed(2)})`;
                    costElement.appendChild(newAdjustedCostElement);

                    // Push the row and adjusted cost to the rowData array
                    rowData.push({ row, adjustedCost });

                    // Hide the row if the adjusted cost is greater than 8
                    if (adjustedCost > 2) {
                         row.style.display = 'none';
                        //row.remove();
                    } else {
                        row.style.display = ''; // Ensure visible if adjusted cost <= 8
                    }
                }


                // Check if the name exists in the costDivisors map
                divisor = costDivisorsCraftXp[name];

                if (divisor) {
                    let adjustedCost = cost / divisor;

                    // Create a span to display the adjusted cost
                    let newAdjustedCostElement = document.createElement('span');
                    newAdjustedCostElement.classList.add('adjusted-cost');  // Prevent duplicates
                    newAdjustedCostElement.textContent = ` (Lower better: ${adjustedCost.toFixed(2)})`;
                    costElement.appendChild(newAdjustedCostElement);

                    // Push the row and adjusted cost to the rowData array
                    rowData.push({ row, adjustedCost });

                    // Hide the row if the adjusted cost is greater than 8
                    if (adjustedCost > 20) {
                        row.style.display = 'none';
                        //row.remove();
                    } else {
                        row.style.display = ''; // Ensure visible if adjusted cost <= 8
                    }
                }


            }
        });

        const intervalId = setInterval(() => {
            // Sort the rowData array by adjustedCost
            rowData.sort((a, b) => a.adjustedCost - b.adjustedCost);

            // Append the sorted rows while keeping unsorted ones intact
            const parentElement = rows[0].parentElement;

            if(!parentElement) {
                clearInterval(intervalId); // Stop the interval if parentElement doesn't exist
                return;
            }

            // Append sorted rows, keeping the other rows in their positions
            rowData.forEach(data => {
                parentElement.appendChild(data.row);  // Reappend rows in sorted order
            });

        }, 3000); // 3000 ms = 3 seconds interval

    }

    function updateModal(searchTerms = []) {
        let { results, missing } = processRows(searchTerms);
        let modal = document.getElementById('customModal');
        modal.innerHTML = '<h3>Results</h3><ul>' +
            results.map(result => `<li>${result}</li>`).join('') +
            '</ul>';

        if (missing.length > 0) {
            modal.innerHTML += '<h4>Missing Items</h4><ul>' +
                missing.map(name => `<li>${name}</li>`).join('') +
                '</ul>';
        }
    }

    function attachSearchListener() {
        const searchInput = document.querySelector('input[placeholder="Search listings"]');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerms = searchInput.value.trim().split(/\s+/);
                updateModal(searchTerms);
            });
        }
    }

    createModal();
    createFixedButton();
    attachSearchListener();  // Attach listener for search input
    updateModal();


    setInterval(processRowsPricePer, 1000);  // 2000 ms = 2 seconds


    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.target.matches('.group') || mutation.target.closest('.group')) {
                const searchInput = document.querySelector('input[placeholder="Search listings"]');
                const searchTerms = searchInput ? searchInput.value.trim().split(/\s+/) : [];
                updateModal(searchTerms);
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();

function waitForElement() {
    var searchInput = document.querySelector('input[placeholder="Search listings"]');

    if (searchInput) {
        // Element exists, fill it with "bar|ore"
        searchInput.value = "bar|ore";
        // Stop checking once the element is found
        clearInterval(checkExist);
    }
}


// Check every 500 milliseconds for the element
var checkExist = setInterval(waitForElement, 500);
