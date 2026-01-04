// ==UserScript==
// @name         绅士之庭透明界面
// @namespace    moe.moekai.gmgardtransparentpost
// @version      3.6.79
// @description  让绅士之庭的界面和文章背景半透明
// @author       YIU
// @match        http*://gmgard.com/*
// @match        http*://hggard.com/*
// @match        http*://gmgard.moe/*
// @match        http*://lzone.moe/*
// @icon         https://hggard.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38672/%E7%BB%85%E5%A3%AB%E4%B9%8B%E5%BA%AD%E9%80%8F%E6%98%8E%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/38672/%E7%BB%85%E5%A3%AB%E4%B9%8B%E5%BA%AD%E9%80%8F%E6%98%8E%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
	const $ = unsafeWindow.jQuery;
	const addStyleDoms = {};
	const settingsKeys = {
		panelBgAlpha: 'panel-bg-alpha',
		panelBgBlur: 'panel-bg-blur'
	};

	//============ < STYLE > =============================
	const hartIcon = 'data:image/webp;base64,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';
	const strs = `#body{background-color:rgba(255,255,255,0.75);backdrop-filter:blur(0px)}
.categories{background:#ffffff99}
#blog{background-color:#fff0}
#blog .uimg{background:#fff9}
hr{border-top-color:#eee8!important;border-bottom-color:#eee8!important}
.well{background-color:#f5f5f5b8}
input.tagsearch{background-color:#f5f5f599!important;}
span[style='background:#000000'],span[style='background: #000000'],span[style='background:rgb(0, 0, 0)'],
 span[style='background-color:#000000'],span[style='background-color: #000000'],span[style='background-color:rgb(0, 0, 0)']{background:#000000a5}
span[style='background:#ffffff'],span[style='background: #ffffff'],span[style='background:rgb(255, 255, 255)'],
 span[style='background-color:#ffffff'],span[style='background-color: #ffffff'],span[style='background-color:rgb(255, 255, 255)']{background:#fffb}
.reply-section{background:#efeeef90!important}
.home-list{background-color:#f7f7de50}
.home-settings{background:#dddddd50}
#rankContent{background-color:#daebf470}
.author-info{background:#f3f3f380}
.author-sign{background:#fffa;border:1px outset #8888}
.spoiler-content{background:none repeat scroll 0 0 #f5f5f590}
.spoiler-content span[style*='background-color']{background-color:#000000a5}
.navbar-inner{background-color:#fff0;background-image:linear-gradient(to bottom,#ffffffa0,#f2f2f280)}
.btn-info{background:transparent linear-gradient(to bottom,#5bc0dea0,#2f96b480)}
.btn:hover,.btn:focus{background-position:unset;-webkit-transition:unset;-moz-transition:unset;-o-transition:unset;transition:unset}
#multiview table{background-color:#fff6}
pre{background-color:#f5f5f599}
.expbar{background-image:linear-gradient(to bottom,#f5f5f500,#f9f9f999)}
.progress-success .bar{background-image:linear-gradient(to bottom,#00ff004a,#00ff008c)}
#jumppage,#postjumppage{background-color:#fffc}
.pager .btn,.ajax-pager .btn{background:#fffc;background-image:none}
.main-content .label,.main-content .badge{background-color:#9999}
.btn{background-image:linear-gradient(to bottom,transparent,transparent);background-color:#f5f5f5b0}
.btn-warning{background-image:linear-gradient(to bottom,#fbb45099,#f8940699)!important}
.btn-danger{background-image:linear-gradient(to bottom,#ee5f5bc0,#bd362fc0)!important}
.btn-inverse{background-image:linear-gradient(to bottom,#4449,#222c)}
.listview li div.badge,.hanintro .label{background-color:#2d89efbd}
.label-info[href],.badge-info[href]{background-color:#007ebda0!important}
.label-important,.badge-important{background-color:#b94a48d6!important}
.label-info,.badge-info,#createform .label-info{background-color:#3a87adb0!important}
.label-warning,.badge-warning{background-color:#f89406b0!important}
.label-success,.badge-success{background-color:#468847b0!important}
.label-inverse,.badge-inverse{background-color:#0008!important}
.lolly,.lvl{background-color:#f5ab36b0!important}
.cbadge{background-color:#FF677D!important}
.scate-1 .sactive,.scate-1 .sinde,.scate-1.sactive,.scate-1.sinde{background:#e63333}
.scate-2 .sactive,.scate-2 .sinde,.scate-2.sactive,.scate-2.sinde{background:#2f75b5}
.scate-3 .sactive,.scate-3 .sinde,.scate-3.sactive,.scate-3.sinde{background:#60f}
.scate-4 .sactive,.scate-4 .sinde,.scate-4.sactive,.scate-4.sinde{background:#70ad47}
.scate-5 .sactive,.scate-5 .sinde,.scate-5.sactive,.scate-5.sinde{background:#bf8f00}
.scate-6 .sactive,.scate-6 .sinde,.scate-6.sactive,.scate-6.sinde{background:#ff92db}
.scate-7 .sactive,.scate-7 .sinde,.scate-7.sactive,.scate-7.sinde{background:#630}
.scate-8 .sactive,.scate-8 .sinde,.scate-8.sactive,.scate-8.sinde{background:#3cf}
.scate-9 .sactive,.scate-9 .sinde,.scate-9.sactive,.scate-9.sinde{background:#d9e51e}
.listview li div.badge.info{background-color:#007ebda0}
.alert-info{background-color:#d9edf7b0}
.btn-primary{background-image:linear-gradient(to bottom,transparent,transparent)!important;background-color:#006dcc99!important}
.btn-primary:hover,.btn-primary:focus,.btn-primary:active,.btn-primary.active,.btn-primary.disabled,.btn-primary[disabled]{background-color:#04c9!important}
.btn-warning:hover,.btn-warning:focus,.btn-warning:active,.btn-warning.active,.btn-warning.disabled,.btn-warning[disabled]{background:#f89406a0!important}
.nav-pills>.active>a,.nav-pills>.active>a:hover,.nav-pills>.active>a:focus{background-color:#08ca}
.navbar .nav>.active>a, .navbar .nav>.active>a:hover, .navbar .nav>.active>a:focus{background-color:#e5e5e595}
.rankflag::before{background:linear-gradient(210deg,rgba(218,235,244,.4) 0,rgba(218,235,244,.4) 50%,transparent 51%,transparent 100%)}
.rankflag::after{background:linear-gradient(150deg,rgba(218,235,244,.4) 0,rgba(218,235,244,.4) 50%,transparent 51%,transparent 100%)}
.nav-tabs .active a,.nav-tabs .active a:hover,.nav-tabs .active a:focus,.user-comment,#multiview input[type='text'],#multiview textarea{background-color:#fffb}
.feed-item,select{background-color:#fff9}
textarea,input[type='text'],input[type='password'],input[type='datetime'],input[type='datetime-local'],input[type='date'],input[type='month'],input[type='time'],
input[type='week'],input[type='number'],input[type='email'],input[type='url'],input[type='search'],input[type='tel'],input[type='color'],.uneditable-input{background-color:#fffa}
footer{background-color:#e2e2e2e0}
.feed-footer{background:#f7f6f980}
.tabcontent{background-color:#fff4}
.tooltip-inner{background-color:#000b}
#flinkdiv img{opacity:.5;transition: opacity ease-in-out .5s}
#flinkdiv img:hover{opacity:.9}
#donatediv #msgmenu .active a,#donatediv .btn-warning,.expbar,.progress-success .bar{background-color:transparent}
.msglist-item:hover{background-color:#c0c0c090}
.dropdown-menu{background-color:#fffd;backdrop-filter:blur(3px)}
.nav-pills .open .dropdown-toggle{background-color:#999a}
.nav>li>a:hover,.nav>li>a:focus{background-color:#eeeb}
.post .post-title a:hover{background-color:#e6e6e6cc}
.totop{margin-left:1000px;background-repeat:no-repeat;background-position-x:0px;-webkit-transition:background-position-x ease-out .6s;transition:background-position-x ease-out .6s}
.totop-wrapper.hidden>.totop{background-position-x:-250px}
.user-bg>h2,.user-bg>.user-stats{padding:2px 10px}
.user-bg>h2,.user-bg>.user-stats,.user-bg>.user-numbers-div,.userinfo h3{background-color:#fffa;border-radius:5px}
.bubble{background:#ffffff90}
.bubble:after{border-width:10px 15px 10px 0;border-color:transparent #ffffffe8}
.btn-info{background:transparent linear-gradient(to bottom,#5bc0dea0,#2f96b480)}
.well{background-color:#f5f5f5b8}
#main:has(.monthly-container){background:linear-gradient(135deg,#cebe29aa 0,#9b1f50aa 33%,#2989d8aa 71%,#89b4ffaa 91%)!important}
.btn-toolbar .btn,.searchbtn,.favbtn,#blog a[onclick*='rptBlog'],#newtag .btn,.author-info .btn:not(.disabled){background:#f5f5f5b0;background-image:none}
#tag-input{background-color:#fffc}
.tag-info{background:#f3f3f3a0}
.tm-tag-info{color:#4594b5;background-color:#c5eefaa0}
.tm-tag:not(.tm-tag-info){color:#368000;background-color:#b1ff6b80}
.cke_wysiwyg_frame,.cke_wysiwyg_div,a.cke_combo_button{background:transparent!important}
.cke_top,.cke_bottom{background:transparent linear-gradient(to bottom,#f5f5f555,#019ed555)!important}
.cke_inner{background:transparent linear-gradient(to right, rgba(255,255,255,.5),rgba(255,255,255,.5),rgba(255,255,255,.5),rgba(255,255,255,1),rgba(255,255,255,1))!important}
.cke_toolgroup,.cke_combo_button{background:transparent linear-gradient(to bottom,#fff9,#e4e4e444)!important}
::-webkit-scrollbar{width:15px;height:15px}
::-webkit-scrollbar-thumb{border:solid 1px #0001;border-radius:8px;box-shadow:0 0 6px 2px #fff8;background-color:rgba(153,153,153,.5)}
::-webkit-scrollbar-thumb:hover{background-color:rgba(100,100,100,.5);border-color:#0004}
::-webkit-scrollbar-thumb:active{background-color:rgba(50,50,50,.5);border-color:#0006}
::-webkit-scrollbar-track{border-radius:8px;-webkit-box-shadow:inset 0 0 4px rgba(0,0,0,.3);background-color:#fff8}
::-webkit-scrollbar-track:hover{background-color:#fffa}
::-webkit-scrollbar-track:active{background-color:#fffd}
::-webkit-scrollbar-corner{display:block}
::-webkit-scrollbar-button{border-radius:8px;background-color:#fff8}
::-webkit-scrollbar-button:start:increment,::-webkit-scrollbar-button:end:decrement{visibility:hidden}
::-webkit-scrollbar-button:start,::-webkit-scrollbar-button:end{width:12px;height:12px;border-width:8px;border-style:solid}
::-webkit-scrollbar-button:start{border-color:transparent transparent rgba(0,0,0,.3) transparent}
::-webkit-scrollbar-button:start:hover{border-color:transparent transparent rgba(0,0,0,.5) transparent;background-color:#fffa}
::-webkit-scrollbar-button:start:active{border-color:transparent transparent rgba(0,0,0,.8) transparent;background-color:#fffd}
::-webkit-scrollbar-button:end{border-color:rgba(0,0,0,.3) transparent transparent transparent}
::-webkit-scrollbar-button:end:hover{border-color:rgba(0,0,0,.5) transparent transparent transparent;background-color:#fffa}
::-webkit-scrollbar-button:end:active{border-color:rgba(0,0,0,.8) transparent transparent transparent;background-color:#fffd}
.gm_grid-container{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}
.gm_grid-item{padding:10px;border:none}
.gm_sliderBar{position:relative;width:100%}
.gm-bgalpha-slider,.gm-bgblur-slider{position:relative;width:50%}
.gm_slot{position:absolute;top:50%;left:0;transform:translateY(-50%);width:100%;height:10px;background-color:#bbb8;z-index:10;border-radius:10px}
.gm_process{background-color:#ff8fbc;background:linear-gradient(to right,#ffb0b0,#ff8fbc);z-index:20;width:0}
.gm_slider{position:absolute;top:50%;left:0;transform:translate(-50%,-50%);width:36px;height:31px;z-index:30;cursor:move;background-image:url('${hartIcon}');background-size:auto 100%;background-repeat:no-repeat;background-position:center}
.gm_percent{position:absolute;top:50%;right:-60px;transform:translateY(-50%);color:#666}
.gm_non-selectable{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;


	// ===================== < JS > =======================================
	GM_addStyle(strs);


	function setPanelBackground(alpha = 0.75){
		const bubbleAlphaDiff = 0.37 - alpha;
		const bubbleAfterAlpha =calculateTransparency(alpha, 0.3, 1, 0.7, 0.97);
		const newcss = `#body,input.tagsearch{background-color:rgba(255,255,255,${alpha})!important}
		.categories{background:rgba(255,255,255,${alpha - 0.11 > 0 ? alpha - 0.11 : 0 })}
		.dropdown-menu{background-color:rgba(255,255,255,${alpha + 0.13 < 1 ? alpha + 0.13 : 1 })}
		.btn-toolbar .btn,.searchbtn,.favbtn,#blog a[onclick*='rptBlog'],#newtag .btn,
		.HGswitch .btn:not(.disabled),.author-info .btn:not(.disabled){background:rgba(245,245,245,${alpha - 0.05 > 0 ? alpha - 0.05 : 0 })}
		.nav-tabs .active a,.nav-tabs .active a:hover,.nav-tabs .active a:focus,.user-comment,#multiview input[type='text'],
		#multiview textarea{background-color:rgba(255,255,255,${alpha - 0.03 > 0 ? alpha - 0.03 : 0 })}
		.bubble{background:rgba(255,255,255,${alpha + bubbleAlphaDiff < 1 ? alpha + bubbleAlphaDiff : 1 })}
		.bubble:after{border-color:transparent rgba(255,255,255,${bubbleAfterAlpha})}
		.well{background-color:rgba(245,245,245,${alpha + 0.01 < 1 ? alpha + 0.01 : 1 })}
		.navbar-inner{background-image:linear-gradient(to bottom,rgba(255,255,255,${alpha + 0.07 < 1 ? alpha + 0.07 : 1 }),rgba(242,242,242,${alpha + 0.15 < 1 ? alpha + 0.15 : 1}))}`;

		if (addStyleDoms.panelbg) {
			addStyleDoms.panelbg.remove();
		}
		addStyleDoms.panelbg = GM_addStyle(newcss);
	}


	function setPanelBlur(blur = 0){
		$("#body").css("backdrop-filter",`blur(${blur}px)`);
	}


	function initial(){
		setPanelBackground(GM_getValue(settingsKeys.panelBgAlpha, undefined));
		setPanelBlur(GM_getValue(settingsKeys.panelBgBlur, undefined));
	}


	function calculateTransparency(input, inputMin, inputMax, outputMin, outputMax) {
		const output = outputMin + (outputMax - outputMin) * ((input - inputMin) / (inputMax - inputMin));
		return output;
	}


	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				if (unsafeWindow.CKEDITOR && unsafeWindow.CKEDITOR.tools && unsafeWindow.CKEDITOR.tools.callFunction) {
					hookCKEditorToolsCallFunction();
					observer.disconnect();
					break;
				}
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });


	function hookCKEditorToolsCallFunction() {
		const originalCallFunction = unsafeWindow.CKEDITOR.tools.callFunction;

		unsafeWindow.CKEDITOR.tools.callFunction = new Proxy(originalCallFunction, {
			apply(target, thisArg, argumentsList) {
				if(argumentsList.length > 0){
					const elem = argumentsList[1];
					if(elem instanceof Element || elem instanceof HTMLDocument){
						if($(elem).hasClass('cke_button__maximize')){
							$("header").css('visibility',elem.title.includes('全屏') ? 'hidden' : 'visible');
						}
					}
				}
				return Reflect.apply(target, thisArg, argumentsList);
			}
		});
	}


	/**
	 * 将小数范围映射到百分比范围，并取整
	 * @param {number} value - 要映射的值
	 * @param {number} min - 原始范围的最小值
	 * @param {number} max - 原始范围的最大值
	 * @param {number} newMin - 新范围的最小值
	 * @param {number} newMax - 新范围的最大值
	 * @returns {number} - 映射后的取整值
	 */
	function mapValue(value, min, max, newMin = 0, newMax = 100) {
		const mappedValue = ((value - min) / (max - min)) * (newMax - newMin) + newMin;
		return Math.floor(mappedValue);
	}


	/**
	* 将百分比范围映射回小数范围，并保留两位小数
	* @param {number} mappedValue - 要映射的值（在新范围内）
	* @param {number} newMin - 新范围的最小值
	* @param {number} newMax - 新范围的最大值
	* @param {number} min - 原始范围的最小值
	* @param {number} max - 原始范围的最大值
	* @returns {number} - 映射回来的原始值，保留两位小数
	*/
	function reverseMapValue(mappedValue, newMin, newMax, min, max) {
		const originalValue = ((mappedValue - newMin) / (newMax - newMin)) * (max - min) + min;
		return parseFloat(originalValue.toFixed(2));
	}


	/** 创建滑块条
	* @param {string} id - 滑块条id
	* @param {string} parent - 要插入到的父级节点
	* @param {function} moveCallback - 滑块条改变时触发回调
	*/
	function createGMSliderBar(id, parent, moveCallback) {
		const template = `<div id="${id}" class="gm_sliderBar gm_non-selectable"><div class="gm_slot"></div><div class="gm_slot gm_process"></div>
        <div class="gm_slider"></div><span class="gm_percent">0%</span>
			</div>`;

		const gmSbar = $(template);
		$(parent).append(gmSbar);
		let process = $(`#${id} .gm_process`)[0];
		let slider = $(`#${id} .gm_slider`)[0];
		let percent = $(`#${id} .gm_percent`)[0];
		let max = $(`#${id}`)[0].offsetWidth;
		let startX = 0,
			moveX = 0,
			currentX = 0,
			isDrag = false;

		const handleStart = function(e){
			e.stopPropagation();
			if (e.button === 0 || e.touches) {
				const cx = !e.touches ? e.clientX : e.touches[0].clientX;
				isDrag = true;
				startX = cx;
				document.addEventListener('mousemove', handleMove);
				document.addEventListener('mouseup', handleEnd);
				document.addEventListener('touchmove', handleMove);
				document.addEventListener('touchend', handleEnd);
			}
		};

		const handleMove = function(e){
			e.stopPropagation();
			if(isDrag){
				const cx = !e.touches ? e.clientX : e.touches[0].clientX;
				let diffX = cx - startX;
				moveX = diffX + currentX;
				if(moveX < 0) moveX = 0;
				if(moveX > max) moveX = max;
				let pre = Math.floor(moveX / max * 100);
				percent.innerText = pre + '%';
				slider.style.left = moveX + 'px';
				process.style.width = (moveX + 10) + 'px';
				if(moveCallback) moveCallback(pre);
			}
		}

		const handleEnd = function(e){
			e.stopPropagation();
			isDrag = false;
			currentX = moveX;
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleEnd);
			document.removeEventListener('touchmove', handleMove);
			document.removeEventListener('touchend', handleEnd);
		}

		gmSbar[0].setval = v =>{
			moveX = Math.floor(v / 100 * max);
			if(moveX < 0) moveX = 0;
			if(moveX > max) moveX = max;
			startX = moveX;
			currentX = moveX;
			gmSbar[0].clientX = moveX;
			percent.innerText = v + '%';
			slider.style.left = moveX + 'px';
			process.style.width = (moveX + 10) + 'px';
		};

		slider.addEventListener('mousedown', handleStart);
		slider.addEventListener('touchstart', handleStart);
		return gmSbar[0];
	}


	// 创建设置页面
	function createSettingsPage() {
		function addSettingsGroup(id, title, content) {
			const accordion = $('.accordion');
			if (!accordion){
				console.error('Accordion settings list not found');
				return;
			}
			if ($(`#${id}`).length > 0) {
				$(`#${id}`).append(content);
				return;
			}
			const groupTemplate = `<div class="accordion-group">
			<div class="accordion-heading"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#account-accordion" href="#${id}"><h3>${title}</h3></a></div>
			<div class="accordion-body collapse" id="${id}" style="height:0px">${content}</div>
			</div>`;
			return accordion.prepend(groupTemplate);
		}

		// ------------- 背景透明度调整 --------------
		const backgroundAlphaPanel = `<div class="gm_grid-container">
		<div class="gm_grid-item"><strong>内容背景透明度</strong></div>
		<div class="gm_grid-item gm-bgalpha-slider"></div><br>
		</div>`;

		addSettingsGroup('gm-sg-panel', '界面显示设置', backgroundAlphaPanel);
		const gmAlphaSlider = createGMSliderBar('gm-s-background-alpha-slider', '.gm-bgalpha-slider', function(pre) {
			const bgAlpha = reverseMapValue(pre, 0, 100, 0.3, 1);
			GM_setValue(settingsKeys.panelBgAlpha, bgAlpha);
		});

		gmAlphaSlider.setval(mapValue(GM_getValue(settingsKeys.panelBgAlpha, 0.75), 0.3, 1));

		GM_addValueChangeListener(settingsKeys.panelBgAlpha, function (name, old_value, new_value, remote) {
			setPanelBackground(new_value);
		});

		// ------------- 背景模糊度调整 --------------
		const backgroundBlurPanel = `<div class="gm_grid-container">
		<div class="gm_grid-item"><strong>内容背景模糊度</strong></div>
		<div class="gm_grid-item gm-bgblur-slider"></div><br>
		</div>`;

		addSettingsGroup('gm-sg-panel', undefined, backgroundBlurPanel);
		const gmBlurSlider = createGMSliderBar('gm-s-background-blur-slider', '.gm-bgblur-slider', function(pre) {
			const bgBlur = reverseMapValue(pre, 0, 100, 0, 8);
			GM_setValue(settingsKeys.panelBgBlur, bgBlur);
		});

		gmBlurSlider.setval(mapValue(GM_getValue(settingsKeys.panelBgBlur, 0), 0, 8));

		GM_addValueChangeListener(settingsKeys.panelBgBlur, function (name, old_value, new_value, remote) {
			setPanelBlur(new_value);
		});
	}

	// ==========================================
	initial();

	if (location.href.match(/Account\/Manage/gi)){
		createSettingsPage();
	}

})();