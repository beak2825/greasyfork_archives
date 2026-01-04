// ==UserScript==
// @name         TweetDeck modal history
// @namespace    https://yal.cc
// @version      0.1
// @description  Adds tools for going back between user modals.
// @author       YellowAfterlife
// @match        https://tweetdeck.twitter.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37611/TweetDeck%20modal%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/37611/TweetDeck%20modal%20history.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let ident = "cc_yal_tweetdeck_modal_history";
	let style = document.createElement("style");
	style.innerHTML = `
	.${ident} {
		position: absolute;
		top: 5px;
		left: -205px;
		width: 200px;
		color: white;
		text-align: right;
		padding-bottom: 4px;
		pointer-events: none;
	}
	.${ident} div {

	}
	.${ident} a {
		pointer-events: all;
		color: white;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
	}
	`;
	style.id = ident;
	document.body.appendChild(style);
	let div = null;
	let user = null;
	setInterval(function() {
		let mdl = document.querySelector(`.js-modal-context`);
		if (mdl) {
			if (!div) {
				div = document.createElement("div");
				div.className = `${ident}`;
				div.innerText = "";
			}
			if (!div.scrollHeight) mdl.querySelector(`.mdl`).appendChild(div);
			//
			let next = mdl.querySelector(`.prf-header .link-clean`);
			if (next) next = next.href;
			//
			if (next && user != next) {
				let link = div.querySelector(`div[data-user="${next}"]`);
				if (link) {
					while (div.children[0] != link && div.children.length) {
						div.removeChild(div.children[0]);
					}
					div.removeChild(link);
				} else if (user) {
					let hdl = user.substring(user.lastIndexOf("/")+1);
					link = document.createElement("a");
					link.href = user;
					link.rel = "user";
					link.setAttribute("data-user-name", hdl);
					link.className = "link-complex";
					link.target = "_blank";
					//
					let span = document.createElement("span");
					span.appendChild(document.createTextNode("@"));
					link.appendChild(span);
					span = document.createElement("span");
					span.className = "link-complex-target";
					span.appendChild(document.createTextNode(hdl));
					link.appendChild(span);
					//
					let ctr = document.createElement("div");
					ctr.setAttribute("data-user", user);
					ctr.appendChild(link);
					//
					div.insertBefore(ctr, div.children[0]);
				}
				user = next;
			}
		} else {
			mdl = document.querySelector(`#open-modal`);
			if (mdl && mdl.style.display != "none" && mdl.children.length) {
				if (div && !div.scrollHeight) {
					let ctr = mdl.querySelector(`.mdl`);
					if (ctr) ctr.appendChild(div);
				}
			} else {
				div = null;
				user = null;
			}
		}
	}, 150);
})();