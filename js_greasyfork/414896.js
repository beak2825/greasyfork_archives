// ==UserScript==
// @name         Bilibili 一键截图
// @description  按 S 键一键截图，并保存成 PNG 格式
// @version      0.1.7
// @author       Kazurin
// @license      MIT
// @namespace    https://greasyfork.org/users/699115
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414896/Bilibili%20%E4%B8%80%E9%94%AE%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/414896/Bilibili%20%E4%B8%80%E9%94%AE%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

'use strict';
var video, videoTitle, bgmTitle, canvas, ctx, link;

function lazyInitialize() {
    if(!canvas) {
        video = document.querySelector('#bilibili-player video') || document.querySelector('.bilibili-player-video video');
        videoTitle = document.querySelector('h1.video-title') || document.querySelector('.video-title span');
        bgmTitle = document.querySelector('.media-title');
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
    }
}

function getVideoCurrentTime(video) {
    var time = Math.round(video.currentTime);
    var seconds = time % 60;
    var minutes = (time - seconds) / 60;
    return minutes + '-' + (seconds < 10 ? '0' : '') + seconds;
}

function startDownload(uri) {
    link.href = uri;
    if(window.location.href.indexOf('/bangumi/') >= 0) {
        // 视频类型为番剧
        var bgmEpisode = document.querySelector('#eplist_module .ep-item.cursor .ep-title') ||
            document.querySelector('.ep-section-module .ep-item.cursor .ep-title');
        if(bgmEpisode) {
            // 视频有分集
            link.download = bgmTitle.textContent + ' ' + bgmEpisode.textContent + ' ' + getVideoCurrentTime(video) + '.png';
        } else {
            // 视频无分集
            link.download = bgmTitle.textContent + ' ' + getVideoCurrentTime(video) + '.png';
        }
    } else {
        // 视频类型为普通视频
        var episode = document.querySelector('.cur-list ul.list-box li.on span.page-num');
        if(episode) {
            // 视频有分集
            link.download = videoTitle.textContent + ' ' + episode.textContent + ' ' + getVideoCurrentTime(video) + '.png';
        } else {
            // 视频无分集
            link.download = videoTitle.textContent + ' ' + getVideoCurrentTime(video) + '.png';
        }
    }
    link.click();
}

function onError(error) {
    console.error('截图失败');
    console.error(error);
    window.alert('截图失败，请重试。如果此问题反复出现，请在 F12 控制台查看错误消息，并向开发者反馈。');
}

function downloadScreenshot() {
    lazyInitialize();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if(typeof(canvas.toBlob) !== 'undefined') {
        // 如果浏览器支持 canvas.toBlob()，则用 blob URL 下载
        canvas.toBlob(function(blob) {
            try {
                var url = URL.createObjectURL(blob, 'image/png');
                startDownload(url);
                URL.revokeObjectURL(url);
            } catch(e) {
                onError(e);
            }
        });
    } else {
        // 否则用 data URL 下载
        startDownload(canvas.toDataURL('image/png'));
    }
}

function hasActiveInput() {
    // 检查当前焦点是否在输入框上
    const activeTag = document.activeElement.tagName;
    return activeTag == 'INPUT' || activeTag == 'TEXTAREA';
}

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 83 && !hasActiveInput()) {
        e.preventDefault();
        try {
            downloadScreenshot();
        } catch(e) {
            onError(e);
        }
    }
});
