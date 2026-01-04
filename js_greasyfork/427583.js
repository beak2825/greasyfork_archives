// ==UserScript==
// @name        VRChat Web Pages Extender forked by mainya
// @name:ja     VRChat Webページ拡張 forked by mainya
// @description Add features into VRChat Web Pages and improve user experience. Forked by mainya
// @description:ja VRChatのWebページに機能を追加し、また使い勝手を改善します。mainyaフォーク版 original: https://greasyfork.org/scripts/371331
// @namespace   https://greasyfork.org/scripts/427583
// @version     2.7.5
// @match       https://www.vrchat.com/*
// @match       https://vrchat.com/*
// @match       https://api.vrchat.cloud/*
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=895049
// @license     MPL-2.0
// @contributionURL https://pokemori.booth.pm/items/969835
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @run-at      document-start
// @icon        https://images.squarespace-cdn.com/content/v1/5f0770791aaf57311515b23d/1599678606410-4QMTB25DHF87E8EFFKXY/ke17ZwdGBToddI8pDm48kGfiFqkITS6axXxhYYUCnlRZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxQ1ibo-zdhORxWnJtmNCajDe36aQmu-4Z4SFOss0oowgxUaachD66r8Ra2gwuBSqM/favicon.ico
// @author      100の人 mainya
// @homepageURL https://pokemori.booth.pm/items/969835
// @downloadURL https://update.greasyfork.org/scripts/427583/VRChat%20Web%20Pages%20Extender%20forked%20by%20mainya.user.js
// @updateURL https://update.greasyfork.org/scripts/427583/VRChat%20Web%20Pages%20Extender%20forked%20by%20mainya.meta.js
// ==/UserScript==

'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'en': {
		'エラーが発生しました': 'Error occurred',
		'$LENGTH$ 文字まで表示可能です。': 'This text is displayed up to $LENGTH$ characters.',
	},
	/*eslint-enable quote-props, max-len */
});

Gettext.setLocale(navigator.language);



if (typeof content !== 'undefined') {
	// For Greasemonkey 4
	fetch = content.fetch.bind(content); //eslint-disable-line no-global-assign, no-native-reassign, no-undef
}



/**
 * ページ上部にエラー内容を表示します。
 * @param {Error} exception
 * @returns {void}
 */
function showError(exception)
{
	console.error(exception);
	try {
		const errorMessage = _('エラーが発生しました') + ': ' + exception
			+ ('stack' in exception ? '\n\n' + exception.stack : '');
		const homeContent = document.getElementsByClassName('home-content')[0];
		if (homeContent) {
			homeContent.firstElementChild.firstElementChild.insertAdjacentHTML('afterbegin', h`<div class="row">
				<div class="alert alert-danger fade show" role="alert"
					style="white-space: pre-wrap; font-size: 1rem; font-weight: normal;">${errorMessage}</div>
			</div>`);
		} else {
			alert(errorMessage);
		}
	} catch (e) {
		alert(_('エラーが発生しました') + ': ' + e);
	}
}

const ID = 'vrchat-web-pages-extender-137';

/**
 * 一度に取得できる最大の要素数。
 * @constant {number}
 */
const MAX_ITEMS_COUNT = 100;

/**
 * Statusの種類。
 * @constant {number}
 */
const STATUSES = {
	'join me': {
		label: 'Join Me: Auto-accept join requests.',
		color: '--status-joinme',
	},
	active: {
		label: 'Online: See join requests.',
		color: '--status-online',
	},
	'ask me': {
		label: 'Ask Me: Hide location, see join requests.',
		color: '--status-askme',
	},
	busy: {
		label: 'Do Not Disturb: Hide location, hide join requests.',
		color: '--status-busy',
	},
};

/**
 * Status Descriptionの最大文字数。
 * @constant {number}
 */
const MAX_STATUS_DESCRIPTION_LENGTH = 32;

/**
 * 一つのブックマークグループの最大登録数。
 * @constant {number}
 */
const MAX_FAVORITES_COUNT_PER_GROUP = 64;

/**
 * @type {Function}
 * @access private
 */
let resolveUserDetails;

/**
 * @type {Promise.<Object>}
 * @access private
 */
const userDetails = new Promise(function (resolve) {
	resolveUserDetails = resolve;
});

