// ==UserScript==
// @name         TikTok Live Heartbeat
// @namespace    https://tiktakgames.com.tr/
// @version      1.2.5
// @description  Script to send heartbeat to TikTok live streams to keep them alive
// @author       TikTakGames
// @match        https://www.tiktok.com/*/live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490216/TikTok%20Live%20Heartbeat.user.js
// @updateURL https://update.greasyfork.org/scripts/490216/TikTok%20Live%20Heartbeat.meta.js
// ==/UserScript==


(function () {
    'use strict';  

 

    // url hask #tiktakgames|550e8400-e29b-41d4-a716-446655440000|f005d178-94f8-4091-bf48-0cee83bbf39f gibi olmalı. tag|ACCOUNT_UUID|GAME_UUID
    const urlHash = window.location.hash;

    if(!urlHash) return;
    // eğer hash #tiktakgames ile başlamıyorsa return
    if(!urlHash.startsWith("#tiktakgames")) return;
    const hashParts = urlHash.split('|');
    if(hashParts.length < 3) return;
    
    const TAG = hashParts[0];
    const ACCOUNT_UUID = hashParts[1];
    const GAME_UUID = hashParts[2];

    // tarayıcnın userAgent'ini alıyoruz.
    const USER_AGENT = navigator.userAgent; 
    const BASE_URL = window.location.href; 







    const translates = {
        "title_running": {
            "tr": "Çalışıyor. Yayın boyunca bu sayfayı böylece açık tutun. Daha az kaynak tüketimi için video akışı durdurulmuş olacaktır.",
            "en": "Running. Keep this page open throughout the broadcast. Video streaming is stopped for less resource consumption."
        },
        "title_stopped": {
            "tr": "Durduruldu. Artık sayfayı kapatabilirsiniz. Yayını tekrar başlattığınızdan yeni bir pencere açmanız gerekecektir.",
            "en": "Stopped. You can close the page now. You will need to open a new window when you start the broadcast again."
        },
        "heartbeat_sending": {
            "tr": "Bilgi gönderiliyor...",
            "en": "Sending heartbeat..."
        },
        "heartbeat_sent": {
            "tr": "Bilgi gönderildi!",
            "en": "Heartbeat sent!"
        },
        "heartbeat_not_sent": {
            "tr": "Bilgi gönderilemedi!",
            "en": "Heartbeat not sent!"
        },
        "live_ended": {
            "tr": "Yayın bitti!",
            "en": "Live stream ended!"
        }, 
        "video_muted": {
            "tr": "Video susturuldu!",
            "en": "Video muted!"
        },
        "audio_muted": {
            "tr": "Ses susturuldu!",
            "en": "Audio muted!"
        },
        "started" : {
            "tr": "TikTok Live Heartbeat başladı!",
            "en": "TikTok Live Heartbeat started!"
        },
        "native_functions_backing_up": {
            "tr": "Native XMLHttpRequest.open, WebSocket ve Response.json fonksiyonları yedekleniyor...",
            "en": "Native XMLHttpRequest.open, WebSocket and Response.json functions are backing up..."
        },
        "overriding_native_functions": {
            "tr": "Native XMLHttpRequest.open, WebSocket ve Response.json fonksiyonları değiştiriliyor...",
            "en": "Native XMLHttpRequest.open, WebSocket and Response.json functions are being overridden..."
        },
        "websocket_closed": {
            "tr": "WebSocket kapandı!",
            "en": "WebSocket closed!"
        },
        "detecting_room_info": {
            "tr": "Oda bilgisi tespit ediliyor...",
            "en": "Detecting room info..."
        },
        "room_id_not_found": {
            "tr": "Oda ID bulunamadı!",
            "en": "Room ID not found!"
        },
        "room_id_detected": {
            "tr": "Oda ID tespit edildi!",
            "en": "Room ID detected!"
        },
        "user_id_not_found": {
            "tr": "Kullanıcı ID bulunamadı! Muhtemelen TikTok'a giriş yapmadınız.",
            "en": "User ID not found! You probably didn't log in to TikTok."
        },
        "user_id_detected": {
            "tr": "Kullanıcı ID tespit edildi!",
            "en": "User ID detected!"
        },
    };
    const getTranslate = (key) => {
        let lang = (window.navigator.language || "en").substr(0, 2);
        return translates[key][lang] || translates[key]["en"];
    }






    const createDashboard = () => {
        const HTML = `<div id="tiktak-games-dashboard">
            <div id="tiktak-games-wrapper"> 
                <div id="tiktak-games-header"> 
                    Yayın boyunca bu sayfayı böylece açık tutun. Keep this page open throughout the broadcast. 
                </div> 
                <div id="tiktak-games-log-container">
                    <div style="font-size:30px; text-align:center;opacity:.5; padding:8px;">TikTakGames. Interactive Game Platform</div>
                </div> 
            </div> 
        </div>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap" rel="stylesheet">
        `
        const CSS = `
            #tiktak-games-dashboard {
                position: fixed;
                left: 0px;
                top: 0px;
                right: 0px;
                bottom: 0px;
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                /* backdrop filter */
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px); 
                pointer-events: none; 
                background-color: rgba(255, 255, 255, 0.3);
            }
            
            #tiktak-games-dashboard * {
                font-family: "Ubuntu Mono", monospace !important;
            }
            
            #tiktak-games-wrapper {
                background-color: rgba(0, 0, 0, 0.9);
                width: 80%;
                height: 80%;
                border-radius: 14px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: auto; 
                background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2My42NyA2NC4yNiIgeG1sbnM6dj0iaHR0cHM6Ly92ZWN0YS5pby9uYW5vIj48ZGVmcz48Y2xpcFBhdGggaWQ9IkEiPjxwYXRoIGQ9Ik0wIDBoNjMuNjd2NjQuMjZIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNBKSIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNTguMDcgNTQuNjJoLTIuMTZjMC0uMi0uMDctLjM3LS4yMS0uNTFzLS4zMS0uMjEtLjUxLS4yMWgtMy42MmMtLjE0IDAtLjI3LjA0LS4zOS4xMXMtLjIxLjE3LS4yNi4zYS43My43MyAwIDAgMC0uMDYuMy43NS43NSAwIDAgMCAuMDUuMjZjLjA5LjIuMy4zLjY2LjNoLjkxdjIuMTdoLS45MWMtLjY2IDAtMS4yMS0uMTUtMS42Ni0uNDQtLjQ1LS4zLS43OC0uNjgtLjk5LTEuMTYtLjE1LS4zNy0uMjItLjc1LS4yMi0xLjE0cy4wOS0uNzUuMjMtMS4xMWEyLjc3IDIuNzcgMCAwIDEgMS4wNS0xLjI5Yy40OC0uMzIgMS4wMS0uNDcgMS41OC0uNDVoMy42MmEyLjcxIDIuNzEgMCAwIDEgMi4wMy44NSAyLjc0IDIuNzQgMCAwIDEgLjg1IDIuMDNtLTkuMzcgMy4yNmgyLjE2YzAgLjIuMDcuMzcuMjEuNTFzLjMxLjIxLjUxLjIxaDMuNjJjLjE0IDAgLjI3LS4wMy4zOS0uMS4xMi0uMDguMjEtLjE4LjI2LS4zMWEuNzMuNzMgMCAwIDAgLjA2LS4zLjguOCAwIDAgMC0uMDUtLjI2Yy0uMDktLjItLjMtLjMtLjY2LS4zaC0uOXYtMi4xN2guOWMuNjYgMCAxLjIxLjE1IDEuNjYuNDRhMi42NCAyLjY0IDAgMCAxIC45OSAxLjE4Yy4xNS4zNi4yMy43NC4yMiAxLjEzIDAgLjM5LS4wOS43NS0uMjMgMS4xMS0uMjEuNTQtLjU2Ljk3LTEuMDUgMS4yOS0uNDguMzItMS4wMS40Ny0xLjU5LjQ1aC0zLjYyYTIuNzEgMi43MSAwIDAgMS0yLjAzLS44NSAyLjc0IDIuNzQgMCAwIDEtLjg1LTIuMDN6bS00LjA1LTIuOTR2Mi4xNkg0MC4zdjEuNWg3LjA0djIuMTZoLTkuMnYtNS44Mmg2LjV6bS02LjUtMy4yaDkuMnYyLjE2SDQwLjN2LjU0aC0yLjE2di0yLjd6bS0xMy4wNSA5LjAydi00LjVoMi4xNnY0LjVoLTIuMTZ6bS0uMTktOS4wMmgyLjU1bDMuMjQgNS4xNyAzLjIzLTUuMTdoMi4zNXY5LjAyaC0yLjE2di01LjI1bC0yLjE1IDMuNDVoLTIuNTVsLTQuNTItNy4yMnptLTguNTggOS4wMmgtMi4zNWwzLjg2LTkuMDJoMi4zNWwzLjg3IDkuMDJIMjEuN2wtLjY5LTEuNjJoLTIuNTJ2LTIuMTZoMS42bC0xLjA3LTIuNS0yLjY5IDYuMjh6bS04LjItNy4wNGMtLjQ3LjItLjg1LjUxLTEuMTQuOTRzLS40My45LS40MyAxLjQyYTIuNDQgMi40NCAwIDAgMCAuNzQgMS43OGMuNDkuNDkgMS4wOS43NCAxLjc5Ljc0czEuMjktLjI1IDEuNzgtLjc1YTIuNzYgMi43NiAwIDAgMCAuNS0uNjlIOS4wOFY1NWg0LjY4djEuMDljMCAuNjItLjEyIDEuMjEtLjM1IDEuNzktLjI0LjU3LS41NyAxLjA4LTEuMDIgMS41Mi0uNDQuNDQtLjk1Ljc4LTEuNTIgMS4wMmE0LjU3IDQuNTcgMCAwIDEtMS43OS4zNWMtLjYyIDAtMS4yMi0uMTItMS43OS0uMzUtLjU3LS4yNC0xLjA4LS41Ny0xLjUyLTEuMDItLjQ0LS40NC0uNzgtLjk1LTEuMDItMS41MmE0LjU3IDQuNTcgMCAwIDEtLjM1LTEuNzkgNC41OSA0LjU5IDAgMCAxIC44LTIuNjEgNC42OSA0LjY5IDAgMCAxIDIuMTItMS43NGwuODEgMS45OXptNC40My0uODFsLTEuNiAxLjQ1Yy0uMjQtLjI3LS41Mi0uNDctLjg1LS42MWEyLjU1IDIuNTUgMCAwIDAtMS4wMi0uMjF2LTIuMTZjLjY1IDAgMS4yOC4xMyAxLjg4LjQuNjEuMjcgMS4xNC42NCAxLjU4IDEuMTN6bTEzLjM2LTQuMDNIMXYxNC4zN2g2MC40OFY0OC44OUgzNS42MmwtNC4zOS01LjM2LTQuMzggNS4zNmgtLjkzek05LjExIDMzLjQ4bDUuMTUtMy40MnYxNi4yNkg5LjExVjMzLjQ4em0xMy4yNy04LjU0SDF2NS4xMmgyMS4zOHYtNS4xMnptMTEuNjQgMGgtNS41OWwtOS4xNSAyMS4zOWg1LjU5bDEuMDctMi41MmgwbDMuNjItOC40NGgwbDEuNjgtMy45MyAxLjMzIDMuMTIgMy40IDcuOTIuNjYgMS41NC45OSAyLjMxaDUuNThsLTkuMTgtMjEuMzl6TTQ0Ljg5IDFoLTUuMTJ2MTIuODRoNS4xMlYxem0xNy43OCAwaC02LjUzTDQwLjY4IDIwLjM0bC0uMDYuMDYtMS40OSAxLjk4aDYuNDRsNS4xNS02LjQ0IDQuNTQgNi40NGg2LjIybC03LjQ0LTEwLjYxTDYyLjY3IDF6TTMzLjggMjIuMzhoLTUuMTJWOS41NGw1LjEyLTMuNDJ2MTYuMjZ6TTMzLjggMWgtNS4xMnY1LjEyaDUuMTJWMXpNOS4xMSA5LjU0bDUuMTUtMy40MnYxNi4yNkg5LjExVjkuNTR6TTIyLjM4IDFIMXY1LjEyaDIxLjM4VjF6Ii8+PHBhdGggZD0iTTQ0Ljg5IDI0Ljk0aC01LjEydjEyLjg0aDUuMTJWMjQuOTR6bTE3Ljc4IDBoLTYuNTNMNDAuNjggNDQuMjhsLS4wNi4wNi0xLjQ5IDEuOThoNi40NGw1LjE1LTYuNDQgNC41NCA2LjQ0aDYuMjJsLTcuNDQtMTAuNjEgOC42My0xMC43N3oiLz48L2c+PC9zdmc+");
                background-size: 150px auto;  
                background-position: right 30px bottom 30px;
                background-repeat: no-repeat; 
            }
            
            #tiktak-games-header {
                display: table;
                padding: 14px 24px;
                border-radius: 15px;
                margin: 0 auto;
                font-family: consolas;
                font-size: 20px;
                color: white;
                text-align: center;  
            }
            #tiktak-games-header[data-title="title_running"] {
                background-color: #059669;
                color: white; 
            }
            #tiktak-games-header[data-title="title_stopped"] { 
                background-color: #f43f5e;
                color: white; 
                animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
                animation-delay: 2s;
            } 
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }
            
            #tiktak-games-header div {
                display: table-cell;
                vertical-align: middle;
            }
            
            #tiktak-games-header img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
            }
            
            #tiktak-games-log-container {
                color: #fff;
                flex: 1;
                overflow-y: auto;
                font-weight: 700;
            }
            
            #tiktak-games-log-container > * {
                line-height: 24px;
            }
            #tiktak-games-log-container .log-success {
                color: #22c55e;
            }
            
            #tiktak-games-log-container .log-error {
                color: #f43f5e;
            }
            
            #tiktak-games-log-container .log-warning {
                color: #f4b400;
            }
            
            #tiktak-games-log-container .log-info {
                color: #00a8ff;
            }
            
            #tiktak-games-log-container .log-debug {
                color: #94a3b8;
            }
            #tiktak-games-log-container .log-heartbeat {
                color: #94a3b8;
                transition: all 0.3s ease-in-out;  
            }  
            #tiktak-games-log-container .log-heartbeat.timeout{  
                margin-top:-24px;
                opacity: 0;
            }
            
        `;
        let e = document.createElement('div');
        e.innerHTML = HTML; 
        document.body.appendChild(e); 
        let style = document.createElement('style');
        style.innerHTML = CSS; 
        document.head.appendChild(style);



        setDashboardTitle('title_running');
    }; 
    const setDashboardTitle = (titleKey) => {
        let e = document.getElementById('tiktak-games-header');
        e.innerText = getTranslate(titleKey);
        e.setAttribute('data-title', titleKey);

    };
    
    
    
    let logQueue = [];
    const getLogContainer = () => {
        return document.getElementById('tiktak-games-log-container');
    };
    const createLog = (message, type) => { 
        let logContainer = getLogContainer();
        if(!logContainer){
            logQueue.push({message, type});
            return;
        }
        if(logQueue.length > 0) {
            let queue = logQueue || [];
            logQueue = [];
            queue.forEach(log => {
                createLog(log.message, log.type);
            });
        }
        let logElement = document.createElement('div');
        logElement.className = 'tiktak-games-log log-' + type;
        logElement.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logElement);
        if(logContainer.children.length >= 300) logContainer.removeChild(logContainer.children[0]);
        if(logContainer.getAttribute('data-hover') !== 'true') logElement.scrollIntoView();
    }; 
    const addSuccessLog = (message) => {
        createLog(message, 'success');
    };
    const addErrorLog = (message) => {
        createLog(message, 'error');
    };
    const addWarningLog = (message) => {
        createLog(message, 'warning');
    };
    const addInfoLog = (message) => {
        createLog(message, 'info');
    };
    const addLog = (message) => {
        createLog(message, 'log');
    };

 
 
 
    let ROOM_ID = "";
    let STREAMER_ID = "";
    let STREAMER_USERNAME = "";
    let PAGE_INFO = null;
    let PAGE_INFO_DETECTED = false;
    let SOCKET_CLOSED = false;


    addSuccessLog(getTranslate("started"));
    
    addLog(getTranslate("native_functions_backing_up"));
    let _XMLHttpRequestOpen = window.XMLHttpRequest.prototype.open;
    let _WebSocket = window.WebSocket;
    let _ResponseJson = window.Response.prototype.json; 
 
    addLog(getTranslate("overriding_native_functions")); 
    window.WebSocket = function (url, protocols) {
        addInfoLog("WebSocket function is called!");
        addLog("URL: " + url);
        let ws = new (Function.prototype.bind.call(_WebSocket, null, url, protocols));

        if (url && url.includes('/webcast/im/') && url.includes(ROOM_ID)) {
            // ws.addEventListener('message', function (msg) {  
            //     console.log(msg)
            //     addSuccessLog("WebSocket message received! " + msg.data.byteLength + " bytes");
            // })

            ws.addEventListener('close', () => {
                SOCKET_CLOSED = true;
                addWarningLog(getTranslate("websocket_closed"));
            })
        }

        return ws;
    }   


    function detectRoomInfo() {
        if (PAGE_INFO_DETECTED) return;

        addLog(getTranslate("detecting_room_info"));

        const sigiSateElement = document.getElementById('SIGI_STATE');
        if (!sigiSateElement) {
            addErrorLog("SIGI_STATE not found!");
            return;
        } 

        addLog("Parsing SIGI_STATE...");
        const sigiStateJson = sigiSateElement.innerText;
        if(!sigiStateJson) {
            addErrorLog("SIGI_STATE is empty!");
            return;
        } 

        addLog("Checking if SIGI_STATE is a valid JSON...");
        PAGE_INFO = JSON.parse(sigiStateJson);
        if(!PAGE_INFO) {
            addErrorLog("SIGI_STATE is not a valid JSON!");
            return;
        } 
        console.log(PAGE_INFO);

        ROOM_ID = PAGE_INFO?.LiveRoom?.liveRoomUserInfo?.user?.roomId; 
        if (!ROOM_ID) {
            addErrorLog("Room ID not found!");
            return;
        } 
        if(ROOM_ID === "unknown") {
            addErrorLog(getTranslate("room_id_not_found"));
            return;
        } 
        addSuccessLog(getTranslate("room_id_detected") + " " + ROOM_ID); 

        STREAMER_ID = PAGE_INFO?.AppContext?.appContext?.user?.uid; 
        if(!STREAMER_ID) {
            addErrorLog(getTranslate("user_id_not_found"));
            return;
        } 
        addSuccessLog(getTranslate("user_id_detected") + " " + STREAMER_ID); 
        STREAMER_USERNAME = PAGE_INFO?.LiveRoom?.liveRoomUserInfo?.user?.uniqueId;

        PAGE_INFO_DETECTED = true; 
        onDetectRoomInfo();
    };

    function onDetectRoomInfo() { 
        addSuccessLog("Room ID: " + ROOM_ID);
        addSuccessLog("User ID: " + STREAMER_ID);

        disableVideoAndAudio();
        startHeartbeat();
    };

    function disableVideoAndAudio() { 
        setInterval(() => {
            document.querySelectorAll("video, audio").forEach(element => { 
                if (element.muted && element.paused) return;
                element.muted = true;
                element.pause();
                if(element.tagName === "VIDEO") {
                    addSuccessLog(getTranslate("video_muted"));
                }
                if(element.tagName === "AUDIO") {
                    addSuccessLog(getTranslate("audio_muted"));
                }
            });
        }, 1000);
    }

    function startHeartbeat(){  
        const interval = setInterval(function(){  
            if(SOCKET_CLOSED) {
                setDashboardTitle('title_stopped');
                clearInterval(interval);
                return;
            }
            addLog(getTranslate("heartbeat_sending"));
            let xml = `<?xml version="1.0" encoding="utf-16"?>
            <package xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <type>Heartbeat</type>
                <game_uuid>${GAME_UUID}</game_uuid>
                <account_uuid>${ACCOUNT_UUID}</account_uuid>
                <account_identity>${STREAMER_USERNAME}</account_identity>
                <platform_id>1</platform_id>
                <heartbeat>
                    <stream_id>${ROOM_ID}</stream_id>
                </heartbeat>
            </package>`; 
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://panel.tiktakgames.com.tr/service/heartbeat",
                data: xml,
                onload: function(response) {
                    addSuccessLog(getTranslate("heartbeat_sent"));
                }
            }); 
        }, 15000);
    }

    function checkLiveEnd() {
        if (document.querySelector('[class*="LiveEndContainer"]') !== null) {
            onLiveEnd();
        }
    };
    function onLiveEnd() {
        if(SOCKET_CLOSED) return;
        addWarningLog(getTranslate("live_ended")); 
        SOCKET_CLOSED = true;
    };
 
    function run() { 
        createDashboard();
        // run detectRoomInfo every 1 second until it's detected
        const interval = setInterval(() => {
            if (PAGE_INFO_DETECTED) {
                clearInterval(interval);
                return;
            }
            detectRoomInfo();
        }, 1000);
    }
 
    if(document.body) {
        run();
    }
    else {
        document.addEventListener('DOMContentLoaded', () => {
            run();
        });
    } 
})();