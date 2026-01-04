// ==UserScript==

// @name               YouTube Button As Add Notify Video To WL
// @name:zh-TW         YouTube 訂閱通知影片加入稍後觀看清單按鈕
// @name:zh-CN         YouTube 订阅通知影片加入稍后观看清单按钮
// @name:ja            YouTube 登録通知ビデオを後で見るボタンに追加
// @description        Add button that join Video to watch later playlist from notify.
// @description:zh-TW  增加可將通知影片加入稍後觀看清單的按鈕。
// @description:zh-CN  添加可将通知视频加入稍后观看清单的按钮。
// @description:ja     通知から後でプレイリストを視聴するビデオに参加するボタンを追加します。
// @copyright          2023, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license            Copyright HrJasn
// @icon               https://www.google.com/s2/favicons?domain=www.youtube.com
// @homepageURL        https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @supportURL         https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @version            1.6
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @grant              none
// @match              http*://www.youtube.com/*
// @exclude            http*://www.google.com/*

// @downloadURL https://update.greasyfork.org/scripts/478696/YouTube%20Button%20As%20Add%20Notify%20Video%20To%20WL.user.js
// @updateURL https://update.greasyfork.org/scripts/478696/YouTube%20Button%20As%20Add%20Notify%20Video%20To%20WL.meta.js
// ==/UserScript==

(() => {
    console.log('YouTube Button As Add Notify Video To WL is loading.');
    let YBAANVTWobserver;
    YBAANVTWobserver = new MutationObserver( (mutations) => {
        mutations.forEach((adNds)=>{
            adNds.addedNodes.forEach((adNde)=>{
                if( (adNde) && (adNde.querySelector) && (adNde.querySelector('ytd-notification-renderer button[aria-label]')) ){
                    let ynrbe = adNde.querySelector('ytd-notification-renderer button[aria-label]');
                    if( (ynrbe) && (ynrbe.parentNode) && !(ynrbe.parentNode.querySelector('button[name="addtowl"]')) ){
                        ynrbe.parentNode.insertAdjacentHTML("beforeend",`
                                <button id="button" class="style-scope yt-icon-button" name="addtowl">
                                  <div style="width: 100%; height: 100%; fill: currentcolor;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;color: white;">
                                              <path d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"></path>
                                    </svg>
                                  </div>
                                </button>`);
                        let awlbe = ynrbe.parentNode.querySelector('button[name="addtowl"]');
                        if(awlbe){
                            console.log('YouTube Button As Add Notify Video To WL is loaded.');
                            awlbe.addEventListener('click', async (evnt)=>{
                                evnt.preventDefault();
                                evnt.stopPropagation();
                                evnt.stopImmediatePropagation();
                                let evne = evnt.target;
                                console.log(evne);
                                let tgVideoId = null;
                                try{
                                    tgVideoId = evne.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('a[href *= "/watch?v="]').href.match(/watch\?v=([^=&\?]+)&?/)[1];
                                }catch(err){
                                    try{
                                        tgVideoId = evne.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('a[href *= "/shorts/"]').href.match(/shorts\/([^\/\?]+)\/?/)[1];
                                    }catch(err2){
                                        console.log(err2);
                                    };
                                    console.log(err);
                                };
                                if(tgVideoId){
                                    let ytactsjson = null;
                                    let evnesp = evne.querySelector('svg path');
                                    if(evnesp.getAttribute('d') == 'M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z'){
                                        ytactsjson = [{
                                            "action": "ACTION_ADD_VIDEO",
                                            "addedVideoId": tgVideoId
                                        }];
                                    } else if(evnesp.getAttribute('d') == 'M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z'){
                                        ytactsjson = [{
                                            "action": "ACTION_REMOVE_VIDEO_BY_VIDEO_ID",
                                            "removedVideoId": tgVideoId
                                        }];
                                    };
                                    if(ytactsjson){
                                        let res = await fetchYTAddVideoAPI(ytactsjson,'WL');
                                        console.log(res);
                                        if(res.status === 200){
                                            evnesp.setAttribute('d', 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z');
                                            if(ytactsjson[0].action == "ACTION_ADD_VIDEO"){
                                                evnesp.setAttribute('d', 'M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z');
                                            } else if(ytactsjson[0].action == "ACTION_REMOVE_VIDEO_BY_VIDEO_ID"){
                                                evnesp.setAttribute('d', 'M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z');
                                            };
                                        } else {
                                            evnesp.setAttribute('d', 'M 12 2 C 6.5 2 2 6.5 2 12 s 4.5 10 10 10 s 10 -4.5 10 -10 S 17.5 2 12 2 z M 9 12 l -4 -4 L 8 5 l 4 4 L 16 5 l 3 3 l -4 4 L 19 16 L 16 19 L 12 15 L 8 19 L 5 16 z');
                                            setTimeout(()=>{
                                                evnesp.setAttribute('d', 'M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z');
                                            },3000);
                                        };
                                    }
                                };
                                async function getSApiSidHash(SAPISID, origin) {
                                    function sha1(str) {
                                        return window.crypto.subtle
                                            .digest("SHA-1", new TextEncoder().encode(str))
                                            .then((buf) => {
                                            return Array.prototype.map
                                                .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
                                                .join("")
                                        });
                                    };
                                    const TIMESTAMP_MS = Date.now();
                                    const digest = await sha1(`${TIMESTAMP_MS} ${SAPISID} ${origin}`);
                                    return `${TIMESTAMP_MS}_${digest}`;
                                };
                                async function fetchYTAddVideoAPI(actions,playlistId){
                                    return fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key=" + ytcfg.data_.INNERTUBE_API_KEY + "&prettyPrint=false", {
                                        "headers": {
                                            "accept": "*/*",
                                            "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
                                            "content-type": "application/json"
                                        },
                                        "body": JSON.stringify({
                                            "context": {
                                                "client": {
                                                    clientName: "WEB",
                                                    clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION
                                                }
                                            },
                                            "actions": actions,
                                            "playlistId": "WL"
                                        }),
                                        "method": "POST"
                                    });
                                };

                            });
                        };
                    };
                };
            });
        });
    });
    YBAANVTWobserver.observe(document, {attributes:true, childList:true, subtree:true});
})();
