// ==UserScript==
// @name         Auto Redirect
// @namespace    coderzhaoziwei@outlook.com
// @description  网站外部链接自动跳转 | 知乎 | 简书 | Steam
// @version      1.0.2
// @homepage     https://greasyfork.org/scripts/426352
// @author       Coder Zhao
// @match        https://link.zhihu.com/*
// @match        https://www.jianshu.com/go-wild*
// @match        https://steamcommunity.com/linkfilter*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426352/Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/426352/Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
  "use strict";

  /**
   * @key paramkey - 查询字串 location.search 中指定的 key
   * @key hostname - 主机名称 location.hostname 的值
   * @key testlink - 测试链接 可省略
   */
  const list = [
    {
      "paramkey": "target",
      "hostname": "link.zhihu.com",
      "testlink": "https://link.zhihu.com/?target=https://github.com/coderzhaoziwei",
    },
    {
      "paramkey": "url",
      "hostname": "www.jianshu.com",
      "testlink": "https://www.jianshu.com/go-wild?ac=2&url=https://github.com/coderzhaoziwei",
    },
    {
      "paramkey": "url",
      "hostname": "steamcommunity.com",
      "testlink": "https://steamcommunity.com/linkfilter/?url=https://github.com/coderzhaoziwei",
    },
  ];

  list.find(data => {
    if (location.hostname === data.hostname) {
      const params = new URLSearchParams(location.search);
      const key = data.paramkey;

      if (params.has(key)) {
        location.replace(params.get(key));
      }

      return params.has(key);
    }
  });

})();
