// ==UserScript==
// @name         Bilibili 账号已注销修正
// @name:zh-CN   Bilibili 账号已注销修正
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @license      MIT
// @description  修正Bilibili 账户已注销的主页链接，修改为 https://www.bilibili.com/list/$UID
// @description:zh-CN  修正Bilibili 账户已注销的主页链接，修改为 https://www.bilibili.com/list/$UID
// @author       Kaesinol
// @match        https://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @icon         https://www.gstatic.com/android/keyboard/emojikitchen/20220506/u1f47b/u1f47b_u1f5d1-ufe0f.png
// @downloadURL https://update.greasyfork.org/scripts/528706/Bilibili%20%E8%B4%A6%E5%8F%B7%E5%B7%B2%E6%B3%A8%E9%94%80%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/528706/Bilibili%20%E8%B4%A6%E5%8F%B7%E5%B7%B2%E6%B3%A8%E9%94%80%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

// https://github.com/the1812/Bilibili-Evolved/discussions/4804#discussioncomment-10513931
(function () {
  ("use strict");
  function processLinks() {
    const rules = {
      "space.bilibili.com/\\d+/favlist": {
        query: "div.bili-video-card__subtitle a",
      },
      "bilibili.com/(video|list)/": {
        type: "intercept",
        query: ".up-detail-top a",
      },
      "search.bilibili.com": {
        query: ".bili-video-card__info--owner",
      },
      "www.bilibili.com/opus/\\d+": {
        type: "override",
        query: ".opus-module-author:not([data-processed])",
      },
    };

    // 遍历执行
    Object.entries(rules).forEach(([host, { query, type }]) => {
      if (RegExp(host).test(location.href)) {
        document
          .querySelectorAll(query)
          .forEach((el) => handleElement(el, type));
      }
    });
  }
  function uidToShortId(n) {
    n = BigInt(n); // 保证是 BigInt
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    let res = "";
    while (n > 0n) {
      res = chars[Number(n % 64n)] + res;
      n /= 64n;
    }
    return res || "A";
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function handleElement(tag, type = "normal") {
    let text = null;
    let regular = true;
    if (
      ["space.bilibili.com", "search.bilibili.com", "bilibili.com/opus"].some(
        (prefix) => (location.hostname + location.pathname).includes(prefix)
      )
    ) {
      text = tag.textContent.split(" ").filter((s) => s.trim() !== "")[0];
      regular = false;
    } else {
      text = tag.textContent;
    }
    const str = text.trim();
    if (str === "账号已注销" || str === "@账号已注销") {
      const match = type == "override" ? true : tag.href.match(/\/(\d+)\??/);
      tag.style.fontStyle = "italic";
      if (match && type == "override") {
        // 劫持 window.open 获取 UID
        const uid =
          window.__INITIAL_STATE__?.detail?.basic?.uid ??
          window.__INITIAL_STATE__?.detail?.modules?.find(
            (m) => m.module_author
          )?.module_author?.mid;
        if (!uid) return;
        makeLinkPreview(tag, `https://www.bilibili.com/list/${uid}`);
        tag.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            window.open(`https://www.bilibili.com/list/${uid}`, "_blank");
          },
          { capture: true }
        );
        tag.querySelector(".opus-module-author__name").textContent =
          str + uidToShortId(uid);
        tag.setAttribute("data-processed", "true");
        return;
      }
      if (regular) tag.textContent += uidToShortId(match[1]);
      else tag.textContent = tag.textContent.replace(
        str,
        str + uidToShortId(match[1])
      );
      if (match && type == "normal") {
        tag.href = `https://www.bilibili.com/list/${match[1]}`;
      } else if (match && type == "intercept") {
        makeLinkPreview(tag, `https://www.bilibili.com/list/${match[1]}`);
        tag.addEventListener("click", function (event) {
          event.preventDefault(); // 阻止默认跳转行为
          window.open(`https://www.bilibili.com/list/${match[1]}`, "_blank");
        });
      }
    }
  }
  function processCommentRenderers(elements) {
    elements.forEach((renderer) => {
      const bili = renderer.shadowRoot.querySelector("bili-comment-renderer");
      const userInfo = bili.shadowRoot.querySelector("bili-comment-user-info");
      const user = userInfo.shadowRoot.querySelector("#user-name a");
      if (user) handleElement(user);
      function processRichTextLinks(richText) {
        richText.shadowRoot
          .querySelector("bili-rich-text")
          .shadowRoot.querySelectorAll('a[data-type="mention"]')
          .forEach((a) => {
            if (a.textContent.trim() === "@账号已注销") {
              handleElement(a);
            }
          });
      }
      processRichTextLinks(bili);
      const replies = renderer.shadowRoot.querySelector(
        "bili-comment-replies-renderer"
      );
      const replyNodes = replies.shadowRoot.querySelectorAll(
        "bili-comment-reply-renderer"
      );
      replyNodes.forEach((reply) => {
        const rUser = reply.shadowRoot
          .querySelector("bili-comment-user-info")
          .shadowRoot.querySelector("#user-name a");
        if (rUser) handleElement(rUser);
        processRichTextLinks(reply);
      });
      if (!replies.shadowRoot.textContent.trim()) {
        renderer.setAttribute("data-processed", "true");
        return;
      }
    });
  }
  function processComments() {
    const startElement = document.querySelector("bili-comments");
    if (startElement && startElement.shadowRoot) {
      const allElements = startElement.shadowRoot.querySelectorAll(
        "bili-comment-thread-renderer:not([data-processed])"
      );
      processCommentRenderers(allElements);
    }
  }
  function makeLinkPreview(el, url) {
    // 创建透明代理 a 标签
    const proxy = document.createElement("a");
    proxy.href = url;
    proxy.style.position = "absolute";
    proxy.style.top = "0";
    proxy.style.left = "0";
    proxy.style.width = "100%";
    proxy.style.height = "100%";
    proxy.style.opacity = "0";
    proxy.style.cursor = "pointer";
    proxy.style.zIndex = "10"; // 确保在元素上层
    proxy.style.display = "block";

    // el 必须是定位容器
    const cs = getComputedStyle(el);
    if (cs.position === "static") {
      el.style.position = "relative";
    }

    // 点击代理跳转
    proxy.addEventListener("click", (e) => {
      e.stopPropagation(); // 避免触发 el 的事件
    });

    el.appendChild(proxy);
  }

  // === 运行控制 ===
  let timer = null;
  let idleTimer = null;

  function tick() {
    processComments();
    processLinks();
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, 2000);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    console.log("Bilibili 账号已注销修正：已停止运行");
    timer = null;
  }

  // === 空闲检测 ===
  const IDLE_LIMIT = 3000; // 10 秒无输入即停止

  function onUserActive() {
    start();

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      stop();
    }, IDLE_LIMIT);
  }

  // === 用户输入事件 ===
  ["mousemove", "mousedown", "keydown", "wheel", "touchstart"].forEach((e) =>
    window.addEventListener(e, onUserActive, { passive: true })
  );

  // === 页面可见性 ===
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      onUserActive(); // 回到页面即恢复
    }
  });

  // 初始状态：等待用户操作
})();