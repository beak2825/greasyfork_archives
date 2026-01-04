/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               ModuleList
// @displayname        模块列表
// @namespace          Wenku8++
// @version            0.1.4
// @description        轻小说文库++可安装的模块列表
// @author             PY-DNG
// @license            GPL-v3
// @regurl             NONE
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @autoupdate
// @protect
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	const modules = [{
		name: '页面美化',
		describtion: '页面布局美化，自定义页面背景图',
		flags: 0,
		GFSID: 450211,
		//url: 'https://greasyfork.org/scripts/450211-beautifier/code/beautifier.js'
	}, {
		name: '测试模块',
		describtion: '测试轻小说文库++的功能用的模块',
		flags: 0,
		GFSID: 449306,
		//url: 'https://greasyfork.org/scripts/449306-%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93-%E6%B5%8B%E8%AF%95%E6%A8%A1%E5%9D%97/code/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93++%20%E6%B5%8B%E8%AF%95%E6%A8%A1%E5%9D%97.js'
	}];

	exports = modules;
})();