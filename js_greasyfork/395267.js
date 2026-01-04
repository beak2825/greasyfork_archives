// ==UserScript==
// @name         Chess courtesy
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  On lichess.org, says "Good game, well played" to the opponent, when you lose or draw a game. Also say Good luck, have fun, when a game starts
// @author       lichess.org/@/qymspace(Originally by lichess.org/@/thibault
// @include      /^https://lichess\.org\/(\w{8}|\w{12})$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395267/Chess%20courtesy.user.js
// @updateURL https://update.greasyfork.org/scripts/395267/Chess%20courtesy.meta.js
// ==/UserScript==

(function() {
	"use strict";

	window.lichess.pubsub.on("socket.in.endData", d => {
		const input = document.querySelector(".mchat__say");
		const loser = d.winner == "white" ? "black" : "white";
		if (
			input &&
			(!d.winner ||
				document.querySelector(".cg-wrap.manipulable.orientation-" + loser))
		)
			setTimeout(() => {
				const played =
					document.querySelector(".mchat__presets") &&
					document.querySelectorAll(".moves index").length > 5;
				if (played) {
					input.value = "Good game, well played";
					input.dispatchEvent(
						new KeyboardEvent("keypress", { keyCode: 13, which: 13 })
					);
				}
			}, 1000);
	});

	window.lichess.pubsub.on("socket.in.move", d => {
		//console.log("move", 'data', d)
		//On the first move, Say Good Luck, have fun
		const input = document.querySelector(".mchat__say");
		const name = document.querySelector(".ruser.ruser-bottom>a").innerText;
		if (
			!document.querySelectorAll(
				`ol.mchat__messages > li > a[href="/@/${name}"]`
			).length > 0 &&
			!document.querySelector(".game__tournament")
		) {
			//console.log("Action Active!")
			input.value = "Good Luck, Have fun";
			input.dispatchEvent(
				new KeyboardEvent("keypress", { keyCode: 13, which: 13 })
			);
		}
	});
	window.lichess.pubsub.on("socket.in.*", d => {
		console.log("Everything");
	});
})();
