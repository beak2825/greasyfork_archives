// ==UserScript==
// @name         jwcnew-nefu-xspj-auto-fill
// @namespace    nefu
// @version      0.1
// @description  jwcnew.nefu.edu.cn教学评价自动填充
// @author       Jim Smith
// @match        http://jwcnew.nefu.edu.cn/dblydx_jsxsd/xspj/xspj_edit.do*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26058/jwcnew-nefu-xspj-auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/26058/jwcnew-nefu-xspj-auto-fill.meta.js
// ==/UserScript==

//Compiled by Babel from https://gist.github.com/myfreeer/b8833eabaf8779b96a91afda686a839b
function _toConsumableArray(arr) { 'use strict'; if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';
    [].concat(_toConsumableArray(document.querySelectorAll('#table1 > tbody > tr > td > input:nth-child(1)'))).map(function (e) {
        return e.click();
    });
})();