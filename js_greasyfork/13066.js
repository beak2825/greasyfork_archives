// ==UserScript==
// @name		CT_alerts_sounds
// @author		Scoopy
// @version		0.2
// @grant       none
// @description	Plays sounds during game events
// @match		http://www.cybertown.fr/
// @copyright	2015+, Scoopy
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/13066/CT_alerts_sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/13066/CT_alerts_sounds.meta.js
// ==/UserScript==

var pseudo;
var regexAttack;
var regexAnimals;
var regexCoyoteOK;
var regexKO;
var regexTornado;
var firstLoad = true;
var coyoteSafe = false;

var x_main;
var y_main;

var NPC_alert_distance = 2; // NPC doesn't attack diagonally

function init() {
	$('body').append('<audio id="CT_attack" src="http://www.memoclic.com/medias/sons-wav/1/282.wav" type="audio/waw"></audio>');
	$('body').append('<audio id="CT_ko" src="http://www.memoclic.com/medias/sons-wav/1/334.wav" type="audio/waw"></audio>');
	$('body').append('<audio id="CT_tornado" src="http://www.memoclic.com/medias/sons-wav/0/223.wav" type="audio/waw"></audio>');
	$('body').append('<audio id="CT_NPC_close_up" src="http://www.memoclic.com/medias/sons-wav/2/617.wav" type="audio/waw"></audio>');
	
	$("#CT_attack").prop('volume', '0.2');
	$("#CT_ko").prop('volume', '0.2');
	$("#CT_tornado").prop('volume', '0.2');
	$("#CT_NPC_close_up").prop('volume', '0.2');

	pseudo = $('#pseudoig').html().trim();
	regexAttack = new RegExp('attaque ' + pseudo, 'gi');
	regexAnimals = new RegExp(pseudo + ' +se fait (piquer|mordre)', 'gi');
	regexCoyoteOK = new RegExp('renifle +' + pseudo, 'gi');
	regexKO = /Vous .tes Ko !/gi;
	regexTornado = /tornade/gi;
	regexTempest = /temp.te/gi;
	
	refresh_main_coordinates();
	
	console.log('initialized to:\npseudo: ' + pseudo);
}
	
function alert_user(response) {
	var song = false;
	
	// less to scariest
	if (true === alert_NPC(response)) {
		console.log('NPC close up');
		song = $('#CT_NPC_close_up')[0];
	}
	
	if (true === regexAttack.test(response)) {
		console.log('attacked');
		song = $('#CT_attack')[0];
	}
	
	if (true === regexTempest.test(response)) {
		console.log(response);
		console.log('tempest');
		song = $('#CT_attack')[0];
	}
	
	var resultAnimals;
	if (null !== (resultAnimals = regexAnimals.exec(response))) {
		if(true === /mordre/gi.test(resultAnimals))
			coyoteSafe = false;
		
		console.log('animals');
		song = $('#CT_attack')[0];
	}
	
	if (true === regexTornado.test(response)) {
		console.log('tornado');
		song = $('#CT_tornado')[0];
	}
	
	if (true === regexKO.test(response)) {
		console.log('KO');
		song = $('#CT_ko')[0];
	}
	
	if(false === song) return;
	
	song.load();
	song.play();
	
	console.log('alert sent\n\n');
}

var NPCs = new Array();
var nNPCs = new Array();

// if 2 NPCs are side by side, the secondly checked can be erased by the first one (function is_NPC_exist)
function mark_NPC() {
	nNPCs = [];
	$('#persomapp div').each( function() {
		var NPC = new Array();
		NPC.x = parseInt($(this).attr('x'));
		NPC.y = parseInt($(this).attr('y'));
		NPC.moved = true;
		
		var tNPC;
		if (false !== (tNPC = is_NPC_exist(NPC))) {
			NPC.id = tNPC.id;
			NPC.type = tNPC.type;
			
			if (NPC.x === tNPC.x || NPC.y === tNPC.y)
				NPC.moved = false;
		}
		else {
			NPC.id = Math.floor((Math.random() * 1000000) + 1);
			NPC.type = get_NPC_type($(this).attr('class'));
		}
		
		nNPCs[NPC.id] = NPC;
	});
	
	NPCs = nNPCs;
}

function is_NPC_exist(tested_NPC) {
	for (var NPC in NPCs) {
		var x_distance = Math.abs(tested_NPC.x - NPCs[NPC].x);
		var y_distance = Math.abs(tested_NPC.y - NPCs[NPC].y);
	
		if (	(x_distance == 0 && y_distance == 0)	// perfect match
			||	(x_distance <= 1 && y_distance <= 1))	// best match
			return NPCs[NPC];
	}
	
	return false;
}

function alert_NPC(response) {
	if (false === coyoteSafe)
		if (regexCoyoteOK.test(response))
			coyoteSafe = true;
	
	for (var NPC in NPCs) {
		if (too_close_to_main(NPCs[NPC].x, NPCs[NPC].y)) {
			console.log(NPC + '(' + NPCs[NPC].type + '): too close');
			
			if (/coyote/gi.test(NPCs[NPC].type) && true === coyoteSafe) // coyotes are smelling, not biting
				console.log('but safe');
			else {
				if (true === NPCs[NPC].moved)
					return true;
				else
					console.log('but static');
			}
		}
		else {
			console.log(NPC + '(' + NPCs[NPC].type + '): far enough');
		}
	}
	
	return false;
}

function get_NPC_type(character_type) {
	var type = 'scorpion';
	
	if (/(d320|d315)/.test(character_type))
		type = 'coyote';
	if (/(d321|d318)/.test(character_type))
		type = 'crotal';
	
	return type;
}

function refresh_main_coordinates() {
	x_main = parseInt($('#persomapp .person.moi').attr('x'));
	y_main = parseInt($('#persomapp .person.moi').attr('y'));
}

// if in square without corner around player character
function too_close_to_main(x, y) {
	var x_distance = Math.abs(x_main - x);
	var y_distance = Math.abs(y_main - y);
	
	if (x_distance <= NPC_alert_distance && y_distance <= NPC_alert_distance)
		if(x_distance + y_distance !== NPC_alert_distance * 2)
			return true;
	
	return false;
}

$("#vuelog").append("<div class=\"tchatmess\"><span class=\"miaou\"><b>11:57</b><i class=\"couleur1\"> Vous n'avez rien trouvé.</i></span></div>");

$(document).ready( function() {
	$(document).ajaxComplete( function(a, b, c) {
		if (/engine\.php/.test(c.url)) { // any action
			if (/alive=imalive/.test(c.url)) { // auto-refresh
				if(true === firstLoad) {
					init();
					firstLoad = false;
				}
				mark_NPC();
				alert_user(b.responseText);
			}
			else if (/action=10/.test(c.data)) { // moving
				refresh_main_coordinates();
				mark_NPC();
			}
		}
	});
});

console.log('CT - Attack alert started');