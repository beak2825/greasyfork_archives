// ==UserScript==
// @name        TPC Sticky User Toolbar
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     1.0.8
// @description Transforms "User Options" on the left sidebar into a toolbar that sticks to the top
// @author      Velarde, Louie C.
// @match       https://tipidpc.com/*
// @icon        https://www.google.com/s2/favicons?domain=tipidpc.com&sz=64
// @license     LGPL-3.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/18102/TPC%20Sticky%20User%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/18102/TPC%20Sticky%20User%20Toolbar.meta.js
// ==/UserScript==

var userOptions = document.getElementById('user-options');
if (!userOptions) return;
userOptions.remove();

var userOptionsList = userOptions.getElementsByTagName('ul')[0];

userOptionsList.id = 'user-options-list';
GM_addStyle('#user-options-list {background-color:#E80; border-bottom:1px solid #333; box-sizing:border-box; padding:0.5em; top:0;}');
GM_addStyle('#user-options-list li {background-image:none; display:inline; margin-bottom:0;}');
GM_addStyle('#user-options-list li:last-of-type {float:right; margin-right:10px;}');
GM_addStyle('#user-options-list li a {color: #fff;}');

var container = document.getElementById('container');
var header = document.getElementById('header');

var anchor = document.createElement('div');
header.appendChild(anchor);
header.appendChild(userOptionsList);

var icon = (function() {
  var icon = document.createElement('img');
  icon.src = 'favicon.ico';
  icon.style.verticalAlign = 'middle';

  var link = document.createElement('a');
  link.href = '/index.php';
  link.style.marginLeft = '10px';

  link.appendChild(icon);
  return link;
})();

function updateUserOptionsListPosition() {
  var scrolledAmount = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  if (scrolledAmount > anchor.offsetTop) {
    if (userOptionsList.style.position != 'fixed') {
      userOptionsList.style.position = 'fixed';
      anchor.style.height = userOptionsList.offsetHeight + 'px';
      // userOptionsList.insertBefore(icon, userOptionsList.children[0]);
    }
  } else {
    if (userOptionsList.style.position != 'static') {
      userOptionsList.style.position = 'static';
      anchor.style.height = '0';
      // userOptionsList.removeChild(icon);
    }
  }
}

function updateUserOptionsListWidth() {
  userOptionsList.style.width = container.offsetWidth + 'px';
}

window.addEventListener('scroll', updateUserOptionsListPosition);
window.addEventListener('resize', updateUserOptionsListWidth);

updateUserOptionsListPosition();
updateUserOptionsListWidth();