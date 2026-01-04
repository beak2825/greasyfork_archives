// ==UserScript==
// @name        Fediverse Open on Main Server
// @name:en     Fediverse Open on Remote Servers
// @name:ja     Fediverse リモートサーバーで開く
// @description Open Users or Notes on services that supports ActivityPub on your main Misskey server. You can also open Users or Notes on your main server on remote Misskey servers. Open the home page of this script and execute the user script command to set the main server.
// @description:en Open Users or Notes on services that supports ActivityPub on your main Misskey server. You can also open Users or Notes on your main server on remote Misskey servers. Open the home page of this script and execute the user script command to set the main server.
// @description:ja ActivityPubに対応しているサービスのUser、またはNoteを、メインで利用しているMisskeyサーバーで開きます。また、メインで利用しているサーバーのUser、Noteを、リモートとして登録した複数のMisskeyサーバーで開けるようにします。このスクリプトのホームページを開いて、ユーザースクリプトコマンドを実行して、設定を行ってください。
// @namespace   https://greasyfork.org/users/137
// @version     3.1.0
// @match       https://greasyfork.org/*/scripts/474630-*
// @match       https://mastodon.social/*
// @match       https://pawoo.net/*
// @match       https://mstdn.jp/*
// @match       https://misskey.io/*
// @match       https://mastodon.cloud/*
// @match       https://fedibird.com/*
// @match       https://nijimiss.moe/*
// @match       https://buicha.social/*
// @match       https://misskey.niri.la/*
// @match       https://vcasskey.net/*
// @match       https://bsky.app/*
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=895049
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.openInTab
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @noframes
// @icon        https://codeberg.org/fediverse/distributopia/raw/branch/main/all-logos-in-one-basket/public/basket/Fediverse_logo_proposal-1-min.svg
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/474630
// @downloadURL https://update.greasyfork.org/scripts/474630/Fediverse%20Open%20on%20Main%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/474630/Fediverse%20Open%20on%20Main%20Server.meta.js
// ==/UserScript==

/*global Gettext, _, h */

'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'ja': {
		'Fediverse Open on Remote Servers': 'Fediverse リモートサーバーで開く',
		'Settings of “Fediverse Open on Remote Servers”': '「Fediverse リモートサーバーで開く」の設定',
		'Server URLs': 'サーバーのURL',
		'* Specify the URL of your main server on the first line.': '※1行目に、メインサーバーのURLを指定します。',
		'Add the URLs entered above and the server to which you want to add the user script command to the “User @match” in the user script settings in the format like “https://example.com/*”.':
			'上で入力したURL、およびユーザースクリプトコマンドを追加したいサーバーのURLを、「https://example.com/*」のような形式で、ユーザースクリプト設定の「ユーザー @match」へ追加してください。',
		'Cancel': 'キャンセル',
		'OK': 'OK',
		'Fediverse Open on $SERVER_URL$': 'Fediverse $SERVER_URL$ で開く',
		'Failed to look up.': '照会に失敗しました。',
		'This account is not bridged. Would you like to request Bridgy Fed to send a DM guiding the bridge?':
			'このアカウントはブリッジされていません。ブリッジを案内するDMの送信を、Bridgy Fedへ要求しますか？',
		'The request to Bridgy Fed to send a DM guiding the bridge has been successfully completed.':
			'ブリッジを案内するDMの送信を、Bridgy Fedへ要求するリクエストが正常に完了しました。',
		'An unexplained HTTP error occurred.': '原因不明のHTTPエラーが発生しました。',
	},
	/*eslint-enable quote-props, max-len */
});
Gettext.originalLocale = 'en';
Gettext.setLocale(navigator.language);

/**
 * @param {string} serverURL
 * @param {string} url
 * @returns {Promise.<string>}
 */
async function miAuth(serverURL, url)
{
	const sessionId = crypto.randomUUID();
	await Promise.all([ GM.setValue('miAuthSessionId', sessionId), GM.setValue('urlWaitingMiAuth', url) ]);
	GM.openInTab(`${serverURL}/miauth/${sessionId}?${new URLSearchParams({
		name: _('Fediverse Open on Remote Servers'),
		callback: serverURL,
		permission: 'read:account,write:notes',
	})}`, false);
}

