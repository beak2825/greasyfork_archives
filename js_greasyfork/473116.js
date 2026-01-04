// ==UserScript==
// @name		移除腾讯课堂的观看时的数字Id
// @author		Yiero
// @description		移除腾讯课堂登录后观看视频会出现的课堂Id
// @version		1.0.1
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts
// @match		https://ke.qq.com/course/*
// @icon		https://ke.qq.com/favicon.ico
// @license		GPL
// @downloadURL https://update.greasyfork.org/scripts/473116/%E7%A7%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%9A%84%E8%A7%82%E7%9C%8B%E6%97%B6%E7%9A%84%E6%95%B0%E5%AD%97Id.user.js
// @updateURL https://update.greasyfork.org/scripts/473116/%E7%A7%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%9A%84%E8%A7%82%E7%9C%8B%E6%97%B6%E7%9A%84%E6%95%B0%E5%AD%97Id.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function getElement(parent = document.body, selector, timeoutPerSecond = 0, getElementDelayPerSecond = 0) {
  return new Promise((resolve) => {
    let result = parent.querySelector(selector);
    if (result) {
      return resolve(result);
    }
    let timer;
    const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
    if (mutationObserver) {
      const observer = new mutationObserver((mutations) => {
        for (let mutation of mutations) {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode instanceof Element) {
              result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
              if (result) {
                observer.disconnect();
                timer && clearTimeout(timer);
                setTimeout(() => {
                  return resolve(result);
                }, getElementDelayPerSecond * 1e3);
              }
            }
          }
        }
      });
      observer.observe(parent, {
        childList: true,
        subtree: true
      });
      if (timeoutPerSecond > 0) {
        timer = setTimeout(() => {
          observer.disconnect();
          return resolve(null);
        }, timeoutPerSecond * 1e3);
      }
    }
  });
}
(() => {
  if (!document.URL.match(/https:\/\/ke.qq.com\/course\/\d.*/g)) {
    return;
  }
  const courseIdObserver = new MutationObserver((e) => {
    e.forEach((record) => {
      const addNode = record.addedNodes[0];
      if (addNode == null ? void 0 : addNode.innerText.match(/^\d+$/)) {
        addNode.style.display = "none";
      }
    });
  });
  getElement(void 0, "#video-container").then(
    (res) => {
      if (!res) {
        return;
      }
      document.querySelector("#video-container > div").remove();
      courseIdObserver.observe(res, {
        childList: true
      });
    }
  );
})();
