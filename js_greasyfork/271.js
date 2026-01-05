// ==UserScript==
// @name        HTMLダイアログ無効化
// @name:ja     HTMLダイアログ無効化
// @description Always opens JavaScript links in new tab in current window instead of new window.
// @description:ja JavaScriptによるリンクを新しいウィンドウではなく新しいタブで開きます。
// @namespace   http://userscripts.org/users/347021
// @version     3.0.1
// @include     *
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Edge Microsoft Edgeの拡張機能は、Content Security Policyでeval()関数の使用が許可されているページでしか動作しません。 <https://developer.microsoft.com/microsoft-edge/platform/issues/11320212/>
// @compatible  Opera
// @compatible  Chrome
// @grant       none
// @run-at      document-start
// @icon        data:image/vnd.microsoft.icon;base64,AAABAAEAICAQAAEABACkAgAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAAAmtJREFUWIXFV7uS0zAUPU682Em0Q0lJwzfQUvELW2zHzD4GhtkPoOcPttnZD2GGhp6CYn8jW2Aix3KIIwr7Xl/LsomdhZyZjCTb0jnn3ivZCXAEXF1fcn9yDAESoXvh9u7eDl3k4/Vl8CQCbu/u7Yerd2PWsWNFtCIAABudjllrFLwCikjtvcA0108vYJprJCbD83jW24aIsYhHpx+AZxdsdMokqbGdbYgYW5iDyIEqArLyi0ghNBaJyQAAScWRGCBEzNfLKIDHQ3fPw4/vABBwCi7Oz1BECjpZVsrixoQtDLYw7JxSsIXBxfnZINcAcFMKqGsgMRlCY6G1hlIKP/UjlFI8phYA90kQRWFfSHMsQGsNQIt+V9u8RuNhqOewgC9fv41Y6HCwgJev3/xX4ge3Bt6+etF6qIgUprnmVgcKQbaCnZ0iyFYAAD1pH1ppvvOSrnNb3a83DAvoOv2KSCHbAAjK+3Z2yq1cSBIvogn313l7dy6i+vDqfR1nm7o/eyaJ/MRd4+Y925i/9/fA46oO3yIKGotIxwSf8/LZ5tHtFSCdU19OlOQy7H3E5NyNXutllG3KcEsRPmIid93Po4BFuGLIxFL/JQUkwiVWu/ahI4uNfvOKKHWq3hcBFuA6dsdpbqEnigmla0lKY1+tEOYnHgG+sPsm+yDDTugiX/8ufy0BvpyrnRbhqx1T7n25dsPuEkv3QMcXEU/2nHKE5a9ikPP5Sds9sOc54Kt2wL/lutLmc98S4FapG/YuUt9cSdwHFkBVK+G6dqvdzTfNJ1JyLccuuAY+f3rfL/UfgQQc9m19AI7+5/ToAv4AYk+4QlI5O3QAAAAASUVORK5CYII=
// @author      100の人
// @homepage    https://greasyfork.org/scripts/271
// @downloadURL https://update.greasyfork.org/scripts/271/HTML%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/271/HTML%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

(function () {
'use strict';

window.open = new Proxy(window.open, {
	apply(open, windowInstance, argumentList) {
		if (2 in argumentList) {
			argumentList[2] = '';
		}
		return open.apply(windowInstance, argumentList);
	},
});

// For Firefox 52 ESR
delete window.showModalDialog;

})();
