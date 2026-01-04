// ==UserScript==
// @name         [长期更新实用脚本]VIP视频免费看 百度文库免费下载 知乎视频下载 去除网站右键限制以及粘贴
// @namespace    busiwoxiede
// @version      2.0.7
// @description  VIP视频免费看（若解析失败可多切换几个线路试试看），支持的网站包括但不限于：[腾讯视频]、[爱奇艺]、[优酷土豆]、[芒果tv]、[乐视视频]、[PPTV]、[搜狐视频]、[bilibili]、[AcFun]、[暴风影音]等等 百度文库免费下载 知乎视频下载 去除网站右键限制以及粘贴；
// @author       busiwoxiede
// @icon 		 data:image/png;base64,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
// @include      *://*.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.baofeng.com/play/*
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @include      *://pan.baidu.com/s/*
// @include      *://yun.baidu.com/s/*
// @include      *://pan.baidu.com/share/init*
// @include      *://yun.baidu.com/share/init*
// @include      *://music.163.com/*
// @include      *://y.qq.com/n/yqq/*
// @include      *://www.kugou.com/song*
// @include      *://www.kuwo.cn/yinyue/*
// @include      *://www.xiami.com/song/*
// @include      *://music.baidu.com/*
// @include      *://music.taihe.com/song*
// @include      *://music.migu.cn/*music/song/*
// @include      *://www.zhihu.com/*
// @include      *://v.vzuu.com/video/*
// @include      *://wenku.baidu.com/view/*
// @include      *://api.ebuymed.cn/ext/*
// @include      *://www.ebuymed.cn/
// @include      *://pan.baidu.com/s/*
// @include      *://yun.baidu.com/s/*
// @include      *://pan.baidu.com/share/init*
// @include      *://yun.baidu.com/share/init*
// @include      *://www.zhihu.com/*
// @include      *://www.bilibili.com/read/*
// @include      *://b.faloo.com/*
// @include      *://bbs.coocaa.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://book.zhulang.com/*
// @include      *://book.zongheng.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://chokstick.com/*
// @include      *://chuangshi.qq.com/*
// @include      *://yunqi.qq.com/*
// @include      *://city.udn.com/*
// @include      *://cutelisa55.pixnet.net/*
// @include      *://huayu.baidu.com/*
// @include      *://tiyu.baidu.com/*
// @include      *://yd.baidu.com/*
// @include      *://yuedu.baidu.com/*
// @include      *://imac.hk/*
// @include      *://life.tw/*
// @include      *://luxmuscles.com/*
// @include      *://read.qidian.com/*
// @include      *://www.15yan.com/*
// @include      *://www.17k.com/*
// @include      *://www.18183.com/*
// @include      *://www.360doc.com/*
// @include      *://www.eyu.com/*
// @include      *://www.hongshu.com/*
// @include      *://www.coco01.com/*
// @include      *://news.missevan.com/*
// @include      *://www.hongxiu.com/*
// @include      *://www.imooc.com/*
// @include      *://www.readnovel.com/*
// @include      *://www.tadu.com/*
// @include      *://www.jjwxc.net/*
// @include      *://www.xxsy.net/*
// @include      *://www.z3z4.com/*
// @include      *://yuedu.163.com/*
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://share.weiyun.com/*
// @match        *://*.lanzous.com/*
// @match        *://vdisk.weibo.com/*
// @match        *://*.ctfile.com/*
// @match        *://*.pipipan.com/*
// @match        *://*.dfpan.com/*
// @match        *://*.ccchoo.com/*
// @match        *://*.vdisk.cn/*
// @match        *://*.yimuhe.com/*
// @match        *://*.newday.me/*
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/link*
// @match        *://yun.baidu.com/share/link*
// @connect      newday.me
// @connect      ctfile.com
// @connect      pipipan.me
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/vue/2.6.6/vue.min.js
// @connect 	 www.quzhuanpan.com
// @connect		 pan.baidu.com
// @connect		 yun.baidu.com
// @connect      zhihu.com
// @connect      vzuu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://greasyfork.org/scripts/376804-intelligent-weight/code/Intelligent_weight.js?version=663767
// @run-at       document-start
// @grant        unsafeWindow
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @downloadURL https://update.greasyfork.org/scripts/380570/%5B%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%E5%AE%9E%E7%94%A8%E8%84%9A%E6%9C%AC%5DVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%20%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%20%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%20%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E4%BB%A5%E5%8F%8A%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/380570/%5B%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%E5%AE%9E%E7%94%A8%E8%84%9A%E6%9C%AC%5DVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%20%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%20%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%20%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E4%BB%A5%E5%8F%8A%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
	'use strict';	
    var $ = $ || window.$;
    var window_url = window.location.href;
    var init={};  //初始化数据
    var operation={};  //具体操作部分
    init.start=function(){
    	var is_pull = false;
    	var pull_websites_string = GM_getValue("pull_websites");
    	var pull_website_time =  GM_getValue("pull_website_time");
    	if(!!pull_websites_string&&!!pull_website_time){
    		var nowTime = new Date().getTime();
			if(nowTime - Number(pull_website_time) > 1000*60*10){
				is_pull = true;
			}else{
				is_pull = false;
			}
    	}else{
    		is_pull = true;
    	}
    	if(!is_pull){
    		init.loadLocalWebsite(pull_websites_string);
    	}else{
    		init.pullWebsites();
    	}
    };
    init.loadLocalWebsite=function(websites){
    	try{
		    var serverResponseJson = JSON.parse(websites);
		    if(!!serverResponseJson){
		    	init.useWebsite(serverResponseJson);
		    }else{
		    	init.pullWebsites();
		    }
		}catch(e){
			init.pullWebsites();
		}
    };
    init.pullWebsites=function(){
		GM_xmlhttpRequest({
		  	method: "GET",
		  	url: "https://www.quzhuanpan.com/browser/tampermonkey_analysis_vip",
		  	onload: function(response) {
				var status = response.status;
				if(status==200||status=='200'){
					var serverResponseJson = JSON.parse(response.responseText);
					GM_setValue("pull_websites",response.responseText);
					GM_setValue("pull_website_time",new Date().getTime());
					init.useWebsite(serverResponseJson);
				}
		  	}
		});	
    };
    init.useWebsite=function(serverResponseJson){
    	operation.addFilmHtml(serverResponseJson);  //视频解析开始
    	operation.addMusicHtml(serverResponseJson);  //音乐解析开始
    }
    
	//加入操作方法
    operation.judgeFilmWebsiteGui=function(){
		var isIncreaseGui = false;
		var host = window.location.host;
		var hosts = ["iqiyi.com","qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com","acfun.cn","bilibili.com","baofeng.com","pptv.com"];
		var titleArray = ["爱奇艺","腾讯视频","优酷","乐视","土豆","AcFun","搜狐","PPTV","bilibili","芒果","暴风影音"];
		for(var j=0;j<hosts.length;j++){
			if(host.indexOf(hosts[j])!=-1){
				isIncreaseGui = true;
				break;
			}
		}
		if(isIncreaseGui){
			isIncreaseGui = false;
			var title = $("title").text();
			for(var i=0;i<titleArray.length;i++){
				if(!!title && title.indexOf(titleArray[i])!=-1){
					isIncreaseGui = true;
					break;
				}
			}
		}
		return isIncreaseGui;
	};
    operation.addFilmHtml=function(serverResponseJson){
    	start_pan();
    	if(operation.judgeFilmWebsiteGui()){  //判断是否增加页面GUI
	    	var innnerCss = "";
	    	innnerCss += ".crack_vip_film_box_url{position:relative!important; background-color:#ccc!important; border:1px solid #ccc!important;font-size:13px!important;}";
			innnerCss += ".crack_vip_film_box_url:after{position:absolute!important; content: ''!important; width:0!important; height:0!important; left:-8px!important; top:6px!important; border-right:7px solid #ccc!important; border-top:7px solid transparent!important; border-bottom:7px solid transparent!important;}";
	    	innnerCss += '.line_choice_a_xs8c{color:#000!important; font-size:13px!important; text-decoration:none!important;}';
	    	innnerCss += '.line_choice_a_xs8c:hover{color:#FF5C38!important;}';
	    	$("body").prepend("<style>"+innnerCss+"</style>");
	    	
	    	//左边图标
	    	var vipImg = "data:image/png;base64,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";
	    	var searchImg = "data:image/png;base64,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";
	    	var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;left:0px;width:28px;'>"+
							"<img id='crack_vip_film_box' style='width:100%;display:block;margin: 15px 0px;' src='"+vipImg+"' title='点我VIP解析'>"+
							"<img id='crack_vip_search_box' style='width:100%;display:block;margin: 15px 0px;' src='"+searchImg+"' title='点我资源搜索'>"+
					 	 "</div>";
	    	
	    	//解析到特定线路方便维护
	    	var film_urls = serverResponseJson.film_urls;
	    	var defaultCrackVipUrl = "http://www.sosogif.com/v/s/?url=";
	    	if(!!film_urls && film_urls.length > 0){
	    		var url = film_urls[0].url;
	    		if(!!url){
	    			defaultCrackVipUrl = url;
	    		}
	    	}
	    	defaultCrackVipUrl = defaultCrackVipUrl + window_url;
    		//追加HTML
    		$("body").append(topBox);

	    	//绑定点击事件
	    	$("body").on("click","#crack_vip_film_box",function(){
		    	window.open(defaultCrackVipUrl, "_blank");
		    });
		    var searchUrl="https://www.quzhuanpan.com/source/search.action?q=%E7%94%B5%E5%BD%B1&currentPage=1";
		    $("body").on("click","#crack_vip_search_box",function(){
		    	window.open(searchUrl, "_blank");
		    });
    	}
    };
    operation.judgeMusicWebsite = function(){
		var websites = ["music.163.com/#/song?id=","music.163.com/#/album?id=","y.qq.com","www.kugou.com","www.kuwo.cn","www.xiami.com","music.baidu.com","music.taihe.com/",,"music.migu.cn"];
		for(var i=0;i<websites.length;i++){
			if(window_url.indexOf(websites[i])!=-1){
				return true;
			}
		}
		return false;		
	};
    operation.addMusicHtml = function(serverResponseJson){
    	if(operation.judgeMusicWebsite()){
    		var innnerCss = "";
	    	innnerCss += ".crack_vip_music_box_url{position:relative!important;background-color:#ccc!important;border:1px solid #ccc!important;font-size:13px!important;}";
			innnerCss += ".crack_vip_music_box_url:after{position:absolute!important; content: ''!important; width:0!important; height:0!important; left:-8px!important; top:6px!important; border-right:7px solid #ccc!important; border-top:7px solid transparent!important; border-bottom:7px solid transparent!important;}";
	    	innnerCss += '.line_choice_a_xs8c{color:#000!important; font-size:13px!important; text-decoration:none!important;}';
    		innnerCss += '.line_choice_a_xs8c:hover{color:#D11919!important;}';
	    	$("body").prepend("<style>"+innnerCss+"</style>");
	    	
	    	//左边图标
	    	var downloadMusicImg = "data:image/png;base64,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";
	    	var searchImg = "data:image/png;base64,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";
	    	var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;left:0px;width:28px;'>"+
					"<img id='crack_vip_music_box' class='crack_vip_music_box_236ss' style='width:100%;width:100%;display:block;margin: 15px 0px;' src='"+downloadMusicImg+"' title='点我音乐解析'>"+
					"<img id='crack_vip_search_box' style='width:100%;display:block;margin: 15px 0px;' src='"+searchImg+"' title='点我资源搜索'>"+
				 "</div>";
		    
		    //弹出线路选择，默认选择线路一
	    	var linkUrls = serverResponseJson.music_urls;
	    	var defaultCrackVipUrl = "";
	    	var linkUrlHtml = "<div class='crack_vip_music_box_url_236ss' style='position:fixed;top:150px;left:40px;background-color:#ccc;z-index:999999;display:none;'>";
	    	linkUrlHtml += "<div class='crack_vip_music_box_url'>";
	    	var linkUrlObj;
	    	for(var i=0;i<linkUrls.length;i++){
	    		linkUrlObj = linkUrls[i];
	    		linkUrlHtml += "<div style='padding:3px 8px;text-align:left;'><a class='line_choice_a_xs8c' href='"+linkUrlObj.url+encodeURIComponent(window_url)+"' target='_blank'>"+linkUrlObj.name+"</div>";
	    		if(i==0){
	    			defaultCrackVipUrl = linkUrlObj.url+encodeURIComponent(window_url);
	    		}
	    	}
	    	linkUrlHtml += "</div>";
	    	linkUrlHtml += "</div>";

    		//追加HTML
    		$("body").append(topBox+linkUrlHtml);
    	
	    	//绑定点击事件
	    	$("body").on("click","#crack_vip_music_box",function(){
		    	window.open(defaultCrackVipUrl, "_blank");
		    });
		     var searchUrl="https://www.quzhuanpan.com/source/search.action?q=%E6%94%BE%E6%9D%BE%E9%9F%B3%E4%B9%90&currentPage=1";
		    $("body").on("click","#crack_vip_search_box",function(){
		    	window.open(searchUrl, "_blank");
		    });
		    
		    //鼠标滑动事件
	        var isShowUrlBox = false;
			$(".crack_vip_music_box_236ss").mouseover(function(){
				isShowUrlBox = true;
				$(".crack_vip_music_box_url_236ss").show();
			});
			$(".crack_vip_music_box_236ss").mouseout(function(){
				isShowUrlBox = false;
				setTimeout(function(){
					if(!isShowUrlBox){
						$(".crack_vip_music_box_url_236ss").hide();
						isShowUrlBox = false;
					}
				},100);
			});
			$(".crack_vip_music_box_url_236ss").mouseover(function(){
				isShowUrlBox = true;
				$(this).show();
			});
			$(".crack_vip_music_box_url_236ss").mouseout(function(){
				isShowUrlBox = false;
				$(this).hide();
			});
    	}
    };
    init.start();  //开启解析任务
})();

