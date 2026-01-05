// ==UserScript==
// @name        Douban Timeline Marker
// @namespace   https://github.com/henix/userjs/douban_feedmark
// @description You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author      henix
// @version     20200412.1
// @include     http://www.douban.com/*
// @include     https://www.douban.com/*
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/2661/Douban%20Timeline%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/2661/Douban%20Timeline%20Marker.meta.js
// ==/UserScript==

/**
 * ChangeLog:
 *
 * 2012-2-29	henix
 * 		don't listen on load event
 *
 * 2012-2-27	henix
 * 		change trigger action from "click" to "Ctrl-click"
 *
 * 2012-2-14	henix
 * 		add another yellow marker on the previous position, and it can't be removed
 *
 * 2012-2-14	henix
 * 		Version 0.1
 */

function insertSheet(ruleString, atstart) {
  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  var rules = document.createTextNode(ruleString);
  style.type = "text/css";
  if(style.styleSheet) {
    style.styleSheet.cssText = rules.nodeValue;
  } else {
    style.appendChild(rules);
  }
  if (atstart) {
    head.insertBefore(style, head.children[0]);
  } else {
    head.appendChild(style);
  }
}

var curMark;

function markItem(e) {
  if (curMark) {
    demarkItem();
  }
  e.classList.add('feedmarker');
  curMark = e;
}

function demarkItem() {
  curMark.classList.remove('feedmarker');
  curMark = null;
}

function getStatusId(e) {
  return e.getAttribute("data-sid") || e.getAttribute("data-aid");
}

function clickHandler(e) {
  if (!e) e = window.event;
  if (!e.ctrlKey) {
    return;
  }
  var tg = window.event ? e.srcElement : e.target;
  if (tg.nodeName === 'A') {
    return; // ignore clicks on <a>
  }
  if (curMark !== this) {
    markItem(this);
    localStorage.setItem("feedmarkid", getStatusId(this));
  } else {
    demarkItem();
    localStorage.removeItem("feedmarkid");
  }
}

insertSheet(
".feedmarker, .feedmarker-old { border: 1px dashed black }" +
".feedmarker-old { border-top: 20px solid #ff6 }" +
".feedmarker { border-top: 20px solid #ccc }"
);

var stitems = Array.prototype.slice.call(document.querySelectorAll("div.status-item"));

var oldId = localStorage.getItem('feedmarkid');
if (oldId) {
  var item = stitems.find(function(e) { return getStatusId(e) == oldId; });
  if (item) {
    item.classList.add("feedmarker-old");
  }
}

stitems.forEach(function(item) {
  item.addEventListener("click", clickHandler, true); // register for capturing
});
