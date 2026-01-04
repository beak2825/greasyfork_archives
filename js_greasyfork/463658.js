// ==UserScript==
// @name        外呼拨号程序
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 用于对接拨号客户端软件，自动注入拨号按钮，快捷拨打电话。
// @require    https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463658/%E5%A4%96%E5%91%BC%E6%8B%A8%E5%8F%B7%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/463658/%E5%A4%96%E5%91%BC%E6%8B%A8%E5%8F%B7%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==


var head = document.head || document.getElementByTagName('head')[0];
//新建遮罩div
function maskCreate() {
	var loading = document.getElementById("mask");
	if (loading) return;
	var mask = document.createElement("div");
	mask.setAttribute("id", "mask");
	mask.style = "position: absolute;background: rgba(0, 0, 0, 0.5);z-index: 9999;width: 100%; height: 100%;left: 0;top: 0;display:none;";
	var img = document.createElement("img");
	img.src = "data:image/gif;base64,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";
	img.style = "position: fixed;width: 150px;height: 150px;left: 50%;top: 50%;transform: translate(-50%, -50%);";
	mask.appendChild(img);
	if (document.body) {
		document.body.appendChild(mask);
	}
};
//清除+号并替换
function clearNumber(number) {
	if (number && number.length > 0) {
		return (number.indexOf("+") != -1 ? "+" : "") + number.replace(/\D+/g, "");
	} else {
		return "";
	}
};
//去除(后面的内容
function filterPhone(str) {
	if (str.indexOf("(") < 0) {
		return str;
	} else {
		var phone = str.substring(0, str.indexOf("("));
		return parseInt(phone);
	}
};
//添加(后面的内容
function addString(str) {
	var string;
	if (str.indexOf("(") > 0) {
		string = str.substring(str.indexOf("("), str.length);
	} else {
		string = "";
	}
	return string;
};
//正则匹配全局
var MatchParser = function() {
	var rx = /^\+?(?:00)?(?:86)?0?(?<mobile>1[3-9]\d{9}|010\d{8}|02\d{8,9}|0[3-9]\d{9,10})$/gm;
	return rx;
};
var __phoneRegex = MatchParser();
//获取手机号码
function getPhone(e) {
	return e.srcElement.getAttribute("data-phone");
};
//新建style标签并设置字体样式
var style = document.createElement("style");
var cssText = `@font-face {
        font-family: "iconfont"; /* Project id 3976729 */
        src:
             url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALYAAsAAAAABpgAAAKMAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACCcAqBEIEcATYCJAMICwYABCAFhGcHMxvbBcgekiRFchNQgIIqCMMWIoj2+83eu2+OWFLN0MiiiUwiFRKUTkikrslDIr0/195egTglRtul5ANnU0RH5DpV4FqHpIFUD0iokzeXRMzoPv/3Tv8E+sAXhH5rL5r4wPJA+kDtaUURdkLPO5ZXfg3ADQ57RqBpVxHzo6qGDnC+45ke/FnyB4OqMe5UCh5sZVSWcaEuVKF7s3hUId2ngIfs8/EnLWxJKgW/5fS2UoLL38HBAovxcpzixfh+XfixhAoKbAKZuJzOHrMQQ4KFptfSPG7Pgs/g/2ViF7e2CPHX+fVtMIdFNckiuVILCZQ10gZwsKqF2DBs+PiE409eS19TNg9jYg7f3toQ1bX2PT/+JHon8q7z4HU/J2L11f8NPtILiP+vLjUG/ckrJ3Lw4zdLlfdI82dJiW4rvD2s2W/OE3suZik2V2oiqrbt7GeN3sfy/EJjwweUAJQPRb9FBpgheNqdfe52Kfhbb2XwUTO2nYXLhwwwP6i/wRv8Lt0NkJidOCk/VeTqJLtUoG4GCUrwg0Ofa40jZRVD3WiFv2a2QqFuns78Oipa9lFVd4imDZWHW0aMLERuYNkUQujbQ9L1jELfA535d1RM+IOqvn9oug6n81qWQyynmGdYQsIAUokGPQkNLJPahhU9Wp72pbowlVU4gVKTUtqFaqzHdIsNcq8ijTGCCDXoUBV/DGu1BmSkBjUWWZKSMWNecjIZekuSaNBBOQrjMZgEEQxAVEQGeiQhs+b3tcEUemjxKJDuylIyFZaOpEqSAqCrtXpQ35u8IuulkIZhCISgDHSQKjkL09IyQIzDs9QwEZNEuSJtlCc5IBGoNul8vc5qh6DJN6UIPIWGuisTRV6rBQA=') format('woff2'),
             url('//at.alicdn.com/t/c/font_3976729_bt7wsgbl02q.woff?t=1680002849433') format('woff'),
             url('//at.alicdn.com/t/c/font_3976729_bt7wsgbl02q.ttf?t=1680002849433') format('truetype');
      }

      .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .icon-icon-call:before {
        content: "\e61e";
      }`;
