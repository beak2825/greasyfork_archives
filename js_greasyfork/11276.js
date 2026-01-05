// ==UserScript==
// @name        Bing Search AutoPager
// @author      Crab
// @namespace   autopager@bing.com
// @description 必应自动翻页，网站预览图。
// @include     /^https?:\/\/[^\.]+\.bing\.com\/search\?.*/
// @version     0.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11276/Bing%20Search%20AutoPager.user.js
// @updateURL https://update.greasyfork.org/scripts/11276/Bing%20Search%20AutoPager.meta.js
// ==/UserScript==

var loadingBar = null,
	scrollTimeout = null,
	originList = document.querySelectorAll('#b_results>li'),//初始页列表
	currentList = document.getElementsByClassName('b_algo'),//结果列表，live HTMLCollection
	resultsLength = currentList.length,
	queryString = location.search.match(/q=[^&]+/)[0],
	pageNum = Math.floor(((location.search.match(/&first=(\d+)/) || [0, 0])[1] - 0) / resultsLength + 1), //初始页码
	imagesList = [],
	isLastPage = false;

var cE = function(name, attr, parent){
	var e = document.createElement(name);
	for (var i in attr || []) 
		i == 'text' ? (e.textContent = attr[i]) : e.setAttribute(i, attr[i]);
	parent && (Array.isArray(parent) ? 
		parent[0].insertBefore(e, parent.length == 2 ? parent[1] : parent[0].firstChild) : 
		parent.appendChild(e));
	return e;
}, addPreviews = function(list){
	[].forEach.call(list, function(li){
		var match = li.querySelector('h2>a').href.match(/https?:\/\/([^\/]+)/);
		imagesList.push(cE('img', {align: 'left', 'pic-src': 'https://'+ match[1].charAt(0) + '.searchpreview.de/preview?s='+ match[0] +'&ra=0'}, [li]));
	});
}, toggleLoadingBar = function(show){
	(loadingBar || (loadingBar = cE('div', {id:'loadingBar'}, cE('li', null, [currentList[0].parentNode, currentList[0].parentNode.lastElementChild.previousElementSibling]))))
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
	var url = 'search?pc=MOZI&first='+ (pageNum * resultsLength + 1) + '&' + queryString;
	getNextPageData(url, function(doc){
		//修复自带预览图
		[].forEach.call(doc.querySelectorAll('body>script:not([src]):not([data-rms])'), function(s){
			var match = s.textContent.match(/x=_ge\('(emb\d+)'\);if\(x\)\{x\.src='(data:image[^']+)/);
			if(match) doc.getElementById(match[1]).src = match[2];
		});
		var df = document.createDocumentFragment(),
			last = currentList[currentList.length - 1];
		[].forEach.call(doc.querySelectorAll('#b_results>.b_algo'), df.appendChild.bind(df));
		//添加预览图
		addPreviews(df.children);
		//往最后结果后面插入
		last.parentNode.insertBefore(df, last.nextElementSibling);
		//替换新页码
		var pageNumMenu = doc.getElementById('b_results').lastElementChild;
		last.parentNode.replaceChild(pageNumMenu, last.parentNode.lastElementChild);
		//更新地址
		history.pushState({}, doc.title, url);
		toggleLoadingBar();
		onScroll();
		if(!pageNumMenu.querySelector('nav[role="navigation"]') ||
			pageNumMenu.querySelector('nav>ul>li:last-of-type>a:not([href])')){
			return (isLastPage = true) && !imagesList.length && removeEventListener('scroll', onScroll); //图片都加载完成 最后一页
		}else{
			isLastPage = false;
		}
		pageNum++;
	});
}, onResize = function(){
	var b_context = document.getElementById('b_context'), //右侧栏高度
		li_ch = 0, //第一页搜索项累计高
		isMaxWidth = document.documentElement.clientWidth < 800;
	onScroll();
	b_context.classList[isMaxWidth ? 'remove' : 'add']('b_resize');
	b_context.style.width = isMaxWidth ? 'auto' : '250px';
	[].forEach.call(originList, function(li){
		li.style.width = (li_ch < b_context.clientHeight) ? (isMaxWidth ? '' : 'calc(90% - '+ b_context.clientWidth +'px)') : '';
		li_ch += li.clientHeight;
	});
}, onScroll = function(){
	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(function(){
		var de = document.documentElement;
		if(!de.scrollTop) de = document.body;//兼容chrome
		!isLastPage && de.scrollTop + window.innerHeight > de.scrollHeight - 5 && nextPage();
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
						s = s.charCodeAt();
						return String.fromCharCode(((s >= 48 && s < 57) || (s >= 97 && s < 122)) ? s + 1 : (s == 57 ? 97 : 48));
					});
				};
				img.src = img.getAttribute('pic-src');
				img.removeAttribute('pic-src');
			}
		});
		loadedList.forEach(function(img){
			imagesList.splice(imagesList.indexOf(img), 1);
		});
	}, 300);
};

var cssText = (function(){/*
	#b_content{
		padding: 0px 0px 20px 5%!important;
	}
	#b_results{
		width:95%;
	}
	.b_navbar {
		width: auto!important;
	}
	#b_context.b_resize {
		position: absolute;
		right: 5%;
	}

	// 序号
	body {
		counter-reset: resultNum;
		min-width: 600px!important;
		--loading-spinner: url('data:image/gif;base64,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') no-repeat center;
	}
	#b_results .b_algo h2::before{
		content: counter(resultNum) ". ";
		counter-increment: resultNum;
		color: #000 !important;
	}

	.b_algo .b_title .b_imagePair, .b_ans .b_title .b_imagePair {
		display: block;
	}
	.b_algo>img{
		width:111px;
		height:82px;
		border: 1px solid #BBB;
		margin: 2px 4px 5px 0px;
	}
	.b_algo>.b_title, .b_algo>.b_caption{
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.b_algo{
		position: relative;
	}
	.b_algo.loading::before{
		content: '';
		position: absolute;
		left: 21px;
		top: 10px;
		width: 111px;
		height: 82px;
		background: rgba(255,255,255,.8) var(--loading-spinner);
	}
	.b_algo>img{
		opacity:1;
		transition: opacity 500ms ease-in-out 0s;
	}
	.b_algo.loading>img{
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
addPreviews(currentList);
onResize();
onScroll();
addEventListener('resize', onResize);
addEventListener('scroll', onScroll);