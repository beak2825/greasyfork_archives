// ==UserScript==
// @name         Amazon Prime Video - Auto Skip Advertisement Trailer
// @description  Amazon Prime Video - Auto Skip Advertisement Trailer.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @noframes
// @include      https://www.amazon.*/gp/video/*
// @include      https://www.amazon.*/Amazon-Video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @downloadURL https://update.greasyfork.org/scripts/459158/Amazon%20Prime%20Video%20-%20Auto%20Skip%20Advertisement%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/459158/Amazon%20Prime%20Video%20-%20Auto%20Skip%20Advertisement%20Trailer.meta.js
// ==/UserScript==

let currentTitle;
new MutationObserver(debounce(() => {
	// スキップボタンを取得する
	const skip = $x('//div[contains(@class, "atvwebplayersdk-infobar-container")]//div[contains(text(), "スキップ")]');
	if (!skip)
		return;

	const title =
		document.querySelector('.atvwebplayersdk-title-text').textContent +
		document.querySelector('.atvwebplayersdk-subtitle-text').textContent;

	// 現在のタイトルでスキップ処理を まだ行っていないか？
	// (短時間に連続してスキップ部分をクリックし 次のエピソードへ遷移してしまうの防ぐ)
	if (currentTitle != title) {
		skip.click();
		currentTitle = title;

		// エピソード連続視聴時を想定し 現在のタイトルを初期化する
		setTimeout(() => {
			currentTitle = null;
		}, 3000);
	}
})).observe(document.body, {
	childList: true,
	subtree: true,
});

function debounce(fn, interval = 500) {
	var timer;
	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn();
		}, interval);
	}
}

function $x(path, target) {
	return document.evaluate(
		path, target || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}