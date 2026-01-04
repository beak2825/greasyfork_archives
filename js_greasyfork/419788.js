// ==UserScript==
// @name                Save Gelbooru Images to Eagle
// @name:zh             导入Gelbooru图片到Eagle
// @name:zh-CN          导入Gelbooru图片到Eagle
// @description         Save images from Gelbooru to Eagle.
// @description:zh      在Gelbooru网页上添加下载按钮直接导入Eagle，仅处理post
// @description:zh-CN   在Gelbooru网页上添加下载按钮直接导入Eagle，仅处理post

// @namespace           https://github.com/miracleXL
// @homepageURL         https://github.com/miracleXL/scripts-for-Eagle
// @icon                https://gelbooru.com/favicon.ico
// @version             0.1.2

// @author              miracleXL
// @match               gelbooru.com/index.php?page=post&s=view&id=*
// @connect             gelbooru.com
// @connect             localhost
// @grant               GM_xmlhttpRequest
// @require             https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/419788/Save%20Gelbooru%20Images%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/419788/Save%20Gelbooru%20Images%20to%20Eagle.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 是否保存标签
    const saveTags = true;
    const saveMetadataTags = false;

    // Eagle API 服务器位置
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURL`;
    const EAGLE_IMPORT_API_URLS = `${EAGLE_SERVER_URL}/api/item/addFromURLs`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;
    const EAGLE_GET_FOLDERS_API_URL = `${EAGLE_SERVER_URL}/api/folder/list`;

    const BUTTON_POS = "scrollebox";

    function download(data){
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

    function addButton(buttons_div){
        buttons_div.append(" | ");
        let button = document.createElement("a");
        button.innerText = "Download to Eagle";
        button.href = "javascript:;";
        buttons_div.appendChild(button);
        //绑定下载事件
        button.addEventListener("click",async ()=>{
            let data = getImageData();
            console.log(data);
            download(data);
        })
    }

    addButton(document.getElementById(BUTTON_POS));

    function getImageData(){
        let tag_list = document.getElementById("tag-list");
        let url = $("li a:contains(Original image)", tag_list)[0];
        let source = $("li:contains(Source: )", tag_list)[0];
        let data = {
            "url": url.href,
            "name": document.title,
            "website": document.URL,
            "annotation": source?.textContent,
            "tags": [],
            "headers": {
                "referer" : document.URL
            }
        };
        if(saveTags){
            for(let tag of document.getElementsByClassName("tag-type-artist")){
                data.tags.push(tag.children[1].textContent);
            }
            for(let tag of document.getElementsByClassName("tag-type-character")){
                data.tags.push(tag.children[1].textContent);
            }
            if(saveMetadataTags){
                for(let tag of document.getElementsByClassName("tag-type-metadata")){
                    data.tags.push(tag.children[1].textContent);
                }
            }
            for(let tag of document.getElementsByClassName("tag-type-copyright")){
                data.tags.push(tag.children[1].textContent);
            }
            for(let tag of document.getElementsByClassName("tag-type-general")){
                data.tags.push(tag.children[1].textContent);
            };
        }
        return data;
    };
})();