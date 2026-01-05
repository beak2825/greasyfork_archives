// ==UserScript==
// @name        pixiv タグクラウドからピックアップ
// @name:ja     pixiv タグクラウドからピックアップ
// @name:en     pixiv Tag Cloud Prioritizer
// @description Restores the tag cloud (illustration or novel tags column), and if there are tags attached to a work, this script brings those tags to the top of the tag cloud (illustration tags column).
// @description:ja 作品ページへタグクラウド (作品タグ・小説タグ) を復活させ、閲覧中の作品についているタグと同じものをピックアップします。
// @namespace   https://userscripts.org/users/347021
// @version     3.2.0
// @match       https://www.pixiv.net/*
// @require     https://gitcdn.xyz/cdn/greasemonkey/gm4-polyfill/a834d46afcc7d6f6297829876423f58bb14a0d97/gm4-polyfill.js
// @require     https://unpkg.com/compare-versions@5.0.1/lib/umd/index.js
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=752462
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge 最新安定版 / Latest stable
// @compatible  Firefox 推奨 (Recommended)
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @grant       GM.listValues
// @grant       GM_listValues
// @noframes
// @run-at      document-end
// @icon        https://www.pixiv.net/favicon.ico
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/262
// @downloadURL https://update.greasyfork.org/scripts/262/pixiv%20%E3%82%BF%E3%82%B0%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%8B%E3%82%89%E3%83%94%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/262/pixiv%20%E3%82%BF%E3%82%B0%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%8B%E3%82%89%E3%83%94%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97.meta.js
// ==/UserScript==
/*global compareVersions, h, DateUtils */

'use strict';

/**
 * タグ一覧ページをキャッシュしておく期間 (秒数)。
 * @constant {number}
 */
const CACHE_LIFETIME = 24 * 60 * 60;

/**
 * @typedef {Object} TagsData
 * @property {HTMLDivElement} tagCloudSection - タグクラウド。
 * @property {Object.<number>} tagsAndCounts - タグをキー、タグの出現数を値に持つ連想配列。
 */

if (typeof content !== 'undefined') {
	// For Greasemonkey 4
	XMLHttpRequest = content.XMLHttpRequest.bind(content); //eslint-disable-line no-global-assign, no-native-reassign, no-undef, max-len
}

/**
 * 小説ページなら真。
 * @type {boolean}
 */
const novel = location.pathname.startsWith('/novel/');

/**
 * 取得済みのタグクラウド。
 *
 * キーにユーザーID (小説ページなら「-novel」を後置) を持つ。
 * @type {Object.<TagsData>}
 */
const tagsDataList = {};

/** @type {string} */
let previousWorkId;

new MutationObserver(async function (mutations) {
	if (mutations.every(mutation => mutation.addedNodes.length === 0)) {
		return;
	}

	const nodeBeforeInsertionPoint = getNodeBeforeInsertionPoint();
	if (!nodeBeforeInsertionPoint) {
		return;
	}

	const workId = getWorkId();

	if (novel) {
		const tag = document.querySelector('section [href*="/novels/"]');
		if (tag) {
			const section = tag.closest('section');
			if (section && !section.hidden) {
				// 小説ページにもともと含まれる「作者の作品タグ」を非表示に (削除するとページ移動時にエラー発生)
				section.hidden = true;
			}
		}
	}

	if (previousWorkId) {
		if (previousWorkId === workId) {
			// 前回のタグクラウド挿入からからページを移動していなければ
			return;
		}
		previousWorkId = workId;
	} else {
		// 現在のページセッションで初回の実行なら
		previousWorkId = workId;
		await addStyleSheet();
		await cleanTagsData();

		if (previousWorkId !== workId) {
			// 初期処理中に別のページへ移動していたら
			return;
		}
	}

	const userId = getUserId();
	const userIdWithSuffix = userId + (novel ? '-novel' : '');
	if (!tagsDataList[userIdWithSuffix]) {
		// 現在のページセッションで取得を行っていないユーザーのタグクラウドなら
		tagsDataList[userIdWithSuffix] = await getTagsData(userId);

		if (previousWorkId !== workId) {
			// 取得処理中に別のページへ移動していたら
			return;
		}
	}

	const tagCloudSection = createTagCloudSection(tagsDataList[userIdWithSuffix]);
	const previousTagCloudSection = getInsertedTagCloudSection();
	if (previousTagCloudSection) {
		previousTagCloudSection.replaceWith(tagCloudSection);
	} else {
		nodeBeforeInsertionPoint.after(tagCloudSection);
	}
}).observe(document.getElementsByClassName('__top_side_menu_body')[0], { childList: true, subtree: true });

