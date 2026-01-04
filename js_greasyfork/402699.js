// ==UserScript==
// @name        Ryan Guill's Roam Experiments - roamresearch.com
// @namespace   https://ryanguill.com
// @match       https://roamresearch.com/#/app
// @grant       none
// @version     0.7
// @author      Ryan Guill
// @description Several Roam experiments, including custom highlight colors, color blocks and blockquotes. Enable or disable features at the top of the script
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/402699/Ryan%20Guill%27s%20Roam%20Experiments%20-%20roamresearchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/402699/Ryan%20Guill%27s%20Roam%20Experiments%20-%20roamresearchcom.meta.js
// ==/UserScript==

/*
 * ChangeLog
 * 0.2 added cloze functionality, setting an appropriate text color for background colors
 * 0.3 made cloze blocks and others not apply when inside of code blocks, other bug fixes. Known issue with editing cloze blocks that are in references or currently in the sidebar - causes a roam crash, but a refresh will fix things.
 * 0.4 fixed issue with cloze block answers being references
 * 0.5 fixed another issue with cloze blocks answers being references not including non-reference text
 * 0.6 allow labels for cloze blocks, syntax: (cloze:label|text)
 * 0.7 first try at {{toc}} table of contents replacement. You must hit space after the expansion right now, not sure why. Will give you a table of contents for whatever level you put it on.
 */

const debug_enabled = true;
const custom_highlight_enabled = true;
const blockquotes_enabled = true;
const color_blocks_enabled = true;
const cloze_enabled = true;
const toc_enabled = true;

const valid_colors = {
	red: { backgroundColor: "#f99a9a", color: "#000" },
	blue: { backgroundColor: "#9592f2", color: "#000" },
	yellow: { backgroundColor: "#f2ec92", color: "#000" },
	orange: { backgroundColor: "#ffb657", color: "#000" },
	teal: { backgroundColor: "#a2fdf4", color: "#000" },
	green: { backgroundColor: "#5ad95a", color: "#000" },
	purple: { backgroundColor: "#e1a2fd", color: "#000" },
	white: { backgroundColor: "#ffffff", color: "#000" },
	gray: { backgroundColor: "#868686", color: "#FFF" },
	grey: { backgroundColor: "#868686", color: "#FFF" },
	black: { backgroundColor: "#484848", color: "#FFF" },
	maroon: { backgroundColor: "#c86c79", color: "#FFF" },
	brown: { backgroundColor: "#bb895c", color: "#FFF" },
	darkblue: { backgroundColor: "#776df2", color: "#FFF" },
};

/* ==== utility functions === */
function isInCodeBlock({ blockHTML, targetIndex }) {
	if (isNaN(targetIndex) || targetIndex < 0) {
		throw "targetIndex must be >= 0, not " + targetIndex;
	}
	const openCodeMatches = [...blockHTML.matchAll(/\<code\>/g)];
	if (openCodeMatches.length) {
		const closeCodeMatches = [...blockHTML.matchAll(/\<\/code\>/g)];
		if (closeCodeMatches.length) {
			const pairs = openCodeMatches.map(function (openCodeMatch, index) {
				return { open: openCodeMatch, close: closeCodeMatches[index] };
			});
			for (const pair of pairs) {
				if (pair.open.index < targetIndex && targetIndex < pair.close.index) {
					return true;
				}
			}
		}
	}
	return false;
}

function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function setup_styles() {
	const style = document.createElement("style");
	document.head.appendChild(style);
	style.id = "roam-custom-js-styles";

	style.sheet.insertRule(
		"span[data-highlight] {padding: 0 2px; border-radius: 4px;}"
	);
	style.sheet.insertRule(`
    .custom-blockquote {
      background: #f9f9f9;
      border-left: 7px solid #ccc;
      margin: 0.5em 0;
      padding: 0.5em 5px;
    }
  `);

	style.sheet.insertRule(`span.cloze-button { position: relative; }`);
	style.sheet.insertRule(`
    span.cloze-button::before {
      content: attr(data-text); /* print em-space with class text */
      display: inline-block;
      position: absolute; bottom: 50%;
      background: #f2ec92; color: #333; padding: 5px; border-radius: 5px;
      opacity:0; transition:0.3s; overflow:hidden;
      max-width: 300px; /* avoids very long sentences */
      pointer-events: none; /* prevents tooltip from firing on pseudo hover */
      white-space: nowrap;
      z-index: 999;
    }
  `);
	style.sheet.insertRule(
		`span.cloze-button:hover::before { opacity:1; bottom: 100%; }`
	);
}

