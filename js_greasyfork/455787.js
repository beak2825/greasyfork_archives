// ==UserScript==
// @name         mvcat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mvcat跳过二维码
// @author       tpcy
// @match        https://www.mvcat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455787/mvcat.user.js
// @updateURL https://update.greasyfork.org/scripts/455787/mvcat.meta.js
// ==/UserScript==

(function () {
	'use strict';
	let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="20px"
    Container.style.top="20px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<button id="myCustomize" style="position:absolute; left:30px; top:20px;background:black;color:white;">
  方铖nb
</button>
`
	Container.onclick = function (){
        document.getElementsByClassName('wxfollow')[0].style.display='none';
		return;
	};
    document.body.appendChild(Container);
})();