//集成下载知乎视频，作者：王超，版本：1.12，在此表示感谢，以下代码版权归原作者所有
//此脚本地址：https://greasyfork.org/zh-CN/scripts/39206
(async () => {
	//只有知乎和知乎合作网址方可通过
	if(window.location.href.indexOf("www.zhihu.com") == -1 && window.location.href.indexOf("v.vzuu.com") == -1){
		return false;
	}
	
    if (window.location.host == 'www.zhihu.com') return;
    const playlistBaseUrl = 'https://lens.zhihu.com/api/videos/';
    const videoBaseUrl = 'https://v.vzuu.com/video/';
    const videoId = window.location.pathname.split('/').pop(); // 视频id
    const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
    const playerSelector = '#player';
    const controlBarSelector = playerSelector + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
    const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
    const svgCircle = '<circle cx="12" cy="12" r="8" fill="none" stroke-width="2" stroke="#555" />' +
        '<text x="50%" y="50%" dy=".4em" text-anchor="middle" fill="#fff" font-size="9"></text>' +
        '<path fill="none" r="8" transform="translate(12,12)" stroke-width="2" stroke="#fff" />';
    const svgConvert = '<circle cx="12" cy="12" r="8" fill="none" stroke-width="2" stroke="#fff" />' +
        '<path d="M13,7 L17,10 V11 H7 V10 H15 L12,8 Z M9,16 L7,14 V13 H17 V14 H9 L10,16 Z"></path>';
    const wechatIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVQ4T6WSv2uTQRjHv9/L+4YiCWpbo6jgJE5u4lIVAnYwl6SjIFLQv8HBRcFFBBcVoaXgIl0UMVwuBHR0sLSdClKogw5iqyIogjhE7itXUnkb3qagBzfc8+PzPPd9HuI/D7P5zrkJY8w5SSnJDWPMmrX21bAamwDv/R4ATwHYwWBJi0mSXK3Vaqt5IHrvxwG8BnB8SKUfks43m83lwRi22+27JK9FRwjhkDHmPoCLANTr9Q4kSfKI5JSk9XK5fKxarf7OQiLgE8mDfeNHSRWSaXxL+kByRNIzkl9IPq7X6++2Abz3PwFEDfLOCwC3JN0keRLAYQBfATwolUp3Yjexg5ckJ3Oy34QQrpN8TrKY419K0/RCFPG0pAWSJhsk6RLJGQB7AdyQNEXylKTbJM8CiHd2a4xXAMwBSLYgIYTLxpj5jDYjJMckfQZAkhVJ3/8ukvd+Q9IvAOMky5Kmo2i7LOq3TUC32z0aQjhjrX1CUtHW6XT2S3rf/8JOnIfbVnkwyjk3SbKzg4gLhUKhOhQQgc65EyTv9cd4pL8bowAmGo3Gyq6AvN5brda+YrFYsda+/SdAFvoH5C+l3GRotdcAAAAASUVORK5CYII=';
    let videos = []; // 存储各分辨率的视频信息
    let format = []; // 下载的格式; ts, mp4
    let blobs = null; // 存储视频段
    let ratio;
    let errors = 0;

    do {
        await wait(500);
    }
    while (!document.querySelector(controlBarSelector + '> div:nth-last-of-type(1)').querySelectorAll('button')[0]);

    const domControlBar = document.querySelector(controlBarSelector);
    const domFullScreenBtn = document.querySelector(controlBarSelector + '> div:nth-last-of-type(1)');
    let domDownloadBtn = domFullScreenBtn.cloneNode(true); // 克隆全屏按钮为下载按钮
    let downloading = false;

    function wait(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        });
    }

    function fetchRetry(url, options = {}, times = 1, delay = 1000, checkStatus = true) {
        return new Promise((resolve, reject) => {
            // fetch 成功处理函数
            function success(res) {
                if (checkStatus && !res.ok) {
                    failure(res);
                }
                else {
                    resolve(res);
                }
            }

            // 单次失败处理函数
            function failure(error) {
                times--;

                if (times) {
                    setTimeout(fetchUrl, delay);
                }
                else {
                    reject(error);
                }
            }

            // 总体失败处理函数
            function finalHandler(error) {
                throw error;
            }

            function fetchUrl() {
                return fetch(url, options)
                    .then(success)
                    .catch(failure)
                    .catch(finalHandler);
            }

            fetchUrl();
        });
    }


    function getBrowerInfo() {
        let browser = (function (window) {
            let document = window.document;
            let navigator = window.navigator;
            let agent = navigator.userAgent.toLowerCase();
            // IE8+支持.返回浏览器渲染当前文档所用的模式
            // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
            // IE10:10(兼容模式7||8||9)
            let IEMode = document.documentMode;
            let chrome = window.chrome || false;
            let system = {
                // user-agent
                agent: agent,
                // 是否为IE
                isIE: /trident/.test(agent),
                // Gecko内核
                isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
                // webkit内核
                isWebkit: agent.indexOf('webkit') > 0,
                // 是否为标准模式
                isStrict: document.compatMode === 'CSS1Compat',
                // 是否支持subtitle
                supportSubTitle: function () {
                    return 'track' in document.createElement('track');
                },
                // 是否支持scoped
                supportScope: function () {
                    return 'scoped' in document.createElement('style');
                },

                // 获取IE的版本号
                ieVersion: function () {
                    let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
                    let match = rMsie.exec(agent);
                    try {
                        return match[2];
                    } catch (e) {
                        return IEMode;
                    }
                },
                // Opera版本号
                operaVersion: function () {
                    try {
                        if (window.opera) {
                            return agent.match(/opera.([\d.]+)/)[1];
                        }
                        else if (agent.indexOf('opr') > 0) {
                            return agent.match(/opr\/([\d.]+)/)[1];
                        }
                    } catch (e) {
                        return 0;
                    }
                }
            };

            try {
                // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                system.type = system.isIE ? 'IE' :
                    window.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                        (agent.indexOf('chrome') > 0) ? 'Chrome' :
                            //safari也提供了专门的判定方式
                            window.openDatabase ? 'Safari' :
                                (agent.indexOf('firefox') > 0) ? 'Firefox' :
                                    'unknow';

                // 版本号
                system.version = (system.type === 'IE') ? system.ieVersion() :
                    (system.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1] :
                        (system.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1] :
                            (system.type === 'Opera') ? system.operaVersion() :
                                (system.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1] :
                                    '0';

                // 浏览器外壳
                system.shell = function () {
                    if (agent.indexOf('edge') > 0) {
                        system.version = agent.match(/edge\/([\d.]+)/)[1] || system.version;
                        return 'Edge';
                    }
                    // 遨游浏览器
                    if (agent.indexOf('maxthon') > 0) {
                        system.version = agent.match(/maxthon\/([\d.]+)/)[1] || system.version;
                        return 'Maxthon';
                    }
                    // QQ浏览器
                    if (agent.indexOf('qqbrowser') > 0) {
                        system.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || system.version;
                        return 'QQBrowser';
                    }
                    // 搜狗浏览器
                    if (agent.indexOf('se 2.x') > 0) {
                        return '搜狗浏览器';
                    }

                    // Chrome:也可以使用window.chrome && window.chrome.webstore判断
                    if (chrome && system.type !== 'Opera') {
                        let external = window.external;
                        let clientInfo = window.clientInformation;
                        // 客户端语言:zh-cn,zh.360下面会返回undefined
                        let clientLanguage = clientInfo.languages;

                        // 猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                        if (external && 'LiebaoGetVersion' in external) {
                            return 'LBBrowser';
                        }
                        // 百度浏览器
                        if (agent.indexOf('bidubrowser') > 0) {
                            system.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                                agent.match(/chrome\/([\d.]+)/)[1];
                            return 'BaiDuBrowser';
                        }
                        // 360极速浏览器和360安全浏览器
                        if (system.supportSubTitle() && typeof clientLanguage === 'undefined') {
                            let storeKeyLen = Object.keys(chrome.webstore).length;
                            let v8Locale = 'v8Locale' in window;
                            return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                        }
                        return 'Chrome';
                    }
                    return system.type;
                };

                // 浏览器名称(如果是壳浏览器,则返回壳名称)
                system.name = system.shell();
                // 对版本号进行过滤过处理
                // System.version = System.versionFilter(System.version);

            } catch (e) {
                // console.log(e.message);
            }

            return system;

        })(window);

        if (browser.name == undefined || browser.name == '') {
            browser.name = 'Unknown';
            browser.version = 'Unknown';
        }
        else if (browser.version == undefined) {
            browser.version = 'Unknown';
        }
        return browser;
    }

    function bytesToSize(bytes) {
        let n = Math.log(bytes) / Math.log(1024) | 0;
        return (bytes / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
    }

    // 下载 m3u8 文件
    async function downloadM3u8(url) {
        const res = await fetchRetry(url, {}, 3);
        const m3u8 = await res.text();
        let i = 0;

        blobs = [];
        ratio = 0;
        errors = 0;

        // 初始化进度显示
        domDownloadBtn.querySelector('svg').innerHTML = svgCircle;
        updateProgress(0);

        m3u8.split('\n').forEach(function (line) {
            if (line.match(/\.ts/)) {
                blobs[i] = undefined;
                downloadTs(url.replace(/\/[^\/]+?$/, '/' + line), i++);
            }
        });
    }

    // 下载 m3u8 文件中的单个 ts 文件
    async function downloadTs(url, order) {
        let res;
        let blob;

        try {
            res = await fetchRetry(url, {}, 5);
            blob = await res.blob();

        } catch (e) {
            if (++errors == 1) {
                resetDownloadIcon();
                alert('下载视频失败，请重新下载。');
            }
            return;
        }

        ratio++;
        blobs[order] = blob;

        errors ? resetDownloadIcon() : updateProgress(Math.round(100 * ratio / blobs.length));

        store();
    }

    // 保存视频文件
    async function store() {
        for (let [index, blob] of blobs.entries()) {
            if (blob === undefined) return;
        }

        let blob = new Blob(blobs, {type: 'video/h264'});

        blobs = null;

        if (format == 'mp4-transform') {
            domDownloadBtn.querySelector('svg').innerHTML = svgConvert;
            blob = await convertToMp4(blob);
        }

        downloading = false;
        downloadBlob(blob);
    }

    // 下载 blob 里的视频
    function downloadBlob(blob) {
        let name = (new Date()).valueOf() + '.mp4'; //  + format
        let navigator = window.navigator;
        let url;

        // ArrayBuffer -> blob
        if (blob instanceof ArrayBuffer) {
            blob = new Blob([blob]);
        }

        // 结束进度显示
        resetDownloadIcon();

        // edge
        if (navigator && navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        }
        else {
            url = URL.createObjectURL(blob);
            downloadUrl(url, name);
        }
    }

    // 下载指定url的资源
    async function downloadUrl(url, name = (new Date()).valueOf() + '.mp4') {
        let browser = getBrowerInfo();

        // Greasemonkey 需要把 url 转为 blobUrl
        if (GM_info.scriptHandler == 'Greasemonkey') {
            let res = await fetchRetry(url);
            let blob = await res.blob();
            url = URL.createObjectURL(blob);
        }

        // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
        if (window.GM_download) {
            GM_download({url, name});
        }
        else {
            // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
            let a = document.createElement('a');
            a.href = url;
            a.download = name;
            // a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 100);
        }
    }

    // 重置下载图标
    function resetDownloadIcon() {
        domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
    }

    // 更新下载进度界面
    function updateProgress(percent) {
        let r = 8;
        let degrees = (percent == 100 ? 99.9999 : percent) / 100 * 360; // 进度对应的角度值
        let rad = degrees * (Math.PI / 180); // 角度对应的弧度值
        let x = (Math.sin(rad) * r).toFixed(2); // 极坐标转换成直角坐标
        let y = -(Math.cos(rad) * r).toFixed(2);
        let lenghty = Number(degrees > 180); // 大于180°时画大角度弧，小于180°时画小角度弧，(deg > 180) ? 1 : 0
        let paths = ['M', 0, -r, 'A', r, r, 0, lenghty, 1, x, y]; // path 属性

        domDownloadBtn.querySelector('svg > path').setAttribute('d', paths.join(' '));
        domDownloadBtn.querySelector('svg > text').textContent = percent;
    }

    // load QRCode js
    async function loadQrcode() {
        if (!unsafeWindow.qrcode) {
            return new Promise((resolve, reject) => {
                let script = document.createElement('script');
                script.src = 'https://cdn.rawgit.com/kazuhikoarase/qrcode-generator/3c72b1bb/js/qrcode.js';
                script.addEventListener('load', () => {
                    resolve();
                });
                document.body.appendChild(script);
            });
        }
    }

    // load ffmpeg js
    async function loadFfmpeg() {
        if (!unsafeWindow.ffmpegJS) {
            const res = await fetchRetry('https://cdn.rawgit.com/bgrins/videoconverter.js/42def8c4/build/ffmpeg.js');
            const js = await res.text();
        }
        return unsafeWindow.ffmpegJS;
    }

    // ts blob -> mp4 blob
    async function convertToMp4(blob) {
        let hasError = false;
        // const ffmpegJsUrl = 'https://cdn.rawgit.com/bgrins/videoconverter.js/42def8c4/build/ffmpeg.js';
        // const ffmpegJsUrl = 'https://gitee.com/dntc/videoconverter.js/raw/master/build/ffmpeg.js';
        const ffmpegJsUrl = 'https://coding.net/u/dntc/p/videoconverter.js/git/raw/master/build/ffmpeg.js';
        const orgPrompt = unsafeWindow.prompt;
        const buffer = await (new Response(blob)).arrayBuffer();
        const fileData = new Uint8Array(buffer);
        const importFfmpegJs = 'importScripts("' + ffmpegJsUrl + '");';
        const workerJs = importFfmpegJs + `
            function print(text) {
                postMessage({
                    type: 'stdout',
                    data: text
                });
            }

            onmessage = function(event) {
                const message = event.data;

                if (message.type === 'command') {
                    const module = {
                        files: message.files || [],
                        arguments: message.arguments || [],
                        print: print,
                        printErr: print,
                        TOTAL_MEMORY: message.TOTAL_MEMORY || false
                    };

                    postMessage({
                        type: 'start',
                        data: module.arguments.join(' ')
                    });

                    postMessage({
                      type: 'stdout',
                      data: 'Received command: ' + module.arguments.join(' ') +
                        ((module.TOTAL_MEMORY) ? '.  Processing with ' + module.TOTAL_MEMORY + ' bits.' : '')
                    });

                    const time = Math.floor((new Date()).getTime() / 1000);
                    const result = ffmpeg_run(module);
                    const totalTime = Math.floor((new Date()).getTime() / 1000) - time;

                    postMessage({
                        type: 'stdout',
                        data: 'Finished processing (took ' + totalTime + 'm)'
                    });

                    postMessage({
                        type : 'done',
                        data : result,
                        time : totalTime
                    });
                }
            };

            postMessage({
                type: 'ready'
            });
        `;
        const workerBlob = new Blob([workerJs], {'type': 'application/javascript'});
        const worker = new Worker(URL.createObjectURL(workerBlob));
        const parseArguments = function (text) {
            text = text.replace(/\s+/g, ' ');
            let args = [];
            // Allow double quotes to not split args.
            text.split('"').forEach(function (t, i) {
                t = t.trim();
                if ((i % 2) === 1) {
                    args.push(t);
                }
                else {
                    args = args.concat(t.split(' '));
                }
            });
            return args;
        };

        let files;

        return new Promise(function (resolve, reject) {
            worker.onmessage = function (event) {
                const message = event.data;

                if (message.type == 'ready') {
                    console.log('ffmpeg 格式转换代码加载完毕');

                    // worker.postMessage({
                    //     type: 'command',
                    //     arguments: ['-help']
                    // })

                    worker.postMessage({
                        type: 'command',
                        TOTAL_MEMORY: 268435456, // 256M, must be a power of 2
                        arguments: parseArguments('-i zhihu.ts -vf showinfo -strict -2 output.mp4'),
                        files: [
                            {
                                name: 'zhihu.ts',
                                data: fileData
                            }
                        ]
                    });
                }
                else if (message.type == 'start') {
                    console.log('Worker has received command');
                }
                else if (message.type == 'stdout') {
                    console.log(message.data);
                    if (!hasError && message.data.indexOf('TOTAL_MEMORY') != -1) {
                        hasError = true;
                        alert('分配的内存不足，转换出错。');
                    }
                }
                else if (message.type == 'done') {
                    // finishConvert();
                    const files = message.data;
                    resolve(new Blob([files[0].data]));
                }
            };
        });
    }

    // 获取视频信息
    const res = await fetchRetry(playlistBaseUrl + videoId, {
        headers: {
            'referer': 'refererBaseUrl + videoId',
            'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
        }
    }, 3);
    const videoInfo = await res.json();

    // 获取不同分辨率视频的信息
    for (let [key, video] of Object.entries(videoInfo.playlist)) {
        video.name = key;

        if (!videos.find(v => v.width == video.width)) {
            videos.push(video);
        }
    }

    // 按分辨率大小排序
    videos = videos.sort(function (v1, v2) {
        return v1.width == v2.width ? 0 : (v1.width > v2.width ? 1 : -1);
    }).reverse();

    // 生成下载按钮图标
    domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
    domDownloadBtn.querySelector('svg').innerHTML = svgDownload;

    // 鼠标事件 - 选择菜单项
    domDownloadBtn.addEventListener('pointerup', event => {
        let e = event.srcElement || event.target;

        if (downloading) {
            alert('当前正在执行下载任务，请等待任务完成。');
            return;
        }

        downloadUrl(videos[0].play_url);
    });

    // 显示下载按钮
    domControlBar.appendChild(domDownloadBtn);
})();