async function cleanTagsData()
{
	let version = await GM.getValue('version'); // v2.13.0以降
	let nextCleaningDate = await GM.getValue('next-cleaning-date'); // v1.1.0以降
	if (version && compareVersions.compare(version, '3.1.1', '>') && nextCleaningDate) {
		if (new Date(nextCleaningDate).getTime() < Date.now()) {
			// 予定時刻を過ぎていれば、古いキャッシュを削除
			for (const name of await GM.listValues()) {
				if (/-(?:tags|expire)$/.test(name)) {
					// バージョン2.2.0以前で生成されたデータの削除
					await GM.deleteValue(name);
					continue;
				}
				if (!/^[0-9]+(?:-novel)?$/.test(name)) {
					continue;
				}
				const data = await GM.getValue(name);
				if (new Date(data.expire).getTime() < Date.now()) {
					// キャッシュの有効期限が切れていれば
					await GM.deleteValue(name);
				}
			}
			nextCleaningDate = null;
		}
	} else {
		// v3.1.1以前に生成されたデータの削除
		await Promise.all((await GM.listValues()).map(GM.deleteValue));
		version = null;
	}
	if (!version || version !== GM.info.script.version) {
		await GM.setValue('version', GM.info.script.version);
	}
	if (!nextCleaningDate) {
		await GM.setValue(
			'next-cleaning-date',
			new Date(Date.now() + CACHE_LIFETIME * DateUtils.SECONDS_TO_MILISECONDS).toISOString()
		);
	}
}

/**
 * 「前後の作品」セクションを取得します。
 * @returns {?Node}
 */
function getNodeBeforeInsertionPoint()
{
	const a = document.querySelector(`main + aside section header [href$="/${novel ? 'novels' : 'artworks'}"]`);
	if (!a) {
		return;
	}

	return a.closest('section');
}

/**
 * 挿入済みのタグクラウドを取得します。
 * @returns {?HTMLElement}
 */
function getInsertedTagCloudSection()
{
	return document.getElementsByClassName('area_new')[0];
}

async function addStyleSheet()
{
	let tagCloudStyles = await GM.getValue('tag-cloud-styles');
	if (!tagCloudStyles) {
		tagCloudStyles = (await (await fetch('https://s.pximg.net/www/css/global.css')).text())
			.match(/^(?:\.area_(?:new|title|inside)|\.view_mypixiv|ul\.tagCloud) .+?$/umg).join('\n');
		GM.setValue('tag-cloud-styles', tagCloudStyles);
	}
	document.head.insertAdjacentHTML('beforeend', h`<style>
		${tagCloudStyles}
		.area_new {
			width: unset;
			margin: 16px;
		}
		.tagCloud {
			padding: 0;
		}
		.tagCloud .last-current-tag::after {
			content: "";
			display: inline-block;
			height: 18px;
			border-right: solid 1px #999;
			width: 10px;
			margin-bottom: -3px;
			-webkit-transform: rotate(0.3rad);
			transform: rotate(0.3rad);
		}
	`);
}

/**
 * ページへ挿入するタグクラウドを構築します。
 * @param {TagsData} tagsData
 * @returns {HTMLElement}
 */
function createTagCloudSection(tagsData)
{
	const tagCloudSection = tagsData.tagCloudSection.cloneNode(true);

	/** @type {HTMLUListElement} */
	const tagCloud = tagCloudSection.getElementsByClassName('tagCloud')[0];

	let tagCloudItemTemplate;
	let tagCloudItemTemplateAnchor;

	const currentTags = [];

	// 表示している作品のタグを取得する
	for (const tagItem of document.querySelectorAll('footer ul a')) {
		/**
		 * RFC 3986にもとづいてパーセント符号化されたタグ。
		 * @type {string}
		 */
		const urlencodedTag = tagItem.pathname.split('/')[2];

		let tagCloudItem;

		const anchor = tagCloud.querySelector('[href$="/' + urlencodedTag + '"]');
		if (anchor) {
			// タグクラウドに同じタグが存在すれば、抜き出す
			tagCloudItem = anchor.parentElement;
		} else {
			// 存在しなければ、もっとも出現度の低いタグとして追加
			if (!tagCloudItemTemplate) {
				tagCloudItemTemplate = tagCloud.firstElementChild.cloneNode(true);
				tagCloudItemTemplate.className = 'level6';
				tagCloudItemTemplateAnchor = tagCloudItemTemplate.firstElementChild;
			}

			tagCloudItemTemplateAnchor.pathname = tagCloudItemTemplateAnchor.pathname.replace(/[^/]+$/, urlencodedTag);
			const tag = tagItem.textContent;
			tagCloudItemTemplateAnchor.text = tag;
			if (tag in tagsData.tagsAndCounts) {
				// タグの数を表示
				tagCloudItemTemplateAnchor
					.insertAdjacentHTML('beforeend', `<span class="cnt">(${tagsData.tagsAndCounts[tag]})</span>`);
			}
			tagCloudItem = tagCloudItemTemplate.cloneNode(true);
		}

		currentTags.push(' ', tagCloudItem);
	}

	// 表示している作品のタグとそれ以外のタグとの区切りを示すクラスを設定
	currentTags[currentTags.length - 1].classList.add('last-current-tag');

	// タグクラウドの先頭に挿入
	tagCloud.prepend(...currentTags);

	return tagCloudSection;
}

