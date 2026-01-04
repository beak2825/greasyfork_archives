// ==UserScript==
// @name         ImgBB 相册下载器
// @name:en      ImgBB Album Downloader
// @name:zh-CN   ImgBB 相册下载器
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  批量下载ImgBB 相册图片
// @description:en Batch Downbnloader for ImgBB Album
// @description:zh-CN 批量下载ImgBB 相册图片
// @license      MIT
// @author       You
// @match        https://ibb.co/album/*
// @match        https://*.imgbb.com/*
// @match        https://*.imgbb.com
// @exclude      https://*.imgbb.com/albums*
// @exclude      https://*.imgbb.com/following*
// @icon         data:image/png;base64,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
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/521452/ImgBB%20%E7%9B%B8%E5%86%8C%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521452/ImgBB%20%E7%9B%B8%E5%86%8C%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    function findAlbumInfo() {
        //Get Album Info
        var albumInfo = { albumName: "", albumURL: "", albumID: "", imgCount: 0 };
        $("meta").each(function (index) {
            if ($(this).attr("property")) {
                switch ($(this).attr("property")) {
                    case ("og:title"):
                        albumInfo.albumName = $(this).attr("content");
                        break;
                    case ("og:url"):
                        albumInfo.albumURL = $(this).attr("content");
                        albumInfo.albumID = albumInfo.albumURL.slice(21, 27);
                        break;
                }
            }
        });
        //Get image Count
        $("span").each(function (index) {
            if ($(this).attr("data-text") == "image-count") {
                albumInfo.imgCount = parseInt($(this).text());
                return;
            }
        });
        //console.log(albumInfo);
        return albumInfo;
    }

    function listImageURLs(albumID) {
        var imgInfos = [];
        $.ajaxSettings.async = false;
        $.ajax({
            url: "https://ibb.co/json",
            data: { "action": "get-album-contents", "albumid": albumID },
            type: "POST",
            dataType: "json",
            timeout: 5000, // 设置超时时间为5秒
            success: function (data) {
                //console.log(data);
                imgInfos = data.contents;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus === 'timeout') {
                    // 超时错误处理
                    console.log('Request timed out.');
                } else {
                    // 其他错误处理
                    console.log('Error: ' + errorThrown);
                }
            }

        });
        $.ajaxSettings.async = true;
        //console.log(imgInfos);
        return imgInfos;
    }

    function appendDownloadEle(albumInfo) {
        if ($("#img_downloader").length <= 0) {
            // 下载按钮
            let btnTab;
            // Get location of the Tab
            $("#tab-sub-link").each(function (index) { btnTab = $(this); });
            //Create the Download Tab
            var tabtxt = `<li id="img_downloader" class="phone-hide phablet-hide pop-btn">
                            <span class="top-btn-text">
                                <span id ="download_button" class="btn-text phone-hide phablet-hide"
                                    style="background-color: rgb(223, 110, 110); color: rgb(255, 255, 255);  border-radius: 10px; padding-left: 10px; padding-right: 10px; margin-bottom: 2px;"><img
                                        width="24" height="22" class="iconcenter" style="vertical-align: middle;"
                                       src="data:image/png;base64,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"></img>
                                    点击下载<span class="arrow-down"></span></span></span>
                            <div id="img_downloader_dropdown" class="pop-box arrow-box arrow-box-top anchor-left" style="display: none;">
                                <div class="pop-box-inner pop-box-menu">
                                    <ul>
                                        <li><a id="img_downloader_origin"> 原图下载</a></li>
                                        <li><a id="img_downloader_medium"> 标清图下载</a></li>
                                        <li><a id="img_downloader_thumb"> 缩略图下载</a></li>
                                        <li><a id="img_downloader_CB"> 复制到剪切板</a></li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
            btnTab.parent().parent().after(tabtxt);
            $("#img_downloader_origin").on("click", async function (event) {
                await album_download(albumInfo.imgInfos, albumInfo.albumName, "原图");
            });
            $("#img_downloader_medium").on("click", async function (event) {
                await album_download(albumInfo.imgInfos, albumInfo.albumName, "标清图");
            });
            $("#img_downloader_thumb").on("click", async function (event) {
                await album_download(albumInfo.imgInfos, albumInfo.albumName, "缩略图");
            });
            $("#img_downloader_CB").on("click", function (event) {
                $("#img_downloader").css("pointer-events", "none")
                event.preventDefault();
                let imgInfos = albumInfo.imgInfos;
                var copystring = "";
                for (let i = 0; i < imgInfos.length; i++) {
                    var name = "ImgBB/" + albumInfo.albumName + "/" + imgInfos[i].filename;
                    var url = imgInfos[i].url;
                    copystring = copystring + url + "\n";
                }
                //console.log(copystring);
                copyText(copystring);
                console.log("Links copied！-By Yingest");
            });
        }
    }

    async function album_download(imgInfos, albumName, type) {
        event.preventDefault();
        $("#img_downloader").css("pointer-events", "none")
        let downloading = `<span id ="download_button" class="btn-text phone-hide phablet-hide"
                                    style="background-color: rgb(223, 110, 110); color: rgb(255, 255, 255);  border-radius: 10px; padding-left: 10px; padding-right: 10px; margin-bottom: 2px;"><img
                                        width="24" height="22" class="iconcenter" style="vertical-align: middle;"
                                       src="data:image/png;base64,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"></img>
                                    下载中...<span id="downloaded"></span><meter id="downloadedbar" min="0" max="100" value="0"></meter></span>`
        let downloaded = `<span id ="download_button" class="btn-text phone-hide phablet-hide"
                                    style="background-color: rgb(223, 110, 110); color: rgb(255, 255, 255);  border-radius: 10px; padding-left: 10px; padding-right: 10px; margin-bottom: 2px;"><img
                                        width="24" height="22" class="iconcenter" style="vertical-align: middle;"
                                       src="data:image/png;base64,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"></img>
                                    下载完成<span class="arrow-down"></span></span>`
        $("#download_button").replaceWith(downloading)
        let total = imgInfos.length.toString();
        $("#downloaded").text("0/" + total + " : ")
        $("#downloadedbar").attr("max", total)
        let delay = sleep(100);
        let url = ""
        let name = ""
        console.log(type + " download Start...-By Yingest");
        for (let i = 0; i < imgInfos.length; i++) {
            name = "ImgBB/" + albumName + "/" + type + "/" + imgInfos[i].filename;
            if (type == "原图") {
                url = imgInfos[i].url;
                name = "ImgBB/" + albumName + "/" + imgInfos[i].filename;}
            else if (type == "标清图") { url = imgInfos[i].medium.url;}
            else if (type == "缩略图") { url = imgInfos[i].thumb.url;}
            await download(imgInfos[i].url, name);
            $("#downloaded").text((i + 1).toString() + "/" + total + " : ")
            $("#downloadedbar").attr("value", (i + 1).toString())
            await delay;
        }
        console.log(type + " download Finished.-By Yingest");
        $("#download_button").replaceWith(downloaded)
        $("#img_downloader").css("pointer-events", "auto")
    }

    function download(url, name) {
        return new Promise((resolve, reject) => {
            GM_download({
                url,
                name,
                saveAs: false,
                onerror: reject,
                onload: resolve
            });
            console.log("'" + name + "' downloaded");
        });
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function copyText(copystring) {
        try {
            await navigator.clipboard.writeText(copystring);
            console.log('文本已复制到剪贴板');
        } catch (err) {
            console.error('复制失败: ', err);
        }
    }
// Script for not album page
    function findImgEle() {
        setInterval(function () {
            let imgJQList = $("div");
            if (imgJQList.length > 0) {
                imgJQList.each(async function (index) {
                    if ($(this).attr("data-type")=="image") {
                        appendLink2Album($(this));
                        await sleep(100)
                    }
                });
            }
        }, 3000);
    }
    function appendLink2Album(imgJQ) {
        let linkIdAttrName = imgJQ.attr("data-id") + "_albumlink";
        if ($("#" + linkIdAttrName).length <= 0) {
            // 打开详细页获取整个网页
            var p = GM_xmlhttpRequest({
                method: "GET",
                url: "https://ibb.co/" + imgJQ.attr("data-id"),
                responseType:"text",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                onload: function (response) {
                    //console.log("请求成功");
                    //console.log(response.responseText);
                    let matchs = response.responseText.match("https://ibb\\.co/album/[a-zA-Z0-9]+");
                    //提取链接
                    let url = matchs[0];
                    //形成按钮，借用相册图标
                    let btn=`<div class="btn-icon icon-images" title="点击打开相册" id = "`+ linkIdAttrName + `"></div>`
                    //获取每个图片左上角勾选框位置
                    let target = childernRef(imgJQ,[0,1,0])
                    //在其后添加按钮，会在其右边形成图标
                    target.after(btn);
                    //添加链接事件
                    $("#" + linkIdAttrName).on("click", async function (event) {
                        event.preventDefault();
                        window.open(url, "_blank");
                    });
                    //console.log(imgJQ.attr("data-id")+" Created");
                },
                onerror: function (response) {
                    console.log("请求失败");
                },
                ontimeout: function (response) {
                    console.info("查询信息超时。");
                }
            });
        }
    }

    function childernRef(father,Orders){
        // Tools for get childern elements
        var len=Orders.length;
        var ret
        if(len==0){
             ret=father
        }
        else if(len>=1){
            var childern=father.contents();
            childern.each(function (index) {
                if(index==Orders[0]){
                    ret= childernRef($(this),Orders.slice(1,len));}
            });
        }
        return ret;
    }

    $(document).ready(function () {
        // 查找相册名称位置,向左上角添加【下载】按钮.
        let albumInfo = findAlbumInfo();
        console.log(albumInfo);
        if (albumInfo.imgCount>0){
            //如果是相册，则直接可以通过链接查找Json 获取所有图片信息
            albumInfo.imgInfos = listImageURLs(albumInfo.albumID);
            //console.log(albumInfo);
            if (albumInfo.imgInfos.length == albumInfo.imgCount) { appendDownloadEle(albumInfo); }}
        //如果不是，则是个人空间，则每种图片显示去相册的直达链接
        else {
            findImgEle()
        }
    });
    /** useless function
    function childernEle(father,Orders,attr){
        // Tools for get childern elements
        var len=Orders.length;
        var info=new Array;;
        if(len==0){
            info.push(father.val());
            info.push(father.text());
            for(var i = 0;i < attr.length;i++){info.push(father.attr(attr[i]));}
        }
        else if(len>=1){
            var childern=father.contents();
            childern.each(function (index) {
                if(index==Orders[0]){info = childernEle($(this),Orders.slice(1,len),attr);}
            });
        }
        return info
    }

    function listImageURLs_old() {
        var info0,info1,info2;
        var imgInfos=new Array();
        let imgJQList = $("div");
        if(imgJQList.length > 0 ){
            imgJQList.each(function (index) {
                if($(this).attr("data-type")=="image"){
                    var imgInfo={
                        imgName:"",
                        imgID:"",
                        imgURL_Origin:"",
                        imgURL_View:"",
                        imgURL_Small:""
                    };
                    info0=childernEle($(this),[],["data-id"]);
                    //info1=childernEle($(this),[0,0],["href"]);
                    info2=childernEle($(this),[0,0,0],["src","alt"]);
                    imgInfo.imgName=info2[3];
                    imgInfo.imgID=info0[2];
                    imgInfo.imgURL_View=info2[2];
                    //console.log(imgInfo);
                    imgInfos.push(imgInfo);
                }
            });
        }
        return imgInfos
    }
    function getImageURL_old(viewerLink,type) {
        console.info(viewerLink);
        var p = GM_xmlhttpRequest({
                method: "GET",
                url: viewerLink,
                responseType:type,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                onload: function (response) {
                    console.log("请求成功");
                    console.log(response.responseText);
                },
                onerror: function (response) {
                    console.log("请求失败");
                },
                ontimeout: function (response) {
                    console.info("查询信息超时。");
                }
            });
        console.info(p)
        return p
    }

    function listImageURLs_old() {
        var info0,info1,info2;
        var imgInfos=new Array();
        let imgJQList = $("div");
        if(imgJQList.length > 0 ){
            imgJQList.each(function (index) {
                if($(this).attr("data-type")=="image"){
                    var imgInfo={
                        imgName:"",
                        imgID:"",
                        imgURL_Origin:"",
                        imgURL_View:"",
                        imgURL_Small:""
                    };
                    info0=childernEle($(this),[],["data-id"]);
                    //info1=childernEle($(this),[0,0],["href"]);
                    info2=childernEle($(this),[0,0,0],["src","alt"]);
                    imgInfo.imgName=info2[3];
                    imgInfo.imgID=info0[2];
                    imgInfo.imgURL_View=info2[2];
                    //console.log(imgInfo);
                    imgInfos.push(imgInfo);
                }
            });
        }
        return imgInfos
    }
    function getImageURL_old(viewerLink,type) {
        console.info(viewerLink);
        var p = GM_xmlhttpRequest({
                method: "GET",
                url: viewerLink,
                responseType:type,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                onload: function (response) {
                    console.log("请求成功");
                    console.log(response.responseText);
                },
                onerror: function (response) {
                    console.log("请求失败");
                },
                ontimeout: function (response) {
                    console.info("查询信息超时。");
                }
            });
        console.info(p)
        return p
    }

    **/
})();