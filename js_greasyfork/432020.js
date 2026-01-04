// ==UserScript==
// @name        拷贝漫画简易阅读
// @namespace   http://tampermonkey.net/
// @match       *://*.copymanga.com/comic/*/chapter/*
// @match       *://*.copymanga.org/comic/*/chapter/*
// @match       *://*.copymanga.site/comic/*/chapter/*
// @match       *://*.copymanga.tv/comic/*/chapter/*
// @match       *://*.mangacopy.com/comic/*/chapter/*
// @match       *://*.2025copy.com/comic/*/chapter/*
// @grant       none
// @version     1.26
// @author      chemPolonium
// @description 简单的拷贝漫画阅读器，J/K 翻页，左右方向键改变章节，分号键奇偶切换，1/2 改变单双页
// @run-at      document-end
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/432020/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E7%AE%80%E6%98%93%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/432020/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E7%AE%80%E6%98%93%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint multistr: true */
(function() {
  'use strict';

  document.getElementsByClassName('header')[0].remove();

  let comicContainerFluid = document.getElementsByClassName('container-fluid comicContent')[0];
  comicContainerFluid.style.paddingRight = '0px';
  comicContainerFluid.style.paddingLeft = '0px';

  let comicContainer = comicContainerFluid.children[0];
  comicContainer.style.marginRight = '0px';
  comicContainer.style.marginLeft = '0px';
  comicContainer.style.setProperty('min-width', '10px', 'important');
  comicContainer.style.setProperty('max-width', '100%', 'important');

  let comicList = comicContainer.children[0];
  comicList.style.paddingTop = '0px';
  comicList.style.marginBottom = '0px';
  comicList.style.setProperty('min-width', '10px', 'important');
  comicList.style.setProperty('max-width', '100%', 'important');
  comicList.style.setProperty('width', '100%', 'important');
  comicList.style.display = 'grid';
  comicList.style.direction = 'rtl';

  let comicListChildren = comicList.children;
  let currentImageIndex = 0;

  let comicIndex = document.getElementsByClassName('comicIndex')[0];

  function refreshIndex() {
    comicIndex.textContent = currentImageIndex;
  }

  function getImage(imageIndex) {
    return comicListChildren[imageIndex].children[0];
  }

  function getCurrentImage() {
    return getImage(currentImageIndex);
  }

  function moveToCurrentImage() {
    if (currentImageIndex == 0) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, getCurrentImage().offsetTop);
    }
  }

  let pageNumPerScreen = 2;

  function preloadImage() {
    // simulate the scroll for preload
    // the script is like this: total client height / 3 < window scrollY then not load
    // so first scroll Y to 0
    window.scrollTo(0, 0);
    for (let i = 0; i < pageNumPerScreen; i++) {
      // window.dispatchEvent(scrollEvent);
      window.onscroll();
      // dispatch the scroll event for preload
    }
    // this function will scroll Y to 0
  }

  function moveImageIndex(x) {
    let newImageIndex = currentImageIndex + x;
    if (newImageIndex < comicList.children.length && newImageIndex >= 0) {
      currentImageIndex = newImageIndex;
    }
  }

  function setSingleAlign(imageIndex) {
    if (pageNumPerScreen == 1)
    {
      comicListChildren[imageIndex].children[0].style.objectPosition = 'center';
      // ('style', 'text-align: center;');
    }
    if (pageNumPerScreen == 2)
    {
      comicListChildren[imageIndex].children[0].style.objectPosition = (imageIndex % 2 == 0) ? 'left' : 'right';
    }
  }

  function setAlign() {
    for (let imageIndex = 0; imageIndex < comicListChildren.length; imageIndex++) {
      setSingleAlign(imageIndex);
    }
  }

  function setPageNumPerScreen(pageNum) {
    comicList.style.gridTemplateColumns = 'repeat(' + String(pageNum) + ', 1fr)';
    moveToCurrentImage();
    pageNumPerScreen = pageNum;
    setAlign();
  }

  setPageNumPerScreen(2);

  function onePageDown() {
    preloadImage();
    moveImageIndex(pageNumPerScreen);
    moveToCurrentImage();
    refreshIndex();
  }

  function onePageUp() {
    moveImageIndex(-pageNumPerScreen);
    moveToCurrentImage();
    refreshIndex();
  }

  function createTitlePage() {
    let titlePage = document.createElement('li');
    let titlePageDiv = document.createElement('div');
    let titlePageTitle = document.createElement('p');
    titlePageTitle.appendChild(document.createTextNode(document.title));
    titlePageTitle.setAttribute('style', 'color: white;\
      font-size: xx-large;\
      max-width: 30vw;\
      margin-top: 30%;\
      margin-right: 20%;\
      white-space: normal;');
    titlePageDiv.appendChild(titlePageTitle);
    titlePage.appendChild(titlePageDiv);
    return titlePage;
  }

  function resizeImage(targetli) {
    targetli.style.height = '100vh';
    targetli.style.maxWidth = '100%';
    targetli.firstChild.style.setProperty('height', '100%', 'important');
    targetli.firstChild.style.setProperty('width', '100%', 'important');
    targetli.firstChild.style.objectFit = 'contain';
  }

  function setAllPages() {
    for (let i = 1; i < comicListChildren.length; i++) {
      if (comicListChildren[i].children[0]) {
        resizeImage(comicListChildren[i]);
      }
    }
  }

  let titlePage = createTitlePage();

  let parityChanged = false;

  function switchParity() {
    if (parityChanged) {
      comicListChildren[0].remove();
    } else {
      comicList.insertAdjacentElement('afterbegin', titlePage);
    }
    parityChanged = !parityChanged;
    setAlign();
    moveToCurrentImage();
  }

  let footer = document.getElementsByClassName('footer')[0];
  let footerChildren = footer.children;
  let prevChapterHref = footerChildren[1].children[0].href;
  let nextChapterHref = footerChildren[3].children[0].href;
  let chapterListHref = footerChildren[4].children[0].href;

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'ArrowRight':
        window.location = nextChapterHref;
        break;
      case 'ArrowLeft':
        window.location = prevChapterHref;
        break;
      case 'KeyK':
        onePageUp();
        break;
      case 'KeyJ':
        onePageDown();
        break;
      case 'KeyL':
        window.location = chapterListHref;
        break;
      case 'KeyR':
        setAllPages();
        break;
      case 'KeyF':
        toggleFullScreen();
        break;
      case 'Semicolon':
        switchParity();
        break;
      case 'Digit1':
        setPageNumPerScreen(1);
        break;
      case 'Digit2':
        setPageNumPerScreen(2);
        break;
      default:
        console.log('key: ' + event.key + ' code: ' + event.code);
    }
  });

  footer.remove();

  let firstLoad = true;

  const comicListObserverConfig = { childList: true };

  const firstLoadCallback = () => {
    if (firstLoad && comicListChildren.length > 0) {
      firstLoad = false;
      switchParity();
      // 有时脚本加载得慢，会导致前几页来不及修改大小，因此第一次直接全设置一遍
      setAllPages();
    }
  };

  const comicListCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      firstLoadCallback();
      for (const targetli of mutation.addedNodes) {
        resizeImage(targetli);
        // 一般一次也就加载一页或两页，加载两页的话只设置最后一页的左右是不够的
        setSingleAlign(comicListChildren.length - 2);
        setSingleAlign(comicListChildren.length - 1);
      }
    }
  };

  const comicListObserver = new MutationObserver(comicListCallback);

  comicListObserver.observe(comicList, comicListObserverConfig);

  // 有的时候会出现列表加载完了，脚本还没加载上的情况，这时候 MutationObserver 会失效
  // 这个时候就手动加个延时当作第一次调用
  setTimeout(firstLoadCallback, 50);

  // 下面是旧版的监听方式，已经被 observer 取代
  // comicList.addEventListener('DOMNodeInserted', (event) => {
  //   if (firstLoad && comicListChildren.length > 2) {
  //     firstLoad = false;
  //     switchParity();
  //   }
  //   resizeImage(event.target);
  //   // event.target.style.height = '100vh';
  //   // event.target.style.maxWidth = '100%';
  //   // event.target.firstChild.style.setProperty('height', '100%', 'important');
  //   // event.target.firstChild.style.setProperty('width', '100%', 'important');
  //   // event.target.firstChild.style.objectFit = 'contain';
  //   setSingleAlign(comicListChildren.length - 1);
  // });

})();