// ==UserScript==
// @name         广告杀手ADkiller
// @namespace    http://tampermonkey.net/
// @include      *//www.baidu.com/s*
// @include      *//*/*
// @description  删除百度搜索结果中的广告以及百家号的内容--删除其他网站的百度广告（百度网盟），这些广告常见于CSDN、网易、搜狐或其他一些垃圾新闻网站。
// @author       术与道
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @version	     0.12
// @connect      www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/382040/%E5%B9%BF%E5%91%8A%E6%9D%80%E6%89%8BADkiller.user.js
// @updateURL https://update.greasyfork.org/scripts/382040/%E5%B9%BF%E5%91%8A%E6%9D%80%E6%89%8BADkiller.meta.js
// ==/UserScript==

var version = "0.10";

// 运行
(function () {
	var domain =  document.domain;
    if (domain.indexOf("www.baidu.com")>-1) {
    	//去除右上方相关搜索图片
	    $("#container #con-ar div").first().hide();
	    //去除右方的推广链接
	    $(".layout").hide()
		clean_bjh();
	    clear_bdad();
    }else{
    	clean_ad();
    }
})();


function clean_ad(){
	var iframe_list = document.getElementsByTagName('iframe');
	for(var i = 0 ; i < iframe_list.length ; i++){
		if(iframe_list[i].src.indexOf("pos.baidu.com")>-1||iframe_list[i].src.indexOf("yylady.cn")>-1||iframe_list[i].src.indexOf("googleads.g.doubleclick.net")>-1){
			iframe_list[i].style.display = "none";
		}
	}
    //清除业界毒瘤 CSDN 广告
    if(document.domain.indexOf("csdn.net")>-1){
      document.querySelector('.mb8').style.display="none";
      document.querySelector('#kp_box_57').style.display="none";
      document.querySelector('#dmp_ad_58').style.display="none";
      $(".mb8").remove();
      $("#kp_box_57").remove();
      $("#dmp_ad_58").remove();
      $(".recommend-ad-box").remove();
      $(".pulllog-box").remove();
      $("#btn-readmore").click();
      $(".indexSuperise").css("overflow","hidden");
      $(".indexSuperise").css("height","0px");

     }
}

function clear_bdad(){
    function clean(){
    	//获取推广广告元素
	    var list = document.getElementById('content_left').getElementsByTagName('div');
	    //去除
	    for(var i = 0 ; i < list.length ; i++){
	    	if (list[i].innerHTML.indexOf("display:block !important;visibility:visible !important")!=-1) {
	    		list[i].style.display="none";
	    	}
	    }
    }
    //
    setInterval(function(){
        //去除右上方相关搜索图片
        $("#container #con-ar").find("div").first().hide();
        //去除右方的推广链接
        $(".layout").hide()
    	var arr = $(".f13 span");
    	for(var i = 0 ; i < arr.length ; i++){
    		if (arr[i].innerText.indexOf("广告") > -1) {
    			arr[i].parentNode.parentNode.style.display = "none";
    		}
    	}
    	clean();
	},1000)
}


// 百家号
function clean_bjh() {
	'use strict';

	let tags = $('#content_left a[href^="http://www.baidu.com/link?url="]');

	let top = $('.c-offset');

	let video = $('.op-short-video-pc');

	let counter = 0;

	let bjhCounter = 0;

	let resultCounter = $(".nums_text");
	let resultCounterText = $(".nums_text").text();

	tags.each(function (i, v) {
		let url = $(this).attr('href');
		(function (url, currentNode) {
			url = url.indexOf("eqid") < 0 ? url + "&wd=&eqid=" : url;

			GM.xmlHttpRequest({
				method: "GET",
				url: url,
				async: true,
				headers: {
					"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					"Host": "www.baidu.com",
					"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
					"Pragma": "no-cache",
					"Cache-Control": "no-cache",
					"Accept-Encoding": "gzip, deflate, br",
					"Connection": "keep-alive"
				},
				onload: function (response) {
					let reg = /URL=['|"]([^'|"]+)/;

					if (reg.test(response.responseText)) {

						let realUrl = response.responseText.match(reg)[1];

						if (realUrl.indexOf('baijia') !== -1) {
							bjhCounter ++;

							$(currentNode).parents('.c-container').remove();

							if (!top.children().length) {
								top.parent().remove();
							}

						} else {

							$(currentNode).attr('href', realUrl);
						}

					}
				},
			});
		})(url, this);
	});

}