// ==UserScript==
// @name        TiebaOldUserCard
// @author      Crab
// @namespace   TiebaOldUserCard@tieba.com
// @description 贴吧旧名片
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?*
// @include     http://tieba.baidu.com/f/*
// @include     http://www.baidu.com/forbiddenip/forbidden.html?xhr=TiebaOldUserCard
// @version     2015.05.27.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10092/TiebaOldUserCard.user.js
// @updateURL https://update.greasyfork.org/scripts/10092/TiebaOldUserCard.meta.js
// ==/UserScript==

(function(){
	'use strict';

	if(location.host === 'www.baidu.com'){
		addEventListener('message', function(e){
			if(e.data.name !== 'tiebaOldUserCard' || !e.data.user) return;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://www.baidu.com/p/'+ e.data.user +'?from=tieba', true);
			xhr.send(null);
			xhr.onload = function(){
				var r = xhr.responseText.match(/public_home\\\/user\\\/(\d+)\?domain/);
				e.source.postMessage({name: 'tiebaOldUserCard', uk: r ? r[1] : 'none', msgId: e.data.msgId}, e.origin);
			}
		}, false);

		return;
	}

	var cardList = {},
		hideCardTimeout = null,
		showCardTimeout = null,
		ucp = document.createElement('div'),
		crossFrame = ucp.appendChild(document.createElement('iframe')),
		crossFrameUrl = 'http://www.baidu.com/forbiddenip/forbidden.html?xhr=TiebaOldUserCard';

	document.head.appendChild(document.createElement('style')).textContent 
		= '#users_card_panel{' 
		+ 'display:none; border:1px solid #666; width:330px; background:#fff;'
		+ 'position:absolute; z-index:100000000; overflow:hidden;}'
		+ '#users_card_panel>iframe{'
		+ 'border:none; display:none;}';

	ucp.id = 'users_card_panel';
	crossFrame.src = crossFrameUrl;
	document.body.appendChild(ucp);

	document.addEventListener('mouseover', function(event){
		var target = event.target;
		if((target.className 
				&& !!~target.className.indexOf('j_user_card' ) 
				&& target.nodeName == 'A') ||
		ucp.contains(target)){
			event.stopPropagation();
			clearTimeout(hideCardTimeout);
			if(ucp.contains(target)) return;
			clearTimeout(showCardTimeout);
			showCardTimeout = setTimeout(function(){
				var rects = target.getBoundingClientRect(),
					scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
					card = getUserCard(
						JSON.parse(target.dataset.field.replace(/'/g,'"')).un
						|| decodeURIComponent(target.href.match(/un\=([^&]+)/)[1]));

				for(var i in cardList){
					if(cardList[i] != card)
						cardList[i].style.display = 'none';
				}
				card.style.display = ucp.style.display = 'block';

				if(/at|lzl_p_p/.test(target.className) || window.hasOwnProperty('frsPage')){
					if(rects.top > 140 + 20){
						ucp.style.top = scrollTop + rects.top - 140 - rects.height + 'px';
					}else{
						ucp.style.top = scrollTop + rects.top + rects.height + 5 + 'px';
					}
					ucp.style.left = rects.left + 'px';
				}else{
					ucp.style.top = scrollTop + rects.top - 60 + 'px';
					ucp.style.left = rects.right + 20 + 'px';
				}
			}, 350);
		}
	}, true);

	document.addEventListener('mouseout', function(event){
		var target = event.target;
		if((target.className 
				&& !!~target.className.indexOf('j_user_card') 
				&& target.nodeName == 'A') 
			|| ucp.contains(target)
		){
			clearTimeout(showCardTimeout);
			clearTimeout(hideCardTimeout);
			hideCardTimeout = setTimeout(function(){
				ucp.style.display = 'none';
			}, 200);
		}
	}, true);

	function getUserCard(userName){
		if(userName in cardList)
			return cardList[userName];

		var iframe = document.createElement('iframe');
		iframe.src = '/i/data/panel?ie=utf-8&un=' + encodeURIComponent(userName);
		iframe.style.width = '100%';
		cardList[userName] = iframe;
		ucp.appendChild(iframe);
		iframe.contentWindow.addEventListener('DOMContentLoaded', function(){
			var msgId = new Date().getTime();
			addEventListener('message', function setUserCard(e){
				if(e.data.name !== 'tiebaOldUserCard' || e.data.msgId !== msgId || !e.data.uk)
					return;
				removeEventListener('message', setUserCard, false);
				iframe.contentWindow.document.getElementById('icon_right').insertAdjacentHTML('beforeend', 
					(e.data.uk === 'none' ? '<small>对方隐藏了相册</small>，' : 
					' <a target="_blank" href="http://yun.baidu.com/share/home?uk='
					+ e.data.uk +'">盘</a>,'
					+ '<a target="_blank" href="http://xiangce.baidu.com/u/'
					+ e.data.uk +'">册</a>,')

					+ '<a target="_blank" href="http://www.tieba.com/f/search/ures?ie=utf-8&kw=&qw=&rn=100&sm=0&un='
					+ userName +'">黑</a>');
			}, false);

			crossFrame.contentWindow.postMessage({
				name: 'tiebaOldUserCard',
				user: userName,
				msgId: msgId,
			}, crossFrameUrl);

		});
		return iframe;
	}
})();