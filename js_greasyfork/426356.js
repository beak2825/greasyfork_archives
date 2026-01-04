// ==UserScript==
// @name         OnlineLiga Calculate Lineup-Values
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  Berechnet die Spielerwerte der Aufstellungsseite neu
// @author       arthurbecs
// @match        https://www.onlineliga.de/*
// @match        https://www.onlineliga.at/*
// @match        https://www.onlineliga.ch/*
// @match        https://www.onlineleague.co.uk/*
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426356/OnlineLiga%20Calculate%20Lineup-Values.user.js
// @updateURL https://update.greasyfork.org/scripts/426356/OnlineLiga%20Calculate%20Lineup-Values.meta.js
// ==/UserScript==
 
/*********************************************
 * 0.1 		12.05.2021 	Release
 * 0.2 		21.05.2021 	+ Console für die Gewichtungseinstellung
 * 				+ Fremdpositionsstärke
 * 0.3	 	24.05.2021	+ Hotfix
 * 0.4		28.05.2021	+ 100% Button hinzugefügt
 * 0.4.1	28.05.2021	+ Hotfix
 * 0.5		28.05.2021	+ AT, CH
 * 0.6		13.09.2021	+ Bugfix
 * 0.7		06.11.2021	+ UK 
 * 0.7.1	08.06.2022	+ Hotfix  
 *********************************************/
 
 (function() {
    'use strict';
 
	const default_form1Select = 50;
	let form1Select = GM_getValue('Form1-select');
	const default_form2Select = 75;
	let form2Select = GM_getValue('Form2-select');
	const default_form3Select = 100;
	let form3Select = GM_getValue('Form3-select');
	const default_form4Select = 115;
	let form4Select = GM_getValue('Form4-select');
	const default_form5Select = 130;
	let form5Select = GM_getValue('Form5-select');
	const default_fitnessSelect = 20;
	let fitnessSelect = GM_getValue('Fitness-select');
	const default_fremdpositionSelect = 70;
	let fremdpositionSelect = GM_getValue('Fremdposition-select');
 
	function settings() {
		
		// SETTINGS - SpielerForm- & Fitness-Faktor
		// Form wird multipliziert -> 0.5 für 50%, 1.1 für 110%
 
		// 1er FORM:
		const form1 = GM_getValue('Form1-select', default_form1Select) / 100;
		// 2er FORM:
		const form2 = GM_getValue('Form2-select', default_form2Select) / 100;
		// 3er FORM:
		const form3 = GM_getValue('Form3-select', default_form3Select) / 100;
		// 4er FORM:
		const form4 = GM_getValue('Form4-select', default_form4Select) / 100;
		// 5er FORM:
		const form5 = GM_getValue('Form5-select', default_form5Select) / 100;
		// Fitness
		const fitness = GM_getValue('Fitness-select', default_fitnessSelect); 
		// Fremdposition
		const fremdposition = GM_getValue('Fremdposition-select', default_fremdpositionSelect);
 
		return [form1, form2, form3, form4, form5, fitness, fremdposition];
	}
 
	function getTestValue() {
		return GM_getValue(test);
	}
 
	function createControls() {
		const formSettings = settings();
		const labels = getLabels();
 
		//$("#ol-bg-pattern").css("height", "205px");
		$("<div id=\"lineupCalculatorControls\" class=\"container\" style=\"text-align: center; width: 100%; height: auto; background-color: white; border: 3px solid black; border-radius: 5px; margin-bottom: 0px; margin-top: -3px; padding: 3px 0px 4px 0px;\">" +
		labels[0] + "<select class=\"ol-lineup-select\" id=\"Form1-select\" title=\"Gewichtung bei sehr schlechter Form\"></select>" +
		labels[1] + "<select class=\"ol-lineup-select\" id=\"Form2-select\" title=\"Gewichtung bei schlechter Form\"></select>" +
		labels[2] + "<select class=\"ol-lineup-select\" id=\"Form3-select\" title=\"Gewichtung bei normaler Form\"></select>" +
		labels[3] + "<select class=\"ol-lineup-select\" id=\"Form4-select\" title=\"Gewichtung bei guter Form\"></select>" +
		labels[4] + "<select class=\"ol-lineup-select\" id=\"Form5-select\" title=\"Gewichtung bei top Form\"></select>" +
		labels[5] + "<select class=\"ol-lineup-select\" id=\"Fitness-select\" title=\"Gewichtung der Fitness -> zB 20% bei 50er Fitness -> 90% der normalen Leistung\"></select>" +
		labels[6] + "<select class=\"ol-lineup-select\" id=\"Fremdposition-select\" title=\"Gewichtung der Stärke auf fremden Positionen\"></select>" +
		"<button title=\"Alle Werte auf 100% -> Keine Berücksichtigung der Form & Co\" class=\"ol-button lineup-selector-button\" id=\"set100Percent\">100%</button>" +
		"<button title=\"Standardwerte wiederherstellen\" class=\"ol-button lineup-selector-button\" id=\"restoreDefaults\">restore</button>" +
		"<button title=\"Änderungen speichern und Seite neu laden\" class=\"ol-button lineup-selector-button\" id=\"refreshPage\">save</button>" +
		"</div>").appendTo(".team-header-wrapper .ol-page-content");
 
        $(".ol-page-content").on('click','#restoreDefaults',restoreDefaults);
        $(".ol-page-content").on('click','#refreshPage',refreshPage);
        $(".ol-page-content").on('click','#set100Percent',set100Percent);
 
		buildSelectorRows("Form1-select", 5, 41, form1Select, default_form1Select, " %");
		buildSelectorRows("Form2-select", 5, 41, form2Select, default_form2Select, " %");
		buildSelectorRows("Form3-select", 5, 41, form3Select, default_form3Select, " %");
		buildSelectorRows("Form4-select", 5, 41, form4Select, default_form4Select, " %");
		buildSelectorRows("Form5-select", 5, 41, form5Select, default_form5Select, " %");
		buildSelectorRows("Fitness-select", 5, 21, fitnessSelect, default_fitnessSelect, " %");
		buildSelectorRows("Fremdposition-select", 5, 21, fremdpositionSelect, default_fremdpositionSelect, " %");
	}
 
	function buildSelectorRows(id, valueStep, amount, value, defaultValue, unit) {
		let count = 0;
		let extendedID = "#" + id;
		for (let i = 0; i < amount; i++) {
			if (GM_getValue(id, defaultValue) == count) $(extendedID).append($("<option />").attr("value", count).attr('selected', 'selected').text(count + unit));
			else $(extendedID).append($("<option />").attr("value", count).text(count + unit));
			
			count += valueStep;
		}
 
		extendedID = "select" + extendedID;
		$(extendedID).change(function(){
			value = this.value;
			GM_setValue(id, this.value);
		});
	}
 
	function restoreDefaults() {
		GM_setValue('Form1-select', default_form1Select);
		GM_setValue('Form2-select', default_form2Select);
		GM_setValue('Form3-select', default_form3Select);
		GM_setValue('Form4-select', default_form4Select);
		GM_setValue('Form5-select', default_form5Select);
		GM_setValue('Fitness-select', default_fitnessSelect);
		GM_setValue('Fremdposition-select', default_fremdpositionSelect);
		location.reload();
	}
 
	function refreshPage() {
		location.reload();
	}
 
	function set100Percent() {
		GM_setValue('Form1-select', 100);
		GM_setValue('Form2-select', 100);
		GM_setValue('Form3-select', 100);
		GM_setValue('Form4-select', 100);
		GM_setValue('Form5-select', 100);
		GM_setValue('Fitness-select', 0);
		GM_setValue('Fremdposition-select', 100);
		location.reload();
	}
 
    function checkDiv(){
        if(!!document.getElementById("playerDetails")){
            console.log("div#playerDetails ist da");
			
			if (!$('#lineupCalculatorControls').length){
				createControls();
			}
            getSkillValues();
			setCSS();
        }
        else{
            console.log("div#playerDetails ist NICHT da");
        }
    }
 
    function getSkillValues(){
		const formSettings = settings();
		let playerIDRaw = $(".ol-team-settings-line-up-row.visible"); // speichert die playerIDs in aktueller Reihenfolge
		
		let playerIDArray = [];
		for (var i = 0; i < playerIDRaw.length; i++) {
			playerIDArray.push(playerIDRaw[i].id.match(/\d+/g)[0]);
		}
 
		let players = [];
 
		for (var i = 0; i < playerIDArray.length; i++) {
 
			let playerID = playerIDArray[i];
			
			let playerData = document.querySelectorAll(".ol-team-settings-line-up-row.visible .ol-value-bar-small.ol-gui-lineup-attr")[i].dataset.playerAttributes.split("\"value\":");
			
			let form = document.querySelectorAll(".ol-team-settings-line-up-row.visible #dailyConditionDiagramPlayerId" + playerIDArray[i] + " .ol-player-daily-condition").length;
 
            let playerPositions = document.querySelectorAll(".ol-team-settings-line-up-row.visible#playerListId" + playerIDArray[i] + " .ol-team-settings-player-lineup-position .lineUpPosition");
			
			let specificPosition = playerPositions[0].innerHTML;
			for (let i = 1; i < playerPositions.length; i++) {
				specificPosition += ", " + playerPositions[i].innerHTML;
			}
 
			let strength = parseInt(playerData[1].match(/\d+/g)[0]);
			let age = parseInt(playerData[2].match(/\d+/g)[0]);
			//let height = parseInt(playerData[4].match(/\d+/g)[0];
			let talent = parseInt(playerData[7].match(/\d+/g)[0]);
			let rightF = parseInt(playerData[8].match(/\d+/g)[0]);
			let leftF = parseInt(playerData[9].match(/\d+/g)[0]);
			let schusstechnik = parseInt(playerData[10].match(/\d+/g)[0]);
			let schusskraft = parseInt(playerData[11].match(/\d+/g)[0]);
			let technik = parseInt(playerData[12].match(/\d+/g)[0]);
			let schnelligkeit = parseInt(playerData[13].match(/\d+/g)[0]);
			let kopfball = parseInt(playerData[14].match(/\d+/g)[0]);
			let zweikampf = parseInt(playerData[15].match(/\d+/g)[0]);
			let athletik = parseInt(playerData[16].match(/\d+/g)[0]);
			let kondition = parseInt(playerData[17].match(/\d+/g)[0]);
			let fitness = parseInt(playerData[18].match(/\d+/g)[0]);
			let taktik = parseInt(playerData[19].match(/\d+/g)[0]);
			let linie = parseInt(playerData[20].match(/\d+/g)[0]);
			let rauslaufen = parseInt(playerData[21].match(/\d+/g)[0]);
			let strafraum = parseInt(playerData[22].match(/\d+/g)[0]);
			let fuß = parseInt(playerData[23].match(/\d+/g)[0]);
			let spieleroeffnung = parseInt(playerData[24].match(/\d+/g)[0]);
			let libero = parseInt(playerData[25].match(/\d+/g)[0]);
 
			if (form === 1) {
				form = formSettings[0];
			} else if (form === 2) {
				form = formSettings[1];
			} else if (form === 3) {
				form = formSettings[2];
			} else if (form === 4) {
				form = formSettings[3];
			} else if (form === 5) {
				form = formSettings[4];
			} else if (form === 0) {
				form = 1;
			}
 
			const checkForm = document.querySelectorAll(".ol-team-settings-line-up-row.visible #dailyConditionDiagramPlayerId" + playerIDArray[i])[0].dataset.text;
			if (checkForm === "Die Form des Spielers konnte nicht ermittelt werden. Das Training hat noch nicht stattgefunden.") {
				form = 1;
			} else if (checkForm === "Die Form des Spielers konnte nicht ermittelt werden. Der Spieler ist verletzt.") { 
				form = 0;
			}
 
			players.push(new Player(playerID, specificPosition, form, strength, age, talent, rightF, leftF, schusstechnik, schusskraft, technik, schnelligkeit, kopfball, zweikampf, athletik, kondition, fitness, taktik, linie, rauslaufen, strafraum, fuß, spieleroeffnung, libero));
		}
		console.log(players);
 
		let actualPlayerID = document.querySelectorAll(".ol-player-details-selected .ol-button")[1].outerHTML.match(/\d+/g)[0];   // .outerHTML[1].match(/\d+/g)[0]
		//console.log(actualPlayerID);
 
		let aufstellung = document.querySelectorAll("#dropdownSystems .ol-dropdown-text")[0].innerText; // hier liest du die Formation aus
		let aufstellungTaktik = document.querySelectorAll("#dropdownTactic .ol-dropdown-text")[0].innerText; // hier die Ausprägung der Formation
 
		let tempPosition = document.querySelectorAll(".ol-player-details-selected span.lineUpPosition"); // Position
		let position = tempPosition[0].innerText;
		for (var i = 1; i < tempPosition.length; i++) {
			position += ", " + tempPosition[i].innerText;
		}
 
		//console.log(position);
		//console.log(aufstellung); // Kontrollausgabe
		//console.log(aufstellungTaktik); // Kontrollausgabe
 
		// hier übergibst die oben ausgelesenen Variablen an die Funktion calculateValues und speicherst das Ergebnis (ein Array soweit ich das von hier aus schon sehen kann) in der Variable valuesToInsert
        // wann nimmt man let und wann const?
 
		const positionsToChange = document.querySelectorAll('.ol-team-settings-pitch .ol-team-settings-player-drag-and-drop');
		//console.log(positionsToChange);
		const positionCount = document.querySelectorAll('.ol-team-settings-pitch .ol-pitch-position');
		//console.log(positionCount);
		const positionMapping = getPositionMapping(aufstellung, aufstellungTaktik);
		//console.log(positionMapping);
 
		let valuesToInsert;
		let countActualPosition = 99;
 
		for (var i = 0; i < players.length; i++) {
			if (actualPlayerID === players[i].playerID) {
				valuesToInsert = calculateValues(players[i].position, players[i].form, aufstellung, aufstellungTaktik, players[i].leftF, players[i].rightF, players[i].fitness, players[i].kondition, players[i].schnelligkeit, players[i].technik, players[i].schusstechnik, players[i].schusskraft, players[i].kopfball, players[i].zweikampf, players[i].taktik, players[i].athletik, players[i].linie, players[i].libero, players[i].fuß, players[i].spieleroeffnung, players[i].rauslaufen, players[i].strafraum);
				for (var j = 0; j < positionsToChange.length; j++) {
					if (positionsToChange[j].dataset.playerId === actualPlayerID) {
						countActualPosition = parseInt(positionCount[j].dataset.mapping);
					}
				}
			}
		}
 
        //const valuesToInsert = calculateValues(calculateForm, aufstellung, aufstellungTaktik, lf, rf, fitness, kondition, schnelligkeit, technik, schusstechnik, schusskraft, kopfball, zweikampf, taktik, athletik, linie, libero, fuß, spieleroeffnung, rauslaufen, strafraum);
		let tempValues = valuesToInsert;
		let frontValues = [];
		for (var i = 0; i < 22; i++) {
			if (i % 2) {
				frontValues.push(tempValues[i]);
			}
		}
		frontValues.sort(function(a, b) {return b - a});
		
		//console.log(valuesToInsert);
		//console.log(frontValues);
        // hier wird dann das neu erzeugte div mit Inhalt gefüllt und über .insertBefore eingefügt
        // was bedeutet das $?
 
		//create string
		//let stringToInsert = "<div class=\"realStrenght\" style=\"margin:5px 2px;text-align:center;\">";
		let stringToInsert = "<div class=\"realStrenght container\" style=\"text-align:center;width:100%;height:auto;background-color:#f2f2f2;padding-bottom:6px;border-bottom-left-radius:7px;\">";
		
		for (var i = 0; i < 21; i += 2) {
			let topValue = "";
			let lineupTrueFalse = false;
			if (frontValues[0] === valuesToInsert[i + 1] || frontValues[1] === valuesToInsert[i + 1] || frontValues[2] === valuesToInsert[i + 1]) {
				topValue = "font-weight: 750; color: purple; border-radius: 5px; background-color: #C4C4C4; padding: 0px 0px 2px 0px;"; //margin: 0px 2px 2px 2px;
			}
			if (valuesToInsert[i + 1] === "0.0" || valuesToInsert[i + 1] < (frontValues[0] * 0.75)) {
				topValue = "";
			}
			if (positionMapping[i / 2] === countActualPosition) {
				lineupTrueFalse = true;
			}
			stringToInsert +=  buildSingleRow(position, valuesToInsert[i], valuesToInsert[i + 1], topValue, lineupTrueFalse);
		}
		stringToInsert += "</div>";
 
		$(stringToInsert).insertBefore(".ol-player-details-selected .ol-team-settings-player-details-bottom .container");
 
		let defense = 0;
		let midfield = 0;
		let attack = 0;
		let keeper = 0;
		let countDefense = 0;
		let countMidfield = 0;
		let countAttack = 0;
		let countTW = 0;
		
		for (var i = 0; i < positionsToChange.length; i++) {
			for (var j = 0; j < players.length; j++) {
				if (positionsToChange[i].dataset.playerId === players[j].playerID) {
					const tempValues = calculateValues(players[j].position, players[j].form, aufstellung, aufstellungTaktik, players[j].leftF, players[j].rightF, players[j].fitness, players[j].kondition, players[j].schnelligkeit, players[j].technik, players[j].schusstechnik, players[j].schusskraft, players[j].kopfball, players[j].zweikampf, players[j].taktik, players[j].athletik, players[j].linie, players[j].libero, players[j].fuß, players[j].spieleroeffnung, players[j].rauslaufen, players[j].strafraum);
					
					/*let temp = $(positionsToChange).find('.ol-team-settings-pitch-position-avg-value')[i];
					$(temp).html(tempValues[(i * 2) + 1]);*/
 
					for (var m = 0; m < 11; m++) {
						if (positionMapping[m] === parseInt(positionCount[i].dataset.mapping)) {
							let temp = $(positionsToChange).find('.ol-team-settings-pitch-position-avg-value')[i];
							$(temp).html(tempValues[(m * 2) + 1]);
 
							const tempString = tempValues[m * 2]; // .slice(-2)
							if (tempString.includes("IV") || tempString.includes("AV")) {
								defense += parseFloat(tempValues[(m * 2) + 1]);
								countDefense++;
							} else if (tempString.includes("DM") || tempString.includes("OM")) {
								midfield += parseFloat(tempValues[(m * 2) + 1]);
								countMidfield++;
							} else if (tempString.includes("ST")) {
								attack += parseFloat(tempValues[(m * 2) + 1]);
								countAttack++;
							} else if (tempString.includes("TW")) {
								keeper += parseFloat(tempValues[(m * 2) + 1]);
								countTW++;
							}
						}
					}
				}
			}
		}
 
		const finalDefense = (defense / countDefense).toFixed(1);
		const finalMidfield = (midfield / countMidfield).toFixed(1);
		const finalAttack = (attack / countAttack).toFixed(1);
		const finalSummary = ((defense + midfield + attack + keeper) / (countDefense + countMidfield + countAttack + countTW)).toFixed(1);
 
		$(".ol-position-rating-number").css("width","45px");
		$(".ol-position-rating-container #systemPartAverageValue0").html(finalSummary);
		$(".ol-position-rating-container #systemPartAverageValue2").html(finalDefense);
		$(".ol-position-rating-container #systemPartAverageValue3").html(finalMidfield);
		$(".ol-position-rating-container #systemPartAverageValue5").html(finalAttack);
		
    }
 
	function buildSingleRow(position, notation, value, topValue, lineupTrueFalse) {
		let temp = "font-weight: 500; padding: 2px 0px 2px 0px;";
		const tempString = notation.slice(-2);
 
		if (position.includes(tempString)) {
			temp += "font-weight: 650 !important; color: green; background-color: #C4C4C4; border-radius: 5px;";
			topValue += "padding: 0px 0px 0px 0px !important;";
		}
		if (lineupTrueFalse === true) {
			temp += "border-style: solid; border-width: 2px; border-color: black; border-radius: 5px; padding: 0px 0px 0px 0px !important;";
			topValue += "padding: 0px 0px 0px 0px !important;";
			//temp += "box-shadow: 0px 0px 0px 1.5px black inset; border-radius: 5px;";
		}
		let row = "<div style=\"width:9%;float:left;" + temp + "\"><div>" + notation + "</div><div style=\"" + topValue + "\">" + value + "</div></div>";
		
		return row;
	}
 
	function calculateValues(position, form, aufstellung, aufstellungTaktik, lf, rf, fitness, kondition, schnelligkeit, technik, schusstechnik, schusskraft, kopfball, zweikampf, taktik, athletik, linie, libero, fuß, spieleroeffnung, rauslaufen, strafraum) {
		const positions = getPositionsPerLineup(aufstellung, aufstellungTaktik); // überprüft, um welche Aufstellung es sich handelt (bisher nur auf 4-4-2 ausgelegt)
		// holt sich die Werte pro Position für die Berechnung in Abhängigkeit der Aufstellung
        const positionValues = [getValuesPerLineup(aufstellung, aufstellungTaktik, positions[0]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[1]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[2]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[3]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[4]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[5]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[6]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[7]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[8]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[9]),
								getValuesPerLineup(aufstellung, aufstellungTaktik, positions[10])];
		
		//console.log(positionValues);
		//console.log(sum);
		const tempfitnessFaktor = settings();
		const fitnessFaktor = (tempfitnessFaktor[5] / 100);
		const fremdpositionFaktor = (tempfitnessFaktor[6] / 100);
 
		const sum = [];
		const positionFaktor = [];
		for (var i = 0; i < positions.length; i++) {
			const tempString = positions[i].slice(-2);
			if (position.includes(tempString)) {
				positionFaktor.push(1);
			} else {
				positionFaktor.push(fremdpositionFaktor);
			}
			
			let temp = 0;
			for (var j = 0; j < positionValues[i].length; j++) {
				temp += positionValues[i][j];
			}
			sum.push(temp);
		}
 
        // gibt den berechneten Gesamtwert zurück an getSkillValues
		return [positions[0], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(linie*positionValues[0][0]+libero*positionValues[0][1]+fuß*positionValues[0][2]+spieleroeffnung*positionValues[0][3]+rauslaufen*positionValues[0][4]+strafraum*positionValues[0][5])/sum[0])*10*form)*positionFaktor[0])/10).toFixed(1),
				positions[1], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[1][0]+rf*positionValues[1][1]+kondition*positionValues[1][2]+schnelligkeit*positionValues[1][3]+technik*positionValues[1][4]+schusstechnik*positionValues[1][5]+schusskraft*positionValues[1][6]+kopfball*positionValues[1][7]+zweikampf*positionValues[1][8]+taktik*positionValues[1][9]+athletik*positionValues[1][10])/sum[1])*10*form)*positionFaktor[1])/10).toFixed(1),
				positions[2], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[2][0]+rf*positionValues[2][1]+kondition*positionValues[2][2]+schnelligkeit*positionValues[2][3]+technik*positionValues[2][4]+schusstechnik*positionValues[2][5]+schusskraft*positionValues[2][6]+kopfball*positionValues[2][7]+zweikampf*positionValues[2][8]+taktik*positionValues[2][9]+athletik*positionValues[2][10])/sum[2])*10*form)*positionFaktor[2])/10).toFixed(1),
				positions[3], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[3][0]+rf*positionValues[3][1]+kondition*positionValues[3][2]+schnelligkeit*positionValues[3][3]+technik*positionValues[3][4]+schusstechnik*positionValues[3][5]+schusskraft*positionValues[3][6]+kopfball*positionValues[3][7]+zweikampf*positionValues[3][8]+taktik*positionValues[3][9]+athletik*positionValues[3][10])/sum[3])*10*form)*positionFaktor[3])/10).toFixed(1),
				positions[4], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[4][0]+rf*positionValues[4][1]+kondition*positionValues[4][2]+schnelligkeit*positionValues[4][3]+technik*positionValues[4][4]+schusstechnik*positionValues[4][5]+schusskraft*positionValues[4][6]+kopfball*positionValues[4][7]+zweikampf*positionValues[4][8]+taktik*positionValues[4][9]+athletik*positionValues[4][10])/sum[4])*10*form)*positionFaktor[4])/10).toFixed(1),
				positions[5], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[5][0]+rf*positionValues[5][1]+kondition*positionValues[5][2]+schnelligkeit*positionValues[5][3]+technik*positionValues[5][4]+schusstechnik*positionValues[5][5]+schusskraft*positionValues[5][6]+kopfball*positionValues[5][7]+zweikampf*positionValues[5][8]+taktik*positionValues[5][9]+athletik*positionValues[5][10])/sum[5])*10*form)*positionFaktor[5])/10).toFixed(1),
				positions[6], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[6][0]+rf*positionValues[6][1]+kondition*positionValues[6][2]+schnelligkeit*positionValues[6][3]+technik*positionValues[6][4]+schusstechnik*positionValues[6][5]+schusskraft*positionValues[6][6]+kopfball*positionValues[6][7]+zweikampf*positionValues[6][8]+taktik*positionValues[6][9]+athletik*positionValues[6][10])/sum[6])*10*form)*positionFaktor[6])/10).toFixed(1),
				positions[7], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[7][0]+rf*positionValues[7][1]+kondition*positionValues[7][2]+schnelligkeit*positionValues[7][3]+technik*positionValues[7][4]+schusstechnik*positionValues[7][5]+schusskraft*positionValues[7][6]+kopfball*positionValues[7][7]+zweikampf*positionValues[7][8]+taktik*positionValues[7][9]+athletik*positionValues[7][10])/sum[7])*10*form)*positionFaktor[7])/10).toFixed(1),
				positions[8], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[8][0]+rf*positionValues[8][1]+kondition*positionValues[8][2]+schnelligkeit*positionValues[8][3]+technik*positionValues[8][4]+schusstechnik*positionValues[8][5]+schusskraft*positionValues[8][6]+kopfball*positionValues[8][7]+zweikampf*positionValues[8][8]+taktik*positionValues[8][9]+athletik*positionValues[8][10])/sum[8])*10*form)*positionFaktor[8])/10).toFixed(1),
				positions[9], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[9][0]+rf*positionValues[9][1]+kondition*positionValues[9][2]+schnelligkeit*positionValues[9][3]+technik*positionValues[9][4]+schusstechnik*positionValues[9][5]+schusskraft*positionValues[9][6]+kopfball*positionValues[9][7]+zweikampf*positionValues[9][8]+taktik*positionValues[9][9]+athletik*positionValues[9][10])/sum[9])*10*form)*positionFaktor[9])/10).toFixed(1),
				positions[10], (Math.round(((((100-(100-fitness)*fitnessFaktor)/100)*(lf*positionValues[10][0]+rf*positionValues[10][1]+kondition*positionValues[10][2]+schnelligkeit*positionValues[10][3]+technik*positionValues[10][4]+schusstechnik*positionValues[10][5]+schusskraft*positionValues[10][6]+kopfball*positionValues[10][7]+zweikampf*positionValues[10][8]+taktik*positionValues[10][9]+athletik*positionValues[10][10])/sum[10])*10*form)*positionFaktor[10])/10).toFixed(1)];
	}
 
    /**
	 * diese Funktion sucht zur aktuell gewählten Aufstellung die Positionen raus, die dann später im neu erstellten div angezeigt werden sollen
	 */
	function getPositionsPerLineup(aufstellung, aufstellungTaktik) {
		const final = aufstellung + aufstellungTaktik;
		switch(final) {
			case "4-2-4-0Falsche Neun":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'LDM', 'RDM', 'ZLOM', 'ZROM', 'LOM', 'ROM'];	
			case "4-1-5-0Falsche Neun":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'LOM', 'ROM', 'ZOM', 'LST', 'RST'];	
			case "3-5-2Dreierkette, Kompaktes Mittelfeld":
				return ['TW', 'LIV', 'RIV', 'ZIV', 'LDM', 'RDM', 'LOM', 'ROM', 'ZOM', 'LST', 'RST'];
			case "4-1-4-1Defensiv, Konter":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'ZLOM', 'ZROM', 'LOM', 'ROM', 'ST'];
			case "4-2-3-1Defensiv, Konter":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'ZLDM', 'ZRDM', 'LDM', 'RDM', 'ZOM', 'ST'];
			case "4-2-3-1Kontrollierte Offensive":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'LDM', 'RDM', 'LOM', 'ROM', 'ZOM', 'ST'];
			case "4-3-3Offensiv":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'LOM', 'ROM', 'LST', 'RST', 'ST'];
			case "4-3-3Halb offensiv, Konter":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'LOM', 'ROM', 'LST', 'RST', 'ST'];			
			case "4-4-2Flügel":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'LOM', 'ROM', 'ZOM', 'LST', 'RST'];			
			case "4-4-2Raute":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'DM', 'LOM', 'ROM', 'ZOM', 'LST', 'RST'];
			case "4-4-2Flach":
				return ['TW', 'LIV', 'RIV', 'LAV', 'RAV', 'LDM', 'RDM', 'LOM', 'ROM', 'LST', 'RST'];
			case "3-4-3Dreierkette (offensiv)":
				return ['TW', 'LIV', 'RIV', 'ZIV', 'ZLOM', 'ZROM', 'LOM', 'ROM', 'LST', 'RST', 'ST'];				
		}
	}
 
	function getPositionMapping(aufstellung, aufstellungTaktik) {
		const final = aufstellung + aufstellungTaktik;
		switch(final) {
			case "4-2-4-0Falsche Neun":
				return [1, 3, 4, 2, 5, 6, 8, 10, 9, 7, 11];
			case "4-1-5-0Falsche Neun":
				return [1, 3, 4, 2, 5, 6, 10, 8, 9, 7, 11];
			case "3-5-2Dreierkette, Kompaktes Mittelfeld":
				return [1, 2, 4, 3, 6, 5, 7, 8, 10, 9, 11];
			case "4-1-4-1Defensiv, Konter":
				return [1, 3, 4, 2, 5, 8, 6, 10, 7, 11, 9];
			case "4-2-3-1Defensiv, Konter":
				return [1, 3, 4, 2, 5, 6, 8, 7, 11, 10, 9];	
			case "4-2-3-1Kontrollierte Offensive":
				return [1, 3, 4, 2, 5, 6, 8, 7, 11, 10, 9];	
			case "4-3-3Offensiv":
				return [1, 3, 4, 2, 5, 10, 6, 8, 7, 11, 9];	
			case "4-3-3Halb offensiv, Konter":
				return [1, 3, 4, 2, 5, 10, 6, 8, 7, 11, 9];		
			case "4-4-2Flügel":
				return [1, 3, 4, 2, 5, 6, 7, 8, 10, 9, 11];		
			case "4-4-2Raute":
				return [1, 3, 4, 2, 5, 6, 7, 8, 10, 9, 11];
			case "4-4-2Flach":
				return [1, 3, 4, 2, 5, 6, 10, 7, 8, 9, 11];
			case "3-4-3Dreierkette (offensiv)":
				return [1, 2, 4, 3, 10, 8, 6, 5, 7, 11, 9];			
		}
	}
 
	/**
	 * lf, rf, kondition, schnelligkeit, technik, schusstechnik, schusskraft, kopfball, zweikampf, taktik, athletik
	 * linie, libero, fuß, spieleröffnung, rauslaufen, strafraum
	 */
	function getValuesPerLineup(aufstellung, aufstellungTaktik, position) {
		const final = aufstellung + aufstellungTaktik;
		switch(final) {
			case "4-2-4-0Falsche Neun":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 7, 4, 6, 1, 9, 9, 7, 6];
					case "RIV":
						return [1, 4, 1, 7, 4, 6, 1, 9, 9, 7, 6];
					case "LAV":
						return [3, 1, 1, 8, 5, 8, 1, 1, 8, 5, 1];
					case "RAV":
						return [1, 3, 1, 8, 5, 8, 1, 1, 8, 5, 1];
					case "LDM":
						return [3, 1, 1, 2, 5, 6, 2, 5, 8, 3, 5];
					case "RDM":
						return [1, 3, 1, 2, 5, 6, 2, 5, 8, 3, 5];
					case "ZLOM":
						return [3, 1, 1, 7, 9, 8, 1, 4, 4, 5, 3];
					case "ZROM":
						return [1, 3, 1, 7, 9, 8, 1, 4, 4, 5, 3];
					case "LOM":
						return [4, 1, 1, 8, 8, 9, 1, 1, 2, 5, 2];
					case "ROM":
						return [1, 4, 1, 8, 8, 9, 1, 1, 2, 5, 2];
					case "TW":
						return [1, 6, 4, 2, 2, 1];
				}
			
			case "4-1-5-0Falsche Neun":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 7, 4, 6, 1, 9, 10, 8, 6];
					case "RIV":
						return [1, 4, 1, 7, 4, 6, 1, 9, 10, 8, 6];
					case "LAV":
						return [3, 1, 1, 8, 6, 8, 1, 1, 8, 7, 1];
					case "RAV":
						return [1, 3, 1, 8, 6, 8, 1, 1, 8, 7, 1];
					case "DM":
						return [1, 1, 2, 5, 7, 3, 2, 5, 9, 7, 6];
					case "LOM":
						return [3, 1, 1, 8, 8, 8, 1, 2, 3, 7, 3];
					case "ROM":
						return [1, 3, 1, 8, 8, 8, 1, 2, 3, 7, 3];
					case "ZOM":
						return [1, 1, 1, 8, 9, 7, 1, 2, 4, 8, 3];
					case "LST":
						return [4, 1, 1, 8, 8, 9, 1, 1, 2, 7, 2];
					case "RST":
						return [1, 4, 1, 8, 8, 9, 1, 1, 2, 7, 2];
					case "TW":
						return [1, 6, 4, 2, 2, 1];
				}
			
			case "3-5-2Dreierkette, Kompaktes Mittelfeld":
				switch(position) {
					case "LIV":
						return [3, 1, 6, 6, 5, 5, 4, 7, 8, 6, 6];
					case "RIV":
						return [1, 3, 6, 6, 5, 5, 4, 7, 8, 6, 6];
					case "ZIV":
						return [1, 1, 1, 5, 2, 3, 2, 9, 9, 7, 6];
					case "LDM":
						return [3, 1, 6, 6, 5, 5, 5, 5, 7, 6, 6];
					case "RDM":
						return [1, 3, 6, 6, 5, 5, 5, 5, 7, 6, 6];
					case "LOM":
						return [3, 1, 8, 8, 7, 6, 5, 4, 6, 6, 8];
					case "ROM":
						return [1, 3, 8, 8, 7, 6, 5, 4, 6, 6, 8];
					case "ZOM":
						return [1, 1, 1, 4, 9, 9, 1, 6, 4, 8, 4];
					case "LST":
						return [2, 1, 5, 6, 5, 6, 7, 7, 5, 6, 5];
					case "RST":
						return [1, 2, 5, 6, 5, 6, 7, 7, 5, 6, 5];
					case "TW":
						return [1, 1, 2, 4, 1, 1];
				}
			
			case "4-1-4-1Defensiv, Konter":
				switch(position) {
					case "LIV":
						return [3, 1, 1, 2, 2, 1, 2, 10, 10, 8, 6];
					case "RIV":
						return [1, 3, 1, 2, 2, 1, 2, 10, 10, 8, 6];
					case "LAV":
						return [4, 1, 1, 8, 4, 8, 1, 1, 8, 3, 2];
					case "RAV":
						return [1, 4, 1, 8, 4, 8, 1, 1, 8, 3, 2];
					case "DM":
						return [7, 7, 8, 8, 7, 6, 5, 8, 8, 10, 8];
					case "ZLOM":
						return [3, 1, 1, 8, 5, 7, 1, 3, 6, 7, 5];
					case "ZROM":
						return [1, 3, 1, 8, 5, 7, 1, 3, 6, 7, 5];
					case "LOM":
						return [4, 1, 2, 8, 9, 7, 1, 2, 1, 8, 5];
					case "ROM":
						return [1, 4, 2, 8, 9, 7, 1, 2, 1, 8, 5];
					case "ST":
						return [1, 1, 1, 8, 7, 7, 1, 8, 5, 3, 6];
					case "TW":
						return [1, 1, 2, 4, 2, 1];
				}
			
			case "4-2-3-1Defensiv, Konter":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 1, 2, 2, 2, 10, 10, 8, 4];
					case "RIV":
						return [1, 4, 1, 1, 2, 2, 2, 10, 10, 8, 4];
					case "LAV":
						return [3, 1, 1, 7, 4, 7, 1, 2, 9, 7, 2];
					case "RAV":
						return [1, 3, 1, 7, 4, 7, 1, 2, 9, 7, 2];
					case "ZLDM":
						return [3, 1, 1, 2, 6, 8, 1, 5, 10, 3, 5];
					case "ZRDM":
						return [1, 3, 1, 2, 6, 8, 1, 5, 10, 3, 5];
					case "LDM":
						return [3, 1, 2, 7, 7, 8, 1, 1, 6, 7, 2];
					case "RDM":
						return [1, 3, 2, 7, 7, 8, 1, 1, 6, 7, 2];
					case "ZOM":
						return [1, 1, 1, 8, 8, 9, 1, 6, 3, 6, 4];
					case "ST":
						return [1, 1, 2, 9, 4, 5, 1, 7, 3, 6, 7];
					case "TW":
						return [1, 2, 1, 3, 1, 1];
				}
			
			case "4-2-3-1Kontrollierte Offensive":
				switch(position) {
					case "LIV":
						return [4, 1, 3, 6, 4, 3, 4, 8, 9, 6, 4];
					case "RIV":
						return [1, 4, 3, 6, 4, 3, 4, 8, 9, 6, 4];
					case "LAV":
						return [4, 1, 7, 7, 4, 5, 5, 4, 8, 6, 4];
					case "RAV":
						return [1, 4, 7, 7, 4, 5, 5, 4, 8, 6, 4];
					case "LDM":
						return [3, 1, 1, 2, 1, 7, 3, 6, 9, 6, 4];
					case "RDM":
						return [1, 3, 1, 2, 1, 7, 3, 6, 9, 6, 4];
					case "LOM":
						return [4, 1, 2, 10, 5, 8, 2, 1, 4, 6, 2];
					case "ROM":
						return [1, 4, 2, 10, 5, 8, 2, 1, 4, 6, 2];
					case "ZOM":
						return [6, 6, 7, 6, 8, 7, 6, 6, 4, 6, 5];
					case "ST":
						return [1, 1, 1, 9, 4, 4, 1, 8, 5, 2, 8];
					case "TW":
						return [1, 2, 2, 3, 1, 1];
				}
			
			case "4-3-3Offensiv":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 10, 5, 7, 1, 8, 10, 10, 7];
					case "RIV":
						return [1, 4, 1, 10, 5, 7, 1, 8, 10, 10, 7];
					case "LAV":
						return [2, 1, 2, 9, 7, 9, 1, 1, 8, 7, 1];
					case "RAV":
						return [1, 2, 2, 9, 7, 9, 1, 1, 8, 7, 1];
					case "DM":
						return [1, 1, 2, 4, 8, 3, 3, 5, 8, 8, 8];
					case "LOM":
						return [3, 1, 1, 8, 9, 8, 1, 1, 4, 4, 2];
					case "ROM":
						return [1, 3, 1, 8, 9, 8, 1, 1, 4, 4, 2];
					case "LST":
						return [4, 1, 1, 9, 9, 8, 1, 1, 2, 4, 4];
					case "RST":
						return [1, 4, 1, 9, 9, 8, 1, 1, 2, 4, 4];
					case "ST":
						return [1, 1, 1, 7, 7, 2, 1, 9, 4, 2, 7];
					case "TW":
						return [1, 7, 3, 5, 2, 1];
				}
			
			case "4-3-3Halb offensiv, Konter":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 2, 2, 3, 1, 10, 10, 8, 4];
					case "RIV":
						return [1, 4, 1, 2, 2, 3, 1, 10, 10, 8, 4];
					case "LAV":
						return [4, 1, 2, 7, 3, 7, 2, 1, 10, 6, 1];
					case "RAV":
						return [1, 4, 2, 7, 3, 7, 2, 1, 10, 6, 1];
					case "DM":
						return [1, 1, 1, 2, 2, 7, 3, 8, 10, 7, 5];
					case "LOM":
						return [3, 1, 2, 4, 4, 6, 2, 3, 8, 7, 2];
					case "ROM":
						return [1, 3, 2, 4, 4, 6, 2, 3, 8, 7, 2];
					case "LST":
						return [5, 1, 2, 10, 7, 9, 3, 2, 2, 8, 2];
					case "RST":
						return [1, 5, 2, 10, 7, 9, 3, 2, 2, 8, 2];
					case "ST":
						return [1, 1, 2, 10, 3, 7, 1, 9, 4, 5, 4];
					case "TW":
						return [1, 3, 2, 4, 1, 1];
				}
			
			case "4-4-2Flügel":
				switch(position) {
					case "LIV":
						return [1, 4, 1, 2, 3, 4, 2, 10, 10, 8, 4];
					case "RIV":
						return [4, 1, 1, 2, 3, 4, 2, 10, 10, 8, 4];
					case "LAV":
						return [8, 1, 6, 4, 3, 10, 5, 1, 7, 8, 1];
					case "RAV":
						return [1, 8, 6, 4, 3, 10, 5, 1, 7, 8, 1];
					case "DM":
						return [1, 1, 2, 3, 2, 4, 1, 8, 9, 8, 7];
					case "LOM":
						return [4, 1, 3, 10, 8, 8, 3, 1, 5, 8, 7];
					case "ROM":
						return [1, 4, 3, 10, 8, 8, 3, 1, 5, 8, 7];
					case "ZOM":
						return [1, 1, 2, 5, 9, 8, 1, 6, 4, 8, 3];
					case "LST":
						return [2, 1, 1, 8, 6, 5, 1, 5, 2, 3, 6];
					case "RST":
						return [1, 2, 1, 8, 6, 5, 1, 5, 2, 3, 6];
					case "TW":
						return [1, 2, 2, 4, 1, 1];
				}
 
			case "4-4-2Raute":
				switch(position) {
					case "LIV":
						return [4, 1, 1, 8, 2, 1, 1, 10, 10, 8, 5];
					case "RIV":
						return [1, 4, 1, 8, 2, 1, 1, 10, 10, 8, 5];
					case "LAV":
						return [4, 1, 2, 8, 5, 7, 1, 1, 8, 8, 2];
					case "RAV":
						return [1, 4, 2, 8, 5, 7, 1, 1, 8, 8, 2];
					case "DM":
						return [1, 1, 2, 2, 2, 1, 2, 2, 8, 8, 7];
					case "LOM":
						return [3, 1, 2, 6, 8, 7, 1, 6, 3, 3, 1];
					case "ROM":
						return [1, 3, 2, 6, 8, 7, 1, 6, 3, 3, 1];
					case "ZOM":
						return [1, 1, 1, 3, 8, 9, 1, 5, 3, 9, 2];
					case "LST":
						return [2, 1, 1, 8, 5, 5, 1, 8, 1, 3, 5];
					case "RST":
						return [1, 2, 1, 8, 5, 5, 1, 8, 1, 3, 5];
					case "TW":
						return [1, 5, 4, 3, 1, 1];
				}
 
			case "4-4-2Flach":
				switch(position) {
					case "LIV":
						return [1, 4, 1, 3, 1, 1, 1, 10, 10, 7, 4];
					case "RIV":
						return [4, 1, 1, 3, 1, 1, 1, 10, 10, 7, 4];
					case "LAV":
						return [4, 1, 1, 7, 4, 7, 2, 1, 9, 7, 2];
					case "RAV":
						return [1, 4, 1, 7, 4, 7, 2, 1, 9, 7, 2];
					case "LDM":
						return [3, 1, 1, 5, 9, 6, 1, 6, 7, 3, 2];
					case "RDM":
						return [1, 3, 1, 5, 9, 6, 1, 6, 7, 3, 2];
					case "LOM":
						return [4, 1, 1, 8, 7, 8, 1, 2, 5, 3, 1];
					case "ROM":
						return [1, 4, 1, 8, 7, 8, 1, 2, 5, 3, 1];
					case "LST":
						return [3, 1, 1, 6, 4, 5, 1, 8, 1, 3, 5];
					case "RST":
						return [1, 3, 1, 6, 4, 5, 1, 8, 1, 3, 5];
					case "TW":
						return [1, 2, 3, 3, 1, 1];
				}
				
			case "3-4-3Dreierkette (offensiv)":
				switch(position) {
					case "LIV":
						return [3, 1, 2, 8, 4, 5, 2, 8, 9, 8, 6];
					case "RIV":
						return [1, 3, 2, 8, 4, 5, 2, 8, 9, 8, 6];
					case "ZIV":
						return [1, 1, 2, 8, 3, 5, 2, 9, 10, 8, 6];
					case "LOM":
						return [4, 1, 1, 9, 8, 8, 1, 1, 5, 4, 2];
					case "ROM":
						return [1, 4, 1, 9, 8, 8, 1, 1, 5, 4, 2];
					case "ZLOM":
						return [3, 1, 1, 8, 8, 7, 1, 2, 7, 5, 2];
					case "ZROM":
						return [1, 3, 1, 8, 8, 7, 1, 2, 7, 5, 2];
					case "LST":
						return [4, 1, 1, 8, 9, 8, 1, 3, 2, 4, 3];
					case "RST":
						return [1, 4, 1, 8, 9, 8, 1, 3, 2, 4, 3];
					case "ST":
						return [1, 1, 1, 8, 9, 5, 1, 9, 2, 3, 7];
					case "TW":
						return [1, 5, 3, 3, 2, 1];						
				}
		}
	}
 
	function setCSS() {
		GM_addStyle("select.ol-lineup-select { -moz-appearance: none;-webkit-appearance: none;appearance: none;border: 1px solid #000;border-radius: 4px;padding-left: 5px;width: 155px;height: 100%;color: #000; width: auto;}");
		GM_addStyle('div#ol-lineup-select-wrapper { display: inline-block; position:relative; width: 150px; height: 35px;}');
		GM_addStyle("div#ol-lineup-select-wrapper::before{content:'';display: inline-block;width: 35px;height: 35px;position: absolute;background-color: black;border-radius: 2px;top: -0px;right: -4px;border-top-right-radius: 5px;border-bottom-right-radius: 5px;pointer-events: none;}");
		GM_addStyle("div#ol-lineup-select-wrapper::after {content:'';display: inline-block;border-top: 8px dashed;border-top: 8px solid;border-right: 8px solid transparent;border-left: 8px solid transparent;position: absolute;color: white;left: 128px;top: 14px;pointer-events: none;}");
 
		GM_addStyle('.lineup-selector-button { margin: 3px 0px 3px 10px; padding: 0px 10px 0px 10px; display: inline-block; width:auto; height: 24px; vertical-align:middle; text-align:center; background-color: black; color: white; border-radius: 4px; line-height: unset !important;}');
        GM_addStyle('.lineup-selector-button span { vertical-align:middle; background-color: #000 }');
	}
 
	function getLabels() {
		return [
			"<div title=\"Gewichtung bei sehr schlechter Form\" class=\"ol-player-daily-condition-container\" style=\"margin: 0px 5px 0px 5px\"><label><div class=\"ol-player-daily-condition  ol-player-daily-condition-negative-1\"></div></label></div>",
			"<div title=\"Gewichtung bei schlechter Form\" class=\"ol-player-daily-condition-container\" style=\"margin: 0px 5px 0px 5px\"><label><div class=\"ol-player-daily-condition  ol-player-daily-condition-negative-1\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-negative-2\"></div></label></div>",
			"<div title=\"Gewichtung bei normaler Form\" class=\"ol-player-daily-condition-container\" style=\"margin: 0px 5px 0px 5px\"><label><div class=\"ol-player-daily-condition  ol-player-daily-condition-neutral-1\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-neutral-2\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-neutral-3\"></div></label></div>",
			"<div title=\"Gewichtung bei guter Form\" class=\"ol-player-daily-condition-container\" style=\"margin: 0px 5px 0px 5px\"><label><div class=\"ol-player-daily-condition  ol-player-daily-condition-neutral-1\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-2\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-3\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-4\"></div></label></div>",
			"<div title=\"Gewichtung bei top Form\" class=\"ol-player-daily-condition-container\" style=\"margin: 0px 5px 0px 5px\"><label><div class=\"ol-player-daily-condition  ol-player-daily-condition-neutral-1\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-2\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-3\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-4\"></div><div class=\"ol-player-daily-condition  ol-player-daily-condition-positive-5\"></div></label></div>",
			"<label title=\"Gewichtung der Fitness -> zB 20% bei 50er Fitness -> 90% der normalen Leistung\" style=\"margin: 0px 5px 0px 5px\">Fitness:</label>",
			"<label title=\"Gewichtung der Stärke auf fremden Positionen\" style=\"margin: 0px 5px 0px 5px\">Fremdposition:</label>"
		]
	}
 
	class Player {
        constructor(playerID, position, form, strength, age, talent, rightF, leftF, schusstechnik, schusskraft, technik, schnelligkeit, kopfball, zweikampf, athletik, kondition, fitness, taktik, linie, rauslaufen, strafraum, fuß, spieleroeffnung, libero) {
        
			this.playerID = playerID;
			this.position = position;
			this.form = form;
		  	this.strength = strength;
			this.age = age;
			this.talent = talent;
			this.rightF = rightF;
			this.leftF = leftF;
			this.schusstechnik = schusstechnik;
			this.schusskraft = schusskraft;
			this.technik = technik;
			this.schnelligkeit = schnelligkeit;
			this.kopfball = kopfball;
			this.zweikampf = zweikampf;
			this.athletik = athletik;
			this.kondition = kondition;
			this.fitness = fitness;
			this.taktik = taktik;
			this.linie = linie;
			this.rauslaufen = rauslaufen;
			this.strafraum = strafraum;
			this.fuß = fuß;
			this.spieleroeffnung = spieleroeffnung;
			this.libero = libero;
 
        }
    }
 
	function init(){
        waitForKeyElements (
            "div.ol-player-details-selected",
            checkDiv
        );
    }
 
    if (!window.OLToolboxActivated) {
       init();
    } else {
        window.OnlineligaFriendlyInfo = {
            init : init
        };
    }
})();