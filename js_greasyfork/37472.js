// ==UserScript==
// @name         自动添加磁力链接前缀
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  在你复制磁力链接的hash时候，自动补上"magnet:?xt=urn:btih:"，便于下载软件直接获取
// @author       kilin cheung
// @include      *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37472/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%89%8D%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/37472/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%89%8D%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener('copy', function(e) {
    	let selectedText = window.getSelection().toString().trim();
    	if(selectedText.match(/[0-9a-zA-Z]+/)[0] == selectedText && selectedText.length == 40) {
    		let cont = 'magnet:?xt=urn:btih:' + selectedText;
	    	e.clipboardData.setData('text/plain', cont);
    		e.preventDefault();
    		return;
    	}
    });
})();