// ==UserScript==
// @name           YouTube Shorts Seeking
// @name:ar        التحكم في الفيديوهات القصيرة في يوتيوب
// @namespace      http://tampermonkey.net/
// @version        0.2
// @description    30 seconds duration video or so does not mean you do not miss something, why you need to wait till the end and repeat it to hit what you missed, seek with you keyboard arrows just like watching any youtube video!
// @description:ar مقطع فيديو بمدة 30 ثانية لا يعني أنك لا تفقد بعض اللقطات منه، لماذا عليك الإنتظار لنهاية الفيديو ومن ثم إعادة المقطع لتشاهد ما فاتك، تحكم الآن بأسهم لوحة المفاتيح بأى مقطع قصير باليوتيوب!
// @author         Mahmoud Khudairi
// @author:ar      محمود خضيري
// @match          https://www.youtube.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/475216/YouTube%20Shorts%20Seeking.user.js
// @updateURL https://update.greasyfork.org/scripts/475216/YouTube%20Shorts%20Seeking.meta.js
// ==/UserScript==

(function() {

  "use strict";

  top.addEventListener("keydown", function (e) {

  const target = document.querySelector("ytd-reel-video-renderer[is-active] video");

  if (!target) return;

  if (e.code === "ArrowLeft") {

    target.currentTime -= 5;

    return;

  }

  if (e.code === "ArrowRight") {

    target.currentTime += 5;

    return;

  }

  const digitMatch = e.code.match(/^(?:Digit|Numpad)(\d)$/);

  if (digitMatch) target.currentTime = +digitMatch[1] / 10 * target.duration

  });

})();