// ==UserScript==
// @name         myself-bbs_snipping
// @name:zh-TW   myself-bbs擷圖
// @version      1.0.1
// @description  snip picture from "myself-bbs" video
// @description:zh-TW "myself-bbs" 影片擷圖
// @author       AndyTLemon
// @match        *://v.myself-bbs.com/player/*
// @match        *://myself-bbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myself-bbs.com
// @grant        none
// @license      GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1193722
// @downloadURL https://update.greasyfork.org/scripts/477198/myself-bbs_snipping.user.js
// @updateURL https://update.greasyfork.org/scripts/477198/myself-bbs_snipping.meta.js
// ==/UserScript==

const add_button = `<button style="cursor:pointer;" id="cap-button" class="vjs-control vjs-button" type="button"><svg version="1.1" viewBox="0 0 36 36" height="100%" width="100%" onclick="download_image()"><path id="screenshot" d="M 26.079999,10.02 H 22.878298 L 21.029999,8 h -6.06 l -1.8483,2.02 H 9.9200015 c -1.111,0 -2.02,0.909 -2.02,2.02 v 12.12 c 0,1.111 0.909,2.02 2.02,2.02 H 26.079999 c 1.111,0 2.019999,-0.909 2.019999,-2.02 V 12.04 c 0,-1.111 -0.909,-2.02 -2.019999,-2.02 z m 0,14.14 H 9.9200015 V 12.04 h 4.0904965 l 1.8483,-2.02 h 4.2824 l 1.8483,2.02 h 4.0905 z m -8.08,-11.11 c -2.7876,0 -5.05,2.2624 -5.05,5.05 0,2.7876 2.2624,5.05 5.05,5.05 2.7876,0 5.049999,-2.2624 5.049999,-5.05 0,-2.7876 -2.262399,-5.05 -5.049999,-5.05 z m 0,8.08 c -1.6665,0 -3.03,-1.3635 -3.03,-3.03 0,-1.6665 1.3635,-3.03 3.03,-3.03 1.6665,0 3.03,1.3635 3.03,3.03 0,1.6665 -1.3635,3.03 -3.03,3.03 z" fill="white"></path></svg></button>`

function image_filename(){
    //const animename = document.querySelector("#pt > div > a:nth-child(9)").textContent.replace(/【.*$/, "");
    let currentTime = new Date().getTime();
    return `${currentTime}.png`
}

function image_data(){
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
}

function download_image() {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = image_filename();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 'image/png');
}

if (!window.download_image){
    window.download_image = download_image;
}

(function() {
    if (document.location.href.includes("://myself-bbs.com/")){
        return;
    }
    // 在指定元素後插入HTML
    var targetElement = document.querySelector("#my-video > div.vjs-control-bar > div.vjs-playback-rate.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button");
    targetElement.insertAdjacentHTML('beforebegin', add_button);

})();
