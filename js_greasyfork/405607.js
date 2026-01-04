// ==UserScript==
// @name         抖拉拉-短视频批量下载小工具
// @namespace    https://www.idoulala.com
// @author       沙漏哟
// @version 2020.09.06.1
// @description  （1）抖查查/婵妈妈/新抖/飞瓜/种草之家/罗网/TooBigData等辅助工具；(2)抖音、快手、轻视频批量解析工具
// @icon         https://www.idoulala.com/img/dll-favicon.ico

// @homepage     https://greasyfork.org/zh-CN/scripts/405607

// @include *://www.dspjx.com/*
// @include *://dspjx.com/*

// @include *://www.chanmama.com/*
// @include *://xd.newrank.cn/*
// @include *://xk.newrank.cn/*
// @include *://www.zhongcao.cn/good/info/id/*
// @include *://www.zhongcao.cn/video/detail/*
// @include *://dy.feigua.cn/*
// @include *://ks.feigua.cn/*
// @include *://www.douchacha.com/*

// @include *://www.iesdouyin.com/share/*
// @include *://www.douyin.com/share/*
// @include *://www.dyshortvideo.com/share/*
// @include *://live.kuaishou.com/*
// @match   *://bbq.bilibili.com/*

// @include *://piaoquantv.com/*

// @match   *://music.163.com/*

// @match   *//www.weibo.com/*
// @match   *//d.weibo.com/*
// @match   *//s.weibo.com/*

// @connect      www.iesdouyin.com
// @connect      ixigua.com
// @connect      aweme.snssdk.com
// @connect      bbq.bilibili.com
// @connect      1.idoulala.com
// @connect      localhost
// @connect      longvideoapi.piaoquantv.com

// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349

// @compatible Chrome
// @compatible Safari

// @grant        GM_info

// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener

// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download

// @grant        GM_getResourceText
// @grant        GM_getResourceURL

// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow

// @run-at       document-idle
// @charset      UTF-8
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/405607/%E6%8A%96%E6%8B%89%E6%8B%89-%E7%9F%AD%E8%A7%86%E9%A2%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/405607/%E6%8A%96%E6%8B%89%E6%8B%89-%E7%9F%AD%E8%A7%86%E9%A2%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

var reWY = /163(.*)song/i;
var reBili = /bilibili.com\/video\/av/i;
var reDspjxIndex = /dspjx.com\/$/i;
var reDspjxSingle = /dspjx.com\/(\w*)\.php$/i;
var reDspjxSuper = /dspjx.com\/(\w*)\/index\.php(\w*)/i;
var reSite = /idoulala.com/i;

var piaoquanPublishCount = 0;

//本地环境
// var doudaihuoHelperHost = "http://localhost:16101/api/zcplus/app";
//生产环境
var doudaihuoHelperHost = "https://1.idoulala.com/api/app/zcplus";

//抖拉拉本地环境
// var doulalaHelperHost = "http://localhost:16101/api/doulala/app";
//抖拉拉生产环境
var doulalaHelperHost = "https://1.idoulala.com/api/app/doulala";

(function () {
    'use strict';

    // Your code here...
    var currentUrl = window.location.href;
    var currentHost = window.location.host;

    //Motrix批量下载重命名方式 douyin_0618_(001+).mp4
    //Photon批量下载方式，打开即可开启aria2的jsonrpc服务

    //短视频解析
    dspjxTool(currentUrl, currentHost);

    //新抖
    xd_newrankTool(currentUrl, currentHost);

    //婵妈妈
    chanmamaTool(currentUrl, currentHost);

    //种草之家
    zhongcaoTool(currentUrl, currentHost);

    //飞瓜
    feiguaTool(currentUrl, currentHost);

    //抖查查
    douchachaTool(currentUrl, currentHost);

    //抖音
    douyinTool(currentUrl, currentHost);

    //快手
    kuaishouTool(currentUrl, currentHost);

    //轻视频
    bbqTool(currentUrl, currentHost);

    //票圈长视频
    piaoquantvTool(currentUrl, currentHost);

    //网易云音乐
    netmusicTool(currentUrl, currentHost);

})();

function toastMsg(msg,duration){
    duration = isNaN(duration) ? 500 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;background: rgb(170, 0, 255);color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 10%;left: 90%;transform: translate(-50%, -50%);z-index: 999999;font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function urlencodeFormData(fd){
    var s = '';
    function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
    for(var pair of fd.entries()){
        if(typeof pair[1]=='string'){
            s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
        }
    }
    return s;
}

/***
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 *
 * @author qli5 <goodlq11[at](163|gmail).com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
class Exporter {
    static exportIDM(urls, referrer = top.location.origin) {
        return urls.map(url => `<\r\n${url}\r\nreferer: ${referrer}\r\n>\r\n`).join('');
    }

    static exportM3U8(urls, referrer = top.location.origin, userAgent = top.navigator.userAgent) {
        return '#EXTM3U\n' + urls.map(url => `#EXTVLCOPT:http-referrer=${referrer}\n#EXTVLCOPT:http-user-agent=${userAgent}\n#EXTINF:-1\n${url}\n`).join('');
    }

    static exportAria2(urls, referrer = top.location.origin) {
        return urls.map(url => `${url}\r\n  referer=${referrer}\r\n`).join('');
    }

    static async sendToAria2RPCBatch(urls, referrer = top.location.origin, target = 'http://127.0.0.1:6800/jsonrpc') {
        // 1. prepare body
        const h = 'referer';
        const body = JSON.stringify(urls.map((url, id) => ({
            id,
            jsonrpc: 2,
            method: "aria2.addUri",
            params: [
                [url],
                { [h]: referrer }
            ]
        })));

        // 2. send to jsonrpc target
        const method = 'POST';
        while (1) {
            try {
                return await (await fetch(target, { method, body })).json();
            }
            catch (e) {
                target = top.prompt('Aria2 connection failed. Please provide a valid server address:', target);
                if (!target) return null;
            }
        }
    }

    static async sendToAria2RPCSingle(url, fileRename, target = 'http://127.0.0.1:6800/jsonrpc') {
        // 1. prepare body
        const param_h = 'referer';
        const param_dir = 'dir';
        const param_out = 'out';
        if(null == fileRename || "" == fileRename){
            fileRename = (new Date).getTime() + ".nofilename";
        }
        const body = JSON.stringify({
            id: (new Date).getTime(),
            jsonrpc: "2.0",
            method: "aria2.addUri",
            params: [
                [url],{
                    [param_out]: fileRename
                }]
        });
        // 2. send to jsonrpc target
        const method = 'POST';
        while (1) {
            try {
                return await (await fetch(target, { method, body })).json();
            }
            catch (e) {
                target = top.prompt('Aria2 connection failed. Please provide a valid server address:', target);
                if (!target) return null;
            }
        }
    }

    static copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.value = text;
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

//获取页面文件名
function getPageName(url)
{
    var tmp= new Array();//临时变量，保存分割字符串
    tmp = url.split("/");//按照"/"分割
    var pp = tmp[tmp.length-1];//获取最后一部分，即文件名和参数
    tmp = pp.split("?");//把参数和文件名分割开
    return tmp[0];
}

function link2filename (link){
    var str = null;
    if(link.indexOf("dspjx.com") != -1){
        let startIndex = link.indexOf("uri=") + "uri=".length;
        let uri = link.substring(startIndex);
        return uri + ".mp4";
    }
    if(link.indexOf("https://") != -1){
        str = link.split("https://");
    }else if(link.indexOf("http://") != -1){
        str = link.split("http://");
    }
    if(link.indexOf(".mp4") != -1){
        return getPageName(link);
    }
    let startIndex = 0;
    let endIndex = -1;
    endIndex = str[1].lastIndexOf("/");
    startIndex = str[1].lastIndexOf("/", endIndex - 1) + 1;
    //console.log(startIndex + "," + endIndex);
    let resultFilename = "";
    if(endIndex == -1){
        resultFilename = str[1].substring(startIndex);
    }else{
        resultFilename = str[1].substring(startIndex, endIndex);
    }
    //console.log('重命名为', resultFilename);
    //截取长度
    if(resultFilename.length > 128){
        resultFilename = resultFilename.substring(0, 128);
    }
    //增加后缀
    if(resultFilename.indexOf('.mp4') == -1){
        resultFilename = resultFilename + ".mp4";
    }
    return resultFilename;
}

function parseVideoList(aplayerAddress, callback){
    var requestBody = {
        "searchVal": aplayerAddress,
        "pageSize": 18
    };
    let response = GM_xmlhttpRequest({
        method: 'POST',
        url: doulalaHelperHost + '/parseVideoList',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify(requestBody),
        responseType: 'json',
        onload: function(response) {
            var resp = JSON.parse(response.responseText);
            if(resp.success){
                var dataArray = resp.data;
                if(null != dataArray && dataArray.length > 0){
                    dataArray.forEach((data, index, array) => {
                        callback(data);
                    });
                }
                toastMsg('请求完成');
            }else{
                toastMsg('无信息');
            }
        }
    });
}

/*
采集视频到公共仓库
*/
function collectVideo(videoListArray){
    var requestBody = {
        "videoList": videoListArray
    };
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://1.idoulala.com/api/app/doulala/collectVideo',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify(requestBody),
        responseType: 'json',
        onload: function(response) {
            var resp = JSON.parse(response.responseText);
            if(resp.success){
                toastMsg('采集请求提交成功');
            }else{
                toastMsg('采集请求提交失败');
            }
        }
    });
}

