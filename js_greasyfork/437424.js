// ==UserScript==
// @name         网易云音乐助手
// @icon         https://s1.music.126.net/style/favicon.ico?v20180823
// @namespace    https://github.com/chen310
// @version      1.0.0
// @description  获取网易云音乐播放链接
// @author       chen310
// @match        *://music.163.com/song?*
// @match        *://music.163.com/mv?*
// @match        *://music.163.com/video?*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437424/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437424/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var id = getid();
    var url, type, elementId;
    if (window.location.href.search("song") != -1) {
        url = "https://music.163.com/api/song/enhance/player/url?ids=%5B" + id + "%5D&br=999000";
        type = "song";
        elementId = "#content-operation";
        $("a[data-res-action=download]").remove();
    }
    else if (window.location.href.search("mv") != -1) {
        url = "https://music.163.com/api/song/enhance/play/mv/url?id=" + id + "&r=1080";
        type = "mv";
        elementId = "#j-op";
    }
    else if (window.location.href.search("video") != -1) {
        url = "https://music.163.com/api/cloudvideo/playurl?ids=%5B%22" + id + "%22%5D&resolution=1080";
        type = "video";
        elementId = "#j-op";
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                var play_url;
                if (type == "song") {
                    play_url = data["data"][0]["url"];

                }
                else if (type == "mv") {
                    play_url = data["data"]["url"];
                }
                else if (type == "video") {
                    play_url = data["urls"][0]["url"];
                }
                if (play_url && play_url.length > 0) {
                    var element =
                        '<a class="u-btn2 u-btn2-2 u-btni-addply f-fl" hidefocus="true" title="直链" target="_blank" href="' +
                        play_url +
                        '"><i><em class="ply"></em>直链</i></a>';
                    $(elementId).append(element);
                }
            }
        }
    };
    xhr.send("callback=functionName");
})();


function getid() {
    var id = window.location.href.split("?id=");
    if (id.length >= 2) {
        id = id[1].split("&")[0];
    } else {
        id = window.location.href.split("&id=")[1].split("&")[0];
    }
    return id;
}
