// ==UserScript==
// @name         Save NHentai images to Eagle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  go to the manga selection page and then just right click and then save. Happy fapping! (VPN required)
// @author       GreasyWeebs
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       context-menu
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431188/Save%20NHentai%20images%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/431188/Save%20NHentai%20images%20to%20Eagle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURL`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;

    const SELECTOR_IMAGE = ".gallery a";
    const SELECTOR_HIGHRES = ".thumb-container noscript img";
    var imgElements = Array.from(document.querySelectorAll(SELECTOR_IMAGE));
    var galleryElements = Array.from(document.querySelectorAll('.gallery'));
    var galleryCount = galleryElements.length;
    var count = 0;

    var createFolder = function(folderName, callback) {
        GM_xmlhttpRequest({
            url: EAGLE_CREATE_FOLDER_API_URL,
            method: "POST",
            data: JSON.stringify({ folderName: folderName }),
            onload: function(response) {
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
            }
        });
    }

    function saveImages(folder, title, imgCount, hiresImgID, tagsData, imgLinkSource){
        for(var i=0;i<imgCount;i++){
            var saveData = {
                "url": "https://i.nhentai.net/galleries/"+hiresImgID+"/"+(i+1)+".jpg",
                "name": 'page '+(i+1),
                "website": imgLinkSource,
                "folderId": folder.id,
                "tags": tagsData,
                "headers": {
                     "referer": "nhentai.net"
                }
            };
            addImageToEagle(saveData);
        }
    }

    var fetchImg = setInterval(function(){
        $.get(imgElements[count].href, function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var preloadData = Array.from(doc.querySelectorAll('.thumb-container'));
            var imgCount = preloadData.length;
            var titleRaw = Array.from(doc.querySelectorAll('.title'));
            var title = titleRaw[0].querySelector('.title .before').innerHTML+" "+titleRaw[0].querySelector('.title .pretty').innerHTML+" "+titleRaw[0].querySelector('.title .after').innerHTML;
            var hiresImg = Array.from(doc.querySelectorAll(SELECTOR_HIGHRES));
            var hiresImgSplit1 = hiresImg[0].src.split("https://t.nhentai.net/galleries/");
            var hiresImgSplit2 = hiresImgSplit1[1].split("/1t");
            var hiresImgID = hiresImgSplit2[0];
            var tags = Array.from(doc.querySelectorAll('.tag-container .tags a .name'));
            var imgLinkSource = imgElements[count].href;
            var tagsData = [];
            for(var i=0;i<tags.length-1;i++){
                tagsData[i] = tags[i].innerHTML;
            }
            createFolder(title, function (err, folder) {
            if (folder) {
                saveImages(folder, title, imgCount, hiresImgID, tagsData, imgLinkSource);
            } else {
                alert("folder is not exist");
            }
        });
        });
        count++;
        if(count==galleryCount){
            clearInterval(fetchImg);
        }
    }, 1000);
})();