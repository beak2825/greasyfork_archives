// ==UserScript==
// @name         🌐 delete cookies 🍪
// @name:fr      🌐 suppression de l'avertissement des cookies 🍪
// @namespace    https://greasyfork.org/en/users/876222-zzz-the-hacker
// @version      2.3
// @description  Page load and... what ? No cookie ? Net is now marvelous !
// @description:fr  Confirme l'acceptation des cookies pour le faire disparaître définitivement.
// @author       zzz le hacker
// @match        *://*/*
// @grant        none
// @icon         https://www.hebergeur-image.fr/uploads/20231210/7a28ab28a8e9a4bea32b6918aa65a39ef5dea1fb.png
// @downloadURL https://update.greasyfork.org/scripts/440350/%F0%9F%8C%90%20delete%20cookies%20%F0%9F%8D%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/440350/%F0%9F%8C%90%20delete%20cookies%20%F0%9F%8D%AA.meta.js
// ==/UserScript==

(function () {
	"use strict";
	let notif = (message, time, icon) => {
		let div = document.createElement("div");
		div.style = "background-color: white; color: black; font-family: monospace; display: flex; justify-content: center; align-items: center; position: absolute; max-width: 400px; left: -420px; top: 20px; border: 1px solid black; border-radius: 10px; z-index: 100000; transition: left 1s cubic-bezier(0.6, 0.59, 0, 0.99) 0s; padding: 20px;";
		div.innerHTML = message;
		document.body.appendChild(div);
		let img = document.createElement("img");
		img.src = icon;
		img.style = "width: 60px; margin-left: 10px; border: 1px black solid; border-radius: 10px;";
		div.appendChild(img);
		setTimeout(() => {
			div.style.left = "20px";
			setTimeout(() => {
				div.style.left = "-500px";
				setTimeout(() => {
					div.remove();
				}, 1500);
			}, time);
		}, 100);
	};
	let searchHTML = (element, callback) => {
		callback(element);
		[...element.childNodes].forEach(child => {
			if (child.innerHTML !== undefined && child.outerHTML !== undefined) searchHTML(child, callback);
		});
	};
	let onlyText = (element) => {
		var nodes = element.childNodes;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].nodeType !== 3) {
				return false;
			}
		}
		return true;
	}
	let refuse = () => {
		let h = [...document.getElementsByClassName("QS5gu sy4vM")];
		let condition = (h.length !== 0);
		if (condition) {
			h[0].click();
			notif("cookie refused !", 3000, "https://www.hebergeur-image.fr/uploads/20231210/7a28ab28a8e9a4bea32b6918aa65a39ef5dea1fb.png");
		} else {
			let rejectList = ["Refuser", "Refuser tous les cookies", "Refuser les cookies", "Rejeter", "Refuse", "Reject all cookies", "Reject cookies", "Decline", "Continuer sans accepter", "Continue without accepting", "Tout refuser", "Decline all"];
			let acceptList = ["Accepter", "Accepter tous les cookies", "Autoriser", "Valider", "Accept", "Accept all cookies", "Allow", "Confirm"];
			let RbuttonsList = [];
			let AbuttonsList = [];
			searchHTML(document.body, (child) => {
				rejectList.forEach(e => {
					if (child.innerHTML.includes(e)) if (onlyText(child)) if (!RbuttonsList.includes(child)) RbuttonsList.push(child);
				});
				acceptList.forEach(e => {
					if (child.innerHTML.includes(e)) if (onlyText(child)) if (!AbuttonsList.includes(child)) AbuttonsList.push(child);
				});
			});
			console.log([RbuttonsList, AbuttonsList]);
			if (RbuttonsList.length !== 0) {
				RbuttonsList.forEach(element => {
					element.click();
					notif("cookie refused !", 3000, "https://www.hebergeur-image.fr/uploads/20231210/7a28ab28a8e9a4bea32b6918aa65a39ef5dea1fb.png");
				});
			} else {
				if (AbuttonsList.length !== 0) notif("An error appeared when searching for the refuse cookies button: you can refer to the author of the script via greasyfork and tell him on which site you encountered this problem.", 8000, "https://www.hebergeur-image.fr/uploads/20231210/dab7ba5c2cb28fa94bf21c19b963050aff336b91.png");
				else notif("No cookies found on this page.", 3000, "https://www.hebergeur-image.fr/uploads/20231210/c4c756d82cb08cf29b91df0d4d863e51984bb925.png");
			};
		};
	};
	window.addEventListener('load', refuse, false);
})();