// ==UserScript==
// @name        知识星球图片助手
// @namespace   ZSXQ_IMAGE_PANEL
// @match       https://wx.zsxq.com/dweb2*
// @grant       none
// @version     1.4
// @author      linying
// @run-at      document-end
// @description 2020/3/1
// @downloadURL https://update.greasyfork.org/scripts/397214/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397214/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  // 图片创建
  class ImagesFactory {
    constructor() {
      this._createElements();
    }

    // 获取新建的图片元素
    get elements() {
      return this._elements;
    }

    // 根据已显示内容克隆图片
    _createElements() {
      var imgElements = document.querySelector('.topic-detail > .content').querySelector('app-image-gallery');
      if (!imgElements) return;

      this._elements = imgElements.cloneNode(true);
      var oldImgs = imgElements.querySelectorAll('.image-container > img');
      var newImgs = this._elements.querySelectorAll('.image-container > img');

      for (var i = 0; i < newImgs.length; i++) {
        this._createEvent(oldImgs[i], newImgs[i]);
        this._addIndex(newImgs[i], i + 1);
      }
    }
    
    _createEvent(oldEl, newEl) {
      newEl.addEventListener('click', function(ev) {
        oldEl.dispatchEvent(new Event('click', {bubbles: true, cancelable: true}));

        ev.stopPropagation();
      });
    }

    // 给每张图片添加索引标记
    _addIndex(img, index) {
      var el = document.createElement('div');
      el.innerHTML = index.toString();
      this._setIndexStyle(el);
      img.parentNode.appendChild(el);
      img.parentNode.style.position = 'relative';
    }

    // 设置图片索引的样式
    _setIndexStyle(el) {
      var style = el.style;
      style.position = 'absolute';
      style.left = '2px';
      style.top = '2px';
      style.color = 'white';
      style.background = 'red';
      style.width = '20px';
      style.height = '20px';
      style.lineHeight = '18px';
      style.borderRadius = '10px';
      style.textAlign = 'center';
    }
  }

  // 图片面板
  class Panel {
    // 创建图片面板
    static create() {
      var factory = new ImagesFactory();
      var newImgEls = factory.elements;
      if (!newImgEls) return;

      var el = document.querySelector('.topic-detail');
      this.element = document.createElement('div');
      this.element.appendChild(newImgEls);
      el.appendChild(this.element);
      this._setPanelStyle(this.element);
    }

    // 销毁图片面板
    static destroy() {
      if (!this.element) return;

      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }

    // 设置图片面板样式
    static _setPanelStyle(el) {
      var contentElement = document.querySelector('.topic-detail > .content');
      var left = contentElement.offsetLeft + contentElement.offsetWidth;
      var top = contentElement.offsetTop;

      if (document.querySelector('.enter-group > .group-name > span')) {
        left += 60;
      }

      el.style.position = 'fixed';
      el.style.left = left + 10 + 'px';
      el.style.top = top + 'px';
      el.style.padding = '0px 10px';
      el.style.borderRadius = '4px';
      el.style.background = '#fff';
    }
  }

  class ElementMonitor {
    constructor(findFunc) {
      this._findFunc = findFunc;
      this._hasEl = false;
      this._timer = null;
    }

    change(func) {
      this._change = func;
    }

    start() {
      if (this._timer) return;

      this._timer = setInterval(() => {
        let result = this._findFunc();
        if (result) {
          if (this._hasEl) return;

          this._hasEl = true;
          this._change(result);
        } else {
          if (!this._hasEl) return;

          this._hasEl = false;
          this._change(null);
        }
      }, 200);
    }

    stop() {
      if (!this._timer) return;

      clearInterval(this._timer);
      this._timer = null;
    }
  }

  let monitor = new ElementMonitor(() => {
    return document.querySelector('.topic-detail > .content');
  });
  monitor.change((el) => {
    if (el) {
      Panel.create();
    } else {
      Panel.destroy();
    }
  });
  monitor.start();
})();
