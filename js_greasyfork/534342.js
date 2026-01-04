// ==UserScript==
// @name         Copy Family Club Web
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy Family Club Web(New Version)
// @author       黃色心臟
// @match        https://*.familyclub.jp/s/jwb/diary/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534342/Copy%20Family%20Club%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/534342/Copy%20Family%20Club%20Web.meta.js
// ==/UserScript==

(function () {
  console.log("💡 插件启动了");

  function insertCopyButton() {
    const row = document.querySelector(".article.row");
    const postNode = document.querySelector(".article-content.wysiwyg-area");
    const dateNode = document.querySelector("div.article__posted");

    console.log("🔍 查找元素：", { row, dateNode, postNode});

    if (!row || !dateNode) {
      return false;
    }

    // 检查是否已经插入过按钮
    if (document.getElementById("my-copy-btn")) {
      console.log("⚠️ 按钮已经存在");
      return true;
    }

    const btn = document.createElement("button");
    var btnStyle = btn.style
    btn.id = "my-copy-btn";
    btn.textContent = "Copy Full Text";
      const cssObj = {
          border: "solid 2px",
          borderRadius: "3px",
          padding: "4px 6px",
          marginLeft: "20px",
          marginTop: "8px",
      };
      Object.assign(btn.style, cssObj);

    const input = document.createElement("textarea");
    input.classList.add("visually-hidden");
    input.id = "copy-full-text";
    document.body.appendChild(input);

    btn.onclick = function () {
      input.value = dateNode.innerText + "\n\n" + postNode.innerText;
      input.select();
      const success = document.execCommand("copy");
      window.getSelection().removeAllRanges();
      if (success) {
        console.log("✅ copied to clipboard");
      } else {
        console.log("❌ copy failed");
      }
    };

    row.insertBefore(btn, row.firstChild);
    console.log("✅ 插入按钮成功");
    return true;
  }

  function waitUntilReady() {
    const maxAttempts = 30;
    let attempts = 0;

    const interval = setInterval(() => {
      console.log(`⏳ 尝试第 ${attempts + 1} 次插入按钮`);
      const success = insertCopyButton();
      attempts++;
      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        if (!success) console.log("❌ 放弃插入按钮（超时）");
      }
    }, 500);
  }

  if (/familyclub\.jp/.test(window.location.hostname)) {
    console.log("🌐 匹配 domain 成功，等待 load");
    window.addEventListener("load", () => {
      console.log("✅ 页面 load 完成，开始尝试插入");
      waitUntilReady();
    });
  }

  const css = `
    .visually-hidden {
      border: 0;
      clip: rect(0,0,0,0);
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
    }
    body, h1, h2, h3, h4, h5, p, span, img, *:not(input) {
      user-select: auto !important;
    }
  `;
  const styleNode = document.createElement("style");
  styleNode.textContent = css;
  (document.head || document.documentElement).appendChild(styleNode);
})();
