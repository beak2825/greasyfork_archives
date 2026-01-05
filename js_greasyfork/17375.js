// ==UserScript==
// @name         Copy Tieba Link
// @version      1.1
// @description  复制贴吧的贴子标题与链接
// @match        *://tieba.baidu.com/*
// @include      *://tieba.baidu.com/*
// @author       864907600cc
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @namespace    http://ext.ccloli.com
// @downloadURL https://update.greasyfork.org/scripts/17375/Copy%20Tieba%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/17375/Copy%20Tieba%20Link.meta.js
// ==/UserScript==

var setting = {
	title: true,    // 是否复制标题，默认为 true
	author: false,  // 是否复制作者（复制楼中楼时则为楼中楼作者），默认为 false
	with_at: true,  // 若复制作者，则是否需要添加 @，默认为 true
	link: true,     // 是否复制链接，默认为 true
	split: "\n",    // 分隔符，默认为换行符 \n
	tips: true,     // 是否显示提示信息，默认为 true
	tips_time: 5    // 提示显示时间，默认为 5（秒）
};

var linkAnchor = document.createElement('a');
linkAnchor.className = 'tieba-link-anchor';
linkAnchor.textContent = '[复制链接]';

var linkPath = 'http://tieba.baidu.com/p/';


function copyLink(){
	var textGroup = [];
	var text;
	var parent = this.parentElement;

	if (this.dataset.linkText) text = this.dataset.linkText;
	else {
		switch (this.dataset.anchorType) {
			case '0': // 贴子内页获取贴子链接
				if (setting.title) textGroup.push(unsafeWindow.PageData.thread.title);
				if (setting.author) textGroup.push((setting.with_at ? '@' : '') + unsafeWindow.PageData.thread.author + ' ');
				if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id);
				break;

			case '1': // 贴吧首页获取贴子链接
				if (setting.title) textGroup.push(parent.getElementsByClassName('j_th_tit')[0].getAttribute('title'));
				if (setting.author) textGroup.push((setting.with_at ? '@' : '') + parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent + ' ');
				if (setting.link) textGroup.push(parent.getElementsByClassName('j_th_tit')[0].href);
				break;

			case '2': // 贴子内页获取楼层链接
				var floorData = JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
				if (setting.title) textGroup.push(unsafeWindow.PageData.thread.title + ' #' + floorData.content.post_no);
				if (setting.author) textGroup.push((setting.with_at ? '@' : '') + floorData.author.user_name + ' ');
				if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id);
				break;
		}

		console.log(textGroup);

		text = textGroup.join(setting.split);
		this.setAttribute('data-link-text', text);
	}

	GM_setClipboard(text);
	if (setting.tips) showTips('以下内容已复制到剪贴板：\n\n' + text);
}

function showTips(text) {
	var text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

	var node = document.createElement('div');
	node.className = 'tieba-link-tips';
	node.innerHTML = text;
	document.body.appendChild(node);

	setTimeout(function(){
		document.body.removeChild(node);
	}, setting.tips_time * 1000);
}

function catchLinkTarget(event) {
	if (event.animationName !== 'tiebaLinkTarget') return;

	var target = event.target;
	var classList = target.classList;

	var curAnchor = linkAnchor.cloneNode(true);
	curAnchor.addEventListener('click', copyLink);

	if (classList.contains('threadlist_title')) {
		curAnchor.setAttribute('data-anchor-type', '1');
		target.insertBefore(curAnchor, target.getElementsByClassName('j_th_tit')[0]);
	}
	else if (classList.contains('core_title')) {
		curAnchor.setAttribute('data-anchor-type', '0');
		target.appendChild(curAnchor);
	}
	else if (classList.contains('core_reply_tail')) {
		curAnchor.setAttribute('data-anchor-type', '2');
		target.appendChild(curAnchor);
	}

}

// 使用 animation 事件，方便处理贴吧 ajax 加载数据
document.addEventListener('animationstart', catchLinkTarget, false);
document.addEventListener('MSAnimationStart', catchLinkTarget, false);
document.addEventListener('webkitAnimationStart', catchLinkTarget, false);

GM_addStyle(`
	@-webkit-keyframes tiebaLinkTarget {}
	@-moz-keyframes tiebaLinkTarget {}
	@keyframes tiebaLinkTarget {}

	@-webkit-keyframes tiebaLinkTips {
		from {
			opacity: 0;
			bottom: -75px;
		}
		20% {
			opacity: 1;
			bottom: 10px;
		}
		80% {
			opacity: 1;
			bottom: 10px;
		}
		to {
			opacity: 0;
			bottom: -75px;
		}
	}
	@-moz-keyframes tiebaLinkTips {
		from {
			opacity: 0;
			bottom: -75px;
		}
		20% {
			opacity: 1;
			bottom: 10px;
		}
		80% {
			opacity: 1;
			bottom: 10px;
		}
		to {
			opacity: 0;
			bottom: -75px;
		}
	}
	@keyframes tiebaLinkTips {
		from {
			opacity: 0;
			bottom: -75px;
		}
		20% {
			opacity: 1;
			bottom: 10px;
		}
		80% {
			opacity: 1;
			bottom: 10px;
		}
		to {
			opacity: 0;
			bottom: -75px;
		}
	}
	
	.tieba-link-anchor {
		display: none;
		color: #319630 !important;
		cursor: pointer;
		float: right;
	}
	
	.j_thread_list:hover .tieba-link-anchor,
	.l_post:hover .tieba-link-anchor,
	.core_title:hover .tieba-link-anchor,
	.tieba-link-anchor:hover {
		display: inline-block;
	}

	.threadlist_title,
	.core_reply_tail,
	.core_title {
		-webkit-animation: tiebaLinkTarget;
		-moz-animation: tiebaLinkTarget;
		animation: tiebaLinkTarget;
	}

	.core_title:hover .core_title_txt {
		width: 420px !important;
	}

	.tieba-link-tips {
		background: #ff7f3e;
		font-size: 14px;
		padding: 10px;
		border-radius: 3s;
		position: fixed;
		right: 10px;
		color: #ffffff;
		z-index: 99999999;
		pointer-events: none;
		-webkit-animation: tiebaLinkTips ` + setting.tips_time + `s;
		-moz-animation: tiebaLinkTips ` + setting.tips_time + `s;
		animation: tiebaLinkTips ` + setting.tips_time + `s;
	}
`);