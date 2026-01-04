/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               GM_xmlhttpRequest 测试2
// @name:zh-CN         GM_xmlhttpRequest 测试2
// @name:en            GM_xmlhttpRequest Test2
// @namespace          GM_xmlhttpRequest-Test-2
// @version            0.1.1
// @description        虽然作者懒得写描述，但是他至少记得添加过一个默认描述……
// @description:zh-CN  虽然作者懒得写描述，但是他至少记得添加过一个默认描述……
// @description:en     try to take over the world!
// @author             PY-DNG
// @license            GPL-license
// @match              http*://greasyfork.org/*
// @connect            xbext.com
// @icon               none
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472694/GM_xmlhttpRequest%20%E6%B5%8B%E8%AF%952.user.js
// @updateURL https://update.greasyfork.org/scripts/472694/GM_xmlhttpRequest%20%E6%B5%8B%E8%AF%952.meta.js
// ==/UserScript==

(function() {
    'use strict';

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://www.wenku8.net/modules/article/bookcase.php?classid=1',
		responseType: 'blob',
		onload: function(response) {
			console.log('Blob response got');
			console.log(response);
		},
		onerror: function(err) {
			console.log('Error during request', err);
		},
		ontimeout: function() {
			console.log('Timeout during request');
		},
		onabort: function() {
			console.log('Request aborted');
		},
	});
})();