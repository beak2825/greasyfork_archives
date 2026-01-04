// ==UserScript==
// @name         电报键盘！
// @namespace    https://pen-yo.github.io/
// @version      2023-12-25
// @description  滴滴滴滴！吵死你！
// @author       Penyo
// @match        **/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460383/%E7%94%B5%E6%8A%A5%E9%94%AE%E7%9B%98%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/460383/%E7%94%B5%E6%8A%A5%E9%94%AE%E7%9B%98%EF%BC%81.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const max = 10;

  const unused = [];
  const using = [];

  const audio = new AudioContext();

  function supply(arr) {
    const oscillator = audio.createOscillator();
    oscillator.frequency.value = 1500;
    oscillator.connect(audio.destination);
    arr.push(oscillator);
  }

  function use(arr, key) {
    if (arr.length < 0) return;
    const o = arr.pop();
    o.start();
    using.push({
      key: key,
      target: o,
    });
    supply(arr);
  }

  for (let i = 0; i < max; i++) supply(unused);

  console.log(unused, using);

  document.addEventListener("keypress", (e) => {
    use(unused, e.code);
  });

  document.addEventListener("keyup", (e) => {
    using.forEach((o) => {
      if (e.code == o.key) o.target.stop();
    });
  });
})();
