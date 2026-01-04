// ==UserScript==
// @author        Xiphias[187717]
// @name          Torn City - High Low Casino Xiphias[187717]
// @description   High Low help
// @namespace     https://greasyfork.org/users/3898
// @include       http://www.torn.com/loader.php?sid=highlow*
// @include       http://torn.com/loader.php?sid=highlow*
// @include       https://www.torn.com/loader.php?sid=highlow*
// @include       https://torn.com/loader.php?sid=highlow*
// @version       0.5.0
// @downloadURL https://update.greasyfork.org/scripts/367635/Torn%20City%20-%20High%20Low%20Casino%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/367635/Torn%20City%20-%20High%20Low%20Casino%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==

/************************* Initiate variables ****************/
initializeDeck();

/*************************************************************/

function setCasinoAjaxListener() {
	var isHighLow = 'sid=hiloJson';
	$('body').ajaxComplete(function (e, xhr, settings) {
		var url = settings.url;
		if (url.indexOf(isHighLow) >= 0) {
			var responseText = xhr.responseText;
			var obj = tryParseJSON(responseText);
			if (obj) {
				if (obj.length > 0) {
					//console.log("Object has length > 0");
					obj = obj[0];
				}

				if (obj.hasOwnProperty('status')) {

					if (obj.hasOwnProperty("DB") && obj.DB.deckShuffled) {
						//console.log("deckShuffled");
						setValue("currentDeck", resetDeck());
					}

                    else if (obj.hasOwnProperty("currentGame") && obj.currentGame[0].currentDeck) { // Always use currentDeck variable from the ajax response as the most up to date deck.
						//console.log('currentDeck variable available');
						var currentDeckTemp = obj.currentGame[0].currentDeck;
                        //console.log("Window Deck : " + window.currentDeck);
                        //console.log("Current Deck: " + currentDeckTemp);
						setValue("currentDeck", stringToArray(currentDeckTemp));
					}
                    
					if (obj.status == 'gameStarted') {
						//console.log("gameStarted");
                        //console.log(printDeck(window.currentDeck));
                        
                        
						var dealerCard = obj.currentGame[0].dealerCard;
						removeCardFromDeck(dealerCard);

						var dealerCardTranslated = translateCard(dealerCard);
                        
                        // Hide the High or Low button if the card is one of the boundary cards.
                        if (dealerCardTranslated == 2) {
                            $('.action-c.action-btn-wrap.active.low').hide();
                            //$('.action-r.action-btn-wrap.active.high').click();
                        } else if (dealerCardTranslated == 14) { // Ace
                            $('.action-r.action-btn-wrap.active.high').hide();
                            //$('.action-c.action-btn-wrap.active.low').click();
                        }
                        
                        var currentDeckTranslated = translateDeck(window.currentDeck);

						var lowProb = probIsLower(dealerCardTranslated, currentDeckTranslated);
						var highProb = probIsHigher(dealerCardTranslated, currentDeckTranslated);

						var lowProbEquals = probIsLowerEquals(dealerCardTranslated, currentDeckTranslated);
						var highProbEquals = probIsHigherEquals(dealerCardTranslated, currentDeckTranslated);
                        
                        if (highProbEquals == 1) {
                            $('.action-c.action-btn-wrap.active.low').hide();
                            //$('.action-r.action-btn-wrap.active.high').click();
                        } else if (lowProbEquals == 1) {
                            $('.action-r.action-btn-wrap.active.high').hide();
                            //$('.action-c.action-btn-wrap.active.low').click();
                        }

						updateTable(highProb, lowProb, highProbEquals, lowProbEquals, printDeck(window.currentDeck));
                        if (highProbEquals > lowProbEquals) {
                            colorButtons("high");
                            $('.action-c.action-btn-wrap.active.low').hide();
                        }
                        else if (highProbEquals < lowProbEquals) {
                            colorButtons("low");
                            $('.action-r.action-btn-wrap.active.high').hide();
                        }
                        else {
                            
                            colorButtons("equals");
                            $('.action-c.action-btn-wrap.active.low').hide();
                            
                        }
					} else if (obj.status == 'makeChoice') {
						//console.log('makeChoice');
						var playerCard = obj.currentGame[0].playerCard;
						removeCardFromDeck(playerCard);

					} else if (obj.status == 'moneyTaken') {
						//console.log('moneyTaken');
                        clearTable();

					} else if (obj.status == 'startGame') {
                        // Fix for a select menu disabled bug: September 1st 2015
                        $('#bet-choice-button').removeClass('ui-state-disabled').addClass('ui-state-enabled');
                        $('#bet-choice-button').attr('aria-disabled', 'false');
						//console.log('startGame');

					} else if (obj.status == 'cashedInHalf') {
						//console.log('cashedInHalf');
                        clearTable();
					}



				}
			}
		}
	});
}

