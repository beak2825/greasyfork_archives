// ==UserScript==
// @name         LAZY CURRY
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A SHIT PLUGIN
// @author       You
// @match        https://km.sankuai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434822/LAZY%20CURRY.user.js
// @updateURL https://update.greasyfork.org/scripts/434822/LAZY%20CURRY.meta.js
// ==/UserScript==
const tamp = setInterval(() => {
  const targets = Array.from(document.querySelectorAll('.inner-text')).filter(v => /李亮的空间|管理系统组空间/.test(v.innerText));
  if (targets.length) {
    clearInterval(tamp);
    targets.forEach((v, i) => {
      v.parentNode.parentNode.previousElementSibling.click();
    });
  }
}, 100);
