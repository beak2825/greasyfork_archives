// ==UserScript==
// @name         腾讯视频 爱奇艺 免费vip 无广告播放
// @author       gpyuce
// @version      2020.11.22
// @namespace    https://t.me/jsday
// @description  安装后进入播放页面 【右边会有绿色电视按钮】么么哒 无广告、免登录 解析VIP视频. 超高清播放. 【爱奇艺、优酷、乐视、腾讯视频、土豆、芒果TV、搜狐视频】 等主流网
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://film.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.bilibili.com/*
// @match        *://*.pptv.com/*
// @match        *://*.vip.1905.com/*
// @match        *://*.fun.tv/*
// @match        *://*.56.com/*
// @match        *://*.wasu.cn/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/415971/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E7%88%B1%E5%A5%87%E8%89%BA%20%E5%85%8D%E8%B4%B9vip%20%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/415971/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E7%88%B1%E5%A5%87%E8%89%BA%20%E5%85%8D%E8%B4%B9vip%20%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
var apis = [
    {name:'<span style="color:#cd3f6c !important;">rdhk</span>',url: "http://jx.rdhk.net/?v="},
    {name:"lang",url: "https://jx.xiaolangyun.com/?url="},
    {name:"98a",url: "https://jx.98a.ink/?url="},
    {name:"urlkj",url: "https://jx.urlkj.com/?url="},
    {name:"h8jx",url: "https://www.h8jx.com/jiexi.php?url="},
    {name:"jiubo",url: "https://jx.jiubojx.com/vip.php?url="},
    {name:"600m",url: "http://www.600m.net/api/?v="},
    {name:"380k",url: "https://jiexi.380k.com/?url="},
    {name:"okjx",url: "https://okjx.cc/?url="},
    {name:"playm3u8",url: "https://www.playm3u8.cn/jiexi.php?url="},
    {name:"gouhys",url: "http://jxx.gouhys.cn/jx/02065571/?url="},
    {name:"u2h",url: "http://u2h.cn/vip.php?url="},
    {name:"dlcaixin",url: "http://v.dlcaixin.com/?url="},
    {name:"pangu",url: "http://www.pangujiexi.cc/jiexi.php? url="},
    {name:"m1907",url: "https://z1.m1907.cn/?jx="},
    {name:"beijixs",url: "http://beijixs.cn/?url="},
    {name:"tv920",url: "https://api.tv920.com/jx/?url="},
    {name:"bm6ig",url: "https://jiexi.bm6ig.cn/?url="},
    {name:"99yyw",url: "https://jx.99yyw.com/?url="},
    {name:"7cyd",url: "https://v.7cyd.com/vip/?url="},
    {name:"htv009",url: "https://jx.htv009.com/?url="},
    {name:"jqaaa",url: "https://jqaaa.com/jx.php?url="},
    {name:"jiexi",url: "https://api.jiexi.la/?url="},
    {name:"nxflv",url: "https://www.nxflv.com/?url="},
    {name:"km58",url: "https://jx.km58.top/jx/?url="},
    {name:"beaacc",url: "https://beaacc.com/api.php?url="},
    {name:"xdiaosi",url: "https://www.xdiaosi.com/vip/?url="},
    {name:"52jiexi",url: "https://vip.52jiexi.top/?url="},
    {name:"youyitv",url: "https://jx.youyitv.com/?url="},
]
function createSelect(apis) {
    var jmul = document.createElement("ul");
    var zyname="紫云-";
    jmul.id = "jmul";
    jmul.setAttribute("style","display:none;box-shadow:0px 1px 10px rgba(0,0,0,0.3);width:99vw;max-width:728px;height:155px;margin:0;padding:0;position:fixed;bottom:9.5px;left:50%;transform:translateX(-50%);z-index:99999;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;");
    for (var i = 0; i < apis.length; i++) {
        var jmli = document.createElement("li");
        var that = this;
        jmli.setAttribute("style","margin:0;padding:5px;display:inline-block !important;list-style:none;float:left;font-size:20px !important;color:#ac18d0 !important;font-weight:600;text-align:center;line-height:1;margin-top:5.5px;margin-left:6px;border:0.5px solid #222 !important;border-bottom:0.2px solid #cd7f32 !important;text-decoration:none;transition:all 0.25s;background:transparent !important;box-shadow:2px 2px 2px 2px rgba(0,0,0,0.2);border-radius:5.3px;white-space:nowrap;cursor:pointer;");
        (function (jm) {
            jmli.onclick = function () {
                window.open(apis[jm].url + location.href, '_blank');
            };
            jmli.ontouchstart = function () {
                this.style.cssText += "color:#eef6fc !important;background:#1d72b4 !important;border-bottom:0.2px solid #fafafa !important;";
            };
            jmli.ontouchend = function () {
                this.style.cssText += "color:#999 !important;background:transparent !important;border-bottom:0.2px solid #cd7f32 !important;";
            };
            jmli.onmouseover = function () {
                this.style.cssText += "color:#eef6fc !important;background:#1d72b4 !important;border-bottom:0.2px solid #fafafa !important;";
            };
            jmli.onmouseout = function () {
                this.style.cssText += "color:#999 !important;background:transparent !important;border-bottom:0.2px solid #cd7f32 !important;";
            };
        })(i);

        jmli.innerHTML = zyname+i.toString();
        jmul.appendChild(jmli);
    }
    document.body.appendChild(jmul);
}
function createMenu() {
    var jmBtn = document.createElement("div");
    jmBtn.id = "jmBtn";
    jmBtn.innerHTML = '<div title=".紫云任意门."><svg style="width:65.5px;height:48.5px;position:fixed;bottom:215.5px;right:0.5vmin;z-index:100000;text-align:center;line-height:48.5px;font-size:20.8px;border-radius:10.3px;cursor:pointer;"</svg>;<svg viewBox="128 128 256 256"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6z"/><path d="M222.2 303.4v-94.6l90.7 47.3L222.2 303.4z" style="fill:#18222d !important;"/></svg>';
    jmBtn.setAttribute("style","color:#008000;fill:#008000 !important;");
    jmBtn.onclick = function () {
        var jmul = document.getElementById("jmul");
        if (jmul.style.display == "none") {
            jmul.style.display = "block";
            this.style.cssText +="color:#cd7f32;fill:#cd7f32 !important;background:0";
        } else {
            jmul.style.display = "none";
            this.style.cssText +="color:#fff;fill:#008000 !important;background:0";
        }
    }
    document.body.appendChild(jmBtn);
}
if (location.href.match("www.iqiyi.com|m.iqiyi.com|youku.com|www.le.com|m.le.com|v.qq.com|m.v.qq.com|tudou.com|mgtv.com|film.sohu.com|tv.sohu.com|acfun.cn|bilibili.com|pptv.com|vip.1905.com|fun.tv|56.com|wasu.cn")) {
    createMenu();
    createSelect(apis);
}
})();
//
(function() {
    'use strict';
var jmver ='<span style="position:absolute;width:40px;height:15px;font-size:11.5px;letter-spacing:1px;color:#000 !important;line-height:17px;text-align:center;border-radius:3.5px;background:#ae8f00 !important;top:5.5px;left:50%;margin-left:-20px;">< - ></span>';
var apis = [
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/05/63/b3/0563b366-8f83-bc7b-5690-0303b3f94c5e/AppIcon-0-1x_U007emarketing-0-5-0-0-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.iqiyi.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/a8/3e/c3/a83ec31f-3d0e-e64c-2eba-14d017f6dc20/AppIcon-0-0-1x_U007emarketing-0-0-0-8-0-0-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.youku.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/c0/29/0b/c0290b86-9f32-83f2-476d-8ddfa3c0d38e/AppIcon-1x_U007emarketing-0-8-0-0-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://v.qq.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/22/5f/f9/225ff953-1b56-b9e6-7731-70bfb32eabe3/AppIcon-1x_U007emarketing-0-6-0-0-sRGB-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.bilibili.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is4-ssl.mzstatic.com/image/thumb/Purple114/v4/56/3c/c6/563cc63b-0cbd-a9fe-66b5-d36a4a29873f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-0-0-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.mgtv.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;background:transparent url(https://gitee.com/Jones_Miller/als/raw/master/pic/logo/tg.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://t.me/jsday"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;background:transparent url(https://gitee.com/Jones_Miller/als/raw/master/pic/jz.PNG) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://gitee.com/Jones_Miller/als/raw/master/pic/jz.PNG"},
    {name: jmver + '<span style="position:absolute;font-size:11.5px;color:#999 !important;transform:translateX(-50%);//ver:;">20.11.11</span>',url: "https://gitee.com/Jones_Miller/als/raw/master/README.md"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is5-ssl.mzstatic.com/image/thumb/Purple114/v4/9a/10/08/9a100897-1402-2bd6-7a66-156138c061a3/AppIcon-0-1x_U007emarketing-0-9-0-0-sRGB-0-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.taobao.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/1f/ae/c6/1faec608-6779-e657-04c5-858510c1d6cf/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.tmall.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/ee/e7/84/eee78418-b06e-93a0-b75c-6dabbcd7d07f/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.jd.com/"},
    {name:'<span style="position:absolute;width:30.5px;height:30.5px;border-radius:5.5px;background:transparent url(https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/d2/07/b9/d207b902-43e9-3dbc-2c6c-ca5fb3d71358/AppIcon-1-1x_U007emarketing-0-7-0-0-sRGB-85-220.png/230x0w.png) no-repeat center;background-size:100% 100%;top:8.75px;left:50%;margin-left:-15.25px;"></span>',url: "https://www.suning.com/"},
    {name:'<span style="position:absolute;font-size:11.5px;color:#008000 !important;transform:translateX(-50%);">紫云任意门</span>',url: "https://www.rym.fun"},
    {name:'<span style="position:absolute;font-size:11.5px;color:#008000 !important;transform:translateX(-50%);">紫云任意门</span>',url: "https://www.rym.fun"},
];
function createSelect(apis) {
    var jmkjul = document.createElement("ul");
    jmkjul.id = "jmkjul";
    jmkjul.setAttribute("style","display:none;background:#333 url(https://www.rym.fun/image/maomizise.png) no-repeat center !important;box-shadow:0px 1px 10px rgba(0,0,0,0.3);width:99vw;max-width:728px;height:auto;margin:0;padding:0;position:fixed;bottom:165.5px;left:50%;transform:translateX(-50%);z-index:99999;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;white-space:nowrap;");
    for (var i = 0; i < apis.length; i++) {
        var jmkjli = document.createElement("li");
        var that = this;
        jmkjli.setAttribute("style","margin:0;padding:0;display:inline-block;list-style:none;//float:left;font-size:16px;color:#999 !important;font-weight:900;width:14.285%;max-width:47.5px;height:47.5px;text-align:center;line-height:63.5px;letter-spacing:0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;cursor:pointer;");
        (function (jmkj) {
            jmkjli.onclick = function () {
                window.open(apis[jmkj].url, '_blank');
            };
            jmkjli.ontouchstart = function () {
                this.style.cssText += "font-size:20px;color:#cd7f32 !important;box-shadow:inset 0px 0px 5px 3px #cd7f32 !important;border-radius:5.3px;";
            };
            jmkjli.ontouchend = function () {
                this.style.cssText += "font-size:16px;color:#999 !important;box-shadow:inset 0px 0px 5px 3px transparent !important;border-radius:0;";
            };
            jmkjli.onmouseover = function () {
                this.style.cssText += "font-size:20px;color:#cd7f32 !important;box-shadow:inset 0px 0px 5px 3px #cd7f32 !important;border-radius:5.3px;";
            };
            jmkjli.onmouseout = function () {
                this.style.cssText += "font-size:16px;color:#999 !important;box-shadow:inset 0px 0px 5px 3px transparent !important;border-radius:0;";
            };
        })(i);
        jmkjli.innerHTML = apis[i].name;
        jmkjul.appendChild(jmkjli);
    }
    document.body.appendChild(jmkjul);
}
function createMenu() {
    var jmkjBtn = document.createElement("div");
    jmkjBtn.id = "jmBtn";
    jmkjBtn.innerHTML = "";
    jmkjBtn.setAttribute("title","紫云vip解析");
    jmkjBtn.setAttribute("style","background:transparent !important;width:25px;height:48.5px;position:fixed;bottom:215.5px;right:0.65vmin;z-index:100000;text-align:center;line-height:26px;font-size:30px;color:#008000 !important;box-shadow:inset 0px 0px 0px 1px #006030 !important;border-radius:5.3px 10px 10px 5.3px;cursor:pointer;");
    jmkjBtn.onclick = function () {
        var jmkjul = document.getElementById("jmkjul");
        if (jmkjul.style.display == "none") {
            jmkjul.style.display = "block";
        } else {
            jmkjul.style.display = "none";
        }
    }
    document.body.appendChild(jmkjBtn);
}
if (location.href.match("www.iqiyi.com|m.iqiyi.com|youku.com|www.le.com|m.le.com|v.qq.com|m.v.qq.com|tudou.com|mgtv.com|film.sohu.com|tv.sohu.com|acfun.cn|bilibili.com|pptv.com|vip.1905.com|fun.tv|56.com|wasu.cn")) {
    createMenu();
    createSelect(apis);
}
})();
//