addEventListener('message', function receiveUserDetails(event) {
	if (event.origin !== location.origin || typeof event.data !== 'object' || event.data === null
		|| event.data.id !== ID || !event.data.userDetails) {
		return;
	}

	event.currentTarget.removeEventListener(event.type, receiveUserDetails);

	resolveUserDetails(event.data.userDetails);
});

/**
 * ログインしているユーザーの情報を取得します。
 * @see [User Info — VRChat API Documentation]{@link https://vrchatapi.github.io/#/UserAPI/CurrentUserDetails}
 * @returns {Promise.<?Object.<(string|string[]|boolean|number|Object)>>}
 */
async function getUserDetails()
{
	return await userDetails;
}

/**
 * JSONファイルをオブジェクトとして取得します。
 * @param {string} url
 * @returns {Promise.<(Object|Array)>} OKステータスでなければ失敗します。
 */
async function fetchJSON(url)
{
	const response = await fetch(url, {credentials: 'same-origin'});
	return response.ok
		? response.json()
		: Promise.reject(new Error(`${response.status}  ${response.statusText}\n${await response.text()}`));
}

/**
 * スクリプトで扱うブックマークの種類。
 * @constant {string[]}
 */
const FAVORITE_TYPES = ['friend', 'world'];

let favoriteTypeGroupsPairsPromise;

/**
 * ログインしているユーザーのfavoriteのグループ名を取得します。
 * @returns {Object.<Object.<string>[]>} {@link FAVORITE_TYPES}の要素をキーに持つ連想配列。
 */
function getFavoriteTypeGroupsPairs()
{
	if (!favoriteTypeGroupsPairsPromise) {
		favoriteTypeGroupsPairsPromise = fetchJSON('/api/1/favorite/groups', {credentials: 'same-origin'})
			.then(function (groups) {
				const favoriteTypeGroupsPairs = {};
				for (const group of groups.filter(group => FAVORITE_TYPES.includes(group.type))) {
					if (!(group.type in favoriteTypeGroupsPairs)) {
						favoriteTypeGroupsPairs[group.type] = {};
					}
					favoriteTypeGroupsPairs[group.type][group.name] = group.displayName;
				}
				return favoriteTypeGroupsPairs;
			});
	}
	return favoriteTypeGroupsPairsPromise;
}

/**
 * @type {Promise.<Object.<(string|string[])[]>[]>}
 * @access private
 */
let favorites;

/**
 * ブックマークを全件取得します。
 * @see [List Favorites — VRChat API Documentation]{@link https://vrchatapi.github.io/#/FavoritesAPI/ListAllFavorites}
 * @returns {Promise.<Object.<(string|string[])[]>[]>} {@link FAVORITE_TYPES}の要素をキーに持つ連想配列。
 */
function getFavorites()
{
	return favorites || (favorites = async function () {
		const allFavorites = { };
		for (const type of FAVORITE_TYPES) {
			allFavorites[type] = [];
		}
		let offset = 0;
		while (true) {
			//const favorites
			//	= await fetchJSON(`/api/1/favorites/?n=${MAX_ITEMS_COUNT}&offset=${offset}`).catch(showError);
			const favorites
				= await fetchJSON(`/api/1/favorites/?n=${MAX_ITEMS_COUNT}&offset=${offset}`);

			for (const favorite of favorites) {
				if (!FAVORITE_TYPES.includes(favorite.type)) {
					continue;
				}
				allFavorites[favorite.type].push(favorite);
			}

			if (favorites.length < MAX_ITEMS_COUNT) {
				break;
			}

			offset += favorites.length;
		}
		return allFavorites;
	}());
}

/**
 * 「Edit Profile」ページに、ステータス文変更フォームを挿入します。
 * @returns {Promise.<void>}
 */
