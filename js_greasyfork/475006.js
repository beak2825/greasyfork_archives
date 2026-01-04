// ==UserScript==
// @name         Trifecta Summary
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Summarizes and sort the meal options
// @author       vbomedeiros
// @match        https://shop.trifectanutrition.com/meal-choice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trifectanutrition.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475006/Trifecta%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/475006/Trifecta%20Summary.meta.js
// ==/UserScript==

(function() {
    //console.log("Starting Trifecta Summary");

    function mainFunction() {
        //console.log("Main Function");
		// Function to get the React Fiber node from a DOM node
		function getFiberFromDOMNode(node) {
		    for (let key in node) {
		        if (key.startsWith("__reactFiber$")) {
		            return node[key];
		        }
		    }
		    return null;
		}

		// Recursive function to traverse the Fiber tree and find all components by a specific prop
		function findComponentsByProp(fiber, propName) {
		    let matches = [];

		    if (fiber.memoizedProps && fiber.memoizedProps.hasOwnProperty(propName)) {
		        matches.push(fiber);
		    }

		    if (fiber.child) {
		        matches = matches.concat(findComponentsByProp(fiber.child, propName));
		    }

		    if (fiber.sibling) {
		        matches = matches.concat(findComponentsByProp(fiber.sibling, propName));
		    }

		    return matches;
		}

		// Find the Fiber node for the root DOM element
		const rootFiber = getFiberFromDOMNode(document.querySelector(".meal-choice-meals"));

		// Search for all components with the "mealData" prop
		const componentsFibers = findComponentsByProp(rootFiber, 'mealData');

		// Access props
		const componentsProps = componentsFibers.map(fiber => fiber.memoizedProps);
		//console.log(componentsProps);

		const entries = [];

		for (let i = 0; i < componentsProps.length; i++) {
		  const props = componentsProps[i];

		  entries.push({
		    title : props.mealData.name,
		    calories : props.mealData.calories,
		    protein : props.mealData.protein_g,
		    carbs : props.mealData.carbohydrates_g,
		    fat : props.mealData.fat_g,
		  });
		}

		entries.sort((a, b) => {
		  return a.calories - b.calories;
		});
		//console.log(entries);

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

		const container = document.querySelector("#meal-choice-app .container");
		container.insertAdjacentElement("afterbegin", listOfMealsDiv);
    }

    function waitForReact() {
        //console.log("wait for react");
        // Your condition for React being "done"
        // This example checks if an element with the ID "react-loaded-marker" exists
        if (document.querySelector(".meal-choice-meals")) {
            //console.log("got it!");
            // Execute your Tampermonkey script functionality here
            mainFunction();
        } else {
            //console.log("not yet!");
            setTimeout(function() {
                waitForReact();
            }, 1000); // Check every second
        }
    }

    waitForReact();


})();