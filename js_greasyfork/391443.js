// ==UserScript==
// @name         Bilibili ViewSync
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在哔哩哔哩实现类似viewsync的功能。WIP。装好以后功能入口位于t.bilibili.com右侧栏。
// @author       yuyuyzl
// @match        https://live.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/391443/Bilibili%20ViewSync.user.js
// @updateURL https://update.greasyfork.org/scripts/391443/Bilibili%20ViewSync.meta.js
// ==/UserScript==
var config={
    "roomids":[],
};
(function() {
    'use strict';
    var reloadConfig=function(){
        Object.keys(config).forEach(function(key){

            //console.log(key,config[key]);
            var valuet=GM_getValue(key);
            if(valuet!=null){
                config[key]=valuet;
            }else {
                GM_setValue(key,config[key]);
            }
        });
    };
    reloadConfig();
    // throttle 和 debouce 函数的底层实现
    var limit = function(func, wait, debounce) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            // 封装函数,用于延迟调用
            var throttler = function() {
                // 只是节流函数的时候,对其timeout进行赋值为null,这样可以设置下一次的setTimtout
                timeout = null;
                func.apply(context, args);
            };
            // 如果debouce是true的话,前一个函数的调用timeout会被清空,不会被执行
            // 就是debounce函数的调用,这个前一个函数的不会执行.下面会重新设定setTimeout用于
            // 执行这一次的调用.
            // 但是如果是throttle函数,则会执行前一个函数的调用,同时下面的setTimeout在
            // 函数没有运行的时候,是无法再次设定的.
            if (debounce) clearTimeout(timeout);
            // 如果debouce是true 或者 timeout 为空的情况下,设置setTimeout
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    };

    // throttle 节流函数
    var throttle = function(func, wait) {
        return limit(func, wait, false);
    };

    // debouce 多次调用,只执行最后一次.
    var debounce = function(func, wait) {
        return limit(func, wait, true);
    };

    if(window.top!==window){
        setInterval(()=>{document.querySelector("body").className=" player-full-win over-hidden hide-aside-area";},100);

    }

    if(window.location.href.match(/.*t.bilibili.com.*/)){
        window.onload=function() {
            var mystyle=document.createElement("style");
            mystyle.innerHTML= "<!-- -->    .ratio{\n        display: flex;\n        flex-grow: 1;\n    }\n    #root{\n        width: 100vw;height: 100vh;margin: 0;\n        display: flex;\n    }\n    iframe{\n        position: absolute;\n        border: 0;\n        background: #FFF;\n        top:0;\n        left: 0;\n    }\n    .mypanel{\n        position: relative;\n        width: 100%;\n        background-color: #fff;\n        border-radius: 4px;\n        margin: 8px 0;\n    }\n    .mypanel .title{\n        padding-top: 12px;\n        padding-left: 16px;\n        padding-bottom: 8px;\n    }\n    .mypanel div{\nmargin-top:4px;\n}\n.mypanel button{\n-webkit-appearance: none;\nwidth: 24px;\nfont-size: 12px;\ncolor: #00a1d6;\nborder: 1px solid #00a1d6;\nborder-radius: 4px;\nbackground: transparent;\ncursor: pointer;\n}\n    .mypanel .more-button{\n        position: absolute;\n        width: 30px;\n        height: 20px;\n        top: 13px;\n        right: 20px;\n    }";

            document.getElementsByTagName("head")[0].appendChild(mystyle);
            var mypanel=document.createElement("div");
            mypanel.className="mypanel";
            mypanel.innerHTML="<p class=\"title tc-black fs-14 ls-0\">Bili ViewSync</p>\n<a href=\'https://live.bilibili.com/sync\' style=\'color: darkgray\' target=\'_blank\' class=\'more-button\'>Go></a>\n<div style=\'padding-left: 16px;padding-bottom: 14px;\'>\n    <input type=\'text\' id=\'bvs-addinput\' >\n    <button id=\'bvs-add\'>+</button>\n    <div id=\'rooms-container\'></div>\n</div>\n";
            document.querySelector(".live-panel").after(mypanel);
            function addroomid(id,doAdd){
                if(doAdd && config.roomids.indexOf(id)>=0)return;
                if(id==null)return;
                if(doAdd){
                    config.roomids.push(id);
                    GM_setValue("roomids",config["roomids"]);
                }
                let line=document.createElement("div");
                let buttonDel=document.createElement("button");
                buttonDel.innerText="-";
                buttonDel.onclick=function () {
                    document.getElementById("rooms-container").removeChild(line);
                    config.roomids.splice(config.roomids.indexOf(id),1);
                    GM_setValue("roomids",config["roomids"]);
                }
                line.appendChild(buttonDel);
                line.appendChild(document.createTextNode(id));
                document.getElementById("rooms-container").appendChild(line);
            }
            document.getElementById("bvs-add").onclick=function () {
                addroomid(document.getElementById("bvs-addinput").value.match(/[0-9]+/)[0],true);
                document.getElementById("bvs-addinput").value="";
            };
            for(let id of config.roomids)addroomid(id,false);
        }
    }

    if(window.location.href.match(/.*live.bilibili.com\/sync.*/)){
        var body;
        var clientRatio=[];
        var splitNow=[];
        var roomids=config.roomids;
        if(roomids.length==0){
            alert("直播间列表为空，请先去动态首页添加！");
            window.location.href="https://t.bilibili.com/";
        }
        var possibleSplit=solve(roomids.length);
        var iframes=roomids.map(id=>{
            let iframe=document.createElement("iframe");
            iframe.setAttribute("src","https://live.bilibili.com/"+id);
            return iframe;
        });
        var iframeCount=0;
        function solve( x,limit) {
            if(limit===undefined)limit=x-1;
            if (x === 1) return [[1]];
            let ret = [];
            for (let i = 1; i < Math.min(limit, x-1) + 1; i++) {
                let sub = solve(i, i - 1);
                let now = solve(x-i, i);
                for (let info of sub)
                    for (let more of now)
                        if (JSON.stringify(info) === "[1]") {
                            //console.log("1*" + " " + JSON.stringify(info) + " " + JSON.stringify(more) + " " + JSON.stringify(info.concat(more)));
                            ret.push(more.concat(info));
                        }
                        else {
                            //console.log("2*" + " " + JSON.stringify(info) + " " + JSON.stringify(more) + " " + JSON.stringify([info].concat(more)));
                            ret.push(more.concat([info]));
                        }
            }
            if(limit>=x){
                let now=[];
                for (let more of ret){
                    if(JSON.stringify(more) !== "[1]")now.push([more]);
                }
                ret=ret.concat(now);
            }
            return ret
        }

        function refreshFramesPos(){

            clientRatio=[body.clientWidth,body.clientHeight];
            let best=null;
            let bestArea=0;
            for(let i of possibleSplit){
                var ratio=getParentRatio(i,false);
                var area=Math.min(ratio[0]*ratio[1]*(clientRatio[0]/ratio[0])*(clientRatio[0]/ratio[0]),ratio[0]*ratio[1]*(clientRatio[1]/ratio[1])*(clientRatio[1]/ratio[1]));
                if(area>bestArea){
                    best=[i,false];
                    bestArea=area;
                }

                var ratio=getParentRatio(i,true);
                var area=Math.min(ratio[0]*ratio[1]*(clientRatio[0]/ratio[0])*(clientRatio[0]/ratio[0]),ratio[0]*ratio[1]*(clientRatio[1]/ratio[1])*(clientRatio[1]/ratio[1]));
                if(area>bestArea){
                    best=[i,true];
                    bestArea=area;
                }
            }
            //console.log(JSON.stringify(best));
            iframeCount=0;
            if(JSON.stringify(best)!==JSON.stringify(splitNow)) {
                splitNow=best;
                let newChild = getDOMNodes(best[0], best[1]);
                newChild.id = "splitter";
                console.log(newChild);
                console.log(newChild.myRatio);
                body.replaceChild(newChild, body.children.splitter);
            }
            for(let i=0;i<iframes.length;i++){
                let parent=document.getElementById("frame"+i);
                iframes[i].style.top=parent.offsetTop+"px";
                iframes[i].style.left=parent.offsetLeft+"px";
                iframes[i].style.width=parent.offsetWidth+"px";
                iframes[i].style.height=parent.offsetHeight+"px";

            }
        }
        var refreshFramesPosDebounced=debounce(refreshFramesPos,1000);

        window.onresize=function(){
            //console.log(body.clientWidth+" "+body.clientHeight);
            refreshFramesPosDebounced();
        };

        window.onload=function(){


            document.getElementsByTagName("head")[0].innerHTML="<style>\n" +
                "    .ratio{\n" +
                "        display: flex;\n" +
                "        flex-grow: 1;\n" +
                "    }\n" +
                "    #root{\n" +
                "        width: 100vw;height: 100vh;margin: 0;\n" +
                "        display: flex;\n" +
                "    }\n" +
                "    iframe{\n" +
                "        position: absolute;\n" +
                "        border: 0;\n" +
                "        background: #FFF;\n" +
                "        top:0;\n" +
                "        left: 0;\n" +
                "    }\n    .mypanel{\n        position: relative;\n        width: 268px;\n        background-color: #fff;\n        border-radius: 4px;\n        margin-bottom: 8px;\n    }\n    .mypanel .title{\n        padding-top: 12px;\n        padding-left: 16px;\n        padding-bottom: 8px;\n    }\n" +
                "</style>";

            document.getElementsByTagName("body")[0].outerHTML="<body style=\"width: 100vw;height: 100vh;margin: 0\">\n" +
                "<div id=\"root\"><div id=\"splitter\"/></div>\n" +
                "<div id=\"frames\"></div>\n" +
                "</body>";


            body=document.getElementById("root");
            for(let iframe of iframes)document.getElementById("frames").appendChild(iframe);
            window.onresize();
        };
        var videoW=16;
        var videoH=9;
        function getParentRatio(arr,isVertical){
            let ratio=null;
            if(Array.isArray(arr)){
                for(let item of arr){
                    let res=getParentRatio(item,!isVertical);
                    if(ratio==null)ratio=res;else
                    if (isVertical) ratio[1]+=res[1]/res[0]*ratio[0];else ratio[0]+=res[0]/res[1]*ratio[1];
                }
            }else return [videoW,videoH];
            return ratio;
        }

        function getDOMNodes(arr,isVertical){
            let ratio=null;
            if(Array.isArray(arr)){
                let dom=document.createElement("div");
                dom.className="ratio container";
                if (isVertical) dom.style.flexDirection="column";
                for(let item of arr){
                    let newNode=getDOMNodes(item,!isVertical);
                    if(ratio==null){
                        ratio=newNode.myRatio;
                        if (isVertical) {
                            newNode.style.flexGrow=newNode.myRatio[1]/newNode.myRatio[0]*ratio[0];
                        }else {
                            newNode.style.flexGrow=newNode.myRatio[0]/newNode.myRatio[1]*ratio[1];
                        }
                    }else
                    if (isVertical) {
                        ratio[1]+=newNode.myRatio[1]/newNode.myRatio[0]*ratio[0];
                        newNode.style.flexGrow=newNode.myRatio[1]/newNode.myRatio[0]*ratio[0];
                    }else {
                        ratio[0]+=newNode.myRatio[0]/newNode.myRatio[1]*ratio[1];
                        newNode.style.flexGrow=newNode.myRatio[0]/newNode.myRatio[1]*ratio[1];
                    }

                    dom.appendChild(newNode);
                }
                dom.myRatio=ratio;
                return dom;
            }else {
                let dom= document.createElement("div");
                //dom.innerText="FRAME";
                //dom.appendChild(iframes[iframeCount]);
                dom.id="frame"+iframeCount;
                iframeCount++;
                dom.className="ratio iframe";
                dom.myRatio=[videoW,videoH];
                return dom;
            }

        }
    }


})();