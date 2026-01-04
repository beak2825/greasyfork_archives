// ==UserScript==
// @name         Food Club FCNC link
// @namespace    neopets
// @version      0.3
// @description  Finds a foodclub.neocities.org string on a petpage and links you to it.
// @author       EatWoolooAsMutton
// @match        http://www.neopets.com/~*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/418686/Food%20Club%20FCNC%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/418686/Food%20Club%20FCNC%20link.meta.js
// ==/UserScript==

(async () => {

	// WIP
	let date = await (function () {
		return new Promise(resolve => {
			$.ajax({
				type : "GET",
				async : true,
				url : "/calendar.phtml",
				success : function (data) {
					let dates = data.match(/(\d+)[snt][tdh] day of (.+), Y(\d+)/);
					let [, day, month, year] = dates;
					["Sleeping", "Awakening", "Running", "Eating",
					 "Hunting", "Relaxing", "Swimming", "Hiding",
					 "Gathering", "Collecting", "Storing", "Celebrating"
					].forEach(function (value, index) {
						if (month === value) {
							month = index;
						}
					});
					let time = data.match(/id="nst">(.+) NST/)[1];
					resolve({
						"day" : parseInt(day),
						"month" : month + 1,
						"year" : parseInt(year),
						"time" : time
					});
				}
			});
		})
	})();

	const html = $("body").html();
	const fcnc = html.match(/#round=\d+&amp;b=[a-z]+/ig);

	$('<div style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt;position: fixed;padding: 5px; opacity: 80%; width: 220px; text-align: left; right: 5px; top: 50px; background-color: #000000; color: #FFFFFF;" id="floating"></div>').appendTo("body");

	let floatingText = `<div style="color: #ffff00; text-align:right;"><span style="cursor: pointer;" id="floating-close">Close [X]</span></div><br>`;

	if (fcnc) {
		let strings = [];
		for (let i = 0; i < fcnc.length; i++) {
			const thisString = fcnc[i];
			const roundNum = thisString.split("round=")[1].split("&amp;")[0];
			strings.push([thisString, roundNum]);
		}
		floatingText += `${strings.length} FCNC string${strings.length > 1 ? "s" : ""} found!<br><br>`;
		for (let i = 0; i < strings.length; i++) {
			const fcstring = strings[i][0].replace(/amp;/, "");
			const fcround = strings[i][1];
			floatingText += `<a href='https://foodclub.neocities.org/${fcstring}' target="_blank"><i id="string${i}" string="${fcstring.split("b=")[1]}" style="color:#00ffff; text-decoration: underline;">Round ${fcround}</i></a><br>`;

			$("body").on("contextmenu", `#string${i}`, function () {
				const thisString = this.getAttribute("string");
				$("body").animate({
					scrollTop : $(`:contains(${thisString}):last`).offset().top
				}, 300);
			})
		}
		floatingText += `<br><i style="font-size: 7pt;">Right-click on the link to show the selected string on the current page.</i>`
	} else {
		floatingText += `No FCNC string found<br><br><a href='https://foodclub.neocities.org/' target="_blank"><i style="color:#00ffff;">Link to FCNC bet page</i></a>`;
	}

	const $floating = $("#floating");
	$floating.html(floatingText);
	$("#floating-close").on("click", () => $floating.hide(500));

})();