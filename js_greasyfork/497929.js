// ==UserScript==
// @name         屏蔽B站营销视频和推广视频
// @name:zh-CN   屏蔽B站营销视频和推广视频
// @name:zh-TW   屏蔽B站营销视频和推广视频
// @name:en      Block Bilibili's marketing videos and promotional videos
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  屏蔽部分B站（bilibili）主页推荐的视频卡片，屏蔽up主粉丝少于一定数量的，屏蔽直播与右侧推广，屏蔽带广告标签的
// @description:zh-CN  屏蔽部分B站（bilibili）主页推荐的视频卡片，屏蔽up主粉丝少于一定数量的，屏蔽直播与右侧推广，屏蔽带广告标签的
// @description:zh-TW  遮罩部分B站（bilibili）主頁推薦的視頻卡片，遮罩up主粉絲少於一定數量的，遮罩直播與右側推廣，遮罩帶廣告標籤的
// @description:en     Block some video cards recommended on the homepage of Bilibili. The rules are to block those from creators with a certain number of small fans, block live streams and right-hand promotion, and block those with advertising tags.
// @author       anonymous
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/497929/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%90%A5%E9%94%80%E8%A7%86%E9%A2%91%E5%92%8C%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/497929/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%90%A5%E9%94%80%E8%A7%86%E9%A2%91%E5%92%8C%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

//async functions' is only available in ESS (use 'esversion: 8').


(function () {
  'use strict';


  // 定义需要筛选屏蔽的视频卡片类名
  const FILTER_CLASSES = ['.bili-feed-card'];
  // 定义需要直接直接屏蔽的直播类名
  const FILTER_BLOCK_CLASSES = ['.floor-single-card'];
  // 定义需要直接屏蔽的作者uid
  const FILTER_BLOCK_UIDS = [];
  // 定义需要屏蔽的最小的follower数
  const MIN_FOLLOWER = 2000;
  // 定义接口前缀
  const API_USERDATA = 'https://api.bilibili.com/x/relation/stat?vmid=';

  // 定义已处理卡片数量
  let processedCards = 0;

  function getUid(card) {
    // 传入一个视频卡片，获取其中的uid并转化为数字并返回

    const ownerLink = card.querySelector('.bili-video-card__info--owner');
    if (ownerLink) {
      const uid = ownerLink.href.split('/').pop();

      if (uid.match(/^\d+$/)) {
        return Number(uid);
        // return uid;
      } else {
        //console.log(`🟢remove becouse can't get uid: ${processedCards}, uid: ${uid}`);
        logMessages += `🟢remove becouse can't get uid: ${processedCards}, uid: ${uid}\n`;
        return -1;
      }
    }

    //console.log(`🟢remove becouse can't get ownerLink, processedCards: ${processedCards}, ownerLink: ${ownerLink}`);
    logMessages += `🟢remove becouse can't get ownerLink, processedCards: ${processedCards}, ownerLink: ${ownerLink}\n`;
    return -1;
  }


  async function getFollower(uid) {
    // 传入uid，返回follower数
    const response = await fetch(`${API_USERDATA}${uid}`);
    //console.log(`🟢getFollower, uid: ${uid}` + response);
    logMessages += `🟢getFollower, uid: ${uid}\n`;
    const data = await response.json();
    if (data.code === 0) {
      return data.data.follower;
    } else {
      //console.log(`🔴getFollower error, uid: ${uid}, message: ${data.message}`);
      logMessages += `🔴getFollower error, uid: ${uid}, message: ${data.message}\n`;
      return -1;
    }
  }

  // 对于每一个card，获取uid，然后获取follower，如果follower小于MIN_FOLLOWER，就remove
  // 未能获取到uid或者follower的，也remove
  // 不满足上面需要remove的，就processedCards++
  // 进行异步处理，增加加载速度
  async function editCards(card) {
    processedCards++;
    // 根据uid获取follower 并进行筛选
    const uid = getUid(card);
    if (uid === -1) {
      //console.log(`🟢remove because getUid error, uid: ${uid}`);
      logMessages += `🟢remove because getUid error, uid: ${uid}\n`;
      removeCard(card);
      return;
    }

    // 如果uid在FILTER_BLOCK_UIDS中，直接remove
    if (FILTER_BLOCK_UIDS.includes(uid)) {
      logMessages += `🟢remove because uid in FILTER_BLOCK_UIDS, uid: ${uid}\n`;
      removeCard(card);
      return;
    }

    const follower = await getFollower(uid);
    if (follower === -1) {
      console.log(`🔴keep because getFollower error, uid: ${uid}`)
      return;
    }
    if (follower < MIN_FOLLOWER) {
      //console.log(`🟢remove because follower < ${MIN_FOLLOWER}, uid: ${uid}, follower: ${follower}`);
      logMessages += `🟢remove because follower < ${MIN_FOLLOWER}, uid: ${uid}, follower: ${follower}\n`;
      removeCard(card);
      return;
    }
  }

  async function removeCard(card){
    card.remove();
    // card.style.border = '1px solid red'; // 添加红色边框以示例
  }

  function removeIfBlockByADBlocker(card) {
    // 检查卡片是否被广告屏蔽
    const cardContent = card.querySelector('.bili-video-card.is-rcmd');
    // cardContent && (cardContent.style.border = '1px solid blue'); // 添加蓝色边框以示例
    if (!cardContent || cardContent.innerHTML.match(/<!----><div class=".+?"><\/div><!---->/)) {
      removeCard(card);
      return true; // 返回true表示卡片被广告屏蔽
    }
    return false; // 返回false表示卡片未被广告屏蔽
  }

  let isProcessing = false;
  
  // 创建Intersection Observer实例
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 处理进入视口的元素
        editCards(entry.target);
        // 处理完毕后，停止观察该元素
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px', threshold: 0.2 }); // 可以根据需要调整配置


  // 对新加载的内容进行观察
  function observeNewCards() {
    const blockCards = document.querySelectorAll(FILTER_BLOCK_CLASSES.join(', '));
    blockCards.forEach(card => {
      removeCard(card);
    });
    const filterCards = document.querySelectorAll(FILTER_CLASSES.join(', '));
    filterCards.forEach(card => {
      // 对每一个card进行观察
      // 如果被广告屏蔽了，就直接remove，并不再进行处理
      if (removeIfBlockByADBlocker(card)) return;
      // 如果已经处理过了，就不再处理
      if (card.dataset.processed) return;
      observer.observe(card);
      // 标记为已处理
      card.dataset.processed = true
    });
  }

  // 使用MutationObserver来监听新内容的加载，并调用observeNewCards
  const mutationObserver = new MutationObserver((mutations) => {
    // 如果正在处理中，就不再处理, 避免检测到自己remove时发生的变化，导致重复加载
    if (isProcessing) return;
    isProcessing = true;

    logMessages += `🤓mutationObserver, mutations: ${mutations.length}\n`;
    //console.log(`🤓mutationObserver, mutations: ${mutations.length}`);

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        observeNewCards();
      }
    });
    isProcessing = false;
  });

  //监控 class="container is-version8" 的元素
  mutationObserver.observe(document.querySelector('.container.is-version8'), {
    childList: true,
  });

  // 页面加载完成后，立即执行一次，以观察初始内容
  observeNewCards();


  // 自定义 log 函数，每5s 输出一次debug，防止控制台输出过多
  let logMessages = '';
  setInterval(() => {
    if (logMessages === '') return;
    console.log(logMessages);
    logMessages = '';
  }, 10000);
})();