// ==UserScript==
// @name         鼠标单击心型特效
// @namespace    /
// @version      0.1
// @description  鼠标单击心型特效，烂大街了
// @author       HackPig520
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441316/%E9%BC%A0%E6%A0%87%E5%8D%95%E5%87%BB%E5%BF%83%E5%9E%8B%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/441316/%E9%BC%A0%E6%A0%87%E5%8D%95%E5%87%BB%E5%BF%83%E5%9E%8B%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function (window, document, undefined) {
  var hearts = [];
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        setTimeout(callback, 1000 / 60);
      }
    );
  })();
  init();
  function init() {
    css(
      ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: absolute;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
    );
    attachEvent();
    gameloop();
  }
  function gameloop() {
    for (var i = 0; i < hearts.length; i++) {
      if (hearts[i].alpha <= 0) {
        document.body.removeChild(hearts[i].el);
        hearts.splice(i, 1);
        continue;
      }
      hearts[i].y--;
      hearts[i].scale += 0.004;
      hearts[i].alpha -= 0.013;
      hearts[i].el.style.cssText =
        "left:" +
        hearts[i].x +
        "px;top:" +
        hearts[i].y +
        "px;opacity:" +
        hearts[i].alpha +
        ";transform:scale(" +
        hearts[i].scale +
        "," +
        hearts[i].scale +
        ") rotate(45deg);background:" +
        hearts[i].color;
    }
    requestAnimationFrame(gameloop);
  }
  function attachEvent() {
    var old = typeof window.οnclick === "function" && window.onclick;
    window.onclick = function (event) {
      old && old();
      createHeart(event);
    };
  }
  function createHeart(event) {
    var d = document.createElement("div");
    d.className = "heart";
    hearts.push({
      el: d,
      x: event.clientX - 5,
      y: event.clientY - 5,
      scale: 1,
      alpha: 1,
      color: randomColor()
    });
    document.body.appendChild(d);
  }
  function css(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      style.styleSheet.cssText = css;
    }
    document.getElementsByTagName("head")[0].appendChild(style);
  }
  function randomColor() {
    return (
      "rgb(" +
      ~~(Math.random() * 255) +
      "," +
      ~~(Math.random() * 255) +
      "," +
      ~~(Math.random() * 255) +
      ")"
    );
  }
})(window, document);
