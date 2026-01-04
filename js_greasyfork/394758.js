// ==UserScript==
// @name         JueJin-post
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       maomaomao
// @match        https://juejin.im/post/*
// @downloadURL https://update.greasyfork.org/scripts/394758/JueJin-post.user.js
// @updateURL https://update.greasyfork.org/scripts/394758/JueJin-post.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function () {
  var sideBar = document.querySelector(".sidebar");
  var autherBlock = sideBar.querySelector(".author-block");
  var catalog = sideBar.querySelector(".sticky-block-box");
  var related = sideBar.querySelector(".related-entry-sidebar-block");

        autherBlock.before(catalog);
                autherBlock.after(related);

  catalog.style.position = "unset";
  catalog.style.maxHeight = "66vh";
  catalog.style.width = "300px";
  catalog.style.overflow = "scroll";

        //去广告
        sideBar.querySelector(".book-newuser").style.display = 'none';

},1000);


})();