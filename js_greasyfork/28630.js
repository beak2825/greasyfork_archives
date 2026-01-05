// ==UserScript==
// @name        CatalogTagging
// @description カタログをてきとうにタグ分けします
// @namespace   http://pussy.CatalogTagging/
// @include     *://*.2chan.net/*/futaba.php?mode=cat*
// @version     5.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28630/CatalogTagging.user.js
// @updateURL https://update.greasyfork.org/scripts/28630/CatalogTagging.meta.js
// ==/UserScript==

(function() {

'use strict';
let doc = document;

// ---------------------------------------------------------------------------
// 設定
// ---------------------------------------------------------------------------
let TAGS, CATALOGTAG_CSS, CATALOGTAG_TEXT_CSS, USE_CACHE;
let setup = () => {
	// タグの設定
	TAGS = [
		{ name: '未分類', default: true },
		{ name: 'お外', expr: /http/ },
		{ name: 'お題', imgChecker: odaiChecker },
		{ name: 'Abema', expr: /https:\/\/ab/ },
		{ name: '実況', expr: /そろそろ|午後ロー|鉄腕|DASH/ },
		{ name: 'ﾏｹﾄﾞﾆｱ', imgChecker: macedoniaChecker },
		{ name: '引用', expr: /^>/ }
	];
	// タグのスタイル
	CATALOGTAG_CSS = `
		.catalogtag {
			background: #ea8;
			font-size: 12px;
			max-width: 4em;
			overflow:hidden;
			padding: 0;
			text-align: center;
		}
	`;
	// 本文のスタイル(カタログに本文を出したくない人は「display: none;」とか入れればいいよ)
	CATALOGTAG_TEXT_CSS = `
		.catalogtag-text {
		}
	`;
	// タグ分け結果をキャッシュするか(画像解析を微調整するときはfalseにしておく)
	USE_CACHE = true;
};
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 画像解析
let canvas = doc.createElement('CANVAS');
canvas.width = 50;
canvas.height = 50;
let ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

/**
 * @param x 0から49
 * @param y 0から49
 * @return サムネの色を配列[R,G,B]で返します
 */
let getRGB = (x, y) => {
	return ctx.getImageData(x, y, 1, 1).data;
};

/** @return 色がだいたい同じならtrueを返します */
let isLike = (c1, c2) => {
	for (let i = 0; i < 3; i ++) {
		if (Math.abs(c1[i] - c2[i]) > 32) return false;
	}
	return true;
};

let macedoniaChecker = () => {
	let checkOK = 0;
	let r = [223, 32, 32];
	let y = [223, 223, 32];
	if (isLike(y, getRGB( 0, 1))) [r, y] = [y, r];
	if (isLike(r, getRGB( 0, 0))) checkOK++;
	if (isLike(y, getRGB(15, 0))) checkOK++;
	if (checkOK && isLike(getRGB(0, 0), getRGB(15, 0))) return false;
	if (isLike(r, getRGB(25,  0)) && ++checkOK >= 3) return true;
	if (isLike(y, getRGB(35, 15)) && ++checkOK >= 3) return true;
	if (isLike(r, getRGB(49,  0)) && ++checkOK >= 3) return true;
	if (isLike(y, getRGB( 0, 15)) && ++checkOK >= 3) return true;
	if (isLike(r, getRGB( 0, 25)) && ++checkOK >= 3) return true;
	if (isLike(y, getRGB( 0, 35)) && ++checkOK >= 3) return true;
	if (isLike(r, getRGB( 0, 49)) && ++checkOK >= 3) return true;
	if (isLike(y, getRGB(49, 15)) && ++checkOK >= 3) return true;
	if (isLike(r, getRGB(49, 25)) && ++checkOK >= 3) return true;
	if (isLike(y, getRGB(49, 35)) && ++checkOK >= 3) return true;
	if (isLike(r, getRGB(49, 49)) && ++checkOK >= 3) return true;
	return false;
};

let odaiChecker = () => {
	if (!isLike([255, 255, 255], getRGB(0, 0))) return false;
	if (!isLike([255, 255, 255], getRGB(49,0))) return false;
	for (let y = 5; y <=8; y++) {
		if (isLike([0, 0, 0], getRGB(4, y)) && isLike([0, 0, 0], getRGB(45, y))) return true;
	}
	return false;
};

// ---------------------------------------------------------------------------
// ここから本体
setup();
// タグ設定を整頓する
let NO_TAGGED;
let TAGS_BY_NAME = {};
TAGS.forEach(tag => {
	TAGS_BY_NAME[tag.name] = tag;
	if (tag.default) NO_TAGGED = tag;
});
if (!NO_TAGGED) {
	NO_TAGGED = { name: '未分類', default: true };
	TAGS.unshift(NO_TAGGED);
	TAGS_BY_NAME[NO_TAGGED.name] = NO_TAGGED;
}
// キャッシュを読み込む
let cacheOnStrage = sessionStorage.getItem('catalogtagging_cache');
let cache = cacheOnStrage && JSON.parse(cacheOnStrage) || {};

/** @return 本文と画像をつかって適当にタグを返します */
let findTag = (text, img) => {
	let needDraw = true;
	for (let tag of TAGS) {
		if (text && tag.expr && tag.expr.test(text)) return tag;
		if (!img) continue;
		if (needDraw) {
			ctx.drawImage(img, 0, 0, 50, 50);
			needDraw = false;
		}
		if (tag.imgChecker && tag.imgChecker()) return tag;
	}
	return NO_TAGGED;
};

/* カタログの<TABLE> */
let catalog;

/* タグ分け本体 */
let tagging = (retryCount = 0) => {
	doc.body.setAttribute('__catalogtagging_status', 'start');
	// カタログ情報を取得
	catalog = doc.querySelector('TABLE[border="1"][align="center"]');
	let maxCol = catalog.getElementsByTagName('TR')[0].getElementsByTagName('TD').length;
	let tdElements = catalog.getElementsByTagName('TD');
	let tdCount = tdElements.length;
	if (!tdCount || !(tdElements[0].getElementsByTagName('SMALL').length)) return false; // 本文表示無し
	let tds = [];
	for (let i = 0; i < tdCount; i ++) {
		tds[i] = tdElements[i];
	}
	// 初期化
	TAGS.forEach(tag => {
		tag.tds = [];
		tag.count = 0;
	});
	let cacheKeys = Object.keys(cache);
	for (let j = cacheKeys.length - Math.floor(tdCount * 1.5); 0 <= j; j --) {
		delete cache[cacheKeys[j]];
	}
	let retry = false; // 画像が読み込み中だったら後でもう１回実行する
	// 並び替え
	tds.forEach(td => {
		if (td.classList.contains('catalogtag')) return;
		let small = td.getElementsByTagName('SMALL')[0];
		small.classList.add('catalogtag-text');
		let a = td.getElementsByTagName('A')[0];
		if (!a || !a.href) return;
		let tag = USE_CACHE && TAGS_BY_NAME[cache[a.href]];
		if (!tag) {
			let img = td.getElementsByTagName('IMG')[0];
			if (!img || img.complete) {
				tag = findTag(small.textContent, img);
				cache[a.herf] = tag.name;
			} else {
				tag = findTag(small.textContent, null);
				retry = true;
			}
		}
		if (!tag.count && tag.name) {
			let tagLabelTd = doc.createElement('TD');
			tagLabelTd.textContent = tag.name;
			tagLabelTd.className = 'catalogtag';
			tag.tds = [];
			tag.tds.push(tagLabelTd);
			tag.count ++;
		}
		tag.tds.push(td);
		tag.count ++;
	});
	// カタログの要素を置き換えて完了
	let tbody = doc.createElement('TBODY');
	let count = 0;
	let tr = null;
	TAGS.forEach(tag => {
	if (count === 0 && tag == NO_TAGGED) {
		tag.tds.shift();
	}
	for (let td of tag.tds) {
		if (count % maxCol === 0) {
			tr = tbody.appendChild(doc.createElement('TR'));
		}
		tr.appendChild(td);
		count ++;
		}
	});
	catalog.replaceChild(tbody, catalog.firstChild);
	sessionStorage.setItem('catalogtagging_cache', JSON.stringify(cache));
	doc.body.setAttribute('__catalogtagging_status', 'done');
	if (retry && retryCount < 10) { // やり直しは10回まで
		setTimeout(() => { tagging(retryCount + 1); }, 100);
	}
};
// 念のためイベント呼び出し回数をカウントして無限ループを抑制しておく
let eventCount = 0;
let resetEventCount = () => { eventCount = 0; };
// START!
let onLoad = e => {
	doc.styleSheets.item(0).insertRule(CATALOGTAG_CSS, 0);
	doc.styleSheets.item(0).insertRule(CATALOGTAG_TEXT_CSS, 0);
	tagging();
	// MutationRecordをeventCheckerでチェックしてタグ分けしたりしなかったりする関数
	let onEvent = (m, eventChecker) => {
		if (eventCount > 10) {
			console.log('他の拡張と競合してるっぽい');
			return;
		}
		for (let i = m.length - 1; 0 <= i; i --) {
			if (!eventChecker(m[i])) continue;
			eventCount ++;
			setTimeout(resetEventCount, 500);
			tagging();
			return;
		}
	};
	// TABLEタグが再追加されたらタグ分けするオブザーバー
	let defaultObserver = new MutationObserver(m => {
		onEvent(m, n => {
			for (let i = n.addedNodes.length - 1; 0 <= i; i --) {
				let node = n.addedNodes[i];
				if (node.tagName === 'TABLE') return true; // 赤福
				if (node.id === 'catalog_loading') return true; // ふたクロ
			}
			return false;
		});
	});
	defaultObserver.observe(catalog.parentNode, { childList: true });
	// ねないこのソートが終わったらタグ分けするオブザーバー
	let nenaikoObserver = new MutationObserver(m => {
		onEvent(m, n => {
			if (n.attributeName !== '__nenaiko_catsort_status') return false;
			if (doc.body.getAttribute('__nenaiko_catsort_status') === 'start') return false;
			// ねないこのソートが有効になってるならデフォルトのオブザーバーは要らないので切断する
			if (doc.body.getAttribute('__nenaiko_catsort_status') === 'done') defaultObserver.disconnect();
			return true;
		});
	});
	nenaikoObserver.observe(doc.body, { attributes: true });
};
if (doc.readyState === 'complete') {
	onLoad();
} else {
	addEventListener('load', onLoad);
}
})();