function collectVideoBySingleOrignUrl(aplayAddress){
    let videoListArray = [];
    let videoSingle = {
        "mediaType": "douyin",
        "sourceType": "douyin",
        "aplayAddress": aplayAddress,
    };
    videoListArray.push(videoSingle);
    collectVideo(videoListArray);
}

function collectVideoByMultipleOrignUrl(aplayAddressArray){
    if(null != aplayAddressArray && aplayAddressArray.length > 0){
        let videoListArray = [];
        aplayAddressArray.forEach(function (ele, index, self) {
            let videoSingle = {
                "mediaType": "douyin",
                "sourceType": "douyin",
                "aplayAddress": ele,
            };
            videoListArray.push(videoSingle);
        });
        collectVideo(videoListArray);
    }
}

function dspjxTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("dspjx.com")!=-1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        var topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;left:0px;'>"+
            "<div id='doulala_helper_copyTitle_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>复制标题</a></div>"
        "</div>";
        $("body").append(topBox01);
        $('body').on('click', '#doulala_helper_copyTitle_btn', function () {
            $that.getTitleList()
        });
        var topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
            "<div id='doulala_helper_directlink_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF; text-decoration:none;' href='javascript:void(0);'>复制链接</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#doulala_helper_directlink_btn', function () {
            $that.getDirectUrl()
        });
        var topBox09_01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
            "<div id='doulala_sendToAria2RPC_btn_asc' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2(顺)</a></div>"
        "</div>";
        $("body").append(topBox09_01);
        $('body').on('click', '#doulala_sendToAria2RPC_btn_asc', function () {
            $that.sendToAria2RPC("asc");
        });
        var topBox09_02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;right:0px;'>"+
            "<div id='doulala_sendToAria2RPC_btn_desc' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2(倒)</a></div>"
        "</div>";
        $("body").append(topBox09_02);
        $('body').on('click', '#doulala_sendToAria2RPC_btn_desc', function () {
            $that.sendToAria2RPC("desc");
        });
        var topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:45%;left:0px;'>"+
            "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectVideo_btn', function () {
            $that.collectVideo();
        });
    };
    doulalaHelper.getTitleList = function(){
        GM_setClipboard('', 'text');
        var titleTagArray = $("div.thumbnail p");
        if(null != titleTagArray){
            var clipBoardStr02 = "";
            titleTagArray.each(function (i, n) {
                var spanText = $(this).text();
                clipBoardStr02 = clipBoardStr02 + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr02, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.getDirectUrl = function(){
        //         console.log(currentUrl);
        GM_setClipboard('', 'text');
        //单个解析
        if (reDspjxIndex.test(currentUrl) || reDspjxSingle.test(currentUrl)) {
            //             console.log('单视频解析');
            let singleVideo = $("div.thumbnail div.caption p a.btn-success");
            if(null != singleVideo){
                let clipBoardStr01 = singleVideo.attr("href");
                if(null != clipBoardStr01){
                    GM_setClipboard(clipBoardStr01, 'text');
                    toastMsg('复制成功');
                }
            }
        }
        //超级解析
        if (reDspjxSuper.test(currentUrl)) {
            //国外视频解析
            if(currentUrl.indexOf('youtube/index.php') != -1){
                let singleVideo = $("div.thumbnail div.caption p a.btn-success");
                if(null != singleVideo){
                    let clipBoardStr01 = singleVideo.attr("href");
                    if(null != clipBoardStr01){
                        GM_setClipboard(clipBoardStr01, 'text');
                        toastMsg('复制成功');
                    }
                }
            }
            //主页一次性解析
            else if(currentUrl.indexOf('video_batch/index.php') != -1){
                let clipBoardStr03 = $("textarea#input").val();
                if(null != clipBoardStr03 && clipBoardStr03.trim() != ""){
                    $("#copy").trigger("click");
                }else{
                    toastMsg('无信息');
                }
            }
            else if(currentUrl.indexOf('zhibo/index.php') != -1){
                //                 console.log('全网直播解析');
            }else if(currentUrl.indexOf('batch/index.php') != -1
                     || currentUrl.indexOf('tiktok') != -1 || currentUrl.indexOf('Kwai') != -1
                     || currentUrl.indexOf('douyin') != -1 || currentUrl.indexOf('gifshow') != -1 || currentUrl.indexOf('huoshan') != -1
                     || currentUrl.indexOf('xigua') != -1 || currentUrl.indexOf('meipai') != -1 || currentUrl.indexOf('weishi') != -1
                     || currentUrl.indexOf('xiaohongshu') != -1 || currentUrl.indexOf('xhs') != -1){
                //                 console.log('视频列表');
                let videoLinkArray = $("div.thumbnail div a");
                if(null != videoLinkArray){
                    let clipBoardStr02 = "";
                    videoLinkArray.each(function (i, n) {
                        let linkText = $(this).attr("href");
                        if((linkText.indexOf("http://") == -1) && (linkText.indexOf("https://") == -1)){
                            linkText = "http://www.dspjx.com" + linkText;
                        }
                        clipBoardStr02 = clipBoardStr02 + "\r\n" + linkText;
                    })
                    GM_setClipboard(clipBoardStr02, 'text');
                    toastMsg('复制成功');
                }else{
                    toastMsg('无信息');
                }
            }else{
                toastMsg('无信息');
            }
        }
    };
    doulalaHelper.sendToAria2RPC = function(order){
        //单个解析
        if (reDspjxIndex.test(currentUrl) || reDspjxSingle.test(currentUrl)) {
            var singleVideo = $("div.thumbnail div.caption");
            if(null != singleVideo){
                var videoLink = singleVideo.find("p a.btn-success").attr("href");
                if(null != videoLink){
                    let videoTitle = singleVideo.find("p a.ng-binding").text();
                    //                     let rename = link2filename(videoLink);
                    let rename = videoTitle + ".mp4";
                    Exporter.sendToAria2RPCSingle(videoLink, rename);
                    toastMsg('发送成功');
                }
            }
        }
        //超级解析
        if (reDspjxSuper.test(currentUrl)) {
            console.log('超级解析');
            //国外视频解析
            if(currentUrl.indexOf('youtube/index.php') != -1){
                let singleVideo = $("div.thumbnail div.caption p a.btn-success");
                if(null != singleVideo){
                    let videoTitle = singleVideo.attr("href");
                    let rename = videoTitle + ".mp4";
                    Exporter.sendToAria2RPCSingle(videoLink, rename);
                    toastMsg('发送成功');
                }
            }
            //主页一次性解析
            else if(currentUrl.indexOf('video_batch/index.php') != -1){
                toastMsg('复制后使用Motrix下载');
            }
            else if(currentUrl.indexOf('zhibo/index.php') != -1){
                //                 console.log('全网直播解析');
            }else if(currentUrl.indexOf('batch/index.php') != -1
                     || currentUrl.indexOf('tiktok') != -1 || currentUrl.indexOf('Kwai') != -1
                     || currentUrl.indexOf('douyin') != -1 || currentUrl.indexOf('gifshow') != -1 || currentUrl.indexOf('huoshan') != -1
                     || currentUrl.indexOf('xigua') != -1 || currentUrl.indexOf('meipai') != -1 || currentUrl.indexOf('weishi') != -1
                     || currentUrl.indexOf('xiaohongshu') != -1 || currentUrl.indexOf('xhs') != -1){
                var videoDivArray = $("div.thumbnail");
                console.log(videoDivArray.length);
                if(null != videoDivArray){
                    let orderIndex = videoDivArray.length;
                    videoDivArray.each(function (i, n) {
                        if("desc" == order){
                            orderIndex -= 1;
                        }else{
                            orderIndex = i;
                        }
                        let videoLink = $(this).find("div a").attr("href");
                        if((videoLink.indexOf("http://") == -1) && (videoLink.indexOf("https://") == -1)){
                            videoLink = "http://www.dspjx.com" + videoLink;
                        }
                        let videoTitle = $(this).find("p").text();
                        //                         let rename = orderIndex + "_" + link2filename(videoLink);
                        let rename = orderIndex + "_" + videoTitle + ".mp4";
                        Exporter.sendToAria2RPCSingle(videoLink, rename);
                    })
                    toastMsg('发送成功');
                }else{
                    toastMsg('无信息');
                }
            }else{
                toastMsg('无信息');
            }
        }
    };
    doulalaHelper.collectVideo = function(){
        //单个解析
        if (reDspjxIndex.test(currentUrl) || reDspjxSingle.test(currentUrl)) {
            let singleVideo = $("div.thumbnail div.caption");
            if(null != singleVideo){
                let videoLink = singleVideo.find("p a.btn-success").attr("href");
                if(null != videoLink){
                    let videoTitle = singleVideo.find("p a.ng-binding").text();
                    let videoImage = singleVideo.find("p a.btn-info").attr("href");
                    let filename = link2filename(videoLink);
                    let vid = filename.substring(0, filename.indexOf(".mp4"));
                    let videoSingle = {
                        "mediaType": "dspjx",
                        "sourceType": "dspjx",
                        "title": videoTitle,
                        "image": videoImage,
                        "playAddress": videoLink,
                        "vid": vid,
                        "filename": filename
                    };
                    let videoListArray = [];
                    videoListArray.push(videoSingle);
                    collectVideo(videoListArray);
                    toastMsg('采集请求已提交');
                }
            }
        }
        //超级解析
        if (reDspjxSuper.test(currentUrl)) {
            console.log('超级解析');
            //主页一次性解析
            if(currentUrl.indexOf('video_batch/index.php') != -1){
                toastMsg('复制后使用Motrix下载');
            }
            else if(currentUrl.indexOf('zhibo/index.php') != -1){
                //                 console.log('全网直播解析');
            }else if(currentUrl.indexOf('batch/index.php') != -1
                     || currentUrl.indexOf('tiktok') != -1 || currentUrl.indexOf('Kwai') != -1
                     || currentUrl.indexOf('douyin') != -1 || currentUrl.indexOf('gifshow') != -1 || currentUrl.indexOf('huoshan') != -1
                     || currentUrl.indexOf('xigua') != -1 || currentUrl.indexOf('meipai') != -1 || currentUrl.indexOf('weishi') != -1
                     || currentUrl.indexOf('xiaohongshu') != -1 || currentUrl.indexOf('xhs') != -1){
                var videoDivArray = $("div.thumbnail");
                console.log(videoDivArray.length);
                if(null != videoDivArray){
                    let videoListArray = [];
                    videoDivArray.each(function (i, n) {
                        var videoLink = $(this).find("div a").attr("href");
                        if((videoLink.indexOf("http://") == -1) && (videoLink.indexOf("https://") == -1)){
                            videoLink = "http://www.dspjx.com" + videoLink;
                        }
                        let videoTitle = $(this).find("p").text();
                        let videoImage = $(this).find("img").attr("src");
                        let filename = link2filename(videoLink);
                        let vid = filename.substring(0, filename.indexOf(".mp4"));
                        let videoSingle = {
                            "mediaType": "dspjx",
                            "sourceType": "dspjx",
                            "title": videoTitle,
                            "image": videoImage,
                            "playAddress": videoLink,
                            "vid": vid,
                            "filename": filename
                        };
                        videoListArray.push(videoSingle);
                    })
                    collectVideo(videoListArray);
                    toastMsg('采集请求已提交');
                }else{
                    toastMsg('无信息');
                }
            }else{
                toastMsg('无信息');
            }
        }
    };
    doulalaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    doulalaHelper.start();
}

//https://greasyfork.org/zh-CN/scripts/398195
//版本：2.0.6
//名称：百度文库破解加强、 CSDN阅读增强、知乎使用增强、抖音去水印原视频下载、全网VIP视频破解，去广告
//作者：匆匆过客、gorgiaxx、王超
function douyinTool(currentUrl, currentHost){
    //--抖音解析开始
    var douyinHelper={};
    douyinHelper.anasetinterval=null;
    douyinHelper.isDouyin=function(){
        if(currentUrl.indexOf("www.iesdouyin.com/share/video")!=-1
           || currentUrl.indexOf("www.douyin.com/share/video")!=-1
           || currentUrl.indexOf("www.dyshortvideo.com/share/video")!=-1
           || currentUrl.indexOf("www.iesdouyin.com/share/user")!=-1){
            return true;
        }
        return false;
    }
    douyinHelper.generateHtml = function(){
        var $that = this;
        if(currentUrl.indexOf("www.iesdouyin.com/share/user")!=-1){
            var topBox00 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
                "<div id='douyin_helper_gotoBatch_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去批量下载</a></div>"
            "</div>";
            $("body").append(topBox00);
            $('body').on('click', '#douyin_helper_gotoBatch_btn', function () {
                $that.gotoBatch()
            });
        }else{
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;left:0px;'>"+
                "<div id='douyin_helper_nowater_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去水印准备中</a></div>"
            "</div>";
            let topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
                "<div id='douyin_helper_directlink_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>下载链接准备中</a></div>"
            "</div>";
            $("body").append(topBox01).append(topBox02);
            $('body').on('click', '#douyin_helper_nowater_btn', function () {
                $that.previewNowaterVideo()
            });
            $('body').on('click', '#douyin_helper_directlink_btn', function () {
                $that.getDirectUrl()
            });
            let topBox09 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
                "<div id='doulala_sendToAria2RPC_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2RPC</a></div>"
            "</div>";
            $("body").append(topBox09);
            $('body').on('click', '#doulala_sendToAria2RPC_btn', function () {
                $that.sendToAria2RPC();
            });
            let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:45%;left:0px;'>"+
                "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
            "</div>";
            $("body").append(topBox10);
            $('body').on('click', '#doulala_collectVideo_btn', function () {
                $that.collectVideo();
            });
        }
    };
    douyinHelper.gotoBatch = function(){
        GM_setClipboard('', 'text');
        GM_setClipboard(currentUrl, 'text');
        toastMsg('链接已复制');
        GM_openInTab('http://www.dspjx.com/douyin/index.php');
    };
    douyinHelper.previewNowaterVideo = function(){
        var $a = $("#douyin_helper_nowater_btn").find("a");
        var clipBoardStr = GM_getValue("doulala_directlink_array");
        if(clipBoardStr == undefined || clipBoardStr == ""){
            toastMsg('未完成');
        }else{
            $a.attr("href", clipBoardStr);
        }
    };
    douyinHelper.getDirectUrl = function(){
        GM_setClipboard('', 'text');
        var clipBoardStr = GM_getValue("doulala_directlink_array");
        if(clipBoardStr == undefined || clipBoardStr == ""){
            toastMsg('无可用链接');
        }else{
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }
    };
    douyinHelper.sendToAria2RPC = function(){
        var videoLink = GM_getValue("doulala_directlink_array");
        if(videoLink == undefined || videoLink == ""){
            toastMsg('无可用链接');
        }else{
            Exporter.sendToAria2RPCSingle(videoLink, link2filename(videoLink));
            toastMsg('发送成功');
        }
    };
    douyinHelper.collectVideo = function(){
        collectVideoBySingleOrignUrl(currentUrl);
        toastMsg('采集请求已提交');
    };
    douyinHelper.getDownloadUrl=function(){
        var times=1;
        this.anasetinterval = setInterval(function(){
            $("#douyin_helper_nowater_btn").find("a").text("去水印准备中("+times+"S)");
            times++;
        },1000);

        var $that = this;
        return new Promise(function(resolve, reject){
            try{
                var itemID = currentUrl.substring(currentUrl.indexOf("/share/video/") + "/share/video/".length, currentUrl.indexOf("/?"));
                var getVisitedUrl = "https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids="+itemID;
                GM_xmlhttpRequest({
                    url: getVisitedUrl,
                    method: "get",
                    headers: {
                        'User-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
                    },
                    onload: function(response) {
                        var status = response.status;
                        if(status==200||status=='200'){
                            var responseText = response.responseText;
                            if(!!responseText){
                                try{
                                    var jsonObjeect = JSON.parse(responseText);
                                    var item_list = jsonObjeect["item_list"][0]["video"]["play_addr"]["url_list"][0];
                                    resolve({"status":"success", "playerUrl":item_list})
                                }catch(e){}
                            }
                        }
                        reject({"status":"error"});
                    }
                });
            }catch(e){
                reject({"status":"error"});
            }
        });
    };
    douyinHelper.getPlayerUrl=function(){
        this.getDownloadUrl().then((data)=>{
            var playerUrl = data.playerUrl;
            //新版本需要20200428，改版
            playerUrl = playerUrl.replace("playwm","play");
            var $a = $("#douyin_helper_nowater_btn").find("a");
            var $directlink_btn = $("#douyin_helper_directlink_btn").find("a");
            GM_xmlhttpRequest({
                url: playerUrl,
                method: "get",
                headers: {
                    'User-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                },
                onload: function(response) {
                    clearInterval(douyinHelper.anasetinterval);
                    douyinHelper.anasetinterval=null;
                    var status = response.status;
                    if(status==200||status=='200'){
                        var finalUrl = response.finalUrl;
                        if(!!finalUrl){
                            $a.text("点我预览");
                            GM_setValue("doulala_directlink_array", finalUrl);
                            $directlink_btn.text("点我复制链接");
                        }else{
                            $a.text("本地解析出错");
                        }
                    }
                }
            });

        }).catch((error)=>{$a.text("本地解析出错");});
    };
    douyinHelper.start=function(){
        if(this.isDouyin()){
            this.generateHtml();
            if(currentUrl.indexOf("/share/video") != -1){
                this.getPlayerUrl();
            }
        }
    }
    douyinHelper.start();

}

function xd_newrankTool(currentUrl, currentHost){
    //     console.log('当前页面', currentUrl);
    //--新抖解析开始
    var xindouHelper={};
    xindouHelper.isXindou=function(){
        if(currentUrl.indexOf("xd.newrank.cn") != -1
           || currentUrl.indexOf("xk.newrank.cn") != -1){
            return true;
        }
        return false;
    }
    xindouHelper.generateHtml = function(){
        var $that = this;
        if(currentUrl.indexOf("xd.newrank.cn/data/d/video/comment") != -1){
            console.log('视频详情页');
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='xd_helper_commentList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制评论</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#xd_helper_commentList_btn', function () {
                $that.getCommentList()
            });
        }
        if(currentUrl.indexOf("xd.newrank.cn/data/d/account") != -1){
            console.log('账号详情页');
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='xd_helper_gotoUserPage_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去下载视频</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#xd_helper_gotoUserPage_btn', function () {
                $that.gotoUserPage()
            });
        }
        let topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='douyin_helper_linkList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制视频</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#douyin_helper_linkList_btn', function () {
            $that.getDouyinLinkList()
        });
        let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;right:0px;'>"+
            "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectVideo_btn', function () {
            $that.collectVideo();
        });
    };
    xindouHelper.gotoUserPage = function(){
        GM_setClipboard('', 'text');
        let userId = currentUrl.substring(currentUrl.lastIndexOf("/") + "/".length);
        let douyinUserUrl = "https://www.iesdouyin.com/share/user/" + userId;
        GM_setClipboard(douyinUserUrl, 'text');
        GM_openInTab("http://www.dspjx.com/douyin/index.php");
    };
    xindouHelper.getCommentList = function(){
        GM_setClipboard('', 'text');
        var comment_div_class = "_s9tFEn2b";
        var commentTextSpanArray = $("body span." + comment_div_class);
        if(null != commentTextSpanArray){
            var clipBoardStr = "";
            commentTextSpanArray.each(function (i, n) {
                var spanText = $(this).text();
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    xindouHelper.getDouyinLinkList = function(){
        GM_setClipboard('', 'text');
        var aTextSpanArray = $('a[rel="noopener noreferrer"]');
        if(null != aTextSpanArray){
            var clipBoardStr = "";
            aTextSpanArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                if(spanText.indexOf("www.iesdouyin.com/share/video") != -1
                   || spanText.indexOf("kuaishou.com") != -1){
                    clipBoardStr = clipBoardStr + "\r\n" + spanText;
                }
            });
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
            GM_openInTab('http://www.dspjx.com/batch/index.php');
        }else{
            toastMsg('无信息');
        }
    };
    xindouHelper.collectVideo = function(){
        let aTextSpanArray = $('a[rel="noopener noreferrer"]');
        if(null != aTextSpanArray){
            let aplayAddressArray = [];
            aTextSpanArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                if(spanText.indexOf("www.iesdouyin.com/share/video") != -1
                   || spanText.indexOf("kuaishou.com") != -1){
                    aplayAddressArray.push(spanText);
                }
            });
            collectVideoByMultipleOrignUrl(aplayAddressArray);
            toastMsg('采集请求已提交');
        }else{
            toastMsg('无信息');
        }
    };
    xindouHelper.start=function(){
        if(this.isXindou()){
            this.generateHtml();
        }
    }
    xindouHelper.start();
}

