// ==UserScript==
// @name         LIHKG plugin
// @namespace    https://lihkg.com/
// @version      0.21
// @description  Enhanced LIHKG
// @author       MW
// @match        https://lihkg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419396/LIHKG%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/419396/LIHKG%20plugin.meta.js
// ==/UserScript==

$(document).ready(function () {
  console.log("ready");

  function set_like_color() {
    $(".i-thumb-up, .i-thumb-down").each(function () {
      var el = $(this);
      var like = parseInt(el.parent().text().trim());
      if (like > 1000) {
        $(this).parent().css({"background-color": "white", "color": "green", "font-size": "30px"});
      } else if (like > 500) {
        $(this).parent().css({"background-color": "white", "color": "#87ff95", "font-size": "20px"});
      } else if (like < -1000) {
        $(this).parent().css({"background-color": "white", "color": "red", "font-size": "30px"});
      } else if (like < -500) {
        $(this).parent().css({"background-color": "white", "color": "#ff8787", "font-size": "20px"});
      }
    });
  }

  function sort_like() {
    var list = $($("a[href*='thread']")[0]).parent().parent().parent().parent()[0]
    // https://stackoverflow.com/questions/282670/easiest-way-to-sort-dom-nodes
    var items = list.childNodes;
    var itemsArr = [];
    for (var i in items) {
      if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
        itemsArr.push(items[i]);
      }
    }

    itemsArr.sort(function (a, b) {
      var aLike = 0
      if (a.querySelector(".i-thumb-up, .i-thumb-down")) {
        aLike = parseInt(a.querySelector(".i-thumb-up, .i-thumb-down").parentElement.textContent.trim());
      }

      var bLike = 0;
      if (b.querySelector(".i-thumb-up, .i-thumb-down")) {
        bLike = parseInt(b.querySelector(".i-thumb-up, .i-thumb-down").parentElement.textContent.trim());
      }

      return aLike == bLike ? 0 : (aLike < bLike ? 1 : -1);
    });

    for (i = 0; i < itemsArr.length; ++i) {
      list.appendChild(itemsArr[i]);
    }
  }

  function forever_run() {
    setTimeout(() => {
      set_like_color();
      sort_like();
      forever_run();
    }, 1000);
  }

  forever_run()

});
