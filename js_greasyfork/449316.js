// ==UserScript==
// @name         91porn播放器替换+ffmpeg下载视频
// @version      0.1
// @author       果氢
// @license MIT
// @description zh-cn
// @require      https://cdn.jsdelivr.net/npm/hls.js@1
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js
// @match        */view_video.php?**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91porn.com
// @namespace https://greasyfork.org/users/862007
// @downloadURL https://update.greasyfork.org/scripts/449316/91porn%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2%2Bffmpeg%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/449316/91porn%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2%2Bffmpeg%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

function strencode2(f) {
    var a = {
        'Anfny': function b(c, d) {
            return c(d);
        }
    };
    return a['Anfny'](unescape, f);
};

var u;

function copyToClip(content) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

function copyUrl() {
    const str = 'ffmpeg -i "'+u+'" -c copy "'+document.querySelector("#videodetails-content div:nth-child(2) .title-yakov a>span").innerText+'_'+document.querySelector("#videodetails > h4").innerText+'.mp4"'
    console.log(str);
    copyToClip(str);
}

var cookie = {
    set: function(name, value) {
        var Days = 1;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
    },
    get: function(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if(arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    del: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if(cval != null) {
            document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
        }
    }
};

var videoID = window.location.href.split("viewkey=")[1];
var cookieTime = cookie.get('time_' + videoID);
if(!cookieTime || cookieTime == undefined) {
    cookieTime = 0;
}


(function() {
    var jm=strencode2(document.documentElement.outerHTML.split("document.write(strencode2(\"")[1].split("\"")[0]);
    u = jm.split("<source src='")[1].split("'")[0];
    var video_html = document.getElementsByClassName("video-container")[0];
    var video_pic = document.getElementById("player_one_html5_api").poster;
    video_html.innerHTML = `<div id="dplayer"></div>`;
    var dp = new DPlayer({
        container: document.getElementById("dplayer"),
        video: {
            url: u,
            thumbnails: video_pic,
            type: 'customHls',
            customType: {
                customHls: function (video, player) {
                    const hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
                },
            },
        },
    });
    if(cookieTime > 0) {dp.seek(cookieTime);}
    dp.on('timeupdate', function () {
        cookie.set('time_' + videoID, dp.video.currentTime);
    });
    var a=document.createElement("a");
    a.text="点击复制FFmpeg导出命令";
    a.setAttribute("href",u);
    var p=document.createElement("p");
    p.innerHTML="copy"
    p.onclick = copyUrl;
    document.getElementById("videodetails").appendChild(a);
    document.getElementById("videodetails").appendChild(p);
})();