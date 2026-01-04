// ==UserScript==
// @name         Smart_Video_Downloader
// @name:zh-CN   智能视频下载器
// @namespace    ooooooooo.io
// @version      0.3.0
// @description  Smart video downloader that only shows when video is detected, with hover to expand UI
// @description:zh-Cn  智能检测视频并显示悬浮下载器，鼠标悬停展开界面
// @author       dabaisuv
// @match        *://*/*
// @exclude      https://mail.qq.com/*
// @exclude      https://wx.mail.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538300/Smart_Video_Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538300/Smart_Video_Downloader.meta.js
// ==/UserScript==

(function () {
   'use strict';
   console.log(`Smart Video Downloader: 开始监听...${location.href}`);

   // 配置
   window.autoDownload = 0;
   window.isComplete = 0;
   window.audio = [];
   window.video = [];
   window.downloadAll = 0;
   window.hasMediaSource = false;
   window.downloadButton = null;

   const _endOfStream = window.MediaSource.prototype.endOfStream
   window.MediaSource.prototype.endOfStream = function () {
      window.isComplete = 1;
      console.log('媒体流播放完成');
      updateButtonStatus();
      return _endOfStream.apply(this, arguments)
   }

   const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
   window.MediaSource.prototype.addSourceBuffer = function (mime) {
      console.log("检测到媒体源:", mime);
      
      // 首次检测到媒体源时显示按钮
      if (!window.hasMediaSource) {
         window.hasMediaSource = true;
         showDownloadButton();
      }
      
      if (mime.toString().indexOf('audio') !== -1) {
         window.audio = [];
         console.log('音频缓存已清空');
      } else if (mime.toString().indexOf('video') !== -1) {
         window.video = [];
         console.log('视频缓存已清空');
      }
      
      let sourceBuffer = _addSourceBuffer.call(this, mime)
      const _append = sourceBuffer.appendBuffer
      sourceBuffer.appendBuffer = function (buffer) {
         if (mime.toString().indexOf('audio') !== -1) {
            window.audio.push(buffer);
         } else if (mime.toString().indexOf('video') !== -1) {
            window.video.push(buffer)
         }
         updateButtonStatus();
         _append.call(this, buffer)
      }
      return sourceBuffer
   }

   function download() {
      if (window.audio.length === 0 && window.video.length === 0) {
         showNotification('没有检测到音视频数据，请确保媒体已开始播放', 'warning');
         return;
      }
      
      let downloadCount = 0;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      
      if (window.audio.length > 0) {
         let a = document.createElement('a');
         a.href = window.URL.createObjectURL(new Blob(window.audio));
         a.download = `audio_${document.title || 'untitled'}_${timestamp}.mp4`;
         a.click();
         downloadCount++;
      }
      
      if (window.video.length > 0) {
         let a = document.createElement('a');
         a.href = window.URL.createObjectURL(new Blob(window.video));
         a.download = `video_${document.title || 'untitled'}_${timestamp}.mp4`;
         a.click();
         downloadCount++;
      }
      
      showNotification(`已下载 ${downloadCount} 个文件`, 'success');
      window.downloadAll = 0;
      window.isComplete = 0;
   }

   function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.style.cssText = `
         position: fixed;
         top: 70px;
         right: 20px;
         z-index: 100000;
         padding: 12px 20px;
         border-radius: 6px;
         color: white;
         font-size: 14px;
         font-family: Arial, sans-serif;
         box-shadow: 0 4px 12px rgba(0,0,0,0.3);
         animation: slideIn 0.3s ease-out;
         background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
      `;
      
      // 添加动画样式
      if (!document.getElementById('notification-style')) {
         const style = document.createElement('style');
         style.id = 'notification-style';
         style.textContent = `
            @keyframes slideIn {
               from { transform: translateX(100%); opacity: 0; }
               to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
               from { transform: translateX(0); opacity: 1; }
               to { transform: translateX(100%); opacity: 0; }
            }
         `;
         document.head.appendChild(style);
      }
      
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
         notification.style.animation = 'slideOut 0.3s ease-in forwards';
         setTimeout(() => notification.remove(), 300);
      }, 3000);
   }

   function createDownloadButton() {
      // 主容器
      const container = document.createElement('div');
      container.id = 'video-downloader-widget';
      container.style.cssText = `
         position: fixed;
         top: 20px;
         right: 20px;
         z-index: 99999;
         font-family: Arial, sans-serif;
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      // 主按钮（圆点）
      const mainButton = document.createElement('div');
      mainButton.style.cssText = `
         width: 50px;
         height: 50px;
         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
         border-radius: 50%;
         cursor: pointer;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
         transition: all 0.3s ease;
         position: relative;
      `;
      
      // 下载图标
      mainButton.innerHTML = `
         <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
         </svg>
      `;
      
      // 展开面板
      const expandPanel = document.createElement('div');
      expandPanel.style.cssText = `
         position: absolute;
         top: 0;
         right: 60px;
         background: rgba(0, 0, 0, 0.9);
         border-radius: 10px;
         padding: 15px;
         min-width: 200px;
         opacity: 0;
         visibility: hidden;
         transform: translateX(20px);
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         backdrop-filter: blur(10px);
         border: 1px solid rgba(255, 255, 255, 0.1);
      `;
      
      // 箭头
      const arrow = document.createElement('div');
      arrow.style.cssText = `
         position: absolute;
         top: 20px;
         right: -8px;
         width: 0;
         height: 0;
         border-top: 8px solid transparent;
         border-bottom: 8px solid transparent;
         border-left: 8px solid rgba(0, 0, 0, 0.9);
      `;
      expandPanel.appendChild(arrow);
      
      // 状态显示
      const statusDiv = document.createElement('div');
      statusDiv.style.cssText = `
         color: #fff;
         font-size: 12px;
         margin-bottom: 10px;
         line-height: 1.4;
      `;
      
      // 下载按钮
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = '⬇️ 立即下载';
      downloadBtn.style.cssText = `
         background: linear-gradient(135deg, #4CAF50, #45a049);
         color: white;
         border: none;
         padding: 8px 16px;
         margin: 2px 0;
         border-radius: 5px;
         cursor: pointer;
         font-size: 12px;
         width: 100%;
         transition: all 0.2s ease;
      `;
      downloadBtn.onmouseover = () => downloadBtn.style.transform = 'scale(1.05)';
      downloadBtn.onmouseout = () => downloadBtn.style.transform = 'scale(1)';
      downloadBtn.onclick = download;
      
      // 自动下载切换
      const autoBtn = document.createElement('button');
      autoBtn.style.cssText = `
         color: white;
         border: 1px solid rgba(255, 255, 255, 0.3);
         padding: 6px 12px;
         margin: 2px 0;
         border-radius: 5px;
         cursor: pointer;
         font-size: 11px;
         width: 100%;
         transition: all 0.2s ease;
      `;
      
      function updateAutoButton() {
         autoBtn.textContent = window.autoDownload ? '🔄 自动下载: 开' : '⏸️ 自动下载: 关';
         autoBtn.style.background = window.autoDownload ? 
            'linear-gradient(135deg, #FF9800, #F57C00)' : 
            'rgba(255, 255, 255, 0.1)';
      }
      updateAutoButton();
      
      autoBtn.onclick = function() {
         window.autoDownload = window.autoDownload ? 0 : 1;
         updateAutoButton();
         showNotification(`自动下载已${window.autoDownload ? '开启' : '关闭'}`, 'info');
      };
      
      expandPanel.appendChild(statusDiv);
      expandPanel.appendChild(downloadBtn);
      expandPanel.appendChild(autoBtn);
      
      container.appendChild(mainButton);
      container.appendChild(expandPanel);
      
      // 悬停事件
      container.onmouseenter = () => {
         expandPanel.style.opacity = '1';
         expandPanel.style.visibility = 'visible';
         expandPanel.style.transform = 'translateX(0)';
         mainButton.style.transform = 'scale(1.1)';
         mainButton.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.4)';
      };
      
      container.onmouseleave = () => {
         expandPanel.style.opacity = '0';
         expandPanel.style.visibility = 'hidden';
         expandPanel.style.transform = 'translateX(20px)';
         mainButton.style.transform = 'scale(1)';
         mainButton.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
      };
      
      // 更新状态函数
      window.updateButtonStatus = () => {
         if (statusDiv) {
            const audioSize = window.audio.reduce((sum, buffer) => sum + buffer.byteLength, 0);
            const videoSize = window.video.reduce((sum, buffer) => sum + buffer.byteLength, 0);
            
            statusDiv.innerHTML = `
               <div style="font-weight: bold; margin-bottom: 5px;">📊 缓存状态</div>
               🎵 音频: ${window.audio.length} 片段 (${(audioSize/1024/1024).toFixed(1)}MB)<br>
               🎬 视频: ${window.video.length} 片段 (${(videoSize/1024/1024).toFixed(1)}MB)<br>
               ✅ 播放完成: ${window.isComplete ? '是' : '否'}
            `;
            
            // 更新主按钮颜色
            if (window.audio.length > 0 || window.video.length > 0) {
               mainButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            } else {
               mainButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
         }
      };
      
      return container;
   }

   function showDownloadButton() {
      if (window.downloadButton) return; // 防止重复创建
      
      window.downloadButton = createDownloadButton();
      document.body.appendChild(window.downloadButton);
      console.log('视频下载器已激活');
      
      // 初始状态更新
      updateButtonStatus();
      
      // 定时更新状态
      setInterval(updateButtonStatus, 2000);
   }

   function updateButtonStatus() {
      // 这个函数会在创建按钮时被重新定义
   }

   // 自动下载检查
   setInterval(() => {
      if (window.autoDownload === 1 && window.isComplete === 1) {
         download();
      }
   }, 2000);

   // 手动下载检查
   setInterval(() => {
      if (window.downloadAll === 1) {
         download();
      }
   }, 2000);

   // 快捷键支持 (Ctrl+Shift+D)
   document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D' && window.hasMediaSource) {
         e.preventDefault();
         download();
      }
   });

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