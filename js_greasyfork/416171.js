// ==UserScript==
// @name         爱奇艺、优酷、腾讯视频
// @namespace    http://tampermonkey.net/
// @version      1.2
// @include      *://v.vzuu.com/video/*
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/p*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *film.sohu.com/album/*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @include      *.mgtv.com/b/*
// @include      *.acfun.cn/v/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/anime/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.pptv.com/show/*
// @include      *.baofeng.com/play/*
// @include      *.wasu.cn/Play/show*
// @include      *v.yinyuetai.com/video/*
// @include      *v.yinyuetai.com/playlist/*
// @include      *://item.taobao.com/*
// @include      *://*detail.tmall.com/*
// @include      *://*detail.tmall.hk/*
// @include      *://*.liangxinyao.com/*
// @include      *://music.163.com/song*
// @include      *://music.163.com/m/song*
// @include      *://y.qq.com/n/*
// @include      *://*.kugou.com/song*
// @include      *://*.kuwo.cn/yinyue*
// @include      *://*.kuwo.cn/play_detail*
// @include      *://*.xiami.com/*
// @include      *://music.taihe.com/song*
// @include      *://*.1ting.com/player*
// @include      *://music.migu.cn/v*
// @include      *://*.lizhi.fm/*
// @include      *://*.qingting.fm/*
// @include      *://*.ximalaya.com/*
// @description  极简模式
// @author       cnxzq
// @downloadURL https://update.greasyfork.org/scripts/416171/%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/416171/%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
'use strict';

document.body.append(function() {
    var btn = document.createElement("button")
    btn.innerHTML="open";
    var style = `
        position: fixed;
        top:10px;right:10px;
        cursor: pointer;
        border: 1px solid #ccc;
        color:#000;
        opacity: 0.5;
        background-color: #fff;
        z-index:9999;
    `;
    style.replace(/\s+/g,"").split(";").forEach(function(item){
        if(!item){return;}
        item = item.split(":");
        btn.style[item[0]]=item[1];
    });
    btn.onclick=function(){
        window.location = "https://kykjsoft.gitee.io/v.html?url="+window.location.href;
    }
    return btn;
}());