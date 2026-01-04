// ==UserScript==
// @name         【OrgasmSoundLibrary音频网站】Sound自动播放
// @namespace    http://tampermonkey.net/
// @version      2024-03-17
// @description  a quick script
// @author       You
// @match        https://orgasmsoundlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orgasmsoundlibrary.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489741/%E3%80%90OrgasmSoundLibrary%E9%9F%B3%E9%A2%91%E7%BD%91%E7%AB%99%E3%80%91Sound%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489741/%E3%80%90OrgasmSoundLibrary%E9%9F%B3%E9%A2%91%E7%BD%91%E7%AB%99%E3%80%91Sound%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Your code here...

  function _单次检查() {


    /**
     *
     * @type {HTMLDivElement}
     */
      // const _剩余时间 = document.querySelector(`div[id^="wPlayer"] > div.clock.countDown`);
    const _剩余时间 = [...document.querySelectorAll(`div[id^="wPlayer"] > div.clock.countDown`)].reverse()[0];    // 取最后一个。

    /**
     *
     * @type {SVGElement}
     */
    const svg_play = document.querySelector('#viewer_player_table > div.superPlayerButtons > svg.playPauseBT');
    const is_播放中   = svg_play && svg_play.classList.contains('playing');

    const _mobile_svg_play_必须手动触发 = document.querySelector(`#viewer_art_container > figure.iOS_playBT`);

    if (_mobile_svg_play_必须手动触发) {
      _mobile_svg_play_必须手动触发.dispatchEvent(new Event('touchend'));   // 模拟触屏操作。
    } else if (_剩余时间 && _剩余时间.innerText === '0:00') {   // 首先，检查是否已播放完。
      console.log('尝试点击，下一首');
      /**
       *
       * @type {SVGElement}
       */
      const svg_下一首 = document.querySelector('#viewer_player_table > div.superPlayerButtons > svg.nextPlayerBT');
      // 参考资料：javascript - SVG - click is not a function - Stack Overflow    https://stackoverflow.com/questions/39712905/svg-click-is-not-a-function
      svg_下一首 && svg_下一首.dispatchEvent(new Event('click'));
    } else if (!is_播放中) {             // 如果并非【单曲播放完】，但【处在暂停状态】。则视为第一次，马上进行播放。
      console.log('尝试，直接原地播放。');
      svg_play && svg_play.dispatchEvent(new Event('click'));
    }


  }

  setInterval(() => {
    console.log('进行检查一次');
    try {
      _单次检查();
    } catch (e) {
      console.error(e);
    }
  }, 500);


})();
