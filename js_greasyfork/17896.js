// ==UserScript==
// @name        スクリプトの起動
// @version     1.0.1
// @description 「@run-at document-start」で動作するGreasemonkeyスクリプト向けの待機処理を行います。
// @require     https://greasyfork.org/scripts/17895/code/polyfill.js?version=112591
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Firefox
// @compatible  Opera 36以降。また、「@require https://greasyfork.org/scripts/17895/code/polyfill.js?version=112591」を先に設定する必要あり
// @compatible  Chrome 「@require https://greasyfork.org/scripts/17895/code/polyfill.js?version=112591」を先に設定する必要あり
// @run-at      document-start
// @author      100の人
// @homepage    https://greasyfork.org/scripts/17896
// ==/UserScript==

(function () {
'use strict';

/**
 * {@link checkExistingTarget}で{@link startMain}を実行する間隔 (ミリ秒)。
 * @type {number}
 */
const INTERVAL = 10;

/**
 * {@link checkExistingTarget}で{@link startMain}を実行する回数。
 * @type {number}
 */
const LIMIT = 500;

/**
 * 挿入された要素の親が、目印となる要素の親か否かを返すコールバック関数。
 * @callback isTargetParent
 * @param {(Document|Element)} parent
 * @returns {boolean}
 */

/**
 * 挿入された要素が、目印となる要素か否かを返すコールバック関数。
 * @callback isTarget
 * @param {(DocumentType|Element)} target
 * @returns {boolean}
 */

/**
 * 目印となる要素が文書に存在するか否かを返すコールバック関数。
 * @callback existsTarget
 * @returns {boolean}
 */

/**
 * 目印となる要素が挿入された直後に関数を実行します。
 * @param {Function} main - 実行する関数。
 * @param {isTargetParent} isTargetParent
 * @param {isTarget} isTarget
 * @param {existsTarget} existsTarget
 * @param {Object} [callbacksForFirefox]
 * @param {isTargetParent} [callbacksForFirefox.isTargetParent] - Firefoxにおける{@link isTargetParent}。
 * @param {isTarget} [callbacksForFirefox.isTarget] - Firefoxにおける{@link isTarget}。
 * @param {number} [timeoutSinceStopParsingDocument=0] - DOM構築完了後に監視を続けるミリ秒数。
 */
window.startScript = function (
	main,
	isTargetParent,
	isTarget,
	existsTarget,
	callbacksForFirefox = {},
	timeoutSinceStopParsingDocument = 0
) {
	/**
	 * 実行済みなら真。
	 * @type {boolean}
	 */
	let alreadyCalled = false;
	
	let observer;

	// 目印となる要素が既に存在していれば、即実行
	startMain();
	if (alreadyCalled) {
		return;
	}

	// FirefoxのMutationObserverは、HTMLのDOM構築に関して要素をまとめて挿入したと見なすため、isTargetParent、isTargetを変更
	if (typeof MozSettingsEvent !== 'undefined') {
		isTargetParent = callbacksForFirefox.isTargetParent || isTargetParent;
		isTarget = callbacksForFirefox.isTarget || isTarget;
	}

	observer = new MutationObserver(mutationCallback);
	observer.observe(document, {
		childList: true,
		subtree: true,
	});

	if (document.readyState === 'complete') {
		// DOMの構築が完了していれば
		onDOMContentLoaded();
	} else {
		document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
	}

	/**
	 * {@link startMain}を実行し、スクリプトが開始されていなければさらに{@link timeoutSinceStopParsingDocument}ミリ秒待機し、
	 * スクリプトが開始されていなければ{@link stopObserving}を実行します。
	 */
	function onDOMContentLoaded() {
		startMain();
		if (timeoutSinceStopParsingDocument === 0) {
			if (!alreadyCalled) {
				stopObserving();
			}
		} else {
			window.setTimeout(function () {
				if (!alreadyCalled) {
					stopObserving();
				}
			}, timeoutSinceStopParsingDocument);
		}
	}

	/**
	 * 目印となる要素が挿入されたら、監視を停止し、{@link checkExistingTarget}を実行します。
	 * @param {MutationRecord[]} mutations - A list of MutationRecord objects.
	 * @param {MutationObserver} observer - The constructed MutationObserver object.
	 */
	function mutationCallback(mutations, observer) {
		for (let mutation of mutations) {
			let target = mutation.target;
			if (target.nodeType === Node.ELEMENT_NODE && isTargetParent(target)) {
				// 子が追加されたノードが要素で、かつその要素についてisTargetParentが真を返せば
				for (let addedNode of mutation.addedNodes) {
					if (addedNode.nodeType === Node.ELEMENT_NODE && isTarget(addedNode)) {
						// 追加された子が要素で、かつその要素についてisTargetが真を返せば
						observer.disconnect();
						checkExistingTarget(0);
						return;
					}
				}
			}
		}
	}

	/**
	 * {@link startMain}を実行し、スクリプトが開始されていなければ再度実行します。
	 * @param {number} count - {@link startMain}を実行した回数。
	 */
	function checkExistingTarget(count) {
		startMain();
		if (!alreadyCalled && count < LIMIT) {
			window.setTimeout(checkExistingTarget, INTERVAL, count + 1);
		}
	}

	/**
	 * 目印となる要素が存在するか確認し、存在すれば{@link stopObserving}を実行しスクリプトを開始します。
	 */
	function startMain() {
		if (!alreadyCalled && existsTarget()) {
			stopObserving();
			main();
		}
	}

	/**
	 * 監視を停止します。
	 */
	function stopObserving() {
		alreadyCalled = true;
		if (typeof observer !== 'undefined') {
			observer.disconnect();
		}
		document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
	}
}

})();
