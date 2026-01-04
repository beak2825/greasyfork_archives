// ==UserScript==
// @name             Instagram Show More Posts
// @namespace   tuktuk3103@gmail.com
// @description   Auto Clicks Instagram Show More Posts Button
// @include          *://*.instagram.com/*
// @version          1.01
// @grant              none
// @icon                https://www.google.com/s2/favicons?domain=instagram.com
// @downloadURL https://update.greasyfork.org/scripts/417578/Instagram%20Show%20More%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/417578/Instagram%20Show%20More%20Posts.meta.js
// ==/UserScript==

window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      document.querySelector('.w5S7h.z4xUb.qq7_A.tCibT').dispatchEvent(evt);
    }
};