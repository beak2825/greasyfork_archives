// ==UserScript==
// @name         调试文件优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  优化Quicker原版调试文件体验
// @author       Cesaryuan
// @match        file:///*/quicker_*_log.htm
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      http://code.jquery.com/color/jquery.color-2.1.2.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440911/%E8%B0%83%E8%AF%95%E6%96%87%E4%BB%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440911/%E8%B0%83%E8%AF%95%E6%96%87%E4%BB%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // queryByXpath
  function queryByXpath(xpath, root) {
    var xpathResult = document.evaluate(
      xpath,
      root || document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    var result = [];
    for (var i = 0, len = xpathResult.snapshotLength; i < len; ++i) {
      result.push(xpathResult.snapshotItem(i));
    }
    return result;
  }
  for (const stepHeader of queryByXpath(
    "//div[@class='step-header' and ../div[@class='step-content']/div[@title and contains(@class, 'message') and contains(text(), '已禁用')]]"
  )) {
    // add class quicker-forbid and quicker-light
    stepHeader.classList.add("quicker-forbid");
    stepHeader.classList.add("quicker-light");
  }

  for (const stepHeader of queryByXpath(
    "//div[@class='step-header' and ../div[@class='step-content']/div[@title and contains(@class, 'message') and contains(text(), '不符合条件，跳过。')]]"
  )) {
    // add class quicker-forbid
    stepHeader.classList.add("quicker-skiped-if");
    stepHeader.classList.add("quicker-light");
  }

  // 出错步骤
  $("div.message-warning:contains(出错)")
    .parents(".step-content")
    .prev(".step-header")
    .addClass("quicker-warn-step");
  // 出错步骤
  $("div.sys_stop:contains(标记为出错：1)")
    .parents(".step-content")
    .prev(".step-header")
    .addClass("quicker-warn-step");
  // 注释步骤
  $("div.sys_comment .step-header").addClass("quicker-light");

  // 全是注释的步骤
  $("div.sys_group > .step-content > .step-group").each(function () {
    if ($(this).children(".sys_comment").length === $(this).children().length) {
      $(this)
        .parent(".step-content")
        .prev(".step-header")
        .addClass("quicker-light")
        .addClass("quicker-comment-sys-group");
    }
  });

  // 没有输出的赋值步骤
  $("div.sys_assign > div.step-content .message:contains(赋值模块未定义输出)")
    .parent(".step-content")
    .prev(".step-header")
    .addClass("quicker-no-output-assign")
    .addClass("quicker-light");

  //inject css text
  var css = `
  .step-input:hover, .step-output:hover {
    max-height: 3em;
    overflow: hidden;
}
  .collapsed .quicker-warn-step {
    background-color: #ffdada !important;
  }
  .quicker-warn-step {
    background-color: #fff4f4 !important;
  }

  .quicker-light {
    background-color: #f8f8f8 !important;
  }
  .quicker-forbid > *{
    text-decoration: line-through !important;
  }
  .quicker-forbid::after {
      content: '已禁用';
      color: #a0a0a0
  }
  .quicker-skiped-if::after {
      content: '不符合条件';
      color: #a0a0a0
  }
  .quicker-skiped-if *, .quicker-forbid *  {
      /* text-decoration: line-through 0.01em; */
  }
  .quicker-comment-sys-group::after {
    content: '全是注释';
  }
  .quicker-no-output-assign::after {
    content: ' 没有输出';
  }
          `;
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
})();
