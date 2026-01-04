
// ==UserScript==
// @name         greasyfork自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  greasyfork auto Login
// @include      *://*.greasyfork.org/*
// @include      *://greasyfork.org/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435265/greasyfork%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435265/greasyfork%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(async () => {
    //获取当前所有cookie
  var strCookies = document.cookie;        
  if (strCookies.indexOf("8888")==-1) {
    document.cookie="locale_messaged=true;domain=greasyfork.org;path=/;";
    document.cookie="_greasyfork_session=pubIgQw0PZFlZZS2s1cjwEUN4niBbqgR4pJUOlFh2J%2FPDlH6uK7fMKjDfVe5n2tfXs3xB1jAkZXInj0ZQl1gtIhbWtrgzicSbUOMWYmugtEm8Az0iTW3UNVFUuz8LJhXc4Pwp5jvLCdBHPdNo1hRf0wtZ99%2Bz%2FSg1qR7HC9G2F7cWF5DCcnSBZvCFSzGnsBW6WN3zWgNtLlqLCVxXwHNQ4cA1ANd4c50ubbdO30fJceMi6pM%2B5jEWCVmVfU%2BmuI6Rg0Ei51Kt6KAV5lC04L3kMe7fL%2FIIBr4b4p6YLu3dYlzHnavfx7Mhq6%2F7w9XuX3oGNHtWrnmHqByczmiH2nKGJP%2BAw5wBVgkuq821jDfhuOp%2BR6uRa6C%2FNT9x4XQELA8KNvLllNnogEJbZQBpMUIPCrZDfCJ32TT2ISE%2FFCN6GndFf3s5G7yv8425aWo%2F3X0g7E7--kvCpaG2QB8JIal7w--f3NxeJOjwE4IXk3DfMhYCA%3D%3D;domain=greasyfork.org;path=/;";
    document.cookie="8888=8888;domain=greasyfork.org;path=/;";
    location.reload();
  }   
}) ();