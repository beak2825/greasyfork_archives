// ==UserScript==
// @name                New Tab Image Zoom
// @name:zh-CN          新标签页图片缩放
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @version             1.0.1
// @description         Allows the image opened in the new tab to zoom independently without affecting the original page
// @description:zh-CN   允许在新标签页中打开的图片独立缩放，而不影响原网页
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://*/*
// @compatible          chrome
// @compatible          firefox
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428283/New%20Tab%20Image%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/428283/New%20Tab%20Image%20Zoom.meta.js
// ==/UserScript==

(function () {
  'use strict';
  class Picture {
    constructor(imgObj, shortcuts = false) {
      this.imgObj = imgObj;
      this.imgSrc = imgObj.src;
      this.shortcuts = shortcuts;
      this.wrapper = null;
      this.tip = null;
      this.ratio = 1;
      this.width = 0;
      this.height = 0;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.init();
    }
    sleep(ms, callback) {
      setTimeout(() => {
        console.info(ms / 1000 + ' second later.');
        if (typeof callback === 'function') {
          callback();
        }
      }, ms);
    }
    resetImgUrl(maxErrorNum) {
      if (maxErrorNum > 0) {
        this.imgObj.onerror = () => {
          console.warn('Image load error: ' + this.imgSrc + '\nReset count: ' + (12 - maxErrorNum));
          this.resetImgUrl(maxErrorNum - 1);
        };
        this.sleep(500, () => {
          this.imgObj.src = this.imgSrc;
        });
      } else {
        this.imgObj.onerror = null;
      }
    }
    tips() {
      const tip = document.createElement('div');
      tip.className = 'new-tab-image-zoom-tips';
      tip.title = 'Left-Click: Restore the original size(100%).\nRight-Click: Adapt to window size.';
      tip.addEventListener('click', event => {
        event.stopPropagation();
        this.restore();
      });
      tip.addEventListener('contextmenu', event => {
        event.preventDefault();
        this.adapt();
      });
      this.tip = tip;
      this.setTips();
      this.observer();
    }
    setTips() {
      if (this.tip) {
        this.tip.textContent = Math.round(this.ratio * 100) + '%';
      }
    }
    observer() {
      const ob = new ResizeObserver(() => {
        this.handler();
      });
      ob.observe(this.imgObj);
    }
    wrap() {
      this.tips();
      const wrapDiv = document.createElement('div');
      wrapDiv.className = 'new-tab-image-zoom-wrapper';
      document.body.insertBefore(wrapDiv, this.imgObj);
      document.body.removeChild(this.imgObj);
      wrapDiv.appendChild(this.imgObj);
      this.tip && wrapDiv.appendChild(this.tip);
      wrapDiv.addEventListener('wheel', event => {
        if (event.ctrlKey) {
          event.preventDefault();
          if (event.wheelDelta > 0) {
            this.zoomIn(0.1);
          } else if (event.wheelDelta < 0) {
            this.zoomOut(0.1);
          }
          return false;
        }
      });
      this.wrapper = wrapDiv;
    }
    handler() {
      this.width = this.imgObj.width || 0;
      this.height = this.imgObj.height || 0;
      this.naturalWidth = this.imgObj.naturalWidth || 0;
      this.naturalHeight = this.imgObj.naturalHeight || 0;
      if (this.width > 0 && this.height > 0 && this.naturalWidth > 0 && this.naturalHeight > 0) {
        this.ratio = this.width / this.naturalWidth || this.height / this.naturalHeight;
        this.setTips();
      }
    }
    init() {
      this.wrap();
      this.imgObj.classList.add('new-tab-image-zoom-image');
      if (this.imgObj.complete) {
        this.handler();
      } else {
        this.imgObj.onload = () => {
          this.handler();
        };
        this.imgObj.onerror = () => {
          console.warn('Image load error: ' + this.src + '\nReset count: 1');
          this.resetImgUrl(10);
        };
      }
      if (this.shortcuts) {
        document.onkeydown = e => {
          const ev = e || window.event;
          const eKeyCode = ev.keycode || ev.which || ev.charCode;
          const eCtrl = ev.ctrlKey || ev.metaKey;
          const eAlt = ev.altKey;
          if (eKeyCode === 187 && eCtrl) {
            e.preventDefault();
            this.zoomIn();
            return false;
          }
          if (eKeyCode === 189 && eCtrl) {
            e.preventDefault();
            this.zoomOut();
            return false;
          }
          if (eKeyCode === 48 && eCtrl && eAlt) {
            e.preventDefault();
            this.restore();
            return false;
          }
          if (eKeyCode === 48 && eCtrl) {
            e.preventDefault();
            this.adapt();
            return false;
          }
        };
      }
    }
    zoom() {
      this.imgObj.width = this.naturalWidth * this.ratio;
      this.imgObj.height = this.naturalHeight * this.ratio;
    }
    zoomIn(ratio = 0.1) {
      this.ratio += ratio;
      this.zoom();
    }
    zoomOut(ratio = 0.1) {
      if (this.ratio > ratio) {
        this.ratio -= ratio;
        this.zoom();
      }
    }
    restore() {
      this.ratio = 1;
      this.zoom();
    }
    adapt() {
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      if (this.naturalWidth / this.naturalHeight >= this.innerWidth / this.innerHeight) {
        this.ratio = this.innerWidth / this.naturalWidth;
      } else {
        this.ratio = this.innerHeight / this.naturalHeight;
      }
      this.zoom();
    }
  }
  if (document.body.children.length === 1 && document.body.children[0].nodeName === 'IMG') {
    const zoomStyle = `
        .new-tab-image-zoom-wrapper {
          display: flex;
          background-color: #0e0e0e;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        .new-tab-image-zoom-image {
          margin: auto;
        }
        .new-tab-image-zoom-tips {
          position: fixed;
          z-index: 99;
          top: 1vh;
          right: 1vw;
          padding: 3px 6px;
          text-align: center;
          color: #eeeeee;
          font-size: 14px;
          line-height: 1;
          background-color: #666666;
          border: 1px solid #333333;
          box-shadow: 1px 1px 2px #030303;
          border-radius: 5px;
          box-sizing: border-box;
          overflow: hidden;
          user-select: none;
          cursor: pointer;
        }
        .new-tab-image-zoom-tips:hover {
          color: #449a46;
          background-color: #f0f9eb;
          border: 1px solid #d6e9c6;
        }
      `;
    GM_addStyle(zoomStyle);
    const { shortcuts } = GM_getValue('newTabConfig', { shortcuts: false });
    const _picture = new Picture(document.body.children[0], shortcuts);
    GM_registerMenuCommand(`Keyboard shortcuts [${shortcuts ? 'Enabled' : 'Disabled'}]`, () => {
      GM_setValue('newTabConfig', {
        shortcuts: !shortcuts,
      });
      location.reload();
    });
  }
})();
