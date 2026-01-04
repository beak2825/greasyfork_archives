// ==UserScript==
// @name         全网VIP视频全自动解析播放|抖音快手视频无水印下载
// @version      1.0.0
// @author       Hwe
// @description  全网VIP视频自动解析(60+解析端口)，适配PC+移动功能有：1、爱奇艺、腾讯、优酷、芒果等全网VIP视频免费解析去广告；新增抖音支持分辨率下载视频
// @match           *://laisoyiba.com/*
// @match           *://laisoyiba.com/*
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
// @match           *://www.le.com/ptv/vplay/*
// @match           *://m.v.qq.com/x/cover/*
// @match           *://m.v.qq.com/x/page/*
// @match           *://m.v.qq.com/x/m/play*
// @match           *://m.v.qq.com/play*
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
// @match           *://*.douyin.com/*
// @match           *://*.kuaishou.com/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-body
// @grant        unsafeWindow
// @run-at       document-start
// @license             End-User License Agreement

// @namespace https://greasyfork.org/users/846464
// @downloadURL https://update.greasyfork.org/scripts/471440/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%7C%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/471440/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%7C%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
	 
   var Insidehtml = "";
var Outsidehtml = "";
var selecthtml = "";
var mobhtml = "";
var PlayID = "";
var jiexi;
var playhref = window.location.href;
var host = window.location.host;
var goodid = "";
var method, action, qrname, nodeid;
const playList = [{"id":"71","name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
        {"id":"70","name":"纯净/B站","category":1,"url":"https://z1.m1907.cn/?jx=", "showType":3},
        {"id":"2","name":"思古高速","category":1,"url":"https://jsap.attakids.com/?url=", "showType":3},
        {"id":"3","name":"综合/B站","category":1,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},
        {"id":"4","name":"OK解析","category":1,"url":"https://okjx.cc/?url=", "showType":3},
        {"id":"1","name":"618g","category":1,"url":"https://jx.618g.com/?url=", "showType":3},
        {"id":"5","name":"夜幕1","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
	{"id":"6","name":"夜幕2","category":1,"url":"https://www.yemu.xyz/v/c.php?url=", "showType":3},
	{"id":"7","name":"夜幕3","category":1,"url":"https://www.yemu.xyz/v/d.php?url=", "showType":3},
        {"id":"8","name":"夜幕4","category":1,"url":"https://www.yemu.xyz/v/e.php?url=", "showType":3},	
        {"id":"9","name":"乐多资源","category":1,"url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", "showType":3},
        {"id":"10","name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":3},
        {"id":"11","name":"虾米","category":1,"url":"https://jx.xmflv.com/?url=", "showType":3},
        {"id":"12","name":"人人迷","category":1,"url":"https://jx.blbo.cc:4433/?url=", "showType":3},
        {"id":"13","name":"全民","category":1,"url":"https://660e.com/?url=", "showType":3},
        {"id":"14","name":"七哥","category":1,"url":"https://jx.mmkv.cn/tv.php?url=", "showType":3},
        {"id":"15","name":"BL解析","category":1,"url":"https://svip.bljiex.cc/?v=", "showType":3},
        {"id":"16","name":"8090","category":1,"url":"https://www.8090g.cn/jiexi/?url=", "showType":3},
        {"id":"17","name":"CK","category":1,"url":"https://www.ckplayer.vip/jiexi/?url=", "showType":3},
        {"id":"18","name":"小七","category":1,"url":"https://2.08bk.com/?url=", "showType":3},
        {"id":"19","name":"LE","category":1,"url":"https://lecurl.cn/?url=", "showType":3},
        {"id":"20","name":"ckmov","category":1,"url":"https://www.ckmov.vip/api.php?url=", "showType":3},
        {"id":"21","name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?url=", "showType":3},
        {"id":"22","name":"1717云","category":1,"url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":3},
        {"id":"23","name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":3},
        {"id":"24","name":"5gseo","category":1,"url":"https://sb.5gseo.net/?url=", "showType":3},
        {"id":"25","name":"H8","category":1,"url":"https://www.h8jx.com/jiexi.php?url=", "showType":3},
        {"id":"26","name":"解析la","category":1,"url":"https://api.jiexi.la/?url=", "showType":3},        
        {"id":"27","name":"云解析jj","category":1,"url":"https://lngyjj.cn/4/?url=", "showType":3},
        {"id":"28","name":"老板","category":1,"url":"https://vip.laobandq.com/jiexi.php?url=", "showType":3},
        {"id":"29","name":"盘古","category":1,"url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":3},
        {"id":"30","name":"盖世","category":1,"url":"https://www.gai4.com/?url=", "showType":3},
        {"id":"31","name":"YiTV","category":1,"url":"https://jiexi.us/?url=", "showType":3},       
        {"id":"32","name":"0523","category":1,"url":"https://go.yh0523.cn/y.cy?url=", "showType":3},
        {"id":"33","name":"17云","category":1,"url":"https://www.1717yun.com/jx/ty.php?url=", "showType":3},
        {"id":"34","name":"4K","category":1,"url":"https://jx.4kdv.com/?url=", "showType":3},
        {"id":"35","name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":3},
        {"id":"36","name":"8090","category":1,"url":"https://www.8090g.cn/?url=", "showType":3},
        {"id":"37","name":"江湖","category":1,"url":"https://api.jhdyw.vip/?url=", "showType":3},
        {"id":"38","name":"诺讯","category":1,"url":"https://www.nxflv.com/?url=", "showType":3},
        {"id":"39","name":"PM","category":1,"url":"https://www.playm3u8.cn/jiexi.php?url=", "showType":3}, 
        {"id":"40","name":"MaoPlayer","category":1,"url":"https://jx.dj6u.com/?url=", "showType":3}, 
        {"id":"41","name":"180","category":1,"url":"https://jx.000180.top/jx/?url=", "showType":3},
        {"id":"42","name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":3},  
        {"id":"43","name":"cd①号vip","category":1,"url":"https://vip.26db.cn/play/?v=", "showType":3},
        {"id":"44","name":"cd②号vip","category":1,"url":"https://vip.26db.cn/b/?url=", "showType":3},
        {"id":"45","name":"cd③号vip","category":1,"url":"https://vip.26db.cn/a/?url=", "showType":3},
        {"id":"46","name":"cd④号vip","category":1,"url":"https://vip.26db.cn/c/?url=", "showType":3},
        {"id":"47","name":"cd⑤号vip","category":1,"url":"https://vip.26db.cn/d/?url=", "showType":3},
        {"id":"48","name":"cd⑥号vip","category":1,"url":"https://vip.26db.cn/f/?url=", "showType":3},      
        {"id":"49","name":"cd⑧号通用","category":1,"url":"https://vip.26db.cn/g/?url=", "showType":3},
        {"id":"50","name":"CC解析","category":1,"url":"https://thinkibm.now.sh/?url=", "showType":3},
        {"id":"51","name":"truechat365","category":1,"url":"https://chaxun.truechat365.com/?url=", "showType":3},
        {"id":"52","name":"lngyjj","category":1,"url":"https://jx.iztyy.com/svip/?url=", "showType":3},
	{"id":"53","name":"铭人云解析","category":1,"url":"https://parse.123mingren.com/?url=", "showType":3},
	{"id":"54","name":"铭人备用","category":1,"url":"https://parse.123mingren.com/Bei/?url=", "showType":3},
	{"id":"55","name":"七彩","category":1,"url":"https://jx.xymav.com/?url=", "showType":3},
	{"id":"56","name":"吾爱解析","category":1,"url":"https://jx.xymav.com/?url=", "showType":3},
	{"id":"57","name":"freeget","category":1,"url":"http://www.freeget.org/jx.php?url=", "showType":3},
	{"id":"58","name":"奥特曼解析","category":1,"url":"https://api.aoteman.tv/?url=", "showType":3},
	{"id":"59","name":"ivito","category":1,"url":"https://jx.ivito.cn/?url=", "showType":3},
        {"id":"60","name":"vipjx","category":1,"url":"https://vipjx.cc/?url=", "showType":3},
	{"id":"61","name":"k8aa","category":1,"url":"https://k8aa.com/jx/index.php?url=", "showType":3},
        {"id":"72","name":"70808","category":1,"url":"https://jx.70808.net/?url=", "showType":3},
        {"id":"73","name":"全面解析","category":1,"url":"https://api.quanminjiexi.com/?v=", "showType":3},
        {"id":"74","name":"弹幕版VIP","category":1,"url":"https://vip.parwix.com:4433/player/?url=", "showType":3},
        {"id":"75","name":"二千线路","category":1,"url":"https://jx.ergan.top/?url=", "showType":3},
        {"id":"76","name":"无广告解析","category":1,"url":"https://jx.iztyy.com/Bei/?url=", "showType":3},
        



        {"id":"62","name":"综合线路","category":2,"url":"https://laisoyiba.com/mov/s/?sv=3&url=", "showType":1},
        {"id":"63","name":"纯净/B站","category":2,"url":"https://z1.m1907.cn/?jx=", "showType":1},
        {"id":"64","name":"高速接口","category":2,"url":"https://jsap.attakids.com/?url=", "showType":1},
        {"id":"65","name":"综合/B站1","category":2,"url":"https://vip.parwix.com:4433/player/?url=", "showType":1},
        {"id":"66","name":"OK解析","category":2,"url":"https://okjx.cc/?url=", "showType":1},
        {"id":"67","name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
        {"id":"68","name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
        {"id":"69","name":"全民","category":2,"url":"https://jx.quanmingjiexi.com/?url=", "showType":1},
];
function Toast(msg, duration = 3000) {
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.setAttribute('id','msg');
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(() => {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
    }, duration);
}
function GMsetValue(name, Value) {
        localStorage.setItem(name, Value);
}
function GMgetValue(name) {
        let StorageValue = localStorage.getItem(name);
        return StorageValue;
}
function GMdeleteValue(name) {
        localStorage.removeItem(name);
}
function GMaddStyle(css) {
        var addStyle = document.createElement('style');
        addStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(addStyle);
};
function GMaddScript(js) {
        let script = document.createElement('script');
        script.src = js;
        var docu = document.head || document.documentElement;
        docu.appendChild(script);
};
function GMaddlink(linkcss) {
        let mylink = document.createElement('link');
        mylink.href = linkcss;
        mylink.rel = 'stylesheet';
        var docl = document.head || document.documentElement;
        docl.appendChild(mylink);
};
function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
        } else {
                GM.openInTab(url, open_in_background);
        }
};
function Addjs() {
        GMaddScript("https://www.layuicdn.com/layui/layui.js");
        GMaddlink("https://www.layuicdn.com/layui/css/layui.css");
}
switch (host) {
case 'v.qq.com':
        PlayID = "#mod_player";
        Addjs();
        addbtn();
        console.log('已进入腾讯');
        setInterval(function() {
        let e = document.querySelector("#mask_layer");
        if (e != null) e.parentNode.removeChild(e);
        let f = document.querySelector(".mod_vip_popup");
        if (f != null) f.parentNode.removeChild(f);
        },
        100);
        break;
case 'v.youku.com':
        Addjs();
        PlayID = "#player";
        addbtn();
        console.log('已进入优酷')
        break;
case 'www.iqiyi.com':
        Addjs();
        PlayID = "#flashbox";
        addbtn();
        console.log('已进入爱奇艺')
        break;
case 'www.mgtv.com':
        Addjs();
        PlayID = "#mgtv-player-wrap";
        addbtn();
        console.log('已进入芒果TV')
        break;
case 'www.bilibili.com':
        Addjs();
        PlayID = "#player_module";
        if (playhref.indexOf("www.bilibili.com/bangumi/play") != -1) {
                addbtn();
        }
        console.log('已进入bilibili')
        break;
case 'www.le.com':
        Addjs();
        PlayID = "#le_playbox";
        addbtn();
        console.log('已进入乐视TV')
        break;
case 'laisoyiba.com':
        setInterval(function() {
        let e = document.querySelector(".jconfirm-scrollpane");
        if (e != null) e.parentNode.removeChild(e);
        },
        100);
        break;
case 'm.v.qq.com':
        PlayID = "#player";
        addmobbtn();
        setInterval(function() {
        let e = document.querySelector("#vipPosterContent");
        if (e != null) e.parentNode.removeChild(e);
        let f = document.querySelector(".at-app-banner");
        if (f != null) e.parentNode.removeChild(f);
        },
        100);
        console.log('已进入手机腾讯');
        break;
case 'm.youku.com':
        PlayID = "#player";
        setInterval(function() {
        let e = document.querySelector(".callEnd_box");
        if (e != null) e.parentNode.removeChild(e);
        },
        100);
        addmobbtn();
        console.log('已进入手机优酷');
        break;
case 'm.iqiyi.com':
        PlayID = ".m-video-player-wrap";
        addmobbtn();
        console.log('已进入手机爱奇艺');
        break;
case 'm.mgtv.com':
        PlayID = ".video-area";
        setInterval(function() {
            let e = document.querySelector(".mg-down-btn");
            if (e != null) e.parentNode.removeChild(e);
            let f = document.querySelector(".ad-fixed-bar");
            if (f != null) e.parentNode.removeChild(f);
        },
        100);
        addmobbtn();
        console.log('已进入手机芒果TV');
        break;
case 'm.bilibili.com':
        PlayID = "#bofqi";
        if (playhref.indexOf("m.bilibili.com/bangumi/play") != -1) {
                addmobbtn();
        }
        console.log('已进入手机bilibili');
        break;
case 'm.le.com':
        PlayID = "#j-player";
        setInterval(function() {
            document.querySelector("#j-player").style.display = "block";
            let e = document.querySelector("#j-vipLook");
            if (e != null) e.parentNode.removeChild(e);
            let f = document.querySelector(".daoliu1");
            if (f != null) f.parentNode.removeChild(f);

        },
        100);
        addmobbtn();
        console.log('已进入手机乐视TV');
        break;
}
setInterval(function() {
        var workurl = window.location.href;
        if (playhref != workurl) {
                console.log('网址改变了');
            playhref = workurl;
                window.location.reload()
        }
},
1000);
function CheckAutoplay() {
        if (GMgetValue("AutoPlay") == 1) {
                autoplay();
                Toast('2秒后自动解析视频',2000);

        }
}
function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
}
function Playlist() {
        for (let i = 0; i < playList.length; i++) {
                if (playList[i].category == 1) {
                        Insidehtml += "<span  class='jiexi inside' id='Inside_" + playList[i].id + "'  title='" + playList[i].name + "' data-index='" + i + "' data-url='" + playList[i].url + "'>" + playList[i].name + "</span>";
                        selecthtml += "<option value='" + playList[i].id + "' name='select' data-url='" + playList[i].url + "'>" + playList[i].name + "</option>"
                        if (playList[i].showType == 3) {
                                mobhtml += "<span  class='mob-jiexi' id='mob_" + playList[i].id + "'  title='" + playList[i].name + "' data-index='" + i + "' data-url='" + playList[i].url + "'>" + playList[i].name + "</span>";
                        }
                } else {
                        Outsidehtml += "<span  class='jiexi outside 'title='" + playList[i].name + "' data-index='" + i + "' data-url='" + playList[i].url + "'>" + playList[i].name + "</span>";
                }

        }
        console.log(mobhtml);
}

async function addmobbtn() {
        await sleep(1000);
        CheckAutoplay();
        Playlist();
        var offautohtml = '<span id="off">关闭自动解析</span><img src="data:image/png;base64,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">'
        var onautohtml = '<span id="on">开启自动解析</span><img src="data:image/png;base64,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">'
        var autohtml;
        if (GMgetValue("AutoPlay") == 1) {
                autohtml = offautohtml
        } else {
                autohtml = onautohtml
        }
        var mainhtml = '<div class="mob-main"><div class="shaw"></div><div class="listmian"><div class="listmian-tit"><p>解析接口列表</p><div class="title_right" id="autobtn">' + autohtml + '</div></div><div class="list">' + mobhtml + '</div><p class="tips"><span class="ico">*</span><span>开启自动解析后，最后一次选择的接口即自动解析默认接口</span></p><p class="tips"><span class="ico">*</span><span>本脚本仅学习使用，解析接口收集于网络，版权问题联系接口制作者，请勿相信解析接口显示的任何广告</span></p></div></div>'
        var btnhtml = '<div class="elevator"><a class="elevator-msg" id="Showmain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a  id="playing" class="elevator-faq" target="_blank"><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>' + mainhtml;
        var mb = document.createElement('div');
        mb.innerHTML = btnhtml;
        document.body.appendChild(mb);
        var css = `body, html {
		         font-family: "PingFang SC","微软雅黑","Microsoft YaHei",Helvetica,"Helvetica Neue",Tahoma,Arial,sans-serif;
		    }
			.elevator {
				position: fixed;
				padding: 0 10px;
				top: 80%;
				margin-top: -140px;
				right: 10px;
				z-index: 899;
				background: rgb(64 64 64 / 81%);
				box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
				border-radius: 30px;
			}

			.elevator a {
				position: relative;
				display: block;
				width: 26px;
				height: 56px;
				font-size: 22px;
				line-height: 20px;
				color: #b5b9bc;
				box-sizing: border-box;
				text-align: center;
			}

			.elevator a+a:after {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -12px;
				content: '';
				width: 24px;
				border: 1px solid #F3F5F7;
			}

			.elevator a:hover {
				color: #14191e;
			}

			.elevator .icon {
				font-size: 24px;
				line-height: 56px;
				color: #199b6d;
				width: 28px;
				height: 28px;
				margin: 14px 0;
			}

			.elevator .icon:hover {
				color: #14191e;
			}

			.elevator a span {
				display: none;
				padding: 14px 0;
				font-size: 12px;
				color: #fff;
				line-height: 14px;
			}

			.elevator .elevator-msg:hover .icon,
			.elevator .elevator-faq:hover .icon, {
				display: none;
			}

			.elevator .elevator-msg:hover span,
			.elevator .elevator-faq:hover span, {
				display: inline-block;
			}
            .mob-main{
               display: none;
            }
            .shaw{
                  width: 100%;
                  height: 100%;
                  position: fixed;
                  top: 0;
                  left: 0;
                  z-index: 900;
                  background: rgba(0,0,0,0.3);
            }
            .listmian{
                position: fixed;
                width:100%;
                height:400px;
				bottom: 0;
				z-index: 901;
                border-radius: 14px 14px 0 0;
                background: #fff;
                box-shadow: 0 -8px 10px 0 rgba(0,0,0,.09);
               }
            .listmian-tit{
               background-color: #f5f5f5;
               height: 60px;
               line-height: 60px;
               position: relative;
               border-radius: 14px 14px 0 0;
            }
            .listmian-tit p {
               color: #222;
               font-size: 18px;
               font-weight: 600;
               margin-left: 20px;
               float: left;
            }
            .listmian-tit .title_right {
               float: right;
               margin-right: 20px;
             }
             .listmian-tit .title_right span{
               display: inline-block;
               color: #222;
               font-size: 14px;
               vertical-align: middle;
               font-weight: 900;
             }
             .title_right img{
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-left: 3px;
                vertical-align: middle;
             }
             .list{
                margin: 10px 20px;
                display:flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                height: 240px;
                overflow-y: scroll;
             }
             .list span{
               display: inline-block;
               padding: 10px 5px;
               margin: 0 0 10px 0;
               background-color: #f6f8fa;
               border-radius: .07rem;
               width: 90px;
               text-align: center;
               font-size: 12px;
             }
             .jiexiselect{
             color: #ff6022;
             }
             .tips{
               margin: 10px 20px;
             }
             .tips span{
               font-size: 12px;
               font-weight: 700;
               color: #333;
             }
             .tips .ico{
               margin-right: 5px;
               color: #ff6022;
             }

          `;
        GMaddStyle(css);
        if (GMgetValue('selectid') != null) {
                document.querySelector('#' + GMgetValue('selectid')).classList.add("jiexiselect");
        }

        document.querySelector('#playing').addEventListener('click',
        function() {
                autoplay();
                Toast('2秒后自动解析视频',2000);

        });
        document.querySelector('#Showmain').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "block"
        });
        document.querySelector('.shaw').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "none"
        })

        document.querySelector('#autobtn').addEventListener('click',function() {
                if (GMgetValue('AutoPlay') == 1) {
                        this.innerHTML = onautohtml;
                        GMsetValue('AutoPlay', '0');
                } else {
                        this.innerHTML = offautohtml;
                        GMsetValue('AutoPlay', '1');
                        Toast('2秒后自动解析视频',2000);
                };
        });
        var list = document.getElementsByClassName('mob-jiexi');
        for (var i in list) {
                list[i].addEventListener('click',
                function() {
                        if (GMgetValue('selectid') != null) {
                                document.querySelector('#' + GMgetValue('selectid')).classList.remove("jiexiselect");
                        }
                        var playObjecturl = this.getAttribute("data-url");
                        var playid = this.getAttribute("id");
                        console.log(playid);
                        GMsetValue('selectid', playid);
                        GMsetValue('selecturl', playObjecturl);
                        this.classList.add("jiexiselect");
                        document.querySelector(".mob-main").style.display = "none";
                        let url = playObjecturl + window.location.href;
                        console.log(url);
                        GoPlay(url);
                })
        }
}

