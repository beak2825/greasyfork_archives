// ==UserScript==
// @name         Gitlab upgrader
// @namespace    http://tampermonkey.net/
// @version      0.12.6
// @license      MIT
// @description  Fix annoying little things in the UI.
// @author       myklosbotond
// @icon         https://about.gitlab.com/nuxt-images/ico/favicon.ico
// @match        https://gitlab.com/*
// @match        https://src.codespring.ro/*
// @match        https://git.edu.codespring.ro/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420681/Gitlab%20upgrader.user.js
// @updateURL https://update.greasyfork.org/scripts/420681/Gitlab%20upgrader.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const SCRIPT_PREFIX = "gl-42-script-";

(function () {
	"use strict";

	setupStyles();
	setupPersistentUI();

	runUpgrader();

	const observer = new MutationObserver(onLayoutElementChanged);
	observer.observe(document.querySelector(".layout-page"), {
		subtree: false,
		childList: false,
		attributes: true,
		attributeFilter: ["class"],
	});

	const diffFileObserver = new MutationObserver(onDiffFileChanged);
	retry(() => {
		diffFileObserver.observe(document.querySelector(".diff-files-holder"), {
			subtree: false,
			childList: true,
			attributes: false,
		});
	}, 3);
})();



function runUpgrader(timeout = true) {
	const currentUrl = new URL(location.href);

	const urlPatternMap = [
		{
			pathRegex: /(?:merge_requests|issues)\/\d+/,
			handlerFn: imgAdjuster,
			timeoutMs: 3 * 1000,
		},
		{
			pathRegex: /merge_requests\/\d+\/diffs/,
			handlerFn: () => {
				addOldMrDiffWidthAdjuster();
				addNewMrDiffAdjuster();
				highlightTodos();
				registerShortcuts();
			},
			timeoutMs: 5 * 1000,
		},
		{
			pathRegex: /merge_requests\/\d+/,
			handlerFn: loadCollapsedDiffs,
			timeoutMs: 5 * 1000,
		},
		{
			pathRegex: /merge_requests\/\d+/,
			handlerFn: mrTitleFormatter,
			timeoutMs: 500,
		},
		{
			pathRegex: /(?:merge_requests|issues)\/(?:new|\d+)/,
			handlerFn: addImgFormatter,
			timeoutMs: 0,
		},
		{
			pathRegex: /\/designs\//,
			handlerFn: addDesignNormalizer,
			timeoutMs: 1000,
		},
	];

	urlPatternMap.forEach(({ pathRegex, handlerFn, timeoutMs }) => {
		if (pathRegex.test(currentUrl.pathname)) {
			if (timeout) {
				setTimeout(() => handlerFn(), timeoutMs);
			} else {
				handlerFn();
			}
		}
	});
}

function getThemeColor() {
	try {
		return window
			.getComputedStyle(document.querySelector("header.navbar"), null)
			.getPropertyValue("background-color");
	} catch {
		return window
			.getComputedStyle(
				document.querySelector(".top-bar-container"),
				null
			)
			.getPropertyValue("background-color");
	}
}

function setupStyles() {
	const themeColor = getThemeColor();

	GM_addStyle(`
.diff-viewer .code span::selection {
    background-color: #98bdd4;
}

.diff-slider-row {
    background-color: #fafafa;
}

.diff-slider-row td {
    height: 15px;
}

.tree-list-scroll {
    max-height: 85% !important;
}

input[type='range'] {
    width: 80px;
    outline: none;
    -webkit-appearance: none;
    background-color: #eee;
}

input[type='range']::-webkit-slider-runnable-track {
    height: 10px;
    width: 100%;
    -webkit-appearance: none;
    background-color: #eee;
    margin-top: -1px;
    border-radius: 5px;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: ew-resize;
    width: 6px;
    height: 16px;
    margin-top: -3px;
    border-radius: 2px;
    background: ${themeColor};
}

.top-bar-container .nav-item {
    list-style: none;
    padding: 5px;
}

.top-bar-container .nav-item:hover {
    background: #00000020;
}

.top-bar-container .nav-item:active {
    background: #00000040;
}

.todo-part {
	border-radius: 3px;
	color: white;
}

.todo-color-TODO {
	background: orange;
}
.todo-color-BUG {
	background: red;
}
.todo-color-FIXME {
	background: firebrick;
}
.todo-color-TEST {
	background: mediumslateblue;
}
.todo-color-DOCS {
	background: dodgerblue;
}
.todo-color-QUESTION {
	background: dodgerblue;
}
.todo-color-CLEANUP {
	background: moccasin;
    color: black;
}
`);
}

