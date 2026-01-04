// ==UserScript==
// @name         破解VIP在线视频 支持手机?zz
// @namespace    http://tampermonkey.net/
// @version      1.0.13
// @description  破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台|优酷布袋戏破解|安卓可用脚本]等VIP或会员视频
// @author       素还真大战藏镜人 QQ:78619808
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://*.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/39176/%E7%A0%B4%E8%A7%A3VIP%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%20%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BAzz.user.js
// @updateURL https://update.greasyfork.org/scripts/39176/%E7%A0%B4%E8%A7%A3VIP%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%20%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BAzz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var replaceRaw=GM_getValue("replaceRaw");
    var episodes=GM_getValue("episodes");
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:100px; height:auto; border:0; margin:0;}'+
                '#parseUl{position:fixed;top:80px; left:0px;}'+
                '#parseUl li{list-style:none;}'+
                '.TM1{opacity:0.3; position:relative;padding: 0 7px 0 0; min-width: 19px; cursor:pointer;}'+
                '.TM1:hover{opacity:1;}'+
                '.TM1 span{display:block; border-radius:0 5px 5px 0; background-color:#ffff00; border:0; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:15px 2px;}'+
                '.TM3{position:absolute; top:0; left:19px; display:none; border-radius:5px; margin:0; padding:0;}'+
                '.TM3 li{float:none; width:80px; margin:0; font-size:14px; padding:3px 10px 2px 15px; cursor:pointer; color:#3a3a3a !important; background:rgba(255,255,0,0.8)}'+
                '.TM3 li:hover{color:white !important; background:rgba(0,0,0,0.8);}'+
                '.TM3 li:last-child{border-radius: 0 0 5px 5px;}'+
                '.TM3 li:first-child{border-radius: 5px 5px 0 0;}'+
                '.TM1:hover .TM3{display:block}');
    var apis=[
        {"name":"★强强(手机)","url":"http://000o.cc/jx/ty.php?url=","title":"手机端可用"},
        {"name":"★噗噗(手机)","url":"http://pupudy.com/play?make=url&id=","title":"解析源比较多"},
        {"name":"★酷绘(手机)","url":"http://appapi.svipv.kuuhui.com/svipjx/liulanqichajian/browserplugin/qhjx/qhjx.php?id=","title":"可以看优酷布袋戏"},
        {"name":"★无名(手机)","url":"http://www.85105052.com/index/qqvod.php?url=","title":"无名小站"}, 
        {"name":"★VIP(手机)","url":"http://q.z.vip.totv.72du.com/?url=","title":"更换线路成功率会提高"},
        {"name":"★1008(布袋戏)","url":"http://api.1008net.com/v.php?url=","title":"可以看优酷布袋戏"},
        {"name":"无名2","url":"http://www.82190555.com/index/qqvod.php?url=","title":"无名2"},
        {"name":"花园","url":"http://j.zz22x.com/jx/?url=","title":"更换线路成功率会提高"},
        {"name":"旋风","url":"http://api.xfsub.com/index.php?url=","title":"1905优先使用"},
        {"name":"那片","url":"http://api.nepian.com/ckparse/?url=","title":"更换线路成功率会提高"},
        {"name":"云解析","url":"http://jiexi.92fz.cn/player/vip.php?url=","title":"更换线路成功率会提高"},
        {"name":"高端","url":"http://jx.vgoodapi.com/jx.php?url=","title":"更换线路成功率会提高"},
        {"name":"免费接","url":"http://vip.jlsprh.com/index.php?url=","title":"更换线路成功率会提高"},
        {"name":"百域阁","url":"http://api.baiyug.cn/vip/index.php?url=","title":"转圈圈就换线路"},
        {"name":"石头","url":"https://jiexi.071811.cc/jx.php?url=","title":"手动点播放"},
        {"name":"ODFLV","url":"http://aikan-tv.com/?url=","title":"不稳定，广告过滤软件可能有影响"},
        {"name":"163人","url":"http://jx.api.163ren.com/vod.php?url=","title":"偶尔支持腾讯"},
        {"name":"CKFLV","url":"http://www.0335haibo.com/tong.php?url=","title":"CKFLV云,部分站点不支持"}, 
        {"name":"眼睛","url":"http://www.vipjiexi.com/yun.php?url=","title":"www.vipjiexi.com"},
        {"name":"人人","url":"http://v.renrenfabu.com/jiexi.php?url=","title":"综合，多线路"},
        {"name":"小酒壶","url":"https://yun.glcw.cc:444/plays/?url=","title":"更换线路成功率会提高"},
    ];
    var defaultapi={"title":"默认用强强视频解析，手机 可以打开","url":"http://000o.cc/jx/ty.php?url="};
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
                if(style.width.replace("px","")>100 && style.height.replace("px","")>100){
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
            '<li class="TM1"><span id="TMSet">▣</span><ul class="TM3"><li><label><input type="checkbox" id="inTabChekbx">本页解析</label></li><li><label><input type="checkbox" id="realLinkChekbx">爱奇艺正确选集</label></li></ul></li>'+
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
