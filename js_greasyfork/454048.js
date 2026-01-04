// ==UserScript==
// @name        No More Sidebar in Mastodon 4.0
// @namespace   Violentmonkey Scripts
// @match       https://mas.to/*
// @match       https://bgme.me/*
// @match       https://bgme.bid/*
// @match       https://0rz.one/*
// @match       https://mstdn.social/*
// @match       https://o3o.ca/*
// @match       https://m.cmx.im/*
// @grant       none
// @version     2.1
// @author      mas.to/@Renn
// @description 10/31/2022, 2:47:56 PM
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454048/No%20More%20Sidebar%20in%20Mastodon%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/454048/No%20More%20Sidebar%20in%20Mastodon%2040.meta.js
// ==/UserScript==

// Make notification badge overlap the bell icon
// Fix scrollbar positions
for(let j = 0; j < document.styleSheets.length; j++) {
  if(document.styleSheets[j].href.endsWith('.chunk.css')) {
    document.styleSheets[j].insertRule('.icon-with-badge__badge { top: -1px !important; left: 0 !important; }');
//     document.styleSheets[j].insertRule('.columns-area--mobile .column, .columns-area--mobile .drawer { overflow-y: scroll !important; }');
//     document.styleSheets[j].insertRule('.columns-area__panels__main { max-height: 100vh !important; }');
//     document.styleSheets[j].insertRule('body.app-body.layout-single-column { overflow-y: hidden !important; }');
    break;
  }
}

// Wait for page to load otherwise it won't work
// Still won't work when not logged in, don't know why
window.addEventListener('load',() => {

  var headerlinks = document.getElementsByClassName('ui__header__links')[0];

  // F-off logo
  var hugeArseLogoToBeRemoved=document.getElementsByClassName("ui__header__logo")[0];
  hugeArseLogoToBeRemoved.parentNode.removeChild(hugeArseLogoToBeRemoved);

  // New div to rest navigations
  var topNavigationDiv = document.createElement("div");
  topNavigationDiv.setAttribute('class', 'ui__header__links');
  topNavigationDiv.style['overflow-x'] = 'scroll';
  topNavigationDiv.style['overflow-y'] = 'hidden';
  topNavigationDiv.style['padding-top'] = '14px';
  topNavigationDiv.style['padding-left'] = '6px';
  topNavigationDiv.style['gap'] = '0';
  var topbar = document.getElementsByClassName('ui__header')[0];
  topbar.insertBefore(topNavigationDiv, headerlinks);

  // Move navigations into the new div
  var sidebarItems = document.getElementsByClassName('column-link--transparent');
  Array.from(sidebarItems).forEach(moveToTopBar);
  function moveToTopBar(item, index, arr) {
    item.parentNode.removeChild(item);
    item.style['min-width'] = '11px';
    topNavigationDiv.appendChild(item);
  }

  // Remove sidebar
  var sidebar = document.getElementsByClassName('columns-area__panels__pane columns-area__panels__pane--start columns-area__panels__pane--navigational')[0];
  sidebar.parentNode.removeChild(sidebar);

  // Resize mainpanel to the proper size
  var mainPanel = document.getElementsByClassName('columns-area__panels__main')[0];
  mainPanel.style['width'] = '100%';

  // Replace post button with pencil icon
  // Haven't found a way to set it again after returning from the posting page
  // var postButton = headerlinks.getElementsByClassName('button')[0];
  // postButton.style['width'] = '35px';
  // postButton.style['height'] = '35px';
  // postButton.style['padding-left'] = '12px';
  // postButton.style['text-overflow'] = 'clip';
  // var pencilIcon = document.createElement('i');
  // pencilIcon.classList.add('fa');
  // pencilIcon.classList.add('fa-pencil');
  // postButton.replaceChild(pencilIcon, postButton.childNodes[0])

});
