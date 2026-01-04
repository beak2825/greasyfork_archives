// ==UserScript==
// @name         (黑白转换彩色)愿你能永在阳间
// @namespace    Kevin.colour
// @version      2.4
// @description  使用此脚本可以让你回到阳间，适配BILIBILI,和任意其它网站吧。
// @author       Kevin
// @license MIT
// @grant        none
// @match        *://www.bilibili.com/*
// @match        *://weibo.com/*
// @match        *://www.douyin.com/*
// @match        *://www.kuaishou.com/*
// @match        *://*.bilibili.com/*
// @match        *://www.baidu.com/*
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/455899/%28%E9%BB%91%E7%99%BD%E8%BD%AC%E6%8D%A2%E5%BD%A9%E8%89%B2%29%E6%84%BF%E4%BD%A0%E8%83%BD%E6%B0%B8%E5%9C%A8%E9%98%B3%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/455899/%28%E9%BB%91%E7%99%BD%E8%BD%AC%E6%8D%A2%E5%BD%A9%E8%89%B2%29%E6%84%BF%E4%BD%A0%E8%83%BD%E6%B0%B8%E5%9C%A8%E9%98%B3%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    console.log("来到阳间");
    var URL = window.location
    var style=document.createElement('style');
    // 有些另类的网站可以反馈或者用直接替换内容
    //提高优先级
    style.innerHTML=' *{ filter:none !important;}';
    document.getElementsByTagName('head')[0].appendChild(style)
    //上面统一处理

//举栗子

console.log("当前网址:"+URL)
function Update() {
    //其实不应该定时会消耗性能不过先这样吧
    if (URL.host == "www.bilibili.com"){
//哔哩哔哩进行的处理我这里直接错误抛出 不是主页的，当然也能写正则我没写
    var 横幅 = ["//i0.hdslb.com/bfs/archive/0ac04c23af3b3297bf02dca163474326898d211d.png"]
        var Logo = ["//i0.hdslb.com/bfs/archive/5d49497b6b7f30950f37c4aff205e7dd1494f3b9.png"]

        //此处用的为F12 右键 复制 JS路径
        //当然想可以自己再添加点图片
        var 横幅index = Math.round(Math.random()*(横幅.length-1))
        var Logoindex = Math.round(Math.random()*(Logo.length-1))
    try{

        document.querySelector("#bili-header-banner-img > source:nth-child(1)").setAttribute("srcset",横幅[横幅index]);
        document.querySelector("#bili-header-banner-img > source:nth-child(2)").setAttribute("srcset",横幅[横幅index]);
        document.querySelector("#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__banner > div.header-banner__inner > a > img").setAttribute("src",Logo[Logoindex]);

    } catch (e) {
        //console.log("错误:"+e)

    }
    try{

        document.querySelector("#biliMainHeader > div > div.bili-header__banner > div.header-banner__inner > a > img").setAttribute("src",Logo[Logoindex]);
  } catch (e) {
        //console.log("错误:"+e)

    }}
}

Update()
self.setInterval(Update,1000);

})();