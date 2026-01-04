// ==UserScript==
// @name         DouFree
// @namespace    https://github.com/Sec-ant/
// @version      0.14.0
// @author       豆泥@豆瓣
// @description  Free you from DouBan restrictions
// @license      MIT
// @icon         https://www.douban.com/favicon.ico
// @homepage     https://github.com/Sec-ant/doufree
// @homepageURL  https://github.com/Sec-ant/doufree
// @source       https://github.com/Sec-ant/doufree.git
// @supportURL   https://github.com/Sec-ant/doufree/issues
// @match        https://www.douban.com/*
// @match        https://fastly.jsdelivr.net/*
// @webRequest   {"selector":"*/cuphead/sns-static/status/index.*.js","action":{"redirect":"https://fastly.jsdelivr.net/npm/doufree@0.14.0/dist/assets/index.3291e.patch.js"}}
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444959/DouFree.user.js
// @updateURL https://update.greasyfork.org/scripts/444959/DouFree.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function isValidUrl(str) {
    let url;
    try {
      url = new URL(str);
    } catch {
      return false;
    }
    return ["http:", "https:", "file:", "ftp:"].includes(url.protocol);
  }
  function patchXMLHttpRequest() {
    const OLD_XHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends XMLHttpRequest {
      constructor() {
        super();
        return new Proxy(new OLD_XHR(), {
          set(xhr, key, value) {
            if (key in xhr) {
              xhr[key] = value;
            }
            return true;
          },
          get(xhr, key) {
            switch (key) {
              case "responseText": {
                const { responseURL } = xhr;
                switch (true) {
                  case /https:\/\/www\.douban\.com\/j\/status\/comments\?sid=\d+&resp_type=c_dict/.test(
                    responseURL
                  ):
                    return xhr.responseText.replace(
                      /"url":"([^"]+?)","expanded_url":"([^"]+?)"/g,
                      '"url":"$2","expanded_url":"$2"'
                    );
                  case /https:\/\/www\.douban\.com\/j\/(group\/check_content_clean|check_clean_content)/.test(
                    responseURL
                  ):
                    return '{"r":0}';
                  default:
                    return xhr.responseText;
                }
              }
              default: {
                const value = xhr[key];
                if (typeof value === "function") {
                  return (...args) => value.apply(xhr, args);
                }
                return value;
              }
            }
          }
        });
      }
    };
  }
  function expandShortUrl() {
    for (const a of [
      ...document.querySelectorAll(
        'a[href^="https://douc.cc/"]'
      )
    ]) {
      const { href, title, textContent } = a;
      if (title && isValidUrl(title)) {
        a.href = title;
        if (textContent === href) {
          a.textContent = title;
        }
      }
    }
  }
  function replaceDouListUrls() {
    for (const div of [
      ...document.querySelectorAll(
        'div[data-target-type="doulist"]'
      )
    ]) {
      const dataObjectId = div.getAttribute("data-object-id");
      if (dataObjectId === null) {
        return;
      }
      let url;
      switch (div.getAttribute("data-object-kind")) {
        case "1011":
          url = `https://www.douban.com/event/${dataObjectId}/`;
          break;
        case "1012":
          url = `https://www.douban.com/review/${dataObjectId}/`;
          break;
        case "1013":
          url = `https://www.douban.com/group/topic/${dataObjectId}/`;
          break;
        case "1015":
          url = `https://www.douban.com/note/${dataObjectId}/`;
          break;
        case "3055":
          url = `https://www.douban.com/people/x/status/${dataObjectId}/`;
          break;
        default:
          return;
      }
      const linkElement = div.querySelector(
        'div.title > a, p.text > a[href^="https://www.douban.com/doulist"]'
      );
      if (!linkElement) {
        return;
      }
      linkElement.href = url;
      linkElement.target = "_black";
    }
  }
  function removeUnderscoreISearchParam() {
    const replaceStateOriginal = window.history.replaceState;
    window.history.replaceState = (_, __, url) => {
      if (url) {
        const urlObj = new URL(url);
        const urlSearchParams = urlObj.searchParams;
        urlSearchParams.delete("_i");
        urlObj.hash = urlObj.hash.replace(/(&|\?)_i=.*$/, "");
        url = urlObj.toString();
      }
      return replaceStateOriginal.call(window.history, _, __, url);
    };
  }
  function handleWindowLoaded() {
    expandShortUrl();
    replaceDouListUrls();
    window.removeEventListener("load", handleWindowLoaded);
  }
  if (window.location.host === "www.douban.com") {
    removeUnderscoreISearchParam();
    patchXMLHttpRequest();
    window.addEventListener("load", handleWindowLoaded);
  }

})();