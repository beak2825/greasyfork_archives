// ==UserScript==
// @name         网页_自动显示播放时长
// @namespace    http://tampermonkey.net/
// @version      2024-05-236
// @description  gogogo
// @author       You
// @match        https://noodlemagazine.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495882/%E7%BD%91%E9%A1%B5_%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/495882/%E7%BD%91%E9%A1%B5_%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var btn_base_top = 20;

  var video       = null;
  var display_div = null;


  function create_div_label____无绑定事件(btn_label) {
    /**
     * @type {HTMLDivElement}
     */
    const div = document.createElement('div');
    (() => {
      div.style.position = 'fixed';
      div.style.left     = '20px';
      btn_base_top += 40;
      div.style.top   = `${btn_base_top}px`;
    })();
    (() => {
      div.innerText        = btn_label;
      div.style.zIndex     = '99999';
      div.style.background = '#00000088';
    })();
    (() => {
      div.style.fontSize = '10px';
    })();
    document.body.appendChild(div);
    return div;
  }


  function formatVideoTime(millisecond) {
    let seconds = Math.round(millisecond / 1000);
    let result  = [];
    let count   = 2;
    while (count >= 0) {
      let current = Math.floor(seconds / (60 ** count));
      result.push(current);
      seconds -= current * (60 ** count);
      --count;
    }
    return result.map(item => item <= 9 ? `0${item}` : item).join(':');
  }

  /**
   *
   * @param {HTMLElement} fullscreen_e
   * @param {HTMLElement} other_e
   */
  function _始终悬浮_全屏元素上(fullscreen_e,other_e){
    fullscreen_e.addEventListener("fullscreenchange", event => {
      if (document.fullscreenElement) {
        fullscreen_e.appendChild(other_e);
      } else {
        fullscreen_e.parentNode.insertBefore(other_e,fullscreen_e.nextSibling)
      }
    });
  }

  setInterval(() => {
    if (!display_div) {
      display_div = create_div_label____无绑定事件('等待播放');
    }

    if (!video) {
      //监听播放时间
      video = document.querySelector('video.jw-video.jw-reset');
      video.parentNode.insertBefore(display_div,video.nextSibling);
      //使用事件监听方式捕捉事件
      video.addEventListener('timeupdate', function () {
        let timeDisplay;
        //用秒数来显示当前播放进度
        timeDisplay           = Math.floor(video.currentTime /*秒数*/);
        display_div.innerText = formatVideoTime(timeDisplay * 1000);
      }, false);
    }
  }, 1_000);

})();
