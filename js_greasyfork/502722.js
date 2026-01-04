// ==UserScript==
// @name        Side party
// @namespace   Violentmonkey Scripts
// @match       https://emi.dev/ck+/*
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description 05/08/2024, 18:48:28]
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502722/Side%20party.user.js
// @updateURL https://update.greasyfork.org/scripts/502722/Side%20party.meta.js
// ==/UserScript==

var pokeParty = document.createElement('div')
pokeParty.id = 'player-box'

document.getElementById('calc').appendChild(pokeParty)

var script = document.createElement('script')
script.innerHTML = 'function updateCalc() {	try {		displayCalcPokemon(document.getElementById("player"), myPoke, theirPoke, false);		displayCalcPokemon(document.getElementById("opponent"), theirPoke, myPoke, true);		var v = "";		for (var i = 0; i < box.length && i < box.length; i++) {			var img = `<img src="` + getPokeImage(box[i]) + `">`;			v += `<div onclick="setPlayer(` + i + `)">` + img + "</div>";		}				document.getElementById("player-box").innerHTML = v;		document.getElementById("opponent").getElementsByClassName("calc-team")[0].innerHTML = getEnemyTeamDisplay(enemyTeam, lastTrainer);		var extraTrainers = "";		for (var i = lastTrainer + 1; isTrainerB2b(i); i++) {			extraTrainers += `<div class="calc-team">${getEnemyTeamDisplay(data.trainers[i].team, i)}</div>`;			extraTrainers += `<div class="calc-navigation"><span>${getTrainerName(data.trainers[i].name)} </span>`;			extraTrainers += `<button onclick="focusTrainer(${i})">Stats</button> `;			extraTrainers += `<button disabled=true onclick="navigateBattle(-1)">Previous</button> `;			extraTrainers += `<button disabled=true onclick="navigateBattle(1)">Next</button> `;			extraTrainers += `</div>`		}		document.getElementById("opponent").getElementsByClassName("extra-calc-teams")[0].innerHTML = extraTrainers;	} catch(e) {		console.log(e);	}}';
document.getElementsByTagName('head')[0].appendChild(script);

GM_addStyle(`
	#player-box, #enemy-parties{
    top:100px;
    max-height: calc(100% - 200px);
    overflow-y: scroll;
    padding: 10px;
    background-color: var(--box-background);
    position:fixed;
  }
  #player-box{
    left:0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .calc-team div, #player-box div {
    background-color: var(--background);
    padding: 5px;
    margin: 2px;
  }

  .calc-team img, #player-box img {
    border-width: 3px;
    border-style: dashed;
    border-color: transparent;
  }
`
);
