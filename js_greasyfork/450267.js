// ==UserScript==
// @name         Bob's UserScript
// @namespace    OIJ.CC
// @version      1.3
// @description  try to smell my feet.
// @author       One Good Bob
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/base/icons.png
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/450267/Bob%27s%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/450267/Bob%27s%20UserScript.meta.js
// ==/UserScript==

// 下面其实根本就不是一个Map！！！而是一个Object
const baseUrlMap = {
  "bilibili.com/video": {
    likedSelector: "span.like.on",
    notLikedSelector: "span.like",
  },
  "bilibili.com/bangumi": {
    likedSelector: "div.like-info.active",
    notLikedSelector: "div.like-info",
  },
  "youtube.com": {
    likedSelector:
      "#info ytd-toggle-button-renderer:nth-child(1).style-default-active",
    notLikedSelector:
      "#info ytd-toggle-button-renderer:nth-child(1).style-text",
  },
};

(function thumbUp() {
  setInterval(makePromise, 3000);
})();

/*
    需要区分以下三个站点，他们点赞的网页元素不尽相同，需要区分对待。
    B站视频的URL sample:https://www.bilibili.com/video/BV1Ja411N7zD?spm_id_from=333.1007.tianma.1-1-1.click&vd_source=b156e07ac063bb4be8dd1dacf8c3a63f
    B站番剧的URL sample:https://www.bilibili.com/bangumi/play/ss28747?spm_id_from=333.337.0.0
    Youtube URL sample:https://www.youtube.com/watch?v=JKlr0tyQgzk
*/

function getSelector() {
  const currentUrl = window.location.href; // get current website's URL which may change with the website.
  // 注意这里用的是 for in Object
  for (let baseUrl in baseUrlMap) {
    if (currentUrl.includes(baseUrl)) {
      return baseUrlMap[baseUrl];
      //   return baseUrlMap.get(baseUrl);
    }
  }
}

function likeIt(likedSelector, notLikedSelector) {
  if (!document.querySelector(likedSelector)) {
    // if not liked, then like it
    console.log("Haven't liked it yet. Let's like it.");
    document.querySelector(notLikedSelector).click();
  }
}

function makePromise() {
  // 每次创建promise对象 因为涉及到网页操作用的Selector，都要重新确认Selector
  const { likedSelector, notLikedSelector } = getSelector();

  let promise = new Promise((resolve, reject) => {
    // 因为这里不想着急进行点击操作，所以设置了Timeout，等会儿再点击。
    setTimeout(() => {
      likeIt(likedSelector, notLikedSelector);
      // 这里只是做一个区分，并不会因为这里检查到没有点赞成功 就再次点击，单纯做个检查。
      document.querySelector(likedSelector) ? resolve() : reject();
    }, 1000);
  });

  promise
    .then(() => console.log("Bob liked successfully!"))
    .catch(() => {
      console.log(
        "It seems that Bob failed liking it. He will wait for the NEXT ROUND and try it again."
      );
    });
}