// ==UserScript==
// @name  crack tyut
// @description 破解教务评教时间 firefox30+ && GM2.X 支持only chrome请安装https://github.com/alwaystest/jiaowu/raw/00ff4aae3574cc2affad40ca77284558c6573a4f/src/tyut.user.js
// @author	eric
// @version 1.2.5
// @include *jwcurp.tyut.edu.cn:80*
// @include http://202.207.247.4*
// @include file://*
// @run-at document-start
// @grant GM_log
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/3141
// @downloadURL https://update.greasyfork.org/scripts/2913/crack%20tyut.user.js
// @updateURL https://update.greasyfork.org/scripts/2913/crack%20tyut.meta.js
// ==/UserScript==

/*********************************************
 * ******************Notes********************
 *
 * for FF30+ need exportFunction  to access object . For now primitive values can access without export.
 *
 * ******************LOGS*********************
 *
 * 2015.5.6 教务处最新评估页面图片不足14个，导致之前判断逻辑失效，修复为只要教务处页面有图片就过一遍。
 * 2014.11.29  fix alert override. 18:14
 * noalert() append() next() stop() are not used
 * 2014.11.29  fix on FF32 GM2 。alert不能被noalert() override，使用网友 杰她她老伯 提供的代码暂时修复，目前不知道
 * 问题出在哪里，明天早上还有考研数学课。先能用了吧。 1：57
 *
 *********************************************/
var arr=new Array("老师教的很好","老师讲的很认真","老师用心的讲课","老师很热心","老师很负责")
var start=0;
var end=arr.length;
var i=0;
var timeout=1000;
console.log("start");
var Sys=getBrowser();
if(Sys.ver>="30"){//30以上采用exportFunction，以下采用旧版方法，未测试此版是否兼容FF30+
	var _alert=function(s){
		if(s=="评估失败，请返回！")
			unsafeWindow.alert("评的快了，请歇息一会");
		console.log(s);
	}
	exportFunction(_alert,unsafeWindow,{defineAs:"alert"});
}else{
	append(s); // 1/1
}
//noalert(); //1.2.2 used 1/2
/*for FF30+ need exportFunction  to access object . For now primitive values can access without export.
  function foo(){
  console.log("foo");
  }
  exportFunction(foo, unsafeWindow, {
  defineAs: "foo"
  });
  */
document.onreadystatechange = function () {
	//noalert();  //1.2.2 used 2/2
	if (document.readyState == "complete") {
		console.log("complete");
		pg();
		if (unsafeWindow.flag==false){
			setTimeout(submit,timeout);
		}
	}
}


function pg(){
	var pic=document.getElementsByTagName('img');
	if(pic[0]){//2015.5.6 fix . 只要有图片就过一遍。
		console.log("choose");
		for(i=0;i<pic.length;i++){
			if(pic[i].title=="评估")
				break;
		}
		if(i<pic.length){
			console.log(i+"checked");
			unsafeWindow.evaluation(pic[i]);
		}
		else{
			console.log("评完啦啦啦！！！");
		}
		//待完成,获取成功,等待跳转页面后的处理
	}
}
function submit(){
	if (unsafeWindow.flag==false){
		console.log("flag");
		console.log(unsafeWindow.flag);
		var aim = document.getElementsByName('zgpj');
		var rando=rnd(start,end);
		aim[0].value=arr[rando];
		var check=document.getElementsByTagName('input');
		for(i=0;i<check.length;i++){
			if(check[i].value=='10_1'){
				check[i].checked=true;
			}
		}
		unsafeWindow.setFlag();
		unsafeWindow.hideDiv();
		unsafeWindow.check();//自动提交
		//unsafeWindow.document.StDaForm.submit();//自动提交
	}
}
function next(){//强制跳转回评教主页，可能导致忽略评教反馈，评教失败
	if(unsafeWindow.document.title=="问卷评估结果"){
		unsafeWindow.location.href='jxpgXsAction.do?oper=listWj';
	}
}
function noalert(){
	var _alert = alert;
	unsafeWindow.alert = function(s) {
		if(s=="评估失败，请返回！")
			unsafeWindow.alert("评的快了，请歇息一会");
		console.log(s);
	}
}
function stop(){//忘了这个是干嘛的了，为啥要强制停止来着？
	window.stop();
}
function rnd(start, end){
	return Math.floor(Math.random() * (end - start) + start);
}
//感谢网友 杰她她老伯 寂寞的原子指点。在网页前面插入函数，不使用unsafeWindow就达到改变alert的功能。油猴子真是太难了
function append(s) {
	document.head.appendChild(document.createElement('script')).innerHTML = s.toString().replace(/(^function.*?\(\)\s*?\{|\}$)/g, '');
}

function s(){
	alert = console.log.bind(console);

};
function getBrowser()
{
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var re =/(firefox).*?([\d.]+)/;
	var m = ua.match(re);
	Sys.browser = m[0];
	Sys.ver = m[2];
	return Sys;
}
