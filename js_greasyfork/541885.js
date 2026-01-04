// ==UserScript==
// @name         主流视频网VIP视频解析助手
// @namespace    Higex_HHHHHHHHH_X
// @version      1.1.1
// @description  助手，支持主流视频网站VIP视频一键解析、接口健康检测、自动解析、记忆接口等功能。
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAY1JREFUWEfdV0tywyAMRV64PYXbZXKKOidLcrI4p0iWbU7RZoE6MOABIpBVyrhTVvZYlp6evoBa+cDK9hUL4PL6PCqtRwMUAN44wIh4DmW2t/uh9A8JwBgFxL1CtIZrDyp1VF03bd8/p1TXA4DL0B9AqX2tUep/AyRlJAJgPdf61MK414ldtwuZiAE09H52CmDafHzt/HsE4Dr02NJ7r3tzu89254di7AEmBDga6qycqYaKBA3DwAKgEsd4UsNWqJMHkCSNJEQ5VkUAwnhJjHtZkqkgEWcGri9PJyquadl4xbZDMifbzCQAVFI2xmZ1vxABcF7adurnQUUFWHU/AcDRLfr+fwGYhuXGcXGgtWCAqpZcZclywLVhLsbUrM9Wi4SBFo1I1Alzs4BjpNQJRQAWGSKalW1Ymf2CBlC7DbkKMCuXX2RzlUACqB2xi5hyQuRCYgFkBpJEOSeb5tTfWkpLicN5tuQ7u5ZHs17r8dfuB8FOmQLlr2ZDH12tRNezzG0oBMECWEJtjczqAL4BysQhMPukapkAAAAASUVORK5CYII=
// @author       Higex,Unknown
// @include      *://*.zhihu.com/*
// @include      *://bbs.csdn.net/*
// @include      *://www.csdn.net/*
// @include      *://blog.csdn.net/*/article/details/*
// @include      *://*.blog.csdn.net/article/details/*
// @include      *://*.youku.com/v_*
// @include      *://www.iqiyi.com/*
// @include      *://www.iqiyi.com
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
// @include      *://tv.sohu.com/v/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.baofeng.com/play/*
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/2.0.3/jquery.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      AGPL License
// @charset		 UTF-8
// @connect      im1907.top
// @connect      jx.jsonplayer.com
// @connect      jx.yangtu.top
// @connect      vip.bljiex.com
// @connect      bd.jx.cn
// @connect      www.ckplayer.vip
// @connect      dmjx.m3u8.tv
// @connect      yparse.ik9.cc
// @connect      jiexi.site
// @connect      jx.playerjy.com
// @connect      api.jiexi.la
// @connect      jx.m3u8.tv
// @connect      www.playm3u8.cn
// @connect      www.pangujiexi.cc
// @connect      www.pangujiexi.com
// @connect      www.pouyun.com
// @connect      jx.nnxv.cn
// @connect      json.ovvo.pro
// @connect      jx.dj6u.com
// @connect      jx.ivito.cn
// @connect      jx.xmflv.com
// @connect      jx.xmflv.cc
// @connect      www.yemu.xyz
// @connect      jx.yparse.com
// @connect      www.1717yun.com
// @connect      jx.000180.top
// @connect      gj.fenxiangb.com
// @connect      www.8090g.cn
// @connect      tv.wandhi.com
// @connect      www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/541885/%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541885/%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 自动将页面所有 http 资源升级为 https，减少 mixed content 警告
     */
    function upgradeAllHttpResources() {
        window.$('img,script,iframe').each(function() {
            var src = window.$(this).attr('src');
            if (src && src.indexOf('http://') === 0) {
                window.$(this).attr('src', src.replace('http://', 'https://'));
            }
        });
        window.$('link').each(function() {
            var href = window.$(this).attr('href');
            if (href && href.indexOf('http://') === 0) {
                window.$(this).attr('href', href.replace('http://', 'https://'));
            }
        });
        window.$('[style]').each(function() {
            var style = window.$(this).attr('style');
            if (style && style.indexOf('http://') !== -1) {
                window.$(this).attr('style', style.replace(/http:\/\//g, 'https://'));
            }
        });
    }
    window.$(upgradeAllHttpResources);

    // ===================== 配置区 =====================
    // 是否开启各功能模块
    // 开启为：true 才生效，关闭为：false
    const isOpenVideoVipModule = true;   // 视频解析模块
    let isAutoParseMode = true;          // 自动解析模式
    const isRememberLastInterface = true;// 记忆上次接口
    const isCheckInterfaceHealth = true; // 检查接口健康
    // =================================================

    // 兼容性优化：始终用 window.$
    var $ = window.$;
    const window_url = window.location.href;
    const window_host = window.location.host;

    // 用户自定义视频解析接口（如需扩展，注意安全校验）
    var customizeMovieInterface = [
        // {"name":"此处填接口名称","url":"此处填接口url"}
    ];

    /**
     * VIP视频解析主对象
     */
    const movievipHelper = {};
    movievipHelper.customizeSourceArray = customizeMovieInterface;
    movievipHelper.interfaceHealthStatus = {}; // 接口健康状态缓存
    movievipHelper.lastSelectedInterface = null; // 上次选择的接口
    // 默认接口列表
    movievipHelper.defaultSourceArray = [
        {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url=","mobile":0},
		{"name":"冰豆","url":"https://bd.jx.cn/?url=","mobile":0},
		{"name":"纯净1","url":"https://im1907.top/?jx=","mobile":1},
		{"name":"YT","url":"https://jx.yangtu.top/?url=","mobile":0},
		{"name":"IK9","url":"https://yparse.ik9.cc/index.php?url=","mobile":0},
		{"name":"JX","url":"https://jiexi.site/?url=","mobile":0},
		{"name":"JY","url":"https://jx.playerjy.com/?url=","mobile":0},
		{"name":"PM","url":"https://www.playm3u8.cn/jiexi.php?url=","mobile":0},
		{"name":"盘古2","url":"https://www.pangujiexi.com/jiexi/?url=","mobile":0},
		{"name":"剖云","url":"https://www.pouyun.com/?url=","mobile":0},
		{"name":"神哥","url":"https://json.ovvo.pro/jx.php?url=","mobile":0},
		{"name":"虾米","url":"https://jx.xmflv.com/?url=","mobile":0},
		{"name":"虾米2","url":"https://jx.xmflv.cc/?url=","mobile":0},
		{"name":"夜幕","url":"https://www.yemu.xyz/?url=","mobile":0},
		{"name":"云析","url":"https://jx.yparse.com/index.php?url=","mobile":0},
		{"name":"8090","url":"https://www.8090g.cn/?url=","mobile":0},
		{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=","mobile":0},
		{"name":"180","url":"https://jx.000180.top/jx/?url=","mobile":0},
		{"name":"维多","url":"https://jx.ivito.cn/?url=","mobile":0},
		{"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url=","mobile":0},
		// {"name":"听乐","url":"https://jx.dj6u.com/?url=","mobile":1},
		// {"name":"七哥","url":"https://jx.nnxv.cn/tv.php?url=","mobile":0},
		// {"name":"解析la","url":"https://api.jiexi.la/?url=","mobile":0},
		// {"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url=","mobile":0},
		// {"name":"弹幕","url":"https://dmjx.m3u8.tv/?url=","mobile":0},
		// {"name":"B站1","url":"https://jx.jsonplayer.com/player/?url=","mobile":1},
		// {"name":"BL","url":"https://vip.bljiex.com/?v=","mobile":0},
		// {"name":"2ys","url":"https://gj.fenxiangb.com/player/analysis.php?v=","mobile":0},
    ];
    // 各站点播放器节点映射
    movievipHelper.playerNodes = [
        { url:"v.qq.com", node:"#player"},
	    { url:"www.iqiyi.com", node:"#video"},
	    { url:"v.youku.com", node:"#ykPlayer"},
	    { url:"w.mgtv.com", node:".mango-layer mango-control-bar"},
	    { url:"www.mgtv.com/b", node:"#mgtv-player-wrap"},
	    { url:"tv.sohu.com", node:"#player"},
	    { url:"film.sohu.com", node:"#playerWrap"},
	    { url:"www.le.com", node:"#le_playbox"},
	    { url:"video.tudou.com", node:".td-playbox"},
	    { url:"v.pptv.com", node:"#pptv_playpage_box"},
	    { url:"vip.pptv.com", node:".w-video"},
	    { url:"www.wasu.cn", node:"#flashContent"},
	    { url:"www.acfun.cn", node:"#ACPlayer"},
	    { url:"vip.1905.com", node:"#player"},
	    {url:"play.tudou.com",node:"#player"},
	    {url:"www.bilibili.com/video",node:"#bilibiliPlayer"},
	    {url:"www.bilibili.com/bangumi",node:"#bilibili-player"},
    ];

    /**
     * 检查接口健康状态，带本地缓存，超时/异常视为不健康
     * @param {string} interfaceUrl
     * @param {function} callback 回调参数为 true/false
     */
    movievipHelper.checkInterfaceHealth = function(interfaceUrl, callback) {
        if (!isCheckInterfaceHealth) {
            console.log("接口健康检查已禁用，默认接口健康:", interfaceUrl);
            callback(true); // 如果不检查健康状态，直接返回健康
            return;
        }

        // 本地缓存key
        var cacheKey = "interfaceHealthStatus_" + encodeURIComponent(interfaceUrl);
        var cacheData = GM_getValue(cacheKey, null);
        var now = Date.now();
        var cacheExpire = 7 * 24 * 60 * 60 * 1000; // 7天有效
        if (cacheData) {
            try {
                var parsed = JSON.parse(cacheData);
                if (parsed && parsed.time && (now - parsed.time < cacheExpire)) {
                    movievipHelper.interfaceHealthStatus[interfaceUrl] = parsed.status;
                    console.log("使用本地缓存的接口健康状态:", interfaceUrl, parsed.status ? "健康" : "不健康");
                    callback(parsed.status);
                    return;
                }
            } catch(e) { /* ignore */ }
        }

        // 如果已经有缓存的健康状态，直接使用
        if (movievipHelper.interfaceHealthStatus[interfaceUrl] !== undefined) {
            var status = movievipHelper.interfaceHealthStatus[interfaceUrl];
            console.log("使用内存缓存的接口健康状态:", interfaceUrl, status ? "健康" : "不健康");
            callback(status);
            return;
        }

        console.log("开始检查接口健康状态:", interfaceUrl);
        // 使用GM_xmlhttpRequest检查接口是否可用
        GM_xmlhttpRequest({
            method: "HEAD",
            url: interfaceUrl + "https://www.baidu.com",
            timeout: 3000,
            onload: function(response) {
                const isHealthy = response.status >= 200 && response.status < 400;
                movievipHelper.interfaceHealthStatus[interfaceUrl] = isHealthy;
                // 写入本地缓存
                GM_setValue(cacheKey, JSON.stringify({status: isHealthy, time: Date.now()}));
                console.log("接口健康检查结果:", interfaceUrl, isHealthy ? "健康" : "不健康", "状态码:", response.status);
                callback(isHealthy);
            },
            onerror: function(error) {
                movievipHelper.interfaceHealthStatus[interfaceUrl] = false;
                GM_setValue(cacheKey, JSON.stringify({status: false, time: Date.now()}));
                console.log("接口健康检查失败:", interfaceUrl, "错误:", error);
                callback(false);
            },
            ontimeout: function() {
                movievipHelper.interfaceHealthStatus[interfaceUrl] = false;
                GM_setValue(cacheKey, JSON.stringify({status: false, time: Date.now()}));
                console.log("接口健康检查超时:", interfaceUrl);
                callback(false);
            }
        });
    };

    /**
     * 获取上次选择的接口
     * @returns {string|null}
     */
    movievipHelper.getLastSelectedInterface = function() {
        if (!isRememberLastInterface) return null;

        // 从本地存储获取上次选择的接口
        const lastInterface = GM_getValue("lastSelectedInterface", null);
        if (lastInterface) {
            movievipHelper.lastSelectedInterface = lastInterface;
            return lastInterface;
        }
        return null;
    };

    /**
     * 保存用户选择的接口
     * @param {string} interfaceUrl
     */
    movievipHelper.saveSelectedInterface = function(interfaceUrl) {
        if (!isRememberLastInterface) return;

        movievipHelper.lastSelectedInterface = interfaceUrl;
        GM_setValue("lastSelectedInterface", interfaceUrl);
    };

    /**
     * 获取接口数据并初始化界面
     */
    movievipHelper.getServerSource = function() {
        //合并自定义接口和默认接口
		try{
			movievipHelper.defaultSourceArray = movievipHelper.customizeSourceArray.concat(movievipHelper.defaultSourceArray);
		}catch(e){
			console.log("合并出现异常，请检查自定义接口");
		}
		
		// 获取上次选择的接口
		if (isRememberLastInterface) {
			movievipHelper.getLastSelectedInterface();
		}
		
		//执行操作
		movievipHelper.addStyle();
		movievipHelper.generateHtml();
		movievipHelper.operation();
		
		// 如果开启了自动解析模式，自动选择接口进行解析
		if (isAutoParseMode) {
			// 增加延迟时间，确保接口健康检查完成
			setTimeout(function() {
				movievipHelper.autoSelectInterface();
			}, 3000);
		}
		
		// 创建视频播放器容器
		var html="";
		html+="<div id='play-iframe-outer-7788op' style='width:100%;height:100%;z-index:999999999;position:fixed;top:0px;left:0px;'>";
		html+="<div style='width:100%;height:60px;position:absolute;text-align:center;line-height:60px;background-color:#000000;'>";
		html+="<div style='width:30%;height:60px;text-align:center;line-height:60px;float:left;font-size:16px;font-weight:bold;'>视频解析中心</div>";
		html+="<div style='width:58%;height:60px;text-align:center;line-height:60px;float:left;'>";
		html+="<div style='width:100%;height:60px;color:#ffffff;'>若视频播放异常，请尝试更换接口</div>";
		html+="</div>";
		html+="<div style='width:10%;height:60px;text-align:center;line-height:60px;float:left;font-size:16px;'>";
		html+="<button id='player-close-7788op' style='width:100%;height:36px;font-size:14px;padding:5px;color:#000000;border-radius:3px;'>关闭</button>";
		html+="</div>";
		html+="</div>";
		html+="<iframe id='play-iframe-6677i-7788' src='' scrolling='no' width='100%' height='100%' style='position:absolute;top:60px;left:0px;z-index:999999;border:none;overflow:hidden;' allowfullscreen='true'></iframe>";
		html+="</div>";
		$("body").append(html);
		$("#player-close-7788op").on("click", function(){
			$("#play-iframe-outer-7788op").remove();
		});
		$("#play-iframe-outer-7788op").hide(); // 默认隐藏播放器，等待用户选择接口或自动解析
    };
    movievipHelper.eleId = Math.ceil(Math.random()*100000000);
    /**
     * 判断当前页面是否为VIP视频页面
     * @returns {boolean}
     */
    movievipHelper.isRun = function(){
		var isVip = false;
		var host = window.location.host;
		var href = window.location.href;
		var vipWebsites = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com","acfun.cn","bilibili.com","baofeng.com","pptv.com"];
   		for(var b=0; b<vipWebsites.length; b++){
	   		if(host.indexOf(vipWebsites[b]) != -1){
				if("iqiyi.com"===vipWebsites[b]){
					//爱奇艺需要特殊处理
					if(href.indexOf("iqiyi.com/a_")!=-1 || href.indexOf("iqiyi.com/w_")!=-1 || href.indexOf("iqiyi.com/v_")!=-1){
						isVip = true;
						break;
					}
				}else{
					isVip = true;
					break;
				}
	   		}
	   	}
   		return isVip;
	};
    // ===================== 样式相关 =====================
    /**
     * 主控浮窗样式（青蓝色主题）
     */
    movievipHelper.getMainBoxStyle = function(themeColor) {
        themeColor = themeColor || '#1ec7e6';
        return (
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " {position:fixed;top:200px; left:0px; padding:5px 0px; width:310px;box-sizing:border-box;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item{cursor:pointer; width:50px; height:60px; text-align:center; box-sizing:border-box; display:flex; align-items:center; justify-content:center; flex-direction:column; margin-left:0; margin-right:0; margin-bottom:10px; border-radius:10px; background:#fff;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item.clear-cache-btn, #plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item.auto-parse-mode, #plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item.open_page_inner_source{width:50px; height:60px; min-width:50px; min-height:60px; max-width:50px; max-height:60px; flex-direction:column; padding:0;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .jump_analysis_website{padding:10px 0px;background-color:" + themeColor + "; width:100%; box-sizing:border-box;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .open_page_inner_source{margin-top:6px; background-color:" + themeColor + "; width:50px; height:60px; box-sizing:border-box;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > img{width:26px; height:26px; max-width:26px; max-height:26px; margin:0 auto 4px auto; display:block; object-fit:contain;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item.open_page_inner_source{display:flex; align-items:center; justify-content:center; flex-direction:column;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item.open_page_inner_source > img{margin:0 auto 4px auto;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item span{display:block; font-size:13px; line-height:1.2; word-break:break-all; margin-top:2px;}"
        );
    };
    /**
     * 接口表格样式（健康绿色，不健康灰色）
     */
    movievipHelper.getSourceTableStyle = function(themeColor) {
        return (
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box{display:none;width:310px;height:400px;position:absolute;left:25px;overflow:hidden;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box{width:330px;height:100%;padding-left:10px;overflow-y:scroll;overflow-x:hidden;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table{width:300px;border-spacing:5px;border-collapse:separate;line-height:20px;}" +
            // 健康接口绿色
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table td{border-bottom:3px solid #4CAF50;border-top:3px solid #4CAF50;width:33%;color:#FFF;font-size:11px;text-align:center;cursor:pointer;background-color:#4CAF50;box-shadow:0px 0px 5px #fff;border-radius:3px;transition:background 0.2s,border 0.2s;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table td:hover{border-bottom:3px solid #FEF2A6;border-top:3px solid #FEF2A6;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table .td_hover{border-bottom:3px solid #FEF2A6;border-top:3px solid #FEF2A6;}"
        );
    };
    /**
     * 不健康接口样式
     */
    movievipHelper.getUnhealthyStyle = function() {
        return (
            // 不健康接口灰色
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table .interface-unhealthy{opacity:1;background-color:#bbb !important;border-top:3px solid #bbb !important;border-bottom:3px solid #bbb !important;color:#fff !important;cursor:not-allowed;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .plugin_item > .play_source_box > .inner_table_box > table .interface-checking{background-color:#666;}"
        );
    };
    /**
     * 自动解析按钮样式
     */
    movievipHelper.getAutoParseButtonStyle = function() {
        return (
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .auto-parse-mode{margin-top:6px; padding:5px 0px;background-color:#4CAF50; z-index:999999999;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .auto-parse-mode.active{background-color:#4CAF50;}" +
            "#plugin_analysis_vip_movie_box_" + movievipHelper.eleId +
            " > .auto-parse-mode:not(.active){background-color:#999;}"
        );
    };
    /**
     * 统一注入所有样式
     */
    movievipHelper.addStyle = function() {
        var themeColor = '#1ec7e6';
        var css =
            movievipHelper.getMainBoxStyle(themeColor) +
            movievipHelper.getSourceTableStyle(themeColor) +
            movievipHelper.getUnhealthyStyle() +
            movievipHelper.getAutoParseButtonStyle();
        GM_addStyle(css);
    };

    // ===================== 结构生成 =====================
    /**
     * 生成接口表格HTML
     */
    movievipHelper.generateSourceTableHtml = function() {
        var html = "<table><tr>";
	    for (var playLineIndex = 0; playLineIndex < this.defaultSourceArray.length; playLineIndex++) {
	        if (playLineIndex % 3 == 0) {
	            html += "<tr>";
	            html += "<td data-url='" + this.defaultSourceArray[playLineIndex].url + "'>" + this.defaultSourceArray[playLineIndex]['name'] + "</td>";
	            continue;
	        }
	        html += "<td data-url='" + this.defaultSourceArray[playLineIndex].url + "'>" + this.defaultSourceArray[playLineIndex]['name'] + "</td>";
	        if ((playLineIndex + 1) % 3 == 0) {
	            html += "</tr>";
	        }
	    }
	    html += "</tr></table>";
	    return html;
    };
    /**
     * 生成主控浮窗HTML
     */
    movievipHelper.generateMainBoxHtml = function() {
        var vipImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABACAYAAABFqxrgAAADBklEQVR4Xu2cz6tNURTHP7tI5iRlID9CJFMlkYGSRPGklBRKiCSSxJMBkYGSgWQq/gBT/gMDUzMzf8RX6959nuO9e+75sff54d69B+/W23evvdbnrLX32j/OdfgiaStwGzgBvHfOPc7qln9KsrpHRfU9/n+xgt6ngW/AK+fcT9PV2R9JZ4A3wHpvQBVh/yuETO/fwDXn3GfnAXxa9vTmAUJm8oJBMADmCfkyTxC+GAT1GMOD6DpBsIExeUKCMArH5AkJwnhcTp4wBcI85QmFnpAgAAlCgjAeMJMnJAjJE5YWdSkcIq5vvwP7IsprRVSrGaNzzuSfAz4Aa1qxIILQ1iHkNnKfAA8j6BxdRGcQ/IbuOuAtYDu+gymdQsh5xX7gHbB7CCR6gZCDccGPF6Ot/75KrxB8iKwCngL35hZCzit2Ac/8CVinPIo8YRH4OkWTQ1WO4WyKrGuNJDsGfAlsr9vW0v0mehdCqHCmV3oM1wRCzjPuAC9qgmiU6Q4Wgh8vNgJ2+HulIozZg5DzioMexuESGLMLIQfjkh+LNhXAmH0IPkTueq9YOwHEbEOQdMobv3dKSMwmBEl7fAhUWW/EhTCBdnaEn839bU+RtvS2PmyqXF11dmiid+9p8yTjJF0ELPZ3VjQ+6GuDgiDpAHAfOBZkVc3Gg4AgaQPwALieXSaraUfQ13uHIOmmN35bkCUBjXuDIOm4N/5ogP5RmnYOQdIOwJ7+1SgWRBDSGQRJNrXajVmL+80RdI8mYtp+QlknlfMESSe98UfKhAbW235CWVmhd6tLacBS3BvA5TLNItXHzRhjbKoAv4CiFV8ku/8RM0gIbRg6TWaC0PRKQdtjQvKErgkkTxgTjzsmNNm/7+HJL+8y6rnDAOzpToVW0+buzAjrKUFIF7zHHpQ8IUFInrA0mqZw8OHwY8IFqkaZV9hEFaV1E71HL4c+9wcdeS2aCItiRaCQJnovZC+MfwTO5hRoIixQ/yjN6+j994XxrGtJt4DzwBbgdaSdpSiW1RBSBcKKnw74AzEYpoku7zbwAAAAAElFTkSuQmCC";
	    var html = "<div id='plugin_analysis_vip_movie_box_" + movievipHelper.eleId + "' style='z-index:999999999999999999999;'>";
	    html += "<div class='plugin_item clear-cache-btn' style='background:#f90;color:#fff;padding:4px 0;cursor:pointer;font-size:12px;border-radius:4px;margin-bottom:4px;'>清理接口健康缓存</div>";
	    html += "<div class='plugin_item auto-parse-mode" + (isAutoParseMode ? " active" : "") + "' style='background:" + (isAutoParseMode ? "#4CAF50" : "#999") + ";color:#fff;padding:4px 0;cursor:pointer;font-size:12px;border-radius:4px;margin-bottom:4px;display:block;'>"
	    + (isAutoParseMode ? "自动解析模式已开启" : "开启自动解析模式") + "</div>";
	    html += "<div class='plugin_item open_page_inner_source'><img src='" + vipImgBase64 + "'>";
	    html += "<div class='play_source_box'><div class='inner_table_box'>";
	    html += movievipHelper.generateSourceTableHtml();
	    html += "</div></div></div></div>";
	    return html;
    };
    /**
     * 生成播放器HTML
     */
    movievipHelper.generatePlayerHtml = function() {
        var html = "";
        html += "<div id='play-iframe-outer-7788op' style='width:100%;height:100%;z-index:999999999;position:fixed;top:0px;left:0px;'>";
        html += "<div style='width:100%;height:60px;position:absolute;text-align:center;line-height:60px;background-color:#000000;'>";
        html += "<div style='width:30%;height:60px;text-align:center;line-height:60px;float:left;font-size:16px;font-weight:bold;'>视频解析中心</div>";
        html += "<div style='width:58%;height:60px;text-align:center;line-height:60px;float:left;'>";
        html += "<div style='width:100%;height:60px;color:#ffffff;'>若视频播放异常，请尝试更换接口</div>";
        html += "</div>";
        html += "<div style='width:10%;height:60px;text-align:center;line-height:60px;float:left;font-size:16px;'>";
        html += "<button id='player-close-7788op' style='width:100%;height:36px;font-size:14px;padding:5px;color:#000000;border-radius:3px;'>关闭</button>";
        html += "</div></div>";
        html += "<iframe id='play-iframe-6677i-7788' src='' scrolling='no' width='100%' height='100%' style='position:absolute;top:60px;left:0px;z-index:999999;border:none;overflow:hidden;' allowfullscreen='true'></iframe>";
        html += "</div>";
        return html;
    };
    /**
     * 组装并插入主控浮窗HTML
     */
    movievipHelper.generateHtml = function() {
        var html = movievipHelper.generateMainBoxHtml();
	    $("body").append(html);
	    var $vipMovieBox = $("#plugin_analysis_vip_movie_box_" + movievipHelper.eleId + "");
	    var $playSourceBox = $("#plugin_analysis_vip_movie_box_" + movievipHelper.eleId + " > .plugin_item > .play_source_box");
	    var btnHeight = $vipMovieBox.height();
	    var playSourceBoxHeight = $playSourceBox.height();
	    var playSourceBoxTop = (playSourceBoxHeight - btnHeight) * 0.3;
	    $playSourceBox.css("top", "-" + playSourceBoxTop + "px");

	    // 如果开启了接口健康检查，检查所有接口的健康状态
	    if (isCheckInterfaceHealth) {
	        var $interfaces = $("#plugin_analysis_vip_movie_box_" + movievipHelper.eleId + " td");
	        $interfaces.each(function () {
	            var $interface = $(this);
	            var interfaceUrl = $interface.attr("data-url");
	            $interface.addClass("interface-checking");
	            movievipHelper.checkInterfaceHealth(interfaceUrl, function (isHealthy) {
	                $interface.removeClass("interface-checking");
	                if (!isHealthy) {
	                    $interface.addClass("interface-unhealthy");
	                }
	            });
	        });
	    }

	    // 如果有上次选择的接口，标记出来
	    if (movievipHelper.lastSelectedInterface) {
	        var $lastInterface = $("#plugin_analysis_vip_movie_box_" + movievipHelper.eleId + " td[data-url='" + movievipHelper.lastSelectedInterface + "']");
	        if ($lastInterface.length > 0) {
	            $lastInterface.addClass("td_hover");
	        }
	    }
    };
    // ===================== 业务逻辑 =====================
    /**
     * 综合解析：优先选择实际存在的播放器节点，优先内嵌播放，自动尝试播放。
     * 若自动播放失败，提示用户手动点击播放。
     * @param {string} videoUrl
     * @param {string} interfaceUrl
     */
    movievipHelper.comprehensiveAnalysis = function(videoUrl, interfaceUrl) {
        console.log("开始解析视频:", videoUrl, "使用接口:", interfaceUrl);
		var player_nodes = movievipHelper.playerNodes;
		var node = "";
		// 优先选择页面实际存在的播放器节点
		for(var m in player_nodes) {
			if(videoUrl.indexOf(player_nodes[m].url)!= -1 && $(player_nodes[m].node).length > 0){
				node = player_nodes[m].node;
				break;
			}
		}
		// 如果没有实际节点，回退到URL匹配
		if (!node) {
			for(var m2 in player_nodes) {
				if(videoUrl.indexOf(player_nodes[m2].url)!= -1){
					node = player_nodes[m2].node;
					break;
				}
			}
		}
		// 移除之前的播放器
		$("#play-iframe-outer-7788op").remove();

		// 新增：强制将 videoUrl 升级为 https，防止混合内容
		if (videoUrl.indexOf('http://') === 0) {
			videoUrl = videoUrl.replace('http://', 'https://');
		}

		// 如果找到了实际存在的播放器节点，使用内嵌方式播放
		if (node && $(node).length > 0) {
			console.log("找到实际存在的播放器节点:", node, "使用内嵌方式播放");
			var playHtml = "<div id='play-iframe-outer-7788op' style='width:100%;height:100%;position:relative;'>";
			playHtml += "<div class='close-player-btn' style='position:absolute;top:10px;right:10px;z-index:9999;background:#fff;padding:5px 10px;border-radius:3px;cursor:pointer;'>关闭</div>";
			playHtml += "<iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='play-iframe-6677i-7788'></iframe>";
			playHtml += "</div>";
			$(node).html(playHtml);
			var iframeSrc = interfaceUrl + videoUrl;
			// 优化：只替换开头协议，防止参数中带 http
			iframeSrc = iframeSrc.replace(/^http:\/\//, 'https://');
			console.log("设置iframe源:", iframeSrc);
			$("#play-iframe-6677i-7788").attr("src", iframeSrc);
			// 添加关闭按钮事件
			$(".close-player-btn").on("click", function() {
				console.log("关闭播放器");
				$("#play-iframe-outer-7788op").remove();
			});
						
		} else {
			// 未找到播放器节点，保留网站原有的播放节点，不插入自定义播放器
            console.log("未找到播放器节点，保留网站默认播放器");
        }
    };
    /**
     * 自动选择健康的接口并发起解析。
     * 优先使用上次选择的接口，其次选择健康接口，最后兜底第一个接口。
     */
    movievipHelper.autoSelectInterface = function() {
        var videoUrl = window.location.href;
        var interfaceUrl = null;
        console.log("开始自动选择接口，当前视频URL:", videoUrl);
        // 如果有上次选择的接口，优先使用
        if (movievipHelper.lastSelectedInterface) {
            console.log("检查上次选择的接口:", movievipHelper.lastSelectedInterface);
            var $lastInterface = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td[data-url='"+movievipHelper.lastSelectedInterface+"']");
            if ($lastInterface.length > 0 && !$lastInterface.hasClass("interface-unhealthy")) {
                // 更新UI状态
                $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td").removeClass("td_hover");
                $lastInterface.addClass("td_hover");
                interfaceUrl = movievipHelper.lastSelectedInterface;
                console.log("使用上次选择的接口:", interfaceUrl);
            } else {
                console.log("上次选择的接口不可用或不健康");
            }
        }
        // 如果没有上次选择的接口或者上次选择的接口不健康，选择第一个健康的接口
        if (!interfaceUrl) {
            console.log("尝试选择健康的接口");
            // 首先尝试选择已确认健康的接口
            var $healthyInterface = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td:not(.interface-unhealthy):not(.interface-checking):first");
            // 如果没有确认健康的接口，则尝试选择正在检查中的接口
            if ($healthyInterface.length === 0) {
                console.log("没有确认健康的接口，尝试选择正在检查中的接口");
                $healthyInterface = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td:not(.interface-unhealthy):first");
            }
            if ($healthyInterface.length > 0) {
                // 更新UI状态
                $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td").removeClass("td_hover");
                $healthyInterface.addClass("td_hover");
                interfaceUrl = $healthyInterface.attr("data-url");
                console.log("选择健康接口:", interfaceUrl);
                // 保存选择的接口
                if (isRememberLastInterface) {
                    movievipHelper.saveSelectedInterface(interfaceUrl);
                }
            }
        }
        // 如果没有健康的接口，选择第一个接口
        if (!interfaceUrl) {
            console.log("没有找到健康接口，选择第一个可用接口");
            var $firstInterface = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td:first");
            if ($firstInterface.length > 0) {
                // 更新UI状态
                $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" td").removeClass("td_hover");
                $firstInterface.addClass("td_hover");
                interfaceUrl = $firstInterface.attr("data-url");
                console.log("选择第一个接口:", interfaceUrl);
                // 保存选择的接口
                if (isRememberLastInterface) {
                    movievipHelper.saveSelectedInterface(interfaceUrl);
                }
            }
        }
        // 如果找到了接口，进行解析
        if (interfaceUrl) {
            console.log("自动选择接口成功，开始解析视频");
            movievipHelper.comprehensiveAnalysis(videoUrl, interfaceUrl);
        } else {
            console.log("未找到可用接口，无法解析视频");
        }
    };
    /**
     * 主控浮窗交互与事件绑定
     */
    movievipHelper.operation = function() {
		
		var $vipMovieBox = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" > .open_page_inner_source");
		var $playSourceBox = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" > .plugin_item > .play_source_box");
		var $autoParseButton = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" .auto-parse-mode");
		var $clearCacheBtn = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" .clear-cache-btn");
        var clearCacheClicked = false;
		
		// 根据自动解析模式状态设置按钮样式
		if (isAutoParseMode) {
			$autoParseButton.addClass("active").css({background:'#4CAF50'}).text("自动解析模式已开启");
		} else {
			$autoParseButton.removeClass("active").css({background:'#999'}).text("开启自动解析模式");
		}
		
		// 自动解析模式按钮点击事件
		$autoParseButton.on("click", function(){
			isAutoParseMode = !isAutoParseMode;
			console.log("切换自动解析模式:", isAutoParseMode);
			if (isAutoParseMode) {
				$(this).addClass("active").css({background:'#4CAF50'}).text("自动解析模式已开启");
				// 如果当前页面是视频页面，自动解析
				if (movievipHelper.isRun()) {
					setTimeout(function() {
						movievipHelper.autoSelectInterface();
					}, 1000);
				}
			} else {
				$(this).removeClass("active").css({background:'#999'}).text("开启自动解析模式");
			}
			GM_setValue("isAutoParseMode", isAutoParseMode);
			console.log("保存自动解析模式设置:", isAutoParseMode);
		});
		
		// 清理缓存按钮事件优化
		$clearCacheBtn.on("click", function(){
			var $btn = $(this);
			$btn.css({background:'#4CAF50', color:'#fff'}).text('清理成功');
			setTimeout(function(){
				$btn.css({background:'#f90', color:'#fff'}).text('清理接口健康缓存');
			}, 1200);
			// 执行清理逻辑
			if (typeof movievipHelper.clearAllInterfaceHealthCache === 'function') {
				movievipHelper.clearAllInterfaceHealthCache();
			} else {
				// 优化：同步清理 localStorage 和 GM_setValue
				for (var i = localStorage.length - 1; i >= 0; i--) {
					var key = localStorage.key(i);
					if(key && key.indexOf('interfaceHealthStatus_')===0){
						localStorage.removeItem(key);
						GM_setValue(key, null);
					}
				}
			}
		});
		
		$vipMovieBox.on("mouseover", function() {
			$playSourceBox.show();
		});
		$vipMovieBox.on("mouseout", function() {
			$playSourceBox.hide();
		});
		
		// 使用全局playerNodes
		var player_nodes = movievipHelper.playerNodes;
		var node = "";
		for(var m in player_nodes) {
			var playUrl = window.location.href;
			if(playUrl.indexOf(player_nodes[m].url)!= -1){
				node = player_nodes[m].node;
			}
		}
		$("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" > .plugin_item > .play_source_box > .inner_table_box > table td").on("click", function(){
			// 移除之前的选中状态
			$("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" > .plugin_item > .play_source_box > .inner_table_box > table td").removeClass("td_hover");
			// 添加当前选中状态
			$(this).addClass("td_hover");
			
			// 保存用户选择的接口
			if (isRememberLastInterface) {
				movievipHelper.saveSelectedInterface($(this).attr("data-url"));
			}
			
			// 使用选择的接口进行解析
			var videoUrl = window.location.href;
			var interfaceUrl = $(this).attr("data-url");
			movievipHelper.comprehensiveAnalysis(videoUrl, interfaceUrl);
		});
		
		// 如果是自动解析模式，并且当前页面是视频页面，自动解析
		if (isAutoParseMode && movievipHelper.isRun()) {
			// 增加延迟时间，确保接口健康检查完成
			setTimeout(function() {
				movievipHelper.autoSelectInterface();
			}, 3000);
		}
    };
    /**
     * 初始化并启动模块，加载用户设置，确保自动解析按钮状态正确。
     */
    movievipHelper.start = function(){
        // 加载用户设置
        var savedAutoParseMode = GM_getValue("isAutoParseMode");
        if (savedAutoParseMode !== undefined) {
            isAutoParseMode = savedAutoParseMode;
            console.log("加载自动解析模式设置:", isAutoParseMode);
        } else {
            console.log("未找到保存的自动解析模式设置，使用默认值:", isAutoParseMode);
        }

        // 新增：自动检测地址变化，变化则刷新页面
        var lastUrl = window.location.href;
        setInterval(function() {
            if (window.location.href !== lastUrl) {
                console.log("检测到视频地址变化，自动刷新页面");
                location.replace(window.location.href);
            }
        }, 1000); // 每秒检测一次

        if(movievipHelper.isRun() && window.top==window.self){
    		console.log("当前页面是视频页面，初始化解析界面");
    		movievipHelper.getServerSource();
    		
    		// 确保自动解析模式按钮状态正确
    		setTimeout(function() {
    			var $autoParseButton = $("#plugin_analysis_vip_movie_box_"+movievipHelper.eleId+" .auto-parse-mode");
    			// 始终显示按钮，只切换样式
                if (isAutoParseMode) {
                    $autoParseButton.addClass("active").css("display", "block").css({background:'#4CAF50'}).text("自动解析模式已开启");
                } else {
                    $autoParseButton.removeClass("active").css("display", "block").css({background:'#999'}).text("开启自动解析模式");
                }
    		}, 500);
    	}
    };

    // ===================== 启动入口 =====================
    if(isOpenVideoVipModule){
		movievipHelper.start();
	}
	
})();