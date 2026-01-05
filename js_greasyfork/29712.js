// ==UserScript==
// @name         VIP By Lie
// @namespace    Love Zz.
// @version      v3.3.3
// @description  为你一个人写的脚本
// @include         /^http:\/\/www\.iqiyi\.com\/(v|a|w)_(.*)/
// @run-at           document-start
// @description:en  Crack VIP permissions of some chinese video sites
// @author       tom.ding
// @include       *://v.qq.com/x/*
// @include       *://*.iqiyi.com/v_*
// @include       *://*.iqiyi.com/dianying/*
// @include       *://m.v.qq.com/*
// @include       *://*.mgtv.com/*b/*
// @include       *://*.le.com/ptv/vplay/*
// @include       *://m.le.com/*
// @include       *://v.youku.com/v_show/*
// @include       *://m.youku.com/video/*
// @include       *://*.tudou.com/albumplay/*
// @include       *://*.tudou.com/listplay/*
// @include       *://*.tudou.com/programs/view/*
// @include       *://*.wasu.cn/*Play/show/id/*
// @include       *://*tv.sohu.com/*
// @include       *://*film.sohu.com/album/*
// @include       *://ddp.vip.pptv.com/vod_detail/*
// @include       *://*.pptv.com/show/*
// @include       *://*.acfun.cn/v/*
// @include       *://*.fun.tv/vplay/*
// @include       *://vip.1905.com/play/*
// @include       *://vip.pptv.com/show/*
// @include       *://v.yinyuetai.com/video/*
// @include       *://v.yinyuetai.com/playlist/*
// @include       *://*.bilibili.com/video/*
// @exclude       *?url=*
// @exclude       *?qt=*
// @exclude       *?v=*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @license       MIT License
// @connect       cache.video.qiyi.com
// @downloadURL https://update.greasyfork.org/scripts/29712/VIP%20By%20Lie.user.js
// @updateURL https://update.greasyfork.org/scripts/29712/VIP%20By%20Lie.meta.js
// ==/UserScript==

' use strict';
Object.defineProperty(navigator, "userAgent", {
	value: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.2661.102 Safari/537.36",
	writable: false,
	configurable: false,
	enumerable: true
});

