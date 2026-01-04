// ==UserScript==
// @name        WaniKani Upcoming Lessons
// @namespace   goldenchrysus.wanikani.upcominglessons
// @description Shows section of upcoming radicals, kanji, and vocabulary on lessons page
// @author      GoldenChrysus
// @website     https://github.com/GoldenChrysus
// @version     1.1.3
// @include     https://www.wanikani.com/lesson
// @copyright   2018+, Patrick Golden
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/372072/WaniKani%20Upcoming%20Lessons.user.js
// @updateURL https://update.greasyfork.org/scripts/372072/WaniKani%20Upcoming%20Lessons.meta.js
// ==/UserScript==

(function() {
	"use strict";

	// Establish important variables
	let wkof       = window.wkof;
	let modules    = "ItemData";
	let queue      = {
		radical    : [],
		kanji      : [],
		vocabulary : []
	};
	let $container = $(`<div id="upcoming-lessons"></div>`);

	// Check for WaniKani Open Framework
	if (!window.wkof) {
		if (confirm("Upcoming Lessons requires WaniKani Open Framework.\nDo you want to be forwarded to the installation instructions?")) {
			window.location.href = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
		}

		return;
	}

	// Start WaniKani Open Framework
	wkof.include(modules);
	wkof
		.ready(modules)
		.then(initialize);

	/**
	 * Insert the "Upcoming Lessons" section into the DOM
	 */
	function insertContainer() {
		$("#lessons-summary")
			.find("div.pure-g-r")
			.last()
			.before($container);
	}

	/**
	 * Create radicals section and add to container
	 */
	function createRadicals() {
		let radicals           = queue.radical;
		let count              = radicals.length;
		let $radical_container = $(
			`<div class="pure-g-r">
				<div id="radicals" class="pure-u-1">
					<h2><b>${count} <i class="icon-time" style="margin-left:0.25em; margin-right:0.2em;"></i></b> Radicals</h2>
				</div>
			</div>`
		);

		if (count) {
			$radical_container
				.find("#radicals")
				.append(
					`<div>
						<ul id="lesson-radicals">
						</ul>
					</div>`
				);
		}

		let $radical_list = $radical_container.find("#lesson-radicals");

		for (let item of radicals) {
			let character = item.characters;
			let english   = item.meanings[0].meaning;

			// Some radicals are custom-made by WaniKani or have no available text character, so they are rendered as images.
			if (!character && item.character_images) {
				let image = item.character_images[0].url;

				for (const tmp_image of item.character_images) {
					if (tmp_image.metadata.style_name === "32px") {
						image = tmp_image.url;

						break;
					}
				}

				character = `<img src="${image}" alt="${english}" style="width: 0.8em; filter: invert(100%);"/>`;
			}

			let $element = $(
				`<li class="radical" data-en="${english}">
					<a lang="ja" href="/radicals/${english}">${character}</a>
				</li>`
			);
			//0.3em 0.4em 0.212em 0.4em

			$radical_list.append($element);
		}

		$container.append($radical_container);
	}

	/**
	 * Create kanji section and add to container
	 */
	function createKanji() {
		let kanji            = queue.kanji;
		let count            = kanji.length;
		let $kanji_container = $(
			`<div class="pure-g-r">
				<div id="kanji" class="pure-u-1">
					<h2><b>${count} <i class="icon-time" style="margin-left:0.25em; margin-right:0.2em;"></i></b> Kanji</h2>
				</div>
			</div>`
		);

		if (count) {
			$kanji_container
				.find("#kanji")
				.append(
					`<div>
						<ul id="lesson-kanji">
						</ul>
					</div>`
				);
		}

		let $kanji_list = $kanji_container.find("#lesson-kanji");

		for (let item of kanji) {
			let character = item.characters;
			let english   = item.meanings[0].meaning;
			let readings  = [];

			for (let reading of item.readings) {
				if (reading.primary) {
					readings.push(reading.reading);
				}
			}

			readings = readings.join(", ");

			let $element = $(
				`<li class="kanji" data-en="${english}" data-ja="${readings}">
					<a lang="ja" href="/kanji/${character}">${character}</a>
				</li>`
			);

			$kanji_list.append($element);
		}

		$container.append($kanji_container);
	}

	/**
	 * Create vocabulary section and add to container
	 */
	function createVocabulary() {
		let vocabulary            = queue.vocabulary;
		let count                 = vocabulary.length;
		let $vocabulary_container = $(
			`<div class="pure-g-r">
				<div id="vocabulary" class="pure-u-1">
					<h2><b>${count} <i class="icon-time" style="margin-left:0.25em; margin-right:0.2em;"></i></b> Vocabulary</h2>
				</div>
			</div>`
		);

		if (count) {
			$vocabulary_container
				.find("#vocabulary")
				.append(
					`<div>
						<ul id="lesson-vocabulary">
						</ul>
					</div>`
				);
		}

		let $vocabulary_list = $vocabulary_container.find("#lesson-vocabulary");

		for (let item of vocabulary) {
			let character = item.characters;
			let english   = item.meanings[0].meaning;
			let readings  = [];

			for (let reading of item.readings) {
				if (reading.primary) {
					readings.push(reading.reading);
				}
			}

			readings = readings.join(", ");

			let $element = $(
				`<li class="vocabulary" data-en="${english}" data-ja="${readings}">
					<a lang="ja" href="/vocabulary/${character}">${character}</a>
				</li>`
			);

			$vocabulary_list.append($element);
		}

		$container.append($vocabulary_container);
	}

	/**
	 * Create header section and add to container
	 */
	function createHeader() {
		let $header = $(
			`<div class="pure-g-r">
				<header class="pure-u-1">
					<h1><i class="icon-time"></i> Upcoming Lessons</h1>
				</header>
			</div>`
		);

		$container.append($header);
	}

	/**
	 * Handle hovering and clicking on the lesson items.
	 * Copied from WaniKani source.
	 */
	function initializeEventHandlers() {
		$(document).on("click", "#upcoming-lessons a", function(t) {
			let agent = /iPhone|iPod|iPad|Android|BlackBerry/.test(navigator.userAgent);

			if (agent) {
				return t.preventDefault();
			}
		});

		$(document).on("mouseenter", "#upcoming-lessons ul li", function() {
			var e, t, n, i, r, a, o, s;
			
			return r = $(this).height() + 4, a = $(window).width() - $(this).offset().left, i = $(window).height() - $(this).offset().top, n = $("<div></div>", {
				"class": "hover"
			}).appendTo(this), $("<ul></ul>").appendTo($(this).children("div")), $("<li></li>", {
				text: $(this).data("en")
			}).appendTo($(this).find("ul")), $("<li></li>", {
				text: $(this).data("ja")
			}).appendTo($(this).find("ul")), $("<li></li>", {
				text: $(this).data("mc")
			}).appendTo($(this).find("ul")), $("<li></li>", {
				text: $(this).data("rc")
			}).appendTo($(this).find("ul")), o = a > 200 ? (e = "left-side", "auto") : (e = "right-side", "0"), s = i < 100 ? (t = "down-arrow", -1 * (n.height() + r / 2)) : (t = "up-arrow", r), n.css({
				top: s,
				right: o
			}).addClass(t + " " + e);
		});

		$(document).on("mouseleave", "#upcoming-lessons ul li", function() {
			$(this)
				.children("div")
				.remove();
		});
	}

	/**
	 * Load assignment and item data, then process it.
	 */
	function initialize() {
		wkof.ItemData.get_items("assignments").then(processData);
	}

	/**
	 * Filter item data for assigned lessons, then create DOM elements.
	 */
	function processData(data) {
		for (var item of data) {
			// If the item has no assignments, then it isn't assigned.
			if (!item.assignments) {
				continue;
			}

			// If an assignment isn't started or isn't unlocked, it's not an assigned lesson.
			if (item.assignments.started_at || !item.assignments.unlocked_at) {
				continue;
			}

			item.data.sort_date = item.assignments.unlocked_at || item.assignments.started_at;

			queue[item.object].push(item.data);
		}

		for (let type in queue) {
			queue[type].sort((a, b) => {
				if (a.level !== b.level) {
					return (a.level < b.level) ? -1 : 1;
				}

				return (a.lesson_position < b.lesson_position) ? -1 : 1;
			})
		}

		createHeader();
		createRadicals();
		createKanji();
		createVocabulary();
		insertContainer();
		initializeEventHandlers();
	}
}());