function setupPersistentUI() {
	const rerunNavItem = htmlToElements(`
    <li class="nav-item">
        <a id="${SCRIPT_PREFIX}repeat-setup">
            <svg class="s16" data-testid="gl-script-repeat">
                <use xlink:href="${getSvgPath("repeat")}"></use>
            </svg>
        </a>
    </li>
`);

	const legacyHeader = document.querySelector("ul.nav.navbar-nav");
	if (legacyHeader) {
		legacyHeader.insertBefore(rerunNavItem, legacyHeader.firstChild);
	} else {
		const newNavHeader = document.querySelector(".top-bar-container");
		newNavHeader.appendChild(rerunNavItem);
	}

	const repeatButton = document.querySelector(
		`#${SCRIPT_PREFIX}repeat-setup`
	);
	repeatButton.onclick = () => {
		runUpgrader(false);
	};
}

function onLayoutElementChanged(mutationList) {
	const mutation = mutationList.find(
		(mut) => mut.type === "attributes" && mut.attributeName === "class"
	);

	if (
		mutation &&
		mutation.target.classList.contains("design-detail-layout")
	) {
		runUpgrader();
	}
}

function onDiffFileChanged(_mutationList) {
	runUpgrader(false);
}

function imgAdjuster() {
	const contentImages = [
		...document.querySelectorAll("img.js-lazy-loaded:not([width])"),
	];
	contentImages.forEach((image) => {
		const width = image.width !== undefined ? image.width : 10000;
		const height = image.height !== undefined ? image.height : 10000;

		const minSize = Math.min(width, height);
		if (isNaN(minSize) || minSize < 20) {
			return;
		}

		image.classList.add("tampermonkey-was-here");

		if (width < height) {
			image.width = Math.min(image.width, 400);
		} else {
			image.height = Math.min(image.height, 450);
		}
	});
}

function addOldMrDiffWidthAdjuster() {
	const diffTables = document.querySelectorAll(
		".diff-file .diff-content table:not(.gl-diff-aj-processed)"
	);
	diffTables.forEach((table) => {
		table.classList.add("gl-diff-aj-processed");

		const tbody = table.querySelector("tbody");
		const colgroup = table.querySelector("colgroup");
		if (!colgroup) {
			return;
		}
		const [, , leftContent, , , rightContent] = colgroup.children;

		leftContent.style.width = "50%";
		rightContent.style.width = "50%";

		const adjusterRow = htmlToElements(`
    <tr class="diff-slider-row">
        <td colspan="6" style="margin-right: 58px; position: relative">
            <input type="range" min="0" max="1000" value="500" style="width: 98%; margin-left: 1%">
        </td>
    </tr>
`);

		tbody.insertBefore(adjusterRow, tbody.firstChild);
		const adjuster = adjusterRow.querySelector("input");

		adjuster.oninput = (e) => {
			const leftPercent = parseInt(e.target.value, 10) / 10;
			const rightPercent = 100 - leftPercent;

			leftContent.style.width = `${leftPercent}%`;
			rightContent.style.width = `${rightPercent}%`;
		};
	});
}

