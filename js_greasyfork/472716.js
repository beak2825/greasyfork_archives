// ==UserScript==
// @name         autoComment
// @namespace    http://tampermonkey.net/C
// @version      0.1
// @description  auto!
// @author       You
// @match        https://secondhand.ricacorp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ricacorp.com
// @grant        none
// @license    GPL
// @downloadURL https://update.greasyfork.org/scripts/472716/autoComment.user.js
// @updateURL https://update.greasyfork.org/scripts/472716/autoComment.meta.js
// ==/UserScript==
function autoCnt(){
    let cmtx=`🏠真盤源🏠最貼最緊💥一條龍服務
☎️歡迎致電或Whatsapp ２４小時查詢☎️
✅按揭壓測查詢
✅銀行估價
✅法律咨詢
✅水電煤轉名
✅售後放租
✅各區一二手樓盤介紹及接送

專營中九龍區👇🏻
🏠九龍灣（淘大、德福、得寶花園）
🏠藍田（匯景、麗港城）
🏠觀塘（凱匯、觀月樺峯）
🏠油塘（曦臺、嘉賢居、海傲灣、鯉灣天下、ＰＥ）
🏠鑽石山（星河明居、龍蟠苑）
🏠彩虹牛池灣（峻弦、曉暉花園）
🏠黃大仙（現崇山、新光、豪苑）
🏠啟德
🏠九龍城及土瓜灣一帶

另各區樓盤不能盡錄
☎️PEN 林　２４小時查詢
`;
    //let txx="🏠真盤源🏠最貼最緊💥一條龍服務\n☎️歡迎致電或Whatsapp ２４小時查詢☎️\n✅按揭壓測查詢\n✅銀行估價\n✅法律咨詢\n✅水電煤轉名\n✅售後放租\n✅各區一二手樓盤介紹及接送\n\n專營中九龍區👇🏻\n🏠九龍灣（淘大、德福、得寶花園）\n🏠藍田（匯景、麗港城）\n🏠觀塘（凱匯、觀月樺峯）\n🏠油塘（曦臺、嘉賢居、海傲灣、鯉灣天下、ＰＥ）\n🏠鑽石山（星河明居、龍蟠苑）\n🏠彩虹牛池灣（峻弦、曉暉花園）\n🏠黃大仙（現崇山、新光、豪苑）\n🏠啟德\n🏠九龍城及土瓜灣一帶\n\n另各區樓盤不能盡錄\n☎️PEN 林　２４小時查詢";
    let usrid="rc.055911";
    let offx=0;
    let limx=50;
    //let uid= window.localStorage.getItem("rcSecondhandLoggedInUserName");
    //if(usrid!=uid) return;
    let hst=`https://${location.hostname}/`;
    let nx=2650;let cp=0;let np=0;let allcm=false;

    let url = `${hst}rcAPI/rcPost/?postNo=&ownershipId=&addressId=&locationId=&postId=&agreementType=&searchText=&isPublished=true&postStatus=3&language=HK&postTags=&priceFrom=&priceTo=&saleableAreaFrom=&saleableAreaTo=&roomFrom=&roomTo=&listingNos=&agreementDateFrom=&agreementDateTo=&preferenceAddressIds=&orderBy=datePost desc&offset=${offx}&limit=${limx}&fields=&isUnderlying=false&userIds=&postModifoedDateFrom=&postCreatedDateFrom=&postCreatedDateTo=&postDateFrom=&postDateTo=&advertisement=0&isExactlyMatch=false&postCommentUserIds=&isPublic=false`;
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(out =>
              out.results.forEach(item => {
        if(!allcm && item.postCommentUserIds.includes(usrid)){
            cp+=1;
            console.log(`${item.displayText}${item.floor}樓${item.flat}室已打評語,編號:${item.postNo}`);
            return;
        }
        let logx=`${item.displayText}${item.floor}樓${item.flat}室未打評語，打評語中,編號:${item.postNo}`;
        console.log(logx);np+=1;
        let datax={"language":"HK","comment":cmtx,"agreementId":item.postId};
        let urlx=`${hst}rcAPI/rcPostComment/`;
        fetch(urlx, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datax)
        }).then(res => {
            console.log(`${item.displayText}${item.floor}樓${item.flat}室打評語成功,編號:${item.postNo}`);
        });
    }))
        .then(res => {
        console.log(`${cp}個盤已打評語，補打評語${np}個盤，現在共${cp+np}個盤已打評語`);
       // alert(`${cp}個盤已打評語，補打評語${np}個盤，現在共${cp+np}個盤已打評語`);
    });
}
(function() {
    'use strict';
    console.log("start");
    window.addEventListener("keydown", function (event) {
        if (event.altKey && (event.key == "q" || event.key == "Q")) {
            console.log("startCnt");
            //alert("startCnt");
            autoCnt();
        }
    });

    window.setInterval(function(){
        //var refreshHours = new Date().getHours();
        var refreshMin = new Date().getMinutes();
        var refreshSec = new Date().getSeconds();
        if(refreshMin=='23' && refreshSec=='36'){
            autoCnt();
        }
    }, 1000);

})();