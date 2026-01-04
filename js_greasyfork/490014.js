// ==UserScript==
// @name         修复裂开的小尾巴
// @namespace    http://tampermonkey.net/
// @version      0.0.15
// @description  很多佬友在签名栏设置了自己的博客链接，或者是自己的座右铭。但是自己没开启签名展示没意识到不能正常显示，让我们一起来修复它们吧。
// @author       ygmjjdev
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490014/%E4%BF%AE%E5%A4%8D%E8%A3%82%E5%BC%80%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/490014/%E4%BF%AE%E5%A4%8D%E8%A3%82%E5%BC%80%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==
 
// 把裂开的图片换成文本或超链接
function replaceImage(img) {
  var src = img.getAttribute("src");
 
  if (src.startsWith("http")) {
    // 如果是链接，替换成a标签
    var a = document.createElement("a");
    a.setAttribute("href", src);
    a.textContent = src.substring(0, 50) + src.length >= 50 ? '...' : '';
 
    img.parentNode.replaceChild(a, img);
  } else {
    // 普通文本
    var p = document.createElement("p");
    p.style.display = "-webkit-box";
    p.style.webkitBoxOrient = "vertical";
    p.style.wordBreak = "break-all";
    p.style.webkitLineClamp = "2";
    p.style.overflow = "hidden";
    p.textContent = decodeURI(src);
    img.onerror = null;
    img.parentNode.replaceChild(p, img);
  }
}
 
(function () {
  "use strict";
  document.querySelectorAll(".signature-img").forEach(function (img) {
    if (img.complete && img.naturalHeight === 0 && img.naturalWidth === 0) {
      replaceImage(img);
    }
    img.onerror = function () {
      replaceImage(img);
    };
  });
 
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == "childList") {
        mutation.addedNodes.forEach(function (node) {
          checkNodeAndChildren(node);
        });
      }
    });
  });
 
  function checkNodeAndChildren(node) {
    if (node.nodeName == "IMG" && node.classList.contains("signature-img")) {
      node.onerror = function () {
        setTimeout(() => {
          replaceImage(node);
        }, 30);
      };
    }
 
    // 递归检查子节点
    if (node.childNodes) {
      node.childNodes.forEach(function (childNode) {
        checkNodeAndChildren(childNode);
      });
    }
  }
 
  observer.observe(document.body, { childList: true, subtree: true });
})();