// ==UserScript==
// @name		draggable_DC
// @author		Ladoria
// @version		0.31
// @grant       none
// @description	Make DC's windows draggable
// @match		http://www.dreadcast.net/Main
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright	2012+, Ladoria
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/2035/draggable_DC.user.js
// @updateURL https://update.greasyfork.org/scripts/2035/draggable_DC.meta.js
// ==/UserScript==

/* DEBUG Don't touch those damn things! */

var global_debug = false;
var event_debug = (global_debug) ? true : false;
var loading_debug = (global_debug) ? true : false;
var setting_debug = (global_debug) ? true : false;
// /DEBUG

/* VARIABLES Don't touch those damn things! */
var zIndex = 310000;
var dragging = false;
var DC_draggable = new Array();
var background_draggable;
var coockie_prefix = 'DC_draggable_';
var preset_count;
var preset_aliases = new Array();
var preset;
// / VARIABLES

/* 	How to :
	- NE PAS RENDRE LA CARTE DÉPLAÇABLE. JAMAIS. OU SUBISSEZ UN TAS DE PROBLÈMES.

	- Chaque indice du tableau DC_draggable doit être l'identifiant unique de l'élément à rendre déplaçable sur l'interface de DC.
	
	- Créer un indice du tableau DC_draggable contenant un tableau vide afin faire remonter l'élément au premier plan suite à un appuie sur le clic gauche de votre souris. (CF ligne pour 'zone_centre')
	
	- Créer un indice du tableau DC_draggable contenant un tableau lui-même contentant un indice 'checkbox' afin d'activer la possibilité de déplacement de l'élément. Il faudra, bien-sûr et également, renseigner le code HTML afin qu'il soit rajouter sur l'interface.
	-- le style suivant est obligatoire pour toute div afin d'éviter qu'elle soit cachée ou explose l'apparence normale de la page.
	-- style : "height:0px;width:0px;z-index:999999;"
	-- Vous êtes libre de le compléter ensuite. Ne faites que -modifier le positionnement la div- et/ou -modifier l'apparence de la checkbox-.
	-- Une checkbox avec pour attribut "name" -l'identifiant unique de l'élément à déplacer- et "class" "DC_draggable" est obligatoire (CF code existant).
	
	Enjoy!
	
	Commentaires à envoyer à Ladoria IG.
*/

/* SETTABLE Touch those nice things as you like! (pervert!) */
preset_count = 5;
preset = 0;

background_draggable = 'rgba(172, 0, 0, 0.6)';

DC_draggable['zone_centre'] = new Array();

DC_draggable['zone_gauche'] = new Array();
DC_draggable['zone_gauche']['checkbox'] = '<div style="height:0px;width:0px;z-index:999999;margin-right:-13px;"><input type="checkbox" name="zone_gauche" class="DC_draggable"></div>';

DC_draggable['zone_droite'] = new Array();
DC_draggable['zone_droite']['checkbox'] = '<div style="height:0px;width:0px;z-index:999999;margin-right:-13px;"><input type="checkbox" name="zone_droite" class="DC_draggable"></div>';

DC_draggable['zone_informations_lieu'] = new Array();
DC_draggable['zone_informations_lieu']['checkbox'] = '<div style="height:0px;width:0px;z-index:999999;top:-11px;left:-15px;"><input type="checkbox" name="zone_informations_lieu" class="DC_draggable"></div>';
DC_draggable['zone_informations_lieu']['css_initial_optionnal'] = {'top': 'auto'};

DC_draggable['zone_informations_combat'] = new Array();
DC_draggable['zone_informations_combat']['checkbox'] = '<div style="height:0px;width:0px;z-index:999999;top:-11px;left:-15px;"><input type="checkbox" name="zone_informations_combat" class="DC_draggable"></div>';
DC_draggable['zone_informations_combat']['css_initial_optionnal'] = {'top': 'auto'};

