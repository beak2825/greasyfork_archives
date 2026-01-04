// ==UserScript==
// @match *://*.stripchat.com/*
// @match *://*.instantfapcams.com/*
// @match *://*.xhamsterlive.com/*
// @match *://*.cambb.xxx/models/stripchat/*
// @match *://*.nudecams.xxx/models/stripchat/*
// @match *://*.cambb.xxx/models/chaturbate/*
// @match *://*.nudecams.xxx/models/chaturbate/*
// @match *://chaturbate.com/*
// @name        Play stripchat or chaturbate videos with potplayer,vlc,nplayer,mpv, etc V2
// @description Play stripchat or chaturbate videos with potplayer,vlc,nplayer,mpv, etc.
// @namespace   https://greasyfork.org/zh-CN/scripts/473187
// @version     2.9
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/485007/Play%20stripchat%20or%20chaturbate%20videos%20with%20potplayer%2Cvlc%2Cnplayer%2Cmpv%2C%20etc%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/485007/Play%20stripchat%20or%20chaturbate%20videos%20with%20potplayer%2Cvlc%2Cnplayer%2Cmpv%2C%20etc%20V2.meta.js
// ==/UserScript==

window.onload = (function() {
    'use strict';
    let LNK = [
        "edge11-rtm.live.mmcdn.com",
        "edge13-rtm.live.mmcdn.com",
        "edge17-rtm.live.mmcdn.com",
        "edge10-sea.live.mmcdn.com",
        "edge24-waw.live.mmcdn.com",
        "edge13-waw.live.mmcdn.com",
        "edge23-waw.live.mmcdn.com",
        "edge33-waw.live.mmcdn.com",
        "edge21-waw.live.mmcdn.com"
    ];

    let H264 = [
	"3633648a8122ab5bc3f2ae1c201f7d2631b642761d8a471db1044e23d086b9b8_trns_h264",
    ];


    let live_url_num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

function btn_com(btn_name, player_name, player_url, copy_url = false) {
    let btn = document.createElement("button");
    btn.innerHTML = player_name;
    btn.style.width = "100px";
    btn.style.height = "30px";
    btn.style.align = "top";
    btn.style.color = "white";
    btn.style.background = "#2b2b2b";
    btn.style.border = "1px solid #e33e33";
    btn.style.borderRadius = "8px";
    btn.style.fontSize = "16px";
    btn.onclick = function() {
//if (document.location.hostname === "chaturbate.com" && !document.location.pathname.includes("/fullvideo/")) {
        let live_url;
        if (document.location.hostname === "cambb.xxx" || document.location.hostname === "camconsole.com" || document.location.hostname === "nudecams.xxx" || document.location.hostname === "chaturbate.com" || document.location.hostname === "stripchat.com" || document.location.hostname === "xhamsterlive.com" || document.location.hostname === "instantfapcams.com") {
            if (document.location.pathname.includes("/models/chaturbate") || document.location.hostname === "chaturbate.com") {
                let random_LNK = LNK[Math.floor(Math.random() * LNK.length)];
                let random_H264 = H264[Math.floor(Math.random() * H264.length)];
                let username;
                if (document.location.hostname === "chaturbate.com" && !document.location.pathname.includes("/fullvideo/")) {
                    username = document.location.pathname.split("/")[1];
					live_url = "https://" + random_LNK + "/live-hls/amlst:" + username + "-sd-" + random_H264 + "/playlist.m3u8";
                }
				else if (document.location.pathname.includes("/fullvideo/")) {
					let matches = document.location.href.match(/chaturbate\.com\/fullvideo\/\?b=([^&]+)/);
					let username = matches ? matches[1] : null;
					console.log("Username: " + username);
					live_url = "https://" + random_LNK + "/live-hls/amlst:" + username + "-sd-" + random_H264 + "/playlist.m3u8";
				} else {
                    username = document.location.href.split(/[=/]/).pop();
					live_url = "https://" + random_LNK + "/live-hls/amlst:" + username + "-sd-" + random_H264 + "/playlist.m3u8";
                }
            } if (document.location.pathname.includes("/models/stripchat")) {
                let p = document.querySelector('#livestream-player').getAttribute('data-src');
                let live_id = p.match(/\d+/g)[1];
                let url_num = live_url_num[Math.floor(Math.random() * live_url_num.length)];
                live_url = "https://b-hls-" + url_num + ".doppiocdn.com/hls/" + live_id + "/" + live_id + ".m3u8";
            } else if (document.location.hostname === "stripchat.com" || document.location.hostname === "xhamsterlive.com" || document.location.hostname === "instantfapcams.com") {
                let p = document.querySelector('.video-element-wrapper-blur.with-blur').querySelector('.image-background').src;
                let live_id = p.match(/\d+/g)[1];
                let url_num = live_url_num[Math.floor(Math.random() * live_url_num.length)];
                live_url = "https://b-hls-" + url_num + ".doppiocdn.com/hls/" + live_id + "/" + live_id + ".m3u8";
            }
        }
        console.log("Live URL: " + live_url);

        if (copy_url) {
            navigator.clipboard.writeText(live_url).then(function() {
                alert("Link copied to clipboard:\n" + live_url);
            }).catch(function(err) {
                console.error('Unable to copy text to clipboard', err);
            });
        } else {
            window.open(live_url);
        }
    };
    const addBtn = () => {
        if (document.location.hostname === "cambb.xxx" || document.location.hostname === "nudecams.xxx") {
            document.querySelector(".col-12.model-iframe").prepend(btn);
        } else if (document.location.hostname === "stripchat.com" || document.location.hostname === "xhamsterlive.com" || document.location.hostname === "instantfapcams.com") {
            document.querySelector("#portal-root").prepend(btn);
        } else if (document.location.hostname === "camconsole.com") {
            document.querySelector(".separator-2").prepend(btn);
        } else if (document.location.pathname.includes("/models/chaturbate")) {
            document.querySelector(".videoPlayerDiv").prepend(btn);
        } else {
            document.querySelector(".videoPlayerDiv").prepend(btn);
        }
    };

    if (document.readyState === "complete") {
        addBtn();
    } else {
        window.addEventListener("load", addBtn);
    }
}

btn_com("btn0", "Copy Link", "", true);
btn_com("btn1", "Open Link", "https://playhls.com/?url=");
btn_com("btn2", "mpv", "mpv://");
btn_com("btn3", "vlc", "vlc://");
btn_com("btn4", "potplayer", "potplayer://");
btn_com("btn5", "nplayer", "nplayer-");
})();