function tryParseJSON(jsonString) {
	try {
		var o = JSON.parse(jsonString);
		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		// but... JSON.parse(null) returns 'null', and typeof null === "object",
		// so we must check for that, too.
		if (o && typeof o === 'object' && o !== null) {
			return o;
		}
	} catch (e) {}
	return false;
};

function disableButton(highorlow) {
    
}

function initializeDeck() {
    var currentDeck = getValue("currentDeck");
    if (currentDeck == "") {
        //console.log("No deck saved");
        window.currentDeck = resetDeck();
    } else {
        //console.log("Deck saved and found");
        window.currentDeck = currentDeck;
    }
}

function setValue(key, val) {
    //console.log("Set deck cookie");
    window.currentDeck = val;
	localStorage.setItem(key, val);
}

function getValue(key) {
	var item = localStorage.getItem(key);
	if (item) {
		return item;
	} else {
		return "";
	}
}

function translateDeck(currentDeck) {
    if (currentDeck instanceof Array) {
        currentDeck = currentDeck.join(',');
    }
	var translatedDeck = [];
	var splittedList = currentDeck.split(',');
	//console.log("Deck size = " + splittedList.length);
	$('#deck-count').html(splittedList.length);

	for (var i = 0; i < splittedList.length; i++) {
		translatedDeck.push(translateCard(splittedList[i]));
	}
	return translatedDeck;
}

function arrayToString(array) {
	return array.join(",");
}

function stringToArray(string) {
	return string.split(",");
}

function removeCardFromDeck(card) {
	var index = window.currentDeck.indexOf(card);
	if (index > -1) {
		window.currentDeck.splice(index, 1);
	}
    $('#cards-left').html(printDeck(window.currentDeck));
    $('#deck-count').html(window.currentDeck.length);
    setValue("currentDeck", window.currentDeck);
}

function printDeck(deckArray) {
    var output = "";
    for (var i = 0; i < deckArray.length; i++) {
        output += cardToLetter(deckArray[i]);
        if (i < deckArray.length - 1) {
            output += ",";
        }
    }
    return output;
}

function resetDeck() {
	var array = [];
	for (var i = 1; i < 53; i++) {
		array.push(i.toString());
	}
	return array;
}

function translateCard(card) {
	return (Math.floor(parseInt(card - 1) / 4) + 2);
}

function cardToLetter(card) {
    card = translateCard(card);
	if (card == "11")
		return "J";
	else if (card == "12")
		return "Q";
	else if (card == "13")
		return "K";
	else if (card == "14")
		return "A";
	else
		return card;
}

function probIsHigher(number, numberList) {

	var higher = 0;

	for (var i = 0; i < numberList.length; i++) {
		var j = numberList[i];

		if (j > number)
			higher++;
	}

	return higher / numberList.length;
}

function probIsLower(number, numberList) {

	var lower = 0;

	for (var i = 0; i < numberList.length; i++) {
		var j = numberList[i];

		if (j < number)
			lower++;
	}

	return lower / numberList.length;
}

function probIsHigherEquals(number, numberList) {

	var higher = 0;

	for (var i = 0; i < numberList.length; i++) {
		var j = numberList[i];

		if (j >= number)
			higher++;
	}

	return higher / numberList.length;
}

function probIsLowerEquals(number, numberList) {

	var lower = 0;

	for (var i = 0; i < numberList.length; i++) {
		var j = numberList[i];

		if (j <= number)
			lower++;
	}

	return lower / numberList.length;
}

/*
Things to implement:
Save deck in window variable or cookie
Enable shuffle check (shuffleDeck : false, shuffleDeck : true)

GUI onpage. Maybe in a table

|-------------------------------------|
| Low | High | LowEquals | HighEquals |
|-------------------------------------|
| 0.5 | 0.2  | 0.6       | 0.3        |
|-------------------------------------|


 */

