// ==UserScript==
// @name         fanxing-m3u8-live
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      0.52.0
// @description  酷狗繁星HLS提取
// @author       zwb83925462
// @license      CC
// @match        https://fanxing*.kugou.com/1*
// @match        https://fanxing*.kugou.com/2*
// @match        https://fanxing*.kugou.com/3*
// @match        https://fanxing*.kugou.com/4*
// @match        https://fanxing*.kugou.com/5*
// @match        https://fanxing*.kugou.com/6*
// @match        https://fanxing*.kugou.com/7*
// @match        https://fanxing*.kugou.com/8*
// @match        https://fanxing*.kugou.com/9*
// @match        https://fanxing*.kugou.com/channel/*
// @icon         https://fanxing.kugou.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441657/fanxing-m3u8-live.user.js
// @updateURL https://update.greasyfork.org/scripts/441657/fanxing-m3u8-live.meta.js
// ==/UserScript==

function fxapi(rid){
    let fxurl = `https://fx1.service.kugou.com/video/mo/live/pull/h5/v3/streamaddr`;
    fxurl += `?roomId=${rid}`;
    fxurl += `&streamType=2-3-5-6&liveType=1-2-5`;
    fxurl += `&platform=12&version=1000&ch=fx&ua=fx-mobile-h5&kugouId=0&layout=1&appid=2815`;
    return fxurl;
}

function loop(){
    let rid=0;
    if (location.pathname.indexOf("channel")>0){
        rid=liveInitData?.liveStarRoomId;
    } else {
        rid=liveInitData?.roomId;
    }
    let link = document.createElement("a");
    link.id="m3u8";
    link.style="position:fixed;top:10%;left:0";
    link.style.display = "block";
    link.style.color = "#23ade5";
    link.textContent=liveInitData?.liveName;
    var container = document?.body;
    if ( liveInitData?.liveStatus == undefined ){
        setTimeout(loop,1500);
    } else if (location.pathname.indexOf("channel")<0){
        console.log("RoomID="+rid);
        /*
        let pathname = `https://fx1.service.kugou.com/video/pc/live/pull/mutiline/streamaddr`;
        let fxurl = pathname + `?std_plat=12&std_imei=bf0935a5-6cbe-413a-f3ec-5f1ce7910a48`;
        fxurl += `&streamType=2-3-5-6&ua=fx-mobile-h5&targetLiveTypes=1-2-5`;
        fxurl += `&std_rid=${rid}&version=1000&supportEncryptMode=1&appid=1010`;
        // mfx需要改变浏览器UA为手机,即需要手机浏览器.
        let mfx = `https://mfanxing.kugou.com/staticPub/rmobile/sharePage/normalRoom/views/index.html?roomId=${rid}`;
        */
        let fxurl = fxapi(rid);
        if ( liveInitData?.liveStatus > 0 ){
            fetch(fxurl).then(response => response.json())
            .then(result => {
                console.log('success:',result?.data);
                var fxdata=result?.data;
                var fxhv=fxdata?.horizontal?.length>0 ? fxdata?.horizontal[0] : fxdata?.vertical[0];
                var linezero=fxhv?.httpshls[0];
                link.href=linezero;
            });
        }else{
            link.textContent=liveInitData?.liveStatus;
            link.href=liveInitData?.httpflv[0].replace(".flv",".m3u8");
        }
        container.append(link);
    } else if (location.pathname.indexOf("channel")>0){
        console.log("RoomID="+rid);
        var url="https://fx1.service.kugou.com/video/pc/live/pull/mutiline/streamaddr?std_rid=";
        url=url.concat(rid);
        url=url.concat("&version=1.0&streamType=2-3-5-6&targetLiveTypes=1-2-3-5-6&ua=fx-h5");
        if ( liveInitData?.channelRoomInfo?.roomType > 0 ){
            fetch(url).then(response => response.json())
            .then(result => {
                console.log('success:',result);
                var fxdatalist=result?.data?.lines[0]?.streamProfiles[0];
                var linezero=fxdatalist?.httpsHls[0];
                link.href=linezero;
                link.textContent=fxdatalist?.streamName;
            });
        }else{
            link.textContent="未开播";
            link.href="#";
        }
        container.append(link);
    }
}
loop();