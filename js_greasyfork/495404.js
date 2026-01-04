// ==UserScript==
// @name         Download Subtitles without Waiting
// @namespace    https://github.com/lcandy2/user.js/tree/main/websites/my-subs.co/download-subtitles-without-waiting
// @version      1.2
// @author       甜檸Cirtron (lcandy2)
// @description  Download subtitles without waiting. Supports My-Subs.co and so on.
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJNSURBVFiF5dZbaM9hGAfwz+a/nE2ojXJhF+ZQkgunqMkVKeeWEq5olFpyIS5cKJLDjRxujHazcqHUEtLUFHOBkoSEmCUhYc79Xbzv5k/bf7//YbnYt379np738Hzf5/C+DwMdJfFfhiWoRmkR93+Ji3iXjcBYXMJk3MW3IhkvxdRoYzlu9TbxNG5jXJEMZ6IMDXgki2c7UNsPxrswHmlM6WmwFJV43Y8EOuK/sjcC/xW5EEjhDI6gvJgk0qhJMK86zk2jHSuKYSMXDwzKkCfgPJqETM8bheZALar+F4GPqMPDQgikcpjbmSE3R+MvCjGeK4Fn2IT3uFCo4UwkrYKeMAG79X2QrFWQ9udVzBVzsA+NCUj0iBSeYBpaEq5ZhNlRni68nouFsryeZd06gTD8QhtaS7AL9diAq/iRZZMdOICb+Bp1D3EK+zE44SGGYG7cTwpHI6t0gq8uoZG+sBXtmbEvxwzZT3FFCME1zBSq4i1O4g3W4z7uoAIbcTDOm4cvgrceCEmZNOzd6MrmMfiEy9FgcxxvxZ4oL8XnKLcJYWvFUyHpa5DO9yYciWGCJ2qwNsGax7gh9AXdFZMvgefYjC3CidYkWLNaiPt3TCyUQIXQZFbhMA5FfSdGRHmUvytqL0YL3dfKLmVel4eQiI1CNz0V96K+CSeibiHOZaxZhVmYJDTBBRFoEnq9ZYInjkV9Az5EgjtxNuqPYz5+RiIt8rz+XwlxLAa2+eceSILtQszbhJrOF0OFa7k+n0dogeDi4QUQ+CyEIdvbMUDwG8Y/gAllrDkCAAAAAElFTkSuQmCC
// @homepage     https://greasyfork.org/scripts/495404
// @homepageURL  https://greasyfork.org/scripts/495404
// @source       https://github.com/lcandy2/user.js/tree/main/websites/my-subs.co/download-subtitles-without-waiting
// @match        *://my-subs.co/downloads/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/495404/Download%20Subtitles%20without%20Waiting.user.js
// @updateURL https://update.greasyfork.org/scripts/495404/Download%20Subtitles%20without%20Waiting.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function removeTimingScripts() {
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      if (script.innerHTML.includes("#timer")) {
        script.remove();
      }
    });
    countDownInterval && clearInterval(countDownInterval);
  }
  function removeTimingElements() {
    const elements = document.querySelectorAll(".countdown");
    elements.forEach((element) => {
      element.remove();
    });
  }
  function makeDownloadAvaliable() {
    const downloadBtnElement = downloadBtn || document.querySelector("#downloadBtn");
    downloadBtnElement && downloadBtnElement.removeAttribute("disabled");
  }
  function addBrandization() {
    var _a;
    const counterDownElement = counterDown || document.querySelector("#countdown");
    if (counterDownElement) {
      const span = counterDownElement.querySelector("span");
      if (span) {
        const p1 = document.createElement("p");
        const style = span.getAttribute("style");
        style && p1.setAttribute("style", style);
        p1.textContent = "Download subtitles now! without any waiting!";
        counterDownElement.replaceChild(p1, span);
        const p2 = document.createElement("p");
        style && p2.setAttribute("style", style);
        p2.style.fontWeight = "normal";
        p2.innerHTML = `by <a href="https://greasyfork.org/scripts/495403" target="_blank">[Download Subtitles without Waiting]</a>, A <a href="https://github.com/lcandy2" target="_blank">甜檸Cirtron@lcandy2</a>'s project.`;
        counterDownElement.appendChild(p2);
      }
    }
    const brandizationElement = counterDownElement == null ? void 0 : counterDownElement.cloneNode(true);
    if (brandizationElement) {
      (_a = counterDownElement == null ? void 0 : counterDownElement.parentNode) == null ? void 0 : _a.replaceChild(
        brandizationElement,
        counterDownElement
      );
    }
  }
  removeTimingScripts();
  addBrandization();
  removeTimingElements();
  makeDownloadAvaliable();

})();