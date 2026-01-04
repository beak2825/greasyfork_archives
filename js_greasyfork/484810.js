// ==UserScript==
// @name	Bilibili直播时间记录 BiliLive timeStamp
// @author	Xchiliarch
// @description	为B站直播页面添加按钮，通过点击按钮即可记录按下时已开播至今时间点方便后期切片/设置时间跳转评论
// @version     0.1.1
// @match        *://live.bilibili.com/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @run-at		document-start
// @compatible  chrome  完美支持
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @namespace   https://github.com/Xchiliarch/BiliLive-timeStamp
// @downloadURL https://update.greasyfork.org/scripts/484810/Bilibili%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E8%AE%B0%E5%BD%95%20BiliLive%20timeStamp.user.js
// @updateURL https://update.greasyfork.org/scripts/484810/Bilibili%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E8%AE%B0%E5%BD%95%20BiliLive%20timeStamp.meta.js
// ==/UserScript==

//========快捷键列表=======
//【Ctrl+F2】>>>>>调出控制面板
//【Ctrl+Alt】>>>>呼出按钮
//【Shift+F】>>>>标记时间点
//【Esc】>>>>>>>>>退出控制面板
 

//================公共函数区============

function addEvent(obj, event, fn) {
	return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener("on" + event, fn);
};
 
function getSize(obj) {
	return document.documentElement[obj] != 0 ? document.documentElement[obj] : document.body[obj];
};
 
function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
};
 
function $(id) {
	return document.getElementById(id);
};
 
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
#Button-Collection{\
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
#Button-Collection>div>div:hover{\
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
};
 
function getTime(){
    try {
        const livePlayer = document.querySelector('#live-player')
        livePlayer.dispatchEvent(new Event('mousemove'))
        const text = livePlayer.querySelector('.text.time')
        let time = text.textContent
        return time
    }
    catch (e) {
        console.error(e)
    }

}
function minus30s(timeStamp){
	let hour = 0
	let min = 0
	let sec = 0
	let patternHMS = /^([0-9]+):([0-9]+):([0-9]+)$/;
	let patternMS = /^([0-9]+):([0-9]+)$/;
	if(patternHMS.test(timeStamp)){
		let matches = timeStamp.match(patternHMS)
		hour = parseInt(matches[1]);
		min = parseInt(matches[2]);
		sec = parseInt(matches[3]);
	}// 11:11:11格式
	else{
		let matches = timeStamp.match(patternMS)
		min = parseInt(matches[1]);
		sec = parseInt(matches[2]);
	}//11:11格式
	if(sec>=30){
		sec = sec -30;
	}
	else{
		if(min>=1){
			sec = sec+30;
			min = min-1;
		}
		else{
			if(hour>=1){
				min = min+59;
				sec = sec+30;
				hour = hour -1;
			}
			else{
				min = 0
				hour = 0
				sec = 0
			}
		}
	}
	if(hour >0){
		return(hour.toString()+":"+min.toString().padStart(2, '0')+":"+sec.toString().padStart(2, '0'));
	}
	else{
		return(min.toString().padStart(2, '0')+":"+sec.toString().padStart(2, '0'));
	}

}
 
function getRoomNum(){
	let html = window.location.href;
	let pattern = /^https:\/\/live\.bilibili\.com\/([0-9]+)?.*$/
	let roomNum = html.match(pattern)[1]	//获取直播间号
	return roomNum
}
function createBtn() {
	var jugg = $("Button-Collection");
    if (!jugg) {
		var mars = document.createElement('div');
		mars.id = "Button-Collection";
		window.top.document.documentElement.appendChild(mars);
		mars.innerHTML = "\
		<div id='percent'></div>\
		<div id='mars-point'></div>\
		<div>\
			<div id='pinTime' title='K时间点' class='sroll-btn-troy'></div>\
			<div id='Export' title='导出' class='sroll-btn-troy'></div>\
		</div>\
		";
		$('Button-Collection').style.top = (getSize('clientHeight') / 3) + 'px';
		$("pinTime").innerHTML = "📌";
		$("Export").innerHTML = "💾";

		addEvent($("pinTime"), "click", function() {
			//scroll(mars, 1)
			let roomName = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > a").textContent
			var list = GM_getValue(roomName,new Array())
			list.push(getTime())
			GM_setValue(roomName,list) 
            console.log(roomName,list)
		});
		addEvent($("Export"), "click", function() {
			let roomName = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > a").textContent
			let timeStamps = GM_getValue(roomName)
			//alert(timeStamps)
			navigator.clipboard.writeText(timeStamps)
			.then(() => {
				alert('当前直播间时间戳已导出至剪贴板')
			})
			.catch(err => {
				console.log(err)
			})
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
			$('Button-Collection').style.top = (getSize('clientHeight') / 3) + 'px';
		});
		moveMars(mars, "mouseout"); //页面加载完成，默认3s后隐藏到边栏
		return true;
	};
};


