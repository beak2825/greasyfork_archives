// ==UserScript==
// @name         myppt 下載
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  此腳本僅供學術目的使用, 切勿用於非法行為.
// @author       dylan
// @match        https://myppt.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myppt.cc
// @grant        none
// @run-at       document-start
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/461780/myppt%20%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/461780/myppt%20%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(function() {
    console.log("解除右鍵限制")
    // 解除右鍵限制
    document.addEventListener('contextmenu', function(event) {
        event.stopPropagation();
    }, true);
})();

// 下載圖片或視頻
function downloadMedia() {
  // 獲取圖片和視頻元素
  var imgURL = document.getElementById('preview_img');
  var videoURL = document.getElementById('my_video_html5_api');
  let link = ''
  if (imgURL) {
    // 創建下載鏈接
    imgURL = imgURL.src;
    link = document.createElement('a');
    link.href = imgURL;
    link.download = imgURL.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (videoURL) {
    // 創建下載鏈接
    videoURL = videoURL.src;
    link = document.createElement('a');
    link.href = videoURL;
    link.download = videoURL.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 創建下載按鈕
var downloadBtn = document.createElement('button');
downloadBtn.innerHTML = '下載';
downloadBtn.style.position = 'fixed';
downloadBtn.style.bottom = '20px';
downloadBtn.style.right = '20px';
downloadBtn.style.backgroundColor = '#4CAF50';
downloadBtn.style.border = 'none';
downloadBtn.style.color = 'white';
downloadBtn.style.padding = '10px 20px';
downloadBtn.style.textAlign = 'center';
downloadBtn.style.textDecoration = 'none';
downloadBtn.style.display = 'inline-block';
downloadBtn.style.fontSize = '16px';
downloadBtn.onclick = downloadMedia;
document.body.appendChild(downloadBtn);

