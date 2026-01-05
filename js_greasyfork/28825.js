// ==UserScript==
// @name         gamedev.ru
// @namespace    e6y
// @description  try to take over the world!
// @version      0.38
// @author       entryway
// @include      /^https?://(www.)?gamedev\.ru\/.*$/
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/28825/gamedevru.user.js
// @updateURL https://update.greasyfork.org/scripts/28825/gamedevru.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function(){

'use strict';

// https://console.developers.google.com/
let YOUTUBE_API_KEY = null;

let checkHeadExists = setInterval(function(){
	if(document.head){
		clearInterval(checkHeadExists);

		oldStyleCSS();
		addTopMenuBarCss();
		hideTopicsListCss();
		hideLeftMenu();
		hideAds();
		hideShareButton();
	}
}, 1);

addEventListener('DOMContentLoaded', function(){
	if(document.body){
		addTopMenuBar();
		hideTopicsList();
		addAdditionalTags();
		fitImagesHelper();
		markOldMessages();
		filterMessagesByUser();
		newAsLink();
		addCreatedTopicsLink();
		betterYoutube(YOUTUBE_API_KEY);
		hideLongMessages();
		showOnline();
	}
}, false);

function addGlobalStyle(css) {
	if (document.head){
		let style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		document.head.appendChild(style);
	}
}

function queryParams(params) {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
}

function addTopMenuBarCss(){
	addGlobalStyle(`
		div#path {padding-top:28px!important;}
		div#header{
			position:fixed!important;
			width:100%!important;
			background-color:rgb(45,45,45);
			top:0!important;
			min-height:auto!important;
			height:28px!important;
			z-index:999!important;
			color:rgb(187,187,187)!important;
		}
		div#header a{display:none!important;}
		#header:before {
			content:'Форум Флейм Сайт Сообщения Online ☺ Баня Меню';
			padding-top:20px!important;
			line-height:28px!important;
			font-weight:bold!important;
			word-spacing:10px!important;
			margin-left:10px!important;
		}
	`);
}

function addTopMenuBar(){
	let top_menu = document.createElement('div');
	top_menu.innerHTML = `
		<style>
			.top_menu {
				width:100%;
				position:fixed;
				top:0; z-index:9999;
				background-color:rgb(45,45,45);
				font-weight:bold;
				word-spacing:10px!important;
				line-height:28px!important;
				margin-left:10px!important;
			}
			.top_menu a:link, .top_menu a:visited,.top_menu a:active
				{color:rgb(187,187,187) !important; text-decoration:none !important;}
			.top_menu a:hover
				{color:white !important; text-decoration:none !important;}
		</style>
		<div class="top_menu">
		<a href="//gamedev.ru/forum/">Форум</a>
		<a href="//gamedev.ru/flame/forum/">Флейм</a>
		<a href="//gamedev.ru/site/forum/">Сайт</a>
		<a href="//gamedev.ru/messages/">Сообщения</a>
		<a href="//gamedev.ru/users/?online">Online</a>
		<a id="show_online" href="javascript:void(0)">☺</a>
		<a href="//gamedev.ru/users/?banlist">Баня</a>
		<a id="toggle_left_menu" href="javascript:void(0)">Меню</a>
		</div>
	`;
	document.body.insertBefore(top_menu, document.body.firstChild);

	[...document.querySelectorAll('.top_menu a')].forEach(a=>{
		let re = /https?:\/\/(www.)?/;
		let url1 = a.href.replace(re, '');
		let url2 = window.location.href.replace(re, '');
		let color = url2.indexOf(url1) != -1 ? 'white' : 'rgb(187,187,187)';
		a.style.setProperty('color', color, 'important');      
	});

	document.getElementById('toggle_left_menu').addEventListener('click', triggerLeftMenu);
}

function triggerLeftMenu(){
	let div_main = document.getElementById('main');
	let div_left = document.getElementById('left');
	if(div_main && div_left){
		let style = window.getComputedStyle(div_left, null);
		if(style.display == 'none'){
			div_main.style.setProperty('margin-left', '120px', 'important');
			div_left.style.setProperty('display', 'block', 'important');
		}else{
			div_main.style.setProperty('margin-left', '0', "important");
			div_left.style.setProperty('display', 'none', "important");
		}
	}
}

