// ==UserScript==
// @name            leminoViwerSizeTuner
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description     Place a slider bar to adjust lemino viwer size.
// @description:ja  lemino ビューワーサイズ調整スライダーバー設置
// @version         0.6
// @match           https://lemino.docomo.ne.jp/*
// @grant           none
// @icon            https://lemino.docomo.ne.jp/assets/icons/image.png
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/533588/leminoViwerSizeTuner.user.js
// @updateURL https://update.greasyfork.org/scripts/533588/leminoViwerSizeTuner.meta.js
// ==/UserScript==

(() => {
  'use strict';
  // modalパーツのidは '*_modal'
  const REGEX_MODAL = /_modal/;
  const styleText = `
  #__next {
    z-index: 2147483646;
  }
  #slider-container {
    margin-top: 20px;
    width: 200px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 0;
    z-index:2147483647;
  }
  #size-display {
    margin-top: 10px;
    font-family: monospace;
  }`;
  const styleElem = document.createElement("style");
  styleElem.setAttribute("rel", "stylesheet");
  styleElem.textContent = styleText;
  document.head.appendChild(styleElem);
  const minScale = 0.5;
  const maxScale = 2.0;
  let baseWidth = Math.floor(window.screen.width/2.58);
  const htmltext = `
    <div id="slider-container">
      <label for="scale-slider">サイズ調整:</label>
      <input type="range" id="scale-slider" min="0.5" max="2" step="0.01" value="1">
      <div id="size-display">現在のサイズ: 200 × 150</div>
    </div>`;
  const VIDEO_SELECTOR = '[id$="_modal"] > div:nth-child(5)';

  /**
   * ビューワーサイズを更新する
   * @param {HTMLElement} video
   * @param {number} scale
   */
  function updateSize(video, scale) {
    // 制限内に収める
    scale = Math.min(Math.max(scale, minScale), maxScale);
    const newWidth = Math.round(baseWidth * scale);
    video.style.width = `${newWidth}px`;
    const currentWidth = video.clientWidth;
    const currentHeight = video.clientHeight;
    const sizeDisplay = document.getElementById('size-display');
    if (sizeDisplay) {
      sizeDisplay.textContent = `現在のサイズ: ${currentWidth} × ${currentHeight}`;
    }
  }

  /**
   * 指定したidのタグ内にビューワーサイズ調整するスライダーを配置する
   * @param {string} id - スライダーを配置するタグのid属性
   */
  const placeSlider = (id) => {
    const video = document.querySelector(VIDEO_SELECTOR);
    if (!video) return;
    const vod = document.getElementById(id);
    if (!vod) return;
    vod.insertAdjacentHTML('beforeend', htmltext);
    const slider = document.getElementById('scale-slider');
    if (!slider) return;
    // 初期表示
    updateSize(video, parseFloat(slider.value));
    slider.addEventListener('input', (e) => {
      updateSize(video, parseFloat(slider.value));
    });
    const sliderContainer = document.getElementById('slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mousedown', (e) => {
        e.stopImmediatePropagation();
      });
      sliderContainer.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
      });
    }
    const modal = document.querySelector('[id$="_modal"]');
    if (modal) {
      modal.addEventListener('dblclick', () => {
        slider.value = (slider.value === slider.max) ? slider.min : slider.max;
        updateSize(video, parseFloat(slider.value));
      });
    }
  };

  /**
   * 追加されたノードをチェックしてmodalがあればスライダーを配置
   * @param {Node} node
   */
  const checkAddedNode = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "DIV" && node.hasChildNodes()) {
        const modal = Array.prototype.find.call(node.children, (n) => n.id && n.id.match(REGEX_MODAL));
        if (modal) {
          placeSlider(modal.id);
          return;
        }
      }
      // 子要素も再帰的にチェック
      if (node.children) {
        for (const child of node.children) {
          checkAddedNode(child);
        }
      }
    }
  };

  // Proxyでラップする対象のメソッド
  const methodsToWrap = ['appendChild', 'insertBefore', 'replaceChild', 'append', 'prepend'];

  /**
   * ElementのプロトタイプメソッドをProxyでラップ
   */
  const wrapDOMMethods = () => {
    methodsToWrap.forEach(methodName => {
      const original = Element.prototype[methodName];
      if (!original) return;

      Element.prototype[methodName] = new Proxy(original, {
        apply(target, thisArg, args) {
          // 元のメソッドを実行
          const result = Reflect.apply(target, thisArg, args);

          // 追加されたノードをチェック
          if (args[0]) {
            checkAddedNode(args[0]);
          }

          return result;
        }
      });
    });
  };

  // Proxyラッピング開始
  wrapDOMMethods();

  // 既存のDOMもチェック
  const nextElement = document.getElementById('__next');
  if (nextElement) {
    checkAddedNode(nextElement);
  }
})();
