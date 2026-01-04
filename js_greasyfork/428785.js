// ==UserScript==
// @namespace     https://openuserjs.org/users/sysdzw
// @name          微标知乎批量邀请知乎一键邀请v1.0
// @description   知乎批量邀请工具，只要打开知乎页面，检测到可邀请的便会全部邀请，建议平常禁用，在要使用的时候启用然后刷新页面即可。
// @copyright     2021, sysdzw (https://openuserjs.org/users/sysdzw)
// @license       OSI-SPDX-Short-Identifier
// @version       1.0.0
// @include       https://www.zhihu.com/question/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/428785/%E5%BE%AE%E6%A0%87%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E9%82%80%E8%AF%B7%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E9%82%80%E8%AF%B7v10.user.js
// @updateURL https://update.greasyfork.org/scripts/428785/%E5%BE%AE%E6%A0%87%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E9%82%80%E8%AF%B7%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E9%82%80%E8%AF%B7v10.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author sysdzw
// ==/OpenUserJS==

setInterval(
  function () {
    $("button").each(function () {
      if ($(this).text() == "邀请回答") {
        $(this).click();
      }
    });
  }, 3000
);
