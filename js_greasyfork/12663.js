// ==UserScript==
// @name        Baidu Search AutoPager
// @author      Crab
// @namespace   autopager@baidu.com
// @description 百度搜索自动翻页，网站预览图。
// @include     /^https?:\/\/www\.baidu\.com\/(?:(?:baidu|s)\?.*|[#?&].*)?$/
// @version     0.7.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12663/Baidu%20Search%20AutoPager.user.js
// @updateURL https://update.greasyfork.org/scripts/12663/Baidu%20Search%20AutoPager.meta.js
// ==/UserScript==
var loadingBar = null,
	scrollTimeout = null,
	content_left = document.getElementById('content_left'),
	_pager = document.getElementById('page'),
	resultsLength = document.querySelectorAll('#content_left>div.c-container').length,
	queryString = (location.search.match(/wd=[^&]+/) || [''])[0],
	pageNum = Math.floor(((location.search.match(/&pn=(\d+)/) || [0, 0])[1] - 0) / resultsLength), //初始页码
	imagesList = [],
	isLastPage = !_pager.lastElementChild || _pager.lastElementChild.localName === 'strong',
	container = null,
	tipsContainer = null;

var cE = function(name, attr, parent){
	var e = document.createElement(name);
	for (var i in attr || []) 
		i == 'text' ? (e.textContent = attr[i]) : e.setAttribute(i, attr[i]);
	parent && (Array.isArray(parent) ? 
		parent[0].insertBefore(e, parent.length == 2 ? parent[1] : parent[0].firstChild) : 
		parent.appendChild(e));
	return e;
}, addPreviews = function(list){
	[].forEach.call(list, function(div){
		var cite = div.querySelector('cite, .g, .c-showurl');
		if(!cite) return;
		var match = cite.textContent.trim().replace(/\.+$/, '').match(/(https?:\/\/)?([^/]+)/);
		match && match[2].length > 1 && imagesList.push(cE('img', {align: 'left', 'pic-src': 'https://'+ match[2].charAt(0) + '.searchpreview.de/preview?s='+ (match[1] || 'http://') + match[2] +'&ra=0'}, [div]));
	});
}, toggleLoadingBar = function(show){
	(loadingBar || (loadingBar = cE('div', {id:'loadingBar'}, [document.getElementById('foot')])))
		.classList[show ? 'add' : 'remove']('loading');
}, getNextPageData = function(url, callback){
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.send();
	req.onload = function(){
		callback((new DOMParser()).parseFromString(req.responseText, 'text/html'));
	};
}, nextPage = function(){
	toggleLoadingBar(true);
	var url = 's?tn=monline_dg&pn='+ ((pageNum + 1) * resultsLength) + '&' + queryString;
	getNextPageData(url, function(doc){
		//修复自动翻页后图片盒子
		var imageBox, dScript;
		if((imageBox = doc.querySelector('.c-border')) && 
			(dScript = imageBox.querySelector('script[data-compress]'))
		){try{
			imagesBoxFix(doc, JSON.parse(dScript.textContent
				.match(/{([^{}]|{[^{}]*})*}/)[0].replace(/\'/g, '"')));
		}catch(ex){}}
		var df = document.createDocumentFragment(),
			last = content_left.children[content_left.children.length - 1];
		[].forEach.call(doc.querySelectorAll('#content_left>div.c-container'), df.appendChild.bind(df));
		//添加预览图
		addPreviews(df.children);
		//往最后结果后面插入
		last.parentNode.insertBefore(df, last.nextElementSibling);
		//替换新页码
		var pageNumMenu = doc.getElementById('page'),
			_pageNumMenu = document.getElementById('page');
		_pageNumMenu.parentNode.replaceChild(pageNumMenu, _pageNumMenu);
		//更新地址
		history.pushState({}, doc.title, url);
		toggleLoadingBar();
		onScroll();
		resetMouseEvent();
		if(!pageNumMenu.lastElementChild || pageNumMenu.lastElementChild.localName === 'strong')
			return (isLastPage = true) && !imagesList.length && removeEventListener('scroll', onScroll); //图片都加载完成 最后一页
		else
			isLastPage = false;
		pageNum++;
	});
}, onResize = function(){
	var content_right = document.getElementById('content_right'), //右侧栏高度
		div_ch = 0; //第一页搜索项累计高
	onScroll();
	if(!content_right) return;
	[].forEach.call(content_left.children, function(div){
		div.style.width = (div_ch < content_right.clientHeight) ? 'calc(98% - '+ content_right.clientWidth +'px)' : '100%';
		div_ch += div.clientHeight;
	});
}, onScroll = function(){
	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(function(){
		isLastPage && !imagesList.length && removeEventListener('scroll', onScroll);

		var de = document.documentElement;
		if(!de.scrollTop) de = document.body;//兼容chrome
		if(!isLastPage && de.scrollTop + window.innerHeight > de.scrollHeight - 5){
			nextPage();
		}else{
			clearTimeout(scrollTimeout);
		}
		//lazyload
		var loadedList = [];
		imagesList.forEach(function(img){
			var r = img.getBoundingClientRect();
			if(r.bottom >= 0 && window.innerHeight >= r.top){
				loadedList.push(img);
				img.parentNode.classList.add('loading');
				img._loadCount = 0;
				img.onload = function(){
					this.parentNode.classList.remove('loading');
					this.onload = this.onerror = null;
				};
				//首字母递增重试5次
				img.onerror = function(){
					this._loadCount++;
					if(this._loadCount > 4) return this.onload();
					this.src = this.src.replace(/.(?=\.)/, function(s){
						return String.fromCharCode((((s = s.charCodeAt()) >= 48 && s < 57) || (s >= 97 && s < 122)) ? s + 1 : (s == 57 ? 97 : 48));
					});
				};
				img.src = img.getAttribute('pic-src');
				img.removeAttribute('pic-src');
			}
		});
		loadedList.forEach(function(img){
			imagesList.splice(imagesList.indexOf(img), 1);
		});
	}, 500);
}, resetMouseEvent = function(e){ //重置翻页后某些鼠标事件
	(container || (container = window.$('#container')))
		.undelegate('.c-tools', 'mouseover').undelegate('.c-tools', 'mouseout');
	(tipsContainer || (tipsContainer = window.$('#c-tips-container')))
		.undelegate('.c-tip-con', 'mouseover').undelegate('.c-tip-con', 'mouseout');
	with(window) bds && bds.se && bds.se.tools && bds.se.tools();
	//vip评级按钮
	if(!e) with(window) bds && bds.se && bds.se.trust && bds.se.trust.init();
}, imagesBoxFix = function (doc, iamgesDate) { //修复自动翻页后图片盒子
	var pageSize = 8,
		pager = doc.querySelector('.op_jingyan_pager'),
		showmore = doc.querySelector('.op_jingyan_list_showmore'),
		hiedmore = doc.querySelector('.op_jingyan_list_hide'),
		list1 = doc.querySelector('.op_jingyan_list1'),
		list2 = doc.querySelector('.op_jingyan_list2'),
		currentPage = 1,
		count = iamgesDate.images.length,
		pageCount = Math.ceil(count / pageSize);
	var show = function(element){
		if(element) element.style.display = 'block';
	}, hide = function(element){
		if(element) element.style.display = 'none';
	};
	showmore.firstElementChild.onclick = function () {
		show(list2), show(hiedmore), show(pager), hide(showmore);
	}, hiedmore.firstElementChild.onclick = function () {
		hide(list2), hide(hiedmore), hide(pager), show(showmore), currentPage = 1, renderRow(1), renderPager()
	};
	var renderPager = function () {
		var count = pageCount;
		if (!(count < 1)) {
			var html = [],
				shown = {}, draw = function (index) {
					if (shown[index]) return '';
					if (shown[index] = true, index == currentPage) return '<span class="op_jingyan_pager_current">' + currentPage + '</span>';
					else return '<span class="op_jingyan_pager_item" data-page="' + index + '">' + index + '</span>'
				};
			if (currentPage > 1) html.push('<span class="op_jingyan-prev op_jingyan_pager_item" data-page="' + (currentPage - 1) + '">上一页</span>');
			var point = currentPage;
			if (count - 2 < point) point = count - 2;
			if (point < 5) if (count < 5) point = count;
			else point = 5;
			if (point > 5) html.push(draw(1)), html.push('<span class="op_jingyan_pager_seperator">...</span>'), html.push(draw(point - 2)), html.push(draw(point - 1));
			else for (var i = 1; i < point; i++) html.push(draw(i));
			if (html.push(draw(point)), point = currentPage, point < 3) point = 3;
			if (count - point < 4) if (point = count - 2, point < 1) point = 1;
			if (count - point > 4) html.push(draw(point + 1)), html.push(draw(point + 2)), html.push('<span class="op_jingyan_pager_seperator">...</span>'), html.push(draw(count));
			else for (var i = point; i <= count; i++) html.push(draw(i));
			if (currentPage < count) html.push('<span class="op_jingyan-next op_jingyan_pager_item" data-page="' + (currentPage + 1) + '">下一页</span>');
			if(pager){
				pager.innerHTML = html.join('');
				var items = pager.querySelectorAll('.op_jingyan_pager_item');
				[].forEach.call(items, function (item) {
					var index = parseInt(item.getAttribute('data-page'), 10);
					item.onclick = function (e) {
						if(e.button !=0) return;
						renderRow(index);
						var oldPage = currentPage;
						currentPage = index, (pager.innerHTML = '<span class="op_jingyan_pager_loading">加载中...</span>'), renderPager()
					}
				})
			}
		}
	}, renderRow = function (index) {
		index -= 1;
		for (var imgData = iamgesDate.images.slice(index * pageSize, index * pageSize + pageSize), list1Html = [], list2Html = [], i = 0; i < pageSize / 2; i++) if (imgData[i]) list1Html.push(renderCell(imgData[i], index * pageSize + i));
		for (var i = pageSize / 2; i <= pageSize; i++) if (imgData[i]) list2Html.push(renderCell(imgData[i], index * pageSize + i));
		(list1.innerHTML = list1Html.join('')), (list2.innerHTML= list2Html.join(''))
	}, renderCell = function (data, index) {
		var cellHtml = [];
		if (3 === index % (pageSize / 2)) cellHtml.push('<div class="c-span6 c-span-last op_jingyan_list">');
		else cellHtml.push('<div class="c-span6 op_jingyan_list">');
		if (data.imglinkurl) cellHtml.push('<a href="' + data.imglinkurl + '" target="_blank">');
		if (data.imgurl) cellHtml.push('<img class="c-img c-img6" src="' + data.imgurl + '" />');
		if (data.imgtext && 'true' == iamgesDate.detailFlag) cellHtml.push('<p class="c-gap-top-small">' + data.imgtext + '</p>');
		if (data.imglinkurl) cellHtml.push('</a>');
		return cellHtml.push('<span class="op_jingyan_index">' + (parseInt(index, 10) + 1) + '</span>'), cellHtml.push('</div>'), cellHtml.join('')
	};
	renderPager()
}, removeADResults = function(results){
	Array.prototype.forEach.call(results, function(r){
		var m = r.querySelector('.m');
		if(m && m.textContent.trim() === '\u5E7F\u544A')
			r.remove();
	});
	return results;
};

var cssText = (function(){/*
	// 序号
	body {
		counter-reset: resultNum;
		min-width: 600px!important;
		--loading-spinner: url('data:image/gif;base64,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') no-repeat center;
	}
	.c-border{
		margin-left: 120px;
	}
	.c-container h3::before{
		content: counter(resultNum) ". ";
		counter-increment: resultNum;
		color: #000 !important;
	}
	#container{
		width: 100%!important;
		margin: 0;
		padding: 0;
	}
	#content_left {
		width:90% !important;
		padding:0 5% !important;
		float:none!important;
	}
	#content_right{
		float:none!important;
		position: absolute;
		right: 5%;
	}
	#content_left .c-container{
		width: 100%;
		min-height: 90px;
	}
	.c-container>img{
		width:111px;
		height:82px;
		border: 1px solid #BBB;
		margin: 2px 4px 5px 0px;
	}

	.c-container{
		position: relative;
	}
	.c-container.loading::before{
		content: '';
		position: absolute;
		left: 1px;
		top: 3px;
		width: 111px;
		height: 82px;
		background: rgba(255,255,255,.8) var(--loading-spinner);
	}
	.c-container>img{
		opacity:1;
		transition: opacity 500ms ease-in-out 0s;
	}
	.c-container.loading>img{
		opacity:.3;
	}
	#loadingBar{
		width: 32px;
		height: 32px;
		margin-left: calc(50% - 16px);
		background: var(--loading-spinner);
	}
	#loadingBar:not(.loading){
		display:none;
	}

	//修复自动翻页后 图片框 丢失的样式
	.op_jingyan_list{position:relative}.op_jingyan_list .op_jingyan_index{position:absolute;top:74px;left:0;width:20px;height:20px;padding:1px 0;background-color:rgba(0,0,0,.6);font-size:12px;color:#ddd;text-align:center}:root .op_jingyan_list .op_jingyan_index{filter:none;background-color:rgba(0,0,0,.6)}.op_jingyan_list a{text-decoration:none;color:#333;font-size:12px}.op_jingyan_list img{height:92px}.op_jingyan_list_hide,.op_jingyan_list_showmore{border-top:1px solid #f3f3f3;text-align:center;padding-top:5px}.op_jingyan_list_hide span,.op_jingyan_list_showmore span{cursor:pointer}.op_jingyan_list2,.op_jingyan_list_hide,.op_jingyan_pager{display:none}.op_jingyan_pager{text-align:center;overflow:hidden;padding:4px 0}.op_jingyan_pager span{display:inline-block;border:1px solid #d5d5d5;overflow:hidden;padding:3px 7px;margin:0 1px;color:#00c;text-decoration:none;line-height:18px;font:400 12px Arial,Helvetica,sans-serif;text-align:center;vertical-align:middle}.op_jingyan_pager .op_jingyan_pager_current,.op_jingyan_pager .op_jingyan_pager_loading,.op_jingyan_pager .op_jingyan_pager_seperator{border:none;padding:4px 8px;color:#666}.op_jingyan_pager .op_jingyan_pager_current{color:#000}.op_jingyan_pager .op_jingyan_pager_item{cursor:pointer}
	//修复天气错位
	div.op_weather4_twoicon_container_div, .op_weather4_twoicon_wlink{width:538px; margin-left:120px;}
	.op_weather4_twoicon_today{left:0}
*/}).toString().replace(/^.*|\/\/.*|.*\}$/g, '');
if(navigator.userAgent.indexOf('WebKit')>-1 || //chrome 还不支持css变量；
	navigator.userAgent.indexOf('Firefox')>-1 && 
	parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) < 31 //FF31下不支持标准css变量
){
	cssText = cssText.replace(/var\(--loading-spinner\)/g, cssText.match(/--loading-spinner\s*:(.*)/)[1]);
}
cE('style', {text: cssText}, document.head);
//noreferrer
cE('meta', {name: 'referrer', content: 'never'}, document.head);
//第一页预览
content_left && addPreviews(
	removeADResults(//移除第一页广告结果
		content_left.querySelectorAll('#content_left>div.c-container')
	)
);
onResize();
onScroll();
addEventListener('load', resetMouseEvent);
addEventListener('resize', onResize);
addEventListener('scroll', onScroll);
