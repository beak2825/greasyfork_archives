// ==UserScript==
// @name        网课大全助手
// @version      1.02
// @description 支持【超星学习通】【智慧树】【职教云系列】【雨课堂】【考试星】【168网校】【u校园】【大学MOOC】【云班课】【优慕课】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】【上海开放大学】【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】【湖南高等学历继续教育】【优学院】【学起系列】【青书学堂】【学堂在线】【英华学堂】【广开网络教学平台】等，内置题库功能。如您遇到问题，请联系QQ群：565124317 邀请码为6666 系统兼容多种学习平台，支持一键搜题，提升学习效率。新增AI搜题、（如ChatGPT）技术，打破不可复制文本限制。，脚本不收集任何个人信息，确保用户隐私安全。无论是学习、复习备考，还是在线课程，本系统都能提供有效支持，使学习高效轻松。使用本系统，您将能够获取所需学习资源，提升学习效率，取得更好成绩。感谢您对本系统的信任与支持
// @author       peng
// @match        *://*.mosoteach.cn/*
// @match        *://*.chaoxing.com/*
// @match      	 *://*.xueyinonline.com/*
// @match        *://*.edu.cn/*
// @match        *://*.ouchn.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @match        *://*.zhihuishu.com/*
// @match      	 *://*.icve.com.cn/*
// @match      	 *://*.yuketang.cn/*
// @match      	 *://v.met0.top/*
// @match      	 *://*.icourse163.org/*
// @match      	 *://*.xuetangx.com/*

