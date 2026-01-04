// ==UserScript==
// @name        VRChat Web Pages Extender
// @name:ja     VRChat Webページ拡張
// @description Add features into VRChat Web Pages and improve user experience.
// @description:ja VRChatのWebページに機能を追加し、また使い勝手を改善します。
// @namespace   https://greasyfork.org/users/137
// @version     2.23.1
// @match       https://vrchat.com/home
// @match       https://vrchat.com/home?*
// @match       https://vrchat.com/home#*
// @match       https://vrchat.com/home/*
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
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/371331
// @downloadURL https://update.greasyfork.org/scripts/371331/VRChat%20Web%20Pages%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/371331/VRChat%20Web%20Pages%20Extender.meta.js
// ==/UserScript==

/*global Gettext, _, h, GreasemonkeyUtils */

'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'en': {
		'エラーが発生しました': 'Error occurred',
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
			alert(errorMessage); //eslint-disable-line no-alert
		}
	} catch (e) {
		alert(_('エラーが発生しました') + ': ' + e); //eslint-disable-line no-alert
	}
}

const ID = 'vrchat-web-pages-extender-137';

/**
 * 一度に取得できる最大の要素数。
 * @constant {number}
 */
const MAX_ITEMS_COUNT = 100;

/**
 * 一つのブックマークグループの最大登録数。
 * @constant {Object.<number>}
 */
const MAX_FRIEND_FAVORITE_COUNT_PER_GROUP = 150;

/**
 * 絵文字、ステッカーをアップロードする際の、画像ファイルの一辺の最大解像度。
 * @constant
 */
const MAX_EMOJI_IMAGE_SIZE = 1024;

/**
 * 絵文字、ステッカーをアップロードする際の、対応画像形式。
 * @constant
 */
const EMOJI_IMAGE_TYPES = [ 'image/png', 'image/jpeg', 'image/svg+xml' ];

/**
 * @type {Function}
 * @access private
 */
let setUserDetails;

/**
 * @type {Promise.<Object>}
 * @access private
 */
let userDetails = new Promise(function (resolve) {
	let settled = false;
	setUserDetails = function (details) {
		if (settled) {
			userDetails = Promise.resolve(details);
		} else {
			settled = true;
			resolve(details);
		}
	};
});

/**
 * キーにワールドIDを持つ連想配列。
 * @type {Object.<(string|string[]|boolean|number|Object.<(string|number)>[]|(string|number)[][]|null)>}
 */
const worlds = { };

/**
 * キーにグループIDを持つ連想配列。
 * @type {Object.<string,(string|string[]|number|boolean|Object.<string,(string|string[]|boolean)?>)?>[]}
 */
const groups = { };

