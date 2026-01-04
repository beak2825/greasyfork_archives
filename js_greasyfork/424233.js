// ==UserScript==
// @name              LeetCode - Bring back Submit Code shortcut (Ctrl/Cmd + Enter)
// @name:zh-CN        LeetCode - 加回提交代码快捷键（Ctrl/Cmd + Enter）
// @name:zh-HK        LeetCode - 加回提交代碼快捷鍵（Ctrl/Cmd + Enter）
// @name:zh-TW        LeetCode - 加回提交代碼快捷鍵（Ctrl/Cmd + Enter）
// @description        See: https://leetcode.com/discuss/general-discussion/136588/Is-there-any-keyboard-shortcut-to-run-code-and-submit-solution/346347
// @description:zh-CN 参考：https://leetcode.com/discuss/general-discussion/136588/Is-there-any-keyboard-shortcut-to-run-code-and-submit-solution/346347
// @description:zh-HK 參考：https://leetcode.com/discuss/general-discussion/136588/Is-there-any-keyboard-shortcut-to-run-code-and-submit-solution/346347
// @description:zh-TW 參考：https://leetcode.com/discuss/general-discussion/136588/Is-there-any-keyboard-shortcut-to-run-code-and-submit-solution/346347
// @namespace         RainSlide
// @author            RainSlide
// @icon              https://assets.leetcode.com/static_assets/public/icons/favicon-192x192.png
// @version           1.0
// @match             *://leetcode.com/problems/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/424233/LeetCode%20-%20Bring%20back%20Submit%20Code%20shortcut%20%28CtrlCmd%20%2B%20Enter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424233/LeetCode%20-%20Bring%20back%20Submit%20Code%20shortcut%20%28CtrlCmd%20%2B%20Enter%29.meta.js
// ==/UserScript==

"use strict";

const debug = msg => console.debug("[LeetCode - Submit Code shortcut] ".conact(msg));

const addShortcut = () => {

const codeArea = document.querySelector('div[data-cy="code-area"]');
if (codeArea !== null) {

	// see: https://developer.mozilla.org/en-US/docs/Web/CSS/%3Ascope
	const selectInCodeArea = selector =>
		codeArea.querySelector(':scope '.concat(selector));

const submitButton = selectInCodeArea('button[data-cy="submit-code-btn"]');
if (submitButton !== null) {

	// see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
	document.addEventListener(
		"keydown", event => {
			if (
				event.key === "Enter" && (
					event.ctrlKey === true || event.metaKey === true
				)
			) {
				event.preventDefault();
				submitButton.click();
			}
		}
	);

const shortcutsButton = selectInCodeArea('button[icon="information"]');
if (shortcutsButton !== null) {

	const addShortcutEntry = () => {

		// select div[class^="shortcut__"] which is:
			// in a Ant modal titled with "Editor Shortcuts"
			/* has div[class^="shortcut-description__"] and
			   div[class^="shortcut-keystrokes__"] as 1st & 2nd child */

		// see: https://devhints.io/xpath
		const result = new XPathEvaluator().createExpression(
			`//div[@class="ant-modal-content"][
				./div[@class="ant-modal-header"]
				//span[text()="Editor Shortcuts"]
			]/div[@class="ant-modal-body"]
			//div[starts-with(@class,"shortcut__")][
				./div[1][starts-with(@class,"shortcut-description__")] and
				./div[2][starts-with(@class,"shortcut-keystrokes__")]
			]` // .replace(/\n\s+/g, "")
		).evaluate(
			document.body, XPathResult.FIRST_ORDERED_NODE_TYPE
		);

		/* <div class="shortcut__1GGr">
			<div class="shortcut-description__23fr">Run code</div>
			<div class="shortcut-keystrokes__3HcT">CTRL + '</div>
		</div> */

		const shortcut = result.singleNodeValue;
		if (shortcut !== null) {
			const submitShortcut = shortcut.cloneNode(true);
			submitShortcut.children[0].textContent = "Submit Code";
			submitShortcut.children[1].textContent = "Ctrl + Enter";
			shortcut.parentNode.insertBefore(submitShortcut, shortcut);
		} else debug("shortcut not found");

	};

	// use setTimeout(func, 0) to delay the exec of func
	// see:
		// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals#settimeout
		// https://stackoverflow.com/questions/779379
		// https://stackoverflow.com/questions/33955650
	shortcutsButton.addEventListener(
		"click", () => setTimeout(addShortcutEntry, 0), { once: true }
	);

} else debug("shortcutsButton not found");
} else debug("submitButton not found, won't add shortcut");
} else debug("codeArea not found, won't add shortcut");

};

const loading = document.querySelector("body > #initial-loading");
if (loading !== null) {

	// run addShortcut() when #initial-loading is removed
	// see:
		// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
	new MutationObserver(
		(mutationList, observer) => mutationList.forEach(
			mutation => {
				if ( Array.from(mutation.removedNodes).includes(loading) ) {
					addShortcut();
					observer.disconnect();
				}
				/* const nodes = mutation.removedNodes;
				if (nodes instanceof NodeList && nodes.length > 0) {
					for (const node of nodes) {
						if (node.id === "initial-loading") {
							addShortcut();
							observer.disconnect();
							break;
						}
					}
				} */
			}
		)
	).observe(
		document.body, { childList: true }
	);

} else {
	debug("loading not found");
	addShortcut();
}