// @namespace    https://a.pengzi.cc/
// @supportURL   https://a.pengzi.cc/
// @icon         https://a.pengzi.cc/assets/images/2.webp
// @require      https://code.jquery.com/jquery-3.6.0.js
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/428114
// @homepage     https://greasyfork.org/zh-CN/scripts/428114
// @antifeature membership
// @antifeature ads
// @connect      127.0.0.1
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/522667/%E7%BD%91%E8%AF%BE%E5%A4%A7%E5%85%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522667/%E7%BD%91%E8%AF%BE%E5%A4%A7%E5%85%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function(_this) {


	function MyPage(menu) {

		this.aner = null;
		this.version = "5.2";
		this.$ = $;
		this.menu = menu;
		this.config = this.urlToObject(window.location.href);
		this.api = this.getAPI(this.config.hostname);
		this.config.tk_uid = null;
		this.initMenu();
		// this.initVue();
		return this;
	}
	MyPage.prototype.urlToObject = function(url) {
		let obj = {};
		let arr1 = url.split("?");
		obj["front_url"] = arr1[0].split("/");
		if (url.includes('mooc.mosoteach.cn')) {
			obj.hostname = "mooc.mosoteach";
		} else if (url.includes('mosoteach.cn')) {
			obj.hostname = "mosoteach";
		} else if (url.includes("zhihuishu.com")) {
			obj.hostname = "zhihuishu";
		} else if (url.includes("icve.com.cn")) {
			obj.hostname = "icve";
		} else if (url.includes("met0.top")) {
			obj.hostname = "meto";
		} else if (url.includes("ouchn.cn")) {
			obj.hostname = "ouchn";
		} else if (url.includes("chaoxing.com")) {
			obj.hostname = "chaoxing";
		} else if (url.includes("yuketang.cn")) {
			obj.hostname = "yuketang";
		} else if (url.includes("icourse163")) {
			obj.hostname = "mooc";
		} else if (url.includes("unipus.cn")) {
			obj.hostname = "uschool";
		} else if (url.includes("xuetangx.com")) {
			obj.hostname = "xuetangx";
		}

		if (arr1[1]) {
			let arr2 = arr1[1].split("&");
			for (let i = 0; i < arr2.length; i++) {
				let res = arr2[i].split("=");
				obj[res[0]] = res[1];
			}
		}
		return obj;
	}
	MyPage.prototype.getAPI = function(hostname) {
		switch (hostname) {
			case "mooc.mosoteach":
				console.log("精品云班课脚本准备中");
				return new jpyunbanke_api(this.config);
			case "mosoteach":
				console.log("云班课脚本准备中");
				return new yunbanke_api(this.config);
			case "zhihuishu":
				console.log("智慧树脚本准备中");
				return new zhihuishu_api(this.config);
			case "icve":
				console.log("智慧职教脚本准备中");
				return new icve_api(this.config);
			case "meto":
				console.log("meto脚本准备中");
				return new meto_api(this.config);
			case "ouchn":
				console.log("国开脚本准备中");
				return new ouchn_api(this.config);
			case "chaoxing":
				console.log("超星脚本准备中");
				return new chaoxin_api(this.config);
			case "yuketang":
				console.log("雨课堂脚本准备中");
				return new yuketang_api(this.config);
			case "mooc":
				console.log("慕课脚本准备中");
				return new mooc_api(this.config);
			case "uschool":
				console.log("U校园脚本准备中");
				return new uschool_api(this.config);
			case "xuetangx":
				console.log("学堂在线脚本准备中");
				return new xuetangx_api(this.config);
			default:
				return null;
		}
	};








	/*
	 *  u校园请求
	 */
	class uschool_api {
		constructor(config) {
			this.config = config;
		}


	}
	/*
	 *  学堂在线请求
	 */

	class xuetangx_api {
		constructor(config) {
			this.config = config;
		}


	}
	/*
	 *  mooc请求
	 */
	class mooc_api {
		constructor(config) {
			this.config = config;
		}
	}

	/*
	 *  雨课堂请求
	 */
	class yuketang_api {
		constructor(config) {
			this.config = config;
		}

	}
	/*
	 *  超星请求
	 */
	class chaoxin_api {
		constructor(config) {
			this.config = config;
		}



	}

	/*
	 *  国开请求
	 */
	class ouchn_api {
		constructor(config) {
			this.config = config;
		}


		sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

	}
	/*
	 *  meto请求
	 */
	class meto_api {
		constructor(config) {
			this.config = config;
		}


	}
	/*
	 *  智慧职教请求
	 */
	class icve_api {
		constructor(config) {
			this.config = config;
		}


	}
	/*
	 *  智慧树请求
	 */
	class zhihuishu_api {
		sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
		constructor(config) {
			this.config = config;

		}
	}
	/*
	 *  精品云班课请求
	 */
	class jpyunbanke_api {
		constructor(config) {
			this.config = config;
		}

	}


	/*
	 *  云班课请求
	 */
	class yunbanke_api {
		constructor(config) {
			this.config = config;
		}



	}






	// 鼠标拖动样式


	MyPage.prototype.arrowMove = function(e) {
		// var e = document.getElementById(e);
		// 元素大小
		let elW = e.currentTarget.offsetWidth
		let elH = e.currentTarget.offsetHeight
		// 元素位置
		let elL = e.currentTarget.parentNode.parentNode.offsetLeft
		let elT = e.currentTarget.parentNode.parentNode.offsetTop
		// 鼠标位置
		let x = e.clientX
		let y = e.clientY
		// 窗口大小
		let w = window.innerWidth
		let h = window.innerHeight
		// 鼠标到元素左边距离
		let moveX = x - elL
		let moveY = y - elT
		let el = e.currentTarget
		document.onmousemove = function(e) {
			// el.style.position = 'fixed';
			el.parentNode.parentNode.style.left = e.clientX - moveX + 'px'
			el.parentNode.parentNode.style.top = e.clientY - moveY + 'px'
		}
		document.onmouseup = function(e) {
			document.onmousemove = null
			document.onmouseup = null
		}
	};

	MyPage.prototype.initMenu = function() {
		let $ = this.$,
			menu = this.menu;
		$(document).on('mousedown', '#x_set', function(e) {
			window.my.arrowMove(e); //.target.parentNode.id
		});
		$(document).on('click', '#x_start', function() {
			window.my.start();
		});
		$(document).on('click', '#x_set', function() {
			$('html').find("#set").toggle('active');
			$('html').find("#aner").hide("slow");
		});


		//按f2显示或隐藏#x_set菜单
		$(document).on('keydown', function(e) {
			if (e.key === '*') {
				if ($('#x_set').is(':visible')) {
					$('#wzq').hide();
					$('#x_set').hide();
					alert("隐藏菜单");
				} else {
					$('#wzq').show();
					$('#x_set').show();
					alert("显示菜单");
				}
			}
		});


		/**
		 * MosoteachHelper CSS
		 */
const styleTag = `
    <style scoped>
        #${menu.id} #zhu button[disabled]{
            color: white !important;
            background-color: rgb(188, 188, 188) !important;
        }
        #${menu.id} #zhu button{
            float:left;
            margin:25px 2px;
            /* 把按钮撑大 */
            padding: 4px 8px;
            /* 去除默认边框 */
            border: none;
            /* 圆角 */
            border-radius: 50px;
            /* 按钮背景色 */
            background-color: #8888ff;
            /* 字体颜色、大小、粗细、字间距 */
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            /* 鼠标小手 */
            cursor: pointer;

            /* 给个定位 */
            position: relative;
            /* 3D模式 */
            transform-style: preserve-3d;
            /* 过度动画时间 */
            transition: ease-in-out 2s;
        }
        #${menu.id} #zhu button:hover {
            /* 鼠标放上来旋转一圈 */
            transform: rotateX(360deg);
        }
        #${menu.id} #zhu button::before,
        #${menu.id} #zhu button:after {
            content: "";
            /* 白色边框线 */
            border: 0.8px solid #fff;
            /* 圆角 */
            border-radius: 50px;

            /* 通过定位来撑开边框，简单来说，确定4边的距离，中间自然就固定了 */
            position: absolute;
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;

            /* 3D模式 */
            transform-style: preserve-3d;
            /* 设置透视参数，向 Z轴方向移动，正常时候就是向屏幕外面移动 */
            transform: perspective(1000px) translateZ(5px);
        }
        #${menu.id} #zhu button::after {
            /* 另一边反着移动一下 */
            transform: perspective(1000px) translateZ(-5px);
        }
        #${menu.id} #zhu button span {
            /* 设置 span 为块元素 */
            display: flex;

            /* 3D模式 */
            transform-style: preserve-3d;
            /* 同样设置透视，抬高 Z轴距离 */
            transform: perspective(500px) translateZ(8px);
        }
        #${menu.id}{
            font-size:14px;
            z-index: 9999;
            text-align:center;
            position:fixed;
            pointer-events: none;
            left:${menu.pos.x}px;
            top:${menu.pos.y}px;
        }
        #${menu.id} #zhu{
            pointer-events: visible;
        }
        #${menu.id} .drawer{
            height:550px;
            pointer-events: visible;
            position:relative;
            overflow:auto;
            text-align:left;
            display: none;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            width: 400px; /* initially */
            z-index: 199;
            padding:3px;
            margin:10px;
        }
        #${menu.id} .drawer iframe{
            width: 400px;
            height: 100%;
            border: none; /* 去除 iframe 边框 */
        }
        #${menu.id} p{
            text-align:left;
            padding-left:5px;
        }
        #${menu.id} .drawer input{
            border-radius: 3px;
            border: 1px solid;
            width:50%;
        }
        #${menu.id} .drawer button{
            display:inline;
            vertical-align:middle;
            border: 1px solid;
            background-color: transparent;
            text-transform: uppercase;
            padding: 1px 2px;
            font-weight: 300;
        }
        #${menu.id} .drawer button:hover {
            color: white;
            border: 0;
            background-color: #4cc9f0;
            box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
        }
        #${menu.id} #x_set{
            animation: change 3s linear 0s infinite;
            float:left;
            position:relative;
            z-index: 999999;
            margin:10px;
            border-radius:50%;
            overflow:hidden;
            height: 30px;
            width: 30px;
            border: solid 2px #00f6ffc2;
            background: url(${GM_getValue("userimg") ? GM_getValue("userimg"):"https://a.pengzi.cc/assets/images/2.webp"});
            background-size: 30px 30px;
        }
        @keyframes change {
           0%{box-shadow: 0 0 4px #f00;}
           25%{box-shadow: 0 0 16px #0f0;} 
           50%{box-shadow: 0 0 4px #00f;}
           75%{box-shadow: 0 0 16px #0f0;} 
            100% {box-shadow: 0 0 4px#333;}
           
        }

        /* 自定义滚动条样式 */
        #${menu.id} .drawer::-webkit-scrollbar {
            width: 10px;  
        }
        #${menu.id} .drawer::-webkit-scrollbar-thumb {
            background-color: #a1c4fd;
            background-image: -webkit-linear-gradient(45deg, rgba(194,233,251, 1) 15%, transparent 25%, transparent 50%, rgba(194,233,251, 1) 50%, rgba(194,233,251, 1) 75%, transparent 75%, transparent);
        }
        #${menu.id} .drawer::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #f6f6f6;
        }
    </style>`;

$(styleTag).appendTo('head');
let $menu = $(
    `
    <div id='${menu.id}'>
        <div id ="zhu">
            <div id="x_set"></div>
        </div>
        <div class= "drawer" id="set">
              <iframe class="iframe" src="https://a.pengzi.cc/" style=" height:100%;"></iframe>
        </div>
        <div class= "drawer" id="aner">
        </div>
    </div>`);

$($menu).appendTo('html');
this.aner = $('#aner');



	}



	_this.MyPage = MyPage;
})(unsafeWindow || window);

