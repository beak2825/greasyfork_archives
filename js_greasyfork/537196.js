// ==UserScript==
// @name         快捷下载预览网站图片（download-picture-script）
// @namespace    https://gitee.com/DieHunter/download-picture-script
// @version      1.1.4
// @description  快捷下载网站图片（油猴脚本），用于下载图片标签或者背景图
// @author       DieHunter
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/537196/%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%E9%A2%84%E8%A7%88%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%EF%BC%88download-picture-script%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537196/%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%E9%A2%84%E8%A7%88%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%EF%BC%88download-picture-script%EF%BC%89.meta.js
// ==/UserScript==

const download = function (url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.target = "_blank";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
(function () {
  let current = null;
  let imgList = [];
  document.addEventListener("mouseover", function (event) {
    const target = event.target;
    event.stopPropagation();

    if (target.tagName === "IMG") {
      imgList = [target];
    } else {
      imgList = target.querySelectorAll("img");
    }
    if (imgList.length <= 0) {
      return;
    }
    current = target;
    target.style.border = "1px solid red";
  });
  document.addEventListener("mouseout", function (event) {
    const target = event.target;
    if (current === target) {
      target.style.border = "none";
      current = null;
      imgList = [];
    }
  });
  document.addEventListener("click", function (event) {
    if (event.altKey && imgList?.length) {
      // 执行你的操作
      imgList.forEach((img, index) => {
        if (img.src) {
          download(img.src, `${index}`);
        }
      });
    }
  });
})();
