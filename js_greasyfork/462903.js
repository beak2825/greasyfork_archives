// ==UserScript==
// @name         Linkedin Enhancer-Logo&Favicon invisiable
// @namespace    Feioura
// @author       Feioura
// @version      0.3
// @description  Enhance your LinkedIn experience with this script! Hide favicon & navbar on linkedin web page. Feel free to seek new oppotunities when you're at work. lol
// @match        https://www.linkedin.cn/*
// @match        https://www.linkedin.com/*
// @downloadURL https://update.greasyfork.org/scripts/462903/Linkedin%20Enhancer-LogoFavicon%20invisiable.user.js
// @updateURL https://update.greasyfork.org/scripts/462903/Linkedin%20Enhancer-LogoFavicon%20invisiable.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const hideElement = () => {
    const logoelement = document.querySelector('li-icon.ivm-view-attr__icon');
    if (logoelement) {
      logoelement.style.display = 'none'; // 设置样式隐藏元素
    }

      const cardDiv = document.querySelector('div.profile-card');
    if (cardDiv) {
      cardDiv.style.display = 'none';
    }
  };


  hideElement();
})();

//learn from adlered, change favicon & page title of linkedin to github.
    window.onload = function () {
    const fake_title = 'GitHub'
    const fake_icon = 'https://github.githubassets.com/favicon.ico'
    let link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link')
    window.document.title = fake_title
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = fake_icon
    document.getElementsByTagName('head')[0].appendChild(link)
    }