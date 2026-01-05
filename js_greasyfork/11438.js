// ==UserScript==
// @name        YouTube - load more all
// @namespace   monnef.tk
// @description Adds a button to auto load all videos - in essence it repeatedly clicks "Load more" button.
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @require     http://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11438/YouTube%20-%20load%20more%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/11438/YouTube%20-%20load%20more%20all.meta.js
// ==/UserScript==

var myClass = "load-more-all";
var clickDelay = 1000;
var debug = false;

this.$ = this.jQuery = jQuery.noConflict(true);

function log(msg){
  if(debug){
    console.log("[LoadMoreAll]: " + msg);
  }
}

function getLoadMoreButton() {
  return $(".load-more-button");
}

function clickOnLoadMore() {
  getLoadMoreButton().each(function() {
    var e = $(this);
    var click = document.createEvent("MouseEvents");
    click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(click);
  });
}

function isLoading() {
  return getLoadMoreButton().hasClass("yt-uix-load-more-loading");
}

function tryClickAndReschedule() {
  if (getLoadMoreButton().length > 0) {
    if (!isLoading()) {
      log("Clicking.");
      clickOnLoadMore();
    } else {
      log("Still loading, skipping click.");
    }
    setTimeout(tryClickAndReschedule, clickDelay);
  } else {
    log("Ending auto-clicking, button not found.")
  }
}

function startClicking() {
  log(getLoadMoreButton().attr("class"));
  tryClickAndReschedule();
}

function insertButton() {
  getLoadMoreButton().each(function() {
    var e = $(this);
    var button = $("<button/>")
      .addClass(myClass)
      .addClass("yt-uix-button")
      .addClass("yt-uix-button-default")
      .css("font-weight", "bolder")
      .css("display", "block")
      .css("margin", "1rem auto")
      .text("Load ALL")
      .click(function() {
        $("." + myClass).remove();
        startClicking()
      });
    e.after(button);
  });
}

insertButton();
