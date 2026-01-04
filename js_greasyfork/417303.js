// ==UserScript==
// @namespace yunyuyuan
// @name 隐藏知乎登录框&链接无缝跳转
// @description 隐藏烦人的知乎登录框，点击链接直接跳转不会提示有风险(谨慎操作)
// @match *://*.zhihu.com/*
// @version 0.0.1.20201202053300
// @downloadURL https://update.greasyfork.org/scripts/417303/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86%E9%93%BE%E6%8E%A5%E6%97%A0%E7%BC%9D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/417303/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86%E9%93%BE%E6%8E%A5%E6%97%A0%E7%BC%9D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function (){
  'use strict';
    const style = document.createElement("style");
    style.innerHTML = "html{overflow: auto !important}.Modal-enter-done{display: none !important}";
    document.head.appendChild(style);
    // link.zhihu.com
    document.addEventListener('click', (e)=>{
      let now = e.target;
      while (now) {
        if (now.tagName.toLowerCase() === 'a' && now.hasAttribute('href')) {
          checkIsZhihuLink(now.getAttribute('href'), e);
        }
        now = now.parentElement;
      }
    })
    const checkIsZhihuLink = (s, e)=> {
      const matcher = s.match(/https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/);
      if (matcher) {
        e.stopPropagation();
        e.preventDefault();
        window.open(decodeURIComponent(matcher[1]));
      }
    }
})()
