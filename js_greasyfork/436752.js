// ==UserScript==
// @name         PashupSpider
// @namespace    https://pash-up.jp/
// @version      0.2
// @description  A Manga Spider for pash-up.jp | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://pash-up.jp/*/viewer.html*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://greasyfork.org/scripts/431367-configdecoder-prod/code/ConfigDecoderProd.js?version=963923
// @require      https://greasyfork.org/scripts/431368-page-prod/code/PageProd.js?version=975233
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436752/PashupSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/436752/PashupSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ConfigDecoder, Page) {
  'use strict';

  start('https://pash-up.jp/pageapi/viewer/c.php' + window.location.search);

  // start processing
  async function start(c_url) {
    // get auth and resource data
    const c_data = await axios.get(c_url).then(res => res.data);
    const encoded_config = await axios.get(`${c_data.url}configuration_pack.json`).then(res => res.data);
    const decoded_config = ConfigDecoder.decode(JSON.stringify(encoded_config));

    // init pages
    const configuration = decoded_config[0].configuration;
    const pages = configuration.contents.map(pageInfo => {
      const pageConfig = decoded_config[0][pageInfo.file];
      return Page.init(pageInfo.index, pageInfo.file, pageConfig, axios, decoded_config[4], decoded_config[5], decoded_config[6], c_data.url);
    });

    const contentList = decoded_config[0].configuration.contents;
    const tocList = decoded_config[0].configuration['toc-list'].map(item => ({ file: item.href, title: item.label }));
    setupMangaDownloadPanel(contentList, tocList, pages, c_data.auth_info, c_data.cti);
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
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpeg`, images[i].replace('data:image/jpeg;base64,', ''), { base64: true });
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    });
  }

})(axios, JSZip, saveAs, ConfigDecoder, Page);