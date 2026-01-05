// ==UserScript==
// @name        NGA+
// @namespace   NGA+@Byzod
// @description NGA 增强（隐藏未关注子版的帖子）
// @include     http://bbs.ngacn.cc/*
// @include     http://nga.178.com/*
// @include     http://bbs.nga.cn/*
// @include     http://club.178.com/*
// @include     http://bbs.bigccq.cn/*
// @version     2
// @license     WTFPL version 2 or later version; http://www.wtfpl.net/about/
// @grant       none
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/29921/NGA%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/29921/NGA%2B.meta.js
// ==/UserScript==

function NGAPlus(){
	'use strict';
	var self = this;
	
	// var uncheckedSubForumUrls = [];
	// 关注子论坛url列表
	var checkedSubForumUrls = [];
	
	// 获取已关注子论坛url列表
	this.GetUncheckedSubForumUrls = function(){
		var subForums = document.querySelectorAll("#sub_forums .b");
		subForums.forEach(
			(subForum) => {
				let subForumCheckbox = subForum.querySelector("input");
				let subForumUrl = subForum.querySelector("a");
				if(subForumCheckbox && subForumUrl && subForumCheckbox.checked === true){
					checkedSubForumUrls.push(subForumUrl.href);
				}
			}
		);
		// console.log("[NGA+]: 关注sub: " + checkedSubForumUrls.length + "个; 列表: %o", checkedSubForumUrls); // DEBUG
	};
	
	// 屏蔽未关注合集贴
	this.BanSubForumPosts = function(topicTable){
		var posts = topicTable.querySelectorAll(".topicrow");
		posts.forEach(
			(post) => {
				let titleadd2 = post.querySelector(".titleadd2>a");
				if(titleadd2 && !checkedSubForumUrls.includes(titleadd2.href)){
					post.hidden = true;
				}
			}
		);
	};
	
	// 注册屏蔽未关注合集贴事件
	this.RegisterBanSubForumsHandler = function(){
		var observeTarget = document.querySelector("#topicrows");
		var observer = new MutationObserver(
			()=>{
				self.BanSubForumPosts(observeTarget);
			}
		);
		var config = { childList: true };
		
		if(observeTarget){
			observer.observe(observeTarget, config);
		}
		// 先来一发
		self.BanSubForumPosts(observeTarget);
	};
	
	// BOOM!
	this.Boom = function(){
		self.GetUncheckedSubForumUrls();
		self.RegisterBanSubForumsHandler();
	};
}

var ngaBoom = new NGAPlus();
ngaBoom.Boom();