// ==UserScript==
// @name         DC_trop_ouha
// @author       Ladoria
// @version		 0.1
// @namespace    DC_custom
// @description  Super secret project
// @match        http://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25459/DC_trop_ouha.user.js
// @updateURL https://update.greasyfork.org/scripts/25459/DC_trop_ouha.meta.js
// ==/UserScript==

var pokereuils = [];
var pokedoll = null;
var map_pos = null;
var main_char_pos = null;

var style = '<style>/*circle on map*/#dc_sensors_overlay {position: absolute;    left: 3px;    top: 3px;}/*circle + tooltip to show*/#dc_sensors_tooltips {position: absolute;    left: 3px;    top: 3px;    width: 525px;    height: 525px;border: 1px solid #86898a; /*because fuck it*/overflow: hidden;}#dc_sensors_tooltips .dc_pokereuil {display: none;}.dc_pokereuil {    margin: -3px 0 0 -3px;position: absolute;z-index: 1000;}.dc_pokereuil .circle {background: url(http://image.noelshack.com/fichiers/2016/47/1479820995-overlay-circle.png) no-repeat;background-size: 25px 25px;width: 25px;height: 25px;position: absolute;top: 0px;left: 0px;cursor: pointer;}/*#dc_sensors_overlay .dc_pokereuil:hover > .circle_background {display: block;}#dc_sensors_tooltips .dc_pokereuil:hover {display: block;}#dc_sensors_tooltips .dc_pokereuil:hover > .tooltip {display: block;}*/.circle_background {display: none;width: 25px;height: 25px;position: absolute;top: 0px;left: 0px;}.circle_right {background: url(http://image.noelshack.com/fichiers/2016/49/1480962666-overlay-circle-right.png) no-repeat;background-size: 25px 25px;}.circle_left {display: none;background: url(http://image.noelshack.com/fichiers/2016/49/1480963031-overlay-circle-left.png) no-repeat;background-size: 25px 25px;}.dc_pokereuil .tooltip {display: block;    position: absolute;top: 0px;left: 25px;height: 25px;background: url(../../../images/fr/design/box7_fond_0.png);padding-right: 2px;}.dc_pokereuil .tooltip.overlay_left{left: auto;right: 0px;}.dc_pokereuil .tooltip .infos {    margin: 0 0 0 3px;}.dc_pokereuil .text {font-size: 12px;line-height: initial;margin: 0 1px 0 1px;color: #41e4ee;cursor: pointer;}.dc_pokereuil .border_y {background: url(http://image.noelshack.com/fichiers/2016/49/1480979103-overlay-border-y.png);height: 100%;    width: 2px;position: absolute;top: 0px;}.dc_pokereuil .border_right {right: -2px;}.dc_pokereuil .border_left {left: -2px;}.dc_pokereuil .border_x {/*background: url(http://image.noelshack.com/fichiers/2016/49/1480978567-overlay-y-dart.png);*/height: 100%;    height: 2px;position: absolute;}.dc_pokereuil .border_top {top: -2px;}.dc_pokereuil .border_bottom {bottom: -2px;}#dc_secret  {position: absolute;top: 150px;left: 525px;width: 150px;}#dc_secret .image {margin: -3px;cursor: pointer;}#dc_secret .interieur {margin: 7px;}#dc_secret .message {position: absolute;top: 38px;    left: 15px;}#dc_secret .fakeToolTip .deco1 {left: 20px;}#dc_secret .secondToolTip  {position: relative;margin-top: 6px;top: 0px;left: 0px;}#dc_secret .secondToolTip .deco1 {display: none;}</style>';

