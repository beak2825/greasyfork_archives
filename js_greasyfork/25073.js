// ==UserScript==
// @name         DC_Sensors
// @author       Ladoria
// @version		 0.2
// @namespace    DC_custom
// @description  Super secret project
// @match        http://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25073/DC_Sensors.user.js
// @updateURL https://update.greasyfork.org/scripts/25073/DC_Sensors.meta.js
// ==/UserScript==

var characters_watched = [];
var map_pos = null;
var main_char_pos = null;

$(document).ready( function() {
	$('body').append('<style>#dc_sensors_overlay {height: 100%;width: 100;top: 0px;left: 0px;}.dc_sensors_last_seen {    margin: -3px 0 0 -3px;position: absolute;z-index: 1000;}.dc_sensors_last_seen .circle {background: url(http://image.noelshack.com/fichiers/2016/47/1479820995-overlay-circle.png) no-repeat;width: 31px;height: 31px;position: absolute;cursor: pointer;}.dc_sensors_last_seen .circle:hover + .tooltip {display: block;}.dc_sensors_last_seen .tooltip {display: none;    position: absolute;bottom: 4px;left: 28px;background: url(../../../images/fr/design/box7_fond_0.png);}.dc_sensors_last_seen .tooltip .infos {    margin: 0 0 0 3px;}.dc_sensors_last_seen .text {font-size: 12px;line-height: initial;margin: 0 1px 0 1px;color: #41e4ee;}.dc_sensors_last_seen .dart_left {    background: url(http://image.noelshack.com/fichiers/2016/47/1479849685-overlay-dart.png) no-repeat;    height: 13px;    width: 10px;position: absolute;left: -10px;bottom: -13px;}.dc_sensors_last_seen .box_border {    background: url(http://image.noelshack.com/fichiers/2016/47/1479849014-overlay-boxborder.png);    height: 3px;    width: 100%;position: absolute;bottom: -3px;}.dc_sensors_last_seen .border_right {background: url(http://image.noelshack.com/fichiers/2016/47/1479858948-overlay-border-right.png);height: 100%;    width: 2px;position: absolute;right: -2px;top: 0px;}.dc_sensors_last_seen .corner_right {background: url(http://image.noelshack.com/fichiers/2016/47/1479859656-overlay-corner-right.png) no-repeat;height: 3px;    width: 2px;position: absolute;right: -2px;bottom: -3px;}</style>');
	$('#carte').append('<div id="dc_sensors_overlay"></div>');
});

var Character = function(name, positions) {
	this.name = name;
	
	if (null !== positions) this.positions = positions;
	else this.positions = [];
	
	this.equals = function(character) {
		if (this.name == character.name) return true;
		return false;
	};
	
	this.addPosition = function(position) {
		for (var i = 0; i < this.positions.length; i++) {
			if (positions[i].equals(position)) return;
		}
		
		positions.push(position);
	};
	
	this.isWatched = function () {
		for (var i = 0; i < characters_watched.length; i++) {
			if (characters_watched[i].equals(this)) return true;
		}
		
		return false;
	};
};
var Position = function(x, y, timestamp) {
	this.x = x;
	this.y = y;
	
	if ('undefined' !== timestamp) this.timestamp = timestamp;
	else this.timestamp = Date.now();
	
	this.equals = function(position) {
		if (	this.x == position.x
			&&	this.y == position.y) return true;
		return false;
	};
	
	this.isVisible = function() {
		if (	Math.abs(this.x - map_pos.x) > 20
			||	Math.abs(this.y - map_pos.y) > 20) return false;
			return true;
	};
};

function update_char(character) {
	for (var i = 0; i < characters_watched.length; i++) {
		if (character.name == characters_watched[i].name) {
			characters_watched[i] = character;
			
			return;
		}
	}
}

