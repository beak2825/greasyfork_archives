// ==UserScript==
// @name         Bilibili直播-隐藏黑名单用户直播间
// @version      0.86
// @namespace    user7777
// @description  方便用户在B站直播列表中隐藏掉黑名单列表中的用户直播间
// @match        https://live.bilibili.com/p/eden/*
// @match        https://live.bilibili.com/all
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/500176/Bilibili%E7%9B%B4%E6%92%AD-%E9%9A%90%E8%97%8F%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/500176/Bilibili%E7%9B%B4%E6%92%AD-%E9%9A%90%E8%97%8F%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  const blackUsers = await getUserBlackList();
  const getListContainer = () => document.querySelector('#room-card-list');

  const observerInst = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(handleRoomElement);
      }
    }
  });

  const linkObserverInst = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'href' &&
        mutation.oldValue !== mutation.target.href
      ) {
        removeSessionId(mutation.target);
      }
    }
  });

  const addLinkObserver = (anchor, observe) => {
    observe.observe(anchor, { attributes: true, childList: false, attributeOldValue: true });
  };
  
  const timer = setInterval(() => {    
	  if (getListContainer() !== null) {	  
			getListContainer().childNodes.forEach((node) => {
				handleRoomElement(node);
				addLinkObserver(node.firstChild, linkObserverInst);
			});

			observerInst.observe(getListContainer(), { childList: true, attributes: false });
			clearInterval(timer)
	  }
  }, 100)
  


  function removeSessionId(node) {
    node.href = node.href.replace(/(.*)\?.*/, '$1');
  }

  function isBlackRoom(node) {
    return blackUsers.some((user) => getLiveRoomUserName(node) === user.uname);
  }

  function getLiveRoomUserName(node) {
    return node.querySelector('.Item_nickName_KO2QE').innerText.trim();
  }

  function hideRoom(node) {
    node.style.display = 'none';
  }

  function handleRoomElement(node) {
    const anchor = node.firstChild;

    if (isBlackRoom(anchor)) {
      hideRoom(node);
    }

    removeSessionId(anchor);
  }

  async function getUserBlackList() {
    return new Promise(async (resolve, reject) => {
			let userCount = -1
			let userList = []
			let page = 1
			while (userCount !== userList.length) {
				const {list, total} = await requestUserBlackList(page)
				userCount = total
				if (list.length > 0) {
					list.forEach(item => userList.push(item))
					page++
				}
			}
			
			resolve(userList)
    });
  }
	
	async function requestUserBlackList(page) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
        method: 'get',
        url: `https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`,
        responseType: 'json',
        onload: function (response) {
          if (response.status !== 200) {
            reject();
            return;
          }
          resolve(response.response.data);
        }
      });
		})
	}
})();
