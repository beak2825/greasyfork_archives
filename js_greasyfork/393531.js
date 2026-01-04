// ==UserScript==
// @name         广告过滤，纯净上网
// @namespace    sg_dog_document
// @version      1.0.1
// @description  好网站，要共享
// @author       xxoo
// @include      *://0xxxkk.com/*
// @include      *://xxxkk0.com/*
// @include      *://1xxxkk.com/*
// @include      *://xxxkk1.com/*
// @include      *://2xxxkk.com/*
// @include      *://xxxkk2.com/*
// @include      *://3xxxkk.com/*
// @include      *://xxxkk3.com/*
// @include      *://4xxxkk.com/*
// @include      *://xxxkk4.com/*
// @include      *://5xxxkk.com/*
// @include      *://xxxkk5.com/*
// @include      *://6xxxkk.com/*
// @include      *://xxxkk6.com/*
// @include      *://7xxxkk.com/*
// @include      *://xxxkk7.com/*
// @include      *://8xxxkk.com/*
// @include      *://xxxkk8.com/*
// @include      *://9xxxkk.com/*
// @include      *://xxxkk9.com/*
// @include      *://0xxxnn.com/*
// @include      *://xxxnn0.com/*
// @include      *://1xxxnn.com/*
// @include      *://xxxnn1.com/*
// @include      *://2xxxnn.com/*
// @include      *://xxxnn2.com/*
// @include      *://3xxxnn.com/*
// @include      *://xxxnn3.com/*
// @include      *://4xxxnn.com/*
// @include      *://xxxnn4.com/*
// @include      *://5xxxnn.com/*
// @include      *://xxxnn5.com/*
// @include      *://6xxxnn.com/*
// @include      *://xxxnn6.com/*
// @include      *://7xxxnn.com/*
// @include      *://xxxnn7.com/*
// @include      *://8xxxnn.com/*
// @include      *://xxxnn8.com/*
// @include      *://9xxxnn.com/*
// @include      *://xxxnn9.com/*
// @include      *://0xxxaa.com/*
// @include      *://xxxaa0.com/*
// @include      *://1xxxaa.com/*
// @include      *://xxxaa1.com/*
// @include      *://2xxxaa.com/*
// @include      *://xxxaa2.com/*
// @include      *://3xxxaa.com/*
// @include      *://xxxaa3.com/*
// @include      *://4xxxaa.com/*
// @include      *://xxxaa4.com/*
// @include      *://5xxxaa.com/*
// @include      *://xxxaa5.com/*
// @include      *://6xxxaa.com/*
// @include      *://xxxaa6.com/*
// @include      *://7xxxaa.com/*
// @include      *://xxxaa7.com/*
// @include      *://8xxxaa.com/*
// @include      *://xxxaa8.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393531/%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%EF%BC%8C%E7%BA%AF%E5%87%80%E4%B8%8A%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/393531/%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%EF%BC%8C%E7%BA%AF%E5%87%80%E4%B8%8A%E7%BD%91.meta.js
// ==/UserScript==

(function(){
  'use strict';
  var de = document.getElementById("content");
  if (de) {
  for(var i=0; i<de.childElementCount; i++){
    var x=de.children[i];
    if (["body","header"].indexOf(x.id)==-1) x.hidden=true;
  }}else{
    var aa = document.getElementsByTagName('h2')[2];
    var ss = aa.innerText;
    var bb = document.getElementsByTagName('input')[0];
    bb.value = ss;
    var cc = document.getElementsByTagName('button')[0];
    cc.click();
  }
})();
