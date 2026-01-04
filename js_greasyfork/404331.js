// ==UserScript==
// @name        解除网页“禁用复制”
// @namespace   https://blog.bgme.me
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
// @run-at      document-idle
// @version     1.1.0
// @author      bgme
// @description 解除网页“禁用复制”限制
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @icon        https://github.githubassets.com/images/icons/emoji/unicode/1f33f.png
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/404331/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E2%80%9C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/404331/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E2%80%9C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E2%80%9D.meta.js
// ==/UserScript==

"use strict";

GM.registerMenuCommand("解除复制限制", run);

function run() {
  celery(document);
}

// 来自：https://github.com/yulanggong/celery/blob/master/celery.js
function celery(doc) {
  // uglify 优化
  var parentNode = "parentNode";
  var replaceChild = "replaceChild";
  var innerHTML = "innerHTML";
  var documentElement = "documentElement";
  var createElement = "createElement";
  var forEach = "forEach";
  var _script = "script";
  var events = "contextmenu dragstart selectstart select copy beforecopy mouseup mousedown".split(
    " "
  );

  function noop() {}

  function remove(element) {
    element[parentNode].removeChild(element);
  }

  function query(selecter) {
    return [].slice.call(doc.querySelectorAll(selecter));
  }

  function strip(element) {
    events[forEach](function (event) {
      // 移除 DOM 0 事件
      element["on" + event] = null;
    });
    var done;

    function deep() {
      _setTimeout(function () {
        if (!done) {
          try {
            var contentDocument = element.contentDocument;
            if (contentDocument.body.childNodes.length) {
              done = 1;
              celery(contentDocument);
            }
          } catch (e) {
            done = 0;
          }
        }
      }, 100);
    }

    deep();
    element.onload = deep;
  }

  // 清空所有定时器
  for (var i = setTimeout(noop, 0); i >= 0; i--) {
    clearTimeout(i);
  }
  for (i = setInterval(noop, 1e8); i >= 0; i--) {
    clearInterval(i);
  }

  var _setTimeout = setTimeout;

  // 覆盖掉延时方法
  setTimeout = setInterval = noop;

  // 通过替换 DOM 的方式移除节点上的监听事件
  query(_script)[forEach](remove);

  // frame 不能通过 innerHTML 完全重建，缓存起来
  var frames = [];
  query("iframe,frame")[forEach](function (frame) {
    frames.push(frame);
    frame[parentNode][replaceChild](doc[createElement](_script), frame);
  });

  var old = doc[documentElement][innerHTML];
  doc.open();
  doc.write("<!DOCTYPE html>");
  doc.close();
  doc[documentElement][innerHTML] = old;

  // 替换回 frame
  query(_script)[forEach](function (script) {
    script[parentNode][replaceChild](frames.shift(), script);
  });

  query("*")[forEach](strip);
  strip(doc);

  events[forEach](function (event) {
    // 阻止事件传播
    doc.addEventListener(
      event,
      function (e) {
        e.stopPropagation();
      },
      true
    );
  });

  // 移除通过样式禁用选择
  var style = doc[createElement]("style");
  style[innerHTML] =
    "*{-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important;}";
  doc.body.appendChild(style);
}
