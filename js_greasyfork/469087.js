// ==UserScript==
// @name         学习自用 LiveStreamCapture 配套脚本 目前仅支持douyu
// @namespace    1390807779@qq.com
// @version      0.1
// @description  Under development
// @author       1390807779@qq.com
// @match        https://www.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/469087/%E5%AD%A6%E4%B9%A0%E8%87%AA%E7%94%A8%20LiveStreamCapture%20%E9%85%8D%E5%A5%97%E8%84%9A%E6%9C%AC%20%E7%9B%AE%E5%89%8D%E4%BB%85%E6%94%AF%E6%8C%81douyu.user.js
// @updateURL https://update.greasyfork.org/scripts/469087/%E5%AD%A6%E4%B9%A0%E8%87%AA%E7%94%A8%20LiveStreamCapture%20%E9%85%8D%E5%A5%97%E8%84%9A%E6%9C%AC%20%E7%9B%AE%E5%89%8D%E4%BB%85%E6%94%AF%E6%8C%81douyu.meta.js
// ==/UserScript==

(
    function() {
        'use strict';

        console.log("hello");
        sourceAnalyze()

        function createButton(urlMaster) {
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", "record");
            button.setAttribute("id", "lh-button");
            button.style.left = "50px";
            button.style.top = "200px";
            button.style.height = "30px";
            button.style.width = "50px";
            button.style['z-index'] = "999999";
            button.style.position = "absolute";

            if (urlMaster === "www.douyu.com") {
                button.onclick = function() { douyuLiveStream() };
            }

            document.body.appendChild(button);
        }

        function sourceAnalyze() {
            let url = document.URL;
            var urlPicese = url.split("/");
            if (urlPicese.length >= 3) {
                let urlMaster = urlPicese[2];
                if (webIsLive(urlMaster) === 1) {
                    createButton(urlMaster);
                }
            }
        }

        function webIsLive(urlMaster) {
            if (urlMaster === "www.douyu.com"){
                let roomId = window.apm_room_id;
                return typeof(roomId) == "undefined" ? 0 : 1;
            }
           return 0;
        }

        function getCookie(name) {
            var cookieArr = document.cookie.split(";");

            for(var i = 0; i < cookieArr.length; i++) {
                var cookiePair = cookieArr[i].split("=");

                if(name == cookiePair[0].trim()) {
                    return decodeURIComponent(cookiePair[1]);
                }
            }
            return null;
        }

        function douyuLiveStream() {
            let roomId = window.apm_room_id;
            let url = "https://www.douyu.com/lapi/live/getH5Play/" + roomId;
            let douyuDid = getCookie("dy_did");
            var newDate = parseInt((new Date).getTime() / 1e3, 10);
            var paramVar = window.ub98484234(roomId, douyuDid, newDate);
            let paramLet = "&cdn=&rate=-1&iar=1&ive=0&hevc=0&fa=0";
            let streamUrl = url + "?" + paramVar + paramLet;
            console.log(streamUrl);
            fetch(streamUrl, {
                method: 'POST'})
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    console.log(myJson);
                    var webError = myJson["error"];
                    if (webError != 0){
                        return;
                    }
                    let data = myJson["data"];
                    let rtmpUrl = data["rtmp_url"];
                    let rtmpLive = data["rtmp_live"];
                    let rtmpLiveUrl = rtmpUrl + "/" + rtmpLive;
                    //window.open("testExe://"+rtmpLiveUrl, window.apm_room_id)
                    window.open("LiveStreamCaptureExe://"+rtmpLiveUrl, window.apm_room_id)
                    console.log(rtmpLiveUrl);
                })
                .catch(function(error) {
                    console.error('Error:', error)
                });
        }
    }

)();