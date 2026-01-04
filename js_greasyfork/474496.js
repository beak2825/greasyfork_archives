// ==UserScript==
// @name         微博编辑记录对比
// @version      1.1.3
// @match        https://weibo.com/*
// @namespace    weibo-diff
// @run-at       document-start
// @description  查看微博编辑记录比对上下文修改
// @author       C-racker
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/jsdiff/5.1.0/diff.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474496/%E5%BE%AE%E5%8D%9A%E7%BC%96%E8%BE%91%E8%AE%B0%E5%BD%95%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/474496/%E5%BE%AE%E5%8D%9A%E7%BC%96%E8%BE%91%E8%AE%B0%E5%BD%95%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function () {
  const originOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (_, url) {
    if (/\/ajax\/statuses\/editHistory/.test(url)) {
      const xhr = this;
      const getter = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        "response"
      ).get;
      Object.defineProperty(xhr, "responseText", {
        get: () => {
          let result = getter.call(xhr);
          try {
            const _res = JSON.parse(result);
            const res = JSON.parse(result);
            for (let i = _res.statuses.length - 1; i >= 0; i--) {
              if (i === 0) {
                break;
              }
              let text = "";
              const diff = Diff.diffChars(
                _res.statuses[i].text,
                _res.statuses[i - 1].text
              );
              diff.forEach((part) => {
                text += part.added
                  ? `<span style="color:green">${part.value}</span>`
                  : part.removed
                  ? `<span style="color:red">${part.value}</span>`
                  : part.value;
              });
              res.statuses[i - 1].text = text;
            }
            return JSON.stringify(res);
          } catch (e) {
            return result;
          }
        },
      });
    }
    originOpen.apply(this, arguments);
  };
})();