/**
 * 通信がContent Security PolicyによってブロックされるViolemntmonkeyの不具合を回避して、{@link fetch}します。
 * @param {string} input
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
async function fetchBypassCSP(input, init = null)
{
	if (typeof GM_xmlhttpRequest !== 'undefined') { //eslint-disable-line camelcase
		// Violemntmonkey
		const response = await new Promise(function (resolve, reject) {
			GM_xmlhttpRequest(Object.assign({ //eslint-disable-line new-cap
				method: init?.method,
				url: input,
				headers: init?.headers,
				data: init?.body,
				onload: resolve,
				onerror: reject,
				ontimeout: reject,
			}));
		});

		return new Response(response.responseText, {
			status: response.status,
			statusText: response.statusText,
			headers: response.responseHeaders?.trim()?.split(/[\r\n]+/).map(function (line) {
				const nameValue = /([^:]+): (.*)/.exec(line);
				return [ nameValue[1], nameValue[2] ];
			}),
		});
	} else {
		return fetch(input, init);
	}
}

/**
 * @param {string} accessToken
 * @param {string} url
 * @returns {Promise.<?string>}
 */
async function lookUpOnMisskey(serverURL, accessToken, url)
{
	let response = await fetchBypassCSP(`${serverURL}/api/ap/show`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ i: accessToken, uri: url }),
	});

	if (!response.ok) {
		if (response.status === 401) {
			await miAuth(serverURL, url);
			return;
		}

		let responseText;
		let message = _('An unexplained HTTP error occurred.');
		switch (response.status) {
			case 401:
				await miAuth(serverURL, url);
				return;
			case 400:
			case 500: {
				responseText = await response.text();
				if (response.status === 400 && JSON.parse(responseText)?.error?.code !== 'REQUEST_FAILED'
					|| response.status === 500 && ![ 'invalid Actor: wrong inbox', '404 Not Found' ].includes(
						JSON.parse(responseText)?.error?.info?.message,
					)) { // 500はMisskey旧バージョンの場合
					message = _('Failed to look up.');
					break;
				}

				//eslint-disable-next-line max-len
				const match = /^https:\/\/web\.brid\.gy\/r\/https:\/\/bsky\.app\/profile\/(?:(?<handle>(?:[-0-9A-Za-z]+\.)+[A-Za-z]{2,})|(?<did>did:plc:[-0-9A-Za-z]+))$/.exec(url);
				if (!match) {
					message = _('Failed to look up.');
					break;
				}

				responseText = null;

				//eslint-disable-next-line no-alert, max-len
				if (!confirm(_('This account is not bridged. Would you like to request Bridgy Fed to send a DM guiding the bridge?'))) {
					return;
				}

				let handle = match.groups.handle;
				if (!handle) {
					response = await fetchBypassCSP('https://bsky.social/xrpc/com.atproto.repo.describeRepo?'
						+ new URLSearchParams({ repo: match.groups.did }));
					if (!response.ok) {
						break;
					}
					handle = (await response.json()).handle;
				}

				response = await fetchBypassCSP(`${serverURL}/api/users/show`, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						i: accessToken,
						username: 'bsky.brid.gy',
						host: 'bsky.brid.gy',
						detailed: false,
					}),
				});
				if (!response.ok) {
					break;
				}

				response = await fetchBypassCSP(`${serverURL}/api/notes/create`, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						i: accessToken,
						visibility: 'specified',
						visibleUserIds: [ (await response.json()).id ],
						text: handle,
					}),
				});
				if (!response.ok) {
					break;
				}

				//eslint-disable-next-line no-alert
				alert(_('The request to Bridgy Fed to send a DM guiding the bridge has been successfully completed.'));
				return;
			}
		}

		//eslint-disable-next-line no-alert
		alert(message + '\n\n'
			+ response.url + '\n'
			+ `HTTP Status: ${response.status} ${response.statusText}\n`
			+ 'HTTP Response Body:\n' + (responseText ?? await response.text()));
		return;
	}

	const { type, object: { username, host, id } } = await response.json();
	switch (type) {
		case 'User':
			return serverURL + '/@' + username + (host ? '@' + host : '');
		case 'Note':
			return serverURL + '/notes/' + id;
	}
}

/**
 * @typedef {Object} Server
 * @property {'Misskey'} application
 * @property {string} url
 * @property {string} [accessToken]
 */

/**
 * @typedef {Server[]} Servers 先頭がメインサーバー。
 */

/**
 * 設定した各サーバーの情報を取得します。
 * @returns {Promise.<Servers>}
 */
async function getServers()
{
	const [ serversJSON, url, accessToken ]
		= await Promise.all([ 'servers', 'url', 'accessToken' ].map(name => GM.getValue(name)));
	if (url) {
		// バージョン 1.0.0
		const servers = [ { application: 'Misskey', url, accessToken } ];
		await Promise.all([ GM.setValue('servers', JSON.stringify(servers)) ]
			.concat([ 'application', 'url', 'accessToken' ].map(name => GM.deleteValue(name))));
		return servers;
	}

	if (!serversJSON) {
		return [ ];
	}

	return JSON.parse(serversJSON);
}


