// ==UserScript==
// @name 中山会计网上继续教育平台刷课zswlxy
// @namespace Violentmonkey Scripts
// @match https://www.zswlxy.com.cn/*
// @description 中山会计继教刷课
// @version  1.00
// @author  Cosil
// @grant GM_setValue
// @grant GM_getValue
// @icon https://www.zswlxy.com.cn/kjwx/webassets/css/images/zxlogin.png
// @downloadURL https://update.greasyfork.org/scripts/390367/%E4%B8%AD%E5%B1%B1%E4%BC%9A%E8%AE%A1%E7%BD%91%E4%B8%8A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BEzswlxy.user.js
// @updateURL https://update.greasyfork.org/scripts/390367/%E4%B8%AD%E5%B1%B1%E4%BC%9A%E8%AE%A1%E7%BD%91%E4%B8%8A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BEzswlxy.meta.js
// ==/UserScript==
$(function() {

	if (location.pathname.search('toStudy') > -1) { //toStudy页面
		var ccg = GM_getValue("ccg")
		playerKZ.popUp = function() {}; //使题目弹窗方法失效
		player.on('ended', function() { //重写onEnded
			console.log('结束播放');
			$(".global_top_label_other:contains(学习课程)").click() //退回toCourse界面
		});
		setTimeout(function() {
			//todo:errorCode
			player.play(); //开始播放
			player.mute(); //静音
			var interval = setInterval(function() {
				if (player.getDuration() > 0) {
					var startPoint = parseInt(player.getDuration() * ccg);
					if (startPoint > 30) {
						startPoint -= 30;
					} //预留30s，防止时长不足
					player.seek(startPoint * ccg - 20); //根据比例seek
					clearInterval(interval);
				}
			}, 500);
		}, 1000); //延时1秒进行，确保加载防止error
	}

	if (location.pathname.search('toCourse') > -1) { //toCourse页面
		var lessons = $("tr:contains(继续学习)");
		if (lessons.length < 1) {
			lessons = $("tr:contains(开始学习)")
		}
		var next = $(lessons[0]).find("a");
		if (next == null) {
			alert("本课程学习完毕，请进行考试！");
			return;
		}
		GM_setValue("ccg", $(lessons[0]).find("span")[0].innerHTML / $(lessons[0]).find("span")[1].innerHTML); //已学时长比例
		next.click();
	}

	//todo:已购买的年度科目跳转
	/*function getUrlParam(name) {//获得url参数
	    var param = location.href.match("(?<=" + name + "=).*?(?=&|$)")[0];
	    return param == null ? null : param
	}*/
})
