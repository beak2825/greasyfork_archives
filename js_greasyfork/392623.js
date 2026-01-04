// ==UserScript==
// @name GitHubHideDesktop
// @name:CN-zh_cn GitHub隐藏Desktop按钮
// @version 0.7
// @description hide "Open in GitHub Desktop" button
// @author gaojr
// @namespace https://github.com/gaojr/scripts-styles
// @license MIT
// @match https://github.com/*
// @require https://greasyfork.org/scripts/393085-commonsutil/code/CommonsUtil.js
// @grant none
// @connect github.com
// @icon https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/392623/GitHubHideDesktop.user.js
// @updateURL https://update.greasyfork.org/scripts/392623/GitHubHideDesktop.meta.js
// ==/UserScript==

(function () {
  let func = () => {
    // 删除仓库页的 "Open with GitHub Desktop"
    // 删除文件页的 "Open in GitHub Desktop"
    removeIt('a[href="https://desktop.github.com"]', false);
  };
  addToFuncMap('github-hide-desktop', func);
})();