async function insertUpdateStatusForm()
{
	if ('update-status' in document.forms) {
		return;
	}

	const sidebarStatus = document.querySelector('.leftbar .user-info h6 span[title]');
	const sidebarStatusDescription = document.querySelector('.leftbar .statusDescription small');

	const templateCard = document.getElementById('name-change-submit').closest('.card');
	const card = templateCard.cloneNode(true);
	card.getElementsByClassName('card-header')[0].textContent = 'Status';
	const form = card.getElementsByTagName('form')[0];
	form.name = 'update-status';
	form.action = '/api/1/users/' + document.querySelector('[href*="/home/user/usr_"]').pathname.replace(/.+\//u, '');

	const description = form.displayName;
	description.id = 'status-description';
	description.type = 'text';
	description.name = 'statusDescription';
	description.value = sidebarStatusDescription.textContent;
	description.placeholder = '';
	description.pattern = `.{0,${MAX_STATUS_DESCRIPTION_LENGTH}}`;
	description.title = _('$LENGTH$ 文字まで表示可能です。').replace('$LENGTH$', MAX_STATUS_DESCRIPTION_LENGTH);
	description.parentElement.getElementsByClassName('alert')[0].remove();
	const descriptionContainer = description.closest('.col-10');
	descriptionContainer.classList.replace('col-10', 'col');

	descriptionContainer.parentElement.classList.add('mb-2');

	const statusContainer = descriptionContainer.previousElementSibling;
	statusContainer.outerHTML = '<div class="col-auto"><select name="status" class="form-control">'
		+ Object.keys(STATUSES).map(status => h`<option value="${status}">⬤ ${STATUSES[status].label}</option>`)
			.join('')
	+ '</select></div>';
	form.status.value = sidebarStatus.title;
	form.status.classList.add(form.status.value.replace(' ', '-'));
	form.status.addEventListener('change', function (event) {
		const classList = event.target.classList;
		classList.remove(...Object.keys(STATUSES).map(status => status.replace(' ', '-')));
		classList.add(event.target.value.replace(' ', '-'));
	});

	const submit = form.getElementsByClassName('btn')[0];
	submit.id = 'status-change-submit';
	submit.textContent = 'Update Status';
	submit.disabled = false;

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		for (const control of event.target) {
			control.disabled = true;
		}

		const body = {};
		for (const element of event.target) {
			if (element.localName === 'button') {
				continue;
			}
			body[element.name] = element.value;
		}

		fetch(event.target.action, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			credentials: 'same-origin',
			body: JSON.stringify(body),
		})
			.then(async function (response) {
				if (!response.ok) {
					return Promise.reject(
						new Error(`${response.status}  ${response.statusText}\n${await response.text()}`)
					);
				}
				sidebarStatus.classList.remove(...Object.keys(STATUSES).map(status => status.replace(' ', '-')));
				sidebarStatus.classList.add(event.target.status.value.replace(' ', '-'));
				sidebarStatus.title = event.target.status;
				sidebarStatusDescription.textContent = event.target.statusDescription.value;
			})
			.catch(showError)
			.then(function () {
				for (const control of event.target) {
					control.disabled = false;
				}
			});
	});

	templateCard.parentElement.getElementsByClassName('card')[0].before(card, document.createElement('hr'));
}

/**
 * ブックマーク登録/解除ボタンの登録数表示を更新します。
 * @param {string} type - 「user」「favorite」のいずれか。
 * @returns {Promise.<void>}
 */
async function updateFavoriteCounts(type)
{
	const counts = {};
	for (const favorite of (await getFavorites())[type]) {
		for (const tag of favorite.tags) {
			if (!(tag in counts)) {
				counts[tag] = 0;
			}
			counts[tag]++;
		}
	}

	for (const button of document.getElementsByName('favorite-' + type)) {
		button.getElementsByClassName('count')[0].textContent = counts[button.value] || 0;
	}
}

/**
 * ブックマーク登録/解除ボタンを追加します。
 * @param {string} type - {@link FAVOLITE_TYPES}のいずれかの要素。
 * @returns {Promise.<void>}
 */
