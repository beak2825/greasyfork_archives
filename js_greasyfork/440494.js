// ==UserScript==
// @name         修改 EP 上点击复制后的内容
// @namespace    https://github.com/zenoven/scripts
// @version      0.1.3
// @description  EP 单子上面点击复制时将内容修改为 "feat: TASK-12345 增加管控功能“ 这样的形式。
// @author       zenoven
// @match        https://overmind-project.netease.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440494/%E4%BF%AE%E6%94%B9%20EP%20%E4%B8%8A%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6%E5%90%8E%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/440494/%E4%BF%AE%E6%94%B9%20EP%20%E4%B8%8A%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6%E5%90%8E%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

const copyBtnSelectors = [
  '#header div.ant-col.ant-col-15 span.anticon.issueIcon.u-mgl5',
  '#header div.ant-row.f-fs2  > span.anticon.u-mgl10.issueIcon', //  taskdetail
]
const url =
  'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
const issue = '([A-Z][a-z]+)-\\d+';
const reg = new RegExp(`(${issue})(?:\\:)(.*)(${url})$`);
const prefixTextMap = {
  Feature: 'feat',
  Task: 'feat',
  Bug: 'fix',
};
const addPrefix = true; // 是否自动添加 'feat: '
const isDescendant = (parent, child) => {
  let node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};
(function () {
  'use strict';
  document.body.addEventListener('click', (e) => {
    let btn;
    copyBtnSelectors.some((selector) => {
      let result = document.querySelector(selector);
      if (result) {
        btn = result;
        return 1;
      }
    });
    if (!btn) return;
    if (e.target === btn || isDescendant(btn, e.target)) {
      navigator.clipboard.readText().then((clipText) => {
        let modifiedText = clipText.replace(
          reg,
          (match, issue, issueType, text) => {
            let upperCasedIssue = issue.toUpperCase();
            let prefix = prefixTextMap[issueType];
            if (!addPrefix || !prefix) return upperCasedIssue + ': ' + text;
            return (
              prefixTextMap[issueType] + ': ' + upperCasedIssue + ' ' + text
            );
          }
        );
        return navigator.clipboard.writeText(modifiedText);
      });
    }
  });
})();
