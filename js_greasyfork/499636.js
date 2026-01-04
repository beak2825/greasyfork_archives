// ==UserScript==
// @name         example.com LocalStorage Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to take over the world!
// @author       You
// @match        *://channels.weixin.qq.com/*
// @grant        GM_webRequest
// @require https://update.greasyfork.org/scripts/448895/1106656/ElementGetter%E5%BA%93.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499636/examplecom%20LocalStorage%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/499636/examplecom%20LocalStorage%20Viewer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 检查是否在example.com上
  if (window.location.hostname !== "channels.weixin.qq.com") {
    return;
  }

  function getLocalStorageData() {
    // 获取localStorage数据
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      localStorageData[key] = localStorage.getItem(key);
    }

    // 打印或处理数据
    console.log(localStorageData);

    return localStorageData;
  }

  function addXMLRequestCallback(callback) {
    //是一个劫持的函数
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
      //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
      // we've already overridden send() so just add the callback
      XMLHttpRequest.callbacks.push(callback);
    } else {
      // create a callback queue
      XMLHttpRequest.callbacks = [callback];
      //如果不存在则在xmlhttprequest函数下创建一个回调列表
      // store the native send()
      oldSend = XMLHttpRequest.prototype.send;
      //获取旧xml的send函数，并对其进行劫持
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
        //循环回调xml内的回调函数
        // call the native send()
        oldSend.apply(this, arguments);
        //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
      };
    }
  }

  addXMLRequestCallback(function (xhr) {
    console.log(1234);
    //调用劫持函数，填入一个function的回调函数
    //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
    xhr.addEventListener("load", function () {
      console.log(xhr.readyState, xhr.status, xhr.responseURL);
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseURL);
      }
    });
  });

  function hasChildWithClass(parent, className) {
    // 遍历父元素的所有子元素
    for (var i = 0; i < parent.children.length; i++) {
      var child = parent.children[i];
      // 使用classList.contains()检查子元素是否包含指定的类
      if (child.classList.contains(className)) {
        return true; // 如果找到，则返回true
      }
    }
    // 如果没有找到，则返回false
    return false;
  }

  const buttonClick = () => {
    const storageData = getLocalStorageData();
    console.log(storageData?.MCN_SESSION_TOKEN);
    const obj = {
      token: storageData?.MCN_SESSION_TOKEN,
    };
    fetch("http://127.0.0.1:3000/", {
      method: "post",
      headers: {
        "Content-Type": "application/json", // 告诉服务器请求体的内容类型
      },
      body: JSON.stringify(obj),
    });
  };

  function createMyButton() {
    const button = document.createElement("div");
    button.innerHTML = `
    <button style="width: 60px;height: 24px; color: #ffffff; background: #4f6bff; cursor: pointer; border-radius: 4px;">上报</button>
    `;
    button.classList.add("my-upload-button");
    button.style.display = "flex";
    button.style.justifyContent = "center";

    button.addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        buttonClick();
      }
    });
    return button;
  }

  (async function () {
    const div = await elmGetter.get(".container-center");
    console.log(div);
    const hasButton = hasChildWithClass(div, "my-upload-button");
    console.log(hasButton);
    if (!hasButton && div) {
      const button = createMyButton();
      div.insertBefore(button, div.firstChild);
    }
  })();
})();
