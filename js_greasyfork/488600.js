// ==UserScript==
// @name         🏆bilibili|B站样式修改|B站关注页面样式修改🏆
// @description 把b站关注页的视频样式改为大瀑布流样式
// @namespace    lyzzz
// @version      1.1.0
// @author       lyzzz
// @run-at       document-end
// @storageName  lyzzz
// @match https://t.bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488600/%F0%9F%8F%86bilibili%7CB%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%7CB%E7%AB%99%E5%85%B3%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%F0%9F%8F%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488600/%F0%9F%8F%86bilibili%7CB%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%7CB%E7%AB%99%E5%85%B3%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%F0%9F%8F%86.meta.js
// ==/UserScript==
(function(){
    'use strict';
    function renderFeed() {
  const rightPanel = document.querySelector('.right');
  if (rightPanel) {
    rightPanel.style.display = 'none';
  }
  const main = document.querySelector('main');
  if (main) {
    main.style.width = '100%';
  }
  const feedList = document.querySelector('.bili-dyn-list__items');
  if (feedList) {
    feedList.style.display = 'flex';
    feedList.style.flexDirection = 'row';
    feedList.style.flexWrap = 'wrap';
  }
  const feeds = document.querySelectorAll('.bili-dyn-list__item');
  if (feeds) {
    for (let feed of feeds) {
      const imgNode = feed.querySelector('.bili-dyn-card-video__header');

      if (!imgNode) {
        feed.innerHTML = '';
      } else {
        const existFeed = feed.querySelector('.newFeed');
        if (!existFeed) {
          imgNode.style.height = '100px';
          imgNode.style.width = '160px';
          imgNode.style.overflow = 'hidden';
          imgNode.style.borderRadius = '4px';

          const imgInsideNode = feed.querySelector(
            '.bili-dyn-card-video__header .b-img'
          );
          imgInsideNode?.setAttribute('class', 'b-img');
          const title = feed.querySelector(
            '.bili-dyn-card-video__title'
          )?.textContent;

          let newFeed = document.createElement('li');
          newFeed.style.width = '160px';
          newFeed.style.margin = '0px 3px 3px 0px';
          newFeed.style.padding = '10px';
          newFeed.style.display = 'block';
          newFeed.style.float = 'left';
          newFeed.style.background = 'white';
          newFeed.setAttribute('class', 'newFeed');
          newFeed.innerHTML = feedHtml(title);
          newFeed.insertAdjacentElement('afterbegin', imgNode);

          feed.replaceChildren(newFeed);
        }
      }
    }
  }
}

const feedHtml = (title) => `
<a href="//www.bilibili.com/video/BV19W421A7ok/" target="_blank" title=${title} class="title bili-dyn-card-video__title" style="display: block;
  line-height: 20px;
  height: 38px;
  margin-top: 6px;
  font-size: 12px;">${title}</a>
`;

setInterval(renderFeed, 1000)
})()


