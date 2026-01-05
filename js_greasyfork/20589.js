// ==UserScript==
// @name        CotG Raiding tool (yankoe)
// @version     0.3.4
// @description Calculates troops needed for raiding
// @author      yankoe
// @match       https://*.crownofthegods.com
// @grant		none
// @namespace   https://greasyfork.org/users/49121

// @downloadURL https://update.greasyfork.org/scripts/20589/CotG%20Raiding%20tool%20%28yankoe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20589/CotG%20Raiding%20tool%20%28yankoe%29.meta.js
// ==/UserScript==

// GREASYFORK VERSION

(function() {
	'use strict';
	$(document).ready(function () {
		console.log( "Placing ykRaid button" );
		
		// add ui button after "Raid" button
		var butYkraid = "<br><button id='yk_raid' class='regButton greenb' style='margin-left: 2%;margin-top: 8px;width: 96%;'>ykRaid</button>";
		$("#raidDungGo").after(butYkraid);

		var btnExport = $("#yk_raid");

		btnExport.on('click', () => {
			ykRaidingTool();
		});
	});

	function ykRaidingTool() {
		$('#raidDungGo')[0].click()
		console.log( "ykRaidingTool Calculating raiding suggestions" );
		// loot / lvl
		var cavBaseRes=new Array(
			Array(0,360,960,4082,14908,31004,54655,112539,190506,283835,423884),   // Mountain res available lvl 0 -> 10
			Array(0,375,1000,4258,15519,32298,56920,117154,197561,295472,441263),  // Forest
			Array(0,375,1000,4258,15519,32298,56920,117154,197561,295472,441263),  // Hill
			Array(0,375,1000,4258,15519,32298,56920,117154,197561,295472,441263)   // Siren cove
			);
		var cavTypes=["Mountain Cavern","Forest Cavern","Hill Cavern","Siren's Cove"];
		var unitNames=["Guards","Ballistas","Rangers","Triari","Priestess","Vanquishers","Sorcerers","Scouts","Arbalists","Praetors","Horsemen","Druids","Rams","Scorpions","Galleys","Stingers","Warships"];
		var unitLoot=[0,0,10,20,10,10,5,0,15,20,15,10,0,0,1000,1500,3000]; // units carry capacity
		var unitLossFactor=new Array(
			Array(0,0,1.022,1.022,1.04,1.011,1.02,0,1.05,1.05,1.05,1.05,0,0,0,0,0),   // Mountain
			Array(0,0,1.04,1.04,1.06,1.03,1.02,0,1.015,1.01,1.01,1.05,0,0,0,0,0),     // Forest
			Array(0,0,1.04,1.04,1.06,1.03,1.01,0,1.05,1.05,1.05,1.01,0,0,0,0,0),      // Hill
			Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.02,1.02,1.02)                         // Siren cove
			);
		var cavern = new Array ($('#dunglevelregion').text(), $('#Progress').text(), $('#dungcoordsregion').text(), $('#dungtypespot').text());
		// console.dir(cavern);

		// cavern type
		var cavTypeID = $.inArray(cavern[3], cavTypes);
		// console.log(cavTypeID);
		// console.log(cavTypes[cavTypeID]);

		// progress
		var cavProgress = 100 - cavern[1];
		//console.log('Progress = ', cavProgress);

		// Available Res
		var cavLoot = Math.round (cavBaseRes[cavTypeID][cavern[0]] * (1 + cavProgress / 100));
		// console.log('Available Loot:', cavLoot);

		// cid
		// var coords = cavern[2].split(':');
		// var cid = (coords[1]*65536) + (coords[0]*1);

		jQuery.ajax({url: 'includes/gSt.php',type: 'POST',aysnc:false,
			success: function() {
				// remove previous table header if any
				$("#raidtableheadid").remove();
				// raid table modification - adding table header
				var $raidTableHeader = $("<thead>", {id: "raidtableheadid"});
				$raidTableHeader.insertBefore( $('#raidTrps tbody'));

				var $headerRow = $( "<tr></tr>" );
				// building column headers
				var $tdheadtroops = $( "<th>Troops</th>" );
				//tdheadtroops.style.textAlign = 'center';
				var $tdheadmax = $( "<th>Max</th>" );
				//tdheadmax.style.textAlign = 'center';
				var $tdheadtarget = $( "<th>Target</th>" );
				//tdheadtarget.style.textAlign = 'center';
				var $tdheadS1 = $( "<th>+5%</th>" );
				//tdheadS1.style.textAlign = 'center';
				var $tdheadS2 = $( "<th>+10%</th>" );
				//tdheadS2.style.textAlign = 'center';
				$headerRow.append($( "<th></th>" ));
				$headerRow.append($tdheadtroops);
				$headerRow.append($( "<th></th>" ));
				$headerRow.append($( "<th></th>" ));
				$headerRow.append($tdheadmax);
				$headerRow.append($tdheadtarget);
				$headerRow.append($tdheadS1);
				$headerRow.append($tdheadS2);
				$raidTableHeader.append($headerRow);


				// raid table body
				for (var i = 2; i <= 16; i++) {
					if (unitNames[i]=='Guards' || unitNames[i]=='Ballistas' || unitNames[i]=='Rams' || unitNames[i]=='Scorpions' || unitNames[i]=='Scouts') {
						// these units can't raid
						continue;
					}
					// 100% loot carry
					var td = document.createElement('td');
					var unitLine = document.getElementById('raidTR'+i).appendChild(td);
					var button = document.createElement('button');
					var suggestion=Math.ceil( cavLoot/unitLoot[i] * unitLossFactor[cavTypeID][i]);
					// 105% loot carry
					var td05 = document.createElement('td');
					var unitLine05 = document.getElementById('raidTR'+i).appendChild(td05);
					var button05 = document.createElement('button');
					var suggestion05=Math.ceil( cavLoot/unitLoot[i] * unitLossFactor[cavTypeID][i] * 1.05);
					// 110% loot carry
					var td10 = document.createElement('td');
					var unitLine10 = document.getElementById('raidTR'+i).appendChild(td10);
					var button10 = document.createElement('button');
					var suggestion10=Math.ceil( cavLoot/unitLoot[i] * unitLossFactor[cavTypeID][i] * 1.1);

					td.setAttribute('class', 'tdwithMaxButton maxRaid');
					button.setAttribute('class', 'brownb');
					button.setAttribute('unit', i);
					button.setAttribute('suggestion', suggestion);
					td.appendChild(button);
					// +5%
					td05.setAttribute('class', 'tdwithMaxButton maxRaid');
					button05.setAttribute('class', 'brownb');
					button05.setAttribute('unit', i);
					button05.setAttribute('suggestion05', suggestion05);
					td05.appendChild(button05);
					// +10%
					td10.setAttribute('class', 'tdwithMaxButton maxRaid');
					button10.setAttribute('class', 'brownb');
					button10.setAttribute('unit', i);
					button10.setAttribute('suggestion10', suggestion10);
					td10.appendChild(button10);

					var textButton = document.createTextNode(suggestion);
					button.addEventListener('mouseup', function(node) {
							document.getElementById('raidIP'+node.path[0].getAttribute('unit')).value = node.path[0].getAttribute('suggestion');
					}, false);
					button.appendChild(textButton);

					var textButton05 = document.createTextNode(suggestion05);
					button05.addEventListener('mouseup', function(node) {
							document.getElementById('raidIP'+node.path[0].getAttribute('unit')).value = node.path[0].getAttribute('suggestion05');
					}, false);
					button05.appendChild(textButton05);

					var textButton10 = document.createTextNode(suggestion10);
					button10.addEventListener('mouseup', function(node) {
							document.getElementById('raidIP'+node.path[0].getAttribute('unit')).value = node.path[0].getAttribute('suggestion10');
					}, false);
					button10.appendChild(textButton10);
				}
				// adding info for R/T raids in game left sidepanel
				// remove previous div if any
				$("#ykdungRTSuggest").remove();
				// insert a table for each separate proportion of R/T
				// 50-50 table
				// rangers - id = 2
				var $totalLoot = Math.ceil(cavLoot/unitLoot[2] * unitLossFactor[cavTypeID][2]);
				var $rtrsug00 = Math.ceil($totalLoot/3);
				var $rtrsug05 = Math.ceil($rtrsug00 * 1.05);
				var $rtrsug10 = Math.ceil($rtrsug00 * 1.1);
				// Triaris - id = 3
				var $rttsug00 = Math.ceil($totalLoot/3);
				var $rttsug05 = Math.ceil($rttsug00 * 1.05);
				var $rttsug10 = Math.ceil($rttsug00 * 1.1);

				var $rtdivhtml = '<div id="ykdungRTSuggest" style="clear:both;padding: 20px;font-size: small;">Rangers/Triaris raids:';
				$rtdivhtml += '<table><thead style="font-size: smaller;"><th>50%/50%</th><th>Target</th><th>+5%</th><th>+10%</th></thead>';
				$rtdivhtml += '<tbody>';
				$rtdivhtml += '<tr><td>Rangers</td><td>'+$rtrsug00+'</td><td>'+$rtrsug05+'</td><td>'+$rtrsug10+'</td></tr>';
				$rtdivhtml += '<tr><td>Triaris</td><td>'+$rttsug00+'</td><td>'+$rttsug05+'</td><td>'+$rttsug10+'</td></tr>';
				$rtdivhtml += '</tbody></table></div>';
				var $rtdiv = $($rtdivhtml);
				$('#squaredung').append($rtdiv);
				$('#ykdungRTSuggest td').css('text-align','center');
				// set div to be deleted when cavern changes
				$('#dungcoordsregion td').change(function() {
					$("#ykdungRTSuggest").remove();
				});
			}
		});
	};
})();
