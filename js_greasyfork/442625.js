// ==UserScript==
// @name         测测你的眼睛对色差的辨识度 - 作弊工具
// @namespace    https://greasyfork.org/zh-CN/users/822325-mininb666
// @version      0.1
// @description  测测你的眼睛对色差的辨识度作弊工具(http://www.cuishuai.cc/game/)
// @author       mininb666 https://greasyfork.org/zh-CN/users/822325-mininb666
// @match        *://www.cuishuai.cc/game/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442625/%E6%B5%8B%E6%B5%8B%E4%BD%A0%E7%9A%84%E7%9C%BC%E7%9D%9B%E5%AF%B9%E8%89%B2%E5%B7%AE%E7%9A%84%E8%BE%A8%E8%AF%86%E5%BA%A6%20-%20%E4%BD%9C%E5%BC%8A%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442625/%E6%B5%8B%E6%B5%8B%E4%BD%A0%E7%9A%84%E7%9C%BC%E7%9D%9B%E5%AF%B9%E8%89%B2%E5%B7%AE%E7%9A%84%E8%BE%A8%E8%AF%86%E5%BA%A6%20-%20%E4%BD%9C%E5%BC%8A%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function hhhhh(){
    var aaa=document.querySelectorAll("#box > *")[1].style.cssText;
    document.querySelectorAll("#box > *").forEach(e=>{if(e.style.cssText!=aaa){e.click()}});
    aaa=document.querySelectorAll("#box > *")[0].style.cssText
    document.querySelectorAll("#box > *").forEach(e=>{if(e.style.cssText!=aaa){e.click()}})
  }
  document.querySelector(".play-btn").onclick=()=>{var bbb=setInterval(hhhhh,5);setTimeout(()=>{clearInterval(bbb)},61000)}
})();