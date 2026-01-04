// ==UserScript==
// @name        xiaobentong.com
// @namespace   Violentmonkey Scripts
// @match       http://xbtxbtyx.xiaobentong.com/autActivity/intoAutoStudy
// @grant       none
// @version     1.0
// @author      -
// @description 2021/7/22下午11:04:19
// @downloadURL https://update.greasyfork.org/scripts/429731/xiaobentongcom.user.js
// @updateURL https://update.greasyfork.org/scripts/429731/xiaobentongcom.meta.js
// ==/UserScript==
(function() {
  let video = document.querySelector('video');
  let ul = $('.course-con');  
  let liList = ul.find('li');
  let totalLength = liList.length;
  let timer = null;

  setTimeout(() => {
    video = document.querySelector('video');
    ul = $('.course-con');  
    liList = ul.find('li');
    totalLength = liList.length;
    init();
  }, 4000)
  function init() {
    if (!video) {
      _turnNextPage();
      return;
    }
    video.play();
    timer = setInterval(() => {
      let dT = video.duration;
      let cT = video.currentTime;
      console.log(dT, cT);
      if (cT >= dT) {
        clearInterval(timer);
        _turnNextPage();
      }
    }, 3000)
  }

  function _turnNextPage() {
    let nextIndex = getNextCurIndex();
    if (nextIndex + 1 > totalLength) {
      alert('已完成本章阅读，请选择下一章节！！！');
      return -1;
    }

    let url = $(liList[nextIndex]).find('a').attr('href');
    setTimeout(() => {
      window.location.href = url;
    },2000)
  }

  function getNextCurIndex() {
    let index = -1;
    Array.from(liList).some((v, i) => {
      if ($(v).hasClass('cur')) {
        index = i;
        return true;
      }
    })
    return ++index;
  }
})()