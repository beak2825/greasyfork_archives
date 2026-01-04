// ==UserScript==
// @name         Twitch - Enable DVR for Live Stream
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-23
// @description  testing...
// @author       ぐらんぴ
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_xmlhttpRequest
// @connect      gql.twitch.tv
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545960/Twitch%20-%20Enable%20DVR%20for%20Live%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/545960/Twitch%20-%20Enable%20DVR%20for%20Live%20Stream.meta.js
// ==/UserScript==

const log = console.log;
let $S = el => document.querySelector(el), $SA = el => document.querySelectorAll(el), $C = el => document.createElement(el);
let channelName, m3u8Url, origVideo;

function isStreamPage(){
    if(location.href == "https://www.twitch.tv/directory") return;
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.length === 1;
}

function observeUrlChanges(){
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
        if(location.href !== lastUrl){
            lastUrl = location.href;
            checkPageChange();
        }
    });

    observer.observe(document.body, { subtree: true, childList: true, });

    window.addEventListener('hashchange', () => {
        if(location.href !== lastUrl){
            lastUrl = location.href;
            checkPageChange();
        }
    });
}
// ページ変更チェック
function checkPageChange(){
    if(isStreamPage()){
        if(!$S('#GRMP')) setOrigVideo()
        getM3u8()
    }
}
// 初期実行 & 監視開始
if(isStreamPage()){
    loadHlsJs(()=>{ setOrigVideo() });
}
observeUrlChanges();

///------------------------------------------------------------------------------///
///------------------------------------------------------------------------------///
///------------------------------------------------------------------------------///

function setOrigVideo(){
    const intervalId = setInterval(() => {
        console.log('1, setOrigVideo')
        let v = $S('video')
        if(!v) return;
        clearInterval(intervalId);

        v.pause(); v.src = ""; v.load();
        $S('[data-a-target="video-ref"]').remove()

        origVideo = $C('video');
        origVideo.id = "GRMP";
        origVideo.controls = true;
        origVideo.style.width = "100%";
        origVideo.style.height = "100%";
        $S('[data-test-selector="video-player__video-container"]').appendChild(origVideo)
        setTimeout(()=>{ getM3u8() },1000)
    },500);
}
function getM3u8(){
    console.log('3, getM3u8')
    channelName = location.pathname.slice(1).toLowerCase();

    const query = {
        "operationName": "PlaybackAccessToken",
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"
            }
        },
        "variables": {
            "isLive": true,
            "login": "",
            "isVod": false,
            "vodID": "",
            "playerType": "site"
        }
    };

    query.variables.login = channelName;

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://gql.twitch.tv/gql",
        headers: {
            "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(query),
        onload: function(response){
            const data = JSON.parse(response.responseText);
            const token = data.data.streamPlaybackAccessToken;
            if(token){
                m3u8Url = `https://usher.ttvnw.net/api/channel/hls/${channelName}.m3u8?client_id=${token.signature}&token=${encodeURIComponent(token.value)}&sig=${token.signature}&allow_source=true`;

                if(typeof Hls !== 'undefined' && Hls.isSupported()){
                    const hls = new Hls();

                    hls.loadSource(m3u8Url);
                    hls.attachMedia(origVideo);

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        //console.log('HLS manifest parsed successfully');
                        origVideo.play().catch(err => {
                            console.error('Playback failed:', err.message);
                            setTimeout(()=>{
                                origVideo.load(); origVideo.play();
                            },2000)
                        });
                    });

                }else if (origVideo.canPlayType('application/vnd.apple.mpegurl')){
                    origVideo.src = m3u8Url;
                    origVideo.play().catch(err => console.error('Playback failed:', err));
                }else{
                    console.log('HLS is not supported in this browser');
                }
            }else{
                console.error('Token not found');
            }
        },
        onerror: function(error){
            console.error('Request failed', error);
        }
    });
}
function loadHlsJs(callback){
    if(unsafeWindow.Hls){
        callback();
        return;
    }
    console.log('2, loadHlsJs')
    const script = $C('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    document.head.appendChild(script);
}

//Pop-up remover
const origFetch = unsafeWindow.fetch;
unsafeWindow.fetch = async function(url, init) {
    let res = await origFetch(url, init);
    let data;
    if(res.status === 204 || res.status === 205) return res;

    try{
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
    }catch(err){//log('Failed to parse JSON:', err);
        return res;
    }

    try{ if(url.startsWith('https://edge.ads.twitch.tv/ads')) data = '' }
    catch(err){//log('err modifying data:', err);
    }

    return new Response(JSON.stringify(data), {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
    });
};