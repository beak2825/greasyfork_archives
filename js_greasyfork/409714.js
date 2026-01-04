// ==UserScript==
// @name        知乎视频播放控制
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  快捷键控制视频实体的播放，支持倍速、快进/快退、播放/暂停
// @author       Veg
// @include        https://www.zhihu.com/zvideo/*
// @include        https://v.vzuu.com/video/*
// @include        https://video.zhihu.com/video/*
// @include        https://www.zhihu.com/question/*
// @include        https://www.zhihu.com/question/*
// @include        https://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409714/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/409714/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
(function() {
'use strict';
let exclude = ':not(.Processed)';
let mo = new MutationObserver((mutationRecord) => {
middleFunction();
});
mo.observe(document.body, {
'childList': true,
'subtree': true
});
function middleFunction() {
let videoPackage = document.querySelectorAll('div.ZVideo-video' + exclude + ', div.VideoCard-player' + exclude);
for (let i=0, l=videoPackage.length; i<l; i++) {
if (!videoPackage[i].classList.contains('processed')) {
videoPackage[i].classList.add('processed');
let button = document.createElement('button');
button.innerHTML = '播放';
button.style = 'background:#FFA500;';
button.addEventListener('click', function () {
let iframe = this.parentNode.querySelector('iframe');
if (iframe)
window.open(iframe.src);
}, null);
videoPackage[i].insertBefore(button, videoPackage[i].firstChild);
}
}
// endFunction
}
window.addEventListener('keydown', function (k) {
let video = document.querySelector('video');
if (video) {
playControl(k, video);
}
}, null);
function playControl(k, video) {
if (k.keyCode == 27) {
if (video.paused !== true) {
video.pause();
}
else {
video.play();
}
}
if (k.keyCode == 74) {
video.currentTime += 10;
}
if (k.keyCode == 75) {
video.currentTime -= 10;
}
if (k.keyCode == 65) {
video.playbackRate += 0.05
}
if (k.keyCode == 83) {
video.playbackRate -= 0.05
}
if (k.keyCode == 49) {
video.playbackRate = 1.25;
}
if (k.keyCode == 50) {
video.playbackRate = 1.5;
}
if (k.keyCode == 51) {
video.playbackRate = 1.75;
}
if (k.keyCode == 52) {
video.playbackRate = 2.0;
}
if (k.keyCode == 82) {
video.playbackRate = 1.0;
}
}
})();