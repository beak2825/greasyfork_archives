// ==UserScript==
// @name         5ch 横棒のレスを消すやつ
// @namespace    idk
// @author       Chibiaoiro
// @version      1.0.3.1
// @description  スクリプト対策
// @match        https://*.5ch.net/test/read.cgi/*
// @grant        none
// @license      MIT
// @supportURL   https://raw.githubusercontent.com/Chibiaoiro/5ch-scripts/main/filter-script.user.js
// @downloadURL https://update.greasyfork.org/scripts/470532/5ch%20%E6%A8%AA%E6%A3%92%E3%81%AE%E3%83%AC%E3%82%B9%E3%82%92%E6%B6%88%E3%81%99%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/470532/5ch%20%E6%A8%AA%E6%A3%92%E3%81%AE%E3%83%AC%E3%82%B9%E3%82%92%E6%B6%88%E3%81%99%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // "div.post" 選択
  const posts = document.querySelectorAll('div.post');

  // ボタン作り
  const toggleButton = document.createElement('div');
  toggleButton.style.position = 'absolute';
  toggleButton.style.top = '190px';
  toggleButton.style.right = '110px';
  toggleButton.style.width = '100px';
  toggleButton.style.height = '60px';
  toggleButton.style.padding = '10px';
  toggleButton.style.background = '#ffcccc';
  toggleButton.style.border = '1px solid #ccc';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.textAlign = 'center';
  toggleButton.style.lineHeight = '20px';
  toggleButton.style.color = 'red';
  toggleButton.style.fontWeight = 'bold';
  toggleButton.style.fontFamily = 'Arial, sans-serif';
  toggleButton.style.fontSize = '14px';
  toggleButton.innerHTML = 'フィルター有効';

  // ボタン付け
  document.body.appendChild(toggleButton);

  // デフォルトでスクリプト消す
  let postsVisible = false;
  let filteredPostsCount = 0;
  showHidePosts(postsVisible);

  // ボタンが押された時に消すイベントリスナー
  toggleButton.addEventListener('click', function() {
    postsVisible = !postsVisible;
    showHidePosts(postsVisible);
    updateToggleButton(postsVisible);
  });

  // フラグでポストを消すか表すか
  function showHidePosts(visible) {
    filteredPostsCount = 0;
    posts.forEach(post => {
      const escapedSpan = post.querySelector('span.escaped');
      if (escapedSpan && /^[=-＿]+$/.test(escapedSpan.textContent.trim())) {
        const nextElement = post.nextElementSibling;
        if (nextElement && nextElement.tagName.toLowerCase() === 'br') {
          nextElement.style.display = visible ? 'block' : 'none';
        }
        post.style.display = visible ? 'block' : 'none';
        post.style.background = visible ? '#ffcccc' : '#efefef';
        filteredPostsCount++;
      }
    });
    console.log(`Filtered ${filteredPostsCount} post(s).`);
  }

  // ボタンのテキスト、いろ、ポストの色を変える
  function updateToggleButton(visible) {
    toggleButton.style.background = visible ? 'white' : '#ffcccc';
    toggleButton.style.color = visible ? '#485269' : 'red';
    toggleButton.innerHTML = visible ? 'フィルター無効' : 'フィルター有効'
  }
})();
