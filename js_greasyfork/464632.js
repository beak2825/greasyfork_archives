// ==UserScript==
// @name         瑞克论坛插件
// @namespace    https://www.ruike1.com/
// @version      1.0
// @description  瑞克网站、教育盘、助学盘的复制脚本
// @author       You
// @match        *ruike1.com/*
// @match        *www.ruike1.com/*
// @match        *zhuxuepan.com/*
// @match        *jiaoyupan.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/464632/%E7%91%9E%E5%85%8B%E8%AE%BA%E5%9D%9B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/464632/%E7%91%9E%E5%85%8B%E8%AE%BA%E5%9D%9B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let signInBtn = document.querySelector("#fx_checkin_b");
  let thread_types = document.querySelector("#thread_types");
  let newspecial = document.querySelector("#newspecial");
  // 自动签到
  if (signInBtn?.alt === "点击签到") {
    signInBtn.click();
  }
  // .tl table
  if (thread_types || newspecial) {
    let btn = newspecial || thread_types;
    if (newspecial) {
      MY_addStyle(`
        .tl table {
          table-layout: auto;
        }
      `);
      btn.insertAdjacentHTML(
        "afterend",
        `<span class='copy-wrap' style="background: #1890ff;color: #fff; cursor: pointer; width: 70px; height: 33px; line-height: 33px;display: inline-block; text-align: center;margin-left: 5px;">复制标题</span>`
      );
    } else {
      btn.insertAdjacentHTML(
        "beforeend",
        `<li class='copy-wrap'><a style="background: #1890ff;color: #fff;cursor: pointer;">复制标题</a></li>`
      );
    }

    let copyBtn = document.querySelector(".copy-wrap");
    let row = document.querySelectorAll('[id^="normalthread"] > tr > .icn');
    row.forEach((item) => {
      item.style.width = "55px";
      item.insertAdjacentHTML(
        "afterbegin",
        `<td class="checkbox-td" style="width:30px;text-align:center"><input type="checkbox" name="select-title" class="checkbox-select" style="width:20px;height:20px"></td>`
      );
    });

    copyBtn.onclick = function (event) {
      let checkbox = document.querySelectorAll(".checkbox-select");
      let titleAry = [];
      let noCheckAry = [];
      checkbox.forEach((item) => {
        let parent =
          item.parentElement.tagName === "TR"
            ? item.parentElement
            : item.parentElement.parentElement;
        let text = parent
          .querySelector(".common .xst")
          .innerText.replace("[百度云网盘]", "");

        if (item.checked) {
          titleAry.push(text);
        } else {
          noCheckAry.push(text);
        }
      });
      let checkStr = titleAry.join("\n");
      let noCheckStr = noCheckAry.join("\n");
      GM_setClipboard(checkStr ? checkStr : noCheckStr);
    };
  }

  function MY_addStyle(innerHTML) {
    // 创建 style 元素
    let style = document.createElement("style");
    style.type = "text/css";

    // 设置样式内容
    let css = innerHTML;
    style.innerHTML = css;

    // 将 style 元素添加到 head 元素中
    document.head.appendChild(style);
  }
})();