async function insertFavoriteButtons(type)
{
	const homeContent = document.getElementsByClassName('home-content')[0];
	if (type === 'world' && !homeContent.querySelector('[aria-label="Private World Callout"]')) {
		// privateワールド
		// return;
	}

	const sibling = homeContent.querySelector('[role="group"]');
	if (!sibling) {
		//return;
	}
	const parent = homeContent.getElementsByClassName('justify-content-between')[1];

	const result = /[a-z]+_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.exec(location.pathname);
	if (!result) {
		return;
	}
	const id = result[0];

	const buttons = document.getElementsByName('favorite-' + type);
	if (type === 'friend' && !(await getUserDetails()).friends.includes(id) || buttons[0]) {
		return;
	}

	const groupNameDisplayNamePairs = (await getFavoriteTypeGroupsPairs())[type];
	const groupNames = Object.keys(groupNameDisplayNamePairs);
	if (parent.querySelector(`[name="favorite-${CSS.escape(type)}"][value="${CSS.escape(groupNames[0])}"]`)) {
		// 多重挿入の防止
		return;
	}
	parent.insertAdjacentHTML('beforeend', '<div role="group" class="w-100 btn-group-lg btn-group-vertical mt-4">'
		+ groupNames.sort().map(tag => h`<button type="button"
			class="btn btn-secondary" name="favorite-${type}" value="${tag}" disabled="">
			<span aria-hidden="true" class="fa fa-star"></span>
			&#xA0;<span class="name">${groupNameDisplayNamePairs[tag]}</span>
			&#xA0;<span class="count">‒</span>⁄${MAX_FAVORITES_COUNT_PER_GROUP}
		</button>`).join('')
	+ '</div>');

	await updateFavoriteCounts(type);

	const tags = [].concat(...(await getFavorites())[type]
		.filter(favorite => favorite.favoriteId === id)
		.map(favorite => favorite.tags));

	for (const button of buttons) {
		button.dataset.id = id;
		if (tags.includes(button.value)) {
			button.classList.remove('btn-secondary');
			button.classList.add('btn-primary');
		}
		if (button.classList.contains('btn-primary')
			|| button.getElementsByClassName('count')[0].textContent < MAX_FAVORITES_COUNT_PER_GROUP) {
			button.disabled = false;
		}
	}

	parent.lastElementChild.addEventListener('click', async function (event) {
		const button = event.target.closest('button');
		if (!button || button.name !== 'favorite-' + type) {
			return;
		}

		const buttons = document.getElementsByName('favorite-' + type);
		for (const button of buttons) {
			button.disabled = true;
		}

		const id = button.dataset.id;
		const newTags = button.classList.contains('btn-secondary') ? [button.value] : [];

		const favorites = (await getFavorites())[type];
		for (let i = favorites.length - 1; i >= 0; i--) {
			if (favorites[i].favoriteId === id) {
				await fetch(
					'/api/1/favorites/' + favorites[i].id,
					{method: 'DELETE', credentials: 'same-origin'}
				);

				for (const button of buttons) {
					if (favorites[i].tags.includes(button.value)) {
						button.classList.remove('btn-primary');
						button.classList.add('btn-secondary');
					}
				}

				favorites.splice(i, 1);
			}
		}

		if (newTags.length > 0) {
			await fetch('/api/1/favorites', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				credentials: 'same-origin',
				body: JSON.stringify({type, favoriteId: id, tags: newTags}),
			})
				.then(async response => response.ok ? response.json() : Promise.reject(
					new Error(`${response.status}  ${response.statusText}\n${await response.text()}`)
				))
				.then(function (favorite) {
					favorites.push(favorite);
					for (const button of buttons) {
						if (favorite.tags.includes(button.value)) {
							button.classList.remove('btn-secondary');
							button.classList.add('btn-primary');
						}
					}
				})
				.catch(showError);
		}

		await updateFavoriteCounts(type);

		for (const button of buttons) {
			if (button.getElementsByClassName('count')[0].textContent < MAX_FAVORITES_COUNT_PER_GROUP) {
				button.disabled = false;
			}
		}
	});
}

/**
 * フレンド一覧で次のページが確実に存在しない場合、次ページのボタンを無効化します。
 * また、オンラインのフレンド数を表示します。
 * @param {HTMLDivElement} group 「friend-group」クラスを持つ要素。
 * @returns {void}
 */
function improveFriendList(group)
{
	// フレンド一覧で次のページが確実に存在しない場合、次ページのボタンを無効化します
	const pager = group.querySelector('.friend-group > div:last-of-type');
	const count = group.querySelectorAll('.friend-group > div:not(:last-of-type)').length;
	const nextPageButton = pager.getElementsByClassName('fa-angle-down')[0].closest('button');
	nextPageButton.disabled = count < MAX_ITEMS_COUNT;

	// オンラインのフレンド数を表示します
	const heading = group.firstElementChild;
	if (heading.textContent.includes('Online')) {
		heading.textContent = `Online (${
			MAX_ITEMS_COUNT * (/[0-9]+/.exec(pager.getElementsByClassName('page')[0].textContent)[0] - 1)
				+ count
				+ (nextPageButton.disabled ? '' : '+')
		})`;
	}
}

