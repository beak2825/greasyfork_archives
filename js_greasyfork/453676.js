// ==UserScript==
// @name            姿势小王子(zsxwz)取消跳转
// @name:en         姿势小王子(zsxwz)取消跳转
// @namespace       https://github.com/dadaewqq/fun
// @version         1.7
// @description     姿势小王子论坛取消go.php跳转,帖子从新标签页打开
// @description:en  姿势小王子论坛取消go.php跳转,帖子从新标签页打开
// @author          dadaewqq
// @match           https://bbs.zsxwz.com/*
// @icon            https://bbs.zsxwz.com/upload/avatar/000/1.png
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/453676/%E5%A7%BF%E5%8A%BF%E5%B0%8F%E7%8E%8B%E5%AD%90%28zsxwz%29%E5%8F%96%E6%B6%88%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453676/%E5%A7%BF%E5%8A%BF%E5%B0%8F%E7%8E%8B%E5%AD%90%28zsxwz%29%E5%8F%96%E6%B6%88%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  $("[href^=thread-]").attr("target", "_blank");

  var tiaozhuan = $('[_href^="https://bbs.zsxwz.com/go.php?"]');
  for (var i = 0; i < tiaozhuan.length; i++) {
    tiaozhuan[i].href = tiaozhuan[i].href.replace("https://bbs.zsxwz.com/go.php?url=", "");
  }
})();
