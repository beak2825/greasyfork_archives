// ==UserScript==
// @name         JavDB 导出 想看、看过、清单（改）
// @namespace    导出想看
// @version      1.0
// @description  导出 想看、看过、清单 | Export Want, watched, list
// @include        https://javdb*.com/users/want_watch_videos*
// @include        https://javdb*.com/users/watched_videos*
// @include        https://javdb*.com/users/list_detail*
// @include        https://javdb*.com/lists*
// @require        https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508791/JavDB%20%E5%AF%BC%E5%87%BA%20%E6%83%B3%E7%9C%8B%E3%80%81%E7%9C%8B%E8%BF%87%E3%80%81%E6%B8%85%E5%8D%95%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/508791/JavDB%20%E5%AF%BC%E5%87%BA%20%E6%83%B3%E7%9C%8B%E3%80%81%E7%9C%8B%E8%BF%87%E3%80%81%E6%B8%85%E5%8D%95%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

let allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo')) || [];
let allowExport = JSON.parse(localStorage.getItem('allowExport')) || false;
let exportButton = null;
let url = window.location.href;

//获取视频信息
function getVideosInfo() {
  const videoElements = document.querySelectorAll('.item');
  const videosInfo = Array.from(videoElements).map((element) => {
    const title = element.querySelector('.video-title').textContent.trim();
    const [id, ...titleWords] = title.split(' ');
    const formattedTitle = titleWords.join(' ');
    const [score, scoreNumber] = element.querySelector('.value').textContent.replace(/[^0-9-.,]/g, '').split(',');
    const releaseDate = element.querySelector('.meta').textContent.replace(/[^0-9-]/g, '');
    return {
      id,
      title: formattedTitle,
      score: Number(score),
      scoreNumber: Number(scoreNumber),
      releaseDate: releaseDate
    };
  });
  return videosInfo;
}

// 翻页
function scrapeAllPages() {
  const videosInfo = getVideosInfo();
  allVideosInfo = allVideosInfo.concat(videosInfo);
  localStorage.setItem('allVideosInfo', JSON.stringify(allVideosInfo));
  const nextPageButton = document.querySelector('.pagination-next');
  if (nextPageButton) {
    nextPageButton.click();
    setTimeout(() => scrapeAllPages(), 2000);
  } else {
    exportVideosInfo();
  }
}

// 导出数据
function exportVideosInfo() {
  allowExport = false;
  localStorage.setItem('allowExport', JSON.stringify(allowExport));
  allVideosInfo.sort((a, b) => a.id.localeCompare(b.id));
  const json = JSON.stringify(allVideosInfo);
  const jsonBlob = new Blob([json], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const downloadLink = document.createElement('a');
  const dateTime = (new Date()).toISOString().replace('T', ' ').split('.')[0];
  let fileName = '';
  if (url.includes('/watched_videos')) {
    fileName = 'javdb看过的影片';
  } else if (url.includes('/want_watch_videos')) {
    fileName = 'javdb想看的影片';
  } else if (url.includes('/list_detail')) {
    const breadcrumb = document.getElementsByClassName('breadcrumb')[0];
    const li = breadcrumb.parentNode.querySelectorAll('li');
    fileName = li[1].innerText;
  } else if (url.includes('/lists')) {
    fileName = document.querySelector('.actor-section-name').innerText;
  }
  // 导出xlsx
  fileName = fileName + " "+dateTime;
  const worksheet = XLSX.utils.json_to_sheet(allVideosInfo);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFile(workbook, fileName+".xlsx", { compression: true });
  //下方注释的是导出json
//  downloadLink.href = jsonUrl;
//  downloadLink.download = `${fileName} ${dateTime}.json`;
//  document.body.appendChild(downloadLink);
//  downloadLink.click();
  localStorage.removeItem('allVideosInfo');
  exportButton.textContent = '导出完毕';
}

// 开始导出
function startExport() {
  const allImages = document.querySelectorAll('img'); //移除图像增加速度
  allImages.forEach((image) => {
    image.remove();
  });
  allowExport = true;
  localStorage.setItem('allowExport', JSON.stringify(allowExport));
  exportButton.textContent = '导出中...';
  exportButton.disabled = true;
  scrapeAllPages();
}

// 创建导出按钮
function createExportButton() {
  exportButton = document.createElement('button');
  exportButton.textContent = '导出 表格';
  exportButton.className = 'button is-small';
  exportButton.addEventListener('click', startExport);
  if (url.includes('/list_detail')) {
    document.querySelector('.breadcrumb').querySelector('ul').appendChild(exportButton);
  } else {
    document.querySelector('.toolbar').appendChild(exportButton);
  }
}

// 方法入口
if (url.includes('/watched_videos')
  || url.includes('/want_watch_videos')
  || url.includes('/list_detail')
  || url.includes('/lists')
) {
  createExportButton();
  if (allowExport) {
    startExport();
  }
}