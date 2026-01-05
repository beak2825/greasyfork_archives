// ==UserScript==
// @name           Sakhmet Solitaire Autoplayer
// @namespace      sLAUGHTER
// @version        2.2
// @description    Sakhmet Solitaire autoplayer - original by sLAUGHTER
// @include        http://www.neopets.com/games/sakhmet_solitaire/*
// @require        https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/25959/Sakhmet%20Solitaire%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/25959/Sakhmet%20Solitaire%20Autoplayer.meta.js
// ==/UserScript==

var wait = rand(1100, 1500); // random time between 0.5 sec and 1.1 sec
var madeMove = false;

function rand(low, high) { return low + Math.floor(Math.random() * high); }

if ($('b:contains("OOPS!")').length == 0 && $('div:contains("You have reached the")').length == 0)
	window.setTimeout(autoPlay, wait);
else
    console.log("Hit an error, stop player to prevent loop");


function autoPlay() {
	navigateToGame();
	makeMove();
	if(!madeMove) {
		if(!drawCard())
			endGame();
	}
}

function navigateToGame() {
	if (window.location.pathname == "/games/sakhmet_solitaire/index.phtml" || window.location.pathname == "/games/sakhmet_solitaire/") {
		if(($("[value='Play Sakhmet Solitaire!']")).length > 0) {
			$("[name='game_level'][value=1]").attr("checked", "checked");
			$("[value='Play Sakhmet Solitaire!']").click();
			return false;
		}
		if(($("[value='Continue Playing']")).length > 0) {
			$("[value='Continue Playing']").click();
			return false;
		}
    }

	jQuery.fn.exists = function() { return this.length > 0; };
    if (window.location.pathname == "/games/sakhmet_solitaire/sakhmet_solitaire.phtml") {
        if($("[value='Play Sakhmet Solitaire Again!']").exists()) {
            $("[value='Play Sakhmet Solitaire Again!']").click();
            return false;
        }
    }
}

function processMove(originCard, destinationCard) {
	clickCardImage($(originCard));
	clickCardImage($(destinationCard));
	madeMove = true;
}


function Card(cardImg, urlLocation) {
	card = cardImg.attr(urlLocation);

	var colors = {
		"spades": "black",
		"clubs": "black",
		"hearts": "red",
		"diamonds": "red"
	};

	if (card == undefined) {
		return false;
	}

	card = card.replace("http://images.neopets.com/games/mcards/", "");
	card = card.replace(".gif", "");
	this.img = cardImg;
	this.urlLocation = urlLocation;
	this.num = parseInt(card.substr(0, card.indexOf("_"))) | 0;
	this.suit = card.substr(card.indexOf("_") + 1);
	this.suitcolor = colors[card.substr(card.indexOf("_") + 1)];

	if(cardImg.parent().attr("onclick").indexOf("stack_0") != -1)
		this.isDrawnCard = true;
	else
		this.isDrawnCard = false;
}

function isMovePossible(origin, destination) {
	if (destination.num == 14) {
		return false;
	}
	if (origin.num == destination.num - 1 && origin.suitcolor != destination.suitcolor && !destination.isDrawnCard) {
		return true;
	}
	return false;
}

function makeMove() {
	var drawnCardImg = $("a[onclick*='stack_0']").find("img");
    var drawnCard = new Card($(drawnCardImg), "id");

	if(processCardPiles(drawnCard))
		return true;
	if(processFreeingMoves(drawnCard))
		return true;
    if(consolidatePiles())
		return true;

	return false;
}

function processCardPiles(drawnCard) {
	var cardPiles = $("td").find("img.deckcards[name]:last");

	$.each(cardPiles, function(key, value) {
		currentCard = new Card($(value), "src");

		if (moveCardToPile(drawnCard, currentCard))
			return false;
		if(processFreeingMoves(currentCard))
			return false;
    });

	return madeMove;
}

function moveCardToPile(originCard, destinationCard) {
	if (isMovePossible(originCard, destinationCard)) {
		console.log("mDCTP - " + originCard.num + originCard.suit + " to " + destinationCard.num + destinationCard.suit);
		processMove(originCard.img, destinationCard.img);
		return true;
	}
	return false;
}


function processFreeingMoves(card) {
	if(moveAceToAcePile(card))
		return true;
	if(moveKingToEmptyPile(card))
		return true;
	if(moveCardToAcePile(card))
		return true;

	return false;
}

function moveAceToAcePile(card) {
	currentCardImg = card.img;
	if (card.num == 14) {
		console.log("mATAP - " + card.num + card.suit + " to open ace pile");
		processMove(currentCardImg, $($("img[src*='new_open']")[0]));
		return true;
	}
	return false;
}

function moveKingToEmptyPile(card) {
	currentCardImg = card.img;
	if (card.num == 13 && $("img[src*='new_blank_card']").length > 0 && $("img[src*='new_blank_card']").parent().prop("tagName") == "A") {
		if(currentCardImg.closest("div").find("img:first").attr("src").indexOf("pyramid") != -1) { 
			console.log("mKTEP - " + card.num + card.suit + " to empty card pile");
			processMove(currentCardImg, $($("img[src*='new_blank_card']")[0]));
			return true;
		}
	}
	return false;
}

function moveCardToAcePile(card) {
	var cardImg = card.img;
	var find_ace = $("a[onclick*='base_']").find("img[src*='/" + getPreviousCardNum(card.num) + "_" + card.suit + "']");
	if (find_ace.length != 0) {
		console.log("mCTAP - " + card.num + card.suit + " to corresponding ace pile");
		processMove(cardImg, find_ace);
		return true;
	}
	return false;
}

function consolidatePiles() {
	var pileTopCards = $("td").find("img.deckcards[name]:first");

	$.each(pileTopCards, function(key, value) {
		var currentTopCard = new Card($(value), "src");

		if(moveKingToEmptyPile(currentTopCard))
			return false;

		if(movePileToPile(currentTopCard))
			return false;
	});

	return madeMove;
}

function movePileToPile(originCard) {

	var pileCards = $("td").find("img.deckcards[name]:last");
	$.each(pileCards, function(kee, val) {
		destinationCard = new Card($(val), "src");
		if(moveCardToPile(originCard, destinationCard))
			return false;
	});

	return madeMove;
}

function getPreviousCardNum(num) {
	num -= 1;
	if (num == 1) {
		return 14;
	}
	return num;
}

function clickCardImage(card) {
	card.click();
}

function drawCard() {
	if($($("a[href*='action=draw']").children()[0]).exists()) {
		$($("a[href*='action=draw']").children()[0]).click();
		return true;
	}
	return false;
}

function endGame() {
	if($("img[src*='new_empty']").exists() || $("body").html().indexOf("to collect your points!") != -1) {
		$("form[name='sakhmet_collect']").removeAttr("onsubmit").submit();
	}
}