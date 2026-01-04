// ==UserScript==
// @name         超链接打开新窗口
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制所有超链接都打开新窗口
// @author       wangshushuo
// @match        http://10.0.160.10:3000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=160.10
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473367/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/473367/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "subtree") {
      }
    }
    debounce(changeTarget, 1000)()
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  function changeTarget() {
    // console.log(3);
    document.querySelectorAll("a").forEach((i) => {
      i?.setAttribute("target", "_blank");
      i.style.color = "red";
    });
  }

  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  // Your code here...
})();