async function addbtn() {
        await sleep(2000);
        CheckAutoplay();
        var btnhtml = '<div class="elevator"><a class="elevator-msg" id="PlayMain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a  id="playing" class="elevator-faq" target="_blank"><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>';
        var b = document.createElement('div');
        b.innerHTML = btnhtml;
        document.body.appendChild(b);
        console.log("加载成功");
        var css = `body, html {
		        font: 14px/1.5 "PingFang SC","微软雅黑","Microsoft YaHei",Helvetica,"Helvetica Neue",Tahoma,Arial,sans-serif;
		        color: #1c1f21;
		        height: 100%;
		    }
			.elevator {
				position: fixed;
				    padding: 0 16px;
				    top: 55%;
				    margin-top: -140px;
				    left: 0;
				    z-index: 899;
				    background: rgb(134 134 134 / 40%);
                    box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
				    border-radius: 0 8px 8px 0;
			}

			.elevator a {
				position: relative;
				display: block;
				width: 26px;
				height: 56px;
				font-size: 22px;
				line-height: 20px;
				color: #b5b9bc;
				box-sizing: border-box;
				text-align: center;
			}

			.elevator a+a:after {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -12px;
				content: '';
				width: 24px;
				border: 1px solid #F3F5F7;
			}

			.elevator a:hover {
				color: #14191e;
			}

			.elevator .icon {
				font-size: 24px;
				line-height: 56px;
				color: #199b6d;
				width: 28px;
				height: 28px;
				margin: 14px 0;
			}

			.elevator .icon:hover {
				color: #14191e;
			}

			.elevator a span {
				display: none;
				padding: 14px 0;
				font-size: 12px;
				color: #fff;
				line-height: 14px;
			}

			.elevator .elevator-msg:hover .icon,
			.elevator .elevator-faq:hover .icon, {
				display: none;
			}

			.elevator .elevator-msg:hover span,
			.elevator .elevator-faq:hover span, {
				display: inline-block;
			}
			.jiexi{
				padding: 5px 10px;
				background: #e5e5e5a3;
				font-size: 12px;
				border-radius: 4px;
				margin:0 5px 10px 5px;
			    color: #505050;
				display: inline-block;
				width: 70px;
				text-align: center;
			}
			.jiexiselect{
				color: #fff;
				background: #fc5531;
			}
            .scan{
               width:164px;
			   display:inline-block;
			   text-align: center;
            }
			.scan img{
				width: 140px;
				margin: 0 5px 10px 5px;
			}
			.scan h1{
				font-size: 18px;
				font-weight: bold;
				margin: 0px 0 20px 0;
			}
			.scan p{
			  margin: 0;
			  color: #666;
			  font-size: 14px;
			}
            .layui-layer-btn0{
              border: 1px solid #dedede!important;
              background-color: #fff!important;
              color: #333!important;
            }
            .layui-layer-btn1{
              border-color: #1E9FFF!important;
              background-color: #1E9FFF!important;
              color: #fff!important;
            }
         `;
        GMaddStyle(css);
        Playlist();
        GMdeleteValue('selectid');
        document.querySelector('#playing').onclick = function() {
                autoplay();
                Toast('2秒后自动解析视频',2000);
        };
        document.querySelector('#PlayMain').onclick = function() {
                console.log("点击成功");
                jiexi = GMgetValue('AutoPlay') == 1 ? "checked": "";
                layer.tab({
                        area: ['445px', '400px'],
                        id: "sett2",
                        btn: ['取消', '保存设置'],
                        btnAlign: 'c',
                        tab: [{
                                title: '内嵌播放',
                                content: '<div style="margin:20px 30px 0 30px;display:flex"><div style="width:336px;" id="jiexilist">' + Insidehtml + '</div>'
                        },
                        {
                                title: '跳转播放',
                                content: '<div style="margin:20px 30px 0 30px;display:flex"><div style="width:336px;" id="jiexilist">' + Outsidehtml + '</div>'
                        },
                        {
                                title: '解析设置',
                                content: '<script src="https://www.layuicdn.com/layui/layui.js"></script><div style="margin:20px 30px 0 30px;display:flex"><div style="width:356px;" id="jiexilist"><form class="layui-form" action=""><div class="layui-form-item"><label class="layui-form-label">自动解析</label><div class="layui-input-block"><input type="checkbox" ' + jiexi + ' name="switch" lay-skin="switch" id="autoplay" lay-text="ON|OFF"></div></div><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">解析接口</label><div class="layui-input-inline"><select name="selectjiexi" lay-verify="required"  id ="selectjiexi"><option value="">直接选择或搜索选择</option>' + selecthtml + '</select></div></div></div></form></div>'
                        }],
                        btn2: function(index, layero) {
                                layero.find("option:selected").each(function() {
                                        if (this.getAttribute("name") == "select") {
                                                let selectedid = this.getAttribute("value");
                                                let selecturl = this.getAttribute("data-url");
                                                GMsetValue('selectedid', selectedid);
                                                GMsetValue('selecturl', selecturl);
                                                console.log(GMgetValue('selectedid'));
                                        }
                                });
                                layero.find("input").each(function() {
                                        if (this.getAttribute("name") == "switch") {
                                                let onswitch = document.querySelector("#autoplay+div").getAttribute("class");
                                                if (onswitch.indexOf("layui-form-onswitch") != -1) {
                                                        GMsetValue('AutoPlay', '1');
                                                        autoplay();
                                                        Toast('2秒后自动解析视频',2000);
                                                } else {
                                                        GMsetValue('AutoPlay', '0');
                                                }
                                        }
                                });
                        }
                });
                if (GMgetValue('selectid') != null) {
                        document.querySelector('#' + GMgetValue('selectid')).className += " jiexiselect";
                }
                if (GMgetValue('selectedid') != null) {
                        document.querySelector('#selectjiexi').value = GMgetValue('selectedid');
                }
                var inList = document.getElementsByClassName('inside');
                for (var i = 0; i < inList.length; i++) {
                        inList[i].addEventListener('click',
                        function() {
                                if (GMgetValue('selectid') != null) {
                                        document.querySelector('#' + GMgetValue('selectid')).classList.remove("jiexiselect");
                                }
                                Toast('2秒后自动解析视频',2000);
                                var playObjecturl = this.getAttribute("data-url");
                                var playid = this.getAttribute("id");
                                console.log(playid);
                                GMsetValue('selectid', playid);
                                console.log(GMgetValue('selectid'));
                                this.className = "jiexi inside jiexiselect";
                                document.body.removeChild(document.querySelector(".layui-layer-tab"));
                                document.body.removeChild(document.querySelector(".layui-layer-shade"));
                                let url = playObjecturl + window.location.href;
                                console.log(url);
                                GoPlay(url);
                        });
                }

                var outList = document.getElementsByClassName('outside');
                console.log(outList);
                for (var u = 0; u < outList.length; u++) {
                        outList[u].addEventListener('click',
                        function() {
                                let playObjecturl = this.getAttribute("data-url");
                                let Outsideurl = playObjecturl + window.location.href;
                                document.body.removeChild(document.querySelector(".layui-layer-tab"));
                                document.body.removeChild(document.querySelector(".layui-layer-shade"));
                                console.log(Outsideurl);
                                window.open(Outsideurl);
                        });
                }
        }
}

