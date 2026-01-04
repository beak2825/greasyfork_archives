// ==UserScript==
// @name         GanmaSpider
// @namespace    https://ganma.jp/
// @version      0.4
// @description  A manga spider for ganma.jp | V0.4 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://ganma.jp/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ganma.jp
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433645/GanmaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/433645/GanmaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  // get manga alias and current episode ID
  const alias = window.location.pathname.split('/')[1];
  const episodeID = window.location.pathname.split('/')[2];
  const data = await axios({
    method: 'get',
    url: `https://ganma.jp/api/1.0/magazines/web/${alias}`,
    headers: {
      'x-from': `https://ganma.jp/${alias}/${episodeID}/0`
    }
  }).then(res => res.data);

  start(data);

  // start prossessing data
  function start(data) {
    // get current episode data
    let currentEpisodeData;
    data.root.items.forEach(item => { currentEpisodeData = (item.id === episodeID) ? item : currentEpisodeData; });

    // get current episode title
    const title = `【${currentEpisodeData.title}】${currentEpisodeData.subtitle || ''}`;

    // generate image urls
    const baseURL = currentEpisodeData.page.baseUrl;
    const token = currentEpisodeData.page.token;
    const imageURLs = currentEpisodeData.page.files.map(file => `${baseURL}${file}?${token}`);

    // add afterword image url
    if (currentEpisodeData.afterwordImage && currentEpisodeData.afterwordImage.url) {
      imageURLs.push(currentEpisodeData.afterwordImage.url);
    }

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: absolute; bottom: 80px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer; background-color: #aaa; color: #fff; border-radius: 4px; border: 1px solid #fff';
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(imageURLs, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  // download images
  function download(urls, title, dlBtn) {
    // check if displaying correct page
    if (document.querySelector('.manga-head h3.ng-binding').innerText !== title) {
      alert('数据与页面不匹配，请刷新页面重试');
      return;
    }

    const promises = [];
    for (let i = 0; i < urls.length; i++) {
      promises.push(new Promise(resolve => {
        axios.get(urls[i], { responseType: 'blob' }).then(res => resolve(res.data));
      }))
    }

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      for (let i = 0; i < images.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, images[i]);
      }
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    })
  }

})(axios, JSZip, saveAs);