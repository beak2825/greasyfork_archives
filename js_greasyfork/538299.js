// ==UserScript==
// @name         Unlimited_downloader_with_button
// @name:zh-CN   无限制下载器（带按钮控制）
// @namespace    ooooooooo.io
// @version      0.2.0
// @description  Get video and audio binary streams directly with manual download button
// @description:zh-Cn  直接获取视频和音频二进制流，带手动下载按钮
// @author       dabaisuv
// @match        *://*/*
// @exclude      https://mail.qq.com/*
// @exclude      https://wx.mail.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/538299/Unlimited_downloader_with_button.user.js
// @updateURL https://update.greasyfork.org/scripts/538299/Unlimited_downloader_with_button.meta.js
// ==/UserScript==

(function () {
   'use strict';
   console.log(`Unlimited_downloader: begin......${location.href}`);

   // 设置为0禁用自动下载，设置为1启用自动下载
   window.autoDownload = 0;
   
   window.isComplete = 0;
   window.audio = [];
   window.video = [];
   window.downloadAll = 0;
   window.quickPlay = 1.0;

   const _endOfStream = window.MediaSource.prototype.endOfStream
   window.MediaSource.prototype.endOfStream = function () {
      window.isComplete = 1;
      console.log('媒体流播放完成');
      return _endOfStream.apply(this, arguments)
   }

   const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
   window.MediaSource.prototype.addSourceBuffer = function (mime) {
      console.log("MediaSource.addSourceBuffer ", mime)
      if (mime.toString().indexOf('audio') !== -1) {
         window.audio = [];
         console.log('audio array cleared.');
      } else if (mime.toString().indexOf('video') !== -1) {
         window.video = [];
         console.log('video array cleared.');
      }
      let sourceBuffer = _addSourceBuffer.call(this, mime)
      const _append = sourceBuffer.appendBuffer
      sourceBuffer.appendBuffer = function (buffer) {
         console.log(mime, buffer);
         if (mime.toString().indexOf('audio') !== -1) {
            window.audio.push(buffer);
         } else if (mime.toString().indexOf('video') !== -1) {
            window.video.push(buffer)
         }
         _append.call(this, buffer)
      }
      return sourceBuffer
   }

   function download() {
      if (window.audio.length === 0 && window.video.length === 0) {
         alert('没有检测到音视频数据，请确保媒体已开始播放');
         return;
      }
      
      let downloadCount = 0;
      
      if (window.audio.length > 0) {
         let a = document.createElement('a');
         a.href = window.URL.createObjectURL(new Blob(window.audio));
         a.download = 'audio_' + document.title + '.mp4';
         a.click();
         downloadCount++;
      }
      
      if (window.video.length > 0) {
         let a = document.createElement('a');
         a.href = window.URL.createObjectURL(new Blob(window.video));
         a.download = 'video_' + document.title + '.mp4';
         a.click();
         downloadCount++;
      }
      
      console.log(`已下载 ${downloadCount} 个文件`);
      window.downloadAll = 0;
      window.isComplete = 0;
   }

   // 创建下载按钮
   function createDownloadButton() {
      // 创建按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
         position: fixed;
         top: 20px;
         right: 20px;
         z-index: 99999;
         background: rgba(0,0,0,0.8);
         padding: 10px;
         border-radius: 5px;
         font-family: Arial, sans-serif;
      `;
      
      // 下载按钮
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = '下载媒体';
      downloadBtn.style.cssText = `
         background: #4CAF50;
         color: white;
         border: none;
         padding: 8px 16px;
         margin: 2px;
         border-radius: 3px;
         cursor: pointer;
         font-size: 12px;
      `;
      downloadBtn.onclick = download;
      
      // 自动下载切换按钮
      const autoBtn = document.createElement('button');
      autoBtn.textContent = window.autoDownload ? '自动:开' : '自动:关';
      autoBtn.style.cssText = `
         background: ${window.autoDownload ? '#FF9800' : '#757575'};
         color: white;
         border: none;
         padding: 8px 16px;
         margin: 2px;
         border-radius: 3px;
         cursor: pointer;
         font-size: 12px;
      `;
      autoBtn.onclick = function() {
         window.autoDownload = window.autoDownload ? 0 : 1;
         this.textContent = window.autoDownload ? '自动:开' : '自动:关';
         this.style.background = window.autoDownload ? '#FF9800' : '#757575';
         console.log('自动下载:', window.autoDownload ? '启用' : '禁用');
      };
      
      // 状态显示
      const statusDiv = document.createElement('div');
      statusDiv.style.cssText = `
         color: white;
         font-size: 10px;
         margin-top: 5px;
      `;
      
      buttonContainer.appendChild(downloadBtn);
      buttonContainer.appendChild(autoBtn);
      buttonContainer.appendChild(statusDiv);
      
      // 更新状态显示
      setInterval(() => {
         statusDiv.innerHTML = `
            音频片段: ${window.audio.length}<br>
            视频片段: ${window.video.length}<br>
            播放完成: ${window.isComplete ? '是' : '否'}
         `;
      }, 1000);
      
      return buttonContainer;
   }

   // 页面加载完成后添加按钮
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
         document.body.appendChild(createDownloadButton());
      });
   } else {
      setTimeout(() => {
         document.body.appendChild(createDownloadButton());
      }, 1000);
   }

   // 自动下载检查
   if (window.autoDownload === 1) {
      setInterval(() => {
         if (window.isComplete === 1) {
            download();
         }
      }, 2000);
   }

   // 手动下载检查
   setInterval(() => {
      if (window.downloadAll === 1) {
         download();
      }
   }, 2000);

   // 移除iframe沙箱限制
   (function (that) {
      let removeSandboxInterval = setInterval(() => {
         if (that.document.querySelectorAll('iframe')[0] !== undefined) {
            that.document.querySelectorAll('iframe').forEach((v, i, a) => {
               let ifr = v;
               ifr.removeAttribute('sandbox');
               const parentElem = that.document.querySelectorAll('iframe')[i].parentElement;
               a[i].remove();
               parentElem.appendChild(ifr);
            });
            clearInterval(removeSandboxInterval);
         }
      }, 1000);
   })(window);

})();