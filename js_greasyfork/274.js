// ==UserScript==
// @name        Google 検索窓を複製
// @name:ja     Google 検索窓を複製
// @description Also shows the search box to the page bottom.
// @description:ja 検索窓をページ下部にも表示します。
// @namespace   http://userscripts.org/users/347021
// @version     3.0.2
// @include     https://www.google.*/*
// @include     https://www.google.*/?*
// @include     https://www.google.*/#*
// @include     https://www.google.*/webhp
// @include     https://www.google.*/webhp?*
// @include     https://www.google.*/webhp#*
// @include     https://www.google.*/search*
// @include     https://www.google.*/search?*
// @include     https://www.google.*/search#*
// @exclude     https://www.google.*/search?*tbm=isch*
// @require     https://greasyfork.org/scripts/17895/code/polyfill.js?version=189394
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=230651
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Edge 非推奨 / Deprecated
// @compatible  Firefox
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @run-at      document-start
// @icon        data:image/vnd.microsoft.icon;base64,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
// @author      100の人
// @homepage    https://greasyfork.org/scripts/274
// @downloadURL https://update.greasyfork.org/scripts/274/Google%20%E6%A4%9C%E7%B4%A2%E7%AA%93%E3%82%92%E8%A4%87%E8%A3%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/274/Google%20%E6%A4%9C%E7%B4%A2%E7%AA%93%E3%82%92%E8%A4%87%E8%A3%BD.meta.js
// ==/UserScript==

