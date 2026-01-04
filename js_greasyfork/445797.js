// ==UserScript==
// @name			i文理位置修改
// @namespace		https://www.Bonnie-Ran.com
// @version			0.2.0
// @description		位置修改，仅适用i文理App的健康打卡和晚寝签到
// @author			Bonnie-Ran
// @match			http://plat1.luas.edu.cn/studentwork/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/445797/i%E6%96%87%E7%90%86%E4%BD%8D%E7%BD%AE%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/445797/i%E6%96%87%E7%90%86%E4%BD%8D%E7%BD%AE%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 加载微信配置文件
	// function LoadWxAddress() {
		// iPortal.getLocation().getCurrentPosition(function (d) {
			// //赋值
			// CovertPoint(d.latitude, d.longitude);
		// }, function (e) {
			// myjquery.alert('获取定位信息失败！', '提示!', function () {
				// msgalertmsg(true, false);
				// setTimeout(
					// function () {
						// window.location.href = "/studentwork/DormitoryStudent/index";
				// },0);
			// });
		// })
	// }

	// hook js_location变量
	// var input = document.createElement("input"); //创建一个输入框
	// button.textContent = "一键点赞评论"; //按钮内容
	// button.style.width = "90px"; //按钮宽度
	// button.style.height = "28px"; //按钮高度
	// button.style.align = "center"; //文本居中
	// button.style.color = "white"; //按钮文字颜色
	// button.style.background = "#e33e33"; //按钮底色
	// button.style.border = "1px solid #e33e33"; //边框属性
	// button.style.borderRadius = "4px"; //按钮四个角弧度	
	// button.addEventListener("click", clickBotton) //监听按钮点击事件
	// console.log('脚本加载成功！');
	// document.getElementById("location").value = document.getElementById("Bonnie-Ran").value;
	// document.getElementById("location").value = "甘肃省兰州市城关区雁园街道兰州文理学院(北校区)6号公寓楼";

	// hook js_LoadWxAddress函数
	// let LoadAddress = LoadWxAddress
	// div.style.margin = "0 auto";
	// var input_resLnglatLon = document.createElement("input"); //创建一个input对象
	// var input_resLnglatLat = document.createElement("input"); //创建一个input对象
	// var button_submit = document.createElement("button"); //创建一个input对象
	// button_submit.textContent = "转换地址"; //按钮内容
	// button_submit.addEventListener("click", LoadWxAddress) //监听按钮点击事件
	// input_resLnglatLon.id = "resLnglatLon";
	// input_resLnglatLat.id = "resLnglatLat";
	// input_resLnglatLon.placeholder = "输入经度，如: 36.066472";
	// input_resLnglatLat.placeholder = "输入纬度，如: 103.896437";
	// input_resLnglatLon.style.width = "100%";
	// input_resLnglatLat.style.width = "100%";
	// input.style.height = "20px";
	// input.style.text-align = "center"; //文本居中
	// input_resLnglatLon.style.color = "black"; //文字颜色
	// input_resLnglatLon.style.background = "#f9f9f9"; //底色
	// input_resLnglatLon.style.border = "1px solid black"; //边框属性
	// input_resLnglatLon.style.borderRadius = "4px"; //四个角弧度
	// input_resLnglatLat.style.color = "black"; //文字颜色
	// input_resLnglatLat.style.background = "#f9f9f9"; //底色
	// input_resLnglatLat.style.border = "1px solid black"; //边框属性
	// input_resLnglatLat.style.borderRadius = "4px"; //四个角弧度
	// var add_input = document.getElementsByClassName('bar bar-nav')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
	// add_input.appendChild(input_resLnglatLon); //把输入框加入到子节点中
	// add_input.appendChild(input_resLnglatLat);
	// add_input.appendChild(button_submit);
	// add_input.appendChild(div); //把输入框加入到div之后
	// var resLnglatLon = $("#resLnglatLon").val();
	// var resLnglatLat = $("#resLnglatLat").val();

	var add_div = document.getElementsByClassName('item-title label')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
	if(add_div != null) {
		var div = document.createElement("div");
		div.innerHTML='请在15s内输入经纬度，15s后将自动转换地址，届时可点击签到: <input id="resLnglatLon" placeholder="输入经度，如: 36.066472"><input id="resLnglatLat" placeholder="输入纬度，如: 103.896437">';
		add_div.before(div); //把输入框加入到div之后
		// function clickButton() {
			// setTimeout(function(){
				// var resLnglatLon = document.getElementById("resLnglatLon").value;
				// var resLnglatLat = document.getElementById("resLnglatLat").value;
				// // 赋值 指定位置: 甘肃省兰州市城关区雁园街道雁北路326号兰州文理学院(北校区)
				// // CovertPoint(36.066472, 103.896437);
				// CovertPoint(resLnglatLon, resLnglatLat);
			// },0);// setTimeout 0秒后执行
		// }
		LoadWxAddress = function () {
			setTimeout(function(){
				var resLnglatLon = document.getElementById("resLnglatLon").value;
				var resLnglatLat = document.getElementById("resLnglatLat").value;
				// 赋值 指定位置: 甘肃省兰州市城关区雁园街道雁北路326号兰州文理学院(北校区)
				// CovertPoint(36.066472, 103.896437);
				CovertPoint(resLnglatLon, resLnglatLat);
			},15000);// setTimeout 15秒后执行
		}
	} else {
		document.getElementById("location").type = "";
		document.getElementById("location").style.width = "100%";
		document.getElementById("location").style.color = "black";
		document.getElementById("location").style.background = "#f9f9f9";
		document.getElementById("location").style.border = "1px solid red";
		document.getElementById("location").placeholder = "输入打卡地址，如: 甘肃省兰州市城关区雁北街道400号兰州文理学院(北校区)6号公寓楼";
	}

	// var modlocation = document.location
	// var val = "甘肃省兰州市城关区雁园街道兰州文理学院(北校区)";
	// Object.defineProperty(document, 'location', {
		// get: function() {
			// return location;
		// },
		// set: function(val) {
			// location = val;
		// }
	// });

})();
