// ==UserScript==
// @name         ComicpolarisSpider
// @namespace    https://comic-polaris.jp/
// @version      0.1
// @description  Manga spider for comic-polaris.jp
// @author       DD1969
// @match        https://comic-polaris.jp/*/*/*/
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/444095/ComicpolarisSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/444095/ComicpolarisSpider.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs) {
  'use strict';

  // 获取标题和所有图片的json路径
  const html = await axios.get(window.location.href);
  const title = html.data.match(/<title>(.*)<\/title>/m)[1];
  const jsons = html.data.match(/data\/.*json/gm);

  // 根据json处理图片
  const promises = [];
  for (let i = 0; i < jsons.length; i++) {
    promises.push(new Promise(async resolve => {
      // 获取图片的json数据
      const json = jsons[i];
      const page = await axios.get(window.location.href + json);

      // 创建临时canvas画布
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // 获取被加密打乱的图片
      const shuffleImg = document.createElement('img');
      shuffleImg.src = `${window.location.href}data/${page.data.resources.i.src}`;

      shuffleImg.onload = function () {
        tempCanvas.width = shuffleImg.width;
        tempCanvas.height = shuffleImg.height;
        tempCtx.drawImage(shuffleImg, 0, 0);

        // 解密碎片的原位置、长宽和正确位置
        const parsedCoords = page.data.views[0].coords.map(function (coord) {
          const items = coord.match(/^([^:]+):(\d+),(\d+)\+(\d+),(\d+)>(\d+),(\d+)$/);
          if (!items) throw new Error("Invalid format for Image Transfer : " + coord);

          return {
            xsrc: parseInt(items[2], 10),
            ysrc: parseInt(items[3], 10),
            width: parseInt(items[4], 10),
            height: parseInt(items[5], 10),
            xdest: parseInt(items[6], 10),
            ydest: parseInt(items[7], 10)
          }
        });

        // 提取所有碎片
        const pieces = [];
        for (let i = 0; i < parsedCoords.length; i++) {
          pieces.push(tempCtx.getImageData(parsedCoords[i].xsrc, parsedCoords[i].ysrc, parsedCoords[i].width, parsedCoords[i].height));
        }

        // 创建目标canvas画布
        const destCanvas = document.createElement('canvas');
        const destCtx = destCanvas.getContext('2d');
        destCanvas.width = page.data.views[0].width;
        destCanvas.height = page.data.views[0].height;

        // 将碎片放到目标画布正确的位置上
        for (let i = 0; i < parsedCoords.length; i++) {
          destCtx.putImageData(pieces[i], parsedCoords[i].xdest, parsedCoords[i].ydest);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }
    }))
  }

  // 配置下载按钮
  const dlBtn = document.createElement('button');
  dlBtn.id = 'dl-btn';
  dlBtn.innerText = '下载';
  dlBtn.style = 'position: absolute; top: 20px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;';
  dlBtn.onclick = function () {
    dlBtn.disabled = true;
    dlBtn.innerText = "正在处理";
    download();
  }
  document.body.appendChild(dlBtn);

  // 所有图片打包并下载
  function download() {
    Promise.all(promises).then(pages => {
      const zip = new JSZip();
      const folder = zip.folder(title);
  
      for (let i = 0; i < pages.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, pages[i], { base64: true });
      }
  
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完成";
      });
    });
  }

})(axios, JSZip, saveAs);