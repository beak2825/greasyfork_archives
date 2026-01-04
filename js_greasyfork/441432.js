// ==UserScript==
// @name         视频解析接口调用
// @namespace    vqq
// @version      0.2
// @description  替换v.qq.com搜索页播放链接
// @author       unknownuser001
// @match        https://v.qq.com/x/search/?q=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdBJREFUWEftlrtLw1AYxc+X3rZpY3FxFGd3cRH8AxxFECcfLT4WK2qkgh2iiw/qi6qLoC4uDuLi7tBNwcFJBRcdRURabfr6pEVBBZNrG8nSzIfv/O6537mE4PJHLvujDlBPwDaB5V1u9gj0MINLRRzHhunBycW1BFjZ506FcQogVDFlZEFIpPNYNEbp1QkQS4DEHl8AaPtpxIx7APpMhI5qhbADyAMQFiZnCiE6NURX1YLYAbDE4BIYhyhgSh+lRwn9N4kTAB/rgSciLLRo2OrtpaIsiGMAn4YMXBIjqkcoJQPhOEClLAwmwgELjM/0U8YK5F8Avhju62EKuwfAyKXvoRkGFX6DsExgIG7KtODXAxIBoWefmkyS6QpAQ4Cut+d8rVVfQbUJlE8eVOk24Pd2rOrWb4PjV+D34k1Thb4e8+zUXMO/JKAQs6Z5Tpqyos8wKCdjXtY4koCm0p0a8HatTdONrPGnzhJgMG6yVQ1UPz03BpTIii6O/2osBTAyb2bMPII/hwsPiqGgktyIeSerNZYCmE4Ux55e8julUnmvgUqvVSXl84tuu+2WBbP9JZtI5NpRoNnKQMFLm7rvXHa4jM4WQGZILZo6QD0B1xN4B/iKmyF8Ne2sAAAAAElFTkSuQmCC
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_registerMenuCommand
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/441432/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441432/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8.meta.js
// ==/UserScript==


