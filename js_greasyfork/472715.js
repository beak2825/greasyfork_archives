// ==UserScript==
// @name         downcode
// @namespace    http://tampermonkey.net/C
// @version      0.1
// @description  downcode!
// @author       You
// @match        https://secondhand.ricacorp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ricacorp.com
// @grant        none
// @license    GPL
// @downloadURL https://update.greasyfork.org/scripts/472715/downcode.user.js
// @updateURL https://update.greasyfork.org/scripts/472715/downcode.meta.js
// ==/UserScript==
(function (console) {
    console.save = function (data, filename) {
        let MIME_TYPE = "text/json";
        if (!data) return;
        if (!filename) filename = "console.json";
        if (typeof data === "object") data = JSON.stringify(data, null, 4);

        let blob = new Blob([data], { tyoe: MIME_TYPE });
        // 创建事件
        let e = document.createEvent("MouseEvent");
        // 创建一个a链接
        let a = document.createElement("a");
        // 设置a链接下载文件的名称
        a.download = filename;
        // 创建下载的URL对象（blob或者file）
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(":");
        // 初始化事件
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // 触发事件
        a.dispatchEvent(e);
    }
})(console)

function autoCnt(offx,limx,name){
    //let uid="rc.055911";
    //let usrid= window.localStorage.getItem("rcSecondhandLoggedInUserName");
    //if(usrid!=uid) return;
    let hst=`https://${location.hostname}/`;
    let nx=2650;let cp=0;let np=0;let allcm=false;

    let url = `${hst}rcAPI/rcPost/?postNo=&ownershipId=&addressId=&locationId=&postId=&agreementType=&searchText=&isPublished=true&postStatus=3&language=HK&postTags=&priceFrom=&priceTo=&saleableAreaFrom=&saleableAreaTo=&roomFrom=&roomTo=&listingNos=&agreementDateFrom=&agreementDateTo=&preferenceAddressIds=&orderBy=datePost desc&offset=${offx}&limit=${limx}&fields=&isUnderlying=false&userIds=&postModifoedDateFrom=&postCreatedDateFrom=&postCreatedDateTo=&postDateFrom=&postDateTo=&advertisement=0&isExactlyMatch=false&postCommentUserIds=&isPublic=false`;
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(out=>console.save(out,name));
}
(function() {
    'use strict';
    console.log("start");
    window.addEventListener("keydown", function (event) {
        if (event.altKey && (event.key == "s" || event.key == "S")) {
            console.log("startCnt");
            //alert("startCnt");
            autoCnt(0,650,"data1.json");
            autoCnt(650,650,"data2.json");
            autoCnt(1300,650,"data3.json");
            autoCnt(1950,650,"data4.json");
        }
    });

})();