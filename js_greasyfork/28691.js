// ==UserScript==
// @name         MooMoo Detailed Map
// @namespace    http://greasyfork.net/
// @version      1.0
// @description  Show players and resources on map
// @author       pedro
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28691/MooMoo%20Detailed%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/28691/MooMoo%20Detailed%20Map.meta.js
// ==/UserScript==

var conf = {};
var Sresources = true;
$(document).ready(function () {

	conf = {
		'map':{
			element:null,
			'w':'15%',
			'h':'25%'
		},
		'me':{
			'color':'#FFFFFF',
			'w':'2.5%',
			'h':'3%'
		},
		'player':{
			'allycolor':'#0000FF',
			'color':'#FF0000',
			'w':'2.5%',
			'h':'3%'
		},
		'resources':{
			'wood':{
				'color':'#713C3C'
			},
			'food':{
				'color':'#C468BE'
			},
			'stone':{
				'color':'#ABABAB'
			},
			'points':{
				'color':'#F0F038'
			},
			'w':'2.5%',
			'h':'3%'
		}
	}

	function mapDrawResources(){
		$.each(gameObjects,function(i,e){
		    if(e.health)return true;
		    var x = e.x * 100 / config.mapScale + '%';
		    var y = e.y * 100 / config.mapScale + '%';
		    var resource = config.resourceTypes[e.type];

		    if($('#resource-'+e.sid+'.'+resource).length) return true;

		    conf.map.element.append('<div id="resource-'+e.sid+'" class="bymapmod gatherResource '+config.resourceTypes[e.type]+'" style="display:'+ (Sresources?'block':'none') +';width:'+ conf.resources.w +';height:'+ conf.resources.h +';background:'+ conf.resources[resource].color +';border-radius:9999px;left:'+x+';top:'+y+';position:absolute;"></div>');
		});
	}

	var gameStarted = false;
	function waitForGame(){
		gameStarted = setInterval(function(){
			if(!$('#mainMenu:visible').length){
				clearInterval(gameStarted);
				mapUpdater();
				return false;
			}
		},10);
	}

	function mapUpdater(){

		if(!$('.uiElement.map').length)
			$('#gameUI').append('<div class="uiElement map bymapmod" style="position:absolute;top:201px;left:20px;padding:5px;pointer-events:all;width:'+conf.map.w+';height:'+conf.map.h+';"></div>');
		conf.map.element = $('#gameUI .uiElement.map');

		if(!$('#me',conf.map.element).length)
			conf.map.element.append('<div id="me" class="bymapmod" style="width:'+conf.player.w+';height:'+conf.player.h+';background:#fff;border-radius:9999px;position:absolute;z-index:9999;"></div>');

		var mapUpdaterInterval = setInterval(function () {

			if($('#mainMenu:visible').length){
				clearInterval(mapUpdaterInterval);
				waitForGame();
				$('.bymapmod').remove();
				return false;
			}

			if(!player) return false;
			$('#me',conf.map.element)[0].style.left = player.x * 100 / config.mapScale + '%';
			$('#me',conf.map.element)[0].style.top = player.y * 100 / config.mapScale + '%';

			mapDrawResources();

			$.each(players,function(i,e){
				if(player.id == e.id)return true;

				if(!e.visible){
					$('#'+e.id,conf.map.element).remove();
					return true;
				}

				var team_color = player.team && e.team == player.team ? conf.player.allycolor: conf.player.color;
				var team_class = player.team && e.team == player.team ? 'team': '';
				if(!$('#'+e.id+(team_class?'.'+team_class:''),conf.map.element).length)
					conf.map.element.append('<div id="'+e.id+'" class="bymapmod another_player '+team_class+'" style="width:'+conf.player.w+';height:'+conf.player.h+';background:'+team_color+';border-radius:5px;position: absolute;"></div>');

				$('#'+e.id,conf.map.element)[0].style.left = e.x * 100 / config.mapScale + '%';
				$('#'+e.id,conf.map.element)[0].style.top = e.y * 100 / config.mapScale + '%';
			});

		}, 100);

	}

	waitForGame();

	$(document).keydown(function(ev){
	      if(ev.which == 77){
	          conf.map.element.toggle();
	          ev.preventDefault();
	      }
	      if(ev.which == 78){
	          $('.gatherResource').toggle();
	          Sresources=!Sresources;
	          ev.preventDefault();
	      }
	});

	window.oncontextmenu = function () {
	   return false;
	};
});