// 解析接口来自
// https://greasyfork.org/zh-CN/scripts/418804
const originalInterfaceList = [
	{"name":"乐多资源","category":"1","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", "id":"leduotv"},
	{"name":"M3U8.TV","category":"1","url":"https://jx.m3u8.tv/jiexi/?url=", "id":"m3u8"},
	{"name":"人人迷","category":"1","url":"https://jx.blbo.cc:4433/?url=", "id":"blbo"},
	{"name":"七哥","category":"1","url":"https://jx.mmkv.cn/tv.php?url=", "id":"mmkv"},
	{"name":"冰豆","category":"1","url":"https://api.qianqi.net/vip/?url=", "id":"qianqi"},
	{"name":"迪奥","category":"1","url":"https://123.1dior.cn/?url=", "id":"1dior"},
	{"name":"CK","category":"1","url":"https://www.ckplayer.vip/jiexi/?url=", "id":"ckplayer"},
	{"name":"游艺","category":"1","url":"https://api.u1o.net/?url=", "id":"u1o"},
	{"name":"LE","category":"1","url":"https://lecurl.cn/?url=", "id":"lecurl"},
	{"name":"ckmov","category":"1","url":"https://www.ckmov.vip/api.php?url=", "id":"ckmovvip"},
	{"name":"ccyjjd","category":"1","url":"https://ckmov.ccyjjd.com/ckmov/?url=", "id":"ccyjjd"},
	{"name":"爱豆","category":"1","url":"https://jx.aidouer.net/?url=", "id":"aidouer"},
	{"name":"诺诺","category":"1","url":"https://www.ckmov.com/?url=", "id":"ckmovcom"},
	{"name":"H8","category":"1","url":"https://www.h8jx.com/jiexi.php?url=", "id":"h8jx"},
	{"name":"BL","category":"1","url":"https://vip.bljiex.com/?v=", "id":"bljiex"},
	{"name":"解析la","category":"1","url":"https://api.jiexi.la/?url=", "id":"jiexila"},
	{"name":"MUTV","category":"1","url":"https://jiexi.janan.net/jiexi/?url=", "id":"janan"},
	{"name":"MAO","category":"1","url":"https://www.mtosz.com/m3u8.php?url=", "id":"mtosz"},
	{"name":"老板","category":"1","url":"https://vip.laobandq.com/jiexi.php?url=", "id":"laobandq"},
	{"name":"盘古","category":"1","url":"https://www.pangujiexi.cc/jiexi.php?url=", "id":"pangujiexi"},
	{"name":"盖世","category":"1","url":"https://www.gai4.com/?url=", "id":"gai4"},
	{"name":"小蒋","category":"1","url":"https://www.kpezp.cn/jlexi.php?url=", "id":"kpezp"},
	{"name":"YiTV","category":"1","url":"https://jiexi.us/?url=", "id":"jiexius"},
	{"name":"星空","category":"1","url":"http://60jx.com/?url=", "id":"60jx"},
	{"name":"0523","category":"1","url":"https://go.yh0523.cn/y.cy?url=", "id":"yh0523"},
	{"name":"17云","category":"1","url":"https://www.1717yun.com/jx/ty.php?url=", "id":"1717yun"},
	{"name":"4K","category":"1","url":"https://jx.4kdv.com/?url=", "id":"4kdv"},
	{"name":"云析","category":"1","url":"https://jx.yparse.com/index.php?url=", "id":"yparse"},
	{"name":"8090","category":"1","url":"https://www.8090g.cn/?url=", "id":"8090g"},
	{"name":"江湖","category":"1","url":"https://api.jhdyw.vip/?url=", "id":"jhdyw"},
	{"name":"诺讯","category":"1","url":"https://www.nxflv.com/?url=", "id":"nxflv"},
	{"name":"PM","category":"1","url":"https://www.playm3u8.cn/jiexi.php?url=", "id":"playm3u8"},
	{"name":"奇米","category":"1","url":"https://qimihe.com/?url=", "id":"qimihe"},
	{"name":"思云","category":"1","url":"https://jx.ap2p.cn/?url=", "id":"ap2p"},
	{"name":"听乐","category":"1","url":"https://jx.dj6u.com/?url=", "id":"dj6u"},
	{"name":"aijx","category":"1","url":"https://jiexi.t7g.cn/?url=", "id":"t7g"},
	{"name":"52","category":"1","url":"https://vip.52jiexi.top/?url=", "id":"52jiexi"},
	{"name":"黑米","category":"1","url":"https://www.myxin.top/jx/api/?url=", "id":"myxin"},
	{"name":"豪华啦","category":"1","url":"https://api.lhh.la/vip/?url=", "id":"lhh"},
	{"name":"凉城","category":"1","url":"https://jx.mw0.cc/?url=", "id":"mw0"},
	{"name":"33t","category":"1","url":"https://www.33tn.cn/?url=", "id":"33tn"},
	{"name":"180","category":"1","url":"https://jx.000180.top/jx/?url=", "id":"000180"},
	{"name":"无名","category":"1","url":"https://www.administratorw.com/video.php?url=", "id":"administratorw"},
	{"name":"黑云","category":"1","url":"https://jiexi.380k.com/?url=", "id":"380k"},
	{"name":"九八","category":"1","url":"https://jx.youyitv.com/?url=", "id":"youyitv"},
	{"name":"综合线路解析","category":"2","url":"https://www.xixicai.top/mov/s/?sv=3&url=", "id":"xixicai"},
	{"name":"纯净/B站","category":"2","url":"https://z1.m1907.cn/?jx=", "id":"m1907"},
	{"name":"高速接口","category":"2","url":"https://jsap.attakids.com/?url=", "id":"attakids"},
	{"name":"综合/B站1","category":"2","url":"https://vip.parwix.com:4433/player/?url=", "id":"parwix"},
	{"name":"OK解析","category":"2","url":"https://okjx.cc/?url=", "id":"okjx"},
	{"name":"夜幕","category":"2","url":"https://www.yemu.xyz/?url=", "id":"yemu"},
	{"name":"虾米","category":"2","url":"https://jx.xmflv.com/?url=", "id":"xmflv"},
	{"name":"全民","category":"2","url":"https://jx.quanmingjiexi.com/?url=", "id":"quanmingjiexi"},
];

const noSiteId = '__no_parse_site__';

let SelectedSite;
initSelectedSite();

const __app_main__ = function() {

	injectCss();
	injectSiteSelectorButton();
	setTimeout(openFoldItemsAdnInjectLink, 1000);
	GM_registerMenuCommand('选择解析站点', showSiteSelectorWindow);
}

function openFoldItemsAdnInjectLink() {
	if (openFoldItems()) {
		setTimeout(injectLink, 1000);
	} else {
		injectLink();
	}
}

