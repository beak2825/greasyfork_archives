// ==UserScript==
// @name        Accurate GaijinPot Housing Service Costs
// @namespace   goldenchrysus.realestatecojp.accurategaijinpotcosts
// @description GaijinPot Housing Service fees on realestate.co.jp are adjusted to reflect the credit card fees at https://resources.realestate.co.jp/guide/gpm-service-fees/ instead of the debit card/wire fees.
// @author      GoldenChrysus
// @website     https://github.com/GoldenChrysus
// @version     1.0.1
// @include     https://realestate.co.jp/en/rent/view/*
// @include     https://realestate.co.jp/rent/view/*
// @copyright   2019+, Patrick Golden
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382042/Accurate%20GaijinPot%20Housing%20Service%20Costs.user.js
// @updateURL https://update.greasyfork.org/scripts/382042/Accurate%20GaijinPot%20Housing%20Service%20Costs.meta.js
// ==/UserScript==

(function() {
	"use strict";

	let cost_section = document
		.getElementsByClassName("property-details")[0]
		.getElementsByClassName("detail-item");

	if (!cost_section || !cost_section.length) {
		return;
	}

	const multiplier = 0.88888888888888888888888888888889;
	const targets    = {
		monthly : {
			gaijin_pot : "Housing Service Sub-leasing Fee",
			total      : "Total Monthly Cost"
		},
		move_in : {
			gaijin_pot : "Housing Service Registration Fee",
			monthly    : "Total Monthly Cost*",
			total      : "Total Move-In Fees"
		}
	};

	let data            = {
		monthly_difference : 0,
		new_monthly_cost   : 0,
		move_in_difference : 0
	};
	let monthly_section = cost_section[1];
	let monthly_titles  = monthly_section.getElementsByTagName("dt");
	let move_in_section = cost_section[2];
	let move_in_titles  = move_in_section.getElementsByTagName("dt");

	for (let i = 0; i < monthly_titles.length; i++) {
		let element = monthly_titles[i];
		let title   = element.innerText.trim();

		let cost_element, cost, new_cost;

		if (Object.values(targets.monthly).includes(title)) {
			cost_element = monthly_section.getElementsByTagName("dd")[i];
			cost         = +cost_element.innerText.replace(/[^\d-]/gi, "");
		} else {
			continue;
		}

		if (title === targets.monthly.gaijin_pot) {
			new_cost = Math.round(cost * multiplier);

			data.monthly_difference = new_cost - cost;
		}

		if (title === targets.monthly.total) {
			new_cost = cost + data.monthly_difference;

			data.new_monthly_cost = new_cost;
		}

		let formatted_cost = "¥" + new_cost.toLocaleString();

		cost_element.innerText = formatted_cost;

		if (title === targets.monthly.total) {
			document.getElementsByClassName("property-headline")[0].getElementsByClassName("price")[0].innerText = formatted_cost;
		}
	}

	for (let i = 0; i < move_in_titles.length; i++) {
		let element = move_in_titles[i];
		let title   = element.innerText.trim();

		let cost_element, cost, new_cost;

		if (Object.values(targets.move_in).includes(title)) {
			cost_element = move_in_section.getElementsByTagName("dd")[i];
			cost         = +cost_element.innerText.replace(/[^\d-]/gi, "");
		} else {
			continue;
		}

		if (title === targets.move_in.gaijin_pot) {
			new_cost = Math.round(cost / 2);

			data.move_in_difference += new_cost - cost;
		}

		if (title === targets.move_in.monthly) {
			new_cost = cost + data.monthly_difference;

			data.move_in_difference += new_cost - cost;
		}

		if (title === targets.move_in.total) {
			new_cost = cost + data.move_in_difference;
		}

		cost_element.innerText = "¥" + new_cost.toLocaleString();
	}
}());