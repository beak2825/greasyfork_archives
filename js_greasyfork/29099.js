// ==UserScript==
// @name         破解VIP会员视频集合
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @icon	 https://git.oschina.net/favicon.ico
// @description  破解优酷，腾讯，乐视，爱奇艺，芒果，哔哩哔哩，音悦台等网站VIP或会员视频，有直接跳转以及备用接口列表。电视剧选集需要直接播放页才能正确解析。详细方法看说明还有图片。包含了[VIP会员视频解析▶龙轩]，[VIP视频在线解析▶张由之]的解析接口，以及[VIP视频破解▶hoothin]的部分接口。
// @author       黄盐
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
// @match        *://*.bilibili.com/video/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/29099/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/29099/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var replaceRaw=GM_getValue("replaceRaw");
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '.TMul{position:fixed; left:-136px; width:120px; background-color:#555555; opacity:0.8; border:3px solid #00cc00; list-style:none; margin:0; padding:5px;}'+
                '#siteUl{top:150px;}'+
                '#setUl{ top:200px;}'+
                '.TMul li{margin:0; padding:3px;} '+
                '.TMul li a,.TMul li{font-size:16px !important; margin:0; padding:2px 3px; color:white !important;} '+
                '.TMbtn{position:fixed; left:0; opacity:0.6; height:50px; width:15px; border-width:2px 4px 2px 0px; border-color:#ffff00; border-radius:0 5px 5px 0; background-color:#ffff00; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ff0000; margin:0; padding:0;} '+
                '.TMbtn:hover{width:25px; opacity:1;} '+
                '#TMGobtn{top:100px;} '+
                '#TMList{top:150px;}'+
                '#TMSet{top:200px;} ');
    function siteUlTg(){
        var btn=document.getElementById("TMList");
        var ul=document.getElementById("siteUl");
        if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=136+"px";ul.style.left=0; btn.innerText="◁";}else{btn.style.left=0;ul.style.left=-136+"px"; btn.innerText="▷";}
    }
    function btnGo(){
        window.open('http://vip.ifkdy.com/?url='+window.location.href, "_blank");//默认使用疯狂解析，直接跳转
    }
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
    function noNewTabCheck(){
        var x, arr=document.querySelectorAll("#siteUl a");
        replaceRaw=document.querySelector("#inTabChekbx").checked;
        GM_setValue("replaceRaw",replaceRaw);
        for(x=0;x<arr.length;x++){
            if(replaceRaw){
                arr[x].addEventListener("click",openInTab,false);
                document.getElementById("TMGobtn").style.display="none";
            }else{
                arr[x].removeEventListener("click",openInTab,false);
                document.getElementById("TMGobtn").style.display="block";
            }
        }
        document.getElementById("TMSet").click();//收缩回去
    }

    //
    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
        '<ul id="siteUl" class="TMul">'+
        '<li><a title="解析失败就刷新或者换线路" href="http://api.47ks.com/webcloud/?v='+window.location.href+'" target="_blank">47影视云</a></li>'+
        '<li><a title="转圈圈就换线路" href="http://www.wmxz.wang/video.php?url='+ window.location.href+'" target="_blank">无名小站</a></li>'+
        '<li><a title="长时间无反应请刷新" href="http://www.zuixiaopin.com/api/cloudVideo?url='+ window.location.href+'" target="_blank">最小品</a></li>'+
        '<li><a title="www.yydy8.com" href="http://www.yydy8.com/common/?url='+window.location.href+'" target="_blank">歪歪电影</a></li>'+
        '<li><a title="有广告过滤软件可能有影响" href="http://aikan-tv.com/tong.php?url='+window.location.href+'" target="_blank">老司机免费</a></li>'+
        '<li><a title="更换线路成功率会提高" href="http://q.z.vip.totv.72du.com/?url='+window.location.href+'" target="_blank">VIP看看</a></li>'+
        '<li><a title="qtzr.net" href="http://qtzr.net/s/?qt='+window.location.href+'" target="_blank">舞动秋天</a></li>'+
        '<li><a title="效果可能不稳定" href="http://yun.zihu.tv/play.html?url='+window.location.href+'" target="_blank">紫狐</a></li>'+
        '<li><a title="无名小站同源" href="http://www.sfsft.com/admin.php?url='+window.location.href+'" target="_blank">无名小站2</a></li>'+
        '<li><a title="如果显示未授权，请地址栏回车刷新" href="http://api.svip.baiyug.cn/svip/index.php?url='+window.location.href+'" target="_blank">百域阁</a></li>'+
        '<li><a title="刷出来速度慢，给点耐心" href="http://mt2t.com/yun?url='+window.location.href+'" target="_blank">云播放</a></li>'+
        '<li><a title="www.vipjiexi.com" href="http://www.vipjiexi.com/yun.php?url='+window.location.href+'" target="_blank">眼睛会下雨</a></li>'+
        '</ul>'+
        '<ul id="setUl" class="TMul">'+
        '<li><label><input type="checkbox" id="inTabChekbx">本页解析</label></li>'+
        '</ul>'+
        '<button id="TMGobtn" class="TMbtn">▶</button>'+
        '<button id="TMList" class="TMbtn">▷</button>'+
        '<button id="TMSet" class="TMbtn">☸</button>'+
        '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);
    document.querySelector("#TMList").addEventListener("click",siteUlTg,false);
    document.querySelector("#TMSet").addEventListener("click",setUlTg,false);
    document.querySelector("#inTabChekbx").addEventListener("click",noNewTabCheck,false);
    document.querySelector("#inTabChekbx").checked=replaceRaw;
    if(replaceRaw && window.location.protocol!="https:"){noNewTabCheck();document.getElementById("TMSet").click();}    //https和http页面不能镶嵌。
    //if(replaceRaw){document.querySelector("#TMGobtn").style.display="none";}
})();

// 资源参考http://www.5ifxw.com/vip/
// 资源参考http://live.gopartook.com/
// 资源参考http://tv.dsqndh.com
//https协议页面：film.sohu.com

//v0.43版本地址：http://pan.baidu.com/s/1i5duNNB
