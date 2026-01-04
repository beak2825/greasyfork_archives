// ==UserScript==
// @name         自动答题-朱岩松云题库
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  自动答题，干翻老师的网站！！！！
// @author       朱岩松
// @match        https://www.yftechweb.cn/exam.html
// @icon         https://www.google.com/s2/favicons?sz= 64&domain=tampermonkey.net
// @require       http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @connect v6ym.com
// @grant GM_xmlhttpRequest
// @license zys
// @supportURL   https://v6ym.com/
// @homepage     https://v6ym.com/
// @downloadURL https://update.greasyfork.org/scripts/436116/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E6%9C%B1%E5%B2%A9%E6%9D%BE%E4%BA%91%E9%A2%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/436116/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E6%9C%B1%E5%B2%A9%E6%9D%BE%E4%BA%91%E9%A2%98%E5%BA%93.meta.js
// ==/UserScript==
//---用户自定义设置区域----------
buju='auto';
pifu=2
//--服务端可见区域---------------
//--全局变量区域---------------
var tk='';
var th=''
var panduan=true
var cxda
var szth
var key
var nowversion = "1.1.5"
//--全局变量区域结束---------------
function IsPC() {
	var a = navigator.userAgent;
	var b = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
	var c = true;
	for (var v = 0; v < b.length; v++) {
		if (a.indexOf(b[v]) > 0) {
			c = false;
			break
		}
	}
	if (c == false) {
        console.log("检测到答题网页，载入程序成功！");
		console.log("你的当前设备为移动端，已为你优化默认布局");
		buju = 80
	} else if (buju == "auto") {
		if (window.screen.height == 1080) {
			buju = 300
		} else if (window.screen.height == 768) {
			buju = 100
		} else if (window.screen.height == 720) {
			buju = 50
		} else if (window.screen.height < 720) {
			buju = 0
		} else if (window.screen.height > 1080) {
			buju = 500
		} else {
			buju = 300
		}
        console.log("检测到答题网页，载入程序成功！");
		console.log("功能按钮布局已自动优化为" + buju)
	}
}
IsPC();
var btnList = {},
	paddingLeft = '0px',
	paddingRight = '0px',
	clrs1 = 'color',
	clrs2 = 'ground',
	color0 = '#E0EEEE',
	ground0 = '#9370DB',
	color1 = '#BFEFFF',
	ground1 = '#BDB76B',
	color2 = '#E0EEE0',
	ground2 = '#CD661D',
	color3 = '#FFFAFA',
	ground3 = '#FFB6C1',
	color4 = null,
	ground4 = null,
	color = eval(clrs1 + pifu),
	ground = eval(clrs2 + pifu),
	buttonWidth = '70px',
	buttonHeight = '20px',
	currentPos = 5,
	delta = 30,
	
	database = window.localStorage;
var btnBox2 = document.createElement('div');
btnBox2.style.position = 'absolute';
btnBox2.style.top = '210px';
btnBox2.style.left = 460 + buju + 'px';
btnBox2.style.width = buttonWidth;
btnBox2.style.height = buttonHeight;
document.body.appendChild(btnBox2);

var btnBox1 = document.createElement('div');
btnBox1.style.position = 'absolute';
btnBox1.style.top = '210px';
btnBox1.style.left = 540 + buju + 'px';
btnBox1.style.width = buttonWidth;
btnBox1.style.height = buttonHeight;
document.body.appendChild(btnBox1);

