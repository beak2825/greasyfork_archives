// ==UserScript==
// @name         Instagram Download
// @namespace    null
// @version      1.0
// @description  Download instagram image and video
// @author       tgxh
// @match        *.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367895/Instagram%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/367895/Instagram%20Download.meta.js
// ==/UserScript==

;(function () {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const map = new WeakMap();
  const internal = key => {
    if (!map.has(key)) map.set(key, {});
    return map.get(key);
  };

  let _this;

  function throttle(fn, interval) {
    let timeBefore = null;
    return () => {
      const timeNow = Date.now();
      if (timeBefore === null) timeBefore = timeNow;
      if (timeNow - timeBefore > interval) {
        timeBefore = timeNow;
        fn.apply(this, arguments);
      }
    };
  }

  function findWrap(selector = 'div[role="button"]') {
    return Array.from($$(selector)).filter(div => {
      const img = div.querySelector('img');
      const video = div.querySelector('video');
      const hasImgOrVideo = img && img.getAttribute('srcset') || video;
      return !div.querySelector(selector) && hasImgOrVideo;
    });
  }

  class Instagram {
    constructor(options) {
      const defaults = {
        delay: 200,
      };
      this.setting = Object.assign({}, defaults, options);
      this.delay = this.setting.delay;
      this.body = $('body');
      this.init();
      _this = internal(this);
      _this.render = throttle.call(this, this.animate, this.delay);
    }

    init() {
      this.observer(this.body);
      this.addStyles();
    }

    addStyles() {
      const headEle = $('head'),
        style = document.createElement('style'),
        styleText = `
          .hover-img:hover .download-btn {
          opacity: 1;
          }
          .download-btn {
          position: absolute;
          top: 50px;
          right: 50px;
          width: 40px;
          height: 40px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF4mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wMS0yMlQwMDoyNDoyOCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDEtMjJUMDA6MzIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDEtMjJUMDA6MzIrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjRmMjA5YjAtZDcwNC01MzRiLWEzZmYtMzExZDVkMzIyMTJkIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MjFmM2E2NzctOGQyYy1jZTQxLTg4MTMtMDlhY2I4NDMyZTc3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MGMzMmZjMDItZTBhZS01MjQ1LTk4YjktMzhiYTAwZTEyMWI1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYzMyZmMwMi1lMGFlLTUyNDUtOThiOS0zOGJhMDBlMTIxYjUiIHN0RXZ0OndoZW49IjIwMTgtMDEtMjJUMDA6MjQ6MjgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY0ZjIwOWIwLWQ3MDQtNTM0Yi1hM2ZmLTMxMWQ1ZDMyMjEyZCIgc3RFdnQ6d2hlbj0iMjAxOC0wMS0yMlQwMDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6RBZmNAAANpklEQVRYhaWYe7BdVX3HP+uxX+ece29ubm4eN7mJgdyGQIQIxJLY8BQowkhbEJuMdhTaDiCjFeurSu1YpqNFpaOj2FJHp4i2TuOjQlAg1RBFEyKCEI088uAmCEnOzX2dc/ZrrV//2DfnQhGr9DezZ+1Zs3/r91nftdZvr7XU+zbu4oWmgAxDx1icUhRonFI4pbvfeEChEiWy1iBrNLIhwC+zXupGPNZLy3g5YMVtD8U/Ejj3UOzLTuQdUemIXUnicmJXEjlH4DyhcwSu5H+bfUnNy5gAgkIhF2jYZMVdaPHD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');
          transition: opacity .3s;
          opacity: 0;
          z-index: 99;
          }`;
      style.innerHTML = styleText;
      headEle.append(style);
    }

    observer(ele) {
      const config = {
        attributes: true,
        childList: true,
        subtree: true,
      };
      const observer = new MutationObserver(mutations => {
        _this.render();
      });
      observer.observe(ele, config);
    }

    animate() {
      const wraps = findWrap();
      wraps.forEach(wrap => {
        if (wrap.querySelector(`.${this.setting.btnClass}`)) return;
        wrap.parentNode.classList.add('hover-img');
        const video = wrap.querySelector('video');
        const img = Array.from(wrap.querySelectorAll('img')).filter(img => img.getAttribute('srcset'))[0];
        if (video) {
          this.downloadVideo(wrap, video);
        } else if (img) {
          this.downloadImage(wrap, img);
        }
      });
    }

    downloadImage(wrap, img = {}) {
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        let href = srcset.split(',').pop();
        href = href.slice(0, href.indexOf(' '));
        this.addBtn(wrap, href);
      }
    }

    downloadVideo(wrap, video) {
      const src = video.getAttribute('src');
      if (src) {
        this.addBtn(wrap, src);
      }
    }

    addBtn(wrap, href) {
      const btn = wrap.querySelector(`.${this.setting.btnClass}`);
      if (btn) {
        wrap.removeChild(btn);
      }
      const ele = document.createElement('a');
      ele.classList.add(this.setting.btnClass);
      ele.setAttribute('href', href);
      ele.setAttribute('target', '_blank');
      ele.setAttribute('download', '');
      wrap.append(ele);
    }
  }

  window.insIntance = new Instagram({
    delay: 100,
    btnClass: 'download-btn',
  });
})();
