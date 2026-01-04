// ==UserScript==
// @name         百度搜索优化插件
// @description  显示原始网址，移除重定向，针对网址进行过滤。去广告，重编排搜索结果的显示版式。
// @create       2019-07-21
// @lastmodified 2019-07-21
// @author       Lemoncent
// @connect      www.baidu.com
// @include      *://www.baidu.com/*
// @version      0.2.2
// @license      GNU GPL v3
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/319276
// @downloadURL https://update.greasyfork.org/scripts/387670/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/387670/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
	'use strict';

    // 屏蔽网站
	var blockList = ['baijiahao.baidu.com', 'jingyan.baidu.com', 'sh.58.com'];

    // 是否屏蔽右边百度搜索热点
    var is_block_hot_news = false;

	setInterval(function(){
		var domList = document.querySelectorAll('h3.t > a, .c-row > a');

		for (var i = 0; i < domList.length; i++) {
			var a = domList[i];
			var ahref = a.href;

			if (a != null && a.getAttribute("parseRedirectStatus") == null) {
				a.setAttribute("parseRedirectStatus", "0");

				if (ahref.indexOf("www.baidu.com/link") > -1) {
					(function (ahref) {
						var url = ahref.replace(/^http:$/, 'https:');

						var xhr = GM_xmlhttpRequest({
							extData: ahref,
							url: url,
							headers: {"Accept": "*//*", "Referer": ahref.replace(/^http:/, "https:")},
							method: "GET",
							timeout: 5000,
							onreadystatechange: function (response) {
								if (response.responseHeaders.indexOf("tm-finalurl") >= 0) {
									var realUrl = getRegx(response.responseHeaders, "tm-finalurl\\w+: ([^\\s]+)");
									if (realUrl == null || realUrl == '' || realUrl.indexOf("www.baidu.com/search/error") > 0) return;

									doParseRedirectStatus(xhr, ahref, realUrl);
								}
							}
						});
					})(ahref);
				}
			}
		}
	}, 100);

	var doParseRedirectStatus = function (xhr, ahref, realUrl) {
		if (realUrl == null || realUrl == "" || typeof(realUrl) == "undefined") return;

		if (realUrl.indexOf("www.baidu.com/link") < 0) {
			try {
				var domList = document.querySelectorAll("a[href*='" + ahref + "']");
				for (var i = 0; i < domList.length; i++) {
					var a = domList[i];

					// Reset real url.
					a.setAttribute("parseRedirectStatus", "1");
					a.setAttribute("href", realUrl);

					// Hide block list.
					var node2 = a.parentNode.parentNode;
					if (node2.className.indexOf("c-container") >= 0) {
						for(var j = 0; j < blockList.length; j++){
							if(getHost(realUrl) == blockList[j]){
								console.log('Block Host Hit', realUrl);

								node2.style = "display:none";
							}
						}
					}

					var node1 = a.parentNode;
					if (node1.className.indexOf("c-row") >= 0) {
						for(var k = 0; k < blockList.length; k++){
							if(getHost(realUrl) == blockList[k]){
								console.log('Block Host Hit', realUrl);

								node1.style = "display:none";
							}
						}
					}

					// Show url.
					if (a.className.indexOf("c-showurl") >= 0) {
						if(a.querySelector('span') != null){

							if(realUrl.length < 40){
								a.innerHTML = realUrl;
							}else{
								a.innerHTML = realUrl.substring(0, 40) + '...&nbsp;';
							}
						}
					}
				}
				xhr.abort();
			} catch (e) {

			}
		}
	};

	function getRegx(string, reg) {
		var RegE = new RegExp(reg);
		try {
			return RegE.exec(string)[1];
		} catch (e) {
			return '';
		}
	}

	function getHost(string) {
		return string.replace(/(\/[^/]*|\s*)/, "").replace(/<[^>]*>/g, "").replace(/https?:\/\//g, "").replace(/<\/?strong>/g, "").replace(/<\/?b>/g, "").replace(/<?>?/g, "").replace(/( |\/).*/g, "");
	}



    // 获取当前地址url
    var url = location.href;
    // 正则匹配首页部分
    var baidusearch = /www.baidu.com/i;
    if (baidusearch.test(url)) {
        function clearAD() {

            // 搜索结果推广广告
            $(".ec_tuiguang_ppouter").parents().map(function() {
                var thisid = $(this).attr("id");
                var id = new RegExp('300');
                if (thisid != undefined && thisid != "undefined") {
                    if (id.test(thisid)) {
                        $("#" + thisid).remove();
                    }
                }
            });
            // 百度推广广告
            $(".c-abstract").parents().map(function() {
                var thisid1 = $(this).attr("id");
                var id1 = new RegExp('400');
                var id2 = new RegExp('500');
                if (thisid1 != undefined && thisid1 != "undefined") {
                    if (id1.test(thisid1) || id2.test(thisid1)) {
                        $("#" + thisid1).remove();
                    }
                }
            });

            // 列表广告
            $("span.m").map(function() {
                if ($(this).text() == "广告") {
                    $(this).parent().parent().remove();
                }
            });
            // 列表广告
            $("span").map(function() {
                if ($(this).text() == "广告") {
                    $(this).parent().parent().remove();
                }
            });


            if (is_block_hot_news){
                // 首页右边广告
                $(".ad-block").parent().parent().parent().remove();
                if ($("#content_right").children("div").get(0) != undefined && $("#content_right").children("div").get(0) != "undefined") {
                    $($("#content_right").children("div").get(0)).remove();
                };
                // 百度右边整体隐藏
                $(".hit_top_new").remove();
                $("#content_right").remove();
                $("#wrapper_wrapper").css("background-color", "#F5F5F5");
                }

            // // 登录首页
            // $("#s_top_wrap").remove();
            // $("#s_upfunc_menus").remove();
            // $("#u_sp").remove();
            // $("#bottom_container").remove();
            // // 未登录首页
            // $("#qrcode").remove();
            // $("#ftCon").remove();
            // // 搜索页-反馈
            // $("#foot").remove();

            // 重新编排搜索结果页面style
            $("#wrapper_wrapper").css("background-color", "#F5F5F5");
            $(".result ").css("background-color", "#fff");
            $(".result ").css("padding", "20px");
            $(".result ").css("border-radius", "5px");
            $(".result ").css("box-shadow", "0 0 20px 2px rgba(0, 0, 0, .1)");
            $(".result ").css("border-collapse", "separate");

            $("#rs").css("background-color", "#F5F5F5");
            $(".result-op ").css("background-color", "#fff");
            $(".result-op ").css("padding", "20px");
            $(".result-op ").css("border-radius", "5px");
            $(".result-op ").css("box-shadow", "0 0 20px 2px rgba(0, 0, 0, .1)");
            $(".result-op ").css("border-collapse", "separate");
            }
        // 启动定时器
        setInterval(function() {
            clearAD();
        }, 50);
    }
    
    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }
    addStyle("a{text-decoration:none !important}");
    addStyle("em{text-decoration:none !important}");


})();

