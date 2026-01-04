// ==UserScript==
// @name         速卖通7天热卖商品一键筛选
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  安装后在速卖通页面，点击右侧按钮，可以一键筛选出当前页面所有含有7天热卖的产品，再次点击可以恢复正常。使用效果受网页加载速度和网络影响。【参考插件代码：Add button for Smooth Scroll to the top / bottom】
// @author       YourName
// @match        https://www.aliexpress.com/*
// @run-at       document-end
// @icon         https://www.aliexpress.com/favicon.ico
// @include		*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @run-at		document-start
// @compatible  chrome  完美支持
// @compatible  firefox  完美支持
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// @downloadURL https://update.greasyfork.org/scripts/529314/%E9%80%9F%E5%8D%96%E9%80%9A7%E5%A4%A9%E7%83%AD%E5%8D%96%E5%95%86%E5%93%81%E4%B8%80%E9%94%AE%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529314/%E9%80%9F%E5%8D%96%E9%80%9A7%E5%A4%A9%E7%83%AD%E5%8D%96%E5%95%86%E5%93%81%E4%B8%80%E9%94%AE%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

function checkList() {
	if (GM_getValue(window.top.location.host, '不在黑名单中') == window.top.location.host) { //如果该页面在黑名单中，则不执行
		return true;
	};
};
//================公共函数区============

function addEvent(obj, event, fn) {
	return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener("on" + event, fn);
};

function getSize(obj) {
	return document.documentElement[obj] != 0 ? document.documentElement[obj] : document.body[obj];
}

function hasScroll() {
	return getSize('scrollHeight') > getSize('clientHeight') ? true : false;
};

function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

function $(id) {
	return document.getElementById(id);
}

function doMove(obj, attr, dir, target, endFn) {
	dir = parseInt(getStyle(obj, attr)) < target ? dir : -dir;
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
			var speed = parseInt(getStyle(obj, attr)) + dir;
			if (speed > target && dir > 0 || speed < target && dir < 0) {
				speed = target;
			};
			obj.style[attr] = speed + "px";
			if (speed == target) {
				clearInterval(obj.timer);
				endFn && endFn();
			};
		},
		30);
};
//================样式区============
var cssText = '\
#scrollMars-troy{\
	position:fixed !important;\
	right:30px;\
	z-index:9999999 !important;\
}\
\
.sroll-btn-troy{\
	width:50px !important;\
	height:50px !important;\
	text-align:center !important;\
	background:#303030 !important;\
	color:#fff !important;\
	display:block !important;\
	opacity:0.8 !important;\
	fitter:alpha(opacity:80) !important;\
	cursor:pointer !important;\
	border-radius:50% !important;\
	box-shadow:2px 2px 40px 2px #303030 !important;\
	line-height:50px !important;\
	font-size:35px !important;\
	font-style:inherit !important;\
	font-weight:bold !important;\
	font-family:"宋体" !important;\
}\
#scrollMars-troy>div>div:hover{\
	background:#FF0000 !important;\
}\
#mars-point{\
	width:100px !important;\
	height:100px !important;\
	position:absolute !important;\
	top:0 !important;\
	left:-40px !important;\
}\
#setting-troy{\
	width: 300px !important;\
	height: auto !important;\
	border: 2px solid #303030 !important;\
	position: fixed !important;\
	top: 200px !important;\
	left: 33% !important;\
	color: #fff !important;\
	background: #303030 !important;\
	z-index:9999999999 !important;\
}\
#setting-troy>div{\
	margin: 20px !important;\
}\
#setting-troy>div input{\
	color:#fff !important;\
	background:#303030 !important;\
	padding:5px !important;\
	margin:5px !important;\
}\
#percent{\
	position:absolute !important;\
	top:42px !important;\
	left:-20px;\
	color:#147474 !important;\
	font-family:"微软雅黑" !important;\
	font-size:16px !important;\
	line-height:16px !important;\
}\
'
GM_addStyle(cssText);
//================主要代码区============
GM_getValue("turn") ? GM_setValue("turn", true) : GM_setValue("turn", GM_getValue("turn"));

function readmode(speed, inteval, endFn) {
	if (!$('percent') || GM_getValue("turn") == false || createBtn() == false) {
		return;
	}
	clearInterval(document.readMode);
	document.readMode = setInterval(function() {
		var position = getSize('scrollTop') + speed;
		document.body.scrollTop = document.documentElement.scrollTop = position;
		clearTimeout(document.showPercent);
		var precent = parseInt(getSize('scrollTop') / (getSize('scrollHeight') - getSize('clientHeight')) * 100);
		$('percent').style.display = "block";
		$('percent').innerHTML = precent + '%';
		if (position + getSize('clientHeight') >= getSize('scrollHeight')) { //如果滚到底部
			clearInterval(document.readMode);
			$('percent').style.display = "none";
		}
	}, inteval)
	GM_setValue("turn", true);
}