(function() {
    'use strict';
    var cracks=[
        {name:"? VIP通道1",url:"https://api.47ks.com/webcloud/?v=%s"},
        {name:"? VIP通道2",url:"https://api.flvsp.com/?url=%s"},
        {name:"? SVIP通道",url:"http://www.wmxz.wang/video.php?url=%s",title:"通用解析端口，内置多条解析线路"}
    ],video,videoWidth,videoHeight,i=0;
    var isMobile=function() {
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var Agents=["android", "iphone",
                      "symbianos", "windows phone",
                      "ipad", "ipod" ,"midp" ,"ucweb"];
        var flag=false;
        for (var v=0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag=true;
                break;
            }
        }
        return flag;
    }();
    var iqiyi=location.hostname.indexOf("iqiyi.com")!=-1;
    var vipVideoCrackJump=GM_getValue(location.hostname+"_vipVideoCrackJump");
    var vipVideoCrackEmbed=GM_getValue("vipVideoCrackEmbed");
    var vipVideoCrackUrl=GM_getValue("vipVideoCrackUrl");
    var iframe=document.createElement("iframe");
    iframe.style.border="0";
    var selectStyle=document.createElement("style");
    selectStyle.innerHTML=".crackJump{font-size:12px;margin-left:5px;color:white;text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;-webkit-text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;-moz-text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;*filter: Glow(color=#000, strength=1);}.crackJump input{vertical-align:middle;}.vipSelect{background:black;color:white;font-size:12px;border:none;}.crackArea{position:absolute;z-index:999999;left:0px;top:0px;opacity:0.50;filter:alpha(opacity=50);transition:opacity 0.3s ease,width 0.3s ease;width:18px;height:18px;overflow:hidden;white-space:nowrap;border:1px solid #666;background:black;}.crackArea:hover{opacity:1;filter:alpha(opacity=100);width:230px;}.crackArea>p{display:block;font-size:13px;text-align:center;float:left;position:absolute;top:0px;background-color:black;width:100%;height:100%;margin:0 auto}.crackArea:hover>p{display:none;}.crackArea>label{display:none;}.crackArea:hover>label{display:initial;}";
    document.getElementsByTagName("head")[0].appendChild(selectStyle);
    var placeholder=document.createElement("div");
    placeholder.style.cssText="width:100%;height:100%;text-align:center;font-size:x-large;cursor:pointer;color:#666;";
    placeholder.innerHTML="点击恢复视频播放";
    placeholder.addEventListener("click",function(){
        if(placeholder.parentNode){
            placeholder.parentNode.replaceChild(video,placeholder);
        }
    });
    var select=document.createElement("select");
    select.className="vipSelect";
    select.innerHTML="<option value=''>? 解析端口</option>";
    if(!GM_getValue("hacgGodTurnVisited"))
    cracks.forEach(function(item){
        var optionStr="<option value='"+item.url+"'"+(item.title?"title='"+item.title+"'":"")+">"+item.name+"</option>";
        select.innerHTML+=optionStr;
    });
    select.onchange=function(){
        var value=select.options[select.options.selectedIndex].value;
        if(value){
            var url=value.replace("%s",(iqiyi&&location.href.indexOf("#")!=-1?decodeURIComponent(document.querySelector(".sns-icon>li>a").href.replace(/.*url=(.*)%3Fsrc.*/,"$1")):location.href));
            if(value.indexOf("hacg.user.js")!=-1){
                GM_setValue("hacgGodTurnVisited",true);
                select.options.remove(select.options.selectedIndex);
            }else{
                vipVideoCrackUrl=value;
                GM_setValue("vipVideoCrackUrl",vipVideoCrackUrl);
                if(video.parentNode)video.parentNode.replaceChild(placeholder,video);
            }
            if(!vipVideoCrackEmbed || !embedCrack(url)){
                unsafeWindow.open(url);
            }
            select.options.selectedIndex=0;
        }
    };
    var quickAccess=document.createElement("label");
    quickAccess.className="crackJump";
    quickAccess.title="自动选择解析端口";
    quickAccess.innerHTML="<input type='checkbox'>自动解析";
    var jumpCheck=quickAccess.querySelector("input");
    jumpCheck.onclick=function(){
        vipVideoCrackJump=jumpCheck.checked;
        GM_setValue(location.hostname+"_vipVideoCrackJump",vipVideoCrackJump);
        crackJump();
    };
    var embedLabel=document.createElement("label");
    embedLabel.className="crackJump";
    embedLabel.title="嵌入到当前播放窗口";
    embedLabel.innerHTML="<input type='checkbox'>自动嵌入";
    var embedCheck=embedLabel.querySelector("input");
    embedCheck.onclick=function(){
        vipVideoCrackEmbed=embedCheck.checked;
        GM_setValue("vipVideoCrackEmbed",vipVideoCrackEmbed);
        crackJump();
    };
    var showP=document.createElement("p");
    showP.innerHTML="?";
    var crackArea=document.createElement("div");
    crackArea.className="crackArea";
    crackArea.appendChild(select);
    crackArea.appendChild(showP);
    crackArea.appendChild(quickAccess);
    crackArea.appendChild(embedLabel);
    function crackJump(){
        if(vipVideoCrackJump){
            var value=vipVideoCrackUrl?vipVideoCrackUrl:cracks[0].url;
            var url=value.replace("%s",(iqiyi?location.href.replace(/#.*/,""):location.href));
            if(!vipVideoCrackEmbed || !embedCrack(url)){
                GM_openInTab(url,false);
                if(video.parentNode)video.parentNode.replaceChild(placeholder,video);
            }
        }
    }
    function embedCrack(url){
        var canEmbed=false;
        if(/^https/.test(url)){
            url=location.protocol+url.slice(6);
            canEmbed=true;
        }else if(location.protocol=="http:"){
            canEmbed=true;
        }
        if(canEmbed){
            iframe.width=videoWidth;
            iframe.height=videoHeight;
            iframe.src=url;
            if(!iframe.parentNode){
                if(video.parentNode){
                    video.parentNode.replaceChild(iframe,video);
                }else{
                    placeholder.parentNode.replaceChild(iframe,placeholder);
                }
                video=iframe;
            }
        }
        return canEmbed;
    }
    if(isMobile){
        crackArea.style.position="fixed";
        document.body.appendChild(crackArea);
    }else{
        var si=setInterval(function(){
            [].every.call(document.querySelectorAll("object,embed,video"),function(item){
                var style=unsafeWindow.getComputedStyle(item, null);
                if(style.width.replace("px","")>100 && style.height.replace("px","")>100){
                    video=item;
                    return false;
                }
                return true;
            });
            if(video){
                clearInterval(si);
                var videoStyle=unsafeWindow.getComputedStyle(video, null);
                videoWidth=videoStyle.width;
                videoHeight=videoStyle.height;
                var videoParent=video.parentNode;
                videoParent.appendChild(crackArea);
                placeholder.style.lineHeight=unsafeWindow.getComputedStyle(videoParent).height;
                if(location.hostname.indexOf("v.yinyuetai.com")!=-1){
                    if (!/^https?:\/\/v\.yinyuetai\.com\/video\/h5\//.test(location.href)) {
                        unsafeWindow.location.href = unsafeWindow.location.href.replace(/^https?:\/\/v\.yinyuetai\.com\/video\//,"http://v.yinyuetai.com/video/h5/");
                    }else{
                        videoParent.parentNode.style.position="absolute";
                        setTimeout(function(){
                            videoStyle=unsafeWindow.getComputedStyle(video, null);
                            videoWidth=videoStyle.width;
                            videoHeight=videoStyle.height;
                        },1000);
                    }
                }else if(location.hostname.indexOf("v.youku.com")!=-1){
                    if(vipVideoCrackEmbed)videoHeight="580px";
                }else if(iqiyi){
                    document.querySelector('#widget-dramaseries').addEventListener('click', function(e){
                        var target=e.target.parentNode.tagName=="LI"?e.target.parentNode:(e.target.parentNode.parentNode.tagName=="LI"?e.target.parentNode.parentNode:e.target.parentNode.parentNode.parentNode);
                        if(target.tagName!="LI")return;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: "http://cache.video.qiyi.com/jp/vi/"+target.dataset.videolistTvid+"/"+target.dataset.videolistVid+"/?callback=crackIqiyi",
                            onload: function(result) {
                                var crackIqiyi=function(d){
                                    location.href=d.vu;
                                };
                                reval(result.responseText);
                            }
                        });
                    });
                    unsafeWindow.addEventListener("hashchange",function(){
                        crackJump();
                    });
                }
                if(vipVideoCrackJump){
                    jumpCheck.checked=true;
                }
                if(vipVideoCrackEmbed){
                    embedCheck.checked=true;
                }
                crackJump();
                unsafeWindow.eval(`
                var pushState = window.history.pushState;
                window.history.pushState=function(a){
                    window.postMessage("pushState","*");
                    return pushState.apply(history, arguments);
                };
                var replaceState = window.history.pushState;
                window.history.replaceState=function(a){
                    window.postMessage("replaceState","*");
                    return pushState.apply(history, arguments);
                };`);
                unsafeWindow.addEventListener('message',function(e) {
                    if(e.data=="pushState" || e.data=="replaceState"){
                        setTimeout(function(){crackJump();},1);
                    }
                });
            }
        },500);
        setTimeout(function(){
            clearInterval(si);
        },20000);
    }
})();