// ==UserScript==
// @name         小米社区一键点赞
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  **
// @author       18cm
// @match        *://www.xiaomi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398676/%E5%B0%8F%E7%B1%B3%E7%A4%BE%E5%8C%BA%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/398676/%E5%B0%8F%E7%B1%B3%E7%A4%BE%E5%8C%BA%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function index() {
	let imgs = document.querySelectorAll(
		'img[src="//rs.vip.miui.com/vip-resource/prod/mio-pc/v1/static/media/zan.8abff612.svg"]',
	);
	if (imgs.length) {
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].click();
		}
	}else{
        alert('没有需要点赞的帖子！')
    }
}

    function sub() {}

    let button = document.createElement('div');
    button.style="width: 70px;height: 30px;background-color: red;position: fixed;top: 70px;left: 0px;cursor: pointer;";
    button.innerHTML="一键点赞";
    document.body.appendChild(button);
    button.addEventListener('click',function(e){
        index();
    })
})();
