// ==UserScript==
// @name           Ultra Speed Spectator
// @version        1.04
// @namespace      localhost
// @author         EnterBrain
// @description    Plugin for best experience Shadow Government.
// @icon           http://firepic.org/images/2015-08/31/ktizhlzyzxz4.png
// @icon64         http://firepic.org/images/2015-08/31/8gwmu0w58oy5.png
// @match          http://*.e-sim.org/battle.html?id=*
// @grant          all
// @require        http://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12147/Ultra%20Speed%20Spectator.user.js
// @updateURL https://update.greasyfork.org/scripts/12147/Ultra%20Speed%20Spectator.meta.js
// ==/UserScript==

var timerSpectator = 1750;		// Кд отправки запросов данных 1 секунда = 1000 миллисекунд.

function sendUpdateRequestSpectator() {
	if (!hasFocus)
		return;
	
	var FakeUserID = 1;			// Айди фейкового пользователя.
	var FakeCitizenshipID = 1;	// Айди гражданства фейкового пользователя.

	var dataString = 'id=' + $("#battleRoundId").val() + "&at="+FakeUserID+"&ci="+FakeCitizenshipID+"&premium=1";
	
	$.ajax({  
		type: "GET",
		url: "battleScore.html",
		data: dataString,
		dataType: "json",
		success: function(msg) {
			updateStatus(msg.attackerScore, msg.defenderScore, msg.remainingTimeInSeconds, msg.percentAttackers);
            updateBattleHeros(msg.topAttackers, msg.topDefenders);
            updateTop10(msg.top10Attackers, msg.top10Defenders);
            updateBattleMonitor(msg);
            //updatePlace(msg.yourPlace);
            //updateTotalDamage(msg.totalPlayerDamage);
            for (var i = 0; i < msg.recentAttackers.length; i++) {
                if (msg.recentAttackers[i].id == latestAttackerId) {
                    msg.recentAttackers = msg.recentAttackers.slice(0, i);
                    break;
                }
            }
            for (var i = 0; i < msg.recentDefenders.length; i++) {
                if (msg.recentDefenders[i].id == latestDefenderId) {
                    msg.recentDefenders = msg.recentDefenders.slice(0, i);
                    break;
                }
            }
            if (msg.recentAttackers.length != 0) {
                latestAttackerId = msg.recentAttackers[0].id;
                attackerHits = msg.recentAttackers;
            }
            if (msg.recentDefenders.length != 0) {
                latestDefenderId = msg.recentDefenders[0].id;
                defenderHits = msg.recentDefenders;
            }
		}
	});
}

if($("#totalattackers").length==0 ) {
	
	$("#battleStats").append('<div class="foundation-style small-10 columns"><div class="foundation-style small-5 columns"><b>Total defenders online:</b><i id="totaldefenders" style="display: inline;">0</i> <a style="font-size: 11px; display: none;" href="" id="defendersLink">Show details</a> <a style="font-size: 11px;" href="" id="defendersLinkHide">Hide details</a> <br><div align="center" id="defendersMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div></div><div class="foundation-style small-5 columns"><b>Total attackers online:</b><i id="totalattackers" style="display: inline;">0</i> <a style="font-size: 11px; display: none;" href="" id="attackersLink">Show details</a> <a style="font-size: 11px; display: inline;" href="" id="attackersLinkHide">Hide details</a> <br><div align="center" id="attackersMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div></div>');
	$("#battleStats").append('<div class="foundation-style  small-10 columns"><b>Total spectators online:</b><i id="totalspectators" style="display: inline;">0</i> <a style="font-size: 11px; display: none;" href="" id="spectatorsLink">Show details</a> <a style="font-size: 11px;" href="" id="spectatorsLinkHide">Hide details</a> <br><div align="center" id="spectatorsMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div>  </div>');
	
	$('#spectatorsLink').click(function () {
		$('#spectatorsLink').fadeOut('fast', function () {
			$('#spectatorsLinkHide').fadeIn('fast');
			$('#spectatorsMenu').fadeIn('fast');
		});
		return false;
	});
	$('#spectatorsLinkHide').click(function () {
		$('#spectatorsLinkHide').fadeOut('fast', function () {
			$('#spectatorsLink').fadeIn('fast');
			$('#spectatorsMenu').fadeOut('fast');
		});
		return false;
	});

	$('#attackersLink').click(function () {
		$('#attackersLink').fadeOut('fast', function () {
			$('#attackersLinkHide').fadeIn('fast');
			$('#attackersMenu').fadeIn('fast');
		});
		return false;
	});
	$('#attackersLinkHide').click(function () {
		$('#attackersLinkHide').fadeOut('fast', function () {
			$('#attackersLink').fadeIn('fast');
			$('#attackersMenu').fadeOut('fast');
		});
		return false;
	});

	$('#defendersLink').click(function () {
		$('#defendersLink').fadeOut('fast', function () {
			$('#defendersLinkHide').fadeIn('fast');
			$('#defendersMenu').fadeIn('fast');
		});
		return false;
	});
	$('#defendersLinkHide').click(function () {
		$('#defendersLinkHide').fadeOut('fast', function () {
			$('#defendersLink').fadeIn('fast');
			$('#defendersMenu').fadeOut('fast');
		});
		return false;
	});
}
var script = document.createElement( "script" );
script.type = "text/javascript";
script.textContent = sendUpdateRequestSpectator.toString() + ' \n var intervalID = window.setInterval(sendUpdateRequestSpectator, '+timerSpectator+'); \n continueThread = false;';
document.body.appendChild( script );