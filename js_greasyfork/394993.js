// ==UserScript==
// @name         FlowdockX
// @namespace    http://twitter.com/grahammcculloch
// @version      0.9
// @noframes
// @description  A small improvement to Flowdock
// @author       Graham McCulloch
// @match        https://www.flowdock.com/app/*
// @grant        none
// @icon         http://blog.flowdock.com/wp-content/uploads/2017/05/WatchIcon-87@3x.png
// @downloadURL https://update.greasyfork.org/scripts/394993/FlowdockX.user.js
// @updateURL https://update.greasyfork.org/scripts/394993/FlowdockX.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const storageKey = "flowdockX_withReplies";

  console.log(String.raw`
______  _                     _               _    __   __
|  ___|| |                   | |             | |   \ \ / /
| |_   | |  ___ __      __ __| |  ___    ___ | | __ \ V /
|  _|  | | / _ \\ \ /\ / // _  | / _ \  / __|| |/ / /   \
| |    | || (_) |\ V  V /| (_| || (_) || (__ |   < / /^\ \
\_|    |_| \___/  \_/\_/  \__,_| \___/  \___||_|\_\\/   \/
`);

  let withReplies = localStorage.getItem(storageKey, 'true') === 'true';

  const $headCss = window.$(`
<style type="text/css">
  li.chat-message.message {
    transition: background-color 0s ease;
  }
  #toolbar > .right-item-group {
    right: 3.8rem;
  }
  #btn-toggle-threads {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 2;
  }
  #btn-toggle-threads svg {
    padding-top: 3px;
  }
  body, body>.flow {
    z-index: 1;
  }
  body.hide-replies .flow:not(.private) .left-panel #chat li.chat-message.message:not(.thread-starter) {
    display: none;
  }
  .reply-count {
    text-align: center;
    font-size: 80%;
    font-weight: bold;
  }
  .theme-flowdark .reply-count {
    color: #bbb;
  }
  .reply-count-wrapper {
    display: flex;
  }
</style>
  `);

  const replyIcon = (size) => {
    return `
<svg class="vector-icon bubble-icon" x="0px" y="0px" viewBox="0 0 ${size} ${size}" data-reactid=".9.1">
  <g data-reactid=".9.1.0">
    <path class="vector-icon-path"
      d="M11.219297,12.803921 C11.2188795,13.287707 11.5307502,13.723651 12.0095154,13.908981 C12.4877588,14.093921 13.0390642,13.991804 13.4055227,13.650182 L19.6246697,7.847278 C20.1250405,7.380641 20.1250405,6.62344 19.6250872,6.156316 L13.4092801,0.350392 C13.1646266,0.121507 12.8368911,0 12.5033106,0 C12.3381903,0 12.1721307,0.029622 12.0136904,0.090716 C11.5349251,0.275656 11.222637,0.712087 11.222637,1.195483 L11.222637,4.755235 L8.988401,4.755235 C2.057852,4.755235 1.6948031,2.082537 1.1856852,1.074049 C1.018715,0.743306 0.4262512,0.646537 0.2128106,1.072977 C-0.7577142,3.01202 1.4935153,9.173136 8.988401,9.173136 L11.2205495,9.173136 L11.219297,12.803921 Z"
      data-reactid=".9.1.0.0">
    </path>
  </g>
</svg>`;
  }

  const toolbarBtn = window.$(`
<a id="btn-toggle-threads" class="toolbar-link active" title="Hide replies">
  <span class="toolbar-toggle">
    ${replyIcon(20)}
  </span>
</button>
  `);

  const body = window.$('body');

  function updateThreadCounts(flowdockSanityActive) {
    const $threadStarters = window.$('.chat-message.thread-starter');
    $threadStarters.each((index) => {
      const $threadStarter = window.$($threadStarters[index]);
      const threadId = $threadStarter.attr('data-parent');
      const $threadReplies = window.$(`.chat-message:not(.thread-starter)[data-parent='${threadId}'`);
      if ($threadReplies.length) {
        const $replyCount = $threadStarter.find('.reply-count');
        const replyCountText = flowdockSanityActive ? `${$threadReplies.length} ${$threadReplies.length > 1 ? 'replies' : 'reply'}` : $threadReplies.length;
        if (!$replyCount.length) {
          if (flowdockSanityActive) {
            const $messageAuthor = $threadStarter.find('.message-author');
            $messageAuthor.wrap('<div class="reply-count-wrapper"></div>');
            const $wrapper = $threadStarter.find('.reply-count-wrapper');
            $wrapper.append(`<div class="reply-count">${replyCountText}</div>`);
          } else {
            const $bubble = $threadStarter.find('.bubble-container .bubble');
            $bubble.append(`<div class="reply-count">${$threadReplies.length}</div>`);
          }
        } else {
          $replyCount.text(replyCountText);
        }
      }
    });
  }

  function initMainChatList($chatList) {
    $chatList.attr('data-reply-count-init', true);
    const $threadIndicator = window.$('.thread-indicator');
    const flowdockSanityActive = $threadIndicator.css('display') === 'none';
    updateThreadCounts(flowdockSanityActive);
    const observer = new MutationObserver(
      (mutationsList, observer) => {
        if (mutationsList.find(m => m.type === 'childList' && m.addedNodes && m.addedNodes.length)) {
          updateThreadCounts(flowdockSanityActive);
        }
      }
    );
    observer.observe($chatList[0], { childList: true });
  }

  function checkForMainChatList() {
    const $mainChatList = window.$('.left-panel .chat-message-list');
    if ($mainChatList.length) {
      const initialized = $mainChatList.attr('data-reply-count-init');
      if (!initialized) {
        initMainChatList($mainChatList);
      }
    }
  }

  function setWithReplies(newWithReplies) {
    withReplies = newWithReplies;
    localStorage.setItem(storageKey, withReplies);
    if (withReplies) {
      body.removeClass('hide-replies');
      toolbarBtn.attr('title', 'Hide replies');
      toolbarBtn.addClass('active');
    } else {
      body.addClass('hide-replies');
      toolbarBtn.attr('title', 'Show replies');
      toolbarBtn.removeClass('active');
    }
  }

  window.$('head').append($headCss);
  body.append(toolbarBtn);
  setWithReplies(withReplies);
  toolbarBtn.on('click', () => { setWithReplies(!withReplies); });

  setInterval(checkForMainChatList, 1000);

})();