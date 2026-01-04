// ==UserScript==
// @name                        V2EX增强插件
// @description         1.回复标记楼主ID 2.每天打开V2EX网站任意页面时自动领取签到的登陆奖励 3.回复时可@楼主 @所有人 4.召唤/呼叫管理员 5.链接自动转图片
// @namespace   v2exstrong
// @icon                        http://ww1.sinaimg.cn/large/4ec98f50jw1e85azvlnh9j206y06y3ye.jpg
// @author                      ejin
// @include        https://*.v2ex.com/*
// @include        https://v2ex.com/*
// @version                     2019.06.20
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387291/V2EX%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/387291/V2EX%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// 2019.06.20 可@楼主，更换JQuery库地址
// 2019.05.12 新浪图床的图片反防盗链
// 2017.05.16 由于存储数据出错，改变存储数据的方式
// 2016.09.21 修复发帖页面判断用户名出错的情况
// 2016.09.14 修正判断登录状态逻辑
// 2016.05.25 链接自动转图片
// 2016.05.21 新增召唤/呼叫管理员
// 2016.05.09 Webkit内核允许修改回复框高度
// 2016.04.12 在回复时可@所有人
// 2015.10.16 新增在回复中标记楼主
// 2015.03.22 尝试修正未知原因情况下导致的签到失败。
// 2015.02.07 解决JQuery库在某种情况可能会无法载入
// 2014.10.07 某种情况下会产生cookie重复赋值，增加清理补丁。
// 2014.10.06 cookie信息过期时间改为3天


//签到
(function(){
	var load, execute, loadAndExecute;
	load = function(a, b, c) {
			var d;
			d = document.createElement("script"), d.setAttribute("src", a), b != null && d.addEventListener("load", b), c != null && d.addEventListener("error", c), document.body.appendChild(d);
			return d;
	}, execute = function(a) {
			var b, c;
			typeof a == "function" ? b = "(" + a + ")();" : b = a, c = document.createElement("script"), c.textContent = b, document.body.appendChild(c);
			return c;
	}, loadAndExecute = function(a, b) {
			return load(a, function() {
					return execute(b);
			});
	};

	loadAndExecute("https://cdn.bootcss.com/jquery/2.0.0/jquery.min.js", function() {
			if ( !$("a[href='/signup']").length && !$("a[href='/signin']").length && document.body.innerHTML.indexOf(";<\/span> 创建新回复<\/div>") == -1 ) {
					var uid=$.find('a[href^="/member/"]')[0].innerHTML;//用户名
					var dateinfo=new Date().getUTCDate();//获得GMT时间今天几号
					var SigninInfo=uid + ":" + dateinfo + "";
					var daily = $('input[id="q"]');
					if (daily.length && localStorage.SigninInfo != SigninInfo ) {
							$.ajax({url:"/"});
							daily.val("正在检测每日签到状态...");
							$.ajax({
									url: "/mission/daily",
									success: function(data) {
											var awards = $(data).find('input[value^="领取"]');
											if (awards.length) {
													// daily.val("正在" + awards.attr("value") + "...");
													daily.val("正在领取今日的登录奖励......");
													$.ajax({
															url: awards.attr('onclick').match(/(?=\/).+?(?=\')/),
															success: function(data) {
																	daily.val("正在提交...");
																	var days=data.split("已连续登")[1].split(" ")[1];
																	if ( $('a[href="/mission/daily"]').length==1 ) {$('a[href="/mission/daily"]').parent().parent().fadeOut(3000);}
																	$.ajax({
																			url: "/balance",
																			success: function(data) {
																					function p(s) {return s < 10 ? '0' + s: s;} //自动补0
																					var date2="" + new Date().getUTCFullYear() + p(new Date().getUTCMonth()+1) +p(new Date().getUTCDate());
																					if (data.indexOf(date2+" 的每日登录奖励")!="-1") {
																							daily.val( "已连续领取" + days + "天，本次领到" + data.split("每日登录")[2].split(" ")[1] + "铜币" );
																							localStorage.SigninInfo = SigninInfo;
																					} else {
																							daily.val( "自动领取遇到意外，你可以试试手动领。" );
																					}
																			}
																	});
															},
															error: function() {
																	daily.val("网络异常 :(");
															}
													});
											}else{
													if (data.indexOf("已领取") != -1) {
															daily.val("今日奖励领取过了");
															localStorage.SigninInfo = SigninInfo;
													} else {
															daily.val("无法辩识领奖按钮 :(");
													}

											}
									},
									error: function() {
											daily.val("请手动领取今日的登录奖励!");
									}
							});
					} else {
							//console.log("");
					}
			}
	});
})();

//标记楼主
(function (){
	var uid=document.getElementById("Rightbar").getElementsByTagName("a")[0].href.split("/member/")[1];//自己用户名
	if (location.href.indexOf(".com/t/") != -1) {
		var lzname=document.getElementById("Main").getElementsByClassName("avatar")[0].parentNode.href.split("/member/")[1];
		var allname='@'+lzname+' ';
		var all_elem = document.getElementsByClassName("dark");
		for(var i=0; i<all_elem.length; i++) {
			if (all_elem[i].innerHTML == lzname){
				all_elem[i].innerHTML += " <font color=green>[楼主]</font>";
				}
			//为回复所有人做准备
			if ( uid != all_elem[i].innerHTML && all_elem[i].href.indexOf("/member/") != -1 && all_elem[i].innerText == all_elem[i].innerHTML && allname.indexOf('@'+all_elem[i].innerHTML+' ') == -1 ) {
				allname+='@'+ all_elem[i].innerHTML+' ';
			}
		}
	}

	if ( document.getElementById("reply_content") ) {
        document.getElementById("reply_content").parentNode.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+lzname+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n@"+lzname+"\"}'>@楼主</a> &nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+allname+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+allname+"\"}'>@所有人</a>";
		if ( document.body.style.WebkitBoxShadow !== undefined ) {
			//允许调整回复框高度
			document.getElementById("reply_content").style.resize="vertical";
		}
		document.getElementById("reply_content").style.overflow="auto";
		var magagers="@Livid @Kai @Olivia @GordianZ @sparanoid";
		document.getElementById("reply_content").parentNode.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+magagers+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+magagers+"\"}'>@管理员</a>";
	}
})();

// 图片链接自动转换成图片 代码来自caoyue@v2ex
(function (){
    var links = document.links;
    for (var i=0;i<links.length;i++){
        var link = links[i];
        if (/^http.*\.(?:jpg|jpeg|jpe|bmp|png|gif)/i.test(link.href)
            && !/<img\s/i.test(link.innerHTML)){
            link.innerHTML = "<img title='" + link.href + "' src='" + link.href + "' />";
        }
    }
})();
// 

//新浪图床的图片反防盗链
(function (){
    var images = document.images;
    for (var i=0;i<images.length;i++){
        var image = images[i];
        if ( image.src && image.src.indexOf(".sinaimg.cn")!=-1 &&image.src.indexOf(".sinaimg.cn")<13 ) {
			image.setAttribute("referrerPolicy","no-referrer");
			image.src=image.src;
        }
    }
})();
// 