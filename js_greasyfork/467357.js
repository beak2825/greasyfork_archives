// ==UserScript==
// @name         自动评教：适用于 MyCOS / 麦可思 的自动评教 MyCOS Auto Review
// @namespace    https://github.com/lcandy2/MyCOS-Auto-Review
// @version      2.0.1
// @author       lcandy2
// @description  一键评教，自动完成课程评价，支持单选、多选、文本评价。支持仅填充评价和填充并提交评价两种模式。适用于所有采用 MyCOS / 麦可思 （评教系统左上角有MyCOS或M标识）系统的高校或其他单位。
// @license      MIT
// @icon         http://www.mycos.com.cn/Uploads/icopic/54a0fcc38f623.ico
// @match        *://*.edu.cn/*
// @match        *://*.mycospxk.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467357/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%9A%E9%80%82%E7%94%A8%E4%BA%8E%20MyCOS%20%20%E9%BA%A6%E5%8F%AF%E6%80%9D%20%E7%9A%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20MyCOS%20Auto%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/467357/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%9A%E9%80%82%E7%94%A8%E4%BA%8E%20MyCOS%20%20%E9%BA%A6%E5%8F%AF%E6%80%9D%20%E7%9A%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20MyCOS%20Auto%20Review.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  const config = {
    // 是否自动提交 true: 自动提交, false: 不自动提交
    autoSubmit: false,
    // 评价内容
    // 单选范围 0: 非常同意，1: 同意，2: 一般，3: 不同意，4: 非常不同意
    radio: [0, 1],
    // 多选题评价 true: 全部选中, false: 全部不选中
    checkbox: true,
    // 文本评价 任意文本: 自动填充文本, 留空: 不填充
    comment: "我对本课程非常满意。",
    // Dev Only
    // 评价页面的 href，无特殊情况不需要修改
    reviewHref: "answer",
    // 评价页面的父元素，无特殊情况不需要修改
    reviewParentElement: "div.ant-tabs div.ant-tabs-bar div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll",
    // 评价页面的单选框选项，无特殊情况不需要修改（由好到不好）
    reviewRadioField: ["非常", "", "一般", "不", "非常不"],
    // 提交评价按钮，无特殊情况不需要修改
    reviewSubmitElement: ".ant-btn.ant-btn-primary:not(.--lcandy2-mycos-auto-review)",
    // 评价弹窗，无特殊情况不需要修改
    reviewModalElement: "div.ant-modal-body"
  };
  const fillInput = (element, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    const inputEvent = new Event("input", { bubbles: true });
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(inputEvent);
  };
  const getRnd = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };
  const seleRadio = (selection, fixedTexts = ["非常", "", "一般", "不", "非常不"]) => {
    let positions = new Array(5).fill(-1);
    let result = false;
    let radioSelection = selection;
    $(".ant-radio-group").each((index, element) => {
      let options = $(element).find(".ant-radio-wrapper");
      options.each((index2, element2) => {
        let text = $(element2).text().trim();
        if (text.includes(fixedTexts[0]) && !text.includes(fixedTexts[4])) {
          positions[0] = index2;
        }
        if (text.includes(fixedTexts[4])) {
          positions[4] = index2;
        }
        if (text.includes(fixedTexts[3]) && !text.includes(fixedTexts[4])) {
          positions[3] = index2;
        }
        if (text.includes(fixedTexts[2])) {
          positions[2] = index2;
        } else if (index2 > 0 && index2 < 4) {
          let prevText = options.eq(index2 - 1).text().trim();
          let nextText = options.eq(index2 + 1).text().trim();
          let character1Prev = prevText.replace(fixedTexts[0], "").replace(fixedTexts[3], "");
          let character1Next = nextText.replace(fixedTexts[0], "").replace(fixedTexts[3], "");
          let character1Current = text.replace(fixedTexts[0], "").replace(fixedTexts[3], "");
          if (character1Current !== character1Prev && character1Current !== character1Next) {
            positions[2] = index2;
          }
        }
        if (!fixedTexts[1] == "") {
          if (text.startWith(fixedTexts[1])) {
            positions[1] = index2;
          }
        }
        if (!text.includes(fixedTexts[0]) && !text.includes(fixedTexts[3]) && positions[2] !== index2 && positions[1] == -1) {
          positions[1] = index2;
        }
      });
      radioSelection.sort();
      let randomIndex = getRnd(radioSelection[0], radioSelection[radioSelection.length - 1]);
      console.log("[单选题] 第 " + (index + 1) + " 题，随机选择第 " + (randomIndex + 1) + " 个选项：" + fixedTexts[randomIndex] + "同意。");
      if (positions[randomIndex] !== -1) {
        options.eq(positions[randomIndex]).trigger("click");
        result = true;
        positions = Array(5).fill(-1);
      }
    });
    return result;
  };
  const seleCheckbox = () => {
    let checkbox_list = $(".ant-checkbox-group");
    for (let i = 0; i < checkbox_list.length; i++) {
      let lists = checkbox_list[i].children;
      for (let j = 0; j < lists.length; j++) {
        let btn = $(checkbox_list[i]).find(".ant-checkbox-input")[j];
        $(btn).trigger("click");
      }
    }
  };
  const fillComments = (comment) => {
    const textbox_list = $(".ant-input");
    for (let i = 0; i < textbox_list.length; i++) {
      const textArea = textbox_list[i];
      fillInput(textArea, comment);
    }
  };
  const Review = () => {
    const seleRadioResult = seleRadio(config.radio);
    console.log(seleRadioResult ? "[单选题] 评价完成" : "[单选题] 未找到单选题");
    {
      const seleCheckboxResult = seleCheckbox();
      console.log(seleCheckboxResult ? "[多选题] 评价完成" : "[多选题] 未找到多选题");
    }
    {
      const fillCommentsResult = fillComments(config.comment);
      console.log(fillCommentsResult ? "[文本评价] 评价完成" : "[文本评价] 未找到文本评价");
    }
    console.log("[自动评教] 全部评教完成");
  };
  const addReviewButton = (listener) => {
    if ($("button.--lcandy2-mycos-auto-review").length)
      return;
    const $parentElement = $(config.reviewParentElement);
    const $reviewButton = $(`<button type="button" class="ant-btn ant-btn-default --lcandy2-mycos-auto-review">一 键 评 教</button>`);
    $reviewButton.on("click", () => {
      config.autoSubmit = false;
      listener();
    });
    const $reviewAndSubmitButton = $(`<button type="button" class="ant-btn ant-btn-primary --lcandy2-mycos-auto-review">评 教 并 <b>提 交</b></button>`);
    $reviewAndSubmitButton.on("click", () => {
      config.autoSubmit = true;
      listener();
    });
    $parentElement.append($reviewButton);
    $parentElement.append($reviewAndSubmitButton);
    console.log("Add Review Button", $reviewButton, $reviewAndSubmitButton);
  };
  const mycosTest = async () => {
    const configJs = $("script").filter((index, element) => {
      const src = $(element).attr("src");
      return src && src.includes("config.js");
    });
    if (!configJs.length) {
      return false;
    }
    const response = await fetch(configJs.attr("src"));
    const responseText = await response.text();
    const test = responseText.includes("mycos");
    return test;
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
  const submitReview = () => {
    setTimeout(() => {
      $(config.reviewSubmitElement).trigger("click");
    }, 500);
  };
  const removeModal = ($button) => {
    $button.prop("disabled", false);
    $button.trigger("click");
  };
  const executeReview = async () => {
    Review();
    const $submitButton = $(config.reviewSubmitElement);
    $submitButton.children().text("评价完成，点击提交");
    if (config.autoSubmit) {
      submitReview();
      alert("评价完成，已自动提交。");
    }
  };
  const main = () => {
    addReviewButton(executeReview);
  };
  const observer = (func, func2) => {
    const observer2 = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
          const $topContent = $(config.reviewParentElement);
          const href = window.location.href;
          const hrefTest = href.includes(config.reviewHref);
          if ($topContent.length && hrefTest) {
            observer2.disconnect();
            func();
            break;
          }
          const $modalBody = $(config.reviewModalElement);
          const $button = $modalBody.find("button.ant-btn-primary");
          if ($modalBody.length && $button.length) {
            observer2.disconnect();
            func2($button);
            console.log("已移除评价弹窗");
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
    if (!mycosTest())
      return;
    observer(main, removeModal);
    watchUrlChange((newUrl) => {
      observer(main, removeModal);
    });
  });

})(jQuery);