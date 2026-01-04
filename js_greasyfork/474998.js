// ==UserScript==
// @name         FreshnLean Summary
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Summarizes and sort the meal options
// @author       vbomedeiros
// @match        https://www.freshnlean.com/menu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freshnlean.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474998/FreshnLean%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/474998/FreshnLean%20Summary.meta.js
// ==/UserScript==

(function() {
	const dataPopups = document.querySelectorAll(".entree-section .popup-data");

	const listOfMealsTable = document.createElement("table");
	listOfMealsTable.setAttribute("style", "margin-bottom:30px");

	const listOfMealsHeader = document.createElement("tr");
	const headers = [
	  "Name",
	  "Calories",
	  "Protein",
	  "Protein %",
	  "Carbs",
	  "Carbs %",
	  "Fat",
	  "Fat %",
	];
	headers.forEach(function(headerName) {
	  const headerCell = document.createElement("th");
	  headerCell.textContent = headerName;
	  headerCell.setAttribute("style", "padding:5px");
	  listOfMealsHeader.appendChild(headerCell);
	});
	listOfMealsTable.appendChild(listOfMealsHeader);

	const entries = [];

	let countProtein = 0;
	for (let i = 0; i < dataPopups.length; i++) {
	  const popup = dataPopups[i];
	  if (popup.getAttribute("data-mealclass") != "protein") {
	    continue;
	  }
	  ++countProtein;

	  entries.push({
	    title : popup.getAttribute("data-mealtitle"),
	    calories : popup.getAttribute("data-calories"),
	    protein : popup.getAttribute("data-protein"),
	    carbs : popup.getAttribute("data-carbs"),
	    fat : popup.getAttribute("data-fat"),
	  });
	}

	entries.sort((a, b) => {
	  return (a.fat/a.calories) - (b.fat/b.calories);
	});

	const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
	for (let i = 0; i < entries.length; i++) {
	  const entry = entries[i];

	  const values = [
	    entry.title,
	    entry.calories,
	    entry.protein,
	    formatter.format((entry.protein * 4) / entry.calories),
	    entry.carbs,
	    formatter.format((entry.carbs * 4) / entry.calories),
	    entry.fat,
	    formatter.format((entry.fat * 9) / entry.calories),
	  ];

	  const mealRow = document.createElement("tr");
	  values.forEach(function(valueData) {
	    const valueCell = document.createElement("td");
	    valueCell.setAttribute("style", "padding:5px");
	    valueCell.textContent = valueData;
	    mealRow.appendChild(valueCell);
	  });
	  listOfMealsTable.appendChild(mealRow);

	}

	const listOfMealsDiv = document.createElement("div");
	listOfMealsDiv.insertAdjacentElement("beforeend", listOfMealsTable);

	const container = document.querySelector("#protein");
	container.insertAdjacentElement("afterbegin", listOfMealsDiv);

})();