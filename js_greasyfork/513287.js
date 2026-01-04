// ==UserScript==
// @name        scroll-navigate-ogs
// @namespace   kvwu.io
// @match       https://online-go.com/demo/*
// @match       https://online-go.com/game/*
// @license     MIT
// @version     1.0
// @author      kvwu
// @description enable scrolling to navigate game on OGS
// @downloadURL https://update.greasyfork.org/scripts/513287/scroll-navigate-ogs.user.js
// @updateURL https://update.greasyfork.org/scripts/513287/scroll-navigate-ogs.meta.js
// ==/UserScript==
window.addEventListener('load', (event) => {
  function scrollNavigate(e) {
    e.preventDefault();
    const actionBar = document.getElementsByClassName('action-bar')[0];
    const controls = actionBar.getElementsByClassName('controls')[0].children;
    if (e.deltaY > 0) {
      const next = controls[4];
      next.click();
    } else if (e.deltaY < 0) {
      const prev = controls[2];
      prev.click();
    }
  }

  function setGobanContainerEvent() {
    const gobanContainers = document.getElementsByClassName('goban-container');
    if (gobanContainers.length > 0) {
      const gobanContainer = gobanContainers[0];
      gobanContainer.onwheel = scrollNavigate;
      return;
    }
    setTimeout(setGobanContainerEvent, 300);
  }

  setGobanContainerEvent();
});