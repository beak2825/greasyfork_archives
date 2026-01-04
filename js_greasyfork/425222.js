// ==UserScript==
// @name        pixiv iOSの履歴を同期
// @description 【userChromeES】pixivプレミアム (有料会員) の閲覧履歴機能を利用し、iOSのpixivの履歴をFirefoxアカウントと同期します。
// @namespace   https://greasyfork.org/users/137
// @version     1.0.1
// @include     background
// @include     options
// @license     MPL-2.0
// @incompatible Edge
// @compatible  Firefox userChromeES用スクリプトです (※GreasemonkeyスクリプトでもuserChromeJS用スクリプトでもありません)。
// @incompatible Opera
// @incompatible Chrome
// @author      100の人
// @homepage    https://greasyfork.org/scripts/425222
// @downloadURL https://update.greasyfork.org/scripts/425222/pixiv%20iOS%E3%81%AE%E5%B1%A5%E6%AD%B4%E3%82%92%E5%90%8C%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/425222/pixiv%20iOS%E3%81%AE%E5%B1%A5%E6%AD%B4%E3%82%92%E5%90%8C%E6%9C%9F.meta.js
// ==/UserScript==

(async function () {
'use strict';

/**
 * pixivの閲覧履歴のチェック間隔 (秒数)。
 * @constant {number}
 */
const INTERVAL_SECONDS = 60;
/**
 * pixivの閲覧履歴のチェック間隔へランダムに追加する秒数の最大値。
 * @constant {number}
 */
const RANDOM_DELAY_SECONDS = 30;
/**
 * pixivの閲覧履歴を何日分までさかのぼるか。
 * @constant {number}
 */
const MAX_OFFSETS = 7;
/**
 * pixivからページタイトルを取得する間隔 (秒数)。
 * @constant {number}
 */
const FETCHING_WORK_TITLE_INTERVAL_SECONDS = 5;
/**
 * pixivからページタイトルを取得する間隔へランダムに追加する秒数の最大値。
 * @constant {number}
 */
const FETCHING_WORK_TITLE_RANDOM_DELAY_SECONDS = 5;

/**
 * スクリプトの実行に必要な権限。
 * @constant {browser.permissions.Permissions}
 */
const PERMISSIONS = {
	origins: [ 'https://www.pixiv.net/ajax/history' ],
	permissions: [ 'history' ],
};

/**
 * キーに「illust」「novel」、値に最後に閲覧したイラスト・小説のタイムスタンプ (秒数)。
 * @constant {Object.<?number>}
 */
const latestBrowsingTimestamps = { };

/**
 * 指定秒数待機します。
 * @param {number} seconds
 * @returns {Promise.<void>}
 */
function wait(seconds)
{
	return new Promise(function (resolve) {
		setTimeout(resolve, seconds * 1000);
	});
}

/**
 * pixivのAPIからデータを取得します。
 * @param {string} path
 * @returns {Promise.<object>}
 */
async function fetchData(path)
{
	return (await (await fetch('https://www.pixiv.net/ajax/' + path, { credentials: 'include' })).json()).body;
}

/**
 * 閲覧履歴を新しいものから取得します。
 * @param {string} type - 「illust」「novel」のいずれか。
 * @yields {object} 「illust_id」(小説の場合は「id」)「last_view_timestamp」プロパティを持つ、一つイラスト・小説のデータ。
 */
async function* fetchWorks(type)
{
	for (let offset = 0; offset < MAX_OFFSETS; offset++) {
		for (const work of (await fetchData('history?' + new URLSearchParams({ type, offset }))).illusts) {
			yield work;
		}
	}
}

/**
 * pixivの閲覧履歴から、Firefoxの履歴へ同期します。
 * @param {string} type - 「illust」「novel」のいずれか。
 * @returns {Promise.<void>}
 */
async function sync(type)
{
	let latestBrowsingTimestamp;
	for await (const work of fetchWorks(type)) {
		if (!latestBrowsingTimestamp) {
			latestBrowsingTimestamp = work.last_view_timestamp;
		}

		if (work.last_view_timestamp === latestBrowsingTimestamps[type]) {
			// すでに確認済みの閲覧履歴なら
			break;
		}

		const id = work[type === 'illust' ? 'illust_id' : 'id'];
		const url
			= (type === 'illust' ? 'https://www.pixiv.net/artworks/' : 'https://www.pixiv.net/novel/show.php?id=') + id;
		const visits = await browser.history.getVisits({ url });
		if (visits.some(visit => Math.abs(visit.visitTime / 1000 - work.last_view_timestamp) < 60)) {
			// 訪問日時の差が60秒以内のFirefox履歴があれば
			break;
		}

		// ページ名の取得
		let needWaiting = false;
		let title;
		if (visits.length > 0) {
			// 同一URLのFirefox履歴があれば、そちらから取得
			title = (await browser.history
				.search({ text: url, startTime: visits[0].visitTime, endTime: visits[0].visitTime }))[0].title;
		} else {
			// pixivのAPIから取得
			title = (await fetchData(type + '/' + id)).extraData.meta.title;
			needWaiting = true;
		}

		// Firefox履歴へ追加
		await browser.history.addUrl({ url, title, visitTime: work.last_view_timestamp * 1000 });

		if (needWaiting) {
			// pixivのAPIからページ名を取得した場合、遅延を設ける
			await wait(FETCHING_WORK_TITLE_INTERVAL_SECONDS + Math.random() * FETCHING_WORK_TITLE_RANDOM_DELAY_SECONDS);
		}
	}

	if (latestBrowsingTimestamp) {
		latestBrowsingTimestamps[type] = latestBrowsingTimestamp;
	}
}

/**
 * 一定間隔おきに同期を実行します。
 * @returns {void}
 */
async function repeatSync()
{
	while (true) {
		await sync('illust');
		await sync('novel');
		await wait(INTERVAL_SECONDS + Math.random() * RANDOM_DELAY_SECONDS);
	}
}

switch (location.pathname) {
	case '/background/background.xhtml':
		if (await browser.permissions.contains(PERMISSIONS)) {
			repeatSync();
		} else {
			browser.permissions.onAdded.addListener(async function onAdded() {
				if (await browser.permissions.contains(PERMISSIONS)) {
					repeatSync();
					browser.permissions.onAdded.removeListener(onAdded);
				}
			});
		}
		break;

	case '/options/options.xhtml': {
		document.body.insertAdjacentHTML('beforeend', `<article>
			<h1>Pixiv History Sync from iOS</h1>
			<button type="button">ブラウザへ必要な許可を要求</button>
		</article>`);
		const section = document.body.lastElementChild;
		const button = section.getElementsByTagName('button')[0];

		function disable()
		{
			button.textContent = '必要な許可を取得済み';
			button.disabled = true;
		}

		if (await browser.permissions.contains(PERMISSIONS)) {
			disable();
		} else {
			button.addEventListener('click', async function onClick() {
				if (await browser.permissions.request(PERMISSIONS)) {
					disable();
				}
			});
		}

		break;
	}
}

})();
