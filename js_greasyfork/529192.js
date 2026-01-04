// ==UserScript==
// @name         応用情報技術者試験ドットコムのテキスト選択を有効化
// @namespace    https://github.com/takizuka/
// @version      1.0.0
// @author       Kiyotaka Takizuka
// @description  応用情報技術者試験ドットコムのテキスト選択ができるようにします。
// @license      MIT
// @match        https://www.ap-siken.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/529192/%E5%BF%9C%E7%94%A8%E6%83%85%E5%A0%B1%E6%8A%80%E8%A1%93%E8%80%85%E8%A9%A6%E9%A8%93%E3%83%89%E3%83%83%E3%83%88%E3%82%B3%E3%83%A0%E3%81%AE%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E9%81%B8%E6%8A%9E%E3%82%92%E6%9C%89%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529192/%E5%BF%9C%E7%94%A8%E6%83%85%E5%A0%B1%E6%8A%80%E8%A1%93%E8%80%85%E8%A9%A6%E9%A8%93%E3%83%89%E3%83%83%E3%83%88%E3%82%B3%E3%83%A0%E3%81%AE%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E9%81%B8%E6%8A%9E%E3%82%92%E6%9C%89%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	'use strict';

	unsafeWindow.$("body").css("user-select", "").unbind("copy contextmenu selectstart dragstart");

})();