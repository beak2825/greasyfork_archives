// ==UserScript==
// @name        GitLab Collapse In Comment
// @version     0.1.0
// @description A userscript that adds a header that can toggle long code and quote blocks in comments
// @license     MIT
// @author      Rob Garrison
// @namespace   https://gitlab.com/Mottie
// @include     https://gitlab.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @icon        https://gitlab.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png
// @downloadURL https://update.greasyfork.org/scripts/30007/GitLab%20Collapse%20In%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/30007/GitLab%20Collapse%20In%20Comment.meta.js
// ==/UserScript==
(() => {
	"use strict";
	// hide code/quotes longer than this number of lines
	let minLines = GM_getValue("glic-max-lines", 10),
		startCollapsed = GM_getValue("glic-start-collapsed", true);

	GM_addStyle(`
		.glic-block {
			border:#eee 1px solid;
			padding:2px 8px 2px 10px;
			border-radius:5px 5px 0 0;
			position:relative;
			top:1px;
			cursor:pointer;
			font-weight:bold;
			display:block;
			text-transform:capitalize;
		}
		.glic-block + .highlight {
			border-top:none;
		}
		.glic-block + .glic-has-toggle {
			margin-top:0 !important;
		}
		.glic-block:after {
			content:"\u25bc ";
			float:right;
		}
		.glic-block-closed {
			border-radius:5px;
			margin-bottom:10px;
		}
		.glic-block-closed:after {
			transform: rotate(90deg);
		}
		.glic-block-closed + .glic-has-toggle,
		.glic-block-closed + pre {
			display:none;
		}
	`);

	function addToggles() {
		// issue comments
		if ($(".issue-details")) {
			let indx = 0;
			const block = document.createElement("a"),
				els = $$(`
					.wiki pre, .note-body pre, .md-preview pre,
					.wiki blockquote, .note-body blockquote, .md-preview blockquote
				`),
				len = els.length;
			block.className = `glic-block border${
				startCollapsed ? " glic-block-closed" : ""
			}`;
			block.href = "#";

			// loop with delay to allow user interaction
			const loop = () => {
				let el, wrap, node, syntaxClass, numberOfLines,
					// max number of DOM insertions per loop
					max = 0;
				while (max < 20 && indx < len) {
					if (indx >= len) {
						return;
					}
					el = els[indx];
					if (el && !el.classList.contains("glic-has-toggle")) {
						numberOfLines = el.innerHTML.split("\n").length;
						if (numberOfLines > minLines) {
							syntaxClass = "";
							wrap = closest(".highlight", el);
							if (wrap && wrap.classList.contains("highlight")) {
								syntaxClass = wrap.getAttribute("lang");
							} else {
								// no syntax highlighter defined (not wrapped)
								wrap = el;
							}
							node = block.cloneNode();
							node.innerHTML = `${syntaxClass || "Block"}
								(${numberOfLines} lines)`;
							wrap.parentNode.insertBefore(node, wrap);
							el.classList.add("glic-has-toggle");
							if (startCollapsed) {
								el.display = "none";
							}
							max++;
						}
					}
					indx++;
				}
				if (indx < len) {
					setTimeout(() => {
						loop();
					}, 200);
				}
			};
			loop();
		}
	}

	function addBindings() {
		document.addEventListener("click", event => {
			let els, indx, flag;
			const el = event.target;
			if (el && el.classList.contains("glic-block")) {
				event.preventDefault();
				// shift + click = toggle all blocks in a single comment
				// shift + ctrl + click = toggle all blocks on page
				if (event.shiftKey) {
					els = $$(
						".glic-block",
						event.ctrlKey ? "" : closest(".wiki, .note-body", el)
					);
					indx = els.length;
					flag = el.classList.contains("glic-block-closed");
					while (indx--) {
						els[indx].classList.toggle("glic-block-closed", !flag);
					}
				} else {
					el.classList.toggle("glic-block-closed");
				}
				removeSelection();
			}
		});
	}

	function update() {
		let toggles = $$(".glic-block"),
			indx = toggles.length;
		while (indx--) {
			toggles[indx].parentNode.removeChild(toggles[indx]);
		}
		toggles = $$(".glic-has-toggle");
		indx = toggles.length;
		while (indx--) {
			toggles[indx].classList.remove("glic-has-toggle");
		}
		addToggles();
	}

	function $(selector, el) {
		return (el || document).querySelector(selector);
	}

	function $$(selector, el) {
		return Array.from((el || document).querySelectorAll(selector));
	}

	function closest(selector, el) {
		while (el && el.nodeType === 1) {
			if (el.matches(selector)) {
				return el;
			}
			el = el.parentNode;
		}
		return null;
	}

	function removeSelection() {
		// remove text selection - https://stackoverflow.com/a/3171348/145346
		const sel = window.getSelection ?
			window.getSelection() :
			document.selection;
		if (sel) {
			if (sel.removeAllRanges) {
				sel.removeAllRanges();
			} else if (sel.empty) {
				sel.empty();
			}
		}
	}

	GM_registerMenuCommand("Set GitLab Collapse In Comment Max Lines", () => {
		let val = prompt("Minimum number of lines before adding a toggle:",
			minLines);
		val = parseInt(val, 10);
		if (val) {
			minLines = val;
			GM_setValue("glic-max-lines", val);
			update();
		}
	});

	GM_registerMenuCommand("Set GitLab Collapse In Comment Initial State", () => {
		let val = prompt(
			"Start with blocks (c)ollapsed or (e)xpanded (first letter necessary):",
			startCollapsed ? "collapsed" : "expanded"
		);
		if (val) {
			val = /^c/.test(val || "");
			startCollapsed = val;
			GM_setValue("glic-start-collapsed", val);
			update();
		}
	});

	addBindings();
	addToggles();
	// adding a timeout to check the code blocks again... because code blocks in
	// the original issue appear to be rendered, then replaced while the comment
	// code blocks are not
	setTimeout(() => {
		addToggles();
	}, 500);

	// bind to GitLab event using jQuery; "markdown-preview:show" callback
	// is executed by trigger-handler, so no event is actually triggered
	jQuery(document).on("markdown-preview:show", () => {
		// preview is shown, but not yet rendered...
		setTimeout(() => {
			addToggles();
		}, 300);
	});

})();
