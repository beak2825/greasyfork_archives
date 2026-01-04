// ==UserScript==
// @name         Bili Better Inner Video Player
// @namespace    http://tampermonkey.net/
// @version      2025/05/08
// @description  更好的视频预览
// @author       xcatp
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534605/Bili%20Better%20Inner%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/534605/Bili%20Better%20Inner%20Video%20Player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let _interval = setInterval(() => {

    if (document.querySelector('.feed-card') != null) {

      SetZIndex();
      BetterProgress();

      BetterInnerVideoPlayer();
      BetterLayout();

      TriggerWhenRefresh();
      clearInterval(_interval);
    }

  }, 200);

  function BetterLayout() {
    //#region 头部导航条
    document.querySelector('.vip-wrap').style.display = 'none';
    document.querySelector('.download-entry').style.display = 'none';
    //#endregion

    //#region 左侧轮播
    document.querySelector('.carousel-footer-mask').style.display = 'none';
    document.querySelector('.carousel').style.background = 'white';
    let arrows = document.querySelector('.carousel-arrows')
    arrows.style.background = 'black';
    arrows.style.borderRadius = '0 0 4px 0';
    arrows.style.position = 'absolute'
    arrows.style.bottom = '57px'
    arrows.style.height = '25px'
    arrows.style.right = '0'
    let dots = document.querySelector('.carousel-dots')
    dots.style.padding = '4px'
    dots.style.bottom = '82px'
    dots.style.left = '0'
    let title = document.querySelector('.carousel-footer-text')
    title.style.bottom = '57px'
    title.style.left = '0'
    title.style.background = 'black'
    title.style.borderRadius = '0 0 0 4px'
    title.style.height = '25px'
    //#endregion
  }

  function RemoveAD() {
    let feeds = document.getElementsByClassName('feed-card');
    for (let i = 0; i < feeds.length; i++) {
      let firstChild = feeds[i].firstElementChild;
      if (!firstChild.classList.contains('enable-no-interest')) { // 广告卡片没有此类名
        feeds[i].remove();
      }
    }
  }

  function BetterInnerVideoPlayer() {
    RemoveAD()
    let innerVideoPlayers = document.getElementsByClassName('bili-video-card__cover');

    for (let i = 0; i < innerVideoPlayers.length && i < 6; i++) { // 只修改前六个

      innerVideoPlayers[i].style.zIndex = 0;
      innerVideoPlayers[i].style.transition = 'transform 0.3s ease-in-out';

      // innerVideoPlayers[i].previousElementSibling.style.display = 'none'; // hide the WATCH LATER button
      const sibling = innerVideoPlayers[i].nextElementSibling;
      // sibling.style.transform = 'scale(1.05)'
      sibling.style.position = 'fixed'
      sibling.style.top = '265px'
      sibling.style.left = '15px'
      sibling.style.width = '576px'
      sibling.style.height = '324px'
      sibling.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.8)'
      sibling.style.borderRadius = 0
    }
  }

  function TriggerWhenRefresh() {
    document.querySelector('.roll-btn').addEventListener('click', () => {
      setTimeout(() => {
        SetZIndex();
        BetterProgress();
        BetterInnerVideoPlayer();
      }, 1000);
    });
  }

  function SetZIndex() {
    document.querySelector('.feed-roll-btn').style.zIndex = 0;
    document.querySelector('.palette-button-outer').style.zIndex = 0;
  }

  function BetterProgress() {
    let progress = document.getElementsByClassName('bili-video-card__progress')

    for (let i = 0; i < progress.length; i++) {
      progress[i].style.bottom = '-10px'
      progress[i].style.right = '-10px'
      progress[i].style.opacity = '.5'
    }
  }

})();


