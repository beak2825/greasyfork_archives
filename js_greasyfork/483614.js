// ==UserScript==
// @name         校友邦实习一键评价 XiaoYouBang Auto Review
// @namespace    https://github.com/lcandy2/XiaoYouBang-Auto-Review
// @version      1.4
// @author       lcandy2
// @description  一键评价，自动填写评价内容
// @license      MIT
// @icon         https://www.xybsyw.com/favicon.ico
// @match        *://*.xybsyw.com/personal/*
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483614/%E6%A0%A1%E5%8F%8B%E9%82%A6%E5%AE%9E%E4%B9%A0%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7%20XiaoYouBang%20Auto%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/483614/%E6%A0%A1%E5%8F%8B%E9%82%A6%E5%AE%9E%E4%B9%A0%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7%20XiaoYouBang%20Auto%20Review.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  const config = {
    autoSubmit: false,
    // 是否自动提交
    day: 1,
    // 天数类评价
    rate: 5,
    // 评分类评价 1-5
    review: "好",
    // 评价内容
    suggestions: "无",
    // 建议内容
    addCourse: "无",
    // 增加课程
    radio: 0,
    // 单选选择索引，从 0 开始
    reviewHref: "myEvaluationDetail"
    // 评价页面的 href，无特殊情况不需要修改
  };
  const fillInputs = (inputElement, data) => {
    inputElement.focus();
    inputElement.value = "";
    data.split("").forEach((char) => {
      let keydownEvent = new KeyboardEvent("keydown", { key: char, bubbles: true });
      let keyupEvent = new KeyboardEvent("keyup", { key: char, bubbles: true });
      let inputEvent = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(keydownEvent);
      inputElement.value += char;
      inputElement.dispatchEvent(inputEvent);
      inputElement.dispatchEvent(keyupEvent);
    });
    inputElement.blur();
  };
  const Review = () => {
    const $allInput = $("input.el-input__inner");
    const $dayInput = $allInput.filter((index, element) => {
      return $(element).attr("max") !== void 0 && $(element).attr("min") !== void 0;
    });
    const $otherInput = $allInput.not($dayInput);
    const $courseInput = $otherInput.filter((index, element) => {
      return $(element).attr("placeholder").includes("课程");
    });
    const $allRate = $("div.el-rate");
    const $allTextarea = $("textarea.el-textarea__inner");
    const $suggestTextarea = $allTextarea.filter((index, element) => {
      return $(element).attr("placeholder").includes("建议");
    });
    const $otherTextarea = $allTextarea.filter((index, element) => {
      return !$(element).attr("placeholder").includes("建议");
    });
    const $allRadio = $("div.radioItem");
    $dayInput.each((index, element) => {
      fillInputs(element, config.day.toString());
    });
    $courseInput.each((index, element) => {
      fillInputs(element, config.addCourse);
    });
    $allRate.each((index, element) => {
      $(element).children().eq(config.rate - 1).trigger("click");
    });
    $otherTextarea.each((index, element) => {
      fillInputs(element, config.review);
    });
    $suggestTextarea.each((index, element) => {
      fillInputs(element, config.suggestions);
    });
    $allRadio.each((index, element) => {
      $(element).children().eq(config.radio).trigger("click");
    });
    console.log("Review success!");
  };
  const addReviewButton = (listener) => {
    if ($("button.--lcandy2-xyb-auto-review").length)
      return;
    const $topContent = $("div.contentItem div.topContent");
    const $topContent_item = $topContent.children().eq(1);
    const $reviewButton = $(`<button type="button" class="el-button submitBtn el-button--default --lcandy2-xyb-auto-review"><i class="el-icon-edit" /><span> 一键评价 </span></button>`);
    $reviewButton.on("click", () => {
      config.autoSubmit = false;
      listener();
    });
    const $reviewAndSubmitButton = $(`<button type="button" class="el-button submitBtn el-button--primary --lcandy2-xyb-auto-review"><i class="el-icon-check" /><span> 评价并<b>提交</b> </span></button>`);
    $reviewAndSubmitButton.on("click", () => {
      config.autoSubmit = true;
      listener();
    });
    $topContent_item.append($reviewButton);
    $topContent_item.append($reviewAndSubmitButton);
    console.log("Add Review Button", $reviewButton);
  };
  const watchUrlChange = (onChange) => {
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
      originalPushState.apply(this, arguments);
      onChange(url);
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(this, arguments);
      onChange(url);
    };
    window.addEventListener("popstate", () => {
      onChange(document.location.href);
    });
  };
  const executeReview = async () => {
    Review();
    const $submitButton = $("div.bottomDiv button.submitBtn");
    $submitButton.val("评价完成，点击提交评价");
    if (config.autoSubmit) {
      $submitButton.trigger("click");
      alert("评价完成，已自动提交。");
    }
  };
  const main = () => {
    const href = window.location.href;
    if (!href.includes(config.reviewHref))
      return;
    addReviewButton(executeReview);
  };
  const observer = (func) => {
    const observer2 = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
          const $topContent = $("div.contentItem div.topContent");
          if ($topContent.length) {
            observer2.disconnect();
            func();
            break;
          }
        }
      }
    });
    observer2.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  $(async () => {
    observer(main);
    watchUrlChange((newUrl) => {
      console.log("URL 变化了:", newUrl);
      observer(main);
    });
  });

})(jQuery);