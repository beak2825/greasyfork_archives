// ==UserScript==
// @name        随缘自用屏蔽
// @namespace   https://tampermonkey.net/
// @version     1
// @description 屏蔽网站中包含指定关键词的条目
// @author      musuyushi
// @match       http*://www.mtslash.xyz/search.php*
// @match       http*://www.mtslash.xyz/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/513891/%E9%9A%8F%E7%BC%98%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/513891/%E9%9A%8F%E7%BC%98%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 自行设置关键词列表，格式如下
  let blockWordsArray = ['盾铁','铁盾','锤盾','盾受','冬盾','冬铁','盾冬铁','冬叉','冬寡','冬盾冬','盾冬盾','无差','互攻','all铁','all盾','霜铁','贾妮','贾尼','盾铁盾','鐵盾','鐵盾鐵','盾鐵','盾鐵盾','盾叉','冬泽','蝙蝠侠/美国队长','罗叉','叉盾','霹雳火/美国队长','铁鹰','霍盾','ALL叉','無差','Steve/Tony','盾妮','基妮','灭盾','Thanos/Steve','ALL/omega!队长','S/T','All Tony','盾冬鐵',
                         '基盾','Loki/Tony','ALL妮','虫铁','冬鹰','盾基','蝠铁','锤铁','鷹鐵','锤鐵','基锤','Loki/Tony','teve X 女東妮','All鹰','冬猎','冬/叉','盾红','爱德华多/泽莫','盾佩','叉泽','脊背我','盾哈','你/盾','猎盾','盾猎','红盾','冬霍','美国队长全CP向','铁x盾','盾x铁','盾泽','超盾','虫泽','叉骨中心','冬罚','快泽','钢铁侠中心',
                        '詹豆芽','美国队长X 蝙蝠侠','虫盾','蜘蛛盾','盾虫','泽盾','盾中心','冬豹','冬兵&铁人','SuperCap','美国拟人/队长','美队x泽莫','冬鐵','幻铁','幻妮','Tony中心','叉铁','猎盾','黑盾自述/微黑白盾','美队/旺达','Steve x Chris','盾寡','皮叉','Bucky X Steve','冬兵/叉骨','队长中心','盾詹佩','Erik/Steve','詹芽','叉罗','獵鷹/叉骨','黑豹x泽莫','黑豹/泽莫',
                        '彼得.帕克/赫尔穆特.泽莫','黑寡妇X叉骨','水仙盾','盾水仙','美国队长x夜魔侠','美国队长和铁人','小弟叉骨','盾火','猎叉','罚盾','美队中心','Bucky/Steve/Bucky','眼中的冰雪','雪地的三个昼夜'];

  // 屏蔽帖子函数，适用于主页和搜索页面
  function blockPosts() {
    // 获取搜索结果页的条目
    const threadList = document.getElementById("threadlist");
    if (threadList) {
      const threads = threadList.querySelectorAll("li.pbw");

      // 遍历每个搜索结果条目
      threads.forEach(function(thread) {
        const title = thread.querySelector("h3.xs3 a");
        blockWordsArray.forEach(word => {
          if (title.textContent.includes(word)) {
            thread.style.display = "none";
            return;
          }
        });
      });
    }

    // 获取主页的帖子
    let elementsArray = Array.from(document.getElementsByTagName('tbody'));
    elementsArray = elementsArray.filter(el => el.id && el.id.startsWith('normalthread_'));

    for (let el of elementsArray) {
      let elementText = el.textContent.toLowerCase();
      for (let word of blockWordsArray) {
        if (elementText.includes(word.toLowerCase())) {
          el.style.display = 'none';
          console.log(`帖子已隐藏`);
          break;
        }
      }
    }
  }

  // 初次执行屏蔽逻辑
  blockPosts();

  // 监听 DOM 变化的回调函数
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        blockPosts(); // 当新内容加载时重新执行屏蔽
      }
    }
  });

  // 监听页面内容变化
  observer.observe(document.body, { childList: true, subtree: true });

  // 添加样式隐藏特定元素
  var style = document.createElement('style');
  style.innerHTML = `
    .mtw.mbw {
        display: none;
    }
  `;
  document.head.appendChild(style);

})();

