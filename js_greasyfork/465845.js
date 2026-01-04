// ==UserScript==
// @name         s1mini
// @namespace    https://bbs.saraba1st.com/
// @version      1.93
// @description  for s1
// @author       ghostintheshell
// @match        https://bbs.saraba1st.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465845/s1mini.user.js
// @updateURL https://update.greasyfork.org/scripts/465845/s1mini.meta.js
// ==/UserScript==
(function () {
  var commentImages = document.querySelectorAll('.zoom');
  commentImages.forEach(function(node) {
    node.style.maxWidth = '110px';
    node.style.height = 'auto';
  })
  var pls = document.querySelectorAll('.pls');
  pls.forEach(function (node) {
    node.style.transition = 'width 0.1s';
  });
  var favatar = document.querySelectorAll('.pls.favatar');
  favatar.forEach(function (node) {
    node.style.height = '100px';
    node.style.overflow = 'hidden';
  });
  var fsz = document.querySelectorAll('.t_fsz');
  fsz.forEach(function (node) {
    node.style.minHeight = '0px';
  });
  var avtm = document.querySelectorAll('.avtm');
  avtm.forEach(function (node) {
    node.style.width = '50px';
  });
  var avatars = document.querySelectorAll('.avtm img');
  avatars.forEach(function (node) {
    node.style.width = '50px';
  });
  var pbtn = document.querySelectorAll('#p_btn');
  pbtn.forEach(function (node) {
    node.style.padding = '0px';
    node.style.marginTop = '0px';
    node.style.marginBottom = '0px';
  });
  var plcs = document.querySelectorAll('.authicn.vm, .sign');
  plcs.forEach(function (node) {
    node.style.display = 'none';
  });
  var auth = document.querySelectorAll('.pti .authi, .pti .authi a, .xg1, .xg1 a');
  auth.forEach(function (node) {
    node.style.setProperty('color', '#C0C4CC', 'important');
  });
  var vwmy = document.querySelector('.vwmy');
  vwmy.style.display = 'none';
})();