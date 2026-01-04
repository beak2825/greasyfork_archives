// ==UserScript==
// @name         YouTube Shorts Autoscroll (experimental)
// @version      1.0
// @description  Scrolls in YT Shorts automatically after a video finished
// @author       Venipa <admin@venipa.net>
// @match        *://www.youtube.com/shorts/*
// @require      https://unpkg.com/loglevel/dist/loglevel.min.js
// @run-at       document-idle
// @license MIT
// @namespace https://venipa.net
// @downloadURL https://update.greasyfork.org/scripts/461304/YouTube%20Shorts%20Autoscroll%20%28experimental%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461304/YouTube%20Shorts%20Autoscroll%20%28experimental%29.meta.js
// ==/UserScript==
(function (log) {
  'use strict';
  function ensureDomLoaded(f) {
    if (["interactive", "complete"].indexOf(document.readyState) > -1) {
      f()
    }
    else {
      let triggered = false
      document.addEventListener("DOMContentLoaded", () => {
        if (!triggered) {
          triggered = true
          setTimeout(f, 1)
        }
      })
    }
  }
  function awaitElement(q, f, timeout, parent) {
    return ensureDomLoaded(() => {
      let t = setInterval(() => {
        let e = (parent || document).querySelector(q)
        if (e) {
          f(e)
          clearInterval(t)
        }
      }, 10)
      setInterval(() => clearInterval(t), timeout || 30000)
    })
  }
  log.setLevel("debug");
  const ELEMENTS = {
    SHORTS_ROOT: () => document.getElementById('shorts-container'),
    SHORTS_NEXT: () => document.getElementById('navigation-button-down'),
    VIDEO: (parent) => parent.querySelector('.html5-video-container > video')
  }

  let lastHook;
  let lastId;
  /**
   * @this {HTMLVideoElement}
   */
  function hookPlayerEnded() {
    let el = ELEMENTS.SHORTS_NEXT();
    if (!el || !(el = el.querySelector("button"))) return;
    if (typeof lastHook === "function") lastHook();
    el.click();
    log.debug("short ended");
  }
  /**
   * @this {HTMLVideoElement}
   */
  function hookPlayerStarted() {
    if (this.hasAttribute("loop")) this.removeAttribute("loop");
    element.style.zIndex = "9999";
    element.style.position = "relative";
  }
  function getCurrentId() {
    return location.pathname.match(/shorts\/(\w+)/)[1];
  }
  /**
   *
   * @param {HTMLVideoElement} element
   */
  function hookPlayer(element) {
    lastId = getCurrentId();
    element.removeEventListener("ended", hookPlayerEnded);
    element.removeEventListener("play", hookPlayerStarted);
    element.addEventListener("ended", hookPlayerEnded);
    element.addEventListener("playing", hookPlayerStarted);
    hookPlayerStarted.bind(element)();
    setTimeout(() => {
      hookPlayerStarted.bind(element)();
    }, 1000);

    log.debug("hook added");
    return function () {

      element.removeEventListener("ended", hookPlayerEnded);
      element.removeEventListener("play", hookPlayerStarted);
      log.debug("hook removed");
      lastHook = null;
      lastId = null;
    }
  }
  const dmut = new MutationObserver(([item]) => {
    if (!item.target) return;
    /**
     * @type {HTMLElement}
     */
    const playerContainer = item.target;
    const hasVideoContained = playerContainer.id === "shorts-player" || playerContainer.classList.contains("html5-video-player") || (playerContainer.id === "player-container" && Array.from(item.removedNodes).find(d => d.id === "player"));
    if (hasVideoContained) {
      awaitElement("video", (video) => {
        if (!video) return;
        if (!lastHook || (!lastId || getCurrentId() != lastId)) {
          if (typeof lastHook === "function") lastHook();
          lastHook = hookPlayer(video)
        }
        log.debug(item);
      }, 1000, playerContainer)
    }
  });
  awaitElement('#shorts-player', () => {
    dmut.observe(ELEMENTS.SHORTS_ROOT(), {
      subtree: true,
      childList: true
    })
    log.debug("init");
  })
})(log.noConflict().getLogger("ytshorts-scroller"));