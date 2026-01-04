// ==UserScript==
// @name     Remove Stackoverflow Sidebar
// @description Remove the sidebar and stretch the main content so that it fills the whole width, better when you have a browser window open next to your code and it's too narrow to see much with all the wasted space.
// @version  1
// @grant    none
// @include        http*://stackoverflow.com/questions/*
// @include        http*://serverfault.com/questions/*
// @include        http*://superuser.com/questions/*
// @include        http*://stackapps.com/questions/*
// @include        http*://meta.stackoverflow.com/questions/*
// @include        http*://*.stackexchange.com/questions/*
// @include        http*://askubuntu.com/questions/*
// @include        http*://answers.onstartups.com/questions/*
// @include        http*://meta.mathoverflow.net/questions/*
// @include        http*://mathoverflow.net/questions/*
// @namespace https://greasyfork.org/users/293891
// @downloadURL https://update.greasyfork.org/scripts/382104/Remove%20Stackoverflow%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/382104/Remove%20Stackoverflow%20Sidebar.meta.js
// ==/UserScript==

(function(d){
  var esidebar = d.getElementById('sidebar');
  var emainbar = d.getElementById('mainbar');

  esidebar.parentNode.removeChild(esidebar);
  emainbar.style.width = "100%"
  
})(document);
