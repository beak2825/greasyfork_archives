// ==UserScript==
// @name         Jandan user blocker
// @namespace    jandan.net
// @name:zh-CN   煎蛋屏蔽用户
// @version      0.1
// @description  block Jandan users
// @description:zh-cn  屏蔽特定用户
// @author       Suzuhana
// @match        http://jandan.net/pic
// @match        http://jandan.net/pic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405149/Jandan%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/405149/Jandan%20user%20blocker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const localStorage = window.localStorage;
  let blockList = localStorage.getItem('blockList')
    ? JSON.parse(localStorage.getItem('blockList'))
    : [];
  const commentList = document.querySelector('ol.commentlist');
  const posts = document.querySelectorAll("ol.commentlist li[id^='comment']");
  const postsArr = Array.from(posts);
  const filteredPosts = postsArr.filter((ele) => {
    let shouldBeFiltered = false;

    blockList
      .map((ele) => ele.userId)
      .forEach((blockedId) => {
        if (
          ele
            .querySelector('div.author > strong')
            .getAttribute('title')
            .includes(blockedId)
        ) {
          shouldBeFiltered = true;
        }
      });

    return !shouldBeFiltered;
  });

  //empty nodeList and repopulate with filtered comments
  commentList.innerHTML = '';

  filteredPosts.forEach((ele) => {
    //Grab user name and user id;
    const userNode = ele.querySelector('div.author > strong');

    const userName = userNode.innerText;
    const userId = userNode.getAttribute('title').split('：')[1];

    //Create a Button for blocking user
    const blockButton = document.createElement('BUTTON');
    blockButton.innerHTML = 'Block this User';
    blockButton.addEventListener('click', () => {
      blockList.push({
        userId,
        userName,
      });
      localStorage.setItem('blockList', JSON.stringify(blockList));
      //TODO: could be replaced with better option
      location.reload();
    });

    ele.querySelector('div.author').appendChild(blockButton);
    commentList.appendChild(ele);
  });

  //reset blocklist
  const resetButton = document.createElement('BUTTON');
  resetButton.innerHTML = 'Release the trolls';
  resetButton.addEventListener('click', () => {
    blockList = [];
    localStorage.removeItem('blockList');
    //TODO: could be replaced with better option
    location.reload();
  });
  resetButton.style = 'float: right';

  document.querySelector('div.cp-pagenavi').appendChild(resetButton);
})();
