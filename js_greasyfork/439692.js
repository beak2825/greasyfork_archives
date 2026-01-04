// ==UserScript==
// @name         Nico dl
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  下载N站视频 | Download video from nicovideo.jp
// @author       ctrn43062
// @include      *//www.nicovideo.jp/watch/sm*
// @icon         https://www.google.com/s2/favicons?domain=nicovideo.jp
// @grant        none
// @note         2023-2-20   [fix] 修复打开视频封面失效的问题 (年了，一更)
// @note         2022-2-17   [fix] 修复右键打开视频时可能发生的无法下载视频和视频封面的 bug
// @note         2022-2-10   [feat] 添加下载视频高清封面功能
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439692/Nico%20dl.user.js
// @updateURL https://update.greasyfork.org/scripts/439692/Nico%20dl.meta.js
// ==/UserScript==

const IS_HLS_DISABLED = 'DMCSource.isHLSDisabled';
const DOWNLOAD_SVG = `<svg version="1.1"id="Capa_1"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"viewBox="0 0 330 330"style="enable-background:new 0 0 330 330;"xml:space="preserve"><g><path d="M165,0C74.019,0,0,74.018,0,165c0,90.98,74.019,165,165,165s165-74.02,165-165C330,74.018,255.981,0,165,0z M165,300c-74.439,0-135-60.561-135-135S90.561,30,165,30s135,60.561,135,135S239.439,300,165,300z"/><path d="M211.667,127.121l-31.669,31.666V75c0-8.285-6.716-15-15-15c-8.284,0-15,6.715-15,15v83.787l-31.665-31.666c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.859-5.858,15.355,0,21.213l57.271,57.271c2.929,2.93,6.768,4.395,10.606,4.395c3.838,0,7.678-1.465,10.607-4.393l57.275-57.271c5.857-5.857,5.858-15.355,0.001-21.215C227.021,121.264,217.524,121.264,211.667,127.121z"/><path d="M195,240h-60c-8.284,0-15,6.715-15,15c0,8.283,6.716,15,15,15h60c8.284,0,15-6.717,15-15C210,246.715,203.284,240,195,240z"/></svg>`
const COVER_SVG = `<svg version="1.1"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 512 512"xmlns:xlink="http://www.w3.org/1999/xlink"enable-background="new 0 0 512 512"><path d="M480.6,11H31.4C20.1,11,11,20.1,11,31.4v449.2c0,11.3,9.1,20.4,20.4,20.4h449.2c11.3,0,20.4-9.1,20.4-20.4V31.4     C501,20.1,491.9,11,480.6,11z M460.2,51.8v133.8c-67.3,8.2-119.4,31.2-159.7,60.9C181.2,235.6,96.9,302,51.8,350.8V51.8H460.2z      M51.8,416.1c15-22.2,87-119,203.8-129.1c-58,63.7-79.4,139.1-86.5,173.1H51.8V416.1z M210.5,460.2     c12.7-58.1,63.5-208.3,249.7-233.4v233.4H210.5z"/><path d="m153.8,213.4c35.2,0 63.9-28.7 63.9-63.9 0-35.2-28.6-63.9-63.9-63.9-35.2,0-63.9,28.7-63.9,63.9 0.1,35.2 28.7,63.9 63.9,63.9zm0-86.9c12.7,0 23,10.3 23,23 0,12.7-10.3,23-23,23-12.7,0-23-10.3-23-23 0-12.7 10.3-23 23-23z"/></svg>`


function createButton(svg, title, disabled = false) {
    const button = document.createElement('button');
    button.className = 'ActionButton ControllerButton PlayerRepeatOnButton';
    button.innerHTML = svg;
    button.setAttribute('data-title', title);

    disabled && button.setAttribute('disabled', disabled);

    return button;
}


function insertButtonToVideoControllBar(button) {
    const playbackRateButton = document.querySelector('.ActionButton.PlaybackRateButton');
    const wrapper = playbackRateButton.parentElement;
    wrapper.insertBefore(button, playbackRateButton);
}


function createDownloadVideoButton() {
    const downloadButton = createButton(DOWNLOAD_SVG, '下载视频', true);
    insertButtonToVideoControllBar(downloadButton);

    return {
        setSrc: function (src) {
            downloadButton.removeAttribute('disabled');
            downloadButton.onclick = function () {
                window.open(src)
            };
        },
        disable: function () {
            downloadButton.setAttribute('disabled', true);
        }
    }
}




function createDownloadCoverButton() {
    const button = createButton(COVER_SVG, '下载封面');
    const thumbnailSizes = ['ogp', 'largeUrl', 'middleUrl', 'url', 'player',]

    insertButtonToVideoControllBar(button);

    const getCoverURL = () => {
        debugger
        const apiDOM = document.querySelector('#js-initial-watch-data')

        const thumbnail = JSON.parse(apiDOM.getAttribute('data-api-data'))['video']['thumbnail']

        for (const size of thumbnailSizes) {
            const url = thumbnail[size]
            if (url) {
                return url
            }
        }

    }

    const updateCoverURL = function () {
        const cover_url = getCoverURL();

        button.removeAttribute('disabled');

        button.onclick = () => {
            open(cover_url);
        }

        return cover_url;
    }

    return {
        updateCoverURL: updateCoverURL,
        disable: function () {
            button.setAttribute('disabled', true);
        }
    }
}


(function () {
    'use strict';
    const isHttp = localStorage.getItem(IS_HLS_DISABLED);

    if (isHttp === null || isHttp === 'false') {
        localStorage.setItem(IS_HLS_DISABLED, 'true');
        location.reload();
    }


    const downloadCoverButton = createDownloadCoverButton();
    const downloadVideoButton = createDownloadVideoButton();

    // 循环判断 cover_url 是否存在
    const updateCoverURL = () => {
        const cover_url = downloadCoverButton.updateCoverURL();

        if (!cover_url) {
            setTimeout(updateCoverURL, 10);
        }
    }

    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            const target = mutation.target;
            if (mutation.attributeName === 'src') {
                if (target.src) {
                    downloadVideoButton.setSrc(target.src);
                    updateCoverURL();
                } else {
                    downloadVideoButton.disable();
                    downloadCoverButton.disable();
                }
            }
        }
    });


    const bindVideoObserver = () => {
        const video = document.querySelector('#MainVideoPlayer > video');
        if (video === null) {
            setTimeout(bindVideoObserver, 10);
        } else {
            observer.observe(video, {
                attributes: true
            });
        }
    }

    bindVideoObserver();
})();