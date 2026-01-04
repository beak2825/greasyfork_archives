// ==UserScript==
// @name        New script hzla.github.io
// @namespace   Violentmonkey Scripts
// @match       https://hzla.github.io/Dynamic-Calc/*
// @grant       GM_addStyle
// @version     1.1
// @author      -
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @description 27/08/2024, 13:23:14
// @downloadURL https://update.greasyfork.org/scripts/505487/New%20script%20hzlagithubio.user.js
// @updateURL https://update.greasyfork.org/scripts/505487/New%20script%20hzlagithubio.meta.js
// ==/UserScript==

var leftTable = $('table')[0].rows
var rightTable = $('table')[2].rows

var c = leftTable[0].cells[3].classList
c.add("evs")

leftTable[7].insertCell(-1)
leftTable[7].cells[7]

var c2 = rightTable[0].cells[3].classList
c2.add("evs")

var blocks = $('.info-selectors')
// for(var i = 0; i < 2; i++){
  var speedIcon = document.createElement('img')
  speedIcon.className = 'speed-icon'
  blocks.append(speedIcon)
// }

// console.log('' + performCalculations)

function performCalculations() {
	var p1info = $("#p1");
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p2 = createPokemon(p2info);
	var p1field = createField();
	var p2field = p1field.clone().swap();





	damageResults = calculateAllMoves(damageGen, p1, p1field, p2, p2field);
	p1 = damageResults[0][0].attacker;
	p2 = damageResults[1][0].attacker;
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];


	if ($('#SpeL').prop('checked')) {
		p1.stats.spe = Math.floor(p1.stats.spe * 1.1);
		p1info.find(".sp .totalMod").css('color', '#bd93f9');
	} else {
		p1info.find(".sp .totalMod").attr('style', '');
	}

	p1info.find(".sp .totalMod").text(p1.stats.spe);

	p2info.find(".sp .totalMod").text(p2.stats.spe);
	var fastestSide = p1.stats.spe > p2.stats.spe ? 0 : p1.stats.spe === p2.stats.spe ? "tie" : 1;

	var result, maxDamage;
	var bestResult;
	var zProtectAlerted = false;
	var is100 = false;

	for (var i = 0; i < 4; i++) {
		// P1
		result = damageResults[0][i];
		maxDamage = result.range()[1] * p1.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p1.item.indexOf(" Z") === -1 && p1field.defenderSide.isProtected && p1.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p1.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p1.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));

		if(p1.moves[i].category == 'Status' && result.moveDesc(notation).split("(")[0] == '0 - 0%'){
			$(resultLocations[0][i].damage).text('Status');
		}
		else{

			$(resultLocations[0][i].damage).text(result.moveDesc(notation));

			if (["Avalanche", "Payback", "Assurance", "Revenge", "Retaliate", "Stomping Tantrum"].indexOf(p1.moves[i].name) != -1) {
				$(resultLocations[0][i].damage).text(result.moveDesc(notation) + " (can double power)");
			}
		}

		// P2
		result = damageResults[1][i];
		maxDamage = result.range()[1] * p2.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p2.item.indexOf(" Z") === -1 && p2field.defenderSide.isProtected && p2.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p2.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p2.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		if(p2.moves[i].category == 'Status' && result.moveDesc(notation).split("(")[0] == '0 - 0%'){
			$(resultLocations[1][i].damage).text('Status');
		}
		else{$(resultLocations[1][i].damage).text(result.moveDesc(notation));}

		var dmgInfo = $(resultLocations[1][i].damage).text();


		if (moveProbabilities[i] != 0) {

			if (!is100) {
				var probability = '  \(' + (Math.round(moveProbabilities[i] * 1000) / 10).toString() + '% top roll\)';
				if (moveProbabilities[i] == 1) {
					is100 = true;
				}
				$(resultLocations[1][i].damage).text(dmgInfo + probability)
			}
		}

		if (["Avalanche", "Payback", "Assurance", "Revenge", "Retaliate", "Stomping Tantrum"].indexOf(p2.moves[i].name) != -1) {
			$(resultLocations[1][i].damage).text($(resultLocations[1][i].damage).text()+ " (can double power)");
		}




		// BOTH
		var bestMove;
		if (fastestSide === "tie") {
			// Technically the order should be random in a speed tie, but this non-determinism makes manual testing more difficult.
			// battling.sort(function () { return 0.5 - Math.random(); });
			bestMove = battling[0].maxDamages[0].moveOrder;
			var chosenPokemon = battling[0] === p1 ? "0" : "1";
			bestResult = $(resultLocations[chosenPokemon][bestMove].move);
			$('.speed-icon').attr('src', "https://github.com/AFalsePrayer/gen3-calc/blob/master/src/img/speed-tie.png?raw=true");
		} else {
			bestMove = battling[fastestSide].maxDamages[0].moveOrder;
			bestResult = $(resultLocations[fastestSide][bestMove].move);
			$('.speed-icon')[1 - fastestSide].src = "https://github.com/AFalsePrayer/gen3-calc/blob/master/src/img/speed-slower.png?raw=true";
			$('.speed-icon')[fastestSide].src = "https://github.com/AFalsePrayer/gen3-calc/blob/master/src/img/speed-faster.png?raw=true"
		}
	}
	if ($('.locked-move').length) {
		bestResult = $('.locked-move');
	} else {
		stickyMoves.setSelectedMove(bestResult.prop("id"));
	}
	bestResult.prop("checked", true);
	bestResult.change();
	$("#resultHeaderL").text(p1.name + "'s Moves (select one to show detailed results)");
	$("#resultHeaderR").text(p2.name + "'s Moves (select one to show detailed results)");
}

var script = document.createElement('script');
script.innerHTML = '' + performCalculations

document.getElementsByTagName('head')[0].appendChild(script);

GM_addStyle('td:has(.evs){display:none !important;} .evs{display:none !important;} table{width: 60%;  text-align: center;} .speed-icon{width:40px;margin:20px;}')