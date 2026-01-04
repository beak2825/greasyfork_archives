// ==UserScript==
// @icon         data:image/png;base64,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
// @name         Twitch Auto Messager
// @namespace    https://github.com/doubtingreality/twitch-auto-messager
// @version      0.7
// @description  Adds a new panel on Twitch.tv to easily automate sending of messages.
// @author       Murtada al Mousawy
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441985/Twitch%20Auto%20Messager.user.js
// @updateURL https://update.greasyfork.org/scripts/441985/Twitch%20Auto%20Messager.meta.js
// ==/UserScript==

(function() {
	function init() {
		var automessager_style = document.createElement("style");
		automessager_style.appendChild(document.createTextNode(".auto-automessager-holder.minimized { min-height: 4rem !important; height: 4rem !important; max-height: 4rem !important; width: 4.8rem; } .auto-automessager-holder.minimized * { display: none; } .auto-automessager-holder.minimized .automessager-min-button { display: block !important; }"));
		document.body.appendChild(automessager_style);

		var automessager_holder = document.createElement("div");
		automessager_holder.classList.add('auto-automessager-holder');
		automessager_holder.classList.add('minimized');
		automessager_holder.setAttribute("style", "position: fixed;bottom: 0; left: 1rem; overflow: hidden; min-height: 21rem;z-index: 999;background: #282828;padding: 1rem 1.5rem 1.5rem 1.5rem;");
		automessager_holder.innerHTML = "<div class='automessager-close-button' style='float: right; margin-left: 1rem; cursor: pointer; width: 2rem; border: 1px solid #444; text-align: center;'>&#10060;</div><div class='automessager-min-button' style='float: right; cursor: pointer; width: 2rem; border: 1px solid #444; text-align: center;'>&#95;</div><br><textarea class='automessager-input' style='margin: 0.5rem 0 1.5rem 0; background-color: rgb(20,20,20);color: #D3D3D3;border: solid 1px #333;' placeholder='Enter your message'></textarea><br><input value='5' onkeypress='return event.charCode >= 48 && event.charCode <= 57' type='text' style='padding: 0.5rem; width: 120px;background-color: rgb(20,20,20);color: #D3D3D3;border: solid 1px #333;' placeholder='Interval (seconds)' class='automessager-interval-input'><button class='button primary float-right stop-automessager-button' disabled>Stop</button><button class='button primary float-right start-automessager-button' style='margin-right: 1rem;'>Start</button>";
		document.body.appendChild(automessager_holder);

		var evenodd = 0;
		    chat_message = "",
		    automessager_interval = null,
		    $automessager_chat_input         = $('.chat_text_input'),
		    $automessager_chat_button        = $('button.qa-chat-buttons__submit'),
		    $automessager_holder             = $('.auto-automessager-holder'),
		    $automessager_automessager_input = $('.automessager-input'),
		    $automessager_start_button       = $('.start-automessager-button'),
		    $automessager_stop_button        = $('.stop-automessager-button'),
		    $automessager_interval_input     = $('.automessager-interval-input'),
		    $automessager_min_button         = $('.automessager-min-button'),
		    $automessager_close_button       = $('.automessager-close-button');

		if ($("#bttv-channel-state-contain .slow-time").length > 0) {
			console.log("test");
			$automessager_interval_input.val($("#bttv-channel-state-contain .slow-time")[0].textContent);
		}

		$automessager_min_button.click(function() { $automessager_holder.toggleClass('minimized') });
		$automessager_close_button.click(function() { stop_automessager(); $automessager_holder.remove(); });

		$automessager_start_button.click(function() { start_automessager(); });
		$automessager_stop_button.click(function() { stop_automessager(); });

		function start_automessager() {
			if ($('.chat-container').length > 0) {
				chat_message = $automessager_automessager_input.val();
				$automessager_start_button.attr("disabled", "disabled");
				$automessager_automessager_input.attr("disabled", "disabled");
				$automessager_interval_input.attr("disabled", "disabled");
				$automessager_stop_button.removeAttr("disabled");

				automessager_interval = setInterval(function() {
					if (evenodd === 0) {
						evenodd = -1;
						$automessager_chat_input.val(chat_message);
					} else {
						evenodd = 0;
						$automessager_chat_input.val(chat_message+" .");
					}
					$automessager_chat_button.click();

				}, $automessager_interval_input.val()*1000);
			}
		}

		function stop_automessager() {
			$automessager_start_button.removeAttr("disabled");
			$automessager_automessager_input.removeAttr("disabled", "disabled");
			$automessager_interval_input.removeAttr("disabled", "disabled");
			$automessager_stop_button.attr("disabled", "disabled");
			clearInterval(automessager_interval);
		}
	}

	var init_interval = setInterval(function() {
		if ($(".chat-room").length > 0 && $(".auto-automessager-holder").length < 1) {
			init();
			clearInterval(init_interval);
		}
	}, 500);
})();