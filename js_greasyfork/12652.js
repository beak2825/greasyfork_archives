// ==UserScript==
// @name	Add button for Smooth Scroll to the top / bottom
// @author	burningall
// @description	为页面添加按钮，平滑的滚动到顶部/底部
// @version     2015.6.8
// @include		*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// @downloadURL https://update.greasyfork.org/scripts/12652/Add%20button%20for%20Smooth%20Scroll%20to%20the%20top%20%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/12652/Add%20button%20for%20Smooth%20Scroll%20to%20the%20top%20%20bottom.meta.js
// ==/UserScript==

(function(){
function checkList(){
	if( GM_getValue(window.top.location.host,'返回空字符串')==window.top.location.host ){//如果该页面在黑名单中，则不执行
		console.log('该域名在黑名单中')
		return true;
	};
};
var d1=new Date().getTime()
//================公共函数区============
function addEvent(obj, event, fn) {return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener("on" + event, fn);};
function getSize(obj) {return document.documentElement[obj]!=0 ? document.documentElement[obj]: document.body[obj];}
function hasScroll() {return getSize('scrollHeight') > getSize('clientHeight') ? true : false;};
function $(id) {return document.getElementById(id);}
function getStyle(obj, attr) {return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];}
function doMove(obj, attr, dir, target, endFn) {
	dir = parseInt(getStyle(obj, attr)) < target ? dir: -dir;
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
var cssText='\
#scrollMars-troy{\
	position:fixed;\
	right:30px;\
	z-index:9999999;\
}\
\
#scrollMars-troy>div>div{\
	width:40px !important;\
	height:40px !important;\
	text-align:center !important;\
	padding:5px !important;\
	background:#303030 !important;\
	color:#fff !important;\
	display:block !important;\
	opacity:0.8 !important;\
	fitter:alpha(opacity:80) !important;\
	cursor:pointer !important;\
	border-radius:50% !important;\
	box-shadow:2px 2px 40px 2px #303030 !important;\
	line-height:40px !important;\
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
	index:9999999999 !important;\
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
'
GM_addStyle(cssText);
//================主要代码区============
var turn;//用于控制是否双击滚动的开关
function readmode(speed,inteval){
	if( GM_getValue(turn)==false ){
		return;
	}
	clearInterval(document.readMode)
	document.readMode=setInterval(function(){
		//var speed=1;
		var position=getSize('scrollTop')+speed
		document.body.scrollTop = document.documentElement.scrollTop = position;
		if (position + getSize('clientHeight') >= getSize('scrollHeight')) {//如果滚到底部
			clearInterval(document.readMode);
		}
	},inteval)
	GM_setValue(turn,true);
}
function moveMars(obj,index){
	if(index=='mouseout'){
		clearTimeout(obj.timerHover);
		obj.timerHover = setTimeout(function() {
			doMove(obj, "right", 5, -30);
		},
		3000);//鼠标离开后，3s隐藏到边栏	
		}else if(index=='mouseover'){
			clearTimeout(obj.timerHover);
			doMove(obj, "right", 5, 30);
		}
}
function scroll(obj,dir){//obj随意，dir>0往上滚，dir<0往下滚
	clearInterval(obj.timerScroll);
	obj.timerScroll=setInterval(function(){
		var position;
		if(dir>0){//往上滚动
			var speed = (getSize('scrollTop') / 10) + 10;
			position = getSize('scrollTop') - speed;
			if (position <= 0) {//如果滚到顶部
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				clearInterval(obj.timerScroll);
			}
		}else{//往下滚动
			var speed = ((getSize('scrollHeight')-getSize('scrollTop')) / 20) + 10;
			position = getSize('scrollTop') + speed;
			if (position + getSize('clientHeight') >= getSize('scrollHeight')) {//如果滚到底部
				document.body.scrollTop = document.documentElement.scrollTop = getSize('scrollHeight');
				clearInterval(obj.timerScroll);
			}
		}
		document.body.scrollTop = document.documentElement.scrollTop = position;		
	},20)
}
function createBtn(){
	if(checkList()==true){
		return false;
	}
	var jugg=$("scrollMars-troy");
	if(jugg && hasScroll() == true){//如果有滚动条,并且存在滚动按钮
		$('scrollMars-troy').style.top=(getSize('clientHeight')/3)+'px';//调整按钮位置
	}else if(jugg && hasScroll() == false){//如果没有滚动条，但是有按钮
		jugg.remove(jugg);//删除按钮
	};
	if (hasScroll() == false && !jugg) {//如果没有滚动条,并且没有按钮
		return false;
	}else if(hasScroll() == true && !jugg){//如果有滚动条，并且没有按钮
		var mars=document.createElement('div');
		mars.id="scrollMars-troy";
		window.top.document.documentElement.appendChild(mars);
		mars.innerHTML = "<div id='mars-point'></div><div><div id='goTop-troy' title='返回顶部'></div><div id='goBtn-troy' title='去到底部'></div></div>";
		$('scrollMars-troy').style.top=(getSize('clientHeight')/3)+'px';
		$("goTop-troy").innerHTML = "↑";
		$("goBtn-troy").innerHTML = "↓";
		addEvent($("goTop-troy"), "click",function() {scroll(mars,1)});
		addEvent($("goBtn-troy"), "click",function() {scroll(mars,-1)});
		addEvent($("mars-point"), "mouseover",function() {moveMars(mars,"mouseover")});
		addEvent($("mars-point"), "mouseout",function() {moveMars(mars,"mouseout")});
		addEvent(mars, "mouseover",function() {moveMars(mars,"mouseover")});
		addEvent(window, "resize",function() {$('scrollMars-troy').style.top=(getSize('clientHeight')/3)+'px';});
		moveMars(mars,"mouseout");//页面加载完成，默认3s后隐藏到边栏
	};
};
/*
//清楚GM脚本保存的所有变量;，调试时用，请不要开启
function clearallGM_value(){
	for(var i=0;i<GM_listValues().length;i++){
		console.log('变量：'+GM_listValues()[i]+'被删除');
		GM_deleteValue( GM_listValues()[i] );
	};
}
clearallGM_value()
*/
//================执行区============
addEvent(window,'mousewheel',function(){//滚动则停止，兼容chrome/ie/opera
	clearInterval($('scrollMars-troy').timerScroll);
})
addEvent(window,'DOMMouseScroll',function(){//滚动则停止，兼容firefox
	clearInterval($('scrollMars-troy').timerScroll);
})

addEvent(document,'dblclick',function(){//双击进入阅读模式
		readmode(1,20);
})

addEvent(document,'click',function(){//单击退出阅读模式
		clearInterval(document.readMode);
})

addEvent(window.top,"load",function(){//页面加载，初始化按钮
	createBtn();
	var d2=new Date().getTime();
	console.log('GoTop-GoBtm脚本加载耗时：'+(d2-d1)+'ms');
	});
addEvent(window.top, "resize",function(){//页面大小改变，初始化按钮
	createBtn();
});
//================快捷键区============
addEvent(document,'keydown',function(e){
	e=e || window.top.event;
	if(e.ctrlKey && e.keyCode==38){//ctrl+↑，向上滚动
		scroll($('scrollMars-troy'),1)
	}else if(e.ctrlKey && e.keyCode==40){//ctrl+↓，向下滚动
		scroll($('scrollMars-troy'),-1)
	}else if(e.ctrlKey && e.keyCode==113){//ctrl+F2，调处控制面板
		var host=window.top.location.host;
		var setting=document.createElement('div');
		setting.id='setting-troy';
		var inner="\
			<div id='setting-pan-troy'>\
				<div>\
					控制面板:Ctrl+F2<br />\
					添加黑名单域名：<input type='text' id='blackList' placeholder='www.baidu.com' /><br />\
					<input type='button' value='添加黑名单' id='saveSetting' />\
					<input type='button' id='quiet' value='退出面板' /><br/><hr />\
					<input type='button' id='clear' value='移除黑名单'>\
					<input type='button' id='showlist' value='显示黑名单'>\
					<input type='button' id='clearall' value='清空黑名单'>\
					<input type='button' id='readmodebtn' value='双击滚动开关'>\
				</div>\
			</div>\
		"
		window.top.document.documentElement.appendChild(setting);
		var reg=/^[0-9-a-z]+\.{0,1}[0-9-a-z]+\.{1}[a-z]+$/ig;//用于验证域名是否符合规范
		setting.innerHTML=inner;
		$('blackList').value=host;
		GM_setValue(turn,true);//第一次安装脚本，默认开启双击滚动
		addEvent($('quiet'),'click',function(){//退出
			setting.remove(setting);
		});
		addEvent($('clear'),'click',function(){//移出黑名单
			GM_deleteValue($('blackList').value);
			alert( GM_getValue($('blackList').value,'移除成功') ); 
		});
		addEvent($('clearall'),'click',function(){//清空黑名单
			for(var i=0;i<GM_listValues().length;i++){
				if(reg.test( GM_listValues()[i] )){
					console.log('黑名单：'+GM_listValues()[i]+'被删除');
					GM_deleteValue( GM_listValues()[i] );
				}
			};//for
			alert('清空完毕');
		})
		addEvent($('showlist'),'click',function(){//显示黑名单
			if(GM_listValues().length<=1){
				alert('空的黑名单');
			}
			for(var i=0;i<GM_listValues().length;i++){
				if(reg.test( GM_listValues()[i] )){
					var list=document.createElement('li');
					list.innerHTML=GM_listValues()[i];
					document.querySelector('#setting-pan-troy>div').appendChild(list);
				}
			}
		});
		addEvent($('readmodebtn'),'click',function(){//禁用双击滚动
			if( GM_getValue(turn)==true ){
				GM_setValue(turn,false);
				alert('禁用成功');
				return;
			}else if(GM_getValue(turn)==false){
				GM_setValue(turn,true);			
				alert('开启成功');
				return;
			}
			
		})
		addEvent($('saveSetting'),'click',function(){//保存
			//var reg=/^[0-9-a-z]+\.{0,1}[0-9-a-z]+\.{1}[a-z]+$/ig
			if(reg.test($('blackList').value)==false){//检查输入的域名是否符合规范
				alert($('blackList').value+'域名格式不正确'+'\n比如：tieba.baidu.com或www.baidu.com')
				return;
			}
			if($('blackList').value!=''){//如果有填入黑名单列表
				if( GM_getValue($('blackList').value,'不存在')!=$('blackList').value ){//不在黑名单中
					GM_setValue($('blackList').value,$('blackList').value);
					alert('禁用：'+$('blackList').value+'成功');
				}else{
					alert('该域名已在黑名单中');
				}
			}else{//没有填入黑名单
				alert('请输入域名');
				return;
			}
		})
	}
})//监听keydown，快捷键
})()