/**
 * ページ読み込み後に一度だけ実行する処理をすでに行っていれば `true`。
 * @type {boolean}
 * @access private
 */
let headChildrenInserted = false;

new MutationObserver(async function (mutations) {
	if (document.head && !headChildrenInserted) {
		headChildrenInserted = true;
		document.head.insertAdjacentHTML('beforeend', `<style>
			/*====================================
				Edit Profile
			*/
			` + Object.keys(STATUSES).map(status => `
				[name="status"].${CSS.escape(status.replace(' ', '-'))},
				[name="status"] option[value=${CSS.escape(status)}] {
					color: var(${STATUSES[status].color});
				}
			`).join('') + `

			/*====================================
				フレンドのユーザーページ
			*/
			.btn[name^="favorite-"] {
				white-space: unset;
			}
		</style>`);

		// ユーザー情報を取得します
		// ページ名を改善します
		GreasemonkeyUtils.executeOnUnsafeContext(function (id) {

			const responseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
			responseText.get = new Proxy(responseText.get, {
				apply(get, thisArgument, argumentList)
				{
					const responseText = Reflect.apply(get, thisArgument, argumentList);
					if (thisArgument.status === 200
						&& new URL(thisArgument.responseURL).pathname === '/api/1/auth/user') {
						postMessage({ id, userDetails: JSON.parse(responseText) }, location.origin);
					}
					return responseText;
				},
			});
			Object.defineProperty(XMLHttpRequest.prototype, 'responseText', responseText);

			History.prototype.pushState = new Proxy(History.prototype.pushState, {
				apply(pushState, thisArgument, argumentList)
				{
					Reflect.apply(pushState, thisArgument, argumentList);
					document.title = document.title.split(' | ').slice(-1)[0];
				},
			});
		}, [ ID ]);

		addEventListener('popstate', function () {
			document.title = document.title.split(' | ').slice(-1)[0];
		});
	}

	for (const mutation of mutations) {
		let parent = mutation.target;
		if (parent.id === 'home') {
			break;
		}

		if (/* URLを開いたとき */ parent.localName === 'head' && document.body
			|| /* ページを移動したとき */ parent.id === 'app' || parent.classList.contains('home-content')
				|| parent.parentElement && parent.parentElement.classList.contains('home-content')) {
			const homeContent = document.getElementsByClassName('home-content')[0];
			if (!homeContent || homeContent.getElementsByClassName('fa-cog')[0]) {
				break;fe
			}

			let promise;
			if (location.pathname === '/home/profile') {
                /*
				// 「Edit Profile」ページなら
				promise = insertUpdateStatusForm();
                */
			} else if (location.pathname.startsWith('/home/user/')) {
				// ユーザーページ
				promise = insertFavoriteButtons('friend');
				if (!document.title.includes('|')) {
					const displayName = document.getElementsByTagName('h2')[0].textContent;
					const name = document.getElementsByTagName('h3')[0].firstChild.data;
					document.title = `${displayName} — ${name} | ${document.title}`;
				}
			} else if (location.pathname.startsWith('/home/world/')) {
				// ワールドページ
				promise = insertFavoriteButtons('world');
				if (!document.title.includes('|')) {
                    if (parent.classList.contains('home-content')) {
					const heading = document.querySelector('.home-content h3');
					const name = heading.firstChild.data;
					const author = heading.getElementsByTagName('small')[0].textContent;
					document.title = `${name} ${author} | ${document.title}`;
                    }
				}
			}
			if (promise) {
				promise.catch(showError);
			}
		}

		if (parent.classList.contains('friend-container')) {
			parent = mutation.addedNodes[0];
		}

		if (parent.classList.contains('friend-group')) {
			let groups = document.getElementsByClassName('friend-group');
			const heading = groups[0].firstElementChild.textContent;
			if (groups.length === 1 || heading.includes('Online') && !heading.includes('(')) {
				groups = [parent];
			}

			for (const group of groups) {
				improveFriendList(group);
			}
			break;
		}
	}
}).observe(document, {childList: true, subtree: true});