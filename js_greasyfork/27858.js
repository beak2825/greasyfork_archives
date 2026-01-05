// ==UserScript==
// @name         各大视频站VIP会员地址解析播放
// @namespace    videoVIPParser
// @version      0.0.5
// @description  解析各大视频网站如优酷，腾讯，乐视，爱奇艺，芒果，哔哩哔哩，音悦台等网站VIP或会员视频，可以直接跳转以及备用接口跳转。
// @author       ding(AT)gong.si
// @org-author   王然 https://greasyfork.org/scripts/27530
// @match        *://*.iqiyi.com/v_*
// @match        *://v.youku.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27858/%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%AB%99VIP%E4%BC%9A%E5%91%98%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/27858/%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%AB%99VIP%E4%BC%9A%E5%91%98%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

//日志函数
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var theplayurl = window.location.href;

(function() {
    'use strict';
    GM_addStyle('#TManays{z-index:99999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
        '#TMul{position:fixed; left:-156px; top:145px;width:140px; background-color:#555; opacity:0.8; border:3px solid #555; list-style:none; margin:0; padding:5px;}'+
        '#TMul li{margin:0; padding:3px;} '+
        '#TMul li a{font-size:15px; margin:0; padding:3px; color:white;} '+
        '#TMGobtn{position:fixed; left:0; top:100px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#ff0000; margin:0; padding:0;} '+
        '#TMbtn{position:fixed; left:0; top:145px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#aaa; margin:0; padding:0;}');
    function btnTg(){
        var btn=document.getElementById("TMbtn");
        var ul=document.getElementById("TMul");
        if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=156+"px";ul.style.left=0; btn.innerText="◁";}else{btn.style.left=0;ul.style.left=-156+"px"; btn.innerText="▷";}
    }

    //添加爱奇艺VIP的解析方式
    function preload_all(){
        if(theplayurl.indexOf('iqiyi') > 0) preload_iqiyi();
    }

    function preload_iqiyi(){
        slog('albumId',Q.PageInfo.playPageInfo.albumId);
        if(Q.PageInfo.playPageInfo.albumId !== undefined ){
            var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
            s.async = false;
            s.src = document.location.protocol + "//cache.video.qiyi.com/jp/avlist/"+ Q.PageInfo.playPageInfo.albumId +"/1/50/";
            el.parentNode.insertBefore(s, el);
        }
    }
    function prego_all(){
        if(theplayurl.indexOf('iqiyi') > 0){
            prego_iqiyi();
        }else{
            theplayurl = window.location.href;
        }
    }
    function prego_iqiyi(){
        var ele = document.querySelectorAll('li[class="item selected"] > span').length ? document.querySelectorAll('li[class="item selected"] > span')[1] : document.querySelectorAll('li[class="item no selected"] > span')[1];
        if(ele !== undefined ){
            var pd = ele.parentNode.getAttribute('data-pd');
            if(pd > 0){
                var vinfo = tvInfoJs.data.vlist[pd-1];
                if(vinfo.vurl.length > 0){
                    theplayurl = vinfo.vurl;
                }
            }
        }else{
            theplayurl = window.location.href;
        }
    }
    function btnGo(){
        prego_all();
        window.open('http://mj.mailseason.com/vip?url='+theplayurl, "_blank");//默认使用mailseason，直接跳转
    }
    preload_all();
    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
        '<ul id="TMul">'+
        '<li><a href="https://jx.aidouer.net/?url='+theplayurl+'" target="_blank">爱豆</a></li>'+
        '<li><a href="https://okjx.cc/?url='+theplayurl+'" target="_blank">OK解析</a></li>'+
        '<li><a href="https://im1907.top/?jx='+theplayurl+'" target="_blank">纯净/B站</a></li>'+
        '<li><a href="https://www.nxflv.com/?url='+theplayurl+'" target="_blank">诺讯</a></li>'+
        '<li><a href="https://www.yemu.xyz/?url='+theplayurl+'" target="_blank">夜幕</a></li>'+
        '<li><a href="https://jx.xmflv.com/?url='+theplayurl+'" target="_blank">虾米</a></li>'+
        '<li><a href="https://jx.yangtu.top/?url='+theplayurl+'" target="_blank">yangtu</a></li>'+
        '<li><a href="https://jx.m3u8.tv/jiexi/?url='+theplayurl+'" target="_blank">M3U8.TV</a></li>'+
        '<li><a href="https://jx.blbo.cc=>4433/?url='+theplayurl+'" target="_blank">人人迷</a></li>'+
        '<li><a href="https://jx.jsonplayer.com/player/?url='+theplayurl+'" target="_blank">综合/B站</a></li>'+
        '<li><a href="https://jx.blbo.cc=>4433/?url='+theplayurl+'" target="_blank">全民</a></li>'+
        '<li><a href="https://jx.nnxv.cn/tv.php?url='+theplayurl+'" target="_blank">七哥</a></li>'+
        '<li><a href="https://api.qianqi.net/vip/?url='+theplayurl+'" target="_blank">冰豆</a></li>'+
        '<li><a href="https://123.1dior.cn/?url='+theplayurl+'" target="_blank">迪奥</a></li>'+
        '<li><a href="https://www.ckplayer.vip/jiexi/?url='+theplayurl+'" target="_blank">CK</a></li>'+
        '<li><a href="https://www.ckmov.vip/api.php?url='+theplayurl+'" target="_blank">ckmov</a></li>'+
        '<li><a href="https://jx.playerjy.com/?url='+theplayurl+'" target="_blank">playerjy/B站</a></li>'+
        '<li><a href="https://ckmov.ccyjjd.com/ckmov/?url='+theplayurl+'" target="_blank">ccyjjd</a></li>'+
        '<li><a href="https://www.ckmov.com/?url='+theplayurl+'" target="_blank">诺诺</a></li>'+
        '<li><a href="https://www.h8jx.com/jiexi.php?url='+theplayurl+'" target="_blank">H8</a></li>'+
        '<li><a href="https://vip.bljiex.com/?v='+theplayurl+'" target="_blank">BL</a></li>'+
        '<li><a href="https://api.jiexi.la/?url='+theplayurl+'" target="_blank">解析la</a></li>'+
        '<li><a href="https://jiexi.janan.net/jiexi/?url='+theplayurl+'" target="_blank">MUTV</a></li>'+
        '<li><a href="https://www.mtosz.com/m3u8.php?url='+theplayurl+'" target="_blank">MAO</a></li>'+
        '<li><a href="https://www.pangujiexi.cc/jiexi.php?url='+theplayurl+'" target="_blank">盘古</a></li>'+
        '<li><a href="https://go.yh0523.cn/y.cy?url='+theplayurl+'" target="_blank">0523</a></li>'+
        '<li><a href="https://www.1717yun.com/jx/ty.php?url='+theplayurl+'" target="_blank">17云</a></li>'+
        '<li><a href="https://jx.4kdv.com/?url='+theplayurl+'" target="_blank">4K</a></li>'+
        '<li><a href="https://www.8090g.cn/?url='+theplayurl+'" target="_blank">8090</a></li>'+
        '<li><a href="https://jx.000180.top/jx/?url='+theplayurl+'" target="_blank">180</a></li>'+
        '<li><a href="https://www.administratorw.com/video.php?url='+theplayurl+'" target="_blank">无名</a></li>'+
        '</ul>'+
        '<button id="TMGobtn">VIP播放 ▶</button>'+
        '<button id="TMbtn">备用 ▷</button>'+
        '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);
    document.querySelector("#TMbtn").addEventListener("click",btnTg,false);
})();