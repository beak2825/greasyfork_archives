// ==UserScript==
// @name                DC - Date fixed
// @author              Ianouf, Ladoria, Nasty
// @version             0.9.1
// @grant       none
// @description Display DC's date on top of the screen, or on your deck!
// @match               https://www.dreadcast.net/Main
// @copyright   2015+, Ianouf & Ladoria
// @namespace InGame
// @license DBAD Don't be a dick Public license : https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @downloadURL https://update.greasyfork.org/scripts/453281/DC%20-%20Date%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/453281/DC%20-%20Date%20fixed.meta.js
// ==/UserScript==
 
var server_date = undefined;
var old_server_date = undefined;
var handled_seconds = 0;
var first_sync = true;
var cumputing_skill_need = 40;
 
var debugDeck  = true;
 
$(document).ready( function() {
	//Affichage de la date
	$('#bandeau ul.menus').eq(0)
			.prepend('<li id="affichageDateDC" class="couleur5" ></li>'
							+'<li class="separator"></li>'
							+'<li id="affichageDate" class="couleur5" ></li>'
							+'<li class="separator"></li>');
   
	$('head').append('<style>/*DC time updated stylesheet*/.custom_command.important_data {       font-weight: bold;}.custom_command.red_info {       color: red;}.custom_command.green_info {        color: green;}.custom_command.orange_info {     color: orange;}</style>');
   
	// Display DC's server date
	function handle_DC_date() {
		if(undefined === server_date)
			return;
	   
		// server_date's refreshing all 3s, need to handle seconds between refreshs.
		if(server_date.getTime() != old_server_date.getTime()) {
				old_server_date = server_date;
		   
			handled_seconds = 0;
		}
		else
			handled_seconds++;
	   
		var server_seconds = server_date.getSeconds() + handled_seconds;
		// seconds handled.
	   
	   
		// display hour & DC's date
		date_to_display = new Date(server_date.getTime());
		date_to_display.setSeconds(server_seconds);
	   
		$('#affichageDate').html(date_to_display.toLocaleString());
		$('#affichageDateDC').html(get_DC_date(server_date));
	}
   
	// input : Date
	function get_DC_date(date) {
			var server_day = date.getDate();
			var server_month = date.getMonth() + 1; // 0-11
			var server_year = date.getYear() - 100;
		   
			var dc_hep = Math.floor(server_day / 7) + 1; //heptade
			var dc_day = (server_day % 7);              //jour de l'heptade
			var dc_year = 70 + (server_year * 12) + server_month;   //année, basé sur le fait que janvier 2000 est l'an 70 de DC.
		   
			//le jour 0 est plutot le dernier jour de l'heptade précédente!
			if (dc_day === 0) {
					dc_hep--;
					dc_day=7;
			}
		   
			return dc_day+'/'+dc_year+'.'+dc_hep;
	}
   
	// input format : ddmmyyyy
	// throw dummy exception
	function cast_date(text) {
		var day = text.substring(0,2);
		var month = text.substring(2,4) - 1; // 0-11
		var year = text.substring(4);
	   
		if(isNaN(day) || isNaN(month) || isNaN(year)
			|| day > 31 || month > 11 || year.length != 4)
			throw true;
	   
		return new Date(year, month, day, 0, 0, 0, 0);
	}
   
	// input format : x/xxx.x whatever those x can mean
	// throw dummy exception
	function get_date_form_DC(date) {
		if(/^[0-9]{1}\/[0-9]{3}\.[0-9]{1}$/.test(date)) {
			var dc_day = date.substring(0,1);
			var dc_year = date.substring(2, 5);
			var dc_hep = date.substring(6);
		   
			if(!isNaN(dc_day) && dc_day > 0 && dc_day < 8
				&& !isNaN(dc_year) && dc_year >= 0 && dc_year < 1000
				&& !isNaN(dc_hep) && dc_year > 0 && dc_hep < 6) {
					dc_day = parseInt(dc_day);
					dc_year = parseInt(dc_year);
					dc_hep = parseInt(dc_hep);
					
					var day =( (dc_hep-1)*7 ) + dc_day;
					var month = ( dc_year%12 ) +2;
					var year = Math.floor(dc_year / 12)+1994;
					
					if(month>12){
						month = month%12;
						year++;
					}
					
					day = ('0' + day).slice(-2);
					month = ('0' + month).slice(-2);
					year = ('000' + year).slice(-4);
					
					return day + month + year;
			}
		}
		
		throw true;
	}
 
	// Date command line 'Object'
	var CommandLine_DC_time = function (command_line) {
		this.command_line = command_line;              
		this.argument = '';
		this.parameter = '';
	   
		if(/\-/gi.test(command_line)) { // argument given
				this.argument = command_line.trim().split("-")[1];
			   
				if(/ /gi.test(this.argument)) { // parameter given
						this.argument = command_line.trim().split("-")[1].split(" ")[0];
						this.parameter = command_line.trim().split("-")[1].split(" ")[1];
				}
		}
	   
		this.enabledArguments = ['h', // display all date's and secondes.
								 'd', // display converted standard date to DC's date
								 't', // display converted DC's date to standard date
								 'a']; // display the manual
													   
		// processing the command
		// input : Deck object
		this.execute = function(deck) {
			var deckLines = new Array();
		   
			if(false === CommandLine_DC_time.check_character_skill()) {
				deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command", "Votre niveau en informatique est trop faible pour réussir cette commande"]));
			   
				return;
			}
			else switch (this.argument) {
				case '' : // display DC's server date
					deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command", get_DC_date(server_date)]));
					break;
				case 'h' : // display all date's and secondes.
					// put separators
					var deckLine = $('#affichageDateDC').html()+' '+$('#affichageDate').html();
					deckLine = deckLine.replace(/ /g, ' | ');
					
					deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command", deckLine]));
					break;
				case 'd' : // display converted standard date to DC's date
					var date;
				   
					try {
						date = get_DC_date(cast_date(this.parameter));
						deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command", date]));
					}
					catch (e) {
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "Date ancienne invalide ("],
							["span", "custom_command red_info", "jj"],
							["span", "custom_command green_info", "mm"],
							["span", "custom_command orange_info", "aaaa"],
							["span", "custom_command", ")"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command red_info", "jj"],
							["span", "custom_command"," : 00 -> 31, "],
							["span", "custom_command red_info", "Jour"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command green_info", "mm"],
							["span", "custom_command"," : 00 -> 12, "],
							["span", "custom_command green_info", "Mois"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command orange_info", "aaaa"],
							["span", "custom_command"," : 0000 -> 9999, "],
							["span", "custom_command orange_info", "Année"]));
					}
					break;
				case 't' : // display converted DC's date to standard date
					var date;
					
					try {
						date = get_date_form_DC(this.parameter);
						deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command", date]));
					}
					catch(e) {
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "Point Temporel Impérial invalide ("],
							["span", "custom_command red_info", "x"],
							["span", "custom_command green_info", "/xxx"],
							["span", "custom_command orange_info", ".x"],
							["span", "custom_command", ")"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command red_info", "x"],
							["span", "custom_command"," : 1 -> 7, "],
							["span", "custom_command red_info", "Jour"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command green_info", "/xxx"],
							["span", "custom_command"," : 000 -> 999, "],
							["span", "custom_command green_info", "Année"]));
						deckLines.push(Deck.getHTMLElementLineTab(
							["span", "custom_command", "- "],
							["span", "custom_command orange_info", ".x"],
							["span", "custom_command"," : 1 -> 5, "],
							["span", "custom_command orange_info", "Heptade"]));
					}
					break;
				default : // display the manual ("a" argument)
					deckLines = CommandLine_DC_time.getManualLines();
					break;
			}
			
			deck.putResultsLines(deckLines);
		};
	};
   
	CommandLine_DC_time.cumputing_skill_need = cumputing_skill_need;
   
	CommandLine_DC_time.check_character_skill = function() {
		if (CommandLine_DC_time.cumputing_skill_need <= $('.stat_6_entier').first().html())
			return true;
	   
		return false;
	};
 
   
	CommandLine_DC_time.getManualLines = function() {
		manualLines = new Array();
	   
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command couleur_jaune important_data","date: "]);
	   
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command","Affiche la date ou en convertit les différents formats"]);
			   
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command","Arguments facultatifs : "]);
 
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command", "- "],
			["span", "custom_command couleur_jaune", "d "],
			["span", "custom_command red_info", "jj"],
			["span", "custom_command green_info", "mm"],
			["span", "custom_command orange_info", "aaaa"],
			["span", "custom_command", " : Convertir une "],
			["span", "custom_command couleur_jaune", "d"],
			["span", "custom_command", "-ate ancienne"]);
	   
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command", "- "],
			["span", "custom_command couleur_jaune", "t "],
			["span", "custom_command red_info", "x"],
			["span", "custom_command green_info", "/xxx"],
			["span", "custom_command orange_info", ".x"],
			["span", "custom_command", " : Convertir un Point "],
			["span", "custom_command couleur_jaune", "T"],
			["span", "custom_command", "-emporel Impérial"]);
	   
		manualLines[manualLines.length] = Deck.getHTMLElementLineTab(
			["span", "custom_command", "- "],
			["span", "custom_command couleur_jaune", "h "],
			["span", "custom_command", " : Affiche tous les formats de date, ainsi que l'"],
			["span", "custom_command couleur_jaune", "h"],
			["span", "custom_command", "-eure courante"]);
					   
		return manualLines;
	};
   
	// Help date command line 'Object'
	var CommandLine_DC_time_help = function () {
		// processing the command
		// input : Deck object
		this.execute = function(deck) {
			deck.putResultsLines(CommandLine_DC_time.getManualLines());
		};
	};
   
	// Help date command line 'Object'
	var CommandLine_help_updated = function () {
		// processing the command
		// input : Deck object
		this.execute = function(deck) {
			var deckLines = new Array();
			deckLines.push(Deck.getHTMLElementLineTab(["span", "custom_command important_data", "date"]));
			
			deck.putResultsLines(deckLines, 'toOldResults');
		};
	};
 
	// Deck 'Object'
	var Deck = function (id) {
		this.id = id;
 
		// Use it with result of Deck.getHTMLElementLineTab() (see below)
		// input : lines[], 'mode'
		// optional : mode. Whatever's given, append to old results line.
		this.putResultsLines = function (lines, mode) {
			mode = (undefined === mode) ? 'zone_ecrit' : 'ligne_resultat_fixed';
			
			for(var i = 0; i < lines.length; i++) {
				var resultsDiv = document.createElement('div');
				resultsDiv.className = "ligne_resultat_fixed";
			   
				for(var j = 0; j < lines[i].length; j++) {
					var domElement = document.createElement(lines[i][j].type);
				   
					domElement.className = lines[i][j]['class'];
					domElement.appendChild(document.createTextNode(lines[i][j].text));
					resultsDiv.appendChild(domElement);
				}
 
				$("#" + this.id + " ." + mode).append(resultsDiv);
			}
		};
	};
 
	// Start to fuck the DOM
	// DO NOT USE, NEVER, I WARNED YOU FOOL
	Deck.getHtmlElementTab = function(type, elementClass, text) {
		var anElement = new Array();
		anElement.type = type;
		anElement["class"] = elementClass;
		anElement.text = text;
	   
		return anElement;
	};
 
	// input : [ [type_of_dom_element, class, text_node], ... ]
	Deck.getHTMLElementLineTab = function() {
		var lineTab = new Array();
		for(var i = 0; i < arguments.length; i++) {
			lineTab[lineTab.length] = Deck.getHtmlElementTab(arguments[i][0],arguments[i][1],arguments[i][2]);
		}
	   
		return lineTab;
	};
	// Dom fucked
   
	$(document).ajaxComplete( function(a,b,c) {
		// Get and store the server date
		server_date = new Date(b.getResponseHeader('Date'));
	   
		if(first_sync)
				old_server_date = server_date;
	   
		first_sync = false;
 
		// Handle custom deck command
		if(/Command/.test(c.url)) {
			var deckId = 'db_deck_' + c.data.match(/[0-9]*$/)[0];  
			var commandLine_text = $('#' + deckId + ' .ligne_ecrite_fixed').last().find('input').val();
		   
		    var deck = new Deck(deckId);  
			var commandLine;
		   
			// Handle Date command
			if(/^date/gi.test(commandLine_text)) {
				// Bind Command and Deck objects               
				commandLine = new CommandLine_DC_time(commandLine_text);
				commandLine.execute(deck);
			}
			// Handle help Date command
			else if(/^help date/gi.test(commandLine_text)) {
				// Bind Command and Deck objects
				commandLine = new CommandLine_DC_time_help();
				commandLine.execute(deck);
			}
			// Handle help Date command
			else if(/^help$/gi.test(commandLine_text)) {
				// Bind Command and Deck objects
				commandLine = new CommandLine_help_updated();
				commandLine.execute(deck);
			}
		}
	});
   
	handle_DC_date();
	setInterval(function() { handle_DC_date(); }, 1000);
});
console.log('DC - Time Updated started');