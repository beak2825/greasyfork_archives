// ==UserScript==
// @name         chat爬楼工具
// @namespace    zhihu_helper_tool
// @version      1.0.9
// @description  chat爬楼
// @author       浮游
// @match        *://chat.kybmig.cc/*
// @connect      chat.kybmig.cc
// @connect      chat.kybmig.cc
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js

// @run-at       document-start
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_download
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/418584/chat%E7%88%AC%E6%A5%BC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/418584/chat%E7%88%AC%E6%A5%BC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    addStyle();
  });
  let useButton = false;
  let url = "";
  const log = console.log.bind(console);

  const addStyle = () => {
    var x = `
    .hide {
        display: none;
    }

    .menu-icon {
      float: left;
      width: 20px;
      height: 20px;
      position: fixed;
      left: 5px;
      top: 28px;
      cursor: pointer;
    }

    .disabled {
        background-color: #eff0f1 !important;
        cursor: default;
    }

    .slider-button {
        color: white;
        background-color: #01bcd4;
    }

    .formatButton {
        position: relative;
        bottom: 5px;
        margin-right: 3px;
        border-radius: 6px;
        padding: 5px;
        color: white;
        font-weight: 500;
        background-color: #01bcd4;
    }
    `;
    var y = document.createElement("style");
    y.innerHTML = x;
    $("head")[0].appendChild(y);
  };

  const disableButton = () => {
    $(".topButton").attr("disabled", true);
    $(".topButton").addClass("disabled");
  };

  const enableButton = () => {
    $(".topButton").attr("disabled", false);
    $(".topButton").removeClass("disabled");
  };

  const _run = () => {
    if ($(".formatButton").length == 0) {
      let buttonRoot = $(".rc-room-actions")[0];
      // 爬楼按钮
      let tButton = document.createElement("button");
      tButton.innerHTML =
        '<button class="formatButton topButton" type="button">爬一下</button>';
      buttonRoot.insertBefore(tButton, $(".rc-room-actions__action")[0]);

      // 到底部按钮
      let bButton = document.createElement("button");
      bButton.innerHTML =
        '<button class="formatButton" type="button">到底部</button>';
      buttonRoot.insertBefore(bButton, $(".rc-room-actions__action")[0]);

      // 隐藏侧边栏按钮
      let sliderIcon = document.createElement("div");
      sliderIcon.innerHTML =
        '<svg t="1608034215704" class="menu-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3160"><path d="M896 307.2l-768 0c-14.1312 0-25.6-11.4688-25.6-25.6s11.4688-25.6 25.6-25.6l768 0c14.1312 0 25.6 11.4688 25.6 25.6s-11.4688 25.6-25.6 25.6z" p-id="3161" fill="#8a8a8a"></path><path d="M896 563.2l-768 0c-14.1312 0-25.6-11.4688-25.6-25.6s11.4688-25.6 25.6-25.6l768 0c14.1312 0 25.6 11.4688 25.6 25.6s-11.4688 25.6-25.6 25.6z" p-id="3162" fill="#8a8a8a"></path><path d="M896 819.2l-768 0c-14.1312 0-25.6-11.4688-25.6-25.6s11.4688-25.6 25.6-25.6l768 0c14.1312 0 25.6 11.4688 25.6 25.6s-11.4688 25.6-25.6 25.6z" p-id="3163" fill="#8a8a8a"></path></svg>';
      $(".rc-header--room")[0].insertBefore(
        sliderIcon,
        $(".rc-header__wrap")[0]
      );

      // 设置滚动
      let wrapper = $(".wrapper");
      let ul = wrapper.children("ul");

      tButton.onclick = () => {
        disableButton();
        wrapper.animate({ scrollTop: 0 }, 300);

        setTimeout(() => {
          enableButton();
        }, 1000);
      };

      bButton.onclick = () => {
        wrapper.animate({ scrollTop: wrapper[0].scrollHeight }, 300);
      };

      sliderIcon.onclick = () => {
        const slider = $(".sidebar--main");
        if (slider.hasClass("hide")) {
          slider.removeClass("hide");
        } else {
          slider.addClass("hide");
        }
      };
    }
  };

  const _main = () => {
    url = location.href;
    _run();

    setInterval(() => {
      if (url != location.href) {
        url = location.href;
        _run();
      }
    }, 1500);
  };

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      setTimeout(function () {
        _main();
      }, 3000);
    }
  };
})();
