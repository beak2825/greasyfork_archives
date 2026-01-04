// ==UserScript==
// @name         屏蔽百度搜索广告与右侧推广
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       iceFish
// @match        *://*.baidu.com/*
// @include      *://*.baidu.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392862/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E4%B8%8E%E5%8F%B3%E4%BE%A7%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/392862/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E4%B8%8E%E5%8F%B3%E4%BE%A7%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...

  //监听ajax加载完成事件，搜索、点击下一页时触发事件
  window.addEventListener('ajaxLoadEnd', function (e) {
    //删除右侧推广
    removeOne('#content_right');
    //删除标准广告
    remove('#content_left>div', 'span[data-tuiguang]')
    //删除二次广告
    setTimeout(() => {
        remove('#content_left>div', 'span[class="m ec_tuiguang_pplink"]')
      },
      2000)
  });

  //自定义Ajax事件
  (function () {
    function ajaxEventTrigger(event) {
      let ajaxEvent = new CustomEvent(event, {detail: this});
      window.dispatchEvent(ajaxEvent);
    }

    let oldXHR = window.XMLHttpRequest;

    function newXHR() {
      let realXHR = new oldXHR();
      //监听ajax加载完成事件
      realXHR.addEventListener('loadend', () => {
        ajaxEventTrigger.call(this, 'ajaxLoadEnd');
      }, false);

      return realXHR;
    }

    window.XMLHttpRequest = newXHR;
  })();

  function removeOne(query) {
    let right = document.querySelector(query)
    if (right) {
      right.remove()
    }
  }

  //删除后代中含有childs节点的祖先节点
  function remove(nodes, childs) {
    nodes = document.querySelectorAll(nodes)
    childs = document.querySelectorAll(childs)
    let count = 0;
    nodes.forEach((node) => {
      if (node.contains(childs[count])) {
        count++
        node.remove()
      }
    })
  }


  /*
    //删除所有指定节点的n辈祖先
    function removeAllNode(selector, count) {
      document.querySelectorAll(selector).forEach((item) => {
        findAncestor(item, count).remove()
      })
    }

    /!*查找指定辈数的祖先*!/
    function findAncestor(node, count) {
      if (count > 0 && node.parentNode != null) {
        return findAncestor(node.parentNode, --count)
      }
      return node
    }

    */
})();