function addTableStyles() {

	var style_css = ' #probability-table, #deck-table { background: #fafafa url(http://jackrugile.com/images/misc/noise-diagonal.png); color: #444; font: 100%/30px "Helvetica Neue", helvetica, arial, sans-serif; text-shadow: 0 1px 0 #fff; } #probability-table, #deck-table { background: #f5f5f5; border-collapse: separate; box-shadow: inset 0 1px 0 #fff; font-size: 12px; line-height: 24px; margin: 30px auto; text-align: left; width: 800px; } #probability-table th, #deck-table th { background: url(http://jackrugile.com/images/misc/noise-diagonal.png), linear-gradient(#777, #444); border-left: 1px solid #555; border-right: 1px solid #777; border-top: 1px solid #555; border-bottom: 1px solid #333; box-shadow: inset 0 1px 0 #999; color: #fff; font-weight: bold; padding: 10px 15px; position: relative; text-shadow: 0 1px 0 #000; } #probability-table th:after, #deck-table th:after { background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08)); content: ""; display: block; height: 25%; left: 0; margin: 1px 0 0 0; position: absolute; top: 25%; width: 100%; } #probability-table th:first-child, #deck-table th:first-child { border-left: 1px solid #777; box-shadow: inset 1px 1px 0 #999; } #probability-table th:last-child, #deck-table th:last-child { box-shadow: inset -1px 1px 0 #999; } #probability-table td, #deck-table td { border-right: 1px solid #fff; border-left: 1px solid #e8e8e8; border-top: 1px solid #fff; border-bottom: 1px solid #e8e8e8; padding: 10px 15px; position: relative; transition: all 300ms; } #probability-table td:first-child, #deck-table td:first-child { box-shadow: inset 1px 0 0 #fff; } #probability-table td:last-child, #deck-table td:last-child { border-right: 1px solid #e8e8e8; box-shadow: inset -1px 0 0 #fff; } #probability-table tr, #deck-table tr { background: url(http://jackrugile.com/images/misc/noise-diagonal.png); } #probability-table tr:nth-child(odd) td, #deck-table tr:nth-child(odd) td { background: #f1f1f1 url(http://jackrugile.com/images/misc/noise-diagonal.png); } #probability-table tr:last-of-type td, #deck-table tr:last-of-type td{ box-shadow: inset 0 -1px 0 #fff; } #probability-table tr:last-of-type td:first-child, #deck-table tr:last-of-type td:first-child { box-shadow: inset 1px -1px 0 #fff; } #probability-table tr:last-of-type td:last-child, #deck-table tr:last-of-type td:first-child{ box-shadow: inset -1px -1px 0 #fff; }';
	$('head').append('<style type="text/css">' + style_css + '</style>');
}

function addTables() {
	var tableProb = '<table id="probability-table" class="probability-table"  ><thead><tr><th>High</th><th>Low</th><th>High/Eq</th><th>Low/Eq</th></tr></thead><tbody><tr><td id="cell-high" >-</td><td id="cell-low" >-</td><td id="cell-high-eq" >-</td><td id="cell-low-eq" >-</td></tr></tbody></table>';
	var tableDeck = '<table id="deck-table"  class="probability-table" ><thead><tr><th>Deck count</th><th>Cards Left</th></tr></thead><tbody><tr><td id="deck-count" >-</td><td id="cards-left" >-</td></tr></tbody></table>';
	$('#mainContainer > .content-wrapper.m-left20.left').append(tableProb);
	$('#mainContainer > .content-wrapper.m-left20.left').append(tableDeck);

}

function updateTable(high, low, highEq, lowEq, cardsLeft) {
	$('#cell-high').html(high);
	$('#cell-low').html(low);
	$('#cell-high-eq').html(highEq);
	$('#cell-low-eq').html(lowEq);
	$('#cards-left').html(cardsLeft);
}

function clearTable() {
    var clearString = "-";
	$('#cell-high').html(clearString);
	$('#cell-low').html(clearString);
	$('#cell-high-eq').html(clearString);
	$('#cell-low-eq').html(clearString);
	$('#cards-left').html(clearString);
    $('#deck-count').html(clearString);
}

function colorButtons(highorlow) {
    green = "rgb(10, 215, 10)";
    red = "rgb(230, 25, 25)";
    // Reset colors
    $('.action-c.action-btn-wrap.active.low').css('color', '');
    $('.action-r.action-btn-wrap.active.high').css('color', '');
    
    if (highorlow == "low") $('.action-c.action-btn-wrap.active.low').css('color', green);
    else if (highorlow == "high") $('.action-r.action-btn-wrap.active.high').css('color', green);
    else if (highorlow == "equals") {
        $('.action-c.action-btn-wrap.active.low').css('color', red);
        $('.action-r.action-btn-wrap.active.high').css('color', red);
    }
}

 
function disableDraggingFor(element) {
  // this works for FireFox and WebKit in future according to http://help.dottoro.com/lhqsqbtn.php
  element.draggable = false;
  // this works for older web layout engines
  element.onmousedown = function(event) {
                event.preventDefault();
                return false;
              };
}

$(document).ready(function () {
    try {

        addTableStyles();
        addTables();
        disableDraggingFor($('.action-c.action-btn-wrap.active.low').get(0));
        disableDraggingFor($('.action-r.action-btn-wrap.active.high').get(0));
        disableDraggingFor($('.action-c.action-btn-wrap.active.continue').get(0));

    } catch (e) {
        //console.log(e);
    }
    

});

setCasinoAjaxListener();
