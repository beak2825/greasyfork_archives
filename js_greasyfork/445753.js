// ==UserScript==
// @name         yuntu-data-tab
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动切换云图数据源 tab
// @author       rachpt.cn
// @match        https://yuntu-manage.sankuai.com/datasource/default
// @require      https://greasyfork.org/scripts/445645-mws/code/mws.js?version=1055022
// @icon         https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:f23089be/yuntu.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445753/yuntu-data-tab.user.js
// @updateURL https://update.greasyfork.org/scripts/445753/yuntu-data-tab.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  setTimeout(() => {
    (async () => {
      const e = await mws.wait('#my-ds', 10, 500)
      if (e) {
        e.nextElementSibling?.firstChild?.nextSibling?.click()
        return null
      }
    }
    )();
  }, 100)
})();