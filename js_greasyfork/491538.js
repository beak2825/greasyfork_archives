// ==UserScript==
// @name        隐藏千库网的未登录的蒙层,部分广告,右侧栏，并点击查看更多
// @namespace   Violentmonkey Scripts
// @match       https://588ku.com/*
// @run-at      document-body
// @grant       none
// @version     1.2
// @author      -
// @description 2024/4/9 10:58:22
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491538/%E9%9A%90%E8%97%8F%E5%8D%83%E5%BA%93%E7%BD%91%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E8%92%99%E5%B1%82%2C%E9%83%A8%E5%88%86%E5%B9%BF%E5%91%8A%2C%E5%8F%B3%E4%BE%A7%E6%A0%8F%EF%BC%8C%E5%B9%B6%E7%82%B9%E5%87%BB%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/491538/%E9%9A%90%E8%97%8F%E5%8D%83%E5%BA%93%E7%BD%91%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E8%92%99%E5%B1%82%2C%E9%83%A8%E5%88%86%E5%B9%BF%E5%91%8A%2C%E5%8F%B3%E4%BE%A7%E6%A0%8F%EF%BC%8C%E5%B9%B6%E7%82%B9%E5%87%BB%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==
(function() {
  let styleDom=document.createElement('style');
  styleDom.append(
    `
      .down-limit{
        display:none !important;
      }
      .mask-outside-box{
        display:none !important;
      }
      .detail-top-ad{
        display:none !important;
      }
      .right-side{
        display:none !important;
      }
      .no-login-show-20240109{
        display:none !important;
      }
    `
  );
  document.querySelector('head').appendChild(styleDom);
})();
let interval=setInterval(()=>{
  if(document.querySelector('.open-btn')){
    setTimeout(()=>{
       document.querySelector('.open-btn').click();
    },200);
    clearInterval(interval);
  }
},100);

