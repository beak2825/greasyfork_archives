// ==UserScript==
// @name         B站直播弹出播放（画中画）
// @namespace    None
// @version      1.3
// @description  为B站直播添加PictureInPicture（画中画）
// @author       IceCat
// @match        https://live.bilibili.com/*
// @run-at       document-end
// @grant        none
//@require       https://cdn.bootcss.com/jquery/1.10.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/384382/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%87%BA%E6%92%AD%E6%94%BE%EF%BC%88%E7%94%BB%E4%B8%AD%E7%94%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/384382/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%87%BA%E6%92%AD%E6%94%BE%EF%BC%88%E7%94%BB%E4%B8%AD%E7%94%BB%EF%BC%89.meta.js
// ==/UserScript==

var $ = jQuery
$(window).load(()=>{
    addButton();
    bvideo='.bilibili-live-player-video > video'
    $(bvideo)[0].addEventListener('enterpictureinpicture', function(pipWindow) {
        $('#PiPtext')[0].innerText="收回"
    })

    $(bvideo)[0].addEventListener('leavepictureinpicture', function() {
        $('#PiPtext')[0].innerText="弹出"
    })
    $('#popbutton').click(switchpip);
})

function switchpip() {
    if($(document)[0].pictureInPictureElement == null){
        $("div.bilibili-live-player-video > video")[0].requestPictureInPicture();
    }else{
        document.exitPictureInPicture();
    }
}

function addButton() {
    var Button = document.createElement('div');
    Button.style='order:0;'
    Button.innerHTML = '<div class="bilibili-live-player-video-controller-btn-item bilibili-live-player-video-controller-switch-quality-btn" style="order:2;"><div id="popbutton" data-title="弹出" class="blpui-btn text-btn no-select html-tip-parent"><span id="PiPtext">弹出</span></div></div>'
    var bar = $('.bilibili-live-player-video-controller-right')[0];

    bar.appendChild(Button);
    $('#PiP').click(switchpip);
}



(function() {
    'use strict';

})();