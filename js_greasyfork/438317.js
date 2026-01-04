// ==UserScript==
// @name         B-HTML5-Live
// @version      1.0.0
// @description  Fork from https://greasyfork.org/users/24167
// @author       esterTion-28135
// @match        https://live.bilibili.com/blanc/*
// @match        https://live.bilibili.com/1*
// @match        https://live.bilibili.com/2*
// @match        https://live.bilibili.com/3*
// @match        https://live.bilibili.com/4*
// @match        https://live.bilibili.com/5*
// @match        https://live.bilibili.com/6*
// @match        https://live.bilibili.com/7*
// @match        https://live.bilibili.com/8*
// @match        https://live.bilibili.com/9*
// @exclude      https://live.bilibili.com/?s*
// @exclude      https://live.bilibili.com/p/*
// @exclude      https://live.bilibili.com/all*
// @exclude      https://live.bilibili.com/h5/*
// @run-at       document-end
// @connect      bilibili.com
// @icon         data:image/png;base64,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
// @grant        none
// @license      no-license
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @downloadURL https://update.greasyfork.org/scripts/438317/B-HTML5-Live.user.js
// @updateURL https://update.greasyfork.org/scripts/438317/B-HTML5-Live.meta.js
// ==/UserScript==

setTimeout(()=>{
    let room_id = window?.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.room_id;
    if (room_id == undefined) {
        room_id = window?.__statisObserverConfig?.pvConfig?.selfDefMsg?.room_id;
    }

    var infobar = document.querySelector("body");
    var jsontag = document.createElement("a");
    jsontag.setAttribute("id", "hlsaddr");
    jsontag.innerText="Live";
    jsontag.style="position:fixed;bottom:10%;left:0;display:block;font-size:2rem;z-index:999";
    jsontag.target="_self";
    let play_info = window?.__NEPTUNE_IS_MY_WAIFU__?.roomInitRes?.data?.playurl_info;
    console.log(play_info);
    let cdd = play_info?.playurl?.stream[1]?.format[0]?.codec[0];
    let cdd1 = play_info?.playurl?.stream[1]?.format[1]?.codec[0];
    var fmt=play_info?.playurl?.stream[1]?.format?.length;
    console.log(fmt);
    let jsonlink="";
    if (fmt > 1) {
        jsonlink = cdd1?.url_info[0]?.host + cdd1?.base_url + cdd1?.url_info[0]?.extra;
    } else {
        jsonlink = cdd?.url_info[0]?.host + cdd?.base_url + cdd?.url_info[0]?.extra;
    }
    console.log(jsonlink);
    jsontag.href = jsonlink;
    infobar.appendChild(jsontag);
    if (jsonlink == undefined){
        var apihost="https://api.live.bilibili.com";
        var apipath="/xlive/web-room/v2/index/getRoomPlayInfo";
        var apisearch="?device=phone&platform=html5&scale=3&build=10000&protocol=0,1&format=0,1,2&codec=0,1&room_id="
        var hlsapi=apihost+apipath+apisearch+room_id;
        //let hlsapi = "https://api.live.bilibili.com/xlive/play-gateway/master/url?cid="+room_id;
        console.log(hlsapi);
        jsontag.href = hlsapi;
    }

    var imgnode = document.createElement("span");
    imgnode.setAttribute("id", "user_cover");
    imgnode.setAttribute("style", "position:fixed;bottom:0;left:0;display:block;font-size:2rem;z-index:999");
    setTimeout(getCover,2000);
    function getCover(){
        var data = window?.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover;
        if (data.length > 0 ){
            var cover = data;
            var i=cover.indexOf(":")+1;
            cover=cover.substring(i);
            var coverhtml= "<hr /><a href=\""+cover+"\" target=_blank >查看封面</a><hr />";
            imgnode.innerHTML=coverhtml;
            infobar.insertBefore(imgnode,infobar.firstChild);
        } else {
            console.log("get false");
        }
    }
},2000);