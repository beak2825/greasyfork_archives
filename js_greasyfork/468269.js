// ==UserScript==
// @name         GitLab Code Review Quality Feedback
// @namespace    https://greasyfork.org/zh-CN/scripts/468269-gitlab-code-review-quality-feedback
// @version      0.6
// @description  Add thumbs up and down to each review comment
// @author       zhengen
// @match        *://gitlab.gz.cvte.cn/*
// @grant        GM_xmlhttpRequest
// @connect      seewo.com
// @downloadURL https://update.greasyfork.org/scripts/468269/GitLab%20Code%20Review%20Quality%20Feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/468269/GitLab%20Code%20Review%20Quality%20Feedback.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const xhr = (option) =>
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({ ...option, onerror: reject, onload: resolve });
    });
  const baseUrl = 'https://code-review2.test.seewo.com';
  // const upSvgStr = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
  // const downSvgStr = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>`;
  const statusSaveKey = 'STATUS-SAVE-KEY';
  const statusSaveKeyMap =
  JSON.parse(localStorage.getItem(statusSaveKey)) || {};
  // const getSvgElement = (svgStr) => {
  //   const div = document.createElement('div');
  //   div.innerHTML = svgStr;
  //   return div.firstChild;
  // };

  // 获取commit和discussion的id
  const getCommitIdAndDIscussionId = (commentNode, content) => {
    let commitId = null;
    const commitLink = commentNode.querySelector(
      'a[data-reference-type="commit"]'
    );
    if (commitLink) {
      commitId = commitLink.getAttribute('data-commit');
    }
    const discussionIdMatch = content.match(/discussionId:\s*([a-f0-9]+)/);
    const discussionId = discussionIdMatch?.[1];
    return { commitId, discussionId };
  };

  // 添加样式
  const addClassStyle = () => {
    const codeClass = `
    .note-text {
      position: relative;
    }
    .code-review-panel {
      position: absolute;
      top: 0;
      right: 0;
      height: 2rem;
      display: flex;
      align-items: center;
    }
    .code-review-panel .code-review-panel-button {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.25rem;
      cursor: pointer;
      color: #737278;
      background: transparent;
      padding: 0.4rem;
    }
    .code-review-panel .code-review-panel-button::before {
      position: absolute;
      content: '';
      transform: translateY(100%);
      color: #000;
      padding: 0.3rem;
      background: #fff;
      border-radius: 0.3rem;
      box-shadow: 0px 4px 16px 0px rgba(28, 29, 30, 0.12);
      text-align: center;
      display: none;
    }
    .code-review-panel .code-review-panel-button:hover::before {
      display: block;
    }
    .code-review-panel-button.up::before {
      content: '审查意见正确，且必须修改';
      width: 12rem;
    }
    .code-review-panel-button.middle::before {
      content: '审查意见正确，但非必须修改';
      width: 12rem;
    }
    .code-review-panel-button.down::before {
      content: '审查意见错误';
      width: 6rem;
    }
    .code-review-panel .code-review-panel-tips {
    }
    .code-review-panel .code-review-panel-button svg {
      fill: none;
    }
    .code-review-panel .code-review-panel-button:hover, .code-review-panel .code-review-panel-button.active {
      background: #ececef;
    }
  `;
    // 创建style标签
    const style = document.createElement('style');
    // 添加样式
    style.innerHTML = codeClass;
    // 将style元素插入到head中
    document.head.appendChild(style);
  };

  // 保存信息
  const saveStatus = () => {
    localStorage.setItem(statusSaveKey, JSON.stringify(statusSaveKeyMap));
  };

  // 发送反馈
  const seedFeedback = async (commitId, discussionId, point) => {
    xhr({
      method: 'POST',
      url: `${baseUrl}/code-review/discussion/feedback`,
      data: JSON.stringify({ commitId, discussionId, point }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => console.log(res));
  };

  const activeButton = (buttons, targetButton) => {
    buttons.forEach((button) => {
      if (button === targetButton) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  // 从目标提取评论注入信息
  const addTargetNodeInfo = (node) => {
    const comments = node.querySelectorAll('.note-text'); // Change this selector to select your comment elements
    comments.forEach((comment) => {
      const content = comment.textContent;
      const { commitId, discussionId } = getCommitIdAndDIscussionId(
        comment,
        content
      );

      if (!commitId || !discussionId) {
        return;
      }

      const thumbsPanel = document.createElement('div');
      const thumbsUp = document.createElement('div');
      const thumbsDown = document.createElement('div');
      // 一般按钮
      const thumbsMiddle = document.createElement('div');
      const tips = document.createElement('div');
      tips.textContent = '您觉得评审建议是否满意，请点击反馈：';
      tips.classList.add('code-review-panel-tips');
      tips.classList.add('gl-text-red-500');
      tips.classList.add('gl-font-weight-bold');
      thumbsDown.classList.add('code-review-panel-button');
      thumbsDown.classList.add('down')
      thumbsDown.textContent = '意见错误';
      thumbsMiddle.classList.add('code-review-panel-button');
      thumbsMiddle.classList.add('middle')
      thumbsMiddle.textContent = '意见正确';
      thumbsUp.classList.add('code-review-panel-button');
      thumbsUp.classList.add('up')
      thumbsUp.textContent = '意见有效';
      thumbsPanel.classList.add('code-review-panel');
      const key = statusSaveKeyMap[discussionId]
      if (key) {
        const keyToButton = {
          'up': thumbsUp,
          'middle': thumbsMiddle,
          'down': thumbsDown
        }
        if (keyToButton[key]) {
          keyToButton[key].classList.add('active')
        }
      }
      const buttons = [thumbsUp, thumbsMiddle, thumbsDown]
      thumbsUp.addEventListener('click', () => {
        statusSaveKeyMap[discussionId] = 'up';
        activeButton(buttons, thumbsUp);
        seedFeedback(commitId, discussionId, 1);
        saveStatus();
      });
      thumbsMiddle.addEventListener('click', () => {
        statusSaveKeyMap[discussionId] = 'middle';
        activeButton(buttons, thumbsMiddle);
        seedFeedback(commitId, discussionId, 2);
        saveStatus();
      });
      thumbsDown.addEventListener('click', () => {
        statusSaveKeyMap[discussionId] = 'down';
        activeButton(buttons, thumbsDown);
        seedFeedback(commitId, discussionId, 3);
        saveStatus();
      });

      comment.appendChild(thumbsPanel);
      thumbsPanel.appendChild(tips);
      thumbsPanel.appendChild(thumbsUp);
      thumbsPanel.appendChild(thumbsMiddle);
      thumbsPanel.appendChild(thumbsDown);
    });
  };

  addClassStyle();
  addTargetNodeInfo(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            addTargetNodeInfo(node);
          }
        });
      }
    });
  });
  const config = { childList: true, subtree: true };
  observer.observe(document, config);
})();
