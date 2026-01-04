// ==UserScript==
// @name         Calculate Warehouse and Granary Total Capacity Size
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hover over each cell in descending order - first warehouses then granaries, only once for each warehouse total, not three times (wood only for example). Press "Enter" when hovered.
// @author       Luvaboy
// @grant GM_addStyle
// @license MIT
// @match        https://ts8.x1.america.travian.com/village/statistics/warehouse
// @downloadURL https://update.greasyfork.org/scripts/454701/Calculate%20Warehouse%20and%20Granary%20Total%20Capacity%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/454701/Calculate%20Warehouse%20and%20Granary%20Total%20Capacity%20Size.meta.js
// ==/UserScript==

var decode = (html) => {
    // We need to split the string at the "/" and take the last element
    // Decode the HTML entities
    let text = html.split("/")[1];

    return Number(text.replace(/\D/g, ""));
};

var numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

(function () {
    "use strict";

    // Retrieve every class name that contains "vil fc"
    var vilFc = document.getElementsByClassName("vil fc");

    // For each element, take the outerHTML of the child "a" element and store it in an array
    var vilFcArray = [];
    for (var i = 0; i < vilFc.length; i++) {
        vilFcArray.push(vilFc[i].children[0].innerHTML);
    }

    // We will now expect vilFcArray.length inputs twice, one respective to the warehouse and one respective to the granary
    // We will then wait for the user to hit the "Enter" key once hovering over an element
    // Once they hit the "Enter" key, we need to find the class "tippy-content" and take the innerHTML of its child class "text"
    // That value is then stored in an array and we wait for the next input

    // Create an array to store the values
    var warehouseArray = [];
    var granaryArray = [];

    // Create a counter to keep track of the number of inputs
    var counter = 0;

    // Find the warehouse table element
    var warehouseTable = document.getElementById("warehouse");

    // Append a div below warehouseTable to display the expected next input from vilFcArray
    var div = document.createElement("div");

    function calcNextInput(c, type) {
        div.innerHTML = `Expecting input next from: <b>${
            vilFcArray[!warehouseInputsReceived ? c : c - vilFcArray.length]
        }</b> (${type}) - use "Enter" to capture`;
        div.style.padding = "10px";
    }
    calcNextInput(counter, "Warehouse");

    warehouseTable.parentNode.insertBefore(div, warehouseTable.nextSibling);

    var warehouseInputsReceived = false;

    // Listen for the user to hit the "Enter" key
    // prettier-ignore
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Retrieve the value of the input
            let tippyContent = document.getElementsByClassName("tippy-content")[0];
            let text = tippyContent.getElementsByClassName("text")[0];

            let value = decode(text.innerText);

            // if the counter has passed the total length of vilFcArray, we have all the values we need for warehouse, we can start storing the granary values
            if (counter >= vilFcArray.length) {
                granaryArray.push({ name: vilFcArray[counter], value });
            } else {
                warehouseArray.push({ name: vilFcArray[counter], value });
            }

            // Increment the counter
            counter++;

            // log both
            console.log("warehouseArray", warehouseArray);
            console.log("granaryArray", granaryArray);

            if (counter === vilFcArray.length) {
                // we've received warehouse inputs, set a bool
                warehouseInputsReceived = true;
            }

            // if counter === vilFcArray.length * 2, we have all the values we need for warehouse and granary, log the result
            if (counter === vilFcArray.length * 2) {
                // Calculate the total warehouse capacity
                let warehouseTotal = 0;
                for (let i = 0; i < warehouseArray.length; i++) {
                    warehouseTotal += warehouseArray[i].value;
                }

                // Calculate the total granary capacity
                let granaryTotal = 0;
                for (let i = 0; i < granaryArray.length; i++) {
                    granaryTotal += granaryArray[i].value;
                }

                // Display the result
                div.innerHTML = `Warehouse Total: <b>${numberWithCommas(warehouseTotal * 3)}</b> Granary Total: <b>${numberWithCommas(granaryTotal)}</b>`;
            } else calcNextInput(counter, counter >= vilFcArray.length ? "Granary" : "Warehouse");
        }
    });
})();