function addNewMrDiffAdjuster() {
	const diffGrids = document.querySelectorAll(
		".diff-file .diff-content .diff-grid:not(.gl-diff-new-mr-processed)"
	);
	diffGrids.forEach((grid) => {
		const styleEl = document.createElement("style");
		document.head.appendChild(styleEl);
		const diffAdjStyleSheet = styleEl.sheet;

		grid.classList.add("gl-diff-new-mr-processed");

		const gridId = uuidv4();
		grid.id = gridId;

		const fileExistenceModifier =
			grid.parentNode?.parentNode?.parentNode?.parentNode?.querySelector(
				".mr-1"
			)?.textContent;
		const isFileAdded = fileExistenceModifier.includes("0 → 100644");
		const isFileDeleted = fileExistenceModifier.includes("100644 → 0");

		const startValue = isFileAdded ? 0 : isFileDeleted ? 1000 : 500;

		const adjusterRow = htmlToElements(`
    <div class="diff-slider-row">
        <input type="range" min="0" max="1000" value="${startValue}" style="width: 98%; margin-left: 1%">
    </div>
`);

		grid.insertBefore(adjusterRow, grid.firstChild);
		const adjuster = adjusterRow.querySelector("input");

		let prevIndex = 0;

		adjuster.oninput = (e) => {
			const leftPercent = parseInt(e.target.value, 10) / 10;
			const rightPercent = 100 - leftPercent;

			try {
				diffAdjStyleSheet.deleteRule(prevIndex);
			} catch (ex) {}

			prevIndex = diffAdjStyleSheet.insertRule(
				`
#${gridId} .diff-grid-row, #${gridId} .diff-grid-drafts {
    grid-template-columns: ${leftPercent}fr ${rightPercent}fr;
}
            `,
				0
			);
		};

		if (isFileAdded || isFileDeleted) {
			adjuster.oninput({ target: { value: startValue } });
		}
	});
}

function highlightTodos() {
	console.debug("highlightTodos");

	document
		.querySelectorAll(
			".diff-td.line_content span.c1, .diff-td.line_content span.cm"
		)
		.forEach((commentNode) => {
			commentNode.innerHTML = commentNode.textContent.replace(
				/(QUESTION|FIXME|TODO|CLEANUP|TEST|BUG|DOCS):/g,
				`
				<span class="todo-part todo-color-$1">$1:</span>
			`.trim()
			);
		});
}

function mrTitleFormatter() {
    const mainTitle = document.querySelector("h1");
    const stickyTitle = document.querySelector('.merge-request-sticky-header a[href="#top"]');

    for(const title of [mainTitle, stickyTitle]) {
        if(!title) {
            console.warn("No MR title found");
            return;
        }

        const marker = "glScript-alreadyProcessed";
        if (title.classList.contains(marker)) {
            return;
        }
        title.classList.add(marker);

        if (title.innerHTML.includes("jira.codespring.ro")) {
            title.innerHTML = title.innerHTML.replace("https://jira.codespring.ro/browse/", "https://rb-tracker.bosch.com/tracker13/browse/");
        } else {
            title.innerHTML = title.innerHTML.replace(/((?:BQDT|KOB|PUK)-\d+)/g, `<a href="https://rb-tracker.bosch.com/tracker13/browse/$1" target="_blank">$1</a>`);
        }
    }
}


function inputInFocus() {
	return ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
}

function docKeyDown(e) {
	if (inputInFocus()) {
		return;
	}

	switch (e.keyCode) {
		case KeyEvent.DOM_VK_PAGE_UP:
			if (e.metaKey && e.shiftKey) {
				document.querySelector("a[data-testid=gl-pagination-prev]").click();
			}

			break;
		case KeyEvent.DOM_VK_PAGE_DOWN:
			if (e.metaKey && e.shiftKey) {
				document.querySelector("a[data-testid=gl-pagination-next]").click();
			}

			break;
		case KeyEvent.DOM_VK_V:
			if (e.metaKey && e.shiftKey) {
				document.querySelector(".file-actions input[type=checkbox].custom-control-input").click();
			}

			break;
		default:
			break;
	}
}

function registerShortcuts() {
	document.addEventListener('keydown', docKeyDown, false);
}

