// ==UserScript==
// @name         V2EX Ignore
// @license GNU GPLv3
// @namespace    https://www.example.com/
// @version      2.0
// @description  Adds an "Ignore" button next to each post's title on V2EX that allows you to ignore the topic with a single click.
// @description:zh-CN 在 V2EX 的每个帖子标题旁添加一个“忽略”按钮，单击即可忽略该主题。
// @description:zh-TW 在 V2EX 的每個帖子標題旁添加一個“忽略”按鈕，單擊即可忽略該主題。
// @description:ja 在 V2EX の各投稿タイトルの横に、「無視する」ボタンを追加し、クリックするだけでそのトピックを無視できます。
// @author       Arryboom
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471624/V2EX%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/471624/V2EX%20Ignore.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to ignore a topic
  function ignoreTopic(event) {
    event.preventDefault();
    const topicLink = event.target.parentNode.querySelector('.item_title a');
    if (topicLink) {
      const topicUrl = topicLink.href;
      const topicId = getTopicIdFromUrl(topicUrl);
      if (topicId) {
        getOnce().then(onceValue => {
          const ignoreUrl = `https://${window.location.hostname}/ignore/topic/${topicId}?once=${onceValue}`;
          GM_xmlhttpRequest({
            method: 'GET',
            url: ignoreUrl,
            onload: function(response) {
              const post = event.target.closest('.cell.item');
              if (post) {
                post.remove();
                showToast(`Topic ${topicId} ignored.`);
              }
            },
            onerror: function(error) {
              console.error(`Error ignoring topic ${topicId}: ${error}`);
            }
          });
        }).catch(error => {
          console.error(`Error fetching once value: ${error}`);
        });
      }
    }
  }

  // Function to extract the topic ID from a topic URL
  function getTopicIdFromUrl(topicUrl) {
    const match = topicUrl.match(/\/t\/(\d+)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  // Function to fetch the current once value from the V2EX server
  function getOnce() {
    return CSRF.getOnceCode()
      .then(code => {
        return code;
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  }

  class CSRF {
    static getOnceCode() {
      return new Promise((resolve, reject) => {
        fetch('/settings/block')
          .then(resp => resp.text())
          .then(text => {
            const code = CSRF.parseOnceCode(text);
            resolve(code);
          })
          .catch(reject);
      });
    }

    static parseOnceCode(text) {
      return text.match(/once=(\d+)/)[1];
    }
  }

  // Function to display a toast message
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.borderRadius = '5px';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Find all post titles on the page and add an "Ignore" button next to each one
  const postTitles = document.querySelectorAll('.cell.item .item_title');
  postTitles.forEach(postTitle => {
    const ignoreButton = document.createElement('a');
    ignoreButton.textContent = 'Ignore';
    ignoreButton.href = '#';
    ignoreButton.classList.add('tag');
    ignoreButton.addEventListener('click', ignoreTopic);
    postTitle.parentNode.insertBefore(ignoreButton, postTitle.nextSibling);
  });
})();