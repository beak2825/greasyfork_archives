// ==UserScript==
// @name         快捷展开微博&查看微博视频
// @namespace    https://greasyfork.org/zh-CN/users/1073-hzhbest
// @version      1.2
// @description  快捷展开微博全文，轻松查看微博视频
// @author       hzhbest
// @match        https://weibo.com/*
// @match        https://s.weibo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461376/%E5%BF%AB%E6%8D%B7%E5%B1%95%E5%BC%80%E5%BE%AE%E5%8D%9A%E6%9F%A5%E7%9C%8B%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/461376/%E5%BF%AB%E6%8D%B7%E5%B1%95%E5%BC%80%E5%BE%AE%E5%8D%9A%E6%9F%A5%E7%9C%8B%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var pinned, cursize, videotimeout, popuptimeout, mvouttimeout;

	// 设置选项 ===
	pinned = false;		// 默认钉住视频窗口？true：是，false：不钉住
	cursize = 1;		// 默认视频窗口大小？1：大，2：中，3：小
	popuptimeout = 0.5;	// 鼠标悬停弹出视频延时（秒）
	mvouttimeout = 1;	// 鼠标移出视频窗口关闭延时（秒）；钉住时不关闭
	videotimeout = 3;	// 视频播放完后自动关闭延时（秒）；钉住时不关闭
	// 设置选项 ||=

	const waitimg = "data:image/mp4;base64,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PTEuNDAgYXE9MToxLjAwAIAAAAM2ZYiEDvJigADu/JycnJycnJycnJycnJycnJycnJycnJycnJycnJydddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddRNddddddddddddddddddddddddddddf//zghBdABrAACAEurKAAIC+gAq+gWZAh7ht4cRm+/52/CsBYReIpLVOT+q7B+Y63K/EQ4iWFMDwAMxhZKUG0cTAFuMAAOAAwCj6YoJ666666666666666666666666666+at//DwJgAPvAAOt3EAsRtCQADg+Xl4VZAjSqmIgV08IpcIylf15CTEIxkmYiTRh//h4F66aT9fXXXXXXXXXXXXXXXXXXXXXXXXXXXXfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXgAAAADUGaOB3gHRwjviIBs4AAAAAPQZpUB3gHR4nfxEOv+AZaAAAAEEGaYDvAOjwjv4iHXxHAMtAA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";
	let bbox = creaElemIn('div', document.body);
	bbox.id = "__wb_fbox";
	let tb = creaElemIn('div', bbox);
	tb.className = "__title"
	let tbox = creaElemIn('div', tb);
	tbox.className = "__move"
	tbox.innerHTML = "░░░░░░░";
	let sizebtn = creaElemIn('div', tb);
	sizebtn.innerHTML = "S";
	sizebtn.title = "切换视频大小";
	sizebtn.className = "__btn";
	let pinbtn = creaElemIn('div', tb);
	pinbtn.innerHTML = "T";
	pinbtn.title = "切换小窗保持不关状态";
	pinbtn.className = "__btn";
	let closebtn = creaElemIn('div', tb);
	closebtn.innerHTML = "X";
	closebtn.title = "关闭小窗";
	closebtn.className = "__btn";

	let fbox = creaElemIn('video', bbox);
    fbox.src = waitimg;
	fbox.controls = true;
	fbox.autoplay = true;
	endrag(bbox, { x: 'right', y: 'top' }, tbox);
	var exptime, bboxtime, ctltime, clstime;
	var curelem;
	var firstopen, vsrc, mt = "";
	let css = `
		#__wb_fbox {
			position:fixed;
			z-index:10000;
			display: none;
			box-shadow: 0 0 10px 2px #777d;
			background: black;
		}
		#__wb_fbox>video{
			max-height: 600px;
			max-width: 800px;
			resize: both;
		}
		#__wb_fbox.size2>video{
			max-height: 400px;
			max-width: 533px;
		}
		#__wb_fbox.size3>video {
			max-height: 300px;
			max-width: 400px;
		}
		#__wb_fbox .__title {
			width: 100%;
			height: 18px;
			display: flex;
		}
		#__wb_fbox .__move {
			flex: auto;
			color: #6f6f6f;
			cursor: move;
			display: inline-block;
			font-size: 14px;
			line-height: 19px;
			height: 17px;
		}
		#__wb_fbox .__btn {
			margin: auto 3px auto 0;
			border: 1px solid #ae7108;
			color: #ae7108;
			font-size: 12px;
			vertical-align: middle;
			text-align: center;
			display: inline-block;
			width: 17px;
			height: 17px;
			cursor: default;
		}
		#__wb_fbox.size2 .__btn.s {
			background: #575516;
		}
		#__wb_fbox.size3 .__btn.s {
			background: #716e1b;
		}
		#__wb_fbox .__btn.p {
			background: #1b711b;
		}
		#__wb_fbox .__btn:hover {
			border-color: #f39e0b;
			color: #f39e0b;
		}
	`;
	fbox.addEventListener('loadeddata', () => {
		fbox.play();
		ctltime = setTimeout(() => {
			fbox.controls = false;
		}, 1000);
	}, false);
	fbox.addEventListener('play', () => {
		firstopen = false;
	}, false);
	fbox.addEventListener('ended', () => {
		clstime = setTimeout(() => {
			if (!pinned) reset();
		}, videotimeout * 1000);
	}, false);
	bbox.addEventListener('mouseleave', ()=>{
		if (pinned) {
			return;
		}
		bboxtime = setTimeout(() => {
			reset();
		}, mvouttimeout * 1000);
	}, false);
	bbox.addEventListener('mouseover', () => {
		clearTimeout(bboxtime);
		if (firstopen) fbox.play();
	}, false);
	bbox.addEventListener('mouseup', () => {
		clearTimeout(bboxtime);
	}, false);
	bbox.addEventListener('mousemove', () => {
		clearTimeout(ctltime);
		clearTimeout(clstime);
		fbox.controls = true;
		ctltime = setTimeout(() => {
			fbox.controls = false;
		}, 1000);
	}, false);
	closebtn.addEventListener('click', reset, false);
	pinbtn.addEventListener('click', switchpin, false);
	sizebtn.addEventListener('click', switchsize, false);
	document.body.addEventListener('mouseover', texpand, false);
	addCSS(css);

	function texpand(event){
		let tnode = event.target;
		if (tnode !== curelem) {
			clearTimeout(exptime);
		}
        //console.log('tnode: ', tnode, 'tnode.src: ', tnode.src);
        if (!tnode.className) {
            return;
        }
		let btnexpand;
		if (tnode.nodeName == 'DIV' && tnode.className.indexOf('detail_wbtext_') == 0) {
			btnexpand = tnode.querySelector('span.expand');
		} else if (tnode.nodeName == 'P' && tnode.className == 'txt') {
			btnexpand = tnode.querySelector('a[action-type="fl_unfold"]');
		} else if (true || !/weibo\.com\/\d{10}\/[a-z0-9A-Z]{9}\??/.test(location.href)) {
			var tvnode = getVideoBox(tnode, event);
			//console.log('tvnode159: ', tvnode);
			if (!!tvnode) {
				exptime = setTimeout(() => {
					expandvideo(tvnode, event);
				}, popuptimeout * 1000);
				//console.log("167:", exptime, tvnode);
			} else {
				//console.log("181c:", exptime);
				clearTimeout(exptime);
			}
		}
        if (!!btnexpand) {
            btnexpand.click();
		}
		curelem = tnode;
	}

	function reset() {
		bbox.style.display = "none";
		fbox.src = waitimg;
		firstopen = true;
		vsrc = "";
		pinned = false;
		pinbtn.classList.remove("p");
	}

	function getVideoBox(elem, event) {
		var velem, telem;
		if (!!elem) {
			if (elem.nodeName == 'VIDEO') {
				velem = elem;
			} else {
				telem = elem.parentNode.querySelector('video');
				if (!!telem && isCursorInElem(telem, event)) {
					velem = telem;
				}
			}
			if (!!velem && velem.parentNode.nodename !== 'a' && velem.parentNode.id !== "__wb_fbox") {
				return velem;
			}
		}
		return false;
	}

	function expandvideo(vnode, event) {
		//快捷展开动图
		if (vsrc == vnode.src) {
			return;
		}
		clearTimeout(clstime);
		fbox.src = vnode.src;
		vsrc = fbox.src;
		fbox.controls = true;
		bbox.style.display = "block";
		// let mx = event.screenX, my = event.screenY;
		// mx -= 50;
		// my = 10; //Math.min(my - 50, window.innerHeight - fbox.offsetHeight - 50);console.log('fboxh2: ', fbox.offsetHeight);
		bbox.style.top = 40 + "px";
		bbox.style.right = 50 + "px";

		vnode.addEventListener('mouseleave', (event) => {
			//console.log("222c:", exptime);
			clearTimeout(exptime);
		}, false);
	}

	function switchpin() {
		pinned = !pinned;
		pinbtn.classList.toggle("p");
	}

	function switchsize() {
		switch (cursize) {
			case 1:
				cursize = 2;
				bbox.className = "size2";
				sizebtn.classList.add("s");
				break;
			case 2:
				cursize = 3;
				bbox.className = "size3";
				break;
			case 3:
				cursize = 1;
				bbox.className = "";
				sizebtn.classList.remove("s");
				break;
		}
	}

	function creaElemIn(tagname, destin) {	//在 destin 内末尾创建元素 tagname
		let theElem = destin.appendChild(document.createElement(tagname));
		return theElem;
    }

    function addCSS(css, cssid) {
        let stylenode = creaElemIn('style',document.getElementsByTagName('head')[0]);
        stylenode.textContent = css;
        stylenode.type = 'text/css';
        stylenode.id = cssid || '';
	}

	function isCursorInElem(elem, event) {
		var x = Number(event.clientX) // 鼠标相对屏幕横坐标
		var y = Number(event.clientY) // 鼠标相对屏幕纵坐标

		var elemLeft = Number(elem.getBoundingClientRect().left) // obj相对屏幕的横坐标
		var elemRight = Number(
			elem.getBoundingClientRect().left + elem.clientWidth
		) // obj相对屏幕的横坐标+width

		var elemTop = Number(elem.getBoundingClientRect().top) // obj相对屏幕的纵坐标
		var elemBottom= Number(
			elem.getBoundingClientRect().top + elem.clientHeight
		) // obj相对屏幕的纵坐标+height

		return (x > elemLeft && x < elemRight && y > elemTop && y < elemBottom);
	}

	// 对target拖动handle时，实现拖动的功能
	// 输入：目标元素target，拖动位置参考系opt，拖动手柄handle
	// 输入opt：形如【{x:'right',y:'bottom'}】
	function endrag(target, opt, handle) {
		var p_x, p_y, isDragging;
		endrag = function(target, opt, handle){
			return new endrag.proto(target, opt||{}, handle);
		}
		endrag.proto = function (target, opt, handle) {
			var self = this;
			this.target = target;
			this.style = target.style;
			this.handle = handle;
			var _x = opt.x !== 'right';
			var _y = opt.y !== 'bottom';
			this.x = _x ? 'left' : 'right';
			this.y = _y ? 'top' : 'bottom';
				p_x = this.x;
				p_y = this.y;
			this.xd = _x ? -1 : 1;
			this.yd = _y ? -1 : 1;
			this.computed_style = document.defaultView.getComputedStyle(target, '');
			this.drag_begin = function(e){self.__drag_begin(e);};
			this.handle.addEventListener('mousedown', this.drag_begin, false); //only drag on handler
			this.dragging = function(e){self.__dragging(e);};
			document.addEventListener('mousemove', this.dragging, false);
			this.drag_end = function(e){self.__drag_end(e);};
			document.addEventListener('mouseup', this.drag_end, false);
		};
		endrag.proto.prototype = {
			__drag_begin:function(e){
				if (e.button == 0) {
				var _c = this.computed_style;
				this.isDragging = isDragging = true;
				this.position = {
					_x:parseFloat(_c[this.x]),
					_y:parseFloat(_c[this.y]),
					x:e.pageX,
					y:e.pageY
				};
				e.preventDefault();
				}
			},
			__dragging:function(e){
				if (!this.isDragging) return;
				var x = Math.floor(e.pageX), y = Math.floor(e.pageY), p = this.position;
				// prevent moving out of window
				var x_border = window.innerWidth - 40, y_border = window.innerHeight - 20;
				if (x - window.pageXOffset > x_border) x = window.pageXOffset + x_border;
				if (y - window.pageYOffset > y_border) y = window.pageYOffset + y_border;
				p._x = p._x + (p.x - x) * this.xd;
				p._y = p._y + (p.y - y) * this.yd;
				this.style[this.x] = p._x + 'px';
				this.style[this.y] = p._y + 'px';
				p.x = x;
				p.y = y;
			},
			__drag_end:function(e){
				if (e.button == 0) {
				if (this.isDragging) {
					this.isDragging = isDragging = false;
				}
				}
			},
			hook:function(method,func){
				if (typeof this[method] === 'function') {
					var o = this[method];
					this[method] = function(){
						if (func.apply(this,arguments) === false) {
							return;
						}
						o.apply(this,arguments);
					};
				}
			}
		};
		return endrag(target, opt, handle);
	}

})();