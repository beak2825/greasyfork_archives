// ==UserScript==
// @name         新浪博客显示全宽原图
// @version      0.3
// @namespace    https://github.com/fangj
// @description   read blog.sina.com.cn with full width image
// @author       fangj
// @match        https://blog.sina.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465973/%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E6%98%BE%E7%A4%BA%E5%85%A8%E5%AE%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465973/%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E6%98%BE%E7%A4%BA%E5%85%A8%E5%AE%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function enlargeimage() {
    console.log("sina ad remove work!")
    document.addEventListener('DOMSubtreeModified', function (event) {
      try {
        let ad = document.getElementById("container");


        if (ad) {
          ad.remove()
        }



        document.getElementById("column_2").style.width = "100%";
        document.getElementById("column_2").style.margin = "0";
        document.getElementById("sinablogbody").style.width = "100%";
        document.getElementsByClassName("articalContent")[0].style.width = "100%";


        let imgs = document.querySelectorAll("a>img");
        let aimgs = Array.from(imgs).filter(d => d.className == "");
        aimgs.forEach(img => {
          let link = img.parentNode.href;
          console.log(link)
          if (img.src !== link) {
            img.src = link
            img.removeAttribute("height")
            img.removeAttribute("width")
          }

        })
      } catch (error) {
        console.error(error);
      }
    }, true);
  }
  enlargeimage();
  window.enlargeimage = enlargeimage;




})();