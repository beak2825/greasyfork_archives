// ==UserScript==
// @name           V2EX Pro+
// @description    为V2EX添加自动签到、新标签页打开、替换站内搜索、提醒所有人、楼中楼、自动解析图片链接等功能, 来自@yjxjn
// @icon           https://i.loli.net/2020/03/13/DMA2TbVNUwyoFcQ.jpg
// @author         vlor
// @include        https://*.v2ex.com/*
// @include        https://v2ex.com/*
// @version        2.0.3
// @grant          GM_addStyle
// @license        MIT
// @namespace      https://greasyfork.org/users/457965
// @homepageURL    https://greasyfork.org/users/457965
// @downloadURL https://update.greasyfork.org/scripts/456044/V2EX%20Pro%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/456044/V2EX%20Pro%2B.meta.js
// ==/UserScript==

(function (){
    GM_addStyle(`

        .cell .cell tr > td:first-child {
            width: 10px !important;
        }
        .cell .cell tr > td:nth-child(2) {
            width: 5px !important;
        }

        .cell .cell {
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 10px;
            border-top: 1px solid var(--box-border-color);
        }

        .cell .cell:last-child {
            padding-bottom: 0px;
        }

        .cell .cell .avatar {
            margin-left:-40px;
        }
        .reply_content > a > img {
            max-width: 95%
        }
    `)
})();


//移动端网页转换为PC版
(function (){
    var url = location.href;
    if (url.indexOf("/amp/") > 0) {
        var url1 = url.replace("/amp/", "/");
        var url2 = url1.slice(url1.indexOf("/t/") + 1).split('/')
        // console.log(location.protocol+"//www.v2ex.com/t/"+url2[1])
        location.replace(location.protocol+"//www.v2ex.com/t/"+url2[1]);
    }
    var nowurl = location.pathname;
    if (nowurl == "/" || nowurl.substr(0, 6) == "/?tab=" || nowurl.substr(0, 4) == "/go/" || nowurl == "/recent") {
        $("span.item_title a").attr("target", "_blank");
    }
})();

//替换为SOV2EX搜索  TODO 没时间，哪天整
(function() {
  function exec() {
    window.dispatch = function () {
      var value = document.getElementById('search').value
      if ( value) {
        var url = "https://www.sov2ex.com/?q=" + encodeURIComponent(value);
        if (window.open) {
          window.open(url + '&sort=created', '_blank')
        } else{
          location.href = url
        }
        return false
      }
      return false
    }
  }
  window.addEventListener('load', exec, false)
})();


//自动签到 代码来自caoyue@v2ex
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

	loadAndExecute("//lib.sinaapp.com/js/jquery/2.0/jquery.min.js", function() {
			if ( !$("a[href='/signup']").length && !$("a[href='/signin']").length && document.body.innerHTML.indexOf(";<\/span> 创建新回复<\/div>") == -1 ) {
					var uid=$.find('a[href^="/member/"]')[0].innerHTML;//用户名
					var dateinfo=new Date().getUTCDate();//获得GMT时间今天几号
					var SigninInfo=uid + ":" + dateinfo + "";
					var daily = $('input[id="search"]');
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

//标记楼主  代码来自ejin
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
		document.getElementById("reply_content").parentNode.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+allname+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+allname+"\"}'>@所有人</a>";
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
            && !/<img\s/i.test(link.innerHTML) && link.href.indexOf("v2ex.com/tag")==-1){
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
			image.src=image.src + "?";
        }
    }
})();

//V2EX帖子盖楼显示
(function() {


    //楼层
    var a = $('div.cell > table > tbody > tr > td:nth-child(3) > div.fr > span').get().map(i=>i.innerHTML);
    //回复内容
    var b = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content').get().map(i=>i.innerHTML);
    var c = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a').get().map(i=>i.innerHTML);

    var d = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content');
    var m = $('#Main > div:nth-child(4) > div[id].cell');

    var e = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a');
    var x = $('#Main > div:nth-child(2) > div.header > small > a')[0].innerHTML;
    var loginUser = $('#Rightbar > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(3) > span > a')
    loginUser = loginUser.length ? loginUser[0].innerHTML :null ;

    let i = 1;
    while(i< m.length){

        if( c[i] == x )
        {
            e[i].setAttribute('style','color:blue');
        }
        else if( c[i] == loginUser )
        {
            e[i].setAttribute('style','color:purple');
        }

        if(b[i].match("楼上")){
            d[i-1].append(m[i]);
        }

        for(var j=i-1;j>=0;j--){
            if(b[i].match(c[j])){
                d[j].append(m[i]);
                break;
            }
        }
        i++;
    }
})();