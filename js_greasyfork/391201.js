// ==UserScript==
// @name         mmmmm
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  try to take over the world!
// @author       cx
// @match        https://detail.damai.cn/item.htm*
// @run-at       document-end
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391201/mmmmm.user.js
// @updateURL https://update.greasyfork.org/scripts/391201/mmmmm.meta.js
// ==/UserScript==
var cookie  = getCookie("UUrl");
console.log(cookie);
if(cookie != null && cookie != ''){
	window.location.href = cookie;
}
var startTime;
var id = '';
var xiangou = '';
var url = 'https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=IIID_NNUM_SKUID&buyNow=true&spm=a2oeg.project.projectinfo.dbuy';
$(function () {
     console.log(getCookie("damai.cn_user"));
	$("#dataDefault").css("display","block");
	var html = JSON.parse($("#dataDefault").html());
	$("#dataDefault").css("display","none");
	var objMain = html.performBases;
	 startTime = html.sellStartTimeStr;
	 id = '';
	 xiangou = '';
	var obj = '';
	for(var i = 0;i<objMain.length;i++){
		var objOne = objMain[i];
		var title = objOne.name;
		var objTwo = objOne.performs[0];
		if(id == ''){
			id= objTwo.itemId;
		}
		if(xiangou == ''){
			xiangou = objTwo.singleLimit;
		}
		obj +='<p>票档场次：'+title+'</p>';
		var skuList = objTwo.skuList;
		for(var n = 0;n<skuList.length;n++){
			var priceName = skuList[n].skuName;
			var priceId = skuList[n].skuId;
			var statusStr = "("+skuList[n].skuTag+")";
			if(statusStr == "(undefined)"){
				statusStr = '';
			}
			obj +='<p>票档id：'+priceId+'-票档名称：'+priceName+statusStr+'</p>';
		}
		obj +='<p style="margin: 1rem 0;">^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^</p>';
	}
	var sub = '<input type="text" id="priId" style="border: 1px solid;height: 2rem;margin: 1rem 0;">';
	var xx = '<input type="text" id="xx" style="border: 1px solid;height: 2rem;margin: 1rem 0;">';
	var time = '<input type="text" id="time" style="border: 1px solid;height: 2rem;margin: 1rem 0;">';

	var hh = '<div id="gogogo" style="opacity: 1;position: absolute;background-color: white;width: 33%;z-index: 10000;right: 10px;top: 21%;border: 1px black solid;padding: 1rem;">' +
		'<h1 style="margin-bottom: 1rem;">开票时间：'+startTime+'</h1>'+
		'    <div>' +
		''+ obj+
		'    </div>' +
		'    <div id="add">' +
		'		<p>请复制上方的 票档id 至下方的输入框↓</p>' +
		'	    '+ sub +
		'		<p>请输入抢购张数：当前限购 <span style="color: red"> '+xiangou+' </span> (填多了会失败)</p>' +
		'	    '+ xx +
		'       <div>' +
		'		<p>请输入开票时间： 例如：19:31 英文冒号</p>' +
		'	    '+ time +
		'       <div>' +
		'			<span>→→→【按回车键定时开始(仅限当天)】←←←</span>' +
		'		</div>'+
		'		<div id="cc" style="display: none">' +
		'			<div id="cc1">开票时间：</div>' +
		'			<div id="cc2">当前时间：</div>' +
		'			<div id="cc3">^已启用自动回弹^</div>' +
		'		</div>'+
		'       <div>' +
		'			当前状态：<span id="start" style="color: red;font-weight: 600">停止</span>' +
		'		</div>'+
		'    </div>'+
		'</div>';
	$("body").append(hh);

});

var flag = true;
var ttime;
document.onkeydown = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 27) { // 按 Esc 停止自动跳转
		//if($("#gogogo").css("opacity")=="0"){
		//	$("#gogogo").css("opacity","1");
		//}else{
		//	$("#gogogo").css("opacity","0");
		//}
	}
	if (e && e.keyCode == 13) { // 按 enter
		if(flag){
			var priId = $("#priId").val();
			var xx = $("#xx").val();
			var time1 = $("#time").val();
			if(priId.trim()==''){
				alert("请填写票档id");
				return;
			}
			if(xx.trim()==''){
				alert("请填写数量");
				return;
			}
			if(xx > xiangou){
				alert("超出限购");
				return;
			}
			if(time1.trim()==''){
				alert("请填写开票时间");
				return;
			}
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth() + 1;
			var date = myDate.getDate();
			if(month < 10 ){
				month = "0" + month;
			}
			if(date < 10 ){
				date = "0" + date;
			}
			var qq = year+"/"+month+"/"+date+" "+time1+":00";
			var startTime1 = (new Date(qq)).getTime()-10;
			$("#cc").css("display","block");
			$("#cc1").html("开票时间："+year+"年"+month+"月"+date+"日 "+time1+":00");
			console.log("开票时间："+qq);
			url = url.replace("IIID",id).replace("NNUM",xx).replace("SKUID",priId);
			ttime = setInterval(function (e) {
				var now1 = new Date().getTime()-500;
				if(now1 >= startTime1){
                    clearInterval(ttime);
                    setCookie("UUrl",url);
					window.location.href = url;
				}
				var now = new Date();
				var m = now.getMonth();
				var d = now.getDate();
				var hours = now.getHours();
				var minutes = now.getMinutes();
				var seconds = now.getSeconds();
				var mill = now.getMilliseconds();
				if(hours < 10){
					hours = "0"+hours;
				}
				if(minutes < 10){
					minutes = "0"+minutes;
				}
				if(seconds < 10){
					seconds = "0"+seconds;
				}
				if(m < 10 ){
					m = "0" + m;
				}
				if(d < 10 ){
					d = "0" + d;
				}
				$("#cc2").html("当前时间："+now.getFullYear()+"年"+m+"月"+d+"日 "+hours+":"+minutes+":"+seconds+"-"+mill+"毫秒");
			},5);
			$("#start").html("运行中……");
			$("#start").css("color","green");
			flag = false;
		}else{
			clearInterval(ttime);
			$("#cc").css("display","none");
			$("#start").html("停止");
			$("#start").css("color","red");
			flag = true;
		}
	}
};

function setCookie(c_name, value) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 60000);
	document.cookie = c_name + "=" + escape(value)+ ";path=/;domain=damai.cn;expires=" + exp.toGMTString();
}

// 读取cookie
function getCookie(c_name) {
	if (document.cookie.length > 0)     {
		var c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1){
			c_start = c_start + c_name.length + 1;
			var c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}