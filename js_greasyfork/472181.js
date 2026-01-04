// ==UserScript==
// @name         🔥【就是爽】某度网盘添加复制字幕按钮+导出doc按钮(360和chrome均已测试)
// @namespace    your-namespace
// @version      2.4
// @description  在某度网盘中添加复制字幕按钮，并实现复制字幕和导出为doc、srt的功能，按钮名字随操作状态变化（比如没有下载之前，按钮名字为复制字幕，复制后，按钮名字为字幕已复制）
// @license       Yolanda Morgan
// @author       Yolanda Morgan
// @match        https://pan.baidu.com/*
// @exclude       *://pan.baidu.com/disk/*
// @exclude       *://pan.baidu.com/s/*
// @grant        GM_download
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/472181/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E6%9F%90%E5%BA%A6%E7%BD%91%E7%9B%98%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E5%AD%97%E5%B9%95%E6%8C%89%E9%92%AE%2B%E5%AF%BC%E5%87%BAdoc%E6%8C%89%E9%92%AE%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472181/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E6%9F%90%E5%BA%A6%E7%BD%91%E7%9B%98%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E5%AD%97%E5%B9%95%E6%8C%89%E9%92%AE%2B%E5%AF%BC%E5%87%BAdoc%E6%8C%89%E9%92%AE%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建复制字幕按钮
  function createCopySubtitleButton() {
    const btn = document.createElement('button');
    btn.id = 'copySubtitleBtn';
    btn.innerText = '复制字幕';
    btn.style = 'position: fixed; left: 40px; bottom: 20px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; cursor: pointer;';
    // 复制字幕按钮点击事件处理函数
    btn.addEventListener('click', function() {
      const subtitleElements = document.querySelectorAll('.ai-draft__wrap-list p.ai-draft__p-paragraph'); // 获取所有段落元素
      const subtitleText = [];
      for (let i = 0; i < subtitleElements.length; i++) {
        subtitleText.push(subtitleElements[i].innerText.trim()); // 将每个段落的文本添加到字幕数组中
      }
      GM_setClipboard(subtitleText.join('\n\n')).then(function() {
        alert('字幕已复制');
      });
    });
    document.body.appendChild(btn);
  }

  // 创建导出文稿doc按钮
  function createExportToDocButton() {
    const btn = document.createElement('button');
    btn.id = 'exportToDocBtn';
    btn.innerText = '导出文稿doc';
    btn.style = 'position: fixed; left: 120px; bottom: 20px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; cursor: pointer;';
    // 导出文稿doc按钮点击事件处理函数
    btn.addEventListener('click', function() {
      const subtitleElements = document.querySelectorAll('.ai-draft__wrap-list p.ai-draft__p-paragraph'); // 获取所有段落元素
      const subtitleText = [];
      for (let i = 0; i < subtitleElements.length; i++) {
        subtitleText.push(subtitleElements[i].innerText.trim()); // 将每个段落的文本添加到字幕数组中
      }
      const subtitle = subtitleText.join('\n\n'); // 获取字幕内容
      const filename = getDefaultFilename('.doc');
      saveAs(new Blob([subtitle], {type: 'application/msword'}), filename); // 使用saveAs下载文件
      alert('导出成功');
    });
    document.body.appendChild(btn);
  }

  // 创建导出字幕srt按钮
  function createExportToSrtButton() {
    const btn = document.createElement('button');
    btn.id = 'exportToSrtBtn';
    btn.innerText = '导出字幕srt';
    btn.style = 'position: fixed; left: 220px; bottom: 20px; z-index: 9999; padding: 10px; background: #fff; border: 1px solid #ccc; cursor: pointer;';
    // 导出字幕srt按钮点击事件处理函数
    btn.addEventListener('click', function() {
      const subtitleElements = document.querySelectorAll('.ai-draft__wrap-list p.ai-draft__p-paragraph'); // 获取所有段落元素
      const subtitleText = [];
      for (let i = 0; i < subtitleElements.length; i++) {
        subtitleText.push(subtitleElements[i].innerText.trim()); // 将每个段落的文本添加到字幕数组中
      }
      const srtText = generateSrtText(subtitleText); // 生成srt格式的字幕文本
      const filename = getDefaultFilename('.srt');
      saveAs(new Blob([srtText], {type: 'application/octet-stream'}), filename); // 使用saveAs下载文件
      alert('导出成功');
    });
    document.body.appendChild(btn);
  }

  // 在页面加载完成后创建按钮
  window.addEventListener('load', function() {
    createCopySubtitleButton();
    createExportToDocButton();
    createExportToSrtButton();
  });

  // 获取默认文件名
  function getDefaultFilename(extension) {
    const videoNameElement = document.querySelector('div.vp-video-page-card span.is-playing.vp-video-page-card__video-name');
    if (videoNameElement) {
      const originalFilename = videoNameElement.innerText.trim();
      const newFilename = originalFilename.replace(/\.[^/.]+$/, '') + extension; // 去掉原始文件名的后缀，并添加新的后缀名
      return newFilename;
    }
    return 'subtitle' + extension;
  }

  // 生成srt格式的字幕文本
  function generateSrtText(subtitleText) {
    let srtText = '';
    for (let i = 0; i < subtitleText.length; i++) {
      const index = i + 1;
      const startTime = formatTime(i);
      const endTime = formatTime(i + 1);
      srtText += `${index}\n${startTime} --> ${endTime}\n${subtitleText[i]}\n\n`;
    }
    return srtText;
  }

  // 格式化时间为srt格式的时间字符串
  function formatTime(index) {
    const hours = Math.floor(index / 3600);
    const minutes = Math.floor((index % 3600) / 60);
    const seconds = index % 60;
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)},000`;
  }

  // 在小于10的数字前补零
  function padZero(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number.toString();
  }

})();
