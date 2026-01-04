// ==UserScript==
// @name         自动下载腾讯文字转音频文件
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Auto download tx tts audio file.
// @author       SunIBAS
// @match        https://zenvideo.qq.com/smart/tts/ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507660/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%85%BE%E8%AE%AF%E6%96%87%E5%AD%97%E8%BD%AC%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/507660/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%85%BE%E8%AE%AF%E6%96%87%E5%AD%97%E8%BD%AC%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取 audio 元素
// var audio = document.getElementsByTagName('audio')[0];

// document.createElement("audio")

function setStyle(dom, styles) {
    for (let i in styles) {
        dom.style[i] = styles[i];
    }
}
function createControlBar() {
    const div = window.oldCreateElement("div");
    const style = {
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        width: '80px',
        height: '80px',
        background: '#dddbdb',
        zIndex: '1000000000000',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '15px',
        textAlign: 'center',
        gap: '1px',
        color: '#3F51B5',
        fontWeight: 'bold',
    };
    setStyle(div, style);
    div.innerHTML = `
<div tar="up" style="flex:1;background: blanchedalmond;cursor: pointer;">+</div>
<div tar="show" style="flex:1;background: blanchedalmond;">0</div>
<div tar="down" style="flex:1;background: blanchedalmond;cursor: pointer;">-</div>`;
    document.body.append(div);
    new Array(...div.getElementsByTagName('div')).forEach(div => {
        const tar = div.getAttribute('tar');
        if (tar === 'show') {
            div.innerText = window.getAudioDownloadTimes.getTime();
            window.getAudioDownloadTimes.setShowTimeDom(div);
        } else {
            div.onclick = function() {
                const tar = this.getAttribute('tar');
                let add = 1;
                if (tar === 'up') {} else {
                    add = -1;
                }
                let newTime = window.getAudioDownloadTimes.getTime() + add;
                window.getAudioDownloadTimes.set(newTime);
            };
        }
    });
}
window.oldCreateElement = document.createElement.bind(document);
window.getAudioDownloadTimes = (function () {
    let time = 0;
    let zeros = '0000';
    let showTimeDom = {
        innerText: '',
    };
    return {
        setShowTimeDom(dom) {
            showTimeDom = dom;
        },
        get(aTime = 1) {
            time += aTime;
            showTimeDom.innerText = time;
            let currentLen = Math.ceil(Math.log(time) / Math.log(10));
            currentLen = currentLen || 1;
            return zeros.slice(currentLen) + time;
        },
        set(_time) {
            time = _time;
            showTimeDom.innerText = time;
        },
        getTime() {
            return time;
        }
    };
})();
document.createElement = function (tag) {
    if (tag === "audio") {
        const audio = window.oldCreateElement(tag);
        const oldLoad = audio.load.bind(audio);
        audio.load = function () {
            fetch(this.src)
                .then(response => response.blob())
                .then(blob => {
                    // 创建一个临时的 <a> 元素
                    var downloadLink = document.createElement('a');
                    var url = URL.createObjectURL(blob);

                    // 设置下载链接的 href 为生成的 blob URL
                    downloadLink.href = url;

                    // 设置下载文件的名称
                    downloadLink.download = `${window.getAudioDownloadTimes.get()}_audio.mp3`; // 可以根据需要修改文件名和扩展名

                    // 将链接插入到 DOM 并触发下载
                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    // 移除临时链接
                    document.body.removeChild(downloadLink);

                    // 释放 URL 对象
                    URL.revokeObjectURL(url);
                    oldLoad();
                })
                .catch(error => {
                    console.error('音频下载失败:', error);
                    oldLoad();
                });
        };
        return audio;
    } else {
        return window.oldCreateElement(tag);
    }
};
createControlBar();

})();