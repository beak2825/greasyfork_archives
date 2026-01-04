// ==UserScript==
// @name         微博互关单独分组
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  微博默认好友圈只能刷到相互关注人的原创微博（偶尔能刷到转发，原理不明），将相互关注单独添加到一个分组再按该分组浏览微博可以实现专门刷互关的时间线
// @author       RaspberrYanagi
// @match        https://weibo.com/u/page/follow/*/followGroup
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/534793/%E5%BE%AE%E5%8D%9A%E4%BA%92%E5%85%B3%E5%8D%95%E7%8B%AC%E5%88%86%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/534793/%E5%BE%AE%E5%8D%9A%E4%BA%92%E5%85%B3%E5%8D%95%E7%8B%AC%E5%88%86%E7%BB%84.meta.js
// ==/UserScript==


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findButtonByText = targetText =>
  [...document.querySelectorAll('button')]
    .find(btn => btn.textContent.trim() === targetText);

const findModalCheckboxByText = targetText =>
  [...document.querySelector('.woo-modal-main').querySelectorAll('label')]
   .find(btn => btn.textContent.trim() === targetText);

const getGroupCheckList = () => document.querySelector("#scroller").parentElement.parentElement.parentElement.parentElement.__vue__.checkedList;

const submitGroupAction = async () => {
  await delay(1000);
  findButtonByText('设置分组').click()
  await delay(1000);
  if (!findModalCheckboxByText('相互关注').querySelector('input').checked){
      findModalCheckboxByText('相互关注').click();
      await delay(1000);
  }
  findButtonByText('确定').click();
  await delay(5000);
};

async function getFullList(options = {}) {
  const { maxRetries = 5, interval = 1000 } = options;

  let lastItemCount = 0;
  let retries = 0;

  const load = async () => {
    const currentItems = document.querySelector('#scroller').__vue__.items.length;

    if (currentItems === lastItemCount) {
      if (retries++ > maxRetries) {
        console.log("列表已完全加载");
        return true;
      }
    } else {
      retries = 0;
      lastItemCount = currentItems;
    }

    window.scroll({
      top: document.body.scrollHeight - window.innerHeight - 96 * 5,
      behavior: "smooth",
    });
    window.dispatchEvent(new Event("scroll"));

    await delay(1000);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    window.dispatchEvent(new Event("scroll"));

    await delay(interval);
    return load();
  };

  await load();
  return document.querySelector('#scroller').__vue__.items;
}

const onButtonClick = async (event) => {
  event.preventDefault();
  const weiboRegExp = /^https:\/\/weibo\.com\/u\/page\/follow\/\d+\/followGroup/;
  if (!weiboRegExp.test(window.location.href)) {
    alert("请在微博关注列表页面使用此脚本");
    return;
  }
  console.log("执行互关单独分组");
  const loadedFullList = await getFullList({ interval: 1500, maxRetries: 5 });
  //const loadedFullList = document.querySelector('#scroller').__vue__.items;
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  let groupChecklist = getGroupCheckList();
  let executeCounter = 0;
  findButtonByText('批量管理').click()
  await delay(1000);
  for (const i of loadedFullList) {
    const { idstr, follow_me, following } = i.item;
    if (groupChecklist.length >= 20) {
      await submitGroupAction();
      executeCounter += groupChecklist.length;
      groupChecklist = [];
      groupChecklist = getGroupCheckList();
    } else {
      if (follow_me && following) {
        groupChecklist.push(idstr);
      }
    }
  }

  await delay(3000);
  if (groupChecklist.length > 0) {
    await submitGroupAction();
    executeCounter += groupChecklist.length
  }

  console.log("关注清理完成");
  console.log(`操作了${executeCounter}个账号`);
  alert(`操作完成\n操作了${executeCounter}个账号`);
};

(function () {
  "use strict";
  const link = document.createElement("a");
  link.href = "javascript:void(0);";
  link.className = "x_follow";
  link.textContent = "将相互关注单独分组";
  Object.assign(link.style, {
    position: "fixed",
    right: "1%",
    bottom: "10%",
  });
  link.addEventListener("click", onButtonClick);
  document.documentElement.insertBefore(link, document.body);
})();
