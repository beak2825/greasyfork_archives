// ==UserScript==
// @name         crm finder
// @name:zh-CN   CRM查找器
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  查找 CRM 指定的元素，闪烁展示
// @description:zh-cn  查找 CRM 指定的元素，闪烁展示
// @author       penglongjia@gmail.com
// @include      http*://crm3.sc.ctc.com*/*
// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @require      https://libs.baidu.com/jqueryui/1.10.4/jquery-ui.min.js
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397364/crm%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/397364/crm%20finder.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//$("[type='button'][class='btn btn-primary btn-sm okbutt']")

	var GLOBAL_ELEMENTS = [];  // 改一下，存 json 对象
	var GLOBAL_PARENTS = [];
	var GLOBAL_CLICK_NUM = 0; // 放大点了多少次

	var zNode = document.createElement('div');
	var doc_title = document.title;
	if(doc_title.indexOf('登录') != -1 || doc_title.indexOf('门户') != -1) {
		return;
	}
	//	zNode.innerHTML = '<button id="myButton" type="button">' +
	//		'For Pete\'s sake, don\'t click me!</button>';
	zNode.innerHTML = '<div id="digTitle">[' + doc_title + '] 拖这里</div><div><input id="myInput" type="text"></input><div><div class="myBetween"><button id="myButton" type="button">一件复原</button><button id="mySearchButton" type="button">搜寻（回车）</button></div><div>没有闪烁？可能被隐藏，试着放大找父级 <button id="myZoomIn">+</button></div>';
	zNode.setAttribute('id', 'myContainer');
	//	zNode.setAttribute('class', 'myContainer');
	document.body.appendChild(zNode);

	//$('#myContainer').draggable({ scroll: true, scrollSensitivity: 100 });

	document.getElementById("myInput").addEventListener(
		"keyup", inputClickAction, false
	);

	document.getElementById("myButton").addEventListener(
		"click", buttonClickAction, false
	);

	document.getElementById("myZoomIn").addEventListener(
		"click", zoomInClickAction, false
	);

	document.getElementById("mySearchButton").addEventListener(
		"click", searchButtonAction, false
	);

	function searchButtonAction(e) {
		var vector = document.getElementById('myInput').value; // 从哪里来的
		try {
			searchByAttrs(vector);
		} catch(e) {
			warn_prompt('没找着', 3000);
		}
	}

	function zoomInClickAction(e) {
		$(GLOBAL_ELEMENTS).each(function(index, item) { // Now the item means Map<Element,Display>
//			$(item).removeClass("headerBox"); // 先清除本身
//			$(item.parentElement).addClass("headerBox");
//			GLOBAL_ELEMENTS[index] = item.parentElement; // 用父类替代

			var disp = item.display;
			var ele = item.elementObj;
			$(ele).removeClass("headerBox");  // cancel flash
			if(disp == 'none'){
				$(ele).css("display",disp); // 还原 none 的 display
			}

			var parentObj = ele.parentElement; // 用父类替代
			var parentDisp = $(parentObj).css("display");

			$(parentObj).addClass("headerBox"); // 在父类上加效果

			if(parentDisp == 'none'){ // Parent if none then display it
				$(parentObj).css("display","block");
			}

			var ele_disp_map = {  // A map which store element and it's display attributes
				"elementObj" : parentObj,
				"display" : parentDisp
			}

			GLOBAL_ELEMENTS[index] = ele_disp_map;

		});

		GLOBAL_CLICK_NUM++;

		warn_prompt('放大了 '+GLOBAL_CLICK_NUM+' 次',8000);

	}

	function zoomOutClickAction(e) {}

	/**
	 * 一键清除
	 * @param {Object} e
	 */
	function buttonClickAction(e) {

		GLOBAL_ELEMENTS.forEach(function(item, index) { // Now the item means Map<Element,Display>
			// $(item).removeClass("headerBox");
			var disp = item.display;
			var ele = item.elementObj;
			$(ele).removeClass("headerBox");  // cancel flash
			if(disp == 'none'){
				$(ele).css("display",disp); // 还原 none 的 display
			}
		});

		GLOBAL_ELEMENTS = []; // clear
		GLOBAL_CLICK_NUM = 0; // zero
	}

	function inputClickAction(e) {
		var event = e || window.event;
		var key = event.which || event.keyCode || event.charCode;
		if(key == 13) {
			//alert('回车');
			// searchDebug();
			var vector = document.getElementById('myInput').value; // 从哪里来的
			try {
				searchByAttrs(vector);
			} catch(e) {
				warn_prompt('没找着', 3000);
			}

		}
	}

	function searchDebug() {
		debugger;
	}

	/**
	 * 用 all attributes 来查找，注意，返回的是一个数组
	 */
	function searchByAttrs(vector) {
		var attrs = getAttributes(vector);
		var searchKey = "";
		for(var i = 0; i < attrs.length; i++) {
			if(attrs[i] != '') {
				var kv = attrs[i].split('='); // k=v
				searchKey = searchKey + '[' + kv[0] + '=\'' + kv[1] + '\']';
			}
		}
		console.log(searchKey);
		var objs = $(searchKey);
		var foundNums = objs.length;
		success_prompt('一共找到: ' + foundNums + ' 个元素', 3000);
		objs.each(function(index, ele) {
			var disp_option = $(ele).css('display'); // Notice that option 'block' is a default value
			var ele_disp_map = {  // A map which store element and it's display attributes
				"elementObj" : ele,
				"display" : disp_option
			}
			//GLOBAL_ELEMENTS.push(ele);
			GLOBAL_ELEMENTS.push(ele_disp_map);
			if(disp_option == 'none'){ // if none then display it
				$(ele).css("display","block");
			}
			$(ele).addClass("headerBox"); // flash
		});
	}

	function getAttributes(vector) {
		var str = getAttributesFromVector(vector); // [type=button;class=btn btn-primary btn-sm okbutt;]
		var pureStr = str.substr(1, str.length - 2); // 去除 []  type=button;class=btn btn-primary btn-sm okbutt;
		var attrs = pureStr.split(";");
		var pureAttrs = [];
		for(var i = 0; i < attrs.length - 1; i++) { // 最后一个空的不放进去
			pureAttrs.push(attrs[i]);
		}
		return pureAttrs;
	}

	function getAttributesFromVector(vector) {
		var arr = splitVector(vector);
		var attrStr = arr[8];
		return attrStr;
	}

	function splitVector(vector) {
		return vector.split("||");
	}

	//--- Style our newly added elements using CSS.
	GM_addStyle(multilineStr(function() {
		/*!
		    #myContainer {
		     position:    absolute;
		     top:     0;
		     left:     0;
		     font-size:    20px;
		     background:    orange;
		     border:     3px outset black;
		     margin:     5px;
		     opacity:    0.9;
		     z-index:    1222;
		     padding:    5px 20px;
		     float:	left;
		    }
		    #myButton {
		     cursor:     pointer;
		     margin:	5px;
		    }
		    #myContainer p {
		     color:     red;
		     background:    white;
		    }

		    #myZoomIn {
		    	margin:	5px;
		    }

		    #myInput {
		    	border:	none;
		    	width: 400px;
		    	margin:	5px;
		    }

		    .myBetween {
		    	display: flex;
    			justify-content: space-between;
		    }

		    .myBetween button {
		    	cursor:     pointer;
		     	margin:	5px;
		    }

		    .class_lu {
		        background-color: rgba(130, 180, 230, 0.5);
		        box-sizing: border-box;
		        outline: solid 1px #0F4D9A;
		        cursor: default;
		    }

		    @keyframes fade {
			    from {
			        opacity: 1.0;
			    }
			    50% {
			        opacity: 0.4;
			    }
			    to {
			        opacity: 1.0;
			    }
			}

			@-webkit-keyframes fade {
			    from {
			        opacity: 1.0;
			    }
			    50% {
			        opacity: 0.4;
			    }
			    to {
			        opacity: 1.0;
			    }
			}
			.headerBox {
			    color: #fff;
			    padding: 10px;
			    font-size: 15px;
			    height: 60px;
			    animation: fade 600ms infinite;
			    -webkit-animation: fade 600ms infinite;
			}

			.alert {
			    display: none;
			    position: fixed;
			    top: 50%;
			    left: 50%;
			    min-width: 200px;
			    margin-left: -100px;
			    z-index: 99999;
			    padding: 15px;
			    border: 1px solid transparent;
			    border-radius: 4px;
			}

			.alert-success {
			    color: #3c763d;
			    background-color: #dff0d8;
			    border-color: #d6e9c6;
			}

			.alert-info {
			    color: #31708f;
			    background-color: #d9edf7;
			    border-color: #bce8f1;
			}

			.alert-warning {
			    color: #8a6d3b;
			    background-color: #fcf8e3;
			    border-color: #faebcc;
			}
		*/
	}));

	function multilineStr(dummyFunc) {
		var str = dummyFunc.toString();
		str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function() { /*!
			.replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
			.replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
		;
		return str;
	}

	var Dragging = function(validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
		var draggingObj = null; //dragging Dialog
		var diffX = 0;
		var diffY = 0;

		function mouseHandler(e) {
			switch(e.type) {
				case 'mousedown':
					draggingObj = validateHandler(e); //验证是否为可点击移动区域
					if(draggingObj != null) {
						diffX = e.clientX - draggingObj.offsetLeft;
						diffY = e.clientY - draggingObj.offsetTop;
					}
					break;

				case 'mousemove':
					if(draggingObj) {
						draggingObj.style.left = (e.clientX - diffX) + 'px';
						draggingObj.style.top = (e.clientY - diffY) + 'px';
					}
					break;

				case 'mouseup':
					draggingObj = null;
					diffX = 0;
					diffY = 0;
					break;
			}
		};

		return {
			enable: function() {
				document.addEventListener('mousedown', mouseHandler);
				document.addEventListener('mousemove', mouseHandler);
				document.addEventListener('mouseup', mouseHandler);
			},
			disable: function() {
				document.removeEventListener('mousedown', mouseHandler);
				document.removeEventListener('mousemove', mouseHandler);
				document.removeEventListener('mouseup', mouseHandler);
			}
		}
	}

	function getDraggingDialog(e) {
		var target = e.target;
		//		while(target && target.className.indexOf('dialog-title') == -1) {
		while(target && target.id != 'digTitle') {
			target = target.offsetParent;
		}
		if(target != null) {
			return target.offsetParent;
		} else {
			return null;
		}

	}

	Dragging(getDraggingDialog).enable();

	var prompt = function(message, style, time) {
		style = (style === undefined) ? 'alert-success' : style;
		time = (time === undefined) ? 1200 : time;
		$('<div>')
			.appendTo('body')
			.addClass('alert ' + style)
			.html(message)
			.show()
			.delay(time)
			.fadeOut();
	};

	var success_prompt = function(message, time) {
		prompt(message, 'alert-success', time);
	};

	var warn_prompt = function(message, time) {
		prompt(message, 'alert-warning', time);
	};

})();