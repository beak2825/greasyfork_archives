// ==UserScript==
// @name         国开学习登录
// @namespace    国开
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://passport.ouchn.cn/Account/Login*
// @match        http://study.ouchn.cn/login/index.php*
// @match        http://course.ougd.cn/login/index.php*
// @match        http://study.ouchn.cn/course/search.php?search*
// @match        http://course.ougd.cn/course/search.php?search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398972/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/398972/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

function loginOne() {
  var tip = document.querySelector('.alert-danger')
  if (tip && tip.innerText.includes('用户名或密码不正确')) {
    return;
  }

  var loc = window.location
  var queryStr = loc.search
  queryStr = queryStr.replace('?', '')
  var query = {}
  queryStr.split('&').forEach(key_value => {
    var arr = key_value.split('=')
    query[arr[0]] = arr[1]
  })

  if (!query.username || !query.password) {
    return;
  }

  var username = document.querySelector('#username')
  var password = document.querySelector('#password')

  username.value = query.username || ''
  password.value = query.password || ''

  var loginBtn = document.querySelector('button[value="login"]')
  loginBtn.click()
}

function loginTwo() {
  var notice = document.querySelector('#notice')
  if (notice && notice.innerText.includes('如果想登录为另一个用户，您必须先退出')) {
    var ex = new Date();ex.setTime(ex.getTime()-1);
    document.cookie = "MoodleSession=; expires="+ex.toGMTString() + ";path=/";
    window.location.reload();
  }


  // Your code here...
  var tip = document.querySelector('.alert-info')
  if (tip && tip.innerText.includes('用户名或密码不正确')) {
    return;
  }

  setTimeout(() => {
    var loc = window.location;
    var queryStr = loc.search;
    queryStr = queryStr.replace('?', '');
    var query = {};
    queryStr.split('&').forEach(key_value => {
      var arr = key_value.split('=');
      query[arr[0]] = arr[1];
    });

    if (!query.username || !query.password) {
      return;
    }

    var username = document.querySelector('#username');
    var password = document.querySelector('#password');

    username.value = query.username || '';
    password.value = query.password || '';

    var loginBtn = document.querySelector('#loginbtn');
    loginBtn.click();
  }, 1000);
}

function autoCourse1() {
  setTimeout(() => {
    document.querySelector('.class-box').querySelector('a').click();
  }, 1000);
}

function autoCourse2() {
  setTimeout(() => {
    document.querySelector('.coursebox').querySelector('a').click();
  }, 1000);
}

(function() {
  'use strict';
  if (window.location.href.includes('passport.ouchn.cn/Account/Login')) {
    loginOne();
  }

  if (
    window.location.href.includes('study.ouchn.cn/login/index.php') ||
    window.location.href.includes('course.ougd.cn/login/index.php')
  ) {
    loginTwo();
  }

  if (window.location.href.includes('study.ouchn.cn/course/search.php?search')) {
    autoCourse1();
  }

  if (window.location.href.includes('course.ougd.cn/course/search.php?search')) {
    autoCourse2();
  }

})();