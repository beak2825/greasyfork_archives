// ==UserScript==
// @name         油猴办公助手-tomy.li
// @namespace    http://tampermonkey.net/
// @version      0.9.13
// @description  个人工作用的油猴脚本
// @author       tomy.li
// @include      *
// @match        file:///*|*://*scm.to8to.com/*
// @require      https://lib.baomitu.com/jquery/3.7.1/jquery.slim.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459663/%E6%B2%B9%E7%8C%B4%E5%8A%9E%E5%85%AC%E5%8A%A9%E6%89%8B-tomyli.user.js
// @updateURL https://update.greasyfork.org/scripts/459663/%E6%B2%B9%E7%8C%B4%E5%8A%9E%E5%85%AC%E5%8A%A9%E6%89%8B-tomyli.meta.js
// ==/UserScript==

function addXMLRequestCallback(callback) {
  // 是一个劫持的函数
  var oldSend, i;
  if (XMLHttpRequest.callbacks) {
    //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
    // we've already overridden send() so just add the callback
    XMLHttpRequest.callbacks.push(callback);
  } else {
    // create a callback queue
    XMLHttpRequest.callbacks = [callback];
    // 如果不存在则在xmlhttprequest函数下创建一个回调列表
    // store the native send()
    oldSend = XMLHttpRequest.prototype.send;
    // 获取旧xml的send函数，并对其进行劫持
    // override the native send()
    XMLHttpRequest.prototype.send = function () {
      // process the callback queue
      // the xhr instance is passed into each callback but seems pretty useless
      // you can't tell what its destination is or call abort() without an error
      // so only really good for logging that a request has happened
      // I could be wrong, I hope so...
      // EDIT: I suppose you could override the onreadystatechange handler though
      for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
        XMLHttpRequest.callbacks[i](this);
      }
      // 循环回调xml内的回调函数
      // call the native send()
      oldSend.apply(this, arguments);
      // 由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
    };
  }
}

(function () {
  "use strict";

  GM_registerMenuCommand('------------------Tapd--------------------', function () {
      alert("分割线");
    }, 'o');
    // 自定义菜单
    let menu1 = GM_registerMenuCommand('录工时-仪表盘', function () {
      window.open('https://www.tapd.cn/my_dashboard', '_blank');
    }, 'o');
    
    let menu2 = GM_registerMenuCommand('录工时-日常维护类', function () {
      window.open('https://www.tapd.cn/47296289/prong/stories/view/1147296289001148873', '_blank');
    }, 'o');
      
    let menu3 = GM_registerMenuCommand('录工时-线上问题处理', function () {
      window.open('https://www.tapd.cn/54981164/prong/stories/view/1154981164001188462', '_blank');
    }, 'o');
    let menu4_5 = GM_registerMenuCommand('------------------禅道--------------------', function () {
      alert("分割线");
    }, 'o');
    let menu4 = GM_registerMenuCommand('录工时-日常维护类-禅道', function () {
      window.open('http://chandao.to8to.com/index.php?m=execution&f=story&executionID=28', '_blank');
    }, 'o');
    
    let menu5 = GM_registerMenuCommand('录工时-仪表盘-禅道', function () {
      window.open('http://chandao.to8to.com/index.php?m=pivot&f=preview&dimension=1&group=62&method=taskestimate', '_blank');
    }, 'o');
    let menu6 = GM_registerMenuCommand('禅道——操作文档', function () {
      window.open('https://doc.weixin.qq.com/doc/w3_AcQAIwalAJw0N3QT8FXRPCF4FnsIV?scode=AGcAeweXAA0yTxVAK6AcQAIwalAJw&version=4.1.31.6017&platform=win', '_blank');
    }, 'o');
  // Your code here...
  $(document).ready(function () {
    // 屏蔽元素
    $("#watermark .x").hide();
    $("button.btn-success").click(function () {
      var parents = document.getElementById("releaseModal");
      var header = parents.querySelector(".modal-header");
      var buttons = parents.querySelector(".modal-footer");
      butts = buttons.querySelectorAll(".btn");
      headerChild = header.querySelector(".modal-title");
      header.insertBefore(butts[0], headerChild);
      header.insertBefore(butts[0], headerChild);
    });
  });
  addXMLRequestCallback(function (xhr) {
    xhr.addEventListener("load", function () {
      //判断页面加载状态的
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseURL);
        //判断是不是自己想要监听的URl地址  字符串就是 你需要监听的地址
        if (/cgi\/views\/project\/searchProjectByProj/.test(xhr.responseURL)) {
          $(".list-spaner .list-item.first").each(function () {
            if ($(this).find(".newA").length == 0) {
              let el1 = $(this).find("#foo");
              let el2 = el1.next();
              let html = el2.html();
              let infoId = html.replace(/[^\d]/g, "");
              let origin = document.location.origin;
              el2.after(
                "&nbsp;&nbsp;<a href='" +
                  origin +
                  "/customservice/recheck-project/index.html?projectId=" +
                  infoId +
                  "' target='_blank' class='newA'>回访编辑页</a>"
              );
              el2.after(
                "&nbsp;&nbsp;<a href='" +
                  origin +
                  "/customservice/check-project/new/index.html?projectId=" +
                  infoId +
                  "' target='_blank' class='newA'>审核编辑页(新)</a>"
              );
              el2.after(
                "&nbsp;&nbsp;<a href='" +
                  origin +
                  "/customservice/check-project/index.html?projectId=" +
                  infoId +
                  "' target='_blank' class='newA'>审核编辑页</a>"
              );
            }
          });
        }
      }
    });
  });
})();
