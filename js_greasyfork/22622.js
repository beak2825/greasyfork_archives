// ==UserScript==
// @name 贴吧移除楼层广告和非本吧视频、话题、直播贴
// @description 贴吧移除楼层广告和非本吧视频、话题、直播贴。
// @namespace AD@tieba.com
// @include http://tieba.baidu.com/p/*
// @include http://tieba.baidu.com/f?*
// @include http://tieba.baidu.com/f/*
// @compatible  firefox 34+
// @compatible  Chrome 45+
// @version 1.2.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/22622/%E8%B4%B4%E5%90%A7%E7%A7%BB%E9%99%A4%E6%A5%BC%E5%B1%82%E5%B9%BF%E5%91%8A%E5%92%8C%E9%9D%9E%E6%9C%AC%E5%90%A7%E8%A7%86%E9%A2%91%E3%80%81%E8%AF%9D%E9%A2%98%E3%80%81%E7%9B%B4%E6%92%AD%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/22622/%E8%B4%B4%E5%90%A7%E7%A7%BB%E9%99%A4%E6%A5%BC%E5%B1%82%E5%B9%BF%E5%91%8A%E5%92%8C%E9%9D%9E%E6%9C%AC%E5%90%A7%E8%A7%86%E9%A2%91%E3%80%81%E8%AF%9D%E9%A2%98%E3%80%81%E7%9B%B4%E6%92%AD%E8%B4%B4.meta.js
// ==/UserScript==

(function(){
	var animateName = btoa(Math.random()).replace(/[^a-z]/ig, 'a');
	document.head.appendChild(document.createElement('style')).textContent = `
		@keyframes ${animateName} {from{opacity:.9;}to{opacity:1;}}
		.j_thread_list [data-forumid], .l_post,
		#pagelet_live\\/pagelet\\/live {animation:${animateName} 1ms;}
	`;
	var rmad = function(element){
		var json = null;
		try{
			json = JSON.parse(element.dataset.field);
		}catch(ex){
			return;
		}

		json.author.user_id == json.content.post_id 
			&& (console.log('移除了一广告楼层。'), element.remove());
	};

	var rmvd = function(element){
		var forumId = PageData.forum.id;
		if(!forumId || element.dataset.forumid == forumId) return;
		var tli = element.closest('.j_thread_list');
		if(tli){
			let a = tli.querySelector('a.j_th_tit');
			a && console.log(`移除非本吧视频贴：【${a.textContent.trim()}】`,'\n', `链接为：${a.href}`);
			tli.remove();
		}
	};

	var rmLive = function(t){
		var s = Array.prototype.find.call(document.scripts, s => s.textContent.includes('live/widget/interview'));
		if(!s) return;
		var text = s.textContent;
		var m = text.match(/\bfId\s*:\s*'(\d+)',/);
		if(m && parseInt(m[1], 10) !== parseInt(PageData.forum.id, 10)){
			try{
				console.log(`移除非本吧话题直播贴：【${text.match(/\bshareText\s*:\s*'(.+?)',/)[1]}】`,
					'\n',
					`链接为：${location.origin}/p/${text.match(/\btId\s*:\s*'(\d+)',/)[1]}`);
			}catch(e){
				console.error(e);
			}
			t.remove();
		}
	}

	document.addEventListener('animationstart', function(e){
		if(e.animationName !== animateName) return;
		var t = e.target;
		if(t.id === 'pagelet_live/pagelet/live')
			return rmLive(t);
		t.localName == 'a' ? rmvd(t) : rmad(t);
	});
})();