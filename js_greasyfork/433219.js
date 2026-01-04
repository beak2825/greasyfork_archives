// ==UserScript==
// @name         BookwalkerSpider
// @namespace    https://bookwalker.jp/
// @version      1.3
// @description  A Bookwalker Spider | V1.3 修改图片文件名为3位数字长度，前缀补'0'
// @author       DD1969
// @match        https://viewer.bookwalker.jp/*/*/viewer.html*
// @match        https://viewer-subscription.bookwalker.jp/*/*/viewer.html*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://greasyfork.org/scripts/431367-configdecoder-prod/code/ConfigDecoderProd.js?version=963923
// @require      https://greasyfork.org/scripts/431368-page-prod/code/PageProd.js?version=975233
// @require      https://greasyfork.org/scripts/431369-novelpage-prod/code/NovelPageProd.js?version=963925
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433219/BookwalkerSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/433219/BookwalkerSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ConfigDecoder, Page, NovelPage) {
  'use strict';

  try {
    const cid = window.location.search.replace('?cid=', '').split('&')[0];
    const BID = window.localStorage['NFBR.Global/BrowserId'];

    const getLoaderJS = await axios.get(document.querySelector('script[src$=getLoader]').src).then(res => res.data);
    let crFunc;
    eval(getLoaderJS.match(/function\(\)\{let.*'\d{4}';\}/)[0].replace('function', 'crFunc = function'));
    const cr = crFunc();

    const url = (window.location.host === 'viewer.bookwalker.jp' ? `https://viewer.bookwalker.jp/browserWebApi/` : `https://viewer-subscription.bookwalker.jp/browserWebApi3/`) + `c?cid=${cid}&BID=${BID}&cr=${cr}`;

    start(url);
  } catch (e) {
    alert(e + '\n无法查询数据，请刷新页面重试或联系脚本作者');
  }

  // start processing
  async function start(c_url) {
    // get auth and resource data
    const c_data = await axios.get(c_url).then(res => res.data);

    // try to get endoded config and then decode it
    let is_novel = false;
    let encoded_config;
    try {
      encoded_config = await axios.get(`${c_data.url}configuration_pack.json?hti=${c_data.auth_info.hti}&cfg=1&bid=${c_data.auth_info.bid}&uuid=${c_data.auth_info.uuid}&Policy=${c_data.auth_info.Policy}&Signature=${c_data.auth_info.Signature}&Key-Pair-Id=${c_data.auth_info['Key-Pair-Id']}`).then(res => res.data);
    } catch (e) {
      is_novel = true;
      encoded_config = await axios.get(`${c_data.url}normal_default/configuration_pack.json?hti=${c_data.auth_info.hti}&cfg=1&bid=${c_data.auth_info.bid}&uuid=${c_data.auth_info.uuid}&Policy=${c_data.auth_info.Policy}&Signature=${c_data.auth_info.Signature}&Key-Pair-Id=${c_data.auth_info['Key-Pair-Id']}`).then(res => res.data);
    }

    const decoded_config = ConfigDecoder.decode(JSON.stringify(encoded_config));

    // init pages
    const configuration = decoded_config[0].configuration;
    const pages = configuration.contents.map(pageInfo => {
      const pageConfig = decoded_config[0][pageInfo.file];
      return is_novel ?
        NovelPage.init(pageInfo.index, pageInfo.file, pageConfig, axios, decoded_config[4], decoded_config[5], decoded_config[6], c_data.url) :
        Page.init(pageInfo.index, pageInfo.file, pageConfig, axios, decoded_config[4], decoded_config[5], decoded_config[6], c_data.url);
    });

    // setup download panel
    if (is_novel) { // download novel
      const bookData = decoded_config[0].configuration['toc-list'].map(item => ({ href: item.href.match(/(item.*xhtml)/)[1], title: item.label }));
      const anchors = [];
      for (let i = 0; i < bookData.length; i++) {
        for (let j = 0; j < decoded_config[0].configuration.contents.length; j++) {
          if (bookData[i].href === decoded_config[0].configuration.contents[j]['original-file-path']) anchors.push(j);
        }
      }

      anchors.push(decoded_config[0].configuration.contents.length);

      for (let i = 0; i < bookData.length; i++) {
        delete bookData[i].href;
        bookData[i].content = pages.slice(anchors[i], anchors[i + 1]).reduce((acc, cur) => [].concat(acc, cur), []);
      }

      setupNovelDownloadPanel(bookData, c_data.auth_info, c_data.cti);
    } else { // download manga
      const contentList = decoded_config[0].configuration.contents;
      const tocList = decoded_config[0].configuration['toc-list'].map(item => ({ file: item.href, title: item.label }));
      setupMangaDownloadPanel(contentList, tocList, pages, c_data.auth_info, c_data.cti);
    }
  }

  function setupNovelDownloadPanel(bookData, auth, bookTitle) {
    const downloadPanel = document.createElement('div');
    document.body.appendChild(downloadPanel);
    downloadPanel.outerHTML = `
      <div class="download-panel" style="position: absolute; top: 50px; left: 10px; z-index: 99999999999; display: flex; flex-direction: column; margin: 0 auto 24px auto;">
        <select id="chapter-select" style="height: 28px; margin-bottom: 6px;">
          <option value="-1">[${bookData.reduce((acc, cur) => acc += cur.content.length, 0)}P] 全篇</option>
          ${ bookData.map((item, index) => `<option value="${index}">${`[${item.content.length}P] ${item.title}`}</option>`).join('') }
        </select>
        <button id="dl-btn" style="width: 100px; height: 25px; cursor: pointer;">下载</button>
      </div>
    `;

    // setup download button
    const dlBtn = document.getElementById('dl-btn');
    dlBtn.onclick = function () {
      const select = document.getElementById('chapter-select');
      const optionVal = parseInt(select.options[select.selectedIndex].value);

      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";

      if (optionVal === -1) {
        const allPages = bookData.reduce((acc, cur) => [].concat(acc, cur.content), []);
        download(allPages, bookTitle, auth, dlBtn);
      } else {
        download(bookData[optionVal].content, bookData[optionVal].title, auth, dlBtn);
      }
    }
  }

  function setupMangaDownloadPanel(contentList, tocList, pages, auth, bookTitle) {
    // collect toc data
    for (let i = 0; i < tocList.length; i++) {
      for (let j = 0; j < contentList.length; j++) {
        if (tocList[i].file === contentList[j].file) {
          tocList[i].startIndex = j;
        }
      }
    }

    const tocData = [];
    for (let i = 0; i < tocList.length; i++) {
      tocData.push({
        title: tocList[i].title,
        startIndex: tocList[i].startIndex,
        endIndex: (i !== tocList.length - 1) ? tocList[i + 1].startIndex: contentList.length
      })
    }

    // setup panel html
    const downloadPanel = document.createElement('div');
    document.body.appendChild(downloadPanel);
    downloadPanel.outerHTML = `
      <div class="download-panel" style="position: absolute; top: 50px; left: 10px; z-index: 99999999999; display: flex; flex-direction: column; margin: 0 auto 24px auto;">
        <select id="chapter-select" style="height: 28px; margin-bottom: 6px;">
          <option value="-1">[P1 - P${contentList.length}] 全篇</option>
          ${ tocData.map((data, index) => `<option value="${index}">${`[P${data.startIndex + 1} - P${data.endIndex}] ${data.title}`}</option>`).join('') }
        </select>
        <button id="dl-btn" style="width: 100px; height: 25px; cursor: pointer;">下载</button>
      </div>
    `;

    // setup download button
    const dlBtn = document.getElementById('dl-btn');
    dlBtn.onclick = function () {
      const select = document.getElementById('chapter-select');
      const optionVal = parseInt(select.options[select.selectedIndex].value);

      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";

      if (optionVal === -1) {
        download(pages, bookTitle, auth, dlBtn);
      } else {
        download(pages.slice(tocData[optionVal].startIndex, tocData[optionVal].endIndex), tocData[optionVal].title, auth, dlBtn);
      }
    }
  }

  function download(pages, title, auth, dlBtn) {
    title = title.replaceAll('/', ' ');

    const promises = [];
    for (let i = 0; i < pages.length; i++) {
      promises.push(pages[i].getImage(auth));
    }

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);

      for (let i = 0; i < images.length; i++) {
        folder.file(`${String(i + 1).padStart(3, '0')}.jpeg`, images[i].replace('data:image/jpeg;base64,', ''), { base64: true });
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    });
  }

})(axios, JSZip, saveAs, ConfigDecoder, Page, NovelPage);