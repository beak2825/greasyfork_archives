// ==UserScript==
// @name         KuragebunchSpider
// @namespace    https://kuragebunch.com/
// @version      0.2
// @description  Image spider for kuragebunch.com | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://kuragebunch.com/episode/*
// @match        https://kuragebunch.com/volume/*
// @match        https://kuragebunch.com/magazine/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435430/KuragebunchSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/435430/KuragebunchSpider.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs) {
  'use strict';

  const jsonResponse = await new Promise(resolve => {
    GM_xmlhttpRequest ( {
      method: 'GET',
      url: window.location.origin + window.location.pathname + '.json',
      headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' },
      onload: res => resolve(JSON.parse(res.response))
    });
  })

  const imgSrc = jsonResponse.readableProduct.pageStructure.pages.filter(item => item.src).map(item => item.src);
  const toc = jsonResponse.readableProduct.toc;

  // 配置目录选择列表
  const tocData = [];
  if (toc) {
    for (let i = 0; i < toc.items.length; i++) {
      tocData.push({
        startAt: toc.items[i].startAt,
        endAt: (i !== toc.items.length - 1) ? toc.items[i + 1].startAt - 1: imgSrc.length,
        title: toc.items[i].title
      })
    }
  }

  document.querySelector('.episode-header').innerHTML += `
    <div class="download-panel" style="display: flex; align-items: center; margin: 0 auto 24px auto; width: 980px;">
      <select id="chapter-select" style="height: 26px; margin-right: 8px;">
        <option value="${'1,' + imgSrc.length}" selected>${`[P1 - P${imgSrc.length}] 全篇`}</option>
        ${ tocData.map(data => `<option value="${data.startAt + ',' + data.endAt}">${`[P${data.startAt} - P${data.endAt}] ${data.title}`}</option>`).join('') }
      </select>
      <button id="dl-btn" style="width: 100px; cursor: pointer;">下载</button>
    </div>
  `;

  // 配置下载按钮
  const dlBtn = document.getElementById('dl-btn');
  dlBtn.onclick = function () {
    const select = document.getElementById('chapter-select');
    const [startAt, endAt] = select.options[select.selectedIndex].value.split(',').map(num => parseInt(num));
    const title = select.selectedIndex === 0 ? document.querySelector('.episode-header-title').innerText : select.options[select.selectedIndex].text.split(']')[1].trim();

    dlBtn.disabled = true;
    dlBtn.innerText = "正在处理";
    fetchImages(imgSrc.slice(startAt - 1, endAt), title);
  }

  async function fetchImages (data, title) {
    const zip = new JSZip();
    const folder = zip.folder(title);

    for (let i = 0; i < data.length; i++) {
      const imgResponse = await axios.get(data[i], { responseType: 'blob' });
      folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, imgResponse.data, { binary: true });
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);
      dlBtn.disabled = false;
      dlBtn.innerText = "下载";
    });
  }

})(axios, JSZip, saveAs);