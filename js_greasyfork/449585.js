// ==UserScript==
// @name         gitlab小帮手:一键复制url与commit信息，一键展开收起diff模块，便捷选择commit信息创建pr，自动设置指派人和review人
// @name:zh-CN   gitlab小帮手:一键复制url与commit信息，一键展开收起diff模块，便捷选择commit信息创建pr，自动设置指派人和review人
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  1.一键复制url与commit信息；2.一键展开收起diff模块；3.自动设置指派人和review人
// @author       zzailianlian
// @require      https://unpkg.com/clipboard@2.0.11/dist/clipboard.min.js
// @match        *://gitlab.babytree-inc.com/**/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meitun-test.com
// @license      MIT
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/449585/gitlab%E5%B0%8F%E5%B8%AE%E6%89%8B%3A%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6url%E4%B8%8Ecommit%E4%BF%A1%E6%81%AF%EF%BC%8C%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7diff%E6%A8%A1%E5%9D%97%EF%BC%8C%E4%BE%BF%E6%8D%B7%E9%80%89%E6%8B%A9commit%E4%BF%A1%E6%81%AF%E5%88%9B%E5%BB%BApr%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%8C%87%E6%B4%BE%E4%BA%BA%E5%92%8Creview%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449585/gitlab%E5%B0%8F%E5%B8%AE%E6%89%8B%3A%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6url%E4%B8%8Ecommit%E4%BF%A1%E6%81%AF%EF%BC%8C%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7diff%E6%A8%A1%E5%9D%97%EF%BC%8C%E4%BE%BF%E6%8D%B7%E9%80%89%E6%8B%A9commit%E4%BF%A1%E6%81%AF%E5%88%9B%E5%BB%BApr%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%8C%87%E6%B4%BE%E4%BA%BA%E5%92%8Creview%E4%BA%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 因为有些dom是异步渲染的，因此需要用到loopObserver来确保dom刷新时执行指定操作
  function loopObserver({ getObserver = () => {}, action = () => {} }) {
    const interval = setInterval(() => {
      const observerRecords = getObserver();
      if (observerRecords) {
        action();
        clearInterval(interval);
      }
    }, 200);
  }

  // commit列表
  function initCommitList() {
    loopObserver({
      getObserver: () => document.querySelectorAll('li .commit'),
      action: () => {
        const commitList = Array.from(document.querySelectorAll('li .commit'))?.map(dom => ({
          commitContent: dom.querySelector('.commit-row-message').innerText,
          commitAuthor: dom.querySelector('.commit-author-link').innerText,
        }));
        function insertCommentTitle(e) {
          const innerCommitDom = e.target.querySelector('span') || e.target;
          document.querySelector('input[required="required"]').value = innerCommitDom.innerText;
        }
        if (commitList.length <= 1) return;
        if (document.querySelector('div.text-muted')) {
          document.querySelector('div.text-muted').innerHTML = `<div class="optional-commit-info-wrapper">${commitList
            .map(
              commit =>
                `<div class="optional-commit-info gl-button btn btn-confirm gl-mr-2" style="margin-top:8px;">${commit.commitAuthor}：<span>${commit.commitContent}</span></div>`
            )
            .join('')}</div>`;
        }
        if (document.querySelector('.optional-commit-info-wrapper')) {
          document.querySelector('.optional-commit-info-wrapper').onclick = insertCommentTitle;
        }
      },
    });
  }
  // Array.from(document.querySelectorAll('a.commit-row-message')).map(item=>item.innerText)

  // 复制按钮
  function initCopyBtn() {
    const commitDom = $('.detail-page-description h2');
    const btn = $('<button class="gl-button btn btn-confirm gl-mr-2" style="margin-left:8px;">复制</button>');
    btn.on('click', copyUrlAndCommitInfo);

    const commitText = $('.detail-page-description h2:not(button)').text();
    commitDom.append(btn);
    const info = `${window.location.href.match(/.+merge_requests\/\d+/)?.[0]}
      ${commitText}`;

    function copyUrlAndCommitInfo() {
      copyText(info);
    }
  }
  // 展开收起diff
  function initExpandBtn() {
    const expandBtn = $(
      '<button id="__expand_btn" class="gl-button btn btn-confirm gl-mr-2" style="margin-right:8px;">展开/收起 diff</button>'
    );
    let intervalTimer = setInterval(() => {
      if (document.querySelector('#__expand_btn')) return;
      if ($('.mr-version-menus-container').length) {
        $('.mr-version-menus-container').css({ zIndex: '-1' }).prepend(expandBtn);

        expandBtn.on('click', function () {
          const originIsClicked = $(this).attr('isclicked');
          const isClicked = originIsClicked == 'true';
          $(this).attr('isclicked', originIsClicked == 'true' ? 'false' : 'true');
          if (isClicked) {
            $('aside').map(function () {
              $(this).attr('style', '');
            });
            $('aside').eq(0).parent().attr('style', '');
            $('aside').eq(0).next().attr('style', '');
            $('.diff-files-holder').attr('style', '');
          } else {
            $('aside').map(function () {
              $(this).css({ width: 0 });
            });
            $('.diff-files-holder').attr('style', 'max-width:unset');
            $('aside').eq(0).parent().css({ paddingLeft: 0 });
            $('aside')
              .eq(0)
              .next()
              .css({ paddingRight: isClicked ? null : 0 });
          }
        });
        clearInterval(intervalTimer);
      }
    }, 200);
  }

  window.addEventListener('load', function () {
    initCopyBtn();
    initExpandBtn();
    document.querySelector('.diffs-tab').addEventListener(
      'click',
      function () {
        initExpandBtn();
      },
      true
    );
    initCommitList();
    initAssignAndReviewer();
  });

  // 更改assign跟reviewer的人
  function initAssignAndReviewer() {
    const assign = 'zhaoqian';
    const reviewer = 'zhaoqian';
    if (location.href.includes('merge_requests')) {
      // Assign自动赋值
      loopObserver({
        getObserver: () => document.querySelector('.merge-request-assignee'),
        action: () => {
          document.querySelector('.merge-request-assignee button').click();
          document.querySelector('.merge-request-assignee input[type="search"]').value = assign;
          loopObserver({
            getObserver: () =>
              document.querySelectorAll('.merge-request-assignee .dropdown-content  a .dropdown-menu-user-username')
                .length === 1,
            action: () => {
              document
                .querySelector('.merge-request-assignee .dropdown-content  a .dropdown-menu-user-username')
                .click();
              // Reviewer自动赋值
              loopObserver({
                getObserver: () => document.querySelector('.merge-request-reviewer'),
                action: () => {
                  document.querySelector('.merge-request-reviewer button').click();
                  document.querySelector('.merge-request-reviewer input[type="search"]').value = reviewer;
                  loopObserver({
                    getObserver: () =>
                      document.querySelectorAll(
                        '.merge-request-reviewer .dropdown-content  a .dropdown-menu-user-username'
                      ).length === 1,
                    action: () => {
                      document
                        .querySelector('.merge-request-reviewer .dropdown-content  a .dropdown-menu-user-username')
                        .click();
                    },
                  });
                },
              });
            },
          });
        },
      });
    }
  }

  // 复制文案
  function copyText(value) {
    if (value == null || value === '') return false;
    let textarea = document.createElement('textarea');
    textarea.style.height = '0';
    textarea.style.width = '0';
    textarea.value = value;
    const firstDiv = document.body.querySelector('div');
    firstDiv.parentNode.insertBefore(textarea, firstDiv);
    textarea.focus();
    textarea.setSelectionRange ? textarea.setSelectionRange(0, textarea.value.length) : textarea.select();
    let result = document.execCommand('copy');
    firstDiv.parentNode.removeChild(textarea);
    return result;
  }
})();
