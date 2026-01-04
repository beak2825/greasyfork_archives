// ==UserScript==
// @name         豆瓣相册原图批量下载
// @icon         https://img1.doubanio.com/favicon.ico
// @namespace    https://linecho.com/
// @version      0.55
// @description  提供豆瓣电影相册专辑内单页原图批量下载
// @author       purezhi
// @match        https://*movie.douban.com/*/photos*
// @match        https://*www.douban.com/photos/album/*
// @match        https://*www.douban.com/photos/photo/*
// @match        https://*www.douban.com/photos/photo/*
// @match        https://*www.douban.com/personage/*/photos/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465710/%E8%B1%86%E7%93%A3%E7%9B%B8%E5%86%8C%E5%8E%9F%E5%9B%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465710/%E8%B1%86%E7%93%A3%E7%9B%B8%E5%86%8C%E5%8E%9F%E5%9B%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
https://greasyfork.org/zh-CN/scripts/465710-%E8%B1%86%E7%93%A3%E7%9B%B8%E5%86%8C%E5%8E%9F%E5%9B%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD
提供豆瓣电影相册专辑内单页原图批量下载，部分图片会因为跨域原因不能下载。
*/

/*jshint esversion: 8 */
(function () {
  `use strict`;

  var config_;

  const batchDownload = function () {
    let $imgList = document.querySelectorAll(config_.imgListSelector);
    // 验证预览图是否未加载
    if ($imgList.length == 0) {
      setTimeout(batchDownload, 1000);
      return;
    }

    const imgArr = [];
    $imgList.forEach(($img) => {
      // 获取图片信息
      const imgInf = getImgInfo($img);
      if (!imgInf) {
        return;
      }
      imgArr.push(imgInf);
    });

    // const subDomains = imgArr.map(m => m.subdomain).filter((item, index, arr) => arr.indexOf(item) === index);
    // let confirmToGo = true;
    // if (subDomains.length >= 1) {
    //   confirmToGo = confirm('图片中存在不同二级域名的地址, 因为安全限制可能只能自动下载部分图片, 是否继续?');
    // }
    // if (!confirmToGo) {
    //   return;
    // }

    for (let i=0; i < imgArr.length; i++) {
      const imgInf = imgArr[i];

      // 格式化原图下载链接
      let dlLink = document.createElement("a");
      dlLink.href = imgInf.raw;
      // dlLink.download = `${(config_.titlePrefix ? (config_.titlePrefix + '-') : '')}${(imgInf.subdomain ? (imgInf.subdomain + '-') : '')}${imgInf.id}.${config_.photoSrcExtension}`;
      dlLink.download = `${(config_.titlePrefix ? (config_.titlePrefix + '-') : '')}p${imgInf.id}.${config_.photoSrcExtension}`;

      GM_xmlhttpRequest({
        method: 'GET',
        url: dlLink.href,
        headers: {
          'Referer': 'https://www.douban.com/'
        },
        responseType: 'blob',
        onload: function(response) {
          if (response.status === 200) {
            const blob = response.response;
            const blobURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobURL;
            downloadLink.download = dlLink.download;

            downloadLink.click();

            URL.revokeObjectURL(blobURL);
            console.log(`picture downloaded: ${downloadLink.href}`);
          } else {
            console.error(`picture download failed: ${JSON.stringify(response)}`);
          }
        }
      });
    }
  }

  const init = function () {
    const domainRegex = /:\/\/([^.]+?)\.(?<domain>[\w\.]+)/;
    const configMap = {
      "douban.com": {
        // 批量下载链接容器
        "batchDownloadBtnContainerSelector": ".opt-bar-line",
        // 批量下载链接 css 类
        "batchDownloadBtnClass": "fright",
        "imgListSelector": "div.article ul li img",
        "subDomainRegex": /https?:\/\/(?<domain>[^.]+?)\..+/,
        "subDomainReplacement": "$<domain>",
        "photoIdRegex": /.+photo\/(?<id>\d+).*/,
        "photoIdReplacement": "$<id>",
        "photoSrcRegex": /(?<prefix>.+photo\/)\w+(?<suffix>\/public.+)\..*/,
        "photoSrcReplacement": "$<prefix>raw$<suffix>.jpg",
        "photoSrcExtension": "jpg",
        "photoClosestSelector": "li",
        // 单图下载链接容器
        "photoLinkContainerSelector": ".name",
        "titleSelector": "#wrapper #content h1",
        "titlePrefix": ""
      },
      "weibo.com": {
        "batchDownloadBtnContainerSelector": ".m_share_like",
        "batchDownloadBtnClass": undefined,
        "imgListSelector": "ul.photoList li img",
        "subDomainRegex": null,
        "subDomainReplacement": null,
        "photoIdRegex": /.+photo_id\/(?<id>\d+).*/,
        "photoIdReplacement": "$<id>",
        "photoSrcRegex": /(?<prefix>.+\/)\w+(?<suffix>\/.*)/,
        "photoSrcReplacement": "$<prefix>large$<suffix>",
        "photoClosestSelector": null,
        "photoLinkContainerSelector": null,
        "titleSelector": "",
        "titlePrefix": ""
      }
    };

    let domain = domainRegex.exec(document.location.origin).groups.domain;
    config_ = configMap[domain];
    if (!config_) {
      console.log('no works here');
    }

    let batchDownloadBtn = document.createElement("a");
    batchDownloadBtn.innerHTML = "批量下载本页原图 &#x1F608;";
    batchDownloadBtn.href = "javascript:;";
    batchDownloadBtn.style.fontWeight = "normal";
    batchDownloadBtn.style.marginRight = "10px";
    batchDownloadBtn.classList.add(config_.batchDownloadBtnClass);
    batchDownloadBtn.onclick = batchDownload;

    document.querySelector(config_.batchDownloadBtnContainerSelector).appendChild(batchDownloadBtn);

    // 附加原图链接
    if (!config_.photoClosestSelector || !config_.photoLinkContainerSelector) {
      return;
    }

    // 验证预览图是否未加载
    let $imgList = document.querySelectorAll(config_.imgListSelector);
    if ($imgList.length == 0) {
      return;
    }

    // 标题前缀
    if (config_.titleSelector) {
      const titleContainer = document.querySelector(config_.titleSelector);
      if (titleContainer) {
        config_.titlePrefix = titleContainer.innerHTML.split(' ')[0].replace('的图片', '');
      }
    }

    // 附加原图链接
    $imgList.forEach(($img) => {
      const imgInf = getImgInfo($img);
      if (!imgInf) {
        return;
      }

      const closestContainer = $img.closest(config_.photoClosestSelector);
      if (!closestContainer) {
        console.warn('preview image closest container not found');
        return;
      }

      const srcLinkContainer = closestContainer.querySelector(config_.photoLinkContainerSelector);
      if (!srcLinkContainer || !srcLinkContainer.innerHTML) {
        console.warn('src image container not found');
        return;
      }

      const srcText = srcLinkContainer.innerHTML;
      if (!srcText) {
        console.warn('src image container not found');
        return;
      }

      const rawUrl = imgInf.thumbnail.replace(config_.photoSrcRegex, config_.photoSrcReplacement);

      const srcLink = document.createElement("a");
      srcLink.innerHTML = `&#128194; 打开`; // ${imgInf.id}
      srcLink.href = rawUrl;
      srcLink.style.marginLeft = '5px';
      srcLink.setAttribute("target", "_blank");

      const dlLink = document.createElement("a");
      dlLink.innerHTML = `&#9196; 原图`; // &#x1F308;
      dlLink.href = rawUrl;
      dlLink.style.marginLeft = '5px';
      // dlLink.setAttribute("download", `${(config_.titlePrefix ? (config_.titlePrefix + '-') : '')}${(imgInf.subdomain ? (imgInf.subdomain + '-') : '')}${imgInf.id}.${config_.photoSrcExtension}`);
      dlLink.setAttribute("download", `${(config_.titlePrefix ? (config_.titlePrefix + '-') : '')}p${imgInf.id}.${config_.photoSrcExtension}`);

      srcLinkContainer.replaceChildren();
      srcLinkContainer.innerHTML = srcText;

      var pcntr = document.createElement('p');
      pcntr.style.margin = 0;
      pcntr.appendChild(srcLink);
      pcntr.appendChild(dlLink);
      srcLinkContainer.appendChild(pcntr);
      srcLinkContainer.appendChild(pcntr);
    });
  }

  const getImgInfo = function ($img) {
    if (!$img) {
      return null;
    }

    const src = $img.src;
    const refUrl = $img.parentNode.href;

    return {
      subdomain: config_.subDomainRegex && config_.subDomainReplacement
        ? src.replace(config_.subDomainRegex, config_.subDomainReplacement)
        : "",
      thumbnail: src,
      raw: src.replace(config_.photoSrcRegex, config_.photoSrcReplacement),
      refUrl: refUrl,
      id: refUrl.replace(config_.photoIdRegex, config_.photoIdReplacement)
    }
  }

  init();
})();
