// ==UserScript==
// @name        Auto Hatchery - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Automatically hatches eggs at 100% completion. Then uses the sorting and filters from the Hatcher to fill it with the best remaining Pokémon.
// @downloadURL https://update.greasyfork.org/scripts/445628/Auto%20Hatchery%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/445628/Auto%20Hatchery%20-%20pokeclickercom.meta.js
// ==/UserScript==
var hatcheryAutomationEnabled = true;
var node = document.createElement('div');
node.classList.add('card');
-node.classList.add('mb-3');
node.innerHTML = '<div id="scriptHatcheryAutomation" class="card-header"><span>Hatchery</span></div><div id="clickBody" class="card-body"><button id="toggleHatchery" class="btn btn-success" type="button">'
               + 'Hatchery Automation Enabled</button></div>'

node.setAttribute('id', 'hatcheryContainer');
document.getElementById('left-column').appendChild(node);
document.getElementById('toggleHatchery').addEventListener('click', ToggleHatcheryAutomation, false);

function ToggleHatcheryAutomation(){
    hatcheryAutomationEnabled = !hatcheryAutomationEnabled;
    var button = document.getElementById('toggleHatchery');
    if (!hatcheryAutomationEnabled) {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.innerText = 'Hatchery Automation Disabled';
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        button.innerText = 'Hatchery Automation Enabled';
    }
}

function loopEggs() {
  var eggLoop = setInterval(function () {
      if (hatcheryAutomationEnabled) {
    // Attempt to hatch each egg. If the egg is at 100% it will succeed
    [0, 1, 2, 3].forEach((index) => App.game.breeding.hatchPokemonEgg(index));

    // Now add eggs to empty slots if we can
    while (
      App.game.breeding.canBreedPokemon()  // Helper in code to do this.
    ) {
      // Filter the sorted list of Pokemon based on the parameters set in the Hatchery screen
      let filteredEggList = App.game.party.caughtPokemon.filter(
        (partyPokemon) => {
          // Only breedable Pokemon
          if (partyPokemon.breeding || partyPokemon.level < 100) {
            return false;
          }
          // Check based on category
          if (BreedingController.filter.category() >= 0) {
            if (
              partyPokemon.category !== BreedingController.filter.category()
            ) {
              return false;
            }
          }
          // Check based on shiny status
          if (BreedingController.filter.shinyStatus() >= 0) {
            if (
              +partyPokemon.shiny !== BreedingController.filter.shinyStatus()
            ) {
              return false;
            }
          }
          // Check based on native region
          if (BreedingController.filter.region() > -2) {
            if (
              PokemonHelper.calcNativeRegion(partyPokemon.name) !==
              BreedingController.filter.region()
            ) {
              return false;
            }
          }
          // Check if either of the types match
          const type1 =
            BreedingController.filter.type1() > -2
              ? BreedingController.filter.type1()
              : null;
          const type2 =
            BreedingController.filter.type2() > -2
              ? BreedingController.filter.type2()
              : null;
          if (type1 !== null || type2 !== null) {
            const { type: types } = pokemonMap[partyPokemon.name];
            if ([type1, type2].includes(PokemonType.None)) {
              const type = type1 == PokemonType.None ? type2 : type1;
              if (!BreedingController.isPureType(partyPokemon, type)) {
                return false;
              }
            } else if (
              (type1 !== null && !types.includes(type1)) ||
              (type2 !== null && !types.includes(type2))
            ) {
              return false;
            }
          }
          return true;
        }
      );

        if(App.game.breeding.canBreedPokemon()) {
            App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
            console.log("Added " + filteredEggList[0].name + " to the Hatchery!");
        }
    }
  }
  }, 50); // Runs every game tick
}

function waitForLoad(){
    var timer = setInterval(function() {
        if (!document.getElementById("game").classList.contains("loading")) {
            // Check if the game window has loaded
            clearInterval(timer);
            loopEggs();
        }
    }, 200);
}

waitForLoad();