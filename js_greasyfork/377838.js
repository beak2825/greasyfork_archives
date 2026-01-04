// ==UserScript==
// @name           Transfer webp to jpg in douban
// @namespace      duanyu
// @author         duanyu
// @description    Transfer webp to jpg in douban. Evernote cannot display webp format pic.
// @include        https://*.douban.com/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/377838/Transfer%20webp%20to%20jpg%20in%20douban.user.js
// @updateURL https://update.greasyfork.org/scripts/377838/Transfer%20webp%20to%20jpg%20in%20douban.meta.js
// ==/UserScript==
var all_img = document.getElementsByTagName("img")
for (var i=0;i<all_img.length;i++)
{
if (all_img[i].src.includes('.webp'))
  {
  all_img[i].src = all_img[i].src.slice(0,-4) + 'jpg'
  console.log("webp")
  }
}