function openFoldItems() {
	//展开所有剧集
	let foldBtns = document.querySelectorAll('div.item_fold > a');
	let foldClicked = false;
	for (let i = 0; i < foldBtns.length; i++) {
		if (foldBtns[i].parentElement.className.indexOf('item_unfold') < 0) {
			foldBtns[i].click();
			foldClicked = true;
		}
	}
	return foldClicked;
}

function injectLink() {
	let link1 = Array.prototype.slice.call(document.querySelectorAll('div.item > a'), 0);
	let link2 = Array.prototype.slice.call(document.querySelectorAll('div._playlist > div.result_btn_line > a.btn_primary'), 0);
	let link3 = Array.prototype.slice.call(document.querySelectorAll('div._infos > div > a.figure'), 0);
	let link4 = Array.prototype.slice.call(document.querySelectorAll('div._infos > div > h2.result_title > a'), 0);
	let link5 = Array.prototype.slice.call(document.querySelectorAll('div.info_item.info_item_desc > span.desc_text > a.desc_more'), 0);
	let aniLinks = [];
	let itemLinks = link1.concat(link2).concat(link3).concat(link4).concat(link5);
	for (let i = 0; i < itemLinks.length; i++) {
		let itemLink = itemLinks[i];
		let noClassItemFold = (itemLink.parentElement.className.indexOf('item_unfold') < 0);
		let noClassItemUnFold = (itemLink.parentElement.className.indexOf('item_fold') < 0);
		let parsedUrl = parseUrl(itemLink.href);
		let isRedirectSearchReuslt = (parsedUrl.pathname.indexOf('search_redirect.html') > 0);
		let oUrl;
		if (itemLink.attributes.oUrl == undefined) {
			if (isRedirectSearchReuslt) {
				oUrl = parsedUrl.query.url;
				if (oUrl.indexOf('?') > 0) {
					oUrl = oUrl.split('?')[0];
				} else {
					oUrl = '';
				}
			} else {
				oUrl = itemLink.href;
			}
		} else {
			oUrl = itemLink.attributes.oUrl;
		}

		if (noClassItemUnFold && noClassItemFold) {
			itemLink.attributes.oUrl = oUrl;
			itemLink.href = SelectedSite.url + oUrl;
			if (itemLink.parentNode.classList.contains('item')) {
				let mark = itemLink.parentNode.querySelector('span');
				aniLinks.push(itemLink);
				if (mark != undefined && mark.attributes.labelFree != true) {
				    mark.className += " hide-mark";
				} else {
					mark = document.createElement('span');
					itemLink.parentNode.appendChild(mark);
				}
			}
		} else if (!noClassItemUnFold) {
			itemLink.parentNode.remove();
		}
	}

	setTimeout(function(){
		for (let i = 0; i < aniLinks.length;i++) {
			let itemLink = aniLinks[i];
			let mark = itemLink.parentNode.querySelector('span');
			if (mark == undefined) {
				mark = document.createElement('span');
				itemLink.parentNode.appendChild(mark);
			}
			if (mark.attributes.labelFree == true) {
				continue;
			}
			mark.className = "mark_v";
			mark.className += ' free-video';
			mark.innerHTML = '免';
			mark.className += ' free-video-ani';
			mark.attributes.labelFree = true;
		}


		let tabResult = document.querySelectorAll('div._playlist div.result_tabs > a');
		if (tabResult == undefined) {
			return;
		}

		for ( let i = 0; i < tabResult.length; i++) {
			let t = tabResult[i];
			if (t.__event_added) {
				continue;
			}
			t.__event_added = true;
			t.addEventListener('click', function () {
				setTimeout(openFoldItemsAdnInjectLink, 1000);
			});
		}


	}, 1000);
	let allCover = document.querySelectorAll('div._infos > div > a > span.mark_v');
	for ( let i = 0 ; i < allCover.length; i++){
		allCover[i].innerHTML = '免费';
		allCover[i].className = allCover[i].className +' free-video-2';
	}
}



function parseQuery(search) {
	var args = search.substring(1).split('&');
	var argsParsed = {};
	var i, arg, kvp, key, value;
	for (i = 0; i < args.length; i++) {
		arg = args[i];
		if (-1 === arg.indexOf('=')) {
			argsParsed[decodeURIComponent(arg).trim()] = true;
		} else {
			kvp = arg.split('=');
			key = decodeURIComponent(kvp[0]).trim();
			value = decodeURIComponent(kvp[1]).trim();
			argsParsed[key] = value;
		}
	}
	return argsParsed;
}

