// ==UserScript==
// @name        Youtube remove channels
// @description Removing the recommended channels
// @namespace   channel_scissors
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19662/Youtube%20remove%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/19662/Youtube%20remove%20channels.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
var a = document.querySelectorAll('.section-list >  li');
var words = /Канал 1|Канал 2/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
    a[i].parentNode.removeChild(a[i]);
    window.setTimeout(check, 300);
	}, 300
);

/* Для блокировки нужных каналов их названия прописываем вместо "Канал 1" и "Канал 2"
    Добавление последующих каналов - через прямую | , как на образце */