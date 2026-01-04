// ==UserScript==
// @name              哔哩哔哩番剧解锁大会员,B站解析，A站视频下载，集合了优酷、爱奇艺、腾讯、芒果、乐视、等全网VIP视频免费破解去广告,高清普清电视观看，增加对手机支持，持续更新
// @name:zh-TW        Bilibili番剧解鎖大會員，B站解析，A站影片下載，集合了優酷、愛奇藝、騰訊、芒果、樂視等全網VIP影片免費破解去廣告，高清、普清電視觀看，增加對手機支援，持續更新
// @namespace          https://greasyfork.org/zh-CN/users/856508
// @version            2.7.46
// @description       自用解析脚本，支持A站视频下载，广告跳过，哔哩哔哩番剧解锁大会员,集合了优酷、爱奇艺、腾讯等全网VIP视频免费破解去广告,没有太多花哨，但是很好用，也会持续更新接口，方便看电影,此脚本仅用于学习研究，请勿用于商业用途，请大家支持正版。
// @description:zh-TW 自用解析腳本，支援A站視頻下載、廣告跳過、Bilibili番劇解鎖大會員，集合了Youku、iQiyi、Tencent等全網VIP視頻免費破解去廣告，沒有太多花哨，但是很好用，也會持續更新接取，方便觀看影片。此腳本僅用於學習研究，請勿用於商業用途，請大家支持正版。
// @author            waahah
// @icon              data:image/png;base64,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PnGzPnHkn324bkFgANMmzRvgmi0QhzGWvbNp76IWxTVcqceZjDGfOEpnlM4NAcOY5TEYdCJ4CKMCXBJMyxlLQwMJobsW8AZwDzCBMSTsfJkmyybh2sVmpD1RIGeK3lpTiesY7kFhM4Vzc+00IcmLYDsBXAl4bzYh57Bwl9sN9CG1OgruADxMKHFvmdcCQL2x1hclXwAvAM9EZVUxTtfGpltWesxrB6GDQTBeWWqWVpRY6TcTKs2kN2s472n21ysyOxB5XRE0ZTZVJoaTMNFRcDOmmI5I9keLmXRSQ4EPg0jboyAm6JRCkWCMaVdwFZntM6k/fh/zWcLqQA8yI2u1/wS8kIpids8gJiVbZ5dfqq7m7zfpeoNXTLoIkLQLVM06Cl4kdDKXI7gTSDAbt6L05gWlRiL38hjuXYRmwCON+8ThSo+MgzH6q3I24Z2x6RdfZ+DJO2frjfU7ZvdteyLJ20e3T819ZtPFZZe12g+bdCHufdZ5v+yA9S19SYxgSWjVVrojWAOsyJJr84GeewEqa/mNaavdHe4hQgtPu1b5RFHJDgFWba7fjC+RmW/Xsk975z648sXHDODS5l4NT14cctKtrl1u7/F6tl3NJlyZ7zaJMnHDrXrleFRPNTFudLpcg3PFfsOKYydejyrezX+Pmeh3txDuG49HG9jcNUdxTue6cLXRjIcbjApeIFzKj26Yt47ZJNLDwMnOvxIp8A/gBhL3F8yKsK0SSj8E/BNXLuCTMWAWs5zEWmChe/C+glc/ZmMkthbu3F3gJYf3oa1ydgbnckoP0hacexFn63QuVt4b4db4t27UKfB94Am89mNaj0tXCU7+OD4RoeycQnqAkmVMZZwXTFcapqTZqXFXAFJFeGAJ6QDeN5F6gXWkbXitXgYoDQC/jAG7PP4Dti5MrvrBCwUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMjA6MTQ6MTErMDg6MDBtEXWtAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDIwOjE0OjExKzA4OjAwHEzNEQAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA3NDlmrKoiAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE1OTOJNIonAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMzI4NTF1V3dqAAAAFHRFWHRUaHVtYjo6U2l6ZQAxNDE5MTZCQqRa34sAAABGdEVYdFRodW1iOjpVUkkAZmlsZTovLy9hcHAvdG1wL2ltYWdlbGMvaW1ndmlldzJfOV8xNjA5OTAzNTE0MDY4MjMwOF8yOF9bMF3spSwtAAAAAElFTkSuQmCC
// @require           https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @match             *://v.qq.com/x/cover/*
// @match             *://m.v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/play.html?cid=*
// @match             *://m.v.qq.com/play.html?cid=*
// @match             *://m.v.qq.com/cover/.*html
// @match             *://m.v.qq.com/x/m/play?*cid*
// @match             *://m.v.qq.com/
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/v*
// @match             *://m.iqiyi.com/kszt/*
// @match             *://www.iqiyi.com/kszt/*
// @match             *://www.iq.com/play/*
// @match             *://m.iqiyi.com/
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/alipay_video/id_*
// @match             *://m.youku.com/video/id_*
// @match             *://*.youku.com/*
// @match             *://w.mgtv.com/b/*
// @match             *://m.mgtv.com/b/*
// @match             *://www.mgtv.com/b/*
// @match             *://m.mgtv.com/home
// @match             *://tv.sohu.com/v/*
// @match             *://m.tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://m.film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://m.le.com/ptv/vplay/*
// @match             *://m.le.com/vplay/*
// @match             *://m.le.com/vplay_*
// @match             *://m.le.com/
// @match             *://v.pptv.com/show/*
// @match             *://m.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://m.fun.tv/*
// @match             *://www.acfun.cn/v/*
// @match             *://www.acfun.cn/bangumi/*
// @match             *://m.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://*.bilibili.com/*"
// @match             *://m.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://m.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://m.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.1905.com/vod/play/*
// @match             *://www.miguvideo.com/p/channel/*
// @match             *://www.miguvideo.com/p/detail/*
// @match             *://m.miguvideo.com/m/*
// @match             *://www.wxtv.net/*
// @match             *://www.eggvod.cn/*
// @match             *://music.163.com
// @match             *://y.qq.com
// @match             *://*.kugou.com
// @match             *://*.kuwo.cn
// @match             *://tv.wandhi.com/*
// @license           GPL License
// @grant             window.onurlchange
// @grant             window.close
// @grant             window.focus
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM_download
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM_info
// @run-at            document-idle
// @connect           bilibili.com
// @connect           iqiyi.com
// @connect           mgtv.com
// @connect           pl.hd.sohu.com
// @tag               social media
// @compatible        chrome Latest
// @compatible        firefox Latest
// @compatible        edge Latest
// @compatible	      Safari
// @compatible	      Opera
// @supportURL        https://cn-greasyfork.org/zh-CN/scripts/472836/feedback
// @downloadURL https://update.greasyfork.org/scripts/472836/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E8%A7%A3%E9%94%81%E5%A4%A7%E4%BC%9A%E5%91%98%2CB%E7%AB%99%E8%A7%A3%E6%9E%90%EF%BC%8CA%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8C%E9%9B%86%E5%90%88%E4%BA%86%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E9%AB%98%E6%B8%85%E6%99%AE%E6%B8%85%E7%94%B5%E8%A7%86%E8%A7%82%E7%9C%8B%EF%BC%8C%E5%A2%9E%E5%8A%A0%E5%AF%B9%E6%89%8B%E6%9C%BA%E6%94%AF%E6%8C%81%EF%BC%8C%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/472836/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E8%A7%A3%E9%94%81%E5%A4%A7%E4%BC%9A%E5%91%98%2CB%E7%AB%99%E8%A7%A3%E6%9E%90%EF%BC%8CA%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8C%E9%9B%86%E5%90%88%E4%BA%86%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E9%AB%98%E6%B8%85%E6%99%AE%E6%B8%85%E7%94%B5%E8%A7%86%E8%A7%82%E7%9C%8B%EF%BC%8C%E5%A2%9E%E5%8A%A0%E5%AF%B9%E6%89%8B%E6%9C%BA%E6%94%AF%E6%8C%81%EF%BC%8C%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    var $ = $ || window.$;
    var host = location.host;
    var startURL = location.href;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var oldItem = null;
 
    function innerParse(url) {
        $("#iframe-player").attr("src", url);
    }
 
    //隔离环境用不了unsafeWindow，但可用chrome.tabs等API
    //页面主环境没有chrome.storage等API，但可用unsafeWindow
    function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") {
            GM_openInTab(url, open_in_background);
        } else  if (typeof GM !== "undefined"){
            GM.openInTab(url, open_in_background);
        /*}else if (typeof chrome.tabs !== "undefined"){
            chrome.tabs.create({
                url: url, 
                active: open_in_background
            });*/
        }else {
            window.open(url, open_in_background);
        }
    }
 
 
    function GMgetValue(name, value) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(name, value);
        } else if (typeof GM !== "undefined"){
            return GM.getValue(name, value);
        /*}else if (typeof chrome.storage !== "undefined"){
            let obj = {};
            chrome.storage.local.get([name]).then((result) => {
                obj = result[name];
            });
            return obj;*/
        }else{
            return localStorage.getItem(name);
        }
    }
 
 
    function GMsetValue(name, value) {
        if (typeof GM_setValue === "function") {
            GM_setValue(name, value);
        } else if (typeof GM !== "undefined"){
            GM.setValue(name, value);
        /*} else if (typeof chrome.storage !== "undefined"){
            chrome.storage.local.set({ name: value }).then(() => {});*/
        } else {
            localStorage.setItem(name, value);
        }
    }
 
    function GMxmlhttpRequest(obj) {
        if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest(obj);
        } else if (typeof GM !== "undefined"){
            GM.xmlhttpRequest(obj);
        } else {
            $.ajax(obj);
        }
    }
 
    function GMaddStyle(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }

	//视频暂停
    function pause(video){
		video.pause();
	}

	function close_voice(video){
		video.muted = true;
	}

    //终止视频加载
    function Termination_video(video) {
        video.src='';
        close_voice(video);
        video.removeAttribute('src');
    }

    //视频播放控制
    function reomveVideo() {
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {

            pause(video);
            Termination_video(video);
        }
    }
 
    //实时监听网址变化
    async function urlChangeReload() {
        let currentURL = window.location.href;
        //console.log(`初始URL和当前URL是否相同：${startURL==currentURL}`);
        if (startURL !== currentURL) {
            console.log('刷新页面');
            window.location.reload();
        }
    }
 
    async function mo() {
        //观察到变动时执行回调函数
        async function callback(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
            await urlChangeReload();
        }
 
        const config = {
            'attributes': true,
            'childList': true,
            'subtree': false
        };
        // 以上述配置开始观察目标节点
        const promise = new Promise((resolve, reject) => {
            const observe = new MutationObserver(callback);
            resolve(observe);
        })
        promise.then(observe => observe.observe(document.body, config));
    }
 
    var originalInterfaceList = [
        //--------------------------------------------------------------------------------------
        {
            name: "纯净",
            type: "1",
            url: "https://im1907.top/?jx="
        }, 
        {
            name: "剖元",
            type: "1",
            url: "https://www.pouyun.com/?url="
        },{
            name: "七七",
            type: "1",
            url: "https://jx.77flv.cc/?url="
        }, {
            name: "JX",
            type: "1",
            url: "https://jiexi.site/?url="
        }, {
            name: "夜幕",
            type: "1",
            url: "https://www.yemu.xyz/?url="
        },{
            name: "2s0",
            type: "1",
            url: "https://jx.2s0.cn/player/?url="
        },{
            name: "咸鱼",
            type: "1",
            url: "https://jx.xymp4.cc/?url="
        },{
            name: "七哥",
            type: "1",
            url: "https://jx.nnxv.cn/tv.php?url="
        },{
            name: "冰豆",
            type: "1",
            url: "https://api.qianqi.net/vip/?url="
        }, {
            name: "CK",
            type: "1",
            url: "https://www.ckplayer.vip/jiexi/?url="
        }, 
        {
            name: "JY",
            type: "1",
            url: "https://jx.playerjy.com/?url="
        },
        {
            name: "mmkv",
            type: "1",
            url: "https://jx.mmkv.cn/tv.php?url="
        },
        {
            name: "M3U8",
            type: "1",
            url: "https://jx.m3u8.tv/jiexi/?url="
        },
        {
            name: "PM",
            type: "1",
            url: "https://www.playm3u8.cn/jiexi.php?url="
        },
        {
            name: "BL",
            type: "1",
            url: "https://vip.bljiex.com/?v="
        },
        {
            name: "虾米",
            type: "1",
            url: "https://jx.xmflv.com/?url="
        },
        {
            name: "YP",
            type: "1",
            url: "https://yparse.ik9.cc/index.php?url="
        },
        {
            name: "XY",
            type: "1",
            url: "https://jx.nnxv.cn/tv.php?url="
        },
        {
            name: "云析",
            type: "1",
            url: "https://jx.yparse.com/index.php?url="
        },
        {
            name: "YT",
            type: "1",
            url: "https://jx.yangtu.top/?url="
        }, {
            name: "OK",
            type: "1",
            url: "https://jx.xmflv.cc/?url="
        },{
            name: "盘古",
            type: "1",
            url: "https://www.pangujiexi.com/jiexi/?url="
        },
        {
            name: "JY解析",
            type: "1",
            url: "https://jx.playerjy.com/?url="
        },
        {
            name: "8090",
            type: "1",
            url: "https://www.8090g.cn/?url="
        },
        /*{
            name: "wandhi",
            type: "1",
            url: "http://vip.wandhi.com/?v="
        },
        {
            name: "爱豆",
            type: "1",
            url: "https://jx.dmflv.cc/?url="
        },
        {
            name: "eptept",
            type: "1",
            url: "https://dmjx.m3u8.tv/?url="
        },{
            name: "B站1",
            type: "1",
            url: "https://jx.jsonplayer.com/player/?url="
        },  {
            name: "ckmov",
            type: "1",
            url: "https://www.ckmov.vip/api.php?url="
        },{
            name: "H8",
            type: "1",
            url: "https://www.h8jx.com/jiexi.php?url="
        },
        {
            name: "MAO",
            type: "1",
            url: "https://www.mtosz.com/m3u8.php?url="
        },
        {
            name: "RDHK",
            type: "1",
            url: "https://jx.rdhk.net/?v="
        },
        {
            name: "思云",
            type: "1",
            url: "https://jx.ap2p.cn/?url="
        },
        {
            name: "思古3",
            type: "1",
            url: "https://jsap.attakids.com/?url="
        },
        {
            name: "听乐",
            type: "1",
            url: "https://jx.dj6u.com/?url="
        },
        {
            name: "云端",
            type: "1",
            url: "https://sb.5gseo.net/?url="
        },
        */{
            name: "云搜",
            type: "0",
            url: "https://video.isyour.love/player/getplayer?jx="
        },
        {
            name: "风影",
            type: "0",
            url: "https://movie.heheda.top/?v="
        }, 
        {
            name: "七哥",
            type: "0",
            url: "https://jx.nnxv.cn/tv.php?url="
        },
        {
            name: "IM",
            type: "0",
            url: "https://im1907.top/qwq/?jx="
        }, 
 
        //--------------------------------------------------------------------------------------
        {
            name: "邦宁",
            type: "2",
            url: "https://video.isyour.love/player/getplayer?url="
        }, {
            name: "云解析",
            type: "2",
            url: "https://yparse.ik9.cc/index.php?url="
        }, {
            name: "夜幕",
            type: "2",
            url: "https://www.yemu.xyz/?url="
        }, {
            name: "AM",
            type: "2",
            url: "https://am1907.top/?jx="
        },{
            name: "BL解析",
            type: "2",
            url: "https://vip.bljiex.cc/?v="
        }
    ];
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
 
        let mobile_node = "";
        let mobile_player_nodes = [
            { url: "m.v.qq.com", node: "#player" },
            { url: "m.iqiyi.com", node: ".m-video-player-wrap" },
            { url: "www.iq.com", node: ".intl-video-wrap" },
            { url: "m.youku.com", node: "#player" },
            { url: "m.mgtv.com", node: ".video-area" },
            { url: "tv.sohu.com", node: "#player" },
            { url: "film.sohu.com", node: "#playerWrap" },
            { url: "m.tv.sohu.com", node: ".player" },
            { url: "m.le.com", node: "#j-player" },
            { url: "v.pptv.com", node: "#pptv_playpage_box" },
            { url: "vip.pptv.com", node: ".w-video" },
            { url: "m.pptv.com", node: "#player-box-con" },
            { url: "www.fun.tv", node: "#html-video-player-layout" },
            { url: "m.fun.tv", node: "#j-player-layout" },
            { url: "www.acfun.cn", node: "#player" },
            { url: "m.acfun.cn", node: "#mPlayer" },
            { url: "m.bilibili.com", node: ".player-container" },
            { url: "vip.1905.com", node: "#player" },
            { url: "m.1905.com", node: "#vodPlayer" },
            { url: "www.1905.com", node: "#vodPlayer" },
            { url: "www.56.com", node: "#play_player" },
            { url: "m.miguvideo.com", node: "#mod-player" }
        ];
        for (let i in mobile_player_nodes) { 
            if (mobile_player_nodes[i].url == host) {
                mobile_node = mobile_player_nodes[i].node; 
            } 
        }
        localStorage.setItem('globalnode', mobile_node);
 
        let mobile_videoPlayer = $("<div id='iframe-div' ><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
        let mobile_innerList = [];
        let mobile_outerList = [];
        let mobile_innerli = "";
        let mobile_innerlis = "";
        let mobile_outerli = "";
        originalInterfaceList.forEach((item, index) => {
            if (item.type == "0") {
                mobile_outerList.push(item);
                mobile_innerList.push(item);
                mobile_outerli += "<li>" + item.name + "</li>";
            }
            if (item.type == "1") {
                mobile_innerList.push(item);
                mobile_innerli += "<li>" + item.name + "</li>";
            }
            if (item.type == "2") {
                mobile_innerList.push(item);
                mobile_innerlis += "<li>" + item.name + "</li>";
            }
        });
        parseInterfaceList = mobile_innerList;
 
        let left = 0;
        let top = 320;
        let Position = GMgetValue("Position_" + host, null);
        if (!!Position) {
            left = Position.left;
            top = Position.top;
        }
        let mobile_ImgBase64 = `data:image/png;base64,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E3UOUS0hL0WQKuKETHPevXsT6w7v4efZhexrdqWJSEIhpUDKAWHj/Gb7aj6y5hJuf+tmth17O399fRVZJuAcqKPZOcBw1kXHkvloJUeclHArqpJgV0EUJMuYP3qUW3f+hKGi4Jf5KnxrfscIGI65N9+VJmGEaPiG8d8zC7lu6VZW9+3iP8OXcCz0IdWMvJJT65lHtbubvFbB5Q6XK1mmuExxmSPLBM0ztJLRWz/Ohsc3sGL/Fr5bvZqNtiJFH22KA445t9wFpda3pIAPDc1l6PQCbrrin1zVv4eDY0s5ygBZpYar5rg8I8sdmjlcJmSZQ3NH7jI0y8iryrkTw3zp919h7at/4/HKJfzIXcOEl8T+qRR4HN0fuitBYtNy3Oq8NriAQ6MDfODSzdy0bBPZ83DYL8bPbEfzCppnuDxDczcVscuUGXmDd+36I1964h6W7/sXj1UuZoNcx4miVENMRw8FwuJH0lwUpue0RCDl9prVB7ln8UMs+cH/eK2yiDcGlvPU5R/hSPtcfCXHicPFgu5whvf9bysD/9nEeQdfYLiZ8ZPOa3l08i2MeJfEaNQkTqMv5b5HdNF9wahqOaKmtXvrkOIy+t0Jbhp/ifeEHVx6bA+WzWAiU061dYNUmFk/yaxinOiN43kPf3ZL+J0t4znmQhGTyp5SXQEoUvQyYdK76uH7Rk6EOxCf+nvJzintVqIilYz58Rgr5AjvyY8y7+heOidOE6NRr9QY7uzjmUYfL/pe9lsvhbfyHGBTcm9qXwkQPd093CfzL//ZVadOTT5Ub+qSaQemBcO0fEonJ5GAmkKcRCwdNKJmRBGsLsko/iy57Mu8t7aMED21mr3e29Nxuxs78tjhNes/evjYSP1yX1hvIuF0WU5t1DqkxkA0TzQrpZcQQyQWPmn+WBqPoYT7LAksAiht7W7/ZZd1fuWVV775N9nw7Y1852vnSv/aV9eGxuhnhofHbg0+0ykkWlyI00o2qc0w7Vyrti2W+jKWxlp5T51WJVhvT+3n7e2z7z9wYPG2O+8ctv8DOvG96FXDHSUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMTg6NTE6NDcrMDg6MDA2swCDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDE4OjUxOjQ3KzA4OjAwR+64PwAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MJCgPl4AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTBoD/7TAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMjc5MDfqP5WvAAAAEnRFWHRUaHVtYjo6U2l6ZQA1NjQ1QkJMUitHAAAARXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzU4NDQ3NDE1OTFfNF9bMF1niHnVAAAAAElFTkSuQmCC`;
        GMaddStyle(`#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; background-color:#2E9AFE; z-index:2147483647; font-size:20px; text-align:left;}
            #vip_movie_box .item_text {width:0px; padding:2px 0px; text-align:center;}
            #vip_movie_box .item_text img {width:36px; height:36px; display:inline-block; vertical-align:middle;}
            #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:36px; top:0; text-align:center; background-color:rgba(255, 255, 255, 0.2); backdrop-filter:saturate(1) blur(15px); border:1px solid gray; overflow-y:auto;}
            #vip_movie_box .vip_mod_box_action li{font-size:14px; color:#DCDCDC; text-align:center; width:80px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px; background:rgba(0,0,0,0.6);border-radius:2px;}
            #vip_movie_box .vip_mod_box_action li:hover{color:#FF4500;background:#00ff00}
            #iframe-div{width:100%; height:100%; z-index:999999; position: absolute;top:0px;padding:0px;
            }
            .add{background-color:#00ff00;}`);
        $(function () { 
            $("ul").on("click", "li", function () { 
                $("ul li").removeClass("add"); 
                $(this).addClass("add"); 
            }) 
        });
        let mobile_html = $(`
            <div id='vip_movie_box'>
                <div class='item_text' >
                    <img src="` + mobile_ImgBase64 + `" title='视频解析'/>
                    <div class='vip_mod_box_action' >
                        <div style='display:flex;'>
                            <div style='width:295px; max-height:300px; margin-bottom:10px;'>
                                <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>全网VIP视频解析</div>
                                <ul style='margin:0 5px;'>
                                ` + mobile_innerli + `
 
                                <div style='clear:both;'></div>
                                </ul>
                                <ul style='margin:0 5px;'>
                                ` + mobile_outerli + `
 
                                <div style='clear:both;'></div>
                                </ul>
                                <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>B站大会员番剧解析(专用线路)</div>
                                <ul style='margin:0 5px;'>
                                ` + mobile_innerlis + `
 
                                <div style='clear:both;'></div>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
        $("body").append(mobile_html);
        $("#vip_movie_box").click( () => {
            $(".vip_mod_box_action").toggle();
            /*let display = document.querySelector('.vip_mod_box_action').style.display;
            if(display == ''){
                display = 'none';
            }
            switch(display){
                    case 'none':
                        $(".vip_mod_box_action").show();
                        break;
                    case 'block':
                        //if(blocknum < 1){
                            //$(".vip_mod_box_action").show();
                            //blocknum+=1;
                        //}
                        //else{
                            $(".vip_mod_box_action").hide();
                        //}
                        break;
                }*/
        });
        $(".vip_mod_box_action li").each((index, item) => {
            item.addEventListener("click", () => {
                if (parseInterfaceList[index].type == "1" || parseInterfaceList[index].type == "2") {
                    if (document.getElementById("iframe-player") == null) {
                        let mobile_player = $(mobile_node);
                        //await reomveVideo();
                        mobile_player.empty();
                        mobile_player.append(mobile_videoPlayer);
                    }
                    innerParse(parseInterfaceList[index].url + location.href);
                }
                if (parseInterfaceList[index].type == "0") {
                    GMopenInTab(parseInterfaceList[index].url + location.href, false);
                }
            });
        });

        async function addMObserve(dom, callbackFunc) {
            const config = {
                'attributes': true,
                'childList': true,
                'subtree': false
            };
            // 以上述配置开始观察目标节点
            const promise = new Promise((resolve, reject) => {
                const observe = new MutationObserver(callbackFunc);
                resolve(observe);
            })
            promise.then(observe => observe.observe(dom, config));
        }

        switch (host) {
            case 'm.v.qq.com':
                //--------------------------------------------------------------------------------
                const txDisplayNodes = [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec", ".at-app-banner", ".bottom-banner"];
                setInterval(() => {
                    txDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);
                //处理视频相关推荐视频
                function getQQTjVideo() {
                    const tjVideo = document.querySelector(".recommend-long");
                    if (tjVideo) {
                        tjVideo.addEventListener('click', function (event) {
                            const clickedElement = event.target; // 获取到被点击的元素
                            if (clickedElement.nodeName == 'IMG') {
                                const imgSrc = clickedElement.src; // 获取这个元素下的所有子元素
                                const cid = imgSrc.split('/')[5].substring(0, 15);
                                const playSrc = `https://m.v.qq.com/x/m/play?cid=${cid}`;
                                const aNode = document.createElement('a');
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                                //window.location.assign(playSrc);
                            }
                        });
                    }
                }

                //处理短剧选集|视频选集|视频花絮
                function getQQXjVideoList() {
                    const xjVideoList = document.querySelectorAll(".pl-episode__container .pl-episode__item");
                    if(xjVideoList.length){
                        for (let xjA of xjVideoList) {
                            xjA.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const vid = xjA.getAttribute("data-vid");
                                const cidParam = location.href.split('/')[5].split('?')[1].split('&')[0];
                                const playSrc = `https://m.v.qq.com/x/m/play?${cidParam}&vid=${vid}`;
                                const aNode = document.createElement('a');
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                                //window.location.assign(playSrc);
                            });
                        }

                    }
                }

                //处理短剧相关推荐
                function getQQDjTjVideo() {
                    const djVideoList = document.querySelectorAll(".item-rec-short-video .item-rec-short-video__pic img");
                    if(djVideoList.length){
                        for (let djA of djVideoList) {
                            djA.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const vid = djA.getAttribute('src').split('/')[3];
                                const cidParam = location.href.split('/')[5].split('?')[1].split('&')[0];
                                const playSrc = `https://m.v.qq.com/x/m/play?${cidParam}&vid=${vid}`;
                                const aNode = document.createElement('a');
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                                //window.location.assign(playSrc);
                            });
                        }

                    }
                    
                }

                getQQXjVideoList();
                window.addEventListener('load', () => {
                    getQQTjVideo();
                    getQQDjTjVideo();
                });
                
                break;
            case 'm.mgtv.com':
                //--------------------------------------------------------------------------------
                const mgDisplayNodes = [".ad-fixed-bar",".bottom-fixed-functional-bar", ".wx-label-wrap-inner-cont", "#app > div.with-gray", "div[class^=mg-app]", ".video-area-bar", ".open-app-popup", ".ad-banner", ".cetbox", ".mask-bg"];
                setInterval(() => {
                    mgDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);

                //处理猜你喜欢视频
                async function getMgVideo() {
                    let mgVideo = document.querySelectorAll('.mgui-long3-list li');
                    console.log(mgVideo);
                    if (mgVideo.length) {
                        for (let mgA of mgVideo) {
                            console.log(mgA);
                            mgA.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const hitid = JSON.parse(mgA.children[0].dataset.clickStat)[1].hitid;
                                const videoid = JSON.parse(mgA.children[0].dataset.clickStat)[1].videoid;
                                const playSrc = `https://m.mgtv.com/b/${videoid}/${hitid}.html`;
                                console.log(playSrc);
                                const aNode = document.createElement('a');//biLi.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                                window.open(playSrc);
                            });
                        }
                    } else { console.log("没有找到相关剧集或推荐视频"); }
                }
                
                setTimeout( async()=> {
                    await getMgVideo();

                    
                }, 2000);

                document.querySelector('.band-aid-btn').addEventListener('click', function(event) {
                    //setTimeout(async () => {
                        getMgVideo();
                    //},700);
                    event.stopPropagation();
                });

                break;
            case 'm.iqiyi.com':
                //--------------------------------------------------------------------------------
                const iqiyiDisplayNodes = [".c-btn.c-btn-block", ".iqy-items", "#player_bottom", "div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"];
                setInterval(() => {
                    iqiyiDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);
                //--------------------------------------------------------------------------------
                //短剧处理
                if(document.querySelector("section[class=m-verticaVideo-player]")){
                    mobile_node = "#videoZone";
                    setTimeout(() => {
                        document.querySelector(".player-handle").style.display = "block";
                        document.querySelector(".player-handle ~ div").style.display = "block";
                    },800)
                    setInterval(() => {
                        if(!document.querySelector("section.m-album-num.clearfix.hie")){
                            
                            document.querySelector(".player-handle").style.display = "block";
                            document.querySelector(".player-handle ~ div").style.display = "block";
                            
                        }
                    },2000)
                }
                
                break;
            case 'youku.com':
            case 'www.youku.com':
            case 'm.youku.com':
                //--------------------------------------------------------------------------------
                const youkuDisplayNodes = [".callEnd_fixed_box", ".callEnd_box", ".h5-detail-guide", ".h5-detail-vip-guide"];
                setInterval(() => {
                    youkuDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);

                //处理相关推荐视频
                async function getVideo() {
                    let ykVideo = document.querySelectorAll("#feed-lists>li");
                    console.log(ykVideo);
                    /*if(ykVideo.length > 0 && ykVideo.length < 6){
                        event.stopPropagation();
                        event.preventDefault();
                        for(let i = 4; i<6; i++){
                            ykVideo[i].addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                        await getVideo();
                        //return false;
                    }*/
                    if (ykVideo.length) {
                        for (let Li = 0; Li < ykVideo.length; Li++) {
                            //console.log(ykVideo[Li]);
                            ykVideo[Li].addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const vid = ykVideo[Li].dataset.vid;
                                const spm = ykVideo[Li].dataset.spm;
                                const playSrc = `https://m.youku.com/alipay_video/id_${vid}.html?spm=${spm}`;
                                //console.log(playSrc);
                                const aNode = document.createElement('a');//Li.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                            })
                        }
                    }else{console.log("没有找到相关推荐视频");}
                }
                
                addMObserve(document.querySelector('.card-list.clipboard'), getVideo);
                
                window.addEventListener("load", async function () {
                    await getVideo();

                    document.querySelector('div[class=change-nextpage]').addEventListener("click", async function (event) {
                        setTimeout(async()=>{
                            await getVideo();
                        },700);
                    });
                })
                
                break;
            case 'm.bilibili.com':
                //--------------------------------------------------------------------------------
                const blibliDisplayNodes = [".launch-app-btn.home-float-openapp", ".visible-open-app-btn", ".openapp-dialog.large"];
                setInterval(() => {
                    blibliDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);

                //处理选集和相关推荐视频
                async function getBlVideo() {
                    let blVideo = document.querySelectorAll('bili-open-app');
                    //console.log(blVideo);
                    if (blVideo.length) {
                        for (let biLi of blVideo) {
                            //console.log(biLi);
                            biLi.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const universallink = biLi.getAttribute('universallink');
                                const appSchema = biLi.getAttribute('schema');
                                const playSrc = universallink;
                                //console.log(playSrc);
                                const aNode = document.createElement('a');//biLi.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                            })
                        }
                    } else { console.log("没有找到相关剧集或推荐视频"); }
                }
                
                window.addEventListener("load", async function () {
                    await getBlVideo();
                });

                addMObserve(document.querySelector('.recom-wrapper'), getBlVideo);
                break;
            //--------------------------------------------------------------------------------
            case 'm.acfun.cn':
                const acfunDisplayNodes = ["#common_invoke_panel", ".down-app-button", "#js-profit-fixed", "#open_app_btn"];
                setInterval(() => {
                    acfunDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);
                let dramaInfo = document.querySelector("#drama-info");
                if(dramaInfo){
                    dramaInfo.style.marginTop = ".23rem";
                }
                //document.querySelector("#drama-info").style.marginTop = ".23rem";

                //处理相关推荐视频
                async function getAcVideo() {
                    let acVideo = document.querySelectorAll('.reco-list-wrapper>li');
                    //console.log(acVideo);
                    if (acVideo.length) {
                        for (let acLi of acVideo) {
                            //console.log(acLi);
                            acLi.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const ac = acLi.getAttribute('ac');
                                const vid = acLi.getAttribute('vid');
                                const playSrc = `https://m.acfun.cn/v/?ac=${ac}_${vid}`;
                                //console.log(playSrc);
                                const aNode = document.createElement('a');//biLi.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                            })
                        }
                    } else { console.log("没有找到相关推荐视频"); }
                }
                
                window.addEventListener("load", async function () {
                    this.setTimeout(async () =>{
                        await getAcVideo();
                    }, 700);
                });

                addMObserve(document.querySelector('#recommend_list'), getAcVideo);
                break;
            //--------------------------------------------------------------------------------
            case 'm.tv.sohu.com':
                const sohuDisplayNodes = [".mtv-vrs-panel", ".actv-banner.js-app-topbanner", ".js-oper-pos", ".advertise", ".x-download-panel.x-dl-shake", ".x-ad-panel"];
                setInterval(() => {
                    sohuDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);
                
                let plList = document.querySelector("ul.pl-list");
                if (plList) {
                    plList.addEventListener("click", function (event) {
                        document.querySelector('.mtv-vrs-panel').style.display = 'none';
                    });
                }

                //处理猜你喜欢相关视频
                function getSoVideo() {
                    let soVideo = document.querySelectorAll('.guess-list.vertical-view.table-list li');
                    //console.log(soVideo);
                    if (soVideo.length) {
                        for (let soLi of soVideo) {
                            //console.log(soLi);
                            soLi.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const pcUrl = soLi.getAttribute('data-url');
                                const vid = soLi.getAttribute('data-vid');
                                const playSrc = `https://m.tv.sohu.com/v${vid}.shtml`;//pcUrl
                                //console.log(playSrc);
                                const aNode = document.createElement('a');//biLi.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                            })
                        }
                    } else { console.log("没有找到相关推荐视频"); }
                }

                //处理相关精彩推荐视频
                function getTjVideo() {
                    const soVideo = document.querySelectorAll('.rec-item .item');
                    //console.log(soVideo);
                    if (soVideo.length) {
                        for (let soLi of soVideo) {
                            //console.log(soLi);
                            soLi.addEventListener("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                const vid = soLi.dataset.vid;
                                const playSrc = `https://m.tv.sohu.com/v${vid}.shtml`;//pcUrl
                                //console.log(playSrc);
                                const aNode = document.createElement('a');//biLi.children[0];
                                aNode.href = playSrc;
                                aNode.click();
                                aNode.remove();
                            })
                        }
                    } else { console.log("没有找到相关推荐视频"); }
                }
                
                window.addEventListener("load", function () {
                    getSoVideo();

                    getTjVideo();

                    document.querySelector('.change-btn-wrapper.js-change').addEventListener("click", function (event) {
                        setTimeout(()=>{
                            getSoVideo();
                        },700);
                    });

                    document.querySelectorAll('.change-btn-wrapper.js-change')[1].addEventListener("click", function (event) {
                        setTimeout(()=>{
                            getTjVideo();
                        },700);
                    });

                    addMObserve(document.querySelector('.app-vbox.app-guess-vbox'), getSoVideo);
                });

                break;
            //--------------------------------------------------------------------------------
            case 'm.fun.tv':
                const funDisplayNodes = ["#bannerClient", ".vip-tip", "#m-h5v-error-1", ".m-a-banner-wrap.f-mgb"];
                setInterval(() => {
                    funDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);

                break;
            //--------------------------------------------------------------------------------
            case 'm.le.com':
                const leDisplayNodes = [".daoliu", ".daoliu1", ".addDesktop", ".contentDaoliu.demo-list", "#entryImg", "#j-leappMore"];
                setInterval(() => {
                    leDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);

                break;
            //--------------------------------------------------------------------------------
            case 'm.pptv.com':
                const pptvDisplayNodes = [".p-video-vip", ".pp-m-diversion-popup", ".pp-m-diversion-fix", "#ppmob-detail-picswiper", ".foot_app", ".layout.layout_ads"];
                setInterval(() => {
                    pptvDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);

                break;
            //--------------------------------------------------------------------------------
            case 'm.1905.com':
                const m1905DisplayNodes = ["#popupModule", ".wakeUpAppModule", ".dowApp_warp.cctv6_app", ".wakeUppApp", ".tryApp"];
                setInterval(() => {
                    m1905DisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);

                break;
            //--------------------------------------------------------------------------------
            case 'vip.1905.com':
                const vip1905DisplayNodes = ["#popupModule", ".viewport.clubwarp", ".wakeUpAppModule", ".movieList_new.club_new", ".new_downLoad", ".ad", ".openMembershipBtn"];
                setInterval(() => {
                    vip1905DisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);
                break;
            //--------------------------------------------------------------------------------
            case 'm.miguvideo.com':
                const miguDisplayNodes = [".end-wrapper",".app-box", "div[name=通栏文字广告]", "div[name=通栏广告位]", "div[name=播放页营销通栏]", "div[name=钻石会员特权]"];
                setInterval(() => {
                    miguDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 1000);
                break;
            //--------------------------------------------------------------------------------
        }
        //--------------------------------------------------------------------------------
        
    }
    else {
        var node = "";
        var player_nodes = [{
            url: "v.qq.com",
            node: "#player-container"
        }, {
            url: "www.iqiyi.com",
            node: ".iqp-player",//"#player",//"#flashbox`"
        }, {
            url: "v.youku.com",
            node: "#ykPlayer"
        }, {
            url: "www.mgtv.com",
            node: "#mgtv-player-wrap"
        }, {
            url: "tv.sohu.com",
            node: "#player"
        }, {
            url: "film.sohu.com",
            node: "#playerWrap"
        }, {
            url: "www.le.com",
            node: "#le_playbox"
        }, {
            url: "video.tudou.com",
            node: ".td-playbox"
        }, {
            url: "v.pptv.com",
            node: "#pptv_playpage_box"
        }, {
            url: "vip.pptv.com",
            node: ".w-video"
        }, {
            url: "www.wasu.cn",
            node: "#flashContent"
        }, {
            url: "www.fun.tv",
            node: "#html-video-player-layout"
        }, {
            url: "www.acfun.cn",
            node: "#player"
        }, {
            url: "www.bilibili.com",
            node: "#bilibili-player"
        }, {
            url: "vip.1905.com",
            node: "#player"
        }, {
            url: "www.56.com",
            node: "#play_player"
        }, {
            url: "www.miguvideo.com",
            node: "#mod-player"
        }];
        for (var i in player_nodes) {
            if (player_nodes[i].url == host) {
                node = player_nodes[i].node;
            }
        }
        localStorage.setItem('globalnode', node);

        var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
 
        var ImgBase64 = `
        data:image/png;base64,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E3UOUS0hL0WQKuKETHPevXsT6w7v4efZhexrdqWJSEIhpUDKAWHj/Gb7aj6y5hJuf+tmth17O399fRVZJuAcqKPZOcBw1kXHkvloJUeclHArqpJgV0EUJMuYP3qUW3f+hKGi4Jf5KnxrfscIGI65N9+VJmGEaPiG8d8zC7lu6VZW9+3iP8OXcCz0IdWMvJJT65lHtbubvFbB5Q6XK1mmuExxmSPLBM0ztJLRWz/Ohsc3sGL/Fr5bvZqNtiJFH22KA445t9wFpda3pIAPDc1l6PQCbrrin1zVv4eDY0s5ygBZpYar5rg8I8sdmjlcJmSZQ3NH7jI0y8iryrkTw3zp919h7at/4/HKJfzIXcOEl8T+qRR4HN0fuitBYtNy3Oq8NriAQ6MDfODSzdy0bBPZ83DYL8bPbEfzCppnuDxDczcVscuUGXmDd+36I1964h6W7/sXj1UuZoNcx4miVENMRw8FwuJH0lwUpue0RCDl9prVB7ln8UMs+cH/eK2yiDcGlvPU5R/hSPtcfCXHicPFgu5whvf9bysD/9nEeQdfYLiZ8ZPOa3l08i2MeJfEaNQkTqMv5b5HdNF9wahqOaKmtXvrkOIy+t0Jbhp/ifeEHVx6bA+WzWAiU061dYNUmFk/yaxinOiN43kPf3ZL+J0t4znmQhGTyp5SXQEoUvQyYdK76uH7Rk6EOxCf+nvJzintVqIilYz58Rgr5AjvyY8y7+heOidOE6NRr9QY7uzjmUYfL/pe9lsvhbfyHGBTcm9qXwkQPd093CfzL//ZVadOTT5Ub+qSaQemBcO0fEonJ5GAmkKcRCwdNKJmRBGsLsko/iy57Mu8t7aMED21mr3e29Nxuxs78tjhNes/evjYSP1yX1hvIuF0WU5t1DqkxkA0TzQrpZcQQyQWPmn+WBqPoYT7LAksAiht7W7/ZZd1fuWVV775N9nw7Y1852vnSv/aV9eGxuhnhofHbg0+0ykkWlyI00o2qc0w7Vyrti2W+jKWxlp5T51WJVhvT+3n7e2z7z9wYPG2O+8ctv8DOvG96FXDHSUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMTg6NTE6NDcrMDg6MDA2swCDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDE4OjUxOjQ3KzA4OjAwR+64PwAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MJCgPl4AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTBoD/7TAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMjc5MDfqP5WvAAAAEnRFWHRUaHVtYjo6U2l6ZQA1NjQ1QkJMUitHAAAARXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzU4NDQ3NDE1OTFfNF9bMF1niHnVAAAAAElFTkSuQmCC`;
 
        var sImgBase64 = `
        data:image/png;base64,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7qc5WxH+ahdSjVrfPQQsl9y9NmtGsgYzHRKODUxn5TXvsGTqR+y7OJ+zcSrNrZbRLQ7T3ErS3IxNEoyzuMTgnCFJDC6xJIngEoctOKZUzvHoxp9x9YG3eNJ8kY3MG7H77N8y4dtr8/JW7y5OnrmEM8PtfH3BdpZO6+JUuYNTOhdbHIVLLNYmGGcy5bsMgE0szlmss9iiYcZnJ/jJi4+x5JMt/MNcw+/MzZSDyZtcnwPwWMZ+a22tF6ifBXyZT0+0Uxqawerr3mTN7C00faCUyjMZGj0OcQkkFps4bOIwSYItWGxiGM8gq7te5qGXf8mc7h383VzLWm6nNxZyw3EEAynC9PUjEqvW6zQqmMRxy9KDPDbzL1z7x5Mck+nsmn0Tb89fQ2/LOEJSwFqDiZ7WOMSNx3bR2fUqcw+/z+lqwtOFpaz3nfRFB1rNU7UH0joTQsdzW4isyAI5juhY8vRoHVOSfr45sJu70h3M6T+C2gKptQw3t4FxNJX7KFaG0ODpkTG8Yufygi7gwzgRDQqa1n3ecEEVCFtFpj5/vwb9M4RCo7HIO+RaVYlgEkO7nuWq4nlWhMN09B5hbKWPGCOVZBSnihPZETv4sNLGQZ1A6iUzrPFzohtBf9WY8EMxU9e1x2pYh5pVjUNDqB868j4sFylgAhLBUEEIoD5r06ISqybrLckNa2isVd9dbf3KZmPiAy4OpSWseQT1QuRLoMVaw1gHUT+0RJCIqhJUIQqozc+HvnFWREeE24jUnf1XIG6H8HCMxZIAmCnrAG3XtLxKg95DlNvq58QagBoTtTn5obSW1+u5xI9ou2uU1wDoNmP8CzB6E0gpxp/zf7k3KkqmZpqgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTA2VDE4OjU4OjM2KzA4OjAwZhQp5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0wNlQxODo1ODozNiswODowMBdJkVgAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1MDI4MzE20dcB+AAAABJ0RVh0VGh1bWI6OlNpemUANTI5M0JCTzUp6AAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1NDE3MjU3OTE2XzY5X1swXVzV31QAAAAASUVORK5CYII=`;
 
        var bImgBase64 = `
        data:image/png;base64,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WHmDeqr80QySaqaaABuER+jTi5UcT79xK52FOh97/8t0FhutiJv0bVSJrRJFgRmNCG2R4/WJy0xdWmmx5EO/PMP0lRpxLsfNOs1NV1/nJYY4q31ZTQvgszJUD+rxieOFN97Pyxf2cGTvCW7fNYnJ5XFiWK4mLC418KJgFBUfuNwKRpXUK4+/cJ65Sp2llYSpS1VcnGd3Z8q/TD1FvdrgMftXLEm8Ti8KhrEnlXW6M4rhzvFJvvmJh6hJkW+/eC+vntlMb0Fpj5WZuRr1xAcOyxY1l0fWsKm/gzhnWKGNDbHnwbceZd/pZ/kJ+3nI7GfVmaA7CBiI6P/kN4L+D6hUp8wudlOTDu7cdYrxkXe4Fm3h7PwAs5dXcM6jajHWoMYi3rYKVNRSaShprp2xcsqDbz7Kvrd+y6/8KA9FN7LoC6CONfnsiej9+2+0ZHR2EEkTz9mZIaquzMHtr3H7xlNE77VxdXmAWlQgVYuXgAslVILNFSh1l9g2kOduOcd9L/2EkcmXeUq28f3oALO+I2gO1ZByBHAYdvy3rgkEXaMbhVJJuGPfJPf0Pc/OX05zfnWEE4P7OVHcxgXXQUpMPoaeIoy0O/bXphifOcWWi29wtao8Zj/A/7KbWSkGoKuEHWjtgsPkd/zIJ649a/JrSqV5qIhzsDlf4W8qr3Fk9RQbXYVGlGc+30Ut107BCD1uiXJjGZumVHyOY3aEJ9jLaemn5ixrQJcsegek1ShyJ0zb6De/05CBB9REna0NMNqq02YbLFjP5qjCmM6wO5lis6/QKTUQT01jLmkHb2s/f2Qj77ouVpxFfdZGm4Zbhw+HMY0zUVT/XGz93I+tFse8dhyi2XTWdaumdGqkwlnt5JzZzjNspY0GORLA4zHU1NJwJig8zc6NousMrz8lWTHGPJvL1V6NDrgTC7OF8XdV402obkClLcjdzPOW7g6HUhUhdUrNQ9XHVF3MqrekThEvmbjNJD6yllbT9EGWrHW/iqLkW2na81602H+Yon96WuzwschIiuGA+NgGzg1iZa1KmofMdc41o/Sy7rumxSynxgCWOE58HNf/NY5Wv5WmA1ODg8/zF8FY+ScIMgTQAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTA2VDE5OjAwOjM2KzA4OjAw2QIc1wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0wNlQxOTowMDozNiswODowMKhfpGsAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1MDI4NDM25q51/wAAABJ0RVh0VGh1bWI6OlNpemUANTg4NkJCu/KUxwAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1MTM2MTk4Mjc0XzYyX1swXYYyMz0AAAAASUVORK5CYII=`;
 
        var aImgBase64 = `
        data:image/png;base64,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Trq8tvNi6rODLJu7keEw4P61B1j+4iE+6/G5ZfV+Pj1cKCedqgpyo0eRqa8lVZUjVZEhlUvhZV3ctEKlHLyUxxX732L+oW38U5zJPlNXCsHYAkkRwmiICry8eS7vHJjNsvM3kjMbWfFKDwOBxXMVSqlSLe/oD2k/ZslUpknl0qQqM3hZDzft4noKNyVRacUZhUMs3bKKo77gKXkeQakQWUAj4+426VZMSL7P8tt1Szk+XMUdX3mMuc3tyHSW5nEVLF86galNaayFFz7Ks/toiOdKlCvxUgo3HQO7KYVKeTSFfdy1/j4mdmzjUTmP7XZcfFhGxOIw6rv3lXuBuCU7dKSBI4UmvjXnbc4fv5Pu4gS+ecl5fOPcUWzaX+B3b57gxV1FDBKlBI6SSOWglIOjHJyUZOJgF3e8dDfzP9nAc3ImD8qLKWpJ3ORGCQkjBK0vWNDlXtHGDaOTSrFk4U7uv/YRPGX4x0s3ss5cQ0dVI4ORg/IkSoq4Y3ckwhFIAdV6kK9+vJ4l/1nN2I7tPCfP5j4u47hJxckGXQKHAEHLMxYxEl62VKexAukqLrmgnbsnPc7MR7o4ICayecpFvHf2lZzI1aA9D0dKpImoMsNc2LGJ2TtfZdr+rfQELqu8C3gmms1Jo8AGCX8iICxZQmSmPdlTGLaNce9uTulYkvToKMa6AywZ2sI14btMHTiIdVxCx6GQrQOpSBdPkvKHsTriuKhknTONv9o57DD1WG3BhqW4L7sgIJPhiKg96+nlx4/rn8ULKIeIPbVXBOlKmuxRpqf6uEzvp+XEAar9kxhj8N0Mh1P1vGta2OHX0W5HEUYiBi6RTp9CPg2E1NS4fxTj5jzV1ttb/Evgc1aZCEktLllihKSA1AgDEh+BBhthrcAaiwlkHM4kwCWfn+Li5LbleWb36NEVP3IGewa6mye3fVIYDufpMGoo3fVMokDpgjpyM47FahPfLyKBjQw2iuL8bsPEgroUavEjSm/Pc3aPG5e5ubPz1+86Dz/+d55+ZFHnqic/2+TKMI/VrZFvcmgbbzhyRTenXFy0TcaJWF3udK3+EuDIWJDJOEerqpw/1VQ33N/R8Yv3zxh9Gf8Da0YxuA1sN9EAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMTk6MDE6NDUrMDg6MDAN7WRtAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDE5OjAxOjQ1KzA4OjAwfLDc0QAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MJCgPl4AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTBoD/7TAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMjg1MDVVSB2xAAAAEnRFWHRUaHVtYjo6U2l6ZQA1MzAyQkIOnyXlAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzY2Mjc5NDIzMDZfMTNfWzBdw0U41wAAAABJRU5ErkJggg==`;
 
        var qImgBase64 = `data:image/png;base64,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KghQ6RQLGgO+01NDKbT8fVcRm0kxr6WG+65u4YH1eY5OaApW4KcVMu1BxuOCyb1s7HuOj7w23tZ5iFzC1wZF07c34ZJeFWkGC3muPn8f6xb10Te4gjHbzpquWjpbc+wdKvD+0TJl4yOEYqag0ULhBz4v9BWZiUAGHl6gaK6M88NXfoY62c+P1fUcdw3gorgZOYtizh2bcCZWIM4wNRWwZ6CTG5fvYG37HvZPrORAsZF9Jy1jZYUVPlIoJA6UZKgg+eBoyEwk8HyJTKfIF0d54OVNXP7ZqzyevpTn3bJEj9mEMg2Kc+7YFHvhEvkTMXQyz8GJhdyy5k2u7XqP09O1nCgsxmazSOWhlEB6HiLwUL5C+goZZPEDwyUje7j/xYe5ZM8W/hj08Fu5jlAT9wNn42slQtD1DxeLMr58Y0I4kBkuW97Pbzb+lfnPDvPq7uv5ePHFfNZ1JcO5JqQSKCFwCupdiQuHdrKw/y2uffdZpiuap9Vq/mB6KOoyznhJHRniDhAhWPCEQ6pEBbozu3UgJF2tk3zv0FauKeyhvTTAYGM3Q1XnMJZrQIiAutIYzeVJOiaPcbrk+EjN5XfqIna6NkyYyNpZUBcBEVBBVC/729bpGbkeoc9EzaxEiUld+LAwdZqrpj7gmmCMtrED5IpT4KDiBwznmtlRaebt1Ll8WGlEa2Jh4dxZoPHdQkQuF20V9cufunl6uvwXrWVDHG1ywCWlb5OKNw4hHTXCEERTeFER5zTWCwhFiumSh7FRDDJLSu4sO8ROeL6ZrK1O36s+27rp4OvvjBcnp8KLrDbZL71zLhFnNp4oktmpoi1Fq5ghzYxLUzAe5cjijI7Tav8PUAgQEpD4gZxY1JX+xaOPXvGMKmSus5esyfXuPUS/r0pzy8WwHSsSYa/PGmncWUoxGeisTc6c5aQlAZqNVCKAmhrxVm1t48N3393yTN8n4+H/AIZ4QYH/d3pvAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTE2VDE3OjQ4OjI5KzA4OjAwPa6YJQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0xNlQxNzo0ODoyOSswODowMEzzIJkAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1ODg4MTA5/RRjigAAABJ0RVh0VGh1bWI6OlNpemUANTQ5NkJCxr4eowAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1MTE3MjE2NTg4Xzc0X1swXXTdtQ4AAAAASUVORK5CYII=`;
 
        var mImgBase64 = `data:image/png;base64,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`;
 
        var left = 0;
        var top = 100;
        var innerList = [];
        var outerList = [];
        var innerli = "";
        var innerli1 = "";
        var outerli = "";
        originalInterfaceList.forEach((item, index) => {
            if (item.type == "0") {
                outerList.push(item);
                innerList.push(item);
                outerli += "<li>" + item.name + "</li>";
            }
            if (item.type == "1") {
                innerList.push(item);
                innerli += "<li>" + item.name + "</li>";
            }
            if (item.type == "2") {
                innerList.push(item);
                innerli1 += "<li>" + item.name + "</li>";
            }
        });
        parseInterfaceList = innerList.concat(outerList);
        GMaddStyle(`#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; background-color:#2E9AFE; z-index:2147483647; font-size:20px; text-align:left;}
    #vip_movie_box .stitle {position: absolute;font-family: "楷体";right: 0;top: 110%;width: 1.3em;padding: 0px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 10px 10px 0;transform: translate3d(100%, -20%, 0); background: #f45a8d;}
    #vip_movie_box .item_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .item_text img {width:30px; height:30px; display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:rgba(255, 255, 255, 0.2); backdrop-filter:saturate(1) blur(15px); border:1px solid gray; overflow-y:auto;}
    #vip_movie_box .vip_mod_box_action li{font-size:14px; color:#DCDCDC; text-align:center; width:80px; line-height:27px; float:left; border:0px solid gray; padding:0 4px; margin:4px 2px; background:rgba(0,0,0,0.6);border-radius:8px; box-shadow:0 2px 8px 0 #00000014,inset 0 4px 10px 0 #00000024;}
    #vip_movie_box .vip_mod_box_action li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .selected_text {width:0px; padding:2px 0px; text-align:center;}
	#vip_movie_box .selected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_selected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:rgba(255, 255, 255, 0.2); backdrop-filter:saturate(1) blur(15px); border:1px solid gray; overflow-y:auto;}
    #vip_movie_box .vip_mod_box_selected ul{height:455px; overflow-y: scroll;}
    #vip_movie_box .vip_mod_box_selected li{font-size:18px; color:#DCDCDC; text-align:center; height:48px; width:48px; line-height:48px; float:left; border:0px solid gray; padding:0 4px; margin:4px 2px; background:rgba(0,0,0,0.6);border-radius:8px; box-shadow:0 2px 8px 0 #00000014,inset 0 4px 10px 0 #00000024; cursor:grab;}
    #vip_movie_box .vip_mod_box_selected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .qelected_text {width:0px; padding:2px 0px; text-align:center;}
	#vip_movie_box .qelected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_qelected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:#fff; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_qelected li{font-size:14px;text-align:center; width:150px; line-height:40px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_qelected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .belected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .belected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_belected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:rgba(255, 255, 255, 0.2); border:1px solid gray; backdrop-filter:saturate(1) blur(15px); overflow-y:0;}
    #vip_movie_box .vip_mod_box_belected li{ list-style-type:none; font-size:14px; color:#fff; text-align:center; width:100px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px; background:rgba(0,0,0,0.6);border-radius:8px; box-shadow:0 2px 8px 0 #00000014,inset 0 4px 10px 0 #00000024;}
    #vip_movie_box .vip_mod_box_belected ul{height:355px; overflow-y: scroll;}
    #vip_movie_box .vip_mod_box_belected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .aelected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .aelected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_aelected {display:none; position:absolute; left:30px; top:80px; text-align:center; background-color:rgba(255, 255, 255, 0.2); backdrop-filter:saturate(1) blur(15px); border:1px solid gray;}
    #vip_movie_box .vip_mod_box_aelected li{font-size:14px; color:#000; text-align:center; width:200px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 10px; background:rgba(0,0,0,0.6);border-radius:8px; box-shadow:0 2px 8px 0 #00000014,inset 0 4px 10px 0 #00000024;}
    #vip_movie_box .vip_mod_box_aelected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .melected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .melected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_melected {display:none; position:absolute; left:30px; top:0px; text-align:center; background-color:rgba(255, 255, 255, 0.2); backdrop-filter:saturate(1) blur(15px); border:1px solid gray;}
    #vip_movie_box .vip_mod_box_melected li{font-size:14px; color:#DCDCDC; text-align:center; width:80px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_melected li:hover{color:#FF4500;background:#00ff00}
    .add{background-color:#00ff00;}
    #Loadanimation{ background-color:#fff; height:100%; width:100%; position:fixed; z-index:1; margin-top:0px;top:0px;}
    #Loadanimation-center{ width:100%; height:100%; position:relative;}
    #Loadanimation-center-absolute{ position:absolute; left:50%; top:50%; height:200px; width:200px; margin-top:-100px; margin-left:-100px;}
    .xccx_object{ -moz-border-radius:50% 50% 50% 50%; -webkit-border-radius:50% 50% 50% 50%; border-radius:50% 50% 50% 50%; position:absolute; border-left:5px solid #87CEFA; border-right:5px solid #FFC0CB; border-top:5px solid transparent; border-bottom:5px solid transparent; -webkit-animation:animate 2.5s infinite; animation:animate 2.5s infinite;}
    #xccx_one{ left:75px; top:75px; width:50px; height:50px;}
    #xccx_two{ left:65px; top:65px; width:70px; height:70px; -webkit-animation-delay:0.1s; animation-delay:0.1s;}
    #xccx_three{ left:55px; top:55px; width:90px; height:90px; -webkit-animation-delay:0.2s;animation-delay:0.2s;}
    #xccx_four{ left:45px; top:45px; width:110px; height:110px; -webkit-animation-delay:0.3s;animation-delay:0.3s;}
    @-webkit-keyframes animate{
        50%{
        -ms-transform:rotate(180deg); 
        -webkit-transform:rotate(180deg); 
        transform:rotate(180deg);
        } 
        100%{   
            -ms-transform:rotate(0deg);
            -webkit-transform:rotate(0deg);
            transform:rotate(0deg);
        }
    }
    @keyframes animate{
        50%{
            -ms-transform:rotate(180deg);
            -webkit-transform:rotate(180deg);
            transform:rotate(180deg);
        }
        100%{
            -ms-transform:rotate(0deg);
            -webkit-transform:rotate(0deg);
            transform:rotate(0deg);
        }
    }`);
 
        $(function () {
            $("#vip_movie_box").mouseover(function () {
                $(".item_text").slideDown();
                $(".selected_text").slideDown();
                //$(".qelected_text").slideDown();
                $(".belected_text").slideDown();
                $(".aelected_text").slideDown();
                $(".melected_text").slideDown();
            });
        });
        $(function () {
            $("#vip_movie_box").click(function () {
                $(".item_text").hide();
                $(".selected_text").hide();
                $(".qelected_text").hide();
                $(".belected_text").hide();
                $(".aelected_text").hide();
                $(".melected_text").hide();
            });
        });
        $(function () {
            $("ul").on("click", "li", function () {
                $("ul li").removeClass("add");
                $(this).addClass("add");
            })
        });
 
        function selectedList(episodeList) {
            var selectedList = [];
            var innerli = "";
            if (!!episodeList && episodeList.length != 0) {
                episodeList.sort((d1, d2) => {
                    return d1.name - d2.name;
                });
                episodeList.forEach((item, index) => {
                    selectedList.push(item);
                    innerli += `<li title="${item.description}" >${item.name}</li>`;
                });
                $(".vip_mod_box_selected ul").empty();
                $(".vip_mod_box_selected ul").append(innerli);
 
                $(".selected_text").on("mouseover", () => {
                    $(".vip_mod_box_selected").show();
                });
                $(".selected_text").on("mouseout", () => {
                    $(".vip_mod_box_selected").hide();
                });
                $(".vip_mod_box_selected li").each((index, item) => {
                    item.addEventListener("click",  () => {
                        if(oldItem){
                            oldItem.style.color='';
                        }
                        item.style.color='#2E9AFE';
                        oldItem = item;
                        if (document.getElementById("iframe-player") == null) {
                            var player = $(node);
                            //await reomveVideo();
                            player.empty();
                            player.append(videoPlayer);
                        }
                        //选集自动解析
                        let num = "";
                        if (host == "www.bilibili.com") {
                            num = 0;
                        } else {
                            num = Math.floor(Math.random());
                        }
                        if( localStorage.getItem('selectedPlayerValue_') != null){
                            num = localStorage.getItem('selectedPlayerValue_');
                        }
                        innerParse(parseInterfaceList[num].url + selectedList[index].href);
                    });
                });
            }
        }
 
        var html = $(`
    <!--<link rel="dns-prefetch" href="//netease-music.fe-mm.com">
    <link rel="prerender" crossorigin href="https://netease-music.fe-mm.com">
    <link rel="preload" crossorigin href="https://netease-music.fe-mm.com">
    <link rel='preconnect' crossorigin href='https://netease-music.fe-mm.com'>
    -->
    <div id='vip_movie_box'>
    <div class="stitle"><ul id="m">解析</ul></div>
    <div class='item_text' >
        <img src='` + ImgBase64 + `' title='视频解析'/>
        <div class='vip_mod_box_action' >
            <div style='display:flex;'>
                <div style='width:295px; max-height:450px; margin-bottom:10px;'>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>全网VIP视频解析</div>
                    <ul style='margin:0 5px;'>
` + innerli + `
 
                        <div style='clear:both;'></div>
                    </ul>
                    <ul style='margin:0 5px;'>
` + outerli + `
 
                        <div style='clear:both;'></div>
                    </ul>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>B站大会员番剧解析(专用线路)</div>
                    <ul style='margin:0 5px;'>
` + innerli1 + `
 
                        <div style='clear:both;'></div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class='selected_text' style='display:;'>
        <img src='` + sImgBase64 + `' title='视频选集'/>
        <div class='vip_mod_box_selected' >
            <div style='display:flex;'>
                <div style='width:295px; padding:10px 0;'>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>电视剧选集</div>
                    <ul style='margin:0 13px;'></ul>
                </div>
            </div>
        </div>
    </div>
 <div class='melected_text'>
        <img src='` + mImgBase64 + `' title='听音乐'/>
        <div class='vip_mod_box_melected' >
            <div style='display:flex;'>
                <div style='width:auto; padding:10px 0;'>
                    <div style='font-size:12px;color:#40FF00; line-height:21px;'>偶尔慵懒的听着音乐，喝一杯咖啡，享受午后的阳光</div>
                    <hr>
                    <div style='font-size:15px; text-align:center; line-height:10px;'>&nbsp;</div>

                    <div id="Loadanimation" style="z-index:999999;">
                        <div id="Loadanimation-center">
                            <div id="Loadanimation-center-absolute">
                                <div class="xccx_object" id="xccx_four"></div>
                                <div class="xccx_object" id="xccx_three"></div>
                                <div class="xccx_object" id="xccx_two"></div>
                                <div class="xccx_object" id="xccx_one"></div>
                            </div>
                        </div>
                    </div>

                    <ul>
                     <iFrame id="iframe-audio" src="" width="320" height="500" frameborder=0 scrolling="no"></iFrame>
                    </ul>
                      <!--<ul>
                     <a style='font-size:12px;color:#2EFEF7; line-height:21px;'>双击歌曲名字播放，如果没有播放请稍等一会，大概2-3秒就缓存完毕，不要连续点击，服务器小，小主手下留情
                    </ul>-->
                </div>
             </div>
         </div>
    </div>
    <div class='qelected_text' style='display:none;'>
        <img src='` + qImgBase64 + `' title='优惠券'/>
        <div class='vip_mod_box_qelected' >
            <div style='display:flex;'>
                <div style='width:330px; padding:10px 0;'>
                    <div style='font-size:28px; text-align:center; color:#F78181; line-height:21px;'> <p><a href="https://www.zuihuitao.cn" target="new">优惠券查询</a></p></div>
                    <div style='font-size:15px; text-align:center; line-height:21px;'>&nbsp;</div>
                    <hr>
                    <div style='font-size:12px;color:#088A85; line-height:21px;'>注：我们只提供好的优惠券查询网址。</div>
                    <hr>
                    <div style='font-size:15px; text-align:center; line-height:10px;'>&nbsp;</div>
                    <ul>
                        <li>
                           <p><a href="https://www.zuihuitao.cn" target="new">淘宝天猫优惠券</a></p>
                        </li>
                    </ul>
                     <ul>
                        <li>
                             <p><a href="https://zuihuitao.top/vip/index.html" target="new">关于脚本</a></p>
                        </li>
                    </ul>
                </div>
             </div>
         </div>
    </div>
    <div class='belected_text' style=''>
        <img src='` + bImgBase64 + `' title='直播电视'/>
        <div class='vip_mod_box_belected' >
            <div style='display:flex;'>
                <div style='width:360px; max-height:428px; margin-bottom:10px;'>
                   <div style='font-size:20px; text-align:center; color:#DF0174; padding:5px 0px;'>电视节目观看</div>
                   <div style='font-size:11px; text-align:center; color:#fff; padding:5px 0px;'>使用说明：进入电视频道如果一直转圈，先点一下暂停，再点播放，就可以正常观看了。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <ul style="margin:0 0px;">
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://n24-cdn-live.ntv.co.jp/ch01/index_high.m3u8">日本全天新闻</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://jpts.sinovision.net/livestream.m3u8">美国中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://movie.mcas.jp/mcas/mx1_2/master.m3u8">日本Tokyo</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://movie.mcas.jp/mcas/smil:wn1.smil/master.m3u8">日本气象</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index_4M.m3u8">日本NHKworld</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://ebsonairios.ebs.co.kr/groundwavefamilypc/familypc1m/chunklist.m3u8">韩国EBS1</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://fhs8037.bd-61.ktcdn.co.kr/mtnlive/_definst_/720/chunklist_w1038526770.m3u8">韩国新闻MTN</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://58.234.158.60:1935/catvlive/myStream/chunklist_w1609082033.m3u8">韩国TBS</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.222.207.80:1935/live/cjbtv/chunklist_w394587109.m3u8">韩国CJB</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://in.getclicky.com/in.php?site_id=101420445&type=ping&res=1549x872&lang=zh-CN&tz=Asia%2FShanghai&tc=&ck=0&mime=js&x=0.6584599927109089">韩国太妍03</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://tv6.blcu.edu.cn/liverespath/c940a4bb57b88b3280c6da07f85649fc69629230/3a31be87ad-0-0-ddeb3cb91d9827471933e1c139694276/index.m3u8">河南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://1.245.74.5:1935/live/tv/.m3u8">韩国TJB综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://119.77.96.184:1935/chn21/chn21/playlist.m3u8">韩国中央</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=http://brics.bonus-tv.ru/cdn/brics/chinese/tracks-v1a1/index.m3u8">俄罗斯中文</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://m3u8.waahah.xyz/?waahah=https://php.17186.eu.org/phtv/fhhk.m3u8">凤凰香港</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600001859">CCTV-1综合</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv2/">CCTV-2财经</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv3/">CCTV-3综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600001814">CCTV-4国际</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctveurope/index.shtml">CCTV-4欧洲</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctvamerica/">CCTV-4美洲</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv5/">CCTV-5体育</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv5/">CCTV-5+赛事</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.1905.com/cctv6/live/">CCTV-6电影</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv7/">CCTV-7军事</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600001803">CCTV-8电视剧</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctvjilu/">CCTV-9纪录</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv10/">CCTV-10科教</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv11/">CCTV-11戏曲</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv12/">CCTV-12社会</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600001811">CCTV-13新闻</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctvchild/">CCTV-14少儿</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv15/">CCTV-15音乐</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv16/">CCTV-16奥体</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://tv.cctv.com/live/cctv17/">CCTV-17农业</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600014550">CGTN</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002525">河南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002309">北京卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002483">东方卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv2">北京文艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv3">北京科教</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv4">北京影视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv5">北京财经</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv7">北京生活</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv8">北京青年</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv9">北京新闻</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv10">北京卡酷少儿</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv11">北京冬奥纪实</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002520">浙江卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002475">湖南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002521">江苏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002481">深圳卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002532">安徽卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxtv">陕西卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jltv">吉林卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002485">广东卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002513">山东卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002508">湖北卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002493">河北卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xztv">西藏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nmtv">内蒙古卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=qhtv">青海卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002516">四川卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=tjtv">天津卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxrtv">山西卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002505">辽宁卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xmtv">厦门卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xjtv">新疆卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002498">黑龙江卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=yntv">云南卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002503">江西卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002484">福建东南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002490">贵州卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nxtv">宁夏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gstv">甘肃卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002531">重庆卫视</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=bttv">兵团卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ybtv">延边卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sstv">三沙卫视</a></li>
                        -->
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.yangshipin.cn/tv/home?pid=600002506">海南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://livechina.cctv.com/">实景直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://jx.nnxv.cn/zbo/b.php">直播中国</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://live.bilibili.com/">B站直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://live.kuaishou.com/">快手直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://live.douyin.com/">抖音直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.huya.com/l">虎牙直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.douyu.com/directory/all">斗鱼直播</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="https://www.miguvideo.com/">体育赛事</a></li>
                        <!--
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdetv">山东教育</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv1">CETV-1</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv3">CETV-3</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv4">CETV-4</a></li>
                        -->
					</ul>
                </div>
            </div>
        </div>
    </div>
    <div class='aelected_text'>
        <img src='` + aImgBase64 + `' title='实用工具'/>
        <div class='vip_mod_box_aelected' >
            <div style='display:flex;'>
                <div style='width:230px; padding:10px 0;'>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>实用工具</div>
                    <!--<ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://greasyfork.org/zh-CN/scripts/422277-%E6%97%A0%E5%B7%AE%E5%88%AB%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7" target="_blank">无差别视频提取工具</a>
                        </li>
                    </ul>-->
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://www.yym4.com/" target="_blank">音乐下载</a><!--https://www.musicjx.com-->
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://duanju.waahah.xyz" target="_blank">短剧搜索</a>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://maple3142.github.io/mergemp4/" target="_blank">视频合成工具</a>
                        </li>
                    </ul>
                </div>
            </div>
      </div>
</div>`);
 
        $("body").append(html);
        $(".item_text").on("mouseover", () => {
            $(".vip_mod_box_action").show();
        });
        $(".item_text").on("mouseout", () => {
            $(".vip_mod_box_action").hide();
        });
 
        $(".selected_text").on("mouseover", () => {
            $(".vip_mod_box_selected").show();
        });
        $(".selected_text").on("mouseout", () => {
            $(".vip_mod_box_selected").hide();
        });
 
        $(".belected_text").on("mouseover", () => {
            $(".vip_mod_box_belected").show();
        });
        $(".belected_text").on("mouseout", () => {
            $(".vip_mod_box_belected").hide();
        });
 
        $(".aelected_text").on("mouseover", () => {
            $(".vip_mod_box_aelected").show();
        });
        $(".aelected_text").on("mouseout", () => {
            $(".vip_mod_box_aelected").hide();
        });
        $(".qelected_text").on("mouseover", () => {
            $(".vip_mod_box_qelected").show();
        });
        $(".qelected_text").on("mouseout", () => {
            $(".vip_mod_box_qelected").hide();
        });
        $(".melected_text").on("mouseover", () => {
            let atrrSrc = document.querySelector("#iframe-audio").getAttribute("src");
            if(!atrrSrc){
                document.querySelector("#iframe-audio").setAttribute("src","https://netease-music.fe-mm.com/#/music/playlist");
            }
            $(".vip_mod_box_melected").show();
            //加载动画
            $("#Loadanimation").fadeOut(1000);
        });
        $(".melected_text").on("mouseout", () => {
            $(".vip_mod_box_melected").hide();
        });
 
        $(".vip_mod_box_action li").each((index, item) => {
            item.addEventListener("click", () => {
                if (parseInterfaceList[index].type == "1" || parseInterfaceList[index].type == "2") {
                    localStorage.setItem("selectedPlayerValue_", index);
                    if (document.getElementById("iframe-player") == null) {
                        var player = $(node);
                        //reomveVideo();
                        player.empty();
                        player.append(videoPlayer);
                    }
                    innerParse(parseInterfaceList[index].url + location.href);
                }
                if (parseInterfaceList[index].type == "0") {
                    try{
                        GMopenInTab(parseInterfaceList[index].url + location.href, false);
                    }catch(e){
                        console.log(e);
                        window.open(parseInterfaceList[index].url + location.href, "_blank");
                    }
                }
            });
        });
        document.getElementsByClassName('item_text')[0].addEventListener("click", () => {
            var play_jx_url = window.location.href;
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
                mobile_html += "<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
                mobile_html += "<div><iframe src='https://tv.wandhi.com/go.html?url=" + play_jx_url + "' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
                mobile_html += "</div>";
                $("body").html(mobile_html);
            } else { }
        });
        (function () {
            $("body").append("");
            setTimeout(function () {
                $("#loading").remove();
                $("#bilibili-player-wrap").after('<div class="bottom-page paging-box-big"><span class="current" style="background: #f45a8d;" id="go">站外下载视频</span><span>免责声明：请通过合法渠道购买VIP下载大会员内容,插件仅对网页布局进行修改，不含任何漏洞利用，入侵，绕过等方式实现的功能</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因使用插件造成任何后果的，插件作者不承担任何责任。</span></div>');
                $("#go").click(function () {
                    var aaa = $(".mediainfo_mediaTitle__lu7u_").attr("title");
                    var bbb = aaa.replace(/\s/g, "");
                    var tempwindow = window.open("_blank");
                    tempwindow.location = "https://www.wxtv.net/vodsearch/-------------.html?wd=" + bbb
                })
            }, 4000)
        })();

        if (typeof unsafeWindow == "undefined") {
            
            globalThis.unsafeWindow = window;
        }

        switch (host) {
            case 'www.iqiyi.com':
                //--------------------------------------------------------------------------------
                try{
                    var num = 0;
                    unsafeWindow.rate = 0;
                    unsafeWindow.Date.now = () => {
                        return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
                    }
                    setInterval(() => {
                        unsafeWindow.rate = 0;
                    }, 600000);
                }catch(e){
                    console.log(e);
                }
                
                //--------------------------------------------------------------------------------
                document.getElementsByTagName('video')[0].playbackRate = 16;
                document.getElementsByTagName('video')[0].currentTime = 1000;

                //--------------------------------------------------------------------------------
                setTimeout(() => {
                    const jujiList = document.querySelectorAll('[class^=episodesNew_episodeContent]');
                    for (const obj of jujiList) {
                        obj.addEventListener('click', () => {
                            console.log("%c%s",
                                "color: red; background: yellow; font-size: 24px;", "切换集数！");
                            setTimeout(urlChangeReload, 500);
                            
                        });
                    }

                }, 2000);
                
                //--------------------------------------------------------------------------------
                const iqiyiDisplayNodes = ["#vipCoverBack", `[class^=covers_cloudCover]`, "#vipCoversBox", "#playerPopup", "div[class^=qy-header-login-pop]", "section[class^=modal-cover_]", ".toast"];
                setInterval(() => {
                    $('div[style*="top: 74px"]').attr("id", "absolute");
                    $("#absolute").css("zIndex", 0);
                    iqiyiDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 500);
 
                /*setTimeout(() => {
                    var episodeList = [];
                    var i71playpagesdramalist = $("div[is='i71-play-ab']");
                    if (i71playpagesdramalist.length != 0) {
                        var data = i71playpagesdramalist.attr(":page-info");
                        if (!!data) {
                            var dataJson = JSON.parse(data);
                            var albumId = dataJson.albumId;
                            var barlis = $(".qy-episode-tab").find(".bar-li");
                            var barTotal = barlis.length;
                            if (barTotal == 0) {
                                barTotal = 1;
                            }
                            for (var page = 1; page <= barTotal; page++) {
                                GMxmlhttpRequest({
                                    url: "https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=" + albumId + "&page=" + page + "&size=30",
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onload: response => {
                                        var status = response.status;
                                        if (status == 200 || status == '200') {
                                            var serverResponseJson = JSON.parse(response.responseText);
                                            var code = serverResponseJson.code;
                                            if (code == "A00000") {
                                                var serverEpsodelist = serverResponseJson.data.epsodelist;
                                                //console.log(serverEpsodelist)
                                                for (var i = 0; i < serverEpsodelist.length; i++) {
                                                    var name = serverEpsodelist[i].order;
                                                    var href = serverEpsodelist[i].playUrl;
                                                    var description = serverEpsodelist[i].subtitle;
                                                    episodeList.push({
                                                        "name": name,
                                                        "href": href,
                                                        "description": description
                                                    });
                                                    //mylog({"name":name, "href":href, "description":description});
                                                }
                                                selectedList(episodeList);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, 2000);*/

                setTimeout(() => {
                    let episodeList = [];
                    let albumId = unsafeWindow.QiyiPlayerProphetData.videoInfo.albumId;
                    const base_url = `https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=${albumId}&page=1&size=999`;
                    const xhttp = new XMLHttpRequest();
                    xhttp.open("GET", base_url);
                    xhttp.send(null);
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log('success');
                            let serverResponseJson = xhttp.responseText;
                            console.log("%c%s",
                                "color: red; background: yellow; font-size: 64px;",xhttp.responseText);
                            serverResponseJson = JSON.parse(serverResponseJson);
                            var code = serverResponseJson.code;
                            if (code == "A00000") {
                                var serverEpsodelist = serverResponseJson.data.epsodelist;
                                //console.log(serverEpsodelist)
                                for (var i = 0; i < serverEpsodelist.length; i++) {
                                    var name = serverEpsodelist[i].order;
                                    var href = serverEpsodelist[i].playUrl;
                                    var description = serverEpsodelist[i].subtitle;
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": description
                                    });
                                    //mylog({"name":name, "href":href, "description":description});
                                }
                                selectedList(episodeList);
                            }
                            console.log(unsafeWindow.QiyiPlayerProphetData);
                            console.log(window);
                            /*document.querySelectorAll(".vip_mod_box_selected ul li").forEach((item, index) => {
                                item.style.height = "48px";
                                item.style.width = "48px";
                                item.style.lineHeight = "48px";
                            });*/
                        } 
                    }
                }, 1900);

                //--------------------------------------------------------------------------------
                //短剧处理
                setInterval(() => {
                    if(location.search.search("playertype=short") !== -1 || document.querySelector("#shortVideoFeed")){
                        //方式一
                        //node = "#feedPlayerBox";
                        //document.querySelector("#shortVideoFeed > div").style.display = "flex";
                        //方式二
                        location.replace(location.pathname);
                    }
                }, 1000)

                break
            case 'v.qq.com':
                //--------------------------------------------------------------------------------
                var num = 0;
                var qqTimer = setInterval(() => {
                    try {
                        $(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
                        $(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
                        //$(".txp_ad").find("txpdiv").find("video")[0].playbackRate = 4;
                        //$(".txp_ad").find("txpdiv").find("video")[1].playbackRate = 4;
                    }
                    catch (e) {
                        //console.log(e);
                        num += 1
                        if (num > 100) {
                            //视频中间的广告
                            //clearInterval(qqTimer); // 清除定时器
                            num = 0;
                        }
                    }
                }, 1500);
                //--------------------------------------------------------------------------------

                // 保存原始的console.clear函数
                const originalClear = console.clear.bind(console);
                // 覆盖console.clear方法
                console.clear = function() {
                    // 可以在这里添加额外的逻辑，例如警告或者记录日志
                    console.warn('Console clear has been disabled.');
                    // 不调用原始的clear函数，从而不执行清除操作
                };

                // 测试console.clear
                /*console.log('This is a test message.');
                console.clear(); // 这将显示警告，而不是清除控制台*/
                // 如果需要时还原console.clear
                function restoreConsoleClear() {
                    console.clear = originalClear;
                }

                //--------------------------------------------------------------------------------
                setTimeout(() => {
                    const jujiList = document.getElementsByClassName('playlist-rect__container');
                    for (const juji of jujiList) {
                        juji.addEventListener('click', () => {
                            console.log("%c%s",
                                "color: red; background: yellow; font-size: 44px;", "切换集数！");
                            setTimeout(urlChangeReload, 500);
                        })
                    }
                }, 1000)
                //--------------------------------------------------------------------------------
 
                setInterval(() => {
                    var txp_btn_volume = $(".txp_btn_volume");
                    if (txp_btn_volume.attr("data-status") === "mute") {
                        $(".txp_popup_volume").css("display", "block");
                        txp_btn_volume.click();
                        $(".txp_popup_volume").css("display", "none");
                    }
                    //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
                    $(".mod_vip_popup").css("display", "none");
                    $(".panel-tip-pay").css("display", "none");
                    $("#mask_layer").css("display", "none");
                    $(".tvip_layer").css("display", "none");
                }, 500);
                /*window.onload = setTimeout(() => {
                    var episodeList = [];
                    try{
                        var COVER_INFO = unsafeWindow.COVER_INFO;
                        var VIDEO_INFO = unsafeWindow.VIDEO_INFO;
                        var barTotal = COVER_INFO.nomal_ids.length;
                        for (var page = 1; page <= barTotal; page++) {
                            var i = page - 1
                            if (VIDEO_INFO.type_name == "动漫" || VIDEO_INFO.type_name == "电视剧" || VIDEO_INFO.type_name == "电影") {
                                var F = COVER_INFO.nomal_ids[i].F;
                                if (F != "0" && F != "4") {
                                    var V = COVER_INFO.nomal_ids[i].V;
                                    var cover_id = COVER_INFO.cover_id;
                                    var name = COVER_INFO.nomal_ids[i].E;
                                    var href = "https://v.qq.com/x/cover/" + cover_id + "/" + V + ".html";
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": ""
                                    });
                                    //mylog({"name":name, "href":href, "description":""});
                                }
                            }
                        }
                        selectedList(episodeList);
                    }catch(e){
                        console.log(e);
                    }
                    
                }, 2000);*/

                window.onload = setTimeout(() => {
                    let episodeList = [];
                    try{
                        const COVER_INFO = unsafeWindow.COVER_INFO;
                        const VIDEO_INFO = unsafeWindow.VIDEO_INFO;
                        let barTotal = COVER_INFO.video_ids.length;
                        //let ct = 0;
                        for (let page = 1; page <= barTotal; page++) {
                            let i = page - 1
                            if (VIDEO_INFO.type_name == "动漫" || VIDEO_INFO.type_name == "电视剧" || VIDEO_INFO.type_name == "电影" || true) {
                                let F = COVER_INFO.type;
                                if (F != "0" && F != "4") {
                                    let vid = COVER_INFO.video_ids[i];
                                    let cover_id = COVER_INFO.cover_id;
                                    /*if(page % 30 == 0){
                                        if(ct < document.querySelectorAll('.b-tag.playlist-page-select__item').length){
                                            ct++;
                                            document.querySelectorAll('.b-tag.playlist-page-select__item')[ct].click(); 
                                        }
                                            
                                    }*/
                                    let name = page;//document.querySelectorAll(`div.playlist-item-rect__container.absolute-fill[data-cid=${cover_id}]`)[i].innerHTML;
                                    let href = `https://v.qq.com/x/cover/${cover_id}/${vid}.html`;
                                    let description = '';
                                    if(page == Number(VIDEO_INFO.episode)){
                                        description = VIDEO_INFO.second_title; //当前播放的剧集
                                    }
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": description
                                    });
                                    //mylog({"name":name, "href":href, "description":""});
                                }
                            }
                        }
                        selectedList(episodeList);
                        
                        document.querySelectorAll(".vip_mod_box_selected ul li").forEach((item, index) => {
                            item.style.position = "relative";
                        });

                    }catch(e){
                        console.log(e);
                    }
                    
                }, 2000);
                break
            case 'v.youku.com':
 
                var youkuTimer = setInterval(() => {
                    if (!document.querySelectorAll('video')[1]) {
                        console.log('已跳过广告！')
                        setTimeout(() => {
                            clearInterval(youkuTimer); // 清除定时器
                        }, 5000)
                    }
                    else {
                        document.querySelectorAll('video')[1].playbackRate = 16;
                        document.getElementsByTagName('video')[1].currentTime=1000;
                    }
                }, 1000)

                const execute = () => youkuTimer;

                window.addEventListener('load', execute);
                //--------------------------------------------------------------------------------
                setTimeout(() => {
                    document.getElementsByClassName('new-box-anthology-items')[0].addEventListener('click', () => {
                        setTimeout(urlChangeReload, 500);
                    })
                },1000);
 
                //--------------------------------------------------------------------------------
                const youkuDisplayNodes = ["#iframaWrapper", "#checkout_counter_mask", "#checkout_counter_popup"];
                setInterval(() => {
                    var H5 = $(".h5-ext-layer").find("div")
                    if (H5.length != 0) {
                        $(".h5-ext-layer div").remove();
                        var control_btn_play = $(".control-left-grid .control-play-icon");
                        if (control_btn_play.attr("data-tip") === "播放") {
                            $(".h5player-dashboard").css("display", "block");
                            control_btn_play.click();
                            $(".h5player-dashboard").css("display", "none");
                        }
                    }
                    $(".information-tips").css("display", "none");
                    youkuDisplayNodes.forEach(item => {
                        $(item).css("display", "none");
                    })
                }, 500);
                /*window.onload = setTimeout(() => {
                    var Num;
                    var episodeList = [];
                    try{
                        var videoCategory = unsafeWindow.__INITIAL_DATA__.data.data.data.extra.videoCategory;
                        if (videoCategory == "动漫" || videoCategory == "电影" || videoCategory == "少儿") {
                            Num = 1;
                        } else if (videoCategory == "电视剧" || videoCategory == "综艺") {
                            Num = 2;
                        }
                    }catch(e){
                        console.log(e);
                    }
                    
                    if (!!Num) {
                        try{
                            var data = unsafeWindow.__INITIAL_DATA__.data.model.detail.data.nodes[0].nodes[Num];
                            var barTotal = data.nodes.length;
                            for (var page = 1; page <= barTotal; page++) {
                                var i = page - 1
                                if (data.nodes[i].data.videoType == "正片") {
                                    if (videoCategory == "综艺" || videoCategory == "少儿") {
                                        var name = i + 1;
                                    } else {
                                        name = data.nodes[i].data.stage;
                                    }
                                    var vid = data.nodes[i].data.action.value;
                                    var title = data.nodes[i].data.title;
                                    var href = "https://v.youku.com/v_show/id_" + vid + ".html";
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": title
                                    });
                                    //mylog({"name":name, "href":href, "description":title});
                                }
                            }
                            selectedList(episodeList);
                        }catch(e){
                            console.log(e);
                        }
                        
                    }
                }, 2000);*/

                window.onload = setTimeout(() => {
                    let Num;
                    let episodeList = [];
                    let videoCategory = {};
                    try{
                        videoCategory = unsafeWindow.__INITIAL_DATA__.data.data.data.extra.videoCategory;
                        if (videoCategory == "待定") {
                            Num = 1;
                        } else if (videoCategory == "电视剧" || videoCategory == "电影" || videoCategory == "动漫" || videoCategory == "少儿" || videoCategory == "纪录片" || videoCategory == "文化"){
                            Num = 3;
                        } else if ( videoCategory == "电视剧" || videoCategory == "综艺" ) {
                            Num = 4;
                        }else {
                            Num = 2;
                        }
                    }catch(e){
                        console.log(e);
                    }
                    
                    if (!!Num) {
                        try{
                            var data = unsafeWindow.__INITIAL_DATA__.data.model.detail.data.nodes[0].nodes[Num];
                            var barTotal = data.nodes.length;
                            for (var page = 1; page <= barTotal; page++) {
                                var i = page - 1
                                if (data.nodes[i].data.videoType == "正片") {//去除预告片
                                    if (videoCategory == "综艺" || videoCategory == "少儿") {
                                        var name = i + 1;
                                    } else {
                                        name = data.nodes[i].data.stage;
                                    }
                                    var vid = data.nodes[i].data.action.value;
                                    var title = data.nodes[i].data.title;
                                    var href = "https://v.youku.com/v_show/id_" + vid + ".html";
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": title
                                    });
                                    //mylog({"name":name, "href":href, "description":title});
                                }
                            }
                            selectedList(episodeList);

                        }catch(e){
                            console.log(e);
                        }
                        
                    }
                }, 2000);
                break
            case 'www.mgtv.com':
 
                var mgtvnum = 0;
                var mgtvTimer = setInterval(() => {
                    try {
                        //document.getElementsByTagName('video')[0].playbackRate = 16;
                        document.getElementsByTagName('video')[1].playbackRate = 16;
                        //document.getElementsByTagName('video')[1].currentTime = 1000;
                    }
                    catch (e) {
                        console.log(e);
                        mgtvnum += 1
                        if (mgtvnum > 20) {
                            //clearInterval(mgtvTimer); // 清除定时器
                        }
                    }
                }, 1000)

                const executemgtv = () => mgtvTimer;

                window.addEventListener('load', executemgtv);
                //--------------------------------------------------------------------------------
                setTimeout(() => {
                    const node = document.getElementsByClassName('episode-items clearfix');
                    if(node.length){
                        node[0].addEventListener('click', () => {
                            setTimeout(urlChangeReload, 500);
                        });
                    }
                    
                },2000);
 
                //--------------------------------------------------------------------------------
                /*setTimeout(() => {
                    var episodeList = [];
                    var str = location.href;
                    var index = str.lastIndexOf("\/"); //斜杠 分割
                    str = str.substring(index + 1, str.length);
                    index = str.lastIndexOf(".html");
                    var albumId = str.substring(0, index);
                    //mylog(albumId)
                    var barlis = $(".episode-header").find("a");
                    var barTotal = barlis.length;
                    if (barTotal == 0) {
                        barTotal = 1;
                    }
                    for (var page = 1; page <= barTotal; page++) {
                        GMxmlhttpRequest({
                            url: "https://pcweb.api.mgtv.com/episode/list?_support=10000000&video_id=" + albumId + "&page=" + page + "&size=30",
                            method: "GET",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload: response => {
                                var status = response.status;
                                if (status == 200 || status == '200') {
                                    var serverResponseJson = JSON.parse(response.responseText);
                                    var code = serverResponseJson.code;
                                    if (code == "200") {
                                        var serverEpsodelist = serverResponseJson.data.list;
                                        //mylog(serverEpsodelist)
                                        for (var i = 0; i < serverEpsodelist.length; i++) {
                                            var font = serverEpsodelist[i].corner[0].font;
                                            if (font != "预告") {
                                                var name = serverEpsodelist[i].t1;
                                                var href = serverEpsodelist[i].url;
                                                href = "https://www.mgtv.com" + href;
                                                var description = serverEpsodelist[i].t2;
                                                episodeList.push({
                                                    "name": name,
                                                    "href": href,
                                                    "description": description
                                                });
                                                //mylog({"name":name, "href":href, "description":description});
                                            }
                                        }
                                        selectedList(episodeList);
                                    }
                                }
                            }
                        });
                    }
                }, 2000);*/

                window.onload = setTimeout(() => {
                    let episodeList = [];
                    var str = location.href;
                    var index = str.lastIndexOf("\/"); //斜杠 分割
                    str = str.substring(index + 1, str.length);
                    index = str.lastIndexOf(".html");
                    var albumId = str.substring(0, index);
                    //mylog(albumId)
                    var barlis = $(".episode-header").find("a");
                    var barTotal = barlis.length;
                    //let count = 1;
                    let requestsCompleted = 0;
                    if (barTotal == 0) {
                        barTotal = 1;
                    }
                    for(let page = 1; page <= 1; page++){
                        var xhr = new XMLHttpRequest();
                        var url = `https://pcweb.api.mgtv.com/episode/list?_support=10000000&video_id=${albumId}&page=${page}&size=999`;

                        xhr.open("GET", url, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.send();

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                var status = xhr.status;
                                if (status == 200) {
                                    var serverResponseJson = JSON.parse(xhr.responseText);
                                    var code = serverResponseJson.code;
                                    if (code == "200") {
                                        var serverEpsodelist = serverResponseJson.data.list;
                                        for (var i = 0; i < serverEpsodelist.length; i++) {
                                            try {
                                                var font = serverEpsodelist[i].corner[0].font;
                                            } catch (e) {
                                                console.log(e);
                                                font = "";
                                            }
                                            if (font != "预") {
                                                var name = serverEpsodelist[i].t1;
                                                var href = serverEpsodelist[i].url;
                                                href = "https://www.mgtv.com" + href;
                                                var description = serverEpsodelist[i].t2;
                                                episodeList.push({
                                                    "name": name,
                                                    "href": href,
                                                    "description": description
                                                });
                                            
                                            }
                                            //
                                            
                                        }
                                    }
                                }
                                //requestsCompleted++;
                                // 检查是否所有请求都完成
                                //if (requestsCompleted === barTotal) {
                                    selectedList(episodeList);
                                    //
                                //}
                            }
                        };
                    }
                    
                }, 2000);
                break
            case 'tv.sohu.com':
                var sohunum = 0;
                var sohuTimer = setInterval(() => {
                    try {
                        //$("#player").find("video")[1].playbackRate = 16;
                        $("#player").find("video")[1].currentTime = 1000;
                    }
                    catch (e) {
                        console.log(e);
                        sohunum += 1;
                        if (sohunum > 20) {
                            clearInterval(sohuTimer); // 清除定时器
                        }
                    }
                }, 1000);
                //--------------------------------------------------------------------------------
                setTimeout(() => {
                    document.getElementsByClassName('series-tab_pane')[0].addEventListener('click', () => {
                        setTimeout(urlChangeReload, 500);
                    })
                }, 1000)
                //--------------------------------------------------------------------------------
                /*window.onload = setTimeout(() => {
                    var episodeList = [];
                    var albumId = unsafeWindow.playlistId;
                    var barTotal = 1;
                    for (var page = 1; page <= barTotal; page++) {
                        GMxmlhttpRequest({
                            url: "https://pl.hd.sohu.com/videolist?playlistid=" + albumId + "&pagenum=1&pagesize=999",
                            method: "GET",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload: response => {
                                var status = response.status;
                                if (status == 200 || status == '200') {
                                    var serverResponseJson = JSON.parse(response.responseText);
                                    var serverEpsodelist = serverResponseJson.videos;
                                    for (var i = 0; i < serverEpsodelist.length; i++) {
                                        var name = serverEpsodelist[i].order;
                                        var href = serverEpsodelist[i].pageUrl;
                                        var description = serverEpsodelist[i].name;
                                        episodeList.push({
                                            "name": name,
                                            "href": href,
                                            "description": description
                                        });
                                        //mylog({"name":name, "href":href, "description":description});
                                    }
                                    selectedList(episodeList);
                                }
                            }
                        });
                    }
                }, 2000);*/

                window.onload = setTimeout(() => {
                    var episodeList = [];
                    var albumId = unsafeWindow.playlistId; 
                    var barTotal = 1;

                    for (var page = 1; page <= barTotal; page++) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "https://pl.hd.sohu.com/videolist?playlistid=" + albumId + "&pagenum=1&pagesize=999", true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) { // 请求完成
                                if (xhr.status === 200) { // 请求成功
                                    var serverResponseJson = JSON.parse(xhr.responseText);
                                    var serverEpsodelist = serverResponseJson.videos;
                                    for (let i = 0; i < serverEpsodelist.length; i++) {
                                        let name = serverEpsodelist[i].order;
                                        let href = serverEpsodelist[i].pageUrl;
                                        let description = serverEpsodelist[i].subName;                                        ;
                                        episodeList.push({
                                            "name": name,
                                            "href": href,
                                            "description": description
                                        });
                                    }
                                    selectedList(episodeList); 

                                    //
                                } else {
                                    console.error('请求失败，状态码:', xhr.status);
                                }
                            }
                        };

                        xhr.send(); // 发送请求
                    }

                }, 2000);
                break
            case 'www.fun.tv':
                setTimeout(() => {
                    var control_btn_play = $(".fxp-controlbar .btn-toggle");
                    if (control_btn_play.is('.btn-play')) {
                        control_btn_play.click();
                    }
                }, 500);
                setInterval(() => {
                    $("#play-Panel-Wrap").css("display", "none");
                }, 500);
 
                window.onload = setTimeout(() => {
                    var episodeList = [];
                    var data = unsafeWindow.vplayInfo.dvideos[0];
                    var barTotal = data.videos.length;
                    for (var page = 1; page <= barTotal; page++) {
                        var lists = data.videos[page - 1].lists.length;
                        for (var i = 1; i <= lists; i++) {
                            var name = data.videos[page - 1].lists[i - 1].title;
                            var url = data.videos[page - 1].lists[i - 1].url;
                            var title = data.videos[page - 1].lists[i - 1].name;
                            var dtype = data.videos[page - 1].lists[i - 1].dtype;
                            if (!!name && !!url && dtype == "normal") {
                                var href = "http://www.fun.tv" + url;
                                episodeList.push({
                                    "name": name,
                                    "href": href,
                                    "description": title
                                });
                                //mylog({"name":name, "href":href, "description":title});
                            }
                            selectedList(episodeList);
                        }
                    }
                }, 2000);
                break
            case 'www.bilibili.com':
 
                setInterval(() => {
                    $(".player-limit-mask").remove();
                    $("[class^=playerPop_wrap]").remove();
                    //针对//www.bilibili.com/video播放处理
                    if($('#bilibili-player-placeholder')) {
                        $('#bilibili-player-placeholder').remove();
                    }  
                    
                }, 500);
                //-------------------------------------------------
                try{
                    setTimeout(() => {
                        document.getElementsByClassName('numberList_wrapper___SI4W')[0].addEventListener('click', () => {
                            setTimeout(urlChangeReload, 500);
                        });
                    }, 2000);
                }catch(e) {console.log(e);}
                //-------------------------------------------------
                /*window.onload = setTimeout(() => {
                    var episodeList = [];
                    try{
                        var data = unsafeWindow.__INITIAL_STATE__;
                        var barTotal = data.epList.length;
                        for (var page = 1; page <= barTotal; page++) {
                            var i = page - 1
                            var badge = data.epList[i].badge
                            var name = data.epList[i].title;
                            var id = data.epList[i].id;
                            var title = data.epList[i].longTitle;
                            if (!!name && !!id && badge != "预告") {
                                var href = "https://www.bilibili.com/bangumi/play/ep" + id;
                                episodeList.push({
                                    "name": name,
                                    "href": href,
                                    "description": title
                                });
                            }
                            //mylog({"name":name, "href":href, "description":title});
                        }
                        selectedList(episodeList);
                    }catch(e){ }
                    
                }, 2000);*/

                window.onload = setTimeout(() => {
                    var episodeList = [];
                    try{
                        var data = unsafeWindow.__playinfo__;
                        //var barTotal = data.epList.length;
                        let ep_id = data.result.play_view_business_info.episode_info.ep_id;

                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", `https://api.bilibili.com/pgc/view/web/ep/list?ep_id=${ep_id}`, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) { // 请求完成
                                if (xhr.status === 200) { // 请求成功
                                    let serverResponseJson = JSON.parse(xhr.responseText);
                                    let serverEpsodelist = serverResponseJson.result.episodes;
                                    for (let i = 0; i < serverEpsodelist.length; i++) {
                                        let badge = serverEpsodelist[i].badge;
                                        let name = serverEpsodelist[i].title;
                                        let id = serverEpsodelist[i].ep_id;
                                        let title = serverEpsodelist[i].long_title;
                                        if (!!name && !!id && badge != "预告") {
                                            var href = `https://www.bilibili.com/bangumi/play/ep${id}`;
                                            episodeList.push({
                                                "name": name,
                                                "href": href,
                                                "description": title
                                            });
                                        }
                                        //mylog({"name":name, "href":href, "description":title});
                                    }
                                    selectedList(episodeList); 

                                    //
                                } else {
                                    console.error('请求失败，状态码:', xhr.status);
                                }
                            }
                        };

                        xhr.send(); // 发送请求

                    }catch(e){ console.log(e); }
                    
                }, 2000);
                break
 
            case 'v.pptv.com':
                /*
                window.onload = setTimeout(() => {
                    var episodeList = [];
                    var data = unsafeWindow.webcfg;
                    var dataJson = data.playList.data;
                    var barTotal = dataJson.list.length;
                    for (var page = 1; page <= barTotal; page++) {
                        var i = page - 1
                        var name = dataJson.list[i].rank + 1;
                        var href = dataJson.list[i].url;
                        var title = dataJson.list[i].title;
                        if (!!name && !!href) {
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": title
                            });
                        }
                        //mylog({"name":name, "href":href, "description":title});
                    }
                    selectedList(episodeList);
                }, 2000);
                */
                let pptvnum = 0;
                const pptvTimer = setInterval(() => {
                    try {
                        $(".afp-mark-dot").find("video")[0].currentTime = 1000;
                        $(".afp-mark-dot").find("video")[0].playbackRate = 16;
                    }
                    catch (e) {
                        console.log(e);
                        pptvnum += 1;
                        if (pptvnum > 20) {
                            clearInterval(pptvTimer); // 清除定时器
                        }
                    }
                }, 1000);
                
                setTimeout(() => {
                    const vDisplayNodes = [".aside-detail-operate", ".operate-space", ".advView-two", ".advView-banner", ".advView-right-banner", ".adv-space", ".w-video-vastad"];
                    vDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });
                }, 2000);

                window.onload = setTimeout(() => {
                    const episodeList = [];
                    const data = document.querySelectorAll('.ep-numberlist ul li');
                    const barTotal = data.length;
                    if (barTotal) {
                        for (let Li = 0; Li < barTotal; Li++) {
                            let name = '';
                            let href = '';
                            
                            if(data[Li].className == 'episode-index'){//data[Li].hasAttribute();
                                name = data[Li].textContent;
                                href = location.href;
                            }else{
                                name = data[Li].children[0].textContent;
                                href = data[Li].children[0].href;
                            }
                            const title = name;
                            //console.log(Li, href, name);
                            if (!!name && !!href) {
                                episodeList.push({
                                    "name": name,
                                    "href": href,
                                    "description": title
                                });
                            }
                            
                        }
                    } else { console.log("没有找到剧集"); }
                    selectedList(episodeList);
                    
                },1000);

                break
            case 'www.acfun.cn':
                let ele, content = '',
                h1, videolist;

                let i, inf = [
                    {
                        id: 1,
                        definition: "1080P"
                    },
                    {
                        id: 2,
                        definition: "720P"
                    },
                    {
                        id: 3,
                        definition: "540P"
                    },
                    {
                        id: 4,
                        definition: "360P"
                    },
                ]
                
                h1 = $('h1.title');

                try{
                    const spt = document.querySelector("#pagelet_newheader ~ script").textContent;
                    let s= spt.split(" = ");
                    let s1 = s[2].split(`"representation\\\":[{\\\"`);
                
                    for(i of inf){
                        let s2_H264 = s1[1].split(`id\\\":${i.id},\\\"url\\\":\\\"`);
                        //let s2_HEVC = s1[2].split(`id\\\":${i.id},\\\"url\\\":\\\"`); //编解码方式不同
                        //let s2 = s[2].split(`"representation\\\\":`);
                        let s3_H264 = s2_H264[1].split(`\",\"`);
                        const Video_H264 = s3_H264[0].split(`\\",\\`)[0];
                        console.log("%c%s",
                            "color: red; background: white; font-size: 14px;", `${i.definition}_H264：${Video_H264}`);
                    
                        content = content + `
                            <div style="margin:5px 0px;">
                                <div style="display:inline-block;font-weight:bold;width:10%;">${i.definition}：</div>
                                <input type="text" style="color:#5FB404;width:68%" value="${Video_H264}">
                                </div>`;
                    }
                }
                catch(e){
                    console.log(e.message)
                }

                        ele = `
                            <div id="downloadlist" style="margin:15px 0px;color:#DF0174;">
                                <div><span style="font-size:16px;">\u8BF7\u4F7F\u7528m3u8\u4E0B\u8F7D\u5DE5\u5177（
                                    <a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">\u63A8\u8350\u5DE5\u5177</a>）
                                    </span>
                                </div>${content}</div>`;
                    h1.after(ele);
                
                break;
            //--------------------------------------------------------------------------------
            case 'www.le.com':

                setTimeout(() => {
                    const leDisplayNodes = [".column.j-huodongshouyintai", ".cmsAd", ".playerLeftAd","#payLayerFrame", "#payLayerMask" ];
                    leDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });

                    document.querySelectorAll('video')[0].playbackRate = 6;

                }, 2000);

                window.onload = setTimeout(() => {
                    const episodeList = [];
                    const data = document.querySelectorAll('ul.juji_grid li');
                    const barTotal = data.length;
                    if (barTotal) {
                        for (let Li = 0; Li < barTotal; Li++) {
                            const name = data[Li].children[0].textContent;
                            const href = `https://www.le.com/ptv/vplay/${data[Li].dataset.vid}.html`;
                            const title = name;
                            //console.log(Li, href, name);
                            if (!!name && !!href) {
                                episodeList.push({
                                    "name": name,
                                    "href": href,
                                    "description": title
                                });
                            }
                            
                        }
                    } else { console.log("没有找到剧集"); }
                    selectedList(episodeList);
                    
                },1000);

                break;
            //--------------------------------------------------------------------------------
            
            case 'vip.1905.com':
                setTimeout(() => {
                    const leDisplayNodes = [".pauseInfoWrap"];
                    leDisplayNodes.forEach(node => {
                        $(node).css("display", "none");
                    });

                }, 2000);

                window.onload = setTimeout(() => {
                    const episodeList = [];
                    const data = document.querySelectorAll('.overview>ul.clearfix li');
                    const barTotal = data.length;
                    if (barTotal) {
                        for (let Li = 0; Li < barTotal; Li++) {
                            const name = data[Li].children[0].textContent;
                            const href = data[Li].children[0].href;
                            const title = name;
                            //console.log(Li, href, name);
                            if (!!name && !!href) {
                                episodeList.push({
                                    "name": name,
                                    "href": href,
                                    "description": title
                                });
                            }
                            
                        }
                    } else { console.log("没有找到剧集"); }
                    selectedList(episodeList);
                    
                },1000);
                break;
            //--------------------------------------------------------------------------------
            case 'www.wxtv.net':
                $("#vip_movie_box").remove();
                $(".searchlist_item").find("a").attr("id", "bbb");
                $("#topnav").remove();
                $("#mygod2m").remove();
                $("#mygod2pc").remove();
                $(".bgi_box").remove();
                $(".content_btn").remove();
                $(".hidden_xs").remove();
                $("#bofy").remove();
                $(".fo_t").remove();
                $(".list_scroll").remove();
                $(".title").remove();
                setInterval(() => {
                    $("#bbb").click();
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'wetv.vip':
                setInterval(() => {
 
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'www.eggvod.cn':
                $("#vip_movie_box").remove();
                var yhq = $(`
                <div>
                    <ul>
                        <li>
                          <a href="https://www.zuihuitao.cn">淘宝天猫优惠券</a>
                        </li>
                    </ul>
                     <ul>
                        <li>
                            <a href="https://zuihuitao.top/vip/index.html">关于脚本</a>
                        </li>
                    </ul>
                </div>
                       `);
                $(".tips").html(yhq)
                setInterval(() => {
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'music.163.com':
                $(".item_text").remove();
                $(".qelected_text").remove();
                $(".selected_text").remove();
                $(".aelected_text").remove();
                $(".belected_text").remove();
                $("#m").remove();
                setInterval(() => {
                    $(".melected_text").show();
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'y.qq.com':
                $(".item_text").remove();
                $(".qelected_text").remove();
                $(".selected_text").remove();
                $(".aelected_text").remove();
                $(".belected_text").remove();
                $("#m").remove();
                setInterval(() => {
                    $(".melected_text").show();
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'www.kugou.com':
                $(".item_text").remove();
                $(".qelected_text").remove();
                $(".selected_text").remove();
                $(".aelected_text").remove();
                $(".belected_text").remove();
                $("#m").remove();
                setInterval(() => {
                    $(".melected_text").show();
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'www.kuwo.cn':
                $(".item_text").remove();
                $(".qelected_text").remove();
                $(".selected_text").remove();
                $(".aelected_text").remove();
                $(".belected_text").remove();
                $("#m").remove();
                setInterval(() => {
                    $(".melected_text").show();
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'video.zhihu.com':
                $(".item_text").remove();
                $(".qelected_text").remove();
                $(".selected_text").remove();
                $(".aelected_text").remove();
                $(".belected_text").remove();
                $(".melected_text").remove();
                $("#m").remove();
                setInterval(() => {
                }, 500);
                break
            //--------------------------------------------------------------------------------
            case 'tv.wandhi.com':
                $('#tip').hide();
                $('.container').hide();
                $('.135brush').remove();
                $('.table .table-bordered').remove();
                $('.unit-100').remove();
                $('#vip_movie_box').hide();
                document.getElementsByClassName('panel-body')[1].style.display='none';
                break
            //--------------------------------------------------------------------------------
            default:
                break
        }
 
        var localurl = location.href;
 
        function addScript(url) {
            var s = document.createElement('script');
            s.setAttribute('src', url);
            document.body.appendChild(s);
        }
        var reg_acfun = /www.acfun.cn\/v\/.*/;
 
        function acfun() {
            let ele, content = '',
                h1, videolist;
            try {
                let h1 = $('h1.title');
                videolist = JSON.parse(window.pageInfo.currentVideoInfo.ksPlayJson).adaptationSet[0].representation;
                if (videolist.length > 0 && $('div#downloadlist').length == 0) {
                    for (var i = 0; i < videolist.length; i++) {
                        content = content + `
            <div style="margin:5px 0px;">
                <div style="display:inline-block;font-weight:bold;width:10%;">${videolist[i].qualityLabel}：</div>
                <input type="text" style="color:#5FB404;width:68%" value="${videolist[i].url}">
                </div>`;
                    }
                    ele = `
                <div id="downloadlist" style="margin:15px 0px;color:#DF0174;">
                    <div>\u8BF7\u4F7F\u7528m3u8\u4E0B\u8F7D\u5DE5\u5177（
                        <a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">\u63A8\u8350\u5DE5\u5177</a>）
                    </div>${content}</div>`;
                }
                h1.after(ele);
            } catch (e) {
                console.log('acfun', e.message);
            }
        }
        function xsyhnbrun() {
            if (reg_acfun.test(localurl)) {
                acfun();
            }
        }
        setInterval(xsyhnbrun, 500);

        mo();
    }

    //--------------------------------------------------------------------------------
    // 右键功能 - 防止遮挡
    const movieBox = document.getElementById("vip_movie_box");
    // 鼠标按下事件处理函数
    const onMouseDown = e => {
        // 检查是否是鼠标右键点击（按钮代码为2）
        if (e.button === 2) {
            e.preventDefault(); // 阻止默认行为

            // 设置元素的cursor样式为move
            movieBox.style.cursor = "move";

            // 获取元素相对于文档的位置
            const rect = movieBox.getBoundingClientRect();
            const distenceX = e.clientX - rect.left;
            const distenceY = e.clientY - rect.top;

            // 鼠标移动事件处理函数
            const onMouseMove = e => {
                let x = e.clientX - distenceX;
                let y = e.clientY - distenceY;

                // 防止元素移动超出文档边界 - 计算移动后的左偏移量 和 顶部的偏移量
                if (x < 0) {
                    x = 0;
                } else if (x > document.documentElement.clientWidth - movieBox.offsetWidth) {
                    x = document.documentElement.clientWidth - movieBox.offsetWidth;
                }
                if (y < 0) {
                    y = 0;
                } else if (y > document.documentElement.clientHeight - movieBox.offsetHeight) {
                    y = document.documentElement.clientHeight - movieBox.offsetHeight;
                }

                // 更新元素的位置
                movieBox.style.top = `${y}px`;
                movieBox.style.left = `${x}px`;

                GMsetValue("Position_" + host, {top : y, left : x}); // 存储位置信息
            }

            // 鼠标松开事件处理函数
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                movieBox.style.cursor = "pointer"; // 还原样式
            }

            // 添加鼠标移动和松开事件监听
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }

    // 添加鼠标按下事件监听
    movieBox.addEventListener('mousedown', onMouseDown);

    // 阻止右键菜单默认行为
    const onContextMenu = e => {
        e.preventDefault();
    }

    // 添加右键菜单事件监听
    movieBox.addEventListener('contextmenu', onContextMenu);
    //--------------------------------------------------------------------------------
    

})();