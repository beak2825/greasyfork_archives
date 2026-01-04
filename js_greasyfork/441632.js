// ==UserScript==
// @name         B站分P视频随机播放
// @namespace    https://qinlili.bid
// @version      0.2.0
// @description  小可...嘿嘿🤤🤤...阿梓...嘿嘿🤤🤤...笙歌...嘿嘿🤤🤤...
// @author       琴梨梨
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/qinlili23333/BiliRandomPlay
// @supportURL   https://github.com/qinlili23333/BiliRandomPlay
// @license      GPLv3
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/441632/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441632/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("已经随机"+ localStorage.randomSwitch+"次", () => {
        if(confirm("真的要清除统计么？")){
            localStorage.randomSwitch=0;
            alert("清除成功！刷新页面后生效！")
        }
    });
    if(document.getElementById("multi_page")){
        const utils={
            parseInfo:text=>{
                return {
                    now:text.substr(1,text.indexOf("/")-1),
                    total:text.substr(text.indexOf("/")+1,text.length-text.indexOf("/")-2)
                }
            },
            random:(min, max)=> {
                return Math.round(Math.random() * (max - min)) + min;
            }
        }
        //检测到分P视频
        console.log("Multi Video Detected! Initializing Kero Engine... -Qinlili");
        let current=utils.parseInfo(document.getElementsByClassName("cur-page")[0].innerText);
        console.log(current)
        let next=0;
        let noClick=true;
        //接管pushState来替换分P
        history.pushState.bind(history)
        const originPush=history.pushState
        window.history.pushState=(a,b,c)=>{
            if(c.startsWith("/video")){
                c=location.origin+c
            }
            const nextUrl=new URL(c)
            if((nextUrl.pathname==location.pathname)&&switchOn&&noClick){
                const nextParams=new URLSearchParams(nextUrl.search);
                nextParams.set('p', next);
                nextParams.set('random', 'on');
                if(localStorage.randomSwitch){
                    localStorage.randomSwitch++;
                }else{
                    localStorage.randomSwitch=1;
                }
                location.href=nextUrl.pathname+"?"+nextParams.toString();
            }else{
                originPush.call(history,a,b,c)
                searchParams = new URLSearchParams(document.location.search);
            }
        }
        //初始化随机播放切换
        let switchOn=false;
        let searchParams = new URLSearchParams(document.location.search);
        if(searchParams.get("random")=="on"){
            switchOn=true
        }
        const randomSwitch=document.querySelector("#multi_page > div.head-con > div.head-left > h3");
        //加载分P列表后文本会重置，所以监听分P列表加载
        (function(open) {
            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                if(url.indexOf("player/pagelist")>0){
                    this.addEventListener('load', event=>{
                        refreshText();
                        document.querySelector("#multi_page > div.cur-list").addEventListener("click",()=>{
                            //主动点击时避免切歌
                            console.log("Prevent unwanted random. -Qinlili")
                            noClick=false;
                            setTimeout(()=>{noClick=true;},500)
                        },true);
                    });
                }
                open.call(this, method, url, async, user, pass);
            };
        })(XMLHttpRequest.prototype.open);
        //刷新文本
        const refreshText=()=>{
            if(switchOn){
                next=utils.random(1,current.total)
                randomSwitch.textContent="随机下一个:"+next
                searchParams.set('random', 'on');
                originPush.call(history,{},'',location.pathname+"?"+searchParams.toString())
            }else{
                randomSwitch.textContent="连续播放"
                searchParams.set('random', 'off');
                originPush.call(history,{},'',location.pathname+"?"+searchParams.toString())
            }
        }
        randomSwitch.addEventListener("click",event=>{
            event.stopPropagation();
            event.preventDefault();
            //处理切换模式
            switchOn=switchOn?false:true;
            refreshText();
        },true)

    }
})();
