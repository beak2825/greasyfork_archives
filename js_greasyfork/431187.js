// ==UserScript==
// @name                Save Pixiv images to Eagle (modified by GreasyWeebs)
// @name:zh             批量导入 Pixiv 图片到 Eagle
// @name:zh-CN          批量导入 Pixiv 图片到 Eagle
// @name:zh-TW          批次導入 Pixiv 圖片到 Eagle

// @description         Launch a script on Pixiv that automatically converts all images on the page into large images (with links, names) to be added to the Eagle App. manual: go to the artist page and then press alt+L
// @description:zh      请确保你的网路环境可以正常访问 Pixiv，如果设备网路无法访问，此脚本将无法正常运作。在 Pixiv 页面启动脚本，此脚本会自动将页面中所有图片转换成大图（包含链接、名称），添加至 Eagle App。
// @description:zh-CN   请确保你的网路环境可以正常访问 Pixiv，如果设备网路无法访问，此脚本将无法正常运作。在 Pixiv 页面启动脚本，此脚本会自动将页面中所有图片转换成大图（包含链接、名称），添加至 Eagle App。
// @description:zh-TW   在 Pixiv 畫版頁面啓動腳本，此腳本會自動將頁面中所有圖片轉換成大圖（包含鏈接、名稱），添加至 Eagle App。

// @author       base code by pickuse2013 & modified by GreasyWeebs
// @namespace    https://pickuse2013.github.io/
// @homepageURL  https://github.com/pickuse2013/pixiv-to-eagle
// @supportURL   https://github.com/pickuse2013/pixiv-to-eagle
// @icon         https://www.pixiv.net/favicon.ico
// @license      MIT License

// @match        https://www.pixiv.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start

// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349

// @date         08/28/2020
// @modified     09/12/2021
// @version      1.2.4

// @downloadURL https://update.greasyfork.org/scripts/431187/Save%20Pixiv%20images%20to%20Eagle%20%28modified%20by%20GreasyWeebs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431187/Save%20Pixiv%20images%20to%20Eagle%20%28modified%20by%20GreasyWeebs%29.meta.js
// ==/UserScript==
'use strict';

