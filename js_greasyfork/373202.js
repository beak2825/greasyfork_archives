// ==UserScript==
// @name         Steam PLUS增强插件（美化页面/自定义背景）
// @namespace    http://www.vernonshao.com
// @version      0.6.1
// @description  支持美化steam页面，修改个人主页背景（本地）
// @author       Vernon
// @match        *://*steamcommunity.com/*
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373202/Steam%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E7%BE%8E%E5%8C%96%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/373202/Steam%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E7%BE%8E%E5%8C%96%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%EF%BC%89.meta.js
// ==/UserScript==

//使用方法
//1.将下方“昵称”改成自己的昵称
//网址：https://steamcommunity.com/id/xxx 后面的xxx就是自己的昵称
//2.修改下方的图片网址可以替换个人主页背景

(function () {
	var nick = "vernonshao"; //修改这个位置的昵称
    var picurl = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/271260/3ce6ce41b6c395d9489899c7476376f160d7d769.jpg"; //个人背景修改这里

	//删除所有广告
	var x = document.getElementsByClassName("header_installsteam_btn");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}

	var str = location.href;
	var local = str.split("/")[4];
	if (local === nick) {
		//修改背景（本地）
		$(".profile_page").css('background-image', 'url('+ picurl +')');
        $(".profile_background_image_content").css('background-image', 'url('+ picurl +')');

	}

	//美化头像
	$(".playerAvatar").css('position', 'none');
	$(".profile_header_size").css('border', '3px solid #bfb88e');
	$(".profile_header_size").css('border-image', 'linear-gradient(#bfb88e,#dad1ad) 30 30');
	$(".profile_header_size").css('padding', '0px');
	$(".profile_header_size").css('background', 'none');

	//删除底部
	$(".footer_content").css('display', 'none');

})();