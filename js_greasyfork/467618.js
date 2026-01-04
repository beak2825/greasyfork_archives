// ==UserScript==
// @name         damai_slide_mobile_mine
// @version      1.2.1
// @description  大麦滑块自动滑动自用
// @author       None
// @namespace    damai_slide_mine
// @include      /[a-zA-z]+://[^\s]*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467618/damai_slide_mobile_mine.user.js
// @updateURL https://update.greasyfork.org/scripts/467618/damai_slide_mobile_mine.meta.js
// ==/UserScript==

(function () {
  "use strict";

  Object.defineProperty(navigator, "webdriver", {
    get: () => undefined,
  });
  /**
   * 休眠
   * @param time    休眠时间，单位秒
   * @param desc
   * @returns {Promise<unknown>}
   */
  function sleep(time, desc = "sleep") {
    return new Promise((resolve) => {
      //sleep
      setTimeout(() => {
        console.log(desc, time, "s");
        resolve(time);
      }, Math.floor(time * 1000));
    });
  }
  /**
   * 监测节点是否存在
   * @param selector    CSS选择器
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsHas(selector, desc = "has") {
    return new Promise((resolve) => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector);
        if (!!target) {
          clearInterval(timer);
          console.log(desc, selector);
          resolve(selector);
        } else {
          return;
        }
      }, 100);
    });
  }
  function handle(id) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date();
      const targetDate = new Date("2023-06-10");

      if (currentDate > targetDate) {
        resolve();
        return;
      }

      var slider = document.getElementById(id),
        container = slider.parentNode;

      var rect = slider.getBoundingClientRect(),
        x0 = rect.x || rect.left,
        y0 = rect.y || rect.top,
        w = container.getBoundingClientRect().width,
        x1 = x0 + w,
        y1 = y0 + rect.height + 10; // 在验证码下方偏移10像素

      var duration = Math.floor(Math.random() * 500) + 800; // 持续时间为200ms到1000ms随机
      var startTime = null;
      var offsetY = 0;
      var offsetYMax = Math.floor(rect.height * 1.5); // y 轴最大偏移量为验证码高度的1.5倍
      var shouldRegress = false; // 是否进行回退

      function animate(timestamp) {
        if (!startTime) {
          startTime = timestamp;
        }

        var progress = timestamp - startTime;
        var percent = Math.min(progress / duration, 1);

        var currentPosition = interpolate(x0, x1, percent);
        var jitterX = Math.random() * 6 - 3; // 随机生成-3到3的 x 轴偏移量
        var jitterY = Math.random() * 2 + 1; // 随机生成1到3的 y 轴偏移量

        if (shouldRegress) {
          currentPosition -= jitterX; // 回退时 x 轴方向反向移动
        } else {
          currentPosition += jitterX;
        }

        offsetY += jitterY;

        var currentPositionY = y0 + offsetY;

        var touchmove = new TouchEvent("touchmove", {
          bubbles: true,
          cancelable: true,
          view: window,
          touches: [
            new Touch({
              identifier: 1,
              target: slider,
              clientX: currentPosition,
              clientY: currentPositionY,
              screenX: currentPosition,
              screenY: currentPositionY,
            }),
          ],
          changedTouches: [
            new Touch({
              identifier: 1,
              target: slider,
              clientX: currentPosition,
              clientY: currentPositionY,
              screenX: currentPosition,
              screenY: currentPositionY,
            }),
          ],
        });
        slider.dispatchEvent(touchmove);

        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          // 动画结束时创建触摸屏结束事件
          var touchend = new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [
              new Touch({
                identifier: 1,
                target: slider,
                clientX: currentPosition,
                clientY: currentPositionY,
                screenX: currentPosition,
                screenY: currentPositionY,
              }),
            ],
            changedTouches: [
              new Touch({
                identifier: 1,
                target: slider,
                clientX: currentPosition,
                clientY: currentPositionY,
                screenX: currentPosition,
                screenY: currentPositionY,
              }),
            ],
          });
          slider.dispatchEvent(touchend);
          resolve();
        }

        // 控制回退的条件和频率
        if (
          Math.random() < 0.1 &&
          !shouldRegress &&
          percent > 0.4 &&
          percent < 0.8
        ) {
          shouldRegress = true;
        }
      }

      var touchstart = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        view: window,
        touches: [
          new Touch({
            identifier: 1,
            target: slider,
            clientX: x0,
            clientY: y0,
            screenX: x0,
            screenY: y0,
          }),
        ],
        changedTouches: [
          new Touch({
            identifier: 1,
            target: slider,
            clientX: x0,
            clientY: y0,
            screenX: x0,
            screenY: y0,
          }),
        ],
      });
      slider.dispatchEvent(touchstart);

      requestAnimationFrame(animate);
    });
  }

  function interpolate(start, end, percent) {
    return start + (end - start) * easeOutQuart(percent);
  }

  function easeOutQuart(t) {
    t--;
    return 1 - Math.pow(t, 4);
  }

  sleep(0.2)
    .then(() => obsHas(".nc_wrapper"))
    .then(() => obsHas(".warnning-text"))
    .then(() => handle("nc_1_n1z"))
    .then(() => window.parent.postMessage("", "*"));
})();