addEventListener('message', function (event) {
	if (event.origin !== location.origin || typeof event.data !== 'object' || event.data === null
		|| event.data.id !== ID) {
		return;
	}

	if (event.data.userDetails) {
		setUserDetails(event.data.userDetails);
	} else if (event.data.world) {
		worlds[event.data.world.id] = event.data.world;
		const locations = document.getElementsByClassName('locations')[0];
		if (!locations) {
			return;
		}
		for (const [ instanceId ] of event.data.world.instances) {
			const locationLink = locations.querySelector(`.locations
				[href*=${CSS.escape(`/home/launch?worldId=${event.data.world.id}&instanceId=${instanceId}`)}]`);
			if (!locationLink) {
				continue;
			}
			insertInstanceUserCountAndCapacity(locationLink.closest('.locations > *'), event.data.world.id, instanceId);
		}
	} else if (event.data.group) {
		groups[event.data.group.id] = event.data.group;
	}
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

let friendFavoriteGroupNameDisplayNamePairs;

/**
 * ログインしているユーザーのフレンドfavoriteのグループ名を取得します。
 * @returns {Promise.<Object.<string>[]>}
 */
function getFriendFavoriteGroupNameDisplayNamePairs()
{
	if (!friendFavoriteGroupNameDisplayNamePairs) {
		friendFavoriteGroupNameDisplayNamePairs
			= fetchJSON('/api/1/favorite/groups?type=friend', {credentials: 'same-origin'}).then(function (groups) {
				const groupNameDisplayNamePairs = {};
				for (const group of groups) {
					groupNameDisplayNamePairs[group.name] = group.displayName;
				}
				return groupNameDisplayNamePairs;
			});
	}
	return friendFavoriteGroupNameDisplayNamePairs;
}

/**
 * @type {Promise.<Object.<(string|string[])>[]>}
 * @access private
 */
let friendFavoritesPromise;

/**
 * ブックマークを全件取得します。
 * @see [List Favorites — VRChat API Documentation]{@link https://vrchatapi.github.io/#/FavoritesAPI/ListAllFavorites}
 * @returns {Promise.<Object.<(string|string[])>[]>}
 */
function getFriendFavorites()
{
	return friendFavoritesPromise || (friendFavoritesPromise = async function () {
		const allFavorites = [];
		let offset = 0;

		while (true) { //eslint-disable-line no-constant-condition
			const favorites = await fetchJSON(
				`/api/1/favorites/?type=friend&n=${MAX_ITEMS_COUNT}&offset=${offset}`,
			).catch(showError);

			allFavorites.push(...favorites);

			if (favorites.length < MAX_ITEMS_COUNT) {
				break;
			}

			offset += favorites.length;
		}
		return allFavorites;
	}());
}

/**
 * 自分のユーザーページの編集ダイアログのステータスメッセージ入力欄へ履歴を追加します。
 * @returns {Promise.<void>}
 */
async function insertStatusMessageHistory()
{
	if (document.getElementById('input-status-message-history')) {
		// すでに挿入済みなら
		return;
	}

	const inputStatusMessage = document.getElementById('input-status-message');
	if (!inputStatusMessage) {
		return;
	}

	// ステータスメッセージ入力欄へ履歴を追加
	inputStatusMessage.insertAdjacentHTML('afterend', `<datalist id="input-status-message-history">
		${(await getUserDetails())
			.statusHistory.map(statusDescription => h`<option>${statusDescription}</option>`).join('')}
	</datalist>`);
	inputStatusMessage.setAttribute('list', inputStatusMessage.nextElementSibling.id);
}

/**
 * フレンドのブックマーク登録/解除ボタンの登録数表示を更新します。
 * @returns {Promise.<void>}
 */
async function updateFriendFavoriteCounts()
{
	const counts = {};
	for (const favorite of await getFriendFavorites()) {
		for (const tag of favorite.tags) {
			if (!(tag in counts)) {
				counts[tag] = 0;
			}
			counts[tag]++;
		}
	}

	for (const button of document.getElementsByName('favorite-friend')) {
		button.getElementsByClassName('count')[0].textContent = counts[button.value] || 0;
	}
}

/**
 * ユーザーページへブックマーク登録/解除ボタンを追加します。
 * @returns {Promise.<void>}
 */
async function insertFriendFavoriteButtons()
{
	const homeContent = document.getElementsByClassName('home-content')[0];
	const unfriendButton = homeContent.querySelector('[aria-label="Unfriend"]');
	if (!unfriendButton) {
		return;
	}

	const id = getUserIdFromLocation();
	if (!id) {
		return;
	}

	const buttons = document.getElementsByName('favorite-friend');
	const groupNameDisplayNamePairs = await getFriendFavoriteGroupNameDisplayNamePairs();
	const groupNames = Object.keys(groupNameDisplayNamePairs);
	const buttonsParent = buttons[0] && buttons[0].closest('[role="group"]');
	if (buttonsParent) {
		// 多重挿入の防止
		if (buttonsParent.dataset.id === id) {
			return;
		} else {
			buttonsParent.remove();
		}
	}
	unfriendButton.parentElement.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild
		.insertAdjacentHTML('beforeend', `<div role="group" class="mx-2 btn-group-lg btn-group-vertical"
			style="margin-top: -60px;"
			data-id="${h(id)}">
			${groupNames.sort().map(tag => h`<button type="button"
				class="btn btn-secondary" name="favorite-friend" value="${tag}" disabled="">
				<span aria-hidden="true" class="fa fa-star"></span>
				&#xA0;<span class="name">${groupNameDisplayNamePairs[tag]}</span>
				&#xA0;<span class="count">‒</span>⁄${MAX_FRIEND_FAVORITE_COUNT_PER_GROUP}
			</button>`).join('')}
		</div>`);

	await updateFriendFavoriteCounts();

	const tags = [].concat(
		...(await getFriendFavorites()).filter(favorite => favorite.favoriteId === id).map(favorite => favorite.tags),
	);

	for (const button of buttons) {
		button.dataset.id = id;
		if (tags.includes(button.value)) {
			button.classList.remove('btn-secondary');
			button.classList.add('btn-primary');
		}
		if (button.classList.contains('btn-primary')
			|| button.getElementsByClassName('count')[0].textContent < MAX_FRIEND_FAVORITE_COUNT_PER_GROUP) {
			button.disabled = false;
		}
	}

	buttons[0].closest('[role="group"]').addEventListener('click', async function (event) {
		const button = event.target.closest('button');
		if (!button || button.name !== 'favorite-friend') {
			return;
		}

		const buttons = document.getElementsByName('favorite-friend');
		for (const button of buttons) {
			button.disabled = true;
		}

		const id = button.dataset.id;
		const newTags = button.classList.contains('btn-secondary') ? [button.value] : [];

		const favorites = await getFriendFavorites();
		for (let i = favorites.length - 1; i >= 0; i--) {
			if (favorites[i].favoriteId === id) {
				await fetch(
					'/api/1/favorites/' + favorites[i].id,
					{method: 'DELETE', credentials: 'same-origin'},
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
				body: JSON.stringify({type: 'friend', favoriteId: id, tags: newTags}),
			})
				.then(async response => response.ok ? response.json() : Promise.reject(
					new Error(`${response.status}  ${response.statusText}\n${await response.text()}`),
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

		await updateFriendFavoriteCounts();

		for (const button of buttons) {
			if (button.getElementsByClassName('count')[0].textContent < MAX_FRIEND_FAVORITE_COUNT_PER_GROUP) {
				button.disabled = false;
			}
		}
	});
}

/**
 * ログイン中のユーザーのグループ一覧。
 * @type {(string|boolean|number)[]?}
 */
let authUserGroups;

/**
 * 指定したユーザーが参加しているグループを取得します。
 * @param {*} userId
 * @returns {Promise.<(string|boolean|number)[]>}
 */
function fetchUserGroups(userId)
{
	return fetchJSON(`https://vrchat.com/api/1/users/${userId}/groups`);
}

/**
 * {@link location} からユーザーIDを抽出します。
 * @see {@link https://github.com/vrcx-team/VRCX/issues/429#issuecomment-1302920703}
 * @returns {string?}
 */
function getUserIdFromLocation()
{
	return /\/home\/user\/(usr_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9A-Za-z]{10})/
		.exec(location.pathname)?.[1];
}

/**
 * ユーザーページへブグループへのinviteボタンを追加します。
 * @returns {void}
 */
function insertInvitingToGroupButton()
{
	const userId = getUserIdFromLocation();
	if (!userId) {
		return;
	}

	const groupsHeading = Array.from(document.querySelectorAll('.home-content h2'))
		.find(heading => heading.lastChild?.data === '\'s Groups');
	if (!groupsHeading) {
		return;
	}

	if (document.getElementsByName('open-inviting-to-group')[0]) {
		return;
	}

	const displayName = document.querySelector('.home-content h2').textContent;

	/*eslint-disable max-len */
	groupsHeading.insertAdjacentHTML('beforeend', h`
		<button type="button" name="open-inviting-to-group" class="btn btn-primary">
			<svg aria-hidden="true" class="svg-inline--fa fa-envelope" role="presentation"
				xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path fill="currentColor" d="M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z"></path>
			</svg>
			Invite to Group
		</button>
		<div id="user-page-inviting-to-group-dialog" tabindex="-1" hidden=""
			style="font-size: 1rem; line-height: initial; position: relative; z-index: 1050; display: block;"><div>
			<div class="modal fade show" style="display: block;" role="dialog" tabindex="-1">
				<div class="modal-dialog" role="document"><div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><h4 class="m-0">Invite to Group</h4></h5>
						<div><button name="close-inviting-to-group-dialog" aria-label="Close Button"
							style="padding: 5px; border-radius: 4px; border: 2px solid #333333; background: #333333;
								color: white;">
							<svg role="presentation" aria-hidden="true" class="svg-inline--fa fa-xmark fa-fw"
								xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20">
								<path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
							</svg>
						</button></div>
					</div>
					<div class="modal-body"></div>
				</div></div>
			</div>
			<div class="modal-backdrop fade show"></div>
		</div></div>
	`);
	/*eslint-enable max-len */

	const dialog = document.getElementById('user-page-inviting-to-group-dialog');

	groupsHeading.addEventListener('click', async function (event) {
		const button = event.target.closest('button');
		if (!button) {
			return;
		}

		switch (button.name) {
			case 'open-inviting-to-group': {
				dialog.hidden = false;

				const modalBody = dialog.getElementsByClassName('modal-body')[0];
				if (modalBody.firstElementChild) {
					break;
				}

				if (!authUserGroups) {
					authUserGroups = await fetchUserGroups((await getUserDetails()).id);
				}
				const groupIds
					= Array.from(groupsHeading.nextElementSibling.querySelectorAll('[aria-label="Group Card"]'))
						.map(groupCard => /grp_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
							.exec(groupCard.pathname)[0]);

				if (!document.getElementById('invite-to-group-style')) {
					document.head.insertAdjacentHTML('beforeend', `<style id="invite-to-group-style">
						[name="invite-to-group"] {
							--icon-size: 30px;
							--padding: 5px;
							padding: var(--padding) calc(var(--icon-size) + 2 * var(--padding));
							font-size: 1.2em;
							border: 2px solid #064B5C;
							border-radius: 4px;
							position: relative;
							color: #6AE3F9;
							background: #064B5C;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							width: 100%;
						}

						[name="invite-to-group"]:hover {
							border-color: #086C84;
						}

						[name="invite-to-group"]:disabled {
							border: 2px solid #333333;
							background: #333333;
							color: #999999;
						}

						[name="invite-to-group"] img {
							width: var(--icon-size);
							height: var(--icon-size);
							border-radius: 100%;
							border: 1px solid #181B1F;
							background-color: #181B1F;
							position: absolute;
							left: var(--padding);
						}

						[role="alert"] {
							display: flex;
							flex-direction: column;
							background-color: #541D22BF;
							margin-top: 10px;
							border-radius: 3px;
							padding: 10px;
							border-left: 3px solid red;
						}

						[role="alert"] > div:first-of-type {
							display: flex;
							align-items: center;
						}

						[role="alert"] > div:first-of-type > div:first-of-type {
							font-size: 1.2rem;
							font-weight: bold;
						}
					</style>`);
				}
				/*eslint-disable indent */
				modalBody.innerHTML = authUserGroups.map(group => h`<div
					class="mt-2 mb-2 d-flex flex-column justify-content-center">
					<div style="position: relative; border-radius: 4px;">
						<button name="invite-to-group" value="${h(group.groupId)}"` + (groupIds.includes(group.groupId)
							? h` disabled="" title="${displayName} is already a member of this group․"`
							: '') + h`>
							<img src="${group.iconUrl}">
							${group.name}
						</button>
					</div>
				</div>`).join('');
				/*eslint-enable indent */
				break;
			}
			case 'invite-to-group': {
				const enabledButtons = Array.from(dialog.querySelectorAll('button:enabled'));
				try {
					for (const button of enabledButtons) {
						button.disabled = true;
					}

					const response = await fetch(`/api/1/groups/${button.value}/invites`, {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						credentials: 'same-origin',
						body: JSON.stringify({ userId, confirmOverrideBlock: true }),
					});
					if (!response.ok) {
						const { error: { message } } = await response.json();
						/*eslint-disable max-len */
						button.parentElement.insertAdjacentHTML('beforebegin', h`<div role="alert"
							aria-label="Couldn't invite user">
							<div>
								<svg aria-hidden="true" class="svg-inline--fa fa-circle-exclamation me-2"
									role="presentation"
									xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="red">
									<path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM232 152C232 138.8 242.8 128 256 128s24 10.75 24 24v128c0 13.25-10.75 24-24 24S232 293.3 232 280V152zM256 400c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 385.9 273.4 400 256 400z"></path>
								</svg>
								<div>Couldn't invite user</div>
							</div>
							<div>${response.statusText}: ${message}</div>
						</div>`);
						/*eslint-enable max-len */
					}
					enabledButtons.splice(enabledButtons.indexOf(button), 1);
				} finally {
					for (const button of enabledButtons) {
						button.disabled = false;
					}
				}
				break;
			}
			case 'close-inviting-to-group-dialog':
				dialog.hidden = true;
				break;
		}
	});
}

/**
 * Friend Locationsページのインスタンスへ、現在のインスタンス人数と上限を表示します。
 * @param {HTMLDivElement} location
 * @returns {void}
 */
function insertInstanceUserCountAndCapacity(location, worldId, instanceId)
{
	const world = worlds[worldId];
	const instanceUserCount = world?.instances?.find(([ id ]) => id === instanceId)?.[1];

	/** @type {HTMLElement} */
	let counts = location.getElementsByClassName('instance-user-count-and-capacity')[0];
	if (!counts) {
		const button = location.querySelector('[aria-label="Invite Me"]');
		const friendCount = location.querySelector('[aria-label="Invite Me"]').parentElement.previousElementSibling;
		counts = friendCount.cloneNode();
		counts.classList.add('instance-user-count-and-capacity');
		const reloadButton = button.cloneNode();
		reloadButton.setAttribute('aria-label', 'Reload');
		reloadButton.textContent = '↺';
		reloadButton.addEventListener('click', async function (event) {
			const instance
				= await fetchJSON(`/api/1/instances/${worldId}:${instanceId}`, { credentials: 'same-origin' });
			event.target.previousSibling.data = instance.userCount + ' / ' + instance.capacity;
		});
		counts.append('', reloadButton);
		friendCount.before(counts);
	}
	counts.firstChild.data = (instanceUserCount ?? '?') + ' / ' + (world?.capacity ?? '?');
}

/**
 * ギャラリーのアップローダーの挙動を改善します。
 * @remarks すでに改善済みの場合は何もしません。
 * @param {object} args
 * @param {HTMLInputElement} args.inputElement - `type="file"`。
 * @param {HTMLElement} args.dropZoneElement
 * @param {number} args.maxImageSize - 画像ファイルの一辺の最大解像度。
 * @param {number} args.aspectRatio - 出力画像のアスペクト比 (幅 `/` 高さ)。
 */
function fixGallaryUploader({
	inputElement,
	dropZoneElement = null,
	maxImageSize,
	aspectRatio,
})
{
	if (inputElement.accept.includes('.webp')) {
		return;
	}

	// WebPファイルを選択可能に
	inputElement.accept += ',.webp';

	/**
	 * 変換済みのファイル。
	 * @type {WeakSet.<File>}
	 */
	const alreadyConvertedFiles = new WeakSet();

	// ファイル選択ダイアログによる画像ファイルの選択をトラップ
	inputElement.addEventListener('change', function (event) {
		const selectedFile = inputElement.files[0];

		if (!selectedFile || alreadyConvertedFiles.has(selectedFile) || !selectedFile.type.startsWith('image/')) {
			// ファイルが選択されていない、ファイル変換後に発生させたイベント、または画像ファイル以外が選択されていれば
			return;
		}

		event.stopPropagation();

		// 画像ファイルを変換し、再セット
		convertImageFileForEmojiUploaderAndChangeInputElement({
			alreadyConvertedFiles,
			file: selectedFile,
			inputElement,
			maxImageSize,
			aspectRatio,
		});
	}, true);

	if (dropZoneElement) {
		// ドロップゾーンへのファイルのドロップをトラップ
		dropZoneElement.addEventListener('drop', function (event) {
			const droppedFile = event.dataTransfer.files[0];
			if (!droppedFile || !droppedFile.type.startsWith('image/')) {
				// ファイルがドロップされていない、または画像ファイル以外がドロップされていれば
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			// 画像ファイルを変換、input要素へセット
			convertImageFileForEmojiUploaderAndChangeInputElement({
				alreadyConvertedFiles,
				file: droppedFile,
				inputElement,
				maxImageSize,
				aspectRatio,
			});
		});
	}
}

/**
 * 画像ファイルを次のように変換し、指定されたinput要素へセットし直します。
 * - 一辺 `maxImageSize` 以内に収まるように
 * - 指定されたアスペクト比に合わせて透明な余白を追加
 * - {@link EMOJI_IMAGE_TYPES} 以外の形式、あるいは他の条件が満たされていなければ、PNGへ変換
 * @param {object} args
 * @param {WeakSet.<File>} args.alreadyConvertedFiles
 * @param {File} args.file - 画像ファイル。
 * @param {HTMLInputElement} args.input - `type="file"`。
 * @param {number} args.maxImageSize - 画像ファイルの一辺の最大解像度。
 * @param {number} args.aspectRatio - 出力画像のアスペクト比 (幅 `/` 高さ)。
 * @returns {Promise.<void>}
 */
async function convertImageFileForEmojiUploaderAndChangeInputElement({
	alreadyConvertedFiles,
	file,
	inputElement,
	maxImageSize,
	aspectRatio,
})
{
	// 画像ファイルの読み込み
	const img = new Image();
	const reader = new FileReader();
	await new Promise(function (resolve) {
		img.addEventListener('load', function () {
			resolve();
		});

		reader.addEventListener('load', function (event) {
			img.src = event.target.result;
		});
		reader.readAsDataURL(file);
	});

	if (img.width < img.height && aspectRatio > 1) {
		// 縦長画像が横長アスペクト比の出力に指定されている場合
		// 回転用のcanvasを作成
		const canvas = document.createElement('canvas');
		canvas.width = img.height; // 90度回転後の幅
		canvas.height = img.width; // 90度回転後の高さ

		// 画像を右に90度回転して描画
		const ctx = canvas.getContext('2d');
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(Math.PI / 2);
		ctx.drawImage(img, -img.width / 2, -img.height / 2);

		// 回転後の画像へ更新
		img.src = canvas.toDataURL();
		await new Promise(function (resolve) {
			img.addEventListener('load', resolve);
		});
	}

	/** @type {File} */
	let processedFile;
	if (img.width / img.height === aspectRatio
        && img.width <= maxImageSize && img.height <= maxImageSize
        && (EMOJI_IMAGE_TYPES.includes(file.type))) {
		// 指定されたアスペクト比、最大解像度以内、かつ対応形式なら
		processedFile = file;
	} else {
		let width = img.width;
		let height = img.height;

		if (width > maxImageSize || height > maxImageSize) {
			// 最大解像度を超えていれば
			// アスペクト比を維持してリサイズする場合の解像度を算出
			if (width > height) {
				height = Math.round(height * (maxImageSize / width));
				width = maxImageSize;
			} else {
				width = Math.round(width * (maxImageSize / height));
				height = maxImageSize;
			}
		}

		// 画像全体が収まる解像度のcanvasを作成
		const canvas = document.createElement('canvas');
		/** @type {number} */
		let canvasWidth;
		/** @type {number} */
		let canvasHeight;
		if (aspectRatio > 1) {
			canvasWidth = maxImageSize;
			canvasHeight = maxImageSize / aspectRatio;
		} else {
			canvasWidth = maxImageSize * aspectRatio;
			canvasHeight = maxImageSize;
		}
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// 中央に画像を描画
		let drawWidth, drawHeight, offsetX, offsetY;
		if (width / height > aspectRatio) {
			// 横長の画像の場合
			drawWidth = canvasWidth;
			drawHeight = canvasWidth / (width / height);
			offsetX = 0;
			offsetY = (canvasHeight - drawHeight) / 2;
		} else {
			// 縦長の画像の場合
			drawHeight = canvasHeight;
			drawWidth = canvasHeight * (width / height);
			offsetX = (canvasWidth - drawWidth) / 2;
			offsetY = 0;
		}
		canvas.getContext('2d').drawImage(
			img,
			offsetX,
			offsetY,
			drawWidth,
			drawHeight,
		);

		// PNG画像として出力し、新しい File オブジェクトを作成
		processedFile = new File([ await new Promise(function (resolve) {
			canvas.toBlob(resolve, 'image/png');
		}) ], 'image.png', { type: 'image/png' });

		// 選択されたファイルを置き換える
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(processedFile);
		inputElement.files = dataTransfer.files;
	}

	// 変換済みのファイルを記録
	alreadyConvertedFiles.add(processedFile);

	inputElement.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * ページ読み込み後に一度だけ実行する処理をすでに行っていれば `true`。
 * @type {boolean}
 * @access private
 */
let headChildrenInserted = false;

const homeContents = document.getElementsByClassName('home-content');

new MutationObserver(function (mutations, observer) {
	if (document.head && !headChildrenInserted) {
		headChildrenInserted = true;
		document.head.insertAdjacentHTML('beforeend', `<style>
			/*====================================
				Friend Locations
			*/
			.instance-user-count-and-capacity {
				white-space: nowrap;
			}

			.instance-user-count-and-capacity button {
				margin: 0 0 0 0.5em !important;
				padding: unset;
				line-height: 1;
			}

			/*====================================
				フレンドのユーザーページ
			*/
			.btn[name^="favorite-"] {
				white-space: unset;
			}
		</style>`);

		// ユーザー情報・ワールド情報・グループ情報を取得
		GreasemonkeyUtils.executeOnUnsafeContext(function (id) {
			Response.prototype.text = new Proxy(Response.prototype.text, {
				apply(get, thisArgument, argumentList)
				{
					const textPromise = Reflect.apply(get, thisArgument, argumentList);
					(async function () {
						const data = { id };
						const pathname = new URL(thisArgument.url).pathname;
						if (pathname === '/api/1/auth/user') {
							data.userDetails = JSON.parse(await textPromise);
						} else if (pathname.startsWith('/api/1/worlds/wrld_')) {
							data.world = JSON.parse(await textPromise);
						} else if (pathname.startsWith('/api/1/groups/grp_')) {
							data.group = JSON.parse(await textPromise);
						} else {
							return;
						}
						postMessage(data, location.origin);
					})();
					return textPromise;
				},
			});
		}, [ ID ]);
	}

	if (!homeContents[0]) {
		return;
	}

	const locationsList = homeContents[0].getElementsByClassName('locations');
	const instanceUserCountAndCapacityList = homeContents[0].getElementsByClassName('instance-user-count-and-capacity');

	new MutationObserver(async function (mutations) {
		if (location.pathname === '/home/uploadPhoto') {
			// Photosのアップロードページ
			const inputElement = document.querySelector('[type="file"]');
			fixGallaryUploader({
				inputElement,
				maxImageSize: 2048,
				aspectRatio: 16 / 9,
			});
			return;
		}

		for (const mutation of mutations) {
			if (locationsList[0]) {
				if (locationsList[0].children.length !== instanceUserCountAndCapacityList.length) {
					// Friend Locationsへインスタンス人数を追加
					for (const location of locationsList[0].children) {
						if (location.getElementsByClassName('instance-user-count-and-capacity')[0]) {
							continue;
						}

						const launchLink = location.querySelector('[href*="/home/launch?"]');
						if (!launchLink) {
							continue;
						}
						const params = new URLSearchParams(launchLink.search);
						insertInstanceUserCountAndCapacity(location, params.get('worldId'), params.get('instanceId'));
					}
				}
			} else if (mutation.addedNodes.length > 0 && mutation.target.nodeType === Node.ELEMENT_NODE
				&& (/* ユーザーページを開いたとき */ mutation.target.classList.contains('home-content')
						|| mutation.target.localName === 'div'
							&& mutation.addedNodes.length === 1 && mutation.addedNodes[0].localName === 'div'
							&& mutation.addedNodes[0]
								.querySelector('[aria-label="Add Friend"], [aria-label="Unfriend"]')
					|| /* ワールドページを開いたとき */ mutation.target.parentElement.classList.contains('home-content')
					|| /* グループページでタブ移動したとき */ mutation.target.parentElement.parentElement
						.classList.contains('home-content'))
				|| /* ユーザーページ間を移動したとき */ mutation.type === 'characterData'
					&& mutation.target.nextSibling?.data === '\'s Profile') {
				if (location.pathname.startsWith('/home/user/')) {
					// ユーザーページ
					await insertStatusMessageHistory();
					insertInvitingToGroupButton();
					await insertFriendFavoriteButtons('friend');
				} else if (location.pathname.startsWith('/home/world/')) {
					// ワールドページ
					const heading = document.querySelector('.home-content h2');
					const name = heading.firstChild.data;
					const author
						= heading.nextElementSibling.querySelector('[href^="/home/user/"]').firstChild.data;
					document.title = `${name} By ${author} - VRChat`;
				} else if (location.pathname.startsWith('/home/avatar/')) {
					// アバターページ
					const name = document.querySelector('.home-content h3').textContent;
					const author = document.querySelector('.home-content [href^="/home/user/"]').text;
					document.title = `${name} By ${author} - VRChat`;
				} else if (location.pathname.startsWith('/home/group/')) {
					// グループページ
					const name = document.querySelector('.home-content h2').textContent;
					const groupLink = document.querySelector('[href^="https://vrc.group/"]');
					const shortCodeAndDiscriminator = groupLink.textContent;
					document.title = `${name} ⁂ ${shortCodeAndDiscriminator} - VRChat`;

					// グループオーナーへのリンクを追加
					setTimeout(function () {
						if (!document.getElementById('group-owner-link')) {
							const groupLinkColumn = groupLink.closest('div');
							groupLinkColumn.style.marginLeft = '1em';
							const column = groupLinkColumn.cloneNode();
							const ownerId = groups[/^\/home\/group\/([^/]+)/.exec(location.pathname)[1]].ownerId;
							column.innerHTML = h`<a id="group-owner-link" href="/home/user/${ownerId}">
								Group Owner
							</a>`;
							groupLinkColumn.after(column);
						}
					});
				}
				break;
			}
		}
	}).observe(homeContents[0], {childList: true, characterData: true, subtree: true });

	// 絵文字、もしくはステッカーのアップロードページ
	new MutationObserver(function () {
		if (![ '/home/inventory/emojis/custom', '/home/inventory/stickers/custom' ].includes(location.pathname)) {
			return;
		}

		const inputElement = document.getElementById('file');
		if (!inputElement) {
			return;
		}

		fixGallaryUploader({
			inputElement,
			dropZoneElement: inputElement.parentElement.parentElement.parentElement,
			maxImageSize: MAX_EMOJI_IMAGE_SIZE,
			aspectRatio: 1 / 1,
		});
	}).observe(document.getElementById('home'), {childList: true});

	observer.disconnect();
}).observe(document, {childList: true, subtree: true});
