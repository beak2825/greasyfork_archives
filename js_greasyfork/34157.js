// ==UserScript==
// @name        网易邮箱手机版 “全选”按钮
// @namespace   szc
// @description 添加个“全选”按钮
// @include     http://m*.mm.mail.163.com/xm/mailbox.do*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34157/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E6%89%8B%E6%9C%BA%E7%89%88%20%E2%80%9C%E5%85%A8%E9%80%89%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/34157/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E6%89%8B%E6%9C%BA%E7%89%88%20%E2%80%9C%E5%85%A8%E9%80%89%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

function c() {
	document.querySelectorAll('[name=mid]').forEach(e => e.checked=true);
}

function a() {
	let b = document.createElement('input');
	b.type = 'button';
	b.value = '全选';
	b.addEventListener('click', c);
	document.getElementsByClassName('grp')[0].appendChild(b);
}

a();