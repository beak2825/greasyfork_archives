// ==UserScript==
// @name         绿色纯净版CSDN-持续更新
// @namespace    CSDNGreen
// @version      0.0.53
// @description  绿色纯净版CSDN-持续更新,现支持🔥免登录复制🔥沉浸式阅读🆕登录自动展开评论，并添加到页面底部
// @author       LiuHangShu
// @include      *://*.csdn.net/*
// @license      AGPL-3.0-or-later
// @note         24-1-11 0.0.51 jq-err
// @note         24-1-15 0.0.52 沉浸式阅读
// @note         24-1-15 0.0.53 登录情况下默认展开所有评论，并添加到页面底部
// @downloadURL https://update.greasyfork.org/scripts/484503/%E7%BB%BF%E8%89%B2%E7%BA%AF%E5%87%80%E7%89%88CSDN-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484503/%E7%BB%BF%E8%89%B2%E7%BA%AF%E5%87%80%E7%89%88CSDN-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

const version = "0.0.53";

class CSDNGreen {
  constructor() {
    this.rmMap = new Map();
  }

  main() {
    this.copy();
    this.fullScreen();
    this.greenMode();
    this.clean();
    this.comment();
    console.log("正在运行");
  }

  push(element) {
    if (Array.isArray(element)) {
      element.forEach((item) => {
        const name = item.attr("class") || item.attr("id");
        if (!this.rmMap.has(name)) {
          this.rmMap.set(name, item);
        }
      });
      return;
    }
    const name = element.attr("class") || element.attr("id");
    if (!this.rmMap.has(name)) {
      this.rmMap.set(name, element);
    }
  }

  copy() {
    try {
      if (typeof $ == "undefined") {
        console.log("jQuery is not loaded");
        return;
      }
      // 免登录复制
      $(".hljs-button").removeClass("signin");
      $(".hljs-button").addClass("{2}");
      $(".hljs-button").attr("data-title", "免登录复制");
      $(".hljs-button").attr(
        "onclick",
        "hljs.copyCode(event);setTimeout(function(){$('.hljs-button').attr('data-title', '免登录复制');},3500);"
      );
      $("#content_views").unbind("copy");
      // 去除剪贴板劫持
      $("code").attr("onclick", "mdcp.copyCode(event)");
      try {
        Object.defineProperty(window, "articleType", {
          value: 0,
          writable: false,
          configurable: false,
        });
      } catch (err) {}
      try {
        unsafeWindow.csdn.copyright.init("", "", "");
      } catch (_err) {}
      console.log("copy fn run success");
    } catch (err) {
      $$("*").forEach((item) => {
        item.oncopy = (e) => e.stopPropagation();
      });
      console.log("copy fn run error");
    }
  }

  fullScreen() {
    $(".blog_container_aside").remove();
    $("main").css("width", "100%");
    $(".csdn-side-toolbar").remove();
    console.log("fullScreen fn run success");
  }

  greenMode() {
    // 登录
    const loginModal = $(".passport-login-container");
    // 红包
    const redpackModal = $("#csdn-redpack");
    const iframe = $("iframe");
    const toolBarBox = $(".more-toolbox-new");
    const blogHuaweiyunAdvert = $("#blogHuaweiyunAdvert");
    const blogColumnPayAdvert = $("#blogColumnPayAdvert");
    const recommendNps = $("#recommendNps");
    const recommendBox = $(".recommend-box");
    const articleInfoBox = $(".article-info-box");
    const adverts1 = $(".J_adv");
    const adverts2 = $(".feed-fix-box");
    this.push([
      loginModal,
      redpackModal,
      iframe,
      toolBarBox,
      blogHuaweiyunAdvert,
      blogColumnPayAdvert,
      adverts1,
      adverts2,
      recommendNps,
      recommendBox,
      articleInfoBox,
    ]);
  }

  comment() {
    // 登录默认展开评论
    if ($(".toolbar-btn-loginfun").text() != "登录") {
      const list = $(".comment-list-container");
      const comment = $("#pcCommentBox");
      comment.append(list);

      // 加载所有评论
      let timer = setInterval(function () {
        const childrenComment = $("#lookGoodComment");
        if (
          childrenComment.css("display") &&
          childrenComment.css("display") != "none"
        ) {
          childrenComment.click();
        } else {
          clearInterval(timer);
        }
      }, 1000);

      setTimeout(() => {
        // 打开所有子评论
        $(".second-look-more").each((idx, _) => {
          _ && _.click();
        });
      }, 10000);
    }
  }

  clean() {
    // console.log(this.rmMap, this.rmMap.size, "this.rmMap.length");
    if (this.rmMap.size) {
      let t = this;
      let timer = setInterval(function () {
        const clear = !t.rmMap.size;
        if (clear) {
          clearInterval(timer);
        }
        for (const [key, value] of t.rmMap) {
          if (value) {
            value.remove();
            t.rmMap.delete(key);
          }
        }
      }, 500);
    }
  }
}

(function () {
  "use strict";
  const csdnGreen = new CSDNGreen();
  setTimeout(function () {
    csdnGreen.main();
  }, 500);
})();
