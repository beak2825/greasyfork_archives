// ==UserScript==
// @name           EvernoteCov for Jianshu
// @namespace      rexkang
// @author         rexkang
// @description    EvernoteCov for Jianshu.
// @include        https://*.jianshu.com/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/378989/EvernoteCov%20for%20Jianshu.user.js
// @updateURL https://update.greasyfork.org/scripts/378989/EvernoteCov%20for%20Jianshu.meta.js
// ==/UserScript==
var all_img = document.getElementsByTagName("img")
for (var i=0;i<all_img.length;i++)
{
if (all_img[i].src.includes('webp'))
  {
      var original_img = all_img[i].getAttribute("data-original-src");
      all_img[i].src = original_img
      console.log("webp")
      console.log(original_img)
      console.log(all_img[i].src)
  }
}