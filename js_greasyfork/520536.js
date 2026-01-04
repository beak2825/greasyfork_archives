// ==UserScript==
// @name         아카라이브 트위터첨부 오류수정
// @namespace    Holobox
// @version      2024-12-13
// @description  아카라이브 트위터 첨부 정상화
// @author       아기비부영양제
// @match        https://arca.live/b/*
// @match        https://safefra.me/twitter/*
// @match        https://platform.twitter.com/*
// @icon         https://x.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520536/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%8A%B8%EC%9C%84%ED%84%B0%EC%B2%A8%EB%B6%80%20%EC%98%A4%EB%A5%98%EC%88%98%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520536/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%8A%B8%EC%9C%84%ED%84%B0%EC%B2%A8%EB%B6%80%20%EC%98%A4%EB%A5%98%EC%88%98%EC%A0%95.meta.js
// ==/UserScript==

window.addEventListener(
  "message",
  function (e) {
    console.log("got message");
    if ("https://safefra.me" === e.origin && e.data.height && e.data.element) {
      var iframe = document.querySelector(
        `iframe.sweet[data-tweetid="${e.data.element}"]` // CSS.escape
      );
      console.log("iframe: ", iframe);
      console.log("data-tweetid: ", e.data.element);
      if (iframe && parseInt(e.data.height) !== 10) {
        iframe.height = parseInt(e.data.height) + 10 + "px";
        iframe.style.height = parseInt(e.data.height) + 10 + "px";
      }
    }
  },
  !1
);

// 내부에서 color-scheme: dark 설정, 텍스트 클릭시 리다이렉트 방지
// @match        https://safefra.me/twitter/*
// @match        https://platform.twitter.com/*
(async function () {
  "use strict";
  const matchUrls = [
    "https://safefra.me/twitter/*",
    "https://platform.twitter.com/*",
  ];
  if (!isMatchURL(matchUrls)) return;

  // Create the meta element
  const meta = document.createElement("meta");
  meta.name = "color-scheme";
  meta.content = "dark";

  // Add it to the head of the document
  document.head.appendChild(meta);

  const app = await waitForElm("#app");
  app.addEventListener(
    "click",
    function (e) {
      if (e.target.closest('div[data-testid="tweetText"]')) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Tweet text clicked");
      }
    },
    true
  );
})();

// 외부에서 트위터 임베드 인식 및 postMessage
// @match        https://arca.live/b/*
(async function () {
  "use strict";
  const matchUrls = ["https://arca.live/b/*"];
  if (!isMatchURL(matchUrls)) return;

  // 에디터와 글보기 둘다 article이 .fr-view
  const articleContainer = await waitForElm(".fr-view");

  function processTweet(tweet) {
    if (tweet.dataset.tweetid) {
      return;
    }
    const url = new URL(tweet.src);
    url.searchParams.set("theme", "dark");

    const oldTweet = tweet;
    const parent = oldTweet.parentNode;
    parent.removeChild(oldTweet);
    tweet = oldTweet.cloneNode(true);
    tweet.classList.remove("tweet");
    tweet.classList.add("sweet");
    tweet.setAttribute("src", url.href);
    parent.appendChild(tweet);

    // assign a unique id to the tweet (random)
    tweet.dataset.tweetid = `tweet_${Math.random().toString(36).substr(2, 9)}`;
    // add event listener only once.
    tweet.addEventListener("load", function () {
      this.contentWindow.postMessage(
        {
          element: this.dataset.tweetid,
          query: "height",
        },
        "https://safefra.me"
      );
    });
  }

  // 이미 존재하는 트윗 처리
  const tweets = document.querySelectorAll("iframe.tweet");
  tweets.forEach(processTweet);

  // 새로 추가되는 트윗 처리
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.matches("iframe.tweet")) {
          console.log("new tweet detected");
          processTweet(node);
        }
      });
    });
  });

  observer.observe(articleContainer, {
    childList: true,
    subtree: true,
  });
})();

// 유틸리티 함수
function waitForElm(selector) {
  return new Promise((resolve) => {
    const elm = document.querySelector(selector);
    if (elm) {
      return resolve(elm);
    }
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document, {
      //document.body
      childList: true,
      subtree: true,
    });
  });
}

function isMatchURL(urls) {
  const currentUrl = window.location.href;
  return urls.some((url) => {
    const regex = new RegExp(url.replace(/\*/g, ".*"));
    return regex.test(currentUrl);
  });
}