var Doll = function(character) {
	this.character = character;
	this.activated = false;
	this.fakeTooltipId = 0;
	
	this.toggleDoll = function () {
		this.activated = !this.activated;
		
		if(true == this.activated) {
			this.showDoll();
		}
		else
			this.hideDoll();
		
		return;
	};
	
	this.updateDoll = function(character) {
		this.character = character;
		
		this.destroy();
		this.putHtmlDoll();
	};
	
	this.showDoll = function () {
		$('#dc_secret').fadeTo(300, 1, function() { $('#dc_secret').show(); });
		this.activated = true;
	};
	
	this.hideDoll = function () {
		$('#dc_secret').fadeTo(300, 0, function() { $('#dc_secret').hide(); });
		this.activated = false;
	};
	
	this.putHtmlDoll = function () {
		$('#zone_infoBoxFixed').append('<div id="dc_secret" class="zone_conteneurs_displayed"><div class="conteneur ui-draggable"><div class="titreConteneur">' + this.character.name + '</div><div class="conteneur_content"><div class="fond1"></div><div class="fond2"></div><div class="fond3"></div><div class="fond4"></div><div class="fond5"></div><div class="fond6"></div><div class="fond7"></div><div class="fond8"></div><div id="doll" class="objects"><div class="interieur info_objet"><img class="image" src="' + this.character.silhouette + '"><div class="notThere member"></div></div></div><div class="close link"></div></div></div></div>');
		
		$('#dc_secret').draggable();
		
		$('#dc_secret .close').on('click', function() {
			pokedoll.hideDoll();
		});
		
		$('#dc_secret .image').on('click', function() {
			pokedoll.showMessage('Aaaaaaaaaaah !!!');
		});
	};
	
	this.destroy = function () {
		$('#dc_secret').remove();
	};
	
	this.showMessage = function (message) {
		var tooltipId = this.fakeTooltipId; // variable range issue
		this.fakeTooltipId++;
		
		$('#dc_secret .conteneur_content').append('<div id="' + tooltipId + '" class="message fakeToolTip"><div class="deco1"></div><span>' + message + '</span></div>');
		
		// fadeTo 1 -> temporize -> fadeTo 0 -> remove.
		$('#dc_secret #' + tooltipId).fadeTo(300, 1,
			function() {
				setTimeout(
					function() { $('#dc_secret #' + tooltipId).fadeTo(300, 0,
						function() { $('#dc_secret #' + tooltipId).remove()}); }
				,1000)
		});
	}
}

var Character = function(name, silhouette, positions) {
	this.name = name;
	this.silhouette = silhouette;
	
	if (null !== positions) this.positions = positions;
	else this.positions = [];
	
	this.equals = function(character) {
		if (this.name == character.name) return true;
		return false;
	};
	
	this.addPosition = function(position) {
		for (var i = 0; i < this.positions.length; i++) {
			if (true === positions[i].equals(position)) return;
		}
		
		positions.push(position);
	};
	
	this.isWatched = function () {
		for (var i = 0; i < pokereuils.length; i++) {
			if (pokereuils[i].equals(this)) return true;
		}
		
		return false;
	};
};

