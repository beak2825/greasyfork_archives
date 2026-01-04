
// ==UserScript==
// @name         部分公司招聘网站（小米，字节）显示岗位发布时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在部分公司官网投递简历时看不到岗位发布时间，观察后台返回的岗位信息有publish_time字段，是时间戳类型，应该是岗位的发布时间，将该字段转换为日期加到了标题后面
// @match        https://xiaomi.jobs.f.mioffice.cn/*
// @match        https://jobs.bytedance.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499467/%E9%83%A8%E5%88%86%E5%85%AC%E5%8F%B8%E6%8B%9B%E8%81%98%E7%BD%91%E7%AB%99%EF%BC%88%E5%B0%8F%E7%B1%B3%EF%BC%8C%E5%AD%97%E8%8A%82%EF%BC%89%E6%98%BE%E7%A4%BA%E5%B2%97%E4%BD%8D%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/499467/%E9%83%A8%E5%88%86%E5%85%AC%E5%8F%B8%E6%8B%9B%E8%81%98%E7%BD%91%E7%AB%99%EF%BC%88%E5%B0%8F%E7%B1%B3%EF%BC%8C%E5%AD%97%E8%8A%82%EF%BC%89%E6%98%BE%E7%A4%BA%E5%B2%97%E4%BD%8D%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (_, url) {

  if (url.includes("/api/v1/search/job/posts")) {
    const xhr = this;
    const getter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "response"
    ).get;

    Object.defineProperty(xhr, "response", {
      get: () => {
        let result = getter.call(xhr);
        try {
          result.data.job_post_list.forEach((a)=>{
              let date = new Date(a.publish_time).toLocaleDateString();
              a.title = a.title+'------'+date;
          })
          return result;
        } catch (e) {
          return result;
        }
      },
    });
  } else if (url.includes("/api/v1/job/posts/")) {
    const xhr = this;
    const getter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "response"
    ).get;

    Object.defineProperty(xhr, "response", {
      get: () => {
        let result = getter.call(xhr);
        try {
           let detail = result.data.job_post_detail;
            let date = new Date(detail.publish_time).toLocaleDateString();
            detail.title = detail.title+'------'+date;
          return result;
        } catch (e) {
          return result;
        }
      },
    });
  }
  originOpen.apply(this, arguments);
};
})();