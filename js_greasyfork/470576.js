// ==UserScript==
// @name         极简b站—bilibili
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  极简b站是用来把b站伪装成文章 点击向前按钮可以来回切换 原始模式和伪装模式 灵感来源于 领导说我看视频不要被发现 如果有bug或想法邮箱联系我：guang_ming175@163.com
// @author       向前  rational_stars
// @match         *://*.bilibili.com/*
// @run-at       document-end
// @grant        none
// @license         MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js

// @downloadURL https://update.greasyfork.org/scripts/470576/%E6%9E%81%E7%AE%80b%E7%AB%99%E2%80%94bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/470576/%E6%9E%81%E7%AE%80b%E7%AB%99%E2%80%94bilibili.meta.js
// ==/UserScript==

(function () {
  var positionIcon = window.innerWidth;
  var hiddenFlag = false; // 0隐藏 1显示
  console.log("向前🇨🇳 ====> 极简b站—bilibili");
  const documentArray = [
    ".bili-header",
    ".bili-header__bar",
    ".right-container",
    ".svg-icon",
    ".bpx-player-sending-bar",
    ".avatar",
    '[title="投币（W）"]',
    ".sub-user-info",
    ".sub-reply-info",
    ".video-toolbar-right",
  ];
  function hideElements() {
    documentArray.forEach(function (item) {
      $(item).hide();
    });
  }

  function showElements() {
    documentArray.forEach(function (item) {
      $(item).show();
    });
  }
  function is() {
    if (hiddenFlag) {
      showElements();
    } else {
      hideElements();
    }
  }
  function resetDocumentStyles() {
    const resetStyleArray = [
      {
        document: ".video-toolbar-container",
        css: {
          zIndex: "9999",
          display: "flex",
          position: "fixed",
          left: positionIcon.right - 150 + "px",
          top: "50%",
          transform: "translateY(-50%)",

          width: "150px",
        },
      },
      {
        document: ".video-toolbar-left",
        css: {
          flexWrap: "wrap",
          height: "500px",
        },
      },
      {
        document: ".video-toolbar-container",
        css: {
          border: "none",
        },
      },
    ];

    resetStyleArray.forEach(function (item) {
      $(item.document).css(item.css);
    });
  }

  function insertCustomDiv() {
    let timeout;
    const customDiv = $("<div>")
      .addClass("rational-stars-btn")
      .text("向前")
      .css({
        zIndex: "999999999",
        position: "fixed",
        backgroundColor: "skyblue",
        right: 0,
        top: "30%",
        width: "60px",
        height: "60px",
        lineHeight: "60px",
        transform: "translateX(50%)",
        borderRadius: "50%",
        textAlign: "center",
        color: "#ffffff",
        cursor: "pointer",
        userSelect: "none",
      })
      .addClass("animate__animated")
      .click(function () {
        hiddenFlag = !hiddenFlag;
        is();
      })
      .hover(
        function () {
          clearTimeout(timeout);
          $(this)
            .stop()
            .css({
              transform: "translateX(0)",
              backgroundColor: "#fb7299",
            })
            .addClass("animate__lightSpeedInRight");
        },
        function () {
          timeout = setTimeout(() => {
            $(this)
              .stop()
              .css({
                transform: "translateX(50%)",
                backgroundColor: "skyblue",
              })
              .removeClass("animate__lightSpeedInRight")
          }, 1000);
        }
      );

    $("body").append(customDiv);
    $("head").append($('<link rel="icon" href="https://cdn.jsdelivr.net/gh/rational-stars/picgo/favicon.ico">'));
    $("body").append($(' <link href="https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet"></link>'));
  }
  window.onload = function () {
    positionIcon = $(".video-container-v1").get(0).getBoundingClientRect();
    // DOM 更新后重新插入插入元素
    insertCustomDiv();
    resetDocumentStyles();
    is();
  };

  $(window).scroll(function () {
    is();
    $("video").each(function () {
      if (!this.paused && !hiddenFlag) {
        this.pause();
      }
    });
  });
})();
