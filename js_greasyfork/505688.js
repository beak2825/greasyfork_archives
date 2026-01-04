// ==UserScript==
// @name         Goatlings Better Item Movement
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  a better item sorter
// @author       lucky zelle
// @match        https://www.goatlings.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goatlings.com
// @grant        none
// @license      MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/505688/Goatlings%20Better%20Item%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/505688/Goatlings%20Better%20Item%20Movement.meta.js
// ==/UserScript==

let page = document.location.href;

window.onload = function main()
{
    if (page.includes("itemsorter"))
    {
        fixedSort();
    }
    else if (page.includes("storage"))
    {
        // Item storage!
        fixedStorage();
    }
    else if (page.includes("usershop/index"))
    {
        // User shops!
        fixedShops();
    }

    else if (page.includes("gallery/index"))
    {
        // User shops!
        fixedGallery();
    }
}

function fixedStorage()
{
    // find remove boxes
    let inputs = document.querySelectorAll("td input");
    if (inputs.length > 0)
    {
        // Find maximums for all items
        let details = document.querySelectorAll("tr > td:nth-child(2) > center");
        // change type to number instead of text so you get up/down arrows
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].type = "number";
            inputs[i].max = details[i].innerHTML;
            inputs[i].min = 0;
        }
    }

    let header = document.querySelector("td:nth-child(5) b");
    header.innerHTML = "";
    header.appendChild(makeNewButton("remove", "MIN", "-9999"));
    header.appendChild(makeNewButton("remove", "-1", "-1"));
    header.appendChild(makeNewButton("remove", "+1", "1"));
    header.appendChild(makeNewButton("remove", "MAX", "9999"));


}

function fixedSort()
{
    // find sort boxes
    let inputs = document.querySelectorAll("td input");
    if (inputs.length > 0)
    {
        // change type to number instead of text so you get up/down arrows
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].type = "number";
        }
    }

    // Find maximums for all items
    let details = document.querySelectorAll("tr > td:nth-child(1) > center");
    if (details.length > 0)
    {
        // Find inputs in this row
        for (let i = 1; i < details.length; i++) {

            inputs = document.querySelectorAll("tr:nth-child(" + (i + 3) + ") > td input");
            if (inputs.length > 0)
            {
                // set max to stock
                for (let x = 0; x < inputs.length; x++) {
                    inputs[x].max = details[i].innerHTML.split('Stock:')[1].trim();
                    inputs[x].min = 0;
                    // the sort page behaves kinda funny if there are leftover 0s in anything, so this replaces them with an empty string
                    inputs[x].oninput = function() { if (this.value == '0') this.value = ''; };
                }
            }
        }
    }

    // find headers for each type
    let headerbuttons = document.querySelectorAll(".table-header td center b");
    if (headerbuttons.length > 0)
    {
        // add event listeners
        for (let i = 1; i < headerbuttons.length; i++) {
            var sort_type = headerbuttons[i].innerHTML.trim().toLowerCase();
            headerbuttons[i].innerHTML += "<br>";
            headerbuttons[i].appendChild(makeNewButton(sort_type, "MIN", "-9999"));
            headerbuttons[i].appendChild(makeNewButton(sort_type, "-1", "-1"));
            headerbuttons[i].appendChild(makeNewButton(sort_type, "+1", "1"));
            headerbuttons[i].appendChild(makeNewButton(sort_type, "MAX", "9999"));
        }
    }

}

function fixedShops()
{
    // find sort boxes
    let inputs = document.querySelectorAll("td:nth-child(6) input");
    if (inputs.length > 0)
    {
        // Find maximums for all items
        let details = document.querySelectorAll("tr > td:nth-child(3) > center");
        // change type to number instead of text so you get up/down arrows
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].type = "number";
            inputs[i].max = details[i].innerHTML;
            inputs[i].min = 0;
        }
    }

    let header = document.querySelector("td:nth-child(6) b");
    header.innerHTML = ""
    header.parentNode.style += "padding-right:5; width: 13%;";
    header.appendChild(makeNewButton("remove", "MIN", "-9999"));
    header.appendChild(makeNewButton("remove", "-1", "-1"));
    header.appendChild(makeNewButton("remove", "+1", "1"));
    header.appendChild(makeNewButton("remove", "MAX", "9999"));
}

function fixedGallery()
{
    // find sort boxes
    let inputs = document.querySelectorAll("td:nth-child(6) input");
    if (inputs.length > 0)
    {
        // Find maximums for all items
        let details = document.querySelectorAll("td:nth-child(2) > center");
        console.log(details);
        // change type to number instead of text so you get up/down arrows
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].type = "number";
            inputs[i].max = details[i].innerHTML;
            inputs[i].min = 0;
        }
    }

    let header = document.querySelector("td:nth-child(6) b");
    header.innerHTML = ""
    header.parentNode.style += "padding-right:5; width: 13%;";
    header.appendChild(makeNewButton("remove", "MIN", "-9999"));
    header.appendChild(makeNewButton("remove", "-1", "-1"));
    header.appendChild(makeNewButton("remove", "+1", "1"));
    header.appendChild(makeNewButton("remove", "MAX", "9999"));

    // While we're here, let's set ordering to a number input too, but
}

function makeNewButton(sort_type, new_value, new_name)
{
    var new_button = document.createElement("input");
    new_button.type = "button";
    new_button.style = "font-size: 75%; margin: 1; padding: 1;"
    new_button.id = sort_type;
    new_button.value = new_value;
    new_button.name = new_name;
    new_button.onclick = function() {sortAll(this.id, this.name);}
    return new_button;
}

function sortAll(sort_type, amount)
{

    if (sort_type == "remove")
    {
        // We're on a page with only one set of boxes to deal with. Act accordingly.
        let inputs = document.querySelectorAll("td input");
        if (inputs.length > 0)
        {
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].type == 'number')
                {
                    let prev_input = Number(inputs[i].value);
                    inputs[i].value = prev_input + Number(amount);
                    if (prev_input + Number(amount) < inputs[i].min) inputs[i].value = 0;
                    else if (prev_input + Number(amount) > inputs[i].max) inputs[i].value = inputs[i].max;
                }

            }
        }
    }
    else
    {
        // Item sort page
        // Zero other inputs
        let inputs = document.querySelectorAll("input");
        if (inputs.length > 0)
        {
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].class != sort_type && inputs[i].type == 'number' && inputs[i].value != '') inputs[i].value = '';
            }
        }

        inputs = document.querySelectorAll("td ." + sort_type);
        if (inputs.length > 0)
        {
            // change type to number instead of text so you get up/down arrows
            for (let i = 0; i < inputs.length; i++) {
                let prev_input = Number(inputs[i].value);
                inputs[i].value = prev_input + Number(amount);
                if (prev_input + Number(amount) < inputs[i].min) inputs[i].value = '';
                else if (prev_input + Number(amount) > inputs[i].max) inputs[i].value = inputs[i].max;
            }
        }
    }

   
}


window.check_item = function () {

    // Overriding check_item to work with our new amount of boxes :)
    var elements = document.querySelectorAll("input");
	var flag = 0;
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].outerHTML.includes('donate') && elements[i].outerHTML.includes('item') && elements[i].value != '')
        {
            flag = 1;
        }

	}

	if(flag) {
		return confirm("Are you sure you want to donate these items? This cannot be undone!");
	}
  };