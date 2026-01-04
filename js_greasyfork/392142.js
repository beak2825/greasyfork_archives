// ==UserScript==
// @name         真·知乎屏蔽 Truly Zhihu Shield
// @namespace    https://github.com/Virtual-Dimension/TrulyShield/blob/master/TrulyZhihuShield.js
// @version      0.4.0
// @description  Shield information you don't want to see.
// @author       Ciyang
// @license      GPL-3.0
// @match        https://www.zhihu.com/*
// @match        http://www.zhihu.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/392142/%E7%9C%9F%C2%B7%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%20Truly%20Zhihu%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/392142/%E7%9C%9F%C2%B7%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%20Truly%20Zhihu%20Shield.meta.js
// ==/UserScript==

'use strict';

(() => {
  let getContentElement = () => { return document.getElementById('root'); };
  let isCard = (className) => {
    return className.search('NestComment') !== -1
      || className.search('Card') !== -1
      || className.search('List-item') !== -1
      || className.search('openComment') !== -1;
  };
  let mRequest = (method, href, fn) => {
    let xmlHttp = new window.XMLHttpRequest();
    xmlHttp.open(method, href, true);
    xmlHttp.onreadystatechange = () => { if (xmlHttp.readyState === 4 && xmlHttp.status === 200) { fn(xmlHttp.responseText); } };
    xmlHttp.send();
  };
  let userShieldMap = new Map();
  let excludeEditor = () => { return window.location.href.search("www.zhihu.com/people/") !== -1 || window.location.href.search("www.zhihu.com/org/") !== -1; };
  let getUserShielded = (username, href, fn) => {
    if (!userShieldMap.has(username)) {
      mRequest('get', href, (resText) => {
        let res = (resText.search('已屏蔽') !== -1);
        userShieldMap.set(username, res);
        fn(res);
      });
    } else {
      fn(userShieldMap.get(username));
    }
  };
  let shieldKeywords = [];
  let shieldCount = 0;
  let checkShielded = () => {
    let questionList = document.querySelectorAll('a[data-za-detail-view-element_name]');
    for (const question of questionList) {
      for (const item of shieldKeywords) {
        if (question.innerText.indexOf(item) !== -1) {
          let card = question;
          while (card.id !== 'root' && (!card.className || !isCard(card.className))) { card = card.parentElement; }
          if (card.id !== 'root') {
            card.remove();
            // Remove or Change to shield info
            ++shieldCount;
          }
          break;
        }
      }
    }
    let userList = document.getElementsByClassName('UserLink-link');
    for (const user of userList) {
      if (user.innerText && user.href) {
        let card = user;
        while (card.id !== 'root' && (!card.className || !isCard(card.className))) { card = card.parentElement; }
        if (card.id !== 'root') {
          ((userElement, cardElement) => {
            let url = new window.URL(userElement.href, window.location.href);
            getUserShielded(userElement.innerText, url.href, res => {
              if (res) {
                cardElement.remove();
                // Remove or Change to shield info
                ++shieldCount;
              }
            });
          })(user, card);
        }
      }
    }
  };
  let timer;
  let moCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(checkShielded, 50);
      }
    }
  };
  let observerConfig = { childList: true, subtree: true };
  let openFlag = false;
  let checkFullPageModal = () => {
    if (!openFlag && document.getElementsByClassName('Modal--fullPage').length) {
      openFlag = true;
      let modal = document.getElementsByClassName('Modal--fullPage')[0];
      let observer = new window.MutationObserver(moCallback);
      observer.observe(modal, observerConfig);
      if (timer) clearTimeout(timer);
      timer = setTimeout(checkShielded, 50);
    }
    if (!document.getElementsByClassName('Modal--fullPage').length) { openFlag = false; }
  };
  let downloadObject = (filename, object) => {
    let downloadElement = document.createElement('a');
    downloadElement.href = ['data:application/json;', window.JSON.stringify(object)];
    downloadElement.download = filename;
    downloadElement.click();
  };
  let addShieldMenu = () => {
    let shieldMenu = document.createElement('div');
    shieldMenu.style.border = 'solid 1px #0000001c';
    shieldMenu.style.position = 'fixed';
    shieldMenu.style.top = '10%';
    shieldMenu.style.left = '0.5%';
    shieldMenu.style.maxWidth = '40px';
    shieldMenu.style.textAlign = "center";
    let addButton = document.createElement('button');
    addButton.innerHTML = '<svg t=\"1573460096262\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1080\" width=\"32\" height=\"32\"><path d=\"M874.0352 149.956267C777.335467 53.256533 648.7552 0 512 0 375.236267 0 246.664533 53.248 149.956267 149.956267 53.256533 246.664533 0 375.236267 0 512s53.248 265.335467 149.956267 362.043733C246.664533 970.743467 375.236267 1024 512 1024s265.335467-53.248 362.043733-149.956267C970.743467 777.335467 1024 648.763733 1024 512s-53.256533-265.335467-149.9648-362.043733zM554.666667 469.333333V315.682133A42.606933 42.606933 0 0 0 512 273.066667a42.666667 42.666667 0 0 0-42.666667 42.615466V469.333333H315.682133A42.606933 42.606933 0 0 0 273.066667 512a42.666667 42.666667 0 0 0 42.615466 42.666667H469.333333v153.6512A42.606933 42.606933 0 0 0 512 750.933333a42.666667 42.666667 0 0 0 42.666667-42.615466V554.666667h153.6512A42.606933 42.606933 0 0 0 750.933333 512a42.666667 42.666667 0 0 0-42.615466-42.666667H554.666667z m259.029333 344.362667C733.115733 894.293333 625.962667 938.666667 512 938.666667c-113.962667 0-221.115733-44.381867-301.696-124.970667C129.706667 733.1072 85.333333 625.962667 85.333333 512c0-113.962667 44.381867-221.115733 124.970667-301.696C290.8928 129.706667 398.037333 85.333333 512 85.333333c113.962667 0 221.115733 44.381867 301.696 124.970667C894.293333 290.884267 938.666667 398.037333 938.666667 512c0 113.9712-44.381867 221.115733-124.970667 301.696z\" fill=\"#707070\" p-id=\"1081\"></path></svg>';
    addButton.style.margin = '1px';
    addButton.onclick = async () => {
      let res = window.prompt('输入想添加的屏蔽关键词，添加单个不需要输入引号。如果想添加多个请用\"[]\"包括并使用\",\"分割。可输入一个外链直接导入词库。', '[\"XXX\",\"YYY\"]');
      if (res === null || res === '') { return; }
      let cnt = 0;
      try {
        let url = new window.URL(res);
        res = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            headers: { "Accept": "application/json" },
            url: url.href,
            onload: (response) => { resolve(response.responseText); }
          });
        });
      } catch (err) { }
      try {
        res = window.JSON.parse(res);
        for (const str of res) {
          if (shieldKeywords.indexOf(str) === -1) {
            shieldKeywords.push(str);
            ++cnt;
          }
        }
      } catch (err) {
        if (shieldKeywords.indexOf(res) === -1) {
          shieldKeywords.push(res);
          ++cnt;
        }
      }
      if (cnt) { window.localStorage.setItem('TrulyShield', window.JSON.stringify(shieldKeywords)); }
      window.alert(['成功添加', cnt, "个屏蔽关键字"].join(''));
    };
    let removeButton = document.createElement('button');
    removeButton.innerHTML = '<svg t="1573478908483" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1066" width="32" height="32"><path d="M874.0352 149.956267C777.335467 53.256533 648.7552 0 512 0 375.236267 0 246.664533 53.248 149.956267 149.956267 53.256533 246.664533 0 375.236267 0 512s53.248 265.335467 149.956267 362.043733C246.664533 970.743467 375.236267 1024 512 1024s265.335467-53.248 362.043733-149.956267C970.743467 777.335467 1024 648.763733 1024 512s-53.256533-265.335467-149.9648-362.043733z m-60.330667 663.739733C733.1072 894.293333 625.962667 938.666667 512 938.666667c-113.962667 0-221.115733-44.381867-301.696-124.970667C129.706667 733.1072 85.333333 625.962667 85.333333 512c0-113.962667 44.381867-221.115733 124.970667-301.696C290.8928 129.706667 398.037333 85.333333 512 85.333333c113.962667 0 221.115733 44.381867 301.696 124.970667C894.293333 290.884267 938.666667 398.037333 938.666667 512c0 113.9712-44.381867 221.115733-124.970667 301.696zM273.066667 512c0-23.560533 19.029333-42.666667 42.615466-42.666667h392.635734A42.666667 42.666667 0 0 1 750.933333 512c0 23.560533-19.029333 42.666667-42.615466 42.666667H315.682133A42.666667 42.666667 0 0 1 273.066667 512z" fill="#707070" p-id="1067"></path></svg>'
    removeButton.style.margin = '1px';
    removeButton.onclick = () => {
      let res = window.prompt('输入想移除的屏蔽关键词，使用/all清空屏蔽关键词。');
      if (res === null || res === '') { return; }
      let res2 = res.toLowerCase();
      let cnt = 0;
      if (res2 === '/all') {
        cnt += shieldKeywords.length;
        shieldKeywords = [];
      } else {
        res2 = shieldKeywords.indexOf(res);
        if (res2 !== -1) {
          shieldKeywords.slice(res2, 1);
          ++cnt;
        }
      }
      if (cnt) { window.localStorage.setItem('TrulyShield', window.JSON.stringify(shieldKeywords)); }
      window.alert(['成功移除', cnt, "个屏蔽关键字"].join(''));
    };
    let downloadButton = document.createElement('button');
    downloadButton.innerHTML = '<svg t=\"1573465392430\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1579\" width=\"32\" height=\"32\"><path d=\"M725.333333 0H196.266667C111.786667 0 42.666667 69.12 42.666667 153.6v716.8c0 84.48 69.12 153.6 153.6 153.6h631.466666c84.48 0 153.6-69.12 153.6-153.6V256L725.333333 0z m170.666667 870.4c0 37.546667-30.72 68.266667-68.266667 68.266667H196.266667c-37.546667 0-68.266667-30.72-68.266667-68.266667V153.6c0-37.546667 30.72-68.266667 68.266667-68.266667h409.6v221.866667c0 37.546667 30.72 68.266667 68.266666 68.266667h221.866667v494.933333zM708.266667 290.133333c-9.386667 0-17.066667-7.68-17.066667-17.066666V85.333333l204.8 204.8H708.266667z\" fill=\"#4990EE\" p-id=\"1580\"></path><path d=\"M588.8 716.8H298.666667c-23.893333 0-42.666667 18.773333-42.666667 42.666667s18.773333 42.666667 42.666667 42.666666h290.133333c23.893333 0 42.666667-18.773333 42.666667-42.666666s-18.773333-42.666667-42.666667-42.666667zM256 571.733333c0 23.893333 18.773333 42.666667 42.666667 42.666667h426.666666c23.893333 0 42.666667-18.773333 42.666667-42.666667s-18.773333-42.666667-42.666667-42.666666H298.666667c-23.893333 0-42.666667 18.773333-42.666667 42.666666z\" fill=\"#707070\" p-id=\"1715\"></path></svg>'
    downloadButton.style.margin = '1px';
    downloadButton.onclick = () => { downloadObject("data.json", shieldKeywords); };
    let shieldCountElement = document.createElement('button');
    shieldCountElement.style.border = 'solid 1px #3498db';
    shieldCountElement.style.borderRadius = '50%';
    shieldCountElement.style.margin = '1px';
    shieldCountElement.style.overflow = 'hidden';
    shieldCountElement.style.width = '32px';
    shieldCountElement.style.height = '32px';
    setInterval(() => { shieldCountElement.innerText = shieldCount }, 500);
    shieldMenu.appendChild(addButton);
    shieldMenu.appendChild(removeButton);
    shieldMenu.appendChild(downloadButton);
    shieldMenu.appendChild(shieldCountElement);
    document.body.appendChild(shieldMenu);
  };
  let initShieldKeywords = () => {
    let res = [];
    try {
      let data = window.localStorage.getItem('TrulyShield');
      if (data && data.length) { res = window.JSON.parse(data); }
    } catch (err) {
      window.localStorage.setItem('TrulyShield', window.JSON.stringify(res));
    }
    shieldKeywords = res;
  };
  window.addEventListener('load', (event) => {
    initShieldKeywords();
    addShieldMenu();
    if (excludeEditor()) { userShieldMap.set(document.getElementsByClassName('ProfileHeader-name')[0].innerText, false); }
    if (timer) clearTimeout(timer);
    timer = setTimeout(checkShielded, 50);
    let targetNode = getContentElement();
    let observer = new window.MutationObserver(moCallback);
    observer.observe(targetNode, observerConfig);
    setInterval(checkFullPageModal, 10);
  });

})();
