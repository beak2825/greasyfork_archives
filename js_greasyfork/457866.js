// ==UserScript==
// @name         Douyin_Kuaishou_Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download douyin and kuaishou video without watermark
// @author       gu0o00
// @include      https://www.douyin.com/*
// @include      https://video.kuaishou.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/457866/Douyin_Kuaishou_Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/457866/Douyin_Kuaishou_Downloader.meta.js
// ==/UserScript==

const MobileUA =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";

function main() {
    const currUrl = location.href;
    if (currUrl.indexOf("kuaishou") != -1){
        solveKuaishou();
    }
    else if(currUrl.indexOf("douyin") != -1){
        solveDouyin();
    }
}
function solveKuaishou(){
    console.log("ks");
    const match = location.href.match(/featured\/(\w*)/);
    const id = match[1];

    if (!id) return;

    var json = {"operationName":"visionVideoDetail","variables":{"photoId":id,"page":"selected"},
                "query":"query visionVideoDetail($photoId: String, $type: String, $page: String) {  visionVideoDetail(photoId: $photoId, type: $type, page: $page) { status type author { id name headerUrl} photo { id caption coverUrl photoUrl }}}"};
    //console.log("-->" + JSON.stringify(json));
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://video.kuaishou.com/graphql",
        data:JSON.stringify(json),
        headers: {"content-type": "application/json"},
        onload: function(response){
            //console.log("请求成功");
            var resp = response.responseText;
            //console.log("-->" + resp);
            var obj = JSON.parse(resp);
            var downUrl = obj.data.visionVideoDetail.photo.photoUrl;
            console.log("downUrl:" + downUrl);
            var file = obj.data.visionVideoDetail.photo.caption.replace("\n","").trim() + ".mp4"
            addDownloadButton(downUrl,file);
        },
        onerror: function(response){
            console.log("请求失败");
        }
    });
    return;
}
function solveDouyin(){
    console.log("douyin");
    const match = location.href.match(/share\/video\/(\d*)/);
    const id = match[1];

    if (!id) return;

    fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + id)
        .then((res) => res.json())
        .then((json) => {
        console.log("[DouyinDownloader]", json);
        const info = json.item_list[0];
        const url = info.video.play_addr.url_list[0].replace("playwm", "play");
        const file = (info.desc || id) + ".mp4";
        addDownloadButton(url, file);
    });
}
function addDownloadButton(url, file) {

    const buttonEl = document.createElement("button");
    buttonEl.textContent = "Download";
    document.body.appendChild(buttonEl);

    buttonEl.style.position = 'fixed'
    buttonEl.style.zIndex = '10000'
    buttonEl.style.top = '0'
    buttonEl.style.left = '0'
    buttonEl.style.width = '100%'
    buttonEl.style.height = '60px'

    buttonEl.addEventListener("click", () => {
        GM_download({
            url: url,
            headers: {
                "user-agent": MobileUA,
            },
            name: file,
        });
    });
}

main();

