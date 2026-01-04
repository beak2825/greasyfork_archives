// ==UserScript==
// @name         Markdown-WorkFlowy
// @namespace    https://github.com/BettyJJ
// @version      0.3.0
// @description  Supports Markdown in WorkFlowy
// @author       Betty
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js
// @grant        GM.addStyle
// @grant        GM_getResourceText
// @resource     TUI_CSS https://cdn.jsdelivr.net/npm/@toast-ui/editor@3.1.3/dist/toastui-editor-viewer.min.css
// @resource     HL_CSS https://unpkg.com/@highlightjs/cdn-assets@11.5.0/styles/github.min.css
// @downloadURL https://update.greasyfork.org/scripts/441459/Markdown-WorkFlowy.user.js
// @updateURL https://update.greasyfork.org/scripts/441459/Markdown-WorkFlowy.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// render WorkFlowy native formatting, such as bold, colors, links and tags, even though they are not Markdown
	// if you want pure Markdown, change the last word in the following line from "true" to "false"
	const render_workflowy_formatting = true;


	init();


	/**
	 * initialize
	 */
	function init() {

		wait_for_page_load();

		watch_page();

		load_css();

	}


	/**
	 * wait till the page is loaded
	 */
	function wait_for_page_load() {

		const observer = new MutationObserver(function (mutation_list) {
			for (const { addedNodes } of mutation_list) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					// this element appears when the page is loaded
					if (node.classList.contains('pageContainer')) {
						show_preview_button();
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

	}


	/**
	 * show preview button
	 */
	function show_preview_button() {
		// show preview button
		const btn = document.createElement('a');
		btn.className = 'bmd-preview-button';
		btn.textContent = 'Preview MD';
		const active_page = document.querySelector('.page.active');
		active_page.insertAdjacentElement('afterend', btn);

		// insert preview box
		const preview = document.createElement('div');
		preview.className = 'bmd-preview-box';
		active_page.insertAdjacentElement('afterend', preview);

		// bind click event
		btn.addEventListener('click', function () {
			// toggle class for page container
			const page_container = document.querySelector('.pageContainer');
			page_container.classList.toggle('bmd-has-preview');

			// show the preview content if the box is not hidden
			if (page_container.classList.contains('bmd-has-preview')) {
				show_preview_content();
			}
		});
	}


	/**
	 * show the preview content
	 */
	function show_preview_content() {
		const raw = get_raw_content();

		const preview = document.querySelector('.bmd-preview-box');

		// use tui editor's style
		let content = document.querySelector('.toastui-editor-contents');
		if (content === null) {
			content = document.createElement('div');
			content.className = 'toastui-editor-contents';
			preview.appendChild(content);
		}

		const md = get_mdit();
		const result = md.render(raw);
		content.innerHTML = result;
	}


	/**
	 * get raw content
	 * @returns {string}
	 */
	function get_raw_content() {
		const node_list = document.getElementsByClassName('innerContentContainer');

		let raw = '';
		for (let i = 0; i < node_list.length; i++) {
			const node = node_list[i];

			// sometimes there is repetition. don't know why, but we need to check and exclude it first
			const parent = node.parentElement;
			const style = parent.getAttribute('style');
			if (style === null || style === '' || style.indexOf('visibility') !== -1) {
				const text = get_node_text(node);
				raw += text + '\n';
			}

		}

		return raw;
	}


	/**
	 * return the object of markdown-it
	 * @returns {object}
	 */
	function get_mdit() {
		const md = window.markdownit({
			breaks: true,
			highlight: function (str, lang) {
				if (lang && hljs.getLanguage(lang)) {
					try {
						return hljs.highlight(str, { language: lang }).value;
					} catch (__) { }
				}

				return '';
			},
			html: true,
			linkify: true,
		});

		return md;
	}


	/**
	 * watch the page
	 */
	function watch_page() {

		// wathe the page, so that the rendering is updated when new contents come in as the user edits or navigates
		const observer = new MutationObserver(function (mutationlist) {
			for (const { addedNodes } of mutationlist) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					if (node.classList.contains('innerContentContainer')) {
						update_preview();
					}

				}
			}
			// to monitor notes getting in and out of focus, we need to watch for attribute changes
			for (const { type, target } of mutationlist) {
				if (type === 'attributes' && target.classList.contains('content')) {
					update_preview();
				}
			}
		});

		observer.observe(document.body, {
			attributeFilter: ['class'],
			childList: true, subtree: true
		});

	}


	/**
	 * update preview if the preview box is shown
	 */
	function update_preview() {
		// only update the preview content if the box is not hidden
		const page_container = document.querySelector('.pageContainer');
		if (!page_container.classList.contains('bmd-has-preview')) {
			return;
		}

		const content = document.querySelector('.toastui-editor-contents');
		if (!content) {
			return;
		}

		// update the preview
		const raw = get_raw_content();
		const md = get_mdit();
		const result = md.render(raw);
		content.innerHTML = result;
	}


	/**
	 * get the text of a node
	 * @param {Node} node Dom Node
	 * @returns {string}
	 */
	function get_node_text(node) {
		let text = '';

		// show the first line of a note by default and the whole note if it is in focus or the root, just like native WF
		const is_note = node.parentElement.parentElement.classList.contains('notes');
		const is_active = node.parentElement.classList.contains('active');
		const is_root = node.parentElement.parentElement.parentElement.classList.contains('root');
		const is_inactive_note = (is_note && !is_active && !is_root);

		const div = document.createElement('div');
		if (is_inactive_note) {
			div.innerHTML = node.innerHTML.split('\n')[0];
		} else {
			div.innerHTML = node.innerHTML;
		}

		if (!render_workflowy_formatting) {
			text = div.textContent;
		}
		// handle WF native formatting
		else {
			while (div.firstChild) {
				const child = div.firstChild;
				// WF has autolinking. we need to remove the links to avoid double conversion
				if (child.href && remove_trailing_slash(child.href) === remove_trailing_slash(child.textContent)) {
					text += child.textContent;
				}
				// Markdown headings starting with ## is treated as tags in WF. we need to fix it
				else if (child.classList && child.classList.contains('contentTag')) {
					const tag = child.getAttribute('data-val');
					const only_contains_sharp = new RegExp('^#+$').test(tag);
					const is_line_start = ((text === '') || (text[text.length - 1] === '\n'));
					if (only_contains_sharp && is_line_start) {
						text += tag;
					} else {
						text += child.outerHTML;
					}
				}
				// in other cases, use HTML if possible
				else {
					if (child.outerHTML) {
						text += child.outerHTML;
					} else {
						text += child.textContent;
					}
				}
				div.removeChild(child);
			}

			// WF converts < and >. we need them for MD to work
			text = text.replaceAll('&lt;', '<');
			text = text.replaceAll('&gt;', '>');
		}

		return text;
	}


	/**
	 * remove the trailing slash in a url
	 * @param {string} url
	 * @returns {string}
	 */
	function remove_trailing_slash(url) {
		return (url[url.length - 1] == "/") ? url.substr(0, url.length - 1) : url;
	}


	/**
	 * load css
	 */
	function load_css() {
		const tui_css = GM_getResourceText('TUI_CSS');
		GM.addStyle(tui_css);

		const hl_css = GM_getResourceText('HL_CSS');
		GM.addStyle(hl_css);

		// style for preview content, mainly fixing interfering styles
		GM.addStyle(`
		.toastui-editor-contents th, .toastui-editor-contents tr, .toastui-editor-contents td {
			vertical-align: middle;
		}
		.toastui-editor-contents {
			font-size: 15px;
		}

		/* support dark mode */
		.toastui-editor-contents h1, .toastui-editor-contents h2, .toastui-editor-contents h3, .toastui-editor-contents h4, .toastui-editor-contents h5, .toastui-editor-contents h6
		, .toastui-editor-contents p
		, .toastui-editor-contents dir, .toastui-editor-contents menu, .toastui-editor-contents ol, .toastui-editor-contents ul
		, .toastui-editor-contents table
		{
			color: revert;
		}
		.toastui-editor-contents table td, .toastui-editor-contents table th {
			border: 1px solid #dadada;
		}
		.toastui-editor-contents pre code {
			color: #2a3135;
		}

		.bmd-preview-box .contentTag {
			color: #868c90;
			cursor: pointer;
		}
		.bmd-preview-box .contentTag .contentTagText {
			text-decoration: underline;
		}

		`);

		// style for the preview box
		GM.addStyle(`
		.bmd-preview-button {
			background: white;
			border: solid 1px;
			color: #2a3135;
			padding: 6px;
			position: absolute;
			right: 24px;
			top: 50px;
		}
		.bmd-preview-button:hover {
			background: lightgray;
			text-decoration: none;
		}

		.bmd-preview-box {
			display: none;
		}
		.bmd-has-preview .bmd-preview-box {
			display: block;
		}

		.bmd-has-preview {
			display: flex;
		}
		.bmd-has-preview .page.active {
			flex-basis: 50%;
			flex-grow: 1;
			padding-left: 24px;
			padding-right: 24px;
			word-break: break-word;
		}
		.bmd-preview-box {
			border: solid 1px lightgray;
			flex-basis: 50%;
			flex-grow: 1;
			margin-top: 72px;
			padding: 24px;
			user-select: text;
		}

		`);

	}


})();
