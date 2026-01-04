// ==UserScript==
// @name         中控OA去水印
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  去除页面水印，修改下载按钮为去水印下载。
// @author       大魔法师Kuku
// @match        https://oa.supcon.com/spa/document/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/407541/%E4%B8%AD%E6%8E%A7OA%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407541/%E4%B8%AD%E6%8E%A7OA%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findNodeByContent(text, root = document.body) {
      let treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

      let nodeList = [];

      while (treeWalker.nextNode()) {
        let node = treeWalker.currentNode;

        if (node.nodeType === Node.TEXT_NODE && node.textContent === text) {
          nodeList.push(node.parentNode);
        }
      };

      return nodeList;
    }

    function hookButton() {
      let span = findNodeByContent('下 载').shift();
      if (span) {
        let btn = span.parentNode;
        span.textContent = "无水印下载";
        btn.onclick = function (e) {
          //阻止事件继续冒泡
          //e.stopPropagation();
        }
      }
      else {
        setTimeout(hookButton, 500);
      }
    }

    function waitDom(id, callback) {
      let element = document.getElementById(id);
      if (element) {
        callback(element);
      }
      else {
        setTimeout(waitDom, 500, id, callback);
      }
    }

    function removeDom(element) {
      document.body.removeChild(element);
    }

    function findStr(str1, str2) {
      return str1.indexOf(str2) != -1;
    }

    //Hook一些主要的方法
    function hook(callback) {
      function call(e) {
        if (callback) {
          return callback(e);
        }
      }

      let add = document.addEventListener;
      let remove = document.removeEventListener;
      document.addEventListener = function (type, listener, options) {
        let cancel = call({ type, listener, options });
        if (!cancel) {
          add(type, listener, options);
        }
      };

      document.removeEventListener = function (type, listener, options) {
        remove(type, listener, options);
      }

      let set = window.setInterval;
      window.setInterval = function (handler, timeout) {
        let cancel = call({ handler, timeout });
        if (!cancel) {
          set(handler, timeout)
        }
      }

      let open = window.open;
      window.open = function (URL, name, specs, replace) {
        let result = call({ URL, name, specs, replace });
        if (!result.cancel) {
          open(result.URL || URL, result.name || name, result.specs || specs, result.replace || replace);
        }
      }

      Object.defineProperty(window, "onresize", {
        set: (val) => {
          //禁止onresize赋值
        },
        configurable: true
      })

      //返回还原方法
      let unHook = () => {
        document.addEventListener = add;
        document.removeEventListener = remove;
        window.setInterval = set;
        window.open = open;
        delete window.onresize;
      }

      return unHook;
    }

    //先Hook关键函数
    let unHook = hook((e) => {
      //说明是addEventListener
      if (e.type) {
        if (e.type === 'click') {
          if (findStr(e.listener.toString(), "e.checkChange()&&e.update()")) {
            //取消该方法的执行
            return true;
          }
        } else if (e.type === 'hashchange') {
          return true;
        }
      }
      //说明是setInterval
      else if (e.handler) {
        if (findStr(e.handler.toString(), "e.handleClick()")) {
          return true;
        }
      }
      //说明是window.open
      else if (e.URL) {
        if (findStr(e.URL, "FileDownload")) {
          e.URL += "&frompdfview=1";
        }
        return { cancel: false, URL: e.URL };
      }
    });

    //等待这个DOM加载完成
    let id = "wea_watremark_wrap";
    waitDom(id, function (element) {
      hookButton();
      removeDom(element);
      /*setInterval(() => {
        let element = document.getElementById(id);
        if(element){
        removeDom(element);
        }
      }, 1000);*/
    });
  })();