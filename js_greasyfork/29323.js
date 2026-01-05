// ==UserScript==
// @name        Bitbucket Collapse In Comment
// @version     0.1.1
// @description A userscript that adds a header that can toggle long code and quote blocks in comments
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @include     https://bitbucket.org/*
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @icon        https://bitbucket.org/mottie/bitbucket-userscripts/raw/HEAD/images/bitbucket.svg
// @downloadURL https://update.greasyfork.org/scripts/29323/Bitbucket%20Collapse%20In%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/29323/Bitbucket%20Collapse%20In%20Comment.meta.js
// ==/UserScript==
(() => {
	"use strict";
	// hide code/quotes longer than this number of lines
	let minLines = GM_getValue("bbic-max-lines", 10),
		startCollapsed = GM_getValue("bbic-start-collapsed", true);

	// syntax highlight class name lookup table
	const syntaxClass = {
		basic: "HTML",
		cs: "C#",
		fsharp: "F#",
		gfm: "Markdown",
		jq: "JSONiq",
		shell: "Bash (shell)",
		tcl: "Glyph",
		tex: "LaTex"
	};

	GM_addStyle(`
		.bbic-block.aui-button {
			border:#eee 1px solid;
			padding:2px 8px 2px 10px;
			border-radius:5px 5px 0 0;
			position:relative;
			top:1px;
			cursor:pointer;
			font-weight:bold;
			display:block;
			width:100%;
			margin:5px 0 0 0;
		}
		.bbic-block + .codehilite {
			border-top:none;
			margin-top:0;
		}
		.bbic-block:after {
			content:"\u25bc ";
			float:right;
		}
		.bbic-block-closed.aui-button {
			border-radius:5px;
			margin-bottom:10px;
		}
		.bbic-block-closed:after {
			transform: rotate(90deg);
		}
		.bbic-block-closed + .codehilite, .bbic-block-closed + pre {
			display:none;
		}
	`);

	function makeToggle(name, lines) {
		/* full list of class names from (look at "tm_scope" value)
		https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
		here are some example syntax highlighted class names:
			language-text-html-markdown-source-gfm-apib
			language-text-html-basic
			language-source-fortran-modern
			language-text-tex
		*/
		let n = (name || "").replace(
			/(language[-\s]|(source-)|(text-)|(html-)|(markdown-)|(-modern))/g, ""
		);
		n = (syntaxClass[n] || n).toUpperCase().trim();
		return `${n || "Block"} (${lines} lines)`;
	}

	function addToggles(event) {
		// issue comments
		if ($("#issue-main-content")) {
			let indx = 0;
			const block = document.createElement("a"),
				els = $$(
					event && event.type === "ajaxComplete" ?
						// only target preview containers on ajaxComplete event
						".preview-container pre" :
						".wiki-content pre"
				),
				len = els.length;

			if (len) {
				// "aui-button-primary" = blue button styling
				block.className = `bbic-block aui-button aui-button-primary${
					startCollapsed ? " bbic-block-closed" : ""
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
						if (el && !el.classList.contains("bbic-has-toggle")) {
							numberOfLines = el.innerHTML.split("\n").length;
							if (numberOfLines > minLines) {
								syntaxClass = "";
								wrap = closest(".codehilite", el);
								if (wrap && wrap.classList.contains("codehilite")) {
									syntaxClass = (wrap.className || "").replace("codehilite", "");
								} else {
									// no syntax highlighter defined (not wrapped)
									wrap = el;
								}
								node = block.cloneNode();
								node.innerHTML = makeToggle(syntaxClass, numberOfLines);
								wrap.parentNode.insertBefore(node, wrap);
								el.classList.add("bbic-has-toggle");
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
	}

	function addBindings() {
		document.addEventListener("click", event => {
			let els, indx, flag;
			const el = event.target;
			if (el && el.classList.contains("bbic-block")) {
				event.preventDefault();
				// shift + click = toggle all blocks in a single comment
				// shift + ctrl + click = toggle all blocks on page
				if (event.shiftKey) {
					els = $$(
						".bbic-block",
						event.ctrlKey ? "" : closest(".wiki-content", el)
					);
					indx = els.length;
					flag = el.classList.contains("bbic-block-closed");
					while (indx--) {
						els[indx].classList.toggle("bbic-block-closed", !flag);
					}
				} else {
					el.classList.toggle("bbic-block-closed");
				}
				removeSelection();
			}
		});
	}

	function update() {
		let toggles = $$(".bbic-block"),
			indx = toggles.length;
		while (indx--) {
			toggles[indx].parentNode.removeChild(toggles[indx]);
		}
		toggles = $$(".bbic-has-toggle");
		indx = toggles.length;
		while (indx--) {
			toggles[indx].classList.remove("bbic-has-toggle");
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

	GM_registerMenuCommand("Set Bitbucket Collapse In Comment Max Lines", () => {
		let val = prompt("Minimum number of lines before adding a toggle:",
			minLines);
		val = parseInt(val, 10);
		if (val) {
			minLines = val;
			GM_setValue("bbic-max-lines", val);
			update();
		}
	});

	GM_registerMenuCommand("Set Bitbucket Collapse In Comment Initial State", () => {
		let val = prompt(
			"Start with blocks (c)ollapsed or (e)xpanded (first letter necessary):",
			startCollapsed ? "collapsed" : "expanded"
		);
		if (val) {
			val = /^c/.test(val || "");
			startCollapsed = val;
			GM_setValue("bbic-start-collapsed", val);
			update();
		}
	});

	document.addEventListener("pjax:end", addToggles);
	// listen for ajax on preview (jQuery ajaxComplete)
	jQuery(document).on("ajaxComplete", addToggles);

	addBindings();
	addToggles();

})();
