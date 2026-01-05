// Archives Utility
//
// ==UserScript==
// @name          Archives Utility
// @description   Adds some cool stats to the archives of the PvP colosseum
// @grant         none
// @include       *127.0.0.1:*/peevpee.php*
// @include       *kingdomofloathing.com*/peevpee.php*
// @include       *127.0.0.1:*/charpane.php
// @include       *kingdomofloathing.com*/charpane.php
// @version 	  1.3
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace     https://greasyfork.org/scripts/5409-archives-utility/
// UPDATE 1.22    Fixed player search showing win:loss incorrectly
// UPDATE 1.3	  Added player search to overall results
// @downloadURL https://update.greasyfork.org/scripts/5409/Archives%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/5409/Archives%20Utility.meta.js
// ==/UserScript==

$(document).ready(function() {
	
	playerName = $('a[href="charsheet.php"]:not(:contains("<img"))', window.parent.frames["charpane"].document).text().toLowerCase();
	//playerName = 'your player name'.toLowerCase();
	//If the script cannot automatically obtain your player name (you have some other script installed that possibly conflicts, or some other issue)
	//remove that line and uncomment the other playerName line and manually add your own player name.
	//It's not ideal, but it's the best I can think of to work with conflicts.

	function addMinutes(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}

	function gainsCheck(string, gain, check) {
		if(check == 1 && string.indexOf("Fame") > 0){
			return string.match(/((-|\+)(\d{0,})\s(Fame))/)[0].split(gain)[0];
		} else if(check == 2 && string.indexOf("Swagger") > 0){
			return string.match(/((-|\+)(\d{0,})\s(Swagger))/)[0].split(gain)[0];
		} else if(check == 3 && string.indexOf("Stats") > 0){
			return string.match(/((-|\+)(\d{0,})\s(Stats))/)[0].split(gain)[0];
		} else if(check == 4 && string.indexOf("Flower") > 0){
			return string.match(/((-|\+)(\d{0,})\s(Flower))/)[0].split(gain)[0];
		} else if(check == 5 && string.indexOf("Lost" + String.fromCharCode(160)) > 0){
			itemCheck = {itemName:string.split("Lost" + String.fromCharCode(160))[1], itemTotal:-1};
			return itemCheck;
		} else if(check == 5 && string.indexOf("Stole" + String.fromCharCode(160)) > 0){
			itemCheck = {itemName:string.split("Stole" + String.fromCharCode(160))[1], itemTotal:+1};
			return itemCheck;
		} else {
			return 0;
		}
	}
	
	currentDate = new Date();
	currentUTC = addMinutes(currentDate, currentDate.getTimezoneOffset());
	
	if((parseInt(currentUTC.getMinutes()) >= 30 && parseInt(currentUTC.getHours()) >= 3) || parseInt(currentUTC.getHours()) >=4){
		currentUTC.setMinutes(30);
		currentUTC.setHours(3);
		currentUTC.setDate(currentUTC.getDate()-0);
	} else {
		currentUTC.setMinutes(30);
		currentUTC.setHours(3);
		currentUTC.setDate(currentUTC.getDate()-1);
	}
	
	$('b:contains("My Recent")').parent().parent().parent().parent().prepend('<div id="au-container" style="border: solid 1px blue; margin-bottom: 10px;"><div id="archives-utility" style="position: relative; padding: 1px; background: blue; color: white; text-align:center;"><a href="#" id="ua-stats-show" style="cursor:pointer; color: white;"><b>Archives Utility</b> <small>[calculate stats]</small></a></div><div id="archives-utility-stats" style="display: none; text-align: center;"><p style="margin: 10px;"><a href="#" id="showRoll" style="color: black; font-size: 10px;">[show/hide rollover stats]</a></p><table id="rolloverStats" style="border-collapse: collapse; width: 50%; margin: 0 auto; color: black;"></table><br /><p style="margin: 10px;"><a href="#" id="showAll" style="color: black; font-size: 10px;">[show/hide all stats]</a></p><table id="allStats" style="border-collapse: collapse; width: 50%; margin: 0 auto; color: black;"></table></div></div>');
	
	statsCalc = 0;
	color1 = 'blue';
	color2 = 'red';
	
	if(playerName=='mastersilex'){
		$('#au-container').css('background-color', 'blue');
		$('#au-container a, #au-container table').css('color', 'white');
		color1='#49e704';
	}
	
	$('#showRoll').click(function(){
		$('#rolloverStats').toggle();
		return false;
	});
	
	$('#showAll').click(function(){
		$('#allStats').toggle();
		return false;
	});
	
	//$('table.small').css({'border-collapse' : 'collapse'});
	
	//$('table.small > tbody > tr > td').css({'padding' : '3px 2px', 'border' : 'solid 1px black'});
	
	$('area[href="peevpee.php?place=logs"]').attr('href', 'peevpee.php?place=logs&mevs=0&oldseason=0&showmore=1');
	$('a[href="peevpee.php?place=logs"]').attr('href', 'peevpee.php?place=logs&mevs=0&oldseason=0&showmore=1');
	
	fameTotal = 0;
	swaggerTotal = 0;
	statsTotal = 0;
	flowerTotal = 0;
	fameTaken = 0;
	offensiveWins = 0;
	defensiveWins = 0;
	offensiveLosses = 0;
	defensiveLosses = 0;
	winningness = 0;
	totalRecords = 0;
	itemsStolen = "";
	itemsLost = "";
	rolloverStats = 0;
	dominationWins = 0;
	itemsList = [];
	itemsHtml = "";
	
	$('#ua-stats-show').click(function(){
									   
		$('#ua-stats-show > small').text('[show/hide]');
									   
		$('#archives-utility-stats').toggle();
		
		if(statsCalc == 0){
	
			$('table.small > tbody > tr').each(function(){
		
				dateText = $(this).children('td:nth-child(5)').text();
				dateMonth = parseInt(dateText.split('-')[0])-1;
				dateDay = parseInt(dateText.split('-')[1]);
				
				dateTime = dateText.split(' ')[1];
				dateHour = parseInt(dateTime.split(':')[0]);
				dateMinAmPm = dateTime.split(':')[1];
				dateMin = parseInt(dateMinAmPm.replace("pm","").replace("am",""));
				
				currentDate = new Date();
				dateYear = parseInt(currentDate.getFullYear());
				
				dateHourAdd = 0;
				if(dateMinAmPm.indexOf("pm") > 0 && dateHour != 12){
					dateHourAdd = 720;
				}
				
				archiveDate = new Date(dateYear, dateMonth, dateDay, dateHour, dateMin);
				archiveDate = addMinutes(archiveDate, dateHourAdd);
				
				archiveUTC = addMinutes(archiveDate, archiveDate.getTimezoneOffset());
				
				if(Math.abs(currentUTC > archiveUTC) && rolloverStats == 0){
					
					swaggerAverage = (swaggerTotal / (offensiveWins+offensiveLosses)).toFixed(3);
					if(isNaN(swaggerAverage)){swaggerAverage=0;}
					
					/*itemsList = jQuery.grep(itemsList, function(value) {
					  return value != 0;
					});
					
					itemsList.sort(function(a,b) {
						  var aName = a.itemName.toLowerCase();
						  var bName = b.itemName.toLowerCase(); 
						  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
					});
					
					for (var i=0; i<itemsList.length; i++) {
						//if(itemsList[i].itemName == itemsList[i+1].itemName){
						//	itemsList[i].itemTotal += itemsList[i+1].itemTotal;
						//	itemsList.splice(itemsList[i+1],1);
						//}
						itemsHtml += '<p>' + itemsList[i].itemName + ' : ' + itemsList[i].itemTotal + '</p>';
					}*/
					
					$('#rolloverStats').append('<tr><td>Records (since Rollover): </td><td>' + totalRecords + '</td></tr><tr><td>Total Fame: </td><td>' + fameTotal + '</td></tr><tr><td>Fame Taken: </td><td>' + fameTaken + '</td></tr><tr><td>Swagger Gained: </td><td>' + swaggerTotal + '</td></tr><tr><td>Average Swagger: </td><td>' + swaggerAverage + '</td></tr><tr><td>Stats Lost: </td><td>' + (statsTotal*-1) + '</td></tr><tr><td>Flowers Picked: </td><td>' + flowerTotal + '</td></tr><tr><td>Winningness: </td><td>' + winningness + '</td></tr><tr><td>Offensive W/L: </td><td>' + offensiveWins + ':' + offensiveLosses + '</td></tr><tr><td>Defensive W/L: </td><td>' + defensiveWins + ':' + defensiveLosses + '</td></tr><tr><td>Overall W/L: <div style="display:none;position:relative;"></div></td><td>' + (offensiveWins+defensiveWins) + ':' + (offensiveLosses+defensiveLosses) + '</td></tr><tr><td>7-0 Wins: </td><td>' + dominationWins + '</td></tr><tr><td>vs Player: </td><td><input placeholder="[player name]" id="rolloverSearch" style="width: 100px;" type="text" /></td></tr><tr class="rolloverShow" style="display:none"><td>Fights Wasted: </td><td><span id="rolloverWasted"></span></td></tr><tr class="rolloverShow"  style="display:none"><td>Overall W/L: </td><td><span id="specificWL"></span></td></tr>');
					
					rolloverStats = 1;
				} else {
					
					//$(this).css('background-color', '#bbffbb');
					totalRecords += 1;
					
					gainString = $(this).children('td:nth-child(6)').text();
					leftCol = $(this).children('td:nth-child(2)').html().toLowerCase();
					fameNum = parseInt(gainsCheck(gainString, " Fame", 1));
					
					fameTotal += fameNum;
					if(fameNum>0 && leftCol.indexOf(playerName) > 0){
						fameTaken+=fameNum;
					}
					if(leftCol.indexOf(playerName) > 0 && leftCol.indexOf('</b>') == -1){ // Offensive Loss
						offensiveLosses += 1;
						winningness += -1;
					} else if(leftCol.indexOf(playerName) > 0 && leftCol.indexOf('</b>') > 0){ //Offensive Win
						offensiveWins += 1;
						winningness += 1;
					} else if(leftCol.indexOf(playerName) == -1 && leftCol.indexOf('</b>') == -1) { //Defensive Win
						defensiveWins += 1;
					} else if(leftCol.indexOf(playerName) ==- 1 && leftCol.indexOf('</b>') > 0) { // Defensive Loss
						defensiveLosses += 1;
						winningness += -1;
					}
					
					if(leftCol.indexOf(playerName) > 0 && leftCol.indexOf('(7)') > 0){ //7:0 win
						dominationWins +=1;	
					}
					
					swaggerTotal += parseInt(gainsCheck(gainString, " Swagger", 2));
					statsTotal += parseInt(gainsCheck(gainString, " Stats", 3));
					flowerTotal += parseInt(gainsCheck(gainString, " Flower", 4));
					//itemsList.push(gainsCheck(gainString, " ", 5));
				}
			});
			
			swaggerAverage = (swaggerTotal / (offensiveWins+offensiveLosses)).toFixed(3);
			if(isNaN(swaggerAverage)){swaggerAverage=0;}
			
			$('#allStats').append('<tr><td>All Records Showing: </td><td>' + totalRecords + '</td></tr><tr><td>Total Fame: </td><td>' + fameTotal + '</td></tr><tr><td>Fame Taken: </td><td>' + fameTaken + '</td></tr><tr><td>Swagger Gained: </td><td>' + swaggerTotal + '</td></tr><tr><td>Average Swagger: </td><td>' + swaggerAverage + '</td></tr><tr><td>Stats Lost: </td><td>' + (statsTotal*-1) + '</td></tr><tr><td>Flowers Picked: </td><td>' + flowerTotal + '</td></tr><tr><td>Winningness: </td><td>' + winningness + '</td></tr><tr><td>Offensive W/L: </td><td>' + offensiveWins + ':' + offensiveLosses + '</td></tr><tr><td>Defensive W/L: </td><td>' + defensiveWins + ':' + defensiveLosses + '</td></tr><tr><td>Overall W/L: </td><td>' + (offensiveWins+defensiveWins) + ':' + (offensiveLosses+defensiveLosses) + '</td></tr><tr><td>7-0 Wins: </td><td>' + dominationWins + '</td></tr><tr><td>vs Player: </td><td><input placeholder="[player name]" id="allSearch" style="width: 100px;" type="text" /></td></tr><tr class="allShow" style="display:none"><td>Fights Wasted: </td><td><span id="allWasted"></span></td></tr><tr class="allShow"  style="display:none"><td>Overall W/L: </td><td><span id="allSpecificWL"></span></td></tr>');
			
			$('#allStats td, #rolloverStats td').css({'padding' : '3px 2px', 'font-size' : '12px', 'width' : '50%'});
			
			$('#allStats td:nth-child(1), #rolloverStats td:nth-child(1)').css('text-align', 'right');
			$('#allStats td:nth-child(2), #rolloverStats td:nth-child(2)').css('font-weight', 'bold');
			
			statsCalc = 1;
			
		}
		
		return false;
		
	});

	jQuery(document).on('keypress', '#rolloverSearch', function(event){
																
		if(event.keyCode == 13){ // Enter Key
			searchName = $('#rolloverSearch').val().toLowerCase();
			totalFightsWasted = 0;
			searchLoss = 0;
			searchWin = 0;
			$('table.small > tbody > tr').each(function(){	
				dateText = $(this).children('td:nth-child(5)').text();
				dateMonth = parseInt(dateText.split('-')[0])-1;
				dateDay = parseInt(dateText.split('-')[1]);
				
				dateTime = dateText.split(' ')[1];
				dateHour = parseInt(dateTime.split(':')[0]);
				dateMinAmPm = dateTime.split(':')[1];
				dateMin = parseInt(dateMinAmPm.replace("pm","").replace("am",""));
				
				currentDate = new Date();
				dateYear = parseInt(currentDate.getFullYear());
				
				dateHourAdd = 0;
				if(dateMinAmPm.indexOf("pm") > 0 && dateHour != 12){
					dateHourAdd = 720;
				}
				
				archiveDate = new Date(dateYear, dateMonth, dateDay, dateHour, dateMin);
				archiveDate = addMinutes(archiveDate, dateHourAdd);
				
				archiveUTC = addMinutes(archiveDate, archiveDate.getTimezoneOffset());
				
				if(Math.abs(currentUTC > archiveUTC)){
					return false;
				} else {
					leftCol = $(this).children('td:nth-child(2)').html().toLowerCase();
					rightCol = $(this).children('td:nth-child(4)').html().toLowerCase();
					if(leftCol.indexOf(searchName + '<') > 0){
						totalFightsWasted += 1;
					}
					if(leftCol.indexOf(searchName + '</b>') > 0 || rightCol.indexOf(searchName + '</b>') > 0){
						searchLoss += 1;
					} else if(leftCol.indexOf(searchName + '</a>') > 0 || rightCol.indexOf(searchName + '</a>') > 0){
						searchWin += 1;
					}
				}
			});
			$('.rolloverShow').show();
			$('#rolloverWasted').html(totalFightsWasted);
			$('#specificWL').html(searchWin + ':' + searchLoss);
		}
	});
	
	jQuery(document).on('keypress', '#allSearch', function(event){
																
		if(event.keyCode == 13){ // Enter Key
			searchName = $('#allSearch').val().toLowerCase();
			totalFightsWasted = 0;
			searchLoss = 0;
			searchWin = 0;
			$('table.small > tbody > tr').each(function(){					
				leftCol = $(this).children('td:nth-child(2)').html().toLowerCase();
				rightCol = $(this).children('td:nth-child(4)').html().toLowerCase();
				if(leftCol.indexOf(searchName + '<') > 0){
					totalFightsWasted += 1;
				}
				if(leftCol.indexOf(searchName + '</b>') > 0 || rightCol.indexOf(searchName + '</b>') > 0){
					searchLoss += 1;
				} else if(leftCol.indexOf(searchName + '</a>') > 0 || rightCol.indexOf(searchName + '</a>') > 0){
					searchWin += 1;
				}
			});
			$('.allShow').show();
			$('#allWasted').html(totalFightsWasted);
			$('#allSpecificWL').html(searchWin + ':' + searchLoss);
		}
	});

	$('b:contains("My Recent 1000 Fights")').html("My Recent <del>1000</del> 999 Fights");

});