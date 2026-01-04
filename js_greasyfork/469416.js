// ==UserScript==
// @name         在Pixiv中使用滾輪翻頁
// @name:zh-TW   在Pixiv中使用滾輪翻頁
// @name:ja      Pixivのスクロールでページを自動的に切り替える
// @name:en      Pixiv Scroll with Mouse Wheel for Page Navigation
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  當你將滾輪滾動至頁面頂部或底部時觸發翻頁。在作者頁面自動展開作者所有作品。
// @description:zh-TW 當你將滾輪滾動至頁面頂部或底部時觸發翻頁。在作者頁面自動展開作者所有作品。
// @description:ja スクロールがページのトップまたはボトムに達した時に自動的にページを切り替えます。作者のページでは自動的に作者のすべての作品を展開します。
// @description:en Automatically switch pages when scrolling to the top or bottom of the page. Automatically expands all works by the artist on the artist's page.
// @author       Max
// @match        https://www.pixiv.net/*
// @exclude      https://www.pixiv.net/artworks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469416/%E5%9C%A8Pixiv%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/469416/%E5%9C%A8Pixiv%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==

function scrollToBottomAndRedirect() {
    var pageButtons = document.querySelectorAll('.sc-d98f2c-0.sc-xhhh7v-2.cCkJiq.sc-xhhh7v-1-filterProps-Styled-Component.kKBslM');
    var nextPageButton;
    if (pageButtons.length === 1) {
      nextPageButton = pageButtons[0];
    } else if (pageButtons.length >= 2) {
      nextPageButton = pageButtons[1];
    }
    if (nextPageButton) {
      nextPageButton.click();
      // console.log("已點擊下一頁按鈕:", nextPageButton);
    } else {
      // console.log("無法找到下一頁按鈕");
    }
  }

function scrollToTopAndRedirect() {
  var prevPageButton = document.querySelectorAll('.sc-d98f2c-0.sc-xhhh7v-2.cCkJiq.sc-xhhh7v-1-filterProps-Styled-Component.kKBslM')[0];
  if (prevPageButton) {
    prevPageButton.click();
    // console.log("已觸發上一頁按鈕:", prevPageButton);
  } else {
    // console.log("無法找到上一頁按鈕");
  }
}

function handleScroll() {
  var scrollThreshold = 2;

  var isBottom = document.documentElement.scrollHeight - window.innerHeight - window.pageYOffset <= scrollThreshold;
  if (isBottom) {
    scrollToBottomAndRedirect();
  }

  if (window.pageYOffset <= 0) {
    scrollToTopAndRedirect();
  }
}

window.addEventListener('scroll', handleScroll);

var buttonClicked = false;
function pressButtonAndWait() {
  var expandAllButton = document.querySelector('.sc-d98f2c-0.sc-s46o24-1.dAXqaU');
  if (expandAllButton && !buttonClicked) {
    console.log("找到按鈕:", expandAllButton);
    buttonClicked = true;
    expandAllButton.click();
  }
}
var counter = 0;
var intervalId = setInterval(function() {
  if (!buttonClicked) {
    pressButtonAndWait();
  }
  counter++;
  //console.log(counter);
  if (counter >= 20|| buttonClicked) {
    clearInterval(intervalId);
  }
}, 100);