function chanmamaTool(currentUrl, currentHost){
    //     console.log('当前页面', currentUrl);
    //--婵妈妈解析开始
    var chanmamaHelper={};
    chanmamaHelper.isSite=function(){
        if(currentUrl.indexOf("www.chanmama.com") != -1){
            return true;
        }
        return false;
    }
    chanmamaHelper.generateHtml = function(){
        var $that = this;
        if(currentUrl.indexOf("www.chanmama.com/awemeDetail") != -1){
            console.log('视频详情页');
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='dll_helper_commentList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制评论</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#dll_helper_commentList_btn', function () {
                $that.getCommentList()
            });
        }
        if(currentUrl.indexOf("www.chanmama.com/authorDetail") != -1){
            console.log('账号详情页');
            let topBox00 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='dll_helper_gotoUserPage_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去下载视频</a></div>"
            "</div>";
            $("body").append(topBox00);
            $('body').on('click', '#dll_helper_gotoUserPage_btn', function () {
                $that.gotoUserPage()
            });
        }
        var topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='dll_helper_linkList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制视频</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#dll_helper_linkList_btn', function () {
            $that.getDouyinLinkList()
        });
        let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;right:0px;'>"+
            "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectVideo_btn', function () {
            $that.collectVideo();
        });
    };
    chanmamaHelper.gotoUserPage = function(){
        GM_setClipboard('', 'text');
        let userId = currentUrl.substring(currentUrl.lastIndexOf("authorDetail/") + "authorDetail/".length, currentUrl.lastIndexOf("/aweme"));
        let douyinUserUrl = "https://www.iesdouyin.com/share/user/" + userId;
        GM_setClipboard(douyinUserUrl, 'text');
        GM_openInTab("http://www.dspjx.com/douyin/index.php");
    };
    chanmamaHelper.getCommentList = function(){
        GM_setClipboard('', 'text');
        var commentTextSpanArray = $("#app div.aweme-detail-page div.common-box div.comment-section div.comment-list-war div.info div.text");
        if(null != commentTextSpanArray){
            var clipBoardStr = "";
            commentTextSpanArray.each(function (i, n) {
                var spanText = $(this).text();
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    chanmamaHelper.getDouyinLinkList = function(){
        GM_setClipboard('', 'text');
        var aTextSpanArray = $('a.aweme-detail-icon');
        if(null != aTextSpanArray){
            var clipBoardStr = "";
            aTextSpanArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                if(spanText.indexOf("www.iesdouyin.com/share/video") != -1){
                    clipBoardStr = clipBoardStr + "\r\n" + spanText;
                }
            });
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
            GM_openInTab('http://www.dspjx.com/batch/index.php');
        }else{
            toastMsg('无信息');
        }
    };
    chanmamaHelper.collectVideo = function(){
        let aTextSpanArray = $('a.aweme-detail-icon');
        if(null != aTextSpanArray){
            let aplayAddressArray = [];
            aTextSpanArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                if(spanText.indexOf("www.iesdouyin.com/share/video") != -1){
                    aplayAddressArray.push(spanText);
                }
            });
            collectVideoByMultipleOrignUrl(aplayAddressArray);
            toastMsg('采集请求已提交');
        }else{
            toastMsg('无信息');
        }
    };
    chanmamaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    chanmamaHelper.start();
}

function zhongcaoTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("www.zhongcao.cn/video/detail")!=-1
           || currentUrl.indexOf("www.zhongcao.cn/good/info/id")!=-1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        var btn02 = '<button class="ss fl" style="width: 100px; background-color:#CC99FF;" id="doulala_helper_douyinList_btn">一键复制</button>';
        $("div.thetime").append(btn02);
        $('body').on('click', '#doulala_helper_douyinList_btn', function () {
            $that.getDouyinLinkList()
        });
        let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
            "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectVideo_btn', function () {
            $that.collectVideo();
        });
    };
    doulalaHelper.getDouyinLinkList = function(){
        GM_setClipboard('', 'text');
        var aTagArray = null;
        if(currentUrl.indexOf("www.zhongcao.cn/video/detail")!=-1){
            aTagArray = $("div.good-list ul li.listboxs ul.douy_btn li.fl a");
        }else if(currentUrl.indexOf("www.zhongcao.cn/good/info/id")!=-1){
            aTagArray = $("div.good-list ul li.listbox ul.douy_btn li.fl a");
        }
        if(null != aTagArray){
            var clipBoardStr = "";
            aTagArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
            GM_openInTab('http://www.dspjx.com/batch/index.php');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.collectVideo = function(){
        var aTagArray = null;
        if(currentUrl.indexOf("www.zhongcao.cn/video/detail")!=-1){
            aTagArray = $("div.good-list ul li.listboxs ul.douy_btn li.fl a");
        }else if(currentUrl.indexOf("www.zhongcao.cn/good/info/id")!=-1){
            aTagArray = $("div.good-list ul li.listbox ul.douy_btn li.fl a");
        }
        if(null != aTagArray){
            let aplayAddressArray = [];
            aTagArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                aplayAddressArray.push(spanText);
            })
            collectVideoByMultipleOrignUrl(aplayAddressArray);
            toastMsg('采集请求已提交');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    doulalaHelper.start();
}

function kuaishouTool(currentUrl, currentHost){
    //     console.log('轻视频链接 ', currentUrl);
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("kuaishou.com/profile/")!=-1
           || currentUrl.indexOf("kuaishou.com/u/")!=-1){
            return true;
        }
        return false;
    }
    doulalaHelper.getDirectUrl = function (){
        let changedCurrentUrl = window.location.href;
        console.log(changedCurrentUrl);
        GM_setClipboard('', 'text');
        var requestBody = {
            "searchVal": changedCurrentUrl,
            "pageSize": 1
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: doulalaHelperHost + '/parseVideoList',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(resp.success){
                    var dataArray = resp.data;
                    if(null != dataArray && dataArray.length > 0){
                        dataArray.forEach((data, index, array) => {
                            let videoLink = data.playAddress;
                            let startIndex = changedCurrentUrl.lastIndexOf('/') + '/'.length;
                            let endIndex = changedCurrentUrl.lastIndexOf('?');
                            let filename = changedCurrentUrl.substring(startIndex, endIndex) + ".mp4";
                            console.log('快手视频地址', videoLink);
                            Exporter.sendToAria2RPCSingle(videoLink, filename);
                            toastMsg('已发送成功');
                        });
                    }
                }else{
                    toastMsg('无信息');
                }
            }
        });
    };
    doulalaHelper.getKuaishouVideo = function (data){
        let aplayAddress = "https://c.kuaishou.com/fw/photo/" + data.vid;
        GM_setClipboard('', 'text');
        var requestBody = {
            "searchVal": aplayAddress,
            "pageSize": 1
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: doulalaHelperHost + '/parseVideoList',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(resp.success){
                    var dataArray = resp.data;
                    if(null != dataArray && dataArray.length > 0){
                        dataArray.forEach((data, index, array) => {
                            let videoLink = data.playAddress;
                            let filename = data.vid + ".mp4";
                            console.log('快手视频地址', videoLink);
                            Exporter.sendToAria2RPCSingle(videoLink, filename);
                            toastMsg('发送成功');
                        });
                    }
                }else{
                    toastMsg('无信息');
                }
            }
        });
    }
    doulalaHelper.sendToAria2RPC = function(){
        let $that = this;
        parseVideoList(currentUrl, $that.getKuaishouVideo);
    };
    doulalaHelper.generateHtml = function(){
        let $that = this;
        let topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
            "<div id='dll_helper_directlink_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>单视频下载</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#dll_helper_directlink_btn', function () {
            $that.getDirectUrl()
        });
        //         let topBox09 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
        //             "<div id='doulala_sendToAria2RPC_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
        //             "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2RPC</a></div>"
        //         "</div>";
        //         $("body").append(topBox09);
        //         $('body').on('click', '#doulala_sendToAria2RPC_btn', function () {
        //             $that.sendToAria2RPC();
        //         });
    };
    doulalaHelper.start=function(){
        var $that = this;
        if($that.isSite()){
            $that.generateHtml();
        }
    }
    doulalaHelper.start();
}

