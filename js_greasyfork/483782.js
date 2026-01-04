// ==UserScript==
// @name         Auto Battle Frontier
// @namespace    http://tampermonkey.net/
// @version      2024-01-12
// @description  Reset Pokeclicker Battle Frontier automatically after it finishes
// @author       You
// @match        https://www.pokeclicker.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483782/Auto%20Battle%20Frontier.user.js
// @updateURL https://update.greasyfork.org/scripts/483782/Auto%20Battle%20Frontier.meta.js
// ==/UserScript==

//EffectEngineRunner.addEffect("Lucky_egg", 10000)
//['xAttack', 'xClick', 'Lucky_egg', 'Token_collector', 'Dowsing_machine', 'Lucky_incense']
//for (const el of Object.keys(ItemList).filter(i=>ItemList[i].constructor.name == 'BattleItem')){EffectEngineRunner.addEffect(el, 10000)}

//BattleFrontierRunner.checkpoint(768)

//Safari.moveSpeed = #default 250
//SafariBattle.Speed = #default ballthrowanim 700

//$('#purifyChamberModal').modal('show');

//GameHelper.incrementObservable(App.game.statistics.routeKills[player.region][Battle.route], 10000);

//App.game.wallet.gainBattlePoints(100000);

//App.game.pokeballs.gainPokeballs(12, 50000, false);

const allItems = Object.keys(ItemList).filter(i=>ItemList[i].constructor.name == 'BattleItem');

var intervalPokeballs;

intervalPokeballs = setInterval(function(){
 if (App.game !== undefined){
        App.game.pokeballs.pokeballs[2].catchTime = 100; //ultraball
        App.game.pokeballs.pokeballs[2].catchBonus = () => 100;
        App.game.pokeballs.pokeballs[12].catchTime = 100; //repeatball
        App.game.pokeballs.pokeballs[12].catchBonus = () => 100;
        App.game.pokeballs.pokeballs[13].catchTime = 100; //beastball
        App.game.pokeballs.pokeballs[13].catchBonus = () => 100;
        clearInterval(intervalPokeballs);
    }
}, 10000);


$(document).on('keydown', e => {
    if (e.key == 'n'){
        $('#purifyChamberModal').modal('show');
    }
    if (e.key == 'v'){
        $('#ShipModal').modal('show');
    }
    if (e.key == 'x'){
        $('#dreamOrbsModal').modal('show');
    }
})

var intervalId = setInterval(function(){
  if (App.game && App.game.gameState === GameConstants.GameState.battleFrontier && !BattleFrontierRunner.started()){
      BattleFrontierRunner.start(true);
  }
}, 10000);