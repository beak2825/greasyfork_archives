// ==UserScript==
// @name         禁用Safari点击文本框缩放页面
// @namespace    https://xyuxf.com/
// @version      0.1
// @description  点击文本框时，不再自动自动缩放页面。
// @author       随缘先锋
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465021/%E7%A6%81%E7%94%A8Safari%E7%82%B9%E5%87%BB%E6%96%87%E6%9C%AC%E6%A1%86%E7%BC%A9%E6%94%BE%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/465021/%E7%A6%81%E7%94%A8Safari%E7%82%B9%E5%87%BB%E6%96%87%E6%9C%AC%E6%A1%86%E7%BC%A9%E6%94%BE%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector('meta[name=viewport]');

  if (el !== null) {
    let content = el.getAttribute('content');
    let re = /maximum\-scale=[0-9\.]+/g;

    if (re.test(content)) {
        content = content.replace(re, 'maximum-scale=1.0');
    } else {
        content = [content, 'maximum-scale=1.0'].join(', ')
    }

    el.setAttribute('content', content);
  }
};

const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

// /programming/9038625/detect-if-device-is-ios/9039885#9039885
const checkIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (checkIsIOS()) {
  disableIosTextFieldZoom();
}