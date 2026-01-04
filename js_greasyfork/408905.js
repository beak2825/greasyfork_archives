// ==UserScript==
// @name         Scroll To Video Top
// @namespace    https://space.bilibili.com/6727237
// @version      1.9
// @description:zh-cn 0px on top
// @author       尺子上的彩虹
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @description 0px on top
// @downloadURL https://update.greasyfork.org/scripts/408905/Scroll%20To%20Video%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/408905/Scroll%20To%20Video%20Top.meta.js
// ==/UserScript==

var windyfunction=function() {
    if (document.location.href.match('bangumi')){
        document.getElementById("app").style.marginTop="20px";
        window.scrollTo(0,76);
    } else if (document.location.href.match('video')) {
        document.getElementById('viewbox_report').style.maxHeight="108px";
        window.scrollTo(0,106);
    } else if (document.location.href.match('play')) {
        window.scrollTo(0,76);
    }};
setInterval(
    function (){
        if (document.location.href.match('bangumi')){
            document.getElementsByClassName('squirtle-widescreen-wrap squirtle-block-wrap')[0].addEventListener('click',windyfunction);
            document.getElementsByClassName('bpx-player-video-inputbar')[0].style.minWidth="100%";
            document.getElementsByClassName('bpx-player-video-inputbar')[0].style.width="100%";
            document.getElementsByClassName('squirtle-sendbar-wrap squirtle-block-wrap')[0].style.minWidth="900px";
        } else if (document.location.href.match('video')) {
            document.getElementsByClassName('bilibili-player-video-inputbar')[0].style.maxWidth="100%";
            document.getElementsByClassName('bilibili-player-video-inputbar')[0].style.width="100%";
            document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0].addEventListener('click',windyfunction);
        };
        document.getElementsByClassName('video-sections-content-list')[0].style.height='500px';
        document.getElementsByClassName('video-sections-content-list')[0].style.maxHeight='none';
    },
    500);