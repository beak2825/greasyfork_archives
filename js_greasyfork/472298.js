// ==UserScript==
// @name         Meteor爱奇艺剧集链接捕获工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于方便捕获爱奇艺剧集全集链接地址
// @author       Meteor
// @match        https://www.iqiyi.com/v_*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472298/Meteor%E7%88%B1%E5%A5%87%E8%89%BA%E5%89%A7%E9%9B%86%E9%93%BE%E6%8E%A5%E6%8D%95%E8%8E%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472298/Meteor%E7%88%B1%E5%A5%87%E8%89%BA%E5%89%A7%E9%9B%86%E9%93%BE%E6%8E%A5%E6%8D%95%E8%8E%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 重写 XMLHttpRequest
  const realXhr = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new realXhr();

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState == 4 && this.status == 200 && this.responseURL.includes("https://mesh.if.iqiyi.com/tvg/pcw/base_info")) {
        const responseData = JSON.parse(this.responseText);

        if (responseData && responseData.data && responseData.data.template && responseData.data.template.pure_data && responseData.data.template.pure_data.selector_bk) {
          const selectorBk = responseData.data.template.pure_data.selector_bk;
          let pageUrls = [];

          for (const selector of selectorBk) {
            if (selector.videos && selector.videos.feature_paged && selector.videos.page_keys) {
              for (const pageKey of selector.videos.page_keys) {
                const videos = selector.videos.feature_paged[pageKey];
                if (Array.isArray(videos)) {
                  for (const video of videos) {
                    if (video.page_url) {
                      pageUrls.push(video.page_url);
                    }
                  }
                }
              }
            }
          }

          if (pageUrls.length > 0) {
            const pageUrlText = pageUrls.join("\n");

            // 创建输入框
            const input = document.createElement("textarea");
            input.value = pageUrlText;
            input.style.width = "500px";
            input.style.height = "300px";
            input.style.resize = "none";

            // 弹出输入框
            const popupWindow = window.open("", "_blank", "width=600,height=400");
            popupWindow.document.body.appendChild(input);
          } else {
            alert("未找到 page_url 数据！");
          }
        }
      }
    });

    return xhr;
  };
})();