Character.getCharacter = function (name) {
	for (var i = 0; i < pokereuils.length; i++) {
		if (name == pokereuils[i].name)
			return pokereuils[i];
	}
	
	return null;
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
	for (var i = 0; i < pokereuils.length; i++) {
		if (character.name == pokereuils[i].name) {
			pokereuils[i] = character;
			
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

function is_overflowed_x(id) {
	var tooltip = $('#' + id + '_overlay .tooltip');
	
	var posX = parseInt(/[0-9]+/.exec($('#' + id +'_overlay').css('top'))) + parseInt(/[0-9]+/.exec(tooltip.css('top')));
	var heightX = parseInt(/[0-9]+/.exec(tooltip.css('height')));
	
	if (posX + heightX < $('#dc_sensors_tooltips').width()) return false;
	
	return true;
}

function show_overlay() {	//console.log('-------------------------------\n overlay');
	for (var i = 0; i < pokereuils.length; i++) {
		//console.log(pokereuils[i].name + ', ' + (i+1) + '/' + pokereuils.length);
		
		for (var j = 0; j < pokereuils[i].positions.length; j++) {
			//console.log(pokereuils[i].positions[j].x + ':' + pokereuils[i].positions[j].y + ', ' + (j+1) + '/' + pokereuils[i].positions.length);
			
			var id = pokereuils[i].positions[j].x + '_' + pokereuils[i].positions[j].y;
			
			//console.log(pokereuils[i].positions[j]);
			if (false === pokereuils[i].positions[j].isVisible()) {
				$('#' + id).hide();
				return;
			}
			
			if (0 === $('#' + id).length) {
				$('#dc_sensors_overlay').append('<div id="' + id + '" class="dc_pokereuil"><div class="circle_background circle_right"></div><div class="circle"></div></div>');
				
				$('#dc_sensors_tooltips').append('<div id="' + id + '_overlay" class="dc_pokereuil"><div class="tooltip"><div class="infos"></div><div class="border_y border_right"></div><div class="border_x border_top"></div><div class="border_x border_bottom"></div></div></div>');
				
				$('#' +  id).on('mouseenter', function () {
					$('#' + $(this).attr('id') + ' .circle_background').show()
					$('#' + $(this).attr('id') + '_overlay').show();
					
					console.log('show ' + $(this).attr('id') + '_overlay');
				});
				$('#' +  id + '_overlay').on('mouseleave', function () {
					$(this).hide();
					$('#' + /(.*)_overlay/.exec($(this).attr('id'))[1] + ' .circle_background').hide();

					console.log('hide: ' + $(this).attr('id'));
				});
			}
			
			$('#' + id).css({	'top' : ((pokereuils[i].positions[j].y - map_pos.y) * 25),
								'left' : ((pokereuils[i].positions[j].x - map_pos.x) * 25)});
			$('#' + id + '_overlay').css({	'top' : ((pokereuils[i].positions[j].y - map_pos.y) * 25),
											'left' : ((pokereuils[i].positions[j].x - map_pos.x) * 25)});
			
			if(true === is_overflowed_x(id)) {
				$('#' + id + '_overlay .tooltip').removeClass('overlay_right');
				$('#' + id + '_overlay .tooltip').addClass('overlay_left');
				
				$('#' + id + '_overlay .tooltip .border_y').removeClass('border_right');
				$('#' + id + '_overlay .tooltip .border_y').addClass('border_left');
				
				$('#' + id + ' .circle_background').removeClass('circle_right');
				$('#' + id + ' .circle_background').addClass('circle_left');
			}
				
			var found = false;
			
			$('#' + id + '_overlay .text').each( function() {
				if (true === new RegExp(pokereuils[i].name,'gi').test($(this).html()))
					found = true;
			});
			
			if (false === found) {
				$('#' + id + '_overlay .infos').append('<span class="text">' + pokereuils[i].name + '</span>');
			}
			
			$('#' + id).show();
		}
	}	//console.log('-------------------------------');
	
	// because fuck it, for now
	$('.dc_pokereuil .text').off('click');
	$('.dc_pokereuil .text').on('click', function() {
		pokedoll.updateDoll(Character.getCharacter($(this).html()));
	});
}

function hide_overlay() {
	$('.dc_sensors_last_seen').hide();
}

$(document).ajaxComplete( function(a,b,c) { // A chaque refresh, même invisible.
	if(/(Check|Move)/.test(c.url)) { // Durant certains refresh, dont le combat.
		//console.log('time: ' + new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds());
		update_map_pos();
		show_overlay();
	}
});

$(document).ready( function() {
	$('head').append(style);
	
	$('#dc_secret .conteneur').draggable();
	
	$('#carte').after('<div id="dc_sensors_tooltips"></div>');
	$('#carte').append('<div id="dc_sensors_overlay"></div>');
	
	pokedoll = new Doll(null);
});

console.log('DC - Secret started');

// debug
var debug_char = new Character('Yonbaïke_01', 'http://image.noelshack.com/fichiers/2016/12/1458784579-yon.png', []);
debug_char.addPosition(new Position(61, 37));
pokereuils.push(debug_char);

var debug_char = new Character('Yonbaïke_02', 'http://image.noelshack.com/fichiers/2016/12/1458784579-yon.png', []);
debug_char.addPosition(new Position(61, 37));
pokereuils.push(debug_char);

var debug_char = new Character('Yonbaïke_03', 'http://image.noelshack.com/fichiers/2016/12/1458784579-yon.png', []);
debug_char.addPosition(new Position(64, 38));
pokereuils.push(debug_char);