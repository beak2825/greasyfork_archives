// ==UserScript==
// @name         优化组卷网图片质量
// @namespace    zujuan.xkw.com
// @version      0.2
// @description  优化组卷网图片质量，从低质量图片和公式转为高质量的图片和svg格式公式
// @author       5dbwat4
// @match        https://zujuan.xkw.com/*
// @connect      https://zjappserver.xkw.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xkw.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483043/%E4%BC%98%E5%8C%96%E7%BB%84%E5%8D%B7%E7%BD%91%E5%9B%BE%E7%89%87%E8%B4%A8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/483043/%E4%BC%98%E5%8C%96%E7%BB%84%E5%8D%B7%E7%BD%91%E5%9B%BE%E7%89%87%E8%B4%A8%E9%87%8F.meta.js
// ==/UserScript==

function normalize_q(dom) {
    const ool = dom

    ool.querySelectorAll("img").forEach(v => {
        if (v.src.includes("/formula/")) {
            v.src = v.src.replace(".png", ".svg")
        }
        if (v.src.includes("/dksih/")) {
            let tmp = /\?resizew=(\d*)/.exec(v.src)
            if (tmp.length != 0) {
                v.style.width = tmp[1] + "px"
                v.src = v.src.replace(/\?resizew=(\d*)/, "")
                v.setAttribute("width", tmp[1])
            }
        }
    })
}

const exec00=()=>{
    document.querySelectorAll(".tk-quest-item").forEach((v) => {
        normalize_q(v)
    })
}

const bindEventListener = function(type) {
   const historyEvent = history[type];
   return function() {
       const newEvent = historyEvent.apply(this, arguments);
      const e = new Event(type);
       e.arguments = arguments;
       window.dispatchEvent(e);
       return newEvent;
   };
};
history.pushState = bindEventListener('pushState');
history.replaceState = bindEventListener('replaceState');
window.addEventListener('replaceState', function(e) {
  console.log('THEY DID IT AGAIN! replaceState');
    setTimeout(()=>{
        exec00()
    },500)

});
window.addEventListener('pushState', function(e) {
  console.log('THEY DID IT AGAIN! pushState');
    exec00()
});

exec00()