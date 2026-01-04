// ==UserScript==
// @name            Instagram: Blind Stories
// @name:ru         Instagram: Слепые Сторисы
// @namespace       ig-blind-stories.user.js
// @description     Watch user stories anonymously
// @description:ru  Смотри сторисы пользователей анонимно
// @match           https://www.instagram.com/*
// @license         WTFPL
// @version         1.0.2
// @author          askornot
// @homepageURL     https://greasyfork.org/ru/scripts/472077-instagram-blind-stories
// @supportURL      https://greasyfork.org/ru/scripts/472077-instagram-blind-stories/feedback
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/472077/Instagram%3A%20Blind%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/472077/Instagram%3A%20Blind%20Stories.meta.js
// ==/UserScript==

!(function (send, rule) {
  XMLHttpRequest.prototype.send = function () {
    const body = arguments[0];
    if (typeof body === 'string' && rule.test(body)) {
      return null;
    }
    return send.apply(this, arguments);
  };
})(
  XMLHttpRequest.prototype.send,
  new RegExp('PolarisAPIReelSeenMutation|PolarisStoriesV3SeenMutation', 'i'),
);
