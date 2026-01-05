// ==UserScript==
// @name        Sort Feedly by Popularity
// @namespace   scturtle
// @match       *://*.feedly.com/*
// @version     1
// @description Sort Feedly items by popularity.
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13983/Sort%20Feedly%20by%20Popularity.user.js
// @updateURL https://update.greasyfork.org/scripts/13983/Sort%20Feedly%20by%20Popularity.meta.js
// ==/UserScript==
var mysort = function (event) {
  var col = document.querySelector('div#section0_column0');
  var items = col.querySelectorAll('div.u0Entry');
  items = Array.prototype.slice.call(items);
  items.sort(function (it1, it2) {
    var p1 = parseInt(it1.querySelector('.recommendationInfo > span').getAttribute('data-engagement'));
    var p2 = parseInt(it2.querySelector('.recommendationInfo > span').getAttribute('data-engagement'));
    return (p1 < p2) ? true : false;
  });
  var div = document.createElement('div');
  items.forEach(function (it) {
    div.appendChild(it)
  });
  col.innerHTML = div.innerHTML;
}
var cnt = 0;
var wait = function () {
  cnt += 1;
  var bar = document.querySelector('div.pageActionBar');
  if (bar === null) {
    setTimeout(wait, 1000);
  } else {
    var span = document.createElement('span');
    span.style = 'font-size: 20px; vertical-align: 5px;';
    span.textContent = '▼';
    span.className = 'pageAction';
    span.addEventListener('click', mysort);
    document.querySelector('div.pageActionBar').insertBefore(span, bar.children[0]);
  }
};
wait();