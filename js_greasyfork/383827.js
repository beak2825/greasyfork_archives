// ==UserScript==
// @name         知乎助手
// @namespace    pionxzh
// @version      1.2.1
// @author       pionxzh
// @description  自动屏蔽黑名单的所有评论与文章 | 去除知乎盐选 | 去除Live | 自动收起回答 | 取消外链跳转
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @match        *.zhihu.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/sentinel-js/0.0.7/sentinel.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383827/%E7%9F%A5%E4%B9%8E%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383827/%E7%9F%A5%E4%B9%8E%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(` div.SearchResult-Card.__BLOCKED__ {
  display: none !important;
}

div.SearchResult-Card:has(div[data-za-detail-view-path-is_ad=true]) {
  display: none !important;
}

div.List-item:has(.KfeCollection-AnswerTopCard-Container) {
  display: none !important;
}

div.List-item:has(.VideoAnswerPlayer) {
  display: none !important;
}

div.List-item .Reward {
  display: none !important;
}

footer.Footer {
  display: none !important;
}

.Question-mainColumn {
  width: unset !important;
}
.Question-mainColumn .AuthorInfo {
  max-width: unset !important;
}

.Question-sideColumn {
  display: none !important;
} `);

(function (sentinel) {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const BLOCKED_USER_KEY = "__zhihu_blocked_user__";
  async function fetchData(offset, limit) {
    try {
      const url2 = `https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`;
      const res = await fetch(url2);
      const { data, paging } = await res.json();
      if (paging.is_end)
        return data;
      const result = data.concat(await fetchData(offset + limit, limit));
      _GM_setValue(BLOCKED_USER_KEY, result);
      return result;
    } catch (error) {
      console.error("[Zhihu]", error);
      return _GM_getValue(BLOCKED_USER_KEY, []);
    }
  }
  function getBlockedUser() {
    const offset = 0;
    const limit = 20;
    return fetchData(offset, limit);
  }
  function onloadSafe(fn) {
    if (document.readyState === "complete") {
      fn();
    } else {
      window.addEventListener("load", fn);
    }
  }
  const url = new URL(window.location.href);
  purifyDocumentTitle();
  blockByBlackList();
  blockVideoAnswer();
  autoCollapseAnswers();
  adjustRelatedQuestions();
  removeExternalLinkRedirection();
  function purifyDocumentTitle() {
    const title = document.title.replace(/^\((\d{1,2}\+? 条消息)?( \/ )?(\d{1,2}\+? 封私信)?\) /, "").replace(/^\((\d{1,2}\+? 封私信)?( \/ )?(\d{1,2}\+? 条消息)?\) /, "").replace(/ - 知乎$/, "");
    document.title = title;
    const titleEl = document.head.querySelector("title");
    const mutationObserver = new MutationObserver(() => {
      if (document.title === title)
        return;
      document.title = title;
    });
    mutationObserver.observe(titleEl, { childList: true });
  }
  async function blockByBlackList() {
    const blockedUserList = await getBlockedUser();
    _GM_addStyle(blockedUserList.map((user) => `
// 屏蔽回答内容
div.css-194v73m:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) div.CommentContent,
div.css-8j5fyx:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) div.CommentContent {
    display: none !important;
}

// 屏蔽回答者名称
div.css-194v73m:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) a[href="https://www.zhihu.com/people/${user.id}"]:not(:has(img)),
div.css-8j5fyx:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) a[href="https://www.zhihu.com/people/${user.id}"]:not(:has(img)) {
    font-size: 0 !important;
}

// 重新命名回答者名称
div.css-194v73m:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) a[href="https://www.zhihu.com/people/${user.id}"]:not(:has(img)):after,
div.css-8j5fyx:has(a[href="https://www.zhihu.com/people/${user.id}"] > img[alt="${user.name}"]) a[href="https://www.zhihu.com/people/${user.id}"]:not(:has(img)):after {
    content: "该用户已被屏蔽";
    font-size: 15px;
    text-decoration: line-through;
}

// 屏蔽用户的回答
div.List-item:has(div.AuthorInfo > meta[itemprop="name"][content="${user.name}"]),
div.SearchResult-Card:has(div.AuthorInfo > meta[itemprop="name"][content="${user.name}"]) {
    display: none !important;
}
`.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")).join(""));
    sentinel.on('div.SearchResult-Card span[itemprop="articleBody"] > b[data-first-child]', (el) => {
      var _a;
      const username = el.textContent;
      if (blockedUserList.some((user) => user.name === username)) {
        (_a = el.closest("div.SearchResult-Card")) == null ? void 0 : _a.classList.add("__BLOCKED__");
      }
    });
  }
  function blockVideoAnswer() {
    sentinel.on("div.SearchResult-Card[data-za-extra-module]", (el) => {
      var _a, _b;
      const extraModule = JSON.parse(el.dataset.zaExtraModule || "{}");
      if (((_b = (_a = extraModule == null ? void 0 : extraModule.card) == null ? void 0 : _a.content) == null ? void 0 : _b.type) === "Zvideo") {
        el.classList.add("__BLOCKED__");
      }
    });
  }
  function autoCollapseAnswers() {
    if (!url.pathname.startsWith("/question/"))
      return;
    const answerWeakSet = /* @__PURE__ */ new WeakSet();
    const expandButtonSelector = "div.List-item button.ContentItem-expandButton";
    const collapseButtonSelector = 'div.QuestionAnswer-content button[data-zop-retract-question="true"], div.List-item button[data-zop-retract-question="true"]';
    const collapseAnswer = (el) => {
      const answer = el.closest("div.QuestionAnswer-content, div.List-item");
      if (!answer)
        return;
      if (answerWeakSet.has(answer))
        return;
      answerWeakSet.add(answer);
      if (answer.offsetHeight < 400)
        return;
      if (el.classList.contains("ContentItem-expandButton"))
        return;
      el.click();
    };
    document.querySelectorAll(expandButtonSelector).forEach(collapseAnswer);
    document.querySelectorAll(collapseButtonSelector).forEach(collapseAnswer);
    sentinel.on(collapseButtonSelector, collapseAnswer);
  }
  function adjustRelatedQuestions() {
    if (!url.pathname.startsWith("/question/"))
      return;
    onloadSafe(() => {
      const questionMain = document.querySelector("div.Question-main");
      const relatedQuestions = document.querySelector('div.Question-sideColumn div[aria-label="相关问题"]');
      const inviteBtn = document.querySelector("div.QuestionHeaderActions button.Button");
      if (!questionMain || !relatedQuestions || !inviteBtn)
        return;
      relatedQuestions.style.display = "none";
      relatedQuestions.style.position = "absolute";
      relatedQuestions.style.border = "1px solid #ebebeb";
      relatedQuestions.style.boxShadow = "0 5px 20px rgba(18,18,18,.1)";
      questionMain.after(relatedQuestions);
      const relatedQuestionBtn = document.createElement("button");
      relatedQuestionBtn.textContent = "相关问题";
      relatedQuestionBtn.classList.add("Button", "Button--grey", "Button--withIcon", "Button--withLabel");
      relatedQuestionBtn.style.marginLeft = "0";
      relatedQuestionBtn.style.marginRight = "8px";
      inviteBtn.insertAdjacentElement("afterend", relatedQuestionBtn);
      const iconHtml = '&ZeroWidthSpace;<svg width="12" height="12" viewBox="0 0 24 24" data-new-api="OpposeFill24" data-old-api="TriangleDown" class="Zi Zi--TriangleDown Button-zi" fill="currentColor"><path d="M13.792 20.319c-.781 1.406-2.803 1.406-3.584 0L2.418 6.296c-.76-1.367.228-3.046 1.791-3.046h15.582c1.563 0 2.55 1.68 1.791 3.046l-7.79 14.023z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>';
      const icon = document.createElement("span");
      icon.style.display = "inline-flex";
      icon.style.alignItems = "center";
      icon.innerHTML = iconHtml;
      relatedQuestionBtn.insertAdjacentElement("afterbegin", icon);
      let isHoveringBtn = false;
      let isHoveringRelatedQuestions = false;
      const onLeave = () => {
        setTimeout(() => {
          if (!isHoveringBtn && !isHoveringRelatedQuestions) {
            relatedQuestions.style.display = "none";
          }
        }, 200);
      };
      relatedQuestionBtn.addEventListener("mouseenter", () => {
        relatedQuestions.style.display = "block";
        relatedQuestions.style.top = `${relatedQuestionBtn.offsetTop + relatedQuestionBtn.offsetHeight}px`;
        relatedQuestions.style.left = `${relatedQuestionBtn.offsetLeft}px`;
        isHoveringBtn = true;
      });
      relatedQuestionBtn.addEventListener("mouseleave", () => {
        isHoveringBtn = false;
        onLeave();
      });
      relatedQuestions.addEventListener("mouseenter", () => {
        isHoveringRelatedQuestions = true;
      });
      relatedQuestions.addEventListener("mouseleave", () => {
        isHoveringRelatedQuestions = false;
        onLeave();
      });
    });
  }
  function removeExternalLinkRedirection() {
    const selector = 'a[href^="https://link.zhihu.com/?target="]';
    const removeRedirection = (el) => {
      const target = new URL(el.href).searchParams.get("target");
      if (target)
        el.href = target;
    };
    document.querySelectorAll(selector).forEach(removeRedirection);
    sentinel.on(selector, removeRedirection);
  }

})(sentinel);