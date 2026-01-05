// SkyscraperCity new threads opener
// version 1.0.8
// 2020-04-29
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "SkyscraperCity new threads opener", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          skyscrapercity unread threads opener
// @description   open unread threads in separates tab
// @include       https://www.skyscrapercity.com/tags.php*
// @include       https://www.skyscrapercity.com/subscription.php*
// @include       https://www.skyscrapercity.com/watched/*
// @include       https://www.skyscrapercity.com/forums/*
// @version       1.0.9
// @namespace     http://broman.pl/gmscripts/skyscraper-opener
// @grant         GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/1720/skyscrapercity%20unread%20threads%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/1720/skyscrapercity%20unread%20threads%20opener.meta.js
// ==/UserScript==

console.log('Start of GM script');

openingTabsInterval = null;
linksForInterval = [];

(function() {

	console.log ('script start');
	var threadTable = getTable();

  if (getAllUnread() > 0) {
    var openAllLinks = document.createElement('a');
    openAllLinks.href = '#';
    openAllLinks.id = 'link-opener';
    openAllLinks.addEventListener('click', openAllUnread, false);
    openAllLinks.appendChild(document.createTextNode('Open All unread threads   '));
    var divLink = document.createElement('div');
    divLink.classList.add("block-outer-opposite");
    divLink.setAttribute("style", "margin-right:10px;margin-top:7px;"); 
    divLink.appendChild(openAllLinks);


    var menuDiv = threadTable.previousElementSibling;
    if (menuDiv == null) {
      console.log ('no place for button');

    }
    var otherButton = menuDiv.querySelector('div.california-outer-upper-nav');

    menuDiv.insertBefore(divLink,otherButton);
    //menuDiv.appendChild(divLink);

  } else {
    console.log("no links to open");
  }

})();

function getAllUnread() {
    return openAllUnread(1)
}

function openingTabs() {
  if (linksForInterval.length > 0) { 
    var tabLink = linksForInterval.shift();
  	GM.openInTab(tabLink, true);
  } else {
    clearInterval (openingTabsInterval);
  }
}

function openAllUnread(callType) {
    var toOpen = 0;
    var threadTable = getTable();

    if (threadTable !== null) {
      console.log ('threadTable exist');
      var rows = threadTable.querySelectorAll("div.is-unread[qid='thread-item']");
      var rowsCount = rows.length;

      for(var i=0; i<rowsCount;i++){
          var row = rows[i];
          var titleLink = row.querySelector("a[qid='thread-item-title']");
          if(callType != 1) {
              linksForInterval.push(titleLink.href);
              titleLink.style.color="";
            	row.classList.remove("is-unread");
          } else {
            titleLink.style.color="#bb86fc";
          }

       }
      if (linksForInterval.length > 0) {
        // adding some time delay for link openings to avoid toomany requests errors
      	openingTabsInterval = setInterval(openingTabs, 200);
      }

      if (callType == 1) {
          console.log ('links to open');
          return rowsCount;
        }      
    }
}

function getTable() {
	var threadTable = document.querySelector("div[qid='followed-discussions-section']");
  if (threadTable === null) {
		var threadTable = document.querySelector("div[qid='forum-page-thread-items']");
    if (threadTable != null) {
      threadTable = threadTable.parentNode;
      threadTable = threadTable.parentNode;
      threadTable = threadTable.parentNode;    
    }
  }
  
  if (threadTable === null) {
		var threadTable = document.querySelector("div[qid='thread-item-parent']");
    if (threadTable != null) {
      threadTable = threadTable.parentNode;
      threadTable = threadTable.parentNode;
      threadTable = threadTable.parentNode;
    }
  }
  
  if (threadTable == null) {
    console.log("no thread table");
  }
  return threadTable;
}

console.log('End of GM script');