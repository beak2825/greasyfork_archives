// ==UserScript==
// @name        DMZJ漫画转为手机版链接
// @author      Crab
// @namespace   DMZJManga@dmzj.com
// @description DMZJ漫画转为手机版链接，并尝试恢复屏蔽的漫画。
// @include     *://*.dmzj.com/*
// @compatible  firefox 34+
// @compatible  Chrome 45+
// @version     1.5.5
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11544/DMZJ%E6%BC%AB%E7%94%BB%E8%BD%AC%E4%B8%BA%E6%89%8B%E6%9C%BA%E7%89%88%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/11544/DMZJ%E6%BC%AB%E7%94%BB%E8%BD%AC%E4%B8%BA%E6%89%8B%E6%9C%BA%E7%89%88%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function(){

var gUrl = (function(){
	var rules = {
		update: /^https?:\/\/manhua\.dmzj\.com\/update\_\d+\.shtml$/,
		mobile: /^https?:\/\/m\.dmzj\.com\/view\/.+\.html([@?#&].+)?$/,
		mobileInfo: /^https?:\/\/m\.dmzj\.com\/info\/\d+\.html([@?#&].+)?$/,
		mobileHome: /^https?:\/\/m\.dmzj\.com\/([^\/\.]+\.html)?(\?t=\d+#\d+)?$/,
		desktop: /^https?:\/\/manhua\.dmzj\.com\/.*$/,
		subscribe: /^https?:\/\/i\.dmzj\.com\/\/?subscribe.*$/
	};
	var url = location.href;
	for(var i in rules){
		if(rules[i].test(url)){
			rules = null;
			if(i === 'desktop' && location.pathname === '/')
				return 'deskHome';
			return i;
		}
	}
})();



var $$ = function(e){
	return Array.from(document.querySelectorAll(e));
};

//console.log(gUrl);


var _preventParentScrolling = function(target){
	target.addEventListener('wheel', e => {
		if(e.deltaY < 0 ?
			target.scrollTop === 0 :
			target.scrollTop === target.scrollHeight - target.clientHeight
		) e.preventDefault();
	});
};

var _cE = function (name, attr, parent){
	var e = document.createElement(name);
	attr = attr || {};
	for (let i in attr){
		if(i === 'text')
			e.textContent = attr[i];
		else if(i === 'html')
			e.innerHTML = attr[i];
		else
			e.setAttribute(i, attr[i]);
	}
	parent && (Array.isArray(parent) ?
		parent[0].insertBefore(e, parent.length == 2 ? parent[1] : parent[0].firstChild) :
		parent.appendChild(e));
	return e;
};

//动态转换链接
_cE('style', {text: `
	@keyframes toMobileLink {from{opacity:.9}to{opacity:1}}
	.acg-content-text a[href$=shtml]:not([mbl])/*cartoonList*/
	,.pictext a[href$=shtml]:not([mbl])/*update*/
	,${'.cartoon_online_border,.cartoon_online_border_other, .adiv2hidden:last-child'
		.replace(/(?=,)|$/g, ' a[title][href$=shtml]:not([mbl])')}/*desktop*/
	,.c_space> a:not([mbl]) /*subscribe*/
	,#type_comics .adivhidden:last-child a[href$="shtml"]:not([mbl])/*subscribe 边栏*/
	,.autoHeight p:nth-child(2)> a[href$="shtml"]:not([mbl]) /*oldSubscribe*/
	,.tcaricature_block .adiv2hidden:last-child a[href$="shtml"]:not([mbl]),
		.read_mend_mr a[href$="shtml"]:not([mbl]),
		.icn-02_indexa[href$="shtml"]:not([mbl])/*deskHome*/
	,.history_des a[href*="shtml"]:not([mbl])/*record*/
	,.zxgxbox a[href$="shtml"]:not([mbl])/*tags 边栏*/
	,#bookOpen .book_num:not([mbl])/*顶部弹出面板*/
	,.middleright-right a[href$="shtml"]:not([mbl])/*排行榜页面*/
	{animation:toMobileLink 1ms}

	a[mbl][style]{width:20px!important}
	/*首页*/
	.icn-02_index a{padding-left:0!important}
	.top_list span{width:15px}
	.top_list a {width:140px}
	.top_list .num{margin-right:-5px!important}
	/*tags 边栏*/
	.zxgxbox .tt_chapter{margin-left: 0px}
	.zxgxbox .numbig{padding:0}
	.zxgxbox .tt_comic {width: 74px}
	.book_l{margin-left:-20px!important}
	/*排行榜页面*/
	.middleright-right .bikini li>a{padding:0!important}
	.middleright-right .bikini li>a+a{width:110px!important}
`}, document.head);
addEventListener('animationstart', e => {
	if(e.animationName !== 'toMobileLink')
		return;
	var a = e.target;
	if(!a.href.includes('//manhua.')) return;
	a.setAttribute('mbl', 1);
	var a1 = a.cloneNode(true);
	a1.textContent = '(#)';
	a1.style.color = 'orange';
	a.parentNode.insertBefore(a1, a);
	a.href = a.href
		.replace(/\/\/manhua([^\/]+)/,'//m$1/view')
		.replace('.shtml', '.html')
		.replace(/^http:/, 'https:'); // 替换为 https 减少ISP劫持。
});

if(gUrl == 'update'){
	//漫画更新页面国漫灰色显示
	var gm = [];
	$$('a.pictextst[href*="\:\/\/www\.dmzj\.com\/"]').forEach(a => {
		var boxdiv = a.closest('.boxdiv1');
		if(boxdiv){
			gm.push(boxdiv);
			boxdiv.classList.add('filter');
		}
	});

	//将国漫排在最后
	var boxs = $$('.newpic_bg, .newpic_bgno');

	gm.length && $$('.boxdiv1').filter(m => {
		return gm.indexOf(m) == -1;
	}).concat(gm).forEach((m, i) => {
		boxs[Math.floor(i / 4)].appendChild(m);
	});

	gm = boxs = null;

	_cE('style', {text: `
		.newpic_bg::after, .newpic_bgno::after{
			content: '';
			display: block;
			clear: both;
		}
		.boxdiv1 .picborder {
			height:auto;
		}
		.boxdiv1.filter:not(:hover) .pictext,
		.boxdiv1.filter:not(:hover) .picborder {
			filter: grayscale(100%);
		}

		.boxdiv1.filter{
			position: relative;
			overflow: hidden;
		}

		.boxdiv1.filter::after{
			content:'国漫';
			display: block;
			position: absolute;
			z-index: 1;
			color: white;
			font-size:16px;
			transform: rotate(-45deg);
			transform-origin:10px 65px;
			pointer-events: none;
			width: 100px;
			height: 50px;
			text-align: center;
			line-height: calc(100px - 1.5em);
			background: rgba(255, 165, 0, 0.7);
		}
	`}, document.head);

}else if(gUrl == 'desktop'){

	const {g_comic_url, g_last_chapter_id, g_last_update, g_comic_id} = unsafeWindow;
	//被隐藏的漫画至少显示最新话
	let mhContainer = $$('div.cartoon_online_border')[0];
	if(mhContainer && mhContainer.firstElementChild.localName === 'img'){
		mhContainer.innerHTML = `
			<a href="${g_comic_url}${g_last_chapter_id}.shtml"
				title="${g_last_update}"
				target="_blank">${g_last_update}</a>
			<h2>正在加载被屏蔽的地址...</h2>
		`;

		GM_xmlhttpRequest({
			method:'GET',
			timeout: 25000,
			//url: `${location.protocol}//v2.api.dmzj.com/comic/${g_comic_id}.json`,
			//url: `https://v2api.dmzj.com/comic/${g_comic_id}.json`,
			url: `https://v3api.dmzj.com/comic/comic_${g_comic_id}.json`,
			onload: e => {
				let json = JSON.parse(e.responseText);
				if(!json || !json.chapters || json.chapters.length === 0)
					return mhContainer.lastElementChild.remove();
				mhContainer.innerHTML = '';
				let isFolderURL = location.pathname.endsWith('/');
				JSON.parse(e.responseText).chapters.forEach(chapters => {
					_cE('h3', {text: chapters.title}, mhContainer);
					let ul = _cE('ul', null, mhContainer);
					chapters.data.forEach(c => {
						_cE('li', null, ul).innerHTML = `
							<a href="${isFolderURL ? '' : g_comic_url}${c.chapter_id}.shtml"
								title="${c.chapter_title}" target="_blank">${c.chapter_title}
						</a>`;
					});
					_cE('div', {class: 'clearfix'}, mhContainer);
				});
			}
		});

	}
}else if(gUrl == 'subscribe'){
	_cE('style', {text: `
		.dy_r p em.c_space{
			overflow:auto!important;
			width:auto!important;
			display: inline;
			white-space: normal;
		}
		.dy_r p{height:auto!important;}
	`}, document.head);
	var my_subscribe_id = $$('#my_subscribe_id')[0];
	var pageLoaded = false;
	var addObserver = function(){
		my_subscribe_id && (new MutationObserver(function(){
			//默认显示未读订阅
			if(!pageLoaded){
				pageLoaded = true;
				_cE('script', {text: `$(".read_id[value=2]").click()`}, document.body).remove();
				return;
			}
			//未看新漫画总排前
			this.disconnect();
			$$('.c_space + .new').reverse().forEach(function(icon){
				var li = icon.parentNode.parentNode.parentNode;
				li.parentNode.insertBefore(li, li.parentNode.firstElementChild);
			});
			addObserver();

		})).observe(my_subscribe_id, {childList: true});
	};
	addObserver();
}

if(gUrl == 'mobile' || 'mobileInfo'== gUrl){
	_cE('style', {text: `
		#chapters {
			padding: 10px;
		}
		#chapters ul:after{
			display: list-item;
			clear: both;
			content: '';
			list-style:none;
		}
		#chapters dt{
			border-bottom: 2px solid #ccc;
			font-size: 150%;
			text-indent: .5em;
			padding: 5px 0;
		}
		#chapters dl+dl{
			border-top: 2px solid #ccc;
		}
		#chapters li{
			float: left;
			width: 33%;
			padding: 2px 8px;
			box-sizing: border-box;
			list-style:none;
		}
		#chapters a{
			display: inline-block;
			border: 2px solid transparent;
			padding:0 5px;
			color: #000;
			max-width: 100%;
			white-space: pre;
			overflow: hidden;
			text-overflow: ellipsis;
			text-decoration: none;
		}
		#chapters a:hover{
			color:blue;
			border-color:blue;
		}
		#chapters a.cur{
			border-color:orange;
		}
	`}, document.head);
}
if(gUrl == 'mobile'){

	_cE('style', {text: `
		html, body{min-height:100vh!important; background:#222!important}
		body .UnderPage .subHeader {background-color: rgba(255, 255, 255, 0.68);}
		.UnderPage{background:#222!important}
		#commicBox{overflow:hidden; width: 80%; margin: 0 auto; }
		#commicBox>div{text-align:center; padding-left: 10vw;}
		#pageNum {
			position: fixed;
			top: 50px;
			background: rgba(238, 170, 0, 0.5);
			color: blanchedalmond;
			height: 1.6em;
			text-align:center;
			line-height: 1.6em;
			font-size: 2.3em;
			right: 0px;
		}

		#np_chap{
			position: fixed;
			bottom:30%;
			right: 20px;
			z-index: 11111;
		}
		#np_chap>div>a, #np_chap>a{
			cursor: pointer;
			display: block;
			background: transparent url("/images/page_bg.png") no-repeat scroll center bottom / 100% auto;
			width: 40px;
			height:40px;
			transform: rotate(90deg);
			margin-top: 5px;
			box-shadow: 0 0 6px -2px rgba(255, 255, 255, 0.65);
			border-radius: 8px;
		}
		#np_chap>div>a:not(:hover), #np_chap>a:not(:hover){
			opacity: .5;
		}
		#np_chap>div>a:last-child{
			transform: rotate(-90deg);
		}
		#np_chap>a{
			background: rgba(0, 0, 0, 0.7);
			transform:none;
			position:relative;
		}
		/*首页小房子*/
		#np_chap>a>span{
			position:absolute;
			width: 16px;
			height:8px;
			border: 1.5px solid #fff;
			border-top-width: 0;
			border-radius: 0 0 2.5px 2.5px;
			top:50%;
			left:calc(50% - 8px);
			pointer-events:none;
		}
		#np_chap>a>span::before,
		#np_chap>a>span::after{
			position:absolute;
			content: "";
			width: 15px;
			border-top: 1.5px solid #fff;
			transform: rotate(-40deg);
			top:-7px;
			left:-5px;
		}
		#np_chap>a>span::before{
			transform: rotate(40deg);
			left:auto;
			right:-5px;
		}

		#chapters{
			display:none;
			position: fixed;
			z-index: 100000000000;
			width: 60%;
			max-width: 400px;
			max-height: calc(100% - 150px);
			height: auto;
			overflow-y: scroll;
			top:50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: rgba(255,255,255,.9);
			border: 5px solid rgba(0,0,0,.5);
			border-radius: 5px;
		}
		#chapters.show{
			display:block;
		}

		#tucao{
			position: fixed;
			top: 30px;
			left: 0;
			color: #fff;
			z-index: 1111111;
			height: calc(100% - 115px);
		}
		#tucao:not(:hover){
			opacity: 0.5
		}
		#tucao ul{
			overflow-y:hidden;
			height: calc(100% - 40px);
		}
		#tucao:hover ul{
			overflow-y: scroll;
		}
		#tucao pre{
			font-weight: bold;
			margin-bottom: 5px;
		}
		#tucao li{
			margin-bottom: 5px;
			margin-left: 3px;
		}
		#tucao span{
			padding: 0px 3px;
			border-radius: 2px;
			cursor: pointer;
			border:transparent 1px solid;
		}
		#tucao span:hover{
			background-color:#FFF!important;
			color:#000;
			border-color:red;
		}

		.control_scroll{
			margin-top: 0!important;
			padding-top:0!important;
			opacity:.5;
			transition: opacity 0.3s cubic-bezier(.55,.09,.68,.53) 0s;
		}
		.control_scroll:hover{
			opacity:1;
		}
		#m_r_bottom{
			display:block!important;
			height:38px!important
		}
		#m_r_bottom>.BtnBox{
			display:none;
		}
		#m_r_slider{
			background-clip: content-box;
			padding: 14px 0px;
			top: 3px;
		}
		#m_r_slider_ball{
			top: 3px;
		}
		.control_commentIcon{
			margin-top: 9px;
		}
		/*#m_r_panelbox{display:none!important}
		#commicBox>div>img{border-top:2px solid red;margin-top:-2px;}*/


		/*底栏*/
		.botNav{
			background-color: #222;
		}
		.letchepter{
			padding-bottom: 40px;
			background-color: #222;
			border-top-color:#000;
		}
		.letchepter .disable{
			color:#4d4d4d !important;
		}
		.letchepter .disable:hover{
			cursor:not-allowed;
		}

		@keyframes blink {
			0% {opacity: .1;}
			100% {opacity: .5;}
		}
		#resizer{
			position: fixed;
			top:0;
			z-index: 9999999999;
			display: block;
			height: 100vh;
			width: 20px;
			background: orange;
			cursor: col-resize;
			opacity: 0;
			right: calc((100% - 80%) / 2 - 20px / 2);
		}
		#resizer::before{
			content: attr(title);
			width: 100%;
			height: 100%;
			text-align: center;
			writing-mode: tb;
			writing-mode: sideways-rl;
			line-height: 20px;
			letter-spacing: .3em;
			color: #fff;
			display: block;
		}
		#resizer.undraggable{
			background: #f88066;
		}
		#resizer:not(.dragging):hover{
			animation: blink .5s infinite;
		}
		#resizer.dragging{
			opacity: .8;
		}
	`}, document.head);



	var updateMobilePage = () => {

	var data = $$('body script:not([src])').map(s => s.textContent.match(/mReader\.initData\((.+\})(?=,\s*(?:"|'))/)).find(s=>s)[1];

	_cE('script', {text: `(function(data){
		//去倒计时guanggao
		window['times'] = 0;
		typeof window['llt'] === 'function' && window['llt']();

		var _cE = ${_cE.toString()};
		var _preventParentScrolling = ${_preventParentScrolling.toString()};
	` + (function(){
		var tucao = _cE('div', {id:'tucao'}, document.body);
		_cE('small', {text: ' 更新日期：'}, _cE('h3', {text: '<' + data.chapter_name+'>'}, tucao));
		if(data.updatetime){
			let d = new Date(data.updatetime * 1000 + (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
			_cE('pre', {text: 
				`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
				.replace(/\d+/g, n => n.length === 1 ? `0${n}` : n)
			}, tucao);
		}
		var ldp = _cE('p', {text: '评论加载中..'}, tucao);
		window.success_jsonpCallback = function(json){
			var length = json.data && json.data.list && json.data.list.length || 0;
			ldp.textContent = (json.msg=='提交成功'? '' : ' '+json.msg) + (length ? ' 现有 '+ length+'/'+(json.data && json.data.total || 0)+' 吐槽:' : '');
			if(!length) return;
			var ul = _cE('ul', null, tucao),
				opacity = 1,
				tc = null;
			for(var i=0; i<length; i++){
				tc = json.data.list[i];
				_cE('span', {text: tc.title, title: tc.nickname+' (uid: '+tc.uid+')\nIP:'+tc.ip}, _cE('li', null, ul)).style.backgroundColor = 'rgba(39, 117, 247, '+ opacity +')';
				opacity -= 1 / (length + 1);
			}
			window.jQuery('#comment_count').show();
			_preventParentScrolling(ul);
		};

		_cE('script', {
			src: '//interface.dmzj.com/api/viewpoint/' 
				+ 'getViewpoint?callback=success_jsonpCallback&more=1&type='
				+ data.chapter_type+ '&type_id='+data.comic_id+'&chapter_id='
				+ data.id+'&_='+ new Date().getTime()
		}, document.body).onload = function(){
			this.remove();
			window.success_jsonpCallback = null;
		};
	}).toString().replace(/^[^{]+{/, '') + `)(${data})`}, document.head).remove();

	try{
		data = JSON.parse(data);
		console.info(data.page_url.join('\n'));
	}catch(ex){
		return console.error(ex);
	}

	var np_chap = _cE('span', {id:'np_chap'}, document.body),
		np = _cE('div', null, np_chap);
		_cE('span', null, _cE('a', {title: '章节目录', href: '../../info/'+data.comic_id+'.html'}, [np_chap]));


	_cE('a', {title: '上一话', href: `/view/${data.comic_id}/${data.prev_chap_id}.html`}, np)
		.style.display = data.prev_chap_id ? '' : 'none';
	_cE('a', {title: '下一话', href: `/view/${data.comic_id}/${data.next_chap_id}.html`}, np)
		.style.display = data.next_chap_id ? '' : 'none';

	$$('.beforeChapter')[0].classList.toggle('disable', !data.prev_chap_id);
	$$('.afterChapter')[0].classList.toggle('disable', !data.next_chap_id);



	//将eval脚本运行在页面环境，减少沙箱环境影响
	_cE('script', { text:  `(function(sum_pages,  localStorageKey){
		var _cE = ${_cE.toString()};
	` +  (function(){

		var _pageNum = _cE('div', {id:'pageNum', text: '1/' + sum_pages}, document.body),
			imgs = null,
			mReader = window.mReader;

		//改良原来的获取当前页码方法
		mReader.getCurrPage = function(){
			imgs = imgs || document.querySelector('#commicBox>div[id]').children;
			var ch = document.documentElement.clientHeight;
			for(var i=0;i<imgs.length;i++){
				var r = imgs[i].getBoundingClientRect();
				if(r.top <= 95 && r.bottom > 95)
					return i + 1;
			}
		};

		var isScrolling = false;
		var _updatePager = function(){
			isScrolling = false;
			// 页码
			!_isSlider && mReader.updatePageDisplay();
			var i = mReader.getCurrPage();
			if(i) return (_pageNum._page != i) && (_pageNum.textContent = (_pageNum._page = i) + '/' + sum_pages);
		}
		var updatePager = function(){
			if(isScrolling) return;
			isScrolling = true;
			requestAnimationFrame(_updatePager);
		};
		addEventListener('scroll', updatePager);
		addEventListener('resize', updatePager);

		//修复拖拽进度条
		var slider = document.getElementById('m_r_slider_ball'),
			sliderBar = document.getElementById('m_r_slider'),
			_isSlider = false,
			_sliderOffset = 0;
		if(slider && sliderBar){

			mReader.clickAction = eval('('+ mReader.clickAction.toString()
				.replace(/#m_r_bottom/g, '#mark')
			+').bind(mReader)');

			//拖拽滑块跳转
			addEventListener('mousemove', eval('('+ mReader.touchMoveAction.toString()
				.replace(/^.*\{/, '$&\nif(!_isSlider) return;\n')
				.replace('touches[0]', 'event')
				.replace('32 -', '_sliderOffset - ')
				.replace(/.*\}$/,'_pageNum.textContent = this.curr_page + "/"+ this.page_num;$&')
			+').bind(mReader)'));

			slider.onmousedown = event => {
				if(event.button !== 0 || event.target !== slider) return;
				_isSlider = true;
				_sliderOffset = event.clientX - slider.offsetLeft - slider.parentNode.offsetLeft;
			};
			addEventListener('mouseup', () => {
				if(!_isSlider) return;
				_isSlider = false;
				mReader.touchEndAction();
			});

			//点击进度条位置跳转
			sliderBar.addEventListener('mousedown', eval('('+ mReader.touchMoveAction.toString()
				.replace(/^.*\{/, '$&\nif(event.button !== 0)return;\nevent.preventDefault();'
					+'\n_isSlider = true;\n')
				.replace('touches[0]', 'event')
				.replace('32 -', '2*')
				.replace('currX < max', 'currX <= max')
				.replace(/.*\}$/,'_pageNum.textContent = this.curr_page + "/"+ this.page_num;$&')
			+').bind(mReader)'));
		}

		//弹出确定取消订阅窗口询问，以免误点击取消订阅。
		if(typeof window.canDY === 'function'){
			var _canDY = window.canDY;
			window.canDY = obj => {
				if(obj.classList.contains('dy_h') && !window.confirm('是否确定取消订阅？'))
					return;
				_canDY(obj);
			};
		}

		//订阅相关 js 链接继承协议
		if(typeof window.comicUrl === 'string')
			window.comicUrl = window.comicUrl.replace(/^https?:/, location.protocol);


		document.getElementById('m_r_panelbox').removeAttribute('onclick');
		//拖拽滚动页面
		function Drag({id, cursor, onMousedown, onMousemove, onMouseup}){
			this.cursor = cursor;
			this.dragAreaId = id;
			this.onMousedown = onMousedown;
			this.onMousemove = onMousemove;
			this.onMouseup = onMouseup;
			this.init();
		}
		Drag.prototype = {
			_isMousedown: false,
			_x:0, _y:0, _lx: 0, _ly: 0,
			_wh: 0, _ww: 0,
			init:function(){
				['mousedown', 'mouseup', 'mousemove'].forEach(e => addEventListener(e, this));
			},
			_setCursorTimeout: null,
			setCursor: function(isMove){
				document.body.style.cursor = isMove ? this.cursor : '';
			},
			handleEvent: function(event){
				switch(event.type){
					case 'mousedown' :
						if(!(event.buttons & 1) || event.target.id !== this.dragAreaId)
							return;
						this._isMousedown = true;
						event.preventDefault();

						this._x = this._lx = event.clientX;
						this._y = this._ly = event.clientY;
						this._wh = window.innerHeight;
						this._ww = window.innerWidth;
						clearTimeout(this._setCursorTimeout);
						this._setCursorTimeout = setTimeout(this.setCursor.bind(this), 150, true);
						if(typeof this.onMousedown === 'function')
							this.onMousedown.call(this);
						break;
					case 'mouseup' :
						if(!this._isMousedown) return;
						this._isMousedown = false;
						clearTimeout(this._setCursorTimeout);
						this.setCursor();
						if(typeof this.onMouseup === 'function')
							this.onMouseup.call(this);
						break;
					case 'mousemove' :
						if(!(event.buttons & 1) || !this._isMousedown) return;
						var x = event.clientX - this._x,
							y = event.clientY - this._y;
						if(typeof this.onMousemove === 'function')
							this.onMousemove.call(this, event, x, y);
						this._lx = event.clientX;
						this._ly = event.clientY;
						break;
				}
			}
		};

		new Drag({
			id: 'm_r_panelbox',
			cursor: 'move',
			onMousemove: function(event, x, y) {
				if(Math.sqrt(x * x + y * y) < 10)
					return;
				//屏蔽漫画页怪异模式下无法获取根节点scrollTop
				var st = document.documentElement.scrollTop || document.body.scrollTop,
					dis = event.clientY - this._ly;
				scrollTo(0, st - dis * Math.min(1.8, 1 + Math.abs(dis) * 100 / this._wh));
			}
		});


		var resizer = _cE('div', {id: 'resizer', title: '拖拽改变图片最小宽度'}, document.body);
		var commicBox = document.getElementById('commicBox');
		var resziePic = function (width) {
			if(width > 0 && width <= 100){
				commicBox.style.width = `${width}%`;
				resizer.style.right = `calc(${(100 - width) / 2}% - 20px / 2)`;
			}
		}
		addEventListener('storage', function(event){
			if(event.key !== localStorageKey) return;
			resziePic(parseFloat(event.newValue, 10));
		});

		var resizerWidth = parseFloat((localStorage.getItem(localStorageKey) || 0), 10);
		if(resizerWidth > 0){
			resziePic(resizerWidth);
		}else{
			//初次使用时强制显示
			resizer.classList.add('dragging');
			localStorage.setItem(localStorageKey, 80);
		}
		new Drag({
			id: 'resizer',
			cursor: 'col-resize',
			onMousedown: function(){
				clearTimeout(this._setDragingTimeout);
				this._setDragingTimeout = setTimeout(() => {
					resizer.classList.add('dragging');
				}, 150);
			},
			onMouseup: function(){
				clearTimeout(this._setDragingTimeout);
				resizer.classList.remove('dragging');
				resizer.classList.remove('undraggable');
				this._resizerUndraggable = false;
				if(typeof this._resizerWidth === 'number' && this._resizerWidth > 0 && this._resizerWidth < 100){
					localStorage.setItem(localStorageKey, this._resizerWidth);
					window.jQuery(window).trigger('scroll');
				}
			},
			onMousemove: function(event, x, y) {
				if(Math.abs(x) < 5) return;
				var right = (this._ww - event.clientX) / this._ww * 100;
				var width = 100 - right * 2;
				if((width - 10) / 100 * this._ww < 300 || width > 100){
					if(!this._resizerUndraggable){
						this._resizerUndraggable = true;
						resizer.classList.add('undraggable');
					}
					if(width > 100) {
						if(x > 0) return;
					}else{
						if(x < 0) return;
					}
				}else{
					if(this._resizerUndraggable){
						resizer.classList.remove('undraggable');
						this._resizerUndraggable = false;
					}
				}
				this._resizerWidth = width;
				commicBox.style.width = `${width}%`;
				resizer.style.right = `calc(${right}% - 20px / 2)`;
				updatePager();
			},
		});

	}).toString().replace(/^[^{]+{/, '') + `)(
		${data.sum_pages},
		'${(GM_info && GM_info.script && GM_info.script.name || 'DMZJ_GM') + '_resizerWidth'}'
	)`}, document.head).remove();



	};//updateMobilePage end

	//通过屏蔽漫画页面为怪异模式判定
	if(document.compatMode === 'BackCompat' && (/漫画(内容)?不存在/.test(document.body.textContent) || document.body.textContent.trim() === 'File not found.')){

		document.body.innerHTML = `
		<div id="msgContainer">
			<p>该漫画浏览器端被屏蔽，正在尝试恢复。。</p>
			<style>
				#msgContainer{
					position:absolute; top:0; left:0;
					display: flex; flex-direction: column;
					width:100%; min-height: 100vh;
					align-items: center; justify-content: center;
					background-color:#222;
					z-index:99999999999999; opacity:1;
					transition: opacity 1s ease-in-out 1s;
				}
				#msgContainer p{
					color:#fff; font-size:30px; text-align:center;
					transition: font-size .5s linear 0s, color .2s linear 0s;
				}
			</style>
		</div>
		`;
		_cE('link', {href:'/css/style.css?2015102217', type: 'text/css', rel: 'stylesheet'}, [document.head]);
		_cE('link', {href:'/css/global.css?2015111317', type: 'text/css', rel: 'stylesheet'}, [document.head]);//权重降低

		var scriptLoader = urls => Promise.all(urls.map(url => new Promise((resolve, reject) => {
			var script = _cE('script', {src: url}, document.body);
			script.onload = resolve;
			script.onerror = reject;
		})));

		var queues = arr => Promise.all(arr.map(a => typeof a === 'function' ? new Promise(a) : a));

		//shijizhiling 8785
		var pathname = location.pathname.split('/');
		var chapterId = pathname.pop().split('.').shift();
		var comicName = pathname.pop();
		var getChapter = queues([
		   callback => {
		   	//地址栏漫画id是数字
			if(/^\d+$/.test(comicName)){
				return callback(comicName);
			}
			//抓取pc端页面数据获取数字id
			let onErr = text => callback(Promise.reject(new Error(text)));
			GM_xmlhttpRequest({
				method:'GET',
				timeout: 25000,
				url: `${location.protocol}//manhua.dmzj.com/${comicName}/`,
				onerror: () => onErr('获取漫画 ID 请求失败！'),
				ontimeout: () => onErr('获取漫画 ID 请求超时！'),
				onload: e => {
					let match = e.responseText &&
						e.responseText.match(/var g_comic_id = "(\d+)";/);
					match ? callback(match[1]) : onErr('该漫画真的不存在或可能已被删除!');
				}
			});
		}]).then(e => {

			const subId = e[0];
			if(!subId) throw new Error(e);

			//屏蔽漫画章节id全局变量依赖
			_cE('script', { text:  `(function(){
				window.subId = ${subId};
				window.chapterId = ${chapterId};
			})()`}, document.head).remove();

			return queues([
				//`//v3api.dmzj.com/comic/${subId}.json`,
				`//v3api.dmzj.com/comic/comic_${subId}.json`,
				`//v3api.dmzj.com/chapter/${subId}/${chapterId}.json`
			].map(url => callback => {
				let onErr = text => callback(Promise.reject(new Error(`获取漫画章节目录请求${text}！`)));
				GM_xmlhttpRequest({
					method:'GET',
					timeout: 25000,
					url: 'https:' + url,
					onerror: () => onErr('发生错误'),
					ontimeout: () => onErr('超时'),
					onload: callback
				});
			}));
		});


		scriptLoader(['/js/jquery-1.9.1.min.js']).then(() => queues([
			getChapter,//获取章节
			scriptLoader([
				'/js/jquery.cookie.js',
				'/js/common.js',
				'/js/domain.js',
				'/js/m_reader.js?2015102416',
				'/js/TSB.js',
				'/js/main.js',
				'/js/jquery.lazyload.min.js',
			]),
		])).then(e => {
			_cE('script', {text: `
				(() => {
					var $window = $(window);
					eval('$.fn.lazyload =' + $.fn.lazyload.toString()
					.replace('$("<img />")', 'let _time = new Date().getTime(); $&')
					.replace(/(?=\\.bind\\("load")/, \`.bind("error", event => {
						//保守小于 800 毫秒认为是浏览器 ssl 响应错误，实际远小于 800。
						if(new Date().getTime() - _time < 800 && event.target.src.startsWith('https://imgsmall.')){
							self.loaded = true;
							self.dispatchEvent(new Event('ssl_error'));
						}
					})\`));
				})();
			`}, document.body);
			let json;
			try{
				json = [JSON.parse(e[0][0].responseText),
					 JSON.parse(e[0][1].responseText)];
			}catch(ex){
				if(e[0][1].responseText.trim() === '章节不存在')
					throw new Error('章节不存在，真的删除了。。');
				throw new Error(ex);
			}

			//必须等待获取章节id全局变量依赖
			return scriptLoader(['/js/m_readerBg.js?20160720']).then(() => {
				return json;
			});
		}).then(([json1, json2]) => {

			document.body.insertAdjacentHTML('afterBegin', '<div class="UnderPage"><div class="sharWin"id="read_Shar"><div class="sharClose"></div><p class="sharBar">分享到：</p><div class="sharBox"><div id="bdshare"class="bdshare_t bds_tools"><a class="bds_tsina sina"style=""></a><a class="bds_tqq tqq"></a><a class="bds_qzone zone"></a></div></div></div><section id="currentCache"><div class="view-imgBox"id="m_r_imgbox_0"><div class="mh_box"><div id="commicBox"></div><div class="botNav"><div class="botNav_box"><a class="tc"href=""><span>吐槽<em>0</em></span></a><a class="dy"onclick="canDY(this)"id="dys"href="javascript:void(0);"><span>订阅</span></a><a class="fx"onclick="sharwindow()"><span>分享</span></a></div></div><div class="letchepter"><a href="javascript:void(0);"onclick="$(\'#loadPrevChapter\').click()"class="beforeChapter">&lt;上一章</a><em>/</em><a href="" class="ChapterLestMune">返回目录</a><em>/</em><a href="javascript:void(0);"onclick="$(\'#loadNextChapter\').click()"class="afterChapter">下一章&gt;</a></div></div></div></section><div class="subHeader"style="display: none; z-index: 999999999999999999;"id="m_r_title"><a href="javascript:"class="iconRet"onclick="mReader.returnBtn()"></a><a href="javascript:;"class="BarTit"></a><a href="javascript:"class="iconShar"onClick="sharwindow()"></a></div><div class="control_bottom"style="display: none; z-index: 999999999999999999;"id="m_r_bottom"><div class="BtnBox"><div class="load_box next"id="loadNextChapter"onclick="mReader.nextBtnAction()"></div><div class="load_box prev"id="loadPrevChapter"onclick="mReader.prevBtnAction()"></div><div class="page_left"id="m_r_nums"><span>1</span>/1</div></div><div class="control_scroll"><a href=""class="control_commentIcon"><em id="comment_count"></em></a><div class="scroll_left_Box"><div class="scroll_box"id="m_r_slider"><div class="scroll_barX"></div><div class="scroll_bar"id="m_r_slider_ball"ontouchmove="mReader.touchMoveAction(event)"ontouchend="mReader.touchEndAction(event)"></div></div></div></div></div><div class="control_panel alpha"style=" display:block"id="m_r_panelbox"prompt="true"onclick="mReader.clickAction(event)"><div class="mark"style="display: none;"id="mark"></div></div></div>');


			var chapters = json1.chapters ? json1.chapters.map(d => d.data.find(cid => cid.chapter_id == chapterId)) : null;
			var cindex, chapter, index;
			if(!chapters || chapters.every(c => !c)){
				//数据库最新章节列表缓存未更新
				chapter = json2;
				cindex = index = 0;
			}else{
				cindex = chapters.findIndex(c => c);
				chapter = chapters[cindex];
				index = json1.chapters ? json1.chapters[cindex].data.indexOf(chapter) : 0;
			}
			var data = {
				id: chapterId,
				comic_id: json1.id || chapter.comic_id,
				chapter_name: chapter.chapter_title || chapter.title,
				chapter_order: chapter.chapter_order,
				createtime: chapter.updatetime,
				updatetime: chapter.updatetime,
				//防止混合内容屏蔽，替换为相同协议的图片链接
				page_url: (json2.page_url || []).map(url => url.replace(/^https?:/, location.protocol)),
				chapter_type:0,
				chapter_num:chapter.chapter_order,
				sum_pages:json2.picnum,
				direction:json2.direction,
				filesize:chapter.filesize,
				picnum:json2.picnum,
				hit:json1.hit_num,
				comment_count:json2.comment_count
			};
			if(json1.chapters && json1.chapters[cindex].data.length > index + 1)
				data.prev_chap_id = json1.chapters[cindex].data[index + 1].chapter_id;
			if(index > 0)
				data.next_chap_id = json1.chapters[cindex].data[index - 1].chapter_id;


			document.title = json1.title ? json1.title + ' - ' + data.chapter_name : data.chapter_name;
			_cE('script', {text:`mReader.initData(${JSON.stringify(data)}, "${json1.title}", "${json1.cover}");`}, [document.body]);
			updateMobilePage();

			var div = _cE('div', {id: 'chapters'});
			if(json1.chapters){
				div.innerHTML = '<dl>' + json1.chapters.map((d, i) => {
					return d.data.map((c, j) => {
						return `<li><a ${i == cindex && j == index ? 'class="cur" ' : ''}href="/view/${json1.id}/${c.chapter_id}.html" title="${c.chapter_title}">${c.chapter_title}</a></li>`;
					}).join('');
				}).map((c, i) => {
					return `<dt>${json1.chapters[i].title}</dt>
						<dd><ul>${c}</ul></dd>`;
				}).join('') + '</dl>';

			}else{
				div.innerHTML = `<h2 style="color:red">暂时无章节，或者被屏蔽删除！</h2>`;
			}
			_preventParentScrolling(div);

			//修复分享按钮
			_cE('script', {id: 'bdshare_js', data: 'type=tools&mini=1'}, document.body);
			_cE('script', {id: 'bdshell_js', src: '//static.dmzj.com/baidushare/static/js/shell_v2.js?cdnversion=' + Math.ceil(new Date()/3600000)}, document.body);
			//修复吐槽链接
			$$('.tc, .control_commentIcon').forEach(tc => tc.href = `/viewpoint/${data.comic_id}/${data.id}.html`);
			$$('.BarTit')[0].textContent = chapter.chapter_title;
			//没有触发resize、scroll事件无法显示第一张图片。
			//异步延时触发，避免同步渲染计算图片元素无高度值，会将图片全部加载。
			_cE('script', {text:`setTimeout(() => window.jQuery(window).trigger('scroll'), 100);`}, document.body).remove();

			$$('#commicBox img').forEach(img => img.addEventListener('ssl_error', event => {
				let url = event.target.dataset.original;
				console.info(`图片：${url} \n可能服务证书错误导致浏览器无法加载，尝试使用 http 方式加载。`);
				if(!url) return;
				url = url.replace('https:', 'http:');
				new Promise((resolve, reject) => GM_xmlhttpRequest({
					method:'GET', timeout: 25000, url, responseType: 'blob',
					onerror: reject, ontimeout: reject, onload: resolve,
					headers: {'Referer': 'http://images.dmzj.com/'}
				})).then(res => {
					event.target.src = URL.createObjectURL(res.response);
					//还原 fadeIn 动画
					let opacity = 0, step = 1 - opacity, start = null, animate = (ts) => {
						if(!start) start = ts;
						opacity += step * ((ts - start) / 2000);
						if(opacity >= 1) opacity = '';
						event.target.style.opacity = opacity;
						if(opacity !== '') requestAnimationFrame(animate);
					}
					requestAnimationFrame(animate);
				}, () => {});
			}, {once: true}));

			var msg = $$('#msgContainer>p')[0];
			if(msg){
				_cE('p', {text: '恢复成功！！', style: 'color: green;'}, msg);
				msg.style.cssText = 'font-size:12px; color:#888;';
				var msgContainer = msg.parentNode;
				msgContainer.addEventListener('transitionend', event => {
					if(event.propertyName === 'color' && event.target === msg){
						msgContainer.style.opacity = 0;
					}else if(event.propertyName === 'opacity' && event.target === msgContainer){
						msgContainer.remove();
					}
				});
			}

			var btn = $$('#np_chap>a')[0];
			var backLink = $$('.ChapterLestMune')[0];
			backLink.href = btn.href;
			document.body.appendChild(div);
			document.addEventListener('click', event=>{
				if(event.button === 0 && (event.target === btn || event.target === backLink)){
					div.classList.toggle('show');
					return event.preventDefault();
				}
				if(div.contains(event.target))
					return;
				div.classList.remove('show');
			});
		}).catch(e => {
			console.error(e);
			$$('#msgContainer>p')[0].appendChild(
				_cE('p', {html: `恢复失败。。<br/><small>${e.message}</small>`, style: 'color: red;'})
			).parentNode.style.cssText = 'font-size:12px; color:#888;';
		});
	}else{
		updateMobilePage();
	}

}else if('mobileInfo'== gUrl){
if(document.compatMode === 'BackCompat' && document.body.textContent.includes('此漫画暂不提供观看')){
	new Promise((resolve, reject) => {
		let onErr = text => reject(new Error(`获取漫画章节目录请求${text}！`));
		GM_xmlhttpRequest({
			method:'GET',
			timeout: 25000,
			//url: `https://v2api.dmzj.com/comic/${location.pathname.match(/\/(\d+)\.html/)[1]}.json`,
			url: `https://v3api.dmzj.com/comic/comic_${location.pathname.match(/\/(\d+)\.html/)[1]}.json`,
			onerror: () => onErr('发生错误'),
			ontimeout: () => onErr('超时'),
			onload: (e) => resolve(JSON.parse(e.responseText))
		});
	}).then(json => {
		document.title = json.title;
		document.body.innerHTML = `
			<div><img src="${json.cover}" align="left" width="102" height="137">
				<h2>${json.title}</h2>
				<p>${json.description}</p>
			</div>
		`;
		var div = _cE('div', {id: 'chapters'}, document.body);
		console.log(json);
		div.innerHTML = '<dl>' + json.chapters.map((d, i) => {
			return d.data.map(c => {
				return `<li><a href="/view/${json.id}/${c.chapter_id}.html" title="${c.chapter_title}">${c.chapter_title}</a></li>`;
			}).join('');
		}).map((c, i) => {
			return `<dt>${json.chapters[i].title}</dt>
				<dd><ul>${c}</ul></dd>`;
		}).join('') + '</dl>';
	});
}
}else if('mobileHome'== gUrl){
	_cE('style', {text: `
		.imgBox [class^='col_3_'] li{
			width: 10%!important;
			min-width: 120px;
			margin: 0px 0% 0% 3%!important;
		}
		.imgBox [class^='col_2'] li{
			width: 18%!important;
			min-width: 200px;
		}
		.imgBox [class^='col_3_'] li img{
			height: auto!important;
		}
		.imgBox [class^='col_3_'] li:nth-child(7n+1){
			clear:left;
		}
	`}, document.head);
}

})();