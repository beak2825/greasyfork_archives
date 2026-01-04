// ==UserScript==
// @name        YouTube video length based on its speed
// @description Shows duration and current time in a format divided by video speed
// @match        *://www.youtube.com/*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @grant       none
// @license MIT
// @version 1.0.0
// @namespace https://greasyfork.org/users/1266596
// @downloadURL https://update.greasyfork.org/scripts/489800/YouTube%20video%20length%20based%20on%20its%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/489800/YouTube%20video%20length%20based%20on%20its%20speed.meta.js
// ==/UserScript==
const ydctboscss = `
    span.ydctboscss{
        position:relative;
    }
    span.ydctboscss > span{
        display:none;
        visibility:hidden;
        opacity:0;
    }
    span.ydctboscss::before{
        position:relative;
        left:7px;
        top:0px;
        content:var(--ydctboscsstimeo);
    }
    span.ydctboscss.hiddentip::after{
        display:none;
        visibility:hidden;
        opacity:0;
    }
    span.ydctboscss::after{
        transition: .5s;
        position:relative;
        left:12px;
        top:0px;
        content:var(--ydctboscsstime);
        padding: 2px;
        border-radius: 5px;
    }
    span.ydctboscss:not(:hover)::after{
        opacity:0.5;
        background:transparent;
    }
    span.ydctboscss:hover::after{
        opacity:1;
        background:var(--yt-spec-static-brand-red);
    }
`
const interval = setInterval(search, 1000)
function search() {
    if ($("video").length) {
        clearInterval(interval)
        $("span.ytp-time-current").parent().addClass("ydctboscss")
        const stylesheetthings = document.createElement("style")
        stylesheetthings.innerHTML = ydctboscss
        console.log(stylesheetthings)
        document.head.appendChild(stylesheetthings);
        const video = $("video").eq(0)
        function changeTime() {
            const speed = video[0].playbackRate / video[0].defaultPlaybackRate
            if (speed != 1) $("span.ytp-time-current").parent().removeClass("hiddentip"); else $("span.ytp-time-current").parent().addClass("hiddentip")
            function doityeah() {
                function durtotext(currentTime) {
                    var hours = Math.floor(currentTime / 3600);
                    var minutes = Math.floor((currentTime % 3600) / 60);
                    var seconds = Math.floor(currentTime % 60);
                    var formattedTime = (hours > 0 ? (hours + ":") : "") +
                        (hours > 0 && minutes < 10 && minutes != 0 ? "0" + minutes : minutes) + ":" +
                        (seconds < 10 ? "0" : "") + seconds;

                    return formattedTime;
                }
                document.documentElement.style.setProperty('--ydctboscsstimeo', '"' + (durtotext(video[0].currentTime / speed) + " / " + durtotext(video[0].duration / speed)) + '"')
                document.documentElement.style.setProperty('--ydctboscsstime', '"' + (durtotext(video[0].currentTime) + " / " + durtotext(video[0].duration)) + '"')
            }
            doityeah()
        }
        video.on("timeupdate", changeTime)
        video.on("play", changeTime)
        video.on("pause", changeTime)
        video.on("ratechange", changeTime)
        video.on("playing", changeTime)
    } else {
        return
    }
}