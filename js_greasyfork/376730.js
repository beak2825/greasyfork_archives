// ==UserScript==
// @name         NS库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NS库，强大的扩展
// @author       lnwazg
// @grant        none
// ==/UserScript==
(function (window) {
	"use strict";

	var NS = {
		//属性表
		//浏览器判断
		browser: {
			//判断浏览器类型
			versions: (function () {
				var u = navigator.userAgent,
					app = navigator.appVersion;
				return {
					//是否是以下类型的浏览器
					iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
					iPhone: u.indexOf('iPhone') > -1,
					iPad: u.indexOf('iPad') > -1,
					IE: (!!window.ActiveXObject || "ActiveXObject" in window || u.indexOf("MSIE") >= 1),
					Firefox: (u.indexOf("Firefox") != -1),
					Chrome: (u.indexOf("Chrome") != -1),
					Safari: (u.indexOf("Safari") != -1)
				};
			})()
		},
		//localStorage方便的操作类
		LS: {
			set: function (key, value) {
				//在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
				//这时一般在setItem之前，先removeItem()就ok了
				if (this.get(key) !== null)
					this.remove(key);
				localStorage.setItem(key, value);
			},
			//查询不存在的key时，有的浏览器返回undefined，这里统一返回null
			get: function (key) {
				var v = localStorage.getItem(key);
				return v === undefined ? null : v;
			},
			remove: function (key) {
				localStorage.removeItem(key);
			},
			clear: function () {
				localStorage.clear();
			},
			each: function (fn) {
				var n = localStorage.length,
					i = 0,
					fn = fn || function () {},
					key;
				for (; i < n; i++) {
					key = localStorage.key(i);
					if (fn.call(this, key, this.get(key)) === false)
						break;
					//如果内容被删除，则总长度和索引都同步减少
					if (localStorage.length < n) {
						n--;
						i--;
					}
				}
			}
		},
		//TODO: 其它新增属性可添加于此

		//函数表
		//localStorage操作的快捷方式
		lset: function () {
			this.LS.set.apply(this.LS, arguments);
		},
		lget: function () {
			this.LS.get.apply(this.LS, arguments);
		},
		lremove: function () {
			this.LS.remove.apply(this.LS, arguments);
		},
		lclear: function () {
			this.LS.clear.apply(this.LS, arguments);
		},
		leach: function () {
			this.LS.each.apply(this.LS, arguments);
		},
		//读取cookies
		getCookie: function (name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg)) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		},
		/**
		 * 动态获取cookie的域的方法<br>
		 * 该方法可作为适配器方法
		 */
		getCookieDomain: function () {
			//首先你应该预置一个NS.cookieDomainFn的函数，否则将使用空默认值
			//		return (NS.cookieDomain? (";domain="+ NS.cookieDomain):"");
			return (NS.cookieDomainFn ? (";domain=" + NS.cookieDomainFn()) : "");
		},
		/**
		 * 写cookies
		 * name键
		 * value值
		 */
		setCookie: function (name, value, expireDays) {
			//(默认为永远不过期)写入之后有效期设置为100年，也就是相当于永不过期
			var Days = 36000;
			if (expireDays) {
				//假如传了过期时间这个参数
				Days = expireDays;
			}
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			//设置cookie的键值对信息以及过期信息 (指定path真的很重要！) 
			document.cookie = (name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/" + this.getCookieDomain());
		},
		//写cookie。该cookie的生命周期为：session
		setCookieInSession: function (name, value) {
			var isIE = !-[1, ]; //判断是否是ie核心浏览器  
			if (isIE) {
				//设置cookie的键值对信息以及过期信息 (指定path真的很重要！) 
				document.cookie = (name + "=" + escape(value) + ";expires=At the end of the Session;path=/" + this.getCookieDomain());
			} else {
				//设置cookie的键值对信息以及过期信息 (指定path真的很重要！) 
				document.cookie = (name + "=" + escape(value) + ";expires=Session;path=/" + this.getCookieDomain());
			}
		},
		//删除cookies   
		delCookie: function (name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1); //将过期时间设置为上一毫秒   
			var cval = this.getCookie(name);
			if (cval != null) {
				//若能取到这个cookie的键值对，那么就将其设置为过期    (指定path真的很重要！) 
				document.cookie = (name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/" + this.getCookieDomain());
			}
		},
		//删除cookies,未指定域名的
		delCookieWithoutDomain: function (name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1); //将过期时间设置为上一毫秒   
			var cval = this.getCookie(name);
			if (cval != null) {
				//若能取到这个cookie的键值对，那么就将其设置为过期    (指定path真的很重要！) 
				document.cookie = (name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/");
			}
		},
		//判断某个字符串是否为空
		isNull: function (obj) {
			if (!obj || obj.length == 0) {
				return true;
			}
			return false;
		},
		//判断是否为空
		isEmpty: function (obj) {
			return this.isNull(obj);
		},
		/**
		 * 是否不为空
		 */
		isNotEmpty: function (obj) {
			return !this.isNull(obj);
		},
		//某个数组中是否包含某个元素
		contains: function (element, array) {
			if (this.indexOf(element, array) != -1) {
				return true;
			}
			return false;
		},
		/**
		 * 更适用于对象比较的版本
		 * @param element
		 * @param array
		 */
		objContains: function (element, array) {
			if (this.objIndexOf(element, array) != -1) {
				return true;
			}
			return false;
		},
		//返回某个元素在数组中的位置
		indexOf: $.inArray,
		/**
		 * 更适用于对象比较的版本<br>
		 * 将每个元素分别转换成string之后再进行查找。(此种查找方法适用于复杂对象的查找，并且那种情况下indexOf()方法将会失效)
		 */
		objIndexOf: function (element, array) {
			var eleNew = JSON.stringify(element);
			var arrayNew = [];
			for (var i = 0; i < array.length; i++) {
				arrayNew[i] = JSON.stringify(array[i]);
			}
			return this.indexOf(eleNew, arrayNew);
		},
		/**
		 * 删除数组中某个索引的数据
		 * @param idx
		 * @param array
		 * @returns
		 */
		removeIdx: function (idx, array) {
			if (isNaN(idx) || idx > array.length) {
				return false;
			}
			for (var i = 0, n = 0; i < array.length; i++) {
				if (array[i] != array[idx]) {
					array[n++] = array[i];
				}
			}
			array.length -= 1; //如果数组已经没元素了，再删除就会报错！
			return array;
		},
		/**
		 * 更适用于对象比较的版本
		 * @param idx
		 * @param array
		 * @returns
		 */
		objRemoveIdx: function (idx, array) {
			return this.removeIdx(idx, array);
		},
		/**
		 * 删除数组中的某个元素
		 * @param element
		 * @param array
		 * @returns
		 */
		removeElement: function (element, array) {
			return this.removeIdx(this.indexOf(element, array), array);
		},
		/**
		 * 更适用于对象比较的版本<br>
		 * 删除数组中的某个元素
		 * @param element
		 * @param array
		 * @returns
		 */
		objRemoveElement: function (element, array) {
			return this.objRemoveIdx(this.objIndexOf(element, array), array);
		},
		/**
		 * 判断某个字符串是不是以某个字符串开头
		 * 为何要写这个方法？因为令人无语的微信浏览器竟然不支持该方法啊！！！
		 * @param original  原有的字符串
		 * @param str    待搜索的字符串
		 * @returns {Boolean}
		 */
		startsWith: function (original, str) {
			if (str == null || str == "" || original.length == 0 || str.length > original.length) {
				return false;
			}
			if (original.substr(0, str.length) == str) {
				return true;
			} else {
				return false;
			}
			return true;
		},
		/**
		 * 判断某个字符串是不是以某个字符串结尾
		 * @param original
		 * @param str
		 * @returns {Boolean}
		 */
		endWith: function (original, str) {
			if (str == null || str == "" || original.length == 0 || str.length > original.length) {
				return false;
			}
			if (original.substring(original.length - str.length) == str) {
				return true;
			} else {
				return false;
			}
			return true;
		},
		//返回短名称
		shortName: function (str, maxLength) {
			if (str && str.length > 0) {
				var len = str.length;
				if (len <= maxLength) {
					return str;
				} else {
					return (str.substr(0, maxLength) + "...");
				}
			} else {
				return "";
			}
		},
		//检查是否是数字
		checkNumber: function (value) {
			var reg = /^[1-9]\d*$/;
			if ("0" == value || reg.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		//将指定map的指定的key初始化成空array
		initMapArray: function () {
			var len = arguments.length; //可变参数的方法
			if (len == 0 || len == 1) {
				return;
			}
			var map = arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				var paramName = arguments[i];
				map[paramName] = [];
			}
		},
		//匿名
		anoym: function (name) {
			if (!name || name.length == 0) {
				return "***";
			}
			var length = name.length;
			if (length == 1) {
				return (name + "***");
			} else {
				return (name[0] + "***" + name[name.length - 1]);
			}
		},
		/**
		 * 动态加载脚本
		 * 不推荐使用，因为这样加载的脚本会到最后才执行。如果该脚本被其他脚本依赖，则不推荐这样的方式
		 * @param script
		 */
		loadScript: function (url) {
			var content = '<script type="text/javascript" src="' + url + '"></script>';
			document.writeln(content);
		},
		/**
		 * 动态加载样式
		 * @param url
		 */
		loadCss: function (url) {
			var content = '<link rel="stylesheet" type="text/css" href="' + url + '"/>';
			document.writeln(content);
		},
		//转换为用于显示用的字符串（去除undefined等等不合理的显示）
		toStr: function (obj) {
			if (this.isNull(obj)) {
				return "";
			}
			return obj;
		},
		//兼容方式获取滚动条距离顶部的距离
		getScrollTop: function () {
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			return scrollTop;
		},
		//兼容方式设置滚动条距离顶部的距离
		setScrollTop: function (scroll_top) {
			document.documentElement.scrollTop = scroll_top;
			window.pageYOffset = scroll_top;
			document.body.scrollTop = scroll_top;
		},
		/**
		 * 获取两个日期的天数差(起始时间-结束时间) 
		 */
		getDateDiffDays: function (startDate, endDate) {
			var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime(); //得到毫秒数     
			var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
			var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24); //取绝对值     
			return dates;
		},
		//防重复提交的事件注册表
		//用于检测某个事件是否已经在队列里先行一步了
		_timerReg: {},
		/**
		 * 防止快速点击所导致的重复提交
		 * @param id 标记，用于区分是否是同一种业务场景
		 * @param fn 回调函数
		 * @param wait 等待的毫秒数
		 * @returns
		 */
		preventDuplicateSubmission: function (id, fn, wait) {
			if (!wait) {
				wait = 300; //默认延迟时间是300毫秒
			}
			if (NS._timerReg[id]) {
				console.log("检测到重复点击...");
				window.clearTimeout(NS._timerReg[id]);
				delete NS._timerReg[id];
			}
			return NS._timerReg[id] = window.setTimeout(function () {
				fn();
				delete NS._timerReg[id];
			}, wait);
		},
		/**
		 * 将对象保存到localStorage
		 * @param key
		 * @param obj
		 */
		saveLocalStorageObj: function (key, obj) {
			if (localStorage) {
				localStorage[key] = JSON.stringify(obj);
			}
		},
		/**
		 * 从localStorage读取出对象
		 * @param key
		 */
		readLocalStorageObj: function (key) {
			if (localStorage && localStorage[key]) {
				if (NS.isNotEmpty(localStorage[key])) {
					return JSON.parse(localStorage[key]);
				}
			}
			return null;
		},
		/**
		 * 指定的Url中，如果不存在某个参数，则添加该参数
		 */
		appendUrlParamIfNotExist: function (url, name, value) {
			if (!this.urlHasParam(url, name)) {
				//没有参数，则加上参数。有参数，则什么都不做
				url = this.urlAppendParam(url, name, value);
			}
			return url;
		},
		/**
		 * 给指定的url增加参数
		 * @param url
		 * @param name
		 * @param value
		 */
		urlAppendParam: function (url, name, value) {
			url += ((url.indexOf("?") == -1 ? "?" : "&") + name + "=" + value);
			return url;
		},
		//某个url中，是否含有某个参数
		urlHasParam: function (url, name) {
			var paramArray = this.getUrlParamArray(url);
			if (this.contains(name, paramArray)) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * 获取指定URL的参数的数组
		 * 只要是在这个URL中出现过的参数，都可以算在里面
		 * @param url
		 * @returns {Object}
		 */
		getUrlParamArray: function (url) {
			var retArray = [];
			if (url.indexOf("?") != -1) {
				var str = url.substr(url.indexOf("?") + 1);
				strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					//	         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
					retArray.push(strs[i].split("=")[0]);
				}
			}
			return retArray;
		},
		/**
		 * 替换所有字符
		 * @param str 
		 * @param reallyDo 想要替换的
		 * @param replaceWith 替换成的
		 * @param ignoreCase 是否忽略大小写
		 * @returns
		 */
		replaceAll: function (str, reallyDo, replaceWith, ignoreCase) {
			if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
				return str.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
			} else {
				return str.replace(reallyDo, replaceWith);
			}
		},
		/**
		 * 为文字包裹上一层颜色
		 */
		wrapperColor: function (original, color) {
			return "<font color='" + color + "'>" + original + "</font>";
		},
		/**
		 * 将毫秒数格式化成正常显示的格式
		 */
		formatDateMillsToShow: function (millseconds) {
			if (this.isEmpty(millseconds)) {
				return "";
			}
			return (new Date(millseconds)).format("yyyy-MM-dd hh:mm:ss");
		},
		formatDateMillsToShowDate: function (millseconds) {
			if (this.isEmpty(millseconds)) {
				return "";
			}
			return (new Date(millseconds)).format("yyyy-MM-dd");
		},
		/**
		 * 一个闭包计数器工厂<br>
		 * 默认从1开始计数<br>
		 * 可以自己指定开始的计数值
		 * @param startNum
		 * @returns {Function}
		 */
		counterFnFactory: function (startNum) {
			var num = 1;
			if (typeof startNum !== 'undefined') {
				num = Number(startNum);
			}
			//获取下一个数（默认返回的方法）
			var getNextNumFn = function () {
				return num++;
			}
			return getNextNumFn;
		},
		/**
		 * dom中是否存在某个selector<br>
		 * 可以存在一个或者多个
		 * @param selector
		 * @returns {Boolean}
		 */
		existsDomNode: function (selector) {
			return $(selector).get().length > 0;
		},
		/**
		 * dom中是否有且只存在一个某个selector
		 * @param selector
		 * @returns {Boolean}
		 */
		existsOnlyOneDomNode: function (selector) {
			return $(selector).get().length == 1;
		},
		/**
		 * 将数字格式转换成千分位
		 *@param{Object}num
		 */
		commafy: function (num) {
			if ((num + "").trim() == "") {
				return "";
			}
			if (isNaN(num)) {
				return "";
			}
			num = num + "";
			if (/^.*\..*$/.test(num)) {
				var pointIndex = num.lastIndexOf(".");
				var intPart = num.substring(0, pointIndex);
				var pointPart = num.substring(pointIndex + 1, num.length);
				intPart = intPart + "";
				var re = /(-?\d+)(\d{3})/
				while (re.test(intPart)) {
					intPart = intPart.replace(re, "$1,$2")
				}
				num = intPart + "." + pointPart;
			} else {
				num = num + "";
				var re = /(-?\d+)(\d{3})/
				while (re.test(num)) {
					num = num.replace(re, "$1,$2")
				}
			}
			return num;
		},
		/**
		 * 对千分位货币值去除千分位
		 *@param{Object}num
		 */
		delcommafy: function (num) {
			if ((num + "").trim() == "") {
				return "";
			}
			num = num.replace(/,/gi, '');
			return num;
		},
		/**
		 * 获取用户识别码<br>
		 * 该识别码每次调用的返回值均不相同<br>
		 * 该功能主要服务于统一登录系统，用于获取验证码的凭证
		 * @returns
		 */
		getIdentity: function () {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
			// clock_seq_hi_and_reserved
			// to 01
			s[8] = s[13] = s[18] = s[23] = "-";
			var uid = s.join("");
			var identity = window.Base64.encode(uid);
			NS.currentIdentity = identity; //设置系统当前的识别码
			return identity;
		},
		getCurrentIdentity: function () {
			return NS.currentIdentity;
		},
		/**
		 * 绑定系统的回车事件
		 * @param fn
		 */
		bindGlobalEnterEvent: function (fn) {
			$(document).keypress(function (e) {
				if (e.which == 13) {
					fn();
				}
			});
		},
		//从页面上提取数据到对象中
		getPageValueToObj: function (obj, toHandleArray) {
			//		var toHandleArray = ['insure_sex_limit','insure_min_age','insure_min_age_unit','insure_max_age','insure_max_age_unit'];
			//		//获取页面中的字段信息
			////		obj.insure_sex_limit = $.trim($("#insure_sex_limit").val());
			////		obj.insure_min_age= $.trim($("#insure_min_age").val());
			////		obj.insure_min_age_unit= $.trim($("#insure_min_age_unit").val());
			////		obj.insure_max_age= $.trim($("#insure_max_age").val());
			////		obj.insure_max_age_unit= $.trim($("#insure_max_age_unit").val());
			if (obj && toHandleArray) {
				toHandleArray.forEach(function (e) {
					obj[e] = $.trim($("#" + e).val());
				});
				return obj;
			} else {
				return null;
			}
		},
		//将对象的属性值设置到页面中
		setObjPropToPageValue: function (extraData, toHandleArray) {
			if (extraData && toHandleArray) {
				toHandleArray.forEach(function (e) {
					$("#" + e).val(extraData[e]);
				});
			}
		},
		//获取某个字符串的hashCode
		getHashCode: function (str, caseSensitive) {
			if (!caseSensitive) {
				str = str.toLowerCase();
			}
			// 1315423911=b'1001110011001111100011010100111'
			var hash = 1315423911,
				i, ch;
			for (i = str.length - 1; i >= 0; i--) {
				ch = str.charCodeAt(i);
				hash ^= ((hash << 5) + ch + (hash >> 2));
			}
			return (hash & 0x7FFFFFFF);
		},
		getCurrentDate: function () {
			return (new Date()).format("yyyy-MM-dd");
		},
		getCurrentDateTime: function () {
			return (new Date()).format("yyyy-MM-dd hh:mm:ss");
		},
		//日志模块
		//日志开关
		__isLogDebug__: true,
		//关闭日志开关
		disableLog: function () {
			NS.__isLogDebug__ = false;
		},
		enableLog: function () {
			NS.__isLogDebug__ = true;
		},
		//简易日志模块
		log: function () {
			if (NS.__isLogDebug__ && arguments.length > 0) {
				console.log.apply(console, arguments);
			}
		},
		//base64加解密
		base64encode: function (input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			input = escape(input);
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;
			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);
			return output;
		},
		base64decode: function (input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;
			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
					"Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);
			return unescape(output);
		},
		//localStorage数据导入导出
		//TODO json支持、垫片技术
		exportLocalStorageData: function () {
			console.log("开始导出localStorage配置信息...")
			var obj = {};
			NS.LS.each(function (k, v) {
				obj[k] = v;
			});
			return NS.base64encode(JSON.stringify(obj));
		},
		importLocalStorageData: function (input) {
			console.log("开始导入localStorage配置信息...")
			var jsonStr = NS.base64decode(input);
			var obj = JSON.parse(jsonStr);
			// NS.LS.clear();
			Object.keys(obj).forEach(function (k) {
				NS.LS.set(k, obj[k]);
			});
		},
		//TODO: 其它新增函数可添加于此

		//语言扩展表
		_ext: {
			/**
			 * js语言级别的扩展
			 */
			jsLangExt: function () {
				//为IE浏览器补丁begin===============================
				//兼容IE8、IE9等低版本浏览器找不到console对象的写法
				window.console = window.console || (function () {
					var c = {};
					c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {};
					return c;
				})();

				if (NS.browser.versions.IE) {
					console.log("检测到IE浏览器...");
				}

				//console.log("加载扩展[jsLangExt]");

				if (!window.getComputedStyle) {
					window.getComputedStyle = function (el, pseudo) {
						this.el = el;
						this.getPropertyValue = function (prop) {
							var re = /(\-([a-z]){1})/g;
							if (prop == 'float') prop = 'styleFloat';
							if (re.test(prop)) {
								prop = prop.replace(re, function () {
									return arguments[2].toUpperCase();
								});
							}
							return el.currentStyle[prop] ? el.currentStyle[prop] : null;
						}
						return this;
					}
				}

				if (!Array.prototype.forEach) {
					Array.prototype.forEach = function (fun /*, thisp*/ ) {
						var len = this.length;
						if (typeof fun != "function")
							throw new TypeError();
						var thisp = arguments[1];
						for (var i = 0; i < len; i++) {
							if (i in this)
								fun.call(thisp, this[i], i, this);
						}
					};
				}

				if (!Array.prototype.some) {
					Array.prototype.some = function (fun /*, thisArg */ ) {
						'use strict';
						if (this === void 0 || this === null)
							throw new TypeError();
						var t = Object(this);
						var len = t.length >>> 0;
						if (typeof fun !== 'function')
							throw new TypeError();

						var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
						for (var i = 0; i < len; i++) {
							if (i in t && fun.call(thisArg, t[i], i, t))
								return true;
						}
						return false;
					};
				}

				if (!Array.prototype.every) {
					Array.prototype.every = function (fun /*, thisArg */ ) {
						'use strict';
						if (this === void 0 || this === null)
							throw new TypeError();
						var t = Object(this);
						var len = t.length >>> 0;
						if (typeof fun !== 'function')
							throw new TypeError();
						var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
						for (var i = 0; i < len; i++) {
							if (i in t && !fun.call(thisArg, t[i], i, t))
								return false;
						}
						return true;
					};
				}

				// Production steps of ECMA-262, Edition 5, 15.4.4.19
				// Reference: http://es5.github.io/#x15.4.4.19
				if (!Array.prototype.map) {
					Array.prototype.map = function (callback, thisArg) {
						var T, A, k;
						if (this == null) {
							throw new TypeError(' this is null or not defined');
						}
						// 1. Let O be the result of calling ToObject passing the |this| 
						//    value as the argument.
						var O = Object(this);

						// 2. Let lenValue be the result of calling the Get internal 
						//    method of O with the argument "length".
						// 3. Let len be ToUint32(lenValue).
						var len = O.length >>> 0;

						// 4. If IsCallable(callback) is false, throw a TypeError exception.
						// See: http://es5.github.com/#x9.11
						if (typeof callback !== 'function') {
							throw new TypeError(callback + ' is not a function');
						}

						// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
						if (arguments.length > 1) {
							T = thisArg;
						}

						// 6. Let A be a new array created as if by the expression new Array(len) 
						//    where Array is the standard built-in constructor with that name and 
						//    len is the value of len.
						A = new Array(len);

						// 7. Let k be 0
						k = 0;

						// 8. Repeat, while k < len
						while (k < len) {

							var kValue, mappedValue;

							// a. Let Pk be ToString(k).
							//   This is implicit for LHS operands of the in operator
							// b. Let kPresent be the result of calling the HasProperty internal 
							//    method of O with argument Pk.
							//   This step can be combined with c
							// c. If kPresent is true, then
							if (k in O) {

								// i. Let kValue be the result of calling the Get internal 
								//    method of O with argument Pk.
								kValue = O[k];

								// ii. Let mappedValue be the result of calling the Call internal 
								//     method of callback with T as the this value and argument 
								//     list containing kValue, k, and O.
								mappedValue = callback.call(T, kValue, k, O);

								// iii. Call the DefineOwnProperty internal method of A with arguments
								// Pk, Property Descriptor
								// { Value: mappedValue,
								//   Writable: true,
								//   Enumerable: true,
								//   Configurable: true },
								// and false.

								// In browsers that support Object.defineProperty, use the following:
								// Object.defineProperty(A, k, {
								//   value: mappedValue,
								//   writable: true,
								//   enumerable: true,
								//   configurable: true
								// });

								// For best browser support, use the following:
								A[k] = mappedValue;
							}
							// d. Increase k by 1.
							k++;
						}

						// 9. return A
						return A;
					};
				}
				if (!Array.prototype.filter) {
					Array.prototype.filter = function (fun /*, thisArg */ ) {
						"use strict";
						if (this === void 0 || this === null)
							throw new TypeError();
						var t = Object(this);
						var len = t.length >>> 0;
						if (typeof fun !== "function")
							throw new TypeError();
						var res = [];
						var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
						for (var i = 0; i < len; i++) {
							if (i in t) {
								var val = t[i];
								if (fun.call(thisArg, val, i, t))
									res.push(val);
							}
						}
						return res;
					};
				}
				if (!Function.prototype.bind) {
					Function.prototype.bind = function (oThis) {
						if (typeof this !== "function") {
							// closest thing possible to the ECMAScript 5 internal IsCallable function
							throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
						}

						var aArgs = Array.prototype.slice.call(arguments, 1),
							fToBind = this,
							fNOP = function () {},
							fBound = function () {
								return fToBind.apply(this instanceof fNOP && oThis ?
									this :
									oThis || window,
									aArgs.concat(Array.prototype.slice.call(arguments)));
							};

						fNOP.prototype = this.prototype;
						fBound.prototype = new fNOP();

						return fBound;
					};
				}
				if (!Array.indexOf) {
					Array.prototype.indexOf = function (obj) {
						for (var i = 0; i < this.length; i++) {
							if (this[i] == obj) {
								return i;
							}
						}
						return -1;
					}
				}

				// Object.keys
				if (!Object.keys) {
					Object.keys = (function () {
						'use strict';

						// modified from https://github.com/es-shims/object-keys

						var has = Object.prototype.hasOwnProperty;
						var toStr = Object.prototype.toString;
						var isEnumerable = Object.prototype.propertyIsEnumerable;
						var hasDontEnumBug = !isEnumerable.call({
							toString: null
						}, 'toString');
						var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
						var dontEnums = [
							'toString',
							'toLocaleString',
							'valueOf',
							'hasOwnProperty',
							'isPrototypeOf',
							'propertyIsEnumerable',
							'constructor'
						];
						var equalsConstructorPrototype = function (o) {
							var ctor = o.constructor;
							return ctor && ctor.prototype === o;
						};
						var excludedKeys = {
							$console: true,
							$external: true,
							$frame: true,
							$frameElement: true,
							$frames: true,
							$innerHeight: true,
							$innerWidth: true,
							$outerHeight: true,
							$outerWidth: true,
							$pageXOffset: true,
							$pageYOffset: true,
							$parent: true,
							$scrollLeft: true,
							$scrollTop: true,
							$scrollX: true,
							$scrollY: true,
							$self: true,
							$webkitIndexedDB: true,
							$webkitStorageInfo: true,
							$window: true
						};
						var hasAutomationEqualityBug = (function () {
							/* global window */
							if (typeof window === 'undefined') {
								return false;
							}
							for (var k in window) {
								try {
									if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
										try {
											equalsConstructorPrototype(window[k]);
										} catch (e) {
											return true;
										}
									}
								} catch (e) {
									return true;
								}
							}
							return false;
						}());
						var equalsConstructorPrototypeIfNotBuggy = function (o) {
							/* global window */
							if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
								return equalsConstructorPrototype(o);
							}
							try {
								return equalsConstructorPrototype(o);
							} catch (e) {
								return false;
							}
						};

						function isArgumentsObject(value) {
							var str = toStr.call(value);
							var isArgs = str === '[object Arguments]';
							if (!isArgs) {
								isArgs = str !== '[object Array]' &&
									value !== null &&
									typeof value === 'object' &&
									typeof value.length === 'number' &&
									value.length >= 0 &&
									toStr.call(value.callee) === '[object Function]';
							}
							return isArgs;
						};

						return function keys(object) {
							var isFunction = toStr.call(object) === '[object Function]';
							var isArguments = isArgumentsObject(object);
							var isString = toStr.call(object) === '[object String]';
							var theKeys = [];

							if (object === undefined || object === null) {
								throw new TypeError('Cannot convert undefined or null to object');
							}

							var skipProto = hasProtoEnumBug && isFunction;
							if (isString && object.length > 0 && !has.call(object, 0)) {
								for (var i = 0; i < object.length; ++i) {
									theKeys.push(String(i));
								}
							}

							if (isArguments && object.length > 0) {
								for (var j = 0; j < object.length; ++j) {
									theKeys.push(String(j));
								}
							} else {
								for (var name in object) {
									if (!(skipProto && name === 'prototype') && has.call(object, name)) {
										theKeys.push(String(name));
									}
								}
							}

							if (hasDontEnumBug) {
								var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

								for (var k = 0; k < dontEnums.length; ++k) {
									if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
										theKeys.push(dontEnums[k]);
									}
								}
							}
							return theKeys;
						};
					}());
				}
				//为IE浏览器补丁end===============================

				//其余的扩展here
				//如果还没有扩展这个语言级工具类，则扩展之
				if (!Date.prototype.format) {
					//对Date的扩展，将 Date 转化为指定格式的String 
					//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
					//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
					//例子： 
					//(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
					//(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
					Date.prototype.format = function (fmt) { // author: meizz
						var o = {
							"M+": this.getMonth() + 1, // 月份
							"d+": this.getDate(), // 日
							"h+": this.getHours(), // 小时
							"m+": this.getMinutes(), // 分
							"s+": this.getSeconds(), // 秒
							"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
							"S": this.getMilliseconds()
							// 毫秒
						};
						if (/(y+)/.test(fmt))
							fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
								.substr(4 - RegExp.$1.length));
						for (var k in o)
							if (new RegExp("(" + k + ")").test(fmt))
								fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
									(("00" + o[k]).substr(("" + o[k]).length)));
						return fmt;
					};
				}
			}

			//TODO: 其它语言扩展可添加于此
		},

		//构造函数表
		_classes: {
			/**
			 * 发布、订阅模式的工厂类<br>
			 * 如果想用，请实例化，例如:var pubSub = new NS.PubSub();<br>
			 * 绑定事件的方法：bind(eventType, handler)、on(eventType, handler)<br>
			 * 解除事件的方法：clear(eventType, handler)、off(eventType,
			 * handler)，可以解除绑定某个事件，也可以解除绑定所有事件<br>
			 * 查看已绑事件列表：show(eventType)、view(eventType)<br>
			 * 手动触发某个事件：fire(eventType)、trigger(eventType)、emit(eventType)<br>
			 * 重置该对象，移出所有绑定的事件; reset()
			 */
			PubSub: function () {
				//是否开启日志
				this.debugMode = true;
				/**
				 * 事件处理器列表
				 * 结构如下：
				 * 	click:[functionA, functionB, functionC, ...]
				 *  blur:[functionD, functionE, functionF, ...]
				 *  ...
				 */
				this.handlers = {};
				/**
				 * 为某种事件名成绑定（追加）一个新的事件监听器<br>
				 * 例如，PubSub.on("click",function(){ doSth...})
				 */
				this.bind = this.on = function (eventType, handler) {
					if (!(eventType in this.handlers)) {
						// 若还从未绑定过此种事件类型，例如click事件
						this.handlers[eventType] = []; // 为该种类的事件类型初始化一个空的处理器数组
					}
					// 此时，this.handlers[eventType]可能是一个空数组，也可能是一个已经有了若干个处理器的数组了！
					this.handlers[eventType].push(handler);
					if (this.debugMode) {
						console.log("成功绑定" + eventType + "事件！");
					}
					// 返回this，便于后续的继续的链式调用
					return this;
				};
				/**
				 * 移除事件处理器
				 */
				this.clear = this.off = function (eventType, handler) {
					if (eventType) {
						//对指定的事件类型进行移除
						if (handler) {
							// 如果传参了，那么只移除指定的handler
							this.handlers[eventType].pop(handler);
							if (this.debugMode) {
								console.log("成功解除指定参数类型的" + eventType + "事件！");
							}
						} else {
							// 移除所有的handler
							this.handlers[eventType] = [];
							if (this.debugMode) {
								console.log("成功解除所有的" + eventType + "事件！");
							}
						}
					} else {
						//移除所有的事件类型
						for (var et in this.handlers) {
							if (typeof (et) == "function") {
								//是一个function，不可以删除 
							} else if (typeof (et) == "string") {
								//可以删除
								delete this.handlers[et];
							}
						}
					}
					return this;
				};
				/**
				 * 打印所有的事件列表
				 */
				this.show = this.view = function (eventType) {
					if (eventType) {
						if (this.handlers[eventType]) {
							console.log("当前绑定" + eventType + "类型的事件回调函数列表为：\n" + this.handlers[eventType]);
						}
					} else {
						for (var p in this.handlers) {
							if (typeof (p) == "string") {
								console.log("当前绑定" + p + "类型的事件回调函数列表为：\n" + this.handlers[p]);
							}
						}
					}
					return this;
				};
				/**
				 * 手工触发某个事件<br>
				 * 例如:PubSub.emit("click","param1","param2");<br>
				 * 那么，就会将PubSub对象上面绑定的所有的click事件函数依次触发（调用）一遍
				 */
				this.fire = this.trigger = this.emit = function (eventType) {
					// 从第一个参数往后截取所有的后续参数的数组，例如，此例中，就是["param1","param2"]
					var handlerArgs = Array.prototype.slice.call(arguments, 1);
					if (this.handlers[eventType] && this.handlers[eventType].length > 0) {
						for (var i = 0; i < this.handlers[eventType].length; i++) {
							// this.handlers[eventType][i]就是那个绑定的函数，调用该函数，并传入参数，即可
							this.handlers[eventType][i].apply(this, handlerArgs);
						}
					} else {
						if (this.debugMode) {
							console.log("未绑定任何 【" + eventType + "】 事件！忽略调用！");
						}
					}
					// 返回this，便于后续的继续的链式调用
					return this;
				};
				/**
				 * 重置整个对象，清除其上面绑定的所有的事件<br>
				 * 该方法用于重新使用该对象
				 */
				this.reset = function () {
					this.handlers = {};
					console.log("对象已重置，绑定的事件已被清空！");
				}
			}

			//TODO: 其它构造函数可添加于此
		}
	};

	//让JS扩展即刻生效
	NS._ext.jsLangExt();

	//调用构造函数
	//创建一个开箱即用的发布订阅模式的实例
	NS.PB = new NS._classes.PubSub();

	window.NS = NS;
}(window));