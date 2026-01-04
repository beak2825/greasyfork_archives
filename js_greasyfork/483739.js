// ==UserScript==
// @name        Wukong Commit 预览脚本
// @description 快速查看 wukong commit 环境
// @namespace   github.com/maojj
// @require     https://unpkg.com/react@18/umd/react.development.js
// @require     https://unpkg.com/react-dom@18/umd/react-dom.development.js
// @match       https://jihulab.com/yuanli/wukong/-/commits/*
// @version     1.0.3
// @author      maojj
// @license     MIT
// @grant       GM.getValue
// @grant       GM.notification
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/483739/Wukong%20Commit%20%E9%A2%84%E8%A7%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483739/Wukong%20Commit%20%E9%A2%84%E8%A7%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* globals React, ReactDOM */
(function (React$1, ReactDOM) {
  'use strict';

  var createRoot;
  var m = ReactDOM;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }

  const globalCreateRoot = (dom, ...args) => {
      const root = createRoot(dom, ...args);
      const doUnmount = root.unmount.bind(root);
      root.unmount = () => {
          doUnmount();
          window.unmountRootCallbacks.delete(doUnmount);
      };
      window.unmountRootCallbacks.add(doUnmount);
      return root;
  };


  function getCommitReviewLink(e) {
      const sha = e.target.parentElement.querySelector("button").getAttribute("data-clipboard-text")
      window.open(`https://wukong.yuanfudao.biz/commit/${sha}/app/`);
  }


  const matches$1 = ["https://jihulab.com/yuanli/wukong/-/commits/*"];
  function Entry$1() {
      React$1.useEffect(() => {
          registerEvent$1();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent$1() {
      window.onmousemove = () => {
          if (!window.commitMounted) {
              const groupList = document.querySelectorAll(".commit-sha-group");
              if (groupList) {
                const commitTitle = Array.from(groupList).forEach((actionGroup) => {
                    const sha = "123"
                    const reviewBtn = document.createElement("div");
                    reviewBtn.className =
                        "gl-display-none gl-md-display-block btn gl-button btn-default btn-grouped";
                    reviewBtn.onclick = getCommitReviewLink;
                    reviewBtn.innerText = "预览";
                    reviewBtn.title = "点击打开 commit 环境";


                    actionGroup.insertBefore(reviewBtn, actionGroup.children[0]);
                  });
                window.commitMounted = true;
              }
          }
      };
  }

  var CommitReviewEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$1,
    matches: matches$1
  });


  const entries = [
      CommitReviewEntry,
  ];
  function GlobalEntry() {
      for (const e of entries) {
          const someMatched = e.matches.some((s) => new RegExp(s).test(location.href));
          if (someMatched) {
              return e.Entry();
          }
      }
      return null;
  }

  if (window.unmountRootCallbacks) {
    window.unmountRootCallbacks.forEach(cb => {
      cb();
    });
    window.unmountRootCallbacks.clear();
  } else {
    window.unmountRootCallbacks = window.unmountRootCallbacks || new Set();
  }
  function getOrCreateDom(id = "wukong-commit-reviewer") {
    let dom = document.getElementById(id);
    if (dom) {
      dom.remove();
    }
    dom = document.createElement("div");
    dom.id = id;
    document.body.appendChild(dom);
    return dom;
  }
  const root = globalCreateRoot(getOrCreateDom());
  root.render( /*#__PURE__*/React.createElement(GlobalEntry, null));

})(React, ReactDOM);
