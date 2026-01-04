// ==UserScript==
// @name        pixiv Tabs Restorer
// @name:ja     pixiv タブを復活
// @description Adds “All”, “Follow”, “My pixiv”, and “Tag Index” tabs to user pages etc. and “All” and “Ugoira” tabs to search result pages.
// @description:ja ユーザーページなどに「すべて」「フォロー」「マイピク」「タグ一覧」タブを、検索結果に「すべて」「うごイラ」タブを補完します。
// @namespace   https://greasyfork.org/users/137
// @version     2.9.0
// @match       https://www.pixiv.net/*
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=895049
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @noframes
// @run-at      document-start
// @icon        https://s.pximg.net/common/images/apple-touch-icon.png
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/373026
// @downloadURL https://update.greasyfork.org/scripts/373026/pixiv%20Tabs%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/373026/pixiv%20Tabs%20Restorer.meta.js
// ==/UserScript==

// 当スクリプトはpixivが作成、配布しているアプリケーションではありません。
// <https://www.pixiv.net/terms/?page=brand>

/*global Gettext, _, waitTarget */

'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'en': {
		'すべて': 'All',
		'フォロー': 'Follow',
		'マイピク': 'My pixiv',
		'タグ一覧': 'Tag Index',
		'うごイラ': 'Ugoira',
	},
	'ko': {
		'すべて': '전체',
		'フォロー': '팔로우',
		'マイピク': '마이픽',
		'タグ一覧': '태그 목록',
		'うごイラ': '움직이는 일러스트',
	},
	'zh': {
		'すべて': '全部',
		'フォロー': '关注',
		'マイピク': '好P友',
		'タグ一覧': '标签一览',
		'うごイラ': '动图',
	},
	'zh-tw': {
		'すべて': '全部',
		'フォロー': '關注',
		'マイピク': '好P友',
		'タグ一覧': '標籤一覽',
		'うごイラ': '動圖',
	},
	/*eslint-enable quote-props, max-len */
});

const URLS_AND_LABLES = {
	search: [
		{ path: 'artworks', label: _('すべて'), position: 1 },
		{ path: 'illustrations', type: 'ugoira', label: _('うごイラ'), position: 4 },
	],
	user: [
		{ path: 'artworks', label: _('すべて'), position: 1 },
		{ path: 'following', label: _('フォロー') },
		{ path: 'mypixiv', label: _('マイピク') },
		{ path: '/member_tag_all.php?id=', label: _('タグ一覧') },
	],
};

/**
 * 各タブの共通の親要素。
 * @var {HTMLElement}
 */
let list;

/**
 * カレントタブに設定されるクラス。
 * @var {string[]}
 */
let currentTabClasses;

/**
 * @returns {HTMLAnchorElement}
 */
function getCurrentTab()
{
	return list.getElementsByClassName(currentTabClasses.join(' '))[0];
}

function markCurrentTab()
{
	const currentTab = getCurrentTab();

	const tabs = list.children;
	for (const tab of tabs) {
		if (tab.href === location.href) {
			tab.setAttribute('aria-current', 'page');
			tab.classList.add(...currentTabClasses);
		} else {
			tab.removeAttribute('aria-current');
			tab.classList.remove(...currentTabClasses);
		}
	}

	if (!list.querySelector('[aria-current]')) {
		currentTab.setAttribute('aria-current', 'page');
		currentTab.classList.add(...currentTabClasses);
	}
}

/**
 * タブを補完します。
 * @returns {void}
 */
