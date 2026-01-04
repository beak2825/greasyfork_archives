// ==UserScript==
// @name         Bilibili Skip Op
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to skip opening (125s)
// @author       zaypen
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/425345/Bilibili%20Skip%20Op.user.js
// @updateURL https://update.greasyfork.org/scripts/425345/Bilibili%20Skip%20Op.meta.js
// ==/UserScript==

var buttonIcon = '<span class="bp-svgicon" style="transform: rotate(270deg);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_152"><rect width="28" height="28" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_152)"><g transform="matrix(0.27545198798179626,0,0,0.27545198798179626,20.918554306030273,14.090568542480469)" opacity="0.01972654897568944" style="display: none;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z"></path></g></g><g transform="matrix(0.7177568674087524,0,0,0.7177568674087524,22.743228912353516,14)" opacity="0.061999332655133944" style="display: none;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z"></path></g></g><g style="display: block;" transform="matrix(1,0,0,1,14,14)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M0 0"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d="M0 0"></path></g><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z"></path></g></g></g></svg></span>';

var retry = function (fn, interval, times) {
  try {
    fn();
  } catch (e) {
    console.warn(e);
    times && setTimeout(function () {
      retry(fn, interval, times--);
    }, interval);
  }
};

var createElement = function (className) {
  var element = document.createElement('div');
  element.className = className;
  return element;
};

var createButton = function (className, innerHTML, onClick) {
  var button = document.createElement('button');
  button.className = className;
  button.innerHTML = innerHTML;
  button.onclick = onClick;
  return button;
};

var init = function () {
  if (player.isInitialized()) {
    var playButton = document.querySelector('#bilibiliPlayer .bilibili-player-area .bilibili-player-video-control .bilibili-player-video-btn-start');
    var skipButton = createButton('bilibili-player-iconfont', buttonIcon, function () {
      return player.seek(player.getCurrentTime() + 125);
    });
    var buttonWrap = createElement('bilibili-player-video-btn');
    buttonWrap.append(skipButton);
    playButton.insertAdjacentElement('afterend', buttonWrap);
  } else {
    throw new Error('Failed loading skip button');
  }
};

retry(init, 1000, 10);