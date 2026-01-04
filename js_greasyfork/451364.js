// ==UserScript==
// @name         个人主页三相之力
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（基于原神指示器和原三相一些小的修改）
// @author       Le_le
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451364/%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/451364/%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B.meta.js
// ==/UserScript==

//打标签search为要搜素的关键字 display为搜到关键词时显示的TAG
const search=["原神","王者","荣耀","点兔","智乃","茵蒂克丝","方舟","萝莉"];
const display=["原批","农批","农批","点兔厨","点兔厨","扭曲的茵厨","粥畜","萝莉控"];

const blog="https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=";
var response;
(function() {
    'use strict';
    log("三相之力已启动");

    // Your code here...
    //监听页面停止加载
    document.addEventListener("readystatechange",function(){
        getRequest();});
    //获取B站pid
    function getRequest(){
        var pid=getPid();
        GM_xmlhttpRequest({
            method: "GET",
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
            },
            url: blog+pid,
            onload: function(response) {
                findText(response.response);
            }
        })
    }
    function getPid(){
        var link = window.location.href;
        var pid = link.split("/")[3];
        //取?前面
        pid = pid.split("?")[0];
        return pid;
    }
    function log(Text){
        console.log("Le_le:"+Text)
    }
    function findText(all){
        log("开始查找");
        var flag=0;
        for(var num=0;num<search.length;num++){
            //log(num);
            if(all.indexOf(search[num])!=-1){
                addTag(display[num]);
                flag+=1;
            }
        };
        if(flag==0){
            addTag("纯鹿人")
        }

    }
    function addTag(tag){
        log(tag);
        var title= document.getElementById("h-name");
        //在title后添加span
        var span1 = document.createElement("span");
        span1.className="tag";
        span1.style.color="#ffaaff";
        //字体大小
        span1.style.fontSize="10px";
        span1.innerText="【" +tag+"】";
        title.appendChild(span1);
    }
})();