function createButton(a, b, c) {
	btnList[a] = document.createElement('button');
	var d = btnList[a];
	d.innerText = a;
	d.style.marginTop = currentPos + "px";
	d.style.color = color;
	d.style.background = ground;
	d.style.paddingLeft = paddingLeft;
	d.style.paddingRight = paddingRight;
	d.style.width = '100%';
	d.style.height = '100%';;
	d.addEventListener('click', c);
	b.appendChild(d)
}
var html580ads = {
	init: function(a, c) {
		a = '<h2  id="outle" style="height: 40px; top:-15px; line-height: 30px; padding-left: 5px; font-size: 20px;text-align:center; color:' + color + ";background:" + ground + ';border-bottom: 1px solid #aaaaaa; position: relative; "><b>' + a + '</b><span style="width: 21px; height: 20px;position: absolute; top: 1px; right:30px;"><a id="btn_min" href="javascript:void(0); ">一</a>&nbsp&nbsp<a id="btn_close" href="javascript:void(0);" >X</a></span></h2><div id="mainoutle" style="height:200px; width:300px; overflow: hidden; font-size: 18px; line-height: 18px;text-decoration:underline; color:rgb(195, 66, 255);"><div style="padding:2px;"><b>' + c + "</b></div></div>";
		var b = this;
		c = document.body;
		b.oDiv = document.createElement("div");
		b.oDiv.id = "miaov_float_layer";
		b.oDiv.style.cssText = "border: 1px solid #aaaaaa; display:none;width:300px;";
		c.appendChild(b.oDiv);
		b.oDiv.innerHTML = a;
		var d = document.getElementById("btn_min");
		a = document.getElementById("btn_close");
		b.oDivContent = b.oDiv.getElementsByTagName("div")[0];
		var e = 0;
		c = window.navigator.userAgent.match(/MSIE 6/ig) && !window.navigator.userAgent.match(/MSIE 7|8/ig);
		b.oDiv.style.display = "block";
		e = b.oDivContent.offsetHeight;
		c ? (b.oDiv.style.position = "absolute", b.repositionAbsolute(), window.attachEvent("onscroll", function() {
			b.repositionAbsolute()
		}), window.attachEvent("onresize", function() {
			b.repositionAbsolute()
		})) : (b.oDiv.style.position = "fixed", b.repositionFixed());
		d.timer = null;
		d.isMax = !0;
		d.onclick = function() {
			b.startMove(b.oDivContent, (this.isMax = !this.isMax) ? e : 0, function() {
				d.className = "min" == d.className ? "max" : "min"
			})
		};
		a.onclick = function() {
			b.oDiv.remove()
		}
	},
	startMove: function(a, c, b) {
		a.timer && clearInterval(a.timer);
		var d = this;
		a.timer = setInterval(function() {
			d.doMove(a, c, b)
		}, 30)
	},
	doMove: function(a, c, b) {
		var d = (c - a.offsetHeight) / 8;
		a.offsetHeight == c ? (clearInterval(a.timer), a.timer = null, b && b()) : (d = 0 < d ? Math.ceil(d) : Math.floor(d), a.style.height = a.offsetHeight + d + "px", window.navigator.userAgent.match(/MSIE 6/ig) && 2 == window.navigator.userAgent.match(/MSIE 6/ig).length ? this.repositionAbsolute() : this.repositionFixed())
	},
	repositionFixed: function() {
		this.oDiv.style.right = 0;
		this.oDiv.style.bottom = 0
	},
	repositionAbsolute: function() {
		var a = document.body.scrollTop || document.documentElement.scrollTop,
			c = document.documentElement.clientHeight;
		this.oDiv.style.left = (document.body.scrollLeft || document.documentElement.scrollLeft) + document.documentElement.clientWidth - this.oDiv.offsetWidth + "px";
		this.oDiv.style.top = a + c - this.oDiv.offsetHeight + "px"
	},
	changemsgcss: function() {
		document.getElementById("outle").style.color = color;
		document.getElementById("outle").style.background = ground
	}
};

function alertmsg(a, c) {
	1 == database.alert_flag ? (document.getElementById("btn_close") && html580ads.oDiv.remove(), html580ads.init(a, c)) : console.log("你有一条弹窗消息待显示，可弹窗功能未开启")
}
function mainoutle(a, c) {
	document.getElementById("mainoutle").style.height = a + "px";
	document.getElementById("mainoutle").style.width = c + "px";
	html580ads.oDiv.style.width = c + "px"
};

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://v6ym.com/api/gg.php?ver='+nowversion,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        var gg = responseDetails.responseText;
        database.alert_flag = 1;
        alertmsg("题库公告 by：朱岩松", gg);
    }
});


