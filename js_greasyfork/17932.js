// ==UserScript==
// @name        prototype.js抑制
// @description 【「@run-at document-start」必須】Prototype JavaScript framework (prototype.js) による組み込みメソッド破壊について、Tampermonkey、およびViolent monkeyが干渉するバグを回避します。
// @version     1.0.1
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Firefox Greasemonkeyの場合は「@grant none」以外の指定で回避できるため、同環境では実行しないようにしています。
// @compatible  Opera
// @compatible  Chrome
// @run-at      document-start
// @author      100の人
// @homepage    https://greasyfork.org/users/137
// ==/UserScript==

(function () {
'use strict';

if (GM_info.scriptHandler && GM_info.scriptHandler !== 'Greasemonkey' && !Object.extend) {
	Object.defineProperty(Array, 'from', { writable: false });
	Object.defineProperty(Object, 'extend', {
		writable: false,
		value: function (destination, source) {
			for (let property in source) {
				let descriptor;
				if (property === 'toJSON' || property !== 'sub' && (descriptor = Object.getOwnPropertyDescriptor(destination, property)) && !descriptor.enumerable) {
					continue;
				}
				destination[property] = source[property];
			}
			return destination;
		},
	});
}

})();