DC_draggable['db_combat'] = new Array();
DC_draggable['db_combat']['checkbox'] = '<div style="height:0px;width:0px;z-index:999999;top:-36px;left:-10px;"><input type="checkbox" name="db_combat" class="DC_draggable"></div>';
// /SETTABLE

jQuery.noConflict();

$(document).ready( function() {
	if(undefined != getCookie('background'))
		background_draggable = getCookie('background');
	if(undefined != getCookie('preset'))
		preset = parseInt(getCookie('preset'));
	
	for(var i = 1; i < preset_count + 1; i++) {
		if(undefined != getCookie('preset_aliases_' + i))
			preset_aliases.push(getCookie('preset_aliases_' + i));
	}
	
	// make the element in given array (DC_draggabele model) draggables
	function set_DC_draggable(make_draggable) {
		var to_drag = Object.keys(make_draggable);
		
		if(setting_debug) console.log('setting draggable options for: ' + to_drag);
	
		for(var i = 0; i < to_drag.length; i++) {
			var element = to_drag[i];
			var selector = '#' + element;
			
			load_from_cookie(element);
			
			if(loading_debug) console.log('\n' + element + ': ' + ((0 != $(selector).length) ? 'founded, process...' : 'missing, skip...'));
			
			if(0 != $(selector).length) {
				DC_draggable[element]['draggable'] = false;
				DC_draggable[element]['offset_initial'] = $(selector).offset();
				DC_draggable[element]['css_initial'] = {'bottom': $(selector).css('bottom')};
				
				// ici l'offset dernièrement en mémoire
				reinitalize(element, preset, true);
				
				$(selector).addClass('DC_draggable');
				
				if(undefined != DC_draggable[element]['checkbox']) {
					$(selector + ' div').first().before(DC_draggable[element]['checkbox']);
					
					// enable or disable element's drag at checkbox click
					$('input[type=checkbox][name=' + element +'].DC_draggable').click( function() {
						if($(this).is(':checked'))
							enableDrag($(this).attr('name'));
						else
							disableDrag($(this).attr('name'));
						
						if(event_debug) console.log('checked: ' + $(this).attr('name'));
					});
					if(loading_debug) console.log('event:click:checkbox: done');
					
					// place the element to its original area
					$(selector).dblclick( function() {
						reinitalize($(this).attr('id'), 'initial', false);
						
						if(event_debug) console.log('doubleclick: ' + $(this).attr('id'));
					});
					if(loading_debug) console.log('event:doubleclick: done');
					
					// set size end background of element while dragging
					$(selector).bind('drag', function(event) {
						if(true == DC_draggable[$(this).attr('id')]['draggable']) {
							if(!dragging) {
								dragging = true;
								if("" != background_draggable)
									$('#' + $(this).attr('id')).css('backgroundColor',background_draggable);
								
								$('#' + $(this).attr('id')).css('bottom','auto'); // 'cause of weird unfixed height
								
								if(event_debug) console.log('dragging: ' + $(this).attr('id'));
							}
						}
					});
					if(loading_debug) console.log('event:drag: done');
					
					// a placer sur $(document) et un .each sur les element pour retirer tout BG à la fin de totu mouse up (réglant le problème du drag & drop d'objet)
					// set original background of element at the end of drag
					$(selector).mouseup( function() {
						if(dragging) {
							dragging = false;
							
							$('#' + $(this).attr('id')).css('backgroundColor', DC_draggable[$(this).attr('id')]['backgroundColor']);
							
							if('initial' != preset) {
								DC_draggable[$(this).attr('id')]['offset_' + preset] = $('#' + $(this).attr('id')).offset();
								save_to_cookie($(this).attr('id'));
							}
							
							if(event_debug) if(!dragging) console.log('end of drag: ' + $(this).attr('id'));
						}
					});
					if(loading_debug) console.log('event:mouseup: done');
				}
				
				// puts the element on foreground
				$(selector).mousedown( function() {
					zIndex++;
					$('#' + $(this).attr('id')).zIndex(zIndex);
					
					if(event_debug) console.log('foregrounded: ' + $(this).attr('id'));
				});
				if(loading_debug) console.log('event:mousedown: done');
			}
		}
	}
	
	// need that to let the javascript display all element after the 'ready' state of the DOM
	setTimeout( function() {
		if(setting_debug) console.log('first delayed loading.');
	
		set_DC_draggable(DC_draggable);
	}, 1000);
	
	// enabling dragging of element
	function enableDrag(id) {
		$('#' + id).draggable();
		$('#' + id).css('cursor','move');
		DC_draggable[id]['draggable'] = true;
		DC_draggable[id]['backgroundColor'] = $('#' + id).css('backgroundColor');
		
		if(setting_debug) console.log('drag enabled: ' + id);
	}
	
	// disable dragging of element
	function disableDrag(id) {
		$('#' + id).draggable('destroy');
		$('#' + id).addClass('');
		$('#' + id).css('cursor','auto');
		DC_draggable[id]['draggable'] = false;
		
		if(setting_debug) console.log('drag disabled: ' + id);
	}
	
	// disable dragging of element
	function reinitalize(id, offset, forced) {
		if((true == forced
		|| true == DC_draggable[id]['draggable'])
		&& 0 != $('#' + id).length) {
			if(global_debug) console.log('offset_' + offset + ':');
			if(global_debug) console.log(DC_draggable[id]['offset_' + offset]);
		
			if(	undefined == DC_draggable[id]['offset_' + offset]
			|| 0 == offset
			|| 	(DC_draggable[id]['offset_' + offset].top == DC_draggable[id]['offset_initial'].top
				&& DC_draggable[id]['offset_' + offset].left == DC_draggable[id]['offset_initial'].left)
			) {
				if(global_debug) console.log('Setting initial offset');
				$('#' + id).offset(DC_draggable[id]['offset_initial']);
				$('#' + id).css(DC_draggable[id]['css_initial']);
				
				if(undefined != DC_draggable[id]['css_initial_optionnal'])
					$('#' + id).css(DC_draggable[id]['css_initial_optionnal']);
			}
			else {
				if(global_debug) console.log('Setting offset ' + offset);
				$('#' + id).offset(DC_draggable[id]['offset_' + offset]);
				$('#' + id).css('bottom','auto'); // 'cause of weird unfixed height
			}
		}
		
		if(setting_debug) console.log('reinitialized: ' + id);
	}
	
	// set draggable element 'after' combat's interface loading
	$(document).ajaxComplete( function(a,b,c) {
		if(c.url == '/Interface/Fight') {
			if(event_debug) console.log('fight\'s interface is requesting.');
				
			var DC_draggable_fight = new Array();
			DC_draggable_fight['zone_informations_combat'] = DC_draggable['zone_informations_combat'];
			DC_draggable_fight['db_combat'] = DC_draggable['db_combat'];
			
			set_DC_draggable(DC_draggable_fight);
		}
	});
	
	// menu
	$('#bandeau .menus > li').first().before('<li id="DC_draggable" class="couleur5"><img src="http://image.noelshack.com/fichiers/2014/23/1401993008-lado-head.png" class="infoAide" title="Une Ladoria" alt="Une Ladoria"><ul><li class="separator">Couleur de fond lors du drag:<input type="text" name="backgroundColor" class="textbox backgroundColor" value="' + background_draggable + '"></li><li name="enable" class="button">Tout activer</li><li>Configurations<div class="presetContainer">' + build_preset_html() + '</div></li><li name="bug_report" class="button separator">Signaler un bug</li><li name="suggest" class="button">Suggérer un truc</li><li class="button"><a target="_blank" href="https://greasyfork.org/scripts/2035-draggable-dc"><div>Mettre à jour</div></a></li></ul></li><li class="separator"></li>');
	
	// global style
	$('head').append('<style>#DC_draggable {padding-top: 0px !important;padding-bottom: 0px !important;}#DC_draggable ul {margin-top: 28px !important;width: 168px !important;}#DC_draggable li {padding-right: 7px !important;}#DC_draggable:hover > ul {display: block !important;}#DC_draggable .button {cursor: pointer;}#DC_draggable .textbox {width: 150px;background-color: #ffffff;}#DC_draggable .textbox.backgroundColor {margin-top: 3px;}#DC_draggable .center {text-align: center;width: 168px;color: white;font-size: 1.4em;}#DC_draggable .presetContainer {overflow: hidden;}#DC_draggable .preset {float: left;overflow: hidden;color: #000000;border: 1px solid black;padding: 1px 1px 1px 1px;width: 73px;}#DC_draggable .preset .btnTxt {margin: 1px 1px 1px 1px;padding: 1px 3px;cursor: pointer;}#DC_draggable .preset .btnTxt {width: 26px;}#DC_draggable .preset .load {float: left;}#DC_draggable .preset .save {float: right;}#DC_draggable .preset .base {width: 64px;height: 38px;}#DC_draggable .preset .base div {top: 50%;margin-top: -0.7em;}#DC_draggable .preset.selected {border-color: green;}#DC_draggable .preset .textbox {width: 69px;margin-bottom: 1px;}</style>/* to minimize [\n\t\r] */');
	
	// swtich element's offset's preset
	$('#DC_draggable input[type=checkbox][name=preset]').click( function() {
		moveTo($(this).val());
	});
	
	// display a message box to send a bug report, IG
	$('#DC_draggable [name=bug_report]').click( function() {
		nav.getMessagerie().newMessage();
		$('#db_new_message:last').zIndex('1000');
		$('#db_new_message:last .head .title').html('Reporter un BUG sur DC Draggable');
		$('#db_new_message:last #nm_cible input').val('Ladoria');
		$('#db_new_message:last #nm_sujet input').val('[HRP][DC Draggable][Bug]');
		$('#db_new_message:last #nm_texte textarea').focus();
	});
	
	// Suggeste something, IG
	$('#DC_draggable [name=suggest]').click( function() {
		nav.getMessagerie().newMessage();
		$('#db_new_message:last').zIndex('1000');
		$('#db_new_message:last .head .title').html('Suggérer un truc pour DC Draggable');
		$('#db_new_message:last #nm_cible input').val('Ladoria');
		$('#db_new_message:last #nm_sujet input').val('[HRP][DC Draggable][Suggestion]');
		$('#db_new_message:last #nm_texte textarea').focus();
	});

	// change background color when dragging
	$('#DC_draggable input[name=backgroundColor]').keyup( function (e) {
		if(e.keyCode == 13) {
			background_draggable = $(this).val();
			saveCookie('background', background_draggable);
		}
	});

	// enable/disable all drag
	$('#DC_draggable [name=enable]').click( function() {
		var enable;
		
		if($(this).html() == 'Tout activer') {
			enable = true;
			$(this).html('Tout désactiver');
		}
		else {
			$(this).html('Tout activer');
			enable = false;
		}
		
		$('input[type=checkbox].DC_draggable').each( function() {
			$(this).prop('checked', enable);
			
			if(enable)
				enableDrag($(this).attr('name'));
			else
				disableDrag($(this).attr('name'));
		});
	});

	// load preset positions
	$('#DC_draggable .preset .btnTxt').click( function() {
		if(global_debug) console.log('setting for preset: ' + $(this).attr('name'));
		
		if($(this).hasClass('load')) {
			preset = $(this).attr('name');
			saveCookie('preset',preset);
			
			$('#DC_draggable .preset.selected').removeClass('selected');
			$(this).parent().addClass('selected');
		
			var to_load = Object.keys(DC_draggable);
			
			for (var i = 0; i < to_load.length; i++) {
				reinitalize(to_load[i], preset, true);
			}
		}
		else if($(this).hasClass('save')) {
			if('0' == $(this).attr('name')) return;
		
			var to_save = Object.keys(DC_draggable);
			
			for (var i = 0; i < to_save.length; i++) {
				DC_draggable[to_save[i]]['offset_' + $(this).attr('name')] = $('#' + to_save[i]).offset();
				save_to_cookie(to_save[i]);
			}
			
			saveCookie('preset_aliases_' + $(this).attr('name'), $('#preset_aliases_' + $(this).attr('name')).val());
		}
	});
	
	$('.preset_aliases').keyup( function (e) {
		if(e.keyCode == 13) {
			preset_aliases[parseInt($(this).attr('name'))] = $(this).val();
			saveCookie('preset_aliases_' + $(this).attr('name'), preset_aliases[parseInt($(this).attr('name'))]);
		}
	});
});

