// ==UserScript==
// @name        Add Reddit Message Sorting Links
// @namespace   AddRedditMessageSortingLinks
// @description Add links for sorting user messages (excluding sent) in Reddit.
// @version     1.0.1
// @author      jcunews
// @include     https://www.reddit.com/message/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29030/Add%20Reddit%20Message%20Sorting%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/29030/Add%20Reddit%20Message%20Sorting%20Links.meta.js
// ==/UserScript==

(function(){
  var eleLinkTemplate = document.querySelectorAll(".menuarea li:not(.selected)"), eleMenu;

  function compareTitle(ele1, ele2) {
    var e1 = ele1.querySelector(".title"), e2 = ele2.querySelector(".title");
    if (!e1) e1 = ele1.querySelector(".subject-text");
    e1 = e1.textContent.toLowerCase();
    if (!e2) e2 = ele2.querySelector(".subject-text");
    e2 = e2.textContent.toLowerCase();
    if (e1 < e2) {
      return -1;
    } else if (e1 > e2) {
      return 1;
    } else return 0;
  }

  function compareUser(ele1, ele2) {
    ele1 = ele1.querySelector(".author,.correspondent>a").textContent.toLowerCase();
    ele2 = ele2.querySelector(".author,.correspondent>a").textContent.toLowerCase();
    if (ele1 < ele2) {
      return -1;
    } else if (ele1 > ele2) {
      return 1;
    } else return 0;
  }

  function compareSub(ele1, ele2) {
    var e1 = ele1.querySelector(".subreddit>a");
    e1 = e1 ? e1.href.toLowerCase() : "";
    e2 = ele2.querySelector(".subreddit>a");
    e2 = e2 ? e2.href.toLowerCase() : "";
    if (!e1 && !e2) return compareTime(ele1, ele2);
    if (e1 < e2) {
      return -1;
    } else if (e1 > e2) {
      return 1;
    } else return 0;
  }

  function compareTime(ele1, ele2) {
    ele1 = new Date(ele1.querySelector(".live-timestamp,time").getAttribute("datetime"));
    ele2 = new Date(ele2.querySelector(".live-timestamp,time").getAttribute("datetime"));
    if (ele1 < ele2) {
      return 1;
    } else if (ele1 > ele2) {
      return -1;
    } else return 0;
  }

  function doSort() {
    var eles = Array.prototype.slice.call(document.querySelectorAll("#siteTable>.thing")), i;
    if (!eles.length) return;
    var list = eles[0].parentNode;
    switch (this.getAttribute("by")) {
      case "title": eles.sort(compareTitle); break;
      case "user": eles.sort(compareUser); break;
      case "sub": eles.sort(compareSub); break;
      default: eles.sort(compareTime);
    }
    eles.forEach(function(val, idx) {
      list.insertBefore(val, list.children[idx]);
    });
  }

  if (!eleLinkTemplate.length) return;
  eleLinkTemplate = eleLinkTemplate[eleLinkTemplate.length-1];
  eleMenu = eleLinkTemplate.parentNode;
  [
    { caption: "Sort by title", by: "title" },
    { caption: "Sort by user", by: "user" },
    { caption: "Sort by subreddit", by: "sub" },
    { caption: "Sort by time", by: "time" }
  ].forEach(function(val, idx) {
    var menuitem = eleLinkTemplate.cloneNode(true), link = menuitem.lastElementChild;
    if (!idx) {
      menuitem.style.marginLeft = "3ex";
      menuitem.removeChild(menuitem.firstElementChild);
    }
    link.textContent = val.caption;
    link.setAttribute("by", val.by);
    link.href = "javascript:void(0)";
    link.onclick = doSort;
    eleMenu.appendChild(menuitem);
  });
})();
