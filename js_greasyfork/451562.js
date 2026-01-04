// ==UserScript==
// @name        CNMD B站短视频
// @namespace   tea.pm
// @match       https://*.bilibili.com/*
// @license     MIT
// @grant       none
// @version     1.0
// @author      cljnnn
// @description CNMD B站短视频。B站有太多几秒的短视频了，本脚本帮你与<1分钟的短视频说再见。任何不想被短视频分散精力的都需要这个。
// @downloadURL https://update.greasyfork.org/scripts/451562/CNMD%20B%E7%AB%99%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451562/CNMD%20B%E7%AB%99%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
function hmsToSecondsOnly(str) {
  var p = str.split(':'),
    s = 0, m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s;
}

function isVideoTooSmall(videoCard) {
  if (videoCard === null) return false;
  var duration = videoCard.querySelector("span.bili-video-card__stats__duration,span.duration")
  if (duration === null) return false;
  var seconds = hmsToSecondsOnly(duration.textContent);
  return seconds < 61;
}

function hideUnwantedCard(node, selector, condition=null) {
  let cards = [];
  for(let card of node.querySelectorAll(selector)) {
    cards.push(card)
  }
  if (node.matches(selector)) {
    cards.push(node)
  }
  
  for(let card of cards) {
    if (condition === null || condition(card))
     // card.style.visibility = "hidden";
      card.style.display = 'none';
  }
}

function handle(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  hideUnwantedCard(node, "div.bili-live-card,div.video-page-special-card-small");
  hideUnwantedCard(node, "div.video-list>div,div.recommended-card,div.bili-video-card,div.video-page-card-small", card=>isVideoTooSmall(card));  
}

function action(changes, observer) {
  for (let mutation of changes) {
    handle(mutation.target);
    for (let node of mutation.addedNodes) {
        handle(node);
    }
  }
}

var observer = new MutationObserver(action);
observer.observe(document.body, { childList: true, subtree: true });
handle(document.body);