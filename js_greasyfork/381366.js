// ==UserScript==
// @name         MooMoo.io Made by ItzF1ker1
// @namespace    Invisible map.
// @version      1.9
// @description  I'm trying to make dis. xd
// @author       Blade.#2630 Discord, ItzF1ker1#1106
// @match        *://*.moomoo.io/*
// @grant        None.
// @icon          http://u.cubeupload.com/FikriXGamer/Crown.png
// @downloadURL https://update.greasyfork.org/scripts/381366/MooMooio%20Made%20by%20ItzF1ker1.user.js
// @updateURL https://update.greasyfork.org/scripts/381366/MooMooio%20Made%20by%20ItzF1ker1.meta.js
// ==/UserScript==

(function() {
	'use strict';

document.getElementById("gameName").innerHTML = "MewMew.io";

$('#leaderboard').append('Invisible Map');

document.getElementById("diedText").innerHTML = "YOU NOOB"

$('#diedText').css({'background-color': 'rgba(0, 0, 0, 0.74)'});

document.getElementById('enterGame').innerHTML = 'Start';

document.getElementById('loadingText').innerHTML = 'Connecting...';

document.getElementById("scoreDisplay").style.color = "#FFDD00";

document.getElementById("woodDisplay").style.color = "#00C705";

document.getElementById("stoneDisplay").style.color = "#919191";

document.getElementById("killCounter").style.color = "#AC2727";

document.getElementById("foodDisplay").style.color = "#FF0000";

document.getElementById("allianceButton").style.color = "#00F4FF";

document.getElementById("chatButton").style.color = "#FFFFFF";

document.getElementById("storeButton").style.color = "#FF7300";

document.getElementById("ageText").style.color = "#050000";

document.title="Mew Mew"

document.getElementById('nameInput').placeholder = "Put your name here";

$("#mapDisplay").css("background", "url('https://ssl.gstatic.com/s2/oz/images/stars/po/bubblev1/spacer.gif')");

$('#ageBar').css({'-webkit-border-radius': '0px',
                  '-moz-border-radius': '0px',
                  'border-radius': '0px',
                  'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#ageBarBody').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '0px',
                      'background-color': '#3DFF00'});

$('#leaderboard').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)',
                       'text-align': 'center'});

$('.storeTab').css({'-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#storeHolder').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#allianceHolder').css({'-webkit-border-radius': '0px',
                          '-moz-border-radius': '0px',
                          'border-radius': '0px',
                          'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.actionBarItem').css({'-webkit-border-radius': '0px',
                         'border-radius': '0px',
                         'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#chatBox').css({'-webkit-border-radius': '0px',
                   '-moz-border-radius': '0px',
                   'border-radius': '0px',
                   'background-color': 'rgba(0, 0, 0, 0.4)',
                   'text-align': 'center'});

$('.uiElement, .resourceDisplay').css({'-webkit-border-radius': '0px',
                                       '-moz-border-radius': '0px',
                                       'border-radius': '0px',
                                       'background-color': 'rgba(0, 0, 0, 0.4)'});

////////////////////////////////////////////////////////////////////////////////////////////

$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'margin': '15px',
                    'margin-top': '15px'});

$('#menuContainer').css({'white-space': 'normal'});

$('#nativeResolution').css({'cursor': 'pointer'});

$('#guideCard').css({'margin-top': 'auto',
                     'margin-bottom': '30px'});

$('#serverSelect').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('#partyButton').css({'right': '70%',
                       'left': '10%',
                       'text-align': 'center',
                       'bottom': '48px',
                       'font-size': '24px',
                       'top': 'unset'});

$('#joinPartyButton').css({'right': '10%',
                           'left': '70%',
                           'text-align': 'center',
                           'bottom': '48px',
                           'font-size': '24px',
                           'top': 'unset'});

$('#linksContainer2').css({'right': '44%',
                           'left': '44%',
                           'text-align': 'center',
                           'bottom': '12px'});

$('#gameName').css({'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});

$('#loadingText').css({'padding': '8px',
                       'right': '150%',
                       'left': '150%',
                       'margin-top': '40px'});

$('.ytLink').css({'color': '#144db4',
                  'padding': '8px',});

$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});

$('#serverSelect').css({'cursor': 'pointer',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});
})();

	'use strict';
	var conf = {
		'map': {
			'w': '130',
			'h': '130',
			'top': '15',
			'left': '15'
		},
	};

	// Change Layout
	$('#mapDisplay').css({
		'top': conf.map.top + 'px',	// default 20px
		'left': conf.map.left + 'px',		// default 20px
		'width': conf.map.w + 'px',			// default 130px
		'height': conf.map.h + 'px'			// default 130px
	});
	$('#scoreDisplay').css({
		'bottom': '20px',					// default 20px
		'left': '20px'						// default 170px
	});