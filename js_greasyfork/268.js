// ==UserScript==
// @name        Append Tag Searching Tub
// @name:ja     niconico タグ検索タブを追加
// @description Adds “Keyword”, “Tags”, “My List”, “Images” and “Live” search tabs to all of the Niconico search boxes.
// @description:ja 『ニコニコ』各サービスの検索窓について、「キーワード」「タグ」「マイリスト」「静画」「生放送」検索タブが5つとも含まれるように補完します。
// @namespace   http://loda.jp/script/
// @version     5.3.0
// @match       https://www.nicovideo.jp/
// @match       https://www.nicovideo.jp/?*
// @match       https://www.nicovideo.jp/#*
// @match       https://www.nicovideo.jp/tag/*
// @match       https://www.nicovideo.jp/related_tag/*
// @match       https://www.nicovideo.jp/mylist*
// @match       https://www.nicovideo.jp/search/*
// @match       https://seiga.nicovideo.jp/*
// @match       https://live.nicovideo.jp/*
// @match       https://com.nicovideo.jp/*
// @match       *://blog.nicovideo.jp/en_info/*
// @match       *://tw.blog.nicovideo.jp/*
// @require     https://gitcdn.xyz/cdn/greasemonkey/gm4-polyfill/a834d46afcc7d6f6297829876423f58bb14a0d97/gm4-polyfill.js
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=868689
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge
// @compatible  Firefox 推奨 / Recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @connect     www.nicovideo.jp
// @run-at      document-start
// @icon        https://nicovideo.cdn.nimg.jp/uni/images/favicon/144.png
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/268
// @downloadURL https://update.greasyfork.org/scripts/268/Append%20Tag%20Searching%20Tub.user.js
// @updateURL https://update.greasyfork.org/scripts/268/Append%20Tag%20Searching%20Tub.meta.js
// ==/UserScript==

'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'en': {
		'キーワード': 'Keyword',
		'動画をキーワードで検索': 'Search Video by Keyword',
		'タグ': 'Tags',
		'動画をタグで検索': 'Search Video by Tag',
		'マイリスト': 'My List',
		'マイリストを検索': 'Search My List',
		'静画': 'Images',
		'静画を検索': 'Search Images',
		'生放送': 'Live',
		'番組を探す': 'Search Live Program',
		'マンガ': 'Comics',
	},
	'zh': {
		'キーワード': '關鍵字',
		'動画をキーワードで検索': '',
		'タグ': '標籤',
		'動画をタグで検索': '',
		'マイリスト': '我的清單',
		'マイリストを検索': '搜尋我的清單',
		'静画': '靜畫',
		'静画を検索': '搜尋靜畫',
		'生放送': '生放送',
		'番組を探す': '搜尋節目',
		'マンガ': '漫畫',
	},
	/*eslint-enable quote-props, max-len */
});



/**
 * 追加したタブバーから新しいタブで検索結果を開いたとき、選択中のタブを元に戻す遅延時間 (ミリ秒)。
 * @constant {number}
 */
const CURRENT_TAB_RESTORATION_DELAY = 1000;

/**
 * 表示しているページの種類。
 * @type {string}
 */
let pageType;

