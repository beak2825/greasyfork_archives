// ==UserScript==
// YOU MUST BE USING HTTPS:// because you should be, anyway.
// @name         FetLife Image Save-As Fixer
// @namespace    https://twitter.com/ScottJFox
// @version      0.1
// @description  Allows Right Click ~> 'Save As' on FetLife images. ( by @ScottJFox )
//               Uses RegEx to grab the img.src from FetLife's source code.
// @match        https://fetlife.com/users/*/pictures/*
// @copyright    2014+, @ScottJFox
// @downloadURL https://update.greasyfork.org/scripts/27602/FetLife%20Image%20Save-As%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/27602/FetLife%20Image%20Save-As%20Fixer.meta.js
// ==/UserScript==
 
var doc = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(doc);
if (document.URL.match(/pictures\/\d+$/)) {
  doc = $('.fake_img');
  if (doc.size() == 1) {
    var img = document.createElement('img');
    var url = doc.css('background-image');
    img.src = url.substring(4, url.length - 1);
    img.height = doc.height();
    img.width = doc.width();
    var p = doc.parent();
    doc.remove();
    p.append(img);
  }
}