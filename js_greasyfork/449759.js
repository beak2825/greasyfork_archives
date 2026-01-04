// ==UserScript==
// @name         figma replace css
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  figma replace css variables
// @author       pipipier
// @match        http*://www.figma.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @run-at      document-end
// @grant       unsafeWindow
// @grant       window.console
// @license    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/449759/figma%20replace%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/449759/figma%20replace%20css.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const variable = {
  "--blue-1": "#f4f7fd",
  "--blue-2": "#a9bff1",
  "--blue-3": "#527ee2",
  "--blue-4": "#275edb",
  "--blue-5": "#2252c0",
  "--blue-grey-1": "#ecf1f4",
  "--blue-grey-2": "#afb0b8",
  "--blue-grey-3": "#565871",
  "--blue-grey-4": "#38394d",
  "--blue-grey-5": "#16161e",
  "--red-1": "#fdf4f3",
  "--red-2": "#fad4d2",
  "--red-3": "#ef7e77",
  "--red-4": "#e4281d",
  "--red-5": "#ba2017",
  "--orange-1": "#fff4e5",
  "--orange-2": "#fbe6d2",
  "--orange-3": "#f2b577",
  "--orange-4": "#ea841c",
  "--orange-5": "#c86f14",
  "--green-1": "#f4fcf8",
  "--green-2": "#d3f3e5",
  "--green-3": "#7cdcb0",
  "--green-4": "#24c47b",
  "--green-5": "#1e9b62",
  "--purple-1": "#faf7ff",
  "--purple-2": "#eae0ff",
  "--purple-3": "#d5c0fe",
  "--purple-4": "#ab81fd",
  "--purple-5": "#8b5ce8",
  "--yellow-1": "#fffcf4",
  "--yellow-2": "#fff4d2",
  "--yellow-3": "#ffe8a5",
  "--yellow-4": "#ffd14b",
  "--yellow-5": "#ffc61e",
  "--yellow-6": "#ff9500",

  "--silver-grey-1": "#f1f8ff",
  "--silver-grey-2": "#e9f4ff",
  "--silver-grey-3": "#d7ebff",
  "--silver-grey-4": "#b6c7d9",
  "--silver-grey-5": "#9aa9b8",
  "--pink-1": "#fff8fb",
  "--pink-2": "#ffe3ee",
  "--pink-3": "#ffc6dd",
  "--pink-4": "#ff8dbc",
  "--pink-5": "#e9649a",
  "--sky-blue-1": "#f8fdfe",
  "--sky-blue-2": "#e4f8fe",
  "--sky-blue-3": "#c9f1fc",
  "--sky-blue-4": "#93e3f9",
  "--sky-blue-5": "#65cae6",

  "--grey-0": "#ffffff",
  "--grey-1": "#f5f5f5",
  "--grey-2": "#e9e9e9",
  "--grey-3": "#d9d9d9",
  "--grey-4": "#bfbfbf",
  "--grey-5": "#9d9d9d",
  "--grey-6": "#737373",
  "--grey-7": "#555555",
  "--grey-8": "#434343",
  "--grey-9": "#262626",
  "--grey-10": "#141414",
  "--grey-11": "#b0b0b0",
  "--grey-c4": "#c4c4c4",
  "--avater-purple": "#6b71db",
  "--avatar-pink": "#c06bd8",
  "--avatar-red": "#cd4e39",
  "--avatar-orange": "#f6ab0f",
  "--avatar-green": "#00ad96",
  "--dark-green-3-d": "#20a066",

  "--color-green-cell": "#36bd93",
  "--color-float": "#00cac8",
  "--color-replylist": "#eef1f4",
};

const variableMap = new Map();
for (let prop in variable) {
  variableMap.set(variable[prop].toLocaleUpperCase(), prop);
}

const debounce = (callback, delay = 200, im = false) => {
  let timeoutID = null;
  return function () {
    if (im && !timeoutID) callback.apply(this, arguments);
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      callback.apply(this, arguments);
      timeoutID = null;
    }, delay);
  };
};

const installFigmaPlugin = debounce(function (el) {
  const codeElList = el.querySelectorAll(
    ".css_code_panel--cssCodeContent--3ffb6 .hljs-number"
  );
  codeElList.forEach((ele) => {
    const text = ele.innerText;
    const color = text.match(/#(\w)+\b/);

    if (color && color[0]) {
      const variable = variableMap.get(color[0].toLocaleUpperCase());
      if (variable) {
        ele.innerText = text.replace(/#(\w)+\b/, `var(${variable})`);
      }
    }
  });
}, 300);

const checkFigma = function () {
  const oldLog = unsafeWindow.console.log;
  unsafeWindow.console.log = function (...args) {
    if (/\[Fullscreen\] loadtime/gi.test(args[0])) {
      setTimeout(() => {
        const el = document.querySelector("[name=propertiesPanelContainer]");
        if (el) {
          installFigmaPlugin(el);

          const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
              if (mutation.target?.className !== "hljs-number") {
                installFigmaPlugin(el);
              }
            });
          });

          observer.observe(el, {
            subtree: true,
            childList: true,
          });
        }
      }, 1000);
    }
    oldLog(...args);
  };
};

checkFigma();

})();