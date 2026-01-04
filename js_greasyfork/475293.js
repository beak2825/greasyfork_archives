// ==UserScript==
// @name         Discord Free Nitro Emojis
// @version      1.0
// @description  Use Discord's custom emojis anywhere in the web-app, for free.
// @author       LiliumSerenus
// @license      GNU GPLv3
// @match        *://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @namespace https://greasyfork.org/users/1159227
// @downloadURL https://update.greasyfork.org/scripts/475293/Discord%20Free%20Nitro%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/475293/Discord%20Free%20Nitro%20Emojis.meta.js
// ==/UserScript==

var emojis = [];
var show_emojis = false
const stylesheet = document.createElement("style");
stylesheet.textContent = `
#emoji-holder {resize: both; display: block; position: absolute; z-index: 99999999; background-color: #00000094; overflow-y: scroll; max-height: 70%; max-width: 70%; transition: opacity 1s, visibility 1s;}
#emoji-menu-toggle {background: transparent !important; color: currentColor; border: none; font-size: 0.8em; transition: font-size 1s;}
#emoji-menu-toggle:hover {font-size: 0.9em;}
.emoji-holder-item {height: 48px; width: 48px; padding: 3px; border-radius: 3px; border: solid 2px transparent; transition: border 0.7s ease-in-out, background-color 0.7s ease-in-out;}
.emoji-holder-item:hover {background-color: #00000069;; cursor: pointer; border: 2px solid white;}
`;
document.head.appendChild(stylesheet);

function update_emojis() {
	var emoji_holder = document.getElementById("emoji-holder");
	emojis.forEach(function(emoji) {
		if (!document.querySelector(`#emoji-holder img[src="${emoji}"]`)) {
			var new_emoji = document.createElement("img");
			new_emoji.className = "emoji-holder-item";
			new_emoji.src = emoji
			new_emoji.onclick = function() {
				navigator.clipboard.writeText(emoji);
			};
			emoji_holder.appendChild(new_emoji);
		};
	});
};

function toggle_emojis() {
	var emoji_holder = document.getElementById("emoji-holder");
	var emojis_toggle = document.getElementById("emoji-menu-toggle");
	if (show_emojis) {
		emoji_holder.style.opacity = "0";
		emoji_holder.style.visibility = "hidden";
		show_emojis = false;
		emojis_toggle.textContent = "Show";
		return;
	}
	else {
		emoji_holder.style.opacity = "1";
		emoji_holder.style.visibility = "visible";
		update_emojis();
		show_emojis = true;
		emojis_toggle.textContent = "Hide";
		return;
	};
};

function create_toggle() {
	var emoji_toggle = document.createElement("button");
	emoji_toggle.textContent = "Show";
	emoji_toggle.onclick = toggle_emojis;
	emoji_toggle.id = "emoji-menu-toggle";
	document.querySelector("[class^=toolbar]").appendChild(emoji_toggle);
};

function create_emojis() {
	var emojiHolder = document.createElement("div");
	emojiHolder.id = "emoji-holder";
	document.body.appendChild(emojiHolder);
};

document.body.addEventListener("click", function(event) {
	if (event.target !== document.getElementById("emoji-holder") && event.target !== document.getElementById("emoji-menu-toggle")) {
		if (show_emojis) {
			toggle_emojis();
		};
	};
});

const Observer = new MutationObserver(function(mutations, observer) {
	if (mutations.length > 0) {
		if (typeof mutations[0].target === "object") {
			if (mutations[0].target.hasAttribute("class")) {
				if (mutations[0].target.className.startsWith("image-")) {
				var element = mutations[0].target;
				emojis.push(element.src);
				};
			};
		}
	};
	if (!document.querySelector("[class^=toolbar] #emoji-menu-toggle")) {
		create_toggle();
	};
});

Observer.observe(document.body, {childList: true, subtree: true, attributes: true});

create_emojis();