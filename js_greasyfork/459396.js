// ==UserScript==
// @name         自适应图片放大
// @namespace    https://gitee.com/huelse/js-scripts/blob/master/auto-scale-image.js
// @version      1.1.0
// @description  自动放大图片标签
// @author       THENDINGs
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @match        *://*/*
// @icon         https://img1.imgtp.com/2023/02/02/pm8lKWm6.ico
// @grant        unsafeWindow
// @run-at       document-body
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/459396/%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/459396/%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var _ = window._;

  // 小于这个尺寸的图片就不自动放大了
  const min_px = 64;
  // 鼠标停留几毫秒后再显示，默认0.5秒
  const waiting_time = 500;
  const options = { leading: false, trailing: true };
  const imgTypes = ['.jpg', '.png', '.webp'];

  let imgs = [];
  const observer = new MutationObserver(
    _.throttle(
      function () {
        imgs = document.querySelectorAll("img");
        // console.log('observer', imgs.length);
        imgListener();
      },
      waiting_time,
      options
    )
  );
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  function getContainer() {
    const existContainer = document.querySelector(".big-img-container");
    if (!existContainer) {
      const container = document.createElement("div");
      container.className = "big-img-container";
      container.style.position = "fixed";
      container.style.top = 0;
      container.style.left = 0;
      container.style.zIndex = 999999;
      container.onclick = function () {
        clearContainer(container);
      };
      document.querySelector("html").appendChild(container);
      return container;
    }
    return existContainer;
  }

  function imgListener() {
    const container = getContainer();
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    imgs.forEach((img) => {
      if (img.getAttribute("listener") === "true") {
        return;
      }
      if (img.width <= min_px || img.height <= min_px) {
        return;
      }
      let timeout;
      // console.log('listen', img.getAttribute("src"));
      img.addEventListener("mouseenter", function (e) {
        timeout = setTimeout(() => {
          clearContainer(container);
          const { x, y } = e;
          const width = x > halfWidth ? x : window.innerWidth - x;
          const height = y > halfHeight ? y : window.innerHeight - y;

          const imgWidth = e.target.width;
          const imgHeight = e.target.height;
          const rate = imgWidth / imgHeight;

          const bigImgHeight =
            (width / rate < height ? width / rate : height) - 10;
          const bigImgWidth =
            (height * rate < width ? height * rate : width) - 10;

          const containerX = x > halfWidth ? x - bigImgWidth - 5 : x + 5;
          const containerY = y > halfHeight ? y - bigImgHeight - 5 : y + 5;

          container.style.left = `${containerX}px`;
          container.style.top = `${containerY}px`;
          container.style.border = "1px solid #000";
          const bigImg = e.target.cloneNode();
          const a = getParentNode(e.target, 'a');
          if (a && isImage(a.href)) {
            const tmpSrc = bigImg.src;
            bigImg.src = a.href;
            bigImg.onerror = function (ev) {
              ev.target.src = tmpSrc;
            }
          }
          bigImg.style.maxHeight = "unset";
          bigImg.style.maxWidth = "unset";
          bigImg.style.height = `${bigImgHeight}px`;
          bigImg.style.width = `${bigImgWidth}px`;
          bigImg.onclick = function () {
            clearContainer(container);
          };
          container.appendChild(bigImg);
        }, waiting_time);
      });
      img.addEventListener("mouseleave", function (e) {
        // const bigImg = container.firstElementChild;
        // console.log(bigImg.width, bigImg.height);
        if (timeout) {
          clearTimeout(timeout);
        }
        clearContainer(container);
      });
      img.setAttribute("listener", "true");
    });
  }

  function clearContainer(container) {
    if (container.hasChildNodes()) {
      container.innerHTML = "";
      container.style.border = "";
    }
  }

  function getParentNode(el, tagName) {
    let node = el.parentNode;
    for (let i = 0; i < 5; i++) {
      if (node.tagName.toLowerCase() === tagName) {
        return node;
      } else {
        node = node.parentNode;
      }
    }
  }

  function isImage(imgSrc) {
    // let imgObj = new Image();
    // imgObj.src = imgSrc;
    // if (imgObj.fileSize > 0 || (imgObj.width > 0 && imgObj.height > 0)) {
    //   return imgObj;
    // } else {
    //   return false;
    // }
    const exts = imgSrc.split('.');
    return imgTypes.includes(`.${exts[exts.length - 1]}`)
  }

})();
