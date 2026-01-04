// ==UserScript==
// @name                Save yande.re Images to Eagle
// @name:zh             导入yande.re图片到Eagle
// @name:zh-CN          导入yande.re图片到Eagle
// @description         Save images from yande.re to Eagle.
// @description:zh      在yande.re网页上添加下载按钮直接导入Eagle，仅实现post，未处理pool
// @description:zh-CN   在yande.re网页上添加下载按钮直接导入Eagle，仅实现post，未处理pool

// @namespace           https://github.com/miracleXL
// @homepageURL         https://github.com/miracleXL/scripts-for-Eagle
// @icon                https://yande.re/favicon.ico
// @version             0.1.3

// @author              miracleXL
// @match               yande.re/post/show/*
// @match               yande.re/pool/show/*
// @connect             yande.re
// @connect             localhost
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419790/Save%20yandere%20Images%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/419790/Save%20yandere%20Images%20to%20Eagle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Eagle API 服务器位置
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURL`;
    const EAGLE_IMPORT_API_URLS = `${EAGLE_SERVER_URL}/api/item/addFromURLs`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;
    const EAGLE_GET_FOLDERS_API_URL = `${EAGLE_SERVER_URL}/api/folder/list`;

    // 是否保存标签
    const saveTags = true;

    let mode = document.URL.split("/")[3];

    function addButton(){
        if(mode == "post"){
            let button = document.createElement("a");
            button.innerText = "下载";
            button.href = "javascript:;";
            let buttons_div = document.getElementsByClassName("js-posts-show-comments-tab")[0].parentNode;
            buttons_div.append(" | ");
            buttons_div.appendChild(button);
            //绑定下载事件
            button.addEventListener("click",async ()=>{
                let [data,pool] = getImageData();
                if(pool){
                    let folderId = await getFolderId(pool);
                    if(folderId){
                        data.folderId = folderId;
                    }
                }
                download(data);
            })
        }
        else{

        }
    }

    addButton();

    function download(data){
        // console.log(data);
        GM_xmlhttpRequest({
            url: EAGLE_IMPORT_API_URL,
            method: "POST",
            data: JSON.stringify(data),
            onload: function(response) {
                if(response.statusText !== "OK"){
                    console.log(response);
                    alert("下载失败！")
                }
            }
        });
    }

    function getImageData(){
        let pool = document.getElementsByClassName("status-notice");
        pool = pool[pool.length-1];
        let poolName;
        if(pool && pool.id.startsWith("pool")){
            try{
                poolName = pool.querySelector("p").children[3].textContent;
            }
            catch(e){
                console.log("获取pool名失败！");
                console.log(e);
            }
        }
        let url = document.getElementById("highres");
        let data = {
            "url": url.href,
            "name": document.title,
            "website": document.URL,
            "tags": [],
            "headers": {
                "referer" : document.URL
            }
        };
        if(saveTags){
            for(let tag of document.getElementsByClassName("tag-type-artist")){
                data.tags.push(tag.children[1].textContent);
            }
            for(let tag of document.getElementsByClassName("tag-type-copyright")){
                data.tags.push(tag.children[1].textContent);
            }
            for(let tag of document.getElementsByClassName("tag-type-general")){
                data.tags.push(tag.children[1].textContent);
            };
        }
        return [data,poolName];
    };

    // 获取文件夹id
    async function getFolderId(pool){
        let folders = await getFolders();
        let dlFolder;
        if(folders){
            for(let folder of folders){
                if(folder.name === pool){
                    dlFolder = folder;
                }
            }
            if(dlFolder === undefined) dlFolder = await creatFolder(pool);
        }
        else{
            console.log("获取文件夹信息失败！");
            alert("下载失败！");
            return;
        }
        return dlFolder.id;
    }

    // 获取文件夹
    function getFolders(){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: EAGLE_GET_FOLDERS_API_URL,
                method: "GET",
                redirect:'follow',
                onload: function(response) {
                    if(response.status !== 200){
                        reject();
                    }
                    resolve(JSON.parse(response.response).data);
                }
            });
        })
    }

    // 创建文件夹
    function creatFolder(folderName){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: EAGLE_CREATE_FOLDER_API_URL,
                method: "POST",
                data: JSON.stringify({ folderName: folderName }),
                onload: function(response) {
                    var result = JSON.parse(response.response);
                    if (result.status === "success" && result.data && result.data.id) {
                        return resolve(result.data);
                    }
                    else{
                        console.log("文件夹创建失败！")
                        return reject();
                    }
                }
            })
        })
    }

})();