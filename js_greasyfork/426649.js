// ==UserScript==
// @name         智赢Gitlab助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  日常工作自动化脚本
// @author       Aturan
// @match        http://gitlab.zhiwin.cn/*
// @match        https://gitlab.zhiwin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426649/%E6%99%BA%E8%B5%A2Gitlab%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426649/%E6%99%BA%E8%B5%A2Gitlab%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  $(() => {
    if (/\/\-\/merge_requests\/\d+/.test(location.pathname)) {
      const timer = setInterval(() => {
        const $root = $('#content-body .merge-request-details');
        const $dropdown = $('.js-issuable-actions > .dropdown:first');
        if ($root.length > 0 && $dropdown.length > 0) {
          clearInterval(timer);
          const sourceBranch = $root.find('.detail-page-description').first().find('.js-source-branch-copy').data('clipboard-text');
          const baseUrl = location.pathname.split('/-/')[0] + '/-/merge_requests/new?';
          let query = `${encodeURIComponent('merge_request[source_branch]')}=${encodeURIComponent(sourceBranch)}`;
          query += `&${encodeURIComponent('merge_request[target_branch]')}=${encodeURIComponent('test')}`;
          query += `&${encodeURIComponent('merge_request[title]')}=${encodeURIComponent(
            '合并到测试环境：' +
              $('.page-title')
                .text()
                .trim()
                .replace(/(Draft|WIP):\s*/gm, '')
          )}`;
          query += `&${encodeURIComponent('merge_request[force_remove_source_branch]')}=0`;
          const $link = $(`<li class="gl-dropdown-item"><a class="dropdown-item" target="_blank" href="${baseUrl + query}"><div class="gl-dropdown-item-text-wrapper">合并到测试环境</div></a></li>`);
          $dropdown.find('.gl-dropdown-contents ul').prepend($link);
        }
      }, 1000);
    }
  });
})();
