// ==UserScript==
// @name         粽子VIP视频解析
// @namespace    http://tampermonkey.net/
// @version     1.0.0
// @description  破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台]等VIP或会员视频
// @author       粽子
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @exclude      *://*.bilibili.com/blackboard/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/30485/%E7%B2%BD%E5%AD%90VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/30485/%E7%B2%BD%E5%AD%90VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var replaceRaw=GM_getValue("replaceRaw");
    var episodes=GM_getValue("episodes");
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '.TMul{position:fixed; left:-136px; width:120px; background-color:#555555; opacity:0.8; border:3px solid #00cc00; list-style:none; margin:0; padding:5px;}'+
                '#siteUl{top:150px;}'+
                '#setUl{ top:200px;}'+
                '.TMul li{margin:0; padding:3px;} '+
                '.TMul li a,.TMul li{font-size:16px !important; margin:0; padding:2px 3px; color:white !important;} '+
                '.TMbtn{position:fixed; left:0; opacity:0.6; height:50px; width:15px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; background-color:#ffff00; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                '.TMbtn:hover{width:25px; opacity:1;} '+
                '#TMGobtn{top:150px;} '+
                '#TMSet{top:200px;} ');
    function setUlTg(){
        var btn=document.getElementById("TMSet");
        var ul=document.getElementById("setUl");
        if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=136+"px";ul.style.left=0;}else{btn.style.left=0;ul.style.left=-136+"px";}
    }
    //嵌入页面播放
    function openInTab(evt){
        evt.preventDefault();
        var iframe=document.createElement("iframe");
        iframe.id="TMiframe";
        var video;
        //iframe.style.cssText="width:100%;height:100%;text-align:center;border:none;";
        iframe.style.border="none";
        iframe.textAlign="center";
        iframe.src=evt.target.href;
        var timer=setInterval(function(){                                                                //-------------检测视频元素思路借鉴他人 License MIT Begin--------------
            [].every.call(document.querySelectorAll("object,embed,video"),function(item){                //LINK:https://greasyfork.org/zh-CN/scripts/26556-vip视频破解
                var style=getComputedStyle(item, null);                                                  //Homepage: http://hoothin.com
                if(style.width.replace("px","")>100 && style.height.replace("px","")>100){               //Email: rixixi@gmail.com
                    video=item;
                    return false;//有播放窗
                }
                return true;
            });
            if(video||document.querySelector("#TMiframe")){
                if(document.querySelector("#TMiframe")){video=document.querySelector("#TMiframe");}
                clearInterval(timer);
                var videoStyle=getComputedStyle(video, null);
                iframe.width=videoStyle.width;
                iframe.height=videoStyle.height;
                var videoParent=video.parentNode;
                iframe.style.lineHeight=getComputedStyle(videoParent).height;
                if(video.parentNode){video.parentNode.replaceChild(iframe,video);}
            }
        },500);                                                                                         //-------------检测视频元素思路借鉴他人  End--------------------
        if(window.location.href.indexOf("youku")!=-1){
            document.querySelector(".vpactionv5_iframe_wrap").style.display="none";
        }
    }
    function rightEpsLinkCheck() {
        episodes=document.querySelector("#realLinkChekbx").checked;
        GM_setValue("episodes",episodes);
        if(episodes){
            document.querySelector('#widget-dramaseries').addEventListener('click', function getLink (e){      //-------------iqiyi剧集真实播放页面方法  Begin------------------//Homepage: http://hoothin.com    Email: rixixi@gmail.com
                var target=e.target.parentNode.tagName=="LI"?e.target.parentNode:(e.target.parentNode.parentNode.tagName=="LI"?e.target.parentNode.parentNode:e.target.parentNode.parentNode.parentNode);
                if(target.tagName!="LI")return;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "http://cache.video.qiyi.com/jp/vi/"+target.dataset.videolistTvid+"/"+target.dataset.videolistVid+"/?callback=crackIqiyi",
                    onload: function(result) {
                        var crackIqiyi=function(d){
                            location.href=d.vu;
                        };
                        eval(result.responseText);
                    }
                });
            });                                                                              //-------------iqiyi剧集真实播放页面方法  End------------------
        }
        else{document.querySelector('#widget-dramaseries').removeEventListener('click', getLink);}
    }

    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
        '<ul id="siteUl" class="TMul">'+
        '</ul>'+
        '<ul id="setUl" class="TMul">'+
        '<li><label><input type="checkbox" id="inTabChekbx">本页解析</label></li>'+
        '<li><label><input type="checkbox" id="realLinkChekbx">爱奇艺正确选集</label></li>'+
        '</ul>'+
         '<a title="vip视频解析" href="https://api.47ks.com/webcloud/?v='+window.location.href+'" target="_self"><button id="TMGobtn" class="TMbtn">▶</button></a>'+
        '<button id="TMSet" class="TMbtn">☸</button>'+
        '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMList").addEventListener("click",siteUlTg,false);
    document.querySelector("#TMSet").addEventListener("click",setUlTg,false);
    document.querySelector("#inTabChekbx").addEventListener("click",noNewTabCheck,false);
    document.querySelector("#inTabChekbx").checked=replaceRaw;
    document.querySelector("#realLinkChekbx").addEventListener("click",rightEpsLinkCheck,false);
    document.querySelector("#realLinkChekbx").checked=episodes;

    if(episodes && window.location.href.indexOf("iqiyi")!=-1){
        rightEpsLinkCheck();
    }
    if(replaceRaw && window.location.protocol!="https:"){noNewTabCheck();document.getElementById("TMSet").click();}    //https和http页面不能镶嵌。
    //if(replaceRaw){document.querySelector("#TMGobtn").style.display="none";}
})();