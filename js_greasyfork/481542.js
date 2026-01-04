// ==UserScript==
// @name        Brainly Filter by Points
// @namespace	tacheometry
// @match        *://*brainly.pl/*
// @match        *://*znanija.com/*
// @match        *://*brainly.lat/*
// @match        *://*brainly.com.br/*
// @match        *://*nosdevoirs.fr/*
// @match        *://*eodev.com/*
// @match        *://*brainly.ro/*
// @match        *://*brainly.co.id/*
// @match        *://*brainly.in/*
// @match        *://*brainly.ph/*
// @match        *://*brainly.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @license     MIT
// @version     1.0
// @author      tacheometry
// @description Hides questions that award below a certain number of points.
// @downloadURL https://update.greasyfork.org/scripts/481542/Brainly%20Filter%20by%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/481542/Brainly%20Filter%20by%20Points.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const KEY_NAME = "MinimumQuestionAward";
	const scanQuestions = async () => {
		const minPoints = await GM.getValue(KEY_NAME, 10);

		for (const pointsCounter of document.querySelectorAll(
			"[data-testid='points_counter']"
		)) {
			const number = parseInt(pointsCounter.innerText);
			if (number >= minPoints) continue;

			const parent =
				pointsCounter.closest("[data-testid='feed-item']") ??
				pointsCounter.closest(
					"[data-testid='answering_feed_question_list_item']"
				);
			if (!parent) continue;

			parent.remove();
		}
	};

	const observer = new MutationObserver(scanQuestions);
	scanQuestions();
	observer.observe(document, {
		childList: true,
		subtree: true,
		attributes: false,
	});

	GM.registerMenuCommand(
		"Change minimum award filter",
		() => {
			const result = prompt(
				"Set minimum points awarded for a question to be shown:"
			);
			if (result) GM.setValue(KEY_NAME, parseInt(result));
		},
		{
			id: "minAwardChangeButton",
		}
	);
})();