function parseUrl(url) {
	let urlParser = document.createElement('a');
	urlParser.href = url;
	return {
		protocol: urlParser.protocol,
		host: urlParser.host,
		hostname: urlParser.hostname,
		port: urlParser.port,
		pathname: urlParser.pathname,
		query: parseQuery(urlParser.search),
		hash: urlParser.hash
	};
}

//https://codepen.io/avstorm/pen/jxjKGj
function injectCss() {
	let modalDialogCss = `
		#siteSelectorPopDiv{
			display: none;
			background-color: #f5f5f5;
			z-index: 11;
			width: 300px;
			height: 400px;
			position:fixed;
			top:0;
			right:0;
			left:0;
			bottom:0;
			margin:auto;
			border-radius: 10px;
			border: 2px solid #7d7d7d;
			border-width: 2px;
			box-shadow: 0 0 15px #7d7d7d;
		}

		#siteSelectorPopDiv .content-wrapper {
			overflow-y: scroll;
			height: 350px;
			width:295px;
		}
		#siteSelectorPopDiv .content {
			width: 95%;
			margin-top: 6px;
			display: grid;
			padding:5px;
			grid-template-columns: repeat(2, 130px);
			grid-column-gap: 10px;
			grid-row-gap: 5px;
			font-size: 9px;
		}
		#siteSelectorPopDiv .buttons {
			width:80%;
			margin:auto;
			display: flex;
			justify-content: space-between;
			padding-top: 8px;
		}

		#siteSelectorPopDiv .buttons > button {
			box-shadow:inset 0px 1px 0px 0px #ffffff;
			background:linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);
			background-color:#f9f9f9;
			border-radius:6px;
			border:1px solid #dcdcdc;
			display:inline-block;
			cursor:pointer;
			color:#666666;
			font-family:Arial;
			font-size:15px;
			font-weight:bold;
			padding:6px 24px;
			text-decoration:none;
			text-shadow:0px 1px 0px #ffffff;
		}
		#siteSelectorPopDiv .buttons > button:hover {
			background:linear-gradient(to bottom, #e9e9e9 5%, #f9f9f9 100%);
			background-color:#e9e9e9;
		}
		#siteSelectorPopDiv .buttons > button:active {
			position:relative;
			top:1px;
		}

		input[type="radio"] {
		  vertical-align:middle;
		}

		.radio {
		  position: relative;
		  cursor: pointer;
		  font-size: 16px;
		  margin: 5px;
		  height: 24px;
		  overflow-y: hidden;
		  color: black;
		}
		.radio .label {
		  position: relative;
		  display: block;
		  float: left;
		  margin-right: 10px;
		  width: 20px;
		  height: 20px;
		  border: 2px solid #c8ccd4;
		  border-radius: 100%;
		  -webkit-tap-highlight-color: transparent;
		}
		.radio .label:after {
		  content: '';
		  position: absolute;
		  top: 5px;
		  left: 5px;
		  width: 10px;
		  height: 10px;
		  border-radius: 100%;
		  background: #0080c0;
		  transform: scale(0);
		  transition: all 0.2s ease;
		  opacity: 0.08;
		  pointer-events: none;
		}
		.radio:hover .label:after {
		  transform: scale(3.6);
		}
		input[type="radio"]:checked + .label {
		  border-color: #0080c0;
		}
		input[type="radio"]:checked + .label:after {
		  transform: scale(1);
		  transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
		  opacity: 1;
		}
		.hidden {
		  display: none;
		}

		.free-video {
		    color: #f8f8f8!important;
		    width: 16px!important;
		    height: 16px!important;
		    font-size: 12px!important;
		    text-align: center!important;
		    vertical-align: middle!important;
		    border-radius: 10px!important;
		    margin: 0!important;
		    background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%)!important;
		    top: -2px!important;
		    right: -2px!important;
		    transform: rotate(30deg)!important;
			padding-bottom: 2px;
			padding-left: 1px;
			opacity: 90%;

		}

		.free-video-ani {
			transition: opacity 1s linear;
		}

		.free-video-2 {
			color: white!important;
			width: 30px!important;
			height: 20px!important;
			font-size: 12px!important;
			text-align: center!important;
			vertical-align: middle!important;
			border-radius: 5px!important;
			margin: 0!important;
			background-image: linear-gradient(#ff6429, #f5f900c9)!important;
			top: 2px!important;
			right: 2px!important;
			opacity: 70%;
		}

		.hide-mark {
		  visibility: hidden;
		  opacity: 0;
		  transition: visibility 0s 2s, opacity 1s linear;
		}
	`;
	GM_addStyle(modalDialogCss);
}