function saveCookie(name,val) {
	name = coockie_prefix + name;
	
	if(!navigator.cookieEnabled) return;
		document.cookie = name + '=' + val + ';expires=Wed, 01 Jan 2020 00:00:00 GMT; path=/';
}

function getCookie(var_name) {
	name = coockie_prefix + var_name;
	
	if(!navigator.cookieEnabled) return undefined;
	
	var start = document.cookie.indexOf(name + '=')
	if(start == -1) return undefined;
	start += name.length + 1;
	
	var end = document.cookie.indexOf(';',start);
	if (end == -1) end = document.cookie.lenght;
	
	if(global_debug) console.log(var_name + ': ' + document.cookie.substring(start,end));
	
	return document.cookie.substring(start,end);
};

// load element's options from cookie
function load_from_cookie(element) {
	if(undefined == DC_draggable[element]['checkbox']) return;

	var variables = ['offset'];
	
	for(var i = 0; i < variables.length; i++) {
		var variable_name = element + '_' + variables[i];
		
		switch(variables[i]) {
			case 'offset' :
				for(var j = 1; j < preset_count + 1; j++) {
					if(	 undefined != getCookie(variable_name + '_top_' + j)
					&& 	undefined != getCookie(variable_name + '_left_' + j)) {
						if(global_debug) console.log('Loading: ' + variable_name + '_' + j);
						
						var offset = new Object();
						offset.top = parseInt(getCookie(variable_name + '_top_' + j));
						offset.left = parseInt(getCookie(variable_name + '_left_' + j));
						DC_draggable[element]['offset_' + j] = offset;
					}
				}
				break;
			default: break;
		}
	}
}

