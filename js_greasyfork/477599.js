// ==UserScript==
// @name         江苏教师教育自动播放
// @namespace    https://greasyfork.org/zh-CN/users/1198037-gavin0x0
// @version      1.1
// @description  自动静音+自动播放+跳过打卡
// @license      MIT
// @author       Gavin
// @match        https://jste.lexiangla.com/classes/*/courses/*
// @match        https://lexiangla.com/classes/*/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477599/%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477599/%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function () {
  ('use strict');

  var interval = 5 * 60 * 1000;

  function dispatchClickEvent(element) {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
  }

  function checkButton() {
    const playButton = document.querySelector('.vjs-big-play-button');
    const muteButton = document.querySelector('.vjs-mute-control');
    if (playButton && muteButton) {
      dispatchClickEvent(muteButton);
      setTimeout(() => {
        dispatchClickEvent(playButton);
        console.log('click it');
      }, 1000);
    }
  }

  function refreshPage() {
    location.reload();
  }

  function checkAndRefresh() {
    var buttons = document.getElementsByClassName(
      'btn btn-primary btn-lg js-submit',
    );
    if (buttons.length > 0) {
      refreshPage();
    } else {
      console.log('safe');
    }
  }

  setTimeout(() => {
    checkButton();
  }, 3000);
  setInterval(refreshPage, interval);
  setInterval(checkAndRefresh, 1000);
})();
