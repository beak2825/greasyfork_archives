// ==UserScript==
// @name        Auto-Hatchery - pokeclicker.com
// @namespace   Pokeclicker Scripts
// @author      ildoc
// @description Auto-hatch Pokemons based on max attack and other various small QoL improvements
// @copyright   https://github.com/ildoc
// @license     GNU GPLv3
// @version     1.3.6

// @homepageURL https://github.com/ildoc/autohatchery/
// @supportURL  https://github.com/ildoc/autohatchery/issues

// @match       https://www.pokeclicker.com/
// @icon        https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/523661/Auto-Hatchery%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/523661/Auto-Hatchery%20-%20pokeclickercom.meta.js
// ==/UserScript==

const MINUTES = 2;
const QUEUESLOTS = 1500;
const INITIAL_MONEY = 1000000000;
const INITIAL_QUEST_POINTS = 1000000000;
const INITIAL_DUNGEON_TOKENS = 1000000000;
const INITIAL_DIAMONDS = 1000000000;
const INITIAL_FARM_POINTS = 1000000000;
const INITIAL_BATTLE_POINTS = 1000000000;
const INITIAL_CONTEST_TOKENS = 1000000000;

(async function waitGameReadyAndSetup(){
  while(App.game==undefined)
    await new Promise(r => setTimeout(r, 1000));
  addControls();
  setQueueDimension();
  boostInitialCurrencies();
})();

function addControls() {
  document.querySelector('#breedingDisplay > .card-header > span').insertAdjacentHTML('beforebegin', '<div>Auto <input type="checkbox" id="autohatch" onclick="event.stopPropagation()" checked /> Max DMG <input type="text" id="maxattack" onclick="event.stopPropagation()" size="8" value="'+App.game.party.pokemonAttackObservable()+'"></div>');
}

function setQueueDimension() {
  if (App.game.breeding.queueSlots() < QUEUESLOTS) {
    App.game.breeding.gainQueueSlot(QUEUESLOTS);
    console.log("Queue slots set to " + QUEUESLOTS);
  }
}

function boostInitialCurrencies() {
  let currentMoney = App.game.wallet.currencies[0]();
  let currentQuestPoints = App.game.wallet.currencies[1]();
  let currentDungeonTokens = App.game.wallet.currencies[2]();
  let currentDiamonds = App.game.wallet.currencies[3]();
  let currentFarmPoints = App.game.wallet.currencies[4]();
  let currentBattlePoints = App.game.wallet.currencies[5]();
  let currentContestTokens = App.game.wallet.currencies[6]();

  if (currentMoney < INITIAL_MONEY)
    App.game.wallet.gainMoney(INITIAL_MONEY - currentMoney, true);
  if (currentQuestPoints < INITIAL_QUEST_POINTS)
    App.game.wallet.gainQuestPoints(INITIAL_QUEST_POINTS - currentQuestPoints, true);
  if (currentDungeonTokens < INITIAL_DUNGEON_TOKENS)
    App.game.wallet.gainDungeonTokens(INITIAL_DUNGEON_TOKENS - currentDungeonTokens, true);
  if (currentDiamonds < INITIAL_DIAMONDS)
    App.game.wallet.gainDiamonds(INITIAL_DIAMONDS - currentDiamonds, true);
  if (currentFarmPoints < INITIAL_FARM_POINTS)
    App.game.wallet.gainFarmPoints(INITIAL_FARM_POINTS - currentFarmPoints, true);
  if (currentBattlePoints < INITIAL_BATTLE_POINTS)
    App.game.wallet.gainBattlePoints(INITIAL_BATTLE_POINTS - currentBattlePoints, true);
  if (currentContestTokens < INITIAL_CONTEST_TOKENS)
    App.game.wallet.gainContestTokens(INITIAL_CONTEST_TOKENS - currentContestTokens, true);
}

function checkAndHatchEggs(isEnabled) {
  if (!isEnabled) return;
  App.game.breeding.eggList.forEach((egg, index) => {
    if (egg().progress() >= 100) {
      console.log(egg().pokemon);
      App.game.breeding.hatchPokemonEgg(index);
    }
  });
}

function enqueuePokemons(isEnabled) {
  if (!isEnabled) return;

  var maxAttack = Number(document.getElementById('maxattack').value) == 0 ? App.game.party.pokemonAttackObservable() : Number(document.getElementById('maxattack').value);
  try{
    var list = App.game.party.caughtPokemon.filter(x=> !x.breeding && x.level == 100).sort((a,b) => (b.breedingEfficiency() * BreedingController.calculateRegionalMultiplier(b) - a.breedingEfficiency() * BreedingController.calculateRegionalMultiplier(a)));
    var i=0;
    while(App.game.party.pokemonAttackObservable()>=maxAttack && (App.game.breeding.hasFreeQueueSlot() || App.game.breeding.hasFreeEggSlot()) && i<list.length)
    {
      if(App.game.breeding.hasFreeEggSlot())
        App.game.breeding.addPokemonToHatchery(list[i]);
      else
        App.game.breeding.addToQueue(list[i]);

      i++;
    }
    console.log('added ' + i + ' pokemon(s) to hatchery');
  }
  catch(e){
    console.log(e);
  }
}

let autoHatchIsEnabled = false;

(function autoHatch() {

  setInterval(() => { autoHatchIsEnabled = document.getElementById('autohatch')?.checked == true; }, 10 * 1000);
    
  setInterval(() => checkAndHatchEggs(autoHatchIsEnabled), 30 * 1000);
    
  setInterval(() => enqueuePokemons(autoHatchIsEnabled), MINUTES * 60 * 1000);
})();

console.log('---Auto-Hatchery script loaded!---');