function makeSpoiler(elem, title, index){
	let div = document.createElement('div');
	div.innerHTML = `
		<div id="spoilerHead${index}" class="spoiler">
		<span class="splink" onclick="javascript:showSpoiler(${index}, 1)">+ ${title}</span>
		</div>
		<div id="spoiler${index}" class="spoiler" style="display:none;">
		<span class="splink" onclick="javascript:showSpoiler(${index}, 0)">– Скрыть</span>
		<br><br>
		<div class='x'></div>
		</div>
	`;
	elem.parentNode.insertBefore(div, elem.nextSibling);
	let x = div.querySelector('.x');
	x.replaceWith(elem);
}

function hideLongMessages(){
	[...document.querySelectorAll('div.mes div.block')].forEach((elem, i)=>{
		let style = window.getComputedStyle(elem, null);
		let height = parseInt(style.height) || 0;
		if(height>800){
			makeSpoiler(elem, `Автоматический спойлер (${height}px)`, i+2000);
		}
	});
}

function oldStyleSearch(){
	let div_search = document.getElementById('search');
	if(div_search){
		let form = document.createElement('form');
		form.style.cssText = 'float:right';
		form.innerHTML = `
			<span class="q">Поиск:</span>
			<input class="thinbut" name="q" size="10" maxlength="255" value="" type="text">
			<input class="thinbut" name="btnG" value="Найти!" type="submit">
		`;
		form.onsubmit = function(){
			window.location.href='https://google.com/search?q=' + encodeURIComponent('site:gamedev.ru ' + this.q.value);
			return false;
		};
		div_search.replaceWith(form);
	}
}

// ----------------------------------------------------------------------------
// show static image instead of youtube frame
// ----------------------------------------------------------------------------
function betterYoutube(YOUTUBE_API_KEY){
	let id_array = [];
	addGlobalStyle('.yt_comment * {font-size:10px!important;color:#808080!important;}');

	[
		['iframe[src*=youtube]', /^.+?\/embed\/([^?&]+)(.*)$/],
		['embed[src*=youtube]',  /^.+?\/v\/([^?&]+)(.*)$/],
	].forEach(([selector, regexp])=>{
		[...document.querySelectorAll(selector)].forEach(iframe=>{
			let [url, id, params] = iframe.getAttribute('src').match(regexp) || [];
			if(id){
				id_array.push(id);

				let width = parseInt(iframe.getAttribute('width')) || 480;
				let height = parseInt(iframe.getAttribute('height')) || 360;

				let div = document.createElement('div');
				let unique_poster_id = 'poster_'+id+'_'+id_array.length;
				div.innerHTML = `<table><tr>
					<td>
						<div id="${unique_poster_id}" style="position:relative;width:${width}px">
							<img src="//i.ytimg.com/vi/${id}/hqdefault.jpg" style="width:${width}px;height:${height}px;">
							<img src="//www.youtube.com/favicon.ico" style="position:absolute;left:2px;top:2px;">
							<div id="${'title_'+id}" style="position:absolute;left:22px;top:2px;background-color:rgba(0,0,0,0.3);color:white;font-weight:bold;"></div>
						</div>
					<td>&nbsp;
					<td style="width:100%"><div class="yt_comment" id="${'comments_'+id}" style="height:${height}px;overflow-y:auto;"></div>
				</table>`;
				iframe.replaceWith(div);

				let poster = document.getElementById(`${unique_poster_id}`);
				poster.addEventListener('click', ()=>{
					let yt = document.createElement('iframe');
					yt.src = url + (params ? '&' : '?') + 'rel=0&autoplay=1';
					yt.width = width;
					yt.height = height;
					yt.setAttribute('allowFullScreen', '');
					yt.style.border = 0;
					poster.replaceWith(yt);
				});
			}
		});
	});

	if(YOUTUBE_API_KEY && id_array.length>0){
		let api_url = 'https://www.googleapis.com/youtube/v3';

		let params = {
			key:YOUTUBE_API_KEY,
			id:id_array.join(','),
			part:'snippet,statistics',
			fields:'items(id,snippet(title),statistics)'
		};
		let info_url = `${api_url}/videos?${queryParams(params)}`;
		fetch(info_url).then(response=>response.json()).then(data=>{
			if(data.items){
				data.items.forEach(item=>{
					let div = document.getElementById('title_'+item.id);
					if(div){
						div.title = JSON.stringify(item, null, "\t");
						div.innerHTML = item.snippet.title;
					}
				});
			}
		});

		if(1){
			id_array.forEach(id=>{
				let params = {
					key:YOUTUBE_API_KEY,
					videoId:id,
					textFormat:'plainText',
					part:'snippet',
					fields:'items(snippet(videoId,topLevelComment(snippet(authorDisplayName,textDisplay))))',
					maxResults:50,
				};
				let comments_url = `${api_url}/commentThreads?${queryParams(params)}`;
				fetch(comments_url).then(response=>response.json()).then(data=>{
					let comments = '';
					if(data.items){
						data.items.forEach(item=>{
							let snippet = item.snippet.topLevelComment.snippet;
							comments += `<div><b>${snippet.authorDisplayName}</b></div>`;
							comments += `<div>${snippet.textDisplay}</div>`;
							comments += '<p>';
						});
					}
					let div = document.getElementById(`${'comments_'+id}`);
					if(div){
						div.innerHTML = comments;
					}
				});
			});
		}
	}
}

