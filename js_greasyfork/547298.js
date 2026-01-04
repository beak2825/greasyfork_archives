// ==UserScript==
// @name         [GC][Backup] - Virtupets.net Quest Calculator
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @grant        GM.getValue
// @grant        GM.setValue
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @version      1.2.0
// @license      MIT
// @description  Calculate cost of quests using Virtupets API without having to check each item and do mental math. Staff approved script via ticket.
// @author       Cupkait
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/547298/%5BGC%5D%5BBackup%5D%20-%20Virtupetsnet%20Quest%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/547298/%5BGC%5D%5BBackup%5D%20-%20Virtupetsnet%20Quest%20Calculator.meta.js
// ==/UserScript==


const path = window.location.pathname;

async function fetchQuestData(questDiv) {
  const questList = document.querySelectorAll('.quest_text').length > 0
    ? document.querySelectorAll('.quest_text')
    : document.querySelectorAll('.quest-item').length > 0
      ? document.querySelectorAll('.quest-item')
      : document.querySelectorAll('.centered-item');

  // Extract items in their original order, preserving duplicates
  const questArray = Array.from(questList).map(item => item.querySelector('strong').textContent);

  // Get unique items for API call
  const uniqueItems = [...new Set(questArray)];

  try {
    const response = await bulkShopWizardPrices(uniqueItems);
    const data = await response.json();

    // Convert API data to a map for easier lookup
    const priceMap = {};
    data.forEach(item => {
      priceMap[item.name] = {
        price: item.price,
        time: item.time
      };
    });

    // Create table with original order and proper counting of duplicates
    const tableHTML = createTableHTML(questArray, priceMap);
    questDiv.innerHTML = tableHTML;
  } catch (error) {
    console.error('Error:', error);
    questDiv.innerHTML = `<p>Error fetching quest data. Please try again later.</p>`;
  }
}

function createTableHTML(orderedItems, priceMap) {
  let tableHTML = '<table><tr><th colspan="4" style="background-color: #4abdb8; font-size: 16px;"><strong>Virtupets.net Quest Calculator</strong></th></tr>';
  tableHTML += '<tr><th>Item Name</th><th>Quantity</th><th>Price Each</th><th>Date Priced</th></tr>';

  let totalPrice = 0;

  // Create a map to track items we've already added to the table
  const itemsInTable = new Map();

  // Process items in their original order
  orderedItems.forEach(itemName => {
    const itemData = priceMap[itemName];
    if (!itemData) return; // Skip if no price data found

    const date = new Date(itemData.time);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    // Each occurrence of the item contributes to the total price
    totalPrice += itemData.price;

    // If we've already added this item to the table in its original order position
    if (itemsInTable.has(itemName)) {
      // Update quantity
      const existingRow = itemsInTable.get(itemName);
      existingRow.quantity += 1;
      existingRow.totalItemPrice += itemData.price;
    } else {
      // Add new item to tracking
      itemsInTable.set(itemName, {
        name: itemName,
        quantity: 1,
        priceEach: itemData.price,
        totalItemPrice: itemData.price,
        date: formattedDate
      });
    }
  });

  // Add rows to table in original order
  for (const itemName of orderedItems) {
    // Only add each unique item once
    if (itemsInTable.has(itemName)) {
      const item = itemsInTable.get(itemName);
      tableHTML += `<tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.priceEach.toLocaleString()} NP</td>
        <td>${item.date}</td>
      </tr>`;

      // Remove the item so we don't add it again
      itemsInTable.delete(itemName);
    }
  }

  tableHTML += `<tr><td colspan="3"><strong>Total Estimated Cost: ${totalPrice.toLocaleString()} NP</strong></td><td></td></tr>`;
  tableHTML += '</table><span class="disclaimer">Prices always subject to change. To update an outdated price, download <a href="https://greasyfork.org/en/scripts/490596-gc-virtupets-data-collector">this script</a> before searching it on the Shop Wizard. Report errors or suggestions to @Cupkait!</span>';
  return tableHTML;
}

function appendQuestDiv(anchor) {
  const questDiv = document.createElement('div');
  questDiv.classList.add('quest-div');
  anchor.append(questDiv);
  return questDiv;
}

if (path.includes('/accept/')) {
  const anchor = document.querySelector('.itemList').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else if (path.includes('/complete/') && document.querySelector('#page_content .flex-column').textContent.includes("Deadline")) {
  const anchor = document.querySelector('#quest_grid').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else if (path.includes('/complete/')) {
  // do nothing, all done!

} else if (path.includes('/snowfaerie/')) {
  const anchor = document.querySelector('#taelia_grid').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else {
  const anchor = document.querySelector('.itemList').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);
}

const questStyle = document.createElement('style');
questStyle.innerHTML = `
.quest-div {
  display: grid;
  border: 2px solid black;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  }

.quest-div td {
  padding: 5px;
}

.disclaimer {
font-style:italic;
font-size:10px;
margin-top:-5px;
margin-bottom:2px;
padding-left:10%;
padding-right:10%;
}
`;

document.body.append(questStyle);