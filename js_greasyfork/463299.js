// ==UserScript==
// @name         JS 下载云听电台往期音频
// @namespace    https://www.radio.cn/
// @version      1.71
// @description  一键下载当前页面所有录音文件，显示下载失败的文件，显示整个网页的爬取状况
// @match        https://www.radio.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463299/JS%20%E4%B8%8B%E8%BD%BD%E4%BA%91%E5%90%AC%E7%94%B5%E5%8F%B0%E5%BE%80%E6%9C%9F%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463299/JS%20%E4%B8%8B%E8%BD%BD%E4%BA%91%E5%90%AC%E7%94%B5%E5%8F%B0%E5%BE%80%E6%9C%9F%E9%9F%B3%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    }

    function downloadAll() {
        const downloadLinks = [];
        for (const a of document.getElementsByTagName('a')) {
            if (!a.hasAttribute('onclick')) continue;
            const onclick = a.getAttribute('onclick');
            const matches = onclick.match(/downLiveRecord\(['"](.*?)['"]/);
            if (matches) {
                let href = matches[1].replace(/\[|\]|"/g, '');
                const dateMatch = href.match(/\/(\d{4})(\d{2})(\d{2})\//);
                if (dateMatch) {
                    const dateStr = dateMatch[1] + '-' + dateMatch[2] + '-' + dateMatch[3];
                    const fileName = formatDate(dateStr) + '.mp3';
                    if (href.startsWith('https://')) {
                        downloadLinks.push({href: href, fileName: fileName});
                    } else {
                        href = 'https://' + href.replace(/^http:\/\//i, '');
                        downloadLinks.push({href: href, fileName: fileName});
                    }
                }
            }
        }

        downloadLinks.sort(function(a, b){
            return a.fileName.localeCompare(b.fileName);
        });

        const progressEl = document.createElement('div');
        progressEl.style.position = 'fixed';
        progressEl.style.bottom = '100px';
        progressEl.style.right = '50px';
        progressEl.style.padding = '10px 20px';
        progressEl.style.fontSize = '16px';
        progressEl.style.borderRadius = '5px';
        progressEl.style.color = '#fff';
        progressEl.style.backgroundColor = '#f00';
        progressEl.style.cursor = 'default';
        document.body.appendChild(progressEl);

        const currentProgressEl = document.createElement('div');
        currentProgressEl.style.position = 'fixed';
        currentProgressEl.style.bottom = '160px';
        currentProgressEl.style.right = '50px';
        currentProgressEl.style.width = '200px';
        currentProgressEl.style.padding = '10px 20px';
        currentProgressEl.style.fontSize = '16px';
        currentProgressEl.style.borderRadius = '5px';
        currentProgressEl.style.color = '#fff';
        currentProgressEl.style.backgroundColor = '#009688';
        currentProgressEl.style.cursor = 'default';
        currentProgressEl.style.display = 'none';
        document.body.appendChild(currentProgressEl);


        let downloadCount = 0;
// 创建新的绿色按钮元素
const greenButton = document.createElement('button');
greenButton.textContent = '下载失败的文件';
greenButton.style.position = 'fixed';
greenButton.style.bottom = '150px';
greenButton.style.right = '50px';
greenButton.style.padding = '10px 20px';
greenButton.style.fontSize = '16px';
greenButton.style.borderRadius = '5px';
greenButton.style.color = '#fff';
greenButton.style.backgroundColor = 'green';
greenButton.style.cursor = 'pointer';

// 将绿色按钮添加到页面中
document.body.appendChild(greenButton);

// 为新按钮添加点击事件处理函数
greenButton.addEventListener('click', function() {
  const errors = downloadLinks.filter(function(link) {
    return !link.success;
  }).map(function(link) {
    return link.fileName;
  });

  if (errors.length > 0) {
    alert('以下文件下载失败：\n\n' + errors.join('\n'));
  } else {
    alert('没有文件下载失败！');
  }
});



function downloadNext() {
  if (downloadCount >= downloadLinks.length) {
    progressEl.textContent = '爬取进度：' + downloadCount + '/' + downloadLinks.length + '，全部完成';
    currentProgressEl.style.display = 'none';
    return;
  }

  const link = downloadLinks[downloadCount];
  const xhr = new XMLHttpRequest();
  xhr.open('GET', link.href);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (xhr.status === 200) {
      downloadCount++;
      const blob = new Blob([xhr.response], { type: 'audio/mp3' });
      URL.revokeObjectURL(link.href);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = link.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // 下载成功，更新进度
      progressEl.textContent = '爬取进度：' + downloadCount + '/' + downloadLinks.length;
      if (currentProgressEl) {
        currentProgressEl.textContent = '';
        currentProgressEl.style.display = 'none';
      }

      // 标记当前链接下载成功
      link.success = true;

      setTimeout(downloadNext, 500);
    } else {
      // 下载失败，标记当前链接下载失败
      downloadCount++;
      link.success = false;
      setTimeout(downloadNext, 0);
    }
  };

  // 发送请求
  xhr.send();
}


        downloadNext();
    }

    const button = document.createElement('button');
    button.textContent = "下载当前页面所有录音文件";
    button.style.position = 'fixed';
    button.style.bottom = '50px';
    button.style.right = '50px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.borderRadius = '5px';
    button.style.color = '#fff';
    button.style.backgroundColor = '#f00';
    button.style.cursor = 'pointer';
    button.addEventListener('click', function() {
        downloadAll();
    });

    document.body.appendChild(button);

})();