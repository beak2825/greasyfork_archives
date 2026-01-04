// ==UserScript==
// @name       文库下载器|百度网盘直链解析下载|全网VIP视频解析无广告播放，全网独创自由选择自动解析接口|短视频无水印下载|更多功能持续更新中
// @namespace    http://www.zhihupe.com/
// @version      1.68
// @author       woniu
// @description  【❤️ 视频自动解析，体会拥有VIP的感觉❤️，适配PC+移动 】功能有：1、支持B站大会员番剧，全网独创自由选择自动解析接口；2、爱奇艺、腾讯、优酷、芒果等全网VIP视频免费解析去广告(免跳出观影特方便)；3.B站多P下载(因B站举报投诉，暂时停用)；抖音、西瓜视频、快手无水印下载；4.新增喜马拉雅有声书批量下载,5.教育盘论坛免费下载,6.百度文库、原创力文档、道客巴巴、智库文库、豆丁网免费下载7.百度网盘文件高速下载8.解除CSDN博客登陆后复制限制，解除阅读全文限制，解除外链重定向限制百度文库
// @icon         data:image/png;base64,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
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @require      https://lib.baomitu.com/echarts/4.6.0/echarts.min.js
// @match          *://laisoyiba.com/*
// @match           *://*.youku.com/v_*
// @match           *://*.iqiyi.com/v_*
// @match           *://*.iqiyi.com/w_*
// @match           *://*.iqiyi.com/a_*
// @match           *://v.qq.com/x/cover/*
// @match           *://v.qq.com/x/page/*
// @match           *://v.qq.com/tv/*
// @match           *://*.mgtv.com/b/*
// @match           *://*.bilibili.com/video/*
// @match           *://*.bilibili.com/bangumi/play/*
// @match           *://www.acfun.cn/bangumi/*
// @match           *://www.le.com/ptv/vplay/*
// @match           *://www.wasu.cn/Play/show/*
// @match           *://vip.1905.com/play/*
// @match           *://tv.sohu.com/v/*
// @match           *://film.sohu.com/album/*
// @match           *://v.pptv.com/show/*

// @match           *://m.v.qq.com/*
// @match           *://m.iqiyi.com/v_*
// @match           *://m.iqiyi.com/w_*
// @match           *://m.iqiyi.com/a_*
// @match           *://m.youku.com/alipay_video/*
// @match           *://m.youku.com/video/*
// @match           *://m.mgtv.com/b/*
// @match           *://m.bilibili.com/video/*
// @match           *://m.bilibili.com/anime/*
// @match           *://m.bilibili.com/bangumi/play/*
// @match           *://m.le.com/vplay_*
// @match           *://vip.1905.com/m/play/*
// @match           *://www.wasu.cn/wap/*/show/*
// @match           *://m.tv.sohu.com/v.*
// @match           *://m.pptv.com/show/*

// @match        *://item.taobao.com/*
// @match        *://s.taobao.com/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://*detail.tmall.com/*
// @match        *://*detail.tmall.hk/*
// @match        *://list.tmall.com/search_*
// @match        *://*item.jd.com/*
// @match        *://npcitem.jd.hk/*
// @match        *://*.yiyaojd.com/*
// @match        *://search.jd.com/Search*

// @match         *://*jiaoyupan.com/forum.php?mod=viewthread&tid=*

// @match         *://*.book118.com/html/*
// @match         *://view-cache.book118.com/*
// @match         *://*.book118.com/?readpage*
// @match         *://*.doc88.com/p*
// @match         *://*.mbalib.com/view*
// @match         *://*.docin.com/p-*
// @match         *://wenku.baidu.com/*view/*
// @match         *://wk.baidu.com/*view/*

// @match         *://www.ximalaya.com/*
// @match         *://blog.csdn.net/*
// @match        *://*.douyin.com/video/*
// @match        *.kuaishou.com/short-video/*
// @match        *.kuaishou.com/video/*
// @match        *.kuaishou.com/new-reco*
// @match        *.ixigua.com/*

// @match        *.baidu.com/*

// @connect      tool.zhihupe.com
// @connect      tool.wezhicms.com
// @connect      47.99.158.118
// @connect      api.bilibili.com
// @connect      mobile.ximalaya.com
// @connect      v2.api.haodanku.com
// @connect      www.iesdouyin.com
// @connect      bijiatool-v2.manmanbuy.com
// @connect      view-cache.book118.com
// @connect      pcweb.api.mgtv.com
// @connect      docimg1.docin.com
// @connect      www.360fandu.cn
// @connect      pan.10zv.net
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle

// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_download
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @license             End-User License Agreement
// @antifeature  membership  为防止接口被盗！该脚本需要输入验证码之后才能使用完整功能，感谢理解
// @antifeature  	  referral-link 【此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉】
// @downloadURL https://update.greasyfork.org/scripts/492546/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%7C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%7C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE%EF%BC%8C%E5%85%A8%E7%BD%91%E7%8B%AC%E5%88%9B%E8%87%AA%E7%94%B1%E9%80%89%E6%8B%A9%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%8E%A5%E5%8F%A3%7C%E7%9F%AD%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%7C%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/492546/%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%7C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%7C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE%EF%BC%8C%E5%85%A8%E7%BD%91%E7%8B%AC%E5%88%9B%E8%87%AA%E7%94%B1%E9%80%89%E6%8B%A9%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%8E%A5%E5%8F%A3%7C%E7%9F%AD%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%7C%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //最终用户许可协议 End-User License Agreement
    // * Copyright (c) 2021-2022 zhihu. All Rights Reserved.
    // * Proprietary and Confidential.
    // * 该项目介绍、说明书、脚本代码、思路及其他相关
    //   内容版权归作者所有，未经作者本人书面授权，禁
    //   止任何单位或个人以任何形式、任何手段或通过任
    //   何方式（净室工程、手工、图片、电子、机械、磁
    //   性、化学、光学、声学或其它方式）抄袭、摘编、
    //   编辑、修改、结集、出版、再版、转录、转载、爬
    //   虫爬取、重制、仿制、复制、复写、复印、影印、
    //   拷贝、刻录、建立镜像、粘贴、张贴、派发、录音、
    //   用来创建派生作品、与其它任何资料进行合并、翻
    //   译成任何电脑语言或以其他任何方式用于商业或公
    //   共目的。
    // * 该项目仅仅准许您善意的使用，其他任何行为都是
    //   禁止的。
    // * zhihu从未授权任何组织或个人使用本项目脚本
    //   部分或全部代码创建作品。


    const config ={
        "playhref":window.location.href,
        "host":window.location.host,
        "UA":navigator.userAgent,
        "scriptInfo":GM_info.script,
        "hdapikey":"FF9529914C44",
    }
    const playList=[
        {"name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
        {"name":"蜗牛弹幕","category":1,"url":"https://jx.777jiexi.com/player/?url=", "showType":3},
        {"name":"纯净/B站","category":1,"url":"https://z1.m1907.top/?eps=0&jx=", "showType":3},
        {"name":"高速接口","category":1,"url":"https://jx.jsonplayer.com/player/?url=", "showType":3},
        {"name":"综合/B站","category":1,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},
        {"name":"OK解析","category":1,"url":"https://okjx.cc/?url=", "showType":3},
        {"name":"OKJX","category":1,"url":"https://api.okjx.cc:3389/jx.php?url=", "showType":3},
        {"name":"夜幕","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
        {"name":"NNXV","category":1,"url":"https://jx.nnxv.cn/tv.php?url=", "showType":3},
        {"name":"听乐","category":1,"url":"https://jx.dj6u.com/?url=", "showType":3},
        {"name":"RDHK","category":1,"url":"https://jx.rdhk.net/?v=", "showType":3},
         {"name":"铭人云","category":1,"url":"https://parse.123mingren.com/?url=", "showType":3},
        {"name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":1},
        {"name":"七哥","category":1,"url":"https://jx.mmkv.cn/tv.php?url=", "showType":3},
        {"name":"CK","category":1,"url":"https://www.ckplayer.vip/jiexi/?url=", "showType":1},
        {"name":"ckmov","category":1,"url":"https://www.ckmov.vip/api.php?url=", "showType":1},
        {"name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?ads=0&url=", "showType":3},
        {"name":"1717解析","category":1,"url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":1},
        {"name":"H8","category":1,"url":"https://www.h8jx.com/jiexi.php?url=", "showType":1},
        {"name":"猪蹄","category":1,"url":"https://jx.iztyy.com/Bei/?url=", "showType":1},
        {"name":"解析la","category":1,"url":"https://api.jiexi.la/?url=", "showType":1},
        // {"name":"老板","category":1,"url":"https://vip.laobandq.com/jiexi.php?url=", "showType":1},
        // {"name":"盘古","category":1,"url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":1},
        // {"name":"盖世","category":1,"url":"https://www.gai4.com/?url=", "showType":1},
        // {"name":"0523","category":1,"url":"https://go.yh0523.cn/y.cy?url=", "showType":1},
        {"name":"17云","category":1,"url":"https://www.1717yun.com/jx/ty.php?url=", "showType":1},
        {"name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":1},
        {"name":"8090","category":1,"url":"https://www.8090g.cn/?url=", "showType":1},
        {"name":"PM","category":1,"url":"https://www.playm3u8.cn/jiexi.php?url=", "showType":1},
        // {"name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":1},

        {"name":"综合线路","category":2,"url":"https://zhihuweb.com/player.html?url=", "showType":1},
        {"name":"纯净/B站","category":2,"url":"https://z1.m1907.cn/?jx=", "showType":1},
        {"name":"高速接口","category":2,"url":"https://jsap.attakids.com/?url=", "showType":1},
        {"name":"综合/B站1","category":2,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":1},
        {"name":"OK解析","category":2,"url":"https://okjx.cc/?url=", "showType":1},
        {"name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
        {"name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
        {"name":"M3U8.TV","category":2,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":1},
    ];
    const author = config.scriptInfo.author;
    const ZHwindow = unsafeWindow||window;
    const commonFunction = {
        Toast:function(msg, duration = 3000){
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.setAttribute('id','msg');
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(() => {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
            }, duration);
        },
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMgetValue:function(name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMsetValue:function(name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMxmlhttpRequest:function(obj) {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest(obj);
            } else {
                GM.xmlhttpRequest(obj);
            }
        },
        setItem:function(name, Value) {
            localStorage.setItem(name, Value);
        },
        getItem:function(name) {
            let StorageValue = localStorage.getItem(name);
            return StorageValue;
        },
        removeItem:function(name) {
            localStorage.removeItem(name);
        },
        GMaddStyle:function(data,id=null) {
            var addStyle = document.createElement('style');
            addStyle.textContent = data;
            addStyle.type = 'text/css';
            addStyle.id = id;
            var doc = document.head || document.documentElement;
            doc.appendChild(addStyle);
        },
        GMaddScript:function(data) {
            let script = document.createElement('script');
            script.src = data;
            var docu = document.head || document.documentElement;
            docu.appendChild(script);
        },
        GMaddlink:function(data) {
            let mylink = document.createElement('link');
            mylink.href = data;
            mylink.rel = 'stylesheet';
            var docl = document.head || document.documentElement;
            docl.appendChild(mylink);
        },
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },
        sleep:function(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        Commonsetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    data.forEach((item)=>{
                        var node = document.querySelector(item);
                        if(node !==null){
                            resolve(node);
                            clearInterval(Count);
                        }
                        if(num ==100){
                            clearInterval(Count);
                        }
                    })
                    num++;

                },200);
            });
        },
        Videosetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    for(let i=0;i < data.length;i++ ){
                        var node = document.querySelector(data[i])?.children??"";
                        if(node !==""){
                            resolve(data[i]);
                            clearInterval(Count);
                        }
                        if(num ==20){
                            clearInterval(Count);
                        }
                    }
                    num++;
                },500);
            });
        },
        menusetting:function(){
            //初始化脚本设置
            let setting = ["videosetting","couponsetting","historysetting","Shortvideosetting","Bilibilisetting","Ximalayasetting","Jiaoyupansetting","Docssetting","Csdnsetting"]
            setting.forEach((item)=>{
                if(commonFunction.GMgetValue(item)==null){
                    commonFunction.GMsetValue(item,1);
                }
            })
        },
        setIntervalhost:function() {
            let playhref = window.location.href
            setInterval(function() {
                var workurl = window.location.href;
                if (playhref != workurl) {
                    console.log(workurl);
                    playhref = workurl;
                    window.location.reload();
                }
            },500);
        },
        IsPC:function() {
            var userAgentInfo = config.UA;
            var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (let i = 0; i < Agents.length; i++) {
                if (userAgentInfo.indexOf(Agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        IsWap:function(){
            var com = null;
            if(config.host.indexOf('item.') > -1) {
                com = "pc";
            }else if (config.host.indexOf('m.') > -1||config.playhref.indexOf('/m/') > -1||config.playhref.indexOf('/wap/') > -1) {
                com = "wap";
            }else {
                com = "pc";
            }
            return com
        },
        Getgoodid:function(data){
            var reg = new RegExp("(^|&)" + data + "=([^&]*)(&|$)");
            var s = window.location.search.substr(1).match(reg);
            if (s != null) {
                return s[2];
            }
            return "";
        },
        geturlid:function(url) {
            var id ="";
            if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
            }
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
            }
            var text = url.split("/");
            id = text[text.length - 1];
            id = id.replace(".html", "");
            return id
        },
        request:function(method,url,headers,data=null){
            return new Promise(function(resolve, reject){
                commonFunction.GMxmlhttpRequest({
                    url: url,
                    method: method,
                    data:data,
                    headers:headers,
                    onload: function(res) {
                        var status = res.status;
                        var responseText = res.responseText;
                        if(status==200||status=='200'){
                            resolve({"result":"success", "data":responseText});
                        }else{
                            reject({"result":"error", "data":null});
                        }
                    }
                });
            })
        },
        open:function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>';
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+data.title+'</div><div class="zhihu-layer-content" >'+data.content+'</div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-page");
            document.body.appendChild(main);
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"zhihu-layer-shade");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
                    ::-webkit-scrollbar{width:6px;height:6px}
                    ::-webkit-scrollbar-track{width:6px;background:transparent}
                    ::-webkit-scrollbar-thumb{width:6px;border-radius:4px;background-color:#54be99;-webkit-transition:all 1s;transition:all 1s}
                    ::-webkit-scrollbar-corner{background-color:#54be99}
                    li{list-style:none}
                    .zhihu-form-label,.zhihu-form-select,.zhihu-input-block,.zhihu-input-inline{position:relative}
                    .zhihu-layer-shade{position:fixed;top:0;left:0;box-sizing:border-box;width:100%;height:100%;outline:0;border-radius:2px;-webkit-transition:all .3s;transition:all .3s;_height:expression(document.body.offsetHeight+"px")}
                    .zhihu-layer-page{margin:0;padding:0;background-color:#fff;border-radius:10px;box-shadow:1px 1px 50px rgba(0,0,0,.4);font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif}
                    .zhihu-layer-title{padding:0 80px 0 20px;height:50px;line-height:50px;border-bottom:1px solid #f0f0f0;border-radius:2px 2px 0 0;font-size:14px;color:#333;overflow:visible;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
                    .zhihu-layer-setwin{position:absolute;right:15px;top:17px;font-size:0;line-height:normal}
                    .zhihu-layer-setwin .zhihu-layer-close1{background-position:1px -40px;cursor:pointer}
                    .zhihu-layer-setwin a{position:relative;width:16px;height:16px;margin-left:10px;font-size:12px;_overflow:hidden}
                    .zhihu-layer-btn a,.zhihu-layer-setwin a{display:inline-block;vertical-align:top}.zhihu-layer-ico{background:url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat}
                    .zhihu-layer-btn{text-align:right;padding:10px 15px 12px;pointer-events:auto;user-select:none;-webkit-user-select:none}
                    .zhihu-layer-btn-c{text-align:center}
                    .zhihu-layer-btn a{height:28px;line-height:28px;margin:5px 5px 0;padding:0 15px;border:1px solid #dedede;background-color:#fff;color:#333;border-radius:4px;font-weight:400;cursor:pointer;text-decoration:none}
                    .zhihu-layer-btn1{border-color:#54be99!important;background-color:#54be99!important;color:#fff!important}
                    .zhihu-form-item{margin-bottom:5px;clear:both}
                    .zhihu-form-label{float:left;display:block;padding:9px 15px;width:80px;font-weight:400;line-height:20px;text-align:right;box-sizing:content-box}
                    .zhihu-input-inline{display:inline-block;vertical-align:middle;width:190px;margin-right:10px}
                    .zhihu-input,.zhihu-select,.zhihu-textarea{height:38px;line-height:1.3;border:1px solid #eee;display:block;width:100%;padding-left:10px;background-color:#fff;color:rgba(0,0,0,.85);-webkit-appearance:none;box-sizing: border-box;border-radius: 2px!important;}
                    .zhihu-input-block{margin-left:110px;min-height:auto}
                    .zhihu-input-block p{font-size:12px;line-height:22px}
                    .zhihu-form{display:flex;margin-top:20px}

            `;
            commonFunction.GMaddStyle(css,"open");
            // await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
        },
        tab:async function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var titleHTML ="";
            var contentHTML = "";
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>'
            for (let i = 0; i < data.tab.length; i++) {
                if(i === 0 ){
                    titleHTML +='<span class="tab-title zhihu-this">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli zhihu-this">'+data.tab[i].content+'</li>';
                }else{
                    titleHTML +='<span class="tab-title">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli ">'+data.tab[i].content+'</li>';
                }
            }
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+titleHTML+'</div><div class="zhihu-layer-content" ><ul class="zhihu-layer-tabmain">'+contentHTML+'</ul></div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-tab");
            document.body.appendChild(main);
            var tabtitle = document.getElementsByClassName('tab-title');
            for (let i = 0; i < tabtitle.length; i++) {
                let tabli = document.getElementsByClassName('zhihu-layer-tabli')[i];
                tabtitle[i].addEventListener('click',function() {
                    document.querySelector(".zhihu-layer-title>.zhihu-this").classList.remove("zhihu-this");
                    this.classList.add("zhihu-this");
                    document.querySelector(".zhihu-layer-tabmain>.zhihu-this").classList.remove("zhihu-this");
                    tabli.classList.add("zhihu-this");
                });

            }
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
                    ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{width:6px;background:transparent}
                    ::-webkit-scrollbar-thumb{width:6px;border-radius:4px;background-color:#54be99;-webkit-transition:all 1s;transition:all 1s}
                    ::-webkit-scrollbar-corner{background-color:#54be99}
                    li{list-style:none}
                    .zhihu-form-label,.zhihu-form-select,.zhihu-input-block,.zhihu-input-inline{position:relative}
                    .zhihu-layer-shade{position:fixed;top:0;left:0;width:100%;height:100%;_height:expression(document.body.offsetHeight+"px")}
                    .zhihu-layer-tab{margin:0;padding:0;background-color:#fff;border-radius:10px;box-shadow:1px 1px 50px rgba(0,0,0,.4);font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif}
                    .zhihu-layer-tab *{box-sizing:content-box}
                    .zhihu-layer-title{height:50px;line-height:50px;border-bottom:1px solid #f0f0f0;border-radius:2px 2px 0 0;font-size:14px;color:#333;padding:0 80px 0 0;overflow:visible;text-overflow:ellipsis;white-space:nowrap}
                    .zhihu-layer-title span{position:relative;float:left;min-width:80px;max-width:300px;padding:0 20px;text-align:center;overflow:hidden;cursor:pointer;font-weight:700;color:#000}
                    .zhihu-layer-title span:first-child{border-left:none}.zhihu-layer-title span.zhihu-this{height:51px;border-left:1px solid #eee;border-right:1px solid #eee;background-color:#fff;z-index:10}
                    .zhihu-layer-title span:first-child.zhihu-this{border-radius:10px 0 0 0}
                    .zhihu-layer-content{position:relative;overflow:hidden;height:290px}
                    .zhihu-layer-tabmain{line-height:24px;clear:both;padding:0;margin:0}
                    .zhihu-layer-tabli{display:none;height:100%}
                    .zhihu-layer-tabmain .zhihu-this{display:block}
                    .zhihu-layer-setwin{position:absolute;right:15px;top:17px;font-size:0;line-height:normal}
                    .zhihu-layer-setwin .zhihu-layer-close1{background-position:1px -40px;cursor:pointer}
                    .zhihu-layer-setwin a{position:relative;width:16px;height:16px;margin-left:10px;font-size:12px;_overflow:hidden}
                    .zhihu-layer-btn a,.zhihu-layer-setwin a{display:inline-block;vertical-align:top}
                    .zhihu-layer-ico{background:url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat}
                    .zhihu-layer-btn{text-align:right;padding:10px 15px 12px;pointer-events:auto;user-select:none;-webkit-user-select:none}
                    .zhihu-layer-btn-c{text-align:center}
                    .zhihu-layer-btn a{height:28px;line-height:28px;margin:5px 5px 0;padding:0 15px;border:1px solid #dedede;background-color:#fff;color:#333;border-radius:4px;font-weight:400;cursor:pointer;text-decoration:none}
                    .zhihu-layer-btn1{border-color:#54be99!important;background-color:#54be99!important;color:#fff!important}
                    .zhihu-form-item{margin-bottom:15px;clear:both}
                    .zhihu-form-label{float:left;display:block;padding:9px 15px;width:80px;font-weight:400;line-height:20px;text-align:right}
                    .zhihu-input-block{margin-left:110px;min-height:36px;width:190px}
                    .zhihu-form input[type=checkbox],.zhihu-form input[type=radio],.zhihu-form select{display:none}
                    .zhihu-form-switch{position:relative;height:22px;line-height:22px;min-width:35px;padding:0 5px;margin-top:8px;border:1px solid #d2d2d2;border-radius:20px;cursor:pointer;background-color:#fff;-webkit-transition:.1s linear;transition:.1s linear}
                    .zhihu-form-checkbox,.zhihu-form-checkbox *,.zhihu-form-switch{display:inline-block;vertical-align:middle}
                    .zhihu-unselect{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}
                    .zhihu-form-switch em{position:relative;top:0;width:25px;margin-left:21px;padding:0!important;text-align:center!important;color:#999!important;font-style:normal!important;font-size:12px}
                    .zhihu-form-switch i{position:absolute;left:5px;top:3px;width:16px;height:16px;border-radius:20px;background-color:#d2d2d2;-webkit-transition:.1s linear;transition:.1s linear}
                    .zhihu-form-onswitch{border-color:#54be99;background-color:#54be99}
                    .zhihu-form-onswitch em{margin-left:5px;margin-right:21px;color:#fff!important}
                    .zhihu-form-onswitch i{left:100%;margin-left:-21px;background-color:#fff}
                    .zhihu-form-select .zhihu-input{padding-right:30px;cursor:pointer}
                    .zhihu-input,.zhihu-textarea{display:block;width:100%;padding-left:10px}
                    .zhihu-input,.zhihu-select,.zhihu-textarea{height:38px;line-height:1.3;border-width:1px!important;border-style:solid!important;background-color:#fff;color:rgba(0,0,0,.85);border-radius:2px!important}
                    .zhihu-btn,.zhihu-input,.zhihu-select,.zhihu-textarea,.zhihu-upload-button{outline:0;-webkit-appearance:none;transition:all .3s;-webkit-transition:all .3s;box-sizing:border-box;border-color:#eee!important}
                    .zhihu-form-select .zhihu-edge{position:absolute;right:10px;top:50%;margin-top:-3px;cursor:pointer;border-top:solid #c2c2c2;border-width:6px;transition:all .3s;-webkit-transition:all .3s}
                    .zhihu-edge{width:0;border:6px dashed transparent;display:inline-block}
                    .zhihu-form-selected .zhihu-edge{margin-top:-9px;-webkit-transform:rotate(180deg);transform:rotate(180deg)}
                    .zhihu-anim{-webkit-animation-duration:.3s;-webkit-animation-fill-mode:both;animation-duration:.3s;animation-fill-mode:both}
                    .zhihu-form-select dl,.zhihu-panel{box-shadow:1px 1px 4px rgb(0 0 0/8%)}
                    .zhihu-form-select dl{position:absolute;top:42px;left:0;z-index:899;display:none;overflow-y:auto;box-sizing:border-box;margin:0;padding:5px 0;max-height:300px;min-width:100%;border:1px solid #eee;border-radius:2px;background-color:#fff}
                    .zhihu-form-selected dl{display:block}
                    .zhihu-form-select dl dd,.zhihu-form-select dl dt{overflow:hidden;margin:0;padding:0 10px;text-overflow:ellipsis;white-space:nowrap;line-height:36px}
                    .zhihu-form-select dl dd{cursor:pointer}.zhihu-form-select dl dd.zhihu-select-tips{padding-left:10px!important;color:#999}
                    .zhihu-form-select dl dd.zhihu-this{background-color:#5fb878;color:#fff}
         `;
            commonFunction.GMaddStyle(css,"tab");
            await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //开关添加开始
            var zhihuinput = zhihuform.getElementsByClassName('checkbox');
            for (let i = 0; i < zhihuinput.length; i++) {
                let name = zhihuinput[i].getAttribute("name");
                if(name =="switch"){
                    if(zhihuinput[i].checked){
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch zhihu-form-onswitch"><em>ON</em><i></i></div>');
                    }else{
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch "><em>OFF</em><i></i></div>');
                    }
                }
            }
            //开关添加结束
            //开关点击事件开始
            var zhihuswitch = document.getElementsByClassName('zhihu-form-switch');
            for (let i = 0; i < zhihuinput.length; i++) {
                zhihuswitch[i].addEventListener('click',function() {
                    let onswitch = this.getAttribute("class");
                    if(onswitch.indexOf("zhihu-form-onswitch")!=-1){
                        this.parentNode.querySelector('input').removeAttribute("checked");
                        this.classList.remove("zhihu-form-onswitch");
                        this.innerHTML ="<em>OFF</em><i></i>"
                    }else{
                        this.parentNode.querySelector('input').setAttribute("checked",true);
                        this.classList.add("zhihu-form-onswitch");
                        this.innerHTML ="<em>ON</em><i></i>"
                    }

                })
            }
            //开关点击事件结束
            //下拉框添加开始
            var zhihuselect = zhihuform.getElementsByTagName('select');
            for (let i = 0; i < zhihuselect.length; i++) {
                let optionHtml ='';
                let zhihuoption = zhihuselect[i].getElementsByTagName('option');
                if(zhihuselect[i].selectedIndex < 0){
                    var Index = 0
                    }else{
                        Index = zhihuselect[i].selectedIndex;
                    }
                let selecttext = zhihuselect[i].options[Index].text;
                var selectvalue = zhihuselect[i].options[Index].value;
                for (let l = 0; l < zhihuoption.length; l++) {
                    let optionText = zhihuoption[l].innerText;
                    let optionvalue = zhihuoption[l].value;
                    if(optionvalue == selectvalue){
                        optionHtml += '<dd zhihu-value="'+optionvalue+'"  class="zhihu-select-tips zhihu-this">'+optionText+'</dd>'
                    }else{
                        optionHtml += '<dd zhihu-value="'+optionvalue+'" class="">'+optionText+'</dd>'
                    }
                }
                var selectHtml = '<div class="zhihu-unselect zhihu-form-select"><div class="zhihu-select-title"><input type="text" placeholder="直接选择或搜索选择" value="'+selecttext+'" readonly="" class="zhihu-input zhihu-unselect"><i class="zhihu-edge"></i></div><dl class="zhihu-anim" style="">'+optionHtml+'</dl></div>';
                zhihuselect[i].insertAdjacentHTML('afterEnd',selectHtml);
            }
            //下拉框添加结束
            //下拉框操作事件开始
            var zhihuunselect = document.getElementsByClassName("zhihu-form-select");
            for (let i = 0; i < zhihuunselect.length; i++) {
                //下拉框点击事件
                zhihuunselect[i].addEventListener('click',function() {
                    var selected = this.getAttribute("class");
                    if(selected.indexOf("zhihu-form-selected")!=-1){
                        this.classList.remove("zhihu-form-selected");
                    }else{
                        this.classList.add("zhihu-form-selected");
                    };
                },false);
                //下拉框选择事件
                var zhihudd = zhihuunselect[i].getElementsByTagName('dd');
                for (let l = 0; l < zhihudd.length; l++) {
                    zhihudd[l].addEventListener('click',function() {
                        var a = zhihuunselect[i].querySelector('.zhihu-this');
                        if(a){
                            a.classList.remove("zhihu-this");
                            a.classList.remove("zhihu-select-tips");
                        }
                        this.classList.add("zhihu-this");
                        this.classList.add("zhihu-select-tips");
                        console.log(this.getAttribute("zhihu-value"));
                        console.log(zhihuunselect[i].parentNode.querySelector('select'))
                        zhihuunselect[i].parentNode.querySelector('select').value = this.getAttribute("zhihu-value");
                        zhihuunselect[i].parentNode.querySelector('input').setAttribute("value",this.innerText);
                    });
                };
            }
            //下拉框操作事件结束
        },
    }
    //--------------------------------------------------------------
    const ControllerVideo = {
        //播放节点
        Playid:function(){
            var PlayidList = [
                { url:"v.qq.com", node:["#mod_player","#player-container"],adnode:["#mask_layer",".mod_vip_popup",".panel-tip-pay"],playwork:true},
                { url:"www.iqiyi.com", node:["#flashbox"],playwork:true},
                { url:"v.youku.com", node:["#player"],playwork:""},
                { url:"w.mgtv.com", node:["#mgtv-player-wrap"],playwork:true},
                { url:"www.mgtv.com", node:["#mgtv-player-wrap"],playwork:true},
                { url:"tv.sohu.com", node:["#player"],playwork:true},
                { url:"film.sohu.com", node:["#playerWrap"],playwork:true},
                { url:"www.le.com", node:["#le_playbox"],playwork:true},
                { url:"v.pptv.com", node:["#pptv_playpage_box"],playwork:""},
                { url:"vip.pptv.com", node:[".w-video"],playwork:""},
                { url:"www.wasu.cn", node:["#flashContent","#player"],playwork:""},
                { url:"www.bilibili.com", node:["#player_module"],playwork:true},
                { url:"vip.1905.com", node:["#player"],playwork:""},
                { url:"m.v.qq.com", node:["#player"],adnode:["#vipPosterContent",".at-app-banner"],playwork:true},
                { url:"m.youku.com", node:["#player"],adnode:[".callEnd_box"],playwork:""},
                { url:"m.iqiyi.com", node:[".m-video-player-wrap"],playwork:true},
                { url:"m.mgtv.com", node:[".video-area"],adnode:[".mg-down-btn",".ad-fixed-bar"],playwork:true},
                { url:"m.bilibili.com", node:["#bofqi"],playwork:true},
                { url:"m.le.com", node:["#j-player"],adnode:["#j-vipLook",".daoliu1","#j-player"],playwork:true},
                { url:"m.tv.sohu.com", node:[".player"],adnode:[".player_film_cover"],playwork:true},
                { url:"m.pptv.com", node:[".pp-details-video"],playwork:""},
            ];
            for(let i in PlayidList) { //获得窗口ID
                if (PlayidList[i].url == config.host) {
                    let Playid = ZHwindow.zhihu.playnode = PlayidList[i].node??null;
                    let playwork = ZHwindow.zhihu.playwork = PlayidList[i].playwork;
                    let adnode = PlayidList[i].adnode
                    if(adnode){
                        adnode.forEach((item)=>{
                            if(PlayidList[i].url == "m.le.com"&&item == "#j-player"){
                                var player = commonFunction.Commonsetinterval(["#j-player"]);
                                player.then(function(playernode){
                                    playernode.style.display="block";
                                });
                                return;
                            }
                            var itemnode = commonFunction.Commonsetinterval([item]);
                            itemnode.then(function(e){
                                e.parentNode.removeChild(e);
                            });

                        })
                    }
                    break;
                }
            }           
        },
        //----------------------------------------------------------------------
        //接口列表
        Videolist:function(f){
            let ListHtml={
                "Insidehtml":"",
                "selecthtml":"",
                "mobhtml":"",
                "Outsidehtml":"",
            };
            //-----------------------------
            let v = commonFunction.GMgetValue("userplayurl");
            if(v){
                var e = v.concat(f);
            }else{
                e = f;
            }
            for (let i = 0; i < e.length; i++) {
                if (e[i].category == 1) {
                    ListHtml.Insidehtml += "<span  class='jiexi inside' id='Inside_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    ListHtml.selecthtml += "<option value='" +i + "' name='select' data-url='" + e[i].url + "'>" + e[i].name + "</option>"
                    if (e[i].showType == 3) {
                        ListHtml.mobhtml += "<span  class='mob-jiexi' id='mob_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    }
                } else {
                    ListHtml.Outsidehtml += "<span  class='jiexi outside 'title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                }

            }
            //-----------------------------
            return ListHtml
        },
        //增加接口列表
        Videoaddlist:function(){
            var addListHtml="";
            //-----------------------------
            let e = commonFunction.GMgetValue("userplayurl");
            console.log(e);
            if(e != null&&e != ""&&e != undefined){
                for (let i = 0; i < e.length; i++) {
                    if(e[i].category == 1){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>内部播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else if(e[i].category == 2){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>跳转播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else{
                        continue;
                    }
                }
            }else{
                addListHtml = '<p style="text-align: center;margin: 20px 0;">暂无数据</p>'
            }
            //-----------------------------
            return addListHtml
        },
        //----------------------------------------------------------------------
        //电脑端
        addbtn:async function(){
            console.log(this)
            const _this = this
            // await commonFunction.sleep(3000);
            await _this.Delay();
            await _this.Playid();
            _this.CheckAutoplay();
            var css = `
                        body,html{height:100%;color:#1c1f21;font:14px/1.5 PingFang SC,微软雅黑,Microsoft YaHei,Helvetica,Helvetica Neue,Tahoma,Arial,sans-serif}
                        .elevator{position:fixed;top:55%;left:0;z-index:999999996;margin-top:-140px;padding:0 16px;border-radius:0 8px 8px 0;background:rgb(134 134 134/40%);box-shadow:1px 1px 8px 1px rgb(98 99 99/34%)}
                        .elevator a{position:relative;display:block;box-sizing:border-box;width:26px;height:56px;color:#b5b9bc;text-align:center;font-size:22px;line-height:20px}
                        .elevator a+a:after{position:absolute;top:0;left:50%;margin-left:-12px;width:24px;border:1px solid #f3f5f7;content:""}
                        .elevator a:hover{color:#14191e}
                        .elevator svg{margin:14px 0;width:28px;height:28px;color:#199b6d;font-size:24px;line-height:56px}
                        .elevator svg:hover{color:#14191e}
                        .elevator a span{display:none;padding:14px 0;color:#fff;font-size:12px;line-height:14px}
                        .elevator a:hover svg{display:none}
                        .elevator a:hover span,.jiexi{display:inline-block}
                        .jiexi{margin:0 8px 10px;padding:8px 10px;width:80px;border-radius:4px;background:hsla(0,0%,89.8%,.64);color:#505050;text-align:center;font-size:12px}
                        .jiexiselect{background:#54be99;color:#fff}.zhihu-scan{display:inline-block;margin-left:8px;width:144px;text-align:center}
                        .zhihu-scan img{margin:0 5px 10px;width:140px}.zhihu-scan h1{margin:0 0 20px;font-weight:700;font-size:18px}
                        .zhihu-scan p{margin:0;color:#666;font-size:12px;line-height:26px}
                        .addlist{margin:15px 0 0;padding:0}.addlist li{height:36px;color:#333;font-size:14px;line-height:36px}
                        .addlist li span{display:inline-block;overflow:hidden;width:100px;color:#333;text-align:center;text-overflow:ellipsis;white-space:nowrap;font-size:14px}
                        .addlist li .urllist{width:214px}
                        ::-webkit-input-placeholder{color:#999;font-size:12px;line-height:16px}
                        :-moz-placeholder,::-moz-placeholder{color:#999;font-size:12px;line-height:16px}
                        :-ms-input-placeholder{color:#999;font-size:12px;line-height:16px}
                        #zhihuplay:hover .zhihuepisode{display:inline-block}
            `;
            commonFunction.GMaddStyle(css);
            var btnhtml = '<div class="elevator" id=""><a href="javascript:;" class="elevator-msg" id="PlayMain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a href="javascript:;" id="addjiexi" class="elevator-faq" ><svg t="1656638904518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7918" width="200" height="200"><path d="M469.333333 469.333333V341.333333h85.333334v128h128v85.333334h-128v128h-85.333334v-128H341.333333v-85.333334h128z m42.666667 384c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z" fill="#ffffff" p-id="7919"></path></svg><span class="">添加接口</span></a><a href="javascript:;" id="playing" class="elevator-faq" ><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector('#playing').onclick = function() {
                _this.autoplay();
                commonFunction.Toast(`${ZHwindow?.zhihu?.Delaytime??3}秒后自动解析视频`,`${ZHwindow?.zhihu?.Delaytime??3}`*1000);
            };
            //弹窗开始-------------------------------------------------
            document.querySelector('#PlayMain').addEventListener('click',function() {
                console.log("点击成功");
                var ListHtml = _this.Videolist(playList);
                //   console.log(ListHtml);
                var jiexi = commonFunction.getItem('AutoPlay') == 1 ? "checked": "";
                commonFunction.tab({
                    area: ['560', '400'],
                    id: "",
                    btn: ['取消', '保存设置'],
                    btnAlign: 'c',
                    tab: [{
                        title: '内嵌播放',
                        content: '<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">' +ListHtml.Insidehtml + '</div><div class="zhihu-scan" ><img src="https://pan.shangui.cc/f/oMd1u7/qrcode_for_gh_d572a2431b5f_258.jpg"><h1>蜗牛百宝箱</h1><p>微信扫描上方二维码</p><p>关注我</p><p>从此不迷路</p></div></div>'
                    },
                          {
                              title: '跳转播放',
                              content: `<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">${ ListHtml.Outsidehtml}</div><div class="zhihu-scan" ><img src="https://pan.shangui.cc/f/oMd1u7/qrcode_for_gh_d572a2431b5f_258.jpg"><h1>蜗牛百宝箱</h1><p>微信扫描上方二维码</p><p>关注我</p><p>从此不迷路</p></div></div>`
                          },
                          {
                              title: '解析设置',
                              content: `<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;padding-right: 15px;height: 280px;overflow-y: scroll;" id="jiexilist"><form class="zhihu-form" ><div class="zhihu-form-item"><label class="zhihu-form-label">解析接口</label><div class="zhihu-input-block"><select name="selectjiexi" lay-verify="required"  id ="selectjiexi"><option value="">直接选择或搜索选择</option>${ ListHtml.selecthtml}</select></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">延迟时间</label><div class="zhihu-input-block"><input type="number" placeholder="${ZHwindow.zhihu.Delaytime??3}" name="jiexitime" class="zhihu-input" style="display: inline-block;width: 100px;padding: 2px;margin-right: 10px;text-align: center;"><span style="font-size: 14px;color: #333;">秒</span></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">自动解析</label><div class="zhihu-input-block"><input class="checkbox" type="checkbox" ${ jiexi} name="switch"  id="autoplay" ></div></div></form></div><div class="zhihu-scan" style="width:144px;"><img src="https://pan.shangui.cc/f/oMd1u7/qrcode_for_gh_d572a2431b5f_258.jpg"><h1>蜗牛百宝箱</h1><p>微信扫描上方二维码</p><p>关注我</p><p>从此不迷路</p></div></div>`
                          }],
                    btn1: function(data) {
                        var s = data.getElementsByTagName('select');
                        for(let i= 0; i < s.length; i++ ){
                            let Index = s[i].selectedIndex;
                            let selectedid = s[i].options[Index].value;
                            let selecturl = s[i].options[Index].getAttribute("data-url");
                            commonFunction.setItem('selectedid', selectedid);
                            commonFunction.setItem('selecturl', selecturl);

                        }
                        var n = data.getElementsByTagName('input');
                        for(let i= 0; i <n.length; i++ ){
                            if(n[i].getAttribute("name") == "switch"){
                                let onswitch = document.querySelector("#autoplay+div").getAttribute("class");
                                if (onswitch.indexOf("zhihu-form-onswitch") != -1) {
                                    commonFunction.setItem('AutoPlay', '1');
                                    _this.autoplay();
                                    commonFunction.Toast(`${ZHwindow.zhihu.Delaytime}秒后自动解析视频`,`${ZHwindow.zhihu.Delaytime}`*1000);
                                } else {
                                    commonFunction.setItem('AutoPlay', '0');
                                }
                            }else if(n[i].getAttribute("name") == "jiexitime"){
                                let time = n[i].value;
                                if(time){
                                    commonFunction.setItem("Delaytime", time);
                                    ZHwindow.zhihu.Delaytime = time;
                                }
                            }
                        }
                    }
                });
                if (ZHwindow.zhihu.selectid != "") {
                    document.querySelector('#' + ZHwindow.zhihu.selectid).className += " jiexiselect";
                }
                if (commonFunction.getItem('selectedid') != null) {
                    document.querySelector('#selectjiexi').value = commonFunction.getItem('selectedid');
                }
                var inList = document.getElementsByClassName('inside');
                for (let i = 0; i < inList.length; i++) {
                    inList[i].addEventListener('click',function() {
                        if (commonFunction.getItem('selectid') != null) {
                            document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                        }
                        commonFunction.Toast('开始解析视频',2000);
                        var playObjecturl = ZHwindow.zhihu.selecturl = this.getAttribute("data-url");
                        var playid = ZHwindow.zhihu.selectid = this.getAttribute("id");
                        console.log(playid);
                        this.className = "jiexi inside jiexiselect";
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        let url;
                        if(ZHwindow.zhihu.decide == true){
                            url = playObjecturl + ZHwindow.zhihu.currently_episode.playurl;
                        }else{
                            url = playObjecturl + window.location.href;
                        }
                        console.log(url);
                        _this.GoPlay(url);
                    });
                }

                var outList = document.getElementsByClassName('outside');
                for (let i = 0; i < outList.length; i++) {
                    outList[i].addEventListener('click',function() {
                        let playObjecturl = this.getAttribute("data-url");
                        let Outsideurl = playObjecturl + window.location.href;
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        console.log(Outsideurl);
                        window.open(Outsideurl);
                    });
                }
            });
            //弹窗结束-----------------------------------------
            //自定义接口弹窗
            document.querySelector('#addjiexi').addEventListener('click',function() {
                let e = commonFunction.GMgetValue("userplayurl");
                console.log(e);
                if(e == null||e == ""||e == undefined){
                    let arr =[];
                    commonFunction.GMsetValue("userplayurl",arr);
                }
                let addListHtml = _this.Videoaddlist();
                let addjiexihtml ="";
                addjiexihtml +='<form class="zhihu-form" style="height: 325px;margin: 10px 30px 0 30px;"><div style="width:520px;display:inline-block;height:280px;overflow-y: scroll;">'
                addjiexihtml +='<div class="zhihu-form-item"><textarea placeholder="B站,1,https://jx.m3u8.tv/jiexi/?url=&#10;B站,2,https://jx.m3u8.tv/jiexi/?url=&#10;分隔符使用英文逗号,解析名字：B站;1为内部播放,2为跳转播放,解析接口：https://jx.m3u8.tv/jiexi/?url=&#10;如需添加多个解析接口，每行设置一个" class="zhihu-input zhihu-unselect" style="min-height:100px;max-height:160px;max-width:512px;min-width:512px;padding: 10px;"></textarea>'
                addjiexihtml +='<ul class="addlist"><li><span>解析名称</span><span>播放类型</span><span class="urllist">接口地址</span><span>操作</span></li>'+addListHtml+'</ul></div></div>'
                addjiexihtml +='</form>'
                commonFunction.open({
                    area: ['580', '450'],
                    title: "添加解析接口",
                    shade: 0,
                    id:"",
                    btn: ['取消', '添加接口'],
                    content:addjiexihtml,
                    btn1: function(data) {
                        var s= data.getElementsByTagName('textarea');
                        for (var i = 0; i < s.length; i++) {
                            let jiexitext = s[i].value;
                            if(jiexitext){
                                let Alljiexitext = jiexitext.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
                                Alljiexitext.forEach((item, index) => { // 删除空项
                                    if (!item) {
                                        Alljiexitext.splice(index, 1);
                                    }
                                })
                                Alljiexitext = Array.from(new Set(Alljiexitext)); // 去重
                                if(Alljiexitext){
                                    Alljiexitext.forEach((item, index) => {
                                        if (item) {
                                            let jiexiitem = item.split(/,/);
                                            let num = index+1
                                            if(jiexiitem.length == 3){
                                                if(jiexiitem[1]==1||jiexiitem[1]==2){
                                                    let j = {name:jiexiitem[0],category:jiexiitem[1],url:jiexiitem[2],showType:"1"};
                                                    let v= commonFunction.GMgetValue("userplayurl");
                                                    let l = v.push(j);
                                                    commonFunction.GMsetValue("userplayurl",v);
                                                    commonFunction.Toast("添加成功，请重新设置自动解析接口",1500)

                                                    console.log(v)
                                                }else{
                                                    commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                                }
                                            }else{
                                                commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                            }

                                        }
                                    })
                                }
                            }
                        }

                    }
                });
                var addurlList = document.getElementsByClassName('delurl');
                for (var u = 0; u < addurlList.length; u++) {
                    addurlList[u].addEventListener('click', function() {
                        let urlid = this.getAttribute("data-id");
                        let v= commonFunction.GMgetValue("userplayurl");
                        v.forEach((item, index) => {
                            if (index == urlid) {
                                v.splice(index, 1);
                            }
                        });
                        commonFunction.GMsetValue("userplayurl",v);
                        console.log(commonFunction.GMgetValue("userplayurl"));
                        commonFunction.Toast("删除成功，请重新设置自动解析接口",1500)
                        document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
                        document.querySelector('#addjiexi').click();
                    });
                }
            });
            //自定义弹窗结束
        },
        //---------------------------------------------------------------------
        //手机端
        addmobbtn:async function() {
            const _this =this
            await commonFunction.sleep(1000);
            await _this.Delay();
            await _this.Playid();
            var ListHtml = _this.Videolist(playList);
            var offautohtml = '<span id="off">关闭自动解析</span><img src="data:image/png;base64,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">'
            var onautohtml = '<span id="on">开启自动解析</span><img src="data:image/png;base64,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">'
            var autohtml;
            if (commonFunction.getItem("AutoPlay") == 1) {
                autohtml = offautohtml
            } else {
                autohtml = onautohtml
            }
            var mainhtml = '<div class="mob-main"><div class="shaw"></div><div class="listmian"><div class="listmian-tit"><p>解析接口列表</p><div class="title_right" id="autobtn">' + autohtml + '</div></div><div class="list">' + ListHtml.mobhtml + '</div><p class="tips"><span class="ico">*</span><span>开启自动解析后，最后一次选择的接口即自动解析默认接口</span></p><p class="tips"><span class="ico">*</span><span>本脚本仅学习使用，解析接口收集于网络，版权问题联系接口制作者，请勿相信解析接口显示的任何广告</span></p></div></div>'
            var btnhtml = '<div><div class="elevator"><a class="elevator-msg" id="Showmain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a  id="playing" class="elevator-faq" target="_blank"><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>' + mainhtml+'</div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            var css = `
                    body, html{font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;}
                    .elevator{position: fixed;padding: 0 10px;top: 80%;margin-top: -140px;right: 10px;z-index: 899;background: rgb(64 64 64 / 81%);box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);border-radius: 30px;}
                    .elevator a{position: relative;display: block;width: 26px;height: 56px;font-size: 22px;line-height: 20px;color: #b5b9bc;box-sizing: border-box;text-align: center;}
                    .elevator a+a:after{position: absolute;top: 0;left: 50%;margin-left: -12px;content: '';width: 24px;border: 1px solid #F3F5F7;}
                    .elevator a:hover{color: #14191e;}
                    .elevator .icon{font-size: 24px;line-height: 56px;color: #199b6d;width: 28px;height: 28px;margin: 14px 0;}
                    .elevator .icon:hover{color: #14191e;}
                    .elevator a span{display: none;padding: 14px 0;font-size: 12px;color: #fff;line-height: 14px;}
                    .elevator .elevator-msg:hover .icon,.elevator .elevator-faq:hover .icon,{display: none;}
                    .elevator .elevator-msg:hover span,.elevator .elevator-faq:hover span,{display: inline-block;}
                    .mob-main{display: none;}
                    .shaw{width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 99998;background: rgba(0,0,0,0.3);}
                    .listmian{position: fixed;width:100%;height:400px;bottom: 0;z-index: 99999;border-radius: 14px 14px 0 0;background: #fff;box-shadow: 0 -8px 10px 0 rgba(0,0,0,.09);}
                    .listmian-tit{background-color: #f5f5f5;height: 60px;position: relative;border-radius: 14px 14px 0 0;}
                    .listmian-tit p{color: #222;font-size: 18px;font-weight: 600;margin-left: 20px;line-height: 60px;float: left;}
                    .listmian-tit .title_right{float: right;margin-right: 20px;line-height: 60px;}
                    .listmian-tit .title_right span{display: inline-block;color: #222;font-size: 14px;vertical-align: middle;font-weight: 900;}
                    .title_right img{display: inline-block;width: 12px;height: 12px;margin-left: 3px;vertical-align: middle;}
                    .list{margin: 10px 20px;display:flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between;height: 240px;overflow-y: scroll;align-content: flex-start}
                    .list span{display: inline-block;padding: 10px 5px;margin: 0 0 10px 0;background-color: #f6f8fa;border-radius: .07rem;min-width: 90px;text-align: center;font-size: 12px;line-height: 18px;}
                    .jiexiselect{color: #fc5531;}
                    .tips{margin: 5px 20px;}
                    .tips span{font-size: 12px;font-weight: 700;color: #333;line-height: 14px;}
                    .tips .ico{margin-right: 5px;color: #ff6022;}

          `;
            commonFunction.GMaddStyle(css);
            _this.CheckAutoplay();
            if (commonFunction.getItem('selectid') != null) {
                document.querySelector('#' + commonFunction.getItem('selectid')).classList.add("jiexiselect");
            }

            document.querySelector('#playing').addEventListener('click',function() {
                _this.autoplay();
                commonFunction.Toast('3秒后自动解析视频',3000);

            });
            document.querySelector('#Showmain').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "block"
            });
            document.querySelector('.shaw').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "none"
            })

            document.querySelector('#autobtn').addEventListener('click',function() {
                if (commonFunction.getItem('AutoPlay') == 1) {
                    this.innerHTML = onautohtml;
                    commonFunction.setItem('AutoPlay', '0');
                } else {
                    this.innerHTML = offautohtml;
                    commonFunction.setItem('AutoPlay', '1');
                    commonFunction.Toast('请选择自动解析接口',2000);
                };
            });
            var list = document.getElementsByClassName('mob-jiexi');
            for (var i in list) {
                list[i].addEventListener('click',function() {
                    commonFunction.Toast('开始解析视频',2000);
                    if (commonFunction.getItem('selectid') != null) {
                        document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                    }
                    var playObjecturl = this.getAttribute("data-url");
                    var playid = this.getAttribute("id");
                    console.log(playid);
                    commonFunction.setItem('selectid', playid);
                    commonFunction.setItem('selecturl', playObjecturl);
                    this.classList.add("jiexiselect");
                    document.querySelector(".mob-main").style.display = "none";
                    let url = playObjecturl + window.location.href;
                    console.log(url);
                    _this.GoPlay(url);
                });
            }
        },
        //---------------------------------------------------------------
        //检查自动播放
        CheckAutoplay:function(jiexitime) {
            const _this = this
            if (commonFunction.getItem("AutoPlay") == 1) {
                _this.autoplay();
                commonFunction.Toast(`${ZHwindow?.zhihu?.Delaytime??3}秒后自动解析视频`,`${ZHwindow?.zhihu?.Delaytime??3}`*1000);

            }
        },
        //-----------------------------------------------------------------------
        //自动播放
        autoplay:async function(){
            const _this = this
            await commonFunction.sleep(`${ZHwindow?.zhihu?.Delaytime??3}`*1000);
            var f = "";
            var autoplayurl;
            if (commonFunction.getItem('selecturl') != null&&commonFunction.getItem('selecturl') != "null") {
                f = commonFunction.getItem('selecturl');
            }
            if (f != "") {
                ZHwindow.zhihu.selecturl = f;
                autoplayurl = f + config.playhref;
            } else {
                let defurl = playList[0].url;
                ZHwindow.zhihu.selecturl = defurl;
                autoplayurl = defurl + config.playhref;
            }
            _this.GoPlay(autoplayurl);
        },
        //延迟时间
        Delay:function(){
            var Delaytime = commonFunction.getItem('Delaytime') != null ? commonFunction.getItem('Delaytime'): 3;
            ZHwindow.zhihu = {
                "Delaytime":Delaytime,
                "episode":[],
                "currently_episode":"",
                "pre_episode":"",
                "next_episode":"",
                "selecturl":"",
                "selectid":"",
                "decide":false,
                "mg":false,
                "playnode":"",
                "playwork":"",
                "ismonitor":false
            }
        },
        //本功能全网独创，抄袭必究
        Getepisode:async function(){
            const Pushiqiyiepisode =()=>{
                let data = ZHwindow?.__cachePlaylist_?.main;
                if(!data) return;
                let contentType = data[0]?.contentType;
                if(!contentType) return;
                let i = 0;
                data.forEach((item,index)=>{
                    if(item.contentType ==1){
                        let json ={"index":i,"title":item.shortTitle,"playurl":item.pageUrl,"order":item.order??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                });
                return ZHwindow.zhihu.episode;
            }
            const Pushqqepisode = ()=>{
                let data = ZHwindow?.__pinia?.episodeMain?.listData;
                console.log(data);
                let currentVid = ZHwindow?.__pinia?.global?.currentVid;
                console.log(currentVid);
                if(!data||!currentVid) return;
                let newdata=[];
                data.forEach((item)=>{
                    newdata.push.apply(newdata,item);
                });
                let i = 0;
                for(let index = 0;index < newdata.length;index ++){
                    if(newdata[index].item_params.is_trailer !=1){
                        let playurl = config.playhref.replace(currentVid,newdata[index].item_params.vid);
                        let json ={"index":i,"title":newdata[index].item_params.play_title??newdata[index].item_params.title,"playurl":playurl,"order":newdata[index].item_params.title??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                };
                return ZHwindow.zhihu.episode;
            }
            const Pushyoukuepisode = ()=>{
                let data = ZHwindow?.playerAnthology?.list;
                let currentVid = ZHwindow?.__INITIAL_DATA__?.videoId;
                if(!data||!currentVid) return;
                let showId = ZHwindow?.__INITIAL_DATA__?.showId;
                let i = 0;
                for(let index = 0;index < data.length;index ++){
                    let seq = data[index].seq;
                    if(seq){
                        let playurl = config.playhref.replace(currentVid,data[index].encodevid).replace(showId,data[index].showId);
                        let json ={"index":i,"title":data[index].title,"playurl":playurl,"order":parseInt(seq)>1000?data[index].title:seq };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                };
                return ZHwindow.zhihu.episode;
            }
            const Pushmgepisode = () =>{
                let currentVid = ZHwindow?.__NUXT__?.data[0]?.videoInfo.vid;
                if(!currentVid) return;
                let request = commonFunction.request("GET",'https://pcweb.api.mgtv.com/episode/list?abroad=0&_support=10000000&version=5.5.35&page=1&size=50&video_id='+currentVid,null,null);
                request.then(function(resdata){
                    let obj = JSON.parse(resdata.data);
                    let count = obj.data.count;
                    if(count){
                        // console.log(page,currentVid,arr1)
                        if(count<=50){
                            var page = 1
                            }else{
                                page =Math.ceil(count/50)
                            }
                        let arr1 =[];
                        let QQPromise = new Promise(function(resolve, reject){
                            recurTest(0, page,currentVid,arr1);
                            function recurTest(j,p,currentVid,arr){
                                setTimeout(function(){
                                    if(++j <= p){
                                        let request2 = commonFunction.request("GET",'https://pcweb.api.mgtv.com/episode/list?abroad=0&_support=10000000&version=5.5.35&size=50&video_id='+currentVid+'&page='+j,null,null);
                                        request2.then(function(resdata2){
                                            let obj=JSON.parse(resdata2.data);
                                            if(obj.code == 200){
                                                let list =obj.data.list;
                                                arr1 = arr.concat(list)
                                                recurTest(j, p,currentVid,arr1);
                                                if(j==p){
                                                    resolve(arr1)
                                                };
                                            }else{
                                                commonFunction.Toast("获取下载列表失败");
                                            }
                                        });
                                    }
                                }, Math.random() * 100);
                            }
                        });
                        QQPromise.then((data) => {
                            let i = 0;
                            for(let index = 0;index < data.length;index ++){
                                let isIntact = data[index].isIntact;
                                if(isIntact != 3){
                                    let playurl = "https://"+window.location.host+data[index].url
                                    let json ={"index":i,"title":data[index].t2,"playurl":playurl,"order":parseInt(data[index].t4)>2000?data[index].t2:data[index].t1};
                                    ZHwindow.zhihu.episode.push(json);
                                    i++;
                                }

                            };
                        });
                    }
                });
            }
            const Pushbiliepisode = ()=>{
                let data = ZHwindow?.__INITIAL_STATE__?.epList;
                if(!data) return;
                let i = 0;
                data.forEach((item,index)=>{
                    if(item.badgeType != 1){
                        let json ={"index":i,"title":item.longTitle!=""?item.longTitle:item.titleFormat,"playurl":item.share_url,"order":item.title??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                });
                return ZHwindow.zhihu.episode;

            }
            const episode = async (site,currentplayurl)=>{
                var episode;
                if(site == "qq"){ episode = await Pushqqepisode();}
                if(site == "iqiyi"){ episode = await Pushiqiyiepisode();}
                if(site == "youku"){ episode = await Pushyoukuepisode(currentplayurl);}
                if(site == "mg"){
                    await Pushmgepisode();await commonFunction.sleep(2000);episode = ZHwindow.zhihu.episode
                }
                if(site == "bili"){ episode = await Pushbiliepisode();currentplayurl = ZHwindow?.__INITIAL_STATE__?.epInfo?.share_url}
                console.log(episode)
                if(!episode||episode==""||!currentplayurl) return;
                for( let index = 0;index <episode.length;index++ ){
                    if(currentplayurl ==episode[index].playurl){
                        let pre_index = index - 1;
                        let next_index = index + 1;
                        ZHwindow.zhihu.currently_episode = {
                            "index":episode[index].index,
                            "title":episode[index].title,
                            "playurl":episode[index].playurl,
                            "order":episode[index].order??"",
                        };
                        if(pre_index >= 0){
                            ZHwindow.zhihu.pre_episode = {
                                "index":episode[pre_index].index,
                                "title":episode[pre_index].title,
                                "playurl":episode[pre_index].playurl,
                                "order":episode[pre_index].order??"",
                            };
                        }
                        if(next_index<episode.length){
                            ZHwindow.zhihu.next_episode = {
                                "index":episode[next_index].index,
                                "title":episode[next_index].title,
                                "playurl":episode[next_index].playurl,
                                "order":episode[next_index].order??"",
                            };
                        }
                    }
                };
                ZHwindow.zhihu.decide = true;
            }

            if(config.host.indexOf("www.iqiyi.com")!=-1){
                let pathname = "http://"+window.location.host+window.location.pathname
                await episode("iqiyi",pathname);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("v.qq.com")!=-1){
                await episode("qq",config.playhref);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("v.youku.com")!=-1){
                await episode("youku",config.playhref);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("www.mgtv.com")!=-1){
                let pathname = "https://"+window.location.host+window.location.pathname
                await episode("mg",pathname);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("www.bilibili.com")!=-1){
                await episode("bili","");
                return ZHwindow.zhihu.decide;
            }

        },
        episodeHtml:async function(){
            const _this = this
            let css =`
                 ::-webkit-scrollbar {height: 6px;width: 6px;}
                 ::-webkit-scrollbar-track {background: transparent;width: 6px;}
                 ::-webkit-scrollbar-thumb {background-color: #191a20;border-radius: 4px;-webkit-transition: all 1s;transition: all 1s;width: 6px;}
                 ::-webkit-scrollbar-corner {background-color: #191a20;}
                 .zhihuepisode{display: none;position: absolute;top: 0;left: 0;width: 100%;z-index: 9999999999;}
                 .episode_main{min-height: 160px;max-height: 250px;display: flex;justify-content: space-between;padding: 20px 20px 0 20px;box-sizing: border-box;position: relative;background: linear-gradient(rgb(0 0 0 / 73%), rgb(0 0 0 / 32%), rgb(0 0 0 / 0%));}
                 .episode_main .pre_btn{position: absolute;top: 50%;transform: translate(0,-50%);}
                 .episode_main .next_btn{position: absolute;top: 50%;transform: translate(0,-50%);right: 20px;}
                 .episode_main .btn{background: #5050507a;width: 45px;border-radius: 5px;position: relative;height: 80px;}
                 .episode_main .icon{width: 30px;height: 30px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
                 .episode_main .centent{width: 100%;padding: 0 20px;margin: 0 45px;}
                 .centent .centent_header{height: 40px;line-height: 40px;}
                 .centent .title{color: #fff;font-size: 22px;font-weight: 600;width: 45%;display: inline-block;white-space: nowrap;overflow: hidden;}
                 .centent .title:first-child{margin-right:10%}
                 .centent ul{margin-top: 15px;overflow-y: auto;min-height: 80px;max-height:150px;text-align: center;}
                 .centent li{display: inline-block;margin: 0 10px 9px 0;padding: 10px 15px;background: #14161a;color: #fff;font-size: 14px;border-radius: 3px;}
                 .centent li p{overflow: hidden;white-space: nowrap;max-width: 330px;min-width: 30px;}
                 .centent li:hover p{color:#e6b673}
                 #handle_btn{text-align: center;}
                 #handle_btn .icon{height: 36px;}
                 #handle_btn .active{transform:rotate(180deg);-ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg); }
             `;
            var hasepisode = true;
            if(ZHwindow.zhihu.decide == false){
                hasepisode =await _this.Getepisode();
                commonFunction.GMaddStyle(css);
            };
            if(!hasepisode )return;
            let cententHtml ="",ListHtml="",nextHtml="",currentlyHtml="";
            let episode = ZHwindow.zhihu.episode;
            episode.forEach((item,index)=>{
                let title = item.order!=""?item.order:item.title;
                if(index == ZHwindow.zhihu.currently_episode.index){ListHtml +='<li data-index="'+item.index+'" data-playurl="'+item.playurl+'" style="color:#e6b673"><p>'+title+'</p></li>'}else{ListHtml +='<li data-index="'+item.index+'" data-playurl="'+item.playurl+'"><p>'+title+'</p></li>'};
            });
            let next_episode = ZHwindow.zhihu.next_episode;
            let currently_episode = ZHwindow.zhihu.currently_episode;
            if(next_episode) nextHtml = '<span class="title" style=" text-align: right;">下一集：'+ZHwindow.zhihu.next_episode.title+'</span>'
            if(currently_episode)currentlyHtml ='<span class="title">当前播放：'+ZHwindow.zhihu.currently_episode.title+'</span>'
            cententHtml = '<div class="centent_header">'+currentlyHtml+nextHtml+'</div><div><ul style="">'+ListHtml+'</ul></div></div>'
            let mainHtml = `<div class="zhihuepisode"><div class="episode_main">
             <div class ="pre_btn" title="上一集"><div class="btn" id="pre_btn"><svg t="1660144513194" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1042" width="200" height="200" class="icon"><path d="M803.342997 87.013896a47.908827 47.908827 0 0 0 0-70.993102A61.421574 61.421574 0 0 0 723.904429 13.256823l-3.173448 2.763971L241.23323 470.949915l-2.405678 1.842647c-1.637909 1.228431-3.173448 2.559232-4.606618 3.941218-20.013196 18.938319-20.985704 48.113566-2.86634 68.075577l2.815155 2.917525 484.820954 459.945216c22.521244 21.343997 60.090773 21.343997 82.612016 0 20.013196-18.938319 20.985704-48.113566 2.86634-68.075577l-2.86634-2.968709-446.893132-423.911227L803.342997 87.013896z" p-id="1043" fill="#ffffff"></path></svg></div></div>
             <div class="centent">
             ${cententHtml}
             <div class ="next_btn"  title="下一集"><div class="btn" id="next_btn"><svg t="1660144717762" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1256" width="200" height="200" class="icon"><path d="M220.742316 86.988416a47.894798 47.894798 0 0 1 0-70.972314A61.403588 61.403588 0 0 1 300.157623 13.252941l3.172518 2.763161 479.459681 454.795906 2.353804 1.842108c1.637429 1.228072 3.172519 2.558483 4.605269 3.940064 20.058505 18.932773 20.979559 48.099477 2.91667 68.055643l-2.8655 2.91667-484.678986 459.810532a61.250079 61.250079 0 0 1-82.587825 0 47.741289 47.741289 0 0 1-2.865501-68.055643l2.865501-2.96784 446.76227-423.787094L220.742316 86.988416z" p-id="1257" fill="#ffffff"></path></svg></div></div>
             </div>
             <div id="handle_btn" title="隐藏剧集列表"><svg t="1661155380003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2380" width="200" height="200"><path d="M512 436.7L878 648c14.3 8.3 32.7 3.3 41-11 8.3-14.3 3.3-32.7-11-41L527.8 376.5c-0.7-0.4-1.3-0.8-2-1.1-0.1 0-0.2-0.1-0.3-0.1-0.3-0.1-0.5-0.3-0.8-0.4-0.2-0.1-0.5-0.2-0.7-0.3-0.1 0-0.2-0.1-0.2-0.1-3.6-1.5-7.3-2.3-11-2.4h-1.4c-3.7 0.1-7.5 0.9-11 2.4-0.1 0-0.2 0.1-0.3 0.1-0.2 0.1-0.5 0.2-0.7 0.3-0.3 0.1-0.5 0.3-0.8 0.4-0.1 0-0.2 0.1-0.2 0.1-0.7 0.4-1.4 0.7-2 1.1L116 596c-14.3 8.3-19.2 26.7-11 41 8.3 14.3 26.7 19.2 41 11l366-211.3z" fill="#ffffff" p-id="2381"></path></svg></div>
             </div>`
            return mainHtml;
        },
        Changeepisode:function(index){
            let pre_index = index - 1;
            let next_index = index + 1;
            console.log(index,next_index)
            let episode = ZHwindow.zhihu.episode;
            ZHwindow.zhihu.currently_episode = {
                "index":episode[index].index,
                "title":episode[index].title,
                "playurl":episode[index].playurl,
                "order":episode[index].order??"",
            };
            if(pre_index >= 0){
                ZHwindow.zhihu.pre_episode = {
                    "index":episode[pre_index].index,
                    "title":episode[pre_index].title,
                    "playurl":episode[pre_index].playurl,
                    "order":episode[pre_index].order??"",
                };
            }else{ZHwindow.zhihu.pre_episode =""};
            if(next_index<episode.length){
                ZHwindow.zhihu.next_episode = {
                    "index":episode[next_index].index,
                    "title":episode[next_index].title,
                    "playurl":episode[next_index].playurl,
                    "order":episode[next_index].order??"",
                };
            }else{ZHwindow.zhihu.next_episode =""}
        },
        //本功能全网独创，抄袭必究
        //-------------------------------------------
        //执行播放
        GoPlay:async function(playurl){
            const _this =this
            var PlayID = ZHwindow.zhihu.playnode;
            if(PlayID ===null){return};
            if(ZHwindow.zhihu.playwork == true && ZHwindow.zhihu.ismonitor ==false){commonFunction.setIntervalhost();ZHwindow.zhihu.ismonitor = true};
            var iframeDivCss = "width:100%;height:100%;"
            if (config.host.indexOf("m.iqiyi.com") != -1) {
                iframeDivCss += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
            }
            let getepisodeHtml =await _this.episodeHtml();
            console.log(getepisodeHtml)
            var episodeHtml ="";
            if(getepisodeHtml)episodeHtml = getepisodeHtml;
            var videoPlayer = "<div style='" + iframeDivCss + "' id='zhihuplay'>"+episodeHtml+"<iframe id='iframe-player-zhihu' src='" + playurl + "' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
            var b = commonFunction.Videosetinterval(PlayID);
            b.then(function(bnode){
                document.querySelector(bnode).innerHTML = "";
                document.querySelector(bnode).innerHTML = videoPlayer;
                let pre_btn = document.querySelector("#pre_btn");
                let next_btn = document.querySelector("#next_btn");
                let handle_btn = document.querySelector("#handle_btn");
                let episodelist = document.querySelectorAll(".episode_main ul li");
                if(!episodelist)return;
                if(pre_btn){
                    pre_btn.onclick=async()=>{
                        let preurl = ZHwindow.zhihu.pre_episode.playurl;
                        let index = ZHwindow.zhihu.pre_episode.index;
                        if(index >= 0){
                            let Changeep = await _this.Changeepisode(index);
                            _this.GoPlay(ZHwindow.zhihu.selecturl+preurl);
                        }else{
                            commonFunction.Toast(`已经是第一集啦！！！`,3000);
                        }
                    }
                }
                if(next_btn){
                    next_btn.onclick=async()=>{
                        let nexturl = ZHwindow.zhihu.next_episode.playurl;
                        let index = ZHwindow.zhihu.next_episode.index;
                        if(index){
                            let Changeep = await _this.Changeepisode(index);
                            _this.GoPlay(ZHwindow.zhihu.selecturl+nexturl);
                        }else{
                            commonFunction.Toast(`已经是最后一集啦！！！`,3000);
                        }
                    }
                }
                episodelist.forEach((item,index)=>{
                    item.onclick=async()=>{
                        let currentindex = parseInt(item.getAttribute("data-index"));
                        let currentlyurl = item.getAttribute("data-playurl");
                        let Changeep = await _this.Changeepisode(currentindex);
                        _this.GoPlay(ZHwindow.zhihu.selecturl+currentlyurl);
                    }

                })
                if(handle_btn){
                    handle_btn.onclick=()=>{
                        let active =handle_btn.querySelector(".icon").classList.contains("active");
                        if(active ==false){
                            handle_btn.querySelector(".icon").classList.add("active");
                            handle_btn.setAttribute("titlt","展开剧集列表")
                            document.querySelector(".episode_main").style.display = "none";
                        }else{
                            handle_btn.querySelector(".icon").classList.remove("active");
                            handle_btn.setAttribute("titlt","隐藏剧集列表");
                            document.querySelector(".episode_main").style.display = "flex";
                        }

                    }
                }
            });

        }
    }
    //视频解析结束
    //优惠券开始
    const ControllerCoupon = {
        CouponidList:function(){
            var CouponidList = [
                { url:"item.taobao.com", qrname:"淘宝",nodeid:["#J_PromoPrice"],goodid:commonFunction.Getgoodid("id"),method:"taobao",action:"getlink"},
                { url:"detail.tmall.com", qrname:"天猫",nodeid:["#J_PromoPrice",".Price--normal--t-x499v",".Price--sale--1huSj6m"],goodid:commonFunction.Getgoodid("id"),method:"taobao",action:"getlink"},
                { url:"detail.tmall.hk", qrname:"天猫",nodeid:["#J_PromoPrice"],goodid:commonFunction.Getgoodid("id"),method:"taobao",action:"getlink"},
                { url:"chaoshi.detail.tmall.com", qrname:"天猫",nodeid:["#J_PromoPrice"],goodid:commonFunction.Getgoodid("id"),method:"taobao",action:"getlink"},
                { url:"item.yiyaojd.com", qrname:"京东",nodeid:["#J-summary-top"],goodid:commonFunction.geturlid(config.playhref),method:"jd",action:"getdetails"},
                { url:"item.jd.com", qrname:"京东",nodeid:["#J-summary-top"],goodid:commonFunction.geturlid(config.playhref),method:"jd",action:"getdetails"},
                { url:"npcitem.jd.hk", qrname:"京东",nodeid:["#J-summary-top"],goodid:commonFunction.geturlid(config.playhref),method:"jd",action:"getdetails"},
                { url:"s.taobao.com", qrname:"",nodeid:[".pic-link"],goodid:"",method:"",action:""},
                { url:"list.tmall.com", qrname:"",nodeid:[".product"],goodid:"",method:"",action:""},

            ];
            var Couponid = {};
            for(var i in CouponidList) { //获得窗口ID
                if (CouponidList[i].url == config.host) {
                    Couponid = {
                        qrname :CouponidList[i].qrname,
                        nodeid :CouponidList[i].nodeid,
                        goodid :CouponidList[i].goodid,
                        method :CouponidList[i].method,
                        action :CouponidList[i].action,
                    }
                    return Couponid
                    break;
                }
            }
            if(!Couponid){
                return;
            }
        },
        Getcoupon:function() {
            var Couponid = ControllerCoupon.CouponidList();
            if (Couponid.goodid != "") {
                let headers ={
                    "Content-Type": "text/html; charset=utf-8"
                }
                var request = commonFunction.request("GET","http://tool.wezhicms.com/coupon/getcoupon.php?m=" + Couponid.method + "&act=" + Couponid.action + "&goodid=" + Couponid.goodid,headers);
                request.then(function(resdata){
                    if(resdata.result == "success"){
                        var json = JSON.parse(resdata.data);
                        var code = json.code;
                        if (Couponid.method == "taobao") {
                            if (code == "0") {
                                var couponUrl =json.data.shortUrl;
                                console.log(couponUrl);
                                var couponInfo = json.data.couponInfo;
                                var couponEndTime = json.data.couponEndTime;
                                var actualPrice = json.data.actualPrice;
                                ControllerCoupon.addcoupon(Couponid,couponUrl, couponInfo, couponEndTime, actualPrice)
                            }else{
                                let u="",f="",t="",p="";
                                ControllerCoupon.addcoupon(Couponid,u, f, t, p);
                            }
                        } else if (Couponid.method == "jd") {
                            if (code == "0") {
                                var couponConditions = json.data[0].couponConditions;
                                var couponAmount = json.data[0].couponAmount;
                                var jdcouponInfo;
                                if (couponConditions != "") {
                                    jdcouponInfo = "满" + couponConditions + "元减" + couponAmount + "元"
                                } else {
                                    jdcouponInfo = "无门槛减" + couponAmount + "元"
                                }
                                var jdcouponEndTime = json.data[0].couponEndTime
                                var jdactualPrice = json.data[0].actualPrice;
                                var couponLinkRequest = commonFunction.request("GET","http://tool.wezhicms.com/coupon/getcoupon.php?m=jd&act=getUrl&url=https://item.jd.com/" +Couponid.goodid+".html");
                                couponLinkRequest.then(function(e){
                                    var result = JSON.parse(e.data);
                                    if (result.code == "0") {
                                        var couponLink = result.data.shortUrl;
                                        ControllerCoupon.addcoupon(Couponid,couponLink, jdcouponInfo, jdcouponEndTime, jdactualPrice)
                                    }else{
                                        let u="",f="",t="",p="";
                                        ControllerCoupon.addcoupon(Couponid,u, f, t, p);
                                    }
                                });
                            }else{
                                let u="",f="",t="",p="";
                                ControllerCoupon.addcoupon(Couponid,u, f, t, p);
                            }
                        }
                    }
                });
            } else {
                console.log('商品id为空！');
            }
        },
        addcoupon:function(Couponid,u, f, t, p) {
            var imgurl = "http://v.zhihupe.com/enQrcode?url=" + u
            var mainhtml,qa,cxalink,link;
            if(Couponid.qrname =="淘宝"){
                let ht = document.querySelector("#J_Title");
                qa = "淘宝";
                link ="http://tool.wezhicms.com/coupon/getscan.php?link="+u+"&goodid="+Couponid.goodid
                cxalink ='http://wxego.yhzu.cn/?r=/l&kw='+encodeURI(ht.querySelector("h3").innerText)+'&sort=0';
            }else if(Couponid.qrname =="天猫"){
                let hm = document.querySelector(".tb-detail-hd")??document.querySelector(".ItemHeader--root--DXhqHxP");
                cxalink ='http://wxego.yhzu.cn/?r=/l&kw='+encodeURI(hm.querySelector("h1").innerText)+'&sort=0';
                link ="http://tool.wezhicms.com/coupon/getscan.php?link="+u+"&platform="+encodeURIComponent("手机淘宝");
                qa = "淘宝";
            }else if(Couponid.qrname =="京东"){
                cxalink = 'http://wxego.yhzu.cn/?r=/l/jdlist&kw='+encodeURI(document.querySelector(".sku-name").innerText)+'&sort=0';
                link = "http://tool.wezhicms.com/coupon/getscan.php?link="+u+"&platform="+encodeURIComponent("手机京东或微信");
                qa = "京东";
            }

            if (f != "" && u != "") {
                mainhtml = '<div style="text-align: center;font-size: 14px;width: 25%;"><img style="width: 100%;height: auto;"src="' + imgurl + '"><p style="font-size: 12px;margin-top: 5px;">手机' + qa + '扫码领取</p></div><div style="width: 72%;"><p style="margin-bottom:10px;font-size: 18px;font-weight: 700;">优惠劵：' + f + '</p><p style="margin-bottom:10px;font-size: 14px;color:#999;">有效期至：' + t + '</p><div style="display: flex;justify-content: space-between;align-items: flex-start;"><div><span style="font-size:14px">劵后价:</span><span style="font-size: 18px;font-weight: 700;color: #F40;">￥</span><span style="font-size: 26px;font-weight: 700;font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;color: #F40;">' + p + '</span></div><a href="javascript:;" id="link"><span style="padding: 10px 25px;border-radius: 25px;background: linear-gradient(90deg, rgb(255, 100, 34), rgb(255, 0, 64));font-size: 18px;color: #fff;font-weight: 700;display: inline-block;">领券购买</span></a></div></div>'
            } else {
                mainhtml = '<div style="font-size: 20px;font-weight: 700;">暂无优惠券</div><a id="cxalink" href="javascript:;" style="border-radius: 25px;padding: 10px 20px;background: linear-gradient(90deg, rgb(255, 100, 34), rgb(255, 0, 64));font-size: 16px;color: #fff;display: inline-block;">查询同款商品优惠</a>'
            }
            var couponhtml = '<div style="margin-top: 10px;background: #f1f1f100;padding: 15px 25px 15px 10px;display:flex;align-items: center;justify-content: space-between;margin-bottom:5px;font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;">' + mainhtml + '</div>';
            var Couponnodeid= commonFunction.Commonsetinterval(Couponid.nodeid);
            Couponnodeid.then(function(node){
                let b = document.createElement('div');
                b.style ="min-width:460px";
                b.innerHTML = couponhtml;
                if(ZHwindow?.zhihu == true) return;
                node.parentNode.appendChild(b);
                ZHwindow.zhihu = true;
                let linknode = document.querySelector("#link");
                if(linknode){
                    linknode.onclick = function() {
                        window.open(link);
                    };
                }
                let cxalinknode = document.querySelector("#cxalink");
                if(cxalinknode){
                    cxalinknode.onclick = function() {
                        window.open(cxalink);
                    };
                }
            });
            let zhmLinkTextNode = commonFunction.Commonsetinterval(['.zhm_link_text']);
            zhmLinkTextNode.then(function(node){
                node.setAttribute('target',"_blank")
                node.removeAttribute('onclick')
                node.href= link
            })
            let couponValue = commonFunction.Commonsetinterval(['.coupon-value']);
            couponValue.then(function(node){
                if(Couponid.qrname==="京东"){
                    let n = node.parentNode.parentNode
                    console.log(n.innerHTML)
                    let newNode = document.createElement('div')
                    newNode.innerHTML = n.innerHTML
                    newNode.setAttribute('class',n.classList)
                    newNode.setAttribute('onclick',`window.open('${link}')`)
                    n.parentNode.appendChild(newNode)
                    n.parentNode.removeChild(n)
                }else{
                    node.removeChild(node.querySelector('canvas'))
                    let img = document.createElement('img')
                    img.src = imgurl
                    img.width = 100
                    img.height = 100
                    node.appendChild(img)
                }
            })
        },
        //淘宝搜索页
        taobaoso:function(){
            var Couponid = ControllerCoupon.CouponidList();
            var Coupontbso= commonFunction.Commonsetinterval(Couponid.nodeid);
            Coupontbso.then(function(node){
                let a = document.querySelectorAll(Couponid.nodeid[0]);
                for (var i = 0; i < a.length; i++) {
                    let nid =a[i].getAttribute("data-nid");
                    let headers ={
                        "Content-type": "application/json"
                    }
                    var request = commonFunction.request("GET","http://v2.api.haodanku.com/item_detail?apikey="+config.hdapikey+"&itemid="+nid,headers);
                    request.then(function(resdata){
                        if(resdata.result == "success"){

                            let obj = JSON.parse(resdata.data);
                            console.log(obj);
                            if(obj.code ==1&&obj.data.couponmoney!=0&&obj.data.couponmoney){
                                let b = document.createElement('div');
                                b.style="position: absolute;top: 10px;right: 5px;font-size: 14px;font: 12px/1.5 PingFangSC-Regular,Helvetica,Arial,'Microsoft Yahei',sans-serif;z-index: 99999;";
                                b.innerHTML = '<span style="background: #F40;padding: 4px;color: #fff;border: 1px solid red;border-radius: 3px 0 0 3px;font-weight: bold;">券</span><span style="border: 1px solid #ff00001f;border-radius: 0 3px 3px 0;padding: 4px;color: #F40;background: #fff;">优惠'+obj.data.couponmoney+'元</span>';
                                document.querySelector("#J_Itemlist_PLink_"+nid).appendChild(b)
                            }
                        }
                    });
                }
            });
        },

        //天猫搜索页
        tmallso:function(){
            var Couponid = ControllerCoupon.CouponidList();
            var Coupontmso= commonFunction.Commonsetinterval(Couponid.nodeid);
            Coupontmso.then(function(node){
                let a = document.querySelectorAll(Couponid.nodeid[0]);
                ControllerCoupon.tmalllist(-1,a);
            });
        },
        tmalllist:function(i,a){
            setTimeout(function(){
                if(++i < a.length){
                    let nid =a[i].getAttribute("data-id");
                    var m = document.getElementsByClassName("product")[i];
                    let headers ={
                        "Content-type": "application/json"
                    }
                    var request = commonFunction.request("GET","http://v2.api.haodanku.com/item_detail?apikey="+config.hdapikey+"&itemid="+nid,headers);
                    request.then(function(resdata){
                        if(resdata.result == "success"){
                            let obj = JSON.parse(resdata.data);
                            if(obj.code ==1&&obj.data.couponmoney!=0&&obj.data.couponmoney){
                                let b = document.createElement('div');
                                b.style="position: absolute;top: 10px;right: 5px;font-size: 14px;font: 12px/1.5 PingFangSC-Regular,Helvetica,Arial,'Microsoft Yahei',sans-serif;z-index: 99999;";
                                b.innerHTML = '<span style="background: #F40;padding: 4px;color: #fff;border: 1px solid red;border-radius: 3px 0 0 3px;font-weight: bold;">券</span><span style="border: 1px solid #ff00001f;border-radius: 0 3px 3px 0;padding: 4px;color: #F40;background: #fff;">优惠'+obj.data.couponmoney+'元</span>';
                                console.log(obj.data.couponmoney);
                                m.appendChild(b);
                            }
                            ControllerCoupon.tmalllist(i,a);
                        }
                    });
                }
            }, Math.random() * 10);
        },
    }
    //优惠券结束
    //历史价格查询开始
    var ControllerHistory ={
        History:function(){
            var Couponid = ControllerCoupon.CouponidList();
            var gid = Couponid.goodid;
            let HistoryHtml ='<div style="font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif!important;"><div style="font-size: 18px;font-weight: bold;margin: 0px;text-align: center;">商品历史价格对比查询</div><div id="history"><div><div id="historyhead" style="font-size: 14px;text-align: center;margin-top: 10px;"></div></div><div style="height:400px;" id="container"><span style="text-align: center;font-size: 24px;font-weight: bold;margin: 0 auto;display: block;line-height: 400px;">数据查询中，请稍后...</span></div></div>'
            var goodurl,Historynode;
            if(Couponid.method == "taobao"){
                if(config.host.indexOf("taobao")!=-1){
                    goodurl ="https://detail.tmall.com/item.htm?id=" + gid;
                }else{
                    goodurl ="https://"+config.host+"/item.htm?id=" + gid;
                }
                Historynode = ["#detail"];
            }else if(Couponid.method == "jd"){
                goodurl ="https://item.jd.com/"+ gid+".html";
                Historynode =[ ".product-intro"];
            }
            var addHistory= commonFunction.Commonsetinterval(Historynode);
            addHistory.then(function(node){
                let b = document.createElement('div');
                b.style = "padding:20px;border: 1px solid #eee;margin: 10px auto;position: relative;clear: both;"
                b.innerHTML = HistoryHtml;
                node.appendChild(b);
                ControllerHistory.getHistory(goodurl);
            });
        },

        getHistory:function(goodurl){
            let headers ={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'sec-ch-ua-platform': 'Windows',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Site': 'same-origin',
                'Accept-Encoding': 'gzip, deflate, br',
                'Sec-Fetch-User': '?1',
                'Connection': 'keep-alive',
                'Host': 'bijiatool-v2.manmanbuy.com',
            }
            var request = commonFunction.request("POST","https://bijiatool-v2.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx?methodName=getBiJiaInfo&jsoncallback=&p_url=" + goodurl,headers);
            request.then(function(resdata){
                if(resdata.result == "success"){
                    let obj = JSON.parse(resdata.data);
                    if(obj.jiagequshi ==undefined||obj.jiagequshiyh ==""){
                        document.querySelector("#history").innerHTML='<div style="text-align: center;margin: 20px 0;font-size: 14px;">暂未收录</div>';
                    }else{
                        let headhtml ='<div> 历史最低价格 <span  style="margin-right: 20px;">'+obj.lowerPriceyh+'元</span><span  style="margin-right: 20px;">数据来源于网络，仅供参考</span> </div>'
                        document.querySelector("#historyhead").innerHTML =headhtml;
                        ControllerHistory.Showchart(obj);
                    }
                }
            });
        },
        Showchart:function(obj){
            var strDate = obj.jiagequshiyh;
            var chartDom = document.getElementById('container');
            var myChart = echarts.init(chartDom);
            var option;
            var oldData = [];
            var data = [];
            var currentDay = new Date().setHours(0, 0, 0, 0);
            var currentDayDate = new Date(currentDay).getTime();
            var minMonth =4,xBlockNum=6;
            oldData = eval("([" + strDate + "])");
            for (var i = 1; i < oldData.length; i++) {
                var key = oldData[i][0];
                var j = i - 1;
                while (j >= 0 && oldData[j][0] > key) {
                    oldData[j + 1] = oldData[j];
                    j--;
                }
                oldData[j + 1][0] = key;
            }
            var xInterval, yInterval, yMin, yMax, xMin, xMax, maxValue, minValue, maxDate, minDate, addDate;
            addDate = minMonth * 30 * 24 * 60 * 60 * 1000; //日期不足三个月，补到120天
            var arrX = [], arrY = [];
            console.log(oldData);
            for (var l = 0; l < oldData.length;l++) {
                if (oldData[l][1] <= 0) continue;
                arrX.push(oldData[l][0]);
                arrY.push(oldData[l][1]);
                data.push([oldData[l][0], oldData[l][1],oldData[l][2]]);
            }
            console.log(oldData);
            if (data.length > 0 && data[data.length - 1][0] < currentDayDate) {
                data.push([currentDayDate, data[data.length - 1][1], ""]);
            }
            maxValue = Math.max.apply(null, arrY); //y轴最大值
            minValue = Math.min.apply(null, arrY); //y轴最小值
            maxDate = new Date(data[data.length - 1][0]).getTime(); //最大日期
            minDate = new Date(data[0][0]).getTime(); //最小日期

            yMin = minValue - ((minValue + maxValue) / 2 - minValue); //y轴开始最小值
            yMin = yMin >= 0 ? yMin : 0;
            yMax = maxValue + (maxValue - minValue) / 4;
            if (yMax === yMin) {
                yMin = yMin - yMin / 2;
                yMax = yMax + yMax / 2;
            }
            if (maxDate - minDate > addDate) {
                xMin = minDate;
            } else {
                xMin = maxDate - addDate; //往前补四个月
            }
            xMax = maxDate;
            xInterval = (xMax - xMin) / xBlockNum;
            yInterval = (yMax - yMin) / xBlockNum;
            console.log(arrX );

            option = {
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    transitionDuration: 0,
                    confine: true,
                    backgroundColor: 'transparent',
                    padding: 0,
                    borderWidth: 0,
                    borderColor: '#ec652e',
                    position: function (point, params, dom) {
                        var width = dom.clientWidth;
                        return [point[0] - width / 2, 0];
                    },
                    formatter: function (obj) {
                        if (obj.length > 0) {
                            var timeArr = ControllerHistory.getLocalTime(obj[0].data[0]).split('-');
                            var time = timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日';
                            var minPrice = obj[0].data[1];
                            var youhui = obj[0].data[2];
                            for (var i = 1; i < obj.length; i++) {
                                if (obj[i].data[1] < minPrice) {
                                    minPrice = obj[i].data[1];
                                    youhui = obj[i].data[1];
                                }
                            }

                            var retHTML = '<div style="border-radius:10px;padding:0 10px;height:22px;line-height:22px;background:#ec652e; color:#ffffff; font-size:11px;">' + time + '&nbsp;&yen;' + minPrice + '</div>';
                            if (youhui.length > 0) {

                                retHTML = '<div style="border-radius:10px;padding:0 10px;height:44px;line-height:22px;background:#ec652e; color:#ffffff; font-size:11px;">' + time + '&nbsp;&yen;' + minPrice + "<br/>" + youhui + '</div>';
                            }
                            var curDate = new Date();
                            var vDate = new Date(obj[0].data[0]);
                            if (obj[0].dataIndex === 0 && vDate > new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * 25 * 30)) {
                                if (youhui.length > 0) {
                                    retHTML = '<div style="border-radius:10px;padding:0 10px;height:22px;line-height:44px;background:#ec652e; color:#ffffff; font-size:11px;">第一次收录&nbsp;' + time + '&nbsp;&yen;' + minPrice + "<br/>" + youhui + '</div>';
                                }
                                else {
                                    retHTML = '<div style="border-radius:10px;padding:0 10px;height:22px;line-height:22px;background:#ec652e; color:#ffffff; font-size:11px;">第一次收录&nbsp;' + time + '&nbsp;&yen;' + minPrice + '</div>';
                                }
                            }
                            return retHTML;
                        }
                    },
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#ec652e'
                        }
                    }
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top: 20,
                    containLabel: true
                },
                xAxis: {
                    type: 'time',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dddddd'
                        }
                    },
                    interval: xInterval,
                    boundaryGap: false,
                    align: 'right',
                    axisLabel: {
                        align: 'right',
                        rotate: 0,
                        color: '#555555',
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function (value, index) {
                            var date = new Date(value);
                            //var texts = [(date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)), date.getDate() > 9 ? date.getDate() : ('0' + date.getDate())];
                            var texts = [(date.getMonth() + 1), date.getDate()];
                            if (index === 0) {
                                texts = [''];
                            } else if (index === (arrX.length - 1)) {
                                //texts.unshift(date.getFullYear());
                            } else {
                                //texts = [''];
                            }

                            return texts.join('-');
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#ddd'],
                            type: 'solid',
                            opacity: .8
                        }
                    },
                    min: function (value) {
                        return xMin;
                    },
                    max: function (value) {
                        return xMax;
                    }
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    interval: yInterval,
                    boundaryGap: false,
                    scale: true,
                    axisLabel: {
                        show: true,
                        inside: false,
                        showMinLabel: true,
                        showMaxLabel: true,
                        color: '#555',
                        formatter: function (value, index) {
                            if (index === 0) {
                            } else {
                                return value.toFixed(0);
                            }
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dddddd'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#ddd'],
                            type: 'solid',
                            opacity: .8
                        }
                    },
                    //最小刻度
                    min: function (value) {
                        return yMin;
                    },
                    max: function (value) {
                        return yMax;
                    }
                },
                series: [{
                    name: '价格',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: [2, 2],
                    showSymbol: false,
                    itemStyle: {
                        color: '#ff6729'
                    },
                    lineStyle: {
                        width: 2,
                        shadowColor: '#dddddd',
                        shadowBlur: 0,
                        shadowOffsetY: 0.3,
                        shadowOffsetX: 0,
                        z: 22
                    },
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: [{
                            type: 'max',
                            symbol: 'none',
                            lineStyle: {
                                color: '#888888',
                                type: 'dotted',
                                width: 0.8
                            },
                            label: {
                                position: 'end',
                                formatter: '{c}',
                                color: 'transparent'
                                //color: '#555555'
                            }
                        }, {
                            type: 'min',
                            symbol: 'none',
                            lineStyle: {
                                color: '#888888',
                                type: 'dotted',
                                width: 0.8
                            },
                            label: {
                                position: 'end',
                                formatter: '{c}',
                                color: '#555555'
                            }
                        }],
                        label: {
                            show: true,
                            position: 'left'
                        }
                    },
                    data: data
                }],
            };

            if (maxDate - minDate < addDate) {
                var lineDash = [{
                    coord: [xMin, arrY[0]],
                    lineStyle: {
                        width: 1.3
                    }
                }, {
                    coord: [arrX[0], arrY[0]]
                }];
                option.series[0].markLine.data.push(lineDash)
            }

            myChart.clear();
            myChart.setOption(option, true);
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 1,
                dataIndex: 1
            })
        },
        getLocalTime:function(nS) {
            var year = new Date(parseInt(nS)).getFullYear();
            var mouth = new Date(parseInt(nS)).getMonth() + 1;
            mouth = mouth < 10 ? '' + mouth : mouth;
            var day = new Date(parseInt(nS)).getDate() < 10 ? '' + new Date(parseInt(nS)).getDate() : new Date(parseInt(nS)).getDate();
            return year + '-' + mouth + '-' + day;
        },

    }
    //历史价格查询结束
    //短视频下载开始
    const ControllerShortvideo ={
        ShortvideoidList:function(){
            var ShortvideoidList = [
                { url:"www.douyin.com", videoid:commonFunction.geturlid(config.playhref),nodeid:[".xg-right-grid"]},
                { url:"www.kuaishou.com", videoid:commonFunction.geturlid(config.playhref),nodeid:[".right"]},
                { url:"www.ixigua.com", videoid:commonFunction.geturlid(config.playhref),nodeid:[".xg-right-grid"]},

            ];
            var Shortvideoid = {};
            for(var i in ShortvideoidList) { //获得窗口ID
                if (ShortvideoidList[i].url == config.host) {
                    Shortvideoid = {
                        videoid :ShortvideoidList[i].videoid,
                        nodeid :ShortvideoidList[i].nodeid
                    }
                    return Shortvideoid
                    break;
                }
            }
            if(!Shortvideoid){
                return;
            }
        },
        ToastDwon:function(videourl,filename,mode) {
            var m = document.createElement('div');
            m.innerHTML ='<h3 style="text-align: center;margin: 15px 0;font-size: 18px;font-weight: bold;"> 下载视频 </h3><div style="word-break: break-all;padding: 10px;background: #f1f1f1; font-size: 12px; height: 100px;overflow-y: scroll;box-sizing: border-box;margin-bottom: 10px;border-radius: 5px;"><p>'+videourl+'</p> </div><div style="display: flex;float: right;font-size: 14px;"><div id="close" style="margin-right: 15px;">关闭</div> <div> <a  id="videofile">下载</a></div></div><div style="float: left;font-size: 14px;"><div> <a href="'+videourl+'" target="_blank">浏览器打开</a></div></div>';
            m.setAttribute('id','dwon');
            m.style.cssText = "max-width: 480px;min-width: 150px;padding: 0 25px;height: 200px;color: #323442;line-height: 20px;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999998;background: #fff;font-size: 16px;box-shadow: 1px 1px 50px rgb(0 0 0 / 40%);font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;";
            document.body.appendChild(m);
            document.querySelector("#close").addEventListener('click',function() {
                document.body.removeChild(document.querySelector("#dwon"))
            })
            document.querySelector("#videofile").addEventListener('click',function() {
                commonFunction.Toast("创建下载需要时间,长时间未创建，点击浏览器打开,右键另存为",4000);
                if(mode ==1){
                    GM_download({
                        url:videourl+'.mp4',
                        name: filename,
                        saveAs: true, //布尔值，显示"保存为"对话框
                        onerror: function (error) {
                            commonFunction.Toast("下载出错,点击浏览器打开手动保存",3000)
                        },
                        onprogress: (pro) => {
                        },
                        ontimeout: () => {
                            //如果此下载由于超时而失败，则要执行的回调
                            commonFunction.Toast("下载超时,点击浏览器打开手动保存",3000)
                        },
                        onload: () => {
                            commonFunction.Toast(filename+"下载完成",3000)
                        }
                    })
                }else{
                    fetch(videourl+'.mp4').then(res => res.blob()).then(blob => {
                        const a = document.createElement('a');
                        document.body.appendChild(a)
                        a.style.display = 'none'
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = filename;
                        a.click();
                        document.body.removeChild(a)
                        window.URL.revokeObjectURL(url);
                    });
                }
            })
        },//公共下载弹窗结束
        //抖音下载开始
        douyinbtn:function() {
            var Shortvideoid = ControllerShortvideo.ShortvideoidList();
            let downhtml = '<div class="xgplayer-icon"><div class="xgplayer-setting-label"><span class="xgplayer-setting-title">下载</span></div></div>';
            var douyin= commonFunction.Commonsetinterval(Shortvideoid.nodeid);
            douyin.then(function(node){
                var b = document.createElement('xg-icon');b.innerHTML = downhtml;
                b.setAttribute("class","xgplayer-autoplay-setting automatic-continuous");
                b.setAttribute("id","downvideo");
                node.appendChild(b);

                ControllerShortvideo.getdouyinvideo(Shortvideoid.videoid);
            });
        },
        getdouyinvideo:function(d){
            document.querySelector('#downvideo').addEventListener('click',function() {
                commonFunction.Toast("正在获取视频文件",3000)
                if (d != "") {
                    var request = commonFunction.request("GET","https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + d,null,null);
                    request.then(function(resdata){
                        if(resdata.result == "success"){
                            var json=JSON.parse(resdata.data);
                            console.log(json)
                            if(json.status_code==0){
                                let vid = json.item_list[0].video.vid;
                                if(vid){
                                    var filename = d+".mp4";
                                    var url = "https://aweme.snssdk.com/aweme/v1/play/?video_id="+vid+"&ratio=1080p&line=0";
                                    commonFunction.Toast("视频获取成功",3000)
                                    ControllerShortvideo.ToastDwon(url,filename,1);
                                }else{
                                    commonFunction.Toast("视频文件获取失败",3000)
                                }
                            }
                        }
                    });
                } else {
                    console.log('视频id为空！');
                }
            });
        },//抖音下载结束
        //快手下载开始
        kuaishoubtn:function() {
            var Shortvideoid = ControllerShortvideo.ShortvideoidList();
            var kuaishou= commonFunction.Commonsetinterval(Shortvideoid.nodeid);
            kuaishou.then(function(node){
                var b = document.createElement('div');
                b.innerHTML = '<div style="color:#fff">下载</div>';
                b.setAttribute("class","kwai-player-volume-container player-bar-volume show-volume-slide");
                b.setAttribute("data-v-0c78ed39","");
                b.setAttribute("data-v-5037d859","");
                b.setAttribute("data-v-2475c26c","");
                b.setAttribute("data-v-56544f8e","");
                b.setAttribute("id","downvideo");
                node.insertBefore(b,node.childNodes[0]);
                if(config.playhref.indexOf("short-video")!=-1){
                    var e = document.querySelector(".total")
                    e.style.right ="180px"
                    var f = document.querySelector(".player-bar-progress")
                    f.style.width ="calc(100% - 318px)";
                }
                ControllerShortvideo.getksvideo(Shortvideoid.videoid)
            });
        },
        getksvideo:function(d){
            document.querySelector('#downvideo').addEventListener('click',function() {
                commonFunction.Toast("正在获取视频文件",1000)
                let videonode = document.querySelector("video")
                let src =videonode.getAttribute("src")
                let pausebtn = document.querySelector(".pause-icon");
                if(pausebtn != null){
                    pausebtn.click();
                }

                if(src.indexOf("blob:") != -1){
                    let params ='{"operationName":"visionVideoDetail","variables":{"photoId":"'+d+'","page":"detail"},"query":"query visionVideoDetail($photoId: String, $type: String, $page: String, $webPageArea: String) {\\n  visionVideoDetail(photoId: $photoId, type: $type, page: $page, webPageArea: $webPageArea) {\\n    status\\n    type\\n    author {\\n      id\\n      name\\n      following\\n      headerUrl\\n      __typename\\n    }\\n    photo {\\n      id\\n      duration\\n      caption\\n      likeCount\\n      realLikeCount\\n      coverUrl\\n      photoUrl\\n      liked\\n      timestamp\\n      expTag\\n      llsid\\n      viewCount\\n      videoRatio\\n      stereoType\\n      croppedPhotoUrl\\n      manifest {\\n        mediaType\\n        businessType\\n        version\\n        adaptationSet {\\n          id\\n          duration\\n          representation {\\n            id\\n            defaultSelect\\n            backupUrl\\n            codecs\\n            url\\n            height\\n            width\\n            avgBitrate\\n            maxBitrate\\n            m3u8Slice\\n            qualityType\\n            qualityLabel\\n            frameRate\\n            featureP2sp\\n            hidden\\n            disableAdaptive\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    tags {\\n      type\\n      name\\n      __typename\\n    }\\n    commentLimit {\\n      canAddComment\\n      __typename\\n    }\\n    llsid\\n    danmakuSwitch\\n    __typename\\n  }\\n}\\n"}';
                    let headers = {
                        "Content-type": "application/json"
                    };
                    var request = commonFunction.request("POST","https://www.kuaishou.com/graphql",headers,params);
                    request.then(function(resdata){
                        if(resdata.result == "success"){
                            let obj=JSON.parse(resdata.data);
                            let src=obj.data.visionVideoDetail.photo.photoUrl;
                            commonFunction.Toast("视频获取成功",1000)
                            ControllerShortvideo.ToastDwon(src,d,"")
                        }
                    })
                }else{
                    commonFunction.Toast("视频获取成功",1000)
                    ControllerShortvideo.ToastDwon(src,d,"")
                }
            })
        },
        //快手下载结束
        //西瓜视频下载开始
        xiguabtn:function() {
            setTimeout(function(){
                var Shortvideoid = ControllerShortvideo.ShortvideoidList();
                var xigua= document.querySelector(Shortvideoid.nodeid[0]);
                console.log(xigua)
                if(xigua){

                    let btnHTML = '<div id="downvideo" class="playerControlsItemContainer" ><div class="xgplayer-control-item control_definition common-control-item"><div class="xgplayer-control-item__entry"><div class="xgpcPlayer_textEntry"><span>下载</span></div></div></div></div>';
                    xigua.insertAdjacentHTML('afterbegin', btnHTML);
                    ControllerShortvideo.getxgvideo(Shortvideoid.videoid)
                };
            },3000);
        },
        getxgvideo:function(d){
            document.querySelector('#downvideo').addEventListener('click',function() {
                commonFunction.Toast("正在获取视频文件",1000);
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("POST","http://47.99.158.118/video-crack/v2/parse?content="+config.playhref,headers,null);
                request.then(function(resdata){
                    if(resdata.result == "success"){
                        let obj=JSON.parse(resdata.data);
                        if(obj.code == 0){
                            commonFunction.Toast("视频获取成功",1000)
                            ControllerShortvideo.ToastDwon(obj.data.url,d)
                        }else {
                            commonFunction.Toast("此视频不支持解析")
                        }
                    }
                })
            })
        }
        //西瓜视频下载结束

    }
    //短视频下载结束
    //aria2设置开始
    const Controlleraria2 = {
        aria2set:function(b){
            let css= `
            .layui-form{display: flex;margin-top: 20px;}
            .layui-form-label{box-sizing: content-box;}
            .layui-input-block p{font-size:12px}
            .layui-form-item{margin-bottom:5px}
            .layui-input-block{min-height:auto;}
            .main-left{width: 367px;}
            .zhihu-scan{width:180px;display:inline-block;text-align: center;margin-right: 40px;}
            .zhihu-scan img{width: 140px;margin: 0 5px 10px 5px;}
            .zhihu-scan h1{font-size: 18px;font-weight: bold;margin: 0px 0 20px 0;}
            .zhihu-scan p{margin: 0;color: #666;font-size: 14px;}
         `;
            commonFunction.GMaddStyle(css);
            document.querySelector("#aria2set") .addEventListener('click',function() {
                let rpc="ws://localhost:6800/jsonrpc";
                if(commonFunction.getItem("rpc")!=null){
                    rpc= commonFunction.getItem("rpc")
                }
                let token="";
                if(commonFunction.getItem("token")!=null){
                    token= commonFunction.getItem("token")
                }
                let mulu="D:/";
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    mulu= commonFunction.getItem("mulu")
                }
                let plcode="";
                if(commonFunction.getItem("plcode")!=null){
                    plcode= commonFunction.getItem("plcode")
                }
                let contenthtml ="";
                contenthtml +='<form class="zhihu-form" style="height: 325px;"><div class="main-left">'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">RPC地址</label><div class="zhihu-input-inline"><input name="rpc" value="'+rpc+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>Aria2配置:ws://localhost:6800/jsonrpc<br>Motrix配置:ws://localhost:16800/jsonrpc</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">token</label><div class="zhihu-input-inline"><input name="token" value="'+token+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>没有请留空</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">保存地址</label><div class="zhihu-input-inline"><input name="mulu" value="'+mulu+'"  placeholder="留空使用默认目录" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>留空使用默认目录</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">验证码</label><div class="zhihu-input-inline"><input name="plcode" value="'+plcode+'"  placeholder="请输入验证码" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>批量下载需要关注公众号</p></div></div>'
                contenthtml +='</div><div class="zhihu-scan"><img src="http://tool.wezhicms.com/img/1-21121500044Q94.jpg"><h1>验证码获取</h1>'
                contenthtml +='<div style="font-size: 12px;color: #000;margin-left:15px;text-align: left;"><div style="line-height: 3;">1.关注公众号【蜗牛百宝箱】</div><div style="line-height: 2;">2.回复大写字母‘B’获取验证码</div><div style="line-height: 3;">3.将验证码输入左边输入框中</div></div></div></form>'
                commonFunction.open({
                    area: ['580', '450'],
                    title: "批量下载设置",
                    shade: 0,
                    id:"biliset",
                    btn: ['取消', '保存设置'],
                    content:contenthtml,
                    btn1: function(data) {
                        var n = data.getElementsByTagName('input');
                        for(let i= 0; i <n.length; i++ ){
                            if (n[i].getAttribute("name") == "rpc") {
                                commonFunction.setItem("rpc",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "token") {
                                commonFunction.setItem("token",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "mulu") {
                                commonFunction.setItem("mulu",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "plcode") {
                                if(n[i].value != ""){
                                    commonFunction.setItem("plcode",n[i].value);
                                }else{
                                    commonFunction.setItem("plcode","");
                                    commonFunction.Toast('请在脚本设置里输入验证码！');
                                }
                            }
                        }
                    }
                });
            });
            document.querySelector("#all") .addEventListener('click',function() {

                b.forEach(function(element) {
                    element.checked = true;

                })
                commonFunction.Toast("已经全部选择",3000)
            });
            document.querySelector("#delall") .addEventListener('click',function() {

                b.forEach(function(element) {
                    element.checked = false;
                });
                commonFunction.Toast("已经全部取消选择",3000)
            });
        },
        addUri:function(u,t) {
            //配置
            return new Promise(function(resolve, reject) {
                var wsurl = commonFunction.getItem("rpc");;
                var uris = [u];
                var token="";
                var filename = t
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    var mulu= commonFunction.getItem("mulu")
                    }else{
                        mulu ="D:/"
                    }
                var options = {
                    "dir":mulu,
                    "max-connection-per-server": "16",
                    "header": [ `User-Agent: ${config.UA}`, `Referer:https://${config.playhref}`,`Cookie: ${document.cookie}` ]
                };
                if (filename != "") {
                    options.out = filename;
                }
                var json = {
                    "id": "zhihu",
                    "jsonrpc": '2.0',
                    "method": 'aria2.addUri',
                    "params": [uris, options],
                };
                console.log(json)
                if (token != "") {
                    json.params.unshift("token:" + token); // 坑死了，必须要加在第一个
                }
                var ws = new WebSocket(wsurl);

                ws.onerror = event => {
                    console.log(event);
                    commonFunction.Toast('连接错误, Aria2 连接错误，请检查RPC设置！');
                };
                ws.onopen = () => { ws.send(JSON.stringify(json)); }

                ws.onmessage = event => {
                    let received_msg = JSON.parse(event.data);
                    console.log(received_msg);
                    if (received_msg.error !== undefined) {
                        if (received_msg.error.code === 1)commonFunction.Toast('通过RPC连接失败', '请打开控制台查看详细错误信息，返回信息：' + received_msg.error.message);
                    }
                    resolve();
                    switch (received_msg.method) {
                        case "aria2.onDownloadStart":
                            commonFunction.Toast("Aria2 发送成功, "+filename+" 已经开始下载！",1000);
                            ws.close();
                            break;
                        default:
                            break;
                    }
                };
            });
        },
        plaria2:function(i,arr){
            setTimeout(function(){
                if(++i < arr.length){
                    Controlleraria2.addUri(arr[i].url,arr[i].title)
                    Controlleraria2.plaria2(i,arr);
                    console.log(i,arr.length)
                }
            }, Math.random() * 1000);

        }
    };
    //aria2设置结束
    //Bilibili下载开始
    const ControllerBilibili ={
        Addlist:async function(){
            const listHtml = ()=>{
                var Bilihtml="";
                var episodes = ZHwindow?.__INITIAL_STATE__?.sections[0]?.episodes;
                if(!episodes){
                    let aid = ZHwindow?.__INITIAL_STATE__?.videoData?.aid;
                    if(!aid)return;
                    let videolist = ZHwindow?.__INITIAL_STATE__?.videoData?.pages;
                    for (let i = 0; i < videolist.length; i++) {
                        Bilihtml += '<li><a href="javascript:void(0)" class="router-link-active" ><div class="clickitem"><div class="link-content"><input  data-aid="'+aid+'" data-cid="'+videolist[i].cid+'" title="'+videolist[i].part+'" type="checkbox" style="margin-right:5px"> <span class="page-num">P'+videolist[i].page+'</span><span class="part">'+videolist[i].part+'</span></div><div class="duration bilidown" data-aid="'+aid+'" data-cid="'+videolist[i].cid+'" title="'+videolist[i].part+'">下载</div></div></a></li>';
                    }
                }else {
                    for (let i = 0; i < episodes.length; i++) {
                        Bilihtml += '<li><a href="javascript:void(0)" class="router-link-active" ><div class="clickitem"><div class="link-content"><input  data-aid="'+episodes[i].aid+'" data-cid="'+episodes[i].cid+'" title="'+episodes[i].title+'" type="checkbox" style="margin-right:5px"><span class="part">'+episodes[i].title+'</span></div><div class="duration bilidown" data-aid="'+episodes[i].aid+'" data-cid="'+episodes[i].cid+'" title="'+episodes[i].title+'">下载</div></div></a></li>';
                    }

                }
                return Bilihtml;
            }
            var AddBi= commonFunction.Commonsetinterval(["#danmukuBox"]);
            AddBi.then(async function(node){
                await commonFunction.sleep(3000);
                let Bilihtml = await listHtml();
                if(!Bilihtml){commonFunction.Toast("获取下载列表失败,刷新重试");return;}
                let dataV = node.attributes[2]?.name??"data-v";
                let downhtml = '<div id ="downBox" class="multi-page report-wrap-module report-scroll-module" '+dataV+' style="margin:0 0 10px 0;border-radius: 6px;background: #F1F2F3;"><div class="head-con"><div class="head-left"><h3>下载列表</h3></div><div class="head-right"><span class="next-button" id="sanlian"><span class="txt" style="color: #00a1d6;">一键三连</span></span></div></div><div class="cur-list"><ul class="list-box">'+Bilihtml+'</ul></div><div style="display: flex;justify-content: space-between;height: 42px;line-height: 42px;margin: 0px 15px;font-size: 14px;font-weight: bold;border-top: 1px solid #dadada;"><div><span style="margin-right: 20px;" id="all">全选</span><span id="delall">重置</span></div><div><span style="margin-right: 20px;" id="aria2set">设置</span><a id="pldown"><span>批量下载</span></a></div></div></div>';
                node.insertAdjacentHTML('afterEnd', downhtml);
                ControllerBilibili.bilibilidown();
            });
        },
        bilibilidown:function(){
            var inu = document.querySelector("#downBox");
            var b=inu.getElementsByTagName('input');
            Controlleraria2.aria2set(b);
            document.querySelector("#sanlian") .addEventListener('click',function() {
                console.log("一键三连");
                document.querySelector(".like").click();
                document.querySelector(".coin").click();
            });

            document.querySelector("#pldown") .addEventListener('click',function() {
                let passwordCode = commonFunction.getItem("plcode");
                if (passwordCode !=""&&passwordCode !=null) {
                    let headers = {
                        "Content-Type": "text/html; charset=utf-8"
                    };
                    let request = commonFunction.request("GET","http://tool.zhihupe.com/bdwpcs.php?m=BILIBILI&author="+author+"&PWD="+passwordCode,headers,null);
                    request.then(function(resdata){
                        let json=JSON.parse(resdata.data);
                        if(json.error == 1){
                            let arr =[];
                            b.forEach(function(element) {
                                if(element.checked == true){
                                    let aid = element.getAttribute("data-aid");
                                    let cid = element.getAttribute("data-cid");
                                    let title = element.getAttribute("title");
                                    let json ={
                                        "aid": aid,
                                        "cid": cid,
                                        "title": title,
                                    };
                                    arr.push(json);
                                }
                            })
                            if(arr.length == 0){
                                commonFunction.Toast("请选择需要下载的视频",3000)
                            }else{
                                ControllerBilibili.bipldown(arr);
                            }
                        }else if(json.error == -2){
                            let msg =json.msg
                            commonFunction.Toast(msg);
                        }else {
                            commonFunction.Toast('服务器请求失败，请重试！');
                        }
                    })
                }else {
                    commonFunction.Toast('请在脚本设置里输入验证码！');
                }
            });
            let biliList = document.getElementsByClassName('bilidown');
            console.log(biliList);
            for (var i = 0; i < biliList.length; i++) {
                biliList[i].addEventListener('click',function() {
                    let aid = this.getAttribute("data-aid");
                    let cid = this.getAttribute("data-cid");
                    let title = this.getAttribute("title");
                    let headers = {
                        "Content-type": "application/json"
                    };
                    let request = commonFunction.request("GET","https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112",headers,null);
                    request.then(function(resdata){
                        let obj=JSON.parse(resdata.data);
                        if(obj.code == 0){
                            window.open(obj.data.durl[0].url,false);
                            console.log(obj)
                        }else{
                            commonFunction.Toast("获取下载链接失败");
                        }
                    })

                });
            }
        },
        //批量下载相关代码
        bipldown:function(a){
            let pldownarr=[];
            for (var i = 0; i < a.length; i++) {
                let title = i+1+"、"+a[i].title;
                title =title.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g,"_");
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("GET","https://api.bilibili.com/x/player/playurl?avid="+a[i].aid+"&cid="+a[i].cid+"&qn=112",headers,null);
                request.then(function(resdata){
                    let obj=JSON.parse(resdata.data);
                    if(obj.code == 0){
                        let json ={
                            "url": obj.data.durl[0].url,
                            "title":title+".flv",
                        };
                        pldownarr.push(json);
                        if(pldownarr.length==a.length){
                            console.log(pldownarr);
                            Controlleraria2.plaria2(-1,pldownarr);
                        }
                    }else{
                        commonFunction.Toast("获取下载链接失败");
                    }
                })
            }
        },

    };
    //Bilibili下载结束
    //喜马拉雅下载开始
    const Controllerximalaya = {
        addximalaya:async function(){
            //    await commonFunction.sleep(3000);
            if(config.playhref.indexOf("www.ximalaya.com/album")!= -1){
                let albumId = commonFunction.geturlid(config.playhref);
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("GET","https://www.ximalaya.com/revision/album/v1/getTracksList?albumId="+albumId+"&pageNum=1",headers,null);
                request.then(function(resdata){
                    let obj=JSON.parse(resdata.data);
                    if(obj.ret == 200){
                        let trackTotalCount =obj.data.trackTotalCount;
                        if(trackTotalCount<=100){
                            var page = 1
                            }else{
                                page =Math.ceil(trackTotalCount/100)
                            }
                        let arr1 =[];
                        return new Promise(function(resolve, reject){
                            recurTest(0, page,albumId,arr1);
                            function recurTest(j,length,albumId,arr){
                                setTimeout(function(){
                                    if(++j <= length){
                                        let headers = {
                                            "Content-type": "application/json"
                                        };
                                        let request2 = commonFunction.request("GET","https://www.ximalaya.com/revision/album/v1/getTracksList?albumId="+albumId+"&pageSize=100&pageNum="+j+"&sort=0",headers,null);
                                        request2.then(function(resdata2){
                                            let obj=JSON.parse(resdata2.data);
                                            if(obj.ret == 200){
                                                let tracks =obj.data.tracks;
                                                arr1 = arr.concat(tracks)
                                                console.log(arr1)
                                                recurTest(j, length,albumId,arr1);
                                                if(j==length){
                                                    resolve(arr1)
                                                };
                                            }else{
                                                commonFunction.Toast("获取下载列表失败");
                                            }
                                        });
                                        console.log(j, length,albumId)
                                    }
                                }, Math.random() * 100);
                            }
                        }).then((listarr) => {
                            let downhtml=""

                            for (var i = 0; i < listarr.length; i++) {

                                downhtml += '<li class="_nO"><input data-trackId="'+listarr[i].trackId+'" title="'+listarr[i].title+'" type="checkbox" style="margin-right:5px;position: relative;top: 1px;"><div class="text _nO" style="max-width: 160px;"><span style="font-size: 12px;" class="title _nO">'+listarr[i].index+'.'+listarr[i].title+'</span></div><div class="right _nO" style="margin: 0 5px;width: 35px;"><a class="ximadown" data-trackId="'+listarr[i].trackId+'" title="'+listarr[i].title+'"  href="javascript:void(0)" ><span class="time _nO" style="font-size: 12px;">下载</span></a></div></li>';
                            }
                            var xm= commonFunction.Commonsetinterval([".xui-card"]);
                            xm.then(function(node){
                                let listHTML ='<div class="xui-card" id="ximadown" style="font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;"><div class="xui-card" style="margin-bottom: 15px;"><div style="margin: 0;" class="xui-card-head border"><span class="xui-card-head-title" style="display: block;"><i style="color: #666;" class="xuicon xuicon-quanjubofangqi-xiazai font-icon-18"></i></i>下载列表<div  class="xui-card-extra"><a rel="nofollow" style="font-weight: bold;" class="xui-card-extra-title Tj_" href="javascript:void(0)"><span  id="aria2set">设置</span></a></div></span></div><div style="margin: 0;max-height: 300px;overflow-y: scroll;" class="xui-card-body"><div class="sound-list  H_g"><ul id="downBox">'+downhtml+'</ul></div></div><div style="display: flex;justify-content: space-between;height: 42px;line-height: 42px;font-size: 14px;font-weight: bold;"><div><span style="margin-right: 20px;" id="all">全选</span><span id="delall">重置</span></div><div><a id="pldown"><span>批量下载</span></a></div></div></div></div>';
                                node.insertAdjacentHTML('afterEnd',listHTML);
                                Controllerximalaya.ximalayadown();
                            });
                        })
                    }
                });
            }else{
                let list = document.getElementsByClassName('album-cover');
                if(list!=null){
                    for (var i in list) {
                        list[i].addEventListener('click',function() {
                            let url =this.getAttribute("href");
                            const a = document.createElement('a');
                            document.body.appendChild(a)
                            a.style.display = 'none'
                            a.href = url;
                            a.target="_blank"
                            a.click();
                            window.location.reload();
                        })
                    }
                }
            }
        },
        ximalayadown:function(){
            var inu = document.querySelector("#downBox");
            var b=inu.querySelectorAll('input');
            Controlleraria2.aria2set(b);
            document.querySelector("#pldown").addEventListener('click',function() {
                let passwordCode = commonFunction.getItem("plcode");
                if (passwordCode !=""&&passwordCode !=null) {
                    let headers = {
                        "Content-Type": "text/html; charset=utf-8"
                    };
                    let request = commonFunction.request("GET","http://tool.zhihupe.com/bdwpcs.php?m=BILIBILI&author="+author+"&PWD="+passwordCode,headers,null);
                    request.then(function(resdata){
                        var json=JSON.parse(resdata.data);
                        if(json.error == 1){
                            let arr =[];
                            b.forEach(function(element) {
                                if(element.checked == true){
                                    let trackId = element.getAttribute("data-trackId");
                                    let title = element.getAttribute("title");
                                    let json ={
                                        "trackId": trackId,
                                        "title": title,
                                    };
                                    arr.push(json);
                                }
                            })
                            if(arr.length == 0){
                                commonFunction.Toast("请选择需要下载的音频",3000)
                            }else{
                                console.log(arr)
                                Controllerximalaya.ximapldown(arr);
                            }
                        }else if(json.error == -2){
                            let msg =json.msg
                            commonFunction.Toast(msg);
                        }else {
                            commonFunction.Toast('服务器请求失败，请重试！');
                        }

                    });
                }else {
                    commonFunction.Toast('请在脚本设置里输入验证码！');
                }
            });
            let ximaList = document.getElementsByClassName('ximadown');
            console.log(ximaList);
            for (var i = 0; i < ximaList.length; i++) {
                ximaList[i].addEventListener('click',function() {
                    let trackId = this.getAttribute("data-trackId");
                    let title = this.getAttribute("title");
                    commonFunction.Toast('正在获取下载链接')
                    let headers = {
                        "Content-type": "application/json"
                    };
                    let request = commonFunction.request("GET",'https://mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo/'+new Date().getTime()+'?device=web&trackId='+trackId,headers,null);
                    request.then(function(resdata){
                        let obj = JSON.parse(resdata.data);
                        console.log(obj)
                        if(obj.ret == 0){
                            let playUrlList = obj.trackInfo?.playUrlList??"";
                            if(playUrlList ==""){commonFunction.Toast('链接获取失败，普通用户无法获取部分VIP音频');return}
                            let downUrl =playUrlList[0]?.url;
                            let str1 = downUrl.replaceAll('-','+');

                            let str2 = str1.replaceAll('_','/');

                            let num = str2.length%4;

                            if(num){

                                str2 += '===='.substr(num);
                            }

                            let url = CryptoJS.AES.decrypt({

                                ciphertext: CryptoJS.enc.Base64.parse(str2)

                            }, CryptoJS.enc.Hex.parse("aaad3e4fd540b0f79dca95606e72bf93"), {

                                mode: CryptoJS.mode.ECB,

                                padding: CryptoJS.pad.Pkcs7

                            }).toString(CryptoJS.enc.Utf8);

                            console.log(url);

                            if(url){

                                GM_download(url,obj.trackInfo.title+'.mp3');

                            }else{
                                commonFunction.Toast('解密地址失败');
                            }
                        }else{
                            commonFunction.Toast("获取下载链接失败");
                        }

                    });
                });
            }
        },
        ximapldown:function(arr){
            let pldownarr =[]
            for (var i = 0; i < arr.length; i++) {
                let title = i+1+"、"+arr[i].title;
                title =title.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g,"_")+".m4a";
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("GET",'https://mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo/'+new Date().getTime()+'?device=web&trackId='+arr[i].trackId,headers,null);
                request.then(function(resdata){
                    let obj = JSON.parse(resdata.data);
                    console.log(obj)
                    if(obj.ret == 0){
                        let playUrlList = obj.trackInfo?.playUrlList??"";
                        if(playUrlList ==""){commonFunction.Toast('链接获取失败，普通用户无法获取部分VIP音频');return}
                        let downUrl =playUrlList[0]?.url;
                        let str1 = downUrl.replaceAll('-','+');

                        let str2 = str1.replaceAll('_','/');

                        let num = str2.length%4;

                        if(num){

                            str2 += '===='.substr(num);
                        }

                        let url = CryptoJS.AES.decrypt({

                            ciphertext: CryptoJS.enc.Base64.parse(str2)

                        }, CryptoJS.enc.Hex.parse("aaad3e4fd540b0f79dca95606e72bf93"), {

                            mode: CryptoJS.mode.ECB,

                            padding: CryptoJS.pad.Pkcs7

                        }).toString(CryptoJS.enc.Utf8);

                        console.log(url);
                        url
                        if(url){

                            //  addUri(decrypted,title)
                            let json ={
                                "url": url,
                                "title": title,
                            };
                            pldownarr.push(json)
                            if(pldownarr.length==arr.length){
                                console.log(pldownarr);
                                Controlleraria2.plaria2(-1,pldownarr);
                            }
                        }else{
                            commonFunction.Toast('解密地址失败');
                        }
                    }else{
                        commonFunction.Toast("获取下载链接失败");
                    }
                });
            }
        },
    }
    //喜马拉雅下载结束
    //-----------------------------------------------------------------------
    //教育盘论坛开始
    const Controllerforum = {
        jiaoyupan:function(){
            var jiaoyupannode= commonFunction.Commonsetinterval([".copy_pswd"]);
            jiaoyupannode.then(function(node){
                let v = node.getAttribute("onclick");
                let data = v.split(",");
                let aid = data[0].split("'")[1];
                let formhash = data[1].split("'")[1];
                let href = window.location.origin + "/plugin.php?id=threed_attach:downld&aid=" + aid + "&formhash=" + formhash;
                console.log(href)
                let btnhtml='<div style="position: fixed;bottom: 100px;right: 50px;z-index: 99999999;background: #54be99;padding: 10px 20px;font-size: 18px;font-weight: bold;border-radius: 8px;box-shadow: 0px 0px 8px 1px #919191;"><a href='+href+' style="color: #fff;">点击此处免费下载</a></div>';
                document.body.insertAdjacentHTML('afterEnd',btnhtml);
            });
        }
    }

    //教育盘论坛结束
    //------------------------------------------------------------------------
    //文库下载开始
    const Controllerdocs = {
        jsPDF: function(){
            if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
            commonFunction.GMaddScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
            return unsafeWindow.jspdf;
        },
        addStatus:function(){
            const statusOverlay = `<div class="s-top s-top-status"><div class="s-panel"><div class="s-progress-wrapper"><div class="s-progress"></div></div><div class="s-status" style=""><div class="s-text" style="">正在加载...</div><div class="s-progress-text">0%<div></div></div></div></div></div>`;
            const messageOverlay = `<div class="s-top s-top-message"><div class="s-message">testtest</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', statusOverlay);
            document.body.insertAdjacentHTML('afterbegin', messageOverlay);
            document.head.appendChild(document.createElement('style')).innerHTML = `
            .s-top{position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 99999999;padding-top: 40vh;display: none;}
            .s-top.s-top-message{text-align: center;}
            .s-message{background-color: #000000aa;color: white;padding: 8px 14px;text-align: center;font-size: 18px;border-radius: 6px;display: inline-block;}
            .s-top.s-top-status{z-index: 99999998;cursor: wait;background-color: rgba(0, 0, 0, 0.4);backdrop-filter: blur(10px) saturate(1.8);}
            .s-top.show{display: block;}
            .s-panel{background: white;width: 90%;max-width: 480px;border-radius: 12px;padding: 14px 24px;margin: 0 auto;}
            .s-progress-wrapper{height: 24px;border-radius: 12px;width: 100%;background-color: #eeeff3;overflow: hidden;margin-bottom: 12px;}
            .s-progress{background-color: #54be99;height: 24px;width: 0;transition: width 0.2s ease;}
            .s-status{display: flex;font-size: 14px;}
            .s-text{flex-grow: 1;color: #5f5f5f;}
            .s-progress-text{color: #54be99;font-weight: bold;}
            .s-message{}
            .swal2-actions{margin: 20px auto 0;}
            .swal2-styled.swal2-cancel{border-radius: 5px;font-size: 16px;}
            .swal2-styled.swal2-confirm{border-radius: 5px;font-size: 16px;}
            .swal2-styled{margin: 5px;padding: 8px 16px;}
            .none{display:none}
          `;
        },
        showStatus:function(text='', progress=-1){
            document.querySelector('.s-top.s-top-status').classList.add('show');
            if(text) document.querySelector('.s-panel .s-text').innerHTML = text;
            if (progress >= 0) {
                progress = Math.min(progress, 100);
                document.querySelector('.s-panel .s-progress').style.width = `${Math.floor(progress)}%`;
                document.querySelector('.s-panel .s-progress-text').innerHTML = `${Math.floor(progress)}%`;
            }
        },
        hideStatus:function(){
            document.querySelector('.s-top.s-top-status').classList.remove('show');
        },
        imgtocanvas:async function (doc,pageSize,img){
            const canvas = document.createElement('canvas');
            const [w, h] = [canvas.width, canvas.height] = [pageSize[0],pageSize[1]];
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0,0);
            doc.addImage(canvas, 'PNG',0, 0, w, h);
            canvas.remove();
        },
        yuanchuangliPPT:async function(){
            await Controllerdocs.addStatus();
            const loadScript = url => new Promise((resolve, reject) => {
                const removeWrap = (func, ...args) => {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    return func(...args)
                }
                const script = document.createElement('script');
                script.src = url;
                script.onload = removeWrap.bind(null, resolve);
                script.onerror = removeWrap.bind(null, reject);
                document.head.appendChild(script);
            })
            const loadJsPDF = async () => {
                if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
                await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
                return unsafeWindow.jspdf;
            }
            const htmltocanvas = (view,w,h)=>new Promise(async (resolve, reject) => {
                html2canvas(view).then((canvas)=> {
                    resolve(canvas);
                    console.log(canvas)
                });
            })
            const downloadPDF = async ()=>{
                const jspdf = await loadJsPDF();
                await commonFunction.GMaddScript("https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js");
                let PageCount = Page_Count();
                let doc;
                let docview = document.querySelector(`#view0`);
                var w = parseInt(docview.clientWidth);
                var h = parseInt(docview.clientHeight);
                var pageSize =[w,h]
                Controllerdocs.showStatus('正在加载', 0);
                for(let i = 0;i<PageCount; i++){
                    await unsafeWindow.gosld(i);
                    Controllerdocs.showStatus('正在准备', ((i + 1) /PageCount) * 100);
                    await commonFunction.sleep(100);
                    let doc_view = document.querySelector(`#view${i}`);
                    console.log(doc_view);
                    Controllerdocs.showStatus('正在合成图片');
                    let canvas = await htmltocanvas(doc_view,w,h) ;
                    console.log(canvas);
                    if (!doc) {
                        doc = new jspdf.jsPDF({
                            orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                            unit: 'pt',
                            format: pageSize,
                            compress: true
                        });
                    } else {
                        doc.addPage(pageSize);
                    }
                    var pageData = canvas.toDataURL('image/jpeg', 1.0);
                    console.log(pageData)
                    doc.addImage(pageData, 'JPEG', 0, 0, w, h);
                }
                doc.save(`原创力ppt.pdf`);
                Controllerdocs.hideStatus();
            }
            const current_page = ()=>{
                let currentpage = document.querySelector("#PageIndex").innerText;
                currentpage = parseInt(currentpage);
                return currentpage;
            }
            const Page_Count = ()=>{
                let PageCount = document.querySelector("#PageCount").innerText;
                PageCount = parseInt(PageCount);
                return PageCount;
            }
            const pagenum = ()=>{
                let currentpage = current_page();
                let PageCount = Page_Count();
                if(currentpage<PageCount){
                    let page = PageCount - currentpage;
                    previewNextpage(page,false);
                }else{
                    previewNextpage(10,true);
                }

            }
            const previewNextpage = async (page,type)=>{
                for(let i = 0;i<page; i++){
                    commonFunction.Toast("正在预览全文，请勿操作",600);
                    document.querySelector(".btmRight").click();
                    await commonFunction.sleep(500);
                }
                if(type == false){
                    pagenum();
                }else{
                    await unsafeWindow.gosld(0);
                    await commonFunction.sleep(1000);
                    downloadPDF();
                }

            }
            const btnhtml =`<div id="ycbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;top: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="jxdown" style=" text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">开始下载</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#jxdown").onclick = ()=>{
                pagenum();

            }
        },
        yuanchuangli:async function(){
            await Controllerdocs.addStatus();
            const imgLoad = (url) => {
                var img = new Image();
                img.src = url;
                if (img.complete) {
                    return [img.width, img.height];
                } else {
                    img.onload = function () {
                        return [img.width, img.height];
                        img.onload = null;
                    };
                };
            };
            const loadImage = (url) => new Promise(async (resolve, reject) => {
                if (!url) {
                    resolve(null);
                    return;
                }
                let img = await request('GET', url, null, 'blob');
                let imgEl = document.createElement('img');
                imgEl.onload = () => {
                    resolve(imgEl);
                }
                imgEl.onabort = imgEl.onerror = reject;
                imgEl.src = URL.createObjectURL(img);
            })
            const request = (method, url, data, responseType = 'text') => new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method,
                    url,
                    data,
                    responseType,
                    onerror: reject,
                    ontimeout: reject,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(responseType === 'text' ? response.responseText : response.response);
                        } else {
                            reject(new Error(response.statusText));
                        }
                    }
                });
            });
            const loadScript = url => new Promise((resolve, reject) => {
                const removeWrap = (func, ...args) => {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    return func(...args)
                }
                const script = document.createElement('script');
                script.src = url;
                script.onload = removeWrap.bind(null, resolve);
                script.onerror = removeWrap.bind(null, reject);
                document.head.appendChild(script);
            })

            const loadJsPDF = async () => {
                if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
                await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
                return unsafeWindow.jspdf;
            }
            const downloadPDF = async (WebPreview)=>{
                let titleText = unsafeWindow?.base.detail.title;
                let title;
                if(titleText){
                    title = titleText.split(".")[0]
                }else{
                    title = "原创力文档"
                }
                Controllerdocs.showStatus('正在加载', 0);
                const jspdf = await loadJsPDF();
                let doc;
                let previewImages = WebPreview.Data.images;
                const img = imgLoad(previewImages[1].src);
                let startnum = unsafeWindow.fenpi.startnum;
                let endnum = unsafeWindow.fenpi.endnum;
                for(let i = startnum;i <= endnum; i++){
                    Controllerdocs.showStatus('正在准备', ((i + 1) / previewImages.length) * 100);
                    const pageSize =[img[0],img[1]];
                    console.log(img[1])
                    if (!doc) {
                        doc = new jspdf.jsPDF({
                            orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                            unit: 'pt',
                            format: pageSize,
                            compress: true
                        });
                    } else {
                        doc.addPage(pageSize);
                    }
                    Controllerdocs.showStatus('正在下载图片');
                    const previewImg = await loadImage(previewImages[i].src);
                    await Controllerdocs.imgtocanvas(doc,pageSize,previewImg);
                    Controllerdocs.showStatus('正在绘制');
                    if(previewImg?.src) URL.revokeObjectURL(previewImg.src);
                    previewImg.remove();

                }
                doc.save(`${title}.pdf`);
                Controllerdocs.hideStatus();
            }
            const checkPreview = (WebPreview) =>{
                let previewImages = WebPreview.Data.images;
                let arr =[];
                for(let i = 1;i < previewImages.length; i++){
                    if(previewImages[i].status == "init") arr.push(i);
                }
                return arr;

            }
            const Previewresult = (WebPreview)=>{
                let Previewfalse = checkPreview(WebPreview);
                var toasttext = "";
                if(Previewfalse != ""){
                    for ( let key in Previewfalse){
                        toasttext += "第"+Previewfalse[key]+"页;";
                        document.querySelector("#jxdown").style.display = "block";
                        document.querySelector("#downbox").style.display = "none";
                    }
                    commonFunction.Toast(toasttext+"预览失败，请手动预览上述页码",5000);
                }else{
                    downloadPDF(WebPreview);
                }
            }
            const exportPDF = async(event,startnum,endnum,yulannum)=>{
                let WebPreview = unsafeWindow?.WebPreview;
                let previewmain =document.querySelector('.preview');
                if(yulannum == "") yulannum = 100;
                unsafeWindow.fenpi ={
                    startnum:1,
                    endnum:WebPreview.Data.preview_page

                }
                try {
                    if(!WebPreview){
                        commonFunction.Toast("文档下载失败,刷新页面重试一次",3000);
                        return
                    }
                    if(previewmain){
                        previewmain.style.display = "block"
                    }else{
                        commonFunction.Toast("预览失败",3000);
                        return
                    }
                    if(startnum!=""&&endnum!=""){
                        if(parseInt(startnum)<parseInt(endnum)){
                            if(parseInt(endnum)>WebPreview.Data.preview_page||parseInt(startnum)<1){
                                commonFunction.Toast('页码输入错误,结束页码大于可预览页数或者起始页码小于1');
                                return
                            }else{
                                unsafeWindow.fenpi.startnum = startnum;
                                unsafeWindow.fenpi.endnum = endnum;
                                console.log(unsafeWindow.fenpi.startnum)
                            }
                        }else{
                            commonFunction.Toast('页码输入错误,结束页码小于或等于开始页码');
                            return
                        }
                    }
                    await unsafeWindow.preview.jump(999);
                    await commonFunction.sleep(1500);
                    event.preventDefault();
                    var currentLocation = document.documentElement.scrollTop;// 获取当前滚动条的位置
                    var task = setInterval(function (){ // setInterval循环周期调用
                        if (currentLocation>0){
                            window.scrollTo(0,currentLocation);
                            currentLocation -=yulannum // 相比上次位置减10，根据自己需要的速度修改
                            commonFunction.Toast("正在预览全文，请勿操作",200);
                        }else {
                            window.scrollTo(0,0);
                            Previewresult(WebPreview);
                            clearInterval(task) //回到顶部后，清除已执行的的循环事件
                        }
                    },200)

                    } catch (error) {
                        commonFunction.Toast('导出失败：'+error?.message ?? error);
                    } finally {
                        Controllerdocs.hideStatus();
                    }

            }
            const exportPPT = async()=>{
                try {
                    unsafeWindow.preview.getSrc();
                    var xm= commonFunction.Commonsetinterval(["iframe.preview-iframe"]);
                    xm.then(function(node){
                        window.open(node.src);
                        unsafeWindow.preview.close();
                    });

                } catch (error) {
                    commonFunction.Toast('导出失败：'+error?.message ?? error);
                } finally {
                    Controllerdocs.hideStatus();
                }

            }
            const btnhtml =`<div id="ycbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;top: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="downbox"><div><p style="font-size: 14px;margin: 10px 0;">分批下载</p><div><input id="start" style="width: 35px;padding: 2px;"> <span style="margin: 0 5px;">-</span><input id="end" style="width: 35px;padding: 2px;"></div></div><div><p style="font-size: 14px;margin: 10px 0;">预览速度</p><div><input id="yulan" type= number placeholder="200" style="width: 60px;padding: 2px;"> <span style="margin: 0 5px;">像素</span></div></div><div id="ycdown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">下载文档</div></div><div id="jxdown" style=" display:none; text-align: center;font-size: 14px;padding: 6px 13px;background: #fff;color: #54be99;margin: 10px 0;border-radius: 3px;border: 1px solid #54be99;">继续下载</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#ycdown").onclick = (event)=>{
                let base = unsafeWindow?.base;
                console.log(base.detail.format);
                let startnum = document.querySelector('#start').value;
                let endnum = document.querySelector("#end").value;
                let yulannum = document.querySelector("#yulan").value;
                if(!base.detail.format){
                    commonFunction.Toast("文档信息获取失败,刷新页面重试一次",3000);
                    return
                }else if(base.detail.format == "ppt"||base.detail.format == "pptx"){
                    if(startnum||endnum){
                        commonFunction.Toast("PPT不支持分批下载",3000);
                    }else{
                        exportPPT();
                    }
                }else{
                    exportPDF(event,startnum,endnum,yulannum);
                }
            }
            document.querySelector("#jxdown").onclick = ()=>{
                let WebPreview = unsafeWindow?.WebPreview;
                Previewresult(WebPreview);
            }
        },
        daokebaba:async function(){
            await Controllerdocs.addStatus();
            const loadScript = url => new Promise((resolve, reject) => {
                const removeWrap = (func, ...args) => {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    return func(...args)
                }
                const script = document.createElement('script');
                script.src = url;
                script.onload = removeWrap.bind(null, resolve);
                script.onerror = removeWrap.bind(null, reject);
                document.head.appendChild(script);
            })

            const loadJsPDF = async () => {
                if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
                await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
                return unsafeWindow.jspdf;
            }
            const Previewresult = ()=>{
                let Previewfalse = document.getElementsByClassName("page_pb");
                console.log(Previewfalse)
                var toasttext = "";
                for ( let i=0; i < Previewfalse.length;i++){
                    if(Previewfalse[i].innerHTML != ""){
                        let falseid= Previewfalse[i].getAttribute("id");
                        let falsenum =falseid.split("_");
                        toasttext += "第"+falsenum[1]+"页;";
                        document.querySelector("#jxdown").style.display = "block";
                        document.querySelector("#downbox").style.display = "none";
                    }
                }
                if(toasttext != ""){
                    commonFunction.Toast(toasttext+"预览失败，请手动预览上述页码",5000);
                }else{
                    downloadPDF();
                }
            }
            const downloadPDF = async ()=>{
                let title = document.querySelector('.doctopic h1').innerText;
                if( !title) title = "道客巴巴文档"
                const jspdf = await loadJsPDF();
                let doc;
                let canvas = unsafeWindow.daoke.canvas;
                var w = parseInt(canvas[0].clientWidth);
                var h = parseInt(canvas[0].clientHeight);
                var pageSize =[w,h]
                Controllerdocs.showStatus('正在加载', 0);
                let startnum = unsafeWindow.daoke.startnum - 1;
                let endnum = unsafeWindow.daoke.endnum;
                for(let i = startnum;i<endnum; i++){
                    Controllerdocs.showStatus('正在准备', ((i + 1) /canvas.length) * 100);
                    if (!doc) {
                        doc = new jspdf.jsPDF({
                            orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                            unit: 'pt',
                            format: pageSize,
                            compress: true
                        });
                    } else {
                        doc.addPage(pageSize);
                    }
                    Controllerdocs.showStatus('正在合成图片');
                    var pageData = canvas[i].toDataURL('image/jpeg', 1.0);
                    console.log(canvas[i])
                    doc.addImage(pageData, 'JPEG', 0, 0, w, h);
                    await commonFunction.sleep(100);
                }
                doc.save(`${title}.pdf`);
                Controllerdocs.hideStatus();
            }
            const exportPDF = async(event,startnum,endnum,yulannum)=>{
                await unsafeWindow.buyContinueRead();
                unsafeWindow.daoke ={
                    canvas:[],
                    startnum:1,
                    endnum:"",
                }
                if(yulannum == "") yulannum = 600;
                let bodyheight =document.body.scrollHeight;
                await window.scrollTo(0,bodyheight);
                let canvas = unsafeWindow.daoke.canvas = document.getElementsByClassName("inner_page");
                if(!canvas) {commonFunction.Toast("文档信息获取失败,刷新页面重试一次",3000);return;}
                unsafeWindow.daoke.endnum = canvas.length;
                console.log(unsafeWindow.daoke.endnum);
                try {
                    if(startnum!=""&&endnum!=""){
                        if(parseInt(startnum)<parseInt(endnum)){
                            if(parseInt(endnum)>canvas.length||parseInt(startnum)<1){
                                commonFunction.Toast('页码输入错误,结束页码大于可预览页数或者起始页码小于1');
                                return
                            }else{
                                unsafeWindow.daoke.startnum = startnum;
                                unsafeWindow.daoke.endnum = endnum;

                            }
                        }else{
                            commonFunction.Toast('页码输入错误,结束页码小于或等于开始页码');
                            return
                        }
                    }
                    event.preventDefault();
                    var currentLocation = document.documentElement.scrollTop;// 获取当前滚动条的位置
                    var task = setInterval(function (){ // setInterval循环周期调用
                        if (currentLocation>0){
                            window.scrollTo(0,currentLocation);
                            currentLocation -=yulannum // 相比上次位置减10，根据自己需要的速度修改
                            commonFunction.Toast("正在预览全文，请勿操作",1000);
                        }else {
                            window.scrollTo(0,0);
                            Previewresult();
                            clearInterval(task) //回到顶部后，清除已执行的的循环事件
                        }
                    },1000)

                    } catch (error) {
                        commonFunction.Toast('导出失败：'+error?.message ?? error);
                    } finally {
                        Controllerdocs.hideStatus();
                    }

            }
            const btnhtml =`<div id="dkbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;top: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="downbox"><div><p style="font-size: 14px;margin: 10px 0;">分批下载</p><div><input type= number id="start" style="width: 35px;padding: 2px;"> <span style="margin: 0 5px;">-</span><input type= number id="end" style="width: 35px;padding: 2px;"></div></div><div><p style="font-size: 14px;margin: 10px 0;">预览速度</p><div><input id="yulan" type= number placeholder="600" style="width: 60px;padding: 2px;"> <span style="margin: 0 5px;">像素</span></div></div><div id="dkdown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">下载文档</div></div><div id="jxdown" style=" display:none; text-align: center;font-size: 14px;padding: 6px 13px;background: #fff;color: #54be99;margin: 10px 0;border-radius: 3px;border: 1px solid #54be99;">继续下载</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#dkdown").onclick = (event)=>{
                let startnum = document.querySelector('#start').value;
                let endnum = document.querySelector("#end").value;
                let yulannum = document.querySelector("#yulan").value;
                exportPDF(event,startnum,endnum,yulannum);

            }
            document.querySelector("#jxdown").onclick = ()=>{
                Previewresult();
            }
        },

        zhiku:async function(){
            await Controllerdocs.addStatus();
            const loadScript = url => new Promise((resolve, reject) => {
                const removeWrap = (func, ...args) => {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    return func(...args)
                }
                const script = document.createElement('script');
                script.src = url;
                script.onload = removeWrap.bind(null, resolve);
                script.onerror = removeWrap.bind(null, reject);
                document.head.appendChild(script);
            })
            const loadJsPDF = async () => {
                if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
                await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
                return unsafeWindow.jspdf;
            }
            const setIntervalPage = data => new Promise((resolve, reject) => {
                let num = 0;
                let Count = setInterval(function() {
                    var node = document.querySelector(data);
                    num++;
                    if(node != null ){
                        clearInterval(Count);
                        commonFunction.Toast("正在预览全文，请勿操作",unsafeWindow.zhiku.yulannum);
                        setTimeout(() => {
                            let pageData = node.toDataURL('image/jpeg', 1.0);
                            let canvas ={
                                "src":pageData,
                                "width":node.width,
                                "height":node.height,
                            }
                            unsafeWindow.zhiku.canvas.push(canvas);
                            resolve(node);
                        },unsafeWindow.zhiku.yulannum);
                    }
                    console.log(num)
                    if(num ==50){
                        return false;
                        clearInterval(Count);
                    }
                    console.log(node)
                },200);

            })
            const Preview = async (page)=>{
                for (let i = unsafeWindow.zhiku.startnum;i <=unsafeWindow.zhiku.endnum;i++){
                    document.querySelector('#pageContainer'+i).scrollIntoView({behavior: "smooth"});
                    let zk = await setIntervalPage("#page"+i);
                    if(zk == false) return false;
                }
                return true;
            }
            const downloadPDF = async ()=>{
                const jspdf = await loadJsPDF();
                let doc;
                let canvas = unsafeWindow.zhiku.canvas;
                console.log(canvas);
                Controllerdocs.showStatus('正在加载', 0);
                let startnum = unsafeWindow.zhiku.startnum - 1;
                let endnum = unsafeWindow.zhiku.endnum;
                for(let i = 0;i<canvas.length; i++){
                    var w = canvas[i].width;
                    var h = canvas[i].height;
                    var pageSize =[w,h]
                    Controllerdocs.showStatus('正在准备', ((i + 1) /canvas.length) * 100);
                    if (!doc) {
                        doc = new jspdf.jsPDF({
                            orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                            unit: 'pt',
                            format: pageSize,
                            compress: true
                        });
                    } else {
                        doc.addPage(pageSize);
                    }
                    Controllerdocs.showStatus('正在合成图片');
                    doc.addImage(canvas[i].src, 'JPEG', 0, 0, w, h);
                    await commonFunction.sleep(100);
                }
                doc.save(`${unsafeWindow?.wgDocTitle ?? '智库文库文档'}.pdf`);
                Controllerdocs.hideStatus();
            }
            const exportPDF = async (startnum,endnum,yulannum)=>{
                let page = document.querySelectorAll('.page');
                if(!page){
                    commonFunction.Toast("文档下载失败,刷新页面重试一次",3000);
                    return
                }
                if(yulannum == "") yulannum = 1500;
                unsafeWindow.zhiku ={
                    "startnum":1,
                    "endnum":page.length,
                    "yulannum":yulannum,
                    "canvas":[]
                }
                try {
                    if(startnum!=""&&endnum!=""){
                        if(parseInt(startnum)<parseInt(endnum)){
                            if(parseInt(endnum)>page.length||parseInt(startnum)<1){
                                commonFunction.Toast('页码输入错误,结束页码大于可预览页数或者起始页码小于1');
                                return
                            }else{
                                unsafeWindow.zhiku.startnum = startnum;
                                unsafeWindow.zhiku.endnum = endnum;
                            }
                        }else{
                            commonFunction.Toast('页码输入错误,结束页码小于或等于开始页码');
                            return
                        }
                    }
                    document.querySelector('#pageContainer'+unsafeWindow.zhiku.startnum).scrollIntoView({behavior: "smooth"});
                    await commonFunction.sleep(1000)
                    let Previewresult = await Preview(page);
                    if(Previewresult) downloadPDF();
                } catch (error) {
                    commonFunction.Toast('导出失败：'+error?.message ?? error);
                } finally {
                    Controllerdocs.hideStatus();
                }

            }
            const btnhtml =`<div id="dkbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;top: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="downbox"><div><p style="font-size: 14px;margin: 10px 0;">分批下载</p><div><input type= number id="start" style="width: 35px;padding: 2px;border: 1px solid #333;border-radius: 2px;"> <span style="margin: 0 5px;">-</span><input type= number id="end" style="width: 35px;padding: 2px;border: 1px solid #333;border-radius: 2px;"></div></div><div><p style="font-size: 14px;margin: 10px 0;">预览速度</p><div><input id="yulan" type= number placeholder="1500" style="width: 60px;padding: 2px;border: 1px solid #333;border-radius: 2px;"> <span style="margin: 0 5px;font-size:12px">毫秒</span></div></div><div id="dkdown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">下载文档</div></div></div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#dkdown").onclick = (event)=>{
                let startnum = document.querySelector('#start').value;
                let endnum = document.querySelector("#end").value;
                let yulannum = document.querySelector("#yulan").value;
                exportPDF(startnum,endnum,yulannum);

            }
        },
        docin:async function(){
            await Controllerdocs.addStatus();
            const loadScript = url => new Promise((resolve, reject) => {
                const removeWrap = (func, ...args) => {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    return func(...args)
                }
                const script = document.createElement('script');
                script.src = url;
                script.onload = removeWrap.bind(null, resolve);
                script.onerror = removeWrap.bind(null, reject);
                document.head.appendChild(script);
            })

            const loadJsPDF = async () => {
                if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
                await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
                return unsafeWindow.jspdf;
            }
            const request = (method, url, data, responseType = 'text') => new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method,
                    url,
                    data,
                    responseType,
                    onerror: reject,
                    ontimeout: reject,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(responseType === 'text' ? response.responseText : response.response);
                        } else {
                            reject(new Error(response.statusText));
                        }
                    }
                });
            });
            const loadImage = (url) => new Promise(async (resolve, reject) => {
                if (!url) {
                    resolve(null);
                    return;
                }

                let img = await request('GET', url, null, 'blob');
                let imgEl = document.createElement('img');
                imgEl.onload = () => {
                    resolve(imgEl);
                }
                imgEl.onabort = imgEl.onerror = reject;
                imgEl.src = URL.createObjectURL(img);
            })
            const Previewresult = ()=>{
                let Previewfalse = document.getElementsByClassName("panel_inner");
                console.log(Previewfalse)
                var toasttext = "";
                for ( let i=0; i < Previewfalse.length;i++){
                    let canvasfalse = Previewfalse[i].querySelector("canvas")||Previewfalse[i].querySelector("img");
                    if(!canvasfalse){
                        let falseid= Previewfalse[i].firstChild.getAttribute("id");
                        let falsenum =falseid.split("_");
                        toasttext += "第"+falsenum[1]+"页;";
                        document.querySelector("#jxdown").style.display = "block";
                        document.querySelector("#downbox").style.display = "none";
                    }
                }
                if(toasttext != ""){
                    commonFunction.Toast(toasttext+"预览失败，请手动预览上述页码",5000);
                }else{
                    downloadPDF();
                }
            }
            const downloadPDF = async ()=>{
                let title = unsafeWindow?.readerConfig?.productName?unsafeWindow.readerConfig.productName:"豆丁文档";
                const jspdf = await loadJsPDF();
                let doc;
                let type = document.querySelector(".hkswf-content")?"canvas":"img"
                Controllerdocs.showStatus('正在加载', 0);
                let startnum = unsafeWindow.docin.startnum - 1;
                let endnum = unsafeWindow.docin.endnum;
                for(let i = startnum;i<endnum; i++){
                    Controllerdocs.showStatus('正在准备', ((i + 1) /(endnum-startnum)) * 100);
                    let w,h,pageSize,canvas
                    if(type==="canvas"){
                        canvas = document.getElementsByClassName("hkswf-content");
                        pageSize =[w,h]=[parseInt(canvas[i].querySelector('canvas').clientWidth),parseInt(canvas[i].querySelector('canvas').clientHeight)]
                    }else{
                        canvas = document.querySelector("#img_"+(i+1));
                        let imgNode = canvas.querySelector('img')||canvas.querySelector('canvas')
                        pageSize =[w,h]=[parseInt(imgNode.clientWidth),parseInt(imgNode.clientHeight)]
                    }
                    if (!doc) {
                        doc = new jspdf.jsPDF({
                            orientation: pageSize[0] < pageSize[1] ? 'p' : 'l',
                            unit: 'pt',
                            format: pageSize,
                            compress: true
                        });
                    } else {
                        doc.addPage(pageSize, pageSize[0] < pageSize[1] ? 'p' : 'l')
                    }
                    Controllerdocs.showStatus('正在合成图片');
                    let pageData
                    if(type==="canvas"){
                        pageData = canvas[i].querySelector('canvas').toDataURL('image/jpeg', 1.0);
                        console.log(canvas[i])
                    }else{
                        pageData = canvas?.querySelector('img')?.getAttribute("src")?await loadImage(canvas.querySelector('img').getAttribute("src")):canvas.querySelector('canvas').toDataURL('image/jpeg', 1.0);
                    }
                    doc.addImage(pageData, 'JPEG', 0, 0, w, h);

                    await commonFunction.sleep(100);
                }
                doc.save(`${title}.pdf`);
                Controllerdocs.hideStatus();
            }
            const exportPDF = async(event,startnum,endnum,yulannum)=>{
                // await unsafeWindow.buyContinueRead();
                unsafeWindow.docin ={
                    canvas:[],
                    startnum:1,
                    endnum:"",
                }
                if(yulannum == "") yulannum = 300;
                let bodyheight =document.body.scrollHeight;
                await window.scrollTo(0,bodyheight);
                let canvas = document.getElementsByClassName("panel_inner");
                if(!canvas) {commonFunction.Toast("文档信息获取失败,刷新页面重试一次",3000);return;}
                unsafeWindow.docin.endnum = canvas.length;
                console.log(unsafeWindow.docin.endnum);
                try {
                    if(startnum!=""&&endnum!=""){
                        if(parseInt(startnum)<parseInt(endnum)){
                            if(parseInt(endnum)>canvas.length||parseInt(startnum)<1){
                                commonFunction.Toast('页码输入错误,结束页码大于可预览页数或者起始页码小于1');
                                return
                            }else{
                                unsafeWindow.docin.startnum = startnum;
                                unsafeWindow.docin.endnum = endnum;

                            }
                        }else{
                            commonFunction.Toast('页码输入错误,结束页码小于或等于开始页码');
                            return
                        }
                    }
                    event.preventDefault();
                    var currentLocation = document.documentElement.scrollTop;// 获取当前滚动条的位置
                    var task = setInterval(function (){ // setInterval循环周期调用
                        if (currentLocation>0){
                            window.scrollTo(0,currentLocation);
                            currentLocation -=yulannum // 相比上次位置减10，根据自己需要的速度修改
                            commonFunction.Toast("正在预览全文，请勿操作",1000);
                        }else {
                            window.scrollTo(0,0);
                            setTimeout(function(){
                                Previewresult();
                            },3000)

                            clearInterval(task) //回到顶部后，清除已执行的的循环事件
                        }
                    },1000)

                    } catch (error) {
                        commonFunction.Toast('导出失败：'+error?.message ?? error);
                    } finally {
                        Controllerdocs.hideStatus();
                    }

            }
            const btnhtml =`<div id="dkbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;top: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="downbox"><div><p style="font-size: 14px;margin: 10px 0;">分批下载</p><div><input type= number id="start" style="width: 35px;padding: 2px;border:1px solid #666666"> <span style="margin: 0 5px;">-</span><input type= number id="end" style="width: 35px;padding: 2px;border:1px solid #666666"></div></div><div><p style="font-size: 14px;margin: 10px 0;">预览速度</p><div><input id="yulan" type= number placeholder="300" style="width: 60px;padding: 2px;border:1px solid #666666"> <span style="margin: 0 5px;">像素</span></div></div><div id="dkdown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">下载文档</div></div><div id="jxdown" style=" display:none; text-align: center;font-size: 14px;padding: 6px 13px;background: #fff;color: #54be99;margin: 10px 0;border-radius: 3px;border: 1px solid #54be99;">继续下载</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#dkdown").onclick = (event)=>{
                let startnum = document.querySelector('#start').value;
                let endnum = document.querySelector("#end").value;
                let yulannum = document.querySelector("#yulan").value;
                exportPDF(event,startnum,endnum,yulannum);

            }
            document.querySelector("#jxdown").onclick = ()=>{
                Previewresult();
            }
        },
        bdwk:function(){
            const btnhtml =`<div id="bdbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;bottom: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div id="bddown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">下载文档</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#bddown").onclick = (event)=>{
                let url = 'http://www.wezhicms.com/index/Tools/index?url='+ encodeURIComponent(config.playhref);
                window.open(url);
            }


        }
    };
    const Controllerdupan ={
        servers:[
            "http://www.360fandu.cn/",
            "http://pan.10zv.net/",
        ],
        website:"",
        getPage(){
            let Page;
            if (config.playhref.indexOf(".baidu.com/disk/main") > 0) {
                Page = "main"
                return Page
            } else if (config.playhref.indexOf(".baidu.com/disk/home") > 0) {
                Page = "home"
                return Page
            }
            return null
        },
        addbtn:async function(){
            await commonFunction.sleep(1500)
            let Page = await this.getPage();
            if (Page === 'home'){
                let button = `<span class="g-dropdown-button" style="display: inline-block;" id="zhihuDown">
	               <a class="g-button  g-button-blue blue-upload upload-wrapper"  title="蜗牛下载助手" >
		                <span class="g-button-right">
			               <em class="icon icon-download" title="蜗牛下载助手"></em>
			               <span class="text" style="width: 80px;">蜗牛下载助手</span>
		                </span>
	               </a>
                   </span>
                   `;
                document.querySelector('[node-type=upload]').parentNode.insertAdjacentHTML('beforebegin',button);
            }
            if (Page === 'main'){
                let button = `<div class="wp-s-agile-tool-bar__h-group"><div class="u-button-group wp-s-agile-tool-bar__h-button-group is-main "><div class="wp-s-agile-tool-bar__h-action is-need-left-sep is-main"><a id="zhihuDown"  class="nd-upload-button upload-wrapper"><button class="u-button nd-file-list-toolbar-action-item u-button--primary u-button--small is-round is-has-icon" data-v-6d80bc06>
		            <i class="u-icon u-icon-download"></i><span style="margin-left: 5px;">蜗牛下载助手
		                 </span>
		             </button>
                    </a></div></div></div>
                 `;
                document.querySelector('.wp-s-agile-tool-bar__h-group').insertAdjacentHTML('beforebegin',button);
            }
            document.querySelector('#zhihuDown').onclick = async e => {
                let file = this.getSelectedfileList(),
                    pwd = this.getPwd(4);
                if (!file) return;
                commonFunction.Toast('正在获取百度分享链接...');
                let surl = await this.getShortUrl(file.fs_id, pwd);
                if (!surl) {
                    return commonFunction.Toast('百度分享链接获取失败');
                }
                this.showMain(surl, pwd, file.server_filename)

            };
        },
        showMain(surl, pwd,filename){
            let _this = this
            let defaultpassword = "";
            if (localStorage.password && (Date.now() - localStorage.passwordTime) < 17280000) {
                defaultpassword = localStorage.password;
            } else {
                localStorage.password = "";
            }
            let html = `<div style="background-color: #fff;">
	          <div style="background:#F5F6FA;padding: 15px 30px;display: flex;box-sizing: border-box;">
		         <div style="width: 50%;margin-left: 5px;">
			     <div style="font-size: 14px;color:#06A7FF;text-align: center;margin:5px 15px 25px 0;" id="tip"></div>
		         <div style="margin-bottom: 20px;text-align: left;">
				<span style="font-size: 12px;">方式一：IDM用户代理（UA）必须设置为：</span><span style="color:#FF0000;font-size: 12px;font-weight: bold;" id="ua"></span>
				<div style="display: flex;height: 40px;line-height: 40px;margin-top: 20px;">
					<div id="copyIDM"></div>
					<a href="https://www.zhihupe.com/html/w10/13168.html" style="color: #09AAFF;font-size: 14px;text-decoration: none;">软件下载及教程</a>
				</div>
			   </div>
			<div style="margin-bottom: 20px;text-align: left;">
				<span style="font-size: 12px;">方式二：Aria2/Motrix 无需配置，请看下方使用教程</span>
				<div style="display: flex;height: 40px;line-height: 40px;margin-top: 20px;">
					<div  id="sendAria"></div>
					<a href="https://www.zhihupe.com/html/w10/13167.html" style="color: #09AAFF;font-size: 14px;text-decoration: none;"">软件下载及教程</a>
				</div>
			</div>
			<div style="font-size: 14px;color: #FF0000;margin-bottom: 10px;text-align: left;">为防止接口被滥用，需要输入验证码</div>
			<div style="display: flex;justify-content: space-between;height: 40px;line-height: 40px;">
				<input name="passwordCode" id="passwordCode"
                         value="${defaultpassword}" placeholder="请输入验证码" style="box-sizing: border-box; width: 150px;height: 100%;padding:0 10px ;     border: 1px solid #D4D7DE;border-radius: 8px;" />
				<button id="dowmBtn" style="margin-right: 15px; font-size: 14px;height: 100%;width: 125px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;border: unset;">点击获取直链</button>
			</div>
		</div>
		<div style="width: 50%;display: flex;flex-direction:column;">
			<img style="width: 130px;height: 130px;margin: 20px auto;border-radius: 5px;" src="http://cdn.wezhicms.com/uploads/allimg/20211215/1-21121500044Q94.jpg">
			<span style="font-size: 14px;color: #666;text-align: center;">微信扫描上方二维码获取验证码</span>
			<h1 style="text-align: center; font-size: 18px;font-weight: bold;margin: 20px 0;">解析步骤</h1>
			     <div style="font-size: 14px;color: #000;margin-left:15px;text-align: left;">
				   <div style="line-height: 3;">1.关注公众号【蜗牛百宝箱】</div>
                   <div style="line-height: 3;">2.回复‘解析’获取验证码</div>
                   <div style="line-height: 3;">3.将验证码输入左边输入框中，点击获取高速直链！</div>
			    </div>
		       </div>
	          </div>
           </div>`;
            commonFunction.open({
                area: ['780', '526'],
                title: "正在获取"+filename+"的直链",
                shade: 0,
                id:"",
                btn: ['关闭','取消'],
                content:html,
                btn1: function(data) {}
            })
            document.querySelector('#dowmBtn').onclick = function () {
                document.querySelector('#dowmBtn').setAttribute('disabled','disabled')
                _this.website = _this.servers[Math.floor(Math.random()*_this.servers.length)];
                console.log(_this.website)
                let passwordCode = document.querySelector("#passwordCode").value;
                if (passwordCode) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://tool.zhihupe.com/bdwpcs.php?m=WANPAN&author="+author+"&PWD="+passwordCode+"&website="+_this.website,
                        headers: {
                            "Content-Type": "text/html; charset=utf-8"
                        },
                        onload: function(res){
                            console.log(res.responseText)
                            var json=JSON.parse(res.responseText);
                            if(json.error == 1){
                                if (passwordCode != localStorage.password) {
                                    localStorage.password = passwordCode;
                                    localStorage.passwordTime = Date.now();
                                }
                                let password = json.code;
                                _this.ua = json.ua;
                                getLink(surl, pwd,filename,password);
                                document.querySelector("#tip").innerText ="正在获取链接，请稍等！";
                            }else if(json.error == -2){
                                let msg =json.msg
                                commonFunction.Toast(msg);
                                document.querySelector('#dowmBtn').removeAttribute('disabled')
                            }else {
                                commonFunction.Toast('服务器请求失败，请重试！');
                            }
                        },
                        onerror: function(err){
                            commonFunction.Toast(err);
                        }
                    });
                }else {
                    commonFunction.Toast('请输入验证码！');
                }
            };
            function getLink(surl, pwd,filename,password){
                (async () => {
                    let exception = null;
                    try {
                        let str = await _this.getFileInfo(surl, pwd, password, _this.website);
                        console.log(surl, pwd, password, _this.website);
                        return await _this.getLinkCommon(str, _this.website);
                    } catch (e) {
                        exception = e;
                    }
                    throw exception;
                })().then(link => {
                    document.querySelector('#dowmBtn').removeAttribute('disabled')
                    document.querySelector("#tip").innerText = "高速链接获取成功！！！";
                    document.querySelector(".zhihu-layer-title").innerText =`获取 ${filename} 的高速直链成功`;
                    document.querySelector("#ua").innerText =`${_this.ua}`;
                    document.querySelector("#copyIDM").innerHTML = `<div style="margin-right: 15px; font-size: 14px;height: 100%;width: 175px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">复制IDM链接到剪贴板</div>`
                    //document.querySelector("#copyIDM").insertAdjacentHTML('afterbegin', `<div style="margin-right: 15px; font-size: 14px;height: 100%;width: 175px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">复制IDM链接到剪贴板</div>`);
                    document.querySelector('#copyIDM').onclick= e => {
                        GM_setClipboard(link);
                        commonFunction.Toast('已复制IDM链接到剪贴板');
                    };
                    document.querySelector("#sendAria").innerHTML = `<div style="margin-right: 15px; font-size: 14px;height: 100%;width: 175px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">发送到Aria2(motix)</div>`;
                    document.querySelector('#sendAria').onclick = e =>{
                        document.querySelector('.zhihu-layer-btn0').click()
                        _this.showAria(link, filename);
                    }
                }).catch(e => {
                    document.querySelector('#dowmBtn').removeAttribute('disabled')
                    document.querySelector(".zhihu-layer-title").innerText =`获取 ${filename} 的高速直链失败`
                    document.querySelector("#tip").innerHTML =`获取高速链接<span style="font-weight:800;color:red">失败！！！,重试一次看看</span>`
                });
            };
        },
        getPwd(len) {
            len = len || 4;
            let $char = 'abcdefhijkmnprstwxyz123456789';
            let l = $char.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $char.charAt(Math.floor(Math.random() * l));
            }
            return pwd;
        },
        getList() {
            try {
                return require('system-core:context/context.js').instanceForSystem.list.getSelected();
            } catch (e) {
                let mainList = document.querySelector('.nd-main-list');
                if (!mainList) mainList = document.querySelector('.nd-new-main-list');//20220524 新版
                return mainList.__vue__.selectedList;
            }
        },
        getSelectedfileList() {
            let list = this.getList();
            if (list && list.length === 1) {
                if (list[0].isdir === 1) {
                    return commonFunction.Toast('提示：请打开文件夹后勾选文件！');
                }
                return list[0];
            }else if(list.length > 1){
                return commonFunction.Toast('提示：不要同时勾选多个文件');
            }else{
                return commonFunction.Toast('提示：请先勾选要下载的文件！');
            }

        },
        getShortUrl(fs_id, pwd) {
            let bdstoken = '';
            return fetch(`https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "text/plain;charset=UTF-8",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "none"
                },
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": `fid_list=[${fs_id}]&schannel=4&channel_list=[]&period=1&pwd=` + pwd,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(r => r.json()).then(r => r.shorturl.replace(/^.+\//, '')).catch(e => null);
        },
        getFileInfo(surl, pwd, passwordCode, website) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    data: `surl=${surl}&pwd=${pwd}&Password=` + passwordCode,
                    url: website,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    onload: res => {
                        if (res.status != 200)
                            return reject(res);
                        resolve(res.responseText);
                        console.log(res.responseText)
                    },
                    onerror: err => reject(err)
                });
            }).then(r => {
                let m = r.match(/javascript:confirmdl\((.+)\);/);
                console.log(m);
                if (m) return m[1];
                return Promise.reject(`获取下载信息失败`);
            });
        },
        getParam(str) {

            let arr = str.replace(/'/g,'').split(',');
            return `fs_id=${arr[0]}&time=${arr[1]}&sign=${arr[2]}&randsk=${arr[3]}&share_id=${arr[4]}&uk=${arr[5]}`;
            // return urlEncode(['fs_id', 'time', 'sign', 'randsk', 'share_id', 'uk', 'bdstoken', 'filesize'].reduce((t, v, i) => (t[v] = arr[i]) && t, {}));
        },
        getLinkCommon(str, website) {
            const _this = this
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    data: _this.getParam(str),
                    url: website + "/?download",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    onload: res => {
                        if (res.status != 200) return reject(res);
                        resolve(res.responseText);
                    },
                    onerror: err => reject(err)
                });
            }).then(r => {
                var reg = /id="https" data-qrcode-attr="href" data-qrcode-level="L" href="(.\S*)" target="_blank"/;
                let link = r.match(reg)
                if (link) return link[1];
                return Promise.reject('获取直链失败');
            });
        },
        showAria(url, filename) {
            let _this = this
            let contenthtml ="";
            contenthtml +='<form class="zhihu-form" style="height: 255px;"><div class="main-left" style="width:100%;padding:0 30px">'
            contenthtml +=`<div class="zhihu-form-item"> <label class="zhihu-form-label">RPC地址</label><div class="zhihu-input-block"><input name="rpc" value="${commonFunction.getItem('rpc') || ''}"  placeholder="" class="zhihu-input"></div></div>`
            contenthtml +=`<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>Aria2配置:ws://localhost:6800/jsonrpc<br>Motrix配置:ws://localhost:16800/jsonrpc</p></div></div>`
            contenthtml +=`<div class="zhihu-form-item"> <label class="zhihu-form-label">token</label><div class="zhihu-input-block"><input name="token" value="${commonFunction.getItem('token') || ''}"  placeholder="" class="zhihu-input"></div></div>`
            contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>没有请留空</p></div></div>'
            contenthtml +=`<div class="zhihu-form-item"> <label class="zhihu-form-label">保存地址</label><div class="zhihu-input-block"><input name="mulu" value="${commonFunction.getItem('mulu') || 'D:/Aria'}"  placeholder="留空使用默认目录" class="zhihu-input"></div></div>`
            contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>留空使用默认目录</p></div></div>'
            contenthtml +='</div>'
            contenthtml +='</div></form>'

            commonFunction.open({
                area: ['480', '380'],
                title: "发送到 Aria2 Json-RPC",
                shade: 0,
                id:"",
                btn: ['取消', '发送'],
                content:contenthtml,
                btn1: function(data) {
                    var n = data.getElementsByTagName('input');
                    for(let i= 0; i <n.length; i++ ){
                        if (n[i].getAttribute("name") == "rpc") {
                            commonFunction.setItem("rpc",n[i].value);
                        }
                        else if (n[i].getAttribute("name") == "token") {
                            commonFunction.setItem("token",n[i].value);
                        }
                        else if (n[i].getAttribute("name") == "mulu") {
                            commonFunction.setItem("mulu",n[i].value);
                        }
                    }
                    if (!commonFunction.getItem("rpc")){
                        return commonFunction.Toast('RPC地址必填');
                    }
                    _this.addUri(url, filename)
                }
            })
        },
        addUri(url, filename) {
            let _this = this
            var wsurl = commonFunction.getItem('rpc');
            var uris = [url.replace('https:', 'http:'), url];
            var token = commonFunction.getItem('token')?commonFunction.getItem('rpc'):'';
            var mulu = commonFunction.getItem('mulu')?commonFunction.getItem('mulu'):'D:/Aria'
            var options = {
                "max-connection-per-server": "16",
                "user-agent": _this.ua,
                'dir':mulu,
            };
            if (filename != "") {
                options.out = filename;
            }

            let json = {
                "id": "baiduwp-php",
                "jsonrpc": '2.0',
                "method": 'aria2.addUri',
                "params": [uris, options],
            };

            if (token != "") {
                json.params.unshift("token:" + token);
            }

            let patt = /^wss?\:\/\/(((([A-Za-z0-9]+[A-Za-z0-9\-]+[A-Za-z0-9]+)|([A-Za-z0-9]+))(\.(([A-Za-z0-9]+[A-Za-z0-9\-]+[A-Za-z0-9]+)|([A-Za-z0-9]+)))*(\.[A-Za-z0-9]{2,10}))|(localhost)|((([01]?\d?\d)|(2[0-4]\d)|(25[0-5]))(\.([01]?\d?\d)|(2[0-4]\d)|(25[0-5])){3})|((\[[A-Za-z0-9:]{2,39}\])|([A-Za-z0-9:]{2,39})))(\:\d{1,5})?(\/.*)?$/;
            if (!patt.test(wsurl)) {
                commonFunction.Toast('地址错误', 'WebSocket 地址不符合验证规则，请检查是否填写正确！', 'error');
                return;
            }
            var ws = new WebSocket(wsurl);

            ws.onerror = event => {
                console.log(event);
                commonFunction.Toast('连接错误', 'Aria2 连接错误，请打开控制台查看详情！', 'error');
            };
            ws.onopen = () => {
                ws.send(JSON.stringify(json));
            }

            ws.onmessage = event => {
                console.log(event);
                let received_msg = JSON.parse(event.data);
                if (received_msg.error !== undefined) {
                    if (received_msg.error.code === 1) commonFunction.Toast('通过RPC连接失败', '请打开控制台查看详细错误信息，返回信息：' + received_msg.error.message, 'error');
                }
                switch (received_msg.method) {
                    case "aria2.onDownloadStart":
                        commonFunction.Toast('Aria2 发送成功', 'Aria2 已经开始下载！' + filename, 'success');

                        localStorage.setItem('aria2wsurl', wsurl); // add aria2 config to SessionStorage
                        if (token != "" && token != null) localStorage.setItem('aria2token', token);
                        break;

                    case "aria2.onDownloadError": ;
                        commonFunction.Toast('下载错误', 'Aria2 下载错误！', 'error');
                        break;

                    case "aria2.onDownloadComplete":
                        commonFunction.Toast('下载完成', 'Aria2 下载完成！', 'success');
                        break;

                    default:
                        break;
                }
            };
        }
    };
    const Controllercsdn = {
        blog:async function(){
            const copy =()=>{
                let copynode = document.querySelectorAll("pre");
                copynode.forEach(function(item){
                    item.style.cssText = "user-select: auto;";
                    item.querySelector("code").style.cssText = "user-select: auto;";
                    item.querySelector("code").setAttribute("onclick","mdcp.copyCode(event)");
                    item.querySelector(".hljs-button").setAttribute("class","hljs-button {2}");
                    item.querySelector(".hljs-button").setAttribute("data-title","复制");
                });
                let copybtn = document.querySelectorAll("code .hljs-button");
                copybtn.forEach(function(item){
                    item.addEventListener('click',function() {
                        setTimeout(function(){
                            item.setAttribute("data-title","复制");
                            console.log("复制")
                        },3500);
                    });
                });
                commonFunction.Toast("解除复制限制成功",500);

            };
            const quanwen =() =>{
                var hide = commonFunction.Commonsetinterval([".hide-article-box.text-center"]);
                hide.then(function(hidenode){
                    hidenode.parentNode.removeChild(hidenode);
                    document.getElementById("article_content").style="height: *px; ";
                    commonFunction.Toast("解除阅读全文限制成功",500);
                });
            }
            const link =()=>{
                let linknode = document.getElementById("article_content").querySelectorAll("a");
                linknode.forEach(function(item){
                    if(item.origin!= window.location.origin){
                        item.onclick =(event)=> {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            }
                            item.setAttribute("target", "_blank");
                        };
                        commonFunction.Toast("解除外链重定向限制成功",500);
                    }
                })
            }
            //去除复制小尾巴
            try {
                // 复制时保留原文格式，参考 https://greasyfork.org/en/scripts/390502-csdnremovecopyright/code
                Object.defineProperty(unsafeWindow, "articleType", {
                    value: 0,
                    writable: false,
                    configurable: false
                });
                await commonFunction.sleep(1500);
                copy();
                quanwen();
                link();
            } catch (error) {
                console.log(error)
            }

        }
    };
    //-------------------------------------
    //脚本设置开始
    if(commonFunction.IsPC()===true){
        commonFunction.menusetting();
        // GM_deleteValue("videosetting");
        var Menu=GM_registerMenuCommand ("脚本设置", function(){
            var menulist = [
                {name:"VIP视频解析功能",value:"videosetting",set:commonFunction.GMgetValue("videosetting"),},
                {name:"电商优惠券查询功能",value:"couponsetting",set:commonFunction.GMgetValue("couponsetting"),},
                {name:"电商历史价格查询功能",value:"historysetting",set:commonFunction.GMgetValue("historysetting"),},
                {name:"短视频无水印下载功能",value:"Shortvideosetting",set:commonFunction.GMgetValue("Shortvideosetting"),},
                {name:"Bilibili无水印下载功能",value:"Bilibilisetting",set:commonFunction.GMgetValue("Bilibilisetting"),},
                {name:"喜马拉雅下载功能",value:"Ximalayasetting",set:commonFunction.GMgetValue("Ximalayasetting"),},
                {name:"教育盘论坛下载功能",value:"Jiaoyupansetting",set:commonFunction.GMgetValue("Jiaoyupansetting"),},
                {name:"文档下载功能",value:"Docssetting",set:commonFunction.GMgetValue("Docssetting"),},
                {name:"CSDN优化功能",value:"Csdnsetting",set:commonFunction.GMgetValue("Csdnsetting"),},

            ]
            var mainHTML = ""
            for(i in menulist){
                let text = menulist[i].set===1?"关闭":"开启";
                let style =menulist[i].set===1?"border: 1px solid #cacaca;":"border: 1px solid #54be99;color: #54be99;";
                mainHTML += '<div style="display: flex;justify-content: space-between;font-size: 14px;height: 38px;line-height: 38px;"><div>'+menulist[i].name+'</div><button style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;'+style+'border-radius: 5px;margin: 5px 0;background: #fff0;"  class="s" data-name="'+menulist[i].name+'" data-value="'+menulist[i].value+'">'+text+'</button></div>'
            }

            let m = document.createElement('div');
            m.innerHTML = '<h2 style="font-size: 18px;font-weight: bold;margin: 0 0 10px 0;line-height: 40px;">脚本功能设置</h2>'+mainHTML+'<button style="font-size: 14px;padding: 0 10px;line-height: 28px;height: 38px;border: 0;border-radius: 5px;margin: 10px 0;background: #54be99;color: #fff;width: 80px;" id="CloseMenu">关闭</button>';
            console.log(m)
            m.setAttribute('id','Menu');
            m.style.cssText = "box-shadow: 0px 0px 8px 1px rgb(98 99 99 / 34%);max-width:60%;width: 280px;padding:10px 20px;min-height: 40px;line-height: 40px;text-align: center;border-radius: 10px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 99999999;background: #fff;font-size: 16px;font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;";
            document.body.appendChild(m);
            let s = document.getElementsByClassName("s");
            for (var i = 0; i < s.length; i++) {
                s[i].addEventListener('click',function() {
                    var name = this.getAttribute("data-value");
                    if(commonFunction.GMgetValue(name)=== 1){
                        commonFunction.GMsetValue(name,0);
                        this.innerText = "开启";
                        this.style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;border: 1px solid #54be99;color: #54be99;border-radius: 5px;margin: 5px 0;background: #fff0;";
                        commonFunction.Toast(this.getAttribute("data-name")+"已关闭",1500);
                    }else{
                        commonFunction.GMsetValue(name,1);
                        this.innerText = "关闭";
                        this.style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;border: 1px solid #cacaca;border-radius: 5px;margin: 5px 0;background: #fff0;";
                        commonFunction.Toast(this.getAttribute("data-name")+"已开启",1500);
                    }
                });
            }
            document.querySelector("#CloseMenu").addEventListener('click',function() {
                document.body.removeChild(document.querySelector("#Menu"));
                window.location.reload();
            })

        }, "h");
    }
    //脚本设置结束
    //-------------------------------------------------------------------------
    //统一判断运行
    if(commonFunction.GMgetValue("isuser") == 1){
        switch (config.host) {
            case 'v.qq.com':
            case 'v.youku.com':
            case 'www.iqiyi.com':
            case 'www.mgtv.com':
            case 'w.mgtv.com':
            case 'www.le.com':
            case 'film.sohu.com':
            case 'tv.sohu.com':
            case 'v.pptv.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                }
                break;
            case 'www.bilibili.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if (config.playhref.indexOf("www.bilibili.com/bangumi/play") != -1) {
                        ControllerVideo.addbtn();
                    }
                }
                if(commonFunction.GMgetValue("Bilibilisetting")===1&&config.playhref.indexOf("/video/") != -1){
                    ControllerBilibili.Addlist();
                }
                break;
            case 'www.wasu.cn':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("www.wasu.cn/Play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入华数TV')
                break;
            case 'vip.1905.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("vip.1905.com/play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入1905电影网')
                break;
            case 'm.v.qq.com':
            case 'm.youku.com':
            case 'm.iqiyi.com':
            case 'm.mgtv.com':
            case 'm.le.com':
            case 'm.tv.sohu.com':
            case 'm.pptv.com':
                ControllerVideo.addmobbtn();
                break;
            case 'm.bilibili.com':
                if (config.playhref.indexOf("m.bilibili.com/bangumi/play") != -1) {
                    ControllerVideo.addmobbtn();
                }
                console.log('已进入手机bilibili');
                break;
            case 'item.taobao.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入淘宝');
                break;
            case 's.taobao.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.taobaoso();
                    commonFunction.setIntervalhost();
                }
                console.log('已进入淘宝搜索');
                break;
            case 'detail.tmall.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入天猫');
                break;
            case 'detail.tmall.hk':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入天猫国际');
                break;
            case 'chaoshi.detail.tmall.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入天猫超市');
                break;

            case 'list.tmall.com':
                ControllerCoupon.tmallso();
                // setItem("playwork","1")
                console.log('已进入天猫搜索');
                break;
            case 'item.yiyaojd.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入京东医药');
                break;
            case 'item.jd.com':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入京东');
                break;
            case 'npcitem.jd.hk':
                if(commonFunction.GMgetValue("couponsetting")===1){
                    ControllerCoupon.Getcoupon();
                }
                if(commonFunction.GMgetValue("historysetting")===1){
                    ControllerHistory.History();
                }
                console.log('已进入京东国际');
                break;
            case 'www.douyin.com':
                console.log('已进入抖音') ;
                if(commonFunction.GMgetValue("Shortvideosetting")===1)
                {
                    ControllerShortvideo.douyinbtn();
                }
                break;
            case 'www.kuaishou.com':
                console.log('已进入快手') ;
                if(commonFunction.GMgetValue("Shortvideosetting")===1)
                {
                    ControllerShortvideo.kuaishoubtn();
                }
                break;
            case 'www.ixigua.com':
                console.log('已进入西瓜视频') ;
                if(commonFunction.GMgetValue("Shortvideosetting")===1)
                {
                    ControllerShortvideo.xiguabtn();
                    commonFunction.setIntervalhost();
                }
                break;
            case 'www.ximalaya.com':
                console.log('已进入喜马拉雅') ;
                if(commonFunction.GMgetValue("Ximalayasetting")===1)
                {
                    Controllerximalaya.addximalaya();
                    commonFunction.setIntervalhost();
                }
                break;
            case 'jiaoyupan.com':
                console.log('已进入教育盘论坛') ;
                if(commonFunction.GMgetValue("Jiaoyupansetting")===1)
                {
                    Controllerforum.jiaoyupan();
                }
                break;
            case 'max.book118.com':
                console.log('已进入原创力') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.yuanchuangli();
                }

                break;
            case 'view-cache.book118.com':
            case 'view43.book118.com':
            case 'view44.book118.com':
            case 'view81.book118.com':
                console.log('已进入原创力PPT预览') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.yuanchuangliPPT();
                }

                break;
            case 'www.doc88.com':
                console.log('已进入道客巴巴') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.daokebaba();
                }

                break;
            case 'doc.mbalib.com':
                console.log('已进入智库文库') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.zhiku();
                }

                break;
            case 'www.docin.com':
                console.log('已进入豆丁网') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.docin();
                }

                break;
            case 'wenku.baidu.com':
            case 'wk.baidu.com':
                console.log('已进入百度文库') ;
                if(commonFunction.GMgetValue("Docssetting")===1)
                {
                    Controllerdocs.bdwk();
                }

                break;
            case 'blog.csdn.net':
                console.log('已进入csdn') ;
                if(commonFunction.GMgetValue("Csdnsetting")===1)
                {
                    Controllercsdn.blog();
                }

                break;
            case 'pan.baidu.com':
                console.log('已进入百度网盘') ;

                Controllerdupan.addbtn();

                break;

        }

        //网站判断执行结束
    }else{
        let userhtml = '<div id="user" style="position: fixed;top: 50%;left: 50%;width: 480px;max-width: 80%;height: 468px;border-radius: 10px;background-image: url(https://static.hitv.com/pc/img/601d3ee.png),url(https://static.hitv.com/pc/img/21b00eb.png);background-position: 0 0,100% 280px;background-repeat: no-repeat;background-color: #fff;-webkit-box-shadow: 0 0 80px rgba(0,0,0,.25);box-shadow: 0 0 80px rgba(0,0,0,.25);opacity: 1;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);z-index: 99999;">';
        if(commonFunction.IsWap() == "wap"){
            var btncss="margin: 0 20px;";
            var tybtncss="width: 130px;"
            }else{
                btncss="margin: 0 90px;";
                tybtncss="width: 180px;"
            }

        userhtml += '<div style="margin-top: 45px;color: #222;font-weight: 700;font-size: 28px;text-align: center;">脚本使用协议</div>'
        userhtml += '<div style="width: 100%;height: 220px;margin: 35px auto 40px;overflow-x: hidden;overflow-y: scroll;">'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您对本脚本的信任，为了更好的使用本脚本，在此，我们郑重提醒您：</p>'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">1.有能力的情况，请大家支持正版</p>'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">2.本脚本仅用学习交流，请勿用于非法、商业用途，使用本脚本下载的内容请勿进行复制、传播等侵权行为</p>'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">3.VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者，脚本不承担相关责任</p>'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">4.视频下载内容均来自平台本身API接口，不存在破解情况，如果侵权请邮件（188872170@qq.com）联系删除。</p>'
        userhtml +='<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">5.点击我同意后，即已代表您已经充分了解相关问题，否则后果自负，特此声明！</p></div>'
        userhtml +='<div style="display: flex;'+btncss+'justify-content: space-between;"><button style="width: 100px;height: 45px;border: none;border-radius: 25px;outline: none;color: #fff;background: #ddd;font-weight: 700;font-size: 15px;line-height: 45px;" id="bty">不同意</button> <button style="'+tybtncss+'height: 45px;border: none;border-radius: 25px;outline: none;color: #fff;background: #ffa000;background: -webkit-gradient(linear,left top,right top,from(#ff5f00),to(#ffa000));background: -webkit-linear-gradient(left,#ff5f00,#ffa000);background: -o-linear-gradient(left,#ff5f00 0,#ffa000 100%);background: linear-gradient(90deg,#ff5f00,#ffa000);font-weight: 700;font-size: 15px;line-height: 45px;" id="ty">我同意</button></div></div>'
        console.log(userhtml)
        document.body.insertAdjacentHTML('afterbegin', userhtml);


        document.querySelector("#ty").addEventListener('click',function() {
            commonFunction.GMsetValue("isuser","1");
            window.location.reload();
        })
        document.querySelector("#bty").addEventListener('click',function() {
            commonFunction.GMsetValue("isuser","0");
            document.body.removeChild(document.querySelector("#user"));
        });
    }


    //用户协议

    //监听网址
    // Your code here...
})();