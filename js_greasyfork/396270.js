// ==UserScript==
// @name         Open Google Search Results in New Tab
// @name:zh-CN   Google 谷歌搜索结果以新标签页打开
// @namespace    https://github.com/zkqiang
// @version      1.1
// @description  Modify the Google search results link to open in a new tab
// @description:zh-CN  将谷歌搜索结果的链接修改为以新标签页打开
// @author       zkqiang
// @match        *://www.google.com/search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396270/Open%20Google%20Search%20Results%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/396270/Open%20Google%20Search%20Results%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function modify(selectors) {
    try {
      var nodes = document.querySelectorAll(selectors);
      for (var m = 0; m < nodes.length; m++) {
        var links = nodes[m].getElementsByTagName('a');
        for (var n = 0; n < links.length; n++) {
          links[n].target = '_blank';
        }
      }
    } catch (err) {
      console.error('[tampermonkey-google-newtab] error: ' + err.toString())
    }
  }

  modify('#res');
  modify('#bottomads');
  modify('#rhs');
  modify('#fsl');
})();
