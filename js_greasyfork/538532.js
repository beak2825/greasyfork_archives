// ==UserScript==
// @name         一键DeepWiki/GitMcp
// @namespace    http://ilxdh.com/
// @version      1.0.2
// @author       longxuan
// @description  自动在 GitHub 仓库页面添加快捷跳转按钮（支持DeepWiki和GitMcp），方便您在代码和知识库之间快速切换。
// @license      MIT
// @icon         https://deepwiki.com/favicon.ico
// @match        *://*.github.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538532/%E4%B8%80%E9%94%AEDeepWikiGitMcp.user.js
// @updateURL https://update.greasyfork.org/scripts/538532/%E4%B8%80%E9%94%AEDeepWikiGitMcp.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' .deepwiki-btn{margin-left:10px;background-color:#dc3545;color:#fff;border:1px solid #dc3545;border-radius:6px;padding:5px 16px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;display:inline-block;transition:all .2s ease;position:relative;overflow:hidden;box-shadow:0 2px 4px #dc354533}.deepwiki-btn:hover{background-color:#c82333;color:#fff;text-decoration:none;transform:translateY(-1px);box-shadow:0 4px 8px #dc35454d}.gitmcp-btn{margin-left:10px;background-color:#28a745;color:#fff;border:1px solid #28a745;border-radius:6px;padding:5px 16px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;display:inline-block;transition:all .2s ease;position:relative;overflow:hidden;box-shadow:0 2px 4px #28a74533}.gitmcp-btn:hover{background-color:#218838;color:#fff;text-decoration:none;transform:translateY(-1px);box-shadow:0 4px 8px #28a7454d}.deepwiki-btn:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s ease}.deepwiki-btn:hover:before{left:100%}.gitmcp-btn:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s ease}.gitmcp-btn:hover:before{left:100%}.deepwiki-btn:active,.gitmcp-btn:active{transform:translateY(0)} ');

(function ($) {
  'use strict';

  let retryCount = 0;
  const MAX_RETRY = 8;
  const BUTTON_CONFIGS = [
    {
      name: "deepwiki",
      text: "一键 DeepWiki",
      className: "deepwiki-btn",
      urlReplace: (url) => url.replace("github.com", "deepwiki.com")
    },
    {
      name: "gitmcp",
      text: "一键 GitMcp",
      className: "gitmcp-btn",
      urlReplace: (url) => url.replace("github.com", "gitmcp.io")
    }
  ];
  function createButton(config) {
    try {
      const curUrl = window.location.href;
      const newUrl = config.urlReplace(curUrl);
      const $link = $("<a></a>").text(config.text).attr("href", newUrl).attr("target", "_blank").addClass(config.className);
      return $link;
    } catch (error) {
      console.error(`创建${config.name}按钮时出错:`, error);
      return null;
    }
  }
  function createAllButtons() {
    const $repoTitle = $("#repo-title-component");
    if ($repoTitle.length > 0) {
      const existingButtons = BUTTON_CONFIGS.some(
        (config) => $repoTitle.find(`.${config.className}`).length > 0
      );
      if (existingButtons) {
        return;
      }
      BUTTON_CONFIGS.forEach((config) => {
        const $button = createButton(config);
        if ($button) {
          $repoTitle.append($button);
        }
      });
      retryCount = 0;
    } else if (retryCount < MAX_RETRY) {
      retryCount++;
      setTimeout(createAllButtons, 2e3);
    } else {
      console.warn(`超过最大重试次数(${MAX_RETRY})，停止尝试创建按钮`);
    }
  }
  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector && node.querySelector("#repo-title-component")) {
                shouldCheck = true;
                break;
              }
            }
          }
        }
      });
      if (shouldCheck) {
        setTimeout(() => {
          retryCount = 0;
          createAllButtons();
        }, 200);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  $(document).ready(() => {
    createAllButtons();
    observePageChanges();
  });

})(jQuery);