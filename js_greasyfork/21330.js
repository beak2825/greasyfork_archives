// ==UserScript==
// @name        Add Notebook link
// @namespace   Sil3nced
// @description Adds a direct link to your Notebook
// @include     *.torn.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21330/Add%20Notebook%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/21330/Add%20Notebook%20link.meta.js
// ==/UserScript==

window.addEventListener("load", addNotebookLink, false);

function addNotebookLink () {
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
  addList.innerHTML = '<div class="list-link" id="nav-notebook"><a href="/notebook.php"><i class="notebook-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Notebook</span></a></div>';     
}