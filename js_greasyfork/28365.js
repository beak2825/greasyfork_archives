// ==UserScript==
// @name        WhatsAppPartecipationMeter
// @namespace   https://web.whatsapp.com/
// @description Shows a graph indicating how many messages are being sent to the current chat.
// @include     https://web.whatsapp.com/
// @version     5
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @require     https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28365/WhatsAppPartecipationMeter.user.js
// @updateURL https://update.greasyfork.org/scripts/28365/WhatsAppPartecipationMeter.meta.js
// ==/UserScript==

// fix overwrites of jQuery outside of sandbox
this.$ = this.jQuery = jQuery.noConflict(true);

var counter = 0,
    msgNumPrec = 0,
    msgNumAct = 0,
    timerRef = null,
    timerDelay = 3000,
	stepUp = 10,
    stepDown = 2;

var timerAlarm = null,
	  alarm = $('<div class="alarm-container"></div>'),
	  alarmDelay = 1000;

(function() {
    'use strict';

    function partecipate() {
        // when a chat is selected
        $('.infinite-list-viewport').on('click', '.infinite-list-item', function() {
            init();
        });
    }

    function init() {
        // draw equalizer
        var chatHeader = $('.pane-body.pane-chat-tile-container'),
            equalizer = $('<div class="equalizer"></div>'),
            level = $('<div class="equalizer-level"></div>');

        chatHeader.prepend(equalizer);
        equalizer.prepend(level);

        equalizer.css({
			'position': 'absolute',
            'background': '#000',
            'width': 20+'px',
			//'margin': '0px 30px 0px 20px',
			'height': '80%',
			'bottom': '5%',
			'z-index': 99999999
        });
        level.css({
			'height': '1%',
			'transform': 'rotate(180deg)',
			'position': 'absolute',
			'bottom': 7+'px',
			'left': 0+'px',
			'right': 0+'px',
			'width': 18+'px',
			'margin': '0px auto',
			'border-radius': '10px 0px',
			'max-height': '97%',
			'background': 'gradient',
			'background': '#b4ddb4',
			'background': '-moz-linear-gradient(top, #b4ddb4 0%, #52b152 0%, #83c783 17%, #faff00 54%, #ad0000 100%, #ff0000 100%)',
			'background': '-webkit-linear-gradient(top, #b4ddb4 0%,#52b152 0%,#83c783 17%,#faff00 54%,#ad0000 100%,#ff0000 100%)',
			'background': 'linear-gradient(to bottom, #b4ddb4 0%,#52b152 0%,#83c783 17%,#faff00 54%,#ad0000 100%,#ff0000 100%)',
			'filter': "progid:DXImageTransform.Microsoft.gradient( startColorstr='#b4ddb4', endColorstr='#ff0000',GradientType=0 )",
			'transition': '2s'
        });

		// draw alarm message
		var titleAvatar = $('header.pane-header.pane-chat-header > div.chat-avatar'),
			  title = $('<p>ALLARME</p>'),
			  subtitle = $('<p style="font-size:30px;">Interagite!</p><p style="font-size: 30px;">The show must go on!</p>');
		
		alarm.insertBefore(titleAvatar);
		alarm.prepend(title);
		alarm.append(subtitle);
		
		alarm.css({
			'position': 'absolute',
			'top': 70+'px',
			'margin': '0 auto',
			'text-align': 'center',
			'font-size': 50+'px',
			'color': '#ff0000',
			'width': '60%',
			'background-color': '#212121',
			'left': 0,
			'right': 0,
			'border-radius': 10+'px',
			'height': 120+'px',
			'line-height': 40+'px',
			'padding': 10+'px'
		});
		// start hidden
		alarm.toggle();
		
		// draw alarm toggler
		var chatContainer = $('.input-container'),
			button = $('<div class="alarm-button" style="pointer: ">!!</div>').on('click', function() {
				if (timerAlarm === null) {
					alarm.toggle();
					timerAlarm = setInterval(alarmBlink, alarmDelay);
				}
				else {
					clearInterval(timerAlarm);
					timerAlarm = null;
					
					// TODO: controllare 'alarm' sia nascosto
					if (alarm.is(':visible')) {
						alarm.toggle();
					}
				}
			});
		
		button.insertBefore(chatContainer);
		
		button.css({
				'width': 42+'px',
				'height': 42+'px',
				'text-align': 'center',
				'line-height': 42+'px',
				'font-size': 30+'px',
				'font-family': 'Roboto',
				'font-weight': 300,
				'cursor': 'pointer',
				'background-color': '#fff',
				'border-radius': '50%',
				'box-shadow': '0 1px 1px 0 rgba(0,0,0,0.06),0 2px 5px 0 rgba(0,0,0,0.2)'
			});
		
        // start the timer
        if (timerRef !== null) {
            console.log("clearing previous timer");
            clearInterval(timerRef);
        }

        console.log("starting new timer");

        timerRef = setInterval(timerTrigger, timerDelay);
    }
	
	function alarmBlink() {
		alarm.toggle();
	}

    function timerTrigger() {
        countNewMessages();

        if (msgNumAct > 0)
            counter = Math.min(100, counter + stepUp);
        else
            counter = Math.max(0, counter - stepDown);
		
        console.log("counter: " + counter);

        updateEqualizer();
    }

    function countNewMessages() {
        var messages = $('.message-list > .msg > .message-in').not('.old-msg');

        msgNumPrec = msgNumAct;
        msgNumAct = messages.length;
        messages.addClass("old-msg");

        if (msgNumAct > 0)
            console.log("new messages: " + msgNumAct);
    }

    function updateEqualizer() {
        $('.equalizer > .equalizer-level').css('height', counter+'%');
    }

    // wait for element to load
    waitForKeyElements('#side', partecipate);
})();