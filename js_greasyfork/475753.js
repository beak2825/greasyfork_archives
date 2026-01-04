// ==UserScript==
// @name        教参下载助手
// @namespace   yesh@aliyun.com
// @match       http*://reserves.lib.tsinghua.edu.cn/Search/BookDetail
// @grant       none
// @version     0.1.0
// @license     AGPL-3.0-or-later
// @author      yesh
// @description 下载教材，另请我校读者遵守相关法律法规规定嗯嗯
// @connect     reserves.lib.tsinghua.edu.cn
// @run-at      document-end
// @require     https://cdn.bootcdn.net/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/475753/%E6%95%99%E5%8F%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475753/%E6%95%99%E5%8F%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function isLoggedIn() {
  return !document.querySelector('a[href="/Account/LogIn"]')
    && document.querySelector('a[href="/Account/LogOff"]');
}

function scrapeBookInfo() {
  const table = document.querySelector('.p-result > table');
  const info = {};
  table.querySelectorAll('tbody > tr').forEach((tr) => {
    const tds = tr.querySelectorAll('td');
    info[tds[0].innerText.trim()] = tds[1].innerText.trim();
  });

  if (info['题名']) {
    info.title = info['题名'];
  } else {
    throw new Error('未能从页面中抓取到书名');
  }

  info.id = new URLSearchParams(window.location.search).bookId;

  return info;
}

function scrapeDownloadEndpoints() {
  const links = document.querySelectorAll('.p-result a[href^="/book"]');
  return [...links].map((a) => ({
    name: a.innerText.trim(),
    basePath: a.href.replace('/index.html', ''),
  }));
}

async function scrapeChapterInfo() {
  const endpoints = scrapeDownloadEndpoints();
  await Promise.all(endpoints.map((info, chapter) =>
    fetch(`${info.basePath}/mobile/javascript/config.js`)
      .then((res) => res.text())
      .then((config) => {
        const createdTime = /bookConfig.CreatedTime\s*=\s*"(\d+)"/.exec(config)[1];
        const pageCount = parseInt(/bookConfig.totalPageCount\s*=\s*(\d+)\s*;/.exec(config)[1]);
        info.createdTime = createdTime;
        info.pageCount = pageCount;
        info.chapter = chapter;
      })
  ));
  return endpoints;
}

let totalSpan = null;
let downloadedSpan = null;
let downloaded = 0;
function setTotalPages(pages) {
  totalSpan.innerText = `/${pages}`;
  downloadedSpan.innerText = '0';
  downloaded = 0;
}
function incrementDownloaded() {
  downloaded++;
  downloadedSpan.innerText = `${downloaded}`;
}

function downloadPages(chapterPages, output, failed) {
  return Promise.all(chapterPages.map((info) => {
    const chapter = info.chapter;
    const page = info.page;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = `${chapter.basePath}/files/mobile/${page}.jpg?${chapter.createdTime}`;
      image.onload = () => resolve(image);
      image.onerror = reject;
    }).then((image) => {
      output[`${chapter.chapter}-${page}`] = image;
      incrementDownloaded();
    }).catch(() => failed.push(info));
  }));
}

async function download(retries, failed) {
  const output = {};
  let chapters = [];

  if (!failed) {
    failed = [];
    chapters = await scrapeChapterInfo();
    setTotalPages(chapters.reduce((s, chapter) => s + chapter.pageCount, 0));
    await Promise.all(chapters.map((chapter) => {
      const pages = [];
      for (let page = 1; page <= chapter.pageCount; page++) {
        pages.push({ chapter, page });
      }
      return downloadPages(pages, output, failed);
    }));
  }

  while (failed.length > 0 && retries > 0) {
    const remaining = [];
    await downloadPages(failed, output, remaining);
    failed = remaining;
    retries--;
  }

  return { output, chapters, failed };
}

async function downloadPdf() {
  console.log(`开始下载`);

  const result = await download(3);
  if (result.failed.length > 0) {
    alert(`共 ${result.failed.length} 个页面下载失败：${result.failed}`);
    return;
  }

  console.log(`共 ${Object.keys(result.output).length} 页，正生成 PDF`);

  const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageRatio = pageWidth / pageHeight;

  function insertFitted(image) {
    const ratio = image.width / image.height;
    let width;
    let height;
    if (ratio >= pageRatio) {
      width = pageWidth;
      height = width / ratio;
    } else {
      height = pageHeight;
      width = height * ratio;
    }
    pdf.addImage(image, 'JPEG', (pageWidth - width) / 2, (pageHeight - height) / 2, width, height, undefined, 'SLOW');
  }

  Object.entries(result.output).sort((e1, e2) => {
    const [ chapter1, page1 ] = e1[0].split('-');
    const [ chapter2, page2 ] = e2[0].split('-');
    const chapters = parseInt(chapter1) - parseInt(chapter2);
    return chapters === 0 ? parseInt(page1) - parseInt(page2) : chapters;
  }).forEach((e, i) => {
    if (i !== 0) {
      pdf.addPage();
    }
    insertFitted(e[1]);
  });

  let currentPage = 1;
  result.chapters.forEach((chapter) => {
    pdf.outline.add(null, chapter.name, { pageNumber: currentPage });
    currentPage += chapter.pageCount;
  });

  const info = scrapeBookInfo();
  pdf.save(`${info.title}.pdf`);
}

function setupUI() {
  const button = document.createElement('button');
  button.innerText = '下载 PDF';
  button.onclick = downloadPdf;
  downloadedSpan = document.createElement('span');
  totalSpan = document.createElement('span');
  document.querySelector('.p-result > p').append(button, downloadedSpan, totalSpan);
}

if (isLoggedIn()) {
  setupUI();
}
