// ==UserScript==
// @name         网页标签logo标题修改
// @description  上班打酱油，可以修改成公司内部网站信息。
// @icon         https://www.spacex.com/static/images/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      v2.1
// @description  try to take over the world!
// @author       何必
// @match        *.douyin.com/*
// @match        *douyin.*
// @match       *://www.douyin.com/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/453087/%E7%BD%91%E9%A1%B5%E6%A0%87%E7%AD%BElogo%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/453087/%E7%BD%91%E9%A1%B5%E6%A0%87%E7%AD%BElogo%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
window.onload = function () {
      const changeFavicon = link => {
        let $favicon = document.querySelector('link[rel="shortcut icon"]');
        // If a <link rel="shortcut icon"> element already exists,
        // change its href to the given link.
        if ($favicon !== null) {
          $favicon.href = link;
          // Otherwise, create a new element and append it to <head>.
        } else {
          $favicon = document.createElement("link");
          $favicon.rel = "shortcut icon";
          $favicon.href = link;
          document.head.appendChild($favicon);
        }
      };
      let icon = "https://www.spacex.com/static/images/favicon.ico"; // 图片地址，自行修改
      changeFavicon(icon); // 动态修改网站图标

 document.title = '网页名称，自行修改';
};
window.onblur = function () {
 document.title = '网页名称，自行修改';
};

})();
