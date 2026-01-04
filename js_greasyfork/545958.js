// ==UserScript==
// @name         あにまん広告完全削除
// @version      1.0.1
// @description  全広告スクリプト削除、画面表示後の<script>挿入ブロック、ページ内広告要素削除
// @match        *://bbs.animanch.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1494168
// @downloadURL https://update.greasyfork.org/scripts/545958/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E5%BA%83%E5%91%8A%E5%AE%8C%E5%85%A8%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/545958/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E5%BA%83%E5%91%8A%E5%AE%8C%E5%85%A8%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==
(function() {

	'use strict';

	// ────────────────────────────────────────────────
	// ホワイトリスト判定：Twitter埋め込み用iframe／script
	// ────────────────────────────────────────────────
	function isTwitterIframe(node) {
		return node.tagName === 'IFRAME' &&
			node.id &&
			node.id.toLowerCase().includes('twitter');
	}

	function isTwitterScript(node) {
		return node.tagName === 'SCRIPT' &&
			node.src &&
			node.src.includes('platform.twitter.com/widgets.js');
	}

	// ────────────────────────────────────────────────
	// RemoveAd 関数：ページ内の広告要素を削除
	// ────────────────────────────────────────────────
	function RemoveAd() {
		if (!window.jQuery) return;
		const $ = window.jQuery;
		// ID/Classが"AD"で始まる要素
		$('[id^="AD"], [class^="AD"]').remove();
		// div.inner
		$('div.inner').remove();
		// div[data-cptid]
		$('div[data-cptid]').remove();
		// #reslist下の不正 iframe
		$('#reslist').find('iframe[id^="gnpbad_"]').closest('li').remove();
	}

	// ────────────────────────────────────────────────
	// 1. document-start：既存広告<script>／<iframe>を即削除
	// ────────────────────────────────────────────────
	const AD_PATTERNS = [
		/adrecover\.com/, /delivery\.adrecover\.com/, /geniee\.jp/,
		/cpt\.geniee\.jp/, /iago\.min\.js/, /pubmatic\.com/,
		/rtbhouse/, /onetag-sys\.com/, /undertone\.com/,
		/rubiconproject\.com/, /criteo\.com/, /doubleclick\.net/,
		/g\.doubleclick\.net/, /googletagmanager\.com/, /prebid-v\d+/,
		/dmp\.im-apps\.net/, /ads\.pubmatic\.com/, /authorizedvault\.com/
	];

	function isAdNode(node) {
		if (!node.tagName) return false;
		// Twitter関連は除外
		if (isTwitterIframe(node) || isTwitterScript(node)) return false;
		const tag = node.tagName.toUpperCase();
		if (tag !== 'SCRIPT' && tag !== 'IFRAME') return false;
		const src = node.src || node.getAttribute('src') || '';
		return AD_PATTERNS.some(rx => rx.test(src));
	}

	// 既存の<script>／<iframe>を即座に削除
	document.querySelectorAll('script, iframe').forEach(el => {
		if (isAdNode(el)) el.remove();
	});

	// 動的挿入の広告ノードも監視して削除
	const adObserver = new MutationObserver(records => {
		for (const rec of records) {
			rec.addedNodes.forEach(node => {
				if (node.nodeType === 1 && isAdNode(node)) {
					node.remove();
				}
			});
		}
		// ページ内広告要素も合わせて削除
		RemoveAd();
	});
	adObserver.observe(document.documentElement, {
		childList: true,
		subtree: true
	});

	// <script>／<iframe> の src 設定自体をブロック
	const origCreate = Document.prototype.createElement;
	Document.prototype.createElement = function(tagName, options) {
		const el = origCreate.call(this, tagName, options);
		const tn = tagName.toLowerCase();
		if (tn === 'script' || tn === 'iframe') {
			const desc = Object.getOwnPropertyDescriptor(el.__proto__, 'src');
			Object.defineProperty(el, 'src', {
				get: desc.get,
				set(value) {
					// Twitter関連スクリプトは許可、それ以外の広告URLを阻止
					if (!isTwitterIframe(el) && !isTwitterScript(el) && AD_PATTERNS.some(
							rx => rx.test(value))) {
						console.debug('Blocked ad src:', value);
						return;
					}
					return desc.set.call(this, value);
				},
				configurable: true,
				enumerable: true
			});
		}
		return el;
	};

	// appendChild／insertBefore も広告ノードは阻止
	[Element.prototype, Node.prototype].forEach(proto => {
		['appendChild', 'insertBefore'].forEach(fnName => {
			const orig = proto[fnName];
			proto[fnName] = function(node, ref) {
				if (node.nodeType === 1 && isAdNode(node)) {
					console.debug(`Blocked ad node on ${fnName}`, node);
					return node;
				}
				return orig.call(this, node, ref);
			};
		});
	});

	// ────────────────────────────────────────────────
	// 2. document-end：動的<script>挿入をブロック＆RemoveAd実行
	// ────────────────────────────────────────────────
	function onDocumentEnd() {
		// ページ内広告要素を一度削除
		RemoveAd();

		// 動的に追加される<script>を監視して削除
		const obs = new MutationObserver(records => {
			for (const rec of records) {
				rec.addedNodes.forEach(node => {
					if (node.nodeType !== 1) return;
					// Twitter関連スクリプトはそのまま、その他<script>は削除
					if (node.tagName === 'SCRIPT' && !isTwitterScript(node)) {
						node.remove();
					}
					// 子孫に<script>を含む場合はまとめて削除
					else if (node.getElementsByTagName('script').length) {
						node.remove();
					}
				});
			}
			// 同時に広告要素も削除
			RemoveAd();
		});
		obs.observe(document.documentElement, {
			childList: true,
			subtree: true
		});

		// innerHTML／insertAdjacentHTML／document.write系での<script>混入も除去
		const sanitize = html => String(html).replace(/<script[\s\S]*?<\/script>/gi,
			'');
		const htmlDesc = Object.getOwnPropertyDescriptor(Element.prototype,
			'innerHTML');
		Object.defineProperty(Element.prototype, 'innerHTML', {
			set(value) {
					return htmlDesc.set.call(this, sanitize(value));
				},
				get() {
					return htmlDesc.get.call(this);
				},
				configurable: true,
				enumerable: true
		});
		const origIAH = Element.prototype.insertAdjacentHTML;
		Element.prototype.insertAdjacentHTML = function(pos, html) {
			return origIAH.call(this, pos, sanitize(html));
		};
		['write', 'writeln'].forEach(fn => {
			const orig = Document.prototype[fn];
			Document.prototype[fn] = function(...args) {
				return orig.call(this, args.map(a => sanitize(a)).join(''));
			};
		});

        // ボタンを正常な位置へ
        const btn = document.getElementById('fixbtn');
        if (btn)
        {
            btn.style.setProperty('bottom', '20px', 'important');
        }
	}

	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', onDocumentEnd);
	} else {
		onDocumentEnd();
	}
})();
