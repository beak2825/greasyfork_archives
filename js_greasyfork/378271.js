// ==UserScript==
// @name         autoplay
// @version      1.0.0
// @description    为bilibili添加播放自动推荐功能
// @compatible   chrome
// @license      MIT
// @grant    unsafeWindow
// @match    https?://www.bilibili.com/video/*
// @namespace https://greasyfork.org/users/249131
// @downloadURL https://update.greasyfork.org/scripts/378271/autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/378271/autoplay.meta.js
// ==/UserScript==

let enableAutoPlay = unsafeWindow._enableAutoPlay = true;
let video = document.querySelector('video');
video.addEventListener("canplay", function () {
    video.play();
});
//让网站资源先解析，不然会报错
setTimeout(function () {
    let reco_list = document.querySelector('#reco_list');

    if (!reco_list) {
        alert("本页面没有推荐列表，不适合执行此脚本");
        return;
    }

    let buttonContainer = reco_list.querySelector(".rec-title");
    buttonContainer.appendChild(createEnableButton());

    let listURL = reco_list.querySelectorAll("a");
    let firstURl = listURL[0];
    //enableAutoPlay
    video.addEventListener('ended', function () {
        if (enableAutoPlay) {
            unsafeWindow.location.assign(firstURl);
        }
    });
}, 5000);

let reco_list = document.querySelector('#reco_list');
//处理ajax
reco_list.addEventListener("click", function (event) {
    //event.target.tagName
    if (event.target.tagName.toLowerCase() == "img" || event.target.tagName.toLowerCase() == "a") {
        setTimeout(function () {
            let video = document.querySelector('video');
            let reco_list = document.querySelector('#reco_list');
            if (!reco_list) {
                alert("本页面没有推荐列表，不适合执行此脚本");
                return;
            }

            let listURL = reco_list.querySelectorAll("a");
            let firstURl = listURL[0];

            video.addEventListener('ended', function () {
                if (enableAutoPlay) {
                    location.assign(firstURl);
                }
            });
        }, 2000);
    }
});

function createEnableButton() {
    let enableButton = document.createElement("button");
    enableButton.style.width = 150;
    enableButton.style.height = 30;
    enableButton.className = "bi-btn gz";
    enableButton.innerHTML = "取消自动播放";
    enableButton.addEventListener("click", function () {
        if (!enableAutoPlay) {
            enableAutoPlay = true;
            enableButton.innerHTML = "取消自动播放";
        } else {
            enableAutoPlay = false;
            enableButton.innerHTML = "自动播放";
        }
    });
    return enableButton;
}