style.type = 'text/css';
style.innerHTML = cssText;

//创建初始化
function ContentRecognition(args) {
	var defaults = {
		callback: function(results) {},
	};
	this.data = defaults;
	jQuery.extend(this.data, args);
	this.page = {};
	//创建监听
	this.handlers = {
		mutation_observer: this.mutationObserver.bind(this),
	};
	//初始化页面
	this.initPage.call(this);
};
//原型继承
ContentRecognition.prototype.extend = jQuery.extend;
//返回window
ContentRecognition.prototype.scope = function() {
	return this.data.scope;
};
//返回页面信息
ContentRecognition.prototype.get_page_context = function(args) {
	var self = this;
	return self.page;
};
//设置页面信息
ContentRecognition.prototype.set_page_context = function(args) {
	var self = this;
	var args = args || {};
	return jQuery.extend(true, self.page, args);
};
//替换节点
ContentRecognition.prototype.make_callable_node = function(linked_text, el) {
	el.parentNode.insertBefore(linked_text, el);
	el.parentNode.removeChild(el);
};
//呼叫之前
ContentRecognition.prototype.CallBefore = function() {};
//呼叫之后
ContentRecognition.prototype.CallAfter = function() {};
//拨号事件
ContentRecognition.prototype.makeCall = function(e, phone) {
	var self = this;
	//呼叫前
	self.CallBefore.call(self);
	var loading = self.scope().document.getElementById("mask");
	loading.style.display = "block";
	jQuery.ajax({
		type: "GET",
		url: `http://127.0.0.1:35200/api/service/call?mobile=${phone}`,
		timeout: 10000,
		success: function(res) {
			//呼叫后
			self.CallAfter.call(self);
			loading.style.display = "none";
			if (res.success == false) {
				alert(res.message);
			} else {
				if (res.message.length > 0) {
					alert(res.message);
				}
			}
		},
		error: function(error, status) {
			//呼叫后
			self.CallAfter.call(self);
			loading.style.display = "none";
			if (status == "error") {
				alert("拨号失败，请先登录外呼系统后在操作");
			} else if (status == "timeout") {
				alert("拨号超时，请重试！");
			}
		},
	});
	e.stopPropagation();
};
//新建一个符合正则验证的节点
ContentRecognition.prototype.format_replacement_html = function(args) {
	var self = this;
	var a = document.createElement("a");
	var el = document.createElement("i");
	el.setAttribute("data-phone", args.phone);
	el.setAttribute("title", "点击拨打电话" + args.phone);
	//设置class字体样式
	el.classList.add("iconfont");
	//设置图标
	el.innerHTML = "&#xe61e;";
	//设置手型
	el.style.cursor = "pointer";
	//添加点击事件
	el.addEventListener("click", function() {
		self.makeCall.call(self, event, getPhone(event));
	});
	el.style["margin-right"] = "2px";
	a.innerText = args.text;
	//添加类名防止重复添加
	a.className = "thirdlane-ext-phone";
	//图标插入方向，true为前false为后
	args.bool ? a.prepend(el) : a.append(el);
	return a;
};
//通过direction变量来控制图标的插入方向，true为插入到前面，false为后面，默认为前面
ContentRecognition.prototype.direction = true;
//遍历整个页面数据
ContentRecognition.prototype.linkNumbers = function(text, e) {
	var self = this;
	return new Promise(function(resolve, reject) {
		var linked_text = text;
		if (linked_text.length > 0) {
			var any_matches = false;
			var phone_rx = MatchParser();
			var phone = filterPhone(text);
			var str = addString(text);
			//有匹配到正则的话进入
			while ((matched = phone_rx.exec(phone)) != null) {
				//进入了正则并且返回的数组长度大于0的话
				if (matched && matched.length && matched[0]) {
					var matched_rx = matched;
					any_matches = true;
					matched = matched[0];
					var cleaned_number = clearNumber(matched);
					//创建节点
					var link_text = self.format_replacement_html.call(self, {
						phone: cleaned_number,
						text: matched,
						bool: self.direction,
					});
					link_text.append(str);
				}
			};
			if (any_matches) {
				//替换节点
				self.make_callable_node.call(self, link_text, e);
				resolve(linked_text, e);
			}
		}
	});
};
//检查节点是否已经添加过并且排除特定的标签
ContentRecognition.prototype.isNodeAcceptable = function(node) {
	return ([Node.CDATA_SECTION_NODE, Node.COMMENT_NODE].indexOf(node.parentElement.nodeType) == -1 && ["STYLE", "SCRIPT", "NOSCRIPT", "IFRAME", "FRAME", "BUTTON", "TEXTAREA", ].indexOf(node.parentElement.tagName) == -1 && node.parentElement.className !== "thirdlane-ext-phone");
};
//遍历节点
ContentRecognition.prototype.detectNumbers = function(doc) {
	var self = this;
	return new Promise(function(resolve, reject) {
		//创建可以遍历的节点
		var nodeIterator = self.scope()
			.document.createNodeIterator(doc, NodeFilter.SHOW_TEXT, {
				acceptNode: function(node) {
					return self.isNodeAcceptable.call(self, node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
				},
			}, false);
		//遍历子节点
		while ((node = nodeIterator.nextNode())) {
			var text = node.data.trim();
			self.linkNumbers.call(self, text, node)
				.then(function() {}, function() {});
		}
		resolve();
	});
};
//创建监听
ContentRecognition.prototype.createObservers = function(callback) {
	var self = this;
	var context = this;
	if (typeof callback === "function") {
		//设置监听回调
		self.set_page_context.call(self, {
			observer_callback: callback.bind(context)
		});
	};
	var page_context = self.get_page_context.call(self);
	//创建监听
	page_context.observer = new MutationObserver(function(mutations) {
		var page_context = self.get_page_context.call(self);
		if (typeof page_context.observer_callback === "function")
			page_context.observer_callback.call(self, mutations);
	});
};

//监听body
ContentRecognition.prototype.turnObservers = function(observe) {
	var self = this;
	var page_context = self.get_page_context.call(self);
	//监听存在的话开始监听body，不存在的话取消监听
	if (typeof page_context.observer_config !== "undefined") {
		if (observe) page_context.observer.observe(self.scope()
			.document.body, page_context.observer_config);
		if (!observe) page_context.observer.disconnect();
	}
};
//加载之前
ContentRecognition.prototype.LoadBefore = function() {};
//加载之后
ContentRecognition.prototype.LoadAfter = function() {};
//获取到body的子树节点
ContentRecognition.prototype.mutationObserver = function(mutations) {
	var self = this;
	self.turnObservers.call(self, false);
	self.LoadBefore.call(self);
	var mutation_it = mutations.entries();
	//遍历body的子树节点
	for (let i = mutation_it.next(); i.done != true; i = mutation_it.next()) {
		let mutation = i.value[1];
		self.detectNumbers.call(self, mutation.target)
			.then(function() {}, function() {});
	};
	self.turnObservers.call(self, true);
	self.LoadAfter.call(self);
};
//注册监听
ContentRecognition.prototype.registerObservers = function() {
	var self = this;
	self.createObservers.call(self, self.handlers.mutation_observer);
	self.detectNumbers.call(self, self.scope()
			.document.body)
		.then(function() {
			self.turnObservers.call(self, true);
		}, function() {});
};
//初始化页面设置
ContentRecognition.prototype.initPage = function(args) {
	var self = this;
	self.set_page_context.call(self, {
		//监听的配置
		observer_config: {
			attributes: false,
			childList: true,
			characterData: true,
			subtree: true,
		},
	});
	//设置页面内容
	self.set_page_context.call(self, args);
	//注册一个监听
	self.registerObservers.call(self);
};
(function() {
	head.appendChild(style);
	maskCreate();
	window.document["extension"] = {
		Dial: {
			Thirdlane: new ContentRecognition({
				scope: window,
			}),
		},
	};
})();

	/*=================== 牙医管家web端处理开始=============================== */
	if (window.location.host === "saas.dental360.cn") {
		var DentistX = new ContentRecognition({
			scope: window
		});
		DentistX.__proto__.make_callable_node = function(linked_text, el) {
			el.parentNode.insertBefore(linked_text, el);
			//今日预约未到页面时
			if (el.parentNode.parentNode.className == "netconpho") {
				el.parentNode.parentNode.removeChild(el.parentNode.parentNode.lastChild);
				//客户端或者web端时
			} else {
				el.parentNode.removeChild(el.parentNode.lastChild);
			};
			el.parentNode.removeChild(el);
		};
	};
	/*=================== 牙医管家web端处理结束=============================== */
