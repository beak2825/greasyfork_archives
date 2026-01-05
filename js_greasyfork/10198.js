// ==UserScript==
// @name		DC_bullets_alert
// @author		Ladoria
// @version		0.2
// @grant       none
// @description	Play song while gun charger is low on fight
// @match		https://www.dreadcast.eu/Main
// @copyright	2015+, Ladoria
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/10198/DC_bullets_alert.user.js
// @updateURL https://update.greasyfork.org/scripts/10198/DC_bullets_alert.meta.js
// ==/UserScript==

var bullet_chargers = new Array();

var lowBullets = 1;

jQuery.noConflict();

$('body').append('<audio id="DC_bullets_low_charger" src="http://www.memoclic.com/medias/sons-wav/2/656.wav" type="audio/waw"></audio><audio id="DC_bullets_empty_charger" src="http://www.memoclic.com/medias/sons-wav/1/334.wav" type="audio/waw"></audio>');
$("#DC_bullets_low_charger").prop('volume', '1');
$("#DC_bullets_empty_charger").prop('volume', '1');

$(document).ready( function() {
	function alert_user() {
		//if no fight, skip
		if(0 == $('#combat_barre_out').length)
			return;
		
		//console.log('fight detected');
		
		var gun_chargers = $('#equipement_inventaire [class*=balles_munitions_]');
		
		$('#equipement_inventaire [class*=balles_munitions_]').eq(0).parent().parent().parent().parent().parent().parent();
		
		if(0 == gun_chargers.length)
			return;
		
		for(var i = 0; i <= gun_chargers.length - 1; i++) {
			var gun_charger = gun_chargers.eq(i);
			var bullets = parseInt(gun_charger.html());
			var bullets_alert;
			
			//console.log('Bullets : ' + bullets);
			
			//charger empty, low or ok + colouration
			if(0 >= bullets) {
				bullets_alert = 'empty';
				animate_gun(i, 'red');
			}
			else if(lowBullets >= bullets) {
				bullets_alert = 'low'
				animate_gun(i, 'yellow');
			}
			else
				animate_gun(i, 'none');
			
			var charger = gun_charger.attr('class');
			
			//if unhandled
			if(-1 == $.inArray(charger, Object.keys(bullet_chargers)))
				bullet_chargers[charger] = {previous_bullets : -1, alert : bullets_alert};
			
			//bullets in charger changed? Yes : need to alert
			if(bullets != bullet_chargers[charger].previous_bullets)
				bullet_chargers[charger].alert = bullets_alert;
			
			bullet_chargers[charger].previous_bullets = bullets;
		}
		
		//console.log(bullet_chargers);
		
		//what sound to play?
		var alert = 'none'
		for(var key in bullet_chargers) {
			//console.log(key);
			if('empty' != alert) {
				if('empty' == bullet_chargers[key].alert)
					alert = 'empty';
				if ('low' == bullet_chargers[key].alert)
					alert = 'low';
			}
			
			//alert noted, neutralise
			bullet_chargers[key].alert = 'none';
		}
		
		//console.log(alert);
		
		//no need to alert, skip
		if('none' == alert)
			return;
		
		//console.log('play alert');
		
		var song = ('empty' == alert)	? song = $('#DC_bullets_empty_charger')[0]
										: song = $('#DC_bullets_low_charger')[0];
		
		song.load();
		song.play();
	}
	
	function animate_gun(case_number,color) {
		var rgba = 'rgba(0,0,0,0)';
		if('red' == color)
			rgba = 'rgba(255,0,0,0.5)';
		if('yellow' == color)
			rgba = 'rgba(255,125,0,0.5)';
		
		$('#equipement_inventaire .zone_case' + (case_number + 3)).find('img.activable').css({'backgroundColor' : rgba});
	}
	
	$(document).ajaxComplete( function(a,b,c) {
		if(/Check/.test(c.url)) {
			alert_user();
		}
	});
});
console.log('DC - Bullets Alert started');