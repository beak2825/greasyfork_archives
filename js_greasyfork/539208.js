// ==UserScript==
// @name         洛谷验证码自动识别并填写
// @namespace    https://github.com/mayoi-Akira
// @version      0.2.0
// @description  使用卷积神经网络训练的验证码识别模型，自动识别填写洛谷提交时的验证码
// @match        *://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @author       Akira
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539208/%E6%B4%9B%E8%B0%B7%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%B9%B6%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/539208/%E6%B4%9B%E8%B0%B7%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%B9%B6%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(() => {
  const server = "http://8.130.64.15:3636";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function recognize(img, callback) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const data = canvas.toDataURL("image/jpeg").split(",")[1];

    GM_xmlhttpRequest({
      method: "POST",
      url: server,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ image: data }),
      onload: (resp) => {
        try {
          const { prediction } = JSON.parse(resp.responseText);
          callback(prediction);
        } catch (e) {
          console.error("OCR 获取失败", e);
          callback("");
        }
      },
      onerror: (err) => {
        console.error("OCR 请求失败", err);
        callback("");
      },
      timeout: 5000,
    });
  }

  const handleImage = (img) => {
    const input = document.querySelector('input[placeholder*="验证码"]');
    if (!input) {
      console.warn("未找到输入框");
      return;
    }

    const run = () => {
      recognize(img, (text) => {
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    };

    if (img.complete) {
      run();
    } else {
      img.onload = run;
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === "IMG" && node.src.includes("captcha")) {
              handleImage(node);
            }
            const imgs = node.querySelectorAll('img[src*="captcha"]');
            imgs.forEach(handleImage);
          }
        });
      } else if (
        m.type === "attributes" &&
        m.target.nodeName === "IMG" &&
        m.target.src.includes("captcha")
      ) {
        handleImage(m.target);
      }
    }
  });
  const root = document.querySelector("#captcha-container") || document.body;
  observer.observe(root, { childList: true, subtree: true, attributes: true });

  const existingImg = document.querySelector('img[src*="captcha"]');
  if (existingImg) {
    handleImage(existingImg);
  }
})();