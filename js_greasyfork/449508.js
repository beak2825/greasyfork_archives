// ==UserScript==
// @name         洛谷关键词屏蔽讨论
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  屏蔽标题中包含关键词的讨论
// @author       You
// @match        https://www.luogu.com.cn
// @match        https://www.luogu.com.cn/discuss*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449508/%E6%B4%9B%E8%B0%B7%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449508/%E6%B4%9B%E8%B0%B7%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const BLOCKLIST = [' 求调 ', ' 站外题 ', ' 小游戏 ', ' 咕值 ', ' 估值 ', ' 捞 ', 'pts', ' 全 WA',
    ' 全 wa',
  ];
  const BLOCKLISTREGEX = [/\d {1,2} 分 /];
  const HREF = document.location.href;
  setTimeout (() => {
    if (HREF.indexOf ('discuss') === -1) {
      const DISCUSSLIST = document.querySelectorAll ('.am-panel-primary');
      console.log (DISCUSSLIST);
      for (const DISCUSS of DISCUSSLIST) {
        if (DISCUSS.children [0].children [1] === undefined) {
          continue;
        }
        const TITLE = DISCUSS.children [0].children [1].children [0].innerText;
        let erased = false;
        for (const KEY of BLOCKLIST) {
          if (TITLE.indexOf (KEY) !== -1) {
            DISCUSS.parentNode.removeChild (DISCUSS);
            erased = true;
            break;
          }
        }
        if (erased) {
          continue;
        }
        for (const REGEXP of BLOCKLISTREGEX) {
          if (REGEXP.test (TITLE)) {
            DISCUSS.parentNode.removeChild (DISCUSS);
            break;
          }
        }
      }
    } else {
      const DISCUSSLIST =
       document.querySelectorAll ('.card.post-item.padding-default');
      for (const DISCUSS of DISCUSSLIST) {
        const TITLE =
          DISCUSS.children [0].children [1].children [0].children [0].innerText;
        let erased = false;
        for (const KEY of BLOCKLIST) {
          if (TITLE.indexOf (KEY) !== -1) {
            DISCUSS.parentNode.removeChild (DISCUSS);
            erased = true;
            break;
          }
        }
        if (erased) {
          continue;
        }
        for (const REGEXP of BLOCKLISTREGEX) {
          if (REGEXP.test (TITLE)) {
            DISCUSS.parentNode.removeChild (DISCUSS);
            break;
          }
        }
      }
    }
  }, 1000);
})();
