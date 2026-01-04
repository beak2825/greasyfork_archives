// ==UserScript==
// @name         🔥拓展增强🔥妖火不跳转页面打开
// @namespace    https://yaohuo.me/
// @version      0.0.6
// @description  当前页面弹出框查阅
// @author       大郎
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512715/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E4%B8%8D%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/512715/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E4%B8%8D%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

function openLayer(options) {
    let background_layer = document.createElement("div");
    background_layer.style.display = "none";
    background_layer.style.position = "fixed";
    background_layer.style.top = "0";
    background_layer.style.left = "0";
    background_layer.style.width = "100%";
    background_layer.style.height = "100%";
    background_layer.style.backgroundColor = "gray";
    background_layer.style.zIndex = "1001";
    background_layer.style.opacity = "0.8";

    let open_layer = document.createElement("div");
    open_layer.style.display = "none";
    open_layer.style.position = "fixed";
    if(yaohuo_isMobile()){
        open_layer.style.top = "3px";
        open_layer.style.left = "calc(50% - 14px)";
        open_layer.style.transform = "translate(-50%, 0%)";
        open_layer.style.minWidth = yaohuo_isMobile() ? "calc(100% - 32px)" :(
          options.width === undefined ? "fit-content" : options.width);
        open_layer.style.height =
            options.height === undefined ? "80%" : options.height;
    }else{
        open_layer.style.top = "50%";
        open_layer.style.left = "50%";
        open_layer.style.transform = "translate(-50%, -50%)";
        open_layer.style.minWidth = options.width === undefined ? "fit-content" : options.width;
        open_layer.style.height = "96%";
    }
    open_layer.style.border = "1px solid lightblue";
    open_layer.style.borderRadius = "15px";
    open_layer.style.boxShadow = "4px 4px 10px #171414";
    open_layer.style.backgroundColor = "white";
    open_layer.style.zIndex = "1002";
    open_layer.style.overflow = "auto";
    open_layer.style.margin = "0";
    open_layer.style.padding = "0";

    var iframe = document.createElement("iframe");
    iframe.src = options.url === undefined ? "" : options.url;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.display = "block";
    open_layer.appendChild(iframe);

    document.body.appendChild(open_layer);
    document.body.appendChild(background_layer);

    open_layer.style.display = "block";
    background_layer.style.display = "block";

    background_layer.onclick = function () {
      removeLayer();
    };

    window.addEventListener('message', function(event) {
        if (event.data === 'closeFrame') {
            removeLayer();
        }
    });

    function removeLayer() {
        open_layer.remove();
        background_layer.remove();
    }
  }

  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' || event.keyCode === 27) {
          window.parent.postMessage('closeFrame', '*');
      }
  });

    function yaohuo_isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // 检查是否是移动设备
        return /android/i.test(userAgent) ||
            /iPhone|iPad|iPod/i.test(userAgent) ||
            /Windows Phone/i.test(userAgent) ||
            /Mobile/i.test(userAgent);
    }

  document.addEventListener("click", function (event) {
    // 检查点击的元素是否具有 topic-link 类
    if (event.target.classList.contains("topic-link")) {
      event.preventDefault(); // 防止默认链接行为

      let url = event.target.getAttribute("href"); // 获取链接的 href 属性

      openLayer({
        top: "10%",
        left: "10%",
        width: "720px",
        height: "90%",
        url: url,
      });
    }
  });

})();