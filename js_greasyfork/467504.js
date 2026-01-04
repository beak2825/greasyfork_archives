// ==UserScript==
// @license MIT
// @name        英雄榜PNG导出
// @namespace   Violentmonkey Scripts
// @match       *://worldofwarcraft.blizzard.com/*/character/*
// @grant       none
// @version     1.0
// @author      undownding
// @description 将英雄榜页面导出为可编辑的 PNG 素材
// @description 2023/5/30 21:31:42
// @require     https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/467504/%E8%8B%B1%E9%9B%84%E6%A6%9CPNG%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/467504/%E8%8B%B1%E9%9B%84%E6%A6%9CPNG%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
document.exportToImage = function (className, filename) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const node = document.body.getElementsByClassName(className)[0];
    html2canvas(node, {
                backgroundColor: null,
                useCORS: true,
                scrollY: 0,
                scrollX: 0
            }).then(
      (canvas) => {
        let img = document.createElement('a');
        img.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        img.download = filename + '.png';
        img.click();
      }
    );
};

document.downloadImage = async function(
  imageSrc,
  nameOfDownload
) {
  const response = await fetch(imageSrc);

  const blobImage = await response.blob();

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
};

document.exportAll = function() {
  document.exportToImage('ProfilePage-header', 'header');
  document.exportToImage('CharacterProfile', 'gears');
  document.downloadImage(window.characterProfileInitialState.summary.character.render.background.url, 'background.png');
  document.downloadImage(window.characterProfileInitialState.summary.character.renderRaw.url, 'character.png');
};
