// ==UserScript==
// @name         东华网络教自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @include      *://donghuacj.ct-edu.com.cn/*
// @include      *:*
// @include      *:*
// @include      *:*
// @include      *:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412953/%E4%B8%9C%E5%8D%8E%E7%BD%91%E7%BB%9C%E6%95%99%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412953/%E4%B8%9C%E5%8D%8E%E7%BD%91%E7%BB%9C%E6%95%99%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** 脚本开始 */
  // 设置刷新时间，性能慢的电脑可设置5-10秒
  const INTERVALTIME = 3 * 1000;

  let waitTill = 0;

  let timer = null;

  // 判断是否有类
  function hasClassFun(element, cls) {
    console.log("判断类由还是没有element:", element);
    if (element) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    } else {
      return false;
    }
  }

  // 如果有框 才走下面
  const handleNext = () => {
    showNext();
    showComplete();
    showQuestion();
  };
  // 定时器检测
  timer = setInterval(handleNext, INTERVALTIME);

  // 出现下一条
  function showNext() {
    // 出现下一页框点击
    let selectBox = document.querySelector(".layui-layer.layui-layer-dialog");
    let next = document.querySelector(
      ".layui-layer.layui-layer-dialog .layui-layer-btn0"
    );
    // 如果下一张显示就点击下一张
    if (selectBox && !selectBox.hidden) {
      next.click();
    }
  }

  // 出现已完成字样
  function showComplete() {
    // 页面标题出现已完成
    let complete = document.querySelector(".item-title .complete.ng-scope");
    // 所有列表
    let allNav = document.querySelectorAll(
      ".course_chapter_item.user-no-select.ng-scope"
    );
    let index = [].findIndex.call(allNav, (v) => hasClassFun(v, "active"));
    // 如果页面上出现已完成 点击下一跳视频
    if (complete && complete.innerText === "已完成") {
      allNav[index + 1].querySelector(".section_title.ng-binding").click();
    }
  }
  // 处理答题弹窗
  function showQuestion() {
    // 页面标题出现已完成
    let q = document.querySelector(".popup_do.ng-scope");

    if (q) {
      // 清除全局定时器
      clearInterval(timer);

      // let selectlis = getLis(q) // 获取列表集合
      // let submitBtn = getBtn(questionBox) // 提交按钮
      // console.log({ q, selectlis })
      // 第一条
      getLis(q)[0].querySelector("label").click();
      getBtn(q).click();

      waitTill = new Date(new Date().getTime() + 1 * 1000);
      while (waitTill > new Date()) {}

      if (hasClassFun(getLis(q)[0], "error")) {
        console.log("第一条有错误");
        getBtn(q).click();
        waitTill = new Date(new Date().getTime() + 1 * 1000);
        while (waitTill > new Date()) {}
      } else {
        timer = setInterval(handleNext, INTERVALTIME);
        return;
      }
      // 第二条
      getLis(q)[1].querySelector("label").click();
      getBtn(q).click();

      waitTill = new Date(new Date().getTime() + 1 * 1000);
      while (waitTill > new Date()) {}

      if (hasClassFun(getLis(q)[1], "error")) {
        console.log("第二条有错误");
        getBtn(q).click();
        waitTill = new Date(new Date().getTime() + 1 * 1000);
        while (waitTill > new Date()) {}
      } else {
        timer = setInterval(handleNext, INTERVALTIME);
        return;
      }

      // 第三条
      getLis(q)[2].querySelector("label").click();
      getBtn(q).click();

      waitTill = new Date(new Date().getTime() + 1 * 1000);
      while (waitTill > new Date()) {}

      if (hasClassFun(getLis(q)[2], "error")) {
        console.log("第三条有错误");
        getBtn(q).click();
        waitTill = new Date(new Date().getTime() + 1 * 1000);
        while (waitTill > new Date()) {}
      } else {
        timer = setInterval(handleNext, INTERVALTIME);
        return;
      }

      // 第四条
      getLis(q)[3].querySelector("label").click();
      getBtn(q).click();

      waitTill = new Date(new Date().getTime() + 1 * 1000);
      while (waitTill > new Date()) {}

      if (hasClassFun(getLis(q)[3], "error")) {
        console.log("第四条有错误");
        getBtn(q).click();
        waitTill = new Date(new Date().getTime() + 1 * 1000);
        while (waitTill > new Date()) {}
      } else {
        timer = setInterval(handleNext, INTERVALTIME);
        return;
      }
    } else {
      getContinueBtn() && getContinueBtn().click();
      return;
    }
  }
  // 返回答题列表
  function getLis(questionBox) {
    let selectUl = questionBox.querySelector(".item.content.DANXUAN.active ul");
    let selectlis = selectUl ? selectUl.querySelectorAll("li") : [];
    return selectlis;
  }
  // 返回提交重做按钮
  function getBtn(questionBox) {
    return questionBox.querySelector(".btn.whaty-button");
  }
  // 返回安提结束继续按钮
  function getContinueBtn() {
    const q = document.querySelector(".popup_show.ng-scope");
    if (q) {
      return q.querySelector(".btn.whaty-button");
    } else {
      return null;
    }
  }
  /** 脚本结束 */
})();
