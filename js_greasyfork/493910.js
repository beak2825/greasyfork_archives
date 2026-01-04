// ==UserScript==
// @name        留言抽奖 linux.do
// @description 方便Linux.do 留言抽奖操作
// @namespace   https://linux.do
// @match       https://linux.do/*
// @grant       none
// @version     1.0.3
// @author      315705030@qq.com
// @license     MIT
//
// @downloadURL https://update.greasyfork.org/scripts/493910/%E7%95%99%E8%A8%80%E6%8A%BD%E5%A5%96%20linuxdo.user.js
// @updateURL https://update.greasyfork.org/scripts/493910/%E7%95%99%E8%A8%80%E6%8A%BD%E5%A5%96%20linuxdo.meta.js
// ==/UserScript==
// 此脚本借鉴了 AutoRead 老哥代码 此处致敬！
// https://update.greasyfork.org/scripts/489464/Auto%20Read.user.js

(function() {
    'use strict';

    const keyword = "想要";
    const pattern = new RegExp(keyword);
    let usefulRelay = {};

    function getCooked() {
      const replayList = document.querySelectorAll('article');
      replayList.forEach((reply, index)=>{
          var firstParagraph = reply.querySelector('p');
          if (firstParagraph) {
              if(pattern.test(firstParagraph.textContent)) {
                console.log('--Yes--', index, reply.dataset.postId);
                var fullname = reply.querySelector('.full-name');
                if (!fullname) {
                  fullname = reply.querySelector('.username');
                }
                usefulRelay[reply.dataset.userId] = {"id":reply.dataset.postId,
                                                     "fullname":fullname.textContent.trim(),
                                                     "alink":fullname.querySelector('a')};
              } else {
                console.log('--No--');
              }
          }
      });
    }

    const delay = 2000;
    let checkScrollTimeout = null;
    function checkScroll() {
      // scrollToBottomSlowly();
      if (window.innerHeight + window.scrollY >=  document.body.offsetHeight - 20) {
          console.log("已滚动到底部");
          clearTimeout(checkScrollTimeout);
        } else {
          if (checkScrollTimeout !== null) {
            clearTimeout(checkScrollTimeout);
          }
          checkScrollTimeout = setTimeout(checkScroll, delay);
        }
    }

    // 有BUG 改为手动滚动 滚动结束后 手动点击抽奖中抽奖
    let scrollInterval = null;
    function scrollToBottomSlowly(
      distancePerStep = 10,
      delayPerStep = 50
    ) {
      if (scrollInterval !== null) {
        clearInterval(scrollInterval);
      }
      scrollInterval = setInterval(() => {
        if ( window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
          console.log("已滚动到底部");
          clearInterval(scrollInterval);
          if (checkScrollTimeout !== null) {
            clearTimeout(checkScrollTimeout);
          }
          scrollInterval = null;
          drawing();
        } else {
          window.scrollBy(0, distancePerStep);
        }
      }, delayPerStep);
    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
          if(localStorage.getItem("status") === "doing") {
            getCooked();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }



    function drawing() {
      if (usefulRelay.length) {
        const relayKeys = Object.keys(usefulRelay);
        const randomIndex = Math.floor(Math.random() * relayKeys.length);
        const randomKey = relayKeys[randomIndex];
        submitResult(usefulRelay[randomKey], randomIndex, relayKeys.length);
      } else {
        alert("暂无有效抽奖回复");
      }
      resetAll();
    }

    function submitResult(lucky, index, count) {
      let submitBtn = document.querySelector('button.create');
      submitBtn.click();

      console.log(usefulRelay)
      let pElement = document.createElement('p');
      let luckyElement = document.createElement('div');
      let txtElement = document.createTextNode('有效参与人数：'+count+' ; 获奖Index：['+index+'] ; 获奖人：'+lucky.fullname);
      luckyElement.appendChild(txtElement)

      pElement.appendChild(luckyElement)
      pElement.appendChild(document.createElement('br'))
      pElement.appendChild(document.createTextNode('有效参与明细：'))

      usefulRelay.forEach((value) => {
          var currentContent = value.alink.textContent;
          value.alink.textContent = currentContent + '  ';
          pElement.appendChild(value.alink);
          console.log(pElement, currentContent)
      })
      setTimeout(function() {
        document.querySelector('.d-editor-input').value = "》》》请稍等抽奖抽取中..."
      }, 500);

      let runing = setInterval(() => {
        document.querySelector('.d-editor-input').value += '.'
      }, 600);


      setTimeout(function() {
          clearInterval(runing);
          let inputElement = document.querySelector('.d-editor-input');
          let divElement = document.querySelector('.d-editor-preview');
          inputElement.value = pElement.textContent;
          divElement.appendChild(pElement);
      }, 5000);;
    }

    function resetAll() {
      localStorage.setItem("status", "init");
      usefulRelay = [];
      button.textContent = "开始抽奖";
    }

    localStorage.setItem("status", "init");
     // 创建一个控制抽奖的按钮
    const button = document.createElement("button");
    button.textContent = localStorage.getItem("status") === "doing" ? "抽奖中" : "开始抽奖";
    button.style.position = "fixed";
    button.style.bottom = "100px";
    button.style.right = "100px";
    button.style.zIndex = 1000;
    button.style.backgroundColor = "#f0f0f0"; // 浅灰色背景
    button.style.color = "#000"; // 黑色文本
    button.style.border = "1px solid #ddd"; // 浅灰色边框
    button.style.padding = "5px 10px"; // 内边距
    button.style.borderRadius = "5px"; // 圆角
    document.body.appendChild(button);


    button.onclick = function () {
        const currentStatus = localStorage.getItem("status") === "doing";
        button.textContent = currentStatus ? "数据采集" : "开始抽奖";
        if(currentStatus) {
          button.textContent = "抽奖中";
          drawing();
        } else{
          if (scrollInterval !== null) {
            clearInterval(scrollInterval);
            scrollInterval = null;
          }
          let isConfirmed = confirm("确定现在抽奖吗？");
          if (isConfirmed) {
              usefulRelay = [];
              localStorage.setItem("status", "doing");
              button.textContent = "数据采集";
              console.log("去抽奖！");

              // checkScroll(); //改为手动点击抽奖中抽奖
          } else {
              console.log("取消了！");
          }
        }
    };

    observePageChanges();

})();