// ページの種類を取得
switch (location.host) {
	case 'www.nicovideo.jp':
		if (location.pathname === '/') {
			// 総合トップページ
			pageType = 'top';
		} else if (location.pathname.startsWith('/search/')) {
			// 動画キーワード検索ページ
			pageType = 'videoSearch';
		} else if (location.pathname.startsWith('/mylist_search')) {
			// マイリスト検索ページ
			pageType = 'mylist';
		} else if (/^\/(?:(?:tag|related_tag)\/|(?:mylist|recent|newarrival|openlist|video_catalog)(?:\/|$))/
			.test(location.pathname)) {
			// 動画タグ検索ページと公開マイリスト等
			pageType = 'tag';
		} else if (location.pathname.startsWith('/user/')) {
			// ユーザーページ
			pageType = 'user';
		}
		break;
	case 'seiga.nicovideo.jp':
		pageType = location.pathname.startsWith('/search/')
			// 静画検索ページ
			? 'imageSearch'
			// 静画ページ
			: 'image';
		break;
	case 'live.nicovideo.jp':
		pageType = location.pathname.startsWith('/search')
			// 生放送検索ページ
			? 'liveSearch'
			// 生放送ページ
			: 'live';
		break;
	case 'blog.nicovideo.jp':
		// 英語版ニコニコインフォ
		pageType = 'info_en';
		break;
	case 'tw.blog.nicovideo.jp':
		// 台湾版ニコニコインフォ
		pageType = 'info_tw';
		break;
}

waitTarget(() => document.documentElement).then(function () {
	Gettext.setLocale(document.documentElement.lang);
});

if (pageType.startsWith('info_')) {
	// 英語版、または台湾版のニコニコインフォなら
	waitTarget(() => document.getElementById('siteHeaderLeftMenu')).then(function () {
		// 生放送へのリンクを取得
		const itemLive = document.querySelector('#siteHeader [href*="://live.nicovideo.jp/"]').parentElement;
		// 生放送リンクの複製
		const item = itemLive.cloneNode(true);
		// リンク文字を変更
		item.getElementsByTagName('span')[0].textContent = _('静画');
		// アドレスを変更
		item.getElementsByTagName('a')[0].href = 'https://seiga.nicovideo.jp/';
		// ヘッダに静画へのリンクを追加
		itemLive.before(item);
	});
} else {
	// ページの種類別に、実行する関数を切り替える。
	switch (pageType) {
		case 'videoSearch': // 動画キーワード
		case 'mylist': // マイリスト
			waitTarget(() => document.getElementById('search_united_form')).then(addTagSearchTabAboveSearchBox);
			break;

		case 'top':
			// トップページ
			addTagSearchButtonToTopPage();
			break;

		case 'imageSearch':
			// 静画キーワード
			waitTarget(() => document.getElementById('usearch_form_input')).then(addTagSearchTabAboveSearchBox);
			break;

		case 'image':
			// 静画
			waitTarget(() => document.getElementById('search_button')).then(careteTabsBarToSearchBox);
			break;

		case 'liveSearch': {
			// 生放送キーワード
			const forms = document.getElementsByClassName('search-form');
			waitTarget(() => forms[0]).then(addTagSearchTabAboveSearchBox);
			break;
		}
		case 'live': {
			// 生放送
			const words = document.getElementsByClassName('search_word');
			waitTarget(() => words[0]).then(careteTabsBarToSearchBox);
			break;
		}

		case 'tag':
			if (document.doctype.publicId) {
				// 公開マイリスト等
				waitTarget(() => document.getElementById('target_m')).then(addOtherServiceTabsAboveSearchBox);
			} else {
				// 動画タグ
				const mylists = document.getElementsByClassName('optMylist');
				waitTarget(() => mylists[0]).then(addOtherServiceTabsAboveSearchBox);
			}
			break;

		case 'user': {
			// ユーザー
			const outers = document.getElementsByClassName('optionOuter');
			waitTarget(() => outers[0]).then(addImageLinkToUserPageMenu);
			break;
		}
	}
}
	



/**
 * 各サービスのキーワード検索ページの検索窓に、動画の「タグ」検索タブを追加する。
 */
