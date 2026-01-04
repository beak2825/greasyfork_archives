// ==UserScript==
// @name        IDontNeedRedirect
// @namespace   IDontNeedRedirect
// @match       https://mail.qq.com/cgi-bin/frame_html*
// @match       https://www.zhihu.com/*
// @match       https://www.jianshu.com/p/*
// @version     1.0.1
// @author      Dreace
// @license     GPL-3.0
// @description 去除常见网站的对域外链接的重定向
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419069/IDontNeedRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/419069/IDontNeedRedirect.meta.js
// ==/UserScript==

"use strict";
var handlers = {};

function regExpReplace(selector, regExp, className) {
  document.querySelectorAll(selector).forEach(function (aTag) {
    try {
      var results = aTag.href.match(new RegExp(regExp));
      if (results) {
        aTag.href = decodeURIComponent(results[1]);
        if (typeof className === "string") {
          aTag.className = className;
        }
      }
    } catch (error) {
      log(error);
    }
  });
}

handlers["https://mail.qq.com/cgi-bin/frame_html"] = function () {
  unsafeWindow._openExtLink = function () {
    return true;
  };
};

handlers["https://www.zhihu.com"] = function () {
  var count = 0;
  var interval = setInterval(function () {
    regExpReplace("a", "link.zhihu.com/\\?target=(.*)",);
    count += 1;
    if (count >= 60) {
      clearInterval(interval);
    }
  }, 1000);
};

handlers["https://www.jianshu.com/p"] = function () {
  regExpReplace("a", "links.jianshu.com/go\\?to=(.*)");
};

for (var url in handlers) {
  if (location.href.match(url)) {
    log(url + " detected");
    handlers[url]();
    log(url + " done");
  }
}

function log(content) {
  console.log("[IDontNeedRedirect] " + content);
}
