// ==UserScript==
// @name         党课自动点击
// @namespace    None
// @version      1.0
// @description  进入课程页面后自动观看并自动切换
// @author       Your Name
// @match        *://*.edu.cn/*/play*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464355/%E5%85%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/464355/%E5%85%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let next= setInterval(function(){
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a") && document.querySelector("#video").currentTime == document.querySelector("#video").duration ){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
            clearInterval(next)
            document.querySelector(" ul > li.video_red1").nextElementSibling.firstElementChild.click()
        }
    },200)

  var eventsToDisable = ["visibilitychange", "webkitvisibilitychange", "blur"];
  for (var i = 0; i < eventsToDisable.length; i++) {
    window.addEventListener(eventsToDisable[i], function(event) {
      event.stopImmediatePropagation();
    }, true);
  }

  function click_continue() {
    var btn = document.querySelector('.public_btn .public_submit');
    if (btn) {
      btn.click();
    } else {
      console.log('Could not find "Continue" button.');
    }
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        click_continue();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
