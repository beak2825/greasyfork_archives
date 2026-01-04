// ==UserScript==
// @name        Youtube社区帖子图片无裁剪完全显示
// @namespace   8a6eedc4-a4eb-451e-b853-d37f12a9e183
// @include     https://www.youtube.com/*/community*
// @grant       朋也
// @version     1.3
// @author      -
// @description 4/8/2025
// @run-at document-end
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/532214/Youtube%E7%A4%BE%E5%8C%BA%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E6%97%A0%E8%A3%81%E5%89%AA%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532214/Youtube%E7%A4%BE%E5%8C%BA%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E6%97%A0%E8%A3%81%E5%89%AA%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function(){
  setInterval(function() {
    let imgs = document.querySelectorAll("#img");
    if (imgs) {
      for (let i = 0; i< imgs.length;i++){
        let imgsrc = imgs[i].getAttribute("src");
        if (imgsrc && imgsrc.indexOf("-c-fcrop64=") > -1) {
          var matchResult = imgsrc.match(/(\S*=s)\d*-c-fcrop64=*/);
          if (matchResult) {
            var value = matchResult[1] + "0";
            imgs[i].setAttribute("src", value);
          }
        }
      }
    }
  },100);
})();