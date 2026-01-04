// ==UserScript==
// @name         JavDB Exporter
// @namespace    https://github.com/nini22P/monkey-script/tree/main/javdb-exporter
// @version      1.3
// @description  导出 想看、看过、清单 | Export Want, watched, list
// @match        https://javdb.com/users/want_watch_videos*
// @match        https://javdb.com/users/watched_videos*
// @match        https://javdb.com/users/list_detail*
// @match        https://javdb.com/lists*
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467309/JavDB%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/467309/JavDB%20Exporter.meta.js
// ==/UserScript==

let allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo')) || [];
let allowExport = JSON.parse(localStorage.getItem('allowExport')) || false;
let exportButton = null;
let url = window.location.href;

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
    fileName = 'watched-videos'
  } else if (url.includes('/want_watch_videos')) {
    fileName = 'want-watch-videos'
  } else if (url.includes('/list_detail')) {
    const breadcrumb = document.getElementsByClassName('breadcrumb')[0];
    const li = breadcrumb.parentNode.querySelectorAll('li');
    fileName = li[1].innerText;
  } else if (url.includes('/lists')) {
    fileName = document.querySelector('.actor-section-name').innerText;
  }
  downloadLink.href = jsonUrl;
  downloadLink.download = `${fileName} ${dateTime}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  localStorage.removeItem('allVideosInfo');
  exportButton.textContent = '导出完毕';
}

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

function createExportButton() {
  exportButton = document.createElement('button');
  exportButton.textContent = '导出 json';
  exportButton.className = 'button is-small';
  exportButton.addEventListener('click', startExport);
  if (url.includes('/list_detail')) {
    document.querySelector('.breadcrumb').querySelector('ul').appendChild(exportButton);
  } else {
    document.querySelector('.toolbar').appendChild(exportButton);
  }
}

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