(function () {
    console.log("plugin loaded..");
    // Eagle API 服务器位置
    var image = [];
    var requestsPending = 0;
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURL`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;

    // Pixiv 当前图片、链接命名规则
    const SELECTOR_IMAGE = "section ul li a img[class]";
    const SELECTOR_DIALOG = "div#save-to-eagle-dialog div#queue";
    const PENDING_DIALOG = "div#save-to-eagle-dialog div#download";

    // 是否要使用Pixiv的tags
    const SUPPORT_TAGS = false;

    let DOWNLOAD_COUNTER = 0;
    let TOTAL_COUNTER = 0;
    let FINISH = false;

    // 创建文件夹
    var createFolder = function (folderName, callback) {
        GM_xmlhttpRequest({
            url: EAGLE_CREATE_FOLDER_API_URL,
            method: "POST",
            data: JSON.stringify({
                folderName: folderName
            }),
            onload: function (response) {
                try {
                    var result = JSON.parse(response.response);
                    if (result.status === "success" && result.data && result.data.id) {
                        callback(undefined, result.data);
                    } else {
                        callback(true);
                    }
                } catch (err) {
                    callback(true);
                }
            }
        });
    };

    function addImageToEagle(data) {        
        GM_xmlhttpRequest({
            url: EAGLE_IMPORT_API_URL,
            method: "POST",
            data: JSON.stringify(data),
            onload: function (response) {
                ajaxFinished();
            }
        });
    }

    function updateDialog()
    {
        $(SELECTOR_DIALOG).html(`Total File: ${DOWNLOAD_COUNTER} files.`);

        if(FINISH == true)
        {
            $(SELECTOR_DIALOG).html(`${DOWNLOAD_COUNTER} Files Queued!`);
        }
    }

    function ajaxStarted() {
        requestsPending++;
        $(PENDING_DIALOG).html(`Download Progress: ${requestsPending}`);
    }
    function ajaxFinished() {
        requestsPending--;
        $(PENDING_DIALOG).html(`Download Progress: ${requestsPending}`);
        if(requestsPending == 0 && FINISH == true){
            $(PENDING_DIALOG).html(`Download Completed!`);
            setTimeout(function(){
                $(SELECTOR_DIALOG).remove();
                $(PENDING_DIALOG).remove();
            }, 1000);
        }
    }

    function getImages(folder) {
        DOWNLOAD_COUNTER = 0;
        TOTAL_COUNTER = 0;
        $(SELECTOR_IMAGE).each(function (i, e) {
            let index = i;
            let IMAGE_LINK_URL = $(e).closest('a')[0].href;            
            let IMAGE_AMOUNT = 1;
            let IMAGE_AMOUNT_P = $(e).closest("a").find("div:first span")['prevObject'][0].innerText.split('R-18\n');
            
            if(IMAGE_AMOUNT_P.length == 2){
                IMAGE_AMOUNT = IMAGE_AMOUNT_P[1] * 1;
            }else if(IMAGE_AMOUNT_P.length == 1){
                if(IMAGE_AMOUNT_P[0] == "R-18"){
                    IMAGE_AMOUNT = 1;
                }else if(IMAGE_AMOUNT_P[0] == ""){
                    IMAGE_AMOUNT = 1;
                }else{
                    var r18g_filter = IMAGE_AMOUNT_P[0].split('R-18G\n');
                    if(r18g_filter.length == 2){
                        IMAGE_AMOUNT = r18g_filter[1] * 1;
                    }else if(r18g_filter.length == 1){
                        if(r18g_filter[0] == "R-18G"){
                            IMAGE_AMOUNT = 1;
                        }else if(r18g_filter[0] == ""){
                            IMAGE_AMOUNT = 1;
                        }else{
                            IMAGE_AMOUNT = IMAGE_AMOUNT_P[0] * 1;
                        }
                    }
                }
            }

            TOTAL_COUNTER += IMAGE_AMOUNT;

            updateDialog();

            $.get(IMAGE_LINK_URL, function (html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
                var preloadData = doc.querySelectorAll('meta#meta-preload-data')[0];

                let content = JSON.parse(preloadData.content);

                let IMAGE_ID = Object.keys(content.illust)[0];
                let IMAGE_URL = content.illust[IMAGE_ID].urls.original;
                let IMAGE_TYPE = content.illust[IMAGE_ID].urls.original.split(".").pop();
                let IMAGE_TITLE = content.illust[IMAGE_ID].title
                let IMAGE_DESCRIPTION = content.illust[IMAGE_ID].alt;
                let IMAGE_WEBSITE = content.illust[IMAGE_ID].extraData.meta.canonical;
                let IMAGE_TAGS = Object.values(content.illust[IMAGE_ID].tags.tags).map(item => item.tag);

                for (let i = 0; i <= (IMAGE_AMOUNT - 1); i++) {
                    ajaxStarted();
                    let DOWNLOAD_IMAGE_URL = IMAGE_URL.replace("p0", "p" + i);
                    console.log("prepare download: ", DOWNLOAD_IMAGE_URL)

                    let image = {
                        "url": DOWNLOAD_IMAGE_URL,
                        "name": IMAGE_TITLE,
                        "website": IMAGE_WEBSITE,
                        "annotation": IMAGE_DESCRIPTION,
                        "folderId": folder.id,
                        "headers": {
                            "referer": IMAGE_WEBSITE
                        }
                    };

                    if(SUPPORT_TAGS)
                    {
                        image.tags = IMAGE_TAGS;
                    }

                    DOWNLOAD_COUNTER++;
                    addImageToEagle(image);
                    console.log(index, $(SELECTOR_IMAGE).length - 1);
                    updateDialog();

                }
                if(index == $(SELECTOR_IMAGE).length - 1){
                    FINISH = true;
                }
                updateDialog();
            });
        });


    }

    var loaderTimerCounter = 0;
    var folderName;
    var folderData, folderLoader;

    console.log("Pixiv to Eagle")

    document.addEventListener('keydown', keydown);

    function keydown(e) {

        if (e.altKey && e.key === 'l') {      // ALT+L

            e.preventDefault();                 // prevent default action of key

            console.log("download initiated.");

            $("body").append(`<div id="save-to-eagle-dialog" style=" display: block; position: fixed; width: 400px;  height: 100px;margin-top:25px;margin-left:25px; text-align: left;font-size:1.5em;"><div id="queue">prepare to start ...</div></br><div id="download">Download Progress: `+requestsPending+`</div></div>`);

            if (location.href.indexOf("pixiv.") === -1) {
                alert("This script only works on pixiv.net.");
                return;
            }

            DOWNLOAD_COUNTER = 0;
            TOTAL_COUNTER = 0;
            FINISH = false;

            if(folderData==null){
                initFolder();
            }else{
                getImages(folderData);
            }
        }
    }

    function initFolder(){
        folderName = document.querySelector("h1") && document.querySelector("h1").innerText || "Pixiv";
        createFolder(folderName, function (err, folder) {
            if (folder) {
                folderData = folder;
                getImages(folderData);
            } else {
                alert("软件尚未打开，或当前软件版本不支持，需至 Eagle 官网下载，手动重新安装最新版本");
            }
        });
    }
})();