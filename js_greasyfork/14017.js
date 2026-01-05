// ==UserScript==
// @name        Add Bazaar Management Link
// @namespace   Assassin
// @description Adds a direct link to bazaar
// @include     *.torn.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14017/Add%20Bazaar%20Management%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/14017/Add%20Bazaar%20Management%20Link.meta.js
// ==/UserScript==

window.addEventListener("load", addBazaarLink, false);

function addBazaarLink () {
  var menu = document.getElementsByClassName('areas');
  menu[0].id = 'areas';
  
  //find the Areas menu
  var list = document.getElementById('areas');
  //find li's
  var subMenu = list.childNodes;
  //Create LI var 
  var addList = document.createElement('li');
  
  subMenu[1].appendChild(addList);

  addList.id = "Faction";
  addList.innerHTML = '<div class="list-link" id="nav-item-market"><a href="/bazaar.php#/p=add"><i class="items-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Manage Bazaar</span></a></div>';     
}
