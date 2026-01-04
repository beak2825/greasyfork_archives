// ==UserScript==
// @name         GSCloud-Application
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help you to use GSClound-Application
// @author       YeSihao
// @match        https://cw.ceec.net.cn/*
// @match        https://cw1.ceec.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ceec.net.cn
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466711/GSCloud-Application.user.js
// @updateURL https://update.greasyfork.org/scripts/466711/GSCloud-Application.meta.js
// ==/UserScript==

'use strict'


$(document).on('click', $('#title'), function () {
		let webpage_title = $("#title");
		let eyesore_text = $("#framework-toolbar-header > div.gw-header--caption > img");
		let stupid_robot = $("#NJEK_TRIGGER");
        let username = $('[class="gw-navbar-user-name name-space"]');
		const s = '\u5df2\u7ecf\u6e05\u9664\u4e11\u964b\u7684\u6587\u5b57\u548c\u667a\u969c\u4e00\u822c\u7684\u673a\u5668\u4eba\u5ba2\u670d\uff01';

        const mydomain = {'cw.ceec.net.cn': "\u4f01\u4e1a\u6570\u5b57\u5316\u4e91\u5e73\u53f0",
                          'cw1.ceec.net.cn': "\u6d6a\u6f6e\u4e1a\u8d22\u4e00\u4f53\u5316\u6d4b\u8bd5\u5e73\u53f0"}
		try {
			webpage_title.text(mydomain[document.domain]);
			eyesore_text.remove();
			stupid_robot.remove();
            username.text('');
		} catch(e) {
			alert(`The eyesore text and stupid robot has been cleaned!\n ${s}`);
		};
	});


