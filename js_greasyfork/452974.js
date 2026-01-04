// ==UserScript==
// @name            百度图片搜索 - 显示图片尺寸
// @name:en         Baidu Image Search - Show Image Dimensions
// @description     显示百度图片搜索缩略图的图片尺寸 (例如: "1920 × 1080").
// @description:en  Displays image dimensions (eg. "1920 × 1080") for each thumbnail on the Baidu Image Search results page.
// @icon            https://www.baidu.com/cache/icon/favicon.ico
// @namespace       https://github.com/BloodKirin/baidu-image-search-show-image-dimensions-userscript
// @author          SonicWind
// @version         1.0.1
// @license         MIT License
// @homepageURL     https://github.com/BloodKirin/baidu-image-search-show-image-dimensions-userscript
// @supportURL      https://github.com/BloodKirin/baidu-image-search-show-image-dimensions-userscript/issues
// @match           *://image.baidu.com/*tn=baiduimage*
// @downloadURL https://update.greasyfork.org/scripts/452974/%E7%99%BE%E5%BA%A6%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2%20-%20%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/452974/%E7%99%BE%E5%BA%A6%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2%20-%20%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add Google's own CSS used for image dimensions
  addGlobalStyle(`
    .img-tagdims {
      display: block;
      position: absolute;
      padding: 0 6px;
      bottom: 0;
      right: 0;
      line-height: 18px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #fff;
      border: 1pxsolidrgba(0,0,0,.05);
      border-radius: 12px;
      background: rgba(98,102,117,.7);
      z-index: 1;
      align-items: center;
      margin-left: 2px;
    }

    .hactive:hover .imgbox .imgbox-border .img-tagdims {
      display:none;
    }
    `);

  function showDims() {
    // Find all thumbnails & exclude the "already handled" class we set below
    const images = document.querySelectorAll('[pn]:not(.dimsmark)');

    // Loop through all thumbnails
    images.forEach((image) => {
      try {
        image.classList.add('dimsmark');

        // Get original width from 'data-ow' attribute
        const width = image.getAttribute('data-width');

        // Get original height from 'data-oh' attribute
        const height = image.getAttribute('data-height');

        // Create p tag and insert text
        const dimensionsDiv = document.createElement('p');
        const dimensionsContent = document.createTextNode(width + ' x ' + height);
        dimensionsDiv.appendChild(dimensionsContent);

        // Add CSS Class to the imgbox
        const imgbox = image.children[0].children[1];
//         imgbox.classList.add('img-tagdimsswitch');

        // Append everything to thumbnail
        imgbox.appendChild(dimensionsDiv);

        // Add CSS class to the thumbnail
        dimensionsDiv.classList.add('img-tagdims');

      } catch (error) {
        console.error(error);
      }
    });
  }

  // Run script once on document ready
  showDims();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  // Let MutationObserver target the grid containing all thumbnails
  const targetNode = document.getElementById('imgContainer');

  // Run MutationObserver
  mutationObserver.observe(targetNode, { childList: true, subtree: true });

  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    const style = document.createElement('style');
    style.textContent = css;
    head.appendChild(style);
  }
})();