function addTagSearchTabAboveSearchBox()
{
	// マイリスト検索タブの取得
	const mylistTab = document.querySelector('.tab_table td:nth-of-type(2), #search_frm_a a:nth-of-type(2), .search_tab_list li:nth-of-type(2), .seachFormA a:nth-of-type(2), li:nth-of-type(2).search-tab-item');

	// マイリスト検索タブの複製
	const tagTab = mylistTab.cloneNode(true);

	// タブ名を変更
	const anchor = tagTab.tagName.toLowerCase() === 'a' ? tagTab : tagTab.getElementsByTagName('a')[0];
	let tabNameNode = anchor.getElementsByTagName('div');
	tabNameNode = (tabNameNode.length > 0 ? tabNameNode[0].firstChild : anchor.firstChild);
	tabNameNode.data = _('タグ') + (pageType === 'liveSearch' ? '' : ' ( ');

	// クラス名を変更・動画件数をリセット
	const searchCount = tagTab.querySelector('strong, span');
	switch (pageType) {
		case 'videoSearch':
			searchCount.classList.remove('more');
			break;
		case 'mylist':
			searchCount.style.removeProperty('color');
			break;
		case 'imageSearch':
			searchCount.classList.remove('search_value_em');
			searchCount.classList.add('search_value');
			break;
	}
	searchCount.textContent = '-';

	if (searchCount.id) {
		// 生放送
		searchCount.id = 'search_count_tag';
	}

	// 検索語句を取得
	const searchWordsPattern = /(?:\/(?:search|tag|mylist_search)\/|[?&]keyword=)([^?&#]+)/g;
	const result = location.href.match(searchWordsPattern);
	const searchWords
		= result ? searchWordsPattern.exec(result[pageType === 'liveSearch' ? result.length - 1 : 0])[1] : '';

	// タグが付いた動画件数を取得・表示
	if (searchWords && location.host !== 'www.live.nicovideo.jp') {
		GM.xmlHttpRequest({
			method: 'GET',
			url: 'https://www.nicovideo.jp/tag/' + searchWords,
			onload: function (response) {
				const responseDocument = new DOMParser().parseFromString(response.responseText, 'text/html');
				const total = responseDocument.querySelector('.tagCaption .dataValue .num').textContent;

				const trimmedThousandsSep = total.replace(/,/g, '');
				if (trimmedThousandsSep >= 100) {
					// 動画件数が100件を超えていれば
					switch (pageType) {
						case 'videoSearch':
							searchCount.classList.add('more');
							break;
						case 'mylist':
							searchCount.style.color = '#CC0000';
							break;
						case 'imageSearch':
							searchCount.classList.remove('search_value');
							searchCount.classList.add('search_value_em');
							break;
						case 'liveSearch':
							searchCount.classList.add('strong');
							break;
					}
				}

				switch (pageType) {
					case 'mylist':
						searchCount.textContent = ' ' + total + ' ';
						break;
					case 'videoSearch':
					case 'imageSearch':
						searchCount.textContent = total;
						break;
					case 'liveSearch':
						searchCount.textContent = trimmedThousandsSep;
						break;
				}
			},
		});
	}

	// 非アクティブタブを取得
	const inactiveTab = document.querySelector('.tab_0, .tab1, .search_tab_list a:not(.active), .search-tab-anchor');

	// クラス名を変更
	anchor.className = inactiveTab.className;

	// アドレスを変更
	anchor.href = 'https://www.nicovideo.jp/tag/' + searchWords + inactiveTab.search;

	// タグ検索タブを追加
	mylistTab.parentNode.insertBefore(tagTab, mylistTab);
	if (pageType === 'liveSearch') {
		mylistTab.parentNode.insertBefore(new Text(' '), mylistTab);
	} else if (inactiveTab.classList.contains('tab1')) {
		// GINZAバージョン
		mylistTab.parentNode.insertBefore(tagTab.previousSibling.cloneNode(true), mylistTab);
	}
}



/**
 * ニコニコ動画の上部に表示されている検索窓に、「静画」「生放送」を検索するタブを追加する。
 */
function addOtherServiceTabsAboveSearchBox()
{
	// スタイルの設定
	document.head.insertAdjacentHTML('beforeend', `<style>
		:root {
			--max-search-box-width: 268px;
		}
		#PAGEHEADER > div {
			display: flex;
		}
		#head_search {
			max-width: var(--max-search-box-width);
			flex-grow: 1;
		}
		#search_input {
			width: 100%;
			display: flex;
		}
		#search_input .typeText {
			flex-grow: 1;
		}
		#head_ads {
			margin-right: -26px;
		}
		#search_input #bar_search {
			box-sizing: border-box;
			width: 100% !important;
		}
		/*====================================
			GINZAバージョン
		*/
		.siteHeader > .inner {
			display: flex;
		}
		.videoSearch {
			max-width: var(--max-search-box-width);
			flex-grow: 1;
			padding-left: 4px;
			padding-right: 4px;
		}
		.videoSearchOption {
			display: flex;
			white-space: nowrap;
		}
		.videoSearch form {
			display: flex;
		}
		.videoSearch form .inputText {
			flex-grow: 1;
		}
		/*------------------------------------
			×ボタン
		*/
		.clear-button-inner-tag {
			left: initial;
			right: 3px;
		}
	</style>`);

	// タブリストの取得
	const mylistTab = document.querySelector('#target_t, .optMylist');

	// タブの複製・追加
	mylistTab.parentElement.append(...[
		{
			type: 'image',
			title: _('静画を検索'),
			url: 'https://seiga.nicovideo.jp/search',
			text: _('静画'),
		},
		{
			type: 'live',
			title: _('番組を探す'),
			url: 'https://live.nicovideo.jp/search',
			text: _('生放送'),
		},
	].map(function (option) {
		const tab = mylistTab.cloneNode(true);
		if (mylistTab.classList.contains('optMylist')) {
			// GINZAバージョン
			tab.classList.remove('optMylist');
			tab.classList.add('opt' + option.type[0].toUpperCase() + option.type.slice(1));
			tab.dataset.type = option.type;
			tab.getElementsByTagName('a')[0].textContent = option.text;
		} else {
			// 公開マイリスト等
			tab.id = 'target_' + option.type[0];
			tab.title = option.title;
			tab.setAttribute('onclick', tab.getAttribute('onclick').replace(/'.+?'/, '\'' + option.url + '\''));
			tab.textContent = option.text;
		}
		return tab;
	}));

	GreasemonkeyUtils.executeOnUnsafeContext(/* global Nico */ function () {
		eval('Nico.Navigation.HeaderSearch.Controller.search = '
			+ Nico.Navigation.HeaderSearch.Controller.search.toString().replace(/(switch.+?{[^}]+)/, `$1;
					break;
				case "image":
					d = "https://seiga.nicovideo.jp/search/" + e;
					break;
				case "live":
					d = "https://live.nicovideo.jp/search/" + e;
					break;
			`));
	});
}



/**
 * 静画・生放送の上部に表示されている検索窓に、「動画キーワード」「動画タグ」「マイリスト」「静画」「生放送」を検索するタブバーを設置する。
 */
function careteTabsBarToSearchBox()
{
	// スタイルの設定
	document.head.insertAdjacentHTML('beforeend', `<style>
		#sg_search_box {
			/* 静画 */
			margin-top: 0.2em;
		}
		#live_header div.score_search {	/* 生放送マイページ向けに詳細度を大きくしている */
			/* 生放送 */
			top: initial;
		}
		/*------------------------------------
			タブバー
		*/
		[action$="search"] > ul {
			display: flex;
			/* 生放送 */
			font-size: 12px;
		}
		/* 静画 */
		#head_search_form > ul {
			margin-left: 1.3em;
			/* マンガ・電子書籍 */
			line-height: 1.4em;
		}
		#head_search_form > ul:hover ~ .search_form_text {
			border-color: #999;
		}
		/*------------------------------------
			タブ
		*/
		[action$="search"] > ul > li {
			margin-left: 0.2em;
			white-space: nowrap;
		}
		[action$="search"] > ul > li > a {
			background: lightgrey;
			padding: 0.2em 0.3em 0.1em;
			color: inherit;
			/* 生放送 */
			text-decoration: none;
		}
		#head_search_form > ul > li > a:hover {
			/* 静画 */
			text-decoration: none;
		}
		/*------------------------------------
			選択中のタブ
		*/
		[action$="search"] > ul > li.current > a {
			color: white;
			background: dimgray;
		}
	</style>`);

	/**
	 * 静画検索のtargetパラメータの値。
	 * @type {string}
	 */
	let imageSearchParamValue = 'illust';

	const form = document.querySelector('[action$="search"]');
	const textField = form[pageType === 'image' ? 'q' : 'keyword'];

	if (pageType === 'image') {
		// 静画の場合
		const pathnameParts = document.querySelector('#logo > h1 > a').pathname.split('/');
		switch (pathnameParts[1]) {
			case 'manga':
				imageSearchParamValue = 'manga';
				break;
			case 'book':
				imageSearchParamValue = pathnameParts[2] === 'r18' ? 'book_r18' : 'book';
				break;
		}
	}

	form.insertAdjacentHTML('afterbegin', `<ul>
		<li>
			<a href="https://www.nicovideo.jp/search/" title="${h(_('動画をキーワードで検索'))}">${h(_('キーワード'))}</a>
		</li>
		<li>
			<a href="https://www.nicovideo.jp/tag/" title="${h(_('動画をタグで検索'))}">${h(_('タグ'))}</a>
		</li>
		<li>
			<a href="https://www.nicovideo.jp/mylist_search/" title="${h(_('マイリストを検索'))}">${h(_('マイリスト'))}</a>
		</li>
		<li${pageType === 'image' ? ' class="current"' : ''}>
			<a href="https://seiga.nicovideo.jp/search/?target=${imageSearchParamValue}"
				title="${h(textField.defaultValue)}">${h(_('静画'))}</a>
		</li>
		<li${pageType === 'live' ? ' class="current"' : ''}>
			<a href="https://live.nicovideo.jp/search/" title="' + h(_('番組を探す')) + '">${h(_('生放送'))}</a>
		</li>
	</ul>`);

	const defaultCurrentTabAnchor = form.querySelector('.current a');

	document.addEventListener('click', function (event) {
		if (event.button !== 2 && event.target.matches('[action$="search"] > ul > li > a')) {
			// タブが副ボタン以外でクリックされたとき
			let searchWord = textField.value.trim();
			if (pageType === 'image' && textField.value === textField.defaultValue) {
				// 静画の場合、検索窓の値が既定値と一致していれば空欄とみなす
				searchWord = '';
			}
			if (searchWord) {
				// 検索語句が入力されていれば
				switchTab(event.target);
				event.target.pathname = event.target.pathname.replace(/[^/]*$/, encodeURIComponent(searchWord));
				setTimeout(function () {
					// リンク先を新しいタブで開いたとき
					switchTab(defaultCurrentTabAnchor);
				}, CURRENT_TAB_RESTORATION_DELAY);
			} else {
				// 検索語句が未入力なら
				event.preventDefault();
				if (event.button === 0) {
					// 主ボタンでクリックされていれば
					switchTab(event.target);
				}
			}
		}
	});

	// TabSubmitをインストールしているとマウスボタンを取得できず、中クリック時にも同じタブで検索してしまうため分割
	form.addEventListener('click', function (event) {
		if (event.target.type === (pageType === 'image' ? 'image' : 'submit')) {
			// 送信ボタンをクリックしたとき
			const searchWord = textField.value !== textField.defaultValue && textField.value.trim();
			if (searchWord) {
				event.stopPropagation();
				event.preventDefault();
				const anchor = form.querySelector('.current a');
				anchor.pathname = anchor.pathname.replace(/[^/]*$/, encodeURIComponent(searchWord));
				location.assign(anchor.href);
			}
		}
	}, true);

	addEventListener('pageshow', function (event) {
		if (event.persisted) {
			// 履歴にキャッシュされたページを再表示したとき
			switchTab(defaultCurrentTabAnchor);
		}
	});

	/**
	 * 選択しているタブを切り替える。
	 * @param {HTMLAnchorElement} target - 切り替え先のタブのリンク。
	 */
	function switchTab(target) {
		form.getElementsByClassName('current')[0].classList.remove('current');
		target.parentElement.classList.add('current');
		if (pageType === 'image') {
			// 静画
			if (textField.defaultValue === textField.value) {
				// 検索語句が未入力なら
				textField.defaultValue = textField.value = target.title;
			} else {
				// 検索語句が入力されていれば
				textField.defaultValue = target.title;
			}
		} else {
			// 生放送
			textField.placeholder = target.title;
		}
	}
}



/**
 * 総合トップページの検索窓に、動画「タブ」「マイリスト」検索ボタンを追加する。
 */
function addTagSearchButtonToTopPage()
{
	// スタイルの設定
	document.head.insertAdjacentHTML('beforeend', `<style>
		.CrossSearch {
			display: flex;
			margin-right: 1em;
		}
		.CrossSearch-services {
			display: flex;
		}
		.CrossSearch-service {
			width: unset;
			padding: 0 0.5em;
			white-space: nowrap;
		}
		.CrossSearch-form {
			width: unset;
		}
	</style>`);

	// 静画検索ボタンの取得
	const refItem = document.querySelector('.CrossSearch-service[data-service="seiga"]');

	const tagItem = refItem.cloneNode(true);
	tagItem.textContent = _('タグ');
	tagItem.dataset.service = 'tag';
	tagItem.dataset.baseUrl = 'https://www.nicovideo.jp/tag/';
	refItem.before(tagItem);

	const mylist = refItem.cloneNode(true);
	mylist.textContent = _('マイリスト');
	mylist.dataset.service = 'mylist';
	mylist.dataset.baseUrl = 'https://www.nicovideo.jp/mylist_search/';
	refItem.before(mylist);
}



/**
 * ユーザーページ左側のメニューに、静画へのリンクを追加する。
 */
function addImageLinkToUserPageMenu()
{
	// スタイルの設定
	document.head.insertAdjacentHTML('beforeend', `<style>
		.sidebar ul li.imageTab a span {
			width: 22px;
			height: 20px;
			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAQAAAAjdQW7AAAA/ElEQVQoz9WRzU3EMBCFv3EibRN2CyDtLiJJIRSSQlIIhSQgscDWYDeBhGc4ZJf87YErzwdr5M9vnmbEmCvz2FudMQSG12a3eBWbgcdOKgt4wwBJxM/mJnzorNKAX3Y6y7wqL+iz1uZ1ATocS5UjmmtbeQqSXGT1nX2Xa/WKzQ5IcsNbs3LOWDW5yu/t4umJdYxjr0EnJElUNIjXxEal1mPbMVPBqYG7aOC/2K1gl9FZUuXQ3/dKRsNDt3G2xf7M6zW/F8+t0V1l5KlIbFKXJRldZ0OSG97bDVwMBPF5WgWSJPJybrfTEGPffft8mYhQQPpoC25JjL/L8f/gH1eMbYCeUydgAAAAAElFTkSuQmCC");
		}
	</style>`);

	const nextItem = document.getElementsByClassName('stampTab')[0];

	const item = nextItem.cloneNode(true);
	const classList = item.classList;
	classList.remove('stampTab', 'active');
	classList.add('imageTab');
	const anchor = item.getElementsByTagName('a')[0];
	anchor.href = 'https://seiga.nicovideo.jp/user/illust/' + /[0-9]+/.exec(anchor.pathname)[0];
	anchor.lastChild.data = _('静画');

	nextItem.prepend(item);
}