switch (location.host) {
	case 'greasyfork.org': {
		/** @type {HTMLDialogElement} */
		let dialog, form;
		GM.registerMenuCommand(_('Settings of “Fediverse Open on Remote Servers”'), async function () {
			const servers = await getServers();
			if (!dialog) {
				document.body.insertAdjacentHTML('beforeend', h`<dialog>
					<form method="dialog">
						<p><label>
							${_('Server URLs')}
							<textarea name="server-urls" cols="50" rows="10"
								placeholder="https://example.com\nhttps://example.net\nhttps://example.org"
								pattern="(https?://[^\\/\n]+)(\nhttps?://[^\\/\r\n]+)*"></textarea>
						</label><small>${_('* Specify the URL of your main server on the first line.')}</small></p>
						<p>${_('Add the URLs entered above and the server to which you want to add the user script command to the “User @match” in the user script settings in the format like “https://example.com/*”.' /* eslint-disable-line max-len */)}</p>
						<button name="cancel">${_('Cancel')}</button> <button>${_('OK')}</button>
					</form>
				</dialog>`);

				dialog = document.body.lastElementChild;
				form = dialog.getElementsByTagName('form')[0];
				form['server-urls'].addEventListener('change', function (event) {
					event.target.value = event.target.value.split('\n').map(function (line) {
						try {
							return new URL(line.trim()).origin;
						} catch (exception) {
							if (exception.name !== 'TypeError') {
								throw exception;
							}
							return line;
						}
					}).join('\n');
				});
				let chromium = false;
				form.addEventListener('submit', function (event) {
					if (event.submitter?.name === 'cancel') {
						event.preventDefault();
						dialog.close();
					}
					chromium = true;
				});
				form.addEventListener('formdata', function (event) {
					chromium = false;
					GM.setValue('servers', JSON.stringify(
						event.formData.get('server-urls').trim().split('\n')
							.filter(function (line) {
								try {
									new URL(line);
								} catch (exception) {
									if (exception.name !== 'TypeError') {
										throw exception;
									}
									return false;
								}
								return true;
							})
							.map(url => servers.find(server => server.url === url) ?? { application: 'Misskey', url }),
					));

				});
				// Chromiumでformdataイベントが発生しない不具合の回避
				dialog.addEventListener('close', function () {
					if (!chromium) {
						return;
					}
					form.dispatchEvent(new FormDataEvent('formdata', { formData: new FormData(form) }));
				});
			}
			form['server-urls'].value = servers.map(server => server.url).join('\n');

			dialog.showModal();
		});
		break;
	}
	default:
		if (location.search.startsWith('?session=')) {
			// MiAuthで認可が終わった後のリダイレクトの可能性があれば
			Promise.all(
				[ getServers() ].concat([ 'miAuthSessionId', 'urlWaitingMiAuth' ].map(name => GM.getValue(name))),
			).then(async function ([ servers, miAuthSessionId, urlWaitingMiAuth ]) {
				const server = servers.find(server => server.url === location.origin);
				if (!server) {
					return;
				}

				const session = new URLSearchParams(location.search).get('session');
				if (session !== miAuthSessionId) {
					return;
				}

				await Promise.all([ 'miAuthSessionId', 'urlWaitingMiAuth' ].map(name => GM.deleteValue(name)));

				// アクセストークンを取得
				const response
					= await fetch(`${server.url}/api/miauth/${miAuthSessionId}/check`, { method: 'POST' });
				if (!response.ok) {
					console.error(response);
					return;
				}
				const { ok, token } = await response.json();
				if (!ok) {
					console.error(response);
					return;
				}

				server.accessToken = token;
				await GM.setValue('servers', JSON.stringify(servers));

				// 照会
				const lookedUpURL = await lookUpOnMisskey(server.url, token, urlWaitingMiAuth);
				if (!lookedUpURL) {
					return;
				}
				location.replace(lookedUpURL);
			});
		} else {
			getServers().then(function (servers) {
				if (servers.length === 0) {
					return;
				}

				for (const server of location.origin === servers[0].url ? servers.slice(1) : [ servers[0] ]) {
					GM.registerMenuCommand(
						_('Fediverse Open on $SERVER_URL$').replace('$SERVER_URL$', server.url),
						async function () {
							const url = location.origin === 'https://bsky.app'
								? ('https://web.brid.gy/r/' + location.href)
								: (document.querySelector(
									'.ti-alert-triangle + [rel="nofollow noopener"][target="_blank"]',
								)?.href ?? location.href);
							const { accessToken } = (await getServers()).find(({ url }) => url === server.url);
							if (!accessToken) {
								await miAuth(server.url, url);
								return;
							}

							const lookedUpURL = await lookUpOnMisskey(server.url, accessToken, url);

							if (!lookedUpURL) {
								return;
							}

							GM.openInTab(lookedUpURL, false);
						},
					);
				}
			});
		}
}
