// ==UserScript==
// @name         智慧🤫HuangZhi🤫理性刷课
// @version      0.2
// @namespace    http://tampermonkey.net/
// @description  try to take over “智慧黄职” !( ⚠ 反对不理性的刷课行为，理不理性，你品😄，你细品😄)
// @author       bellamy.nh
// @match        http://61.136.241.22/suite/onlineLearningAdmin/onlineLearningAdminView.do?feature=onlineLearing&action=learingBKSecondContent&courseKey=*
// @match        http://61.136.241.22/suite/solver/classView.do?feature=courseSite&action=showCourseContent&structureKey=*
// @grant        none
// @icon         http://61.136.241.22/suite/template/space/common/logohere.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @downloadURL https://update.greasyfork.org/scripts/401711/%E6%99%BA%E6%85%A7%F0%9F%A4%ABHuangZhi%F0%9F%A4%AB%E7%90%86%E6%80%A7%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/401711/%E6%99%BA%E6%85%A7%F0%9F%A4%ABHuangZhi%F0%9F%A4%AB%E7%90%86%E6%80%A7%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';


	$("<link>")
		.attr({
			rel: "stylesheet",
			type: "text/css",
			href: "https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/layer.min.css"
		})
		.appendTo("head");

	const info =
		`<p style="color:red ; font-weight:900 ; font-size:21px">脚本声明</p><hr>
         <p style="font-weight:700; font-size:17px">本脚本《智慧🤫HuangZhi🤫理性刷课》是 <a href="https://greasyfork.org/" style="color:blue">Greasy Fork</a> 上一个完全免费的脚本（并不鼓励无脑刷课行为）</p><hr>
         <p style="font-weight:700; font-size:15px">严禁用户未经作者同意私自兜售本脚本，谋取私利，损害用户体验及脚本作者的权益</p><hr>
         <p style="font-weight:800; font-size:19px ; color:orange">望知悉</p>`;

	let i = layer.alert(
		info, {
			icon: 0
		},
		function(index) {
			
			j$(function() {
				let doIt = confirm("这个页面可以用哟 😊😀\n\n ⚠ 反对不理性的刷课行为，你确定是在理性刷课吗？\n\n  还是... (哼，不听你的😕)");
				if (doIt)
					run();
				else
					alert("为你个点赞👍，要继续努力哟！！！🤞");
			});
			layer.msg('感谢使用！');
			layer.close(index);
		});

	layer.title('声明', i);


	let keyArr = []; 
	let timer;
	let count = 0;
	let interval;
	let offset = 477;
	let srcInterval = 600000 + offset;
	let sendInterval = 60000; 



	function run() {
		var tags = j$(".tabCont");
		for (let t of tags) {
			console.log(t.id);
			let key = t.id.split("_")[1];
			keyArr.push(key);
			console.log(keyArr);
		}
		alert("本页面总共需要的挂机时间为： " + ((srcInterval - offset) * keyArr.length) / 60000 + " 分钟；\n\n 请等待结束提示！");
		setTimeout(clearTimer, 0);
		interval = window.setInterval(clearTimer, srcInterval); 
	}

	function sendAction(k) {
		saveLearnDuration();
		saveResourceDuration(k);
		console.log("key: " + k + " has been sent ");
	}

	function _sendAction(k) { 
		return function() {
			sendAction(k);
		}
	}

	function clearTimer() {
		console.log("everytime： timer:" + timer + " delTimer: " + delTimer);
		
		clearInterval(timer); 
		if (count < keyArr.length) {
			console.log("count:" + count + " key:" + keyArr[count] + "开始了");
			timer = window.setInterval(_sendAction(keyArr[count]), sendInterval); 
		} else {
			clearInterval(interval); 
			clearInterval(timer); 
			console.log("Over: timer:" + timer + " delTimer: " + delTimer);
			alert("共处理了" + keyArr.length + "个可被执行的资源, 现已停止，即将刷新页面！😊");
			window.location.reload();
		}
		count++;
	}


})();