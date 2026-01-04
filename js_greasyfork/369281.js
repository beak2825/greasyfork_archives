// ==UserScript==
// @name        GitLab Code Show Whitespace
// @version     1.1.10-a
// @description A userscript that shows whitespace (space, tabs and carriage returns) in code blocks based on https://github.com/Mottie/GitHub-userscripts/wiki/GitHub-code-show-whitespace (without mutations)
// @license     MIT
// @author      Nikolai Merinov
// @namespace   https://github.com/mnd
// @include     https://gitlab.*
// @run-at      document-idle
// @grant       GM.addStyle
// @grant       GM_addStyle
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?updated=20180103
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/369281/GitLab%20Code%20Show%20Whitespace.user.js
// @updateURL https://update.greasyfork.org/scripts/369281/GitLab%20Code%20Show%20Whitespace.meta.js
// ==/UserScript==
(() => {
    "use strict";

    // include em-space & en-space?
    const whitespace = {
	// Applies \xb7 (·) to every space
	"%20"  : "<span class='pl-space ghcw-whitespace'> </span>",
	// Applies \xb7 (·) to every non-breaking space (alternative: \u2423 (␣))
	"%A0"  : "<span class='pl-nbsp ghcw-whitespace'>&nbsp;</span>",
	// Applies \xbb (») to every tab
	"%09"  : "<span class='pl-tab ghcw-whitespace'>\x09</span>",
	// non-matching key; applied manually
	// Applies \u231d (⌝) to the end of every line
	// (alternatives: \u21b5 (↵) or \u2938 (⤸))
	"CRLF" : "<span class='pl-crlf ghcw-whitespace'></span>"
    },
	  span = document.createElement("span"),
	  // ignore +/- in diff code blocks
	  regexWS = /(\x20|&nbsp;|\x09)/g,
	  regexCR = /\r*\n$/,
	  regexExceptions = /(\.md)$/i,

	  toggleButton = document.createElement("div");
    toggleButton.className = "ghcw-toggle btn has-tooltip btn-file-option";
    toggleButton.setAttribute("aria-label", "Toggle Whitespace");
    toggleButton.innerHTML = "<span class='pl-tab'></span>";

    GM.addStyle(`
		.ghcw-active .ghcw-whitespace,
		.gist-content-wrapper .file-actions .btn-group {
			position: relative;
			display: inline;
		}
		.ghcw-active .ghcw-whitespace:before {
			position: absolute;
			opacity: .5;
			user-select: none;
			font-weight: bold;
			color: #777 !important;
			top: -.25em;
			left: 0;
		}
		.ghcw-toggle .pl-tab {
			pointer-events: none;
		}
		.ghcw-active .pl-space:before {
			content: "\\b7";
		}
		.ghcw-active .pl-nbsp:before {
			content: "\\b7";
		}
		.ghcw-active .pl-tab:before,
		.ghcw-toggle .pl-tab:before {
			content: "\\bb";
			top: .1em;
		}
		.ghcw-active .pl-crlf:before {
			content: "\\231d";
		}
		/* weird tweak for diff markdown files - see #27 */
		.ghcw-adjust .ghcw-active .ghcw-whitespace:before {
			left: .6em;
		}
		/* hide extra leading space added to diffs - see #27 */
		.text-file td.line .pl-space:first-child {
			opacity: 0;
		}
	`);

    
    function $(selector, el) {
	return (el || document).querySelector(selector);
    }

    function $$(selector, el) {
	return [...(el || document).querySelectorAll(selector)];
    }

    function addToggle() {
	$$(".file-actions").forEach(el => {
	    if (!$(".ghcw-toggle", el)) {
		el.insertBefore(toggleButton.cloneNode(true), el.childNodes[0]);
	    }
	});
    }

    function getNodes(line) {
	const nodeIterator = document.createNodeIterator(
	    line,
	    NodeFilter.SHOW_TEXT,
	    () => NodeFilter.FILTER_ACCEPT
	);
	let currentNode,
	    nodes = [];
	while ((currentNode = nodeIterator.nextNode())) {
	    nodes.push(currentNode);
	}
	return nodes;
    }

    function escapeHTML(html) {
	return html.replace(/[<>"'&]/g, m => ({
	    "<": "&lt;",
	    ">": "&gt;",
	    "&": "&amp;",
	    "'": "&#39;",
	    "\"": "&quot;"
	}[m]));
    }

    function replaceWhitespace(html) {
	return escapeHTML(html).replace(regexWS, s => {
	    let idx = 0,
		ln = s.length,
		result = "";
	    for (idx = 0; idx < ln; idx++) {
		result += whitespace[encodeURI(s[idx])] || s[idx] || "";
	    }
	    return result;
	});
    }

    function replaceTextNode(nodes) {
	let node, indx, el,
	    ln = nodes.length;
	for (indx = 0; indx < ln; indx++) {
	    node = nodes[indx];
	    if (
		node &&
		    node.nodeType === 3 &&
		    node.textContent &&
		    node.textContent.search(regexWS) > -1
	    ) {
		el = span.cloneNode();
		el.innerHTML = replaceWhitespace(node.textContent.replace(regexCR, ""));
		node.parentNode.insertBefore(el, node);
		node.parentNode.removeChild(node);
	    }
	}
    }

    function addWhitespace(block) {
	let lines, indx, len;
	if (block && !block.classList.contains("ghcw-processed")) {
	    block.classList.add("ghcw-processed");
	    indx = 0;

	    // class name of each code row
	    lines = $$(".line", block);
	    len = lines.length;

	    // loop with delay to allow user interaction
	    const loop = () => {
		let line, nodes,
		    // max number of DOM insertions per loop
		    max = 0;
		while (max < 50 && indx < len) {
		    if (indx >= len) {
			return;
		    }
		    line = lines[indx];
		    // first node is a syntax string and may have leading whitespace
		    nodes = getNodes(line);
		    replaceTextNode(nodes);
		    // remove end CRLF if it exists; then add a line ending
		    line.innerHTML = line.innerHTML.replace(regexCR, "") + whitespace.CRLF;
		    max++;
		    indx++;
		}
		if (indx < len) {
		    setTimeout(() => {
			loop();
		    }, 100);
		}
	    };
	    loop();
	}
    }

    function detectDiff(wrap) {
	const header = $(".btn-clipboard", wrap);
	if ($(".diff-content", wrap) && header) {
	    const file = header.getAttribute("data-clipboard-text");
	    if (
		// File Exceptions that need tweaking (e.g. ".md")
		regexExceptions.test(file) ||
		    // files with no extension (e.g. LICENSE)
		    file.indexOf(".") === -1
	    ) {
		// This class is added to adjust the position of the whitespace
		// markers for specific files; See issue #27
		wrap.classList.add("ghcw-adjust");
	    }
	}
    }

    // bind whitespace toggle button
    document.addEventListener("click", event => {
	const target = event.target;
	if (
	    target.nodeName === "DIV" &&
		target.classList.contains("ghcw-toggle")
	) {
	    const wrap = target.closest(".diff-file");
	    const block = $(".text-file", wrap); // diff-content
	    if (block) {
		target.classList.toggle("selected");
		block.classList.toggle("ghcw-active");
		detectDiff(wrap);
		addWhitespace(block);
	    }
	}
    });

    // Add toggle every second to be sure that it will start after each update
    setInterval(addToggle, 1000);
    // toggle added to diff & file view
    addToggle();
})();
