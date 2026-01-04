// ==UserScript==
// @name         Record Clicked Supjav Post
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       Ian Yu
// @description  Save your time to click the same post again and again on supjav, and make the post gray if you have clicked it before.
// @match        https://supjav.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485739/Record%20Clicked%20Supjav%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/485739/Record%20Clicked%20Supjav%20Post.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // 功能 1. 記錄已開啟過的圖片
  var clicked = JSON.parse(localStorage.getItem('clicked')) || [];
  var posts = document.querySelectorAll('.post');
  posts.forEach(function (post) {
    var link = post.querySelector('a');
    var img = post.querySelector('img');
    var href = link.href;
    if (clicked.indexOf(href) !== -1) {
      console.log('clicked href:', href);
      img.style.filter = 'grayscale(100%)';
    }

    link.addEventListener('click', function (e) {
      e.preventDefault();

      if (clicked.indexOf(href) === -1) {
        console.log('clicked href:', href);
        clicked.push(href);
        localStorage.setItem('clicked', JSON.stringify(clicked));
      }

      // 找到裡面的圖片，變成灰階
      img.style.filter = 'grayscale(100%)';
      window.location.href = href;
    });

    // 如果 link 是用中間鍵開啟，也要記錄
    link.addEventListener('auxclick', function (e) {
      if (e.which === 2) {
        //e.preventDefault();

        if (clicked.indexOf(href) === -1) {
          console.log('clicked href:', href);
          clicked.push(href);
          localStorage.setItem('clicked', JSON.stringify(clicked));
        }

        // 找到裡面的圖片，變成灰階
        img.style.filter = 'grayscale(100%)';
      }
    });
  });

  // 功能 2. 顯示縮圖
  // 遍歷 HTML 上 class 是 "btn-server" 的超連結，若顯示文字是 FST，對它執行點擊事件
  document.querySelectorAll('.btn-server').forEach(function (el) {
    console.log('innerText:', el.innerText);
    if (el.innerText === 'FST') {
      setTimeout(() => {
        el.click();
      }, 1500);
    }
  });
})();
