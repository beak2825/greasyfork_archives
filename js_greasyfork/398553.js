

// ==UserScript==
// @name         ibotPro后台辅助工具
// @namespace    http://www.xiaoi.com/
// @version      0.2.1
// @description  给小i后台加上前端链接
// @author       Shiwen
// @match        http://*.cluster.xiaoi.com/manager/*
// @match        http://*/manager/*unimgr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398553/ibotPro%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/398553/ibotPro%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onload=function(){
        var rightList = document.getElementsByClassName("right")[0];
        if(rightList){
            var murl=window.location.href;
            //console.log("murl : ",murl);
            if(murl.substring(0,7)!="http://"){
                return;
            }//前七位不是http:// 直接pass
            murl=murl.substring(7);
            var murls=murl.split("/");//以/分割
            var mgrindex=murls.indexOf("manager");
            if(mgrindex>0){
                murls[mgrindex]="robot";
            }else{
                return;
            }//把manager替换成robot,如果没找到,那就直接pass
            var unimgrindex=murls.indexOf("unimgr");
            if(unimgrindex){
                murls.splice(unimgrindex);
            }else{
                return;
            }//把unimgr后面的直接删掉，如果没找到，那就直接pass
            var rurl="http://"+murls.join("/");
            //const div=`<div class="mt20 left mr30 pst"><a target="_blank" href="${rurl}">前端</a></div>`;
            var a1=document.createElement("a");//创建一个 <a>对象
            a1.setAttribute("href",rurl);
            a1.setAttribute("target","_blank");
            a1.text="前端";
            var div1=document.createElement("div");//创建一个<div>对象
            div1.setAttribute("class","mt20 left mr30");
            div1.append(a1);
            rightList.append(div1);//div插入到rightList里
            var a2=document.createElement("a");//创建一个 <a>对象
            var h5url=rurl+'/h5/';
            a2.setAttribute("href",h5url);
            a2.setAttribute("target","_blank");
            a2.text="H5前端";
            var div2=document.createElement("div");//创建一个<div>对象
            div2.setAttribute("class","mt20 left mr30");
            div2.append(a2);
            rightList.append(div2);//div插入到rightList里
        }
    }
})();
