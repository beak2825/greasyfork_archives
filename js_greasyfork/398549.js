// ==UserScript==
// @name         Melvor Discord Nickname Generator
// @version      1.1
// @description  Generates a Discord nickname with a common format to display completion log stats
// @author       Asthereon
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/398549/Melvor%20Discord%20Nickname%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/398549/Melvor%20Discord%20Nickname%20Generator.meta.js
// ==/UserScript==

function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

function notify(nickname) {
	One.helpers('notify', {
		type: 'dark',
		from: 'bottom',
		align: 'center',
		message: 'Copied ' + nickname + ' to the clipboard.'
	});
}

function getDiscordNickname(event) {
	totalFront = event.data.totalFront;
	totalEnd = event.data.totalEnd;
	containerFront = event.data.containerFront;
	containerEnd = event.data.containerEnd;
	spacingDelimiter = event.data.spacingDelimiter;
    let elements = Array.from(document.querySelectorAll('#completion-total, #completion-skills, #completion-mastery, #completion-items, #completion-monsters, #account-name'));
	let items = elements.map(function(x){return x.textContent.replace("%", "");});
	let nickname = items[5] + totalFront + items[0] + totalEnd + containerFront + items[1] + spacingDelimiter + items[2] + spacingDelimiter + items[3] + spacingDelimiter + items[4] + containerEnd;
	copyStringToClipboard(nickname);
	notify(nickname);
}

var setupButton = function() {
  if ($("#nickname-button").length) return;
  var containerRef = $(".content-side ul.nav-main li.nav-main-heading:last");
  var li = $('<li class="nav-main-item"></li>');
  containerRef.before(li);
  var button = $([
      '<a id="nickname-button" class="nav-main-link" href="javascript:void(0);">',
      '<img class="nav-img" src="assets/media/main/profile_header.svg">',
      '<span class="nav-main-link-name">Nickname</span>',
      '<small id="nickname-status"></small>',
      '</a>'
  ].join(""));
  li.append(button);
  button.on("click", {
	totalFront: "[",
	totalEnd: "]",
	containerFront: "{",
	containerEnd: "}",
	spacingDelimiter: " | "
	}, getDiscordNickname);
}

setTimeout(function() {
	setupButton();
},100);