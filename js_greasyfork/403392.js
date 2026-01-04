// ==UserScript==
// @name         伪装犇犇
// @namespace    https://www.luogu.com.cn/user/311984
// @version      0.4
// @description  用来伪装犇犇
// @author       tim1103
// @match        *://www.luogu.com.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403392/%E4%BC%AA%E8%A3%85%E7%8A%87%E7%8A%87.user.js
// @updateURL https://update.greasyfork.org/scripts/403392/%E4%BC%AA%E8%A3%85%E7%8A%87%E7%8A%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('.popup-button').click(function () {
        $('.apps').append('<a data-v-303bbf52="" data-v-1d675dd8="" href="https://oweblab.gitee.io/benben/" colorscheme="none" class="color-none">伪犇犇</a>');
    })
    const status_html = `
<h3 align="center">伪犇犇</h3>

<div align="center"><a class="am-btn am-btn-primary am-btn-sm" href="https://oweblab.gitee.io/benben/">前往tim1103提供的伪犇犇</a></div>
<div align="center"><small>由于Github的API限制,tim1103没有能力整合犇犇到这里......也可以在右上角的应用里找到伪犇犇哦</small></div>
`;
	function init() {
		var node = document.createElement('div');
		node.className = 'lg-article';
		node.innerHTML = status_html;
		document.querySelector('div.lg-index-benben > div:nth-child(2)').insertAdjacentElement('afterend', node);
	}
	init();
})();