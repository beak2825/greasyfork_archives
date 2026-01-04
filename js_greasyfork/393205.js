// ==UserScript==
// @name github-update-forked
// @name:CN-zh_cn GitHub更新fork仓库
// @version 0.6
// @description update forked repository
// @author gaojr
// @namespace https://github.com/gaojr/scripts-styles
// @license MIT
// @match https://github.com/*
// @require https://greasyfork.org/scripts/393085-commonsutil/code/CommonsUtil.js
// @grant none
// @connect github.com
// @icon https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/393205/github-update-forked.user.js
// @updateURL https://update.greasyfork.org/scripts/393205/github-update-forked.meta.js
// ==/UserScript==

const wlh = window.location.href;

/**
 * 是否为 forked 仓库
 * @return {boolean} 是否为 forked 仓库
 */
const isForked = function () {
  return !!_$('.fork-flag');
};

/**
 * 是否落后
 * @return {boolean} 是否落后
 */
const isBehind = function () {
  let content = _$('.branch-infobar').textContent;
  return content.indexOf('behind') !== -1;
};

/**
 * 获取父项目信息
 * @return {*} 父项目信息
 */
const getParentInfo = function () {
  let content = _$('.fork-flag a').textContent;
  return {
    user: content.split('/')[0],
    repository: content.split('/')[1],
  };
};

/**
 * 根据url获取分支
 * @param {string} url 地址
 * @return {string} 分支名
 */
const getBranch = function (url) {
  let index = url.lastIndexOf('/') + 1;
  return url.substr(index);
};

/**
 * 处理update按钮的链接
 * @param {Element} ele 元素
 */
const dealUpdateBtnHref = function (ele) {
  let parentInfo = getParentInfo();
  let href = ele.href.replace('pull/new', 'compare');
  let branch = getBranch(href);
  href += '...' + parentInfo.user + ':' + branch;
  ele.href = href;
};

(function () {
  let func = () => {
    const isRepository = /https:\/\/github\.com\/[^\/]*\/[^\/]*/;
    if (isRepository.test(wlh) && isForked() && isBehind()) {
      // 生成更新按钮
      let prBtn = _$('div.branch-infobar .muted-link');
      if (prBtn.textContent.indexOf('Pull request') === -1) {
        // 有合并请求时不生成按钮
        return;
      }
      let updateBtn = prBtn.outerHTML.replace('Pull request', 'update');
      prBtn.outerHTML = updateBtn + prBtn.outerHTML;
      // 绑定点击事件
      dealUpdateBtnHref(_$('div.branch-infobar .muted-link'));
    }
  };
  addToFuncMap('github-update-forked', func);
})();
