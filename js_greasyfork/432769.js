// ==UserScript==
// @name        Plant random berry and auto harvest - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.9
// @author      DrAK
// @description Automatically plant and harvest berries.
// @downloadURL https://update.greasyfork.org/scripts/432769/Plant%20random%20berry%20and%20auto%20harvest%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/432769/Plant%20random%20berry%20and%20auto%20harvest%20-%20pokeclickercom.meta.js
// ==/UserScript==


function loopFarm() {
  var chooseRandBerry = 0;
  var farmLoop = setInterval(function () {

    
for (let i = 0; i < 25; i++) {

  if (i == 12) 
  { 
    //leave middle empty
    App.game.farming.harvest(i, false);
    i++; 
  }

  if(App.game.farming.plotList[i].stage() == 4 && App.game.farming.plotList[i].age > (App.game.farming.plotList[i].berryData.growthTime[4] * 0.7) )
  {    
    App.game.farming.harvest(i, false);    
  }

  chooseRandBerry = Math.floor(Math.random() * (App.game.farming.highestUnlockedBerry()+0.25));
      while(!App.game.farming.unlockedBerries[chooseRandBerry]()) 
        {
          chooseRandBerry = Math.floor(Math.random() * (App.game.farming.highestUnlockedBerry()+0.25));
        }
  App.game.farming.plant(i, chooseRandBerry, false);
  
}
    
  }, 5000); 
}

loopFarm();