// ----------------------------------------------------------------------------
// nicer links
// ----------------------------------------------------------------------------
function oldStyleCSS(){
	addGlobalStyle(`
		a:not(.my):link    { color:#2E2E5C!important; }
		a:not(.my):visited { color:#318DC4!important; }
		a:not(.my):active  { color:#00304B!important; }
		a:not(.my):hover   { color:#BF3A00!important; }

		a:not(.my):link { text-decoration:none!important; }

		div.mes div.block a { text-decoration:underline!important; }

		a.spoiler:link { text-decoration:none!important; }

		table.r th { background:#a6bfdc!important; }
		table.r td { background:#D5E0E0!important; }
		table.r tr.sec td { background:#CDD5DF!important; }
		table.r tr.red td { background:#E5D0D0!important; }

		table.mes td { background:#CDD5DF!important; }
		td.co   { background: #D5E0E0!important; }
		td.code { background: #CDD5DF!important; }

		table.r b a, div.list a { text-decoration:none!important; }
	`);
}

// ----------------------------------------------------------------------------
// additional tags
// ----------------------------------------------------------------------------
function addAdditionalTags(){
	let area_tags = document.getElementById('areatags');
	if(area_tags){
		let div = document.createElement('div');
		div.innerHTML = `
			<a style="text-decoration: none;" href="javascript:ins_tag('<sub>','</sub>')" title="<sub></sub> Нижний регистр">[y<sub>i</sub>]</a>
			<a style="text-decoration: none;" href="javascript:ins_tag('<sup>','</sup>')" title="<sup></sup> Верхний регистр">[x<sup>2</sup>]</a>
			<a style="text-decoration: none;" href="javascript:ins_tag('<span style=\\\'font-family:monospace;\\\'>','</span>')" title="[monospace]">[monospace]</a>
			<a style="text-decoration: none;" href="javascript:ins_tag('[spoiler][code=cpp]','[/code][/spoiler]')" title="[spoiler][code]">[+code]</a>
			<a style="text-decoration: none;" href="javascript:ins_tag('[spoiler][img=','][/spoiler]')" title="[spoiler][img]">[+img]</a>
		`;
		area_tags.parentNode.insertBefore(div, area_tags.nextSibling);
	}
}

// ----------------------------------------------------------------------------
// 'created topics' link for all users
// ----------------------------------------------------------------------------
function addCreatedTopicsLink() {
	var href = window.location.href;
	if(/gamedev\.ru\/users\/\?id\=\d+$/.test(href)){
		let topics = document.querySelector('a[title="Темы форума, которые вы создали"]');
		if(!topics){
			let messages = document.querySelector('a[title="Сообщения в обратном порядке"]');
			if(!messages){
				let div = document.createElement('div');
				div.innerHTML = `<p><b>Форум:</b>
					<a href="${href}&a=lasttop">темы</a>,
					<a href="${href}&a=messages">cообщения</a>,
					<a href="${href}&a=createdtopics">созданные</a>
				`;
				document.getElementById('main_body').appendChild(div);
			}else{
				let div = document.createElement('span');
				div.innerHTML = `, <a href="${href}&a=createdtopics">созданные</a>`;
				messages.parentNode.insertBefore(div, messages.nextSibling);
			}
		}
	}
}

