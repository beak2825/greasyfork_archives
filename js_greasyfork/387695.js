// ==UserScript==
// @name         知乎屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在问题的答案列表中剔除掉那些在黑名单中的用户攥写的答案
// @author       pythonnoob
// @include      *.zhihu.com/*
// @grant        none
//@require        http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/387695/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/387695/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function() {
        var inputs = document.getElementsByClassName('Input')
        for( var i = 0, len = inputs.length; i < len; i++){
            var inpt = inputs[i]
            inpt.placeholder=""
        }
    },100)
	const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
	var answerClassName = "List-item"
	var answerContentClassName = "ContentItem AnswerItem"
	var blockedUsersList = []
	var blockedListReady = false
	var blockedUserURL = "https://www.zhihu.com/api/v3/settings/blocked_users"
	var GetBlockedUser = function() {
		$.ajax({
			url:blockedUserURL,
			data:null,
			type:'get',
			success:function(res){
				var result = JSON.parse(res);
				if (result.data.length != 0) {
					for( var s = 0, lenc = result.data.length; s < lenc; s++){
						blockedUsersList.push(result.data[s].name)
					}
				}
				if (!result.paging.is_end) {
					blockedUserURL = result.paging.next.replace("https://www.zhihu.com/settings", "https://www.zhihu.com/api/v3/settings")
					GetBlockedUser()
				} else {
					blockedListReady = true
					console.log("屏蔽列表获取成功：", blockedUsersList)
				}
			}
		}
		);
	}
    GetBlockedUser()
	var lastAnswersAmount = 0
	var cleaning = false
    var clean = async function() {
		cleaning = true
		var HavaUndefined = true
		while (HavaUndefined) {
			if (blockedListReady == false) {
				await sleep(100)
				continue
			}
			var answers = document.getElementsByClassName(answerContentClassName)
			var removedAnswersAmount = 0
			if (lastAnswersAmount != answers.length) {
				lastAnswersAmount = answers.length
				console.log("开始查找需要屏蔽的内容...")
				console.log("找到了", answers.length, "个答案")
				for( var i = 0, len = answers.length; i < len; i++){
					var answer = answers[i]
					if (answer == undefined) {
						console.log("答案未定义，跳出循环")
						break
					}else {
						HavaUndefined = false
					}
                    if (answer.innerHTML.indexOf("本回答节选自盐选专栏")!=-1) {
                        console.log("该答案是盐选内容，删除...")
							answer.parentNode.parentNode.removeChild(answer.parentNode)
							removedAnswersAmount++
							continue
                    }
					var dataset = answer.getAttribute("data-zop")
					if (dataset == null) {
						console.log("没有获取到data-zop，跳过")
						continue
					}
					for( var b = 0, lenb = blockedUsersList.length; b < lenb; b++) {
						if (dataset.indexOf(blockedUsersList[b])!=-1){
							console.log("该答案是屏蔽列表中", blockedUsersList[b], "编写的，删除...")
							answer.parentNode.parentNode.removeChild(answer.parentNode)
							removedAnswersAmount++
							continue
						}
					}
				}
				if (removedAnswersAmount == 0) {
					console.log("答案中没有找到屏蔽列表中的作者的答案")
				} else {
					console.log("答案中找到了",removedAnswersAmount,"个屏蔽列表中的作者的答案，已删除")
                    clean()
				}
			}
			await sleep(100)
		}
		cleaning = false
	}
    window.setTimeout(clean, 0);
	window.addEventListener('scroll',function(e) {
		if (!cleaning) {
			clean()
		}
	});
})();