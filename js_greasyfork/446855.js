      
// ==UserScript==
// @name         一键复制团购
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  适用于Chrome浏览器，火狐浏览器用户请移至「谷歌浏览器」使用
// @author       良人、陈鹏敏
// @match        https://ktt.pinduoduo.com/groups/detail/*
// @match        https://pro.qunjielong.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446855/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%9B%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/446855/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%9B%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const href = window.location.href;
  const isKttPage =
    href.indexOf("https://ktt.pinduoduo.com/groups/detail/") > -1;
  const isQjlPage =
    href.indexOf("https://pro.qunjielong.com/#/seq/seq-detail?actId=") > -1;

  /**
   * toast
   */
  function showToast(msg) {
    const ToastNode =
      $(`<div class="toast-content" style="position: fixed;z-index: 100;top: 0;left: 0;width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;color: #fff">
      <div class="toast" style="background-color: rgba(36, 36, 37, 0.81);border-radius: 10px;padding: 10px;justify-content: center;align-items: center;">
        <span>${msg}</span>
      </div>
    </div>`);
    $("body").before(ToastNode);
    // $('body').insertAdjacentHTML('beforeend', ToastNode);
    setTimeout(function () {
      $(".toast-content").hide();
    }, 1500);
  }

  /**
   * 将文字写入剪切板
   * @param {string} text
   * @returns {Promise} 返回promise对象
   */
  function copyText(text) {
    // 在调用前 先访问是否存在 clipboard 对象
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      // 不存在使用 老版本API execCommand
      try {
        const t = document.createElement("textarea");
        t.nodeValue = text;
        t.value = text;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
        return Promise.resolve();
      } catch (e) {
        console.log(e);
        return Promise.reject(e);
      }
    }
  }

  /**
   * 抓取快团团用户信息
   */
  async function pickKttUserInfo() {
    try {
      const accesstoken = localStorage.getItem("accesstoken");
      const ownerInfo = localStorage.getItem("ownerInfo");
      const proxy = localStorage.getItem("proxy");
      const api_uid = document.cookie.replace(
        /(?:(?:^|.*;\s*)api_uid\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const obj = {
        accesstoken: accesstoken || "",
        uid: ownerInfo ? JSON.parse(ownerInfo).uid : "",
        api_uid: api_uid || "",
        proxy_no: proxy ? encodeURIComponent(JSON.parse(proxy).proxy_no) : "",
      };
      copyText(JSON.stringify(obj)).then(() => {
        console.log(obj);
        showToast("复制成功");
      });
    } catch (e) {
      console.log("e", e);
      showToast("复制失败");
    }
  }

  /**
   * 抓取快团团用户信息
   */
  async function pickQjlUserInfo() {
    console.log("topickQjlUserInfo");
  }

  /**
   * 抓取快团团笔记内容
   */
  async function pickKttNoteContent() {
    const title = $(
      "div[class^='Header_title'] span[class^='Header_name']"
    ).html();
    const note = $("div[class^='ImageText_imageText']");
    const items = note.children();
    const mediaItems = []; // 只抓取图片、文字、视频
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.className.indexOf("ImageText_img") > -1) {
        const imgNode = item.children && item.children[0];
        mediaItems.push({
          type: "image",
          value: imgNode.src,
        });
      }

      if (item.tagName === "PRE") {
        const textNode = item.children && item.children[0];
        if (textNode && textNode.className.indexOf("ImageText_desc") > -1) {
          mediaItems.push({
            type: "text",
            value: textNode.innerHTML,
          });
        }
      }

      if (item.tagName === "VIDEO") {
        mediaItems.push({
          type: "outerVideo",
          value: item.src,
        });
      }
    }

    const pasteContent = JSON.stringify([
      {
        type: "title",
        value: title,
      },
      ...mediaItems,
    ]);

    // 仅仅是复制到剪切板
    // 顺序：油猴一键复制后，在笔记后台点击复制笔记
    navigator.clipboard.writeText(pasteContent);
    console.log(pasteContent);
    showToast("复制成功");
  }

  /**
   * 抓取群接龙团详情
   * @returns {Promise<void>}
   */
  async function pickQjlNoteContent() {
    const title = $(".content-main section")[0]?.querySelector(
      ".ng-star-inserted>.pre-line"
    )?.textContent;
    const note = $(".ant-card-body section")[1];
    const items = note.children;
    const mediaItems = []; // 只抓取图片、文字、视频
    for (let i = 0; i < items.length; i++) {
      const item = items[i]?.children;

      // 做下代码保护
      if (!item || !item[0]) {
        continue;
      }

      // 大图
      if (item[0].className.indexOf("good-big-img") > -1) {
        mediaItems.push({
          type: "image",
          value: item[0].src,
          imgType: "big",
        });
      }

      // 小图
      if (item[0].className.indexOf("good-small-box") > -1) {
        const imagesNode = Array.from(item[0].children);
        imagesNode.forEach((img) => {
          mediaItems.push({
            type: "image",
            value: img.src,
            imgType: "small",
          });
        });
      }

      // 文本
      if (item[0].className.indexOf("pre-line") > -1) {
        const textNode = item[0];
        mediaItems.push({
          type: "text",
          value: textNode.textContent,
        });
      }

      // 视频
      if (item[0].className.indexOf("video-box") > -1) {
        const videoNode = item[0].children[0];
        mediaItems.push({
          type: "outerVideo",
          value: videoNode.src,
        });
      }
    }

    const pasteContent = JSON.stringify([
      {
        type: "title",
        value: title,
      },
      ...mediaItems,
    ]);

    // 仅仅是复制到剪切板
    // 顺序：油猴一键复制后，在笔记后台点击复制笔记
    navigator.clipboard.writeText(pasteContent);
    console.log(pasteContent);
    showToast("复制成功");
  }

  /**
   * 返回自定义按钮
   * @params {type|string} 平台类型
   * @returns {*|jQuery|HTMLElement}
   */
  function renderCustomBtn(platform) {
    const $copyUserInfoBtn = $("<a>一键复制登录信息</a>");
    const $copyNoteContentBtn = $("<a>一键复制笔记内容</a>");
    let btnCss = null;

    $copyUserInfoBtn.hover(
      function () {
        $(this).css({
          "background-color": "#356fd4",
        });
      },
      function () {
        $(this).css({
          "background-color": "#1989fa",
        });
      }
    );

    $copyNoteContentBtn.hover(
      function () {
        $(this).css({
          "background-color": "#356fd4",
        });
      },
      function () {
        $(this).css({
          "background-color": "#1989fa",
        });
      }
    );

    if (isKttPage) {
      btnCss = {
        height: "24px",
        padding: "4px 8px",
        "font-size": "14px",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        "align-items": "center",
        "border-radius": "4px",
        "background-color": "#1989fa",
        margin: "0 5px",
      };
      // 点击事件
      $copyUserInfoBtn.click(pickKttUserInfo);
      $copyNoteContentBtn.click(pickKttNoteContent);
    }

    if (isQjlPage) {
      btnCss = {
        height: "32px",
        padding: "4px 8px",
        "font-size": "14px",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        "align-items": "center",
        "border-radius": "4px",
        "background-color": "#1989fa",
        margin: "0 5px",
      };
      // 点击事件
      $copyUserInfoBtn.click(pickQjlUserInfo);
      $copyNoteContentBtn.click(pickQjlNoteContent);
    }

    $copyUserInfoBtn.css(btnCss);
    $copyNoteContentBtn.css(btnCss);

    const $btnWrap = $("<div></div>");
    $btnWrap.css({
      display: "flex",
      "align-items": "center",
      position: "absolute",
      top: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      "z-index": 999,
    });
    // 暂时只有快团团需要copy用户信息
    if (platform === "ktt") $btnWrap.append($copyUserInfoBtn);
    $btnWrap.append($copyNoteContentBtn);

    return $btnWrap;
  }

  /**
   * 添加
   */
  function initUI() {
    // 快团团
    if (isKttPage) {
      const customBtn = renderCustomBtn("ktt");
      $("body").before(customBtn);
    }

    // 群接龙
    if (isQjlPage) {
      const customBtn = renderCustomBtn("qjl");
      $("body").before(customBtn);
    }
  }

  /**
   * 检查下DOM节点是否已经挂载
   * @returns {boolean}
   */
  let count = 0;
  function checkDomIsReady() {
    count++; // 做个兜底，避免无限调用
    let dom = null;

    if (isKttPage) {
      dom = $("div[class^='ImageText_imageText']");
    }

    if (isQjlPage) {
      dom = $("#rich-text .ant-card-body .ng-star-inserted");
    }

    if (dom?.length || count > 100) {
      clearInterval(interval);
      interval = null;
      initUI();
    }
  }

  // 初始化
  let interval = setInterval(checkDomIsReady, 100);
})();

    