function blockquotes() {
	const blocks = document.querySelectorAll("div.roam-block");
	for (const block of blocks) {
		const span = block.querySelector("span");
		if (span !== null && span.innerText.trim().startsWith("> ")) {
			block.classList.add("custom-blockquote");
		} else {
			block.classList.remove("custom-blockquote");
		}
	}
	return true;
}

function custom_highlight() {
	const blocks = document.querySelectorAll("div.roam-block span");
	for (const block of blocks) {
		let blockHTMLChanged = false;
		let newBlockHTML = block.innerHTML;
		const matches = [...block.innerHTML.matchAll(/\^(.+?)\^(.+?)\^\1\^/g)];
		for (const matchItem of matches) {
			const { 0: match, 1: color, 2: text, index } = matchItem;

			if (isInCodeBlock({ blockHTML: block.innerHTML, targetIndex: index })) {
				newBlockHTML = newBlockHTML.replace(match, match.replace("^", "&#94"));
				blockHTMLChanged = true;
				continue;
			}
			if (valid_colors.hasOwnProperty(color.toLowerCase())) {
				newBlockHTML = newBlockHTML.replace(
					/\^(.+?)\^(.+?)\^\1\^/,
					`<span
              data-highlight="${color.toLowerCase()}"
              style="background-color:${
								valid_colors[color.toLowerCase()]["backgroundColor"]
							};color:${valid_colors[color.toLowerCase()]["color"]}">$2</span>`
				);
				blockHTMLChanged = true;
			} else {
				break;
			}
		}
		if (blockHTMLChanged) {
			block.innerHTML = newBlockHTML;
		}
	}
}

function color_blocks() {
	//remove existing block color- classes
	const blocks = document.querySelectorAll("div[data-color]");

	for (const block of blocks) {
		block.dataset.color = null;
		block.style.backgroundColor = null;
	}

	const tags = [...document.querySelectorAll("span[data-tag]")].filter(
		(element) =>
			element.dataset.tag !== undefined &&
			element.dataset.tag.startsWith("color:")
	);

	for (const tag of tags) {
		const color = tag.dataset.tag.replace("color:", "").toLowerCase();
		const block = tag.closest("div.roam-block-container");
		const tagIndex = block.innerHTML.indexOf(tag.innerText);

		if (
			valid_colors.hasOwnProperty(color) &&
			!isInCodeBlock({ blockHTML: block.innerHTML, targetIndex: tagIndex })
		) {
			//on the tag itself set a color
			tag.dataset.color = color;
			tag.style.display = "none";

			const div = tag.closest("div.roam-block-container");

			div.dataset.color = color;
			div.style.backgroundColor = valid_colors[color]["backgroundColor"];
			div.style.color = valid_colors[color]["color"];
			div.style.borderRadius = "4px";
		}
	}
	return true;
}

function cloze() {
	const blocks = document.querySelectorAll("div.roam-block span");

	for (const block of blocks) {
		let blockHTMLChanged = false;
		let newBlockHTML = block.innerHTML;
		const matches = [...block.innerHTML.matchAll(/\(cloze\:(.+?)\)/g)];

		if (matches.length) {
			for (matchItem of matches) {
				const { 0: match, 1: contents, index } = matchItem;

				if (isInCodeBlock({ blockHTML: block.innerHTML, targetIndex: index })) {
					newBlockHTML = newBlockHTML.replace(
						match,
						`&#40;cloze:${contents}&#41;`
					);
					blockHTMLChanged = true;
					continue;
				}

				let label = "";
				let text = "";

				if (contents.includes("|")) {
					[label, text] = contents.split("|");
				} else {
					text = contents;
				}

				label =
					(htmlToElement(`<span>${label}</span>`) || {}).textContent || label;
				text =
					(htmlToElement(`<span>${text}</span>`) || {}).textContent || text;

				newBlockHTML = newBlockHTML.replace(
					match,
					`<span class="cloze-button" data-label="${label}" data-text="${text}">[...${label}..]</span>`
				);
				blockHTMLChanged = true;
			}
			if (blockHTMLChanged) {
				block.innerHTML = newBlockHTML;
			}
		}
	}
}