function closeSiteSelectorWindow() {
	let ssw = document.getElementById('siteSelectorPopDiv');
	if (ssw != undefined) {
		ssw.remove()
	}
}

function saveSiteSelectorWindow() {
	var siteRadios = document.getElementsByName("siteRadio");
	for (let i = 0; i < siteRadios.length; i++) {
		if (siteRadios[i].checked) {
			SelectedSite.id = siteRadios[i].value;
			GM_setValue('selectedSite', SelectedSite.id);
			initSelectedSite();
			injectSiteSelectorButton();
			openFoldItemsAdnInjectLink();
		}
	}
	closeSiteSelectorWindow();
}

function showSiteSelectorWindow() {
	let siteSelectorPopDiv = document.createElement('div');
	siteSelectorPopDiv.id = 'siteSelectorPopDiv';
	siteSelectorPopDiv.innerHTML = `
	<div class='content-wrapper'>
		<div class="content">
		</div>
	</div>
	<div class="buttons">
	    <button class="save">保存</button><button class="close">关闭</button>
	</div>
	`;
	document.body.appendChild(siteSelectorPopDiv);
	document.querySelector('#siteSelectorPopDiv > div.buttons > button.save')
		.addEventListener('click', saveSiteSelectorWindow);
	document.querySelector('#siteSelectorPopDiv > div.buttons > button.close')
		.addEventListener('click', closeSiteSelectorWindow);

	let selectorHtml = `
	<label for="${noSiteId}" class="radio">
		<input ${isNoSiteId(SelectedSite.id) ? 'checked' : ''} type="radio" class="hidden" name="siteRadio" id="${noSiteId}" value="${noSiteId}"/>
		<span class="label"></span>无解析
	</label>
	<span></span>
	`;

	originalInterfaceList.forEach(function(item, index) {
		selectorHtml += `
		<label for="${item.id}" class="radio">
			<input ${SelectedSite.id == item.id ? 'checked' : ''} + type="radio" class="hidden" name="siteRadio" id="${item.id}" value="${item.id}"/>
			<span class="label"></span>${item.name}
		</label>
		`;
	});

	document.querySelector('#siteSelectorPopDiv div.content').innerHTML = selectorHtml;

	siteSelectorPopDiv.style.display = 'block';
	return siteSelectorPopDiv;
}

function injectSiteSelectorButton(){

	let lastElement = document.querySelector('#search_container > div.search_tools > div > div.filter_tip.none');

	if (document.querySelector('#search_container div.filter_item > a.doParseLink') == undefined) {
		let doParseLinkButton = document.createElement('div');
		doParseLinkButton.innerHTML = '<a class="doParseLink" href="javascript:void(0)">〖点此解析〗</a>';
		doParseLinkButton.className = 'filter_item';
		document.querySelector('#search_container > div.search_tools > div').insertBefore(doParseLinkButton, lastElement);
		document.querySelector('#search_container div.filter_item > a.doParseLink').addEventListener('click', openFoldItemsAdnInjectLink);
	}

	if (document.querySelector('#search_container div.filter_item > a.openSiteSelector') == undefined) {
		let parseSite = document.createElement('div');
		parseSite.innerHTML = `<a class="openSiteSelector" href="javascript:void(0)">选择解析(当前：${SelectedSite.name})</a>`;
		parseSite.className = 'filter_item';
		document.querySelector('#search_container > div.search_tools > div').insertBefore(parseSite, lastElement);
		document.querySelector('#search_container div.filter_item > a.openSiteSelector').addEventListener('click', function(){
			showSiteSelectorWindow();
		});
	} else {
		document.querySelector('#search_container div.filter_item > a.openSiteSelector').innerHTML = `选择解析(当前：${SelectedSite.name})`;
	}

}

function initSelectedSite() {
	let name;
	let url;
	let id = GM_getValue('selectedSite');
	if (id == undefined) {
		id = 'xixicai';
	}
	originalInterfaceList.forEach(function(item, index) {
		if (id == item.id) {
			id = item.id;
			url = item.url;
			name = item.name;
		}
	});
	if ( isNoSiteId(id) || name == undefined) {
		SelectedSite = {
			"name": '无解析',
			"id": noSiteId,
			"url": ''
		};
		return;
	}
	SelectedSite = {
		"name": name,
		"id": id,
		"url": url
	}
};

function isNoSiteId(id){
	return id == noSiteId;
}


__app_main__();





















