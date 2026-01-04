// ==UserScript==
// @name         DarkFactor 随机作答并自动 Next
// @namespace    df-auto
// @version      0.1
// @description  在 qst.darkfactor.org 上为每页题目随机选择选项并自动进入下一页
// @match        https://qst.darkfactor.org/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546165/DarkFactor%20%E9%9A%8F%E6%9C%BA%E4%BD%9C%E7%AD%94%E5%B9%B6%E8%87%AA%E5%8A%A8%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/546165/DarkFactor%20%E9%9A%8F%E6%9C%BA%E4%BD%9C%E7%AD%94%E5%B9%B6%E8%87%AA%E5%8A%A8%20Next.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function autoFillAndNext() {
    // 仅在问卷页运行
    const form = document.forms['scale'] || document.querySelector('form[name="scale"]');
    if (!form) return;

    const radios = Array.from(form.querySelectorAll('input[type="radio"]'));
    if (radios.length === 0) return;

    // 按 name 分组并为未作答的题目随机选一项
    const groups = new Map();
    for (const r of radios) {
      if (!groups.has(r.name)) groups.set(r.name, []);
      groups.get(r.name).push(r);
    }

    groups.forEach((inputs) => {
      if (!inputs.some((i) => i.checked)) {
        const choice = randomPick(inputs);
        choice.checked = true;
        // 触发可能的监听器
        choice.dispatchEvent(new Event('change', { bubbles: true }));
        choice.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // 关闭可能的“未作答”提示
    const warn = document.getElementById('warningScale');
    if (warn) warn.style.display = 'none';

    // 优先模拟点击站点的 Next 链接；若不存在则直接提交表单
    const nextLink = document.querySelector('a.go');
    setTimeout(() => {
      if (nextLink) {
        nextLink.click(); // href 为 javascript:... 会在页面上下文执行校验
      } else if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    }, 200 + Math.random() * 500);
  }

  ready(() => {
    // 给页面一点构建时间
    setTimeout(autoFillAndNext, 300);
  });
})();
