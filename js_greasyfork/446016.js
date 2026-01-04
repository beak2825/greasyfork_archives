// ==UserScript==
// @name        隐藏百度首页昵称
// @namespace   hbybyyang
// @match       https://www.baidu.com/
// @match       https://www.baidu.com/s
// @grant       none
// @version     1.5
// @license MIT
// @description 2022/6/5 12:16:12
// @downloadURL https://update.greasyfork.org/scripts/446016/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%98%B5%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/446016/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%98%B5%E7%A7%B0.meta.js
// ==/UserScript==

var Y = function (s) {
  return s(s);
};

var counter = 0;
var counterMax = 100;
var end = false;
var timeOutH = null;

var getName = function () {
  return document.querySelector(
    "#s-top-username > span.user-name.c-font-normal.c-color-t"
  );
};
var getName2 = function () {
  return document.querySelector("#user > span.s-top-username");
};

function setNone(dom) {
  dom.style.display = "none";
  end = true;
}

function main() {
  counter = 0;
  clearTimeout(timeOutH);
  var path = window.location.pathname;
  if (path == "/s") {
    Y(function (s) {
      counter++;
      if (counter > counterMax) return;

      var c = getName2();
      if (c != null) setNone(c);
      if (end == false)
        timeOutH = setTimeout(function () {
          s(s);
        }, 0);
    });
  } else {
    Y(function (s) {
      counter++;
      if (counter > counterMax) return;

      var c = getName();
      if (c != null) setNone(c);
      if (end == false)
        timeOutH = setTimeout(function () {
          s(s);
        }, 0);
    });
  }
}
main();

// 监听全部ajax请求
// http://blog.ttionya.com/article-1511.html
(function () {
  function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, { detail: this });
    window.dispatchEvent(ajaxEvent);
  }

  var oldXHR = window.XMLHttpRequest;

  function newXHR() {
    var realXHR = new oldXHR();
    realXHR.addEventListener(
      "abort",
      function () {
        ajaxEventTrigger.call(this, "ajaxAbort");
      },
      false
    );
    realXHR.addEventListener(
      "error",
      function () {
        ajaxEventTrigger.call(this, "ajaxError");
      },
      false
    );
    realXHR.addEventListener(
      "load",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoad");
      },
      false
    );
    realXHR.addEventListener(
      "loadstart",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoadStart");
      },
      false
    );
    realXHR.addEventListener(
      "progress",
      function () {
        ajaxEventTrigger.call(this, "ajaxProgress");
      },
      false
    );
    realXHR.addEventListener(
      "timeout",
      function () {
        ajaxEventTrigger.call(this, "ajaxTimeout");
      },
      false
    );
    realXHR.addEventListener(
      "loadend",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoadEnd");
      },
      false
    );
    realXHR.addEventListener(
      "readystatechange",
      function () {
        ajaxEventTrigger.call(this, "ajaxReadyStateChange");
      },
      false
    );
    return realXHR;
  }

  window.XMLHttpRequest = newXHR;
})();

window.addEventListener("ajaxReadyStateChange", function (e) {
  main();
});
