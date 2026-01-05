// ==UserScript==
// @name        Bug 667607 (Fill the tab bar after closing a tab)
// @name:ja     Bug 667607 (タブを閉じた時の隙間を埋める)
// @namespace   https://userscripts.org/users/347021
// @version     1.3.0
// @description [userChromeJS] Resize tabs to fill the tab bar immediately after closing a tab (Firefox 4 feature).
// @description:ja [userChromeJS] タブを閉じた時、タブバーの右端に生じる隙間をすぐに埋めます。 (Firefox 4 の機能)
// @include     main
// @license     CC-BY-4.0
// @contributionURL https://github.com/sponsors/esperecyan
// @incompatible Edge
// @compatible  Firefox userChromeJS用スクリプト です (※GreasemonkeyスクリプトでもuserChromeES用スクリプトでもありません) / This script is for userChromeJS (* neither Greasemonkey nor userChromeES)
// @incompatible Opera
// @incompatible Chrome
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/267
// @downloadURL https://update.greasyfork.org/scripts/267/Bug%20667607%20%28Fill%20the%20tab%20bar%20after%20closing%20a%20tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/267/Bug%20667607%20%28Fill%20the%20tab%20bar%20after%20closing%20a%20tab%29.meta.js
// ==/UserScript==

(function () {
'use strict';

gBrowser.removeTab = new Proxy(gBrowser.removeTab, {
	apply(func, tabbrowser, argumentList)
	{
		const aParams = argumentList[1];
		if (aParams?.triggeringEvent?.mozInputSource === MouseEvent.MOZ_SOURCE_MOUSE) {
			argumentList[1]
				= (new aParams.triggeringEvent.constructor(aParams.triggeringEvent.type, aParams.triggeringEvent));
		}
		Reflect.apply(func, tabbrowser, argumentList);
	},
});

})();
