// ==UserScript==
// @name         各种VIP视频破解
// @version      1.0.2
// @description  破解 by 何雨豪
// @author       何雨豪
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://vip.1905.com/play/*
// @match        *://*.pptv.com/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://*.56.com/*
// @exclude      *://*.bilibili.com/blackboard/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/34001/%E5%90%84%E7%A7%8DVIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/34001/%E5%90%84%E7%A7%8DVIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var replaceRaw=GM_getValue("replaceRaw");
   var episodes=GM_getValue("episodes");
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:120px; height:auto; border:0; margin:0;}'+
                '#parseUl{position:fixed;top:120px; left:0px;}'+
                '#parseUl li{list-style:none;}'+
                '.TM1{opacity:0.3; position:relative;padding: 0 7px 0 0; min-width: 19px; cursor:pointer;}'+
                '.TM1:hover{opacity:1;}'+
                '.TM1 span{display:block; border-radius:0 5px 5px 0; background-color:#330033; border:0; font:bold 8px "微软雅黑" !important; color:#CCFFFF; margin:0; padding:15px 8px;}'+
               '.TM3{position:absolute; top:0; left:19px; display:none; border-radius:5px; margin:0; padding:0;}'+
               '.TM3 li{float:none; width:80px; margin:0; font-size:14px; padding:3px 10px 2px 15px; cursor:pointer; color:#3a3a3a !important; background:rgba(255,255,0,0.8)}'+
              '.TM3 li:hover{color:white !important; background:rgba(0,0,0,0.8);}'+
               '.TM3 li:last-child{border-radius: 0 0 5px 5px;}'+
                '.TM3 li:first-child{border-radius: 5px 5px 0 0;}'+
               '.TM1:hover .TM3{display:block}');
    var apis=[
  //      {"name":"唯一接口","url":"http://v.buy360.vip/cxjx.php?v=","title":"制作by 何雨豪"},
    ];
    var defaultapi={"title":"制作by何雨豪","url":"http://aikan-tv.com/?url="};
    var api2={"title":"制作by何雨豪","url":"http://v.buy360.vip/cxjx.php?v="};

    //嵌入页面播放
    function openInTab(evt){
        var iframe=document.createElement("iframe");
        iframe.id="TMiframe";
        var video;
        //iframe.style.cssText="width:100%;height:100%;text-align:center;border:none;";
        iframe.style.border="none";
        iframe.textAlign="center";
        iframe.src=evt.target.dataset.url+location.href;
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
    function noNewTabCheck(){
        var x, arr=document.querySelectorAll(".TM4 li");
        replaceRaw=document.querySelector("#inTabChekbx").checked;
        GM_setValue("replaceRaw",replaceRaw);
        for(x=0;x<arr.length;x++){
            if(replaceRaw){
                arr[x].addEventListener("click",openInTab,false);
                arr[x].onclick='';
            }else{
                arr[x].removeEventListener("click",openInTab,false);
                arr[x].onclick=function(){window.open(this.dataset.url+location.href);};
            }
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

    if(top.location==location){//只在顶层页面运行，在iframe中不起作用
        var div=document.createElement("div");
        div.id="TManays";
        var txt='',i=0;
        for (i in apis) {
            txt +='<li data-order='+i+' data-url="'+apis[i].url+'" title="'+apis[i].title+'" onclick="window.open(this.dataset.url+location.href)">'+apis[i].name+'</li>';
        }
        div.innerHTML='<ul id="parseUl">'+
           '<li class="TM1"><span id="TMList"  title="'+defaultapi.title+'" onclick="window.open(\''+defaultapi.url+'\'+window.location.href)">▶</span><ul class="TM3 TM4">'+txt+'</ul></li>'+
          '<li class="TM1">'+
           '</ul>';
        document.body.appendChild(div);
        console.log(div.parentNode.parentNode.parentNode.tagName);
        document.querySelector("#inTabChekbx").addEventListener("click",noNewTabCheck,false);
        document.querySelector("#inTabChekbx").checked=replaceRaw;
        document.querySelector("#realLinkChekbx").addEventListener("click",rightEpsLinkCheck,false);
        document.querySelector("#realLinkChekbx").checked=episodes;

        if(episodes && window.location.href.indexOf("iqiyi")!=-1){
            rightEpsLinkCheck();
        }
        if(replaceRaw && window.location.protocol!="https:"){noNewTabCheck();document.getElementById("TMSet").click();}    //https和http页面不能镶嵌。
    }
})();