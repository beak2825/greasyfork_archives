// ==UserScript==
// @name         AK Box
// @namespace    github.com/starxg
// @version      0.0.1
// @author       starxg
// @description  a box
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans
// @match        *://www.baidu.com/*
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @connect      baidu.com
// @connect      localhost
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502802/AK%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/502802/AK%20Box.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function directLink() {
    const links = [];
    const suffix = "www.baidu.com/link";
    links.push(...$(`a[href^='http://${suffix}']`));
    links.push(...$(`a[href^='https://${suffix}']`));
    for (const e of links) {
      let url = $(e).prop("href");
      if (!url.startsWith(location.protocol)) {
        const segments = url.split(":", 2);
        segments[0] = location.protocol;
        url = segments.join("");
      }
      _GM_xmlhttpRequest({
        url: url + "&wd=&eqid=",
        timeout: 15e3,
        onload: function(response) {
          const urls = response.responseText.match(/https?:\/\/[^\s'"]+/);
          if (urls instanceof Array && urls.length > 0) {
            $(e).prop("href", urls[0]);
          }
        }
      });
    }
  }
  function callback() {
    directLink();
  }
  location.host === "www.baidu.com" ? $(callback) : false;

})(jQuery);