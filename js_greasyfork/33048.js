// ==UserScript==
// @name        Fastpic
// @description Automatically opens full resolution picture on fastpic.ru
// @namespace   karasiq
// @include     http://fastpic.ru/*
// @include     https://fastpic.ru/*
// @version     1
// @grant       none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/33048/Fastpic.user.js
// @updateURL https://update.greasyfork.org/scripts/33048/Fastpic.meta.js
// ==/UserScript==

function fastpicOpenBigPicture() {
  var fullImgSrc = document.getElementById("image").parentElement.href;
  if (fullImgSrc) {
    /* var imgElement = document.createElement("img");
    imgElement.src = fullImgSrc;
    document.body.innerHTML = "";
    document.body.appendChild(imgElement); */
    document.location.replace(fullImgSrc);
  }
}

fastpicOpenBigPicture();