/**
 * ブックマークボタンから、表示している作品のIDを取得します。
 *
 * - 関連作品から別ユーザーの作品ページに移動する際、URLはページの内容に先行して替わる
 * - 同じユーザーの作品間で移動する場合、「前後の作品」セクションはタグに先行して切り替わる
 * @param {HTMLElement} otherWorksSection
 * @throws {Error} 作品のIDが取得できなかったとき。
 * @returns {string}
 */
function getWorkId()
{
	const id = new URLSearchParams(document.querySelector('[href*="/bookmark_detail.php"]').search)
		.get(novel ? 'id' : 'illust_id');
	if (!id) {
		throw new Error('作品のIDを取得できません。');
	}
	return id;
}

/**
 * タグ下部のアイコンのリンクから、表示している作品の作者のユーザーIDを取得します。
 *
 * - 関連作品から別ユーザーの作品ページに移動する際、タグは「前後の作品」セクションに先行して切り替わる
 * @returns {string}
 */
function getUserId()
{
	// [href*="/users/"] のみだと、自分のアカウントのリンク、およびキャプションにユーザーへのリンクがある場合、それを拾ってしまう
	return document.querySelector('[href*="/users/"]:has([role="img"])').pathname.replace('/users/', '');
}

/**
 * 指定したユーザーのタグクラウド、および出現数が2回以上のタグ一覧を取得します。
 * @param {string} userId
 * @returns {Promise.<TagsData>}
 */
async function getTagsData(userId)
{
	const serializedTagsData = await GM.getValue(userId);
	if (serializedTagsData && new Date(serializedTagsData.expire).getTime() > Date.now()) {
		const body = document.implementation.createHTMLDocument().body;
		body.innerHTML = serializedTagsData.tagCloudSection;
		return { tagCloudSection: body.firstElementChild, tagsAndCounts: serializedTagsData.tagsAndCounts };
	}
	return getTagsDataFromPage(userId);
}

/**
 * 指定したユーザーのタグクラウド、および出現数が2回以上のタグ一覧をページから取得し、キャッシュとして保存します。
 * @param {string} userId
 * @returns {Promise.<TagsData>}
 */
function getTagsDataFromPage(userId)
{
	return new Promise(function (resolve) {
		const client = new XMLHttpRequest();
		client.open('GET', new URL((novel ? '/novel' : '') + '/member_tag_all.php?id=' + userId, location));
		client.responseType = 'document';
		client.addEventListener('load', function (event) {
			const doc = event.target.response;

			const tagCloudSection = doc.getElementsByClassName(novel
				? 'area_new'
				: /* class="area_new promotion-comic" の回避 */'user-tags')[0];
			const tagCouldAnchors = {};
			for (const anchor of tagCloudSection.querySelectorAll('li a')) {
				tagCouldAnchors[anchor.firstChild.data] = anchor;
			}

			const counts = doc.querySelectorAll('.tag-list > dt');
			const tagsAndCounts = {};
			for (const dt of counts) {
				const count = Number.parseInt(dt.textContent);
				for (const anchor of dt.nextElementSibling.getElementsByTagName('a')) {
					const tag = anchor.text;
					if (count > 1) {
						tagsAndCounts[tag] = count;
					}

					// タグクラウドのリンクが旧URLになっている不具合を修正
					if (tag in tagCouldAnchors) {
						tagCouldAnchors[tag].href = anchor;
					}
				}
			}

			GM.setValue(userId + (novel ? '-novel' : ''), {
				expire: new Date(Date.now() + CACHE_LIFETIME * DateUtils.SECONDS_TO_MILISECONDS).toISOString(),
				tagCloudSection: tagCloudSection.outerHTML,
				tagsAndCounts,
			});

			resolve({ tagCloudSection, tagsAndCounts });
		});
		client.send();
	});
}
