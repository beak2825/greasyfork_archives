// ==UserScript==
// @name        Reload userChromeES
// @name:ja     userChromeESを再読み込み
// @description [userChromeES] Adds the menu item that reloads the userChromeES to the popup menu of the toolbar button and the sidebar menu.
// @description:ja 【userChromeES】userChromeESを再読み込みするメニューアイテムを、ツールバーボタンのポップアップメニューとサイドバーメニューに追加します。
// @namespace   https://greasyfork.org/users/137
// @version     0.1.0
// @include     popup
// @include     sidebar
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Firefox userChromeES用スクリプトです (※GreasemonkeyスクリプトでもuserChromeJS用スクリプトでもありません) / This script is for userChromeES (* neither Greasemonkey nor userChromeJS)
// @author      100の人
// @homepage    https://greasyfork.org/users/137
// @downloadURL https://update.greasyfork.org/scripts/34246/Reload%20userChromeES.user.js
// @updateURL https://update.greasyfork.org/scripts/34246/Reload%20userChromeES.meta.js
// ==/UserScript==

(function () {
'use strict';

if (location.pathname === '/sidebar/sidebar.xhtml') {
	document.head.insertAdjacentHTML('beforeend', `<style>
		[name="reload-user-chrome-es"] {
			cursor: pointer;
		}
	</style>`);
}

document.getElementsByTagName('menu')[0].insertAdjacentHTML('beforeend', `
	<li><button type="button" name="reload-user-chrome-es">
		<img src="chrome://browser/content/extension.svg" alt="" />
		${browser.i18n.getUILanguage() === 'ja' ? 'userChromeESを再読み込みする' : 'Reload userChromeES'}
	</button></li>
`);

document.getElementsByName('reload-user-chrome-es')[0].addEventListener('click', () => browser.runtime.reload());

})();
