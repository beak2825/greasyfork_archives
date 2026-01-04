// ==UserScript==
// @name         Search-Block
// @namespace    https://greasyfork.org/zh-CN/users/874463
// @version      0.1.2
// @description  自动屏蔽搜索结果中某些网站，比如 CSDN

// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/$
// @icon         https://s3.bmp.ovh/imgs/2022/02/b5ded49cff4df12d.png
// @grant        none

// @author       Uyloal
// @license      MIT
// @code         https://github.com/uyloal/search-block
// @date         2022-02-09
// @downloadURL https://update.greasyfork.org/scripts/439757/Search-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/439757/Search-Block.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  // 配置各站点的 feed
  // feedSelector: 想要选中的 Tag
  // rule: 自定义的规则
  var baseConfig = {
    "www.baidu.com": {
      feedSelector: "input.s_ipt",
      rule: "-csdn",
    },
    "www.google.com": {
      feedSelector: "input.gLFyf.gsfi",
      rule: "-csdn",
    },
    "www.google.com.hk": {
      feedSelector: "input.gLFyf.gsfi",
      rule: "-csdn",
    },
  };
  var host = window.location.host;
  var config = baseConfig[host];
  var input = document.querySelector(config.feedSelector);
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (
        e.key == "Enter" &&
        this.value.length > 0 &&
        this.value.indexOf(config.rule) == -1
      ) {
        this.value += " " + config.rule;
      }
    });
    input.addEventListener("blur", function () {
      if (this.value.length > 0 && this.value.indexOf(config.rule) == -1) {
        this.value = this.value + " " + config.rule;
      }
    });
    input.addEventListener("focus", function () {
      var index = this.value.indexOf(" " + config.rule);
      if (index != -1) {
        this.value = this.value.substring(0, index);
      }
    });
  }
})();
