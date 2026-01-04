// ==UserScript==
// @name         哔哩哔哩Mylist助手
// @namespace    undefined
// @version      0.1.4
// @description  使哔哩哔哩MyList功能再次可用，可创建MyList列表或编辑列表及列表中视频。
// @author       点灯 diandeng
// @match        *://member.bilibili.com/*
// @match        *://www.bilibili.com/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @icon 		 https://www.bilibili.com/favicon.ico
// @supportURL   http://space.bilibili.com/21219957
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33706/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9Mylist%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/33706/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9Mylist%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
	'use strict';
	//防止网页白底蓝字
	detectUrl();

	function detectUrl() {
		var url = window.location.host;
		if("https:" == document.location.protocol && "member.bilibili.com" == url && "/" == window.location.pathname) {
			url = 'http://' + url;
			window.location.href = url;
		}
	}
	//屏蔽消息框和遮盖
	$("head").append('<style type="text/css">.messagebox {display: none;}.wnd-mask {display: none;} </style>');
	//监听url中hash的变化:防止元素动态生成时无法添加事件
	window.onhashchange = function() {
		if("member" == detectPage()) {
			pageInit();
		}
	};
	//初始化
	$(function() {
		everyInit();
		pageInit();
	});
	//全局初始化：上导航栏添加"旧版主页"标签
	function everyInit() {
		//更新：修复了一个导航栏无法显示"旧版主页"的BUG
		if($(".z_top .z_top_nav ul").length > 0) {
			$(".z_top .z_top_nav ul").append('<li class="old-home"><a class="i-link" target="_blank" href="http://member.bilibili.com/#main" title="旧版主页">旧版主页</a></li>');
		}
	}
	//全局初始化
	function pageInit() {
		switch(detectPage()) {
			case "www":
				playInit();
				return;
			case "member":
				editInit();
				return;
		}
	}
	//检测页面
	function detectPage() {
		var a = window.location.host;
		var b = a.indexOf(".");
		return a.substring(0, b);
	}
	//mylist播放页初始化：修复"制作者"、添加"一键加入到稍后再看"按钮
	function playInit() {
		var mylistId = window.location.hash.substring(1);
		if(-1 !== window.location.pathname.indexOf("/mylist") && 0 === mylistisDeleted(mylistId)) {
			$.getScript("//www.bilibili.com/mylist/mylist-" + mylistId + ".js");
			var playInterval = setInterval(function() {
				var iframe = $("#menufra").contents();
				if(iframe.find("#description").length > 0 && iframe.find("#author a").length > 0) {
					iframe.find("#description").append('<br><a id="add-watchlater" href="javascript:;">一键加入到稍后再看</a>');
					iframe.find("#add-watchlater").click(function() {
						addWatchlater();
					});
					var mid = iframe.find("#author a").attr("href");
					var n = mid.indexOf("/", 10);
					var m = mid.length;
					mid = mid.substring(n + 1, m);
					iframe.find("#author a").text(getUserName(mid));
					clearInterval(playInterval);
				}
			}, 500);
		}
	}
	//旧版主页初始化：编辑mylist列表
	function editInit() {
		if(-1 !== window.location.hash.indexOf('#mylist_manage')) {
			var editInterval = setInterval(function() {
				if(-1 !== window.location.hash.indexOf('do=edit')) {
					if(-1 !== window.location.hash.indexOf('tab=addv')) {
						if($('#btn_avAddToList').length > 0) {
							$("#btn_avAddToList").unbind("click");
							$("#btn_avAddToList").click(function() {
								addVideo();
							});
							clearInterval(editInterval);
						}
					} else {
						if($('#btn_updateList').length > 0) {
							$("#btn_updateList").unbind("click");
							$("#btn_updateList").click(function() {
								editVideo();
							});
							clearInterval(editInterval);
						}
					}
				} else {
					if($('#btn_create_mylist').length > 0) {
						$("#btn_create_mylist").unbind("click");
						$("#btn_create_mylist").click(function() {
							addMylist();
						});
						clearInterval(editInterval);
					}
				}
			}, 500);
		}
	}
	//添加 Mylist 列表
	function addMylist() {
		var text = $('#mylist_create').serialize();
		$.ajax({
			url: "//member.bilibili.com/mylist_manage.do?do=add&output=json",
			type: "POST",
			dataType: "json",
			data: text + "&csrf=" + getCookie("bili_jct"),
			success: function(data) {
				if(data === null) {
					alert("未知的错误");
					return;
				}
				if(data.code == -1 || data.code === 0) {
					alert(data.msg);
				} else {
					alert(data);
				}
			},
			error: function() {
				alert("网络错误,请稍后重试");
			}
		});
	}
	//添加视频到 Mylist 列表
	function addVideo() {
		var text = $("#frm_addtoList").serialize();
		$.ajax({
			url: "//member.bilibili.com/mylist_manage.do?do=addstow&output=json",
			type: "POST",
			dataType: "json",
			data: text + "&csrf=" + getCookie("bili_jct"),
			success: function(data) {
				if(data === null) {
					alert("未知的错误");
					return;
				}
				if(data.code == -1 || data.code === 0) {
					alert(data.msg);
				} else {
					alert(data);
				}
			},
			error: function() {
				alert("网络错误,请稍后重试");
			}
		});
	}
	//编辑 Mylist 列表的视频优先级
	function editVideo() {
		var lid = $(".next-title span:first-of-type").text();
		var text = $("#frm_myList").serialize();
		lid = lid.substring(1, lid.length);
		$.ajax({
			url: "//member.bilibili.com/mylist_manage.do?do=editstow&lid=" + lid + "&output=json",
			type: "POST",
			dataType: "json",
			data: text + "&csrf=" + getCookie("bili_jct"),
			success: function(data) {
				if(data === null) {
					alert("未知的错误");
					return;
				}
				if(data.code == -1 || data.code === 0) {
					alert(data.msg);
				} else {
					alert(data);
				}
			},
			error: function() {
				alert("网络错误,请稍后重试");
			}
		});
	}
	//将 Mylist 列表的视频添加到稍后再看
	function addWatchlater() {
		var n = playlist.length;
		for(var i = 0; i < n; i++) {
			$.ajax({
				url: "//api.bilibili.com/x/v2/history/toview/add",
				type: "POST",
				dataType: "json",
				async: false,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/*n - i - 1是为了倒序添加稍后再看，使顺序与 Mylist 列表一致*/
				data: "aid=" + playlist[n - i - 1].aid + "&jsonp=jsonp&csrf=" + getCookie("bili_jct")
			});
		}
	}
	//判断mylist列表是否有效
	function mylistisDeleted(mylist) {
		var o;
		$.ajax({
			type: "GET",
			async: false,
			url: "//www.bilibili.com/mylist/mylist-" + mylist + ".js",
			data: "",
			success: function() {
				o = 0;
			},
			error: function() {
				o = 1;
			}
		});
		return o;
	}
	//获取指定mid的用户名称
	function getUserName(mid) {
		var userName;
		$.ajax({
			url: "//space.bilibili.com/ajax/member/GetInfo",
			type: "POST",
			async: false,
			dataType: "json",
			data: "mid=" + mid + "&csrf=" + getCookie("bili_jct"),
			success: function(data) {
				userName = data.data.name;
			}
		});
		return userName;
	}
	//获取Cookie
	function getCookie(e) {
		var o, t;
		var n = document,
			c = decodeURI;
		return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="), -1 != o) ? (o = o + e.length + 1, t = n.cookie.indexOf(";", o), -1 == t && (t = n.cookie.length), c(n.cookie.substring(o, t))) : "";
	}
})();