function moveMars(obj, index) {
	if (index == 'mouseout') {
		clearTimeout(obj.timerHover);
		obj.timerHover = setTimeout(function() {
				doMove(obj, "right", 5, -30);
			},
			3000); //鼠标离开后，3s隐藏到边栏
	} else if (index == 'mouseover') {
		clearTimeout(obj.timerHover);
		doMove(obj, "right", 5, 30);
	}
}

//================卡片处理============
let isFiltered = false; // 全局状态标记
const IMG_CONDITION = 'img[aria-hidden="true"][src="https://ae01.alicdn.com/kf/S1070fe6ce9fd4b2bb6760161cf556f9ag/372x64.png"]';

// 主切换函数
function toggleFilter() {
  isFiltered = !isFiltered;

  if (isFiltered) {
    applyFilter();
  } else {
    restoreFilter();
  }

}

// 应用筛选
function applyFilter() {
  document.querySelectorAll('[data-original-hidden]').forEach(card => {
    card.removeAttribute('data-original-hidden');
  });

  const targetImgs = document.querySelectorAll(IMG_CONDITION);
  const validCardClasses = new Set();

  // 收集卡片特征
  targetImgs.forEach(img => {
    let parent = img;
    for (let i = 0; i < 6; i++) {
      parent = parent?.parentElement;
      if (!parent) break;
    }
    parent?.classList?.forEach(className => validCardClasses.add(className));
  });

  const cardSelector = validCardClasses.size ?
    `div.${Array.from(validCardClasses).join('.')}` :
    null;

  if (!cardSelector) return;

  // 处理当前页卡片
  document.querySelectorAll(cardSelector).forEach(card => {
    if (!card.hasAttribute('data-original-hidden')) {
      card.setAttribute('data-original-hidden', card.hidden);
    }
    const hasTargetImg = card.querySelector(IMG_CONDITION);
    card.hidden = !hasTargetImg;
  });
}

// 恢复原始状态
function restoreFilter() {
  document.querySelectorAll('[data-original-hidden]').forEach(card => {
    const wasHidden = card.getAttribute('data-original-hidden') === 'true';
    card.hidden = wasHidden;
    card.removeAttribute('data-original-hidden');
  });
}

// MutationObserver（仅在筛选模式生效）
const observer = new MutationObserver(mutations => {
  if (!isFiltered) return;

  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      setTimeout(applyFilter, 100);
    }
  });
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
});

//================卡片处理============


function createBtn() {
	if (checkList() == true) {
		return false;
	}
	var jugg = $("scrollMars-troy");
	if (jugg && hasScroll() == true) { //如果有滚动条,并且存在滚动按钮
		$('scrollMars-troy').style.top = (getSize('clientHeight') / 3) + 'px'; //调整按钮位置
	} else if (jugg && hasScroll() == false) { //如果没有滚动条，但是有按钮
		jugg.remove(jugg); //删除按钮
	};
	if (hasScroll() == false && !jugg) { //如果没有滚动条,并且没有按钮
		return false;
	} else if (hasScroll() == true && !jugg) { //如果有滚动条，并且没有按钮
		var mars = document.createElement('div');
		mars.id = "scrollMars-troy";
		window.top.document.documentElement.appendChild(mars);
		mars.innerHTML = "\
		<div id='percent'></div>\
		<div id='mars-point'></div>\
		<div>\
			<div id='goTop-troy' title='返回顶部' class='sroll-btn-troy'></div>\
		</div>\
		";
		$('scrollMars-troy').style.top = (getSize('clientHeight') / 3) + 'px';
		$("goTop-troy").innerHTML = "🔍";
		addEvent($("goTop-troy"), "click", function() {
			toggleFilter()
		});
		addEvent($("mars-point"), "mouseover", function(e) {
			moveMars(mars, "mouseover");
		});
		addEvent($("mars-point"), "mouseout", function(e) {
			moveMars(mars, "mouseout");
		});
		addEvent(mars, "mouseover", function() {
			moveMars(mars, "mouseover")
		});
		addEvent(window, "resize", function() {
			$('scrollMars-troy').style.top = (getSize('clientHeight') / 3) + 'px';
		});
		moveMars(mars, "mouseout"); //页面加载完成，默认3s后隐藏到边栏
		return true;
	};
};

//================执行区============
addEvent(window, 'mousewheel', function() { //滚动则停止，兼容chrome/ie/opera
	createBtn() && clearInterval($('scrollMars-troy').timerScroll);
})

addEvent(window, 'DOMMouseScroll', function() { //滚动则停止，兼容firefox
	createBtn() && clearInterval($('scrollMars-troy').timerScroll);
})

addEvent(window.top, "resize", function() { //页面大小改变，初始化按钮
	createBtn();
});
addEvent(document, 'DOMContentLoaded', function() {
	createBtn();
})