function toc(e) {
	if (e.target.value.trim() === "{{toc}}") {
		const baseBlocks = e.target
			.closest("div.flex-v-box")
			.parentElement.querySelectorAll(":scope > div.roam-block-container");

		const blocks = [...baseBlocks]
			.map((block) => block.querySelector("div.roam-block"))
			.filter((block) => block !== null)
			.map((block) => {
				return {
					text: block.innerText,
					id: block
						.getAttribute("id")
						.replace(/^block-input-(.+?)-body-outline-(.+?)-(.+?)$/, "$3"),
				};
			})
			.filter((block) => block.text.trim().length > 0);
		console.log({ blocks });
		e.target.value = `**Table of Contents**\n${blocks
			.map((block) => `((${block.id}))`)
			.join("\n")}`;
		e.target.style.height =
			_toc_calculate_height_of_textbox(e.target.value.split("\n").length) +
			"px";
		_toc_fire_onChange(e.target);
	}
}

function _toc_calculate_height_of_textbox(number_of_rows) {
	//first row is 29px, every row after is 21
	return 29 + (number_of_rows - 1) * 21;
}

function _toc_fire_onChange(element) {
	if ("createEvent" in document) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);
		element.dispatchEvent(evt);
	} else {
		element.fireEvent("onchange");
	}
}

function call_with_timer(f, label, debug_enabled, args = []) {
	if (!Array.isArray(args)) {
		args = [args];
	}
	if (debug_enabled) {
		console.time(label);
	}
	f(...args);
	if (debug_enabled) {
		console.timeEnd(label);
	}
}

function run_scripts() {
	setTimeout(function () {
		call_with_timer(
			function () {
				if (color_blocks_enabled) {
					call_with_timer(color_blocks, "color_blocks", debug_enabled);
				}
				if (blockquotes_enabled) {
					call_with_timer(blockquotes, "blockquotes", debug_enabled);
				}
				if (custom_highlight_enabled) {
					call_with_timer(custom_highlight, "custom_highlight", debug_enabled);
				}
				if (cloze_enabled) {
					call_with_timer(cloze, "cloze", debug_enabled);
				}
			},
			"Total: run_scripts",
			debug_enabled
		);
	}, 100);
}

// Wait for Roam to load before initializing
const observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		const newNodes = mutation.addedNodes; // DOM NodeList
		if (newNodes !== null) {
			// If there are new nodes added
			for (let node of newNodes) {
				if (node.classList.contains("roam-body")) {
					// body has loaded
					console.log("Observer finished.");
					observer.disconnect();
					init();
				}
			}
		}
	});
});

const config = {
	attributes: true,
	childList: true,
	characterData: true,
};

const target = document.getElementById("app");
if (target) {
	observer.observe(target, config);
	console.log("Observer running...");
}

function init() {
	setup_styles();

	//for the first 60 seconds, run the scripts every 3 seconds to load initially
	for (let time = 0; time <= 60000; time += 3000) {
		setTimeout(function () {
			if (debug_enabled) {
				console.log("timeout", time);
			}
			run_scripts();
		}, time);
	}

	//after that, run the scripts every 15 seconds indefinately
	setInterval(function () {
		if (debug_enabled) {
			console.log("interval");
		}
		run_scripts();
	}, 15000);

	/*
    document.addEventListener("blur", function () {
      //console.log("blur");
      runScripts()
    }, true);
    */
	/*
    document.addEventListener("change", function () {
      //console.log("change");
      runScripts()
    }, true);
    */
	document.addEventListener(
		"focus",
		function () {
			if (debug_enabled) {
				console.log("focus");
			}
			run_scripts();
		},
		true
	);

	//disable cmd-s
	document.addEventListener(
		"keydown",
		function (e) {
			if (
				e.keyCode == 83 &&
				(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
			) {
				e.preventDefault();
			}
		},
		false
	);

	document.addEventListener(
		"keyup",
		function (e) {
			if (e.target.matches("textarea.rm-block-input")) {
				if (toc_enabled) {
					call_with_timer(toc, "toc", debug_enabled, e);
				}
			}
		},
		false
	);
}
