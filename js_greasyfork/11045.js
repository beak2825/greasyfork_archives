;(function(win, doc, undefined) {
	var $ = (function() {
		//构造函数
		var TQuery = function(selectors){
			return TQuery.fn.init(selectors);
		};
		var vision = 1.02;
		TQuery.fn = TQuery.prototype = {
			"constructor": TQuery,
			"TQuery": vision,
			//初始化
			"init": function(selectors) {
				this.selectors = selectors;
				var eles = []; //所有选择的元素
				switch (typeof selectors) {
					case "undefined":
						return this;
					case "function":
						this.ready(function(e){
							selectors.call(this, e);
						});
						break;
					case "string":
						switch (selectors.charAt(0)) {
							case '<': //<div></div>，创建元素
								var oDiv = doc.createElement('div'); //创建一个容器
								var oFragment = doc.createDocumentFragment(); //创建文档碎片
								oDiv.innerHTML = selectors;
								var child = oDiv.childNodes;
								//储存在文档碎片中
								for (var t = 0; t < child.length; t++) {
									var clone = child[t].cloneNode(true);
									oFragment.appendChild(clone);
								}
								//输出到对象中
								var temp = [];
								for (var i = 0; i < oFragment.childNodes.length; i++) {
									temp.push(oFragment.childNodes[i]);
								}
								eles = temp;
								break;
							default: //默认情况下是选择符
								//现代浏览器，IE8+，chrome，firefox，safari，opera
								if (doc.querySelectorAll) { 
									var aElems = doc.querySelectorAll(selectors);
									for (var o = 0; o < aElems.length; o++) {
										eles.push(aElems[o]);
									}
								}
								//IE8以下
								else{
									console.log('您的浏览器不支持TQuery');
								}
						}
						break;
					case "object":
						// //数组
						// if (TQuery.isArray(selectors)) {
						// 	$ARR(selectors);
						// }
						//DOM
						// else if (TQuery.isDOM(selectors)) {
							eles.push(selectors);
						// }
						//普通对象，IE8下，一切皆为对象
						// else {
							
						// 	$OBJ(selectors);
						// }
						break;
					default:
						return this;
				}
				this.refresh(eles);
				return this;
			},
			//重拾新的对象
			"reinit":function(selectors){
				return this.init(selectors);
			},
			//刷新对象数据
			"refresh": function(newArray) {
				//清空
				for (var j = 0; j < this.length; j++) {
					delete this[j];
				}
				if (newArray) this.init.elements = newArray;
				this.length = this.init.elements.length;
				//生成
				for (var i = 0; i < this.init.elements.length; i++) {
					this[i] = this.init.elements[i];
				}
			},
			//==============选择器=============
			"eq": function(n) {
				var m = n || 0,
					newArray = [];
				newArray[0] = this[m];
				this.refresh(newArray);
				return this;
			},
			//CSS3:nth-child
			"nth":function(selectors){
				var s = this.selectors.split(",");//'input,ul li'
				for( var i=0;i<s.length;i++ ){
					s[i] += ':nth-child(' + selectors + ')';
				}
				return this.reinit(s.join(","));
			},
			//倍数选择器
			"an":function(n){
				n = n ? n : 1;
				this.nth(n + 'n');
			},
			//奇数,2n-1
			"odd":function(){
				return this.nth('odd');
			},
			//偶数,2n
			"even":function(){
				return this.nth('even');
			},
			"first": function() {
				var s = this.selectors.split(",");//'input,ul li'
				for( var i=0;i<s.length;i++ ){
					s[i] += ':first-child';
				}
				return this.reinit( s.join(",") );
			},
			//选择倒数第几个，默认为0
			"last":function(n){
				n = n ? n : 1;
				var s = this.selectors.split(",");//'input,ul li'
				for( var i=0;i<s.length;i++ ){
					s[i] += ':nth-last-child(' + n + ')';
				}
				return this.reinit( s.join(",") );
			},
			"not": function(selectors) {//过滤掉
				var childElements = [];
				for (var i = 0; i < this.length; i++) {
					switch (selectors.charAt(0)) {
						case '#': //id
							if (this[i].id != selectors.substring(1)) {
								childElements.push(this[i]);
							}
							break;
						case '.': //class
							if (!this.hasClass(this[i], selectors.substring(1))) { //没有匹配到class
								childElements.push(this[i]);
							}
							break;
						default: //tagName
							if (this[i].tagName != selectors.toUpperCase()) {
								childElements.push(this[i]);
							}
					}
				}
				this.refresh(childElements);
				return this;
			},
			"filter": function(selectors) {//筛选
				var childElements = [];
				for (var i = 0; i < this.length; i++) {
					var ele = this[i];
					switch (selectors.charAt(0)) {
						case '#':
							if (this[i].id == selectors.substring(1)) {
								childElements.push(ele);
							}
							break;
						case '.':
							if (this.hasClass(ele, selectors.substring(1))) { //如果有class
								childElements.push(ele);
							}
							break;
						case '[':
							var attrinfo = selectors.replace(/(\[+|\]+|\"|\"+])/g, '').split('=');
							var attr = attrinfo[0];
							var value = attrinfo[1];
							if (attrinfo.length === 1) { //只过滤属性，没有值
								if (ele[attr] !== null || ele.getAttribute(attr)) {
									childElements.push(ele);
								}
							} else if (attrinfo.length == 2) { //过滤属性值
								if (ele[attr] == value || ele.getAttribute(attr) == value) {
									childElements.push(ele);
								}
							}
							break;
						default:
							if (ele.tagName == selectors.toUpperCase()) {
								childElements.push(ele);
							}
					}
				}
				this.refresh(childElements);
				return this;
			},
			"find": function(selectors) {//查找子节点
				var childElements = [];
				for (var i = 0; i < this.length; i++) {
					var aElems = this[i].querySelectorAll(selectors);
					var length = aElems.length;
					var j = 0;
					while (j < length) {
						childElements.push(aElems[j]);
						j++;
					}
				}
				this.refresh(childElements);
				return this;
			},
			"add": function(selectors) {
				var newSelectors = this.selectors + ',' + selectors;
				var newElements = doc.querySelectorAll(newSelectors);
				this.refresh(newElements);
				return this;
			},
			"slice": function(n, m) {
				if (n < 0 || m > this.length) return;
				var newArray = this.init.elements.slice(n, m + 1);
				this.refresh(newArray);
				return this;
			},
			//还原最初状态
			"end": function() {
				var newArray = doc.querySelectorAll(this.selectors);
				this.refresh(newArray);
				return this;
			},
			//是否包含元素
			"has": function(selectors) {
				var newArray = [];
				for (var i = 0; i < this.length; i++) {
					if (this[i].querySelectorAll(selectors).length > 0) {
						newArray.push(this[i]);
					}
				}
				this.refresh(newArray);
				return this;
			},
			//可见
			"visible":function(){

			},
			//不可见
			"unvisible":function(){

			},
			//在可视区域内的
			"inViewPort": function() {
				this.inViewPort.get = function(jugg) {
					var visi = [],
						unvisi = [],
						w, h, pos, inViewPort;
					for (var i = 0; i < this.length; i++) {
						pos = this[i].getBoundingClientRect();
						w = doc.documentElement.clientWidth || doc.body.clientWidth;
						h = doc.documentElement.clientHeight || doc.body.clientHeight;
						inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
						if (inViewPort === true) { //不在可视区域
							unvisi.push(this[i]);
						} else { //在可视区域
							visi.push(this[i]);
						}
					}
					return jugg === true ? visi : unvisi;
				};
				var newArray = this.inViewPort.get.call(this, true);
				this.refresh(newArray);
				return this;
			},
			//不在可视区域内
			"outViewPort": function() {
				var newArray = this.inViewPort.get.call(this, false);
				this.refresh(newArray);
				return this;
			},
			//==============遍历=============
			"each": function(fn) {
				for (var i = 0; i < this.length; i++) {
					fn.call(this[i]);
				}
				return this;
			},
			"findParent": function(selectors) {
				var parent = this[0].parentNode;
				if (parent.className.match(/result/)) { //找到结果
					var newArray = [];
					newArray[0] = parent;
					this.refresh(newArray);
					return this;
				} else if (parent == doc.documentElement || parent == doc.body) { //到达DOM顶层
					return this;
				} else { //继续查找
					this.findParent(selectors);
				}
			},
			"parent": function() {
				var newArray = [];
				newArray[0] = this[0].parentNode;
				this.refresh(newArray);
				return this;
			},
			"parents": function() {
				var newArray = []; //存储所有的父节点
				var hash = {};
				for (var i = 0; i < this.length; i++) {
					var v = this[i].parentNode;
					if (typeof(hash[v]) == 'undefined') {
						hash[v] = 1;
						newArray.push(v);
					}
				}
				this.refresh(newArray);
				return this;
			},
			"children": function() {
				var childElements = []; //存放所有的子节点
				var hash = {}; //过滤已经重复的子节点,中转站
				for (var i = 0; i < this.length; i++) {
					if (this[i].hasChildNodes() === false) {
						continue;
					}
					for (var j = 0; j < this[i].children.length; j++) {
						childElements.push(this[i].children[j]);
					}
				}
				var newArray = TQuery.unique(childElements);
				this.refresh(newArray);
				return this;
			},
			"prev": function() {
				var temps = [];
				for (var i = 0; i < this.length; i++) {
					var ele = this[i];
					if ($(ele).index() === 0) { //如果处在第一位，没有上一个兄弟节点
						continue;
					}
					temps.push(ele.parentNode.children[$(ele).index() - 1]);
				}
				this.refresh(temps);
				return this;
			},
			"prevAll": function() {
				var prevAllElements = [];
				for (var i = 0; i < this.length; i++) {

				}
				return this;
			},
			"next": function() {
				var temps = [];
				for (var i = 0; i < this.length; i++) {
					var ele = this[i];
					if ($(ele).index() == ele.parentNode.children.length - 1) { //如果处最后一位，没有下一个兄弟节点
						continue;
					}
					temps.push(ele.parentNode.children[$(ele).index() + 1]);
				}
				this.refresh(temps);
				return this;
			},
			"nextAll": function() {
				return this;
			},
			"siblings": function(selectors) {
				var temps = [];
				var parentNode = this.parents().elements;
				var parentNodeLength = parentNode.length;
				var allChild;
				for (var i = 0; i < parentNodeLength; i++) {
					allChild = parentNode[i].children; //所有同胞元素集合
					for (var j = 0; j < allChild.length; j++) {
						temps.push(allChild[j]); //获取所有同胞元素，包括自身
					}
				}
				this.refresh(temps);
				//如果有参数传入，则过滤同胞元素
				if (selectors) {
					this.not(selectors);
				}
				return this;
			},
			//==============事件=============
			"ready": function(fn) {
				if (this[0] == win) this[0] = doc;
				this.reinit(doc).bind('DOMContentLoaded', function(e) {
					fn.call(this, e);
					this.ready = "complete";
					// $(this).unbind('DOMContentLoaded',"ready");
				});
				//如果不支持DOMContentLoaded(IE8及以下不支持),
				if( !TQuery.browser.msie() || TQuery.browser().visoin>8 ) return this;
				if( typeof this[0].ready == "undefined" ||this[0].ready!=="complete" ){
					if( typeof this[0].onreadystatechange !== "undefined" ){
						this.bind('readystatechange',function(e){
							if(this.readyState == 'complete'){
								fn.call(this, e);
								this.ready = "complete";
								$(this).unbind('readystatechange',"ready");
								return false;
							}
						},"ready");
					}
					// 不支持document.onreadystatechange
					else{
						(function(){
						    try{
						        //doScroll方法只有在dom ready之后可以调用，否则会抛异常
						        doc.documentElement.doScroll('left');
						    }catch(e){
						    win.setTimeout( arguments.callee, 0 );
						    return;
						    }
						    //这里触发DOMContentLoaded事件
						    fn.call(doc);
						    doc.ready = "complete";
						})();
					}					
				}
				return this;
			},
			"load": function(fn) {
				if (this[0] == doc) this[0] = win;
				this.bind('load', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				},'load');
				return this;
			},
			"unload":function(fn){
				this.reinit(win).bind('unload',function(e){
					fn.call(this,e);
					return stop.call(e);
				},"unload");
			},
			"isreload":function(message){
				this.reinit(win).bind('beforeunload',function(e){
					e.returnValue = message;
					return message;
				},'beforeunload');
			},
			"click": function(fn) {
				this.bind('click', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"keydown": function(fn) {
				this.bind('keydown', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"keyup": function(fn) {
				this.bind('keyup', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"keypress": function(fn) {
				this.bind('keypress', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mousedown": function(fn) {
				this.bind('mousedown', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mouseup": function(fn) {
				this.bind('mouseup', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mouseenter": function(fn) {
				this.bind("mouseover", function(e) {
					if (e.target == this) {
						fn.call(this, e);
					}
					return stop.call(e); //默认禁止冒泡
				});
				return this;
			},
			"mouseleave": function(fn) {
				this.bind("mouseout", function(e) {
					if (e.target == this) {
						fn.call(this, e);
					}
					return stop.call(e); //默认禁止冒泡
				});
				return this;
			},
			"mousemove": function(fn) {
				this.bind("mousemove", function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mouseover": function(fn) {
				this.bind("mouseover", function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mouseout": function(fn) {
				this.bind("mouseout", function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"on": function(type, fn) {
				var ev = null;
				//如果只传一个json参数
				if (arguments.length == 1) {
					for (var k = 0; k < this.length; k++) {
						for (var attr in type) {
							// this[k][ 'on'+attr ] = type[attr];
							this[k]['on' + attr] = function(e) {
								ev = win.event ? win.event : (e ? e : null);
								if (type[attr].call(this, ev) === false) {
									return stop.call(e);
								}
							};
						}
					}
				}
				//如果传两个参数type,fn
				else {
					var events = type.split(' '); //获取每个事件
					var eventsLength = events.length;
					for (var i = 0; i < this.length; i++) {
						var j = 0;
						while (j < eventsLength) {
							// this[i][ 'on'+events[j] ] = fn;
							this[i]['on' + events[j]] = function(e) {
								ev = win.event ? win.event : (e ? e : null);
								if (fn.call(this, ev) === false) {
									ev.stopPropagation(); //阻止冒泡，w3c标准
									ev.cancelBubble = true; //阻止冒泡,ie,firefox
									ev.preventDefault(); //w3c标准
									ev.returnValue = false; //阻止默认事件，针对老版本IE
									return false;
								}
							};
							j++;
						}
					}
				}
				return this;
			},
			"hover": function(mouseenter, mouseleave) {
				this.mouseenter(function(e) {
					mouseenter.call(this, e);
				});
				this.mouseleave(function(e) {
					mouseleave.call(this, e);
				});
				return this;
			},
			"toggleClick": function() {
				var _this = this,
					_arguments = arguments,
					data = this.data('toggleClick'); //获取属性
				if (typeof data.count == "undefined") data.count = 0;
				if (typeof data.fns == "undefined") data.fns = arguments.length;
				this.data('toggleClick', data); //设置属性
				for (var i = 0; i < this.length; i++) {
					this.bind('click', function() {
						_arguments[data.count++ % data.fns].call(_this[i]);
						return stop.call(e);; //默认禁止冒泡
					}, 'toggleClick');
				}
				return this;
			},
			"resize":function(fn){
				this.bind('resize',function(e){
					if( fn.call(this,e) === false){
						return stop.call(e);
					}
				});
			},
			"scroll": function(fn) {
				this.bind('scroll', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				});
				return this;
			},
			"mouseScroll": function(fn) {
				this.bind('mousewheel DOMMouseScroll', function(e) {
					if (fn.call(this, e) === false) {
						return stop.call(e);
					}
				},'mouseScroll');
				return this;
			},
			"mouseScrollUp": function(fn) {
				this.bind('mousewheel DOMMouseScroll', function(e) {
					if (e.wheelDelta) { //chrome,ie
						if (e.wheelDelta > 0) { //滚轮向上滚动
							if (fn.call(this, e) === false) {
								return stop.call(e);
							}
						}
					} else { //狗日的firefox
						if (e.detail < 0) { //滚轮向上滚动
							if (fn.call(this, e) === false) {
								return stop.call(e);
							}
						}
					}
				}, "mouseScrollUp");
				return this;
			},
			"mouseScrollDown": function(fn) {
				this.bind('mousewheel DOMMouseScroll', function(e) {
					if (e.wheelDelta) { //chrome,ie
						if (e.wheelDelta < 0) { //滚轮向下滚动
							if (fn.call(this, e) === false) {
								return stop.call(e);
							}
						}
					} else { //狗日的firefox
						if (e.detail > 0) { //滚轮向下滚动
							if (fn.call(this, e) === false) {
								return stop.call(e);
							}
						}
					}
				}, "mouseScrollDown");
				return this;
			},
			"bind": function(type, fn, fnName) {
				//如果只传一个json参数
				if (arguments.length == 1) {
					for (var k = 0; k < this.length; k++) {
						for (var attr in type) {
							bindEvent(this[k], attr, type[attr], fnName);
						}
					}
				}
				//如果传两个参数，则多个事件统一执行一个e
				else {
					var events = type.split(' ');
					for (var i = 0; i < this.length; i++) {
						var j = 0;
						while (j < events.length) {
							bindEvent.call(this[i], this[i], events[j], fn, fnName);
							j++;
						}
					}
				}

				function bindEvent(dom, type, fn, fnName) {
					dom.eventQueue = dom.eventQueue || {};
					dom.eventQueue[type] = dom.eventQueue[type] || {};
					dom.handler = dom.handler || {};
					var index = 0; //事件队列长度
					for (var length in dom.eventQueue[type]) {
						index++;
					}
					if (!fnName) {
						dom.eventQueue[type]['fn' + index] = fn;
					} else {
						dom.eventQueue[type][fnName] = fn;
						// this.fnName = fnName;
					}
					//如果不存在handler[click]，handler[mouseover],…………
					if (!dom.handler[type]) {
						dom.handler[type] = function(e) {
							ev = win.event ? win.event : (e ? e : null);
							ev.target = ev.target || ev.srcElement;
							for (var fn in dom.eventQueue[type]) {
								if (dom.eventQueue[type][fn].call(this, ev) === false) {
									return stop.call(ev);
								}
							}
						};
						addEvent(dom, type, dom.handler[type]);
					}
				}
				return this;
			},
			"unbind": function(type, fnName) {
				for (var m = 0; m < this.length; m++) {
					var dom = this[m];
					var hasQueue = dom.eventQueue && dom.eventQueue[type];
					var queueLength = 0;
					for (var length in dom.eventQueue[type]) {
						queueLength++;
					}
					//没有绑定
					if (!hasQueue) return;
					if (!fnName) { //解除匿名函数
						if (win.removeEventListener) {
							dom.removeEventListener(type, dom.handler[type]);
						} else {
							dom.detachEvent(type, dom.handler[type]);
						}
						delete dom.eventQueue[type];
					}
					else { //解除有名函数
						delete dom.eventQueue[type][fnName];
						//如果没有队列了，则删除队列。
						if (queueLength === 0) {
							if (win.removeEventListener) {
								dom.removeEventListener(type, dom.handler[type]);
							} else {
								dom.detachEvent(type, dom.handler[type]);
							}
							delete dom.eventQueue[type];
						}
					}
				}
			},
			"one": function(type, fn) {
				var _this = this;
				//只穿一个json参数
				if (arguments.length == 1) {
					for (var k = 0; k < this.length; k++) {
						for (var attr in type) {
							// bindEvent(this[k],attr,type[attr],fnName);
							this.bind(attr, function(e) {
								var ev = win.event ? win.event : (e ? e : null);
								_this.unbind(ev.type, 'one');
								if (type[attr].call(this, ev) === false) {
									return stop.call(e);
								}
							}, "one");
						}
					}
				}
				//传2个参数
				else {
					var events = type.split(' '); //获取每个事件
					var eventsLength = events.length;
					for (var i = 0; i < this.length; i++) {
						var j = 0;
						while (j < eventsLength) {
							// this[i][ 'on'+events[j] ] = fn;
							this.bind(events[j], function(e) {
								var ev = win.event ? win.event : (e ? e : null);
								_this.unbind(ev.type, 'one');
								if (fn.call(this, ev) === false) {
									return stop.call(e);
								}
							}, "one");
							j++;
						}
					}
				}
				return this;
			},
			"trigger": function(type, fnName) {
				for (var k = 0; k < this.length; k++) {
					var dom = this[k];
					if (!fnName) {
						//如果是自定义事件
						if ( TQuery.isUndefined(dom["on" + type]) || TQuery.isUndefined(dom[type]) ) {
							//触发DOM2级事件，通过bind绑定的。
							if (dom.eventQueue) {
								for (var fn in dom.eventQueue[type]) {
									dom.eventQueue[type][fn].call(dom);
								}
							}
						}
						//如果是DOM原生事件
						else {
							// 触发DOM0,DOM2级事件,不通过bind绑定的
							if (typeof dom[type] !== "undefined") {
								dom[type].call(dom);
							}
						}
					}
					//指定触发哪个函数
					else {
						dom.eventQueue[type][fnName].call(dom);
					}
				}
				return this;
			},
			"triggerHandler":function(type, fnName){
				this.trigger(type, fnName);
			},
			"live": function(type, fn, parent) {
				var _this = this,
					liveIndex = "live" + parseFloat(Math.random() * 10).toFixed(10).replace('.', "");
				parent = parent ? parent : doc;
				for (var j = 0; j < this.length; j++) {
					this[j].parentLive = parent;
					this[j].liveIndex = liveIndex;
				}
				$(parent).bind(type, function(e) {
					for (var i = 0; i < _this.length; i++) {
						if (e.target == _this[i]) {
							fn.call(e.target, e);
							break;
						}
					}
					return stop.call(e);//默认阻止冒泡
				}, liveIndex);
				return this;
			},
			"die": function(type, parent) {
				var liveIndex = this[0].liveIndex;
				parent = parent ? parent : (this[0].parentLive ? this[0].parentLive : doc);
				$(parent).unbind(type, liveIndex);
			},
			"mutation": function(options, fn) {
				var MutationObserver, observer;
				for (var i = 0; i < this.length; i++) {
					MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;
					observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutation) {
							fn.call(this[i]);
						});
					});
					observer.observe(this[i], options);
				}
				return this;
			},
			//支持的标签<input type="text">, <select>, <textarea>，js对象：fileUpload, select, text, textarea
			"change":function(fn){
				this.bind('change',function(e){
					fn.call(this,e);
				});
			},
			//==============尺寸=============
			"width": function(setting) {
				if (!setting && this[0] instanceof Object && (this[0].alert || this[0].body)) { //如果是win，或document
					return doc.body.scrollWidth > doc.documentElement.scrollWidth ? doc.body.scrollWidth : doc.documentElement.scrollWidth; //获取带padding和margin的值
				} else if (setting) { //设置宽度
					for (var i = 0; i < this.length; i++) {
						this[i].style.width = setting.toString().replace('px', '') + 'px';
					}
					return this;
				} else {
					return this[0].offsetWidth || parseFloat(this.style('width')); //获取宽度
				}
			},
			"height": function(setting) {
				if (this[0] instanceof Object && (this[0].alert || this[0].body)) { //如果是win，或document，则返回整个文档高度
					return doc.body.scrollHeight > doc.documentElement.scrollHeight ? doc.body.clientHeight : doc.documentElement.scrollHeight; //获取带padding和margin的值
				} else if (setting) { //设置高度
					for (var i = 0; i < this.length; i++) {
						this[i].style.height = setting.toString().replace('px', '') + 'px';
					}
					return this;
				} else if (!setting) {
					return this[0].offsetHeight || parseFloat(this.style('height')); //获取高度
				}
			},
			"innerWidth": function() {

			},
			"innerHeight": function() {

			},
			"top": function(setting) {
				if (setting) {
					this.css('top', setting);
					return this;
				}
				return parseInt(this[0].offsetTop);
			},
			"left": function(setting) {
				if (setting) {
					this.css('left', setting);
					return this; //返回对象，进行链式操作
				}
				return parseInt(this[0].offsetLeft);
			},
			"viewWidth": function() {
				return doc.body.clientWidth < doc.documentElement.clientWidth ? doc.body.clientWidth : doc.documentElement.clientWidth; //取较小值
			},
			"viewHeight": function() {
				return doc.body.clientHeight < doc.documentElement.clientHeight ? doc.body.clientHeight : doc.documentElement.clientHeight; //取较小值
			},
			"style": function(attr) {
				return this[0].currentStyle ? this[0].currentStyle[attr] : getComputedStyle(this[0])[attr];
			},
			"scrollTop": function() {
				return this.size('scrollTop');
			},
			"scrollHeight": function() {
				return this.size('scrollHeight');
			},
			"scrollLeft": function() {
				return this.size('scrollLeft');
			},
			"scrollWidth": function() {
				return this.size('scrollLeft');
			},
			"size": function(attr) {
				return doc.documentElement[attr] ? doc.documentElement[attr] : doc.body[attr];
			},
			//包含margin
			"offset": function(attr) {
				return this[0]['offset' + TQuery.upper(attr)];
			},
			//==============属性=============
			//可编辑性,true>>>可编辑,false>>>不可编辑
			"modify":function(boolean){
				boolean = (typeof boolean !== "undefined") ? boolean : true;
				this.prop({
					"contentEditable":boolean,
					"readOnly":!boolean
				});
				return this;
			},
			//一个是特性
			"prop": function(prop, value) {
				if (arguments.length == 1) {
					//读取
					if (typeof prop == "string") {
						return this[0][prop];
					}
					//写,json格式
					else {
						for (var key in prop) {
							for( var j=0;j<this.length;j++ ){
								if( typeof this[j][key] !=="undefined" ){
									this[j][key] = prop[key];
								}
							}
						}
					}
				}
				else if (arguments.length == 2) {
					for (var i = 0; i < this.length; i++) {
						this[i][prop] = value;
					}
				}
				return this;
			},
			// .toggleProp('value',[1,2,3,4,5,6]) || .toggleProp('value')
			"toggleProp": function(prop, array) {
				var type = {
					"prop": TQuery.type(prop),
					"array": TQuery.type(array)
				};
				//1个值的toggle,增加/删除
				if (arguments.length <= 2 && (type.array !== "array" || type.array == "undefined")) {
					for (var i = 0; i < this.length; i++) {
						if (!this[i][prop]) { //不存在
							this[i][prop] = array;
						} else { //存在
							this[i][prop] = null;
						}
					}
				}
				//多个值得toggle
				else {
					var values = TQuery.toArray(arguments).slice(1)[0];
					var data = this.data('toggleProp');
					if (typeof data.count == "undefined") data.count = 0;
					if (typeof data.values == "undefined") data.values = values;
					this.data('toggleProp', data); //设置属性
					this.prop(prop, values[data.count++ % data.values.length]);
				}
				return this;
			},
			//一个是属性
			"attr": function(attr, value) {
				//2个参数，设置属性
				if (arguments.length == 2) {
					if (attr == "className") {
						attr = "class";
					}
					for (var k = 0; k < this.length; k++) {
						if (this[k][attr]) {
							this[k][attr] = value;
						} else {
							this[k].setAttribute(attr, value);
						}
					}
				}
				//1个参数
				else if (arguments.length == 1) { //1个参数
					//JSON，设置属性
					if (typeof(attr) == "object" && Object.prototype.toString.call(attr).toLowerCase() == "[object object]") { //如果是json，则分别设置属性
						for (var i = 0; i < this.length; i++) {
							for (var j in attr) {
								if (j == "className" || j == "class") {
									var classValue = attr[j];
									this[i].setAttribute("class", classValue);
									continue;
								}
								if (this[i][j]) { //如果属性是可以直接读取
									this[i][j] = attr[j];
								} else { //如果是自定义属性
									this[i].setAttribute(j, attr[j]);
								}
							}
						}
					}
					//读取
					else {
						return this[0][attr] || this[0].getAttribute(attr);
					}
				}
				return this;
			},
			// .toggleProp('data-set',[1,2,3,4,5,6]) || .toggleProp('data-set')
			"toggleAttr": function(attr, array) {
				var type = {
					"attr": TQuery.type(attr),
					"array": TQuery.type(array)
				};
				//1个值的toggle,增加和删除
				if (arguments.length <= 2 && (type.array !== "array" || type.array == "undefined")) {
					for (var i = 0; i < this.length; i++) {
						if (!this[i].getAttribute(attr)) { //不存在
							this[i].setAttribute(attr, array);
						} else { //存在
							this[i].removeAttribute(attr);
						}
					}
				}
				//同时设置多个值的toggle
				else {
					var values = TQuery.toArray(arguments).slice(1)[0];
					var data = this.data('toggleAttr'); //读取属性
					if (typeof data.count == "undefined") data.count = 0;
					if (typeof data.values == "undefined") data.values = values;
					this.data('toggleAttr', data); //设置属性
					this.attr(attr, values[data.count++ % data.values.length]);
				}
				return this;
			},
			"removeAttr": function(attr) {
				for (var i = 0; i < this.length; i++) {
					if (this[i][attr]) {
						delete this[i][attr];
					} else {
						this[i].removeAttribute(attr);
					}
				}
				return this;
			},
			"hasClass": function(obj, classValue) {
				return obj.classList.contains(classValue);
			},
			"addClass": function(classValue) {
				for (var i = 0; i < this.length; i++) {
					this[i].classList.add(classValue);
				}
				return this;
			},
			"removeClass": function(classValue) {
				for (var i = 0; i < this.length; i++) {
					this[i].classList.remove(classValue);
				}
				return this;
			},
			// .toggleProp('class1','class2','class3') || .toggleProp('class1')
			"toggleClass": function() {
				//单个ClassName开关
				if (arguments.length === 1) {
					for (var i = 0; i < this.length; i++) {
						this[i].classList.toggle( arguments[0] );
					}
				}
				//多个className切换
				else{
					var values = TQuery.toArray(arguments);
					var data = this.data('toggleAttr'); //读取属性
					if (typeof data.count == "undefined") data.count = 0;
					if (typeof data.values == "undefined") data.values = values;
					for (var j = 0; j < arguments.length; j++) {
						this.removeClass(arguments[j]);
					}
					this.data('toggleAttr', data); //设置属性
					this.addClass(values[data.count++ % data.values.length]);
				}
				return this;
			},
			// .data('info',{})
			"data": function(key,value) {
				var data = this[0].dataTQuery = this[0].dataTQuery || {};
				//读数据
				if (arguments.length == 1 && typeof data[key] !== "undefined") { 
					return data[key];
				}
				//存数据
				else {
					for (var i = 0; i < this.length; i++) {
						data = this[i].dataTQuery;
						data[key] = value;
					}
				}
				return data;
			},
			"removeData": function(key) {
				var data;
				for (var i = 0; i < this.length; i++) {
					data = this[i].dataTQuery;
					if (data[key]) {
						data[key] = null;
						delete data[key];
						this[i].dataTQuery = data;
					}
				}
			},
			//==============样式=============
			"css": function(attr, value) {
				var type = /^(width|left|top|bottom|right|line-height|font-size)+/ig;
				var type2 = /^(height|margin|padding)+/ig;
				var type3 = /\d+(px)/ig;
				var type4 = /\:/ig;
				//两个参数
				if (arguments.length == 2) {
					//设置
					value += "";
					if (type.test(attr) && value.indexOf('%') < 0) {
						value = parseFloat(value).toFixed(2) + 'px';
					}
					for (var m = 0; m < this.length; m++) {
						this[m].style[attr] = value;
					}
				}
				//一个参数
				else {
					//字符串格式
					if (typeof attr == "string") {
						//设置,background:#303030;font-size:20px;
						//设置样式
						if (type4.test(attr)) {
							for (var x = 0; x < this.length; x++) {
								this[x].style.cssText = attr;
							}
						}
						//读取样式
						else {
							return this[0].currentStyle ? this[0].currentStyle[attr] : getComputedStyle(this[0])[attr];
						}
					}
					//JSON格式
					else if (typeof(attr) == "object" && Object.prototype.toString.call(attr).toLowerCase() == "[object object]" && !attr.length) {
						var css = "",
							key,
							val;
						for (var i = 0; i < this.length; i++) {
							//JS写法
							// for(var k in attr){
							// 	//k == 属性名字,width,height,opacity等
							// 	//attr[k] == 属性值,300px,#303030等
							// 	if((type.test(k) || type2.test(k)) && attr[k].indexOf('%')<0 ){//如果没有%符号
							// 		attr[k] = parseFloat( attr[k] ).toFixed(2) + 'px';
							// 	}
							// 	this[i].style[k] = attr[k];
							// }
							//纯CSS写法
							for (key in attr) {
								//k == 属性名字,width,height,opacity等
								//attr[k] == 属性值,300px,#303030等
								val = attr[key] + "";
								if ((type.test(key) || type2.test(key)) && val.indexOf('%') < 0) { //如果是带像素的属性，并且没有%符号
									val = parseFloat(val).toFixed(2) + 'px';
								}
								css += key + ":" + val + ";";
							}
							this[i].style.cssText = css;
						}
					}
				}
				return this;
			},
			//参数：内容，{}(properties)
			"addStyle": function() {
				var contents,prop,textNode,styleSheet;
				for( var i=0;i<arguments.length;i++ ){
					var agm = arguments[i];
					//Style内容
					if( TQuery.isString(agm) ){
						contents = agm;
					}
					//Style属性
					else if( TQuery.isObject(agm) ){
						prop = agm;
					}
				}
				textNode = doc.createTextNode(contents);
				styleSheet = doc.createElement('style');
				styleSheet.type = "text/css";
				for( var attr in prop ){
					if( typeof styleSheet[attr] !=="undefined" ){
						styleSheet[attr] = prop[attr];
					}
				}
				styleSheet.appendChild(textNode);
				doc.head.appendChild(styleSheet);
				return this;
			},
			//参数：内容，{}(properties)
			"addScript":function(){
				var contents,url,prop,position,textNode,script;
				for( var i=0;i<arguments.length;i++ ){
					var agm = arguments[i];
					//内容
					if( TQuery.isString(agm) ){
						contents = agm;
					}
					//属性
					else if( TQuery.isObject(agm) ){
						prop = agm;
					}
					//position,true为头部，false为尾部
					else if( TQuery.isBoolean(agm) ){
						position = agm;
					}
				}
				contents = contents ? contents : "";
				textNode = doc.createTextNode(contents);
				script = doc.createElement('script');
				script.type = "text/javascript";
				for( var attr in prop ){
					if( !TQuery.isUndefined(script[attr]) ){
						script[ attr ] = prop[attr];
					}
				}
				script.appendChild(textNode);
				//插入头部
				if( position===true ){
					doc.head.appendChild(script);
				}
				//插入尾部
				else{
					doc.body.appendChild(script);
				}
				return this;
			},
			//参数：{}(properties)
			"addLink":function(){
				var link = doc.createElement('link');
				for( var attr in arguments[0] ){
					link[ attr ] = arguments[0][ attr ];
				}
				doc.head.appendChild( link );
				return this;
			},
			//==============动画=============
			//animate({},load,speed,callBack)
			"animate": function() {
				var properties,load,speed,callBack,this_ = this,fps = parseInt(1000/60);
				for( var o=0;o<arguments.length;o++ ){
					var agm = arguments[o];
					// properties
					if( TQuery.isObject( agm ) ){
						properties = agm;
					}
					// load
					else if( TQuery.isFunction( agm ) && o!==arguments.length-1 ){
						load = agm;
					}
					// speed
					else if( TQuery.isNumber( agm ) || ( TQuery.isString(agm) &&  agm>=0) ){
						speed = agm;
					}
					// callBack
					else if( TQuery.isFunction( agm ) && o==arguments.length-1 ){
						callBack = agm;
					}
				}
				for (var i = 0; i < this.length; i++) {
					var _this = this[i];
					clearInterval(_this.animate);
					_this.animate = setInterval(function() {
						var bStop = true,
							current,
							target;
							
						for (var attr in properties) {
							// 1. 取得当前的值(可以是width，height，opacity等的值)
							current = 0; //当前值
							target = 0; //目标值
							if (attr == 'opacity') {
								current = Math.round(parseFloat($(_this).style(attr)) * 100);
								target = parseFloat(properties[attr]) * 100;
							}
							else if( attr== 'scrollTop' ){
								current = parseInt( this_.scrollTop() );
								target = parseInt( properties[attr] );
							}
							else {

								current = parseInt($(_this).style(attr));
								target = parseFloat(properties[attr]);
							}
							// 2.计算运动速度
							var speedConfig = typeof(speed) != 'undefined' ? speed : 10;
							var iSpeed = (target - current) / speedConfig;
							iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
							// 3. 检测所有运动是否到达目标
							if ((iSpeed > 0 && current <= target) || (iSpeed < 0 && current >= target)) {
								bStop = false;
							}
							// 4. 开始运动
							if (attr == "opacity") {
								_this.style.filter = 'alpha(opacity=' + (current + iSpeed) + ')';
								_this.style.opacity = (current + iSpeed) / 100;
							}
							else if( attr == 'scrollTop' ){
								this_.scrollTo( target );
							}
							else {
								_this.style[attr] = current + iSpeed + 'px';
							}
							load && load.call(_this);
							// 4. 运动停止
							if (bStop) {
								clearInterval(_this.animate);
								callBack && callBack.call(_this);
							}
						}
					},fps);
				}
				return this;
			},
			//animateToggle({},{},{},{})
			"animateToggle":function(){
				var _arguments = arguments;
				var data = this.data('animateToggle'); //获取属性
				if (typeof data.count == "undefined") data.count = 0;
				if (typeof data.objLength == "undefined") data.objLength = _arguments.length;
				this.data('animateToggle', data); //设置属性
				for (var i = 0; i < this.length; i++) {
					this.animate( _arguments[data.count++ % data.objLength] );
				}
				return this;
			},
			"stop": function(delay) {
				var stardelay = delay ? delay : 0;
				setTimeout(function() {
					clearInterval($(this)[0].animate);
				}, stardelay);
				return this;
			},
			"show": function() {
				for (var i = 0; i < this.length; i++) {
					this[i].style.display = 'block';
				}
				return this;
			},
			"hide": function() {
				for (var i = 0; i < this.length; i++) {
					this[i].style.display = 'none';
				}
				return this;
			},
			"fadeToggle": function() {
				var _this = this;
				this.toggle(function() {
					_this.fadeOut();
				}, function() {
					_this.fadeIn();
				});
				return this;
			},
			"fadeIn": function(callBack) {
				var _this = this;
				this.css('display', 'block');
				this.animate({
					"opacity": 1
				},function(){
					if (callBack) callBack(this);
				});
			},
			"fadeOut": function(callBack) {
				var _this = this;
				this.animate({
					"opacity": 0
				},function(){
					_this.css('display', 'none');
					if (callBack) callBack(this);
				});
			},
			"fadeTo": function(target, callBack) {
				var _this = this;
				this.animate({
					"opacity": target
				}, function(){
						if (target <= 0) {
							_this.css('display', 'none');
						} else {
							_this.css('display', 'block');
						}
						if (callBack) callBack(this);
				});
			},
			"scale": function(times,callBack) {
				callBack = TQuery.isFunction(callBack) ? callBack : TQuery.noop;
				var prop = {},width,height,arr = [],
					eles = this.toArray();
				for( var i=0;i<eles.length;i++ ){
					var _this = $(eles[i]);
					width = _this.data('size').width || _this.width();
					height = _this.data('size').height || _this.height();
					_this.data("size",{"width":width,"height":height});
					_this.animate( {"width":width*times,"height":height*times},callBack );
				}
				return this;
			},
			//scaleToggle(2,3,1,0.5,callBack)
			"scaleToggle":function(){
				var agms = arguments,_arguments,callBack;
				//如果最后一位是function，则最为回掉
				if( TQuery.isFunction( agms[length-1] ) ) {
					callBack = agms[length-1];
					_arguments = TQuery.toArray(arguments).splice(0,arguments.length-1);
				}else{
					callBack = TQuery.noop;
					_arguments = TQuery.toArray(arguments);
				}
				var data = this.data('scaleToggle'); //获取属性
				if (typeof data.count == "undefined") data.count = 0;
				if (typeof data.agms == "undefined") data.agms = _arguments.length;
				this.data('scaleToggle', data); //设置属性
				this.scale( _arguments[data.count++ %data.agms] ,callBack);
				return this;
			},
			"toggle": function() {
				var _arguments = arguments;
				var data = this.data('toggle'); //获取属性
				if (typeof data.count == "undefined") data.count = 0;
				if (typeof data.fns == "undefined") data.fns = _arguments.length;
				this.data('toggle', data); //设置属性
				for (var i = 0; i < this.length; i++) {
					_arguments[data.count++ % data.fns].call(this[i]);
				}
				return this;
			},
			"slideToggle": function() {
				var _this = this;
				this.toggle(function() {
					$(this).slideUp();
				}, function() {
					$(this).slideDown();
				});
				return this;
			},
			"slideRight": function(callBack) {
				var width = this.data('size').width;
				this.show().animate({
					"width": width
				}, function(){
					if (callBack) callBack.call(this);
				});
				return this;
			},
			"slideLeft": function(callBack) {
				var size = this.data('size');
				if (typeof size.width == "undefined") {
					this.data('size').width = this.width();
				}
				var _this = this;
				this.animate({
					"width": 0
				},function(){
					_this.hide();
					if (callBack) callBack.call(this);
				});
				return this;
			},
			"slideDown": function(callBack) {
				var height = this.data('size').height;
				this.show().animate({
					"height": height
				}, function(){
					if (callBack) callBack.call(this);
				});
				return this;
			},
			"slideUp": function(callBack) {
				var size = this.data('size');
				if (typeof size.height == "undefined") {
					this.data('size').height = this.height();
				}
				var _this = this;
				this.animate({
					"height": 0
				}, function(){
					_this.hide();
					if (callBack) callBack.call(this);
				});
				return this;
			},
			"scrollTo": function(target, callBack) {
				//传入DOM节点
				if ( TQuery.isDOM(target) ) {
					target = parseInt($(target).offset('top'));
				}
				//传入选择符,字符串
				else if ( typeof target == "string" ) {
					//字符串数字
					if (target > 0) {
						target = parseInt(target);
					} else {
						target = $(target).offset('top');
					}
				}
				//传入TQuery对象
				else if (typeof target.TQuery !== "undefined") {
					target = target.offset('top');
				}
				var _this = this,
					nowScrollTop, dif, speed, position,
					pageHeight = $(doc).height() - $(doc).viewHeight();
				target = target < 0 ? 0 : (target < pageHeight ? target : pageHeight); //超出范围
				clearInterval(doc.timerScroll);
				doc.timerScroll = setInterval(function() {
					nowScrollTop = doc.body.scrollTop || doc.documentElement.scrollTop;
					dif = Math.abs(nowScrollTop - target); //差值
					speed = nowScrollTop - target < 0 ? (dif / 10) + 1 : -((dif / 10) + 1);
					position = nowScrollTop + (speed);
					if ((speed > 0 && position >= target) || (speed < 0 && position <= target)) {
						doc.body.scrollTop = doc.documentElement.scrollTop = target;
						clearInterval(doc.timerScroll);
						if (callBack) callBack.call(_this[0]);
					} else {
						doc.body.scrollTop = doc.documentElement.scrollTop = position;
					}
				}, parseInt(1000 / 60));
				return this;
			},
			"scrollToggle": function() {
				var data = this.data('toggleClick'); //获取属性
				if (typeof data.count == "undefined") data.count = 0;
				if (typeof data.targets == "undefined") data.targets = arguments;
				this.data('toggleClick', data); //设置属性
				this.scrollTo(data.targets[data.count++ % arguments.length]);
				return this;
			},
			//==============DOM=============
			"replace":function(DOMNode){
				//传入DOM节点
				if( TQuery.isDOM( DOMNode ) ){
					DOMNode = DOMNode;
				}
				//传入DOM字符串
				else{

				}
				//替换
				for( var i=0;i<this.length;i++ ){
					doc.body.replaceChild(DOMNode,this[i]);//DOMNode替换掉this[i]
				}
				return this;
			},
			"replaceAll":function(){
				
			},
			"replaceWidth":function(){
				
			},
			"clone": function(deep) {
				var newElements = [],
					cloneNode;
				for (var i = 0; i < this.length; i++) {
					cloneNode = this[i].cloneNode(true); //带子节点
					if (deep && deep === true) { //深度克隆，带事件

					}
				}
				return this;
			},
			"append": function(content) {

			},
			"appendChild": function(content) {

			},
			"prepend": function(prepend) {

			},
			"prependChild": function() {

			},
			//插入到DOMNode之后
			"after": function(DOMNode) {
				var parent,
					oFragment = doc.createDocumentFragment(); //创建文档碎片;
				for (var i = 0; i < this.length; i++) {
					oFragment.appendChild(this[i]);
				}
				parent = DOMNode.parentNode; //插入位置的父元素
				if (parent.lastChild == DOMNode) { //如果最后的节点是目标节点，直接添加
					parent.appendChild(oFragment);
				} else { //如果不是，则插入在目标元素的下一个兄弟节点的前面，也就是目标元素的后面
					parent.insertBefore(oFragment, DOMNode.nextSibling);
				}
				return this;
			},
			//插入到DOMNode之前
			"before": function(DOMNode) {
				var oFragment = doc.createDocumentFragment(); //创建文档碎片
				for (var i = 0; i < this.length; i++) {
					oFragment.appendChild(this[i]);
				}
				DOMNode.parentNode.insertBefore(oFragment, DOMNode);
				return this;
			},
			"remove": function() {
				for (var i = 0; i < this.length; i++) {
					this[i].remove();
				}
				return this;
			},
			"empty": function() {
				this.text(' ');
				this.html(' ');
				return this;
			},
			"html": function(setting) {
				if (setting) {
					for (var i = 0; i < this.length; i++) {
						this[i].innerHTML = setting;
					}
					return this;
				} else {
					return this[0].innerHTML;
				}
			},
			"text": function(setting) {
				if (setting) {
					for (var i = 0; i < this.length; i++) {
						this[i].innerText = this[i].textContent = setting;
					}
					return this;
				} else {
					return this[0].innerText || this[0].textContent;
				}
			},
			//带标签,注释
			"contents":function(setting){
				if (setting) {
					for (var i = 0; i < this.length; i++) {
						this[i].outerText = this[i].outerHTML = setting;
					}
					return this;
				} else {
					return this[0].outerText || this[0].outerHTML;
				}
			},
			"val": function(setting) {
				if (setting) {
					this.prop("value",setting);
					return this;
				} else {
					return this[0].value;
				}
			},
			//==============其他=============
			"proxy": function(fn, _this) {
				fn.call(_this);
				return this;
			},
			"delay": function(fn, time) {
				var _this = this;
				setTimeout(function() {
					fn.call(_this);
				}, time);
				return this;
			},
			"do": function(fn) {
				fn.call(this);
				return this;
			},
			//==============转换=============
			"get": function(n) {
				n = n || 0;
				return this[n];
			},
			"toArray": function() {
				var temp = [];
				for (var i in this) {
					if (i >= 0) temp.push(this[i]);
				}
				return this.init.elements ? this.init.elements : temp;
			},
			"index": function(n) {
				var _this = this,
					index = 0,
					brothers = _this[0].parentNode.children;
				for (var i = 0; i < brothers.length; i++) { //遍历
					if (brothers[i] == this[0]) { //如果匹配到
						index = i;
						break;
					}
				}
				return index;
			}
		};
		TQuery.fn.init.prototype = TQuery.fn;
		//==============工具集=============
		//****检查类型****
		TQuery.type = function(obj) {
			var string = Object.prototype.toString.call(obj);
			return string.split(" ")[1].replace(/\]|\[/img, "").toString().toLowerCase();
		};
		TQuery.isNumber = function(obj) {
			if (typeof obj == "number" && !isNaN(obj)) {
				return true;
			} else {
				return false;
			}
		};
		TQuery.isString = function(obj) {
			if (typeof obj == "string" || obj instanceof String) {
				return true;
			} else {
				return false;
			}
		};
		TQuery.isFunction = function(obj) {
			if (typeof obj == "function" && obj instanceof Function && Object.prototype.toString.call(obj) === '[object Function]') {
				return true;
			} else {
				return false;
			}
		};
		TQuery.isArray = function(obj) {
			return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
		};
		TQuery.isObject = function(obj) {
			return Object.prototype.toString.call(obj) === '[object Object]';
		};
		TQuery.isDOM = function(obj) {
			//IE8下，一切皆为object
			return /html|document|element|object/img.test(Object.prototype.toString.call(obj).split(" ")[1]) && typeof obj.parentNode !=="undefined";
		};
		TQuery.isBoolean = function(obj){
			return (obj===true || obj===false) ? true : Object.prototype.toString.call(obj)==='[object Boolean]';
		};
		TQuery.isWindow = function(obj) {
			return (obj == obj.obj && typeof obj == "object") ? true : false;
		};
		TQuery.isUndefined = function(obj) {
			return Object.prototype.toString.call(obj) === '[object Undefined]';
		};
		//创新一个新的TQuery副本,可以自行修改方法，属性，而不影响原有的。
		TQuery.sub = function(selectors){
			//构造函数
			var newTQuery = function(selectors){
				return newTQuery.fn.init(selectors);
			};			
			for( var prop in $ ){
				newTQuery[prop] = $[prop];
			}
			var prototype = {};
			for( var attr in $.prototype ){
				prototype[attr] = $.prototype[attr];
			}
			newTQuery.fn = newTQuery.prototype = prototype;
			newTQuery.fn.init.prototype = newTQuery.fn;
			return newTQuery;
		};
		//****AJAX****
		TQuery.ajax = function(options) {
			var oAjax,
				data = options.data ? options.data : "", //头部信息。必须是数组[key,value]
				context = options.context ? options.context : win, //执行上下文，this
				type = options.type ? options.type : 'GET', //请求方式
				async = options.async ? options.async : true; //默认异步加载
			if (win.XMLHttpRequest) { //IE7+，chrome，firefox，opara，safari
				oAjax = new XMLHttpRequest();
			} else {
				oAjax = new ActiveXObject("Microsoft.XMLHTTP"); //IE5，IE6
			}

			if (options.beforeSend) options.beforeSend.call(context); //发送之前

			oAjax.setRequestHeader(data[0], data[1]); //设置头部信息
			oAjax.open(options.type, options.url, async);
			oAjax.send();
			oAjax.onreadystatechange = function() {
				if (oAjax.readyState == 4) {
					if (options.complete) options.complete.call(context, oAjax.status); //读取完成
					if (oAjax.status == 200) {
						if (options.success) options.success.call(context, oAjax.responseText); //读取成功
					} else {
						if (options.fail) options.fail.call(context, oAjax.status); //读取失败
					}
				}
			};
		};
		//****对象操作****
		//去重复
		TQuery.unique = function(obj) {
			var V = {
				"hash": {},
				"arr": [],
				"length": obj.length
			};
			for (var i = 0; i < V.length; i++) {
				if (typeof V.hash[obj[i]] == "undefined") {
					V.hash[obj[i]] = 1;
					V.arr.push(obj[i]);
				}
			}
			return V.arr;
		};

		//空函数，同jquery
		TQuery.noop = function() {
			return;
		};

		//去掉首尾空格，同jquery
		TQuery.trim = function(str) {
			var newStr = str.replace(/^\s*(\S*)\s*$/img, "$1");
			return newStr;
		};

		//返回当前时间，同jquery
		TQuery.now = function() {
			return (new Date()).getTime();
		};
		//刷新页面，同jquery
		TQuery.reload = function() {
			win.location.reload(true);
		};
		//将类数组转成数组
		TQuery.toArray = function(iArray) {
			var temp = [];
			for (var i = 0; i < iArray.length; i++) {
				temp.push(iArray[i]);
			}
			return temp;
		};
		//单词首字母大写
		TQuery.upper = function(str) {
			var reg = /\b(\w)|\s(\w)/g;
			str = str.toLowerCase();
			return str.replace(reg, function(m) {
				return m.toUpperCase();
			});
		};
		//打乱数组，同jquery
		TQuery.shuffleArray = function(arr) {
			var V = {
				"temp": [],
				"length": arr.length
			};
			for (var i = 0; i < V.length; i++) {
				V.temp.push(arr[i]);
			}
			V.temp.sort(function() {
				return Math.random() - 0.5;
			});
			return V.temp;
		};

		//获取对象的长度
		TQuery.sizeof = function(obj) {
			var V = {
				"temp": [],
				"length": 0
			};
			for (var attr in obj) {
				V.length++;
			}
			return V.length;
		};
		//获取浏览器信息
		var ua = navigator.userAgent;
		TQuery.browser = function() {
			var name = null;
			var vision = null;
			var content = null;
			//IE
			if( /msie|Trident/img.test(ua) ){
				name = "ie";
				content = ua.match( /MSIE\s\d+\.\d/img );
				if( content===null || typeof content === "undefined" ){
					vision = 11;//IE11
				}else{
					vision = content[0].split(" ")[1];
				}
			}
			//webkit
			else if(/webkit/img.test(ua)){
				name = "chrome";
				content = ua.match( /Chrome\/[\d\.]+/img );
				vision = content[0].split("/")[1];
			}
			//moz
			else if(/firefox/img.test(ua)){
				name = "firefox";
				content = ua.match( /Firefox\/[\d\.]+/img );
				vision = content[0].split("/")[1];
			}
			//opera
			else if(/opera|Presto/img.test(ua)){
				name = "opera";
				content = ua.match( /Opera\/[\d\.]+/img );
				vision = content[0].split("/")[1];
			}
			return {
				"name":name,
				"vision":vision
			};
		};
		TQuery.browser.webkit = function() {
			var content = ua.match( /Chrome\/[\d\.]+/img );
			if( /webkit/img.test(ua)===false ){
				return false;//不是webkit
			}else{
				if( content===null && typeof content =="undefined" ){
					return true;
				}
				return content[0].split("/")[1];//返回版本号
			}
		};
		TQuery.browser.msie = function() {
			var content = ua.match( /MSIE\s\d+\.\d/img );
			if( !/msie|Trident/img.test(ua) ){
				return false;//不是IE
			}else{
				if( content===null || typeof content === "undefined" ){
					return 11;//IE11
				}else{
					TQuery.browser.vision = content[0].split(" ")[1];
					return content[0].split(" ")[1];//IE11以下版本号

				}
			}
		};
		TQuery.browser.moz = function() {
			var content = ua.match( /Firefox\/[\d\.]+/img );
			if( !/firefox/img.test(ua) ){
				return false;//不是moz
			}else{
				if( content===null && typeof content =="undefined" ){
					return true;
				}
				return content[0].split("/")[1];//返回版本号
			}
		};
		TQuery.browser.opera = function() {
			var content = ua.match( /Opera\/[\d\.]+/img );
			if( !/Opera/img.test(ua) ){
				return false;//不是opera
			}else{
				if( content===null && typeof content =="undefined" ){
					return true;
				}
				return content[0].split("/")[1];//返回版本号
			}
		};
		//合并对象
		TQuery.merge = function() {
			//合并json
			if (TQuery.type.isObject(arguments[0])) {
				var object = new Object({});
				for (var i = 0; i < arguments.length; i++) {
					for (var key in arguments[i]) {
						if (typeof object[key] == "undefined") { //默认不覆盖
							object[key] = arguments[i][key];
						}
					}
				}
				return object;
			}
			//合并数组
			else if (TQuery.type.isArray(arguments[0])) {
				var newArray = [];
				for (var k = 0; k < arguments.length; k++) {
					newArray = newArray.concat(arguments[k]);
				}
				return newArray;
			}
		};

		//遍历对象
		TQuery.map = function(obj, fn) {
			var temps = [],
				returnValue;
			if (this.type.isArray(obj)) {

				for (var i = 0; i < obj.length; i++) {
					returnValue = fn.call(obj, obj[i], i);
					if (returnValue && returnValue !== "undefined" || returnValue !== null) {
						temps.push(returnValue);
					}
				}
			} else if (this.type.isObject(obj)) {
				for (var key in obj) {
					returnValue = fn.call(obj, key, obj[key]);
					if (returnValue && returnValue !== "undefined" || returnValue !== null) {
						temps.push(returnValue);
					}
				}
			}
			return temps;
		};
		//转换JSON
		TQuery.parseJSON = function(str, compatibility) {
			return (compatibility && compatibility === true) ? (new Function("return " + str))() : JSON.parse(str);
		};
		//插件入口
		TQuery.extend = TQuery.fn.extend = function(object) {
			for( var name in object ){
				if( TQuery.isUndefined(TQuery.prototype[name]) ){
					TQuery.fn[name] = TQuery.prototype[name] = object[name];
				}
			}
			return this;
		};

		return TQuery;
	})();


	//公共函数
	function addEvent(obj, type, fn) {
		var ev = null;
		return obj.addEventListener ?
			obj.addEventListener(type, function(e) {
				ev = win.event ? win.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if (fn.call(obj, ev) === false) {
					return stop.call(ev);
				}
			}, false) :
			obj.attachEvent('on' + type, function(e) {
				ev = win.event ? win.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				ev.preventDefault = function(){
					if (typeof this.preventDefault !== "undefined") this.preventDefault(); //w3c标准
					if (typeof this.returnValue !== "undefined") this.returnValue = false; //阻止默认事件，针对老版本IE
				};
				if (fn.call(obj, ev) === false) {
					return stop.call(ev);
				}
			});
	}
	//禁止冒泡和默认事件。
	function stop() {
		if (typeof this.stopPropagation !== "undefined") this.stopPropagation(); //阻止冒泡，w3c标准
		if (typeof this.cancelBubble !== "undefined") this.cancelBubble = true; //阻止冒泡,ie,firefox
		if (typeof this.preventDefault !== "undefined") this.preventDefault(); //w3c标准
		if (typeof this.returnValue !== "undefined") this.returnValue = false; //阻止默认事件，针对老版本IE
		return false;
	}

	win.TQuery = win.$ = $;
})(window, document, undefined);