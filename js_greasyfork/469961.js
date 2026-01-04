// ==UserScript==
// @name         首个视频下载
// @namespace    https://leochan.me
// @version      1.3.2
// @description  网页里面首个视频
// @author       Leo
// @license      GPLv2
// @match        *://*/*
// @require      https://greasyfork.org/scripts/470018-%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E6%8F%90%E9%86%92%E8%83%BD%E5%8A%9B/code/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E6%8F%90%E9%86%92%E8%83%BD%E5%8A%9B.js?version=1214590
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/469961/%E9%A6%96%E4%B8%AA%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/469961/%E9%A6%96%E4%B8%AA%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var downloadVideoCheckTime = 0;
    var downloadVideoInterval = null;
    function downloadVideoByAria(videoUrl, fileName){
        if (videoUrl.indexOf('blob:') === 0 && unsafeWindow.location.href.indexOf('xiaohongshu.com') !== -1){
            if(unsafeWindow.__INITIAL_STATE__.note.noteDetailMap){
                const noteDetailMapKeys = Object.keys(unsafeWindow.__INITIAL_STATE__.note.noteDetailMap);
                const noteID = noteDetailMapKeys[0];
                videoUrl = unsafeWindow.__INITIAL_STATE__.note.noteDetailMap[noteID].note.video.media.stream.h264[0].backupUrls[0];
            }else{
                videoUrl = unsafeWindow.__INITIAL_STATE__.note.note._rawValue.video.media.stream.h264[0].backupUrls[0];
            }
        }
        fetch('http://localhost:16800/jsonrpc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc:'2.0',
                id: fileName,
                method: 'aria2.addUri',
                params: [[videoUrl]]
            })
        }).then(() => {
            webPageShowMessage('提交成功');
        }).catch(() => {
            webPageShowMessage('提交失败，请检查是否已经启动下载软件');
        });
    }

    function downloadVideoSaveAction(url, fileName) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
          if (xhr.status === 200) {
            var blob = new Blob([xhr.response], { type: 'video/mp4' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        };
        xhr.send();
      }

    function downloadVideoInsertButton(){
        var videoElement = document.querySelector('video');
        if(videoElement){
            var button = document.createElement('button');
            button.innerHTML = '下载';
            button.id = 'leo-download-btn';
            button.style.cssText = 'position:fixed;z-index:99999999;top:10px;left:50%;margin-left:-34px;display:flex;align-items:center;justify-content:center;border-radius:18px;width:68px;height:36px;background:#ff2442;font-weight:500;font-size:14px;color:#fff;cursor:pointer;';
            button.addEventListener('click', () => {
                downloadVideoByAria(videoElement.src || (videoElement.querySelector('source').getAttribute('src').indexOf('http') === 0 ? '' : 'https:') + videoElement.querySelector('source').getAttribute('src'), new Date().getTime() + '.mp4');
            });
            document.body.appendChild(button);
            return true;
        }
        return false;
    }
    function downloadVideoCreateButton(){
        if(downloadVideoInterval){
            clearInterval(downloadVideoInterval);
            downloadVideoInterval = null;
        }
        var downloadElement = document.querySelector('#leo-download-btn');
        if(downloadElement){
            document.body.removeChild(downloadElement);
        }
        downloadVideoCheckTime = 0;
        downloadVideoInterval = setInterval(() => {
            var verifyResult = downloadVideoInsertButton();
            if(verifyResult || downloadVideoCheckTime >= 120){
                clearInterval(downloadVideoInterval);
                downloadVideoInterval = null;
                downloadVideoCheckTime = 0;
            }
            downloadVideoCheckTime++;
        }, 1000);
    }
    function downloadVideoAddWindowEventListener(){
        var originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            downloadVideoCreateButton();
        };
        var originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            downloadVideoCreateButton();
        };
        window.addEventListener('popstate', () => {
            downloadVideoCreateButton();
        });
    }
    downloadVideoAddWindowEventListener();
})();