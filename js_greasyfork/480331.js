// ==UserScript==
// @name         GC - Games Points til Max NP
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.5
// @description  Adds to games a quick reference of how many points you'll need to max out your remaining NP and how many points you'll need to get the max amount of NP in one game.
// @author       You
// @match        https://www.grundos.cafe/games/html5/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480331/GC%20-%20Games%20Points%20til%20Max%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/480331/GC%20-%20Games%20Points%20til%20Max%20NP.meta.js
// ==/UserScript==

//Set up the observer for when np changes
const npElement = document.getElementById('np_earned');
const config = { attributes: true, childList: true, subtree: true };
const gameInfo = document.querySelector('div.games-info div.bg-action')

//Get the np per points info
let npPerPointsText = gameInfo.querySelector('div:first-child span:first-child strong:nth-child(2)').textContent;

let gameBonus = Math.max(1,Number(npPerPointsText.split('×').splice(1).join('').trim()))
let npPerPoints = Number(npPerPointsText.replaceAll(/(?=NP).*/gi,'').replaceAll(',','').trim());
gameInfo.querySelector('div:first-child').insertAdjacentHTML('beforeend',`<span><strong>Points for Max NP</strong> : <strong style="color:green">${Math.ceil(60000/npPerPoints)}</strong></span>`);
gameInfo.querySelector('div:nth-child(2)').insertAdjacentHTML('beforeend',`<span id="npToEarn"></span>`)
const npToEarnElem = document.getElementById('npToEarn')
// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
      console.log(`mutation type: ${mutation.type}`);
      updatePoints();
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(npElement, config);

function updatePoints() {
    //Get max NP
    const maxNP = Number(gameInfo.querySelector('div:last-child span:first-child strong:last-child').textContent.replaceAll(',','').trim());
    //If the maxNP is 120000, that means that the comp sci bonus is active. So the gamebonus will be an additional +1 multiplier (so x2 if not featured game, x3 if featured game)
    const bonusMultiplier = gameBonus + (maxNP == 120000 ? 1 : 0);
   //Get the remaining NP to obtain
    const npRemaining = maxNP-Number(document.getElementById('np_earned').textContent.replaceAll('NP','').replaceAll(',','').trim());
    let pointsToEarn;

    if (npRemaining > 0) {
    //Points to get calculation:
    //Rounded up since I dont think any games have decimal point points.
       pointsToEarn = Math.ceil(npRemaining/(npPerPoints*bonusMultiplier))
    }
    else {
        pointsToEarn = 'All Done!'
    }
    npToEarnElem.innerHTML = `Points to NP Cap :<strong>${pointsToEarn}</strong>`;
}
updatePoints();