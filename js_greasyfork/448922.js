// ==UserScript==
// @name             Yande.re
// @namespace   tuktuk3103@gmail.com
// @description   High Resolution Images
// @include          https://yande.re/post/show/*
// @version          1
// @grant              none
// @icon                https://yande.re/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/448922/Yandere.user.js
// @updateURL https://update.greasyfork.org/scripts/448922/Yandere.meta.js
// ==/UserScript==

document.getElementById("resized_notice").remove();

var sImg = document.getElementById("image");

if(sImg.src.includes("/sample/")){

  var oImg = document.getElementById("png");

  if(oImg)
  {
    sImg.src = oImg.href;
  } else {
    var highresImg = document.getElementById("highres");
    sImg.src = highresImg.href;
  }

}