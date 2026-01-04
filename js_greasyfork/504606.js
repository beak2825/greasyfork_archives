// ==UserScript==
// @name         Goatlings Helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  some helpful stuff for goatlings
// @author       lucky
// @match        https://www.goatlings.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goatlings.com
// @grant        none
// @license      MIT
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/504606/Goatlings%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/504606/Goatlings%20Helper.meta.js
// ==/UserScript==

// Change to any of these to false to remove the feature.

// HUD with a few quick links on the left side of the screen.
let QuickLinks = true;

// Next/Prev buttons on user and goat profiles on the right side of the screen.
let NextPrev = true;

// Automatically insert the minimum haggle price into the box when buying an item.
let AutoHaggle = true;

// Automatically try to select options like 'use on your goat/play with goat/feed goat/equip' while viewing an item.
let SmartInteract = true;

// Automatically go through Explore and Battles when you press 1, selecting your first equipped weapon.
let KeyboardControls = true;

// Automatically skip baddies that are not goats while going through Explore.
let SkipBaddies = true;

// Search that doesn't suck
let BetterSearch = true;

// Item sort that doesn't suck
let BetterSort = true;

let page = document.location.href;
window.addEventListener('keydown', kPress);

document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

// adds a little HUD with afew buttons, you can add more into the innerHTML
function fireContentLoadedEvent () {
    var hud = document.createElement("span");
    hud.innerHTML = "<a href='https://www.goatlings.com/inventory'>Inventory</a> (<a href='https://www.goatlings.com/inventory/index/0/food'>Food</a>, <a href='https://www.goatlings.com/inventory/index/0/toy'>Toy</a>)<br><a href='https://www.goatlings.com/fountain/heal'>Heal</a>";
    hud.style = "top:10;left:10;position:fixed;z-index:9999;color:white;font-weight:bold;font-size:16px"
    if (QuickLinks) document.body.appendChild(hud);

    // Check if we're buying an item, to autohaggle
    if (page.includes("shops/viewa"))
    {
        if (AutoHaggle) autohaggle();
    }

    // Check if it's a user or pet page, to add prev/next controls
    else if (page.includes("/u/"))
    {
        if (NextPrev) prevnextbuttons();
    }

    // Viewing an item?
    else if (page.includes("inventory/view"))
    {
        // Smart dropdown select
        if (SmartInteract) itemDropDown();
    }

    if (BetterSort)
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

    if (BetterSearch)
    {
        fixSearchBar();
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

function fixedSearch(searchValue)
{
    let searchType = document.querySelector("[name='type']");
    let searchButton = document.querySelector("[value='Search']");
    searchType.value = Number(searchValue);
    searchButton.click();
}

function fixSearchBar()
{
    let searchSpecifics = document.querySelector("[name='specifics']");
    let searchDiv = document.getElementsByClassName("search-mid")[0];
    searchDiv.innerHTML += "<br><input type='button' value='Member Search'>";
    searchDiv.innerHTML += "<br><input type='button' value='Pet Search'>";



    document.querySelector("[value='Member Search']").addEventListener("click", function() {fixedSearch(1);});
    document.querySelector("[value='Pet Search']").addEventListener("click", function() {fixedSearch(2);});
    searchSpecifics.value = Number(1);
    console.log(searchSpecifics.value);
}

// find element that contains passed text, stored in variable toFind
function findText(toFind) {
  let xpath = `//a[text()='${toFind}']`;
  let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  return matchingElement;
}

// stuff that happens when you push 1
function keyboard_controls(key) {
  if (page === "https://www.goatlings.com/battle/challengers" || page === "https://www.goatlings.com/battle/train_challengers")
  {
    // If on the battle center or training center pages
    let battleButtons = document.querySelectorAll('input[type="submit" i]');
    // using key without subtracting one because the first value of the list is the search button on the sidebar
    // using the regular number skips it
    battleButtons[key].click();
  }
    else if (page === "https://www.goatlings.com/battle/thebattle")
  {
    // If in the actual battle
              window.battleItems = document.querySelectorAll(".itema");

    if (key === '1'){
      let endLink = findText("+THE BATTLE IS OVER! CLICK HERE TO FINALIZE AND CLAIM REWARDS!+");
      if (endLink) {
        endLink.click();
      } else {
        window.battleItems[0].childNodes[0].click();
      }
    }
  }
    else if (page === "https://www.goatlings.com/battle/over")
  {
      var battleButton = document.querySelector('input[value="Battle Again"]');
      var exploreLink = findText("Current Explore Adventure");
      if (key === '1'){
          if (battleButton) {
        battleButton.click();
      } else { exploreLink.click(); }
      }
  }
    else if (page === "https://www.goatlings.com/hol/view" || page === "https://www.goatlings.com/hol/go")
  {
      // higher or lower you can ALSO press 2!
      var higherButton = document.querySelector('input[value="Higher"]');
      var lowerButton = document.querySelector('input[value="Lower"]');
      var playAgain = document.querySelector('input[value="Play Again"]');
      var getPot = document.querySelector('input[value="Collect Pot"]');
      if (key === '1'){
          if (higherButton) {
        higherButton.click();
      } else playAgain.click();
      }
      if (key === '2'){
          if (lowerButton) {
        lowerButton.click();
      } else getPot.click();
      }
  }
    else if (page.includes("explore/view"))
    {
      var battleButton = findText("Start Battle");
      var runButton = findText("Run Away");
      var exploreAgain = findText("Explore Again!")
      var exploreButton = document.evaluate("/html/body/div/div[4]/center/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      var enemyPic = document.evaluate("/html/body/div/div[4]/center/a[2]/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (key === '1'){
            if (exploreAgain) {
            exploreAgain.click();
            }
            // Are we seeing a monster?
            else if (enemyPic) {
            // Do we WANT to fight it? Probably not.
                var baddyName = String(enemyPic.src);
                console.log(baddyName);
                if (baddyName.includes('Baddy') || baddyName.includes('2.gif') || baddyName.includes('3.gif') )
                    {
                      battleButton.click();
                    }
                else {

                    if (SkipBaddies) runButton.click();
                    else battleButton.click();
                }

            }
            else {exploreButton.click();}

      }
    }
}

function autohaggle()
{
        let input = document.querySelector("[name='offer']")
        let price = input.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;

        if (price.includes(","))
            {
            price = price.replace(",","");
            }
        if (price.includes(","))
            {
            price = price.replace(",","");
            }
         let number = Number(price);
        number = number * 0.8;
        input.value = number;
}

function prevnextbuttons()
{
    // Style and attach the box for links
    var hud = document.createElement("span");
    hud.style = "top:10;right:10;position:absolute;z-index: 9999;color:white;font-weight:bold;font-size:16px"

    document.body.appendChild(hud);

        // Split to get the ID
       let id = page.split('/u/');

        // Remove any trailing /
        if (id[1].includes("/"))
            {
            id[1] = id[1].replace("/","");
            }

        // Turn into a number
        let number = Number(id[1]);

        // Create our links and a separator!
        hud.innerHTML += "<a href='" + id[0] + "/u/" + String(number-1) + "'>Previous</a>";
        hud.innerHTML += " - ";
        hud.innerHTML += "<a href='" + id[0] + "/u/" + String(number+1) + "'>Next</a>";
}

function itemDropDown()
{
    let input = document.querySelector("[name='option']");
    let selection = document.querySelector("#option > [value='7']");

    // Use on goatling
    if (selection)
    {
        input.value = 7;
    }

    // Play with goatling
    selection = document.querySelector("#option > [value='4']");

    if (selection)
    {
        input.value = 4;
    }

    // Equip
    selection = document.querySelector("#option > [value='16']");

    if (selection)
    {
        input.value = 16;
    }

    // Feed
    selection = document.querySelector("#option > [value='1']");

    if (selection)
    {
        input.value = 1;
    }





}

function kPress(e) {
  if (KeyboardControls) keyboard_controls(e.key);
  }