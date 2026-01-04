// ==UserScript==
// @name         Lynics for Youtube Music
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用网易云接口为yutube music提供歌词服务, 请允许跨域使用。
// @author       shevonkuan
// @match        https://music.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/444169/Lynics%20for%20Youtube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/444169/Lynics%20for%20Youtube%20Music.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("start injection");
    // Add lynics windows button

    unsafeWindow.lynic_windows = function lynic_windows() {
        unsafeWindow.lynic = window.open(
            "https://shevonkuan.github.io/Lyrics4youtube-music/",
            "_blank",
            "height=1000,width=800,status=yes,top=200,left=400,toolbar=no,menubar=no,location=no"
        );
        unsafeWindow.a.addEventListener("DOMNodeInserted", () => {
            console.log(a.title);
            unsafeWindow.lynic.postMessage(
                {
                    type: "song_change",
                    song: a.title,
                },
                "*"
            );
        });
    };

    unsafeWindow.addEventListener("message", function (event) {
        if (event.data.type == "ready") {
            unsafeWindow.lynic.postMessage(
                {
                    type: "song_change",
                    song: a.title,
                },
                "*"
            );
        }
        if (event.data.type == "get_lyric") {
            console.log("get lyric");
            unsafeWindow.get_lyric(event.data.song_id);
        }
        if (event.data.type == "get_songs") {
            console.log("get songs");
            unsafeWindow.get_songs(event.data.song);
        }
    });

    GM_addElement(
        window.document.getElementsByClassName(
            "style-scope ytmusic-av-toggle"
        )[0],
        "button",
        {
            class: "style-scope ytmusic-av-toggle",
            onclick: "lynic_windows()",
            textContent: "歌词窗口",
        }
    );

    unsafeWindow.get_lyric = (song_id) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://music.163.com/api/song/detail/?id=${song_id}&ids=%5B${song_id}%5D`,
            onload: function (response) {
                var picUrl = JSON.parse(response.responseText).songs[0].album
                    .picUrl;
                return picUrl;
            },
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://music.163.com/api/song/lyric?os=-1&id=${song_id}&lv=-1&kv=-1&tv=-1`,
            onload: function (response) {
                var lyric = JSON.parse(response.responseText).lrc.lyric;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `http://music.163.com/api/song/detail/?id=${song_id}&ids=%5B${song_id}%5D`,
                    onload: function (response) {
                        var picUrl = JSON.parse(response.responseText).songs[0]
                            .album.picUrl;
                        unsafeWindow.lynic.postMessage(
                            {
                                type: "song_lyric",
                                lyric: lyric,
                                picUrl: picUrl,
                            },
                            "*"
                        );
                    },
                });
            },
        });
    };

    unsafeWindow.get_songs = (song_name) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${song_name}&type=1&offset=0&total=true&limit=20`,
            onload: function (response) {
                var info = JSON.parse(response.responseText).result.songs;
                unsafeWindow.lynic.postMessage(
                    {
                        type: "song_list",
                        info: info,
                    },
                    "*"
                );
            },
        });
    };

    unsafeWindow.a = window.document.getElementsByClassName(
        "title style-scope ytmusic-player-bar"
    )[0];
    console.log(a);

    // var get = () => {
    //     if (
    //         window.document.getElementsByClassName(
    //             "yt-simple-endpoint style-scope yt-formatted-string"
    //         )
    //     ) {
    //         console.log("get");
    //         unsafeWindow.b = window.document.getElementsByClassName(
    //             "yt-simple-endpoint style-scope yt-formatted-string"
    //         )[0];
    //     } else {
    //         setTimeout(get, 250);
    //     }
    // };

    // get();

    // Your code here...
})();