function bbqTool(currentUrl, currentHost){
    //     console.log('轻视频链接 ', currentUrl);
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("bbq.bilibili.com/video")!=-1
           || currentUrl.indexOf("bbq.bilibili.com/user")!=-1){
            return true;
        }
        return false;
    }
    doulalaHelper.getVideoList = function(){
        var $that = this;
        GM_setClipboard('', 'text');
        var requestBody = {
            "searchVal": currentUrl,
            "pageSize": 2000
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: doulalaHelperHost + '/parseVideoList',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(resp.success){
                    var clipBoardStr = "";
                    var dataArray = resp.data;
                    if(null != dataArray && dataArray.length > 0){
                        dataArray.forEach((data, index, array) => {
                            //                                 console.log(data.playAddress);
                            clipBoardStr = clipBoardStr + "\r\n" + data.playAddress;
                        });
                    }
                    GM_setClipboard(clipBoardStr, 'text');
                    toastMsg('复制成功');
                }else{
                    toastMsg('无信息');
                }
            }
        });
    };
    doulalaHelper.getDirectLink = function(){
        GM_setClipboard('', 'text');
        var videoStr = $('video').attr("src");
        if(null != videoStr){
            if(videoStr.indexOf("https") == -1){
                videoStr = "https:" + videoStr;
            }
            GM_setClipboard(videoStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.sendToAria2RPC_list = function(){
        var $that = this;
        GM_setClipboard('', 'text');
        var requestBody = {
            "searchVal": currentUrl,
            "pageSize": 2000
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: doulalaHelperHost + '/parseVideoList',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(resp.success){
                    var clipBoardStr = "";
                    var dataArray = resp.data;
                    if(null != dataArray && dataArray.length > 0){
                        dataArray.forEach((data, index, array) => {
                            let videoLink = data.playAddress;
                            let videoTitle = data.title;
                            //                             let rename = index + "_" + videoTitle + ".mp4";
                            let rename = index + "_" + data.vid + ".mp4";
                            Exporter.sendToAria2RPCSingle(videoLink, rename);
                            toastMsg(index + '发送成功');
                        });
                    }
                    toastMsg('发送完成');
                }else{
                    toastMsg('无信息');
                }
            }
        });
    };
    doulalaHelper.sendToAria2RPC_single = function(){
        let videoStr = $('video').attr("src");
        if(null != videoStr){
            if(videoStr.indexOf("https") == -1){
                videoStr = "https:" + videoStr;
            }
            let videoLink = videoStr;
            let videoTitle = $('div.area div.desc').text();
            let rename = videoTitle + ".mp4";
            Exporter.sendToAria2RPCSingle(videoLink, rename);
            toastMsg('发送成功');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.generateHtml = function(){
        let $that = this;
        if(currentUrl.indexOf("bbq.bilibili.com/user")!=-1){
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
                "<div id='doulala_helper_linkList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
                "<a style='color:#FFFFFF; text-decoration: none;' href='javascript:void(0);'>复制链接</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#doulala_helper_linkList_btn', function () {
                doulalaHelper.getVideoList()
            });
            let topBox09_01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
                "<div id='doulala_sendToAria2RPC_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2</a></div>"
            "</div>";
            $("body").append(topBox09_01);
            $('body').on('click', '#doulala_sendToAria2RPC_btn', function () {
                doulalaHelper.sendToAria2RPC_list();
            });
        }
        if(currentUrl.indexOf("bbq.bilibili.com/video")!=-1){
            let topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;left:0px;'>"+
                "<div id='doulala_helper_directlink_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
                "<a style='color:#FFFFFF; text-decoration: none;' href='javascript:void(0);'>复制链接</a></div>"
            "</div>";
            $("body").append(topBox02);
            $('body').on('click', '#doulala_helper_directlink_btn', function () {
                $that.getDirectLink()
            });
            let topBox09_01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
                "<div id='doulala_sendToAria2RPC_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>发送Aria2</a></div>"
            "</div>";
            $("body").append(topBox09_01);
            $('body').on('click', '#doulala_sendToAria2RPC_btn', function () {
                $that.sendToAria2RPC_single();
            });
        }
    };
    doulalaHelper.start=function(){
        var $that = this;
        if($that.isSite()){
            if(currentUrl.indexOf("bbq.bilibili.com/user")!=-1){
                waitForKeyElements (
                    "div.bbq-download-guide__bottom",
                    $that.generateHtml
                );
            }else{
                $that.generateHtml();
            }
        }
    }
    doulalaHelper.start();
}

function feiguaTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("dy.feigua.cn") != -1
           || currentUrl.indexOf("ks.feigua.cn") != -1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        if(currentUrl.indexOf('/Blogger/Detail') != -1){
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:25%;right:0px;'>"+
                "<div id='douyin_helper_gotoUserPage_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去下载视频</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#douyin_helper_gotoUserPage_btn', function () {
                $that.gotoUserPage()
            });
        }
        var topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
            "<div id='douyin_helper_commentList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制评论</a></div>"
        "</div>";
        $("body").append(topBox01);
        $('body').on('click', '#douyin_helper_commentList_btn', function () {
            $that.getCommentList()
        });
        var topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='douyin_helper_linkList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制视频</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#douyin_helper_linkList_btn', function () {
            $that.getDouyinLinkList()
        });
        let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;right:0px;'>"+
            "<div id='doulala_collectVideo_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集视频</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectVideo_btn', function () {
            $that.collectVideo();
        });
    };
    doulalaHelper.gotoUserPage = function(){
        GM_setClipboard('', 'text');
        let douyinUserUrl = $("div.zhibo-code-box div[data-qrcodesrc]").attr("data-qrcodesrc");
        GM_setClipboard(douyinUserUrl, 'text');
        GM_openInTab("http://www.dspjx.com/douyin/index.php");
    };
    doulalaHelper.getDouyinLinkList = function(){
        GM_setClipboard('', 'text');
        var aTagArray = $(".source-play,.tag-play");
        if(undefined != aTagArray && null != aTagArray){
            var clipBoardStr = "";
            aTagArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
            GM_openInTab('http://www.dspjx.com/batch/index.php');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.collectVideo = function(){
        var aTagArray = $(".source-play,.tag-play");
        if(undefined != aTagArray && null != aTagArray){
            let aplayAddressArray = [];
            aTagArray.each(function (i, n) {
                var spanText = $(this).attr("href");
                aplayAddressArray.push(spanText);
            })
            collectVideoByMultipleOrignUrl(aplayAddressArray);
            toastMsg('采集请求已提交');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.getCommentList = function(){
        GM_setClipboard('', 'text');
        var aTagArray = null;
        if(currentUrl.indexOf("dy.feigua.cn/Member#/Comment") != -1){
            aTagArray = $("#js-comment-content > tr > td > div > div > div > a");
        }else{
            aTagArray = $("#ja-aweme-comment-container p.item-body");
        }
        if(null != aTagArray){
            var clipBoardStr = "";
            aTagArray.each(function (i, n) {
                var spanText = $(this).text();
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    doulalaHelper.start();
}

function douchachaTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("www.douchacha.com") != -1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        if(currentUrl.indexOf("douchacha.com/videoDetail/") != -1){
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='douyin_helper_commentList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制评论</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#douyin_helper_commentList_btn', function () {
                $that.getCommentList()
            });
        }
        if(currentUrl.indexOf("douchacha.com/person/detail/") != -1){
            let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
                "<div id='dll_helper_gotoUserPage_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>去下载视频</a></div>"
            "</div>";
            $("body").append(topBox01);
            $('body').on('click', '#dll_helper_gotoUserPage_btn', function () {
                $that.gotoUserPage()
            });
        }
        let topBox02 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='douyin_helper_linkList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制视频</a></div>"
        "</div>";
        $("body").append(topBox02);
        $('body').on('click', '#douyin_helper_linkList_btn', function () {
            $that.getDouyinLinkList()
        });
        if(currentUrl.indexOf("douchacha.com/circle") != -1){
            let topBox03 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;right:0px;'>"+
                "<div id='douyin_helper_collectQuanzi_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#00cccc;'>"+
                "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>采集本页数据</a></div>"
            "</div>";
            $("body").append(topBox03);
            $('body').on('click', '#douyin_helper_collectQuanzi_btn', function () {
                //$that.collectQuan();
                $that.collectAccount();
            });
        }
    };
    doulalaHelper.gotoUserPage = function(){
        GM_setClipboard('', 'text');
        let userId = currentUrl.substring(currentUrl.indexOf("/detail/") + "/detail/".length);
        let douyinUserUrl = "https://www.iesdouyin.com/share/user/" + userId;
        GM_setClipboard(douyinUserUrl, 'text');
        GM_openInTab("http://www.dspjx.com/douyin/index.php");
    };
    doulalaHelper.getDouyinLinkList = function(){
        GM_setClipboard('', 'text');
        var clipBoardStr = "";
        if(currentUrl.indexOf("www.douchacha.com/videoDetail/") != -1){
            clipBoardStr = $("#qrcode").attr("title");
        }
        if(currentUrl.indexOf("www.douchacha.com/surge") != -1){
            var btnTagArray = $("#content-container button.gradient_green");
            console.log(btnTagArray.length);
            if(undefined != btnTagArray && null != btnTagArray){
                btnTagArray.each(function (i, n) {
                    $(this).trigger("click");
                    clipBoardStr = "";
                    //clipBoardStr = clipBoardStr + "\r\n" + spanText;
                })
            }
        }
        if(null != clipBoardStr && "" != clipBoardStr){
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
            GM_openInTab('http://www.dspjx.com/batch/index.php');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.getCommentList = function(){
        GM_setClipboard('', 'text');
        var spanTagArray = $("#pane-second div.detail_comment_content span.detail_comment_text");
        if(null != spanTagArray){
            var clipBoardStr = "";
            spanTagArray.each(function (i, n) {
                var spanText = $(this).text();
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };
    doulalaHelper.collectAccount = function(){
        var $that = this;
        var firstSelected = $("div#tab-first").attr("aria-selected");
        console.log('当前所处的tab ', firstSelected);
        if(firstSelected){
            //抖查查做了限制，一天只能采集15条
            //=========采集商业合作资源=========
            var btnCurrentPage = $('#app div div.el-row ul li.active');
            var totalPage = 184
            var currentPage = btnCurrentPage.text();
            if(currentPage >= 1 && currentPage < totalPage){
                //1. 采集当前页的数据
                console.log("采集当前页", currentPage, "的数据");
                //1.1 10秒批量触发“查看联系方式”按钮
                var btnSeeArray = $('#app div div.el-row table tbody tr td div.cell i.el-icon');
                console.log("当前页", currentPage, "的按钮数量", btnSeeArray.length);
                if(undefined != btnSeeArray && null != btnSeeArray){
                    btnSeeArray.each(function (i, n) {
                        var _btnSeeThat = $(this);
                        //假设每页耗费25秒时间采集数据
                        //                     var tempSleepMills = (currentPage - 1) * 25 + i * 1000;
                        var tempSleepMills = i * 1000;
                        console.log("当前页", currentPage, "的第", i,"个按钮睡眠时间", tempSleepMills);
                        sleep(tempSleepMills).then(function(){
                            _btnSeeThat.trigger("click");
                        });
                    })
                }
                //1.2 15秒采集当页用户数据
                sleep(15 * 1000).then(function(){
                    var spanTagArray = $('#app div table tbody tr td div div.el-table__body-wrapper table tbody tr td div.cell div:nth-child(2) span');
                    console.log("当前页数据条数", spanTagArray.length);
                    //找到微信和手机号，采集到后台即可
                    if(undefined != spanTagArray && null != spanTagArray){
                        var bookListArray = [];
                        spanTagArray.each(function (i, n) {
                            var spanText = $(this).text().trim();
                            console.log('获取手机号 ', spanText);
                            var book = {
                                "mediaType": "wechat",
                                "sourceType": "douchacha",
                                "uniqueId": spanText
                            };
                            bookListArray.push(book);
                        })
                        var requestBody = {
                            "bookList": bookListArray
                        };
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: doudaihuoHelperHost + '/collectBook',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            data: JSON.stringify(requestBody),
                            responseType: 'json',
                            onload: function(response) {
                                var resp = JSON.parse(response.responseText);
                                if(resp.success){
                                    toastMsg('采集' + currentPage + '已提交');
                                }else{
                                    toastMsg('采集' + currentPage + '失败');
                                }
                            }
                        });
                    }

                });
            }

        }else{
            //抖查查做了限制，一天只能采集50条
            //=========采集优质账号资源=========
            let btnCurrentPage = $('#app div div.el-row ul li.active');
            let totalPage = 3327;
            let currentPage = btnCurrentPage.text();
            if(currentPage >= 1 && currentPage < totalPage){
                //1. 采集当前页的数据
                console.log("采集当前页", currentPage, "的数据");
                //1.1 10秒批量触发“查看联系方式”按钮
                let btnSeeArray = $('#app div div.el-row div span.look');
                console.log("当前页", currentPage, "的按钮数量", btnSeeArray.length);
                if(undefined != btnSeeArray && null != btnSeeArray){
                    btnSeeArray.each(function (i, n) {
                        let _btnSeeThat = $(this);
                        let tempSleepMills = i * 1000;
                        sleep(tempSleepMills).then(function(){
                            _btnSeeThat.trigger("click");
                        });
                    })
                }
                //1.2 15秒采集当页用户数据
                sleep(15 * 1000).then(function(){
                    var spanTagArray = $('#app div div.el-row div.noPhone p:nth-child(1) span:nth-child(3)');
                    console.log("当前页数据条数", spanTagArray.length);
                    if(undefined != spanTagArray && null != spanTagArray){
                        var bookListArray = [];
                        spanTagArray.each(function (i, n) {
                            var spanText = $(this).text().trim();
                            var book = {
                                "mediaType": "wechat",
                                "sourceType": "douchacha",
                                "uniqueId": spanText
                            };
                            bookListArray.push(book);
                        })
                        var requestBody = {
                            "bookList": bookListArray
                        };
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: doudaihuoHelperHost + '/collectBook',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            data: JSON.stringify(requestBody),
                            responseType: 'json',
                            onload: function(response) {
                                var resp = JSON.parse(response.responseText);
                                if(resp.success){
                                    toastMsg('采集' + currentPage + '已提交');
                                }else{
                                    toastMsg('采集' + currentPage + '失败');
                                }
                            }
                        });
                    }else{
                        toastMsg('无信息');
                    }
                });
            }

        }

        //2. 30秒跳转到上一页
        var btnNextPage = $('#app div div.el-row button.btn-prev');
        if(undefined != btnNextPage && null != btnNextPage){
            sleep(30 * 1000).then(function(){
                btnNextPage.trigger("click");
            });
            sleep(35 * 1000).then(function(){
                $that.collectAccount();
            });
        };
    };
    doulalaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    doulalaHelper.start();
}

function piaoquantvTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("piaoquantv.com")!=-1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='doulala_helper_videoDesc_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#CC99FF;'>"+
            "<a style='color:#FFFFFF; text-decoration: none;' href='javascript:void(0);'>抖拉拉一键发布</a></div>"
        "</div>";
        $("body").append(topBox01);
        $('body').on('click', '#doulala_helper_videoDesc_btn', function () {
            doulalaHelper.publishVideoList()
        });
    };
    doulalaHelper.piaoquantvVideoSend = function(videoObj, readyToUploadTotalCount){
        console.log(JSON.stringify(videoObj));
        let machineCodeValue = localStorage.getItem("machineCode");
        let lv_userInfoValue = localStorage.getItem("lv_userInfo");
        let lv_userInfo = JSON.parse(lv_userInfoValue);
        let requestBody = new FormData();
        requestBody.append('versionCode', 28);
        requestBody.append('appType', 8);
        requestBody.append('platform', 'PC');
        requestBody.append('appId', 'wx73a6cb4d85be594f');
        requestBody.append('system', 'Win10');
        requestBody.append('machineCode', machineCodeValue);
        requestBody.append('loginUid', lv_userInfo.uid);
        requestBody.append('token', lv_userInfo.accessToken);
        requestBody.append('barrageSwitch', 1);
        requestBody.append('videoCollectionId', 0);
        requestBody.append('viewStatus', 1);
        requestBody.append('coverImgPath', videoObj.coverImgPath);
        requestBody.append('title', videoObj.title);
        requestBody.append('descr', videoObj.descr);
        requestBody.append('videoPath', videoObj.videoPath);
        requestBody.append('fileExtensions', 'mp4');
        requestBody.append('pwd', '');
        requestBody.append('producerKitType', '');
        requestBody.append('producerKitId', '');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://longvideoapi.piaoquantv.com/longvideoapi/video/send',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: urlencodeFormData(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(0 == resp.code){
                    toastMsg(resp.data.id + "上传完成");
                    piaoquanPublishCount += 1;
                    console.log('已上传', piaoquanPublishCount, '个', '需要上传总数', readyToUploadTotalCount);
                    //如果所有视频都上传完成
                    if(piaoquanPublishCount >= readyToUploadTotalCount){
                        window.location.href = "https://piaoquantv.com/home";
                    }
                }
            }
        })
    };
    doulalaHelper.publishVideoList = function(){
        piaoquanPublishCount = 0;
        var $that = this;
        let uploadItemDivArray = $("div.upload-content div.upload-board div.upload-item");
        if(null != uploadItemDivArray && uploadItemDivArray.length > 0){
            let readyToUploadTotalCount = uploadItemDivArray.length;
            uploadItemDivArray.each(function (i, n) {
                let uploadItemDiv_that = $(this);
                let spanFilename = uploadItemDiv_that.find("div.upload-control div.upload-progress div.progress-info div.info-left span");
                let filename = spanFilename.text();
                console.log(filename);
                let coverImgPath = uploadItemDiv_that.find("div.video-info div div.left-editor div div img").attr("src");
                let coverImgSrcPart = coverImgPath.substring(coverImgPath.indexOf("/vpc/") + "/vpc/".length);
                let videoPath = "longvideo/video/vpc/" + coverImgSrcPart.replace(/_0/g, "");
                var requestBody = {
                    "filename": filename
                };
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: doulalaHelperHost + '/videoDownloadList',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: JSON.stringify(requestBody),
                    responseType: 'json',
                    onload: function(response) {
                        var resp = JSON.parse(response.responseText);
                        if(resp.success){
                            var dataArray = resp.data;
                            if(null != dataArray && dataArray.length > 0){
                                let originVideoTitle = dataArray[0].title;
                                let videoTitle = dataArray[0].title;
                                if(videoTitle.length > 30){
                                    videoTitle = videoTitle.substring(0, 30);
                                }
                                uploadItemDiv_that.find("div.video-info div.right-editor div.title-input input").val(videoTitle);
                                uploadItemDiv_that.find("div.video-info div.right-editor div.desc-input textarea").text(originVideoTitle);
                                let videoObj = {
                                    'coverImgPath': coverImgPath,
                                    'title': videoTitle,
                                    'descr': videoTitle,
                                    'videoPath': videoPath
                                };
                                $that.piaoquantvVideoSend(videoObj, readyToUploadTotalCount);
                            }
                        }else{
                            toastMsg('无信息');
                        }
                    }
                });
            })
            //批量上传完成后
            toastMsg('一键上传已提交')
        }
    };
    doulalaHelper.start=function(){
        var $that = this;
        if($that.isSite()){
            $that.generateHtml();
        }
    }
    doulalaHelper.start();
}

