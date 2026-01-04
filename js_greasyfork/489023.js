// ==UserScript==
// @name        国家中小学智慧教育平台 - 免登录下载教材
// @namespace   www.52pojie.cn
// @match       https://basic.smartedu.cn/tchMaterial*
// @grant       none
// @version     1.2
// @author      nctot@52pojie.cn / 爱飞的猫改造
// @license     52pojie.cn
// @description 在不登录的情况下显示 PDF 预览和下载地址。
// @downloadURL https://update.greasyfork.org/scripts/489023/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20-%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD%E6%95%99%E6%9D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/489023/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20-%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD%E6%95%99%E6%9D%90.meta.js
// ==/UserScript==

function downloadBook(linkDownload) {
  if (linkDownload.classList.contains('download-in-progress')) {
    return;
  }
  linkDownload.classList.add('download-in-progress');

  linkDownload.textContent = '下载中…';
  fetch(linkDownload.href).then(r => {
    if (r.status !== 200) {
      throw new Error(`资源状态码不是 200 (实际值 ${r.status})`);
    }
    return r.blob();
  }).then((pdfBlob) => {
    const blobUrl = URL.createObjectURL(pdfBlob);
    linkDownload.onclick = null;
    linkDownload.href = blobUrl;
    linkDownload.textContent = '【下载】';

    // 触发下载，然后将地址删除 - 因为页面是由框架管理的，避免内存泄漏。
    linkDownload.click();
    setTimeout(() => {
      linkDownload.href = '';
      URL.revokeObjectURL(blobUrl);
    });
  }).catch((err) => {
    linkDownload.textContent = `下载失败: ${err}`;
  }).finally(() => {
    linkDownload.classList.remove('download-in-progress');
  });
}

function injectDownloadUrl() {
  document.querySelectorAll('li[class*="index-module_item"]:not(.added)').forEach((item) => {
    const rAssets = /\/assets\/([^.]+)\.t\/.+$/;
    const imageUrl = item.querySelector('[class*="index-module_cover"] img').src;

    if (rAssets.test(imageUrl)) {
      const moduleLine = item.querySelector('div[class*="index-module_line"]');
      const bookName = moduleLine.textContent.trim();
      const bookUrl = imageUrl.replace(rAssets, '/assets_document/$1.pkg/pdf.pdf');

      const dlContainer = document.createElement('div');
      dlContainer.className = 'dl-preview';
      dlContainer.style.cssText = `
        cursor: alias;
        font-size: smaller;
      `;

      const linkPreview = document.createElement('a');
      linkPreview.href = bookUrl;
      linkPreview.target = '_blank';
      linkPreview.download = `${bookName}.pdf`;
      linkPreview.textContent = '【预览】';

      const linkDownload = document.createElement('a');
      linkDownload.className = 'dl-book';
      linkDownload.target = '_blank';
      linkDownload.href = bookUrl;
      linkDownload.download = `${bookName}.pdf`;
      linkDownload.textContent = '【下载】';

      dlContainer.appendChild(linkPreview);
      dlContainer.appendChild(linkDownload);

      moduleLine.insertAdjacentElement('afterend', dlContainer);
      item.classList.add('added');
    }
  });
}

// 不让应用程序接管我们的点击事件
document.addEventListener('click', (e) => {
  if (e.target.closest('.dl-preview')) {
    e.stopPropagation();
  }

  if (e.target.closest('a.dl-book:not([href^="blob"])')) {
    e.preventDefault();
    downloadBook(e.target.closest('a.dl-book'));
  }
}, { capture: true });

// 定期扫描页面更改
setInterval(injectDownloadUrl, 1500);
injectDownloadUrl();