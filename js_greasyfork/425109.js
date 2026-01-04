// ==UserScript==
// @name         my jira
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  复制jira issue信息为commit内容
// @author       You
// @include     /jira\.mypaas\.com\.cn\/(browse|secure\/RapidBoard)/
// require      file:///
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant       GM_setClipboard
// @grant     GM_notification
// @downloadURL https://update.greasyfork.org/scripts/425109/my%20jira.user.js
// @updateURL https://update.greasyfork.org/scripts/425109/my%20jira.meta.js
// ==/UserScript==

(function (window) {
  ("use strict");
  GM_addStyle(`
.__dev-abs-2 {
  position: absolute;
  left: 0px;
  bottom: 0;
}
.__dev-btn-sec {
  color: rgba(44,92,247,1);
  text-decoration: underline;
  cursor: pointer;
  border: none;
  outline: none;
  background: white;
  font-size: 14px;
}
.__dev-abs-2 {
  position: absolute;
  left: 0px;
  bottom: 0;
}
.__dev-abs-3 {
  position: absolute;
  right: 20px;
  bottom: 8px;
}
.__dev-btn {
  margin-top: 15px;
  transition: opacity .2s;
  border: none;
  outline: none;
  color: white;
  background: linear-gradient(270deg,rgba(44,92,247,0.8) 0%,rgba(44,92,247,1) 100%);
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
.__dev-btn:hover {
  opacity: .6;
}
.__dev-hidden {
  opacity: 0 !important;
}
`);

  Notification.requestPermission(function (status) {});

  /*
   */
  var isIssuePage = location.href.includes("jira.mypaas.com.cn/browse");
  var panelItemSelector = ".ghx-issue-content";
  var panelHeaderSelector = ".ghx-heading";

  function $(selector) {
    return document.querySelector(selector);
  }

  function start() {
    let flag1 = false;

    function createDevBtn(type) {
      const copyDom = document.createElement("button");
      copyDom.innerText = "copy";
      switch (type) {
        case 1:
          copyDom.className = '__dev-btn';
          break;
        case 2:
          copyDom.className = '__dev-btn __dev-hidden __dev-abs-2';
          break;
        case 3:
          copyDom.className = '__dev-btn-sec __dev-abs-3';
          break;
      }
      return copyDom;
    }

    function getContent(type, parent) {
      let issueType, issueId, issueMsg;
      switch (type) {
        case 1:
          issueType = parent.querySelector("#issuedetails #type-val").textContent.trim();
          issueId = parent.querySelector("[data-issue-key]").dataset.issueKey;
          issueMsg = parent.querySelector("#summary-val").textContent || "";
          break;
        case 2:
          issueType = parent.querySelector(".ghx-type").title;
          issueId = parent.querySelector(".ghx-key > a").title;
          issueMsg = parent.querySelector(".ghx-summary").title;
          break;
        case 3:
          issueType = '需求';
          issueId = parent.querySelector('.js-detailview').textContent
          issueMsg = parent.querySelector(".ghx-summary").textContent.replace(/^已标记/, '');
      }

      const commitMap = {
        故障: "fix",
        BUG: "fix",
      };

      return `${commitMap[issueType] || "feat"}: (${issueId}) ${issueMsg}`;
    }

    function createCopyCtr(type, dom = $("body")) {
      const cntrDom = document.createElement("div");
      cntrDom.classList.add("__dev-cntr");
      const copyDom = createDevBtn(type);
      copyDom.addEventListener("click", () => {
        GM_setClipboard(getContent(type, dom));
        //GM_notification({title: '复制成功'});
        copyDom.innerText = "done";
        setTimeout(() => {
          copyDom.innerText = "copy";
        }, 500);
      });
      cntrDom.appendChild(copyDom);
      return cntrDom;
    }

    function init() {
      document.querySelectorAll(".__dev-cntr").forEach((i) => i.remove());
      if (isIssuePage) {
        const cntr = $(".command-bar .aui-toolbar2-primary");
        cntr.appendChild(createCopyCtr(1));
      } else {
        document.querySelectorAll(panelItemSelector).forEach((dom) => {
          dom.appendChild(createCopyCtr(2, dom));
          dom.addEventListener("mouseenter", () => {
            dom.querySelector(".__dev-btn").classList.remove("__dev-hidden");
          });
          dom.addEventListener("mouseleave", () => {
            dom.querySelector(".__dev-btn").classList.add("__dev-hidden");
          });
        });

        document.querySelectorAll(panelHeaderSelector).forEach(dom => {
          if (dom.querySelector('.ghx-summary')) {
            dom.appendChild(createCopyCtr(3, dom));
          }
        })
      }

      const observer = new MutationObserver((...args) => {
        if (flag1) {
          flag1 = false;
        }
        flag1 = setTimeout(() => {
          init();
          flag1 = false;
        }, 1000);
      });
      observer.observe(document.querySelector(isIssuePage ? "body" : "#ghx-pool"), { childList: true });
    }

    init();
  }

  setTimeout(start, 200);
  console.log("runing jira dev tool");
})(unsafeWindow);