//================执行区============

 
addEvent(window.top, "resize", function() { //页面大小改变，初始化按钮
	createBtn();
});
addEvent(document, 'DOMContentLoaded', function() {
	createBtn();
});
//================快捷键区============
addEvent(window, 'keydown', function(event) {
	event = event || window.event;

	if (event.ctrlKey && event.altKey) { 
		moveMars($('Button-Collection'), "mouseover");
		setTimeout(function() {
			moveMars($('Button-Collection'), "mouseout");
		}, 3000);
	} //ctrl+alt,调出按钮
    else if (event.keyCode == 27) { 
		let setting = $('setting-troy');
		setting　 && 　setting.remove(setting);
	} //Esc退出控制面板
	else if (event.ctrlKey && event.keyCode == 113) { 
		$('setting-troy') && 　setting.remove(setting);
		let setting = document.createElement('div');
		setting.id = 'setting-troy';
		var inner = "\
			<div id='setting-pan-troy'>\
				<div>\
					控制面板:Ctrl+F2<br />\
					添加时间点：<input type='text' id='timeStamp' placeholder='格式12:34:56/12:34' /><br />\
					<input type='button' value='获取当前时间' id='getTime' />\
					<input type='button' value='时间-30s' id='minusTime' />\
					<input type='button' value='添加时间点' id='saveTime' />\
					<input type='button' id='exitPanel' value='退出面板(Esc)' /><br/><hr />\
					<input type='button' id='clearCurrentTimeStamp' value='移除最近一个时间点'>\
					<input type='button' id='showlist' value='显示所有时间点'>\
					<input type='button' id='removeAllTimeStamp' value='清空所有直播间时间点'>\
						<div id = 'all'> \
						</div>\
				</div>\
			</div>\
		"
		window.top.document.documentElement.appendChild(setting);
		setting.innerHTML = inner;
		var timeStampPattern = /^([0-9]+:){1,}[0-9]+$/;
		var patternHMS = /^([0-9]+):([0-9]+):([0-9]+)$/;
		var patternMS = /^([0-9]+):([0-9]+)$/;
		//$('timeStamp').value = getTime();
		addEvent($('exitPanel'), 'click', function() { //退出面板
			setting.remove(setting);
		});
		addEvent($('getTime'), 'click', function() { //获取当前时间
			try{
				let time = getTime()
				$('timeStamp').value = time
			}
			catch(err){
				console.log(err)
			}
			
		});
		addEvent($('minusTime'), 'click', function() { //时间-30s
			let timeStamp = $('timeStamp').value
			if (timeStamp != '') { //如果有填入时间
				if(timeStampPattern.test(timeStamp)){
					$('timeStamp').value = minus30s(timeStamp);
				}
				else{
					alert('输入非法')
				}
			}
			else{
				alert('未填入时间')
			}
		});
		addEvent($('clearCurrentTimeStamp'), 'click', function() { //移除最近一个时间点
			let roomName = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > a").textContent
			var list = GM_getValue(roomName,new Array())
			list.pop()
			GM_setValue(roomName,list) 
			alert("操作成功")
		});
		addEvent($('removeAllTimeStamp'), 'click', function() { //清空所有时间点
			let r = confirm("确定删除？")
			if(r){
				for (var i = 0; i < GM_listValues().length; i++) {
					GM_deleteValue(GM_listValues()[i])
				};
				alert('清空完毕,\nBug:可能需要多点几次，才能清空');
			}

		})
		addEvent($('showlist'), 'click', function() { //显示时间戳列表
			if (GM_listValues().length < 1) {
				alert('空的时间戳列表');
				return;
			} else {
				document.querySelector('#all').innerHTML = '';
				for (let i = 0; i < GM_listValues().length; i++) {
					let roomName = GM_listValues()[i]
					let times = GM_getValue(roomName,new Array())
					if(times.length>0){
						let list = document.createElement('li');
						let id = roomName
						list.id = id
						list.innerHTML = GM_listValues()[i];
						for (let i = 0; i < times.length; i++) {
							let stamp = document.createElement('li');
							stamp.innerHTML = times[i];
							list.appendChild(stamp);
						}//for all times
						document.querySelector("#all").appendChild(list);
					}
					
				} //for all rooms
			}
		});
		addEvent($('saveTime'), 'click', function() { //保存
			if ($('timeStamp').value != '') { //如果有填入时间
				let roomName = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > a").textContent
				let Time = $('timeStamp').value
				if(timeStampPattern.test(Time) == true){
					var list = GM_getValue(roomName,new Array())
					list.push(Time)
					GM_setValue(roomName,list) 
					console.log(roomName,list)
				}
				else{
					alert('输入非法');
				}

			} 
			else { //没有填入黑名单
				alert('请输入时间戳');
				return;
			}
		})
	}//ctrl+F2，调控制面板
	if (event.shiftKey && event.keyCode == 70) { 
		//console.log('1')
		let roomName = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > a").textContent
		var list = GM_getValue(roomName,new Array())
		list.push(getTime())
		GM_setValue(roomName,list) 
		console.log(roomName,list)
	} //shift+F,添加时间点
}) //监听keydown，快捷键

