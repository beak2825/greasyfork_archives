// ==UserScript==
// @name         542372.com免费看
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://*.542372.com:*/*
// @match        https://*.542969.com:*/*
// @match        https://*.543786.com:*/*
// @match        https://*.542732.com:*/*
// @match        https://*.544979.com:*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=543786.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522282/542372com%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522282/542372com%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function decode(text) {
        let secret = new fernet.Secret("NyGRG56A8i5J2JMqh7da83r2MMfgbM7Ppw1aCF8YnAY=");
        var token = new fernet.Token({
            secret: secret,
            token: text,
            ttl: 0
        })
        return token.decode();
    }

    function getVideoId(url_path) {
        let videoId = url_path.split("/")[2];
        return videoId;
    }

    function playUrl(videoId, play_url, config) {
        new window.DPlayer({
            element: document.getElementById(`myVideoPlayer_${videoId}`),
            video: {
                type: "auto",
                url: play_url,
                pic: ""
            },
            pluginOptions: {
                hls: {
                    maxMaxBufferLength: 10
                }
            },
            ...config.defaultConfig
        })
    }


    function after(videoId,download_url,play_url_path,config){
        document.querySelector("#root > div > div:nth-child(7) > div:nth-child(4) > div:nth-child(2)").remove();
        document.querySelector("#root > div > div:nth-child(7) > div:nth-child(4)").innerHTML = `<a class="sc-bkkeKt sc-dJjYzT iETJJG ciOzeC" style="background: rgb(70, 164, 180);width="31%";height="36px" " href="${download_url}">下载</a>`

        document.querySelector("#root > div > div:nth-child(7) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2)").addEventListener("click", () => {
            let video_host2 = config.video_play_url_list[1].url[0]
            let play_url = "https://" + video_host2 + play_url_path;
            playUrl(videoId, play_url, config)
        })
        document.querySelector("#root > div > div:nth-child(7) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(3)").addEventListener("click", () => {
            let video_host2 = config.video_play_url_list[2].url[0]
            let play_url = "https://" + video_host2 + play_url_path;
            playUrl(videoId, play_url, config)
        })
    }

    async function main() {
        //document.querySelector("#root > div> div:nth-child(2)").innerHTML = ""
        //document.querySelector("#root > div> div:nth-child(5)").innerHTML = ""
        //document.querySelector("#root > div> div:nth-child(6)").innerHTML = ""
        //document.querySelector("#root > div> div:nth-child(9)").innerHTML = ""
        //document.querySelector("#root > div > div:nth-child(7) > div:nth-child(2)").innerHTML = ""
        let config = JSON.parse(decode(window.CONFIG))
        let api_host = config.api_url
        let videoId = getVideoId(window.location.pathname)
        let api_path = "/api/vod/video/" + videoId + "?site_id=8&channel_id=531"
        let url = "https://" + api_host + api_path
        let res = await fetch(url)
        let data = await res.json()
        let res_json = decode(data["x-data"])
        let resObj = JSON.parse(res_json)
        let play_url_path = resObj.data.play_url;
        let down_url_path = resObj.data.down_url;
        let video_host1 = config.video_play_url_list[0].url[0]
        let video_download_host1 = config.video_download_url[0]
        let play_url = "https://" + video_host1 + play_url_path;
        let download_url = "https://" + video_download_host1 + down_url_path;
        //let play_url = "https://" + window.play_host + resObj.data.play_url;
        // let download_url = "https://" + window.play_host + resObj.data.down_url;
        console.log(play_url)

        if (window.DPlayer) {
            playUrl(videoId, play_url, config)
            after(videoId,download_url,play_url_path,config)
        } else {
            setTimeout(() => {
                playUrl(videoId, play_url, config)
                after(videoId,download_url,play_url_path,config)
            }, 200)
        }
    }


    let intervalValue = setInterval(() => {
        if (document.readyState === "complete") {
            main()
            clearInterval(intervalValue)
        }
    }, 200)


    // Your code here...
})();