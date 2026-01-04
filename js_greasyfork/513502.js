// ==UserScript==
// @name         自动化点击
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动点击
// @author       You
// @license      MIT
// @match        *://lms.ouchn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        window.close
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513502/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/513502/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var href = window.location.href;

  //主页
  if (href.indexOf('lms.ouchn.cn/user/courses#/') != -1) {

    //等待10秒
    setTimeout(() => {
      //获取课程列表
      var course_list_href = document.querySelectorAll('.course .course-name a');
      console.log(course_list_href.length);
      var course_list_index = 0;

      function clickCourse() {
        //获取课程网址
        var link = course_list_href[course_list_index].getAttribute('href');
        GM_openInTab('https://lms.ouchn.cn' + link);
        course_list_index++;

        //10循环结束点击下一页
        if (course_list_index == course_list_href.length) {


          function isElementHidden(selector) {
            var element = document.querySelector(selector);
            if (element) {
              return window.getComputedStyle(element).display === 'none';
            }
            return true; // 如果元素不存在，也认为是隐藏的
          }

          // 检查.next-page-button是否隐藏
          var isHidden = isElementHidden('.next-page-button');


          if (!isHidden) {
            var next_page = document.querySelector('.next-page-button a');
            next_page.click();
            //获取下一页的课程列表，并重置索引
            setTimeout(() => {
              course_list_href = document.querySelectorAll('.course .course-name a');
              console.log(course_list_href.length);
              course_list_index = 0;
            }, 2000);
          } else {
            document.querySelector('.first-page a').click();
            setTimeout(() => {
              course_list_href = document.querySelectorAll('.course .course-name a');
              console.log(course_list_href.length);
              course_list_index = 0;
            }, 2000);
          }
        }
      }

      setInterval(clickCourse, 38000);
    }, 6000);

  }

  //课程页面
  if (href.indexOf('ng#') != -1) {
    //等待页面元素加载
    setTimeout(() => {
      document.querySelector('.expand-collapse-all-button').click();
    }, 5000);
    setTimeout(() => {
      document.querySelector('.learning-activity a').click();
    }, 15000);
  }


  //课程详情页面
  //自动点击
  if (href.indexOf('learning-activity') != -1) {
    //等待5秒
    setTimeout(() => {
      function clickButton() {
        // 找到按钮元素，这里需要根据实际情况修改选择器
        var next_btn = document.querySelector('.next-btn'); // 请替换为你的按钮选择器
        if (next_btn) {
          // 模拟点击事件
          next_btn.click();
          console.log('按钮被点击');
        } else {
          console.log('未找到按钮');
        }
      }

      setInterval(clickButton, 3000);
    }, 7000);

    setTimeout(() => {
      window.close();
    }, 20000);
  }


})();