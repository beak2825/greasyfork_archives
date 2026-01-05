// ==UserScript==
// @name		DC_auto_refresh_test_only
// @author		Ladoria
// @version		0.2
// @grant    none
// @description	Custom auto-refresh, display ping/delay network info overlay.
// @match		http://www.dreadcast.net/Main
// @match		http://www.dreadcast.net/Index
// @copyright	2015+, Ladoria
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/11271/DC_auto_refresh_test_only.user.js
// @updateURL https://update.greasyfork.org/scripts/11271/DC_auto_refresh_test_only.meta.js
// ==/UserScript==

/*	
	Reload or ask to reload window if no successful network activityfor a while
	Display tiny overlay on left top of window. (Delay between 2 refreshs)
	Display alert message before reload (Can be deactivated)
	Always can abort a reload
*/

// Global
var reload_asked = 0;
var last_request_completed = Date.now();
var check_delay = 3000; // In ms, x >= 3000. DC's refresh is each ~2950ms.
var lag_buster = 10000; // In ms, setted to casual or hard mode.
var casual_lag_buster = 10000; // In ms, x >= 2000. Time to activate reconnection routine. Because lag is life, m'k.
var hard_lag_buster = 600000; // In ms, x >= 600000 (10min). Time to activate reconnection routine during hard lagging.
casual_lag_buster += check_delay; // Basic anti-lag security
hard_lag_buster += check_delay;
var refresh_time_limit = 120000; // In ms. Time to auto-refresh. (+ lag_buster in script)
var script_paused = false;
var disconnected = false;
var global_clock_interval = undefined;

// Cookies
var cookie_prefix = "DC_auto_refresh_";
var animation_enabled = true; // Enable delay animation
var show_overlay = true; // Show ping overlay
var show_overlay_options = true; // Show options overlay
var full_auto = false; // Do not ask to reload
var script_enabled = true;

// Overlay
var refresh_interval;
var server_date = new Date(); // Hard lagging from 5:00 to 6:00 GTM + 2
var last_request_send = Date.now(); // Last attempt time
var first_request_send = Date.now(); // First of failed attempts time

var alert_messages = new Array();
alert_messages.ask_to_reload = 'Attention, vous semblez avoir été déconnecté. Rechargement de la page dans <span class="seconds">&nbsp;</span> seconde(s) <br><div class="btnTxt abort"><div>Annuler</div></div><div class="btnTxt reload"><div>Recharger</div></div>';
alert_messages.unconnected = 'Attention, vous semblez toujours déconnecté.&nbsp;<div class="btnTxt hide"><div>OK</div></div>';
alert_messages.connected = '<span class="ok_message">Vous semblez avoir été reconnecté.</span>&nbsp;&nbsp;<div class="btnTxt hide"><div>OK</div></div>';