async function autoplay() {
        await sleep(2000);
        var f = "";
        var autoplayurl;
        if (GMgetValue('selecturl') != null) {
                f = GMgetValue('selecturl');
        }
        if (f != "") {
                autoplayurl = f + window.location.href;
        } else {
                let defurl = playList[0].url;
                console.log(defurl);
                autoplayurl = defurl + window.location.href;
        }
        GoPlay(autoplayurl);
}
function GoPlay(e) {
        let playurl = e;
        var iframeDivCss = "width:100%;height:100%;"
        if (host.indexOf("m.iqiyi.com") != -1) {
                iframeDivCss += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
        }
        var videoPlayer = "<div style='" + iframeDivCss + "' id='zhihuplay'><iframe id='iframe-player-99087lkj' src='" + playurl + "' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
        var PlayCount;
        var PlayPromise = new Promise(function(resolve, reject){
          PlayCount = setInterval(function() {
              var a = document.querySelector(PlayID);
              if(a != null ){
               resolve(a)
             }
            console.log("监听")
           },1000);
        });
         PlayPromise.then(function(msg){
         clearInterval(PlayCount);
         document.querySelector(PlayID).innerHTML = "";
         document.querySelector(PlayID).innerHTML = videoPlayer;
       });
}

function Getgoodid(gid) {
        var reg = new RegExp("(^|&)" + gid + "=([^&]*)(&|$)");
        var s = window.location.search.substr(1).match(reg);
        if (s != null) {
                return s[2];
        }
        return "";
}
function geturlid(url) {
        if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
        }
        if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
        }
        var text = url.split("/");
        var id = text[text.length - 1];
        id = id.replace(".html", "");
        return id
}



    /*--config--*/
    var Config ={
         couponUrl:window.location.href,
         couponHost:window.location.host,
         isMobile:/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
        couponWaitTime : 1500,
        dyVideoDownload:GM_getValue('dyVideoDownload',22),
        ksVideoDownload:GM_getValue('ksVideoDownload',22),
     }

    var {couponUrl,
         couponWaitTime,
         dyVideoDownload,
         ksVideoDownload
        } = Config;

    /*--lang--*/
    var lang = {
        dyVideoDownload:'抖音下载',
        ksVideoDownload:'快手下载',
    };

    /*--datas--*/
    var datas = {
/*
        douYin:[{isOpen:GM_getValue('douyinList','22'),web:[
            {funcName:'douyinDownload',match:/^https?:\/\/www\.douyin\.com\/?[^.+]$/},
            {funcName:'douyinDownload',match:/^https?:\/\/www\.douyin\.com\/\?enter\=guide$/},
        ]}],
*/
        videoDownload:[{isOpen:GM_getValue('videoDownloadList','22'),web:[
            /*
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/?[^.+]$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/\?enter\=guide$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/follow$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/vs$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/discover\?modal_id=.+$/}
            */
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/?.+$/,isWebOpen:dyVideoDownload},
            {funcName:'videoDownload',name:'ksVideoDownload',match:/^https?:\/\/www\.kuaishou\.com\/?.+$/,isWebOpen:ksVideoDownload},
        ]}],

       downloadOption:[{name:'直接下载',id:'toDownload'},{name:'复制链接',id:'toCopy'},{name:'打开文件',id:'toLink'}]

    }

    var {videoDownload,downloadOption} = datas;
    /*--create style--*/
    var domHead = document.getElementsByTagName('head')[0];

    var domStyle = document.createElement('style');

    domStyle.type = 'text/css';

    domStyle.rel = 'stylesheet';
    /*--Class--*/
    class BaseClass{

        constructor(){

            var _this = this;
            var videoDownloadOptionJson = [
                {'optionName':lang.dyVideoDownload,'optionID':'dyVideoDownload','default':dyVideoDownload},
                {'optionName':lang.ksVideoDownload,'optionID':'ksVideoDownload','default':ksVideoDownload},
            ];

        }

        createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        request(method,url,data){

            let request = new XMLHttpRequest();

            return new Promise((resolve,reject)=>{

                request.onreadystatechange=function(){

                    if(request.readyState==4){

                        if(request.status==200){

                            resolve(request.responseText);

                        }else{

                            reject(request.status);
                        }

                    }
                }

                request.open(method,url);

                request.send(data);

            })

        }



        static getElement(css){

            return new Promise((resolve,reject)=>{

                let num = 0;

                let timer = setInterval(function(){

                    num++

                    let dom = document.querySelector(css);

                    if(dom){

                        clearInterval(timer);

                        resolve(dom);

                    }else{

                        if(num==20){clearInterval(timer);resolve(false);}
                    }

                },300)

            })


        }

        static toast(msg,duration){

            duration=isNaN(duration)?3000:duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 30px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {
                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);
        }

    }






    class VideoDownloadClass extends BaseClass{

        constructor(){

            super();
        }

        dyVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                 async function getControls(){

                     let videoDom = await BaseClass.getElement('.xg-video-container');

                     if(!videoDom){

                         console.log('没有找到DOM');return;
                     }

                     let vsNav = document.querySelector('.fuy_wmct:nth-of-type(5)');

                     if((vsNav && vsNav.className.indexOf('LXX79le5') != -1) || couponUrl.indexOf('vsdetail') != -1){
                         console.log('综艺栏目关闭下载');return;
                     }

                     _this.createDyVideoDownload();

                     let videoPlayDomAll = document.querySelectorAll('video');

                     let videoIndex = videoPlayDomAll.length>1?videoPlayDomAll.length-2:videoPlayDomAll.length-1;

                     let videoPlayDom = videoPlayDomAll[videoIndex];

                     //let videoPlayDom = videoPlayDomAll.length>1?videoPlayDomAll[videoPlayDomAll.length-2]:videoPlayDomAll[videoPlayDomAll.length-1];

                     videoPlayDom.addEventListener('ended',function(){ //结束

                         console.log("播放结束");

                         let autoPlay = document.querySelector('.xg-switch-checked');

                         if(autoPlay){

                             getControls();
                             return;
                         }

                     }, false);

                     document.querySelector('#toDownload').addEventListener('click',function(){

                         BaseClass.toast('正在下载请稍侯');

                         let dataUrl = document.querySelector('#zhmDouyinDownload').getAttribute('data-url');

                         let match = /[https]?:?\/\/www\.douyin\.com\/.+\/([0-9]+)/;

                         let video = dataUrl.match(match);

                         let videoId = video[1];

                         let url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids='+video[1];

                         let uri = videoDownloadClass.request('get',url).then((result)=>{

                             let resp = JSON.parse(result);

                             //let playUrl = resp.item_list[0].video.play_addr.url_list[0];//下载有水印

                             if(resp.item_list.length > 0){

                                 let uriId = resp.item_list[0].video.play_addr.uri;

                                 let playUrl = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${uriId}&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH`;

                                 let info = document.querySelectorAll('.Nu66P_ba');

                                 let account = info[videoIndex*2].innerText;

                                 let titleArr = info[videoIndex*2+1].innerText.split('#');

                                 let title = titleArr[0]?titleArr[0]:titleArr[1];

                                 //console.log(account,title);

                                 GM_download(playUrl,title+account+".mp4");

                             }else{
                                 console.log('API没有获取视频ID');
                             }

                         }).catch((error)=>{ console.log(error);})

                     })

                     document.querySelector('#toCopy').addEventListener('click',function(){

                         BaseClass.toast('已复制到剪贴板');

                         GM_setClipboard(videoPlayDom.children[0].src);
                     })

                     document.querySelector('.toLink').addEventListener('click',function(){

                         window.open(videoPlayDom.children[0].src);

                     })

                     return;
                 }

                 getControls();

                 window.addEventListener("wheel",getControls);

                 window.addEventListener('keydown',function(e){

                     if(e.code=='ArrowDown' || e.code=='ArrowUp'){

                         getControls();
                     }

                 })

                 async function insertedDom(){

                     let videoDom = await BaseClass.getElement('video');

                     if(!videoDom){

                         console.log('没有找到DOM');return;
                     }

                     videoDom.addEventListener('DOMNodeInserted',(e) => {

                         getControls();

                     })

                 }

                 insertedDom();

                 window.addEventListener('click',getControls);

             })

        }

        createDyVideoDownload(){

            let controlAll = document.querySelectorAll('.xg-right-grid');

            let controls = controlAll.length>1?controlAll[controlAll.length-2]:controlAll[controlAll.length-1];

            let videoDownloadDom = document.querySelector('#zhmDouyinDownload');

            if(videoDownloadDom){

                //videoDownloadDom.parentNode.removeChild(videoDownloadDom);

                videoDownloadDom.parentNode.parentNode.parentNode.removeChild(videoDownloadDom.parentNode.parentNode)
            }

            let playSeting = controls.querySelector('.xgplayer-playback-setting');

            let downloadDom = playSeting.cloneNode(true);

            downloadDom.style='margin-right:20px;';

            let downloadText = downloadDom.querySelector('div:first-child > span:first-child');

            downloadText.innerText='下载';

            downloadText.style = 'font-size:12px;font-weight:400;';

            downloadText.setAttribute('id','zhmDouyinDownload');

            let detail = controls.querySelector('xg-icon:nth-of-type(1)').children[0];

            let linkUrl = detail.getAttribute('href')?detail.getAttribute('href'):location.href;

            downloadText.setAttribute('data-url',linkUrl);

            downloadText.removeAttribute('target');

            downloadText.setAttribute('href','javascript:void(0);');

            downloadDom.onmouseover=function(){

                downloadDom.className='xgplayer-playback-setting slide-show';

            }

             downloadDom.onmouseout=function(){

                downloadDom.className='xgplayer-playback-setting';
            }

            let downloadHtml = '';

            downloadOption.forEach(function(item){

                downloadHtml += `<div class="xgplayer-playratio-item ${item.id}" id="${item.id}">${item.name}</div>`;

            })

            downloadDom.querySelector('.xgplayer-playratio-wrap').innerHTML = downloadHtml;

            downloadDom.querySelector('.xgplayer-slider').style='width:60px important;';

            let autoPlay = document.querySelector('.xgplayer-autoplay-setting');

            autoPlay.after(downloadDom);

            let divDom = document.createElement('div');

            divDom.style="position: absolute;z-index:-999;height:80px;width:40px;margin-top:-80px;"

            downloadDom.appendChild(divDom);

            /*
            let detailDom = controls.querySelector('xg-icon:nth-of-type(1)');

            let xgIcon = detailDom.cloneNode(true);

            if(xgIcon.children[1] && xgIcon.children[1].className=='xg-tips'){

                xgIcon.children[1].innerHTML='下载视频';
            }

            xgIcon.className='xgplayer-detail-entry';

            xgIcon.children[0].style='margin-right:16px;';

            xgIcon.children[0].setAttribute('id','zhmDouyinDownload');

            let linkUrl = xgIcon.children[0].getAttribute('href')?xgIcon.children[0].getAttribute('href'):location.href;

            xgIcon.children[0].setAttribute('data-url',linkUrl);

            xgIcon.children[0].removeAttribute('target');

            xgIcon.children[0].setAttribute('href','javascript:void(0);');

            xgIcon.children[0].innerHTML="<div class='desc' style='font-size:12px;line-height:20px;'>下载</div>";

            let autoPlay = document.querySelector('.xgplayer-autoplay-setting');

            autoPlay.after(xgIcon);
            */

        }

        ksVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                async function getControls(){

                     let videoDom = await BaseClass.getElement('.player-video');

                    if(!videoDom){

                        console.log('没有找到DOM');return;

                    }

                    if(videoDom.getAttribute('src').match(/^blob/)){
                        console.log('blob视频无法下载');return;
                    }

                    _this.createKsVideoDownload(videoDom);

                    videoDom.addEventListener('playing',function(){ //播放中
                        console.log("播放中");
                    });

                    videoDom.addEventListener('ended',function(){ //结束

                        console.log("播放结束");

                        let autoPlay = document.querySelector('.auto-warpper').getAttribute('autoplay');

                        if(autoPlay){
                            getControls();
                            return;

                        }

                    }, false);

                    document.querySelector('#toDownload').addEventListener('click',function(){

                        BaseClass.toast('正在下载请稍侯');

                        let playTimeTotal = document.querySelector('.total').innerText;

                        let second = playTimeTotal.match(/(.+):(.+)/);

                        let secondTotal = second[1]*60+parseInt(second[2]);

                        let dataUrl = document.querySelector('#zhmKsDownload').getAttribute('data-url');

                        let account = document.querySelector('.profile-user-name-title').innerText;

                        let title = document.querySelector('.video-info-title').innerText;

                        let videoFileName = (account && title)?account+'-'+title+'.mp4':new Date().getTime()+'.mp4';

                        GM_download(dataUrl,videoFileName);

                        /*

                        if(secondTotal<30){

                            let videoFileName = new Date().getTime()+'.mp4';

                            GM_download(dataUrl,videoFileName);

                        }else{

                            window.open(dataUrl);
                        }
                        */
                    })

                    document.querySelector('#toCopy').addEventListener('click',function(){

                         BaseClass.toast('已复制到剪贴板');

                         GM_setClipboard(videoDom.getAttribute('src'));
                     })

                     document.querySelector('#toLink').addEventListener('click',function(){

                         window.open(videoDom.getAttribute('src'));

                     })

                }

               getControls();

                document.addEventListener('click',function(e){

                    getControls();


                })

            })


        }

        createKsVideoDownload(videoDom){

             let match = /^https?:\/\/www\.kuaishou\.com\/(.+)\/.+/;

            let resp = location.href.match(match);

            if(!resp || (resp[1] != 'short-video' && resp[1] != 'video')){

                console.log('当前不是视频播放页');return;
            }

            if(resp[1] == 'short-video'){

                let playerArea = document.querySelector('.video-container-player');

                let playerAreaWidth = playerArea.style.width.match(/(.+)px/);

                let playerBarProgress = document.querySelector('.player-bar-progress');

                playerBarProgress.style.width = playerAreaWidth[1]-260+'px';

                let timeTotal = document.querySelector('.total');

                timeTotal.style.right='120px';
            }

            let controls = document.querySelector('.right');

            let videoDownloadDom = document.querySelector('#zhmKsDownload');

            if(videoDownloadDom){

                videoDownloadDom.parentNode.removeChild(videoDownloadDom);
            }

            let detailDom = controls.querySelector('div:nth-of-type(1)');

            let xgIcon = detailDom.cloneNode(true);

            let linkUrl = videoDom.getAttribute('src');

            xgIcon.querySelector('.kwai-player-volume-sound').innerHTML="<div style='cursor:pointer;'>下载</div>";

            let slider = xgIcon.querySelector('.pl-slider');

            slider.style = 'width:49px;padding:10px 5px 20px;';

            let downloadList = '';

            downloadOption.forEach(function(item){

                downloadList += `<div style="margin-top:10px;color:#FFF;cursor:pointer;" id="${item.id}">${item.name}</div>`;

            })

            slider.innerHTML = downloadList;

            xgIcon.setAttribute('data-url',linkUrl);

            xgIcon.setAttribute('id','zhmKsDownload');

            //console.log(xgIcon);

            //xgIcon.innerHTML="<div style='cursor:pointer;'>下载</div>";

            detailDom.before(xgIcon);

            //重构播放操作按钮

            let zhmKsButton = document.querySelector('#zhmKsButton');

            //console.log(zhmKsButton);

            if(zhmKsButton){

                //zhmKsButton.parentNode.removeChild(zhmKsButton);

                return false;
            }

            let buttonIcon = detailDom.cloneNode(true);
            //console.log(buttonIcon);
            buttonIcon.setAttribute('id','zhmKsButton');

            let buttonIconImg = buttonIcon.querySelector('.unmuted-icon');

            buttonIconImg.style = 'background: url(https://s2-10623.kwimgs.com/udata/pkg/cloudcdn/img/player-setting.ad1f5ce8.svg) no-repeat';

            detailDom.after(buttonIcon);

            let plSlider = buttonIcon.querySelector('.pl-slider');

            plSlider.style='width:auto;padding:10px 10px 25px 10px;';

            plSlider.innerHTML = "";

            let buttonFour = controls.querySelector('div:nth-of-type(4)');

            buttonFour.style.margin='0px';

            let autoPlay = document.querySelector('.play-setting-container');

            autoPlay.style.margin='0px 40px 0px 0px';

            let buttonFive = controls.querySelector('div:nth-of-type(5)');

            buttonFive.style.margin='15px 0px';

            buttonFive.onmouseover=function(){

                setTimeout(function(){

                    let toolTip = document.querySelector('.kwai-player-rotate-tooltip');

                    if(toolTip){

                        toolTip.parentNode.removeChild(toolTip);
                    }


                },30)

            }

            let buttonSix = controls.querySelector('div:nth-of-type(6)');

            buttonSix.style.margin='15px 0px';

            let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

            buttonSix.onmouseover=function(){

                setTimeout(function(){

                    let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

                    if(toolTip){

                        toolTip.parentNode.removeChild(toolTip);

                    }

                },30)

            }

            plSlider.appendChild(buttonFour);

            plSlider.appendChild(buttonFive);

            plSlider.appendChild(buttonSix);

        }

    }
 var allWeb = [...videoDownload];

    var nowWeb=[];

    allWeb.forEach(function(item){

        if(item.isOpen == 0) return true;

        item.web.forEach(function(val){

            let result = couponUrl.match(val.match);

            if(result){

                nowWeb.push(val);

            }
        })

    })

    if(nowWeb.length==0){

        let baseClass = new BaseClass();

        console.log('没有匹配该网站或该模块已关闭');return;
    }

    let {funcName,match:nowMatch,node:nowNode,name:nowName} = nowWeb[0];

    switch(funcName){

        case 'videoDownload':

            var videoDownloadClass = new VideoDownloadClass();

             if(nowWeb[0].isWebOpen == 0){

                console.log(nowWeb[0].name+'已关闭');return;

            }else{

                videoDownloadClass[nowName]();
            }
            break;
    }

 var data = document.getElementById('RENDER_DATA');
    if (data) {
        setTimeout(function () {
            var decodeData = decodeURIComponent(data.innerText);
            var json = JSON.parse(decodeData);
            for (var item in json) {
                if (json[item]['aweme']) {
                    var detail = json[item]['aweme']['detail'];
                    var video = detail.video;
                    var bitData = [];
                    if (video.bitRateList) {
                        var bitRateList = video.bitRateList;
                        for (var i = 0; i < bitRateList.length; i++) {
                            var text = bitRateList[i].width + 'x' + bitRateList[i].height + '_' + bitRateList[i].gearName;
                            var url = bitRateList[i].playApi
                            bitData.push({
                                text: text,
                                url: url
                            });
                        }
                    }
                    var defaultUrl = video.playApi;
                    var defaultRatio = video.width + 'x' + video.height + '_' + video.ratio;
                    console.log(defaultRatio)
                    var buttons = document.getElementsByTagName('button')
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].innerText == '关注') {
                            var classNames = buttons[i].className;
                            console.log(classNames)
                            var btnGrand = buttons[i].parentNode.parentNode;
                            const div = document.createElement('div');
                            for (var j = 0; j < bitData.length; j++) {
                                var downA = document.createElement('a');
                                var bit = bitData[j];
                                downA.href = bit.url;
                                downA.target = '_blank';
                                downA.innerHTML = bit.text.replace('_0', 'p') + '_下载';
                                downA.className = classNames;
                                div.appendChild(downA);
                            }
                            var downADefault = document.createElement('a');
                            downADefault.href = defaultUrl;
                            downADefault.target = '_blank';
                            downADefault.innerHTML = defaultRatio + '_下载';
                            downADefault.className = classNames;
                            div.appendChild(downADefault);
                            btnGrand.after(div);
                            console.log(btnGrand)
                            console.log('add btn');
                        }
                    }
                }
            }
        }, 1500)
    }


})();