(function() {
	'use strict';	
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;
    
    var analysis={};
    analysis.judge=function(){
    	if(website_host.indexOf("wenku.baidu.com")!=-1){
    		return true;
    	}
    	return false;
    };
    analysis.addHtml=function(){
    	if(analysis.judge()){
    		//左边图标
	    	var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>"+
							"<div id='crack_vip_document_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>下载</div>"+
							"<div id='crack_vip_search_wenku_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#DD5A57;'>网盘</div>"+
							/*"<div id='crack_vip_search_wangpan_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#357EFD;'>网盘</div>"+*/
							"<div id='crack_vip_copy_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#FE8A23;'>复制</div>"+
					 	 "</div>";
			$("body").append(topBox);			
	    	var searchWord = "";
	    	if("wenku.baidu.com"===website_host){
	    		if($("#doc-tittle-0").length!=0){
	    			searchWord = $("#doc-tittle-0").text();
	    		}else if($("#doc-tittle-1").length!=0){
	    			searchWord = $("#doc-tittle-1").text();
	    		}else if($("#doc-tittle-2").length!=0){
	    			searchWord = $("#doc-tittle-2").text();
	    		}else if($("#doc-tittle-3").length!=0){
	    			searchWord = $("#doc-tittle-3").text();
	    		}
	    	}
	    	
	    	//为每一页添加复制按钮
			var onePageCopyContentHtml = '<div class="copy-one-page-text" style="float:left;padding:3px 10px;background:green;z-index:999;position:relative;top:60px;color:#fff;background-color:#FE8A23;font-size:14px;cursor:pointer;">获取此页面内容</div>'; 
			$('.mod.reader-page.complex, .ppt-page-item, .mod.reader-page-mod.complex').each(function() {
				$(this).prepend(onePageCopyContentHtml);
			});
			
	    	var defaultCrackVipUrl = "https://api.ebuymed.cn/ext/1/";
	    	$("body").on("click","#crack_vip_document_box",function(){
	    		GM_setValue("document_url",window_url);
		    	window.open(defaultCrackVipUrl, "_blank");
		    });
		    
		    var defaultSearchWenkuUrl = "https://www.quzhuanpan.com/source/search.action?q=@&currentPage=1";
		    $("body").on("click","#crack_vip_search_wenku_box",function(){
		    	defaultSearchWenkuUrl = defaultSearchWenkuUrl.replace(/@/g, encodeURIComponent(searchWord));
		    	window.open(defaultSearchWenkuUrl, "_blank");
		    });
		    
		    $("body").on("click","#crack_vip_copy_box",function(){
		    	analysis.copybaiduWenkuAll();
		    });
		    
		    $("body").on("click",".copy-one-page-text",function(){
		    	var $inner = $(this).parent(".mod").find(".inner")
		    	analysis.copybaiduWenkuOne($inner);
		    });
    	}
    	start_pan();
    };
    analysis.showBaiduCopyContentBox=function(str){
    	var ua = navigator.userAgent;
    	var opacity = '0.95';
		if (ua.indexOf("Edge") >= 0) {
		    opacity = '0.6';
		} else{
		    opacity = '0.95';
		}
    	var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">'+
    						'<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>'+
    					  	'<pre id="copy-text-content" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>'+
    					  '</div>"';
    	$('#copy-text-box').remove();
	    $('body').append(copyTextBox);
	    $('#copy-text-content').html(str);
	    $('#copy-text-box-close').click(function() {
	       $('#copy-text-box').remove();
	    });
   	};
   	analysis.showDialog=function(str){
   		var dialogHtml = '<div id="hint-dialog" style="margin:0px auto;opacity:0.8;padding:5px 10px;position:fixed;z-index: 10001;display: block;bottom:30px;left:44%;color:#fff;background-color:#CE480F;font-size:13px;border-radius:3px;">'+str+'</div>';
   		$('#hint-dialog').remove();
	    $('body').append(dialogHtml);
	    timeoutId = setTimeout(function(){
	    	$('#hint-dialog').remove();
	    }, 1500);
   	}
    analysis.copybaiduWenkuAll=function(){
    	analysis.copybaiduWenkuOne($(".inner"));
    };
    analysis.copybaiduWenkuOne=function($inner){
    	if(analysis.judge()){
			//提取文字
    		var str = "";
			$inner.find('.reader-word-layer').each(function(){
				 str += $(this).text().replace(/\u2002/g, ' ');
			});
			str = str.replace(/。\s/g, '。\r\n');
			
			//提取css中的图片
			var picHtml = "";
			var picUrlReg = /[\'\"](https.*?)[\'\"]/ig;
			var cssUrl = "";
			var picNum = 0;
			var picUrlLengthMin = 65;
			var picTemplate = "<div style='margin:10px 0px;text-align:center;'><img src='@' width='90%'><div>____图(#)____</div></div>";
			$inner.find('.reader-pic-item').each(function(){
				cssUrl= $(this).css("background-image");
				//在css中的情况
				if(!!cssUrl && (cssUrl.indexOf("http")!=-1 || cssUrl.indexOf("HTTP")!=-1)){
					var array = cssUrl.match(picUrlReg);
					if(array.length>0){
						cssUrl = array[0].replace(/\"/g, "");
						if(!!cssUrl && cssUrl.length>picUrlLengthMin){
							picNum ++;
							var onePic = picTemplate;
							onePic = onePic.replace(/#/g,picNum);
							onePic = onePic.replace(/@/g,cssUrl);
							picHtml += onePic;
						}
					}
				}
			});
			
			//如果还有img标签，一并提取出来
			var srcUrl = "";
			$inner.find('img').each(function(){
				srcUrl = $(this).attr("src");
				if(!!srcUrl && srcUrl.length>picUrlLengthMin && srcUrl.indexOf("https://wkretype")!=-1){
					picNum ++;
					var onePic = picTemplate;
					onePic = onePic.replace(/#/g,picNum);
					onePic = onePic.replace(/@/g,srcUrl);
					picHtml += onePic;
				}
			});
			
			//追加内容
			var contentHtml = str+picHtml;
			if(!!contentHtml && contentHtml.length>0){
				if(picNum!=0){
					contentHtml = str+"<div style='color:red;text-align:center;margin-top:20px;'>文档中的图片如下：(图片可右键另存为)</div>"+picHtml;
				}
				analysis.showBaiduCopyContentBox(contentHtml);
			}else{
				analysis.showDialog("提取文档内容失败了");
			}
    	}
    };
    analysis.download=function(){
    	if("api.ebuymed.cn"===website_host){
	    	var sendUrl = GM_getValue("document_url");
	    	if(!!sendUrl){
	    		GM_setValue("document_url","");
	    		$("#downurl").val(sendUrl);
	    		$("#buttondown").click();
	    	}
	    }
    };
    analysis.init=function(){
    	analysis.addHtml();
    	analysis.download();
    }
    analysis.init();
    
    //如果于文档相关，则执行至此
    if(website_host.indexOf("api.ebuymed.cn")!=-1 
    	|| website_host.indexOf("www.ebuymed.cn")!=-1
    	|| website_host.indexOf("wenku.baidu.com")!=-1){
    	return false;
    }
    /*
    * 网页解除限制，集成了脚本：网页限制解除（精简优化版）
    * 作者：Cat73、xinggsf
    * 原插件地址：https://greasyfork.org/zh-CN/scripts/41075
    */
	// 域名规则列表
	const rules = {
		plus: {
			name: "default",
			hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
			unhook_eventNames: "mousedown|mouseup|keydown|keyup",
			dom0: true,
			hook_addEventListener: true,
			hook_preventDefault: true,
			add_css: true
		}
	};
	
	const returnTrue = e => true;
	// 获取目标域名应该使用的规则
	const getRule = (host) => {
		return rules.plus;
	};
	const dontHook = e => !!e.closest('form');
	// 储存被 Hook 的函数
	const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
	const document_addEventListener = document.addEventListener;
	const Event_preventDefault = Event.prototype.preventDefault;
	// 要处理的 event 列表
	let hook_eventNames, unhook_eventNames, eventNames;
	
	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		let _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
		if (!hook_eventNames.includes(type)) {
			_addEventListener.apply(this, arguments);
		} else {
			_addEventListener.apply(this, [type, returnTrue, useCapture]);
		}
	}
	
	// 清理或还原DOM节点的onxxx属性
	function clearLoop() {
		let type, prop,
		c = [document,document.body, ...document.getElementsByTagName('div')],
		// https://life.tw/?app=view&no=746862
		e = document.querySelector('iframe[src="about:blank"]');
		if (e && e.clientWidth>99 && e.clientHeight>11){
			e = e.contentWindow.document;
			c.push(e, e.body);
		}
	
		for (e of c) {
			if (!e) continue;
			e = e.wrappedJSObject || e;
			for (type of eventNames) {
				prop = 'on' + type;
				e[prop] = null;
			}
		}
	}
	
	function init() {
		// 获取当前域名的规则
		let rule = getRule(location.host);
	
		// 设置 event 列表
		hook_eventNames = rule.hook_eventNames.split("|");
		// Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|");
		eventNames = hook_eventNames.concat(unhook_eventNames);
	
		if (rule.dom0) {
			setInterval(clearLoop, 9e3);
			setTimeout(clearLoop, 1e3);
			window.addEventListener('load', clearLoop, true);
		}
	
		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener;
			document.addEventListener = addEventListener;
		}
	
		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function () {
				if (dontHook(this.target) || !eventNames.includes(this.type)) {
					Event_preventDefault.apply(this, arguments);
				}
			};
		}
	
		if (rule.add_css) GM_addStyle(
			`html, * {
				-webkit-user-select:text !important;
				-moz-user-select:text !important;
				user-select:text !important;
			}
			::-moz-selection {color:#FFF!important; background:#3390FF!important;}
			::selection {color:#FFF!important; background:#3390FF!important;}`
		);
	}
	init();
})();

// 百度云提取码自动填写
(function () {
    'use strict';

    var container = (function () {
        var obj = {
            _defines: {},
            _modules: {}
        };

        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj._defines[name] = {
                requires: requires,
                callback: callback
            };
        };

        obj.require = function (name, cache) {
            cache = (cache == false) ? false : true;
            name = obj.processName(name);
            if (cache && obj._modules.hasOwnProperty(name)) {
                return obj._modules[name];
            }
            else if (obj._defines.hasOwnProperty(name)) {
                var requires = obj._defines[name].requires;
                var callback = obj._defines[name].callback;

                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };

        obj.use = function (requires, callback) {
            var module = {
                exports: {}
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            }
            else {
                return module.exports;
            }
        };

        obj.register = function (name, module) {
            name = obj.processName(name);
            obj._modules[name] = module;
        };

        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };

        obj.processName = function (name) {
            return name.toLowerCase();
        };

        return obj;
    })();

    container.define("config", [], function () {
        var obj = {
            url: location.href,
            referer: document.referrer,
            source: {
                baidu: "baidu",
                weiyun: "weiyun",
                lanzous: "lanzous"
            },
            option: {
                baidu_page_home: "baidu_page_home",
                baidu_page_share: "baidu_page_share",
                baidu_page_verify: "baidu_page_verify",
                baidu_share_status: "baidu_share_status",
                baidu_custom_password: "baidu_custom_password",
                baidu_auto_jump: "baidu_auto_jump",
                weiyun_page_verify: "weiyun_page_verify",
                weiyun_share_status: "weiyun_share_status",
                weiyun_auto_jump: "weiyun_auto_jump",
                lanzous_page_verify: "lanzous_page_verify",
                lanzous_share_status: "lanzous_share_status",
                lanzous_auto_jump: "lanzous_auto_jump",
                weibo_page_download: "weibo_page_download",
                ctfile_page_list: "ctfile_page_list",
                ctfile_page_download: "ctfile_page_download",
                yunfile_page_download: "yunfile_page_download",
                ccchoo_page_download: "ccchoo_page_download",
                ccchoo_auto_jump: "ccchoo_auto_jump",
                vdisk_page_download: "vdisk_page_download",
                yimuhe_page_download: "yimuhe_page_download",
                yimuhe_auto_jump: "yimuhe_auto_jump"
            },
            router: {
                option: "http://www.newday.me/script/option/wpzs.html"
            }
        };

        obj.getUrl = function () {
            return obj.url;
        };

        obj.setUrl = function (url) {
            obj.url = url;
        };

        obj.getReferer = function () {
            return obj.referer;
        };

        obj.setReferer = function (referer) {
            obj.referer = referer;
        };

        return obj;
    });

    container.define("util", [], function () {
        var obj = {};

        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        obj.replaceVars = function (vars, value) {
            Object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };

        return obj;
    });

    container.define("core", ["config", "util"], function (config, util) {
        var obj = {};

        obj.getPageWindow = function () {
            return unsafeWindow;
        };

        obj.getVersion = function () {
            return GM_info.script.version;
        };

        obj.getUrlParam = function (name) {
            var param = util.parseUrlParam(config.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.isOptionActive = function (name) {
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };

        obj.setOptionActive = function (name) {
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };

        obj.setOptionUnActive = function (name) {
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };

        obj.addShareLog = function (shareId, sharePwd, shareLink, shareSource) {
            var shareLogList = obj.getShareLogList();
            shareLogList[shareId] = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_link: shareLink,
                share_source: shareSource,
                share_time: (new Date()).getTime()
            };
            obj.setValue("share_log_json", JSON.stringify(shareLogList));
        };

        obj.getShareLogList = function () {
            var shareLogJson = obj.getValue("share_log_json");
            return util.parseJson(shareLogJson);
        };

        obj.ajax = function (option) {
            var details = {
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };

            // 提交数据
            if (option.data) {
                details.method = "POST";
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }
            else {
                details.method = "GET";
            }

            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }

            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }

            GM_xmlhttpRequest(details);
        };

        obj.getConfig = function (name) {
            var configJson = obj.getValue("configJson");
            var configObject = util.parseJson(configJson);
            if (name) {
                return configObject.hasOwnProperty(name) ? configObject[name] : null;
            }
            else {
                return configObject;
            }
        };

        obj.setConfig = function (name, value) {
            var configObject = obj.getConfig();
            configObject[name] = value;
            obj.setValue("configJson", JSON.stringify(configObject));
        };

        obj.getOption = function () {
            var optionJson = obj.getValue("optionJson");
            var optionObject = util.parseJson(optionJson);

            var option = [];
            Object.values(config.option).forEach(function (value) {
                if (!(optionObject.hasOwnProperty(value) && optionObject[value] == "no")) {
                    option.push(value);
                }
            });
            return option;
        };

        obj.setOption = function (option) {
            var optionObject = {};
            Object.values(config.option).forEach(function (value) {
                if (option.indexOf(value) >= 0) {
                    optionObject[value] = "yes";
                } else {
                    optionObject[value] = "no";
                }
            });
            obj.setValue("optionJson", JSON.stringify(optionObject));
        };

        obj.getUrlParam = function (name) {
            var param = util.parseUrlParam(config.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.getValue = function (name) {
            return GM_getValue(name);
        };

        obj.setValue = function (name, value) {
            GM_setValue(name, value);
        };

        obj.printLog = function (data) {
            if (typeof console != "undefined") {
                console.log(data);
            }
        };

        obj.init = function (callback) {
            callback && callback();
        };

        return obj;
    });

    container.define("api", ["core", "snap"], function (core, snap) {
        var obj = {
            base: "http://api.newday.me",
        };

        obj.querySharePwd = function (shareId, shareLink, callback) {
            core.ajax({
                url: obj.base + "/share/disk/query",
                dataType: "json",
                data: {
                    share_id: shareId,
                    share_point: obj.getStrPoint(shareId),
                    share_link: shareLink,
                    share_version: core.getVersion()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.storeSharePwd = function (shareId, sharePwd, shareLink, shareSource, callback) {
            // 记录日志
            core.addShareLog(shareId, sharePwd, shareLink, shareSource);

            core.ajax({
                url: obj.base + "/share/disk/store",
                dataType: "json",
                data: {
                    share_id: shareId,
                    share_pwd: sharePwd,
                    share_point: obj.getStrPoint(shareId),
                    share_link: shareLink,
                    share_version: core.getVersion()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.logOption = function (option, callback) {
            core.ajax({
                url: obj.base + "/share/disk/option",
                dataType: "json",
                data: {
                    option_json: JSON.stringify(option),
                    share_version: core.getVersion()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }

            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };

        return obj;
    });

    container.define("app_baidu", ["config", "core", "api", "$"], function (config, core, api, $) {
        var obj = {
            app_id: 250528,
            home_page: "https://greasyfork.org/zh-CN/scripts/378301-%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B",
            yun_data: null,
            size_config: {
                fileSizeLimit: 500000,
                fileSizeSmall: 500000,
                isDefaultSize: false,
                isRequestServer: true
            },
            verify_page: {
                share_pwd: null,
                setPwd: null,
                backupPwd: null,
                restorePwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf(".baidu.com/s/") > 0) {
                $(function () {
                    core.isOptionActive(config.option.baidu_page_share) && obj.initSharePage();
                });
                return true;
            }
            else if (url.indexOf(".baidu.com/disk/home") > 0) {
                $(function () {
                    core.isOptionActive(config.option.baidu_page_home) && obj.initHomePage();
                });
                return true;
            } else if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                $(function () {
                    core.isOptionActive(config.option.baidu_page_home) && obj.initTimeLinePage();
                });
                return true;
            } else if (url.indexOf(".baidu.com/share/init") > 0) {
                $(function () {
                    core.isOptionActive(config.option.baidu_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initSharePage = function () {
            obj.registerCustomAppId();

            obj.removeDownloadLimit();

            obj.removeVideoLimit();

            obj.initButtonShare();

            obj.initButtonEvent();
        };

        obj.initHomePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.removeDownloadLimit();

            obj.initButtonHome();

            obj.initButtonEvent();
        };

        obj.initTimeLinePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.removeDownloadLimit();

            obj.initButtonTimeLine();

            obj.initButtonEvent();
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".input-area input");
            if (shareId && $pwd.length) {
                // 设置提取码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 备份提取码
                obj.verify_page.backupPwd = function (pwd) {
                    $pwd.attr("data-pwd", pwd);
                };

                // 还原提取码
                obj.verify_page.restorePwd = function () {
                    $pwd.val($pwd.attr("data-pwd"));
                };

                // 提交提取码
                var $button = $(".input-area .g-button");
                if ($button.length) {
                    obj.verify_page.submit_pwd = function () {
                        $button.click();
                    };
                }

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = config.getUrl();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充提取码成功");

                    if (core.isOptionActive(config.option.baidu_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享提取码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".pickpw dt").html(`请输入提取码：<span style="float:right">
                <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> 
                <a target="_blank" href="`+ config.router.option + `" title="点击查看更多脚本配置">共享提取码</a>
            </span>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    core.setOptionActive(config.option.baidu_share_status);
                }
                else {
                    core.setOptionUnActive(config.option.baidu_share_status);
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/share/verify") >= 0) {
                    var match = options.data.match(/pwd=([a-z0-9]+)/i);
                    if (!match) {
                        return core.printLog("pwd share not match");
                    }

                    // 拒绝*号
                    if (obj.verify_page.backupPwd) {
                        obj.verify_page.backupPwd(match[1]);
                        setTimeout(obj.verify_page.restorePwd, 500);
                    }

                    var response = xhr.responseJSON;
                    if (!(response && response.errno == 0)) {
                        return core.printLog("pwd share error");
                    }

                    var sharePwd = match[1];
                    if (sharePwd == obj.verify_page.share_pwd) {
                        return core.printLog("pwd share not change");
                    }

                    if (!obj.isPwdShareOpen()) {
                        return core.printLog("pwd share closed");
                    }

                    var shareId = obj.getShareId();
                    var shareLink = config.getUrl();
                    api.storeSharePwd(shareId, sharePwd, shareLink, config.source.baidu);
                }
            });
        };

        obj.registerCustomAppId = function () {
            obj.getJquery()(document).ajaxSend(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/api/download") >= 0 || requestUrl.indexOf("/api/sharedownload") >= 0) {
                    var match = requestUrl.match(/app_id=(\d+)/);
                    if (match) {
                        options.url = requestUrl.replace(match[0], "app_id=" + obj.getAppId());
                    }
                }
            });
        };

        obj.registerCustomSharePwd = function () {
            // 功能开关
            if (!core.isOptionActive(config.option.baidu_custom_password)) {
                return;
            }

            // 生成提取码
            obj.async("function-widget-1:share/util/shareFriend/createLinkShare.js", function (shareLink) {
                var makePrivatePassword = shareLink.prototype.makePrivatePassword;
                shareLink.prototype.makePrivatePassword = function () {
                    var sharePwd = core.getConfig("share_pwd");
                    return sharePwd ? sharePwd : makePrivatePassword();
                };
            });

            // 分享事件
            obj.async("function-widget-1:share/util/shareDialog.js", function (shareDialog) {
                var onVisibilityChange = shareDialog.prototype.onVisibilityChange;
                shareDialog.prototype.onVisibilityChange = function (status) {
                    if (status && !$(".nd-input-share-pwd").length) {
                        var sharePwd = core.getConfig("share_pwd");
                        var html = `<tr>
                            <td class="first-child">
                                <label>提取码</label>
                            </td>
                            <td>
                                <input type="text" class="nd-input-share-pwd" value="`+ (sharePwd ? sharePwd : "") + `" placeholder="为空则随机四位" style="padding: 6px; width: 100px;border: 1px solid #e9e9e9;">
                            </td>
                        </tr>`;
                        $("#share .dialog-body table").append(html);
                    }
                    onVisibilityChange.call(status);
                };
            });

            // 提取码更改事件
            $(document).on("change", ".nd-input-share-pwd", function () {
                var value = this.value;
                if (value && !value.match(/^[0-9a-z]{4}$/i)) {
                    obj.showTipError("提取码只能是四位数字或字母");
                }
                core.setConfig("share_pwd", value);
            });
        };

        obj.removeDownloadLimit = function () {
            obj.async("function-widget-1:download/config.js", function (config) {
                config.sizeConfig = obj.size_config;
            });
        };

        obj.removeVideoLimit = function () {
            var message = obj.getSystemContext().message;
            if (message) {
                message.trigger("share-video-after-transfer");
            }
            else {
                core.printLog("wait removeVideoLimit...");
                obj.setTimeout(obj.removeVideoLimit, 500);
            }
        };

        obj.initButtonShare = function () {
            if ($(".x-button-box").length) {
                var html = `<a class="g-button nd-button-build">
                    <span class="g-button-right">
                        <em class="icon icon-disk" title="下载"></em>
                        <span class="text">生成链接</span>
                    </span>
                </a>`;
                $(".x-button-box").append(html);
            }
            else {
                core.printLog("wait initButtonShare...");
                setTimeout(obj.initButtonShare, 500);
            }
        };

        obj.initButtonHome = function () {
            var listTools = obj.getSystemContext().Broker.getButtonBroker("listTools");
            if (listTools && listTools.$box) {
                var html = `<a class="g-button nd-button-build">
                    <span class="g-button-right">
                        <em class="icon icon-disk" title="下载"></em>
                        <span class="text">生成链接</span>
                    </span>
                </a>`;
                $(listTools.$box).prepend(html);
            }
            else {
                core.printLog("wait initButtonHome...");
                setTimeout(obj.initButtonHome, 500);
            }
        };

        obj.initButtonTimeLine = function () {
            if ($(".module-operateBtn .group-button").length) {
                var html = `<span class="button">
                    <a class="g-v-button g-v-button-middle nd-button-build">
                        <span class="g-v-button-right">
                            <em class="icon icon-disk"></em>
                            <span class="text">生成链接</span>
                        </span>
                    </a>
                </span> `;
                $(".module-operateBtn .group-button").prepend(html);
            }
            else {
                core.printLog("wait initButtonTimeLine...");
                setTimeout(obj.initButtonTimeLine, 500);
            }
        };

        obj.initButtonEvent = function () {
            // 生成链接
            $(document).on("click", ".nd-button-build", function () {
                var yunData = obj.getYunData();
                if (yunData.MYUK) {
                    var fileList = obj.getSelectedFileList();
                    var fileStat = obj.getFileListStat(fileList);
                    if (fileList.length) {
                        if (fileList.length > 1 && fileStat.file_num) {
                            obj.showDownloadSelect(fileList, fileStat);
                        }
                        else {
                            var pack = fileStat.file_num ? false : true;
                            if (obj.isHomePage()) {
                                obj.showDownloadInfoHome(fileList, pack);
                            }
                            else {
                                obj.showDownloadInfoShare(fileList, pack);
                            }
                        }
                    }
                    else {
                        obj.showTipError("请至少选择一个文件或文件夹");
                    }
                }
                else {
                    obj.showLogin();
                }
            });

            // 压缩包
            $(document).on("click", ".nd-button-pack", function () {
                var fileList = obj.getSelectedFileList();
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, true);
                }
                else {
                    obj.showDownloadInfoShare(fileList, true);
                }
            });

            // 多文件
            $(document).on("click", ".nd-button-multi", function () {
                var fileList = obj.getSelectedFileList();

                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);

                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, false);
                }
                else {
                    obj.showDownloadInfoShare(fileList, false);
                }
            });

            // 应用ID
            $(document).on("click", ".nd-change-app-id", function () {
                obj.showAppIdChange();
            });
            $(document).on("change", ".nd-input-app-id", function () {
                obj.setAppId(this.value);
            });
        };

        obj.showLogin = function () {
            obj.getJquery()("[node-type='header-login-btn']").click();
        };

        obj.showDownloadInfoShare = function (fileList, pack) {
            obj.getDownloadShare(fileList, pack, function (response) {
                obj.hideTip();

                if (response.list && response.list.length) {
                    // 文件
                    obj.showDownloadLinkFile(response.list);
                }
                else if (response.dlink) {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadInfoHome = function (fileList, pack) {
            obj.getDownloadHome(fileList, pack, function (response) {
                obj.hideTip();

                if (response.dlink && typeof response.dlink == "object" && response.dlink.length) {
                    // 文件
                    response.dlink.forEach(function (item, index) {
                        var itemOrigin = fileList[index];
                        itemOrigin.dlink = item.dlink;
                        itemOrigin.dlink_api = obj.buildDownloadUrl(itemOrigin.path);
                    });
                    obj.showDownloadLinkFile(fileList);
                }
                else if (response.dlink && typeof response.dlink == "string") {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadLinkFile = function (fileList) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';
            fileList.forEach(function (item, index) {
                body += `<div style="margin-bottom: 10px;">`;

                body += `<div>` + (index + 1) + `：` + item.server_filename + `</div>`;

                body += `<div><a href="` + item.dlink + `" title="` + item.dlink + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                    [官方] `+ item.dlink + `
                </a></div>`;

                if (item.dlink_api) {
                    body += `<div><a href="` + item.dlink_api + `" title="` + item.dlink_api + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                        [接口] `+ item.dlink_api + `
                    </a></div>`;
                }

                body += `</div>`;
            });
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showDownloadLinkPack = function (fileList, data) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';

            var packName = obj.getDownloadPackName(fileList);
            body += `<div>` + packName + `</div>
            <div><a href="`+ data.dlink + `" title="` + data.dlink + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                [官方] `+ data.dlink + `
            </a></div>`;

            body += `<div style="margin-top: 15px;">打包的文件/文件夹列表</div>`;
            fileList.forEach(function (item, index) {
                body += `<div title="` + item.path + `" style="color: ` + (item.isdir ? "blue" : "inherit") + `;">[` + (index + 1) + `] ` + item.server_filename + `</div>`;
            });

            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.getDownloadPackName = function (fileList) {
            return fileList[0].server_filename + " 等" + fileList.length + "个文件.zip";
        };

        obj.buildDownloadUrl = function (path) {
            return "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=" + obj.getAppId() + "&path=" + encodeURIComponent(path);
        };

        obj.showDownloadSelect = function (fileList, fileStat) {
            var title = "链接类型";
            var body = `<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">`;

            body += `<div class="normalBtnBox g-center">
                <a class="g-button g-button-large g-button-gray-large nd-button-pack">
                    <span class="g-button-right">
                        <em class="icon icon-download"></em> 压缩包
                    </span>
                </a>
                <a class="g-button g-button-large g-button-gray-large nd-button-multi" style="margin-left:50px;">
                    <span class="g-button-right">
                        <em class="icon icon-poly"></em> 多文件
                    </span>
                </a>
            </div>`;

            if (fileStat.dir_num) {
                body += `<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;">
                <p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">`+ fileStat.dir_num + `</span> 个文件夹</p>`;

                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += `<p title="` + item.path + `" style="color: blue;">[` + index + `] ` + item.server_filename + `</p>`;
                        index++;
                    }
                });
                body += `</div>`;
            }

            body += `</div>`;
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showAppIdChange = function () {
            var title = "应用ID";
            var body = `<div style="padding: 60px 20px; max-height: 300px; overflow-y: auto;">
                <div class="g-center" style="margin-bottom: 10px;">
                    当前应用ID：<input type="text" class="nd-input-app-id" style="border: 1px solid #f2f2f2; padding: 4px 5px;" value="`+ obj.getAppId() + `">
                </div>
                <div class="g-center">
                    <p>如生成链接或者下载文件异常，请尝试修改为官方应用ID【` + obj.app_id + `】</p>
                    <p>修改应用ID可能存在未知的风险，请慎重使用，更多应用ID请查看<a target="_blank" href="` + obj.home_page + `"> 脚本主页 </a></p>
                </div>
            </div>`;
            var footer = '';
            obj.showDialog(title, body, footer);
        };

        obj.showDialogUnKnownResponse = function (response) {
            var title = "未知结果";
            var body = `<div style="padding: 20px 20px; max-height: 300px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; word-wrap: break-word; word-break: break-all;">` + JSON.stringify(response, null, 4) + `</pre>
            </div>`;
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.renderFooterAppId = function () {
            return `<p style="padding-top: 10px; border-top: 1px solid #D0DFE7;">
                当前应用ID：` + obj.getAppId() + ` <a href="javascript:;" class="nd-change-app-id">修改</a>，其他设置请访问 <a target="_blank" href="` + config.router.option + `">配置页面</a>
            </p > `;
        };

        obj.showDialog = function (title, body, footer) {
            var dialog = obj.require("system-core:system/uiService/dialog/dialog.js").verify({
                title: title,
                img: "img",
                vcode: "vcode"
            });

            // 内容
            $(dialog.$dialog).find(".dialog-body").html(body);

            // 底部
            $(dialog.$dialog).find(".dialog-footer").html(footer);

            dialog.show();
        };

        obj.showTipSuccess = function (msg, hasClose, autoClose) {
            obj.showTip("success", msg, hasClose, autoClose);
        };

        obj.showTipError = function (msg, hasClose, autoClose) {
            obj.showTip("failure", msg, hasClose, autoClose);
        };

        obj.showTipLoading = function (msg, hasClose, autoClose) {
            obj.showTip("loading", msg, hasClose, autoClose);
        };

        obj.showTip = function (mode, msg, hasClose, autoClose) {
            var option = {
                mode: mode,
                msg: msg
            };

            // 关闭按钮
            if (typeof hasClose != "undefined") {
                option.hasClose = hasClose;
            }

            // 自动关闭
            if (typeof autoClose != "undefined") {
                option.autoClose = autoClose;
            }

            obj.require("system-core:system/uiService/tip/tip.js").show(option);
        };

        obj.hideTip = function () {
            obj.require("system-core:system/uiService/tip/tip.js").hide({
                hideTipsAnimationFlag: 1
            });
        };

        obj.isHomePage = function () {
            var url = config.getUrl();
            if (url.indexOf(".baidu.com/disk") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isTimelinePage = function () {
            var url = config.getUrl();
            if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isSharePageMulti = function () {
            var yunData = obj.getYunData();
            if (yunData.SHAREPAGETYPE == "single_file_page") {
                return false;
            }
            else {
                return true;
            }
        };

        obj.getSelectedFileList = function () {
            if (obj.isHomePage()) {
                return obj.getSelectedFileListHome();
            }
            else {
                return obj.getSelectedFileListShare();
            }
        };

        obj.getSelectedFileListHome = function () {
            if (obj.isTimelinePage()) {
                return obj.require("pan-timeline:widget/store/index.js").getters.getChoosedItemArr;
            }
            else {
                return obj.require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems();
            }
        };

        obj.getSelectedFileListShare = function () {
            if (obj.isSharePageMulti()) {
                return obj.require("disk-share:widget/pageModule/list/listInit.js").getCheckedItems();
            }
            else {
                var yunData = obj.getYunData();
                return yunData.FILEINFO;
            }
        };

        obj.getFileListStat = function (fileList) {
            var fileStat = {
                file_num: 0,
                dir_num: 0
            };
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileStat.file_num++;
                }
                else {
                    fileStat.dir_num++;
                }
            });
            return fileStat;
        };

        obj.filterFileListDir = function (fileList) {
            var fileListFilter = [];
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileListFilter.push(item);
                }
            });
            return fileListFilter;
        };

        obj.parseFidList = function (fileList) {
            var fidList = [];
            fileList.forEach(function (item) {
                fidList.push(item.fs_id);
            });
            return fidList;
        };

        obj.getDownloadShare = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var yunData = obj.getYunData();
                var data = {
                    list: fileList,
                    share_uk: yunData.SHARE_UK,
                    share_id: yunData.SHARE_ID,
                    sign: yunData.SIGN,
                    timestamp: yunData.TIMESTAMP,
                    type: pack ? "batch" : "nolimit"
                };
                dl.getDlinkShare(data, callback);
            });
        };

        obj.getDownloadHome = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var fidList = obj.parseFidList(fileList);
                var type = pack ? "batch" : "nolimit";
                dl.getDlinkPan(JSON.stringify(fidList), type, callback);
            });
        };

        obj.getShareId = function () {
            return core.getUrlParam("surl");
        };

        obj.isPwdShareOpen = function () {
            return core.isOptionActive(config.option.baidu_share_status);
        };

        obj.getYunData = function () {
            if (!obj.yun_data) {
                obj.yun_data = core.getPageWindow().yunData;
            }
            return obj.yun_data;
        };

        obj.getAppId = function () {
            var appId = core.getConfig("app_id");
            if (appId) {
                return appId;
            }
            else {
                return obj.app_id;
            }
        };

        obj.setAppId = function (appId) {
            core.setConfig("app_id", appId);
            api.logOption({
                app_id: appId
            });
        };

        obj.initWidgetContext = function (name, callback) {
            var initFunc = function (widget) {
                if (!widget.getContext()) {
                    widget.setContext(obj.getSystemContext());
                }
                callback && callback();
            };
            if (callback) {
                obj.async(name, initFunc);
            }
            else {
                initFunc(obj.require(name));
            }
        };

        obj.ajax = function (option) {
            obj.getJquery().ajax(option);
        };

        obj.getSystemContext = function () {
            return obj.require("system-core:context/context.js").instanceForSystem;
        };

        obj.getJquery = function () {
            return obj.require("base:widget/libs/jquerypacket.js");
        };

        obj.require = function (name) {
            return core.getPageWindow().require(name);
        };

        obj.async = function (name, callback) {
            core.getPageWindow().require.async(name, callback);
        };

        return obj;
    });

    container.define("app_weiyun", ["config", "core", "api", "$"], function (config, core, api, $) {
        var obj = {
            axios: null,
            modal: null,
            store: null,
            inject_name: "_nd_inject_",
            webpack_require: null,
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("share.weiyun.com") > 0) {
                $(function () {
                    core.isOptionActive(config.option.weiyun_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.initWebpackRequire(function () {
                obj.registerStoreSharePwd();
            });

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".card-inner .input-txt[type='password']");
            var $button = $(".card-inner .btn-main");
            if (shareId && $pwd.length && $button.length) {

                // 显示分享密码
                $pwd.attr("type", "text");

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 重造按钮
                var $itemButton = $button.parent();
                $itemButton.html($button.prop("outerHTML"));
                $button = $itemButton.find(".btn-main");

                // 按钮事件
                $button.on("click", function () {
                    obj.getStore() && obj.getStore().default.dispatch("shareInfo/loadShareInfoWithoutLogin", $pwd.val());
                });

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $button.click();
                };

                return true;
            }
            else {
                return false;
            }
        };

        obj.initWebpackRequire = function (callback) {
            var moreModules = {};
            moreModules[obj.inject_name] = function (module, exports, __webpack_require__) {
                obj.webpack_require = __webpack_require__;
                callback && callback();
            };
            core.getPageWindow().webpackJsonp([obj.inject_name], moreModules, [obj.inject_name]);
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充密码成功");

                    if (core.isOptionActive(config.option.weiyun_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享密码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".card-inner .form-item-label .form-item-tit").html(`<span class="form-item-tit">
                请输入分享密码
                <span style="margin-left: 45px;">
                    <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> 
                    <a target="_blank" href="`+ config.router.option + `" title="点击查看更多脚本配置">共享密码</a>
                </span>
            </span>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    core.setOptionActive(config.option.weiyun_share_status);
                }
                else {
                    core.setOptionUnActive(config.option.weiyun_share_status);
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.addResponseInterceptor(function (request, response) {
                var requestUrl = request.responseURL;
                if (requestUrl.indexOf("weiyunShareNoLogin/WeiyunShareView") > 0) {
                    if (response.data.data.rsp_header.retcode == 0) {
                        var match = response.config.data.match(/\\"share_pwd\\":\\"([\w]+)\\"/);
                        if (!match) {
                            return core.printLog("pwd share not match");
                        }

                        var sharePwd = match[1];
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return core.printLog("pwd share not change");
                        }

                        if (!obj.isPwdShareOpen()) {
                            return core.printLog("pwd share closed");
                        }

                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        api.storeSharePwd(shareId, sharePwd, shareLink, config.source.weiyun);
                    }
                    else {
                        return core.printLog("pwd share error");
                    }
                }
            });
        };

        obj.addResponseInterceptor = function (callback) {
            var success = function (response) {
                try {
                    callback && callback(response.request, response);
                }
                catch (e) {
                    core.printLog(e);
                }
                return response;
            };
            var error = function () {
                return Promise.reject(error);
            };
            obj.getAxios() && obj.getAxios().interceptors.response.use(success, error);
        };

        obj.showTipSuccess = function (msg) {
            obj.getModal() && obj.getModal().success(msg);
        };

        obj.showTipError = function (msg) {
            obj.getModal() && obj.getModal().error(msg);
        };

        obj.getShareId = function () {
            var url = config.getUrl();
            var match = url.match(/share.weiyun.com\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return config.getUrl();
        };

        obj.isPwdShareOpen = function () {
            return core.isOptionActive(config.option.weiyun_share_status);
        };

        obj.getAxios = function () {
            if (!obj.axios) {
                obj.axios = obj.matchWebpackModule(function (module, name) {
                    if (module && module.Axios) {
                        return module;
                    }
                });
            }
            return obj.axios;
        };

        obj.getModal = function () {
            if (!obj.modal) {
                obj.modal = obj.matchWebpackModule(function (module, name) {
                    if (module && module.confirm && module.success) {
                        return module;
                    }
                });
            }
            return obj.modal;
        };

        obj.getStore = function () {
            if (!obj.store) {
                obj.store = obj.matchWebpackModule(function (module, name) {
                    if (module && module.default && module.default._modulesNamespaceMap) {
                        return module;
                    }
                });
            }
            return obj.store;
        };

        obj.matchWebpackModule = function (matchFunc) {
            var names = Object.keys(obj.webpack_require.c);
            for (var i in names) {
                var name = names[i];
                var match = matchFunc(obj.webpack_require(name), name);
                if (match) {
                    return match;
                }
            }
        };

        return obj;
    });

    container.define("app_lanzous", ["config", "util", "core", "api", "$"], function (config, util, core, api, $) {
        var obj = {
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("www.lanzous.com/fn") > 0) {
                $(function () {
                    core.isOptionActive(config.option.lanzous_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $("#pwd");
            if (shareId && $pwd.length) {

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $("#sub").click();
                };

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTip(1, "填充密码成功", 2000);

                    if (core.isOptionActive(config.option.lanzous_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享密码", 2000);
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".text").html(`<input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;" > 
            <a style="cursor: pointer;" target="_blank" href="` + config.router.option + `" title="点击查看更多脚本配置">共享密码</a>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    core.setOptionActive(config.option.lanzous_share_status);
                }
                else {
                    core.setOptionUnActive(config.option.lanzous_share_status);
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            core.getPageWindow().$(document).ajaxComplete(function (event, xhr, options) {
                var match = options.data.match(/p=(\w+)/);
                if (!match) {
                    return core.printLog("pwd share not match");
                }

                var sharePwd = match[1];
                if (sharePwd == obj.verify_page.share_pwd) {
                    return core.printLog("pwd share not change");
                }

                if (!obj.isPwdShareOpen()) {
                    return core.printLog("pwd share closed");
                }

                var shareId = obj.getShareId();
                var shareLink = obj.getShareLink();
                var response = util.parseJson(xhr.response);
                if (response && response.zt == 1 && sharePwd) {
                    api.storeSharePwd(shareId, sharePwd, shareLink, config.source.lanzous);
                }
                else {
                    core.printLog("pwd share error");
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            if (code) {
                $("#info").html('<span style="color: green;">' + msg + '</span>');
            }
            else {
                $("#info").html('<span style="color: red;">' + msg + '</span>');
            }
            setTimeout(function () {
                $("#info").html("");
            }, timeout);
        };

        obj.getShareId = function () {
            return core.getUrlParam("f");
        };

        obj.getShareLink = function () {
            return top.location.href;
        };

        obj.isPwdShareOpen = function () {
            return core.isOptionActive(config.option.lanzous_share_status);
        };

        return obj;
    });

    container.define("app_weibo", ["config", "util", "core", "$"], function (config, util, core, $) {
        var obj = {};

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("vdisk.weibo.com") > 0) {
                core.isOptionActive(config.option.weibo_page_download) && obj.initDownloadPage();
                return true;
            }
            return false;
        };

        obj.initDownloadPage = function () {
            var pageWindow = core.getPageWindow();

            // 取消未登录弹窗
            pageWindow.define("2/widget/fileDownLayer", ["2/core"], function () {
                return {
                    init: function () { }
                };
            });

            // 请求下载链接
            pageWindow.seajs.use(["2/core"], function (http) {
                var $button = $("#download_small_btn");
                var fileInfo = util.parseJson($button.attr("data-info"));
                http.api({
                    url: "api/weipan/fileopsStatCount",
                    data: {
                        link: fileInfo.copy_ref,
                        ops: "download",
                        wpSign: pageWindow.SIGN
                    }
                }, function (response) {
                    var html = `<a style="color: red;" title="右键使用迅雷或者IDM进行下载" href="` + response.url + `"><i class="vd_pic_v2 ico_file_download">右键下载</i></a>`;
                    $button.after(html);
                    $button.hide();
                });
            });
        };

        return obj;
    });

    container.define("app_[ctfile|pipipan]", ["config", "core", "$"], function (config, core, $) {
        var obj = {
            base: "",
            _downloads: {}
        };

        obj.getBase = function () {
            return obj.base;
        };

        obj.setBase = function (base) {
            obj.base = base;
        };

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("ctfile.com") > 0) {
                obj.runDiskCtFile();
                return true;
            }
            else if (url.indexOf("pipipan.com") > 0) {
                obj.runDiskPiPiPan();
                return true;
            }
            else {
                return false;
            }
        };

        obj.runDiskCtFile = function () {
            obj.setBase("https://qihuanmp3.ctfile.com");

            var url = config.getUrl();
            if (url.indexOf("ctfile.com/u/") > 0) {
                obj.initAlbumPage();
            }
            else if (url.indexOf("ctfile.com/i/") > 0 || url.indexOf("ctfile.com/fs/") > 0) {
                $(function () {
                    obj.initDownloadPage();
                });
            }
        };

        obj.runDiskPiPiPan = function () {
            obj.setBase("https://www.pipipan.com");

            var url = config.getUrl();
            if (url.indexOf("pipipan.com/dir/") > 0) {
                obj.initAlbumPage();
            }
            else if (url.indexOf("pipipan.com/i/") > 0 || url.indexOf("pipipan.com/fs/") > 0) {
                $(function () {
                    obj.initDownloadPage();
                });
            }
        };

        obj.initAlbumPage = function () {
            core.isOptionActive(config.option.ctfile_page_list) && obj.initTableFile();
        };

        obj.initTableFile = function () {
            if ($("#table_files td a").not(".active").length) {
                var selector = $("#table_files td a").not(".active")[0];
                obj.queryTableFile(selector);
            }
            else {
                setTimeout(obj.initTableFile, 2000);
            }
        };

        obj.queryTableFile = function (selector) {
            var initFunc = function (timeout) {
                setTimeout(obj.initTableFile, timeout);
            };

            var $selector = $(selector);
            if ($selector.hasClass("active")) {
                initFunc(0);
                return;
            }
            else {
                $selector.addClass("active");
            }

            var url = $selector.attr("href");
            if (url.indexOf("/u/") == 0 || url.indexOf("/dir/") == 0) {
                initFunc(0);
            }
            else {
                obj.queryFileUrlPage(url, function (response) {
                    initFunc(100);

                    if (response && response.downurl) {
                        $selector.attr("href", response.downurl);
                        $selector.css("color", "red");
                        $selector.attr("title", "右键使用迅雷或者IDM进行下载");
                    }
                });
            }
        };

        obj.initDownloadPage = function () {
            // 禁用广告
            core.getPageWindow()._popup_ispoped = true;

            core.isOptionActive(config.option.ctfile_page_download) && obj.queryFileUrl(document.body.innerHTML, function (response) {
                if (response && response.downurl) {
                    var $downLink = $("#free_down_link");
                    $downLink.removeAttr("onclick");
                    $downLink.attr("href", response.downurl);
                    $downLink.find("em").css("color", "red");
                    $downLink.attr("title", "右键使用迅雷或者IDM进行下载");
                }
            });
        };

        obj.queryFileUrlPage = function (url, callback) {
            obj.pageQuery(url, function (response) {
                if (response) {
                    obj.queryFileUrl(response, callback);
                }
                else {
                    callback && callback("");
                }
            });
        };

        obj.queryFileUrl = function (html, callback) {
            var uid = obj.parseUid(html);
            var fid = obj.parseFid(html);
            var chk = obj.parseChk($(html).find("#free_down_link").attr("onclick"));
            var code = "";
            var referer = config.getUrl();
            obj.downloadQuery(uid, fid, chk, code, referer, callback);
        };

        obj.parseUid = function (html) {
            var match = html.match(/uid=(\d+)/)
            if (match) {
                return match[1];
            }
        };

        obj.parseFid = function (html) {
            var match = html.match(/fid=(\d+)/)
            if (match) {
                return match[1];
            }
        };

        obj.parseChk = function (html) {
            if (html) {
                var match = html.match(/, '(\S+)',/);
                if (match) {
                    return match[1];
                }
            }
        };

        obj.pageQuery = function (url, callback) {
            core.ajax({
                url: obj.getBase() + url,
                dataType: "text",
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.downloadQuery = function (uid, fid, chk, code, referer, callback) {
            var key = [uid, fid, chk].join("_");
            if (obj._downloads.hasOwnProperty(key)) {
                callback && callback(obj._downloads[key]);
            }
            else {
                var url = obj.getBase() + "/get_file_url.php?uid=" + uid + "&fid=" + fid + "&file_chk=" + chk + "&verifycode=" + code;
                core.ajax({
                    url: url,
                    dataType: "json",
                    headers: {
                        "Referer": referer
                    },
                    success: function (response) {
                        if (response && response.downurl) {
                            obj._downloads[key] = response;
                        }

                        callback && callback(response);
                    },
                    error: function (error) {
                        callback && callback("");
                    }
                });
            }
        };

        return obj;
    });

    container.define("app_dfpan", ["config", "core", "$"], function (config, core, $) {
        var obj = {};

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("page2.dfpan.com") > 0) {
                $(function () {
                    core.isOptionActive(config.option.yunfile_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            setInterval(function () {
                core.getPageWindow().CTAMAT = {};
            }, 100);

            $(".ad-layer").remove();
            $("#common_speed_down").click();
        };

        return obj;
    });

    container.define("app_ccchoo", ["config", "core", "$"], function (config, core, $) {
        var obj = {};

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("ccchoo.com/file") > 0) {
                core.isOptionActive(config.option.ccchoo_auto_jump) && obj.initFilePage();
                return true;
            }
            else if (url.indexOf("ccchoo.com/down2") > 0) {
                core.isOptionActive(config.option.ccchoo_auto_jump) && obj.initDownload2Page();
                return true;
            }
            else if (url.indexOf("ccchoo.com/down") > 0) {
                $(function () {
                    core.isOptionActive(config.option.ccchoo_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initFilePage = function () {
            var url = config.getUrl();
            location.href = url.replace("/file-", "/down2-");
        };

        obj.initDownload2Page = function () {
            var url = config.getUrl();
            location.href = url.replace("/down2-", "/down-");
        };

        obj.initDownloadPage = function () {
            $("#down_link").hide();
            $(".b-box").show();
            $(".q-box").css("opacity", 0);
        };

        return obj;
    });

    container.define("app_vdisk", ["config", "core", "$"], function (config, core, $) {
        var obj = {};

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("vdisk.cn/down/") > 0) {
                $(function () {
                    core.isOptionActive(config.option.vdisk_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            $("#loadingbox").hide();
            $("#btnbox").show();
        };

        return obj;
    });

    container.define("app_yimuhe", ["config", "core", "$"], function (config, core, $) {
        var obj = {};

        obj.run = function () {
            var url = config.getUrl();
            if (url.indexOf("yimuhe.com/file") > 0) {
                core.isOptionActive(config.option.yimuhe_auto_jump) && obj.initFilePage();
                return true;
            }
            else if (url.indexOf("yimuhe.com/down") > 0) {
                $(function () {
                    core.isOptionActive(config.option.yimuhe_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initFilePage = function () {
            var url = config.getUrl();
            location.href = url.replace("/file-", "/down-");
        };

        obj.initDownloadPage = function () {
            var pageWindow = core.getPageWindow();

            // 失效广告事件
            pageWindow.__qy_pop_up_tg.kdopen = function () { };
            pageWindow.__qy_pop_up_tg.reopen = function () { };
            pageWindow.__qy_pop_up_tg.wopen = function () { };
            pageWindow.__qy_pop_up_tg.hrefopen = function () { };
            pageWindow.__qy_pop_up_tg.uinit();

            // 展示验证码
            pageWindow.wait = -1;
            $("#loading").hide();
            $("#yzm").show();

            // 隐藏页面广告
            $("a").each(function () {
                if (this.href && this.href.indexOf("AID") > 0) {
                    $(this).hide();
                }
            });
        };

        return obj;
    });

    container.define("app_newday", ["config", "util", "core", "api", "$", "vue"], function (config, util, core, api, $, vue) {
        var obj = {};

        obj.run = function () {
            if (obj.existMeta("wpzs::option")) {
                obj.initOptionPage();
            }
            else if (obj.existMeta("wpzs::share")) {
                obj.initSharePage();
            }
            return true;
        };

        obj.initOptionPage = function () {
            new vue({
                el: "#container",
                data: {
                    app_id: core.getConfig("app_id"),
                    info: {
                        version: core.getVersion()
                    },
                    option: core.getOption()
                },
                mounted: function () {
                    this.initCheckBox();
                },
                watch: {
                    option: function (value) {
                        core.setOption(value);
                        api.logOption(value);
                    },
                    app_id: function (value) {
                        core.setConfig("app_id", value);
                        api.logOption({
                            app_id: value
                        });
                    }
                },
                methods: {
                    initCheckBox: function () {
                        $("body").addClass("init-checkbox-wait");
                    }
                }
            });
        };

        obj.initSharePage = function () {
            var shareLogList = core.getShareLogList();
            new vue({
                el: "#container",
                data: {
                    info: {
                        version: core.getVersion()
                    },
                    list: []
                },
                mounted: function () {
                    this.loadShareLogList("all");
                },
                methods: {
                    showShareLogList: function (source) {
                        $(".am-nav-tabs .am-active").removeClass("am-active");
                        $(".source-" + source).addClass("am-active");
                        this.loadShareLogList(source);
                    },
                    loadShareLogList: function (source) {
                        this.list = this.processShareLogList(source);
                    },
                    processShareLogList: function (source) {
                        var filterShareLogList = [];
                        Object.keys(shareLogList).forEach(function (shareId) {
                            var shareLog = shareLogList[shareId];
                            if (source == "all" || source == shareLog.share_source) {
                                filterShareLogList.push({
                                    share_id: shareId,
                                    share_pwd: shareLog.share_pwd,
                                    share_link: obj.buildShareLink(shareId, shareLog.share_source, shareLog.share_link),
                                    share_time: obj.buildShareTime(shareLog.share_time)
                                });
                            }
                        });
                        return filterShareLogList.reverse();
                    }
                }
            });
        };

        obj.buildShareLink = function (shareId, shareSource, shareLink) {
            if (shareSource == config.source.baidu) {
                shareLink = "https://pan.baidu.com/s/1" + shareId;
            }
            else if (shareSource == config.source.baidu) {
                shareLink = "https://share.weiyun.com/" + shareId;
            } else if (shareSource == config.source.baidu) {
                shareLink = "https://www.lanzous.com/" + shareId;
            }
            return shareLink;
        };

        obj.buildShareTime = function (shareTime) {
            var date = new Date(shareTime);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return util.replaceVars(vars, "Y-m-d H:i:s");

        };

        obj.existMeta = function (name) {
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        return obj;
    });

    container.define("app", ["config", "core", "$"], function (config, core, $, require) {
        var obj = {
            name: "wpzs"
        };

        obj.run = function () {
            var metaName = obj.name + "::status";
            if (obj.existMeta(metaName)) {
                core.printLog(obj.name + " setup already");
            }
            else {
                core.printLog(obj.name + " setup success");

                // 添加meta
                obj.appendMeta(metaName);

                // 运行应用
                obj.runApp();
            }
        };

        obj.runApp = function () {
            var appList = [
                {
                    name: "app_baidu",
                    matchs: [
                        "baidu.com"
                    ]
                },
                {
                    name: "app_weiyun",
                    matchs: [
                        "weiyun.com"
                    ]
                },
                {
                    name: "app_lanzous",
                    matchs: [
                        "lanzous.com"
                    ]
                },
                {
                    name: "app_weibo",
                    matchs: [
                        "weibo.com"
                    ]
                },
                {
                    name: "app_[ctfile|pipipan]",
                    matchs: [
                        "ctfile.com",
                        "pipipan.com"
                    ]
                },
                {
                    name: "app_dfpan",
                    matchs: [
                        "dfpan.com"
                    ]
                },
                {
                    name: "app_ccchoo",
                    matchs: [
                        "ccchoo.com"
                    ]
                },
                {
                    name: "app_vdisk",
                    matchs: [
                        "vdisk.cn"
                    ]
                },
                {
                    name: "app_yimuhe",
                    matchs: [
                        "yimuhe.com"
                    ]
                },
                {
                    name: "app_newday",
                    matchs: [
                        "newday.me"
                    ]
                }
            ];
            var url = config.getUrl();
            for (var i in appList) {
                var app = appList[i];
                if (obj.matchApp(url, app) && require(app.name).run() == true) {
                    break;
                }
            }
        };

        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0) {
                    match = true;
                }
            });
            return match;
        };

        obj.existMeta = function (name) {
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.appendMeta = function (name, content) {
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };

        return obj;
    });

    // 注册模块
    container.register("$", window.$);
    container.register("snap", window.Snap);
    container.register("vue", window.Vue);

    container.use(["core", "app"], function (core, app) {
        core.init(function () {
            app.run();
        });
    });
})();

// 百度云限速破解

(function () {
  'use strict';

  var log_count = 1;
  var classMap = {
    'list': 'zJMtAEb',
    'grid': 'fyQgAEb',
    'list-grid-switch': 'auiaQNyn',
    'list-switched-on': 'ewXm1e',
    'grid-switched-on': 'kxhkX2Em',
    'list-switch': 'rvpXm63',
    'grid-switch': 'mxgdJgwv',
    'checkbox': 'EOGexf',
    'col-item': 'Qxyfvg',
    'check': 'fydGNC',
    'checked': 'EzubGg',
    'chekbox-grid': 'cEefyz',
    'list-view': 'vdAfKMb',
    'item-active': 'wf4n1E',
    'grid-view': 'JKvHJMb',
    'bar-search': 'OFaPaO',
    'list-tools': 'tcuLAu',
  };
  $(function () {
    classMap['default-dom'] = ($('.icon-upload').parent().parent().parent().parent().parent().attr('class'));
    classMap['bar'] = ($('.icon-upload').parent().parent().parent().parent().attr('class'));

    switch (detectPage()) {
      case 'disk':
        var panHelper = new PanHelper();
        panHelper.init();
        return;
      case 'share':
      case 's':
        var panShareHelper = new PanShareHelper();
        panShareHelper.init();
        return;
      default:
        return;
    }
  });

  function slog(c1, c2, c3) {
    c1 = c1 ? c1 : '';
    c2 = c2 ? c2 : '';
    c3 = c3 ? c3 : '';
    console.log('#' + ('00'+log_count++).slice(-2) + '-助手日志:', c1, c2, c3);
  }

  //网盘页面的下载助手
  function PanHelper() {
    var yunData, sign, timestamp, bdstoken, logid, fid_list;
    var fileList = [], selectFileList = [], batchLinkList = [], batchLinkListAll = [], linkList = [],
      list_grid_status = 'list';
    var observer, currentPage, currentPath, currentCategory, dialog, searchKey;
    var panAPIUrl = location.protocol + "//" + location.host + "/api/";
    var restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
    var clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";

    this.init = function () {
      yunData = unsafeWindow.yunData;
      slog('yunData:', yunData);
      if (yunData === undefined) {
        slog('页面未正常加载，或者百度已经更新！');
        return;
      }
      initParams();
      registerEventListener();
      createObserver();
      addButton();
      createIframe();
      dialog = new Dialog({addCopy: true});
      slog('网盘直接下载助手加载成功！');
    };

    function initParams() {
      sign = getSign();
      timestamp = getTimestamp();
      bdstoken = getBDStoken();
      logid = getLogID();
      currentPage = getCurrentPage();
      slog('当前模式:', currentPage);

      if (currentPage == 'all')
        currentPath = getPath();
      if (currentPage == 'category')
        currentCategory = getCategory();
      if (currentPage == 'search')
        searchKey = getSearchKey();
      refreshListGridStatus();
      refreshFileList();
      refreshSelectList();
    }

    function refreshFileList() {
      if (currentPage == 'all') {
        fileList = getFileList();
      } else if (currentPage == 'category') {
        fileList = getCategoryFileList();
      } else if (currentPage == 'search') {
        fileList = getSearchFileList();
      }
    }

    function refreshSelectList() {
      selectFileList = [];
    }

    function refreshListGridStatus() {
      list_grid_status = getListGridStatus();
    }

    //获取当前的视图模式
    function getListGridStatus() {
      if ($('.' + classMap['list']).is(':hidden')) {
        return 'grid'
      } else {
        return 'list'
      }
    }

    function registerEventListener() {
      registerHashChange();
      registerListGridStatus();
      registerCheckbox();
      registerAllCheckbox();
      registerFileSelect();
    }

    //监视地址栏#标签的变化
    function registerHashChange() {
      window.addEventListener('hashchange', function (e) {
        refreshListGridStatus();

        if (getCurrentPage() == 'all') {
          if (currentPage == getCurrentPage()) {
            if (currentPath != getPath()) {
              currentPath = getPath();
              refreshFileList();
              refreshSelectList();
            }
          } else {
            currentPage = getCurrentPage();
            currentPath = getPath();
            refreshFileList();
            refreshSelectList();
          }
        } else if (getCurrentPage() == 'category') {
          if (currentPage == getCurrentPage()) {
            if (currentCategory != getCategory()) {
              currentPage = getCurrentPage();
              currentCategory = getCategory();
              refreshFileList();
              refreshSelectList();
            }
          } else {
            currentPage = getCurrentPage();
            currentCategory = getCategory();
            refreshFileList();
            refreshSelectList();
          }
        } else if (getCurrentPage() == 'search') {
          if (currentPage == getCurrentPage()) {
            if (searchKey != getSearchKey()) {
              currentPage = getCurrentPage();
              searchKey = getSearchKey();
              refreshFileList();
              refreshSelectList();
            }
          } else {
            currentPage = getCurrentPage();
            searchKey = getSearchKey();
            refreshFileList();
            refreshSelectList();
          }
        }
      });
    }

    //监视视图变化
    function registerListGridStatus() {
      var $a_list = $('a[data-type=list]');
      $a_list.click(function () {
        list_grid_status = 'list';
      });

      var $a_grid = $('a[data-type=grid]');
      $a_grid.click(function () {
        list_grid_status = 'grid';
      });
    }

    //文件选择框
    function registerCheckbox() {
      var $checkbox = $('span.' + classMap['checkbox']);
      if (list_grid_status == 'grid') {
        $checkbox = $('.' + classMap['chekbox-grid']);
      }

      $checkbox.each(function (index, element) {
        $(element).bind('click', function (e) {
          var $parent = $(this).parent();
          var filename;
          var isActive;

          if (list_grid_status == 'list') {
            filename = $('div.file-name div.text a', $parent).attr('title');
            isActive = $parent.hasClass(classMap['item-active']);
          } else if (list_grid_status == 'grid') {
            filename = $('div.file-name a', $(this)).attr('title');
            isActive = !$(this).hasClass(classMap['item-active'])
          }

          if (isActive) {
            slog('取消选中文件：' + filename);
            for (var i = 0; i < selectFileList.length; i++) {
              if (selectFileList[i].filename == filename) {
                selectFileList.splice(i, 1);
              }
            }
          } else {
            slog('选中文件:' + filename);
            $.each(fileList, function (index, element) {
              if (element.server_filename == filename) {
                var obj = {
                  filename: element.server_filename,
                  path: element.path,
                  fs_id: element.fs_id,
                  isdir: element.isdir
                };
                selectFileList.push(obj);
              }
            });
          }
        });
      });
    }

    function unregisterCheckbox() {
      var $checkbox = $('span.' + classMap['checkbox']);
      $checkbox.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //全选框
    function registerAllCheckbox() {
      var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
      $checkbox.each(function (index, element) {
        $(element).bind('click', function (e) {
          var $parent = $(this).parent();
          if ($parent.hasClass(classMap['checked'])) {
            slog('取消全选');
            selectFileList = [];
          } else {
            slog('全部选中');
            selectFileList = [];
            $.each(fileList, function (index, element) {
              var obj = {
                filename: element.server_filename,
                path: element.path,
                fs_id: element.fs_id,
                isdir: element.isdir
              };
              selectFileList.push(obj);
            });
          }
        });
      });
    }

    function unregisterAllCheckbox() {
      var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
      $checkbox.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //单个文件选中，点击文件不是点击选中框，会只选中该文件
    function registerFileSelect() {
      var $dd = $('div.' + classMap['list-view'] + ' dd');
      $dd.each(function (index, element) {
        $(element).bind('click', function (e) {
          var nodeName = e.target.nodeName.toLowerCase();
          if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
            slog('shiftKey:' + e.shiftKey);
            if (!e.shiftKey) {
              selectFileList = [];
              var filename = $('div.file-name div.text a', $(this)).attr('title');
              slog('选中文件：' + filename);
              $.each(fileList, function (index, element) {
                if (element.server_filename == filename) {
                  var obj = {
                    filename: element.server_filename,
                    path: element.path,
                    fs_id: element.fs_id,
                    isdir: element.isdir
                  };
                  selectFileList.push(obj);
                }
              });
            } else {
              selectFileList = [];
              var $dd_select = $('div.' + classMap['list-view'] + ' dd.' + classMap['item-active']);
              $.each($dd_select, function (index, element) {
                var filename = $('div.file-name div.text a', $(element)).attr('title');
                slog('选中文件：' + filename);
                $.each(fileList, function (index, element) {
                  if (element.server_filename == filename) {
                    var obj = {
                      filename: element.server_filename,
                      path: element.path,
                      fs_id: element.fs_id,
                      isdir: element.isdir
                    };
                    selectFileList.push(obj);
                  }
                });
              });
            }
          }
        });
      });
    }

    function unregisterFileSelect() {
      var $dd = $('div.' + classMap['list-view'] + ' dd');
      $dd.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //监视文件列表显示变化
    function createObserver() {
      var MutationObserver = window.MutationObserver;
      var options = {
        'childList': true
      };
      observer = new MutationObserver(function (mutations) {
        unregisterCheckbox();
        unregisterAllCheckbox();
        unregisterFileSelect();
        registerCheckbox();
        registerAllCheckbox();
        registerFileSelect();
      });

      var list_view = document.querySelector('.' + classMap['list-view']);
      var grid_view = document.querySelector('.' + classMap['grid-view']);

      observer.observe(list_view, options);
      observer.observe(grid_view, options);
    }

    //添加助手按钮
    function addButton() {
      $('div.' + classMap['bar-search']).css('width', '18%');
      var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
      var $dropdownbutton_a = $('<a class="g-button g-button-blue" href="javascript:void(0);"><span class="g-button-right"><em class="icon icon-download" title="百度网盘下载助手"></em><span class="text" style="width: auto;">下载助手</span></span></a>');
      var $dropdownbutton_span = $('<span class="menu" style="width:96px"></span>');

      var $directbutton = $('<span class="g-button-menu" style="display:block"></span>');
      var $directbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
      var $directbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">直接下载</span></span></a>');
      var $directbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
      var $directbutton_download_button = $('<a id="download-direct" class="g-button-menu" href="javascript:void(0);">下载</a>');
      var $directbutton_link_button = $('<a id="link-direct" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
      var $directbutton_batchhttplink_button = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:void(0);">批量链接(HTTP)</a>');
      var $directbutton_batchhttpslink_button = $('<a id="batchhttpslink-direct" class="g-button-menu" href="javascript:void(0);">批量链接(HTTPS)</a>');
      $directbutton_menu.append($directbutton_download_button).append($directbutton_link_button).append($directbutton_batchhttplink_button).append($directbutton_batchhttpslink_button);
      $directbutton.append($directbutton_span.append($directbutton_a).append($directbutton_menu));
      $directbutton.hover(function () {
        $directbutton_span.toggleClass('button-open');
      });
      $directbutton_download_button.click(downloadClick);
      $directbutton_link_button.click(linkClick);
      $directbutton_batchhttplink_button.click(batchClick);
      $directbutton_batchhttpslink_button.click(batchClick);

      var $apibutton = $('<span class="g-button-menu" style="display:block"></span>');
      var $apibutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
      var $apibutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>');
      var $apibutton_menu = $('<span class="menu" style="width:120px;left:77px"></span>');
      var $apibutton_download_button = $('<a id="download-api" class="g-button-menu" href="javascript:void(0);">下载</a>');
      var $apibutton_link_button = $('<a id="httplink-api" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
      var $apibutton_batchhttplink_button = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:void(0);">批量链接(HTTP)</a>');
      var $apibutton_batchhttpslink_button = $('<a id="batchhttpslink-api" class="g-button-menu" href="javascript:void(0);">批量链接(HTTPS)</a>');
      $apibutton_menu.append($apibutton_download_button).append($apibutton_link_button).append($apibutton_batchhttplink_button).append($apibutton_batchhttpslink_button);
      $apibutton.append($apibutton_span.append($apibutton_a).append($apibutton_menu));
      $apibutton.hover(function () {
        $apibutton_span.toggleClass('button-open');
      });
      $apibutton_download_button.click(downloadClick);
      $apibutton_link_button.click(linkClick);
      $apibutton_batchhttplink_button.click(batchClick);
      $apibutton_batchhttpslink_button.click(batchClick);


      var $outerlinkbutton = $('<span class="g-button-menu" style="display:block"></span>');
      var $outerlinkbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
      var $outerlinkbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">外链下载</span></span></a>');
      var $outerlinkbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
      var $outerlinkbutton_link_button = $('<a id="link-outerlink" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
      var $outerlinkbutton_batchlink_button = $('<a id="batchlink-outerlink" class="g-button-menu" href="javascript:void(0);">批量链接</a>');
      $outerlinkbutton_menu.append($outerlinkbutton_link_button).append($outerlinkbutton_batchlink_button);
      $outerlinkbutton.append($outerlinkbutton_span.append($outerlinkbutton_a).append($outerlinkbutton_menu));
      $outerlinkbutton.hover(function () {
        $outerlinkbutton_span.toggleClass('button-open');
      });
      $outerlinkbutton_link_button.click(linkClick);
      $outerlinkbutton_batchlink_button.click(batchClick);

      var $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
      //$dropdownbutton_span.append($directbutton).append($apibutton).append($outerlinkbutton);
      $dropdownbutton_span.append($apibutton).append($outerlinkbutton).append($github);
      $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

      $dropdownbutton.hover(function () {
        $dropdownbutton.toggleClass('button-open');
      });

      $('.' + classMap['list-tools']).append($dropdownbutton);
      $('.' + classMap['list-tools']).css('height', '40px');
    }

    // 我的网盘 - 下载
    function downloadClick(event) {
      slog('选中文件列表：', selectFileList);
      var id = event.target.id;
      var downloadLink;

      if (id == 'download-direct') {
        var downloadType;
        if (selectFileList.length === 0) {
          alert("获取选中文件失败，请刷新重试！");
          return;
        } else if (selectFileList.length == 1) {
          if (selectFileList[0].isdir === 1)
            downloadType = 'batch';
          else if (selectFileList[0].isdir === 0)
            downloadType = 'dlink';
        } else if (selectFileList.length > 1) {
          downloadType = 'batch';
        }

        fid_list = getFidList(selectFileList);
        var result = getDownloadLinkWithPanAPI(downloadType);
        if (result.errno === 0) {
          if (downloadType == 'dlink')
            downloadLink = result.dlink[0].dlink;
          else if (downloadType == 'batch') {
            downloadLink = result.dlink;
            if (selectFileList.length === 1)
              downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
          } else {
            alert("发生错误！");
            return;
          }
        } else if (result.errno == -1) {
          alert('文件不存在或已被百度和谐，无法下载！');
          return;
        } else if (result.errno == 112) {
          alert("页面过期，请刷新重试！");
          return;
        } else {
          alert("发生错误！");
          return;
        }
      } else {
        if (selectFileList.length === 0) {
          alert("获取选中文件失败，请刷新重试！");
          return;
        } else if (selectFileList.length > 1) {
          alert("该方法不支持多文件下载！");
          return;
        } else {
          if (selectFileList[0].isdir == 1) {
            alert("该方法不支持目录下载！请使用批量下载");
            return;
          }
        }
        if (id == 'download-api') {
          downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
        }
      }
      execDownload(downloadLink);
    }

    //我的网盘 - 显示链接
    function linkClick(event) {
      slog('选中文件列表：', selectFileList);
      var id = event.target.id;
      var linkList, tip;

      if (id.indexOf('direct') != -1) {
        var downloadType;
        var downloadLink;
        if (selectFileList.length === 0) {
          alert("获取选中文件失败，请刷新重试！");
          return;
        } else if (selectFileList.length == 1) {
          if (selectFileList[0].isdir === 1)
            downloadType = 'batch';
          else if (selectFileList[0].isdir === 0)
            downloadType = 'dlink';
        } else if (selectFileList.length > 1) {
          downloadType = 'batch';
        }
        fid_list = getFidList(selectFileList);
        var result = getDownloadLinkWithPanAPI(downloadType);
        if (result.errno === 0) {
          if (downloadType == 'dlink')
            downloadLink = result.dlink[0].dlink;
          else if (downloadType == 'batch') {
            slog(selectFileList);
            downloadLink = result.dlink;
            if (selectFileList.length === 1)
              downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
          } else {
            alert("发生错误！");
            return;
          }
        } else if (result.errno == -1) {
          alert('文件不存在或已被百度和谐，无法下载！');
          return;
        } else if (result.errno == 112) {
          alert("页面过期，请刷新重试！");
          return;
        } else {
          alert("发生错误！");
          return;
        }
        var httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
        var httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
        var filename = '';
        $.each(selectFileList, function (index, element) {
          if (selectFileList.length == 1)
            filename = element.filename;
          else {
            if (index == 0)
              filename = element.filename;
            else
              filename = filename + ',' + element.filename;
          }
        });
        linkList = {
          filename: filename,
          urls: [
            {url: httplink, rank: 1},
            {url: httpslink, rank: 2}
          ]
        };
        tip = '显示模拟百度网盘网页获取的链接，可以使用右键迅雷或IDM下载，多文件打包(限300k)下载的链接可以直接复制使用';
        dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
      } else {
        if (selectFileList.length === 0) {
          alert("获取选中文件失败，请刷新重试！");
          return;
        } else if (selectFileList.length > 1) {
          alert("该方法不支持多文件下载！请使用批量下载");
          return;
        } else {
          if (selectFileList[0].isdir == 1) {
            alert("该方法不支持目录下载！");
            return;
          }
        }
        if (id.indexOf('api') != -1) {
          var downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
          var httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
          var httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
          linkList = {
            filename: selectFileList[0].filename,
            urls: [
              {url: httplink, rank: 1},
              {url: httpslink, rank: 2}
            ]
          };
          httplink = httplink.replace('265486', '290150');
          httpslink = httpslink.replace('265486', '290150');
          linkList.urls.push({url: httplink, rank: 3});
          linkList.urls.push({url: httpslink, rank: 4});
          tip = '显示模拟APP获取的链接(使用百度云ID)，可以右键使用迅雷或IDM下载，直接复制链接无效';
          dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
        } else if (id.indexOf('outerlink') != -1) {
          getDownloadLinkWithClientAPI(selectFileList[0].path, function (result) {
            if (result.errno == 0) {
              linkList = {
                filename: selectFileList[0].filename,
                urls: result.urls
              };
            } else if (result.errno == 1) {
              alert('文件不存在！');
              return;
            } else if (result.errno == 2) {
              alert('文件不存在或者已被百度和谐，无法下载！');
              return;
            } else {
              alert('发生错误！');
              return;
            }
            tip = '显示模拟百度网盘客户端获取的链接，获取百度网盘多镜像下载地址 ，左键点击下载 ，推荐最后一个地址';
            dialog.open({
              title: '下载链接',
              type: 'GMlink',
              list: linkList,
              tip: tip,
              showcopy: false,
              showedit: false
            });
          });
        }
      }
    }

    // 我的网盘 - 批量下载
    function batchClick(event) {
      //console.log('batchClick');
      slog('选中文件列表：', selectFileList);
      if (selectFileList.length === 0) {
        alert('获取选中文件失败，请刷新重试！');
        return;
      }
      var id = event.target.id;
      var linkType, tip;
      linkType = id.indexOf('https') == -1 ? (id.indexOf('http') == -1 ? location.protocol + ':' : 'http:') : 'https:';
      batchLinkList = [];
      batchLinkListAll = [];
      if (id.indexOf('direct') != -1) {
        batchLinkList = getDirectBatchLink(linkType);
        tip = '显示所有选中文件的直接下载链接，文件夹显示为打包下载的链接';
        if (batchLinkList.length === 0) {
          alert('没有链接可以显示，API链接不要全部选中文件夹！');
          return;
        }
        dialog.open({title: '批量链接', type: 'batch', list: batchLinkList, tip: tip, showcopy: true});
      } else if (id.indexOf('api') != -1) {
        batchLinkList = getAPIBatchLink(linkType);
        tip = '显示所有选中文件的API下载链接，直接复制链接无效，请安装IDM或迅雷Chrome插件';
        if (batchLinkList.length === 0) {
          alert('没有链接可以显示，API链接不要全部选中文件夹！');
          return;
        }
        dialog.open({title: '批量链接', type: 'batch', list: batchLinkList, tip: tip, showcopy: true});
      } else if (id.indexOf('outerlink') != -1) {
        getOuterlinkBatchLinkAll(function(batchLinkListAll){
          batchLinkList = getOuterlinkBatchLinkFirst(batchLinkListAll);
          tip = '显示模拟百度网盘客户端获取的链接，获取百度网盘多镜像下载地址 ，左键点击下载 ，推荐最后一个地址';
          if (batchLinkList.length === 0) {
            alert('没有链接可以显示，API链接不要全部选中文件夹！');
            return;
          }

          dialog.open({
            title: '批量链接',
            type: 'GMbatch',
            list: batchLinkList,
            tip: tip,
            showcopy: true,
            alllist: batchLinkListAll,
            showall: true
          });
        });

      }
    }

    function getDirectBatchLink(linkType) {
      var list = [];
      $.each(selectFileList, function (index, element) {
        var downloadType, downloadLink, result;
        if (element.isdir == 0)
          downloadType = 'dlink';
        else
          downloadType = 'batch';
        fid_list = getFidList([element]);
        result = getDownloadLinkWithPanAPI(downloadType);
        if (result.errno == 0) {
          if (downloadType == 'dlink')
            downloadLink = result.dlink[0].dlink;
          else if (downloadType == 'batch')
            downloadLink = result.dlink;
          downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
        } else {
          downloadLink = 'error';
        }
        list.push({filename: element.filename, downloadlink: downloadLink});
      });
      return list;
    }

    function getAPIBatchLink(linkType) {
      var list = [];
      $.each(selectFileList, function (index, element) {
        if (element.isdir == 1)
          return;
        var downloadLink;
        downloadLink = getDownloadLinkWithRESTAPIBaidu(element.path);
        downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
        list.push({filename: element.filename, downloadlink: downloadLink});
      });
      return list;
    }

    function getOuterlinkBatchLinkAll(cb) {
      var list = [];
      $.each(selectFileList, function (index, element) {
        if (element.isdir == 1)
          return;
        getDownloadLinkWithClientAPI(element.path,function (result) {
          if (result.errno == 0) {
            list.push({filename: element.filename, links: result.urls});
          } else {
            list.push({filename: element.filename, links: [{rank: 1, url: 'error'}]});
          }
          cb(list)
        });
      });
    }

    function getOuterlinkBatchLinkFirst(list) {
      var result = [];
      $.each(list, function (index, element) {
        result.push({filename: element.filename, downloadlink: element.links[0].url});
      });
      return result;
    }

    function getSign() {
      var signFnc;
      try {
        signFnc = new Function("return " + yunData.sign2)();
      } catch (e) {
        throw new Error(e.message);
      }
      return base64Encode(signFnc(yunData.sign5, yunData.sign1));
    }

    //获取当前目录
    function getPath() {
      var hash = location.hash;
      var regx = new RegExp("path=([^&]*)(&|$)", 'i');
      var result = hash.match(regx);
      //console.log(result);
      return decodeURIComponent(result[1]);
    }

    //获取分类显示的类别，即地址栏中的type
    function getCategory() {
      var hash = location.hash;
      var regx = new RegExp("type=([^&]*)(&|$)", 'i');
      var result = hash.match(regx);
      return decodeURIComponent(result[1]);
    }

    function getSearchKey() {
      var hash = location.hash;
      var regx = new RegExp("key=([^&]*)(&|$)", 'i');
      var result = hash.match(regx);
      return decodeURIComponent(result[1]);
    }

    //获取当前页面(all或者category或search)
    function getCurrentPage() {
      var hash = location.hash;
      return hash.substring(hash.indexOf('#') + 2, hash.indexOf('?'));
    }

    //获取文件列表
    function getFileList() {
      var filelist = [];
      var listUrl = panAPIUrl + "list";
      var path = getPath();
      logid = getLogID();
      var params = {
        dir: path,
        bdstoken: bdstoken,
        logid: logid,
        order: 'size',
        desc: 0,
        clienttype: 0,
        showempty: 0,
        web: 1,
        channel: 'chunlei',
        appid: 265486
      };

      $.ajax({
        url: listUrl,
        async: false,
        method: 'GET',
        data: params,
        success: function (response) {
          filelist = 0 === response.errno ? response.list : [];
        }
      });
      return filelist;
    }

    //获取分类页面下的文件列表
    function getCategoryFileList() {
      var filelist = [];
      var listUrl = panAPIUrl + "categorylist";
      var category = getCategory();
      logid = getLogID();
      var params = {
        category: category,
        bdstoken: bdstoken,
        logid: logid,
        order: 'size',
        desc: 0,
        clienttype: 0,
        showempty: 0,
        web: 1,
        channel: 'chunlei',
        appid: 265486
      };
      $.ajax({
        url: listUrl,
        async: false,
        method: 'GET',
        data: params,
        success: function (response) {
          filelist = 0 === response.errno ? response.info : [];
        }
      });
      return filelist;
    }

    function getSearchFileList() {
      var filelist = [];
      var listUrl = panAPIUrl + 'search';
      logid = getLogID();
      searchKey = getSearchKey();
      var params = {
        recursion: 1,
        order: 'time',
        desc: 1,
        showempty: 0,
        web: 1,
        page: 1,
        num: 100,
        key: searchKey,
        channel: 'chunlei',
        app_id: 250258,
        bdstoken: bdstoken,
        logid: logid,
        clienttype: 0
      };
      $.ajax({
        url: listUrl,
        async: false,
        method: 'GET',
        data: params,
        success: function (response) {
          filelist = 0 === response.errno ? response.list : [];
        }
      });
      return filelist;
    }

    //生成下载时的fid_list参数
    function getFidList(list) {
      var fidlist = null;
      if (list.length === 0)
        return null;
      var fileidlist = [];
      $.each(list, function (index, element) {
        fileidlist.push(element.fs_id);
      });
      fidlist = '[' + fileidlist + ']';
      return fidlist;
    }

    function getTimestamp() {
      return yunData.timestamp;
    }

    function getBDStoken() {
      return yunData.MYBDSTOKEN;
    }

    //获取直接下载地址
    //这个地址不是直接下载地址，访问这个地址会返回302，response header中的location才是真实下载地址
    //暂时没有找到提取方法
    function getDownloadLinkWithPanAPI(type) {
      var downloadUrl = panAPIUrl + "download";
      var result;
      logid = getLogID();
      var params = {
        sign: sign,
        timestamp: timestamp,
        fidlist: fid_list,
        type: type,
        channel: 'chunlei',
        web: 1,
        app_id: 265486,
        bdstoken: bdstoken,
        logid: logid,
        clienttype: 0
      };
      $.ajax({
        url: downloadUrl,
        async: false,
        method: 'GET',
        data: params,
        success: function (response) {
          result = response;
        }
      });
      return result;
    }

    function getDownloadLinkWithRESTAPIBaidu(path) {
      var link = restAPIUrl + 'file?method=download&app_id=265486&path=' + encodeURIComponent(path);
      return link;
    }

    function getDownloadLinkWithClientAPI(path, cb) {
      var result;
      var url = clientAPIUrl + 'file?method=locatedownload&app_id=265486&ver=4.0&path=' + encodeURIComponent(path);

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: {
          "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
        },
        onload: function (res) {
          if (res.status === 200) {
            result = JSON.parse(res.responseText);
            if (result.error_code == undefined) {
              if (result.urls == undefined) {
                result.errno = 2;
              } else {
                $.each(result.urls, function (index, element) {
                  result.urls[index].url = element.url.replace('\\', '');
                });
                result.errno = 0;
              }
            } else if (result.error_code == 31066) {
              result.errno = 1;
            } else {
              result.errno = -1;
            }
          } else {
            result = {};
            result.errno = -1;
          }
          cb(result)

        }
      });
    }

    function execDownload(link) {
      slog("下载链接：" + link);
      $('#helperdownloadiframe').attr('src', link);
    }

    function createIframe() {
      var $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
      var $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
      $div.append($iframe);
      $('body').append($div);

    }
  }

  //分享页面的下载助手
  function PanShareHelper() {
    var yunData, sign, timestamp, bdstoken, channel, clienttype, web, app_id, logid, encrypt, product, uk,
      primaryid, fid_list, extra, shareid;
    var vcode;
    var shareType, buttonTarget, currentPath, list_grid_status, observer, dialog, vcodeDialog;
    var fileList = [], selectFileList = [];
    var panAPIUrl = location.protocol + "//" + location.host + "/api/";
    var shareListUrl = location.protocol + "//" + location.host + "/share/list";

    this.init = function () {
      yunData = unsafeWindow.yunData;
      slog('yunData:', yunData);
      if (yunData === undefined || yunData.FILEINFO == null) {
        slog('页面未正常加载，或者百度已经更新！');
        return;
      }
      initParams();
      addButton();
      dialog = new Dialog({addCopy: false});
      vcodeDialog = new VCodeDialog(refreshVCode, confirmClick);
      createIframe();

      if (!isSingleShare()) {
        registerEventListener();
        createObserver();
      }

      slog('分享助手加载成功!');
    };

    function initParams() {
      shareType = getShareType();
      sign = yunData.SIGN;
      timestamp = yunData.TIMESTAMP;
      bdstoken = yunData.MYBDSTOKEN;
      channel = 'chunlei';
      clienttype = 0;
      web = 1;
      app_id = 265486;
      logid = getLogID();
      encrypt = 0;
      product = 'share';
      primaryid = yunData.SHARE_ID;
      uk = yunData.SHARE_UK;

      if (shareType == 'secret') {
        extra = getExtra();
      }
      if (isSingleShare()) {
        var obj = {};
        if (yunData.CATEGORY == 2) {
          obj.filename = yunData.FILENAME;
          obj.path = yunData.PATH;
          obj.fs_id = yunData.FS_ID;
          obj.isdir = 0;
        } else {
          obj.filename = yunData.FILEINFO[0].server_filename,
            obj.path = yunData.FILEINFO[0].path,
            obj.fs_id = yunData.FILEINFO[0].fs_id,
            obj.isdir = yunData.FILEINFO[0].isdir
        }
        selectFileList.push(obj);
      } else {
        shareid = yunData.SHARE_ID;
        currentPath = getPath();
        list_grid_status = getListGridStatus();
        fileList = getFileList();
      }
    }

    //判断分享类型（public或者secret）
    function getShareType() {
      return yunData.SHARE_PUBLIC === 1 ? 'public' : 'secret';
    }

    //判断是单个文件分享还是文件夹或者多文件分享
    function isSingleShare() {
      return yunData.getContext === undefined ? true : false;
    }

    //判断是否为自己的分享链接
    function isSelfShare() {
      return yunData.MYSELF == 1 ? true : false;
    }

    function getExtra() {
      var seKey = decodeURIComponent(getCookie('BDCLND'));
      return '{' + '"sekey":"' + seKey + '"' + "}";
    }

    //获取当前目录
    function getPath() {
      var hash = location.hash;
      var regx = new RegExp("path=([^&]*)(&|$)", 'i');
      var result = hash.match(regx);
      return decodeURIComponent(result[1]);
    }

    //获取当前的视图模式
    function getListGridStatus() {
      var status = 'list';
      if ($('.list-switched-on').length > 0) {
        status = 'list';
      } else if ($('.grid-switched-on').length > 0) {
        status = 'grid';
      }
      return status;
    }

    //添加下载助手按钮
    function addButton() {
      if (isSingleShare()) {
        $('div.slide-show-right').css('width', '500px');
        $('div.frame-main').css('width', '96%');
        $('div.share-file-viewer').css('width', '740px').css('margin-left', 'auto').css('margin-right', 'auto');
      } else
        $('div.slide-show-right').css('width', '500px');
      var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
      var $dropdownbutton_a = $('<a class="g-button g-button-blue" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
      var $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-download" title="百度网盘下载助手"></em><span class="text" style="width: auto;">下载助手</span></span>');
      var $dropdownbutton_span = $('<span class="menu" style="width:auto;z-index:41"></span>');

      var $downloadButton = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
      var $linkButton = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:void(0);">显示链接</a>');

      var $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 100px;padding: 0 8px;box-sizing: border-box;margin-top: 5px;"></iframe>');

      $dropdownbutton_span.append($downloadButton).append($linkButton).append($github);
      $dropdownbutton_a.append($dropdownbutton_a_span);
      $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

      $dropdownbutton.hover(function () {
        $dropdownbutton.toggleClass('button-open');
      });

      $downloadButton.click(downloadButtonClick);
      $linkButton.click(linkButtonClick);

      $('div.module-share-top-bar div.bar div.x-button-box').append($dropdownbutton);
    }

    function createIframe() {
      var $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
      var $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
      $div.append($iframe);
      $('body').append($div);
    }

    function registerEventListener() {
      registerHashChange();
      registerListGridStatus();
      registerCheckbox();
      registerAllCheckbox();
      registerFileSelect();
    }

    //监视地址栏#标签变化
    function registerHashChange() {
      window.addEventListener('hashchange', function (e) {
        list_grid_status = getListGridStatus();
        if (currentPath == getPath()) {

        } else {
          currentPath = getPath();
          refreshFileList();
          refreshSelectFileList();
        }
      });
    }

    function refreshFileList() {
      fileList = getFileList();
    }

    function refreshSelectFileList() {
      selectFileList = [];
    }

    //监视视图变化
    function registerListGridStatus() {
      var $a_list = $('a[data-type=list]');
      $a_list.click(function () {
        list_grid_status = 'list';
      });

      var $a_grid = $('a[data-type=grid]');
      $a_grid.click(function () {
        list_grid_status = 'grid';
      });
    }

    //监视文件选择框
    function registerCheckbox() {
      var $checkbox = $('span.' + classMap['checkbox']);
      if (list_grid_status == 'grid') {
        $checkbox = $('.' + classMap['chekbox-grid']);
      }
      $checkbox.each(function (index, element) {
        $(element).bind('click', function (e) {
          var $parent = $(this).parent();
          var filename;
          var isActive;

          if (list_grid_status == 'list') {
            filename = $('div.file-name div.text a', $parent).attr('title');
            isActive = $(this).parents('dd').hasClass('JS-item-active')
          } else if (list_grid_status == 'grid') {
            filename = $('div.file-name a', $(this)).attr('title');
            isActive = !$(this).hasClass('JS-item-active')
          }

          if (isActive) {
            slog('取消选中文件：' + filename);
            for (var i = 0; i < selectFileList.length; i++) {
              if (selectFileList[i].filename == filename) {
                selectFileList.splice(i, 1);
              }
            }
          } else {
            slog('选中文件: ' + filename);
            $.each(fileList, function (index, element) {
              if (element.server_filename == filename) {
                var obj = {
                  filename: element.server_filename,
                  path: element.path,
                  fs_id: element.fs_id,
                  isdir: element.isdir
                };
                selectFileList.push(obj);
              }
            });
          }
        });
      });
    }

    function unregisterCheckbox() {
      var $checkbox = $('span.' + classMap['checkbox']);
      $checkbox.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //监视全选框
    function registerAllCheckbox() {
      var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
      $checkbox.each(function (index, element) {
        $(element).bind('click', function (e) {
          var $parent = $(this).parent();
          if ($parent.hasClass(classMap['checked'])) {
            slog('取消全选');
            selectFileList = [];
          } else {
            slog('全部选中');
            selectFileList = [];
            $.each(fileList, function (index, element) {
              var obj = {
                filename: element.server_filename,
                path: element.path,
                fs_id: element.fs_id,
                isdir: element.isdir
              };
              selectFileList.push(obj);
            });
          }
        });
      });
    }

    function unregisterAllCheckbox() {
      var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
      $checkbox.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //监视单个文件选中
    function registerFileSelect() {
      var $dd = $('div.' + classMap['list-view'] + ' dd');
      $dd.each(function (index, element) {
        $(element).bind('click', function (e) {
          var nodeName = e.target.nodeName.toLowerCase();
          if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
            selectFileList = [];
            var filename = $('div.file-name div.text a', $(this)).attr('title');
            slog('选中文件：' + filename);
            $.each(fileList, function (index, element) {
              if (element.server_filename == filename) {
                var obj = {
                  filename: element.server_filename,
                  path: element.path,
                  fs_id: element.fs_id,
                  isdir: element.isdir
                };
                selectFileList.push(obj);
              }
            });
          }
        });
      });
    }

    function unregisterFileSelect() {
      var $dd = $('div.' + classMap['list-view'] + ' dd');
      $dd.each(function (index, element) {
        $(element).unbind('click');
      });
    }

    //监视文件列表显示变化
    function createObserver() {
      var MutationObserver = window.MutationObserver;
      var options = {
        'childList': true
      };
      observer = new MutationObserver(function (mutations) {
        unregisterCheckbox();
        unregisterAllCheckbox();
        unregisterFileSelect();
        registerCheckbox();
        registerAllCheckbox();
        registerFileSelect();
      });

      var list_view = document.querySelector('.' + classMap['list-view']);
      var grid_view = document.querySelector('.' + classMap['grid-view']);

      observer.observe(list_view, options);
      observer.observe(grid_view, options);
    }

    //获取文件信息列表
    function getFileList() {
      var result = [];
      if (getPath() == '/') {
        result = yunData.FILEINFO;
      } else {
        logid = getLogID();
        var params = {
          uk: uk,
          shareid: shareid,
          order: 'other',
          desc: 1,
          showempty: 0,
          web: web,
          dir: getPath(),
          t: Math.random(),
          bdstoken: bdstoken,
          channel: channel,
          clienttype: clienttype,
          app_id: app_id,
          logid: logid
        };
        $.ajax({
          url: shareListUrl,
          method: 'GET',
          async: false,
          data: params,
          success: function (response) {
            if (response.errno === 0) {
              result = response.list;
            }
          }
        });
      }
      return result;
    }

    function downloadButtonClick() {
      slog('选中文件列表：', selectFileList);
      if (selectFileList.length === 0) {
        alert('获取文件ID失败，请重试');
        return;
      }
      buttonTarget = 'download';
      var downloadLink = getDownloadLink();

      if (downloadLink.errno == -20) {
        vcode = getVCode();
        if (vcode.errno !== 0) {
          alert('获取验证码失败！');
          return;
        }
        vcodeDialog.open(vcode);
      } else if (downloadLink.errno == 112) {
        alert('页面过期，请刷新重试');

      } else if (downloadLink.errno === 0) {
        var link;
        if (selectFileList.length == 1 && selectFileList[0].isdir === 0)
          link = downloadLink.list[0].dlink;
        else
          link = downloadLink.dlink;
        execDownload(link);
      } else {
        alert('获取下载链接失败！');

      }
    }

    //获取验证码
    function getVCode() {
      var url = panAPIUrl + 'getvcode';
      var result;
      logid = getLogID();
      var params = {
        prod: 'pan',
        t: Math.random(),
        bdstoken: bdstoken,
        channel: channel,
        clienttype: clienttype,
        web: web,
        app_id: app_id,
        logid: logid
      };
      $.ajax({
        url: url,
        method: 'GET',
        async: false,
        data: params,
        success: function (response) {
          result = response;
        }
      });
      return result;
    }

    //刷新验证码
    function refreshVCode() {
      vcode = getVCode();
      $('#dialog-img').attr('src', vcode.img);
    }

    //验证码确认提交
    function confirmClick() {
      var val = $('#dialog-input').val();
      if (val.length === 0) {
        $('#dialog-err').text('请输入验证码');
        return;
      } else if (val.length < 4) {
        $('#dialog-err').text('验证码输入错误，请重新输入');
        return;
      }
      var result = getDownloadLinkWithVCode(val);
      if (result.errno == -20) {
        vcodeDialog.close();
        $('#dialog-err').text('验证码输入错误，请重新输入');
        refreshVCode();
        if (!vcode || vcode.errno !== 0) {
          alert('获取验证码失败！');
          return;
        }
        vcodeDialog.open();
      } else if (result.errno === 0) {
        vcodeDialog.close();
        var link;
        if (selectFileList.length == 1 && selectFileList[0].isdir === 0)
          link = result.list[0].dlink;
        else
          link = result.dlink;
        if (buttonTarget == 'download') {
          execDownload(link);
        } else if (buttonTarget == 'link') {
          var filename = '';
          $.each(selectFileList, function (index, element) {
            if (selectFileList.length == 1)
              filename = element.filename;
            else {
              if (index == 0)
                filename = element.filename;
              else
                filename = filename + ',' + element.filename;
            }
          });
          var linkList = {
            filename: filename,
            urls: [
              {url: link, rank: 1}
            ]
          };
          var tip = "显示获取的链接，可以右键使用迅雷或IDM下载，直接复制链接无效";
          dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
        }
      } else {
        alert('发生错误！');

      }
    }

    //生成下载用的fid_list参数
    function getFidList() {
      var fidlist = [];
      $.each(selectFileList, function (index, element) {
        fidlist.push(element.fs_id);
      });
      return '[' + fidlist + ']';
    }

    function linkButtonClick() {
      slog('选中文件列表：', selectFileList);
      if (selectFileList.length === 0) {
        alert('没有选中文件，请重试');
        return;
      }
      buttonTarget = 'link';
      var downloadLink = getDownloadLink();

      if (downloadLink.errno == -20) {
        vcode = getVCode();
        if (!vcode || vcode.errno !== 0) {
          alert('获取验证码失败！');
          return;
        }
        vcodeDialog.open(vcode);
      } else if (downloadLink.errno == 112) {
        alert('页面过期，请刷新重试');

      } else if (downloadLink.errno === 0) {
        var link;
        if (selectFileList.length == 1 && selectFileList[0].isdir === 0)
          link = downloadLink.list[0].dlink;
        else
          link = downloadLink.dlink;
        if (selectFileList.length == 1)
          $('#dialog-downloadlink').attr('href', link).text(link);
        else
          $('#dialog-downloadlink').attr('href', link).text(link);
        var filename = '';
        $.each(selectFileList, function (index, element) {
          if (selectFileList.length == 1)
            filename = element.filename;
          else {
            if (index == 0)
              filename = element.filename;
            else
              filename = filename + ',' + element.filename;
          }
        });
        var linkList = {
          filename: filename,
          urls: [
            {url: link, rank: 1}
          ]
        };
        var tip = "显示获取的链接，可以使用右键迅雷或IDM下载，复制无用，需要传递cookie";
        dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
      } else {
        alert('获取下载链接失败！');

      }
    }

    //获取下载链接
    function getDownloadLink() {
      if (bdstoken === null) {
        alert('提示 : 登录百度网盘后才能正常使用脚本哦!!!');
        return '';
      } else {
        var result;
        if (isSingleShare) {
          fid_list = getFidList();
          logid = getLogID();
          var url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
          var params = {
            encrypt: encrypt,
            product: product,
            uk: uk,
            primaryid: primaryid,
            fid_list: fid_list
          };
          if (shareType == 'secret') {
            params.extra = extra;
          }
          if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
            params.type = 'batch';
          }
          $.ajax({
            url: url,
            method: 'POST',
            async: false,
            data: params,
            success: function (response) {
              result = response;
            }
          });
        }
        return result;
      }
    }

    //有验证码输入时获取下载链接
    function getDownloadLinkWithVCode(vcodeInput) {
      var result;
      if (isSingleShare) {
        fid_list = getFidList();
        var url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
        var params = {
          encrypt: encrypt,
          product: product,
          vcode_input: vcodeInput,
          vcode_str: vcode.vcode,
          uk: uk,
          primaryid: primaryid,
          fid_list: fid_list
        };
        if (shareType == 'secret') {
          params.extra = extra;
        }
        if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
          params.type = 'batch';
        }
        $.ajax({
          url: url,
          method: 'POST',
          async: false,
          data: params,
          success: function (response) {
            result = response;
          }
        });
      }
      return result;
    }

    function execDownload(link) {
      slog('下载链接：' + link);
      $('#helperdownloadiframe').attr('src', link);
    }
  }

  function base64Encode(t) {
    var a, r, e, n, i, s, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (e = t.length, r = 0, a = ""; e > r;) {
      if (n = 255 & t.charCodeAt(r++), r == e) {
        a += o.charAt(n >> 2);
        a += o.charAt((3 & n) << 4);
        a += "==";
        break;
      }
      if (i = t.charCodeAt(r++), r == e) {
        a += o.charAt(n >> 2);
        a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
        a += o.charAt((15 & i) << 2);
        a += "=";
        break;
      }
      s = t.charCodeAt(r++);
      a += o.charAt(n >> 2);
      a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
      a += o.charAt((15 & i) << 2 | (192 & s) >> 6);
      a += o.charAt(63 & s);
    }
    return a;
  }

  function detectPage() {
    var regx = /[\/].+[\/]/g;
    var page = location.pathname.match(regx);
    return page[0].replace(/\//g, '');
  }

  function getCookie(e) {
    var o, t;
    var n = document, c = decodeURI;
    return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="), -1 != o) ? (o = o + e.length + 1, t = n.cookie.indexOf(";", o), -1 == t && (t = n.cookie.length), c(n.cookie.substring(o, t))) : "";
  }

  function getLogID() {
    var name = "BAIDUID";
    var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
    var d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var f = String.fromCharCode;

    function l(e) {
      if (e.length < 2) {
        var n = e.charCodeAt(0);
        return 128 > n ? e : 2048 > n ? f(192 | n >>> 6) + f(128 | 63 & n) : f(224 | n >>> 12 & 15) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
      }
      var n = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
      return f(240 | n >>> 18 & 7) + f(128 | n >>> 12 & 63) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
    }

    function g(e) {
      return (e + "" + Math.random()).replace(d, l);
    }

    function m(e) {
      var n = [0, 2, 1][e.length % 3];
      var t = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
      var o = [u.charAt(t >>> 18), u.charAt(t >>> 12 & 63), n >= 2 ? "=" : u.charAt(t >>> 6 & 63), n >= 1 ? "=" : u.charAt(63 & t)];
      return o.join("");
    }

    function h(e) {
      return e.replace(/[\s\S]{1,3}/g, m);
    }

    function p() {
      return h(g((new Date()).getTime()));
    }

    function w(e, n) {
      return n ? p(String(e)).replace(/[+\/]/g, function (e) {
        return "+" == e ? "-" : "_";
      }).replace(/=/g, "") : p(String(e));
    }

    return w(getCookie(name));
  }

  function Dialog() {
    var linkList = [];
    var showParams;
    var dialog, shadow;

    function createDialog() {
      var screenWidth = document.body.clientWidth;
      var dialogLeft = screenWidth > 800 ? (screenWidth - 800) / 2 : 0;
      var $dialog_div = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + dialogLeft + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>');
      var $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>');
      var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>');
      var $dialog_body = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>');
      var $dialog_tip = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');

      $dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body);

      //var $dialog_textarea = $('<textarea class="dialog-textarea" style="display:none;width"></textarea>');
      var $dialog_radio_div = $('<div class="dialog-radio" style="display:none;width:760px;padding-left:20px;padding-right:20px"></div>');
      var $dialog_radio_multi = $('<input type="radio" name="showmode" checked="checked" value="multi"><span>多行</span>');
      var $dialog_radio_single = $('<input type="radio" name="showmode" value="single"><span>单行</span>');
      $dialog_radio_div.append($dialog_radio_multi).append($dialog_radio_single);
      $dialog_div.append($dialog_radio_div);
      $('input[type=radio][name=showmode]', $dialog_radio_div).change(function () {
        var value = this.value;
        var $textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
        var content = $textarea.val();
        if (value == 'multi') {
          content = content.replace(/\s+/g, '\n');
          $textarea.css('height', '300px');
        } else if (value == 'single') {
          content = content.replace(/\n+/g, ' ');
          $textarea.css('height', '');
        }
        $textarea.val(content);
      });

      var $dialog_button = $('<div class="dialog-button" style="display:none"></div>');
      var $dialog_button_div = $('<div style="display:table;margin:auto"></div>');
      var $dialog_copy_button = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">直接复制无效</button>');
      var $dialog_edit_button = $('<button id="dialog-edit-button" style="display:none">编辑</button>');
      var $dialog_exit_button = $('<button id="dialog-exit-button" style="display:none">退出</button>');

      $dialog_button_div.append($dialog_copy_button).append($dialog_edit_button).append($dialog_exit_button);
      $dialog_button.append($dialog_button_div);
      $dialog_div.append($dialog_button);

      $dialog_copy_button.click(function () {
        var content = '';
        if (showParams.type == 'batch') {
          $.each(linkList, function (index, element) {
            if (element.downloadlink == 'error')
              return;
            if (index == linkList.length - 1)
              content = content + element.downloadlink;
            else
              content = content + element.downloadlink + '\n';
          });
        } else if (showParams.type == 'link') {
          $.each(linkList, function (index, element) {
            if (element.url == 'error')
              return;
            if (index == linkList.length - 1)
              content = content + element.url;
            else
              content = content + element.url + '\n';
          });
        }
      });

      $dialog_edit_button.click(function () {
        var $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
        var $dialog_item = $('div.dialog-body div', dialog);
        $dialog_item.hide();
        $dialog_copy_button.hide();
        $dialog_edit_button.hide();
        $dialog_textarea.show();
        $dialog_radio_div.show();
        $dialog_exit_button.show();
      });

      $dialog_exit_button.click(function () {
        var $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
        var $dialog_item = $('div.dialog-body div', dialog);
        $dialog_textarea.hide();
        $dialog_radio_div.hide();
        $dialog_item.show();
        $dialog_exit_button.hide();
        $dialog_copy_button.show();
        $dialog_edit_button.show();
      });

      $dialog_div.append($dialog_tip);
      $('body').append($dialog_div);
      $dialog_div.dialogDrag();
      $dialog_control.click(dialogControl);
      return $dialog_div;
    }

    function createShadow() {
      var $shadow = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
      $('body').append($shadow);
      return $shadow;
    }

    this.open = function (params) {
      $('body').on('click', '.GMlink', function () {
        var link = $(this)[0].innerText;

        GM_download({
          url: link,
          name: '非IDM下载请自己改后缀名.zip',
          headers: {
            "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
          }
        })
      });

      showParams = params;
      linkList = [];
      if (params.type == 'link' || params.type == 'GMlink') {
        linkList = params.list.urls;
        $('div.dialog-header h3 span.dialog-title', dialog).text(params.title + "：" + params.list.filename);
        $.each(params.list.urls, function (index, element) {
          if (params.type == 'GMlink') {
            var $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a class="GMlink" href="javascript:;">' + element.url + '</a></div></div>');
          } else{
            var $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + element.url + '">' + element.url + '</a></div></div>');
          }

          $('div.dialog-body', dialog).append($div);
        });
      } else if (params.type == 'batch' || params.type=='GMbatch') {
        linkList = params.list;
        $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
        if (params.showall) {
          $.each(params.list, function (index, element) {
            var $item_div = $('<div class="item-container" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>');
            var $item_name = $('<div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div>');
            var $item_sep = $('<div style="width:12px;float:left"><span>：</span></div>');
            var $item_link_div = $('<div class="item-link" style="float:left;width:618px;"></div>');
            var $item_first = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
            $item_link_div.append($item_first);
            $.each(params.alllist[index].links, function (n, item) {
              if (element.downloadlink == item.url)
                return;
              if (params.type == 'GMbatch') {
                var $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a class="GMlink" href="javascript:;">' + item.url + '</a></div>');
              } else{
                var $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="' + item.url + '">' + item.url + '</a></div>');
              }

              $item_link_div.append($item);
            });
            var $item_ex = $('<div style="width:15px;float:left;cursor:pointer;text-align:center;font-size:16px"><span>+</span></div>');
            $item_div.append($item_name).append($item_sep).append($item_link_div).append($item_ex);
            $item_ex.click(function () {
              var $parent = $(this).parent();
              $parent.toggleClass('showall');
              if ($parent.hasClass('showall')) {
                $(this).text('-');
                $('div.item-link div.item-ex', $parent).show();
              } else {
                $(this).text('+');
                $('div.item-link div.item-ex', $parent).hide();
              }
            });
            $('div.dialog-body', dialog).append($item_div);
          });
        } else {
          $.each(params.list, function (index, element) {
            var $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div><span>：</span><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
            $('div.dialog-body', dialog).append($div);
          });
        }
      }

      if (params.tip) {
        $('div.dialog-tip p', dialog).text(params.tip);
      }

      if (params.showcopy) {
        $('div.dialog-button', dialog).show();
        $('div.dialog-button button#dialog-copy-button', dialog).show();
      }
      if (params.showedit) {
        $('div.dialog-button', dialog).show();
        $('div.dialog-button button#dialog-edit-button', dialog).show();
        var $dialog_textarea = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>');
        var content = '';
        if (showParams.type == 'batch') {
          $.each(linkList, function (index, element) {
            if (element.downloadlink == 'error')
              return;
            if (index == linkList.length - 1)
              content = content + element.downloadlink;
            else
              content = content + element.downloadlink + '\n';
          });
        } else if (showParams.type == 'link') {
          $.each(linkList, function (index, element) {
            if (element.url == 'error')
              return;
            if (index == linkList.length - 1)
              content = content + element.url;
            else
              content = content + element.url + '\n';
          });
        }
        $dialog_textarea.val(content);
        $('div.dialog-body', dialog).append($dialog_textarea);
      }

      shadow.show();
      dialog.show();
    };

    this.close = function () {
      dialogControl();
    };

    function dialogControl() {
      $('div.dialog-body', dialog).children().remove();
      $('div.dialog-header h3 span.dialog-title', dialog).text('');
      $('div.dialog-tip p', dialog).text('');
      $('div.dialog-button', dialog).hide();
      $('div.dialog-radio input[type=radio][name=showmode][value=multi]', dialog).prop('checked', true);
      $('div.dialog-radio', dialog).hide();
      $('div.dialog-button button#dialog-copy-button', dialog).hide();
      $('div.dialog-button button#dialog-edit-button', dialog).hide();
      $('div.dialog-button button#dialog-exit-button', dialog).hide();
      dialog.hide();
      shadow.hide();
    }

    dialog = createDialog();
    shadow = createShadow();
  }

  function VCodeDialog(refreshVCode, confirmClick) {
    var dialog, shadow;

    function createDialog() {
      var screenWidth = document.body.clientWidth;
      var dialogLeft = screenWidth > 520 ? (screenWidth - 520) / 2 : 0;
      var $dialog_div = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + dialogLeft + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>');
      var $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>');
      var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>');
      var $dialog_body = $('<div class="dialog-body"></div>');
      var $dialog_body_div = $('<div style="text-align:center;padding:22px"></div>');
      var $dialog_body_download_verify = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>');
      var $dialog_verify_body = $('<div class="verify-body">请输入验证码：</div>');
      var $dialog_input = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">');
      var $dialog_img = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">');
      var $dialog_refresh = $('<a href="javascript:void(0)" style="text-decoration:underline;" class="underline">换一张</a>');
      var $dialog_err = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>');
      var $dialog_footer = $('<div class="dialog-footer g-clearfix"></div>');
      var $dialog_confirm_button = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:void(0)" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>');
      var $dialog_cancel_button = $('<a class="g-button" data-button-id="" data-button-index href="javascript:void(0);" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');

      $dialog_header.append($dialog_control);
      $dialog_verify_body.append($dialog_input).append($dialog_img).append($dialog_refresh);
      $dialog_body_download_verify.append($dialog_verify_body).append($dialog_err);
      $dialog_body_div.append($dialog_body_download_verify);
      $dialog_body.append($dialog_body_div);
      $dialog_footer.append($dialog_confirm_button).append($dialog_cancel_button);
      $dialog_div.append($dialog_header).append($dialog_body).append($dialog_footer);
      $('body').append($dialog_div);

      $dialog_div.dialogDrag();

      $dialog_control.click(dialogControl);
      $dialog_img.click(refreshVCode);
      $dialog_refresh.click(refreshVCode);
      $dialog_input.keypress(function (event) {
        if (event.which == 13)
          confirmClick();
      });
      $dialog_confirm_button.click(confirmClick);
      $dialog_cancel_button.click(dialogControl);
      $dialog_input.click(function () {
        $('#dialog-err').text('');
      });
      return $dialog_div;
    }

    this.open = function (vcode) {
      if (vcode)
        $('#dialog-img').attr('src', vcode.img);
      dialog.show();
      shadow.show();
    };
    this.close = function () {
      dialogControl();
    };
    dialog = createDialog();
    shadow = $('div.dialog-shadow');

    function dialogControl() {
      $('#dialog-img', dialog).attr('src', '');
      $('#dialog-err').text('');
      dialog.hide();
      shadow.hide();
    }
  }

  $.fn.dialogDrag = function () {
    var mouseInitX, mouseInitY, dialogInitX, dialogInitY;
    var screenWidth = document.body.clientWidth;
    var $parent = this;
    $('div.dialog-header', this).mousedown(function (event) {
      mouseInitX = parseInt(event.pageX);
      mouseInitY = parseInt(event.pageY);
      dialogInitX = parseInt($parent.css('left').replace('px', ''));
      dialogInitY = parseInt($parent.css('top').replace('px', ''));
      $(this).mousemove(function (event) {
        var tempX = dialogInitX + parseInt(event.pageX) - mouseInitX;
        var tempY = dialogInitY + parseInt(event.pageY) - mouseInitY;
        var width = parseInt($parent.css('width').replace('px', ''));
        tempX = tempX < 0 ? 0 : tempX > screenWidth - width ? screenWidth - width : tempX;
        tempY = tempY < 0 ? 0 : tempY;
        $parent.css('left', tempX + 'px').css('top', tempY + 'px');
      });
    });
    $('div.dialog-header', this).mouseup(function (event) {
      $(this).unbind('mousemove');
    });
  }

})();