$(document).ready( function() {
	$('body').append('<style>#auto_refresh {display: block;z-index: 1000000;position: absolute;top: 31px;width: 100%;text-align: center;}#auto_refresh .overlay_container {z-index: 1000001;position: absolute;top: 0px;max-width: 131px;color: white;line-height: 14px;font-size: 10px;}#auto_refresh .overlay, #auto_refresh .overlay_options {float: left;margin-right: 2px;margin-bottom: 1px;max-height: 125px;color: white;background-color: rgba(0, 0, 0, 0.75);line-height: 14px;font-size: 10px;}#auto_refresh .overlay .toggle, #auto_refresh .overlay_options .toggle, #auto_refresh .overlay_options .abort_reload_auto {float: right;padding-left: 5px;padding-right: 5px;width: 6px;border: 1px solid gray;cursor: pointer;}#auto_refresh .overlay_options .abort_reload_auto {display: none;color: red;font-weight: bold;border: 1px solid red;}#auto_refresh .overlay_options .check_box {float: right;width: 14px;height: 100%;background-color: rgba(255,0,0,0.5);box-shadow: inset 0px 0px 0px 1px red;}#auto_refresh .overlay .refresh_delay, #auto_refresh .overlay_options .full_auto , #auto_refresh .overlay_options .reload_auto {float: left;margin-right: 1px;width: 105px;color: back;background-color: transparent;border: 1px solid green;cursor: pointer;}#auto_refresh .overlay_options .full_auto, #auto_refresh .overlay_options .reload_auto {border: 1px solid gray;}#auto_refresh .overlay_options .reload_auto {cursor: default;display: none;}#auto_refresh .overlay .refresh_delay .actual_time {position: absolute;top: 0px;left: 0px;background-color: rgba(0, 255, 0, 0.1);height: 100%;overflow: hidden;}#auto_refresh .alert_container {display: none;}#auto_refresh .alert {position: relative;display: inline-block;padding: 5px;color: red;background-color: white;text-align: center;font-size: 15px;}#auto_refresh .alert .abort, #auto_refresh .alert .reload, #auto_refresh .alert .hide {display: inline-block;margin: 4px;width: 100px;}#auto_refresh .ok_message{color: green;}</style>');
	$("body").append('<div id="auto_refresh"><div class="overlay_container"><div class="overlay"><div class="ping refresh_delay" title="Activer/Désactiver animation"><div class="actual_time barre_etat"></div><span class="data">Ping</span> : <span class="seconds">&nbsp;</span> <span class="unit">ms</span></div><div class="toggle" title="Ping">&lt;</div></div><div class="overlay_options"><div class="full_auto" title="Activer/Désactiver notifications"><span class="data">Full auto</span><span class="check_box" value="0">&nbsp;</span></div><div class="toggle" title="Mode full auto">&lt;</div></div><div class="overlay_options"><div class="reload_auto" title="Refresh prévu dans..."><span class="data">Refresh</span> : <span class="seconds">&nbsp;</span> <span class="unit">s</span></div><div class="abort_reload_auto" title="Stopper le refresh prévu">x</div></div></div><div class="alert_container"><div class="alert fakeToolTip"></div></div></div>');
	
	function initialize() {
		if(undefined !== getCookie('global')) {
			show_overlay = (/overlay_on/gi.test(getCookie('global'))) ? true : false;
			show_overlay_options = (/overlay_options_on/gi.test(getCookie('global'))) ? true : false;
			animation_enabled = (/delay_anim_on/gi.test(getCookie('global'))) ? true : false;
			full_auto = (/full_auto_on/gi.test(getCookie('global'))) ? true : false;
		}
		else
			saveCookie('global','');
		
		if(false === show_overlay) {
			$('#auto_refresh .overlay .toggle').html('>');
			$('#auto_refresh .overlay .ping').hide();
		}
		if(false === animation_enabled) {
			$('#auto_refresh .animation_enabled .toggle').html('>');
			$('#auto_refresh .animation_enabled .full_auto').hide();
		}
		if(false === show_overlay_options) {
			$('#auto_refresh .overlay_options .toggle').html('>');
			$('#auto_refresh .overlay_options .full_auto').hide();
			
			if(false === full_auto)
				$('#auto_refresh .overlay_options .toggle').css({'borderColor' : 'red'});
			else
				$('#auto_refresh .overlay_options .toggle').css({'borderColor' : 'green'});
		}
		if(true === full_auto) {
			$('#auto_refresh .overlay_options .full_auto .check_box').css({	'boxShadow' : 'inset 0px 0px 0px 1px rgba(0, 210, 0,1)',
																			'backgroundColor' : 'rgba(0,255,0,0.5)'});
		}
	}
	
	// Handle alert messages
	function show_alert(message) {
		// Automatic mode, no alert
		if (true === full_auto) {
			hide_alert();
			return;
		}
		
		$('#auto_refresh .alert').html(alert_messages[message]);
		
		// Yes/No alert
		if('ask_to_reload' == message) {
			// User want to abort, then notify user and pause script
			$('#auto_refresh .alert .abort').on('click', function() {
				abort_reload();
				
				show_alert('unconnected');
			});
			
			// Do reload
			$('#auto_refresh .alert .reload').on('click', function() {
				do_reload();
			});
			
			// Refresh reload countdown
			refresh_reload_alert(true);
		}
		else if ('connected' == message || 'unconnected' == message) {
			// hide alert
			$('#auto_refresh .alert .hide').on('click', function() {
				hide_alert();
			});
		}
		
		$('#auto_refresh .alert_container').show();
	}
	
	function hide_alert() {
		$('#auto_refresh .alert_container').hide();
	}
	
	// Stop refresh countdown
	function abort_reload() {
		clearInterval(refresh_interval);
		
		reload_asked = 0;
		script_paused = true;
		// last_request_completed = Date.now();
	}
	
	// Reload window
	function do_reload() {
		// Useless, but lovely
		script_paused = true;
		
		// Click method to avoid form issues
		window.location.href = 'http://www.dreadcast.net/Main';
	}
	
	// Handle reload events
	function handle_reload() {
		if(true === script_paused) return;
		
		// If no network activity for a while, reload.
		if (Date.now() - last_request_completed >= lag_buster) {
			// Delay to refresh
			if(0 === reload_asked) {
				reload_asked = Date.now();
				refresh_reload_auto();
			}
			
			// If yes/no alert hidden, show it (fired every seconds in full auto mode)
			if (true === full_auto) {
				hide_alert();
			}
			else if (false === $('#auto_refresh .alert .abort').is(':Visible'))
					show_alert('ask_to_reload'); // If full auto mode, disabled function
			
			// If waiting asked and done, reload
			if (0 !== reload_asked)
				if (Date.now() - reload_asked >= refresh_time_limit) {
					
					do_reload();
				}
		}
	}
	
	// Refresh reload countdown
	function refresh_reload_alert(forced) {
		if (true === forced || true === $('#auto_refresh .alert .seconds').is(':Visible')) {
			$('#auto_refresh .alert .seconds').html(Math.round((refresh_time_limit - (Date.now() - reload_asked)) / 1000));
		}
	}
	
	// Overlay
	// Display refreshed ping
	function refresh_ping(request_send, request) {
		// If connected, refresh values
		if (false === disconnected)
			first_request_send = request_send;
		else {
			request = Date.now(); // If disconnected, keep stored data.
			request_send = first_request_send;
		}
		
		var ping = ((request - request_send) < 0) // During requesting new Check
			? ping
			: request - request_send;
		
		if (false === show_overlay) {
			if (ping > (check_delay * 2))
				$('#auto_refresh .overlay .toggle').css({'borderColor' : 'red'});
			
			return;
		}
		
		// Time background-color cheat.
		if (ping > (check_delay * 2)) {
			$('#auto_refresh .overlay .refresh_delay').css(	{'borderColor' : 'red'});
			$('#auto_refresh .overlay .actual_time').css(	{'width' : '0px'},
															{'backgroundColor' : 'rgba(255, 0, 0, 0.2)'});
			$('#auto_refresh .overlay .refresh_delay .data').html('Délai');
		}
		
		if (true === disconnected) {
			ping = Math.round(ping / 100) / 10;
			$('#auto_refresh .overlay .refresh_delay .unit').html('s');
		}
		else
			$('#auto_refresh .overlay .refresh_delay .unit').html('ms');
		
		$('#auto_refresh .overlay .ping .seconds').html(ping);
	}
	// Display refreshed delay animation
	function refresh_delay(request, animation_start) {
		var animation_progression = 0;
		
		if (undefined === animation_start)
			animation_start = 0;
		else {
			// Percent of animation completion
			animation_progression = (request + check_delay - animation_start);
			animation_progression = 1 - (animation_progression / check_delay);
		}
		// Stop animation, then set to new width
		$('#auto_refresh .overlay .actual_time').stop();
		
		// Overlay hide, do not animate
		if(false === show_overlay) {
			$('#auto_refresh .overlay .toggle').css({'borderColor' : 'green'});
			
			return;
		}
		
		$('#auto_refresh .overlay .toggle').css({'borderColor' : 'gray'});
		$('#auto_refresh .overlay .refresh_delay').css(	{'borderColor' : 'green'});
		$('#auto_refresh .overlay .actual_time').css(	{'width' : (animation_progression * $('#auto_refresh .overlay .refresh_delay').width()) + 'px'},
														{'backgroundColor' : 'rgba(0, 255, 0, 0.2)'});
		$('#auto_refresh .overlay .refresh_delay .data').html('Ping');
		
		if (false === animation_enabled) return;
		
		// Moving width to 100% at correct speed
		$('#auto_refresh .overlay .actual_time').animate(
			{width : $('#auto_refresh .overlay .refresh_delay').width()}
			, check_delay - (check_delay * animation_progression));
	}
	
	function refresh_reload_auto() {
		console.log('\n');
		console.log('refresh_reload_auto :');
		console.log('disconnected : ' + disconnected);
		console.log('full_auto : ' + full_auto);
		console.log('reload_asked : ' + (0 === reload_asked) ? reload_asked : ((Date.now() - reload_asked) / 1000).toFixed(2) + ' s');
		console.log('last_request_send : ' + ((Date.now() - last_request_send) / 1000).toFixed(2) + ' s');
		console.log('last_request_completed : ' + ((Date.now() - last_request_completed) / 1000).toFixed(2) + ' s');
		
		if (0 === reload_asked || true !== full_auto) {
			$('#auto_refresh .overlay_options .reload_auto').hide();
			$('#auto_refresh .overlay_options .abort_reload_auto').hide();
			return;
		}
		
		console.log('refresh_time_limit(' + refresh_time_limit + ') - (Date.now(' + Date.now() + ') - reload_asked(' + reload_asked + ')) = ' + (refresh_time_limit - (Date.now() - reload_asked)));
		
		$('#auto_refresh .overlay_options .reload_auto').show();
		$('#auto_refresh .overlay_options .abort_reload_auto').show();
		$('#auto_refresh .overlay_options .reload_auto .seconds').html(Math.round((refresh_time_limit - (Date.now() - reload_asked)) / 1000));
	}
	
	// Toggle delay animation
	$('#auto_refresh .overlay .ping').on('click', function() {
		animation_enabled = !animation_enabled;
		
		refresh_delay(last_request_completed, Date.now());
		
		// Remove old value and put new value
		saveCookie(	'global',
					getCookie('global').replace(/(delay_anim_on|delay_anim_off)/gi, '') + ((true === animation_enabled) ? 'delay_anim_on' : 'delay_anim_off'));
	});
	// Toggle full auto mode
	$('#auto_refresh .overlay_options .full_auto').on('click', function() {
		full_auto = !full_auto;
		
		if(true === full_auto) {
			$('#auto_refresh .overlay_options .full_auto .check_box').css({	'boxShadow' : 'inset 0px 0px 0px 1px rgba(0, 210, 0,1)',
																			'backgroundColor' : 'rgba(0,255,0,0.5)'});
		}
		else {
			$('#auto_refresh .overlay_options .full_auto .check_box').css({	'boxShadow' : 'inset 0px 0px 0px 1px red',
																			'backgroundColor' : 'rgba(255,0,0,0.5)'});
		}
		
		script_paused = false;
		
		// Remove old value and put new value
		saveCookie(	'global',
					getCookie('global').replace(/(full_auto_on|full_auto_off)/gi, '') + ((true === full_auto) ? 'full_auto_on' : 'full_auto_off'));
	});
	
	// Toggle overlay
	$('#auto_refresh .overlay .toggle').on('click', function() {
		$('#auto_refresh .overlay .ping').toggle();
		
		show_overlay = !show_overlay;
		
		if (true === show_overlay) {
			$('#auto_refresh .overlay .toggle').html('<');
			$('#auto_refresh .overlay .toggle').css({'borderColor' : 'gray'});
		}
		else {
			$('#auto_refresh .overlay .toggle').html('>');
			$('#auto_refresh .overlay .toggle').css({'borderColor' : $('#auto_refresh .overlay .refresh_delay').css('borderColor')});
		}
		
		if(true === animation_enabled)
			refresh_delay(last_request_completed, Date.now());
		
		refresh_ping(last_request_send, last_request_completed);
		
		// Remove old value and put new value
		saveCookie(	'global',
					getCookie('global').replace(/(overlay_on|overlay_off)/gi, '') + ((true === show_overlay) ? 'overlay_on' : 'overlay_off'));
	});
	
	// Toggle overlay options
	$('#auto_refresh .overlay_options .toggle').on('click', function() {
		$('#auto_refresh .overlay_options .full_auto').toggle(); // full auto option
		
		show_overlay_options = !show_overlay_options;
		
		if (true === show_overlay_options) {
			$('#auto_refresh .overlay_options .toggle').css({'borderColor' : 'gray'});
			$('#auto_refresh .overlay_options .toggle').html('<');
		}
		else {
			if (true === full_auto)
				$('#auto_refresh .overlay_options .toggle').css({'borderColor' : 'green'});
			else
				$('#auto_refresh .overlay_options .toggle').css({'borderColor' : 'red'});
				
			$('#auto_refresh .overlay_options .toggle').html('>');
		}
		
		// Remove old value and put new value
		saveCookie(	'global',
					getCookie('global').replace(/(overlay_options_on|overlay_options_off)/gi, '') + ((true === show_overlay_options) ? 'overlay_options_on' : 'overlay_options_off'));
	});
	
	$('#auto_refresh .overlay_options .abort_reload_auto').on('click', function() {
		abort_reload();
		refresh_reload_auto();
	});
	
	// Global clock
	function start_global_clock() {
		if(undefined !== global_clock_interval)
			clearInterval(global_clock_interval);
			
		global_clock_interval = setInterval(function() {
			// In case of hard lagging (5:00 -> 5:59)
			lag_buster = (5 == server_date.getHours()) ? hard_lag_buster : casual_lag_buster;
			
			// Alert reload time refresh
			refresh_reload_alert();
			
			// Ping refresh
			refresh_ping(last_request_send, last_request_completed);
			
			// Reload auto refresh
			refresh_reload_auto();
			
			// Countdown to window reload
			handle_reload();
		}, 1000);
	}
	
	// Script start
	initialize();
	start_global_clock();
	
	// Update last request send time
	$(document).ajaxSend( function(a,b,c) {
		if(/Check/.test(c.url)) {
			last_request_send = Date.now();
		}
	});
	
	// Update last request time
	$(document).ajaxComplete( function(a,b,c) {
		if(/Check/.test(c.url)) {
			// Refresh server date
			server_date = new Date(b.getResponseHeader('Date'));
			
			// If request succeeded
			if(b.readyState === 4) {
				// If reconnected again connexion, resume script and notify
				if($('#auto_refresh .alert').is(':Visible') || true === disconnected) {
					show_alert('connected');
				
					// Stop reload
					abort_reload();
				}
				
				// Resume script
				script_paused = false;
				disconnected = false;
				
				last_request_completed = Date.now();
				
				// Display new data (better sync)
				refresh_delay(last_request_completed);
				refresh_reload_auto();
			}
			else
				disconnected = true;
			
			// Display new data (better sync)
			refresh_ping(last_request_send, last_request_completed);
		}
	});
});
// handle cookies
function saveCookie(name,val) {
	name = cookie_prefix + name;
	
	if(!navigator.cookieEnabled) return;
		document.cookie = name + '=' + val + ';expires=Wed, 01 Jan 2020 00:00:00 GMT; path=/';
}
function getCookie(var_name) {
	name = cookie_prefix + var_name;
	
	if(!navigator.cookieEnabled) return undefined;
	
	var start = document.cookie.indexOf(name + '=')
	if(start == -1) return undefined;
	start += name.length + 1;
	
	var end = document.cookie.indexOf(';',start);
	if (end == -1) end = document.cookie.lenght;
	
	return document.cookie.substring(start,end);
};
console.log('DC - Auto Refresh started');