(function() {
	var e, isInitialized = false,
		_console = {};

	function createElement(a, b) {
		var c = document.createElement(a);
		c.style.cssText = b;
		return c
	}
	function createPanel(a) {
		a.bgColor = a.bgColor || ground;
		a.color = a.color || color;
		a.css = a.css || '';
		a.freeConsole = false;
		var b = createElement('div', 'font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;padding:5px;text-align:left;opacity:0.8;position:fixed;left:300px;top:216px;min-width:200px;max-height:50vh;overflow:auto;background:' + a.bgColor + ';color:' + a.color + ';' + a.css);
		b.style.left = 610 + buju + 'px';
		return b
	}
	function log() {
		var c = createElement('div', 'line-height:18px;background:' + (e.children.length % 2 ? 'rgba(255,255,255,0.2)' : ''));
		var d = [].slice.call(arguments).reduce(function(a, b) {
			return a + ' ' + b
		}, '');
		c.textContent = d;
		e.appendChild(c);
		e.scrollTop = e.scrollHeight - e.clientHeight
	}
	function clear() {
		e.innerHTML = ''
	}
	function init(a) {
		if (isInitialized) {
			return
		}
		isInitialized = true;
		a = a || {};
		e = createPanel(a);
		document.body.appendChild(e);
		if (!a.freeConsole) {
			_console.log = console.log;
			_console.clear = console.clear;
			console.log = originalFnCallDecorator(log, 'log');
			console.clear = originalFnCallDecorator(clear, 'clear')
		}
	}
	function destroy() {
		isInitialized = false;
		console.log = _console.log;
		console.clear = _console.clear;
		e.remove()
	}
	function hidelog() {
		e.style.visibility = "hidden"
	}
	function showlog() {
		e.style.visibility = "visible"
	}
	function changecss() {
		e.style.color = color;
		e.style.background = ground
	}
	function checkInitialized() {
		if (!isInitialized) {
			throw 'You need to call `screenLog.init()` first.';
		}
	}
	function checkInitDecorator(a) {
		return function() {
			checkInitialized();
			return a.apply(this, arguments)
		}
	}
	function originalFnCallDecorator(a, b) {
		return function() {
			a.apply(this, arguments);
			if (typeof _console[b] === 'function') {
				_console[b].apply(console, arguments)
			}
		}
	}
	window.screenLog = {
		init: init,
		log: originalFnCallDecorator(checkInitDecorator(log), 'log'),
		clear: originalFnCallDecorator(checkInitDecorator(clear), 'clear'),
		destroy: checkInitDecorator(destroy),
		hidelog: checkInitDecorator(hidelog),
		showlog: checkInitDecorator(showlog),
		changecss: checkInitDecorator(changecss)
	}
})();
//screenLog.init();
//screenLog.log('自动答题程序 v' + nowversion +' by：朱岩松');
//screenLog.log('------------------程序日志------------------');

