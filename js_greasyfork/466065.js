// ==UserScript== 
// @name        Blur on inactivity
// @description Blur screen upon inactivity. This is helpful to prevent display sensitive information when you are away from screen. Inactivity time is set to 90 seconds.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.blur
// @homepageURL https://greasyfork.org/en/scripts/466065-blur-on-inactivity
// @supportURL  https://greasyfork.org/en/scripts/466065-blur-on-inactivity/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @exclude     devtools://*
// @match       *://*/*
// @version     23.06
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5al77iPPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/466065/Blur%20on%20inactivity.user.js
// @updateURL https://update.greasyfork.org/scripts/466065/Blur%20on%20inactivity.meta.js
// ==/UserScript==

// 'unset' is probably the most preferable
const originalFilter = document.body.style.filter;

window.addEventListener('keydown',event => {
  document.body.style.filter = originalFilter;
});

window.addEventListener('mousemove',event => {
  document.body.style.filter = originalFilter;
});

// Source: /questions/24338450/how-to-detect-user-inactivity-with-javascript
onInactive(90000, function () {
  //console.log('Inactivity detected');
  if (document.querySelector('video')) {
    if (document.querySelector('video').paused) {
      document.body.style.filter = 'blur(10px)';
    }
  }
});

function onInactive(ms, cb) {
  var wait = setInterval(cb, ms);
  window.ontouchstart = 
  window.ontouchmove = 
  window.onmousemove = 
  window.onmousedown = 
  window.onmouseup = 
  window.onwheel = 
  window.onscroll = 
  window.onkeydown = 
  window.onkeyup = 
  window.onfocus = 
  function () {
    //console.log('clearinterval');
    clearInterval(wait);
    wait = setInterval(cb, ms);
  };
}
