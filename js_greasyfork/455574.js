// ==UserScript==
// @name        新しいタブでコンテナ解除
// @description 【userChromeES】コンテナタブから新しいタブを開いたとき、コンテナを維持せずコンテナなしにします。
// @namespace   https://greasyfork.org/users/137
// @version     1.0.0
// @include     background
// @include     options
// @license     MPL-2.0
// @incompatible Edge
// @compatible  Firefox userChromeES用スクリプトです (※GreasemonkeyスクリプトでもuserChromeJS用スクリプトでもありません)。
// @incompatible Opera
// @incompatible Chrome
// @author      100の人
// @homepage    https://greasyfork.org/users/137
// @downloadURL https://update.greasyfork.org/scripts/455574/%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%83%96%E3%81%A7%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/455574/%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%83%96%E3%81%A7%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(async function () {
'use strict';

/**
 * コンテナなしのときのcookieStoreId。
 */
const DEFAULT_COOKIE_STORE_ID = 'firefox-default';

/**
 * スクリプトの実行に必要な権限。
 * @constant {browser.permissions.Permissions}
 */
const PERMISSIONS = {
	permissions: [ 'tabs', 'cookies' ],
};

function watchTabCreated()
{
	browser.tabs.onCreated.addListener(function (tab) {
		if (!tab.openerTabId || tab.cookieStoreId === DEFAULT_COOKIE_STORE_ID) {
			return;
		}

		browser.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo, tab) {
			browser.tabs.onUpdated.removeListener(onUpdated);
			browser.tabs.create({
				cookieStoreId: DEFAULT_COOKIE_STORE_ID,
				openerTabId: tab.openerTabId,
				url: changeInfo.url,
			});
			browser.tabs.remove(tabId);
		}, { properties: [ 'url' ], tabId: tab.id });
	});
}

switch (location.pathname) {
	case '/background/background.xhtml':
		if (await browser.permissions.contains(PERMISSIONS)) {
			watchTabCreated();
		} else {
			browser.permissions.onAdded.addListener(async function onAdded() {
				if (await browser.permissions.contains(PERMISSIONS)) {
					watchTabCreated();
					browser.permissions.onAdded.removeListener(onAdded);
				}
			});
		}
		break;

	case '/options/options.xhtml': {
		document.body.insertAdjacentHTML('beforeend', `<article>
			<h1>新しいタブでコンテナ解除</h1>
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
