// ==UserScript==
// @name         找请求
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       聪哥
// @match        http*://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/36102/%E6%89%BE%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/36102/%E6%89%BE%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==


 (function () {
      var common = (function () {
        var arr = [];
        var getAllResponse = function () {
          common.AjaxListen(function (e) {
            var data = e.detail;
            if (data.readyState == 4) {// 4 = "loaded"
              if (data.status == 200) {// 200 = OK
                var content = data.responseText;
                var url = data.responseURL;
                arr.push({
                  url: url,
                  content: content
                });
              }
            }
          });
        },
          serach = function (compare) {
            for (var i = 0; i < arr.length; i++) {
              var content = arr[i].content;
              var isbool = content.indexOf(compare);
              if (isbool > -1) {
                console.log(arr[i].url);
              }
            }
          },
          KeyboardListen = function () {
            window.addEventListener("keydown", function (e) {
              if (e.which == 33) {
                var compare = prompt();
                common.serach(compare);
              }
            }, false);
          },
          AjaxListen = function (callback) {
            ; (function () {
              if (typeof window.CustomEvent === "function") return false;

              function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
              }

              CustomEvent.prototype = window.Event.prototype;

              window.CustomEvent = CustomEvent;
            })();
            ; (function () {
              function ajaxEventTrigger(event) {
                var ajaxEvent = new CustomEvent(event, { detail: this });
                window.dispatchEvent(ajaxEvent);
              }

              var oldXHR = window.XMLHttpRequest;

              function newXHR() {
                var realXHR = new oldXHR();

                realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

                realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

                realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);

                realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);

                realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

                realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);

                realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

                realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

                return realXHR;
              }

              window.XMLHttpRequest = newXHR;
            })();
            window.addEventListener('ajaxReadyStateChange', callback);
          };
        return {
          getAllResponse: getAllResponse,
          serach: serach,
          KeyboardListen: KeyboardListen,
          AjaxListen: AjaxListen
        };
      })();
      //获取指定URL数据源
      common.getAllResponse();
      //监听PgUp按下事件
      common.KeyboardListen();
    })();