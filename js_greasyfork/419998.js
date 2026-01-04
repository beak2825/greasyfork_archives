// ==UserScript==
// @name         斗鱼批量回复，批量点赞
// @namespace    https://steamcommunity.com/id/GarenMorbid/
// @version      1.0
// @description  斗鱼一键批量回复，批量点赞
// @author       Garen
// @match        https://yuba.douyu.com/user/main/*
// @match        https://yuba.douyu.com/group/*
// @downloadURL https://update.greasyfork.org/scripts/419998/%E6%96%97%E9%B1%BC%E6%89%B9%E9%87%8F%E5%9B%9E%E5%A4%8D%EF%BC%8C%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/419998/%E6%96%97%E9%B1%BC%E6%89%B9%E9%87%8F%E5%9B%9E%E5%A4%8D%EF%BC%8C%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    // 获取添加按钮的父元素
    var parentNode = document.getElementsByClassName('css-navRight-1LD25');
    // 创新批量评论按钮
    var reviewsUpBtn = document.createElement("div");
    // 给批量评论按钮添加各种样式与排版
    reviewsUpBtn.setAttribute("style","float:right;margin-top:5%;");
    reviewsUpBtn.innerHTML = '<div id="reviewsUpBtn" style="border-radius:2px;border:0;padding:1px;display:inline-block;cursor:pointer;text-decoration:none!important;color:#fff!important;background:#acb5bd;background:-webkit-linear-gradient(top,#acb5bd 5%,#414a52 95%);background-color: #21D4FD;background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);"><span style="line-height: 22px;margin:0 10px 0 10px;font-size:13px;">批量评论和点赞</span></div>';
    // 将批量评论按钮添加到页面
    parentNode[0].appendChild(reviewsUpBtn);
    // 绑定批量评论点击事件
	document.getElementById('reviewsUpBtn').onclick = function batchReviews(){
		// 让用户输入需要提交的随机评论
		var msg = "请输入你需要提交的随机评论，多个以中文逗号分隔。";
		var value = prompt(msg, "[666]，感謝分享，支持支持，[拉轰]，[开车]，[鲨鱼反向烟]，[弱鸡棒棒哒]，[鲨鱼好样的]，[鲨鱼点赞]");
		if (value != "") {
			var reviews = value.split("，");
			// 获取批量需要批量评论的class
			var list = document.getElementsByClassName('wb_card-wbCardWrap-3zPdt');
			// 满足条件的评论，当前设定是评论没满7条的评论新增评论
			var qualifiedComments = [];
			// 循环遍历提交评论
			var size = list.length;
            if (size > 0) {
				// 先批量点赞
				for(var i = 0; i < size; i++){
					var thumbsUp = $(list[i]).find(".wb_handle-wbHandleIconPrize-1VkT2");
					// 排除掉已经点过的赞
					if (!("wb_handle-itemSep-3FePA wb_handle-active-1Vpf_" === thumbsUp.parent().attr("class"))) {
						thumbsUp.click();
					}

					// 处理0个赞的情况
					var commentCount = $(list[i]).find(".wb_handle-wbHandleIconComment-3_-Jh").next("em").text();
					if ("评论" === commentCount || commentCount === null || commentCount === undefined || commentCount === "") {
						commentCount = "0";
					}

					// 默认评论小于8的评论才会随机提交
					if (parseInt(commentCount) < 8) {
						qualifiedComments.push(list[i]);
					}
				}

				console.log("%c 总共需要执行"  + qualifiedComments.length + "条评论提交。", "background-color: #8EC5FC;background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);color: #1F2D35;");
				for(var j = 0; j < qualifiedComments.length; j++) {
					// 拼凑提交参数
					var index = Math.floor(Math.random() * reviews.length);
					commitReview($(qualifiedComments[j]), j, reviews[index]);
				}
			}
         }
    }
})();

// 执行提交方法
function commitReview(obj, i, content) {
	// 获取文章标题用于后面提示
	var title = obj.find(".wb_card-wbPostTitle-1-wPX").attr("title");
	// 点击展开评论按钮
	var expandBtn = obj.find(".wb_handle-wbHandleIconComment-3_-Jh");
	expandBtn.click();
	// 获取提交评论按钮
	var commitBtn = obj.find(".common-editorPostBtn-3Ef2P");
	// 获取评论文本框
	var commitValue = obj.find(".common-editorText-3sply");

	return setTimeout(function() {
		commitValue.val(content);
		commitBtn.attr("data-disab", "0");
		commitBtn.click();
		console.log("【" + title + "】成功提交了一条评论：" + commitValue.val() + "，" + obj.attr("data-feedid"));
		expandBtn.click();
	}, (i + 1) * 3000);
}