if (window.location == window.parent.location) { // 判断是否为ifarm
	window.my = new unsafeWindow.MyPage({
		id: "wzq",
		width: 80,
		background: '#fff',
		opacity: 0.8,
		pos: {
			x: 100,
			y: 100
		}
	})
}




(function() {
	'use strict';

	// 域名规则列表
	var rules = {
		black_rule: {
			name: "black",
			hook_eventNames: "",
			unhook_eventNames: ""
		},
		default_rule: {
			name: "default",
			hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
			unhook_eventNames: "mousedown|mouseup|keydown|keyup",
			dom0: true,
			hook_addEventListener: true,
			hook_preventDefault: true,
			hook_set_returnValue: true,
			add_css: true
		}
	};
	// 域名列表
	var lists = {
		// 黑名单
		black_list: [
			/.*\.youtube\.com.*/,
			/.*\.wikipedia\.org.*/,
			/mail\.qq\.com.*/,
			/translate\.google\..*/
		]
	};

	// 要处理的 event 列表
	var hook_eventNames, unhook_eventNames, eventNames;
	// 储存名称
	var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() *
		12 + 8));
	// 储存被 Hook 的函数
	var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
	var document_addEventListener = document.addEventListener;
	var Event_preventDefault = Event.prototype.preventDefault;

	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
		if (hook_eventNames.indexOf(type) >= 0) {
			_addEventListener.apply(this, [type, returnTrue, useCapture]);
		} else if (this && unhook_eventNames.indexOf(type) >= 0) {
			var funcsName = storageName + type + (useCapture ? 't' : 'f');

			if (this[funcsName] === undefined) {
				this[funcsName] = [];
				_addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
			}

			this[funcsName].push(func);
		} else {
			_addEventListener.apply(this, arguments);
		}
	}

	// 清理循环
	function clearLoop() {
		var elements = getElements();

		for (var i in elements) {
			for (var j in eventNames) {
				var name = 'on' + eventNames[j];
				if (elements[i][name] !== null && elements[i][name] !== onxxx) {
					if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
						elements[i][storageName + name] = elements[i][name];
						elements[i][name] = onxxx;
					} else {
						elements[i][name] = null;
					}
				}
			}
		}
	}

	// 返回true的函数
	function returnTrue(e) {
		return true;
	}

	function unhook_t(e) {
		return unhook(e, this, storageName + e.type + 't');
	}

	function unhook_f(e) {
		return unhook(e, this, storageName + e.type + 'f');
	}

	function unhook(e, self, funcsName) {
		var list = self[funcsName];
		for (var i in list) {
			list[i](e);
		}

		e.returnValue = true;
		return true;
	}

	function onxxx(e) {
		var name = storageName + 'on' + e.type;
		this[name](e);

		e.returnValue = true;
		return true;
	}

	// 获取随机字符串
	function getRandStr(chs, len) {
		var str = '';

		while (len--) {
			str += chs[parseInt(Math.random() * chs.length)];
		}

		return str;
	}

	// 获取所有元素 包括document
	function getElements() {
		var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
		elements.push(document);

		return elements;
	}

	// 添加css
	function addStyle(css) {
		var style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
	}

	// 获取目标域名应该使用的规则
	function getRule(url) {
		function testUrl(list, url) {
			for (var i in list) {
				if (list[i].test(url)) {
					return true;
				}
			}

			return false;
		}

		if (testUrl(lists.black_list, url)) {
			return rules.black_rule;
		}

		return rules.default_rule;
	}

	// 初始化
	function init() {
		// 获取当前域名的规则
		var url = window.location.host + window.location.pathname;
		var rule = getRule(url);

		// 设置 event 列表
		hook_eventNames = rule.hook_eventNames.split("|");
		// TODO Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|");
		eventNames = hook_eventNames.concat(unhook_eventNames);

		// 调用清理 DOM0 event 方法的循环
		if (rule.dom0) {
			setInterval(clearLoop, 30 * 1000);
			setTimeout(clearLoop, 2500);
			window.addEventListener('load', clearLoop, true);
			clearLoop();
		}

		// hook addEventListener
		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener;
			document.addEventListener = addEventListener;
		}

		// hook preventDefault
		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function() {
				if (eventNames.indexOf(this.type) < 0) {
					Event_preventDefault.apply(this, arguments);
				}
			};
		}

		// Hook set returnValue
		if (rule.hook_set_returnValue) {
			Event.prototype.__defineSetter__('returnValue', function() {
				if (this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
					this.returnValue = true;
				}
			});
		}

		console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);

		// 添加CSS
		if (rule.add_css) {
			addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important;}');
		}
	}

	init();
})();


