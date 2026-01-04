// ==UserScript==
// @name         TPT: Auto
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Automate repetitive actions
// @author       Amraki
// @match        http://www.tpt-revised.com/*
// @match        https://www.tpt-revised.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32487/TPT%3A%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/32487/TPT%3A%20Auto.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	$("#content").prepend(
		'<div><button id="btnToggle" value="enabled">Stop Script</button></div>'
	);
	
	$("#btnToggle").click(function() {
		if (this.textContent == "Stop Script") {
			this.textContent = "Start Script";
			this.value = "";
		} else {
			this.textContent = "Stop Script";
			this.value = "enabled";
		}
	});
	

	setInterval(function() {
		
		// Highlight user messages
		/*
		$("#chat span:nth-child(3)")[0].innerText
		$("#chat > div > span").each(function(index, val) {
			var toMatch = $("[href*='javascript:profile']")[0].innerText;
			if (val.innerText.indexOf(toMatch) > -1) {
				console.log(toMatch + " found in : " + val.innerText);
				$("#chatwindow > div > span:eq(" + index + ")").css("background-color", "yellow");
			}
		});
		*/
		
		// Obey toggle setting
		if ($("#btnToggle")[0].getAttribute("value") != "enabled") {
			//console.log("User has disabled script");
			return;
		}
		
		// Complete quests
		if ($("#results")[0].innerText.indexOf("QUEST COMPLETED") > -1) {
			if ($("a.popup_link").length > 0) {
				$("a.popup_link")[0].click();
			}
			$("a.popup_link").each(function(index) {
				if ($("a.popup_link")[index].innerText == "Turn in Battle Quest") {
					$("a.popup_link")[index].click();
					return false;
				}
				if ($("a.popup_link")[index].innerText == "Turn in Scavenging Quest") {
					$("a.popup_link")[index].click();
					return false;
				}
			});
		}
		
		// Start new quests
		$("a.popup_link").each(function(index) {
			if ($("a.popup_link")[index].innerText == "Begin Battle Quest") {
				$("a.popup_link")[index].click();
				return false;
			}
			if ($("a.popup_link")[index].innerText == "Begin Scavenging Quest") {
				$("a.popup_link")[index].click();
				return false;
			}
		});
		
		// Auto Attack
		/*
		if ($("input[value='Auto!']").length > 0) {
			$("input[value='Auto!']").click();
		}
		*/
		
	}, 10 * 1000);
    
})();