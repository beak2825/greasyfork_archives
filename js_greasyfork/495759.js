// ==UserScript==
// @name         网页版酷狗音乐下载
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  网页版酷狗音乐下载，目前仅支持下载普通音质的非vip音乐，
// @author       Xie
// @match        *://www.kugou.com/**
// @license      使用说明：请看下方描述
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAADkhB4A5IQeWuSEHtjkhB7/5IQe/+SEHv/khB7/5IQe/+SEHv/khB7/5IQe/+SEHv/khB7/5IQe2OSEHlvkhB4A5IQeW+SEHv/khB7/5IQe/+SEHv/khB7Y5IQeh+SEHlvkhB5b5IQehuSEHtXkhB7/5IQe/+SEHv/khB7/5IQeW+SEHtXkhB7/5IQe/+SEHu/khB5c5IQeR+SEHqPkhB7R5IQe0uSEHqTkhB5H5IQeW+SEHu3khB7/5IQe/+SEHtTkhB775IQe/+SEHvTkhB455IQeqOSEHv/khB7/5IQe/+SEHv/khB7/5IQe/+SEHqzkhB445IQe8OSEHv/khB775IQe/+SEHv/khB5e5IQep+SEHv/khB7S5IQe2+SEHv/khB775IQezOSEHs/khB7/5IQeq+SEHlfkhB7/5IQe/+SEHv/khB7Y5IQeROSEHv/khB7/5IQeMeSEHjvkhB7/5IQeguSEHgDkhB6D5IQe/+SEHv/khB5G5IQe2OSEHv/khB7/5IQeiuSEHp/khB7/5IQe/+SEHknkhB4h5IQezeSEHgXkhB5I5IQe/eSEHv/khB7/5IQepOSEHorkhB7/5IQe/+SEHmLkhB7L5IQe/+SEHv/khB5j5IQeBuSEHjjkhB4V5IQe6+SEHv/khB7/5IQe/+SEHs7khB5j5IQe/+SEHv/khB5i5IQeyuSEHv/khB7/5IQefuSEHgDkhB4X5IQeHeSEHu7khB7/5IQe/+SEHv/khB7N5IQeZOSEHv/khB7/5IQejuSEHp7khB7/5IQe/+SEHpbkhB4A5IQeouSEHhbkhB4x5IQe7OSEHv/khB7/5IQep+SEHorkhB7/5IQe/+SEHtzkhB5C5IQe/+SEHv/khB6u5IQeAOSEHrTkhB7W5IQeGeSEHjDkhB7q5IQe/+SEHkfkhB7Z5IQe/+SEHv/khB7/5IQeY+SEHqXkhB7/5IQe8+SEHszkhB7t5IQe/+SEHunkhB7M5IQe5eSEHqrkhB5d5IQe/+SEHv/khB775IQe/+SEHvDkhB455IQep+SEHv/khB7/5IQe/+SEHv/khB7/5IQe/+SEHqrkhB455IQe8OSEHv/khB765IQe1OSEHv/khB7/5IQe8OSEHl/khB5H5IQeouSEHtDkhB7Q5IQeouSEHkvkhB5b5IQe7+SEHv/khB7/5IQe0+SEHlnkhB7/5IQe/+SEHv/khB7/5IQe2OSEHobkhB5e5IQeXOSEHojkhB7Y5IQe/+SEHv/khB7/5IQe/+SEHlnkhB4A5IQeWuSEHtbkhB7+5IQe/+SEHv/khB7/5IQe/+SEHv/khB7/5IQe/+SEHv/khB7+5IQe1uSEHlrkhB4AgAEAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAACAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495759/%E7%BD%91%E9%A1%B5%E7%89%88%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/495759/%E7%BD%91%E9%A1%B5%E7%89%88%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
  'use strict';

  if (!('speechSynthesis' in window)) {
    throw alert("对不起，您的浏览器不支持")
  }

  setTimeout(function() {
    var audioElement = document.getElementById('myAudio');
    if (!audioElement) {
      console.log('没用找到音频元素，无法下载')
      return;
    }


    // 使用MutationObserver来监视src属性的变化
    const observer = new MutationObserver(mutationsList => {
      for(let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          // 检查是否存在 id 为 "downloadLink" 的元素，如果存在则删除
          var existingDownloadLink = document.getElementById('downloadLink-parent');
          if (existingDownloadLink) {
            existingDownloadLink.parentNode.removeChild(existingDownloadLink);
          }
          setTimeout(function() {
            loadButton();
          }, 500);
          break;
        }
      }
    });

    // 监听音频元素的src属性变化
    observer.observe(audioElement, { attributes: true });

    loadButton();
  }, 1500);

  function loadButton() {
    var audioElement = document.getElementById('myAudio');
    if (!audioElement) {
      console.log('没用找到音频元素，无法下载')
      return;
    }

    // 创建一个新的div元素
    const floatingDiv = document.createElement("div");
    floatingDiv.setAttribute('id', 'downloadLink-parent');
    floatingDiv.innerHTML = `
        <div id="xie-msg"></div>
        <div id="downloadLink"></div>
      <style>
      #downloadLink-parent {
        position: fixed;
        bottom: 0px;
        right: 20px;
        text-decoration: none;
        z-index: 99999;
        height: 80px;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }
      #xie-msg {
        padding: 3px 10px;
        color: #fff;
      }
      #downloadLink {
        padding: 10px 20px;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #fff;
        background-color: #448d2c;
      }

      #downloadLink:hover {
        filter: brightness(1.5); /* 改变亮度以更改整个SVG的颜色 */
        transition: filter 0.3s; /* 添加过渡效果 */
      }
    </style>

  `;
    document.body.appendChild(floatingDiv);
    // 获得音频下载地址
    var audioSource = audioElement.src;


    // 获取音频文件名
    var nameEle = document.querySelector('#songName');
    if (nameEle == null) {
      nameEle = document.querySelector('.audioName');
    }
    var songNameText = (nameEle != null ? nameEle.textContent : '未知') + '.mp3';

    const downloadLink = document.getElementById("downloadLink");
    // 音频地址含part，表示不是完整的
    if (audioSource.indexOf('part') >= 0) {
      // 设置背景色为红色
      downloadLink.style.backgroundColor = "#8d332c";
      let msgEle = document.getElementById("xie-msg");
      let msg = "注意：这首歌可能只能试听一分钟，无法完整下载";
      msgEle.textContent = msg;
      downloadLink.title = msg;
    }
    // 设置 <div> 标签的文本内容
    downloadLink.textContent = "点击下载：" + truncateText(songNameText, 25);
    console.log("下载地址：", audioSource)
    console.log("文件名称：", songNameText)

    downloadLink.addEventListener('click', function (event) {
      downFile(audioSource, songNameText)
    });
  }

  var downIng = false;
  
  function downFile(url, name) {
    if (downIng) {
      alert("正在下载中，请稍后")
      return;
    }
    // 创建一个 XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();

    downIng = true;
    try {
      // 监听 XMLHttpRequest 的 readyState 属性的变化
      xhr.onreadystatechange = function () {
        // 当 readyState 变为 4 且状态码为 200 时表示请求成功
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // 获取服务器响应的数据
            var responseData = xhr.response;

            // 创建一个新的 <a> 标签用于下载
            let aEle = document.createElement('a');
            aEle.href = window.URL.createObjectURL(responseData);
            aEle.download = name; // 设置文件名
            document.body.appendChild(aEle);

            // 触发点击事件，开始下载文件
            aEle.click();

            // 下载完成后移除链接元素
            document.body.removeChild(aEle);
            downIng = false
          }
          else {
            downIng = false
            alert('下载失败!!!\n\n请在新窗口的播放栏单击鼠标右键，选择“将音频另存为”\n\n注意：文件名称已经自动复制到剪切板，下载修改文件名称时直接粘贴即可(Ctrl + V)\n\n如果没有发现新标签，请注意当前窗口地址栏是否有被阻止的提醒');
            // 将文件名称复制到剪切板
            var textarea = document.createElement('textarea');
            textarea.value = name;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            // 打开新窗口
            window.open(url, '_blank');
          }
        }
      };
      // 发送 HTTP GET 请求
      xhr.open('GET', url, true);
      xhr.responseType = 'blob'; // 设置响应类型为 blob
      xhr.send();
    } catch (e) {
      
    } finally {
      downIng = false
    }
  }
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text; // 如果文本长度小于等于最大长度，直接返回原文本
    } else {
      const startLength = Math.ceil((maxLength - 3) / 2); // 开头保留的字符数
      const endLength = Math.floor((maxLength - 3) / 2); // 结尾保留的字符数
      return text.slice(0, startLength) + '...' + text.slice(text.length - endLength); // 将开头和结尾的字符拼接在一起，中间用省略号表示
    }
  }
})();