// save element's options to cookie
function save_to_cookie(element) {
	if(undefined == DC_draggable[element]['checkbox']) return;

	var variables = ['offset'];
	if(global_debug) console.log('Saving: ' + element);
	
	for(var i = 0; i < variables.length; i++) {
		var variable_name = element + '_' + variables[i];
		
		switch(variables[i]) {
			case 'offset' :
				for(var j = 1; j < preset_count + 1; j++) {
					if(global_debug) console.log('Saving: ' + variable_name + '_' + j);
					
					if(undefined != DC_draggable[element]['offset_' + j]) {
						saveCookie(variable_name + '_top_' + j, DC_draggable[element]['offset_' + j].top);
						saveCookie(variable_name + '_left_' + j, DC_draggable[element]['offset_' + j].left);
					}
				}
				break;
			default: break;
		}
	}
}

function build_preset_html() {
	var preset_html = '';
	
	for(var i = 0; i < preset_count + 1; i++) {
		preset_html += '<div class="DC_draggable preset';
		
		if(preset == i) preset_html += ' selected';
		
		preset_html += '">';
		
		if(0 == i) {
			preset_html += '<div class="DC_draggable btnTxt load base" name="' + i + '"><div>Initiale</div></div>';
		}
		else {
			preset_html += '<div class="DC_draggable"><input type="text" id="preset_aliases_' + i + '" class="DC_draggable textbox preset_aliases" name="' + i + '" value="' + ((undefined != preset_aliases[i - 1]) ? preset_aliases[i - 1] : ('Conf. ' + i)) + '" onclick="this.select();"></div>';
		
			preset_html += '<div class="DC_draggable btnTxt save" name="' + i + '">Save</div>';
			preset_html += '<div class="DC_draggable btnTxt load" name="' + i + '">Load</div>';
		}
		preset_html += '</div>';
	}
	
	return preset_html;
};