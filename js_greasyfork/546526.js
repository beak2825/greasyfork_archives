// ==UserScript==
// @name        Zhihu Desktop on Mobile
// @name:zh-CN  知乎桌面版适配移动端
// @description Use full-featured desktop web zhihu on your phone.
// @description:zh-CN 在你的手机上使用全功能的知乎桌面网页版。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.4
// @author      kkocdko
// @license     Unlicense
// @match       *://*.zhihu.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/546526/%E7%9F%A5%E4%B9%8E%E6%A1%8C%E9%9D%A2%E7%89%88%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/546526/%E7%9F%A5%E4%B9%8E%E6%A1%8C%E9%9D%A2%E7%89%88%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.meta.js
// ==/UserScript==

const afterEnter = (f, condition = () => document.documentElement) => {
  if (condition()) return f();
  const observer = new MutationObserver(() => {
    if (!condition()) return;
    observer.disconnect();
    f();
  });
  observer.observe(document, { childList: true, subtree: true });
};

const css = ([s]) => {
  const el = document.createElement("style");
  el.textContent = s.replace(/;/g, "!important;");
  afterEnter(() => {
    document.documentElement.appendChild(el);
  });
};

css`
  .ContentItem-title,
  .QuestionHeader-title {
    font-weight: normal;
    margin: 0;
  }
  .OpenInAppButton,
  .PlaceHolder.List-item {
    display: none;
  }
  @media (orientation: portrait) {
    header.AppHeader > * {
      min-width: 1280px;
    }
    header.AppHeader,
    .Topstory-container,
    .Topstory-mainColumn,
    .Question-main,
    .Question-mainColumn,
    .Search-container,
    .SearchMain,
    .Profile-main,
    .Profile-mainColumn,
    .TopicMetaCard,
    #TopicMain {
      overflow: auto;
      width: 100vw;
      min-width: 100vw;
      padding: 0;
      margin: 0;
      margin-top: -10px;
    }
    .Question-mainColumn + *,
    .Topstory-mainColumn + *,
    .ContentItem-actions > :not(:first-child) svg {
      display: none;
    }
    .Search-container .List-item,
    .Question-mainColumn .List-item,
    .Profile-mainColumn .List-item,
    .Topstory-mainColumn .TopstoryItem,
    .QuestionAnswer-content,
    .TopicFeedList .List-item {
      padding: 4px 4px 8px;
    }
    .ContentItem-actions {
      left: 0;
      padding: 4px 0 0 0;
      margin: 0;
      overflow: auto;
      overflow: overlay;
      overflow-y: hidden;
    }
    .ContentItem-actions > * {
      margin: 0 8px 0 0;
    }
    .ContentItem-actions.is-fixed {
      width: 100vw;
      padding: 0;
    }
    .Modal-content {
      max-width: 100vw;
    }
    .TopicMetaCard-wikiDescription {
      height: auto;
    }
    .Topic-bar {
      min-width: 520px;
    }
  }
`;
