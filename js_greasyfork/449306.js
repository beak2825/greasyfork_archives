/* eslint-disable no-multi-spaces */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               test module
// @displayname        轻小说文库++ 测试模块
// @namespace          TestModule-wenku8++
// @version            0.6
// @description        轻小说文库++的测试模块，测试GM存储、@grant、@require、require以及模块环境变量和返回值功能
// @author             PY-DNG
// @license            GPL-license
// @regurl             https?://www\.wenku8\.net/book/\d+\.htm
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1080639
// @grant              GM_getValue
// @grant              GM_setValue
// ==/UserScript==

(function __MAIN__() {
    'use strict';
	const alertify = require('alertify');

	GM_setValue('key-name', {
		arr: [0,1,2,3,4],
		obj: {a:0,b:1,c:'text',d:false,e:[{},{},{}]},
		bool: true,
		str: 'text'
	});

	const div = $CrE('div');
	div.innerText = JSON.stringify(MODULE_METADATA + '\n\n' + MODULE_IDENTIFIER + '\n\nMODULE_LOADER' + (typeof MODULE_LOADER === 'object' ? ' = ' + JSON.stringify(MODULE_LOADER) : ' does not exist'));
	div.style.color = 'orange';
	alertify.alert(div);

	exports = {storage: GM_getValue('key-name', {}), status: 200};
})();