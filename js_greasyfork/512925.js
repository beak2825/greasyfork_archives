// ==UserScript==
// @name         微信快讯跳转
// @namespace    https://viayoo.com/
// @version      1.0
// @description  用一种不太靠谱的方法添加点击跳转
// @author       Lemon399
// @license      Unlicense
// @run-at       document-idle
// @match        https://bc.weixin.qq.com/mp/recommendtag?scene=169&hotnewsfeed=1&tag_type=24&sn=LwIlJimRAnCxm-xyr3sYyNd5xyo&tag=%E5%BF%AB%E8%AE%AF&msg_type=1
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512925/%E5%BE%AE%E4%BF%A1%E5%BF%AB%E8%AE%AF%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512925/%E5%BE%AE%E4%BF%A1%E5%BF%AB%E8%AE%AF%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jump = "";
    const olog = console.log;
    console.log = (...p) => {
      olog(...p);
      if (typeof p[0] == "string" && p[0].includes("reportjson:") && p[1]?.jumpUrl) {
        jump = p[1].jumpUrl;
      }
    }
    document.querySelectorAll(".swiper-slide.hotnewsfeed_card_context").forEach((card) => {
      card.addEventListener("click", () => {
        location.assign(jump);
      });
    });
})();