//----函数类-------------------------------------
function cx(){
 //查询开始
var fullUrl = "https://v6ym.com/api/api.php?q=";
 console.log('正在查询题库~');
GM_xmlhttpRequest({
    method: 'GET',
    url: fullUrl+th+'&ver='+nowversion+'&key='+key,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) chaxun',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        cxda = responseDetails.responseText;
//if(cxda==undefined || cxda=='?'){
 //console.log('错误：查不到此题，请等待添加题库！');
   //cxda='?'
//
    //panduan=false
        //}else{
        console.log('已查询到正确答案：'+cxda);
             console.log('正在为您选择正确答案！');
            switch (cxda) {
	case 'A':
   document.getElementById("qs_"+szth+"_1").click();
        console.log('选择了A！');
         document.getElementsByClassName("next ui button")[0].click();
                    cxda='?'
		break;
case 'B':
   document.getElementById("qs_"+szth+"_2").click();
        console.log('选择了B！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
        	case 'C':
   document.getElementById("qs_"+szth+"_3").click();
        console.log('选择了C！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
case 'D':
   document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
        case 'A,B':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_2").click();
        console.log('选择了A,B！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
case 'A,B,D':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_2").click();
         document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了A,B,D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
         case 'A,B,C':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_2").click();
         document.getElementById("qs_"+szth+"_3").click();
        console.log('选择了A,B,C！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
         case 'A,B,C,D':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_2").click();
         document.getElementById("qs_"+szth+"_3").click();
          document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了A,B,C,D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
          case 'B,C,D':
        document.getElementById("qs_"+szth+"_2").click();
         document.getElementById("qs_"+szth+"_3").click();
          document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了B,C,D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
             case 'C,D':
         document.getElementById("qs_"+szth+"_3").click();
          document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了C,D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
           case 'A,C':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_3").click();
        console.log('选择了A,C！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
            case 'A,D':
   document.getElementById("qs_"+szth+"_1").click();
        document.getElementById("qs_"+szth+"_4").click();
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
        console.log('选择了A,D！');
		break;
         case 'B,C':
         document.getElementById("qs_"+szth+"_2").click();
          document.getElementById("qs_"+szth+"_3").click();
        console.log('选择了B,C！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
        case 'B,D':
         document.getElementById("qs_"+szth+"_2").click();
          document.getElementById("qs_"+szth+"_4").click();
        console.log('选择了B,D！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
                     case 'C,D,E':
         document.getElementById("qs_"+szth+"_3").click();
          document.getElementById("qs_"+szth+"_4").click();
                    document.getElementById("qs_"+szth+"_5").click();
        console.log('选择了C,D,E！');
         document.getElementsByClassName("next ui button")[0].click();
                     cxda='?'
		break;
	default:console.log('无答案，无法选择！已经进入下一题');
                    document.getElementsByClassName("next ui button")[0].click();
		break;}
        //}
    }
});

}//查询结束
function pd(){
//判断选项开始

}//结束


function chushihua(){
 //if(mm=='zys123'){
 //console.log('密码正确，题库载入！');
 
       
var div = document.querySelector(".q-content").getElementsByTagName('div');
 th=div[div.length - 1].id
     var lx = document.querySelector(".type").innerText
 szth=th.replace(/[^\d]/g,'');
     console.log('题号:'+th,'题目类型:'+lx);
        cx();
//pd();
//var xuan1=document.getElementById("qs_"+szth+"_1").click();;
       // document.getElementsByClassName("next ui button")[0].click();

 //}else{
     //console.log('密码错误，滚蛋！');
 //}
}
function Test(){
   
    var sd = 1000;//prompt("请输入程序运行速度（最快运行速度1000，如果网速一般填写2000~3000）","")
    //var tall = prompt("请输入题库密码","");
panduan=true
if(sd<1000){
    console.log('您输入的运行速度为：'+sd+'运行速度过快会出现题目错答，已自动更改运行速度为1500');
sd=1500

}
    var num=0
    var zts=100
    setInterval(function (){
    if(panduan==true){
	chushihua();
}else{
   zz();
}
}, sd);

}
function zz(){



}
function Test1(){
    panduan=false
}
function Test2(){

document.getElementsByClassName("btn_close")[0].click();
}
function Test3(){
    var renwu
    GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://v6ym.com/api/ggrw.php',
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
         renwu = responseDetails.responseText;
        console.log('已获取到任务');
         console.log('目前最新的任务PIN为：'+renwu);
//document.getElementsByTagName("input")[0].value=renwu;
//if(document.getElementsByTagName("input")[0].value==renwu){

    console.log('Tip:将最新PIN复制到输入框点击进入后开始答题');
//jr()
//}
    }
});

    //document.querySelector(".ui left icon input").getElementsByTagName('input')

}
function jr(){

console.log('已进入最新任务');
document.getElementsByClassName("ui fluid large teal  button")[0].click();
}

function Test4(){
    var sd = prompt("请输入程序运行速度（最快运行速度500","");
    //var tall = prompt("请输入题库密码","");
panduan=true
if(sd<500){
    console.log('您输入的运行速度为：'+sd+'运行速度过快会出现异常，已自动更改运行速度为500');
sd=500

}
    var num=0
    var zts=100
    setInterval(function (){
    if(panduan==true){
	var div = document.querySelector(".q-content").getElementsByTagName('div');
 th=div[div.length - 1].id
     var lx = document.querySelector(".type").innerText
 szth=th.replace(/[^\d]/g,'');
     console.log('题号:'+th,'题目类型:'+lx);


var xuan1=document.getElementById("qs_"+szth+"_1").click();;
       document.getElementsByClassName("next ui button")[0].click();
}else{

}
}, sd);

}
function Test5(){

screenLog.init();
screenLog.log('自动答题程序 v' + nowversion +' by：朱岩松');
screenLog.log('------------------程序日志------------------');
createButton('开始答题',btnBox2,Test);
createButton('停止答题',btnBox1,Test1);
createButton('交卷',btnBox1,Test2);
createButton('最新任务',btnBox2,Test3);

}


//----登录验证-------------------------------------
 key=prompt("请输入程序使用key","");
GM_xmlhttpRequest({
    method: 'GET',
    url:'https://v6ym.com/api/yz.php?ver='+nowversion+'&key='+key,
    headers: {
        'User-agent': 'Mozilla/4.0 (zys) login.get',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        var fhz = responseDetails.responseText;
        database.alert_flag = 1;
        if(fhz=='ok'){
alert('key正确！欢迎使用！')
            Test66();
}else{
    if(fhz=='脚本版本与服务器不匹配，请更新最新版本'){
        alert(fhz)
window.location.href="https://greasyfork.org/zh-CN/scripts/436116";
    }else{
alert(fhz)
document.location.reload();}
}
    }
});

function Test66(){
 var xuanze=prompt("请输入程序使用模式（请输入菜单模式或隐藏模式）","菜单模式");
if(xuanze=='菜单模式'){
Test5()
    alert('您选择的是菜单模式，通过菜单控制开始刷题即可。')
}else{
alert('您选择的是隐藏模式，按下回车控制开始刷题，按下回车停止刷题。')
 $(document).keydown(function(event){

     if(event.keyCode == 13){
  Test();
 }
     if(event.keyCode == 32){
  Test1();
 }
});}
}
//----按钮排列-------------------------------------
//createButton('开始答题',btnBox2,Test);
//createButton('停止答题',btnBox1,Test1);
//createButton('关闭插件',btnBox1,Test5);
//createButton('最新任务',btnBox2,Test3);
//createButton('全部瞎选',btnBox2,Test4)
//createButton('停止瞎选',btnBox1,Test1)