// ==UserScript==
// @name        贴吧原名
// @author      Sjmr
// @include     *://tieba.baidu.com/*
// @version     1.5.4
// @run-at      document-start
// @description 显示贴吧原用户名和快捷贴吧搜索
// @icon        http://tieba.baidu.com/favicon.ico
// @namespace   https://greasyfork.org/users/23790
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31355/%E8%B4%B4%E5%90%A7%E5%8E%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/31355/%E8%B4%B4%E5%90%A7%E5%8E%9F%E5%90%8D.meta.js
// ==/UserScript==


function Menu(){
	var n = ['\u66ff\u6362\u6635\u79f0', '\u4f7f\u7528\u9ed8\u8ba4'];
	var r = GM_getValue('replaceNick', false);
	var m = r ? n[1] : n[0];
	GM_registerMenuCommand(m, function (){
		var replaceNick = r ?  false : true;
		GM_setValue('replaceNick', replaceNick);
		location.reload();
    }, null);
}

function checkPost(){
	if (document.getElementsByClassName('user_post_li').length) return;
	var users = document.getElementsByClassName('p_author_name');
	for (var i = 0; i < users.length; i ++){
		var data = users[i].getAttribute('data-field');
		if (!data) continue;
		var id = JSON.parse(data).un;
		if (GM_getValue('replaceNick', false)) users[i].innerHTML = id;
		else users[i].parentNode.outerHTML += id != users[i].innerHTML ?
			'<li style="color:#797c80;" class="user_post_li">[' + id + ']</li>' : '';
	}
}

function checkComment(){
	var at = document.getElementsByClassName('at');
	for (var i = 0; i < at.length; i ++){
		if (at[i].innerHTML.search('@') != -1) continue;
		var a = at[i].getAttribute('data-field');
		if (a) at[i].innerHTML = JSON.parse(a.replace(/'/g, '"')).un;
	}
}

function checkThread(){
	if (!document.getElementById('thread_list')) return;
	var users = document.getElementsByClassName('frs-author-name');
	for (var i = 0; i < users.length; i ++){
		users[i].innerHTML = JSON.parse(users[i].getAttribute('data-field')).un;
	}
}

function checkHome(){
	var users = document.getElementsByClassName('post_author');
	for (var i = 0; i < users.length; i ++){
		var p = users[i].href.split('=')[1].split('&')[0];
		users[i].innerHTML = decodeURIComponent(p);
	}
}

function showCard(n){
	n ++; if (n > 10) return;
	setTimeout(function(){
		var user = document.querySelector('a.userinfo_username');
		if (!user) {showCard(n); return;}
		var un = user.href.split('=')[1].split('&')[0];
		var id = decodeURIComponent(un);
		var bar = encodeURIComponent(document.getElementById('wd1').value);
		var link1 = bar ? '<a href="/f/search/ures?ie=utf-8&kw=' + bar + '&qw=&sm=1&un=' + un + '" target="_blank">\u5427\u5185\u641c</a> | ' : '';
		var link2 = '<a href="/f/search/ures?ie=utf-8&kw=&qw=&sm=1&un=' + un + '" target="_blank">\u5168\u5427\u641c</a>';
		if (user.parentNode.innerHTML.search('top:130px') == -1){
			var search = document.createElement('div');
			user.parentNode.appendChild(search);
			search.outerHTML = '<div style="position:absolute;right:5px;top:130px;font-size:12px;float:left;">' + link1 + link2 + '</div>';
		}
		if (user.parentNode.innerHTML.search('<br>') == -1){
			user.outerHTML += '<br><span style="color:#797c80; font-size:14px;">@' + id + '</span>';
		}
	}, 200);
}

document.addEventListener('DOMContentLoaded', function(){
	Menu();
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if (MutationObserver){
		var post = document.getElementById('j_p_postlist');
		var thread = document.getElementById('content');
		var home = document.getElementsByClassName('ihome_hot_feed');
		new MutationObserver(function(mutations){
			if (mutations.some(function(m){return (m.addedNodes.length == 1 && m.addedNodes[0].id == 'user_visit_card');})) showCard(0);
		}).observe(document.body, {childList: true});
		if (thread && GM_getValue('replaceNick', false)){
			new MutationObserver(function(mutations){
				if (mutations.some(function(m){return (m.target.className == ' j_thread_list clearfix');})) setTimeout(checkThread, 200);
			}).observe(thread, {attributes: true, subtree: true});
		}
		if (home.length && GM_getValue('replaceNick', false)){
			setTimeout(checkHome, 200);
			new MutationObserver(function(mutations){
				if (mutations.some(function(m){return (m.addedNodes.length > 0);})) setTimeout(checkHome, 200);
			}).observe(home[0], {childList: true, subtree: true});
		}
		if (post){
			setTimeout(checkPost, 200);
			new MutationObserver(function(){setTimeout(checkPost, 200);}).observe(post, {childList: true});
			if (!GM_getValue('replaceNick', false)) return;
			new MutationObserver(function(mutations){
				if (mutations.some(function(m){return (m.addedNodes.length > 1);})) setTimeout(checkComment, 200);
			}).observe(post, {childList: true,  subtree: true});
		}
	}
});

