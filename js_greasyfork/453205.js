// ==UserScript==
// @name            更换腾讯文档背景颜色
// @namespace       https://palerock.cn
// @version         1.0.1
// @description     如题
// @include         https://docs.qq.com/doc/*
// @author          Cangshi
// @license         GPL-3.0-or-later
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/453205/%E6%9B%B4%E6%8D%A2%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/453205/%E6%9B%B4%E6%8D%A2%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    var isDOMLoaded = false;
    var waitLoadList = [];
    var style = null; // 向head注入样式

    function injectStyle(css) {
      var style = document.createElement('style');
      style.innerHTML = css; // @ts-ignore

      style.name = 'injected-style';
      document.head.appendChild(style);
      return style;
    } // 取消样式注入


    function removeStyle(style) {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    } // 获取文档id
    // example: https://docs.qq.com/doc/DWlpNenVmR25DQmhU => DWlpNenVmR25DQmhU


    function getDocId() {
      var match = window.location.href.match(/docs\.qq\.com\/doc\/([A-Za-z0-9]+)/);
      return match ? match[1] : null;
    } // 更新脚本样式


    function updateStyle(params) {
      if (!params.backgroundColor) {
        // 读取保存的 params
        params = Object.assign(params, JSON.parse(localStorage.getItem(getDocId()) || '{}')); // 自动改变hash值

        window.location.hash = params.backgroundColor;
        return;
      }

      if (style) {
        removeStyle(style);
      }

      style = injectStyle("\n        canvas.melo-page-main-view {\n            background-color: ".concat(params.backgroundColor, ";\n        }\n    ")); // 保存文档id和params

      localStorage.setItem(getDocId(), JSON.stringify(params));
    } // 监听url的hash改变


    window.addEventListener('hashchange', function () {
      // 更新样式
      updateStyle({
        backgroundColor: location.hash.replace('#', '')
      });
    });

    function onBodyLoad(cb) {
      if (isDOMLoaded) {
        cb();
        return;
      }

      if (waitLoadList.length == 0) {
        document.addEventListener('readystatechange', function () {
          if (document.readyState === 'interactive' || document.readyState === 'complete') {
            waitLoadList = waitLoadList.filter(function (cb) {
              if (typeof cb === 'function' && !isDOMLoaded) {
                cb(undefined);
              }

              return false;
            });
            isDOMLoaded = true;
          }
        });
      }

      waitLoadList.push(cb);
    } // 当html页面加载完成时


    onBodyLoad(function () {
      updateStyle({
        backgroundColor: location.hash.replace('#', '')
      });
    });

})));
