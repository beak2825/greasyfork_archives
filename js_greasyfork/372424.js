// ==UserScript==
// @name         即刻网页版自赞提示
// @namespace    jike-web-like-myself
// @version      0.1
// @description  当在即刻网页版给自己的动态点赞时，给你弹个 😏表情
// @author       viko16 (即刻@糯米鸡)
// @match        https://web.okjike.com/*
// @homepage     https://github.com/viko16/jike-web-like-myself
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/372424/%E5%8D%B3%E5%88%BB%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E8%B5%9E%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/372424/%E5%8D%B3%E5%88%BB%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E8%B5%9E%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 1. 获取当前用户是谁
   * 2. 监听点赞的点击
   * 3. 判断这个赞的作者
   * 4. 一致就 😏
   */

  // 放置 toast 元素
  const toastEl = document.createElement('div');
  toastEl.innerText = '😏';
  Object.assign(toastEl.style, {
    position: 'fixed',
    right: '30px',
    top: '80px',
    fontSize: '3em',
    visibility: 'hidden'
  });
  document.body.appendChild(toastEl);

  getUserNick().then(userNick => {
    document.addEventListener('click', event => {
      const FLAG = 'symbol symbol-dig';
      const target = event.target;

      try {
        // 定位到赞上面的 a 标签
        let a;
        if (target.classList.toString() === FLAG) {
          a = target.parentElement;
        } else if (target.nodeName === 'A' && target.firstElementChild && target.firstElementChild.classList.toString() === FLAG) {
          a = target;
        } else {
          return;
        }

        // 没想到什么好办法，先数父节点吧..
        const author = a.parentElement.parentElement.parentElement.parentElement.querySelector('.user-activity-header-main .user-name a').innerText;
        // console.log(`给 ${author} 点赞了`);
        if (userNick === author) showEmoji();
      } catch (error) {
        // console.error('出错了呀');
      }
    });
  });

  function showEmoji() {
    console.log('😏');
    toastEl.style.visibility = 'visible';
    setTimeout(() => {
      toastEl.style.visibility = 'hidden';
    }, 1000);
  }

  function getUserNick() {
    return fetch('https://app.jike.ruguoapp.com/1.0/users/profile', {
        headers: {
          platform: 'web',
          'App-Version': '4.1.0',
          'x-jike-access-token': localStorage.getItem('access-token'),
        },
      })
      .then(res => res.json())
      .then(result => result.user.screenName);
  }

})();