//https://greasyfork.org/zh-CN/scripts/379002
//名称：163 Music Downloader 网易云音乐下载助手
//作者：       Zszen John
function netmusicTool(currentUrl, currentHost){
    var doulalaHelper={};
    doulalaHelper.isSite=function(){
        if(currentUrl.indexOf("music.163.com") != -1){
            return true;
        }
        return false;
    }
    doulalaHelper.generateHtml = function(){
        var $that = this;
        var iframe = $("#g_iframe");
        if (currentUrl.search(".*://music\\.163\\.com/#/song\\?id=\\d+") !=-1 ){
            iframe.on('load', function () {
                var url = $that.geturl($that.getid());
                $that.insertElem(url, iframe);
            });
        }
        let topBox01 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:30%;right:0px;'>"+
            "<div id='doulala_helper_commentList_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#F93A60;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键复制热评</a></div>"
        "</div>";
        $("body").append(topBox01);
        $('body').on('click', '#doulala_helper_commentList_btn', function () {
            $that.getCommentList()
        });
        let topBox10 = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:35%;right:0px;'>"+
            "<div id='doulala_collectPlaylist_btn' style='font-size:12px;padding:8px 2px;width:100px;text-align:center;color:#FFF;background-color:#007fff;'>"+
            "<a style='color:#FFFFFF;text-decoration:none;' href='javascript:void(0);'>一键采集歌单</a></div>"
        "</div>";
        $("body").append(topBox10);
        $('body').on('click', '#doulala_collectPlaylist_btn', function () {
            $that.collectPlaylist();
        });
    };

    doulalaHelper.insertElem = function (url, iframe) {
        var $that = this;
        var content_frame = $("#content-operation", document.getElementById('g_iframe').contentWindow.document.body)
        var album = $("#g_iframe").contents().find(".u-cover.u-cover-6.f-fl>img");
        var element = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 1" hidefocus="true" title="直接下载" target="_blank" href="'+url+'"><i><em class="ply"></em>直接下载</i></a>');
        content_frame.append(element);

        var element2 = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 2" hidefocus="true" title="下载封面" target="_blank" href="'+album.attr("data-src")+'"><i><em class="ply"></em>下载封面</i></a>');
        content_frame.append(element2);

        var el2img = $("<img src='"+album.attr("data-src")+"' style='width:30px;'>");
        content_frame.append(el2img);

        var element3 = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 3" hidefocus="true" title="复制歌词"><i><em class="ply"></em>复制歌词</i></a>');
        content_frame.append(element3);
        element3.on("click", $that.copy_lyric);
    };

    doulalaHelper.collectPlaylistRequest = function(searchVal){
        console.log('开始采集url ', searchVal);
        let requestBody = {
            "searchVal" : searchVal
        };
        GM_xmlhttpRequest({
            method: 'POST',
            //                url: 'http://localhost:16101/api/doumusic/app/crawMusic',
            url: 'https://1.idoulala.com/api/app/doumusic/crawMusic',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(requestBody),
            responseType: 'json',
            onload: function(response) {
                var resp = JSON.parse(response.responseText);
                if(resp.success){
                    toastMsg('采集请求提交成功');
                }else{
                    toastMsg('采集请求提交失败');
                }
            }
        });
    };

    doulalaHelper.collectPlaylist = function(){
        let $that = this;
//         console.log(currentUrl);
        //超级解析
        if (currentUrl.indexOf("/playlist?id=") != -1) {
            $that.collectPlaylistRequest(currentUrl);
            toastMsg('采集请求已提交');
        }else if (currentUrl.indexOf("/discover/playlist") != -1) {
            let currentPageEle = $("iframe#g_iframe").contents().find("#m-pl-pager div.u-page a.zpgi.js-selected");
//             console.log("currentPageEle", currentPageEle);
            let currentPage = currentPageEle.text();
//             console.log("currentPage", currentPage);
            let nextPageEle = $("iframe#g_iframe").contents().find("#m-pl-pager div.u-page a.znxt");
//             console.log("nextPageEle", nextPageEle);

            let playlist_li_a = $("iframe#g_iframe").contents().find("div#m-disc-pl-c ul#m-pl-container li p.dec a");
//             console.log("playlist_li_a", playlist_li_a);
            playlist_li_a.each(function (i, n) {
                let spanText = $(this).attr("href");
                let playlistLink = "https://music.163.com" + spanText;
                $that.collectPlaylistRequest(playlistLink);
            });

            toastMsg('采集请求已提交');

            if(nextPageEle.hasClass("js-disabled")){
                console.log('当前页已是最后一页', currentPage);
            }else{
                setTimeout(function() {
                    console.log('触发下一页的点击事件');
                    window.location.href = "https://music.163.com" + nextPageEle.attr("href");
                }, playlist_li_a.length * 100);
            }
        }else{
            toastMsg('当前页面不支持采集');
        }
    };

    doulalaHelper.getid = function() {
        var id = currentUrl.split('=')[1];
        return id;
    };

    doulalaHelper.geturl = function(id) {
        var str1 = "http://music.163.com/song/media/outer/url?id=";
        var str2 = ".mp3"
        return str1 + id + str2;
    };

    doulalaHelper.copy_lyric = function(){
        GM_setClipboard('', 'text');
        var $that = this;
        var part1 = $("iframe#g_iframe").contents().find("div#lyric-content")[0].innerText;
        var part2 = $("iframe#g_iframe").contents().find("div#flag_more")[0].innerHTML;
        var idx = part1.lastIndexOf("展开")
        if(idx>=0){
            part1 = part1.substr(0, part1.lastIndexOf("展开"))
            part2 = part2.replace(/<br\>/g,"\r\n");
            part2 = part2.replace(/<br\/>/g,"\r\n");
            part1 += part2
        }
        GM_setClipboard(part1, 'text');
        toastMsg('复制成功');
    };

    doulalaHelper.getCommentList = function(){
        GM_setClipboard('', 'text');
        var spanTagArray = null;
        if(currentUrl.indexOf("music.163.com/#/playlist") != -1
           || currentUrl.indexOf("music.163.com/#/song") != -1){
            spanTagArray = $("iframe#g_iframe").contents().find("div.cntwrap div.cnt");
        }
        if(null != spanTagArray){
            var clipBoardStr = "";
            spanTagArray.each(function (i, n) {
                var spanText = $(this).text();
                var splitStr = "：";
                spanText = spanText.substring(spanText.indexOf(splitStr) + splitStr.length);
                clipBoardStr = clipBoardStr + "\r\n" + spanText;
            })
            GM_setClipboard(clipBoardStr, 'text');
            toastMsg('复制成功');
        }else{
            toastMsg('无信息');
        }
    };

    doulalaHelper.start=function(){
        if(this.isSite()){
            this.generateHtml();
        }
    }
    doulalaHelper.start();

}
