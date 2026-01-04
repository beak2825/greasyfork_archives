// ==UserScript==
// @name        AUR helper
// @description One-click install aur package.
// @namespace   com.github.brucezhang1993
// @include     https://aur.archlinux.org/packages/*
// @version     1.0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/386075/AUR%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/386075/AUR%20helper.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', function() {
	var ul = document.getElementById('actionlist').getElementsByTagName('ul');
	if (!ul) return ;

	ul = ul[0];

	var pkgName = ul.getElementsByTagName('a')[0].href.match(/\/cgit\/aur\.git\/tree\/PKGBUILD\?h=([-_\w\d\.]+)/)[1];
	var li = document.createElement('li');
	var link = document.createElement('a');
	li.appendChild(link);
	ul.insertBefore(li, ul.firstChild);

	link.textContent = '安装软件包 (yay -S '+ pkgName +')';
	link.href = 'yay://' + pkgName ;
}, false);
