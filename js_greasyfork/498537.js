// ==UserScript==
// @name         Bilibili video collection list height adjustment
// @name:zh-cn   调整 Bilibili 视频合集高度
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adjust video collection's height on Bilibili video pages.
// @description:zh-cn  在 Bilibili 视频播放页面调整视频合集栏目的高度。
// @author       dont-be-evil
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498537/Bilibili%20video%20collection%20list%20height%20adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/498537/Bilibili%20video%20collection%20list%20height%20adjustment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let adjust_height_form = document.createElement('div');
    adjust_height_form.style.display = 'flex';
    adjust_height_form.style.justifyContent = 'space-evenly';
    adjust_height_form.innerHTML =
    `<span>Height: </span>
    <input type="number" required>
    <button onclick="adjust_height()"> Apply </button>`;
    let triggered = false;

    let callback = function(mutationsList, observer) {
        if (triggered === true) return;
        for (let mutation of mutationsList) {
            let video_list = document.querySelector("div.video-pod");
            if (!video_list) return;
            let preview_picture = document.querySelector("div.framepreview-box picture");
            if (!preview_picture) return;
            video_list.parentNode.insertBefore(adjust_height_form, video_list);
            let content_list = document.querySelector("div.video-pod__list");
            adjust_height_form.children[1].value = content_list.parentNode.offsetHeight;
            function adjust_height() {
                const new_height = parseInt(adjust_height_form.children[1].value);
                video_list.style.height = `${new_height + 100}px`;
                content_list.parentNode.style.maxHeight = `${new_height}px`;
            }
            window.adjust_height = adjust_height;
            triggered = true;
        }
    };
    let observer = new MutationObserver(callback);
    let config = { childList: true, subtree: false, attributes: false };
    observer.observe(document.body, config);

})();
