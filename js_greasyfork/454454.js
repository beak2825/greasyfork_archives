// ==UserScript==
// @name         Amazon Prime - Hide Store Videos
// @description  Amazon Prime - Hide Store Videos.
// @version      0.3
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @include      https://www.amazon.*/gp/video/*
// @include      https://www.amazon.*/Amazon-Video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @downloadURL https://update.greasyfork.org/scripts/454454/Amazon%20Prime%20-%20Hide%20Store%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/454454/Amazon%20Prime%20-%20Hide%20Store%20Videos.meta.js
// ==/UserScript==

const PRIME_TEXT = 'プライム';
const OKS = [/セール/, /(続けて|ウォッチリスト|近日公開|カテゴリー)/];
const NGS = [];

const observer = new IntersectionObserver(([e]) => {
	if (!e.intersectionRect.height)
		return;

	e.target.click();
});

function patch() {
	Array.from(document.querySelectorAll('div.tst-collection')).forEach(row => {
		const title = row.querySelector('h2')?.textContent;
		if (title && !OKS.some(re => re.test(title)) && (
			NGS.some(re => re.test(title)) ||
			!row.querySelector(`img[alt="${PRIME_TEXT}"]`)
		))
			row.remove();
	});

	const next = document.querySelector('a.tst-pagination');
	if (next) {
		observer.disconnect();
		observer.observe(next);
	}
}

new MutationObserver(patch).observe(document.body, {
	childList: true,
	subtree: true,
});

patch();