// ==UserScript==
// @name         百度大扫除
// @namespace    https://greasyfork.org/zh-CN/scripts/409467
// @version      0.0.7
// @icon         https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597932552461&di=a312e872812540cc7b9d6bf1c1753826&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2Fv2-60390e4a48d89c91c7cb41100f6db4e0_xl.jpg
// @description  去除百度主页、搜索界面广告
// @author       暮云叆叇
// @include      *://**/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie/jquery.cookie.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/409467/%E7%99%BE%E5%BA%A6%E5%A4%A7%E6%89%AB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/409467/%E7%99%BE%E5%BA%A6%E5%A4%A7%E6%89%AB%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cyctime = 500;
    console.log('%c进入main','color: blue; font-zise: x-large');
    console.log("当前URL：" + window.location.href);
    if(location.href.indexOf('hao.360.com') > 0 || location.href.indexOf('cube.3600.com') > 0 || location.href.indexOf('s.360.cn') > 0 || location.href.indexOf('cjhd.mediav.com') > 0){//360导航
        //360在他的网页里做了手脚，如果运行不了或者remove失败可以尝试在浏览器设置里关掉他的其他js权限
        console.log("进入360导航");
        setInterval(function(){
            $("#large2small").remove();
        },cyctime);
    }
    if(location.href.indexOf('www.baidu.com') > 0){
        console.log("进入百度");
        $("td").remove();//侧边栏
        setInterval(function(){
            $("li.hotsearch-item.even").remove();//百度热榜
            $("li.hotsearch-item.odd").remove();
            $(".s-hotsearch-title").remove();
            $("#s_side_wrapper").remove();//二维码
            $(".s-top-left.s-isindex-wrap").remove();//上面
            $(".s-top-right.s-isindex-wrap").remove();
            $(".s-bottom-layer.s-isindex-wrap").remove();//下面
            $(".result-op.c-container.new-pmd").remove();//其他人还在搜（0.0.6版本添）
            $('#content_right>div').has('a:contains("广告")').remove();//包含关键字的广告
            $('#content_left>div').has('span:contains("广告")').remove();
        },cyctime);
    }
    if(location.href.indexOf('www.baidu.com') > 0){//百度文库
        console.log("进入百度文库");
        setInterval(function(){
            $(".operate-wrapper").remove();//横幅
        },cyctime);

    }
})();