function addImgFormatter() {
	const inputForms = document.querySelectorAll(".common-note-form.gfm-form");
	inputForms.forEach((inputForm) => {
		const firstToolbarButton = inputForm.querySelectorAll(
			".md-header-toolbar button"
		)[0];
		if (
			firstToolbarButton.classList.contains(
				`${SCRIPT_PREFIX}img-formatter`
			)
		) {
			// already set this up
			return;
		}

		const toolbar = firstToolbarButton.parentNode;

		const newButton = htmlToElements(`
    <button type="button" class="gl-button btn btn-default-tertiary btn-icon js-md has-tooltip ${SCRIPT_PREFIX}img-formatter" data-container="body" title="MD image to HTML image" aria-label="MD image to HTML image">
        <svg class="s16" data-testid="bold-icon">
            <use xlink:href="${getSvgPath("image-comment-dark")}"></use>
        </svg>
    </button>
    `);
		toolbar.insertBefore(newButton, firstToolbarButton);
		const textarea = inputForm.querySelector("textarea");

		newButton.onclick = function () {
			const selectedText = window.getSelection().toString();
			if (selectedText) {
				const entries = selectedText
					.replace(/^\n*/, "")
					.replace(/\n*$/, "")
					.split(/\n+/)
					.reverse();
				const htmlImgs = entries
					.map((line) =>
						line.replace(/!\[[^\]]*\]\(/, "").replace(/\)$/, "")
					)
					.map((src) => `<img src="${src}" width="400" />`)
					.join("\n");

				textarea.setRangeText(
					htmlImgs,
					textarea.selectionStart,
					textarea.selectionEnd
				);
			}
		};
	});
}

function addDesignNormalizer() {
	const newButton = htmlToElements(`
    <button type="button" class="btn btn-default btn-md gl-button btn-icon ${SCRIPT_PREFIX}design-minimizer" data-container="body" title="Make image smaller" aria-label="Make image smaller">
        <svg class="s16" data-testid="bold-icon">
            <use xlink:href="${getSvgPath("minimize")}"></use>
        </svg>
    </button>
    `);

	const btnGroup = document.querySelector(
		".design-scaler-wrapper div[role=group]"
	);

	const MARKER_CLASS = `${SCRIPT_PREFIX}design-btn-group`;

	if (btnGroup.classList.contains(MARKER_CLASS)) {
		return;
	}

	btnGroup.classList.add(MARKER_CLASS);
	btnGroup.insertBefore(newButton, btnGroup.children[0]);

	newButton.onclick = function () {
		const designImage = document.querySelector(".js-design-image img");

		designImage.style.width = "400px";
		designImage.style.removeProperty("height");
	};
}

function loadCollapsedDiffs() {
	// For now focus only on the file-by-file view
	const fileHolder = document.querySelector(".diff-files-holder");
    if (!fileHolder) {
        return;
    }

	const markerClass = `${SCRIPT_PREFIX}observed`;
	if (!fileHolder.classList.contains(markerClass)) {
		fileHolder.classList.add(markerClass);

		const observer = new MutationObserver(onDiffHolderChanged);
		observer.observe(fileHolder, {
			childList: true,
		});
	}

	onDiffHolderChanged([{ target: fileHolder }]);
}

async function onDiffHolderChanged(mutationList) {
	const target = mutationList[0].target;

	const downloadButtonShown =
		target.querySelectorAll("a[download]").length > 0;
	if (!downloadButtonShown) {
		return;
	}

	const viewedCheckbox = document.querySelector(
		"input[data-testid='fileReviewCheckbox']"
	);

	// Toggle Viewed checkob on and off to force file load
	triggerCheckbox(viewedCheckbox);
	await wait(300);
	triggerCheckbox(viewedCheckbox);
}

function triggerCheckbox(target) {
	target.checked = !target.checked;
	triggerEvent(target, "change");
}

// ============= Utils =============

function getSvgPath(svgName) {
    try {
        return document
            .querySelector("nav svg use:nth-of-type(1)")
            .href.baseVal.replace(/#.*$/, `#${svgName}`);
    } catch {
        return "";
    }
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 * @source https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 */
function htmlToElements(html) {
	const template = document.createElement("template");
	template.innerHTML = html;

	return template.content.children[0];
}

/** Programmatically triggers an event on target. */
function triggerEvent(target, eventName) {
	const event = new Event(eventName);
	target.dispatchEvent(event);
}

async function wait(duration) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), duration);
	});
}

function retry(operation, tries) {
	try {
		operation();
	} catch (error) {
		if (tries > 0) {
			setTimeout(() => {
				retry(operation, tries - 1);
			}, 500);
		} else {
			throw error;
		}
	}
}

/**
 * Generates a UUID.
 * @return {String}
 * @source https://stackoverflow.com/a/2117523/6932518
 */
function uuidv4() {
	return "GRID-xxxxxxxxxxxx4xxxy".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
