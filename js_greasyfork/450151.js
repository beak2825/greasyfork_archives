// ==UserScript==
// @name         xiang-video
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  湘潭学院学习网站
// @author       galan99
// @match        www2.xtdx.superchutou.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450151/xiang-video.user.js
// @updateURL https://update.greasyfork.org/scripts/450151/xiang-video.meta.js
// ==/UserScript==
 
/* 使用es6声明 */
/* jshint esversion: 6 */
 
(async function () {
  "use strict";
  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

  // 模拟人工点击 https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
  /** 
   * 使用
   * simulate(document.getElementById("btn"), "click");
   * simulate(document.getElementById("btn"), "click", { pointerX: 123, pointerY: 321 })
   *
   * */ 
  function simulate(element, eventName) {
    var eventMatchers = {
      HTMLEvents:
        /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
      MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
    };
    var defaultOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true,
    };

    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent,
      eventType = null;

    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) {
        eventType = name;
        break;
      }
    }

    if (!eventType)
      throw new SyntaxError(
        "Only HTMLEvents and MouseEvents interfaces are supported"
      );

    if (document.createEvent) {
      oEvent = document.createEvent(eventType);
      if (eventType == "HTMLEvents") {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      } else {
        oEvent.initMouseEvent(
          eventName,
          options.bubbles,
          options.cancelable,
          document.defaultView,
          options.button,
          options.pointerX,
          options.pointerY,
          options.pointerX,
          options.pointerY,
          options.ctrlKey,
          options.altKey,
          options.shiftKey,
          options.metaKey,
          options.button,
          element
        );
      }
      element.dispatchEvent(oEvent);
    } else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      var evt = document.createEventObject();
      oEvent = extend(evt, options);
      element.fireEvent("on" + eventName, oEvent);
    }
    return element;
  }

  // 方法2
  // document.getElementById('testTarget').dispatchEvent(new MouseEvent('click', {shiftKey: true}))

  // 方法3
  // Simulate human click in JavaScript https://stackoverflow.com/questions/7457603/simulate-human-click-in-javascript
  function callClickEvent(element) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    element.dispatchEvent(evt);
  }

  function callClickEvent2(element) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    element.dispatchEvent(evt);
  }

  var status = (await Notification.requestPermission()) === "granted";
  var popNotice = function () {
    if (Notification.permission == "granted") {
      var notification = new Notification("验证失败：", {
        body: "视频需要验证，请手动点击按钮进行验证",
        icon: "//image.zhangxinxu.com/image/study/s/s128/mm1.jpg",
      });
    }
  };

  async function run() {
    var code_el = document.querySelector("#SM_BTN_1");
    var slideBtn = document.querySelector(".slidetounlock");

    if (slideBtn) {
      if (status) {
        popNotice();
      }
      await sleep(1000 * 60 * 10);
    }

    if (code_el) {
      var timeNum = random(1, 5);
      await sleep(timeNum * 1000);
      simulate(code_el, "click");

      await sleep(1500);
      slideBtn = document.querySelector(".slidetounlock");

      if (slideBtn) {
        if (status) {
          popNotice();
        }
        console.log("自动验证失败，请手动验证");
        return;
      }

      console.log("自动验证成功");
      await sleep(1000 * 60 * 2);
      run();
    } else {
      await sleep(1000);
      run();
    }
  }
  run();
})();