// ----------------------------------------------------------------------------
// fit images to width
// ----------------------------------------------------------------------------
function fitImagesHelper(){
	[...document.querySelectorAll('img')].forEach(img=>{
		img.style.width = 'auto';
		img.onclick = function(){
			if (img.style.maxWidth === 'none'){
				img.style.maxWidth ='100%';
			}else{
				img.style.maxWidth ='none';
			}
		};
	});
}

// ----------------------------------------------------------------------------
// old messages are gray
// ----------------------------------------------------------------------------
function markOldMessages(){
	let old_days = 365;
	let months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];

	let items = [...document.querySelectorAll('div.mes')].forEach(msg=>{
		let td = msg.querySelector('table.mes tr:first-child td:nth-last-child(3)');
		if(td){
			let [day, month, year] = td.innerText.split(' ');
			let date = new Date(year, months.indexOf(month), day);
			if(new Date().getTime() - date.getTime() > old_days*24*3600000){
				let div = document.createElement('div');
				div.style.cssText = `
					position:absolute; pointer-events:none;
					left:0; top:0; width:100%; height:100%;
					background:rgba(0,0,0,0.2); border:1px solid rgba(100,100,100,1);
				`;
				msg.style.position = 'relative';
				msg.appendChild(div);
			}
		}
	});
}

function filterMessagesByUser(){
	let re = /[&?]id=(\d+)/;
	let matches = re.exec(location.href);
	if(matches){
		let style = document.createElement('style');
		style.innerHTML = `
			.lnk {float:right;cursor:help; font-size:70%;} .lnk:after {content:'⇦'}
			a.lnk:link, a.lnk:visited {color:black !important; text-decoration:none !important;}
		`;
		document.body.appendChild(style);

		[...document.querySelectorAll('div.mes table.mes tr th a')].forEach(a=>{
			let m = re.exec(a.href);
			if(m){
				let elem = document.createElement('a');
				elem.className = 'lnk';
				elem.href = `?id=${matches[1]}&user=${m[1]}`;
				a.appendChild(elem);
			}
		});
	}
}

function newAsLink(){
	[...document.querySelectorAll('table.r span.red + b a')].forEach(a=>{
		let span = a.parentNode.previousElementSibling;
		span.style.cursor = 'pointer';
		span.onclick = ()=>fetch(a.href, {credentials:'same-origin'}).then(()=>span.remove());
	});
}


function hideBySelector(selector){
	addGlobalStyle(`${selector}{display:none!important}`);
}
function hideLeftMenu(){
	hideBySelector('div#left');
	addGlobalStyle('div#main{margin-left:0!important}');
}
function hideHeader(){
	hideBySelector('div#header');
}
function hideAds(){
	hideBySelector('div#ad');
	hideBySelector('div#counter');
}
function hideShareButton(){
	hideBySelector('div#share_button');
	hideBySelector('div#social');
}

function hideTopicsListCss(){
	let forum = location.href.match(/gamedev.ru\/forum\/?$/);
	let flame = location.href.match(/\/flame\/forum\/?$/);
	if(forum){
		hideBySelector('div.list');
	}
	if(flame){
		hideBySelector('#main_body > .r:nth-of-type(1)');
	}
}