function complete()
{
	list = document.querySelector('.__top_side_menu_body nav');
	if (!list) {
		return;
	}

	if (list.querySelector('[href*="type=ugoira"], [href*="/member_tag_all.php"]')) {
		// すでに補完済みなら
		return;
	}

	const tabs = list.children;

	if (!currentTabClasses) {
		currentTabClasses = Array.from(Array.from(list.children).find(tab => tab.classList.length >= 3).classList)
			.slice(2);
	}

	const pageType = location.pathname.startsWith('/tags/') ? 'search' : 'user';

	// 挿入するタブのテンプレートを作成
	const templateTab = tabs[pageType === 'search' ? 1 : 0].cloneNode(true);
	templateTab.removeAttribute('aria-current');
	templateTab.classList.remove(...currentTabClasses);

	for (const { path, type, label, position } of URLS_AND_LABLES[pageType]) {
		let tab;
		if (pageType === 'user' && path === 'artworks') {
			tab = document.querySelector(
				'a[href$="/artworks"]:not([href$="/bookmarks/artworks"]):not([href$="/requests/artworks"])',
			);
		}
		if (tab) {
			tab.pathname = tab.pathname.replace('/artworks', '');
			tab.classList = templateTab.classList;
		} else {
			tab = templateTab.cloneNode(true);
		}

		switch (pageType) {
			case 'search':
				tab.pathname = tab.pathname.replace(/[^/]+$/, path);
				tab.firstElementChild.textContent = label;
				if (type) {
					const param = new URLSearchParams(templateTab.search);
					param.set('type', type);
					tab.search = param;
				}
				break;

			case 'user':
				if (path === '/member_tag_all.php?id=') {
					tab.href = tab.origin + path + /[0-9]+/.exec(tab.pathname)[0];
				} else {
					tab.pathname += '/' + path;
				}
				tab.text = label;
				break;
		}
		if (position) {
			tabs[position].before(tab);
		} else {
			list.append(tab);
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const topSideMenuBody = document.getElementsByClassName('__top_side_menu_body')[0];
	if (!topSideMenuBody) {
		return;
	}

	Gettext.setLocale(document.documentElement.lang);

	addEventListener('click', async event => {
		const tab = event.target.closest('a');
		if (!tab || !tab.matches('#root > :not(header) nav > a')) {
			return;
		}

		if (event.defaultPrevented) {
			// 既存のタブ
			return;
		}

		if (tab.getAttribute('href').startsWith('/') || !location.pathname.startsWith('/tags/')
			|| location.pathname.endsWith('/novels')) {
			// 別サービスへのタブ
			return;
		}

		// イラスト検索結果ページで「すべて」「うごイラ」タブをクリックした場合
		event.preventDefault();

		const allTabClicked = tab.pathname.endsWith('/artworks');

		if (allTabClicked && /^\/tags\/[^/]+$/u.test(getCurrentTab().pathname)) {
			// 「すべて」タブを、「トップ」ページでクリックした場合
			// 「イラスト・マンガ」一覧の下の「すべて見る」ボタンをクリック
			list.parentElement.nextElementSibling.querySelector('[href^="/tags/"][href$="/artworks"]').click();
			return;
		}

		// 検索オプションボタンをクリック
		document.querySelector('[d^="M0 1C0 0.447754"]').closest('button').click();
		await waitTarget(() => document.querySelector('body > [role="presentation"]'), 1);
		const dialog = document.querySelector('body > [role="presentation"]');

		dialog.style.opacity = '0';

		// プルダウンメニューを開く
		const select = dialog.querySelector('[tabindex]');
		select.click();
		const group = select.closest('[role="group"]');
		await waitTarget(() => group.querySelector('[role="button"]'), 1);

		// 項目を選択する
		const option = group.querySelectorAll('[role="button"]')[allTabClicked ? /* すべて */0 : /* うごイラ */4];
		option.click();
		await waitTarget(() => !dialog.contains(option), 1);

		// 「適用する」ボタンを押す
		setTimeout(() => {
			dialog.querySelector('[type="submit"]').click();
		}, 100);
	});

	new MutationObserver(mutations => {
		for (const mutation of mutations) {
			const firstTabPathname = /** @type {HTMLAnchorElement|undefined} */(mutation.target.querySelector(
				'.__top_side_menu_body nav a',
			))?.pathname;
			if (!firstTabPathname) {
				continue;
			}

			if (/^\/(tags\/[^/?]+|users\/[0-9]+)$/.test(firstTabPathname)) {
				complete();
				return;
			}
		}

		if (list) {
			markCurrentTab();
		}
	}).observe(topSideMenuBody, {childList: true, subtree: true});
}, { passive: true, once: true });
