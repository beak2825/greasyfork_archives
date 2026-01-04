// ==UserScript==
// @name              原神观测枢日历放大
// @version           0.1.1
// @description       原神观测枢素材活动日历放大到整屏（1920*1080）
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             https://bbs.mihoyo.com/ys/obc/?bbs_presentation_style=no_header&cal=1
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-end
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448869/%E5%8E%9F%E7%A5%9E%E8%A7%82%E6%B5%8B%E6%9E%A2%E6%97%A5%E5%8E%86%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/448869/%E5%8E%9F%E7%A5%9E%E8%A7%82%E6%B5%8B%E6%9E%A2%E6%97%A5%E5%8E%86%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
.home__map--calendar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 1920px !important;
  height: 100%;
}
.cal-pc__head-item--active {
  background-color: #f4f4f4 !important;
}
  `);

  function run() {
    setTimeout(() => {
      const cols = document.querySelectorAll(".cal-pc__row--event .cal-pc__col .cal-pc__col:not(.cal-pc__col--event)");
      for (const el of cols) {
        const w = parseFloat(el.style.width);
        if (w)
          el.style.width = `${w * 2.6041666666666665}px`;
      }
      const right = document.querySelector(".home-channel--calendar .home-channel__title .home-channel__right");
      if (!right)
        return;
      right.innerHTML = '<a href="https://bbs.mihoyo.com/ys/obc/" class="channel-more">\u66F4\u591A<span>\u5185\u5BB9</span></a>';
    }, 500);
  }
  addEventListener("load", run);
})();
