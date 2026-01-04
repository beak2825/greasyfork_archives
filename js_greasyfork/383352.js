// ==UserScript==
// @name        Gradescope Speed Grader
// @author      DickyT
// @license     WTFPL
// @encoding    utf-8
// @date        05/21/2019
// @modified    05/21/2019
// @include     https://gradescope.com/*
// @run-at      document-end
// @version     0.0.1
// @description Gradescope speed grader, internal use only
// @namespace   dkt.gdspe.speed
// @require     https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/383352/Gradescope%20Speed%20Grader.user.js
// @updateURL https://update.greasyfork.org/scripts/383352/Gradescope%20Speed%20Grader.meta.js
// ==/UserScript==

(() => {
  const eventFire = (el, etype) => {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  window.nextBtn = document.querySelector('#main-content > div > main > section > ul > li:nth-child(5) > a');
  window.evt = (e) => {
    if (window.usePlugin) {
      const key = e.keyCode || e.charCode;
        if (key >= 48 && key <= 57) {
          setTimeout(() => {
            eventFire(nextBtn, 'click');
          }, 0);
        }
    }
  }

  window.addEventListener('keyup', window.evt);
  window.usePlugin = true;
})();
