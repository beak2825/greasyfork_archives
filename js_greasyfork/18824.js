// ==UserScript==
// @name        No Wiki Wandering
// @name:zh-CN  阻止维基漫游
// @namespace   hghwng
// @version     1
// @grant       none
// @include     *.wikipedia.org/wiki/*
// @description Prevent Wikipedia wandering. Show a dialog when you try to visit a new page, and the action is prevented. No wandering, more productivity!
// @description:zh-CN 防止维基百科漫游。在尝试访问新页面时弹框报警，并阻止加载。离开漫游，拥抱效率！
// @downloadURL https://update.greasyfork.org/scripts/18824/No%20Wiki%20Wandering.user.js
// @updateURL https://update.greasyfork.org/scripts/18824/No%20Wiki%20Wandering.meta.js
// ==/UserScript==

(function () {
  var startTime = Date.now();
  
  document.addEventListener('click', function (e) {
    var target = e.target;
    while (target) {
      if (target.tagName == 'A') break;
      target = target.parentNode;
    }
    if (target.tagName != 'A') return;
    
    var targetUrl = target.href;
    var currentUrl = window.location.origin + window.location.pathname;
    if (targetUrl.startsWith(currentUrl)) {
      if (targetUrl.length <= currentUrl.length) return;
      if (target.href[currentUrl.length] == '#') return;
    }
    
    var diff = (Date.now() - startTime) / 1000;
    alert("You have wasted " + diff.toFixed() + " seconds on Wikipedia!");
    e.preventDefault();
  })
})()
