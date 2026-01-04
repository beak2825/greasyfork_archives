// ==UserScript==
// @name        bilibili-roll-history
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/
// @run-at      document-idle
// @grant       GM_addStyle
// @version     1.2.2
// @author      mesimpler
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description 为你的b站首页添加换一换回溯历史功能。(add roll history btn in bilibili home page.)
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/490584/bilibili-roll-history.user.js
// @updateURL https://update.greasyfork.org/scripts/490584/bilibili-roll-history.meta.js
// ==/UserScript==
const feedHistory = [];
const maxHistory = 10;
let feedHistoryIndex = 0;

const nextBtn = MS_createElement(`
<button id="feed-roll-next-btn" class="primary-btn feed-roll-next-btn btn-disabled">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.1716 6.99955H11C7.68629 6.99955 5 9.68584 5 12.9996C5 16.3133 7.68629 18.9996 11 18.9996H20V20.9996H11C6.58172 20.9996 3 17.4178 3 12.9996C3 8.58127 6.58172 4.99955 11 4.99955H18.1716L15.636 2.46402L17.0503 1.0498L22 5.99955L17.0503 10.9493L15.636 9.53509L18.1716 6.99955Z"></path></svg>
</button>
`);
const backBtn = MS_createElement(`
<button id="feed-roll-back-btn" class="primary-btn feed-roll-back-btn btn-disabled">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.82843 6.99955L8.36396 9.53509L6.94975 10.9493L2 5.99955L6.94975 1.0498L8.36396 2.46402L5.82843 4.99955H13C17.4183 4.99955 21 8.58127 21 12.9996C21 17.4178 17.4183 20.9996 13 20.9996H4V18.9996H13C16.3137 18.9996 19 16.3133 19 12.9996C19 9.68584 16.3137 6.99955 13 6.99955H5.82843Z"></path></svg>
</button>
`);

const targetNode = document.querySelector(".recommended-container_floor-aside");
const disconnect = VM.observe(targetNode, () => {
  const feedRollBtn = document.querySelector(".roll-btn");

  if (feedRollBtn) {
    // 处理返回上一页feed的历史内容
    feedRollBtn.parentNode.appendChild(backBtn);
    backBtn.addEventListener("click", () => {
      let feedCards = document.getElementsByClassName("feed-card");
      if (feedHistoryIndex == feedHistory.length) {
        feedHistory.push(listInnerHTMLOfFeedCard(feedCards));
      }
      for (let fc_i = 0; fc_i < feedCards.length; fc_i++) {
        feedCards[fc_i].innerHTML = feedHistory[feedHistoryIndex - 1][fc_i];
      }
      feedHistoryIndex = feedHistoryIndex - 1;
      updateBtnStatus();
    });

    // 处理返回下一页feed的历史内容
    feedRollBtn.parentNode.appendChild(nextBtn);
    nextBtn.addEventListener("click", () => {
      let feedCards = document.getElementsByClassName("feed-card");

      for (let fc_i = 0; fc_i < feedCards.length; fc_i++) {
        feedCards[fc_i].innerHTML = feedHistory[feedHistoryIndex + 1][fc_i];
      }

      feedHistoryIndex = feedHistoryIndex + 1;
      updateBtnStatus();
    });

    // 处理点击换一换事件
    feedRollBtn.addEventListener("click", () => {
      // 等待网络请求加载完毕
      setTimeout(() => {
        if (feedHistoryIndex == feedHistory.length) {
          let feedCards = listInnerHTMLOfFeedCard(
            document.getElementsByClassName("feed-card")
          );
          feedHistory.push(feedCards);
        }
        if (feedHistory.length > maxHistory) {
          feedHistory.shift();
        }

        feedHistoryIndex = feedHistory.length;
        updateBtnStatus();
      });
    });

    // disconnect observer
    return true;
  }
});

GM_addStyle(`
.feed-roll-back-btn {
  flex-direction: column;
  margin-left: 0 !important;
  height: 40px !important;
  width: 40px;
  padding: 11px;
  margin-top: 6px;
}
.feed-roll-back-btn svg {
  margin-right: 0;
  margin-bottom: 0px;
}
.feed-roll-next-btn {
  flex-direction: column;
  margin-left: 0 !important;
  height: 40px !important;
  width: 40px;
  padding: 11px;
  margin-top: 6px;
}
.feed-roll-next-btn svg {
  margin-right: 0;
  margin-bottom: 0px;
}
.btn-disabled{
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
`);

function updateBtnStatus() {
  if (feedHistoryIndex <= 0) {
    backBtn.classList.add("btn-disabled");
  } else {
    backBtn.classList.remove("btn-disabled");
  }

  if (feedHistoryIndex >= feedHistory.length - 1) {
    nextBtn.classList.add("btn-disabled");
  } else {
    nextBtn.classList.remove("btn-disabled");
  }
}
function listInnerHTMLOfFeedCard(feedCardElements) {
  let feedCardInnerHTMLs = [];
  for (let fc of feedCardElements) {
    feedCardInnerHTMLs.push(fc.innerHTML);
  }
  return feedCardInnerHTMLs;
}
function MS_createElement(htmlString) {
  const element = document.createElement("div");
  element.innerHTML = htmlString;
  return element.firstElementChild;
}
