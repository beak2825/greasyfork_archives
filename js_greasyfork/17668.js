// ==UserScript==
// @name TTA boardgaming online improved info
// @namespace Violentmonkey Scripts
// @version    1.12.3
// @description  Various tweaks to improve BGO (boardgaming-online.com). 
// @match      http://*.boardgaming-online.com/*
// @match      https://*.boardgaming-online.com/*
// @match      http://boardgaming-online.com/*
// @match      https://boardgaming-online.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/17668/TTA%20boardgaming%20online%20improved%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/17668/TTA%20boardgaming%20online%20improved%20info.meta.js
// ==/UserScript==

(function () {
	'use strict';
	/*jshint multistr: true */

	var parseQueryString = function () {

		var str = window.location.search;
		var params = {};

		str.replace(
			new RegExp("([^?=&]+)(=([^&]*))?", "g"),
			function ($0, $1, $2, $3) {
				params[$1] = $3;
			}
		);
		return params;
	};

	function addHelperClasses() {
		$("ul#carteJoueur").find("td:contains('Select 2 cards to discard:')").parent().addClass("selectDiscard");
		$("#contenu table:first").attr("id",'gameDescription');
		$('#centre').children().wrapAll("<div id='centerPanel'></div>");
	}



	function updateCSS() {

		//fix title menu z-index	
		GM_addStyle(`

table.tableau0 ul#indJoueur li ul { 
	position: relative;
	left: 0px;
	box-shadow: none;
	border: 1ps solid lightgray;
    border-radius: 0px;
	min-width: 305px;
	margin: 0px;
	background-color: white;
	padding: 0px;
	z-index: 0;
}

table.tableau0 ul#indJoueur { 
	padding: 0px;
}

table.tableau0 ul#indJoueur li.ind { 
	font-size:9px !important;
	position: relative;
	left: 0px;
	padding: 0px 0px 0px 16px;
	display:inline-block;
	width: 43px;
	border-right: 1px solid lightgrey;
	background-size: 13px 13px;
    background-position-x: 2px;
}

table.tableau0 ul#indJoueur li.ind:last-child { 
	border-right: none;
}

   table.tableau0 ul#indJoueur li.indPuissance { 
   width: 16px;
}

table.tableau0 ul#indJoueur li.indExploration { 
   width: 16px;
}

table.tableau0 ul#indJoueur li.indHF { 
    display:none;
}

table.tableau0 .resumeInfoDock img { 
    max-width: 12px;
    max-height: 12px;
    padding:0px; !important
    margin:0px; !important
}

table.tableau0 .resumeInfoDock span { 
    padding:0px 3px 0px 3px;
}


div.playerNameBox span.leaderNameInfo { 
    font-style:italic;
    font-size: xx-small;
    padding:0px 0px 0px 5px;
}

.resumeInfoDock { 
	margin-top:2px;
}

div#statusBar.warOn { 
	background-color:red;
}


img.miniWarIcon { 
	max-width:12px;
	max-height:12px;
	margin: 0px 3px;
}

img.miniWarIconDefense { 
	background-color: red;
}

div.skyscraper { 
	height:20px;
}

div.minijournal { 
	width: 150px;
}

div.minijournal h1.journalTitle { 
	text-align: center;
    background-color: lightgrey;
    font-size: small;
    margin: 2px 0px;
}

div.minijournal div.action { 
	border-bottom: 1px solid gray;
    padding: 2px 0px;
    border-left-style: solid;
    border-left-width: 5px;
    position: relative;
}

div.minijournal div.action p { 
    font-size: x-small !important;
    text-align: left !important; 
    padding: 0px;
    margin:0px;
}

div.minijournal div.action p.titre3 { 
}

div.minijournal div.action div.tooltip { 
    display: none;
}

div.minijournal div.action:hover div.tooltip { 
    display: block;
    position: absolute;
    left: 150px;
    top: 0px;
    background-color: ghostwhite;
    border: 1px solid black;
    border-radius: 5px;
    width: 250px;
    padding: 5px;
    z-index: 100;
}

div.minijournal div.action:hover div.tooltip p { 
    font-size: 0.7em !important;
    padding: 3px;
}

div.minijournal div.action:hover p.titre3 { 
    font-weight: bold;
}

div.minijournal div.action p.score { 
}

/*hide stats of inactive players*/
ul.inactivePlayer div.resumeInfoDock { 
    display:none;
}
`);
	} //end of updateCSS()

	function blink(elem, speed) {
		$(elem).bind('fade-cycle', function () {
			$(this).fadeOut(speed, function () {
				$(this).fadeIn(speed, function () {
					$(this).trigger('fade-cycle');
				});
			});
		});

		$(elem).trigger('fade-cycle');
	};

	var userTabs = $("ul.infoDock");
	var extraInfo = $(".resumeInfoDock");

	function addBasicDock() {
		//Add the happy faces (ir comes from the hidden panel)
		$("table.tableau0 div[id^=lienPlateau] > ul#indJoueur").each(function () {
			var playerTab = $(this)
			var playerContent = $(this).children('li').first();
			var hf = $(this).find("li.indHF").detach().children();
			var extraInfo = $(document.createElement("div"))
			//lets create an element with player name, fixing the non  tagged text
			var playerName = playerContent.contents()[0].nodeValue;
			playerContent.contents()[0].nodeValue = "";
			var playerNameSpan = $(document.createElement("span")).text(playerName);
			playerContent.prepend($('<div/>').append(playerNameSpan).addClass("playerNameBox"));

			playerContent.append(extraInfo.addClass("resumeInfoDock").append($('<span/>').addClass("happyfacesInfo").append(hf)));
			playerTab.addClass("infoDock");

			if (typeof playerContent.children('ul').html() === "undefined") playerTab.addClass("inactivePlayer");;


		});

		userTabs = $("ul.infoDock");
		extraInfo = $(".resumeInfoDock");

	}; //end function addBasicDockInformation()

	function addSubDock() {
		//Add civil actions, military actions and   (ir comes from the hidden panel)
		$("div.plateau").each(function (index) {
			var govDock = $(this).find('a.tta_government2');

			if (typeof govDock.html() === "undefined") return false;

			//lets get the actions:
			var imagesHolder = $(govDock).clone();

			//lets split them in military and civil, so we can give them distinct classes
			var civilActions = $($(imagesHolder).find("br").first()).nextUntil("br");
			$(extraInfo[index]).append($('<span/>').addClass("civilActionInfo").append(civilActions.removeClass()));

			var militaryActions = $(imagesHolder).find("br:eq(1)").nextAll();
			$(extraInfo[index]).append($('<span/>').addClass("militaryActionInfo").append(militaryActions.removeClass()));

			var leaderName = $(this).find("table.tableau4 img.imageLeader").attr("alt");

			var cardBox = $(this).find("table.tableau4 ul.tta_leader0").first();

			if (!(typeof leaderName === "undefined")) {

				var leaderSpan = $(document.createElement("span")).text(" (" + leaderName + ")").addClass("leaderNameInfo");
				$(userTabs[index]).find("div.playerNameBox").append(leaderSpan);

				var leaderBox = $($(cardBox).clone());
				leaderBox.hide();
				leaderBox.css({
					top: leaderSpan.offset().top,
					left: leaderSpan.offset().left,
					position: 'absolute',
					'list-style-type': 'none'
				});

				$(leaderSpan).on("mouseover", function () {
					leaderBox.show();
				}
				);

				$(leaderSpan).on("mouseout", function () {
					leaderBox.hide();
				}
				);

				$(userTabs[index]).parent().parent().append(leaderBox);

			}

			//Call attention to war
			var isInWarDefense = $(this).find("div#statusBar img.iconeGuerre2")
			var isInWarAgressor = $(this).find("div#statusBar img.iconeGuerre1")

			if (!(typeof isInWarDefense === "undefined")) {
				var statusBar = $(isInWarDefense).parent();
				statusBar.addClass("warOn");
				blink(statusBar, 2000);
				var extraWar = $(isInWarDefense).clone();
				$(extraWar).removeClass().addClass("miniWarIcon").addClass("miniWarIconDefense");
				$(userTabs[index]).find("div.playerNameBox").append(extraWar);
			}

			if (!(typeof isInWarAgressor === "undefined")) {
				//var statusBar = $(this).find("div#statusBar");
				//statusBar.addClass("warOn");
				//blink(statusBar, 2000);
				extraWar = $(isInWarAgressor).clone();
				$(extraWar).removeClass().addClass("miniWarIcon");
				$(userTabs[index]).find("div.playerNameBox").append(extraWar);
			}


		});

	} //end function addSubDock()

	function addReloadButton() {

		var $titleElement = $("table.tableau2").find("p.nomModule");

		$("head").append(
			'<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css">'
		);

		GM_addStyle(`
		div.pageCommand {
			display: inline-block;
			cursor: pointer;
			margin: 0px 20px;
		}
		`);

		var $reloadButton = $("<div class='pageCommand'><i class='fa fa-refresh fa-lg' aria-hidden='false' altname='Reload'></i></div>");
		$reloadButton.click(function() {
			$(this).find('i').addClass('fa-spin');
			var url = window.location.href;
			document.location.href = url;
		})
		
		
		$titleElement.append($reloadButton);



	}

	function addMiniJournal() {

		//Add the journal to the left side
		var miniJournalDiv = $('<div class="minijournal"/>');

		if ($('td#gauche').length) {
			$('td#gauche').append(miniJournalDiv);
		} else {
			miniJournalDiv.hide(); //avoid animations
			$('td#centre').prepend(miniJournalDiv);
		}

		miniJournalDiv.append($('<h1 class="journalTitle">Journal</h1>'));

		$('table.tableau3 tr').each(function () {

			var journalEntry = $(this).children('td:nth-child(5)');

			var journalEntries = $(journalEntry).children('p');

			if (journalEntries.length < 1)
				return true;

			var clonedEntries = $(journalEntries).clone();

			var color = $(this).find('td:nth-child(2) span').css('color');
			var miniEntry = $('<div class="action"/>').css({ 'border-left-color': color });

			var tooltip = $(document.createElement('div')).addClass('tooltip');
			tooltip.append(clonedEntries);

			var resumeBox = $($(tooltip).children('p')[0]);
			var detailBox = $($(tooltip).children('p')[1]).addClass('tooltip');

			var miniEntryResume = resumeBox.clone();

			miniEntry.append(miniEntryResume);
			miniEntry.append(tooltip);

			miniJournalDiv.append(miniEntry);

			if (resumeBox.html() == 'End turn') {
				miniEntry.append(detailBox.clone());
			}

			if (
				(miniEntryResume.html().indexOf("stage") > 0)
				&& (detailBox.html().indexOf("Wonder completed") > 0)
			) {
				miniEntry.css('background-color', 'oldlace');
			}

		});

	} //end function addminiJournal

	function addTacticsIcons() {

		GM_addStyle(`

#carteMain div.taticInnerContainer {
	position: relative;
}
		

#carteMain div.taticInnerContainer div.leftSide { 
	display: inline-block;
	text-align: left;
}

#carteMain div.taticInnerContainer div.rightSide { 
	display: inline-block;
	text-align: right;
	width: 140px;
	vertical-align: bottom;
	position: absolute;
	right: 10px;
}

#carteMain div.taticInnerContainer img { 
	display: inline;
	height: 12px;
	width: 12px;
	margin: 0px 2px;
	background-color: white;
	border: 0px;
	padding: 0px;
}

#carteMain div.taticInnerContainer span.tacticValue { 
	font-size: 11px;
	display: inline-block;
	width: 30px;
	text-align: right;
	vertical-align: bottom;
}

td.FIX-card-table {
	width: 30%;
}
							
td.FIX-card-table:nth-child(4) {
	width: 100px;
	min-width: 100px;
}`

);



		$("div[id^='cartes_joueur']").each(function () {
			$(this).find("td.tdTop").addClass("FIX-card-table");
		});


		$('table.tableau2 a.tta_tactic1').each(function () {
			var tacticNameLink = $(this);

			var tacticContainer = tacticNameLink.parent("li");

			var tacticName = tacticNameLink.html();

			tacticNameLink.empty();

			var icons = tacticContainer.find("p.texte2 > img");

			var valueContents = tacticContainer.find("p.tacticValue").contents()
			var value = "";
			if (valueContents.length > 1) {
				value = valueContents[0].nodeValue + $(valueContents[1]).html().trim();
			} else {
				value = valueContents[0].nodeValue
			}

			var newContainer = createTaticContainer(tacticName, icons, value);
			
			tacticNameLink.append(newContainer);

		})

	}

	function createTaticContainer(taticAgeAndName, taticIcons, taticValue) {
		var valueContainer = $(document.createElement("span")).addClass("tacticValue").append(taticValue);
		
		var newContainer = $(document.createElement("div"));
		
		var leftSide = $(document.createElement("div")).addClass("leftSide");
		var rightSide = $(document.createElement("div")).addClass("rightSide");

		var cloneTaticIcons = $(taticIcons.clone()).addClass("tatic-icon");
		
		
		newContainer.addClass("taticInnerContainer");
		newContainer.append(leftSide);
		newContainer.append(rightSide);
		
		leftSide.append(taticAgeAndName);
		rightSide.append(cloneTaticIcons).append(valueContainer);

		return newContainer;

	}



	function addViewDeckCSS() {
		GM_addStyle(`
ul#carte p.loading { 
	background-color:none;
	background-image: url(http://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/images/ajax-loader.gif);
	background-repeat: no-repeat;
    background-position: center;
	min-width: 100px;!important;
	min-height: 100px; !important;
} 

ul#carte.remainingcards { 
	background-color: #9A7541;
	min-width: 100px;
	min-height: 30px;
	border-radius: 5px;
	padding: 10px;
}

ul#carte.remainingcards ul.smallinfo { 
	margin: 3px 0px;
}

ul#carte.remainingcards { 
	background-color: #9A7541;
	min-width: 100px;
	min-height: 30px;
	border-radius: 5px;
	padding: 10px;
}

ul#carte.remainingcards a.nomCarte {
	margin: 2px 0px;
	font-size: x-small;
	font-weight: normal;
	padding: 1px 0px;
}

ul#cardList.smallinfo li ul {
	display: none;
}

ul#cardList.smallinfo li:hover ul {
	display: block;
}
							
`);}


	//Not OO or fast as I would like or fast
	function createDrawDeckInfo() {
		var remainingCardsContainer = $("<ul id='carte' class='remainingcards loading'></ul>");
		remainingCardsContainer.append($("<p>").addClass("loading"));
		$("a#deck.paquet.dosCarteCivile").parent().append(remainingCardsContainer);
		return remainingCardsContainer;
	}


	//Not OO or fast as I would like or fast
	function setFailText(message) {
		$("ul#carte.remainingcards").text(message)
	}

	//Not OO or fast as I would like
	function setDrawDeckInfo(element) {
		$("ul#carte.remainingcards").removeClass("loading");
		$("ul#carte.remainingcards").empty();
		$("ul#carte.remainingcards").append(element);

		var event = new CustomEvent('themeElement', { detail: element[0] });
		document.dispatchEvent(event);
	}


	function addViewDeck() {

		addViewDeckCSS();

		$("a#deck.paquet.dosCarteCivile").mouseover(function () {

			if ($("ul.remainingcards").length > 0) {
				//nothing to create
				return;
			}

			var masterElement = createDrawDeckInfo();

			masterElement.css('background-color', $(this).css('background-color'));

			//Example how to use it: 
			var tableNumber = parseQueryString()["pl"];

			var currAgeInRoman = $("#deck > p.ageDosCarte:first").text();

			var currAgeIndex = -1;

			var fetchUrl = location.protocol + '//' + location.host + location.pathname;

			if (currAgeInRoman == "") {
				setFailText("There are no cards");
				return;
			}

			switch (currAgeInRoman) {
				case "A": currAgeIndex = 0;
					break;
				case "I": currAgeIndex = 1;
					break;
				case "II": currAgeIndex = 2;
					break;
				case "III": currAgeIndex = 3;
					break;
				default: currAgeIndex = -1;
			}

			if (currAgeIndex < 0) {
				setFailText("I have no idea what Age is this");
				return;
			}

			var cardDeck = $(this);

			$.get(fetchUrl, { cnt: 53, pl: tableNumber, nat: 3 })
				.done(function (data) {

					var rowCardElements = $("#card_row").find("table.tableau0").find("td.tdMidC").filter(function () {
						if ($(this).find("p.ageCarte:first").text() != currAgeInRoman)
							return false;
						return true;
					}).find("p.nomCarte:first");

					var rowCards = [];

					rowCardElements.each(function () {
						rowCards.push($(this).text());
					});

					var column = $(data).find("#civilCards").children("td")[currAgeIndex];

					var allCardElements = $(column).find("a").filter(function () {
						return this.className.match(/tta_[a-z]+0/);
					});

					var remainingCards = []

					var remainingCardsContainer = $(document.createElement("ul")).addClass("smallinfo").attr('id', 'cardList');

					allCardElements.each(function () {
						var cardText = $(this).text();
						var inRow = rowCards.indexOf(cardText);
						if (inRow >= 0) {
							rowCards.splice(inRow, 1);
						} else {
							remainingCards.push(cardText);
							//var newElement = $("<li></li>");
							var newElement = $(this).parent().removeClass().clone();
							remainingCardsContainer.append(newElement);
						}
					})

					setDrawDeckInfo(remainingCardsContainer);

				}).fail(function () {
					setFailText("Could not fetch cards from the server");
				});

		});

	}

	function addMobileClasses() {

		var playerStatsBox = $("td.civDataBox").find(".tableau4").find("ul#indJoueur").closest("td");
		console.log(playerStatsBox.length);

		playerStatsBox.addClass("player-stats-box");
		playerStatsBox.removeAttr("width");

		var tableau4Outer = $("td.civDataBox").closest("table.tableau4");
		var civLeftPanel = $(tableau4Outer).parent("td");
		civLeftPanel.addClass("civ-left-panel").removeAttr("width");

		
		
		//there are multiple tables, so we must reduce to the only one that we want, going doward and upward
		var taticCardsContainer = $("td.tta_tactic0.dataBox");
		taticCardsContainer.addClass("tatic-cards-in-play");

		var taticCards = taticCardsContainer.find("td").children("ul");
		taticCards.addClass("tatic-info");

		var taticCardsUselessContainer = taticCardsContainer.children();

		taticCardsContainer.append(taticCards); 
		taticCardsUselessContainer.remove();
		//lets capture icons from the mouse over and put the visible
		taticCards.each(function(){
			var $this = $(this);
		
			$this.children("li").addClass("tatic-card");

			var cardInformation = $this.find('a.carteNonPiochable:first');
			var textAge = cardInformation.find('.ageCarte').text();
			var textName = cardInformation.find('.nomCarte').text();
			var users = cardInformation.find(".piedCarte").clone();

			cardInformation.children().empty();
			
			var taticNameAndAge = textAge + "-" + textName;
			var taticValue = $this.find("p.tacticValue").text();

			var icons = $this.find("ul").find("img");

			cardInformation.children().remove();

			var taticContainer = createTaticContainer(taticNameAndAge, icons, taticValue);
			
			cardInformation.append(taticContainer);

			var userTaticContainer = $("<li class='player-tatic'/>").append(users);
			$this.append(userTaticContainer);
			

		});

	}

	function addMobileStyles() {
		GM_addStyle(`
		
		.player-stats-box { 
			display:none;
		}

		.civ-left-panel { 
			width: 100px;
		}

		div.tatic-cards-in-play { 
			width: 90%;
			margin: auto;
		}

		.tatic-cards-in-play ul#carteJoueur.tatic-info {
			border-radius: 0px;
		}


		.tatic-cards-in-play ul#carteJoueur li.tatic-card {
			display: inline-block;
			width: 75%;
			
		}

		.tatic-cards-in-play #carteJoueur .tatic-card a.carteNonPiochable {
			border: 0px;
		}

		.tatic-cards-in-play ul#carteJoueur .player-tatic {
			display: inline-block;
			width: 20%;
			text-align: left;
		}

		.tatic-cards-in-play .taticInnerContainer {
			padding: 2px 2px 2px 5px;
			text-decoration: none;
			display: block;
			cursor: help;
			border: 1px solid 686460;
			box-shadow: 1px 1px 1px #444;
			border-radius: 6px;
			margin: 2px;
			background-color: #8d1108;
			font-size: small;
			text-align: left;
			position:relative;
		}

		.tatic-cards-in-play ul#carteJoueur.tatic-info div.rightSide img.tatic-icon { 
				display: inline;
				height: 14px;
				width: 14px;
				margin: 0px 2px;
				background-color: white;
				border: 0px;
				padding: 0px;
		}

		ul#carteJoueur.tatic-info div.taticInnerContainer div.leftSide { 
			display: inline-block;
			text-align: left;
			overflow: hide;
		}

		ul#carteJoueur.tatic-info div.taticInnerContainer div.rightSide {
			display: inline-block;
			right: 0px;
			text-align: right;
			vertical-align: bottom;
			width: 100px;
			position: absolute;

		}

		#contenu div.taticInnerContainer div.rightSide { 
			display: inline-block;
			margin-right: 10px;
			text-align: right;
			
			vertical-align: bottom;
		}
		
		#contenu div.taticInnerContainer img { 
			display: inline;
			height: 14px;
			width: 14px;
			margin: 0px 2px;
			background-color: white;
			border: 0px;
			padding: 0px;
		}
		
		#contenu div.taticInnerContainer span.tacticValue { 
			font-size: 12px;
			display: inline-block;
			width: 30px;
			text-align: right;
			vertical-align: bottom;
		}

		.tatic-cards-in-play .tta2/tta_improved_info.user.jstatic-info li.player-tatic { 
			display:inline-block;			
			width: 25%;
		}

		.tatic-cards-in-play ul#carteJoueur.tatic-info li.player-tatic img {
			padding: 0px;
		}

		.infoBox select { 
			font-size: 1.5em !important;
		}
		
		.infoBox #confirmEndTurn { 
			transform: scale(1.5);
			font-size: 1.5em !important;
			margin: 10px 8px 0px 10px;
		}

		tr.selectDiscard td {
			font-size: 1em !important;
			
		}

		tr.selectDiscard input[type=checkbox] { 
			transform: scale(1.5);
			margin: 15px 8px 0px 10px;
			min-height:20px;min-width:20px;
		}
		
		input[type=checkbox] { 
			margin: 15px 8px 0px 10px;
			min-height:20px;min-width:20px;
		}
		
		
		`
	
	);

	}

	function convertLoginMenu() {
		var $mygames = $('<div class="my-games-button pageCommand"><i class="fa fa-level-up fa-lg" aria-hidden="true"></i></div>');
		//var $log = $('<div><i class="fa fa-podcast" aria-hidden="true"></i></div>');
		var $log = $('<div class="pageCommand"><i class="fa fa-list-ol fa-lg" aria-hidden="true"></i></div>');

		var $buttonNextGame = $('img.boutonNextGame');
		var linkToNextGame = $buttonNextGame.parent().attr('href');

		$mygames.click(function() {
			document.location.href = linkToNextGame;
		});

		$log.on('click touchstart', function(e) {
			$('td#centre').toggleClass('menu-open');
			e.preventDefault();
		});

		//fix the left side of the table
		


		//hide the left table

		//remove image for next game
		$('#gameDescription').find('td:first').empty();
		$("p.nomModule").prepend($log);
		$("p.nomModule").append($mygames);

		$("#centre").prepend($('.minijournal'));
		

		//move the menu from the right cell to the left cell


		GM_addStyle(`

		#gauche {
			display: none;
		}

		p.nomModule {
			position: relative;
		}

		#centerPanel {
			display: inline-block;
			vertical-align:top;
			width: 100%;
		}

		.minijournal {
			position: fixed;
			top:30px;
			left:0px;
			z-index: 15;
			background-color: lightgray;
			transform: translateX(-150px);
			transition: all .25s linear;
		}

		.minijournal .tooltip {
			z-index: 20;
		}
		
		.menu-open .minijournal {
			transform: translateX(0px);
		}

		.menu-open #centerPanel {
			transform: translateX(150px);
		}

		div.my-games-button {
			position: absolute;
			right: 0px;
		}
		
		`);

		$(".minijournal").show();

	}




	//pre load for faster rendering Does not work in firefox

	$(document).ready(function () {
		addHelperClasses();
		updateCSS();
		addReloadButton();
		addMiniJournal();
		addTacticsIcons();
		addViewDeck();
		addBasicDock();
		addSubDock();
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
			addMobileClasses();
			addMobileStyles();
			convertLoginMenu();
		}

	});


})();