function update_map_pos() {
	var posX = parseInt(/[0-9]+/.exec($('#carte_fond').css('background-position-x'))) / 25;
	var posY = parseInt(/[0-9]+/.exec($('#carte_fond').css('background-position-y'))) / 25;
	
	map_pos = new Position(posX,posY);
	
	posX += 10;
	posY += 10;
	
	main_char_pos = new Position(posX,posY);
}

function char_pos(overlay_id) {
	return new Position(map_pos.x + parseInt(/([0-9]+)_([0-9]+)/.exec(overlay_id)[1]),
						map_pos.y + parseInt(/([0-9]+)_([0-9]+)/.exec(overlay_id)[2]));
}

function check_presences() {
	$('#carte_cases .personnages .icon_perso').each( function() {
		var names = $(this).children('.info_a_afficher').html().split('<br>');
		
		for (var i = 0; i < names.length; i++) {
			var character = new Character(names[i].trim(), [char_pos($(this).attr('id'))]);
			
			console.log('- ' + character.name + ' [' + character.positions[0].x + ',' + character.positions[0].y + '], watched: ' + character.isWatched());
			
			if (false === character.isWatched())
				characters_watched.push(character);
			else
				update_char(character);
		}
	});
}

function show_overlay() {	console.log('-------------------------------\n overlay');
	for (var i = 0; i < characters_watched.length; i++) {
		console.log(characters_watched[i].name + ', ' + (i+1) + '/' + characters_watched.length);
		
		for (var j = 0; j < characters_watched[i].positions.length; j++) {
			console.log(characters_watched[i].positions[j].x + ':' + characters_watched[i].positions[j].y + ', ' + (j+1) + '/' + characters_watched[i].positions.length);
			
			var id = characters_watched[i].positions[j].x + '_' + characters_watched[i].positions[j].y;
			
			console.log(characters_watched[i].positions[j]);
			if (false === characters_watched[i].positions[j].isVisible()) {
				$('#' + id).hide();
				return;
			}
			
			if (0 === $('#' + id).length) {
				$('#dc_sensors_overlay').append('<div id="' + id + '" class="dc_sensors_last_seen"><div class="circle"></div><div class="tooltip"><div class="infos"><div class="text">' + characters_watched[i].name + '</div><div class="dart_left"></div><div class="box_border"></div><div class="corner_right"></div><div class="border_right"></div></div></div></div>');
			}
			
			$('#' + id).css({	'top' : ((characters_watched[i].positions[j].y - map_pos.y) * 25),
								'left' : ((characters_watched[i].positions[j].x - map_pos.x) * 25)});
			
			var characters = $('#' + id + ' .text').html();
			
			//add custom overlay code
			if (false === new RegExp(characters_watched[i].name,'gi').test(characters))
				$('#' + id + ' .text').html(characters + ', ' + characters_watched[i].name);
			
			$('#' + id).show();
		}
	}	console.log('-------------------------------');
}

function hide_overlay() {
	$('.dc_sensors_last_seen').hide();
}

$(document).ajaxComplete( function(a,b,c) { // A chaque refresh, même invisible.
	if(/(Check|Move)/.test(c.url)) { // Durant certains refresh, dont le combat.
		console.log('time: ' + new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds());
		update_map_pos();
		check_presences();
		show_overlay();
	}
});

console.log('DC - Sensors started');
	
// debug
/*update_map_pos();
var debug_pos = new Position(main_char_pos.x, main_char_pos.y);
characters_watched.push(new Character('Ladoria', [debug_pos]));
var debug_pos = new Position(main_char_pos.x - 10, main_char_pos.y - 10);
characters_watched.push(new Character('Kinchaka', [debug_pos]));
var debug_pos = new Position(main_char_pos.x + 10, main_char_pos.y + 10);
characters_watched.push(new Character('Yonbaïke', [debug_pos]));
var debug_pos = new Position(main_char_pos.x + 11, main_char_pos.y + 11);
characters_watched.push(new Character('Mâle', [debug_pos]));

console.log(characters_watched);*/