function hideTopicsList(){
	let forum = location.href.match(/gamedev.ru\/forum\/?$/);
	let flame = location.href.match(/\/flame\/forum\/?$/);
	let add = document.querySelector('a[href="?a=add"]');
	if(add && (forum || flame)){
		let a = document.createElement('a');
		a.title = 'Список рубрик';
		a.href = 'javascript:void(0)';
		a.style.cssText = 'float:left';
		a.innerHTML = 'Список рубрик';
		if(forum){
			a.onclick = ()=>{
				[...document.querySelectorAll('div.list')].forEach(elem=>{
					elem.style.cssText = 'display:block!important';
				});
			}
		}
		if(flame){
			a.onclick = ()=>{
				[...document.querySelectorAll('#main_body > .r:nth-of-type(1)')].forEach(table=>{
					table.style.cssText = 'display:block!important';
					table.rows[0].cells[0].style.setProperty('width', '100%', 'important');
				});
			};
		}
		add.parentNode.insertBefore(a, add);
	}
}

// ----------------------------------------------------------------------------
// Show Online
// ----------------------------------------------------------------------------
function showOnline(){
	addGlobalStyle(`
		.online {
			color:#777;
			font-size:10px;
			font-weight:normal;
			cursor:pointer;
			float:right;
		}
		.online_title { color:#333; float:none; }
		.online a { color:inherit !important; text-decoration:none; }
		.online a:hover { color:#BF3A00 !important; }
	`);

	var show_online = document.querySelector('a#show_online');

	addContainers();

	show_online.onclick = ()=>{
		getOnline(updateAll);
	};

	function addContainer(subj, class_name){
		let div = document.createElement('div');
		div.className = class_name;
		div.setAttribute('data-subj', subj);
		div.onclick = ()=>{
			div.innerHTML = '&nbsp;';
	 		getOnline(online=>setText(div, online));
		};
		return div;
	}

	function addContainers(){
		var expr = new RegExp('(New!\\s+)|(\\[\\s+\\d+.*\\])|(\\(\\d+\\sстр\\))', 'g');
		[...document.querySelectorAll('div h1.title')].forEach(node=>{
			let subj = node.textContent.replace(expr, '').trim();
			node.appendChild(addContainer(subj, 'online online_title'));
		});

		[...document.querySelectorAll('table.r')].forEach(table=>{
			for(let i = 1; i < table.rows.length; i++){
				var cell = table.rows[i].cells[0];
				let subj = cell.textContent.replace(expr, '').trim();
				if (isNaN(subj)){
					cell.appendChild(addContainer(subj, 'online'));
				}
			}
		});
	}

	function setText(container, online){
		var users = online.s[container.getAttribute('data-subj')];
		container.innerHTML = '';
		if (users instanceof Array){
			users.forEach(user=>{
				let a = document.createElement('a');
				a.title = online.u[user].join("\n");
				a.href = online.l[user];
				a.className = 'my';
				a.innerHTML = user;
				a.onclick = function(e){
					e.preventDefault();
				};
				container.appendChild(a).appendChild(document.createTextNode(' '));
			});
		}
	}

	function updateAll(online){
		[...document.querySelectorAll('.online')].forEach(node=>{
			setText(node, online);
		});
	}

	function getOnline(callback){
		if (typeof callback === 'function'){
			let expr = /(\[PDA\])|(\(\d+\sстр\))/g;
			show_online.innerHTML = '☻';
			let xhr = new XMLHttpRequest();
			xhr.open('GET', '/users/?online', true);
			xhr.onreadystatechange = function(){
				if (xhr.readyState != 4 || xhr.status != 200){
					return;
				}
				let element = document.createElement('div');
				element.innerHTML = xhr.responseText;
				let online = {s:{}, u:{}, l:{}, i:{}};
				[...element.querySelectorAll('table.r tr.sec td:nth-child(2) ul a')].forEach(node=>{
					var subj = node.textContent;
					if(isNaN(subj)){
						let aa = node.closest('tr').previousElementSibling;
						let a = aa.querySelector('td a');
						let user = a ? a.textContent : '';
						subj = subj.replace(expr, '').trim();
						if (user.length > 0 && subj.length > 0) {
							[
								[online.s, subj, user],
								[online.u, user, subj],
								[online.l, user, a.href],
							].forEach(([obj, key, value])=>{
								if (typeof obj[key] === 'undefined'){
									obj[key] = [];
								}
								if (obj[key].indexOf(value) === -1){
									obj[key].push(value);
								}
							});
						}
					}
				});
				callback(online);
				show_online.innerHTML = '☺';
			};
			xhr.send();
		}
	}
}

})();