(function () {
'use strict';

class GoogleBottomSearchBox
{
	/**
	 * messageイベントで使用する識別子。
	 * @constant {string}
	 */
	static get ID() {return 'google-bottom-search-box-137';}

	constructor()
	{
		startScript(
			() => {
				if (document.querySelector('#csi + script, #csi + a')) {
					// インスタント検索が有効
					this.main();
				} else if (location.pathname === '/search') {
					// インスタント検索が無効
					this.mainWithoutInstant();
				}
			},
			parent => parent.id === 'viewport' || /* インスタンス検索が無効 */ parent === document.body,
			target => target.id === 'main',
			() => document.getElementById('main')
		);
	}

	/**
	 * @param {Event} event
	 */
	handleEvent(event)
	{
		switch (event.type) {
			case 'focus':
				event.target.closest('#sfdiv').classList.add('sbfcn');
				break;
			case 'blur':
				event.target.closest('#sfdiv').classList.remove('sbfcn');
				break;
			case 'mouseup':
				if (event.target.name !== 'q') {
					event.target.closest('form').q.focus();
				}
				break;
			case 'hashchange':
			case 'message':
				if (event.type === 'hashchange'
					|| event.origin === location.origin && typeof event.data === 'object' && event.data !== null
						&& event.data.id === GoogleBottomSearchBox.ID) {
					if (this.getTbm(location) === this.getTbm(new URL(event.oldURL || event.data.oldURL))) {
						document.querySelector('#foot ~ form [name="q"]').value
							= new URLSearchParams(location.hash.replace('#', '')).get('q') || '';
					}
				}
				break;
		}
	}

	/**
	 * @access protected
	 */
	main()
	{
		this.observeFooterInserting(() => {
			if (!document.querySelector('#foot ~ form [name="q"]')) {
				this.cloneForm();
				this.synchronizeSearchWord();
				this.waitSearchControl().then(() => this.setEventListeners());
			}
		});
	}

	/**
	 * URLのtbmパラメータを取得します。
	 * @access protected
	 * @param {(Location|URL)} url
	 * @returns {string}
	 */
	getTbm(url)
	{
		return new URLSearchParams(url.hash.replace('#', '')).get('tbm')
			|| new URLSearchParams(url.search).get('tbm') || '';
	}

	/**
	 * ページにフッタが挿入されるのを監視します。
	 * @access protected
	 * @param {Function} callback - フッタが挿入されるたびに呼び出されるコールバック関数。
	 * @returns {Promise.<void>}
	 */
	observeFooterInserting(callback)
	{
		new MutationObserver(function (mutations, observer) {
			mutations: for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.id === 'cnt' || node.id === 'foot') {
						callback();
						break mutations;
					}
				}
			}
		}).observe(document.getElementById('main'), {childList: true, subtree: true});
	}

	/**
	 * フォームを複製して挿入します。
 	 * @access protected
	 */
	cloneForm()
	{
		document.head.insertAdjacentHTML('beforeend', `<style>
			.hp #foot ~ form {
				/* トップページから完全に切り替わるまではフォームを表示しない */
				display: none;
			}
			#foot ~ form {
				margin-bottom: 1em;
			}
			:not(.mw) > * > #foot ~ form .tsf-p {
				padding-left: 8px;
			}
			#foot ~ form #sfdiv:hover {
				box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
			}
		</style>`);

		const bottomForm = document.getElementById('tsf').cloneNode(true);
		bottomForm.querySelector('#logocont').remove();
		document.getElementById('foot').after(bottomForm);
	}

	/**
	 * テキスト入力欄が置換されるのを待機し、実行時点で置換されて居れなければ、複製して置換します。
 	 * @access protected
 	 * @returns {Promise.<void>}
	 */
	waitSearchControl()
	{
		return new Promise(function (resolve) {
			if (document.getElementsByClassName('sbib_a')[0]) {
				resolve();
			} else {
				const ancestors = document.getElementsByClassName('lst-c');
				new MutationObserver((mutations, observer) => {
					observer.disconnect();
					const clone = ancestors[0].cloneNode(true);
					clone.getElementsByTagName('input')[0].removeAttribute('autocomplete');
					ancestors[1].replaceWith(clone);
					resolve();
				}).observe(ancestors[0], {childList: true});
			}
		});
	}

	/**
	 * フォーカス時とクリック時のイベントリスナーを設定します。
 	 * @access protected
	 */
	setEventListeners()
	{
		const form = document.querySelector('#foot ~ form');
		// 検索窓にフォーカスが移った時
		const q = form.q;
		q.addEventListener('focus', this);
		q.addEventListener('blur', this);
		// 検索窓をクリックしたとき
		form.getElementsByClassName('sbib_a')[0].addEventListener('mouseup', this);
	}

	/**
	 * 疑似ページ移動時、複製した検索窓に検索語句を反映します。
 	 * @access protected
	 */
	synchronizeSearchWord()
	{
		if (!this.alreadyObserved) {
			this.alreadyObserved = true;
			GreasemonkeyUtils.executeOnUnsafeContext(function (id) {
				History.prototype.pushState = new Proxy(History.prototype.pushState, {
					apply(target, thisArg, argumentsList)
					{
						const oldURL = location.href;
						const returnValue = Reflect.apply(target, thisArg, argumentsList);
						window.postMessage({id, oldURL}, location.origin);
						return returnValue;
					},
				});
			}, [GoogleBottomSearchBox.ID]);
			window.addEventListener('message', this);
			window.addEventListener('hashchange', this);
		}
	}

	/**
	 * インスタント検索無効時の処理。
 	 * @access protected
	 */
	mainWithoutInstant()
	{
		// body要素挿入時に実行し、Google検索のバージョンを判別する
		let textBoxId, inputNodeId, inputParentNodesClassName, textBoxBorderClass, classOnfocuse, previousSiblingId;

		let isTargetParent, isTarget, functionsForFirefox;
		if (document.body.id) {
			if (document.body.getAttribute('marginheight')) {
				// User-AgentがFirefox
				textBoxId = 'tsf';
				inputNodeId = 'lst-ib';
				inputParentNodesClassName = 'lst-d';
				textBoxBorderClass = 'lst-td';
				classOnfocuse = ['lst-d-f'];
			} else {
				// Google Chrome版 (UAがOpera、Google Chrome、IE8以降)
				textBoxId = 'gbqf';
				inputNodeId = 'gbqfq';
				inputParentNodesClassName = 'gbqfqwc';
				textBoxBorderClass = 'gbqfqw';
				classOnfocuse = ['gbqfqwf', 'gsfe_b'];
			}
			previousSiblingId = 'xjs';

			isTargetParent = parent => parent.id === 'foot';
			isTarget = target => target.id === 'xjs';
			functionsForFirefox = {
				isTargetParent: parent => parent.classList.contains('mw'),
				isTarget(target)
				{
					const firstElementChild = target.firstElementChild;
					return firstElementChild && firstElementChild.id === 'foot';
				},
			};
		} else {
			// IE7版 (UAがIE7以下、またはJavaScriptが無効)
			textBoxId = 'tsf';
			previousSiblingId = 'nav';
			isTargetParent = parent => parent.id === 'foot';
			isTarget = target => target.id === 'nav';
			functionsForFirefox = {
				isTargetParent: parent => parent.localName === 'tbody' && parent.parentNode.id === 'mn',
				isTarget(target)
				{
					const cells = target.cells;
					return cells && cells[0] && cells[0].id === 'leftnav';
				},
			};
		}

		startScript(
			function () {
				// スタイルシートの設定
				document.head.insertAdjacentHTML('beforeend', `<style>
					#foot form {
						margin-top: 13px;
					}

					#foot > form {
						margin-bottom: 1em;
					}

					/*------------------------------------
						Firefox版
					*/
					#foot .nojsv {
						display: none;
					}
					#foot .tsf-p {
						width: 631px;
						padding-left: 8px;
					}
					#nav {
						margin-bottom: initial !important;
					}
				</style>`);

				// 検索ボックスを取得
				const original = document.getElementById(textBoxId);
				if (!original) {
					return;
				}

				// 複製
				const bottomForm = original.cloneNode(true);

				// 移動先を取得
				const previousSibling = document.getElementById(previousSiblingId);

				// 挿入
				previousSibling.parentNode.insertBefore(bottomForm, previousSibling.nextSibling);

				let textBoxBorder, textBoxBorderClassList, inputParentNodes, submitButtonClassList;

				// ページ描画後のスクリプトによる書き換えを待機
				if (inputParentNodesClassName) {
					inputParentNodes = document.getElementsByClassName(inputParentNodesClassName);
					startScript(
						function () {
							// 後から挿入された検索窓を複製
							const table = inputParentNodes[0].firstElementChild.cloneNode(true);
							// オートコンプリートを有効に
							table.getElementsByTagName('input')[0].removeAttribute('autocomplete');
							// 下の検索窓を置き換え
							inputParentNodes[1].replaceChild(table, inputParentNodes[1].firstElementChild);
						},
						parent => parent.id === 'gs_lc0',
						target => target.id === inputNodeId,
						() => document.querySelector('#' + inputNodeId + '[style]')
					);
				}

				// 検索窓にフォーカスが移った時
				if (textBoxBorderClass) {
					textBoxBorder = bottomForm.getElementsByClassName(textBoxBorderClass)[0];
					textBoxBorderClassList = textBoxBorder.classList;
					textBoxBorder.addEventListener('focus', function () {
						textBoxBorderClassList.add(...classOnfocuse);
					}, true);

					textBoxBorder.addEventListener('blur', function () {
						textBoxBorderClassList.remove(...classOnfocuse);
					}, true);

					// 検索窓をクリックしたとき
					textBoxBorder.addEventListener('click', function (event) {
						if (event.target.localName !== 'input') {
							bottomForm.elements.namedItem('q').focus();
						}
					});
				}

				// 検索窓にマウスが載ったとき
				const submitButton = bottomForm.getElementsByClassName('gbqfb')[0];
				if (submitButton) {
					submitButtonClassList = submitButton.classList;
					bottomForm.addEventListener('mouseover', function (event) {
						if (textBoxBorder.contains(event.target)) {
							// 検索窓
							textBoxBorderClassList.add('gbqfqw-hvr', 'gsfe_a');
						} else if (submitButton.contains(event.target)) {
							// 検索ボタン
							submitButtonClassList.add('gbqfb-hvr');
						}
					});

					bottomForm.addEventListener('mouseout', function (event) {
						if (!textBoxBorder.contains(event.relatedTarget)) {
							// 検索窓
							textBoxBorderClassList.remove('gbqfqw-hvr', 'gsfe_a');
						}
						if (!submitButton.contains(event.relatedTarget)) {
							// 検索ボタン
							submitButtonClassList.remove('gbqfb-hvr');
						}
					});
				}
			},
			isTargetParent,
			isTarget,
			() => document.getElementById(previousSiblingId),
			functionsForFirefox
		);
	}
}

new GoogleBottomSearchBox();

})();
