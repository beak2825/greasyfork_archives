// ==UserScript==
// @name        bilibili bangumi
// @namespace   http://www.icycat.com
// @description 在收藏夹左边增加当天已更新的新番提示，可显示隐藏新番
// @include     http://www.bilibili.tv*
// @include     http://www.bilibili.com*
// @include     http://bilibili.kankanews.com*
// @version     1.2.1
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/3250/bilibili%20bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/3250/bilibili%20bangumi.meta.js
// ==/UserScript==

var bili = {
	weekday: null,
	myBangumi: [],
	sp: [],
	isRun: false,
	btnDelay: null,
	listDelay: null
}

document.addEventListener('DOMContentLoaded', init, false);

function init() {
	console.log('顶部按钮初始化');
	createRemindBtn();
}

function createRemindBtn() {
	var parent = document.querySelector('.uns_box ul');
	var remindBtn = document.createElement('li');
	remindBtn.id = 'remindBtn';
	var a = document.createElement('a');
	a.href = "javascript: void(0);";
	a.onmouseover = function() {
		if (bili.isRun) {
			if (bili.btnDelay) {
				clearTimeout(bili.btnDelay);
			}
			document.getElementById('bangumiRmind').style.display = 'block';
		} else {
			getUpdateData();
		}
	};
	a.onmouseout = function() {
		bili.btnDelay = setTimeout(function() {
			document.getElementById('bangumiRmind').style.display = 'none';
		}, 500);
	}
	a.innerHTML = '新番';
	remindBtn.appendChild(a);
	parent.insertBefore(remindBtn, parent.firstChild);
}

function getUpdateData() {
	bili.isRun = true;
	var d = new Date();
	bili.weekday = d.getDay();
	GM_xmlhttpRequest({
		method: 'get',
		url: 'http://api.bilibili.com/bangumi?appkey=0a99fa1d87fdd38c&btype=2&weekday=' + bili.weekday,
		headers: {
			'User-Agent': 'bilibili bangumi remind/1.2 (cat@icycat.com)',
			'Cookie': document.cookies,
		},
		onload: function(r) {
			if (r.status == 200) {
				var data = JSON.parse(r.responseText);
				console.log('获取新番更新数据成功');
				parseData(data);
			}
		}
	});
}

function parseData(data) {
	console.log('今日所有新番数量:'+Object.keys(data.list).length);
	var count = Object.keys(data.list).length;
	for (var i = 0; i < count; i++) {
		if (data.list[i].new) {
			/*for (var j=0;j<bili.myBangumi.length;j++) {
				if (data.list[i].title==bili.myBangumi[j]) {
					bili.sp.push(bili.myBangumi[j]);
				}
			}*/
			bili.sp.push(data.list[i].title);
		}
	}
	console.log('已更新数量:'+bili.sp.length);
	addTip();
}

function addStyle(css) {
	var style = document.createElement('style');
	style.type = 'text/css';
	var node = document.createTextNode(css);
	style.appendChild(node);
	document.head.appendChild(style);
}

function getTip() {
	var tipList = '<div class="remindList">';
	for (var i = 0; i < bili.sp.length; i++) {
		tipList += '<div class="bangumiList"><a target="_blank" href="http://www.bilibili.com/sp/' + bili.sp[i] + '">' + bili.sp[i] + '</a></div>';
	}
	tipList += '</div>';
	return tipList;
}

function addTip() {
	var remindBtn = document.getElementById('remindBtn');
	var css = '#bangumiRmind{background: none repeat scroll 0 0 #F9F9F9;border-radius: 5px;padding: 10px;position: absolute;right: -61px;top: 30px;width: 180px;border: 1px solid #CCC;}';
	css += '#bangumiRmind a{width:100%;} .bangumiList a{width:100%;color: #505050;} .bangumiList a:hover{color:#F25D8E}'
	css += '#bangumiRmind .remindArrow{height: 8px;width: 16px;top: -7px;left: 50%;margin-left: -8px;background: url(http://static.hdslb.com/images/v2images/topicons.png) no-repeat 0 -404px;position: absolute;}';	
	var bangumiRmind = document.createElement('div');
	bangumiRmind.id = 'bangumiRmind';
	bangumiRmind.innerHTML = getTip();
	var remindArrow = document.createElement('div');
	remindArrow.className = 'remindArrow';
	bangumiRmind.appendChild(remindArrow);	
	bangumiRmind.onmouseover = function() {
		if (bili.btnDelay) {
			clearTimeout(bili.btnDelay);
		}
		document.getElementById('bangumiRmind').style.display = 'block';
	};
	bangumiRmind.onmouseout = function() {
		bili.btnDelay = setTimeout(function(){
			document.getElementById('bangumiRmind').style.display = 'none';
		},500);
	};
	remindBtn.appendChild(bangumiRmind);
	addStyle(css);
}