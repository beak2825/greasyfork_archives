// ---------------------------------------------------------------------
//
// ==UserScript==
// @name dota2lounge auto-clicker
// @version 0.06
// @source http://steamcommunity.com/id/yolanda_be_cool/
// @description Click "bet" without fucking your mouse.
// @include http://dota2lounge.com/match?m=*
// @include http://dota2lounge.com/mybets
// @include http://csgolounge.com/mybets
// @include http://csgolounge.com/match?m=*
// @require https://code.jquery.com/jquery-2.1.1.min.js
// @require https://code.jquery.com/ui/1.10.4/jquery-ui.min.js
// @namespace https://greasyfork.org/users/6507
// @downloadURL https://update.greasyfork.org/scripts/10822/dota2lounge%20auto-clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/10822/dota2lounge%20auto-clicker.meta.js
// ==/UserScript==//// ---------------------------------------------------------------------
var clicking = false;
var timerMulti;
var count = 0;

var w_main = "";
w_main += "<div id='p_clicker' style='background-color:rgb(40,40,40); width:100%' hidden>";
w_main += "<font id='dot_clicker' color='red'>  ●  </font>";
w_main += "<input id='btn_start_stop' type='button' value='Start' onclick='start_stop()'></input>";
w_main += "<select id='clicker_interval'>";
w_main += "<option value='1000'>1000ms</option>";
w_main += "<option value='800'>800ms</option>";
w_main += "<option value='500'>500ms</option>";
w_main += "<option selected value='300'>300ms</option>";
w_main += "<option value='200'>200ms</option>";
w_main += "<option value='100'>100ms</option>";
w_main += "</select>";
w_main += "</br>";
w_main += "<b>Clicked </b><b id='clicker_counter'>0</b><b> times</b>";
w_main += "</div>";

unsafeWindow.click_bet_button = function ()
{
	if (clicking) {
		if ($('#placebut').length) { $('#placebut').click() } else { $('#freezebutton').click() };
		count += 1;
		$('#clicker_counter').text(count);
	}
	else
	{
		window.clearInterval(timerMulti);
	}
}

unsafeWindow.start_stop = function ()
{
	if (clicking) {
		$('#btn_start_stop').val('Start');
		$('#dot_clicker').css('color','red');
		clicking = false;
		window.clearInterval(timerMulti);
	}
	else
	{
		if ($('#placebut').length) {
			if ($('.active').length) {
				if ($('.betpoll').find('.item').length > 0)
				{
					$('#btn_start_stop').val('Stop');
					$('#dot_clicker').css('color','rgb(0,255,0)');
					clicking = true;
					timerMulti = window.setInterval("click_bet_button()", $('#clicker_interval').val());
				}
				else alert('Pick items to bet, cyka!');
			}
			else alert('Select a team, cyka!');
		} 
		if ($('#freezebutton').length) {
			if (($('#freeze').find('.tofreeze').length > 0)||($('#freeze').find('.item').length > 0)) {
				$('#btn_start_stop').val('Stop');
				$('#dot_clicker').css('color','rgb(0,255,0)');
				clicking = true;
				timerMulti = window.setInterval("click_bet_button()", $('#clicker_interval').val());
			}
			else alert('Nothing to request, cyka');
		}
		else alert('Nothing to click here, cyka!');
	}
}

unsafeWindow.show_hide = function p_clicker_show_hide()
{
	if ($('#p_clicker').is(':visible')) { $('#p_clicker').hide() } else { $('#p_clicker').show() };
}

$('#submenu > nav').append('<a id="btn_clicker" onclick = "show_hide()">Clicker</a>');
$('#btn_clicker').css('color', 'rgb(100,100,230)');
$('#submenu > nav').append(w_main);