// ==UserScript==
// @name         知乎上班摸鱼隐藏标题
// @namespace    http://zhihu.com
// @version      1.0
// @description  主页、问题、专栏页面，隐藏标题logo 缩小标题字体
// @author       adi1625
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411503/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/411503/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // home page: hide logo and title
  var func = function() {
    // hide logo
    var logoes = document.getElementsByClassName('ZhihuLogoLink')
    for (var i = 0; i < logoes.length; i++) {
      logoes[i].style.display = 'none';
    }

    // hide title
    var titleList = document.getElementsByClassName('ContentItem-title')
    for (var j = 0; j < titleList.length; j++) {
      titleList[j].style.fontSize = '14px';
      titleList[j].style.fontWeight = '200';
    }
  }

  func();

  // home page: hide when scroll
  window.onscroll = function () {
    func();
  }

  // Home Page
  var mainColumn = document.getElementsByClassName('Topstory-mainColumn'); // main
  if (mainColumn[0]) mainColumn[0].style.width = '1000px';

  var mainSidebar = document.getElementsByClassName('GlobalSideBar'); // sidebar
  if (mainSidebar[0]) mainSidebar[0].style.display = 'none';

  // Question
  var qMainCol = document.getElementsByClassName('Question-mainColumn'); // main col
  if (qMainCol[0]) qMainCol[0].style.width = '1000px';

  var qSidebar = document.getElementsByClassName('Question-sideColumn--sticky'); // sidebar
  if (qSidebar[0]) qSidebar[0].style.display = 'none';

  var qTitles = document.getElementsByClassName('QuestionHeader-title'); // title
  if (qTitles[0]) qTitles[0].innerHTML = '';
  if (qTitles[1]) qTitles[1].innerHTML = '';

  // post
  var postTitle = document.getElementsByClassName('Post-Title'); // Post title
  if (postTitle[0]) postTitle[0].style.fontSize = '14px';

  // page title
  var tags = document.getElementsByTagName('title'); // title
  if (tags[0]) tags[0].innerHTML = '新建文本文档';

})()
