// ==UserScript==
// @name         gamedev.ru - 2019
// @namespace    e6y
// @description  try to take over the world!
// @version      0.51
// @author       entryway
// @include      /^https?://(www.)?gamedev\.ru\/.*$/
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/376354/gamedevru%20-%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/376354/gamedevru%20-%202019.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function(){
	'use strict';

	// https://console.developers.google.com/
	var youtube_api_key = null;

	var settings = new Settings(youtube_api_key);

	let checkHeadExists = setInterval(function(){
		if(document.head){
			clearInterval(checkHeadExists);
			cssStuff();
		}
	}, 1);

	if(document.readyState == 'interactive' || document.readyState == 'complete'){
		jsStuff();
	}else{
		addEventListener('DOMContentLoaded', jsStuff);
	}

	function cssStuff(){
		oldStyleCSS(settings);
		hideTopicsListCss();
	}

	function jsStuff(){
		settings.draw();
		topMenuAlwaysVisible();
		leftMenuVisibility(settings);

		addToolButton('//gamedev.ru/flame/forum/', 'Флейм', '❤');
		addToolButton('//gamedev.ru/site/forum/', 'Сайт', '✉');
		//addToolButton('//gamedev.ru/users/?online', 'Online', '✔');
		//addToolButton('//gamedev.ru/users/?banlist', 'Баня', '✘');

		addAdditionalTags();
		addCreatedTopicsLink();
		newAsLink();
		filterMessagesByUser();
		hideTopicsList();
		betterYoutube(settings.youtube_api_key);
		showOnline(settings);
		supportHtmlPasting();
	}

	function Settings(youtube_api_key){
		var self = this;

		var cfg = {
			menu: new ConfigVal('menu', 'bool', 0, 1, 0),
			one_row_topics: new ConfigVal('one-row-topics', 'bool', 0, 1, 0),
			one_row_head: new ConfigVal('one-row-head', 'bool', 0, 1, 0),
			width: new ConfigVal('width', 'int', 1, 10, 10),
		};

		defineGetter('youtube_api_key', ()=>youtube_api_key);

		defineGetter('left_menu_visible', ()=>cfg.menu.load());
		defineGetter('one_row_topics', ()=>cfg.one_row_topics.load());
		defineGetter('one_row_head', ()=>cfg.one_row_head.load());
		defineGetter('width', ()=>`${100 - (cfg.width.max() - cfg.width.load())*5}%`);

		function defineGetter(name, fn){
			Object.defineProperty(self, name, { get: fn });
		}

		function ConfigVal(name, type, min, max, def){
			name = 'gd-settings-' + name;
			var safe = val=>Math.max(Math.min(parseInt(val), max), min);
			this.load = ()=>safe(localStorage.getItem(name) || def);
			this.save = val=>localStorage.setItem(name, safe(val));
			this.name = ()=>name;
			this.min = ()=>min;
			this.max = ()=>max;
			this.selector = ()=>document.querySelector('#' + name);
			this.curr = ()=>{
				switch(type){
					case 'bool': return this.selector().checked ? 1 : 0;
					case 'int': return this.selector().value;
				}
			}
		}

		function update(){
			for(let key in cfg){
				cfg[key].save(cfg[key].curr());
			}
			location.reload();
		}

		this.draw = function(){
			var item = document.querySelector('div.modal-content');
			var div = document.createElement('div');
			div.innerHTML = `
				<hr>
				<input type="checkbox" id="${cfg.menu.name()}" style="vertical-align:-3px;">
				<label for="${cfg.menu.name()}" style="font-size:12px;">всегда показывать меню</label>
				<br>
				<input type="checkbox" id="${cfg.one_row_topics.name()}" style="vertical-align:-3px;">
				<label for="${cfg.one_row_topics.name()}" style="font-size:12px;">темы одной строчкой</label>
				<br>
				<input type="checkbox" id="${cfg.one_row_head.name()}" style="vertical-align:-3px;">
				<label for="${cfg.one_row_head.name()}" style="font-size:12px;">заголовки одной строчкой</label>
				<br>
				<input type="range" min="1" max="${cfg.width.max()}" value="${cfg.width.load()}" id="${cfg.width.name()}">
			`;
			item.appendChild(div);

			cfg.menu.selector().checked = !!cfg.menu.load();
			cfg.one_row_topics.selector().checked = !!cfg.one_row_topics.load();
			cfg.one_row_head.selector().checked = !!cfg.one_row_head.load();

			for(let key in cfg){
				cfg[key].selector().onchange = update;
			}
		}
	}

	function queryParams(params) {
		return Object.keys(params)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&');
	}

	function topMenuAlwaysVisible(){
		var top_menu = document.getElementById('tool');

		var makeVisible = function(elem){
			elem.style.display = 'block';
			elem.style.opacity = 1;
		};

		makeVisible(top_menu);

		var observer = new MutationObserver(mutations=>{
			mutations.forEach(mutation=>{
				makeVisible(top_menu);
			});
		});
		var config = { attributes: true, childList: false, characterData: false };
		observer.observe(top_menu, config);
	}

	function leftMenuVisibility(settings){
		var left_menu = document.getElementById('menu');

		var makeVisible = function(){
			left_menu.style.display = 'block';
			left_menu.style.opacity = 1;
		};

		if(leftMenuVisibility.observer){
			leftMenuVisibility.observer.disconnect();
		}

		if(settings.left_menu_visible){
			makeVisible();

			leftMenuVisibility.observer = new MutationObserver(mutations=>{
				mutations.forEach(mutation=>{
					makeVisible();
				});
			});
			var config = { attributes: true, childList: false, characterData: false };
			leftMenuVisibility.observer.observe(left_menu, config);
		}else{
			left_menu.style.display = 'none';
		}
	}

	function addToolButton(url, desktop, mobile){
		let last_menu = document.querySelector('#tool a.tool:last-child');
		if(last_menu){
			let a = document.createElement('a');
			a.href=url;
			a.className = 'tool';
			a.innerHTML = `<span class="tool not-mobile">${desktop}</span><span class="tool mobile">${mobile}</span>`;
			last_menu.parentNode.insertBefore(a, last_menu.nextSibling);
		}
	}

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

	function addCreatedTopicsLink() {
		var href = window.location.href;
		if(/gamedev\.ru\/users\/\?id\=\d+$/.test(href)){
			[...document.querySelectorAll('p b')].filter(b=>b.textContent.includes('Форум:')).forEach(b=>{
				let p = b.parentNode;
				let topics = p.querySelector('a[title="Темы форума, которые вы создали"]');
				if(!topics){
					p.innerHTML += `, <a href="${href}&a=createdtopics">созданные</a>`;
				}
			});

			[...document.querySelectorAll('p')].filter(p=>p.textContent.includes('Пользователь удалён.')).forEach(p=>{
				let div = document.createElement('div');
				div.innerHTML = `
					<p><b>Форум:</b>
					<a href="${href}&a=lasttop">темы</a>,
					<a href="${href}&a=messages">cообщения</a>,
					<a href="${href}&a=createdtopics">созданные</a>
				`;
				p.parentNode.insertBefore(div, p.nextSibling);
			});

		}
	}

	function newAsLink(){
		[...document.querySelectorAll('div.row span.red + a')].forEach(a=>{
			let span = a.previousElementSibling;
			span.style.cursor = 'pointer';
			span.onclick = ()=>fetch(a.href, {credentials:'same-origin'}).then(()=>{
				span.remove();
			});
		});
	}

	function filterMessagesByUser(){
		let re = /[&?]id=(\d+)/;
		let matches = re.exec(location.href);
		if(matches){
			let style = document.createElement('style');
			style.innerHTML = `
				.lnk {cursor:help; font-size:80%;} .lnk:after {content:'＠ '; white-space:pre;color:black}
				a.lnk:link, a.lnk:visited {color:black !important; text-decoration:none !important;}
			`;
			document.body.appendChild(style);

			[...document.querySelectorAll('div.bound.head ul li a')].forEach(a=>{
				let m = re.exec(a.href);
				if(m){
					let elem = document.createElement('a');
					elem.className = 'lnk';
					elem.href = `?id=${matches[1]}&user=${m[1]}`;
					a.parentNode.insertBefore(elem, a);
				}
			});
		}
	}

	function hideTopicsList(){
		let flame = location.href.match(/\/flame\/forum\/?$/);
		let path = document.querySelector('div.path div.bound');
		if(path && flame){
			let a = document.createElement('a');
			a.title = 'Список рубрик';
			a.href = 'javascript:void(0)';
			a.innerHTML = 'Список рубрик';
			if(flame){
				a.onclick = ()=>{
					[...document.querySelectorAll('table.page')].forEach(table=>{
						table.style.cssText = 'display:block!important';
						table.rows[0].cells[0].style.setProperty('width', '100%', 'important');
					});
				};
				path.appendChild(a);
			}
		}
	}

	function addGlobalStyle(css){
		if(document.head){
			let style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = css;
			document.head.appendChild(style);
		}
	}

	function hideBySelector(selector){
		addGlobalStyle(`${selector}{display:none!important}`);
	}

	function hideTopicsListCss(){
		let flame = location.href.match(/\/flame\/forum\/?$/);
		if(flame){
			hideBySelector('table.page');
		}
	}

	function betterYoutube(YOUTUBE_API_KEY){
		let id_array = [];
		addGlobalStyle('.yt_comment * {font-size:10px!important;color:#808080!important;white-space:pre-wrap;overflow-wrap:anywhere}');
		addGlobalStyle('div.youtube_container {max-width: none !important;}');

		function youtubeRepalcer(container, id, url, width, height){
			let div = document.createElement('div');
			let unique_poster_id = 'poster_'+id+'_'+id_array.length;
			div.innerHTML = `
				<table><tr>
				<td>
					<div id="${unique_poster_id}" style="position:relative;width:${width}px;">
						<img src="//i.ytimg.com/vi/${id}/hqdefault.jpg" style="width:${width}px;height:${height}px;">
						<img src="//www.youtube.com/favicon.ico" style="position:absolute;left:2px;top:2px;">
						<div id="${'title_'+id}" style="position:absolute;left:22px;top:2px;background-color:rgba(0,0,0,0.3);color:white;font-weight:bold;"></div>
					</div>
				<td>&nbsp;
				<td style="width:100%"><div class="yt_comment" id="${'comments_'+id}" style="height:${height}px;overflow-y:auto;"></div>
				</tr></table>
			`;
			container.replaceWith(div);

			let poster = document.getElementById(`${unique_poster_id}`);
			poster.addEventListener('click', ()=>{
				let yt = document.createElement('iframe');
				yt.src = url;// + (params ? '&' : '?') + 'rel=0&autoplay=1';
				yt.width = width;
				yt.height = height;
				yt.setAttribute('allowFullScreen', '');
				yt.style.border = 0;
				poster.replaceWith(yt);
			});
		}

		[...document.querySelectorAll('div.youtube')].forEach(div_yt=>{
			let data_value = div_yt.dataset.value;
			if(data_value){
				let [dummy, id, params] = data_value.match(/^([^?&]+)(.*)$/) || [];
				if(id){
					id_array.push(id);
					params = params.replace(/^[?&]+/, '');
					let url = `//www.youtube.com/embed/${id}?rel=0&autoplay=1&${params}`;
					youtubeRepalcer(div_yt, id, url, 640, 360);
				}
			}
		});

		[
			['iframe[src*=youtube]', /^.+?\/embed\/([^?&]+)(.*)$/],
			['embed[src*=youtube]', /^.+?\/v\/([^?&]+)(.*)$/],
		].forEach(([selector, regexp])=>{
			[...document.querySelectorAll(selector)].forEach(iframe=>{
				let [url, id, params] = iframe.getAttribute('src').match(regexp) || [];
				if(id){
					id_array.push(id);
					let width = parseInt(iframe.getAttribute('width')) || 480;
					let height = parseInt(iframe.getAttribute('height')) || 360;
					params = params.replace(/^[?&]+/, '');
					let url = `//www.youtube.com/embed/${id}?rel=0&autoplay=1&${params}`;
					youtubeRepalcer(iframe, id, url, 640, 360);
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

	function showOnline(){
		addGlobalStyle(`
			.online {
				color:#777;
				font-size:11px;
				font-weight:normal;
				cursor:pointer;
				float1:right;
				margin-left1:42px;
			}
			.online_title {
				color:#333;
				float:none;
				margin-left:0;
			}
			.online a { color:inherit !important; text-decoration:none; }
			.online a:hover { color:#BF3A00 !important; }
		`);


		let menu_elem = document.querySelector('#tool a[href="https://gamedev.ru/job/forum/"].tool');
		if(menu_elem){
			let a = document.createElement('a');
			a.href = 'javascript:void(0)';
			a.id = 'show-online';
			a.className = 'tool';
			a.innerHTML = `
				<span id="online-status-desktop" style="width:15px" class="tool not-mobile">☺</span>
				<span id="online-status-mobile" style="width:15px" class="tool mobile">☺</span>
			`;
			menu_elem.parentNode.insertBefore(a, menu_elem.nextSibling);
		}

		var show_online = document.querySelector('a#show-online');

		addContainers();

		show_online.onclick = ()=>{
			getOnline(updateAll);
		};

		function setOnlineStatus(working){
			let text = (working ? '☻' : '☺');
			document.getElementById('online-status-desktop').innerHTML = text;
			document.getElementById('online-status-mobile').innerHTML = text;
		}

		function addContainer(subj, class_name){
			let div = document.createElement('div');
			div.className = class_name;
			div.setAttribute('data-subj', subj);
			div.onclick = ()=>{
				//div.innerHTML = '&nbsp;';
				div.innerHTML = '<br>';
				getOnline(online=>setText(div, online));
			};
			return div;
		}

		function addContainers(){
			var expr = new RegExp('(New!\\s+)|(\\[\\s+\\d+.*\\])|(\\(\\d+\\sстр\\))', 'g');
			[...document.querySelectorAll('h1[itemprop]')].forEach(node=>{
				let subj = node.textContent.replace(expr, '').trim();
				node.appendChild(addContainer(subj, 'online online_title'));
			});

			[...document.querySelectorAll('div.row a')].forEach(a=>{
				let subj = a.textContent.replace(expr, '').trim();
				if (isNaN(subj)){
					//a.appendChild(addContainer(subj, 'online'));
					a.closest('div').appendChild(addContainer(subj, 'online'));
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
				setOnlineStatus(true);
				let xhr = new XMLHttpRequest();
				xhr.open('GET', '/users/?online', true);
				xhr.onreadystatechange = function(){
					if (xhr.readyState != 4 || xhr.status != 200){
						return;
					}
					let element = document.createElement('div');
					element.innerHTML = xhr.responseText;
					let online = {s:{}, u:{}, l:{}, i:{}};
					[...element.querySelectorAll('table.page tr.sec td:nth-child(2) ul a')].forEach(node=>{
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
					setOnlineStatus(false);
				};
				xhr.send();
			}
		}
	}

	function sanitizeHtmlNode(node){
		var allowedTags = {
			'A': ['href'],
			'DIV': ['style'],
			'IMG': ['src'],
			'SPAN': ['style'],
			'TABLE': ['style', 'border', 'cellspacing', 'cellpadding'],
			'TR': ['bgcolor', 'align'],
			'TD': ['colspan', 'rowspan'],
		};

		var newNode;
		if(node.nodeType == Node.TEXT_NODE){
			newNode = node.cloneNode(true);
		}else if(node.nodeType == Node.ELEMENT_NODE /*&& allowedTags[node.tagName]*/){
			let allowedAttributes = allowedTags[node.tagName] || [];
			newNode = document.createElement(node.tagName);
			for(let i = 0; i < node.attributes.length; i++){
				let attr = node.attributes[i];
				if(allowedAttributes.indexOf(attr.name)!==-1){
					newNode.setAttribute(attr.name, attr.value);
				}
			}
			for(let i = 0; i < node.childNodes.length; i++){
				var subCopy = sanitizeHtmlNode(node.childNodes[i]);
				newNode.appendChild(subCopy, false);
			}
		}else{
			newNode = document.createDocumentFragment();
		}
		return newNode;
	}

	function supportHtmlPasting(){
		[...document.querySelectorAll('textarea.gdr')].forEach(textarea=>{
			var div = document.createElement('div');
			div.innerHTML = `<label><input type="checkbox" id="paste-html" style="vertical-align:middle; position:relative; bottom:1px;">paste as html</label>`;
			textarea.parentNode.insertBefore(div, textarea);
			textarea.style.marginTop = 0;

			textarea.addEventListener('paste', function(e){
				var cb = div.querySelector('input#paste-html');
				if(cb && cb.checked){
					if(e.clipboardData && e.clipboardData.getData){
						var htmlData = e.clipboardData.getData('text/html');
						if(htmlData){
							var doc = (new DOMParser()).parseFromString(htmlData, 'text/html');
							var html = sanitizeHtmlNode(doc.body);
							html = html.innerHTML
								.replace(/\r\n|\n|\r/gm, '')
								.trim();
							if(this.selectionStart || this.selectionStart==0){
								var before = this.value.substring(0, this.selectionStart);
								var after = this.value.substring(this.selectionEnd, this.value.length);
								this.value = before + html + after;
								this.selectionStart = this.selectionEnd = this.selectionStart + html.length;
							}else{
								this.value += html;
							}
							e.preventDefault();
						}
					}
				}
			});
		});
	}

	function oldStyleCSS(settings){
		let menu_width = '150px';
		addGlobalStyle(`
			#menu {
				left: 0px !important;
				margin-left: calc((100% - ${settings.width}) /2) !important;
			}
			div#menu ul {
				line-height: 80% !important;
				font-weight: normal !important;
			}
			div.head {
				background-color: #D5E0E0 !important;
				padding: 1px 4px 1px 4px !important;
				border: none !important;
			}
			div.bound.overflow {
				padding: 1px 4px 1px 4px !important;
			}
			div.row {
				background-color: #D5E0E0 !important;
				margin-left: 0 !important;
			}

			div.rubric {
				background-color: #AECCCC !important;
				padding: 4px 4px 4px 10px !important;
			}
			div.rubric a, div.rubric a:visited {
				color: #2E2E5C !important;
			}

			div.sect {
				background-color: #AECCCC !important;
				padding: 4px 4px 4px 10px !important;
			}
			div.sect a, div.sect a:visited {
				color: #2E2E5C !important;
			}

			hr.forum {
				display: none !important;
			}

			div.row a:not(.my):link {color: #55A0EF !important; }
			div.row a:not(.my):visited {color: #1E76dA !important; }

			div.bound > h1[itemprop] {
				background-color: #AECCCC !important;
				margin: 8px 0 8px 0 !important;
				padding: 4px 4px 4px 10px !important;
			}

			div.bound > div#preview + h2 {
				background-color: #D5E0E0 !important;
				margin: 8px 0 8px 0 !important;
				padding: 8px 8px 8px 8px !important;
			}

			span.date {
				margin: 0 !important;
				text-align: left !important;
				font-size: x-small !important;
				color: gray !important;
			}
			div.hbutton {
				border: none !important;
				color: #808080 !important;
			}
			div.hbutton:hover, div.hbutton:focus {
				color: black !important;
			}
			a[href="?a=add"].button.green{
				margin: 6px 4px !important;
			}

			span.row {
				display: none !important;
			}
			span.row.red:after {
				content: 'New!' !important;
				font-size: 12px !important;
			}

			table.page td {
				padding: 1px 8px 1px 8px !important;
			}

			div#menu {
				background-color: #244c65 !important;
				padding: 0px !important;
				max-width: ${menu_width} !important;
			}
			div#menu div.content {
				padding: 2px !important;
			}
			div#menu li {
				background-color: #92B4D7 !important;
			}
			div#menu li.sel {
				background-color: #CDD5DF !important;
			}
			div#menu li.sel ul {
				padding-top: 2px !important;
			}
			div#menu li.sel ul li {
				background-color: #CDD5DF !important;
				border-top: 1px solid #E7EDF3 !important;
			}
			div#menu li.sel ul li.sel {
				font-weight: bold !important;
			}
			div#menu a {
				color: black !important;
			}
			div#menu a:hover {
				text-decoration: underline !important;
			}

			span.row.bold + div.row > a:first-child,
			span.row.bold + div.row > span.red + a {
				font-weight: bold !important;
			}
		`);

		if(settings.left_menu_visible){
			addGlobalStyle(`
				div.bound {
					max-width: calc(${settings.width} - ${menu_width} - 10px) !important;
					padding-left: calc(${menu_width} + 2px) !important;
					background-clip1: content-box
				}
				div.bound.overflow {
					padding-left: calc(${menu_width} + 2px) !important;
				}
				div.wide {
					max-width: calc(${settings.width} - ${menu_width} - 2px) !important;
					padding-left: calc(${menu_width}) !important;
					margin: auto !important;
				}
			`);
		}else{
			addGlobalStyle(`
				div.bound {
					max-width: calc(${settings.width} - 30px) !important;
				}
			`);
		}

		if(settings.one_row_head){
			addGlobalStyle(`
				div.head {
					min-height: auto !important;
				}
				div.head ul {
					vertical-align: middle !important;
				}
				div.head li.bold {
					display: block !important;
					float: left !important;
				}
				div.head li.small {
					display: block !important;
					float: left !important;
					margin-top1: 4px !important;
					margin-left: 10px !important;
					line-height: 20px !important;
				}
			`);
		}

		if(settings.one_row_topics){
			addGlobalStyle(`
				div.row br {
					display: none !important;
				}
				div.row small span.q {
					color: gray !important;
					float: right !important;
				}
				div.row small span.q a {
					color: #0E66CA !important;
					float: right !important;
					width: 100px !important;
					text-align: right !important;
				}
			`);
		}
	}
})();
